# 🦷 Consultorio Odontológico - Sistema de Gestión Clínica

Aplicación web profesional completa para la gestión integral de consultorios odontológicos con módulos de citas, historiales clínicos y gestión administrativa.

## 🎯 Características Principales

✅ **Autenticación Segura**
- Registro e inicios de sesión con validación estricta
- Solo emails de Gmail (@gmail.com)
- Contraseñas con requisitos de seguridad robustos
- JWT en cookies httpOnly con SameSite=Strict
- Recuperación de contraseña vía email

✅ **Gestión de Roles**
- **Administrador**: Control total del sistema, gestión de usuarios
- **Odontólogo**: Agenda de citas, historiales clínicos, odontograma
- **Paciente**: Visualización de citas propias, historial de consultas

✅ **Base de Datos Local**
- SQLite con mejoras WAL para concurrencia
- Esquema normalizado con 8 tablas
- Índices optimizados para rendimiento
- Datos de prueba incluidos

✅ **Seguridad Empresarial**
- Helmet.js para headers de seguridad
- Rate limiting en autenticación
- Sanitización de inputs
- Logs de auditoría completos
- CORS configurado

## 📋 Requisitos

- **Node.js**: v18+ (LTS recomendado)
- **npm**: v9+
- **Sistema Operativo**: Windows, macOS, Linux
- **Navegador**: Chrome, Firefox, Safari, Edge (versiones recientes)

## 🚀 Instalación y Configuración

### 1. **Clonar/Descargar el Proyecto**

```bash
git clone <tu-repo>
cd consultorio-odontologico
```

### 2. **Instalar Dependencias**

```bash
npm install
```

Esto instalará:
- Express.js (servidor web)
- Better-sqlite3 (base de datos)
- Bcrypt (hash de contraseñas)
- JWT (autenticación)
- Zod (validación de esquemas)
- Nodemailer (envío de emails)
- Y más...

### 3. **Configurar Variables de Entorno**

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores
```

**Variables Esenciales:**

```env
# Servidor
PORT=3000
NODE_ENV=development

# JWT (CAMBIAR EN PRODUCCIÓN)
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_change_this
JWT_EXPIRATION=7d

# Base de datos (ruta local)
DATABASE_URL=./data/consultorio.db

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password  # NO tu contraseña de Gmail
SMTP_FROM_NAME=Consultorio Odontológico
SMTP_FROM_EMAIL=tu-email@gmail.com

# Configuración CORS
CORS_ORIGIN=http://localhost:3000
```

### 4. **Configurar Gmail para Envío de Emails (Opcional)**

Para que funcione la recuperación de contraseña:

1. **Activa 2FA en tu cuenta Google**:
   - Ve a [myaccount.google.com/security](https://myaccount.google.com/security)
   - Selecciona "2-Step Verification" y actívalo

2. **Crea una "App Password"**:
   - Ve a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Selecciona "Mail" y "Windows Computer" (o tu dispositivo)
   - Google generará una contraseña de 16 caracteres
   - Copia esta contraseña a la variable `SMTP_PASS` en `.env`

3. **Si no quieres configurar email**:
   - Los usuarios seguirán pudiendo registrarse
   - La recuperación de contraseña solo mostrará un mensaje

### 5. **Inicializar Base de Datos**

```bash
npm run seed
```

Esto creará la BD con tablas y datos de prueba.

**Usuarios de Prueba Creados:**

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@gmail.com | Admin2026# | Administrador |
| dentist1@gmail.com | Dentist2026$ | Odontólogo |
| dentist2@gmail.com | Smile2026% | Odontólogo |
| patient1@gmail.com | Patient2026& | Paciente |
| patient2@gmail.com | Tooth2026# | Paciente |
# Login: admin@gmail.com
# Contraseña: Admin2026#

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm run build
npm start
```

La aplicación estará disponible en: **http://localhost:3000**

## 📱 Uso de la Aplicación

### Flujo de Usuario

#### 1. **Registro** (Nueva Cuenta)
```
1. Haz clic en "Registrarse"
2. Ingresa nombre completo
3. Email de Gmail (solo @gmail.com)
4. Contraseña con requisitos:
   - Mínimo 7 caracteres
   - Contener letras y números
   - Incluir uno de: # $ % &
5. Repite la contraseña
6. Haz clic en "Crear Cuenta"
```

