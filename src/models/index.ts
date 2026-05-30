import { Database } from 'better-sqlite3';

export class UserModel {
  constructor(private db: Database) {}

  findById(id: number) {
    const stmt = this.db.prepare('SELECT id, email, role, full_name, phone, status, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  }

  findByEmail(email: string) {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  create(email: string, passwordHash: string, role: string, fullName: string, phone?: string) {
    const stmt = this.db.prepare(`
      INSERT INTO users (email, password_hash, role, full_name, phone, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(email, passwordHash, role, fullName, phone || null, 'active');
  }

  update(id: number, data: any) {
    const keys = Object.keys(data).filter(k => data[k] !== undefined);
    if (keys.length === 0) return { changes: 0 };

    const setClause = keys.map(k => `${k.replace(/([A-Z])/g, '_$1').toLowerCase()} = ?`).join(', ');
    const values = keys.map(k => data[k]);

    const stmt = this.db.prepare(`UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    return stmt.run(...values, id);
  }

  findByRole(role: string) {
    const stmt = this.db.prepare('SELECT id, email, role, full_name, phone, status, created_at FROM users WHERE role = ?');
    return stmt.all(role);
  }

  delete(id: number) {
    const stmt = this.db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id);
  }
}

export class PatientModel {
  constructor(private db: Database) {}

  findByUserId(userId: number) {
    const stmt = this.db.prepare('SELECT * FROM patients WHERE user_id = ?');
    return stmt.get(userId);
  }

  create(userId: number, data: any) {
    const stmt = this.db.prepare(`
      INSERT INTO patients (user_id, date_of_birth, gender, document_id, address, city, 
        postal_code, emergency_contact_name, emergency_contact_phone, medical_history, allergies, current_medications)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      userId,
      data.dateOfBirth || null,
      data.gender || null,
      data.documentId || null,
      data.address || null,
      data.city || null,
      data.postalCode || null,
      data.emergencyContactName || null,
      data.emergencyContactPhone || null,
      data.medicalHistory || null,
      data.allergies || null,
      data.currentMedications || null
    );
  }

  update(userId: number, data: any) {
    const stmt = this.db.prepare(`
      UPDATE patients SET 
        date_of_birth = ?, gender = ?, address = ?, city = ?, postal_code = ?,
        emergency_contact_name = ?, emergency_contact_phone = ?, allergies = ?, current_medications = ?
      WHERE user_id = ?
    `);
    return stmt.run(
      data.dateOfBirth || null,
      data.gender || null,
      data.address || null,
      data.city || null,
      data.postalCode || null,
      data.emergencyContactName || null,
      data.emergencyContactPhone || null,
      data.allergies || null,
      data.currentMedications || null,
      userId
    );
  }
}

export class AppointmentModel {
  constructor(private db: Database) {}

  findById(id: number) {
    const stmt = this.db.prepare('SELECT * FROM appointments WHERE id = ?');
    return stmt.get(id);
  }

  findByPatientId(patientId: number, limit: number = 50) {
    const stmt = this.db.prepare(`
      SELECT a.*, u.full_name as dentist_name FROM appointments a
      JOIN dentists d ON a.dentist_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE a.patient_id = ? ORDER BY a.appointment_date DESC LIMIT ?
    `);
    return stmt.all(patientId, limit);
  }

  findByDentistId(dentistId: number, limit: number = 50) {
    const stmt = this.db.prepare(`
      SELECT a.*, u.full_name as patient_name FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE a.dentist_id = ? ORDER BY a.appointment_date DESC LIMIT ?
    `);
    return stmt.all(dentistId, limit);
  }

  create(patientId: number, dentistId: number, appointmentDate: string, durationMinutes: number, reason: string) {
    const stmt = this.db.prepare(`
      INSERT INTO appointments (patient_id, dentist_id, appointment_date, duration_minutes, reason, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(patientId, dentistId, appointmentDate, durationMinutes, reason, 'scheduled');
  }

  update(id: number, data: any) {
    const stmt = this.db.prepare(`
      UPDATE appointments SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    return stmt.run(data.status, data.notes || null, id);
  }

  checkConflict(dentistId: number, appointmentDate: string, durationMinutes: number) {
    const stmt = this.db.prepare(`
      SELECT * FROM appointments 
      WHERE dentist_id = ? 
      AND status != 'cancelled'
      AND datetime(appointment_date) <= datetime(?)
      AND datetime(datetime(appointment_date, '+' || duration_minutes || ' minutes')) > datetime(?)
      LIMIT 1
    `);
    return stmt.get(dentistId, appointmentDate, appointmentDate);
  }
}

export class ClinicalRecordModel {
  constructor(private db: Database) {}

  findByPatientId(patientId: number) {
    const stmt = this.db.prepare('SELECT * FROM clinical_records WHERE patient_id = ? ORDER BY created_at DESC');
    return stmt.all(patientId);
  }

  findByAppointmentId(appointmentId: number) {
    const stmt = this.db.prepare('SELECT * FROM clinical_records WHERE appointment_id = ?');
    return stmt.get(appointmentId);
  }

  create(appointmentId: number, patientId: number, dentistId: number, data: any) {
    const stmt = this.db.prepare(`
      INSERT INTO clinical_records (appointment_id, patient_id, dentist_id, diagnosis, treatment_plan, odontogram_data, prescription, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      appointmentId,
      patientId,
      dentistId,
      data.diagnosis,
      data.treatmentPlan,
      data.odontogramData || null,
      data.prescription || null,
      data.notes || null
    );
  }
}

export class PasswordResetModel {
  constructor(private db: Database) {}

  create(userId: number, tokenHash: string, expiresAt: Date) {
    const stmt = this.db.prepare(`
      INSERT INTO password_resets (user_id, token_hash, expires_at)
      VALUES (?, ?, ?)
    `);
    return stmt.run(userId, tokenHash, expiresAt.toISOString());
  }

  findByTokenHash(tokenHash: string) {
    const stmt = this.db.prepare(`
      SELECT * FROM password_resets WHERE token_hash = ? AND used_at IS NULL AND expires_at > CURRENT_TIMESTAMP
    `);
    return stmt.get(tokenHash);
  }

  markUsed(id: number) {
    const stmt = this.db.prepare('UPDATE password_resets SET used_at = CURRENT_TIMESTAMP WHERE id = ?');
    return stmt.run(id);
  }
}
