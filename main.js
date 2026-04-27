document.addEventListener('DOMContentLoaded', () => {
    // Handle Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple visual feedback
            const btn = loginForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner"></span> Cargando...';
            btn.disabled = true;

            try {
                // Using Fetch API to simulate a login request
                const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                    method: 'POST',
                    body: JSON.stringify({
                        username: email,
                        password: password
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('API Response:', data);

                    // Admin Detection
                    if (email === 'admin@lumina.com') {
                        alert('¡Bienvenido, Administrador!');
                        window.location.href = 'admin.html';
                        return;
                    }

                    alert('¡Inicio de sesión exitoso! (Simulado mediante API)');
                } else {
                    throw new Error('Error en el inicio de sesión');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error al conectar con el servidor.');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // Handle Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            
            // Simple visual feedback
            const btn = registerForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner"></span> Creando cuenta...';
            btn.disabled = true;

            try {
                // Using Fetch API to simulate a registration request
                const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: fullname,
                        email: email
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('API Response:', data);
                    alert('¡Cuenta creada con éxito! Bienvenido, ' + fullname + ' (Simulado mediante API)');
                    window.location.href = 'index.html';
                } else {
                    throw new Error('Error al crear la cuenta');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error al procesar tu registro.');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // Input focus effects (optional enhancement)
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('is-focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('is-focused');
        });
    });
});
