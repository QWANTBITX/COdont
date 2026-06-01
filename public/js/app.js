// ==================== Configuración ====================
const API_BASE = 'http://localhost:3000/api';

// ==================== Estado Global ====================
let currentUser = null;
let currentToken = null;

// ==================== Validaciones ====================
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#\$%&])[A-Za-z\d#$%&]{7,}$/;

function validateEmail(email) {
  return emailRegex.test(email);
}

function validatePassword(password) {
  return passwordRegex.test(password);
}

function checkPasswordRequirements(password) {
  return {
    length: password.length >= 7,
    letter: /[a-zA-Z]/.test(password),
    number: /\d/.test(password),
    special: /[#$%&]/.test(password),
  };
}

function updatePasswordRequirements(password) {
  const reqs = checkPasswordRequirements(password);
  
  document.getElementById('req-length').className = reqs.length ? 'text-green-600' : 'text-red-600';
  document.getElementById('req-length').innerHTML = (reqs.length ? '✅' : '❌') + ' Mínimo 7 caracteres';
  
  document.getElementById('req-letter').className = reqs.letter ? 'text-green-600' : 'text-red-600';
  document.getElementById('req-letter').innerHTML = (reqs.letter ? '✅' : '❌') + ' Debe contener letras';
  
  document.getElementById('req-number').className = reqs.number ? 'text-green-600' : 'text-red-600';
  document.getElementById('req-number').innerHTML = (reqs.number ? '✅' : '❌') + ' Debe contener números';
  
  document.getElementById('req-special').className = reqs.special ? 'text-green-600' : 'text-red-600';
  document.getElementById('req-special').innerHTML = (reqs.special ? '✅' : '❌') + ' Debe incluir #, $, %, &';
}

// ==================== Tab Switching ====================
document.getElementById('login-tab').addEventListener('click', () => {
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('register-form').classList.add('hidden');
  document.getElementById('login-tab').classList.add('btn-gradient', 'text-white');
  document.getElementById('login-tab').classList.remove('text-gray-700', 'bg-white');
  document.getElementById('register-tab').classList.remove('btn-gradient', 'text-white');
  document.getElementById('register-tab').classList.add('text-gray-700', 'bg-white');
});

document.getElementById('register-tab').addEventListener('click', () => {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
  document.getElementById('register-tab').classList.add('btn-gradient', 'text-white');
  document.getElementById('register-tab').classList.remove('text-gray-700', 'bg-white');
  document.getElementById('login-tab').classList.remove('btn-gradient', 'text-white');
  document.getElementById('login-tab').classList.add('text-gray-700', 'bg-white');
});

// ==================== Monitoreo de Contraseña ====================
document.getElementById('register-form')?.querySelector('input[name="password"]')?.addEventListener('input', (e) => {
  updatePasswordRequirements(e.target.value);
});

// ==================== Login ====================
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = e.target.email.value.trim();
  const password = e.target.password.value;
  
  if (!validateEmail(email)) {
    showError('login-error', 'El email debe ser de Gmail (@gmail.com)');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      showError('login-error', data.error || 'Error al iniciar sesión');
      return;
    }
    
    currentUser = data.user;
    showDashboard();
    e.target.reset();
    document.getElementById('login-error').classList.add('hidden');
  } catch (error) {
    showError('login-error', 'Error de conexión');
  }
});

// ==================== Registro ====================
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fullName = e.target.fullName.value.trim();
  const email = e.target.email.value.trim();
  const phone = e.target.phone.value.trim();
  const password = e.target.password.value;
  const confirmPassword = e.target.confirmPassword.value;
  
  // Validaciones
  if (fullName.length < 3) {
    showError('register-error', 'El nombre debe tener al menos 3 caracteres');
    return;
  }
  
  if (!validateEmail(email)) {
    showError('register-error', 'El email debe ser de Gmail (@gmail.com)');
    return;
  }
  
  if (!validatePassword(password)) {
    showError('register-error', 'La contraseña no cumple los requisitos');
    return;
  }
  
  if (password !== confirmPassword) {
    showError('register-error', 'Las contraseñas no coinciden');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ fullName, email, phone, password, confirmPassword }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const errorMsg = data.details?.map(d => d.message).join(', ') || data.error;
      showError('register-error', errorMsg);
      return;
    }
    
    alert('¡Registro exitoso! Revisa tu email de Gmail.');
    document.getElementById('register-form').reset();
    document.getElementById('login-tab').click();
  } catch (error) {
    showError('register-error', 'Error de conexión');
  }
});

