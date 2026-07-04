// ===== CONFIGURACIÓN API =====
const API_BASE = 'http://localhost:8000/api';
let DEMO_MODE = false; // Intenta conectar a la API. Si falla o no hay token, se puede usar demo fallback.

const DEMO_PROJECTS = [
    { id: 1, name: 'Sistema ERP Corporativo', description: 'Implementación del módulo financiero y RRHH', status: 'active', start_date: '2026-01-15', end_date: '2026-08-30', progress: 68, owner: 'Ana García', owner_id: 2 },
    { id: 2, name: 'App Móvil Clientes v2.0', description: 'Rediseño y nuevas funcionalidades de la app', status: 'active', start_date: '2026-02-01', end_date: '2026-07-15', progress: 45, owner: 'Carlos López', owner_id: 3 },
    { id: 3, name: 'Migración Base de Datos', description: 'Migración de Oracle a PostgreSQL en producción', status: 'planning', start_date: '2026-05-01', end_date: '2026-09-30', progress: 12, owner: 'María Torres', owner_id: 4 },
    { id: 4, name: 'Portal Web Institucional', description: 'Nuevo sitio web institucional con CMS', status: 'completed', start_date: '2025-10-01', end_date: '2026-03-31', progress: 100, owner: 'Pedro Ruiz', owner_id: 5 }
];

const DEMO_TASKS = [
    { id: 1, project_id: 1, title: 'Diseño de arquitectura del sistema', description: 'Definir componentes y flujos principales', status: 'done', priority: 'high', assignee: 'Ana García', assignee_id: 2, assignee_color: '#6366f1', due_date: '2026-02-28' },
    { id: 2, project_id: 1, title: 'Implementación módulo de autenticación', description: 'JWT + refresh tokens + 2FA', status: 'done', priority: 'high', assignee: 'Carlos López', assignee_id: 3, assignee_color: '#06b6d4', due_date: '2026-03-15' },
    { id: 3, project_id: 1, title: 'API REST de gestión de usuarios', description: 'CRUD completo con validaciones', status: 'in_progress', priority: 'high', assignee: 'María Torres', assignee_id: 4, assignee_color: '#10b981', due_date: '2026-07-05' },
    { id: 4, project_id: 1, title: 'Integración con módulo financiero', description: 'Conectar con el ERP legacy', status: 'in_progress', priority: 'medium', assignee: 'Pedro Ruiz', assignee_id: 5, assignee_color: '#f59e0b', due_date: '2026-07-20' },
    { id: 5, project_id: 1, title: 'Pruebas de rendimiento y carga', description: 'Load testing con 1000 usuarios concurrentes', status: 'pending', priority: 'medium', assignee: 'Laura Soto', assignee_id: 6, assignee_color: '#ef4444', due_date: '2026-08-01' }
];

const DEMO_MESSAGES = [
    { user: 'Ana García', initials: 'AG', color: '#6366f1', time: '09:14', text: 'Buenos días equipo 👋 Recordatorio: el sprint review es hoy a las 15:00.' },
    { user: 'Carlos López', initials: 'CL', color: '#06b6d4', time: '09:18', text: '<span class="mention">@Ana García</span> Confirmado, ya tengo lista la demo del módulo de autenticación.' },
    { user: 'Diego Mora', initials: 'DM', color: '#8b5cf6', time: '10:02', text: 'El pipeline de CI/CD ya está configurado. Los builds se ejecutan automáticamente.' }
];

const DEMO_USERS = [
    { id: 1, name: 'Admin Sistema', email: 'admin@innovatech.com', role: 'admin', last_login: '2026-06-29 09:14', status: 'active', initials: 'AS', color: '#ef4444' },
    { id: 2, name: 'Ana García', email: 'ana.garcia@innovatech.com', role: 'manager', last_login: '2026-06-29 09:10', status: 'active', initials: 'AG', color: '#6366f1' },
    { id: 3, name: 'Carlos López', email: 'carlos.lopez@innovatech.com', role: 'dev', last_login: '2026-06-29 08:55', status: 'active', initials: 'CL', color: '#06b6d4' },
    { id: 4, name: 'María Torres', email: 'maria.torres@innovatech.com', role: 'dev', last_login: '2026-06-28 17:30', status: 'active', initials: 'MT', color: '#10b981' },
    { id: 5, name: 'Pedro Ruiz', email: 'pedro.ruiz@innovatech.com', role: 'manager', last_login: '2026-06-29 07:45', status: 'active', initials: 'PR', color: '#f59e0b' }
];

