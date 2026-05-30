# 📊 Diagrama de Entidad-Relación (MER)

## Base de Datos: Consultorio Odontológico

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          MODELO DE DATOS SQLite                         │
└─────────────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════════════════════╗
║                              TABLA: users                                    ║
╠═════════════════┬════════════════╦════════════════════════════════════════════╣
║ id (PK)         │ INTEGER        ║ PRIMARY KEY AUTOINCREMENT                  ║
║ email (UQ)      │ TEXT           ║ UNIQUE, NOT NULL, @gmail.com              ║
║ password_hash   │ TEXT           ║ Bcrypt salted (12 rounds)                  ║
║ role            │ TEXT           ║ CHECK: admin | dentist | patient           ║
║ full_name       │ TEXT           ║ NOT NULL                                   ║
║ phone           │ TEXT           ║ Opcional                                   ║
║ status          │ TEXT           ║ active | inactive | suspended              ║
║ created_at      │ DATETIME       ║ DEFAULT CURRENT_TIMESTAMP                  ║
║ updated_at      │ DATETIME       ║ ON UPDATE CURRENT_TIMESTAMP                ║
║ INDEX: email    │                ║ Búsqueda rápida por email                  ║
║ INDEX: role     │                ║ Búsqueda por rol                           ║
╚═════════════════╩════════════════╩════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════════╗
║                            TABLA: patients                                   ║
╠═════════════════╦════════════════╦════════════════════════════════════════════╣
║ id (PK)         ║ INTEGER        ║ PRIMARY KEY AUTOINCREMENT                  ║
║ user_id (FK,UQ) ║ INTEGER        ║ FOREIGN KEY → users.id (1:1)               ║
║ date_of_birth   ║ DATE           ║ Opcional                                   ║
║ gender          ║ TEXT           ║ M | F | O                                  ║
║ document_id     ║ TEXT           ║ UNIQUE, Documento de identidad             ║
║ address         ║ TEXT           ║ Dirección                                  ║
║ city            ║ TEXT           ║ Ciudad                                     ║
║ postal_code     ║ TEXT           ║ Código postal                              ║
║ emergency_contact_name    ║ TEXT ║ Contacto de emergencia                     ║
║ emergency_contact_phone   ║ TEXT ║ Teléfono de emergencia                     ║
║ medical_history ║ TEXT           ║ Antecedentes médicos                       ║
║ allergies       ║ TEXT           ║ Alergias conocidas                         ║
║ current_medications ║ TEXT       ║ Medicamentos actuales                      ║
║ created_at      ║ DATETIME       ║ DEFAULT CURRENT_TIMESTAMP                  ║
║ updated_at      ║ DATETIME       ║ ON UPDATE CURRENT_TIMESTAMP                ║
║ INDEX: user_id  ║                ║ Relación con usuarios                      ║
╚═════════════════╩════════════════╩════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════════╗
║                            TABLA: dentists                                   ║
╠═════════════════╦════════════════╦════════════════════════════════════════════╣
║ id (PK)         ║ INTEGER        ║ PRIMARY KEY AUTOINCREMENT                  ║
║ user_id (FK,UQ) ║ INTEGER        ║ FOREIGN KEY → users.id (1:1)               ║
║ license_number  ║ TEXT           ║ UNIQUE, Número de cédula profesional       ║
║ specialization  ║ TEXT           ║ Especialidad (Periodontía, Ortodoncia)     ║
║ available_hours ║ TEXT (JSON)    ║ Horarios disponibles por día               ║
║ created_at      ║ DATETIME       ║ DEFAULT CURRENT_TIMESTAMP                  ║
║ updated_at      ║ DATETIME       ║ ON UPDATE CURRENT_TIMESTAMP                ║
║ INDEX: user_id  ║                ║ Relación con usuarios                      ║
╚═════════════════╩════════════════╩════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════════╗
║                         TABLA: appointments                                  ║
╠═════════════════╦════════════════╦════════════════════════════════════════════╣
║ id (PK)         ║ INTEGER        ║ PRIMARY KEY AUTOINCREMENT                  ║
║ patient_id (FK) ║ INTEGER        ║ FOREIGN KEY → patients.id (N:1)            ║
║ dentist_id (FK) ║ INTEGER        ║ FOREIGN KEY → dentists.id (N:1)            ║
║ appointment_date║ DATETIME       ║ Fecha y hora de la cita                    ║
║ duration_minutes║ INTEGER        ║ Duración en minutos (default: 30)          ║
║ status          ║ TEXT           ║ scheduled | completed | cancelled | no-show║
║ reason          ║ TEXT           ║ Motivo de la consulta                      ║
║ notes           ║ TEXT           ║ Notas adicionales                          ║
║ created_at      ║ DATETIME       ║ DEFAULT CURRENT_TIMESTAMP                  ║
║ updated_at      ║ DATETIME       ║ ON UPDATE CURRENT_TIMESTAMP                ║
║ INDEX: patient_id    ║           ║ Búsqueda por paciente                      ║
║ INDEX: dentist_id    ║           ║ Búsqueda por odontólogo                    ║
║ INDEX: status        ║           ║ Búsqueda por estado                        ║
║ INDEX: appointment_date ║        ║ Búsqueda por fecha/hora                    ║
╚═════════════════╩════════════════╩════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════════╗
║                      TABLA: clinical_records                                 ║
╠═════════════════╦════════════════╦════════════════════════════════════════════╣
║ id (PK)         ║ INTEGER        ║ PRIMARY KEY AUTOINCREMENT                  ║
║ appointment_id (FK)║ INTEGER     ║ FOREIGN KEY → appointments.id (1:1)        ║
║ patient_id (FK) ║ INTEGER        ║ FOREIGN KEY → patients.id (N:1)            ║
║ dentist_id (FK) ║ INTEGER        ║ FOREIGN KEY → dentists.id (N:1)            ║
║ diagnosis       ║ TEXT           ║ Diagnóstico realizado                      ║
║ treatment_plan  ║ TEXT           ║ Plan de tratamiento                        ║
║ odontogram_data ║ TEXT (JSON)    ║ Datos del odontograma                      ║
║ prescription    ║ TEXT           ║ Prescripción médica                        ║
║ notes           ║ TEXT           ║ Notas de evolución                         ║
║ next_appointment_date ║ DATETIME ║ Próxima cita sugerida                      ║
║ created_at      ║ DATETIME       ║ DEFAULT CURRENT_TIMESTAMP                  ║
║ updated_at      ║ DATETIME       ║ ON UPDATE CURRENT_TIMESTAMP                ║
║ INDEX: patient_id    ║           ║ Búsqueda por paciente                      ║
║ INDEX: appointment_id║           ║ Búsqueda por cita                          ║
╚═════════════════╩════════════════╩════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════════╗
║                      TABLA: password_resets                                  ║
╠═════════════════╦════════════════╦════════════════════════════════════════════╣
║ id (PK)         ║ INTEGER        ║ PRIMARY KEY AUTOINCREMENT                  ║
║ user_id (FK)    ║ INTEGER        ║ FOREIGN KEY → users.id (N:1)               ║
║ token_hash (UQ) ║ TEXT           ║ UNIQUE, Hash SHA256 del token              ║
║ expires_at      ║ DATETIME       ║ Fecha de expiración (15 minutos)           ║
║ used_at         ║ DATETIME       ║ Cuándo se usó (NULL si no se usó)          ║
║ created_at      ║ DATETIME       ║ DEFAULT CURRENT_TIMESTAMP                  ║
║ INDEX: user_id  ║                ║ Búsqueda por usuario                       ║
║ INDEX: expires_at   ║            ║ Limpieza de tokens expirados               ║
╚═════════════════╩════════════════╩════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════════╗
║                        TABLA: audit_logs                                     ║
╠═════════════════╦════════════════╦════════════════════════════════════════════╣
║ id (PK)         ║ INTEGER        ║ PRIMARY KEY AUTOINCREMENT                  ║
║ user_id (FK)    ║ INTEGER        ║ FOREIGN KEY → users.id (ON DELETE SET NULL)║
║ action          ║ TEXT           ║ CREATE, READ, UPDATE, DELETE, LOGIN        ║
║ resource_type   ║ TEXT           ║ Tipo de recurso afectado                   ║
║ resource_id     ║ INTEGER        ║ ID del recurso                             ║
║ details         ║ TEXT           ║ Detalles del cambio                        ║
║ ip_address      ║ TEXT           ║ Dirección IP del cliente                   ║
║ created_at      ║ DATETIME       ║ DEFAULT CURRENT_TIMESTAMP                  ║
║ INDEX: user_id  ║                ║ Auditoría por usuario                      ║
║ INDEX: created_at   ║            ║ Auditoría por fecha                        ║
╚═════════════════╩════════════════╩════════════════════════════════════════════╝
```

## 📋 Relaciones

```
                    ┌──────────────────────────┐
                    │       users              │
                    │  (id, email, role)       │
                    └──────────┬───────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                │ 1:1          │ 1:1          │ 1:N
                ↓              ↓              ↓
         ┌────────────┐ ┌────────────┐  ┌──────────────┐
         │ patients   │ │ dentists   │  │ audit_logs   │
         └─────┬──────┘ └─────┬──────┘  └──────────────┘
               │              │
               │ 1:N          │ 1:N
               ↓              ↓
         ┌──────────────────────────┐
         │    appointments          │
         │ (patient_id, dentist_id) │
         └────────────┬─────────────┘
                      │
                      │ 1:1
                      ↓
              ┌─────────────────┐
              │ clinical_records│
              └─────────────────┘
