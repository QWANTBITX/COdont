# 🎯 ARCHIVOS CLAVE - Guía Rápida

## 📌 Por Dónde Empezar

### ⭐ TOP 3 ARCHIVOS PARA LEER PRIMERO

1. **QUICKSTART.md**
   - ¿Qué?: Levantar app en 5 minutos
   - ¿Cuándo?: Primer día
   - ⏱️ Tiempo: 5 minutos

2. **RESUMEN_EJECUTIVO.md**
   - ¿Qué?: Entender qué recibiste
   - ¿Cuándo?: Antes de empezar a explorar
   - ⏱️ Tiempo: 10 minutos

3. **MANIFEST.md**
   - ¿Qué?: Checklist de archivos entregados
   - ¿Cuándo?: Después de instalar
   - ⏱️ Tiempo: 5 minutos

---

## 🗂️ ESTRUCTURA DE ARCHIVOS IMPORTANTE

### 🚀 Ejecutar la App
```
package.json          npm install, npm run dev, npm run seed
.env                  Configuración (copiar de .env.example)
.env.local            Pre-configurado para desarrollo
```

### 📖 Documentación (Lee en Este Orden)
```
1. QUICKSTART.md              ← 5 min start
2. RESUMEN_EJECUTIVO.md       ← Entender la solución
3. GUIA_INSTALACION.md        ← Pasos detallados
4. ESQUEMA_BD.md              ← Base de datos
5. README_SETUP.md            ← Referencia técnica
6. MANIFEST.md                ← Checklist completo
```

### 💻 Código Backend (src/)
```
src/
├── server.ts                 ← Express + configuración
├── database/
│   ├── db.ts                 ← Schema SQLite (IMPORTANTE)
│   └── seed.ts               ← Datos de prueba
├── models/index.ts           ← ORM básico
├── controllers/
│   ├── authController.ts     ← Login/Register/Reset
│   └── appointmentController.ts ← Citas y admin
├── services/
│   ├── index.ts              ← Lógica empresarial
│   └── emailService.ts       ← Nodemailer templates
├── routes/index.ts           ← API endpoints
├── middleware/
│   ├── auth.ts               ← JWT + RBAC
│   └── errorHandler.ts       ← Error handling
└── utils/
    ├── validation.ts         ← Zod schemas
    ├── jwt.ts                ← JWT functions
    └── logger.ts             ← Audit logs
```

### 🎨 Frontend (public/)
```
public/
├── index.html                ← SPA con Tailwind
└── js/app.js                 ← JavaScript vanilla
```

### 🗄️ Base de Datos (creada con seed)
```
data/
└── consultorio.db            ← SQLite (8 tablas)

logs/
└── audit-YYYY-MM-DD.log      ← Auditoría JSON
```

---

## 🔍 QUÉ BUSCAR EN CADA ARCHIVO

### Si quieres... → Mira...

| Necesidad | Archivo | Líneas |
|-----------|---------|--------|
| Levantar app rápido | QUICKSTART.md | 1-50 |
| Entender arquitectura | RESUMEN_EJECUTIVO.md | 1-100 |
| Instalar paso a paso | GUIA_INSTALACION.md | 1-150 |
| Ver esquema BD | ESQUEMA_BD.md | 1-100 |
| Configurar email | .env.local | 1-60 |
| Crear usuario | src/controllers/authController.ts | 10-50 |
| Validaciones | src/utils/validation.ts | 1-80 |
| Autenticación | src/middleware/auth.ts | 1-60 |
| Endpoints API | src/routes/index.ts | 1-80 |
| Base de datos | src/database/db.ts | 1-150 |
| Frontend login | public/js/app.js | 1-100 |
| Dashboard | public/index.html | 50-200 |

---

## 🚀 FLUJO TÍPICO DE USO

```
DÍA 1 - SETUP
├── Leer QUICKSTART.md (5 min)
├── npm install (2 min)
├── npm run seed (1 min)
├── npm run dev (1 min)
└── Probar login (5 min)

DÍA 2 - EXPLORACIÓN
├── Leer RESUMEN_EJECUTIVO.md (10 min)
├── Explorar cada rol en dashboard (30 min)
├── Crear nuevo usuario (5 min)
└── Probar recuperación contraseña (5 min)

DÍA 3 - ARQUITECTURA
├── Leer GUIA_INSTALACION.md (20 min)
├── Leer ESQUEMA_BD.md (15 min)
├── Revisar src/server.ts (10 min)
├── Revisar src/database/db.ts (15 min)
└── Revisar src/routes/index.ts (10 min)

DÍA 4 - CUSTOMIZACIÓN
├── Entender models (src/models/) (20 min)
├── Entender services (src/services/) (20 min)
├── Hacer pequeño cambio (30 min)
├── Probar cambio (10 min)
└── Documentar cambio (10 min)

DÍA 5+ - PRODUCCIÓN
├── Leer README_SETUP.md (30 min)
├── Configurar Gmail SMTP (15 min)
├── Hacer cambios necesarios (N horas)
├── Testing completo (N horas)
└── Deploy (N horas)
```

---

## 🎓 APRENDER DE CADA COMPONENTE

### TypeScript + Express
```typescript
// Ver: src/server.ts
- Configuración de Express
- Middleware chain
- Error handling
- CORS y Helmet
```

### Autenticación JWT
```typescript
// Ver: src/middleware/auth.ts
// Ver: src/utils/jwt.ts
- Generar tokens
- Verificar tokens
- RBAC (Role-Based Access Control)
- httpOnly cookies
```

