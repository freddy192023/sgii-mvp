# 📑 Manual de Funcionamiento de Ventanas — SGII Innovatech

Este documento detalla la lógica de negocio, comportamiento interactivo y conexión con el backend de cada una de las 7 vistas del ecosistema SGII.

---

## 1. 🔑 Acceso y Login (`index.html`)

**Requerimiento:** RF-008 — Autenticación y Seguridad

**Objetivo:** Controlar el acceso al sistema mediante JSON Web Tokens (JWT) y control de acceso basado en roles (RBAC).

**Cómo funciona:**
- Al enviar el formulario, el script realiza una petición `POST` a `/api/auth/login` con el usuario y contraseña codificados.
- El backend valida la contraseña (cifrada con `bcrypt`) y devuelve un **Token JWT** firmado.
- El token se guarda en `localStorage` con la clave `access_token`.
- Inmediatamente consulta `/api/auth/me` para obtener el nombre, email y rol del usuario logueado y los almacena en sesión.
- Si el usuario ya tiene sesión activa, se salta el login y redirige directo al Dashboard.

**Qué debes demostrar:**
- Ingresar con `ana.garcia` / `password123` → redirige a Dashboard.
- Ingresar credenciales incorrectas → aparece alerta controlada del backend.
- Mostrar los badges de seguridad: `JWT Seguro`, `GDPR Compliant`, `AES-256`, `2FA Activado`.

---

## 2. 📊 Dashboard en Tiempo Real (`dashboard.html`)

**Requerimiento:** RF-004 — Visualización de Dashboard

**Objetivo:** Visualizar KPIs consolidados, tendencias del negocio y estado de proyectos en tiempo real.

**Cómo funciona:**
- Al cargar, realiza peticiones en paralelo a `/api/projects/`, `/api/tasks/` y `/api/users/`.
- Calcula dinámicamente:
  - Proyectos activos (status = `active`)
  - Tareas completadas (status = `done`)
  - Tareas en progreso (status = `in_progress`)
  - Tareas atrasadas (fecha vencida y no completadas)
  - Miembros activos del equipo
- Los gráficos **Chart.js** (barra, dona y línea) reciben los datos reales del backend.

**Qué debes demostrar:**
- Cambiar el filtro de tiempo ("Este trimestre", "Este año") y presionar **Actualizar**.
- Los gráficos se regeneran con datos actualizados de la base de datos.
- La sección **Progreso por Proyecto** muestra las barras de avance reales.
- El **Feed de Actividad Reciente** muestra eventos del sistema.

---

## 3. 📁 Gestión de Proyectos (`projects.html`)

**Requerimiento:** RF-001 — Gestión de Proyectos

**Objetivo:** Administrar el ciclo de vida completo de los proyectos desde creación hasta cierre.

**Cómo funciona:**
- Lista proyectos desde `/api/projects/` (solo los del usuario autenticado).
- **Crear:** Modal con formulario → `POST /api/projects/` → aparece en la lista.
- **Editar:** Precarga los datos del proyecto en el modal → `PUT /api/projects/{id}`.
- **Eliminar:** Confirmación → `DELETE /api/projects/{id}` → se remueve de la lista.
- Los filtros de búsqueda y estado filtran el arreglo en memoria (sin nueva petición al servidor).

**Qué debes demostrar:**
- Crear un proyecto nuevo → aparece inmediatamente en la lista con su barra de progreso.
- Editar el estado de un proyecto (Planificación → Activo) → cambia la etiqueta de color.
- Usar el buscador para filtrar proyectos por nombre.

---

## 4. ✅ Gestión de Tareas (`tasks.html`)

**Requerimiento:** RF-002 — Gestión de Tareas

**Objetivo:** Controlar y dar seguimiento al trabajo diario del equipo con visibilidad del estado de avance.

**Cómo funciona:**
- Carga tareas desde `/api/tasks/` y proyectos desde `/api/projects/` para los selectores.
- Carga miembros del equipo desde `/api/users/` para asignar responsables reales.
- **Vista Lista:** Muestra cada tarea con su estado, prioridad, responsable y fecha límite.
- **Vista Kanban:** Agrupa las tareas en 4 columnas (Pendiente, En Progreso, Revisión, Completada).
- **Cambio de estado rápido:** Al hacer clic en el círculo de estado de una tarea → `PUT /api/tasks/{id}` con el nuevo estado → se recarga la lista.
- **Eliminar tarea:** Ícono de papelera → `DELETE /api/tasks/{id}`.

**Qué debes demostrar:**
- Cambiar entre Vista Lista y Vista Kanban con el botón `⊞`.
- Crear una tarea nueva y asignarla a un miembro del equipo.
- Hacer clic en el checkbox de una tarea para cambiar su estado (Pendiente → En Progreso → Completada).

---

## 5. 👥 Asignación de Recursos (`resources.html`)

**Requerimiento:** RF-003 — Gestión de Recursos

**Objetivo:** Medir la capacidad del equipo en tiempo real y prevenir la sobrecarga de trabajo.

**Cómo funciona:**
- Consulta en paralelo `/api/users/` y `/api/tasks/` al cargar la página.
- Calcula dinámicamente la carga de trabajo de cada persona:
  - Cada tarea activa (no completada) asignada = +25% de capacidad (máximo 100%).
