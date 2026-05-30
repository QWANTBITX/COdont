require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 3000;
const ENV_PATH = path.join(__dirname, '.env');
const ALLOW_DEMO_GOOGLE = process.env.ALLOW_DEMO_GOOGLE === 'true';
const ALLOW_SETUP = process.env.ALLOW_SETUP === 'true';
let RECAPTCHA_SITE_KEY = (process.env.RECAPTCHA_SITE_KEY || '').trim();
let RECAPTCHA_SECRET_KEY = (process.env.RECAPTCHA_SECRET_KEY || '').trim();

function isRecaptchaEnabled() {
    return (
        process.env.RECAPTCHA_ENABLED !== 'false' &&
        Boolean(RECAPTCHA_SITE_KEY && RECAPTCHA_SECRET_KEY)
    );
}

let GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
let googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

function setGoogleClientId(clientId) {
    GOOGLE_CLIENT_ID = clientId;
    googleClient = clientId ? new OAuth2Client(clientId) : null;
    process.env.GOOGLE_CLIENT_ID = clientId;
}

function persistGoogleClientId(clientId) {
    let content = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';
    const line = `GOOGLE_CLIENT_ID=${clientId}`;
    if (/^GOOGLE_CLIENT_ID=.*/m.test(content)) {
        content = content.replace(/^GOOGLE_CLIENT_ID=.*/m, line);
    } else {
        content = content.trimEnd() + (content.endsWith('\n') ? '' : '\n') + line + '\n';
    }
    fs.writeFileSync(ENV_PATH, content, 'utf8');
    setGoogleClientId(clientId);
}

async function verifyRecaptchaToken(token, remoteip) {
    const params = new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token
    });
    if (remoteip) params.append('remoteip', remoteip);

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });
    return response.json();
}

async function assertRecaptcha(req, res) {
    if (!isRecaptchaEnabled()) return true;

    const token = req.body.recaptchaToken;
    if (!token) {
        res.status(400).json({
            error: 'Debes completar la verificación reCAPTCHA (prueba de seguridad).'
        });
        return false;
    }

    try {
        const result = await verifyRecaptchaToken(token, req.ip);
        if (!result.success) {
            res.status(403).json({
                error: 'Verificación reCAPTCHA fallida. Marca de nuevo la casilla o completa el desafío de imágenes.'
            });
            return false;
        }
        return true;
    } catch (err) {
        console.error('reCAPTCHA:', err.message);
        res.status(500).json({ error: 'No se pudo verificar reCAPTCHA' });
        return false;
    }
}

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend desde la carpeta 'frontend'
app.use(express.static(path.join(__dirname, '../frontend')));

// Base de datos simulada en memoria
let patients = [
    { id: 1, name: 'Carlos Ruiz', email: 'carlos@ejemplo.com', phone: '555-0101', date: '2024-04-20' },
    { id: 2, name: 'Ana Martínez', email: 'ana@ejemplo.com', phone: '555-0102', date: '2024-04-21' }
];

// --- CONFIGURACIÓN PÚBLICA (frontend) ---

app.get('/api/config', (req, res) => {
    res.json({
        googleClientId: GOOGLE_CLIENT_ID,
        googleAuthEnabled: Boolean(GOOGLE_CLIENT_ID),
        demoGoogleEnabled: ALLOW_DEMO_GOOGLE && !GOOGLE_CLIENT_ID,
        setupUrl: '/configurar-google.html',
        recaptchaSiteKey: isRecaptchaEnabled() ? RECAPTCHA_SITE_KEY : '',
        recaptchaEnabled: isRecaptchaEnabled()
    });
});

// Guardar Client ID desde el asistente web (solo desarrollo local)
app.post('/api/setup/google-client-id', (req, res) => {
    if (!ALLOW_SETUP) {
        return res.status(403).json({ error: 'Configuración remota deshabilitada' });
    }

    const { clientId } = req.body;
    if (!clientId || !clientId.endsWith('.apps.googleusercontent.com')) {
        return res.status(400).json({
            error: 'ID de cliente inválido. Debe terminar en .apps.googleusercontent.com'
        });
    }

    try {
        persistGoogleClientId(clientId.trim());
        res.json({
            success: true,
            message: 'Google Client ID guardado. Recarga la página de inicio de sesión.',
            googleClientId: GOOGLE_CLIENT_ID,
            googleAuthEnabled: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'No se pudo guardar en .env' });
    }
});

function persistEnvVar(key, value) {
    let content = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';
    const line = `${key}=${value}`;
    const pattern = new RegExp(`^${key}=.*`, 'm');
    if (pattern.test(content)) {
        content = content.replace(pattern, line);
    } else {
        content = content.trimEnd() + (content.endsWith('\n') ? '' : '\n') + line + '\n';
    }
    fs.writeFileSync(ENV_PATH, content, 'utf8');
    process.env[key] = value;
}

