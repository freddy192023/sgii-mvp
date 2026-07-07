from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import User, Project
from ..schemas import ProjectCreate, ProjectUpdate, ProjectResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("/", response_model=List[ProjectResponse])
def get_projects(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Los administradores y gerentes ven todos los proyectos.
    # Para la demo, permitimos que los desarrolladores y visualizadores también vean todos los proyectos (transparencia y selección de tareas)
    if current_user.role in ["admin", "manager", "dev", "viewer"]:
        projects = db.query(Project).offset(skip).limit(limit).all()
    else:
        projects = db.query(Project).filter(Project.owner_id == current_user.id).offset(skip).limit(limit).all()
    return projects

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_project = Project(
        **project.model_dump(),
        owner_id=current_user.id
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    # Restricción: Los devs/viewers solo leen, managers/admins administran todo.
    if current_user.role not in ["admin", "manager", "dev", "viewer"] and project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes acceso a este proyecto")
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
        
    # Validar permisos de edición (admin, manager, o dueño del proyecto)
    if current_user.role not in ["admin", "manager"] and project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes permisos para modificar este proyecto")
    
    for key, value in project_update.model_dump(exclude_unset=True).items():
        setattr(project, key, value)
    
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
        
    # Validar permisos de eliminación (solo admin, manager, o dueño del proyecto)
    if current_user.role not in ["admin", "manager"] and project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes permisos para eliminar este proyecto")
    
    db.delete(project)
    db.commit()
    return None