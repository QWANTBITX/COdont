import { Request, Response } from 'express';
import { Database } from 'better-sqlite3';
import { AppointmentService, ClinicalRecordService } from '@services/index.js';
import { createAppointmentSchema, updateAppointmentSchema } from '@utils/validation.js';
import { UserModel } from '@models/index.js';

export class AppointmentController {
  private appointmentService: AppointmentService;
  private clinicalRecordService: ClinicalRecordService;
  private userModel: UserModel;

  constructor(db: Database) {
    this.appointmentService = new AppointmentService(db);
    this.clinicalRecordService = new ClinicalRecordService(db);
    this.userModel = new UserModel(db);
  }

  getMyAppointments(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const appointments = this.appointmentService.getAppointmentsForPatient(req.user.userId);

      res.json({
        appointments,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  getDentistAppointments(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const dentist = (this.userModel.findById(req.user.userId) as any) || {};

      const appointments = this.appointmentService.getAppointmentsForDentist(dentist.id);

      res.json({
        appointments,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async createAppointment(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const validatedData = createAppointmentSchema.parse(req.body);

      const result = this.appointmentService.createAppointment(
        req.user.userId,
        validatedData.dentistId,
        validatedData.appointmentDate,
        validatedData.duration_minutes,
        validatedData.reason
      );

      res.status(201).json({
        message: 'Cita creada exitosamente',
        appointmentId: (result as any).lastInsertRowid,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validación fallida',
          details: error.errors.map((e: any) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }

      res.status(400).json({ error: error.message });
    }
  }

  async updateAppointment(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const { appointmentId } = req.params;
      const validatedData = updateAppointmentSchema.parse(req.body);

      const result = this.appointmentService.updateAppointment(
        parseInt(appointmentId),
        validatedData.status,
        validatedData.notes
      );

      res.json({
        message: 'Cita actualizada exitosamente',
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validación fallida',
          details: error.errors.map((e: any) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }

      res.status(400).json({ error: error.message });
    }
  }

  getClinicalRecords(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const records = this.clinicalRecordService.getRecordsForPatient(req.user.userId);

      res.json({
        records,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export class AdminController {
  private userModel: UserModel;

  constructor(db: Database) {
    this.userModel = new UserModel(db);
  }

  listUsers(req: Request, res: Response) {
    try {
      const { role } = req.query;

      let users;
      if (role) {
        users = this.userModel.findByRole(role as string);
      } else {
        users = [];
      }

      res.json({ users });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  getUserById(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = this.userModel.findById(parseInt(userId));

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  updateUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { status, role } = req.body;

      this.userModel.update(parseInt(userId), {
        status: status || undefined,
        role: role || undefined,
      });

      res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      this.userModel.delete(parseInt(userId));

      res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