#### 2. **Iniciar Sesión**
```
1. Ingresa tu email de Gmail
2. Ingresa tu contraseña
3. Haz clic en "Iniciar Sesión"
```

#### 3. **Recuperar Contraseña**
```
1. Haz clic en "¿Olvidaste tu contraseña?"
2. Ingresa tu email de Gmail
3. Revisa tu bandeja de entrada (o spam)
4. Haz clic en el enlace del email
5. Ingresa tu nueva contraseña
6. Guarda los cambios
```

### Funcionalidades por Rol

#### 👤 **Paciente**
- Ver mis citas programadas
- Ver mi historial clínico
- Editar datos personales
- Descargar recetas (si está implementado)

#### 👨‍⚕️ **Odontólogo**
- Ver citas diarias/semanales
- Registrar diagnósticos
- Crear historiales clínicos
- Usar odontograma
- Ver notas de evolución del paciente

#### 🔐 **Administrador**
- Listar todos los usuarios
- Crear/editar/eliminar usuarios
- Asignar roles
- Activar/desactivar cuentas
- Ver logs de auditoría

## 🏗️ Estructura del Proyecto

```
consultorio-odontologico/
├── src/
│   ├── database/
│   │   ├── db.ts          # Inicialización y esquema SQLite
│   │   └── seed.ts        # Datos de prueba
│   ├── models/
│   │   └── index.ts       # Modelos de datos (ORM)
│   ├── controllers/
│   │   ├── authController.ts      # Autenticación y registro
│   │   └── appointmentController.ts
│   ├── services/
│   │   ├── index.ts       # Lógica empresarial
│   │   └── emailService.ts
│   ├── routes/
│   │   └── index.ts       # Definición de endpoints API
│   ├── middleware/
│   │   ├── auth.ts        # Autenticación JWT
│   │   └── errorHandler.ts
│   ├── utils/
│   │   ├── validation.ts  # Esquemas Zod
│   │   ├── jwt.ts         # Utilidades JWT
│   │   └── logger.ts      # Sistema de logs
│   └── server.ts          # Punto de entrada Express
├── public/
│   ├── index.html         # SPA principal
│   └── js/
│       └── app.js         # Frontend JavaScript
├── logs/                  # Logs de auditoría
├── data/                  # Base de datos SQLite
├── .env.example           # Variables de entorno
├── package.json           # Dependencias
├── tsconfig.json          # Configuración TypeScript
└── README.md             # Este archivo
```

## 🔐 Seguridad

### Contraseña
```regex
/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#\$%&])[A-Za-z\d#$%&]{7,}$/
```
- Mínimo 7 caracteres
- Contiene letras (A-Z, a-z)
- Contiene números (0-9)
- Contiene especiales: # $ % &

### Email
```regex
/^[a-zA-Z0-9._%+-]+@gmail\.com$/
```
- Solo Gmail (@gmail.com)
- Validación en frontend y backend
- No se permiten otros proveedores

### Autenticación
- JWT en cookies httpOnly
- SameSite=Strict para prevenir CSRF
- Tokens con expiración (7 días)
- Refresh automático no implementado (add si necesitas)

### Contraseña Hasheada
- Algoritmo: bcrypt
- Salt rounds: 12
- Nunca se guarda en texto plano
- Validación de tiempo constante

### Logs
- Auditoría de acciones por usuario
- Registro de intentos de login fallidos
- Almacenamiento en archivos locales
- Formato: JSON para análisis

## 📊 API Endpoints

### 🔓 Públicos (Sin Autenticación)

```
POST /api/auth/register
  Body: { email, password, confirmPassword, fullName, phone? }
  Response: { message, user }

POST /api/auth/login
  Body: { email, password }
  Response: { message, user }

POST /api/auth/forgot-password
  Body: { email }
  Response: { message }

POST /api/auth/reset-password
  Body: { token, password, confirmPassword }
  Response: { message }
```

### 🔒 Protegidos (Autenticación Requerida)

