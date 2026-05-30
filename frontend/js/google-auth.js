/**
 * Google Sign-In: credencial real (GIS) o modo demo si no hay Client ID.
 */
(function () {
    const API_BASE = '';

    function saveSession(user, provider) {
        sessionStorage.setItem('codont_user', JSON.stringify(user));
        sessionStorage.setItem('codont_auth', provider || 'google');
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

    async function sendCredentialToBackend(credential, recaptchaToken) {
        const response = await fetch(`${API_BASE}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential, recaptchaToken })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'No se pudo autenticar con Google');
        return data;
    }

    async function sendDemoLogin(email, name, recaptchaToken) {
        const response = await fetch(`${API_BASE}/api/auth/google/demo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, recaptchaToken })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error en login demo');
        return data;
    }

    window.handleGoogleCredential = async function (response) {
        const container = document.getElementById('googleSignInContainer');
        try {
            const recaptchaToken = getRecaptchaToken();
            if (container) container.setAttribute('aria-busy', 'true');
            const result = await sendCredentialToBackend(response.credential, recaptchaToken);
            saveSession(result.user, 'google');
            redirectAfterLogin(result.user);
        } catch (err) {
            console.error(err);
            alert(err.message || 'Error al iniciar sesión con Google.');
            if (window.CodontRecaptcha) CodontRecaptcha.reset();
        } finally {
            if (container) container.removeAttribute('aria-busy');
        }
    };

    function ensureDemoModal() {
        let modal = document.getElementById('googleDemoModal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'googleDemoModal';
        modal.className = 'google-demo-modal hidden';
        modal.innerHTML = `
            <div class="google-demo-backdrop" data-close="1"></div>
            <div class="google-demo-card" role="dialog" aria-labelledby="googleDemoTitle">
                <div class="google-demo-header">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="24" height="24" alt="">
                    <span id="googleDemoTitle">Iniciar sesión con Google</span>
                    <button type="button" class="google-demo-close" data-close="1" aria-label="Cerrar">&times;</button>
                </div>
                <p class="google-demo-sub">Modo demostración — elige una cuenta de prueba:</p>
                <button type="button" class="google-demo-account" data-email="paciente.demo@gmail.com" data-name="María Paciente">
                    <span class="google-demo-avatar">M</span>
                    <span><strong>María Paciente</strong><small>paciente.demo@gmail.com</small></span>
                </button>
                <button type="button" class="google-demo-account" data-email="admin@lumina.com" data-name="Admin Clínica">
                    <span class="google-demo-avatar admin">A</span>
                    <span><strong>Admin Clínica</strong><small>admin@lumina.com</small></span>
                </button>
                <p class="google-demo-foot">
                    ¿Quieres Google real? <a href="configurar-google.html">Configurar Client ID</a>
                </p>
            </div>
        `;
        document.body.appendChild(modal);

        if (!document.getElementById('google-demo-styles')) {
            const style = document.createElement('style');
            style.id = 'google-demo-styles';
            style.textContent = `
                .google-demo-modal { position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center; padding:16px; }
                .google-demo-modal.hidden { display:none; }
                .google-demo-backdrop { position:absolute; inset:0; background:rgba(0,0,0,.45); }
                .google-demo-card { position:relative; background:#fff; border-radius:12px; width:100%; max-width:400px; padding:24px; box-shadow:0 8px 30px rgba(0,0,0,.2); font-family:Inter,system-ui,sans-serif; }
                .google-demo-header { display:flex; align-items:center; gap:10px; margin-bottom:8px; font-size:1.1rem; font-weight:600; color:#1f1f1f; }
                .google-demo-close { margin-left:auto; border:none; background:none; font-size:1.5rem; cursor:pointer; color:#5f6368; line-height:1; }
                .google-demo-sub { color:#5f6368; font-size:.875rem; margin:0 0 16px; }
                .google-demo-account { display:flex; align-items:center; gap:12px; width:100%; padding:12px; border:1px solid #dadce0; border-radius:8px; background:#fff; cursor:pointer; margin-bottom:10px; text-align:left; transition:background .15s; }
                .google-demo-account:hover { background:#f8f9fa; }
                .google-demo-account span { display:flex; flex-direction:column; }
                .google-demo-account small { color:#5f6368; font-size:.8rem; }
                .google-demo-avatar { width:40px; height:40px; border-radius:50%; background:#1a73e8; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; flex-shrink:0; }
                .google-demo-avatar.admin { background:#006194; }
                .google-demo-foot { margin-top:16px; font-size:.75rem; color:#5f6368; text-align:center; }
                .google-demo-foot a { color:#1a73e8; }
                .btn-google-demo { display:inline-flex; align-items:center; justify-content:center; gap:12px; width:100%; max-width:320px; padding:12px 24px; border:1px solid #dadce0; border-radius:9999px; background:#fff; color:#1f1f1f; font-family:Roboto,Inter,sans-serif; font-size:14px; font-weight:500; cursor:pointer; transition:background .15s,box-shadow .15s; }
                .btn-google-demo:hover { background:#f8f9fa; box-shadow:0 1px 3px rgba(0,0,0,.1); }
                .btn-google-demo img { width:20px; height:20px; }
            `;
            document.head.appendChild(style);
        }

        modal.querySelectorAll('[data-close]').forEach((el) => {
            el.addEventListener('click', () => modal.classList.add('hidden'));
        });

        modal.querySelectorAll('.google-demo-account').forEach((btn) => {
            btn.addEventListener('click', async () => {
                const email = btn.dataset.email;
                const name = btn.dataset.name;
                try {
                    const recaptchaToken = getRecaptchaToken();
                    const result = await sendDemoLogin(email, name, recaptchaToken);
                    saveSession(result.user, 'google-demo');
                    redirectAfterLogin(result.user);
                } catch (err) {
                    alert(err.message);
                    if (window.CodontRecaptcha) CodontRecaptcha.reset();
                }
            });
        });

        return modal;
    }

    function renderDemoButton() {
        const container = document.getElementById('googleSignInContainer');
        const notice = document.getElementById('googleConfigNotice');
        if (!container) return;

        if (notice) notice.classList.add('hidden');
        container.innerHTML = '';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-google-demo';
        btn.innerHTML = `
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="">
            Continuar con Google
        `;
        btn.addEventListener('click', () => {
            try {
                getRecaptchaToken();
                ensureDemoModal().classList.remove('hidden');
            } catch (err) {
                alert(err.message);
            }
        });
        container.appendChild(btn);
    }

    function renderGoogleButton(clientId) {
        const container = document.getElementById('googleSignInContainer');
        const notice = document.getElementById('googleConfigNotice');
        if (!container || !window.google?.accounts?.id) return;

        if (notice) notice.classList.add('hidden');
        container.innerHTML = '';

        google.accounts.id.initialize({
            client_id: clientId,
            callback: window.handleGoogleCredential,
            auto_select: false,
            cancel_on_tap_outside: true,
            locale: 'es'
        });

        google.accounts.id.renderButton(container, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'pill',
            logo_alignment: 'left',
            width: Math.min(container.offsetWidth || 320, 400)
        });
    }

    async function initGoogleAuth() {
        const container = document.getElementById('googleSignInContainer');
        if (!container) return;

        try {
            const res = await fetch(`${API_BASE}/api/config`);
            const config = await res.json();
            const clientId = config.googleClientId || '';

            function tryRender() {
                if (clientId) {
                    if (window.google?.accounts?.id) {
                        renderGoogleButton(clientId);
                    } else {
                        window.setTimeout(tryRender, 100);
                    }
                    return;
                }

                if (config.demoGoogleEnabled) {
                    renderDemoButton();
                    return;
                }

                const notice = document.getElementById('googleConfigNotice');
                if (notice) {
                    notice.classList.remove('hidden');
                    notice.innerHTML = 'Configura Google en <a href="configurar-google.html" class="text-primary font-semibold underline">configurar-google.html</a>';
                }
            }

            tryRender();
        } catch (err) {
            console.error(err);
            renderDemoButton();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGoogleAuth);
    } else {
        initGoogleAuth();
    }
})();
