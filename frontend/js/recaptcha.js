/**
 * reCAPTCHA v2 — verificación humano vs bot (incluye desafío de imágenes).
 */
window.CodontRecaptcha = {
    widgetId: null,
    enabled: false,
    siteKey: null,

    isValidHost() {
        const { protocol, hostname } = window.location;
        if (protocol === 'file:') return false;
        return (
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname.endsWith('.localhost')
        );
    },

    showHostWarning(container) {
        container.innerHTML = `
            <p style="font-size:0.85rem;color:#b45309;background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:12px;line-height:1.5;">
                Abre esta página desde <strong>http://localhost:3000</strong> (no como archivo local).
                <a href="http://localhost:3000/inicio_de_sesion.html" style="color:#006194;font-weight:600;">Ir al login correcto</a>
            </p>`;
    },

    loadScript() {
        return new Promise((resolve, reject) => {
            if (window.grecaptcha?.render) {
                grecaptcha.ready(resolve);
                return;
            }
            const existing = document.querySelector('script[data-codont-recaptcha]');
            if (existing) {
                existing.addEventListener('load', () => grecaptcha.ready(resolve));
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js?hl=es&render=explicit';
            script.async = true;
            script.defer = true;
            script.dataset.codontRecaptcha = '1';
            script.onload = () => grecaptcha.ready(resolve);
            script.onerror = () => reject(new Error('No se pudo cargar reCAPTCHA'));
            document.head.appendChild(script);
        });
    },

    async init() {
        const container = document.getElementById('recaptcha-container');
        if (!container) return;

        if (!this.isValidHost()) {
            this.showHostWarning(container);
            return;
        }

        try {
            const config = await fetch('/api/config').then((r) => r.json());
            if (!config.recaptchaEnabled || !config.recaptchaSiteKey) return;

            this.enabled = true;
            this.siteKey = config.recaptchaSiteKey.trim();
            await this.loadScript();

            container.innerHTML = '';
            this.widgetId = grecaptcha.render(container, {
                sitekey: this.siteKey,
                theme: 'light',
                hl: 'es'
            });
        } catch (err) {
            console.error('reCAPTCHA:', err);
            container.innerHTML = `
                <p style="font-size:0.85rem;color:#b91c1c;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px;">
                    No se pudo cargar reCAPTCHA. Revisa las claves en
                    <a href="configurar-recaptcha.html" style="color:#006194;font-weight:600;">configurar-recaptcha.html</a>
                </p>`;
        }
    },

    getResponse() {
        if (!this.enabled || this.widgetId === null) return '';
        return grecaptcha.getResponse(this.widgetId) || '';
    },

    requireResponse() {
        if (!this.isValidHost()) {
            throw new Error('Abre la app en http://localhost:3000 para usar reCAPTCHA.');
        }
        const token = this.getResponse();
        if (this.enabled && !token) {
            throw new Error(
                'Completa la verificación de seguridad reCAPTCHA antes de continuar.'
            );
        }
        return token;
    },

    reset() {
        if (this.widgetId !== null && window.grecaptcha) {
            grecaptcha.reset(this.widgetId);
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CodontRecaptcha.init());
} else {
    CodontRecaptcha.init();
}