```
GET /api/profile
  Response: { user }

POST /api/auth/logout
  Response: { message }

GET /api/appointments
  Response: { appointments }

POST /api/appointments
  Body: { dentistId, appointmentDate, reason, duration_minutes? }
  Response: { message, appointmentId }

PUT /api/appointments/:appointmentId
  Body: { status, notes? }
  Response: { message }

GET /api/clinical-records
  Response: { records }

GET /api/dentist/appointments
  Response: { appointments }
```

### 👨‍💼 Admin (Solo Admin)

```
GET /api/admin/users?role=dentist
  Response: { users }

GET /api/admin/users/:userId
  Response: { user }

PUT /api/admin/users/:userId
  Body: { role?, status? }
  Response: { message }

DELETE /api/admin/users/:userId
  Response: { message }
```

## 🧪 Testing

### Flujo Completo de Prueba

```bash
# 1. Instalar dependencias
npm install

# 2. Crear base de datos
npm run seed

# 3. Iniciar servidor
npm run dev

# 4. Abrir en navegador
# http://localhost:3000

# 5. Registrar nuevo usuario
# Email: tutest@gmail.com
# Contraseña: MyPass123#

# 6. Iniciar sesión

# 7. Ver dashboard (según rol)
```

### Prueba de Email (Recuperación de Contraseña)

```
1. Haz clic en "¿Olvidaste tu contraseña?"
2. Ingresa email: admin@gmail.com
3. Si Gmail está configurado, revisa tu bandeja
4. Haz clic en el enlace (válido 15 minutos)
5. Ingresa nueva contraseña
6. Inicia sesión con la nueva contraseña
```

## 🐛 Troubleshooting

### Puerto 3000 ya está en uso
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# macOS/Linux
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Error "ENOENT: no such file or directory"
```bash
# Recrear carpeta data
mkdir -p data
npm run seed
```

### Email no se envía
1. Verifica que `SMTP_USER` y `SMTP_PASS` estén correctos
2. Revisa spam en Gmail
3. Confirma que 2FA esté activo en tu cuenta Google
4. Prueba con la contraseña de aplicación correcta

### Error de base de datos "database is locked"
```bash
# Eliminar archivos de WAL
rm data/consultorio.db-shm data/consultorio.db-wal
npm run seed
```

## 📈 Mejoras Futuras

- [ ] Edición de perfil completa para pacientes
- [ ] Descarga de PDFs de recetas
- [ ] Odontograma interactivo avanzado
- [ ] Notificaciones por email/SMS
- [ ] Dashboard con gráficos de estadísticas
- [ ] Exportación de reportes
- [ ] Sistema de pagos
- [ ] Integración con Google Calendar
- [ ] Aplicación móvil (React Native)

## 📝 Notas Importantes

### Seguridad en Producción

Si despliegas a producción, DEBES:

```bash
# 1. Cambiar JWT_SECRET a valor aleatorio fuerte
export JWT_SECRET=$(openssl rand -hex 32)

# 2. Usar HTTPS (no HTTP)
NODE_ENV=production

# 3. Cambiar CORS_ORIGIN a tu dominio
CORS_ORIGIN=https://tudominio.com

# 4. Usar base de datos remota (no local)
# Migrar de SQLite a PostgreSQL recomendado

# 5. Habilitar backups automáticos
# 6. Configurar monitoreo y alertas
# 7. Usar CDN para archivos estáticos
```

### Base de Datos

- SQLite está limitado a ~1 consulta simultánea
- Para producción con muchos usuarios: **Migrar a PostgreSQL**
- Hacer backups regulares de `data/consultorio.db`

### Emails

- Gmail bloquea "apps menos seguras"
- La única forma es usar "App Passwords" con 2FA
- Para producción: Usar servicio especializado (SendGrid, Mailgun)

## 📞 Soporte

Para problemas o preguntas:

1. Revisa la sección Troubleshooting
2. Verifica que Node.js v18+ esté instalado
3. Asegúrate de que el puerto 3000 esté disponible
4. Revisa los logs en `logs/`

## 📄 Licencia

MIT License - Libre para uso educativo y comercial

## 👨‍💻 Autor

Desarrollo de Arquitectura Senior - Sistema Integral de Gestión Clínica Odontológica

---

**¡Gracias por usar el Consultorio Odontológico Digital!** 🦷✨