// ===== AUTH HELPERS =====
function requireAuth() {
    const token = localStorage.getItem('access_token');
    if (!token && !DEMO_MODE) {
        // Redirigir a login si no hay token
        window.location.href = 'index.html';
    }
}

function getAuthHeaders() {
    const token = localStorage.getItem('access_token') || 'demo-token';
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

// ===== API REQUEST GENÉRICA =====
async function apiRequest(path, options = {}) {
    if (DEMO_MODE) return null; // Utilizar datos estáticos localmente
    try {
        const url = `${API_BASE}${path}`;
        const headers = { ...getAuthHeaders(), ...options.headers };
        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) {
            localStorage.removeItem('access_token');
            window.location.href = 'index.html';
            return null;
        }
        if (response.status === 204) return true;
        if (response.ok) return await response.json();
    } catch (e) {
        console.warn(`Error llamando a la API en ${path}, utilizando fallback estático.`, e);
        // Si el backend no está corriendo, podemos activar DEMO_MODE temporalmente en esta sesión
        DEMO_MODE = true; 
    }
    return null;
}

// ===== NAVIGATION BUILDERS =====
function buildSidebar(activePage) {
    const pages = [
        { href: 'dashboard.html', icon: '📊', label: 'Dashboard', id: 'dashboard' },
        { href: 'projects.html', icon: '📁', label: 'Proyectos', id: 'projects' },
        { href: 'tasks.html', icon: '✅', label: 'Tareas', id: 'tasks', badge: '5' },
        { href: 'resources.html', icon: '👥', label: 'Recursos', id: 'resources' },
        { href: 'communication.html', icon: '💬', label: 'Comunicación', id: 'communication', badge: '3' },
        { href: 'security.html', icon: '🔐', label: 'Seguridad', id: 'security' }
    ];

    const user = JSON.parse(localStorage.getItem('user') || '{"full_name":"Ana García","role":"manager"}');
    const initials = user.full_name ? user.full_name.split(' ').map(n=>n[0]).join('').toUpperCase() : 'AG';

    return `
    <aside class="sidebar">
        <div class="sidebar-brand">
            <div class="brand-icon">🚀</div>
            <div class="brand-text">
                <h2>SGII</h2>
                <span>Innovatech Solutions</span>
            </div>
        </div>
        <nav class="sidebar-nav">
            <p class="nav-section-title">Principal</p>
            ${pages.map(p => `
            <a href="${p.href}" class="nav-item ${activePage === p.id ? 'active' : ''}">
                <span class="nav-icon">${p.icon}</span>
                ${p.label}
                ${p.badge ? `<span class="nav-badge">${p.badge}</span>` : ''}
            </a>`).join('')}
            <p class="nav-section-title">Cuenta</p>
            <a href="#" class="nav-item" id="logoutSidebarBtn" onclick="logout(); return false;">
                <span class="nav-icon">🚪</span> Cerrar Sesión
            </a>
        </nav>
        <div class="sidebar-footer">
            <div class="user-avatar-section">
                <div class="avatar" style="background:#6366f1;">${initials}</div>
                <div class="user-info-mini">
                    <span>${escapeHtml(user.full_name || user.username)}</span>
                    <small style="text-transform: capitalize;">${user.role || 'Rol'}</small>
                </div>
            </div>
        </div>
    </aside>`;
}

function buildTopbar(title, subtitle = '') {
    const user = JSON.parse(localStorage.getItem('user') || '{"full_name":"Ana García"}');
    const initials = user.full_name ? user.full_name.split(' ').map(n=>n[0]).join('').toUpperCase() : 'AG';
    return `
    <div class="topbar">
        <div class="topbar-title">
            <h1>${title}</h1>
            ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
        <div class="topbar-actions">
            <div class="notif-btn" title="Notificaciones">🔔<span class="notif-dot"></span></div>
            <div class="avatar" style="cursor:pointer;" title="Mi perfil">${initials}</div>
        </div>
    </div>`;
}

function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// ===== UTILS =====
function getStatusLabel(status) {
    const labels = { 'planning': 'Planificación', 'active': 'Activo', 'completed': 'Completado', 'cancelled': 'Cancelado', 'pending': 'Pendiente', 'in_progress': 'En Progreso', 'review': 'En Revisión', 'done': 'Completada' };
    return labels[status] || status;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}
