import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

// Crear carpeta logs si no existe
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, `audit-${new Date().toISOString().split('T')[0]}.log`);

export interface AuditLogEntry {
  timestamp: string;
  userId: number | null;
  action: string;
  resourceType: string;
  resourceId: number | null;
  details: string;
  ipAddress: string;
  status: 'success' | 'error';
}

export function logAudit(entry: AuditLogEntry): void {
  const logEntry = JSON.stringify(entry) + '\n';
  fs.appendFileSync(logFile, logEntry);
}

export function logInfo(message: string): void {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] INFO: ${message}\n`;
  fs.appendFileSync(logFile, logEntry);
}

export function logError(message: string, error?: Error): void {
  const timestamp = new Date().toISOString();
  const errorDetails = error ? `\n${error.stack}` : '';
  const logEntry = `[${timestamp}] ERROR: ${message}${errorDetails}\n`;
  fs.appendFileSync(logFile, logEntry);
}

export function logWarning(message: string): void {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] WARNING: ${message}\n`;
  fs.appendFileSync(logFile, logEntry);
}
