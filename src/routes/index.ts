import { Router } from 'express';
import { Database } from 'better-sqlite3';
import { AuthController } from '@controllers/authController.js';
import { AppointmentController, AdminController } from '@controllers/appointmentController.js';
import { authMiddleware, requireRole } from '@middleware/auth.js';

export function setupRoutes(app: any, db: Database) {
  const authController = new AuthController(db);
  const appointmentController = new AppointmentController(db);
  const adminController = new AdminController(db);

  // ==================== Rutas Públicas ====================
  const authRoutes = Router();

  authRoutes.post('/register', (req, res) => authController.register(req, res));
  authRoutes.post('/login', (req, res) => authController.login(req, res));
  authRoutes.post('/logout', (req, res) => authController.logout(req, res));
  authRoutes.post('/forgot-password', (req, res) => authController.requestPasswordReset(req, res));
  authRoutes.post('/reset-password', (req, res) => authController.resetPassword(req, res));

  // ==================== Rutas Protegidas ====================
  const protectedRoutes = Router();
  protectedRoutes.use(authMiddleware);

  // Perfil
  protectedRoutes.get('/profile', (req, res) => authController.getProfile(req, res));

  // Citas - Paciente
  protectedRoutes.get('/appointments', (req, res) => appointmentController.getMyAppointments(req, res));
  protectedRoutes.post('/appointments', (req, res) => appointmentController.createAppointment(req, res));

  // Citas - Odontólogo
  protectedRoutes.get(
    '/dentist/appointments',
    requireRole('dentist'),
    (req, res) => appointmentController.getDentistAppointments(req, res)
  );
  protectedRoutes.put(
    '/appointments/:appointmentId',
    (req, res) => appointmentController.updateAppointment(req, res)
  );

  // Registros clínicos
  protectedRoutes.get(
    '/clinical-records',
    (req, res) => appointmentController.getClinicalRecords(req, res)
  );

  // ==================== Rutas de Administrador ====================
  const adminRoutes = Router();
  adminRoutes.use(authMiddleware);
  adminRoutes.use(requireRole('admin'));

  adminRoutes.get('/users', (req, res) => adminController.listUsers(req, res));
  adminRoutes.get('/users/:userId', (req, res) => adminController.getUserById(req, res));
  adminRoutes.put('/users/:userId', (req, res) => adminController.updateUser(req, res));
  adminRoutes.delete('/users/:userId', (req, res) => adminController.deleteUser(req, res));

  // ==================== Registrar rutas ====================
  app.use('/api/auth', authRoutes);
  app.use('/api', protectedRoutes);
  app.use('/api/admin', adminRoutes);
}
