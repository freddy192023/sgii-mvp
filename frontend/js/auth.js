const API_URL = 'http://localhost:8000';

function getToken() {
    return localStorage.getItem('access_token');
}

function isAuthenticated() {
    return !!getToken();
}

function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
    }
}

function getAuthHeaders() {
    const token = getToken();
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (isAuthenticated() && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
        return;
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ 'username': username, 'password': password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('access_token', data.access_token);

                    const userResponse = await fetch(`${API_URL}/api/auth/me`, {
                        headers: getAuthHeaders()
                    });
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        localStorage.setItem('user', JSON.stringify(userData));
                    }
                    window.location.href = 'dashboard.html';
                } else {
                    const error = await response.json();
                    alert('Error: ' + (error.detail || 'Credenciales incorrectas'));
                }
            } catch (error) {
                alert('Error al conectar con el servidor: ' + error.message);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const full_name = document.getElementById('reg-fullname').value;
            const password = document.getElementById('reg-password').value;

            try {
                const response = await fetch(`${API_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, full_name, password })
                });

                if (response.ok) {
                    alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
                    showLogin();
                } else {
                    const error = await response.json();
                    alert('Error: ' + (error.detail || 'Error al registrar'));
                }
            } catch (error) {
                alert('Error al conectar con el servidor: ' + error.message);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }

    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        userNameEl.textContent = user.full_name || user.username || 'Usuario';
    }
});