- Aplica colores condicionales a las barras de progreso:
  - 🟢 **Verde** (< 50%): Disponible
  - 🟡 **Amarillo** (50%–79%): Ocupado
  - 🔴 **Rojo** (≥ 80%): Sobrecargado
- Los gráficos (barra de carga + dona de distribución por proyecto) se generan con datos reales.

**Qué debes demostrar:**
- Las tarjetas de cada miembro del equipo con su porcentaje de carga calculado desde el backend.
- Filtrar por rol (Desarrollador, Gerente, etc.) con el selector de la esquina superior derecha.
- El gráfico de **Distribución por Proyecto** que muestra cuántas tareas hay en cada proyecto.

---

## 6. 💬 Comunicación y Colaboración (`communication.html`)

**Requerimiento:** RF-005 — Comunicación Interna

**Objetivo:** Centralizar las conversaciones del equipo por proyecto, eliminando la dependencia del correo.

**Cómo funciona:**
- Carga mensajes del canal activo desde `/api/messages/?channel={nombre_canal}`.
- **Enviar mensaje:** Al escribir y presionar Enter → `POST /api/messages/` → guarda en la base de datos → recarga el chat.
- **Cambio de canal:** Al hacer clic en un canal de la lista izquierda, actualiza la variable `currentChannel` y recarga los mensajes de ese canal.
- **Polling automático:** Cada **4 segundos** consulta el backend para traer mensajes nuevos, dando efecto de chat en vivo.
- Muestra el nombre del usuario remitente, sus iniciales como avatar y la hora del mensaje.

**Qué debes demostrar:**
- Cambiar entre los canales de la barra lateral y ver cómo cambia el historial de mensajes.
- Escribir y enviar un mensaje → aparece al instante al final del chat.
- El badge de notificaciones (número en rojo) en el ícono del menú lateral.

---

## 7. 🔐 Seguridad y Autenticación (`security.html`)

**Requerimiento:** RF-008 — Gestión de Roles y Auditoría

**Objetivo:** Gestionar los perfiles de acceso (RBAC) y auditar la actividad de seguridad del sistema.

**Cómo funciona:**
- Carga la lista completa de usuarios registrados desde `/api/users/`.
- **Cambio de rol:** Cada fila de la tabla tiene un selector (`<select>`) que al cambiar envía `PUT /api/users/{id}/role?role={nuevoRol}`. El backend solo permite este cambio si el usuario logueado tiene rol `admin`.
- **Crear usuario:** El formulario del modal envía `POST /api/users/` con los datos del nuevo usuario.
- La sección superior muestra las **tarjetas de roles** (Admin, Gerente, Dev, Visualizador) con la matriz de permisos de cada uno (✓ o ✗).
- El **Registro de Auditoría** muestra los últimos eventos de seguridad del sistema.

**Qué debes demostrar:**
- La tabla de usuarios cargada desde la base de datos con sus roles en colores.
- Cambiar el rol de un usuario desde el selector dinámico de cada fila.
- El botón **"+ Nuevo Usuario"** que abre el formulario de creación con campos para usuario, email, rol y contraseña temporal.
- La matrix de permisos en las tarjetas de roles (Admin tiene todo, Visualizador solo lectura).

---

## 📡 Resumen de Endpoints del Backend (API REST)

| Módulo | Método | Endpoint | Descripción |
|---|---|---|---|
| Auth | POST | `/api/auth/login` | Iniciar sesión (JWT) |
| Auth | POST | `/api/auth/register` | Registrar nuevo usuario |
| Auth | GET | `/api/auth/me` | Obtener usuario logueado |
| Proyectos | GET | `/api/projects/` | Listar proyectos |
| Proyectos | POST | `/api/projects/` | Crear proyecto |
| Proyectos | PUT | `/api/projects/{id}` | Editar proyecto |
| Proyectos | DELETE | `/api/projects/{id}` | Eliminar proyecto |
| Tareas | GET | `/api/tasks/` | Listar tareas |
| Tareas | POST | `/api/tasks/` | Crear tarea |
| Tareas | PUT | `/api/tasks/{id}` | Actualizar estado |
| Tareas | DELETE | `/api/tasks/{id}` | Eliminar tarea |
| Mensajes | GET | `/api/messages/` | Leer chat por canal |
| Mensajes | POST | `/api/messages/` | Enviar mensaje |
| Usuarios | GET | `/api/users/` | Listar equipo |
| Usuarios | POST | `/api/users/` | Crear usuario (admin) |
| Usuarios | PUT | `/api/users/{id}/role` | Cambiar rol (admin) |

---

## 🔗 URLs de Acceso Rápido

| Servicio | URL |
|---|---|
| **Aplicación Frontend** | http://localhost:3000 |
| **API Backend** | http://localhost:8000 |
| **Documentación Swagger** | http://localhost:8000/docs |
| **Documentación Redoc** | http://localhost:8000/redoc |

**Credenciales de prueba:**
- Usuario: `ana.garcia` / Contraseña: `password123` (Gerente)
- Usuario: `admin` / Contraseña: `password123` (Administrador)
