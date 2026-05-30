# 🚀 GUÍA PASO A PASO - LEVANTAR LA APLICACIÓN

## ✅ Requisitos Previos

- Node.js v18 o superior
- npm v9 o superior
- Git (opcional)
- Un navegador web

### Verificar versiones instaladas

**Windows (PowerShell):**
```powershell
node --version
npm --version
```

**macOS/Linux (Terminal):**
```bash
node --version
npm --version
```

---

## 🔧 PASOS DE INSTALACIÓN

### Paso 1: Descargar/Clonar el Proyecto

**Opción A: Git (si tienes Git instalado)**
```bash
git clone https://github.com/tu-usuario/consultorio-odontologico.git
cd consultorio-odontologico
```

**Opción B: Descargar ZIP**
1. Descarga el ZIP del repositorio
2. Extrae en la carpeta donde desees
3. Abre PowerShell/Terminal en esa carpeta

### Paso 2: Instalar Dependencias

**En la raíz del proyecto, ejecuta:**

```bash
npm install
```

Esto instalará:
- Express (servidor web)
- TypeScript (lenguaje)
- SQLite (base de datos)
- Y todas las demás librerías necesarias

⏱️ Esto puede tomar 1-3 minutos en primera instalación.

### Paso 3: Crear Archivo .env

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**macOS/Linux (Terminal):**
```bash
cp .env.example .env
```

O simplemente copia manualmente el contenido de `.env.example` a un archivo llamado `.env`

### Paso 4: Crear Carpeta de Datos

**Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Force -Path data
```

**macOS/Linux:**
```bash
mkdir -p data
```

### Paso 5: Crear Base de Datos e Insertar Datos de Prueba

```bash
npm run seed
```

**Salida esperada:**
```
🌱 Iniciando seed de base de datos...
📝 Creando usuarios...
👥 Creando perfiles de pacientes...
🦷 Creando perfiles de odontólogos...
📅 Creando citas...
📋 Creando registros clínicos...
📊 Creando logs de auditoría...

✅ Seed completado exitosamente!

📊 Datos de prueba creados:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  👤 Usuarios:
     • Admin: admin@gmail.com / Admin2026#
     • Odontólogo 1: dentist1@gmail.com / Dentist2026$
     • Odontólogo 2: dentist2@gmail.com / Smile2026%
     • Paciente 1: patient1@gmail.com / Patient2026&
     • Paciente 2: patient2@gmail.com / Tooth2026#
...
```

### Paso 6: Iniciar el Servidor

**Para Desarrollo (con auto-reload):**
```bash
npm run dev
```

**Salida esperada:**
```
╔═══════════════════════════════════════════════════════════╗
║   🦷 CONSULTORIO ODONTOLÓGICO - SERVIDOR INICIADO 🦷      ║
╚═══════════════════════════════════════════════════════════╝

  🌐 Servidor: http://localhost:3000
  📝 API: http://localhost:3000/api
  💻 Frontend: Abierto en navegador
  
  ℹ️  Para datos de prueba, ejecuta: npm run seed
  
  ⚠️  CTRL+C para detener el servidor
```

### Paso 7: Abrir en el Navegador

Automaticamente se abrirá, o ingresa en:
```
http://localhost:3000
```

---

## 🧪 PRUEBAS DE FUNCIONAMIENTO

### Test 1: Login con Usuario de Prueba

1. ✅ El navegador abre http://localhost:3000
2. ✅ Ve la pantalla de "Iniciar Sesión"
3. **Ingresa:**
   - Email: `admin@gmail.com`
   - Contraseña: `Admin2026#`
4. ✅ Haz clic en "Iniciar Sesión"
5. ✅ Deberías ver el dashboard con tus citas

### Test 2: Registro de Nuevo Usuario

1. ✅ Haz clic en "Registrarse"
2. **Completa el formulario:**
   - Nombre: `Tu Nombre`
   - Email: `tunombre@gmail.com` (DEBE ser Gmail)
   - Contraseña: Algo como `MyPass123#`
   - Repetir: misma contraseña
3. ✅ Haz clic en "Crear Cuenta"
4. ✅ Deberías ver un mensaje de éxito

### Test 3: Recuperación de Contraseña (Opcional)

1. ✅ En Login, haz clic en "¿Olvidaste tu contraseña?"
2. **Ingresa:** `admin@gmail.com`
3. ✅ Haz clic en "Enviar"
4. ✅ Deberías ver un mensaje confirmando

(Para recibir emails, necesitas configurar SMTP - ver abajo)

---

