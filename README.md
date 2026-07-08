# SGII - Sistema de Gestión Integrado Innovatech

SGII es una solución empresarial de vanguardia para la planificación de recursos, administración de proyectos, coordinación de equipos y comunicación interna. Este sistema centralizado reemplaza los flujos de trabajo tradicionales basados en hojas de cálculo por una interfaz premium basada en la nube.

---

## 🚀 Arquitectura y Tecnologías
- **Frontend**: SPA Estática con HTML5 semántico, JavaScript vanilla (ES6+) y CSS3 premium (Dark Mode, Glassmorphism, animaciones fluidas). Visualización de KPIs y tendencias usando **Chart.js** cargado dinámicamente mediante CDN. No requiere compilar archivos de Node.js.
- **Backend**: **FastAPI** (Python 3.10+), base de datos **SQLite** mediante **SQLAlchemy ORM**.

### 📦 Descripción de Dependencias y Componentes Clave:
* **`FastAPI`:** Framework de desarrollo del backend ágil y moderno. Define las rutas de la API, las reglas de negocio y los esquemas de datos.
* **`Uvicorn`:** Servidor web ASGI de alto rendimiento que ejecuta y levanta la API de FastAPI. Escucha las peticiones del Frontend en el puerto `8000` y gestiona las conexiones en tiempo real de forma asíncrona.
* **`SQLAlchemy`:** El ORM (Object-Relational Mapping) encargado de traducir las consultas de Python en sentencias SQL para gestionar la base de datos `sgii.db` sin escribir código SQL nativo.
* **`python-jose`:** Librería que cifra y genera los tokens de seguridad JWT (JSON Web Tokens) durante la autenticación de usuarios.
* **`passlib[bcrypt]`:** Componente que aplica funciones criptográficas de hash a las contraseñas, impidiendo que se guarden en texto plano dentro de la base de datos para máxima seguridad.
- **Autenticación**: JSON Web Tokens (JWT) con encriptación bcrypt para contraseñas, control de acceso basado en roles (RBAC) y cumplimiento de estándares (GDPR / HIPAA).

---

## 📋 Requisitos Previos del Sistema
Para poder ejecutar el backend y el frontend localmente en tu computadora, debes asegurearte de tener instalado el siguiente software:
* **Python 3.8 o superior** (puedes descargarlo desde su sitio oficial [python.org](https://www.python.org/)).
* **Pip** (el gestor de paquetes de Python, que viene incluido por defecto al instalar Python).

---

## 🛠️ Guía de Encendido Local (Paso a Paso)

Para levantar el ecosistema completo en tu computadora, sigue estos pasos:

### 1. Iniciar el Servidor Backend (FastAPI)
1. Abre una terminal en tu computadora.
2. Ve al directorio del backend:
   ```bash
   cd backend
   ```
3. Instala las dependencias necesarias:
   ```bash
   pip install -r requirements.txt
   ```
4. Ejecuta el servidor usando Uvicorn:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   > 💡 **Nota:** La primera vez que el servidor se encienda, creará automáticamente el archivo `sgii.db` y lo poblará con datos de demostración pre-configurados para tu presentación.

### 2. Iniciar la Interfaz Web (Frontend)
El frontend puede ser abierto directamente haciendo doble clic sobre `frontend/index.html` o servirse en un puerto local. Para servirlo localmente:
1. Abre otra terminal independiente en la raíz del proyecto.
2. Ingresa al directorio del frontend:
   ```bash
   cd frontend
   ```
3. Levanta un servidor web estático con Python:
   ```bash
   python -m http.server 3000
   ```

### 3. Enlaces de Acceso
- 🌐 **Aplicación Frontend (Local)**: [http://localhost:3000](http://localhost:3000)
- 👤 **Credenciales de Acceso (Cuenta demo gerente)**:
  - **Usuario**: `ana.garcia`
  - **Contraseña**: `password123`
- 📑 **Documentación de la API (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- 📑 **Documentación alternativa (Redoc)**: [http://localhost:8000/redoc](http://localhost:8000/redoc)