app.post('/api/setup/recaptcha-keys', (req, res) => {
    if (!ALLOW_SETUP) {
        return res.status(403).json({ error: 'Configuración remota deshabilitada' });
    }

    const siteKey = (req.body.siteKey || '').trim();
    const secretKey = (req.body.secretKey || '').trim();

    if (!siteKey || !secretKey) {
        return res.status(400).json({ error: 'Ambas claves son requeridas' });
    }

    try {
        persistEnvVar('RECAPTCHA_SITE_KEY', siteKey);
        persistEnvVar('RECAPTCHA_SECRET_KEY', secretKey);
        persistEnvVar('RECAPTCHA_ENABLED', 'true');
        RECAPTCHA_SITE_KEY = siteKey;
        RECAPTCHA_SECRET_KEY = secretKey;
        res.json({
            success: true,
            message: 'Claves reCAPTCHA guardadas. Recarga la página de login.',
            recaptchaEnabled: isRecaptchaEnabled()
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'No se pudo guardar en .env' });
    }
});

// --- ENDPOINTS DE AUTENTICACIÓN ---

// Login con Google (verifica el ID token de GIS)
app.post('/api/auth/google', async (req, res) => {
    if (!(await assertRecaptcha(req, res))) return;

    const { credential } = req.body;

    if (!GOOGLE_CLIENT_ID || !googleClient) {
        return res.status(503).json({
            error: 'Google Sign-In no está configurado. Añade GOOGLE_CLIENT_ID en backend/.env'
        });
    }

    if (!credential) {
        return res.status(400).json({ error: 'Token de Google requerido' });
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const email = payload.email;
        const role = email === 'admin@lumina.com' ? 'admin' : 'paciente';

        res.json({
            success: true,
            message: 'Inicio de sesión con Google exitoso',
            user: {
                email,
                name: payload.name,
                picture: payload.picture,
                googleId: payload.sub,
                role,
                provider: 'google'
            }
        });
    } catch (err) {
        console.error('Error al verificar token de Google:', err.message);
        res.status(401).json({ error: 'Token de Google inválido o expirado' });
    }
});

// Login demo con Google (sin credenciales de Google Cloud)
app.post('/api/auth/google/demo', async (req, res) => {
    if (!(await assertRecaptcha(req, res))) return;

    if (!ALLOW_DEMO_GOOGLE) {
        return res.status(403).json({ error: 'Modo demo deshabilitado' });
    }

    const { email, name } = req.body;
    const userEmail = (email || 'paciente.demo@gmail.com').trim().toLowerCase();
    const userName = name || userEmail.split('@')[0];
    const role = userEmail === 'admin@lumina.com' ? 'admin' : 'paciente';

    res.json({
        success: true,
        message: 'Inicio de sesión demo con Google',
        user: {
            email: userEmail,
            name: userName,
            picture: null,
            googleId: 'demo-' + Date.now(),
            role,
            provider: 'google-demo'
        }
    });
});

// Login simulado
app.post('/api/auth/login', async (req, res) => {
    if (!(await assertRecaptcha(req, res))) return;

    const { username, password } = req.body;
    console.log(`Intento de login recibido: ${username}`);

    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    // Respuesta simulada de éxito
    res.json({
        success: true,
        message: 'Inicio de sesión simulado con éxito',
        user: {
            email: username,
            role: username === 'admin@lumina.com' ? 'admin' : 'paciente'
        }
    });
});

// Registro simulado
app.post('/api/auth/register', async (req, res) => {
    if (!(await assertRecaptcha(req, res))) return;

    const { name, email } = req.body;
    console.log(`Intento de registro recibido: ${name} (${email})`);

    if (!name || !email) {
        return res.status(400).json({ error: 'Nombre y correo son requeridos' });
    }

    res.json({
        success: true,
        message: 'Cuenta simulada creada con éxito',
        user: { name, email }
    });
});


// --- ENDPOINTS CRUD DE PACIENTES ---

// Obtener todos los pacientes
app.get('/api/patients', (req, res) => {
    res.json(patients);
});

// Crear un paciente
app.post('/api/patients', (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const newPatient = {
        id: Date.now(),
        name,
        email,
        phone,
        date: new Date().toISOString().split('T')[0]
    };

    patients.push(newPatient);
    res.status(201).json(newPatient);
});

// Actualizar un paciente
app.put('/api/patients/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email, phone } = req.body;

    const patientIndex = patients.findIndex(p => p.id === id);
    if (patientIndex === -1) {
        return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    patients[patientIndex] = {
        ...patients[patientIndex],
        name: name || patients[patientIndex].name,
        email: email || patients[patientIndex].email,
        phone: phone || patients[patientIndex].phone
    };

    res.json(patients[patientIndex]);
});

// Eliminar un paciente
app.delete('/api/patients/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const patientIndex = patients.findIndex(p => p.id === id);

    if (patientIndex === -1) {
        return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    patients = patients.filter(p => p.id !== id);
    res.json({ success: true, message: 'Paciente eliminado con éxito' });
});

// Enrutar cualquier otra petición al index.html del frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` Servidor COdont activo en http://localhost:${PORT}`);
    console.log(` Sirviendo frontend y endpoints API...`);
    console.log(`==================================================`);
});
