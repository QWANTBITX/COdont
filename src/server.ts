import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import { initializeDatabase } from '@database/db.js';
import { setupRoutes } from '@routes/index.js';
import { errorHandler, notFoundHandler } from '@middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// ==================== Middleware de Seguridad ====================
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Demasiadas solicitudes, intenta más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: 'Demasiados intentos de login, intenta más tarde',
  skipSuccessfulRequests: true,
});

app.use(limiter);

// ==================== Middleware de Parseo ====================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// ==================== Servir archivos estáticos ====================
app.use(express.static(path.join(__dirname, '../public')));

// ==================== Inicializar Base de Datos ====================
console.log('🗄️  Inicializando base de datos...');
const db = initializeDatabase();
console.log('✅ Base de datos lista');

// ==================== Configurar Rutas ====================
console.log('🛣️  Configurando rutas...');
setupRoutes(app, db);

// ==================== Health Check ====================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== Rutas de Error ====================
app.use(notFoundHandler);
app.use(errorHandler);

// ==================== Iniciar Servidor ====================
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   🦷 CONSULTORIO ODONTOLÓGICO - SERVIDOR INICIADO 🦷      ║
╚═══════════════════════════════════════════════════════════╝

  🌐 Servidor: http://localhost:${PORT}
  📝 API: http://localhost:${PORT}/api
  💻 Frontend: Abierto en navegador
  
  📊 Endpoints principales:
    POST   /api/auth/register
    POST   /api/auth/login
    POST   /api/auth/logout
    POST   /api/auth/forgot-password
    POST   /api/auth/reset-password
    GET    /api/profile
    GET    /api/appointments
    GET    /api/clinical-records
    
  👨‍💼 Admin:
    GET    /api/admin/users
    GET    /api/admin/users/:userId
    PUT    /api/admin/users/:userId
    DELETE /api/admin/users/:userId
    
  ℹ️  Para datos de prueba, ejecuta: npm run seed
  
  ⚠️  CTRL+C para detener el servidor
  ════════════════════════════════════════════════════════════
  `);
});

export default app;
