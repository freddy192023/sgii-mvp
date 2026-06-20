const API_URL_PROJECTS = 'http://localhost:8000';
let editingProjectId = null;

async function loadProjects() {
    try {
        const response = await fetch(`${API_URL_PROJECTS}/api/projects/`, {
            headers: getAuthHeaders()
        });

        if (response.status === 401) {
            window.location.href = 'index.html';
            return [];
        }

        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Error cargando proyectos:', error);
    }
    return [];
}

function getStatusLabel(status) {
    const labels = {
        'planning': 'Planificación',
        'active': 'Activo',
        'completed': 'Completado',
        'cancelled': 'Cancelado'
    };
    return labels[status] || status;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderProjectItem(project) {
    return `
        <div class="project-item">
            <div class="project-info">
                <h3>${escapeHtml(project.name)}</h3>
                <p>${escapeHtml(project.description || 'Sin descripción')}</p>
            </div>
            <div class="project-meta">
                <span class="status-badge status-${project.status}">
                    ${getStatusLabel(project.status)}
                </span>
                <button class="btn-edit" onclick="editProject(${project.id})" title="Editar proyecto">
                    ✏️ Editar
                </button>
                <button class="btn-delete" onclick="deleteProject(${project.id})" title="Eliminar proyecto">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `;
}

async function editProject(id) {
    try {
        const response = await fetch(`${API_URL_PROJECTS}/api/projects/${id}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            alert('Error al cargar el proyecto.');
            return;
        }

        const project = await response.json();
        editingProjectId = id;

        // Pre-fill the form
        document.getElementById('projectName').value = project.name || '';
        document.getElementById('projectDescription').value = project.description || '';
        document.getElementById('projectStartDate').value = project.start_date ? project.start_date.split('T')[0] : '';
        document.getElementById('projectEndDate').value = project.end_date ? project.end_date.split('T')[0] : '';
        document.getElementById('projectStatus').value = project.status || 'planning';

        // Update modal title and button
        const modalTitle = document.querySelector('#projectModal .modal-content h2');
        const submitBtn = document.querySelector('#projectForm .btn-primary');
        if (modalTitle) modalTitle.textContent = 'Editar Proyecto';
        if (submitBtn) submitBtn.textContent = 'Guardar Cambios';

        // Show modal
        document.getElementById('projectModal').style.display = 'flex';
    } catch (error) {
        alert('Error al cargar proyecto: ' + error.message);
    }
}

async function deleteProject(id) {
    if (!confirm('¿Estás seguro de eliminar este proyecto? Esta acción no se puede deshacer.')) return;

    try {
        const response = await fetch(`${API_URL_PROJECTS}/api/projects/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            alert('Proyecto eliminado exitosamente.');
            location.reload();
        } else {
            const error = await response.json();
            alert('Error: ' + (error.detail || 'No se pudo eliminar el proyecto'));
        }
    } catch (error) {
        alert('Error al eliminar: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    requireAuth();

    // ===== DASHBOARD =====
    const activeEl = document.getElementById('activeProjects');
    if (activeEl) {
        const projects = await loadProjects();
        document.getElementById('totalProjects').textContent = projects.length;
        document.getElementById('activeProjects').textContent = projects.filter(p => p.status === 'active').length;
        document.getElementById('completedProjects').textContent = projects.filter(p => p.status === 'completed').length;
        document.getElementById('planningProjects').textContent = projects.filter(p => p.status === 'planning').length;

        const recentList = document.getElementById('recentProjectsList');
        if (projects.length === 0) {
            recentList.innerHTML = '<p>No tienes proyectos aún. <a href="projects.html">Crea uno aquí</a></p>';
        } else {
            recentList.innerHTML = projects.slice(0, 5).map(renderProjectItem).join('');
        }
    }

    // ===== PROJECTS PAGE =====
    const projectsList = document.getElementById('projectsList');
    if (projectsList) {
        const projects = await loadProjects();
        if (projects.length === 0) {
            projectsList.innerHTML = '<p>No tienes proyectos aún. Crea uno con el botón de arriba.</p>';
        } else {
            projectsList.innerHTML = projects.map(renderProjectItem).join('');
        }
    }

    // Modal
    const modal = document.getElementById('projectModal');
    const createBtn = document.getElementById('createProjectBtn');
    const closeBtn = document.querySelector('.close');

    function resetModal() {
        editingProjectId = null;
        document.getElementById('projectForm').reset();
        const modalTitle = document.querySelector('#projectModal .modal-content h2');
        const submitBtn = document.querySelector('#projectForm .btn-primary');
        if (modalTitle) modalTitle.textContent = 'Crear Nuevo Proyecto';
        if (submitBtn) submitBtn.textContent = 'Crear Proyecto';
    }

    if (createBtn) {
        createBtn.addEventListener('click', () => {
            resetModal();
            modal.style.display = 'flex';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            resetModal();
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            resetModal();
        }
    });

    // Formulario crear proyecto
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const projectData = {
                name: document.getElementById('projectName').value,
                description: document.getElementById('projectDescription').value,
                start_date: document.getElementById('projectStartDate').value || null,
                end_date: document.getElementById('projectEndDate').value || null,
                status: document.getElementById('projectStatus').value
            };

            const isEditing = editingProjectId !== null;
            const url = isEditing
                ? `${API_URL_PROJECTS}/api/projects/${editingProjectId}`
                : `${API_URL_PROJECTS}/api/projects/`;
            const method = isEditing ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: getAuthHeaders(),
                    body: JSON.stringify(projectData)
                });

                if (response.ok) {
                    alert(isEditing ? 'Proyecto actualizado exitosamente.' : 'Proyecto creado exitosamente.');
                    modal.style.display = 'none';
                    resetModal();
                    location.reload();
                } else {
                    const error = await response.json();
                    alert('Error: ' + (error.detail || (isEditing ? 'Error al actualizar' : 'Error al crear proyecto')));
                }
            } catch (error) {
                alert('Error al conectar con el servidor: ' + error.message);
            }
        });
    }
});