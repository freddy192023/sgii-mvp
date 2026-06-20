# 📋 SGII - Sistema de Gestión Integrado Innovatech

Sistema web para la gestión de proyectos de Innovatech Solutions. Cuenta con autenticación de usuarios y un CRUD completo de proyectos.

---

## 🗂️ Estructura del Proyecto

```
sgii-mvp/
├── backend/          # API REST con FastAPI (Python)
│   ├── app/
│   │   ├── main.py
│   │   ├── auth.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   └── routes/
│   │       ├── auth.py
│   │       └── projects.py
│   └── requirements.txt
└── frontend/         # Interfaz web con HTML, CSS y JavaScript
    ├── index.html        (Login)
    ├── dashboard.html    (Panel principal)
    ├── projects.html     (Gestión de proyectos)
    ├── css/
    │   └── style.css
    └── js/
        ├── auth.js
        └── projects.js
```

---

## ⚙️ Requisitos previos

Antes de empezar, asegúrate de tener instalado:

- [Python 3.10+](https://www.python.org/downloads/)
- Un navegador web moderno (Chrome, Firefox, Edge)

---

## 🚀 Cómo encender el Backend

### 1. Entra a la carpeta del backend

```bash
cd backend
```

### 2. (Recomendado) Crea un entorno virtual

```bash
python -m venv venv
```

Actívalo:

- **Windows:**
  ```bash
  venv\Scripts\activate
  ```
- **Mac / Linux:**
  ```bash
  source venv/bin/activate
  ```

### 3. Instala las dependencias

```bash
pip install -r requirements.txt
```

### 4. Enciende el servidor

```bash
uvicorn app.main:app --reload --port 8000
```

✅ El backend estará corriendo en: **http://localhost:8000**

📄 Documentación de la API (Swagger): **http://localhost:8000/docs**

---

## 🌐 Cómo encender el Frontend

El frontend son archivos HTML estáticos. Solo necesitas un servidor HTTP simple.

### Opción 1 — Con Python (recomendado)

Abre una **nueva terminal**, entra a la carpeta del frontend y ejecuta:

```bash
cd frontend
python -m http.server 3000
```

✅ El frontend estará disponible en: **http://localhost:3000**

### Opción 2 — Con VS Code

Instala la extensión **Live Server** y haz clic derecho sobre `index.html` → **Open with Live Server**.

---

## 🔐 Primer uso

1. Abre **http://localhost:3000** en el navegador
2. Regístrate con un usuario nuevo
3. Inicia sesión con tus credenciales
4. ¡Comienza a gestionar tus proyectos!

---

## 📡 Endpoints principales de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Registrar nuevo usuario |
| `POST` | `/api/auth/login` | Iniciar sesión |
| `GET` | `/api/auth/me` | Datos del usuario actual |
| `GET` | `/api/projects/` | Listar proyectos |
| `POST` | `/api/projects/` | Crear proyecto |
| `PUT` | `/api/projects/{id}` | Editar proyecto |
| `DELETE` | `/api/projects/{id}` | Eliminar proyecto |

---

## 🛠️ Tecnologías utilizadas

**Backend:**
- [FastAPI](https://fastapi.tiangolo.com/) — Framework web
- [SQLAlchemy](https://www.sqlalchemy.org/) — ORM para base de datos
- [SQLite](https://www.sqlite.org/) — Base de datos
- [JWT](https://jwt.io/) — Autenticación con tokens
- [Uvicorn](https://www.uvicorn.org/) — Servidor ASGI

**Frontend:**
- HTML5, CSS3, JavaScript puro
- Comunicación con la API mediante `fetch`

---

> Proyecto desarrollado por **Innovatech Solutions** 🚀
