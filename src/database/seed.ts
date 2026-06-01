import { initializeDatabase } from './db.js';
import bcrypt from 'bcrypt';

const db = initializeDatabase();

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed de base de datos...');

    // Limpiar datos existentes (mantener estructura)
    db.exec(`
      DELETE FROM audit_logs;
      DELETE FROM password_resets;
      DELETE FROM clinical_records;
      DELETE FROM appointments;
      DELETE FROM dentists;
      DELETE FROM patients;
      DELETE FROM users;
    `);

    // Hash de contraseñas de prueba (cada usuario tiene una contraseña distinta)
    const hashedAdmin = await bcrypt.hash('IDEIOSDUEI#0$', 12);
    const hashedDentist1 = await bcrypt.hash('Dentist2026$', 12);
    const hashedDentist2 = await bcrypt.hash('Smile2026%', 12);
    const hashedQwaAdmin = await bcrypt.hash('QwaAdmin11#', 12);
    const hashedQwaUsuario = await bcrypt.hash('QwaUsuario11#', 12);
    const hashedPatient1 = await bcrypt.hash('Patient2026&', 12);
    const hashedPatient2 = await bcrypt.hash('Tooth2026#', 12);

    // Crear usuarios de prueba
    console.log('📝 Creando usuarios...');

    // Admin
    const adminStmt = db.prepare(`
      INSERT INTO users (email, password_hash, role, full_name, phone, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const adminId = (adminStmt.run(
      'IDEIOSDUEI@GMAIL.COM',
      hashedAdmin,
      'admin',
      'Dr. Administrador',
      '3224697869',
      'active'
    ) as any).lastInsertRowid;

    // Odontólogos
    const dentistStmt = db.prepare(`
      INSERT INTO users (email, password_hash, role, full_name, phone, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const dentist1Id = (dentistStmt.run(
      'dentist1@gmail.com',
      hashedDentist1,
      'dentist',
      'Dra. María García',
      '1111111111',
      'active'
    ) as any).lastInsertRowid;

    const dentist2Id = (dentistStmt.run(
      'dentist2@gmail.com',
      hashedDentist2,
      'dentist',
      'Dr. Carlos López',
      '2222222222',
      'active'
    ) as any).lastInsertRowid;

    // Pacientes
    const patientStmt = db.prepare(`
      INSERT INTO users (email, password_hash, role, full_name, phone, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const patient1Id = (patientStmt.run(
      'patient1@gmail.com',
      hashedPatient1,
      'patient',
      'Juan Pérez',
      '3333333333',
      'active'
    ) as any).lastInsertRowid;

    const patient2Id = (patientStmt.run(
      'patient2@gmail.com',
      hashedPatient2,
      'patient',
      'Ana Rodríguez',
      '4444444444',
      'active'
    ) as any).lastInsertRowid;

    const qwaAdminId = (patientStmt.run(
      'QwaAdmin@gmail.com',
      hashedQwaAdmin,
      'patient',
      'Qwa Admin',
      '3224697869',
      'active'
    ) as any).lastInsertRowid;

    const qwaUsuarioId = (patientStmt.run(
      'qwausuario@gmail.com',
      hashedQwaUsuario,
      'patient',
      'Qwa Usuario',
      '3143258995',
      'active'
    ) as any).lastInsertRowid;

    // Crear perfiles de pacientes
    console.log('👥 Creando perfiles de pacientes...');

    const patientProfileStmt = db.prepare(`
      INSERT INTO patients (user_id, date_of_birth, gender, document_id, address, city, 
        postal_code, emergency_contact_name, emergency_contact_phone, allergies, current_medications)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    patientProfileStmt.run(
      patient1Id,
      '1990-05-15',
      'M',
      '12345678',
      'Calle Principal 123',
      'Madrid',
      '28001',
      'Pedro Pérez',
      '5555555555',
      'Penicilina',
      'Ninguno'
    );

    patientProfileStmt.run(
      patient2Id,
      '1985-08-22',
      'F',
      '87654321',
      'Avenida Central 456',
      'Madrid',
      '28002',
      'Rosa Rodríguez',
      '6666666666',
      'Sulfamidas',
      'Metformina'
    );

    patientProfileStmt.run(
      qwaAdminId,
      '1992-02-14',
      'M',
      '11223344',
      'Calle Qwa 12',
      'Bogotá',
      '110111',
      'Mario Qwa',
      '3224697869',
      'Ninguna',
      'Ninguno'
    );

    patientProfileStmt.run(
      qwaUsuarioId,
      '1995-11-03',
      'F',
      '44332211',
      'Carrera 45 #67-89',
      'Medellín',
      '050010',
      'Laura Usuario',
      '3143258995',
      'Ninguna',
      'Ninguno'
    );

    // Crear perfiles de odontólogos
    console.log('🦷 Creando perfiles de odontólogos...');

    const dentistProfileStmt = db.prepare(`
      INSERT INTO dentists (user_id, license_number, specialization)
      VALUES (?, ?, ?)
    `);

    dentistProfileStmt.run(
      dentist1Id,
      'LIC-2024-001',
      'Odontología General'
    );

    dentistProfileStmt.run(
      dentist2Id,
      'LIC-2024-002',
      'Periodoncia y Ortodoncia'
    );

    // Crear citas
    console.log('📅 Creando citas...');

    const appointmentStmt = db.prepare(`
      INSERT INTO appointments (patient_id, dentist_id, appointment_date, duration_minutes, status, reason)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const now = new Date();
    const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 días

    const appt1Id = (appointmentStmt.run(
      1, // patient_id
      1, // dentist_id
      futureDate.toISOString(),
      30,
      'scheduled',
      'Limpieza y revisión general'
    ) as any).lastInsertRowid;

    // Crear histórico clínico
    console.log('📋 Creando registros clínicos...');

    const clinicalRecordStmt = db.prepare(`
      INSERT INTO clinical_records (appointment_id, patient_id, dentist_id, diagnosis, treatment_plan, odontogram_data, prescription, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    clinicalRecordStmt.run(
      appt1Id,
      1,
      1,
      'Placa bacteriana moderada, gingivitis leve',
      'Limpieza profesional, instrucciones de higiene oral',
      '{"teeth": [{"number": 11, "status": "healthy"}, {"number": 12, "status": "healthy"}]}',
      'Amoxicilina 500mg cada 8 horas por 7 días',
      'Paciente mejoró significativamente. Seguimiento en 3 meses.'
    );

    // Crear log de auditoría
    console.log('📊 Creando logs de auditoría...');

    const auditStmt = db.prepare(`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    auditStmt.run(
      adminId,
      'CREATE',
      'user',
      patient1Id,
      'Nuevo usuario creado en seed',
      '127.0.0.1'
    );

    console.log(`
✅ Seed completado exitosamente!

📊 Datos de prueba creados:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  👤 Usuarios:
    • Admin: IDEIOSDUEI@GMAIL.COM / IDEIOSDUEI#0$
    • Usuario: QwaAdmin@gmail.com / QwaAdmin11#
    • Usuario: qwausuario@gmail.com / QwaUsuario11#
    • Odontólogo 1: dentist1@gmail.com / Dentist2026$
    • Odontólogo 2: dentist2@gmail.com / Smile2026%
    • Paciente 1: patient1@gmail.com / Patient2026&
    • Paciente 2: patient2@gmail.com / Tooth2026#

  📅 Citas: 1 cita programada (en 7 días)
  📋 Registros clínicos: 1 registro
  📊 Logs de auditoría: 1 entrada
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Todos los usuarios de prueba tienen contraseñas distintas listadas arriba.
🔐 CAMBIAR antes de producción
    `);

    db.close();
  } catch (error) {
    console.error('❌ Error en seed:', error);
    db.close();
    process.exit(1);
  }
}

seedDatabase();
