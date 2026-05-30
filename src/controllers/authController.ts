import { Request, Response } from 'express';
import { Database } from 'better-sqlite3';
import { AuthService } from '@services/index.js';
import {
  registerSchema,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
} from '@utils/validation.js';

export class AuthController {
  private authService: AuthService;

  constructor(db: Database) {
    this.authService = new AuthService(db);
  }

  async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);

      const result = await this.authService.register(
        validatedData.email,
        validatedData.password,
        validatedData.fullName,
        validatedData.phone || '',
        'patient'
      );

      res.status(201).json({
        message: 'Registro exitoso. Se envió un email de bienvenida.',
        user: result,
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

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);

      const ipAddress = req.ip || '127.0.0.1';
      const result = await this.authService.login(validatedData.email, validatedData.password, ipAddress);

      res.cookie('token', result.token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      });

      res.json({
        message: 'Login exitoso',
        user: result.user,
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

      res.status(401).json({ error: error.message });
    }
  }

  logout(req: Request, res: Response) {
    res.clearCookie('token');
    res.json({ message: 'Logout exitoso' });
  }

  async requestPasswordReset(req: Request, res: Response) {
    try {
      const validatedData = passwordResetRequestSchema.parse(req.body);

      const ipAddress = req.ip || '127.0.0.1';
      await this.authService.requestPasswordReset(validatedData.email, ipAddress);

      // No revelar si el email existe o no
      res.json({
        message: 'Si el email existe en nuestro sistema, recibirás un enlace de recuperación en tu bandeja de entrada.',
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

  async resetPassword(req: Request, res: Response) {
    try {
      const validatedData = passwordResetSchema.parse(req.body);

      const ipAddress = req.ip || '127.0.0.1';
      await this.authService.resetPassword(validatedData.token, validatedData.password, ipAddress);

      res.json({ message: 'Contraseña reseteada exitosamente' });
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

  getProfile(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    res.json({
      user: req.user,
    });
  }
}
