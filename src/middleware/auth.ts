import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '@utils/jwt.js';
import { logAudit } from '@utils/logger.js';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Error de autenticación' });
  }
}

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logAudit({
        timestamp: new Date().toISOString(),
        userId: req.user.userId,
        action: 'ACCESS_DENIED',
        resourceType: 'route',
        resourceId: null,
        details: `Acceso denegado: usuario con rol ${req.user.role} intenta acceder a ${req.path}`,
        ipAddress: req.ip || '127.0.0.1',
        status: 'error',
      });

      return res.status(403).json({ error: 'Acceso prohibido' });
    }

    next();
  };
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        req.user = payload;
      }
    }

    next();
  } catch (error) {
    next();
  }
}
