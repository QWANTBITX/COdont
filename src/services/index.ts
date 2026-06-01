import bcrypt from 'bcrypt';
import { Database } from 'better-sqlite3';
import {
  UserModel,
  PatientModel,
  AppointmentModel,
  ClinicalRecordModel,
  PasswordResetModel,
} from '@models/index.js';
import { generateToken, generateResetToken, hashResetToken } from '@utils/jwt.js';
import {
  sendEmail,
  generatePasswordResetEmail,
  generateWelcomeEmail,
  generateLoginNotificationEmail,
  generateAppointmentNotificationEmail,
} from './emailService.js';
import { logAudit } from '@utils/logger.js';

export class AuthService {
  private userModel: UserModel;
  private patientModel: PatientModel;
  private passwordResetModel: PasswordResetModel;

  constructor(private db: Database) {
    this.userModel = new UserModel(db);
    this.patientModel = new PatientModel(db);
    this.passwordResetModel = new PasswordResetModel(db);
  }

  async register(
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: string = 'patient'
  ) {
    try {
      // Verificar si el email ya existe
      const existingUser = this.userModel.findByEmail(email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Hash de la contraseña
      const passwordHash = await bcrypt.hash(password, 12);

      // Crear usuario
      const result = this.userModel.create(email, passwordHash, role, fullName, phone);
      const userId = (result as any).lastInsertRowid;

      // Si es paciente, crear perfil de paciente
      if (role === 'patient') {
        this.patientModel.create(userId, {});
      }

      // Log de auditoría
      logAudit({
        timestamp: new Date().toISOString(),
        userId: userId,
        action: 'REGISTER',
        resourceType: 'user',
        resourceId: userId,
        details: `Usuario ${email} registrado`,
        ipAddress: '127.0.0.1',
        status: 'success',
      });

      // Enviar email de bienvenida
      const loginUrl = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/login`;
      const emailContent = generateWelcomeEmail(fullName, loginUrl, role);
      await sendEmail({
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      return { userId, email, fullName, role };
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string, ipAddress: string) {
    try {
      const user = this.userModel.findByEmail(email);

      if (!user) {
        logAudit({
          timestamp: new Date().toISOString(),
          userId: null,
          action: 'LOGIN_FAILED',
          resourceType: 'user',
          resourceId: null,
          details: `Intento de login con email no existente: ${email}`,
          ipAddress,
          status: 'error',
        });
        throw new Error('Email o contraseña incorrectos');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        logAudit({
          timestamp: new Date().toISOString(),
          userId: user.id,
          action: 'LOGIN_FAILED',
          resourceType: 'user',
          resourceId: user.id,
          details: 'Contraseña incorrecta',
          ipAddress,
          status: 'error',
        });
        throw new Error('Email o contraseña incorrectos');
      }

      if (user.status !== 'active') {
        throw new Error('La cuenta está inactiva o suspendida');
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      logAudit({
        timestamp: new Date().toISOString(),
        userId: user.id,
        action: 'LOGIN_SUCCESS',
        resourceType: 'user',
        resourceId: user.id,
        details: 'Login exitoso',
        ipAddress,
        status: 'success',
      });

      const loginDate = new Date().toLocaleString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      const emailContent = generateLoginNotificationEmail(user.full_name || user.email, loginDate);
      await sendEmail({
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      return { token, user: { id: user.id, email: user.email, role: user.role, fullName: user.full_name } };
    } catch (error) {
      throw error;
    }
  }

  async requestPasswordReset(email: string, ipAddress: string) {
    try {
      const user = this.userModel.findByEmail(email);

      if (!user) {
        // No revelar si el email existe o no
        return { success: true };
      }

      const { token, hash, expiresAt } = generateResetToken();
      this.passwordResetModel.create(user.id, hash, expiresAt);

      const resetLink = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/reset-password?token=${token}`;
      const emailContent = generatePasswordResetEmail(user.full_name, resetLink);

      await sendEmail({
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      logAudit({
        timestamp: new Date().toISOString(),
        userId: user.id,
        action: 'PASSWORD_RESET_REQUESTED',
        resourceType: 'user',
        resourceId: user.id,
        details: `Solicitud de recuperación de contraseña`,
        ipAddress,
        status: 'success',
      });

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string, ipAddress: string) {
    try {
      const hash = hashResetToken(token);
      const resetRecord = this.passwordResetModel.findByTokenHash(hash);

      if (!resetRecord) {
        throw new Error('Token inválido o expirado');
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 12);
      this.userModel.update(resetRecord.user_id, { passwordHash: newPasswordHash });
      this.passwordResetModel.markUsed(resetRecord.id);

      logAudit({
        timestamp: new Date().toISOString(),
        userId: resetRecord.user_id,
        action: 'PASSWORD_RESET_SUCCESS',
        resourceType: 'user',
        resourceId: resetRecord.user_id,
        details: 'Contraseña reseteada exitosamente',
        ipAddress,
        status: 'success',
      });

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

export class AppointmentService {
  private appointmentModel: AppointmentModel;
  private patientModel: PatientModel;
  private userModel: UserModel;

  constructor(private db: Database) {
    this.appointmentModel = new AppointmentModel(db);
    this.patientModel = new PatientModel(db);
    this.userModel = new UserModel(db);
  }

  getAppointmentsForPatient(userId: number) {
    const patient = this.patientModel.findByUserId(userId);
    if (!patient) throw new Error('Paciente no encontrado');

    return this.appointmentModel.findByPatientId(patient.id);
  }

  getAppointmentsForDentist(dentistId: number) {
    return this.appointmentModel.findByDentistId(dentistId);
  }

  async createAppointment(
    userId: number,
    dentistId: number,
    appointmentDate: string,
    durationMinutes: number,
    reason: string
  ) {
    const patient = this.patientModel.findByUserId(userId);
    if (!patient) throw new Error('Paciente no encontrado');

    // Verificar conflictos
    const conflict = this.appointmentModel.checkConflict(dentistId, appointmentDate, durationMinutes);
    if (conflict) {
      throw new Error('El odontólogo ya tiene una cita en esa fecha y hora');
    }

    const result = this.appointmentModel.create(patient.id, dentistId, appointmentDate, durationMinutes, reason);
    const appointmentId = (result as any).lastInsertRowid;

    const patientUser = this.userModel.findById(userId);
    const dentistUser = this.db
      .prepare('SELECT u.* FROM dentists d JOIN users u ON d.user_id = u.id WHERE d.id = ?')
      .get(dentistId);

    const formattedDate = new Date(appointmentDate).toLocaleString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    if (patientUser) {
      const patientEmailContent = generateAppointmentNotificationEmail(
        patientUser.full_name || patientUser.email,
        formattedDate,
        dentistUser?.full_name || 'Odontólogo asignado',
        patientUser.full_name || patientUser.email,
        'patient'
      );
      await sendEmail({
        to: patientUser.email,
        subject: patientEmailContent.subject,
        html: patientEmailContent.html,
      });
    }

    if (dentistUser) {
      const dentistEmailContent = generateAppointmentNotificationEmail(
        dentistUser.full_name || dentistUser.email,
        formattedDate,
        dentistUser.full_name || 'Odontólogo',
        patientUser.full_name || patientUser.email,
        'dentist'
      );
      await sendEmail({
        to: dentistUser.email,
        subject: dentistEmailContent.subject,
        html: dentistEmailContent.html,
      });
    }

    return result;
  }

  updateAppointment(appointmentId: number, status: string, notes?: string) {
    return this.appointmentModel.update(appointmentId, { status, notes });
  }
}

export class ClinicalRecordService {
  private clinicalRecordModel: ClinicalRecordModel;
  private appointmentModel: AppointmentModel;

  constructor(private db: Database) {
    this.clinicalRecordModel = new ClinicalRecordModel(db);
    this.appointmentModel = new AppointmentModel(db);
  }

  getRecordsForPatient(userId: number) {
    const patientModel = new PatientModel(this.db);
    const patient = patientModel.findByUserId(userId);
    if (!patient) throw new Error('Paciente no encontrado');

    return this.clinicalRecordModel.findByPatientId(patient.id);
  }

  createClinicalRecord(appointmentId: number, dentistId: number, data: any) {
    const appointment = this.appointmentModel.findById(appointmentId);
    if (!appointment) throw new Error('Cita no encontrada');

    return this.clinicalRecordModel.create(
      appointmentId,
      appointment.patient_id,
      dentistId,
      data
    );
  }
}