```

## 🔑 Restricciones de Integridad

```
✓ Foreign Keys activas (PRAGMA foreign_keys = ON)
✓ Cascade DELETE: Eliminando usuario → elimina paciente/odontólogo
✓ Cascade DELETE: Eliminando cita → elimina registro clínico
✓ Unique constraints: email, user_id (pacientes/odontólogos)
✓ Check constraints: role, status, appointment status
```

## 📈 Índices para Rendimiento

```
users:
  - idx_users_email      → Búsqueda por email (login)
  - idx_users_role       → Búsqueda por rol

patients:
  - idx_patients_user_id → Relación usuario-paciente

dentists:
  - idx_dentists_user_id → Relación usuario-odontólogo

appointments:
  - idx_appointments_patient_id    → Citas del paciente
  - idx_appointments_dentist_id    → Citas del odontólogo
  - idx_appointments_status        → Filtrar por estado
  - idx_appointments_date          → Filtrar por fecha

clinical_records:
  - idx_clinical_records_patient_id
  - idx_clinical_records_appointment_id

password_resets:
  - idx_password_resets_user_id
  - idx_password_resets_expires_at  → Limpiar tokens viejos

audit_logs:
  - idx_audit_logs_user_id
  - idx_audit_logs_created_at
```

## 💾 Datos de Ejemplo

```sql
-- Crear usuario (paciente)
INSERT INTO users (email, password_hash, role, full_name, phone, status)
VALUES ('paciente@gmail.com', 'bcrypt_hash', 'patient', 'Juan Pérez', '1234567890', 'active');

