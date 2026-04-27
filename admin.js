document.addEventListener('DOMContentLoaded', () => {
    const patientTableBody = document.getElementById('patientTableBody');
    const patientForm = document.getElementById('patientForm');
    const modalOverlay = document.getElementById('modalOverlay');
    const openAddModalBtn = document.getElementById('openAddModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    
    // Initial Data
    let patients = JSON.parse(localStorage.getItem('patients')) || [
        { id: 1, name: 'Carlos Ruiz', email: 'carlos@ejemplo.com', phone: '555-0101', date: '2024-04-20' },
        { id: 2, name: 'Ana Martínez', email: 'ana@ejemplo.com', phone: '555-0102', date: '2024-04-21' }
    ];

    // Render Table
    function renderTable() {
        patientTableBody.innerHTML = '';
        patients.forEach(patient => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${patient.name}</strong></td>
                <td>${patient.email}</td>
                <td>${patient.phone}</td>
                <td>${patient.date}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editPatient(${patient.id})">✏️</button>
                    <button class="action-btn btn-delete" onclick="deletePatient(${patient.id})">🗑️</button>
                </td>
            `;
            patientTableBody.appendChild(row);
        });
        localStorage.setItem('patients', JSON.stringify(patients));
    }

    // Modal Control
    openAddModalBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Agregar Paciente';
        patientForm.reset();
        document.getElementById('patientId').value = '';
        modalOverlay.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    // CRUD: Create & Update
    patientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('patientId').value;
        const name = document.getElementById('modalName').value;
        const email = document.getElementById('modalEmail').value;
        const phone = document.getElementById('modalPhone').value;

        if (id) {
            // Update
            const index = patients.findIndex(p => p.id == id);
            patients[index] = { ...patients[index], name, email, phone };
        } else {
            // Create
            const newPatient = {
                id: Date.now(),
                name,
                email,
                phone,
                date: new Date().toISOString().split('T')[0]
            };
            patients.push(newPatient);
        }

        renderTable();
        modalOverlay.classList.remove('active');
    });

    // CRUD: Delete
    window.deletePatient = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
            patients = patients.filter(p => p.id !== id);
            renderTable();
        }
    };

    // CRUD: Edit (Load into modal)
    window.editPatient = (id) => {
        const patient = patients.find(p => p.id === id);
        if (patient) {
            modalTitle.textContent = 'Editar Paciente';
            document.getElementById('patientId').value = patient.id;
            document.getElementById('modalName').value = patient.name;
            document.getElementById('modalEmail').value = patient.email;
            document.getElementById('modalPhone').value = patient.phone;
            modalOverlay.classList.add('active');
        }
    };

    renderTable();
});
