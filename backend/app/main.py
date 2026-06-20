from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import auth, projects

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

app.include_router(auth.router)
app.include_router(projects.router)

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