-- Crear perfil de paciente
INSERT INTO patients (user_id, date_of_birth, gender, city, allergies)
VALUES (1, '1990-05-15', 'M', 'Madrid', 'Penicilina');

-- Crear cita
INSERT INTO appointments (patient_id, dentist_id, appointment_date, reason, status)
VALUES (1, 1, '2024-12-15 10:30:00', 'Limpieza dental', 'scheduled');

-- Crear registro clínico
INSERT INTO clinical_records (appointment_id, patient_id, dentist_id, diagnosis, treatment_plan)
VALUES (1, 1, 1, 'Placa bacteriana', 'Limpieza profesional');

-- Registrar en auditoría
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address)
VALUES (1, 'CREATE', 'appointment', 1, 'Nueva cita creada', '127.0.0.1');
```

## ⚙️ Pragma SQLite

```sql
PRAGMA journal_mode = WAL;        -- Write-Ahead Logging (mejor concurrencia)
PRAGMA foreign_keys = ON;         -- Habilitar Foreign Keys
PRAGMA synchronous = NORMAL;      -- Balance velocidad/seguridad
PRAGMA cache_size = 10000;        -- Caché en memoria
PRAGMA temp_store = MEMORY;       -- Tablas temporales en memoria
```

---

Este esquema está optimizado para:
- ✅ Consultas frecuentes (login, listar citas)
- ✅ Escalabilidad inicial (hasta ~100K registros)
- ✅ Seguridad de datos (Foreign Keys, constraints)
- ✅ Auditoría completa (tabla de logs)
- ✅ Migración futura a PostgreSQL (sintaxis compatible)
