import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error | any, req: Request, res: Response, next: NextFunction) {
  console.error('❌ Error:', err);

  // Errores de validación
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validación fallida',
      details: err.errors,
    });
  }

  // Errores genéricos
  if (err.message) {
    return res.status(400).json({
      error: err.message,
    });
  }

  res.status(500).json({
    error: 'Error interno del servidor',
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
  });
}