## 📧 CONFIGURAR EMAIL (Opcional)

Si quieres que funcione el envío de emails para recuperación de contraseña:

### Paso A: Ir a Google Account Security

1. Abre https://myaccount.google.com/security
2. Busca **"2-Step Verification"**
3. Si está desactivado, actívalo
   - Seguir los pasos que Google indica
   - Confirmar con tu teléfono

### Paso B: Crear App Password

1. Abre https://myaccount.google.com/apppasswords
2. En el dropdown de arriba:
   - Selecciona: **Mail**
   - Selecciona: **Windows Computer** (o tu sistema)
3. Haz clic en **"Generate"**
4. Google mostrará una contraseña de 16 caracteres
   - Ejemplo: `abcd efgh ijkl mnop`

### Paso C: Actualizar .env

1. Abre el archivo `.env` en tu editor de texto
2. Busca estas líneas:
   ```
   SMTP_USER=tu-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   ```
3. Reemplaza:
   ```
   SMTP_USER=tuemailreal@gmail.com
   SMTP_PASS=abcdefghijklmnop
   ```
   (Sin espacios en SMTP_PASS)

4. Guarda el archivo

### Paso D: Reiniciar Servidor

1. En la terminal donde corre el servidor, presiona: **CTRL+C**
2. Ejecuta nuevamente: `npm run dev`
3. El servidor debería iniciar con email configurado

### Test de Email

1. En la pantalla de login, haz clic en "¿Olvidaste tu contraseña?"
2. Ingresa: `admin@gmail.com`
3. Revisa tu bandeja de Gmail (también revisar spam)
4. Deberías recibir un email con enlace de recuperación

---

## 🛑 DETENER EL SERVIDOR

En la terminal donde está corriendo, presiona:
```
CTRL + C
```

Aparecerá: `^C` y el servidor se cerrará.

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### ❌ "Port 3000 already in use"

**Windows (PowerShell):**
```powershell
# Encontrar y matar el proceso
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# O cambiar puerto en .env
# PORT=3001
```

**macOS/Linux:**
```bash
# Ver qué usa el puerto
lsof -i :3000

# Matar el proceso
kill -9 <PID>
```

### ❌ "Cannot find module 'express'"

```bash
# Reinstalar dependencias
rm -r node_modules
npm install
```

### ❌ Error en "npm run seed"

```bash
# Asegurarte que la carpeta existe
mkdir -p data

# Intentar seed de nuevo
npm run seed
```

### ❌ "ENOENT: no such file or directory"

```bash
# Crear estructura de carpetas
mkdir -p src/database
mkdir -p src/models
mkdir -p src/controllers
mkdir -p data
mkdir -p logs
```

### ❌ Email no se envía

1. Verifica que **2FA esté activo** en Google
2. Verifica que **App Password esté en .env**
3. Revisa la carpeta de **Spam** en Gmail
4. Sin configurar, el sistema igual funciona pero sin emails

---

## 📊 ARQUITECTURA DE ARCHIVOS

Después de todo, tu carpeta se verá así:

```
consultorio-odontologico/
├── data/                          ← Base de datos SQLite
│   └── consultorio.db            ← El archivo principal
├── logs/                          ← Logs de auditoría
├── node_modules/                  ← Librerías instaladas
├── public/                        ← Frontend HTML/CSS/JS
│   ├── index.html
│   └── js/app.js
├── src/                           ← Código backend TypeScript
│   ├── database/
│   ├── models/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.ts
├── .env                           ← Variables de entorno
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 💡 CONSEJOS

✅ **Siempre** verifica que el servidor esté corriendo:
```
http://localhost:3000
```

✅ **Si hay errores**, mira la consola del servidor (donde ejecutaste `npm run dev`)

✅ **Para limpiar todo y empezar de nuevo:**
```bash
rm -r data
rm -r logs
npm run seed
npm run dev
```

✅ **Para compilar TypeScript sin ejecutar:**
```bash
npm run build
```

---

## 🎓 Flujo Completo de Ejemplo

```
1. npm install                    ← Instalar
2. npm run seed                   ← Crear datos
3. npm run dev                    ← Iniciar
4. http://localhost:3000          ← Abrir navegador
5. Iniciar sesión con admin@gmail.com / Admin2026#
6. Explorar el dashboard
7. Registrar nuevo usuario (tu-email@gmail.com)
8. CTRL+C para detener cuando termines
```

---

¡ **Listo! Tu aplicación debería estar funcionando correctamente.** 🎉

Cualquier duda, revisa los logs en la terminal o en `logs/` folder.
