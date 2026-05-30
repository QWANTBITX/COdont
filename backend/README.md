# Backend de Simulación - COdont

Este directorio contiene un servidor mockup funcional basado en **Node.js** y **Express** para la aplicación del Consultorio Odontológico COdont.

Sirve tanto la interfaz frontend estática como una serie de endpoints API para simular el inicio de sesión y la gestión de pacientes (CRUD).

## Requisitos Previos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (incluye `npm`).

## Instalación de Dependencias

Para comenzar, abre una terminal en esta carpeta (`backend`) y ejecuta:

```bash
npm install
```

Copia el archivo de ejemplo y configura las variables:

```bash
copy .env.example .env
```

Esto instalará Express, CORS, verificación de tokens de Google y Nodemon para recarga automática durante el desarrollo.

## Inicio de sesión con Google

1. Entra a [Google Cloud Console](https://console.cloud.google.com/) y crea un proyecto (o usa uno existente).
2. Ve a **APIs y servicios → Credenciales → Crear credenciales → ID de cliente de OAuth**.
3. Tipo de aplicación: **Aplicación web**.
4. En **Orígenes de JavaScript autorizados** añade: `http://localhost:3000`
5. Copia el **ID de cliente** y pégalo en `backend/.env`:

```env
GOOGLE_CLIENT_ID=123456789-xxxx.apps.googleusercontent.com
```

6. Reinicia el servidor (`npm start`).

En la pantalla de inicio de sesión aparecerá el botón **Continuar con Google**. El backend valida el token con la librería oficial de Google.

## reCAPTCHA v2 (humanos vs bots)

Login, registro y Google requieren **reCAPTCHA v2** (casilla «No soy un robot» y desafío de imágenes si Google lo solicita).

1. Registra el sitio en [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin).
2. Tipo: **Casilla de verificación v2**.
3. Dominios: `localhost`
4. Añade las claves en `backend/.env` (`RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`).

El proyecto incluye claves de **prueba de Google** para desarrollo local.

## Ejecución del Servidor

### Modo Desarrollo (Recarga automática ante cambios)
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

Una vez iniciado, abre tu navegador e ingresa a: **`http://localhost:3000`** para interactuar con la aplicación completa sirviéndose desde el servidor local.

---

## Estructura de Endpoints de la API

La API expone los siguientes recursos bajo el prefijo `/api`:

### Configuración
* **`GET /api/config`**: Devuelve el `googleClientId` público para el frontend.

### Autenticación
* **`POST /api/auth/login`**: Simula el inicio de sesión con correo y contraseña.
  * *Request Body*: `{ "username": "admin@lumina.com", "password": "..." }`
* **`POST /api/auth/google`**: Valida el ID token de Google Sign-In y devuelve el usuario.
  * *Request Body*: `{ "credential": "<JWT de Google>" }`
* **`POST /api/auth/register`**: Simula la creación de una cuenta de paciente.

### Pacientes (CRUD)
* **`GET /api/patients`**: Obtiene la lista de todos los pacientes.
* **`POST /api/patients`**: Registra un nuevo paciente.
  * *Request Body*: `{ "name": "...", "email": "...", "phone": "..." }`
* **`PUT /api/patients/:id`**: Modifica la información del paciente especificado por su `id`.
* **`DELETE /api/patients/:id`**: Elimina de memoria al paciente especificado por su `id`.