### Validación Zod
```typescript
// Ver: src/utils/validation.ts
- Schemas tipados
- Validaciones complejas
- Error messages personalizados
```

### Base de Datos
```typescript
// Ver: src/database/db.ts
- Schema SQLite
- Relaciones (1:1, 1:N)
- Índices
- Foreign keys

// Ver: src/models/index.ts
- ORM básico (no usar Sequelize)
- Prepared statements
```

### Rutas y Controladores
```typescript
// Ver: src/routes/index.ts
- Definición de endpoints
- Protección con middleware

// Ver: src/controllers/
- Lógica de request/response
- Validación
- Status codes
```

### Servicios (Lógica Empresarial)
```typescript
// Ver: src/services/
- Separación de concerns
- Reutilización de lógica
- Manejo de excepciones
```

### Frontend Vanilla
```javascript
// Ver: public/js/app.js
- Fetch API
- Form validation
- Event listeners
- Tab switching
- Renderización dinámica
```

---

## 🐛 DEBUGGEAR PROBLEMAS

### Ver logs del servidor
```bash
# Los logs salen en la terminal donde ejecutas npm run dev
# Busca líneas rojas con ❌
```

### Ver logs de auditoría
```bash
cat logs/audit-2024-XX-XX.log

# O con grep (buscar usuario específico)
grep "admin@gmail.com" logs/audit-*.log
```

### Ver estado de base de datos
```bash
# Instalar sqlite3 globalmente
npm install -g sqlite3

# Conectar a BD
sqlite3 data/consultorio.db

# Ver tablas
.tables

# Ver usuarios
SELECT * FROM users;
```

### Revisar red (Chrome DevTools)
```
1. Abre http://localhost:3000
2. F12 para DevTools
3. Tab "Network"
4. Hacer login
5. Ver requests a /api/auth/login
```

---

## ✅ Verificación Rápida

```bash
# ✅ Verificar instalación
npm list express
npm list typescript
npm list better-sqlite3

# ✅ Verificar BD
ls -la data/

# ✅ Verificar servidor
curl http://localhost:3000/health

# ✅ Verificar login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"Admin2026#"}'
```

---

## 📊 RUTAS IMPORTANTES (30+ Total)

```
Públicas:
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/logout
  POST   /api/auth/forgot-password
  POST   /api/auth/reset-password

Protegidas (Autenticado):
  GET    /api/profile
  GET    /api/appointments
  POST   /api/appointments
  PUT    /api/appointments/:id
  GET    /api/clinical-records

Dentista:
  GET    /api/dentist/appointments

Admin:
  GET    /api/admin/users
  GET    /api/admin/users/:id
  PUT    /api/admin/users/:id
  DELETE /api/admin/users/:id

Health:
  GET    /health
```

---

## 💡 TIPS & TRICKS

```bash
# Recargar BD sin perder schema
rm data/consultorio.db
npm run seed

# Cambiar contraseña de test user
# 1. Abrir DB: sqlite3 data/consultorio.db
# 2. Hash new password con bcrypt
# 3. UPDATE users SET password_hash = '...'

# Ver todas las acciones de un usuario
grep '{"userId":1,' logs/audit-*.log | jq .

# Detener servidor + limpiar
pkill -f "npm run dev"
rm -r node_modules data logs

# Reinstalar todo
npm install && npm run seed && npm run dev
```

---

## 🚨 ARCHIVOS QUE NO DEBES MODIFICAR (Inicialmente)

```
❌ NO TOQUES:
- node_modules/           (generado)
- data/consultorio.db     (generado)
- logs/                   (generado)
- dist/                   (generado)

✅ SI MODIFICA:
- src/                    (backend)
- public/                 (frontend)
- .env                    (configuración)
- package.json            (solo agregar deps)
```

---

## 🎯 PRÓXIMOS PASOS TÍPICOS

### Para Aprender
1. Leer código de controllers
2. Entender cómo fluye una request
3. Hacer cambio pequeño (agregar campo)
4. Testing manual

### Para Customizar
1. Agregar columna a tabla
2. Agregar validación Zod
3. Agregar endpoint API
4. Agregar input HTML
5. Conectar con JavaScript

### Para Producción
1. Limpiar console.log()
2. Configurar HTTPS
3. Usar BD remota
4. Agregar monitoreo
5. Backup automático

---

## 🎓 RECURSOS ADICIONALES

```
Node.js: https://nodejs.org/docs/
Express: https://expressjs.com/
TypeScript: https://www.typescriptlang.org/docs/
SQLite: https://www.sqlite.org/docs.html
Zod: https://zod.dev/
JWT: https://jwt.io/
Bcrypt: https://github.com/dcodeIO/bcrypt.js
Tailwind: https://tailwindcss.com/
```

---

## ❓ FAQ Rápido

**P: ¿Cómo cambio el puerto?**  
R: Edita `.env` → `PORT=3001`

**P: ¿Cómo configuro email?**  
R: Lee `.env.local` (está explicado)

**P: ¿Dónde está la contraseña de la BD?**  
R: No hay. SQLite es local. En prod, usa PostgreSQL con password.

**P: ¿Cómo borro todo y empiezo de nuevo?**  
R: `rm -r data logs node_modules && npm install && npm run seed`

**P: ¿Puedo desplegar a producción ya?**  
R: Casi. Lee "Importante para Producción" en RESUMEN_EJECUTIVO.md

---

**¡Cualquier duda, busca el archivo correspondiente arriba!** 🚀
