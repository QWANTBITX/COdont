# ⚡ QUICKSTART - 5 MINUTOS

## 🎯 Objetivo: Tener la app corriendo en 5 minutos

### Paso 1️⃣ (1 min) - Instalar dependencias

```bash
npm install
```

### Paso 2️⃣ (1 min) - Crear base de datos

```bash
npm run seed
```

Verás este mensaje:
```
✅ Seed completado exitosamente!
```

### Paso 3️⃣ (1 min) - Iniciar servidor

```bash
npm run dev
```

Verás:
```
🦷 CONSULTORIO ODONTOLÓGICO - SERVIDOR INICIADO 🦷

  🌐 Servidor: http://localhost:3000
```

### Paso 4️⃣ (1 min) - Abrir en navegador

El navegador se abre automáticamente en:
```
http://localhost:3000
```

### Paso 5️⃣ (1 min) - Iniciar sesión

**Email:** `admin@gmail.com`  
**Contraseña:** `Admin2026#`

✅ **¡LISTO! Ya estás dentro.**

---

## 🎭 Probar Diferentes Roles

### Paciente
```
Email: patient1@gmail.com
Contraseña: Patient2026&
```
→ Ver citas y historial clínico

### Odontólogo
```
Email: dentist1@gmail.com
Contraseña: Dentist2026$
```
→ Ver citas programadas

### Administrador
```
Email: admin@gmail.com
Contraseña: Admin2026#
```
→ Gestionar usuarios

---

## 🆕 Crear Nueva Cuenta

1. Haz clic en **"Registrarse"**
2. Completa el formulario
3. Email DEBE ser **@gmail.com**
4. Contraseña: **Mínimo 7 caracteres, letras, números, y 1 de (#$%&)**

Ejemplo válida: `MyPass123#`

---

## 🔴 Si Algo No Funciona

### Error: "Port 3000 already in use"

```bash
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Luego reintentar:
npm run dev
```

### Error: "Cannot find module"

```bash
rm -r node_modules
npm install
npm run dev
```

### Error en seed

```bash
mkdir data
npm run seed
```

---

## 📚 Leer Documentación

Después del quickstart, léete:

1. **RESUMEN_EJECUTIVO.md** ← Entender qué recibiste
2. **GUIA_INSTALACION.md** ← Instrucciones detalladas
3. **ESQUEMA_BD.md** ← Entender la BD

---

## 🛑 Detener la App

En la terminal donde corre:
```
CTRL + C
```

---

## 💡 Próximos Pasos

- Explorar el **dashboard** por cada rol
- Crear **nuevas citas**
- Ver **registros clínicos**
- Revisar código en `src/` para entender la arquitectura

---

## ✨ Eso es todo! Disfruta! 🦷

Preguntas? Lee **GUIA_INSTALACION.md** sección **Troubleshooting**
