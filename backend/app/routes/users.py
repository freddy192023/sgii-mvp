from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import User
from ..schemas import UserResponse, UserCreate
from ..auth import get_current_user, get_password_hash

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/", response_model=List[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Retorna todos los usuarios (Directorio de equipo)
    return db.query(User).all()

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user_by_admin(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Solo administradores o gerentes pueden crear usuarios
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operación no permitida para este rol"
        )
        
    db_user = db.query(User).filter(
        (User.username == user_data.username) | 
        (User.email == user_data.email)
    ).first()
    
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="El nombre de usuario o email ya está registrado"
        )
        
    hashed_pw = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        full_name=user_data.full_name,
        role=user_data.role or "dev",
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.put("/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo administradores pueden cambiar roles"
        )
        
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
    if role not in ["admin", "manager", "dev", "viewer"]:
        raise HTTPException(status_code=400, detail="Rol inválido")
        
    db_user.role = role
    db.commit()
    db.refresh(db_user)
    return db_user
