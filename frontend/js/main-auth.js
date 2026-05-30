document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = '';

    function saveSession(user, provider) {
        sessionStorage.setItem('codont_user', JSON.stringify(user));
        sessionStorage.setItem('codont_auth', provider || 'email');
    }

    function redirectAfterLogin(user) {
        if (user.role === 'admin') {
            window.location.href = 'admin.html';
            return;
        }
        window.location.href = 'mis_citas_portal_paciente.html';
    }

    function getRecaptchaToken() {
        if (window.CodontRecaptcha) {
            return CodontRecaptcha.requireResponse();
        }
        return '';
    }

    function onAuthError() {
        if (window.CodontRecaptcha) CodontRecaptcha.reset();
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            const btn = loginForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Cargando...';
            btn.disabled = true;

            try {
                const recaptchaToken = getRecaptchaToken();
                const response = await fetch(`${API_BASE}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: email, password, recaptchaToken })
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Error en el inicio de sesión');
                }

                saveSession(data.user, 'email');
                redirectAfterLogin(data.user);
            } catch (error) {
                console.error('Error:', error);
                alert(error.message || 'Hubo un error al conectar con el servidor.');
                onAuthError();
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;

            const btn = registerForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Creando cuenta...';
            btn.disabled = true;

            try {
                const recaptchaToken = getRecaptchaToken();
                const response = await fetch(`${API_BASE}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: fullname, email, recaptchaToken })
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Error al crear la cuenta');
                }

                alert('¡Cuenta creada con éxito! Bienvenido, ' + fullname);
                window.location.href = 'inicio_de_sesion.html';
            } catch (error) {
                console.error('Error:', error);
                alert(error.message || 'Hubo un error al procesar tu registro.');
                onAuthError();
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('is-focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('is-focused');
        });
    });
});