// ==================== Recuperación de Contraseña ====================
document.getElementById('forgot-password-btn').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('forgot-modal').classList.remove('hidden');
});

document.getElementById('forgot-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = e.target.email.value.trim();
  
  if (!validateEmail(email)) {
    document.getElementById('forgot-status').innerHTML = 
      '<span class="text-red-600">Email debe ser de Gmail</span>';
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    document.getElementById('forgot-status').innerHTML = 
      '<span class="text-green-600">Si el email existe, recibirás un enlace de recuperación</span>';
    
    setTimeout(() => {
      document.getElementById('forgot-modal').classList.add('hidden');
      e.target.reset();
    }, 3000);
  } catch (error) {
    document.getElementById('forgot-status').innerHTML = 
      '<span class="text-red-600">Error de conexión</span>';
  }
});

// ==================== Dashboard ====================
async function showDashboard() {
  document.getElementById('auth-page').classList.add('hidden');
  document.getElementById('dashboard-page').classList.remove('hidden');
  
  document.getElementById('user-name').textContent = currentUser.fullName || currentUser.email;
  const roleNames = { admin: 'Administrador', dentist: 'Odontólogo', patient: 'Paciente' };
  document.getElementById('user-role').textContent = roleNames[currentUser.role] || 'Usuario';

  const dashboardWelcome = document.getElementById('dashboard-welcome');
  if (dashboardWelcome) {
    dashboardWelcome.innerHTML = `
      <h2 class="text-3xl font-bold">Bienvenido a Codont, ${currentUser.fullName || currentUser.email}</h2>
      <p class="text-slate-100 mt-2">Has iniciado sesión correctamente. Revisa tus citas y recibe notificaciones por correo electrónico en cada inicio de sesión y cita programada.</p>
    `;
  }
  
  // Ocultar todos los paneles
  document.getElementById('patient-panel').classList.add('hidden');
  document.getElementById('dentist-panel').classList.add('hidden');
  document.getElementById('admin-panel').classList.add('hidden');
  
  // Mostrar el panel correspondiente
  if (currentUser.role === 'patient') {
    document.getElementById('patient-panel').classList.remove('hidden');
    loadPatientData();
  } else if (currentUser.role === 'dentist') {
    document.getElementById('dentist-panel').classList.remove('hidden');
    loadDentistData();
  } else if (currentUser.role === 'admin') {
    document.getElementById('admin-panel').classList.remove('hidden');
    loadAdminData();
  }
}

