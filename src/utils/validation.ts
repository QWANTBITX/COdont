import { z } from 'zod';

// Validaciones reutilizables
export const emailSchema = z
  .string()
  .email()
  .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'El email debe ser de Gmail (@gmail.com)');

export const passwordSchema = z
  .string()
  .min(7, 'Mínimo 7 caracteres')
  .regex(/^(?=.*[a-zA-Z])/, 'Debe contener letras')
  .regex(/^(?=.*\d)/, 'Debe contener números')
  .regex(/^(?=.*[#\$%&])/, 'Debe incluir al menos uno: # $ % &')
  .regex(/^[A-Za-z\d#$%&]{7,}$/, 'Solo letras, números y caracteres especiales permitidos: # $ % &');

export const phoneSchema = z.string().optional().refine(
  (val) => !val || /^\d{7,}$/.test(val),
  'Teléfono inválido'
);

// Esquemas de autenticación
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  fullName: z.string().min(3, 'Nombre muy corto').max(100),
  phone: phoneSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Contraseña requerida'),
});

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(3).optional(),
  phone: phoneSchema,
  dateOfBirth: z.string().optional(),
  gender: z.enum(['M', 'F', 'O']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: phoneSchema,
  allergies: z.string().optional(),
  currentMedications: z.string().optional(),
});

export const createAppointmentSchema = z.object({
  dentistId: z.number().positive(),
  appointmentDate: z.string().datetime(),
  duration_minutes: z.number().default(30),
  reason: z.string().max(500),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(['scheduled', 'completed', 'cancelled', 'no-show']),
  notes: z.string().optional(),
});

export const clinicalRecordSchema = z.object({
  appointmentId: z.number().positive(),
  diagnosis: z.string(),
  treatmentPlan: z.string(),
  odontogramData: z.string().optional(),
  prescription: z.string().optional(),
  notes: z.string().optional(),
  nextAppointmentDate: z.string().datetime().optional(),
});

export const userManagementSchema = z.object({
  email: emailSchema,
  role: z.enum(['admin', 'dentist', 'patient']),
  fullName: z.string().min(3),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
});

// Type exports
export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
export type PasswordReset = z.infer<typeof passwordResetSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type CreateAppointment = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointment = z.infer<typeof updateAppointmentSchema>;
export type ClinicalRecord = z.infer<typeof clinicalRecordSchema>;
export type UserManagement = z.infer<typeof userManagementSchema>;
