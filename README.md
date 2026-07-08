# SGII - Sistema de Gestión Integrado Innovatech

SGII es una solución empresarial para la planificación de recursos, administración de proyectos, coordinación de equipos y comunicación interna. Este sistema centralizado reemplaza los flujos de trabajo tradicionales basados en hojas de cálculo por una interfaz web moderna.

---

## Arquitectura y Tecnologías

- **Frontend**: SPA Estática con HTML5 semántico, JavaScript vanilla (ES6+) y CSS3 (Dark Mode, Glassmorphism, animaciones). Visualización de KPIs y gráficas usando **Chart.js** cargado mediante CDN. No requiere instalar Node.js ni compilar archivos.
- **Backend**: **FastAPI** (Python 3.8+), base de datos **SQLite** mediante **SQLAlchemy ORM**.
- **Autenticación**: JSON Web Tokens (JWT) con encriptación bcrypt para contraseñas y control de acceso basado en roles (RBAC).

### Descripción de Dependencias y Componentes Clave

- **`FastAPI`:** Framework del backend. Define las rutas de la API, las reglas de negocio y los esquemas de validación de datos.
- **`Uvicorn`:** Servidor web ASGI que ejecuta y levanta la API de FastAPI. Escucha las peticiones del Frontend en el puerto `8000`.
- **`SQLAlchemy`:** ORM que traduce las operaciones de Python a sentencias SQL para gestionar la base de datos `sgii.db`.
- **`python-jose`:** Genera y cifra los tokens de seguridad JWT durante la autenticación de usuarios.
- **`passlib[bcrypt]`:** Aplica hash criptográfico a las contraseñas para que nunca se guarden en texto plano.
- **`python-multipart`:** Requerido por FastAPI para procesar datos enviados desde formularios HTML (como el formulario de login).

---

## Requisitos Previos del Sistema

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Python 3.8 o superior** — descárgalo desde [python.org](https://www.python.org/).
- **Pip** — el gestor de paquetes de Python. Viene incluido por defecto al instalar Python.

Para verificar que Python y Pip están instalados, ejecuta en tu terminal:

```bash
python --version
pip --version
```

---

## Guía de Encendido Local (Paso a Paso)

Necesitas tener **dos terminales abiertas** al mismo tiempo: una para el backend y otra para el frontend.

### Terminal 1 — Iniciar el Servidor Backend (FastAPI + Uvicorn)

1. Abre una terminal y navega al directorio del backend:
   ```bash
   cd backend
   ```
2. Instala todas las dependencias necesarias (solo la primera vez):
   ```bash
   pip install -r requirements.txt
   ```
3. Inicia el servidor:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
4. Si el servidor inició correctamente, verás en la terminal el mensaje:
   ```
   INFO:     Uvicorn running on http://127.0.0.1:8000
   ```

   > **Nota:** La primera vez que el servidor se encienda, creará automáticamente el archivo `sgii.db` en la carpeta `backend/` y lo poblará con datos de demostración.

   > **Importante:** Deja esta terminal abierta mientras usas la aplicación. Si la cierras, el backend se apagará.

---

### Terminal 2 — Iniciar la Interfaz Web (Frontend)

1. Abre una segunda terminal (sin cerrar la primera) y navega al directorio del frontend:
   ```bash
   cd frontend
   ```
2. Inicia el servidor web estático de Python:
   ```bash
   python -m http.server 3000
   ```
3. Abre tu navegador web y accede a:
   ```
   http://localhost:3000
   ```

---

## Credenciales de Acceso

| Rol           | Usuario                       | Contrasena    |
|---------------|-------------------------------|---------------|
| Administrador | `admin`                       | `password123` |
| Gerente       | `ana.garcia`                  | `password123` |
| Desarrollador | `carlos.lopez`                | `password123` |
| Visualizador  | `cliente`                     | `password123` |

---

## URLs de Referencia

| Servicio                  | URL                                             |
|---------------------------|-------------------------------------------------|
| Aplicacion Frontend       | http://localhost:3000                           |
| API Backend               | http://localhost:8000                           |
| Documentacion Swagger UI  | http://localhost:8000/docs                      |
| Documentacion Redoc       | http://localhost:8000/redoc                     |
