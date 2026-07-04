from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .routes import auth, projects, tasks, messages, users
from .models import User, Project, Task, Message
from .auth import get_password_hash

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SGII - Sistema de Gestión Integrado Innovatech",
    description="API para la gestión de proyectos de Innovatech Solutions",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(messages.router)
app.include_router(users.router)

# Data Seeding
@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    try:
        # Verificar si ya existen usuarios
        if db.query(User).count() == 0:
            print("Seeding demo database...")
            # 1. Crear usuarios
            hashed_pw = get_password_hash("password123")
            demo_users = [
                User(username="admin", email="admin@innovatech.com", full_name="Administrador Sistema", role="admin", hashed_password=hashed_pw),
                User(username="ana.garcia", email="ana.garcia@innovatech.com", full_name="Ana García", role="manager", hashed_password=hashed_pw),
                User(username="carlos.lopez", email="carlos.lopez@innovatech.com", full_name="Carlos López", role="dev", hashed_password=hashed_pw),
                User(username="maria.torres", email="maria.torres@innovatech.com", full_name="María Torres", role="dev", hashed_password=hashed_pw),
                User(username="pedro.ruiz", email="pedro.ruiz@innovatech.com", full_name="Pedro Ruiz", role="manager", hashed_password=hashed_pw),
                User(username="laura.soto", email="laura.soto@innovatech.com", full_name="Laura Soto", role="dev", hashed_password=hashed_pw),
                User(username="diego.mora", email="diego.mora@innovatech.com", full_name="Diego Mora", role="dev", hashed_password=hashed_pw),
            ]
            for u in demo_users:
                db.add(u)
            db.commit()
            for u in demo_users:
                db.refresh(u)

            # Mapear IDs
            users_map = {u.username: u for u in demo_users}

            # 2. Crear proyectos
            p1 = Project(name="Sistema ERP Corporativo", description="Implementación del módulo financiero y RRHH", status="active", progress=68, owner_id=users_map["ana.garcia"].id)
            p2 = Project(name="App Móvil Clientes v2.0", description="Rediseño y nuevas funcionalidades de la app", status="active", progress=45, owner_id=users_map["carlos.lopez"].id)
            p3 = Project(name="Migración Base de Datos", description="Migración de Oracle a PostgreSQL en producción", status="planning", progress=12, owner_id=users_map["maria.torres"].id)
            p4 = Project(name="Portal Web Institucional", description="Nuevo sitio web institucional con CMS", status="completed", progress=100, owner_id=users_map["pedro.ruiz"].id)
            
            db.add_all([p1, p2, p3, p4])
            db.commit()
            db.refresh(p1)
            db.refresh(p2)
            db.refresh(p3)

            # 3. Crear tareas
            t1 = Task(title="Diseño de arquitectura del sistema", description="Definir componentes y flujos principales", status="done", priority="high", project_id=p1.id, assignee_id=users_map["ana.garcia"].id)
            t2 = Task(title="Implementación módulo de autenticación", description="JWT + refresh tokens + 2FA", status="done", priority="high", project_id=p1.id, assignee_id=users_map["carlos.lopez"].id)
            t3 = Task(title="API REST de gestión de usuarios", description="CRUD completo con validaciones", status="in_progress", priority="high", project_id=p1.id, assignee_id=users_map["maria.torres"].id)
            t4 = Task(title="Integración con módulo financiero", description="Conectar con el ERP legacy", status="in_progress", priority="medium", project_id=p1.id, assignee_id=users_map["pedro.ruiz"].id)
            t5 = Task(title="Pruebas de rendimiento y carga", description="Load testing con 1000 usuarios concurrentes", status="pending", priority="medium", project_id=p1.id, assignee_id=users_map["laura.soto"].id)
            
            db.add_all([t1, t2, t3, t4, t5])
            db.commit()

            # 4. Mensajes del chat
            m1 = Message(channel="general", content="Buenos días equipo 👋 Recordatorio: el sprint review es hoy a las 15:00.", sender_id=users_map["ana.garcia"].id)
            m2 = Message(channel="general", content="Confirmado, ya tengo lista la demo del módulo de autenticación.", sender_id=users_map["carlos.lopez"].id)
            m3 = Message(channel="general", content="El pipeline de CI/CD ya está configurado.", sender_id=users_map["diego.mora"].id)
            
            db.add_all([m1, m2, m3])
            db.commit()
            print("Database seeding completed.")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "message": "Bienvenido a la API de SGII - Innovatech Solutions",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "sgii-api"}