// ==================== Cargar Datos del Paciente ====================
async function loadPatientData() {
  try {
    const [appointmentsRes, recordsRes] = await Promise.all([
      fetch(`${API_BASE}/appointments`, {
        credentials: 'include',
      }),
      fetch(`${API_BASE}/clinical-records`, {
        credentials: 'include',
      }),
    ]);
    
    const appointmentsData = await appointmentsRes.json();
    const recordsData = await recordsRes.json();
    
    renderPatientAppointments(appointmentsData.appointments || []);
    renderPatientRecords(recordsData.records || []);
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

function renderPatientAppointments(appointments) {
  const container = document.getElementById('patient-appointments');
  
  if (appointments.length === 0) {
    container.innerHTML = '<div class="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">No tienes citas programadas</div>';
    return;
  }
  
  container.innerHTML = appointments.map(apt => `
    <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 slide-in">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-sm text-gray-600">
            <i class="fas fa-calendar mr-2"></i>
            ${new Date(apt.appointment_date).toLocaleDateString('es-ES', { 
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
          <p class="text-gray-700 mt-2">
            <i class="fas fa-user-md mr-2"></i>
            <strong>${apt.dentist_name}</strong>
          </p>
          <p class="text-gray-600 mt-1">
            <i class="fas fa-stethoscope mr-2"></i>
            ${apt.reason}
          </p>
        </div>
        <span class="px-3 py-1 rounded-full text-sm font-semibold ${
          apt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
          apt.status === 'completed' ? 'bg-green-100 text-green-800' :
          apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
        }">
          ${apt.status}
        </span>
      </div>
    </div>
  `).join('');
}

function renderPatientRecords(records) {
  const container = document.getElementById('patient-records');
  
  if (records.length === 0) {
    container.innerHTML = '<div class="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">No hay registros clínicos disponibles</div>';
    return;
  }
  
  container.innerHTML = records.map(record => `
    <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500 slide-in">
      <h4 class="font-semibold text-gray-900 mb-2">Diagnóstico</h4>
      <p class="text-gray-700 mb-4">${record.diagnosis}</p>
      
      <h4 class="font-semibold text-gray-900 mb-2">Plan de Tratamiento</h4>
      <p class="text-gray-700 mb-4">${record.treatment_plan}</p>
      
      ${record.prescription ? `
        <h4 class="font-semibold text-gray-900 mb-2">Prescripción</h4>
        <p class="text-gray-700 mb-4">${record.prescription}</p>
      ` : ''}
      
      <p class="text-xs text-gray-500">
        <i class="fas fa-calendar mr-1"></i>
        ${new Date(record.created_at).toLocaleDateString('es-ES')}
      </p>
    </div>
  `).join('');
}

// ==================== Cargar Datos del Odontólogo ====================
async function loadDentistData() {
  try {
    const response = await fetch(`${API_BASE}/dentist/appointments`, {
      credentials: 'include',
    });
    
    const data = await response.json();
    renderDentistAppointments(data.appointments || []);
  } catch (error) {
    console.error('Error al cargar citas:', error);
  }
}

function renderDentistAppointments(appointments) {
  const container = document.getElementById('dentist-appointments');
  
  if (appointments.length === 0) {
    container.innerHTML = '<div class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">No tienes citas programadas</div>';
    return;
  }
  
  container.innerHTML = appointments.map(apt => `
    <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500 slide-in">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-sm text-gray-600">
            <i class="fas fa-calendar mr-2"></i>
            ${new Date(apt.appointment_date).toLocaleDateString('es-ES', { 
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
          <p class="text-gray-700 mt-2">
            <i class="fas fa-user mr-2"></i>
            <strong>Paciente: ${apt.patient_name}</strong>
          </p>
          <p class="text-gray-600 mt-1">
            <i class="fas fa-file-alt mr-2"></i>
            ${apt.reason}
          </p>
        </div>
        <span class="px-3 py-1 rounded-full text-sm font-semibold ${
          apt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
          apt.status === 'completed' ? 'bg-green-100 text-green-800' :
          apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
        }">
          ${apt.status}
        </span>
      </div>
    </div>
  `).join('');
}

// ==================== Cargar Datos del Admin ====================
async function loadAdminData() {
  try {
    const response = await fetch(`${API_BASE}/admin/users`, {
      credentials: 'include',
    });
    
    const data = await response.json();
    renderAdminUsers(data.users || []);
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
}

function renderAdminUsers(users) {
  const container = document.getElementById('admin-users');
  
  if (users.length === 0) {
    container.innerHTML = '<div class="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">No hay usuarios</div>';
    return;
  }
  
  container.innerHTML = `
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <table class="w-full">
        <thead class="bg-gray-100 border-b-2 border-gray-300">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rol</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr class="border-b hover:bg-gray-50">
              <td class="px-6 py-3 text-sm text-gray-900">${user.email}</td>
              <td class="px-6 py-3 text-sm text-gray-700">${user.full_name}</td>
              <td class="px-6 py-3 text-sm">
                <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user.role === 'dentist' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }">
                  ${user.role}
                </span>
              </td>
              <td class="px-6 py-3 text-sm">
                <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }">
                  ${user.status}
                </span>
              </td>
              <td class="px-6 py-3 text-sm">
                <button class="text-blue-600 hover:underline mr-4">Editar</button>
                <button class="text-red-600 hover:underline">Eliminar</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ==================== Logout ====================
document.getElementById('logout-btn').addEventListener('click', async () => {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Error en logout:', error);
  }
  
  currentUser = null;
  document.getElementById('dashboard-page').classList.add('hidden');
  document.getElementById('auth-page').classList.remove('hidden');
  document.getElementById('login-form').reset();
});

// ==================== Funciones Auxiliares ====================
function showError(elementId, message) {
  const errorEl = document.getElementById(elementId);
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
  setTimeout(() => {
    errorEl.classList.add('hidden');
  }, 5000);
}

// ==================== Inicialización ====================
document.addEventListener('DOMContentLoaded', () => {
  // Verificar si ya está autenticado
  fetch(`${API_BASE}/profile`, {
    credentials: 'include',
  })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        currentUser = data.user;
        showDashboard();
      }
    })
    .catch(error => {
      // No autenticado, mostrar login
      console.log('No autenticado');
    });
});
