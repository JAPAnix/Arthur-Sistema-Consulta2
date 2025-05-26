// ------------------------------
// Funções para Agendamentos
// ------------------------------

const doctorsBySpecialty = {
    cardiologia: ["Dr. João Cardoso", "Dra. Maria Coração"],
    neurologia: ["Dr. Carlos Neurônio", "Dra. Neuza Sinapse"],
    pediatria: ["Dr. Pedro Pequeno", "Dra. Paula Criança"],
    ortopedia: ["Dr. Otávio Osso", "Dra. Olivia Coluna"],
    ginecologia: ["Dr. Gustavo Gineco", "Dra. Gabriela Mulher"]
};

let appointments = [];

function initAgendamentos() {
    const newAppointmentBtn = document.getElementById('newAppointmentBtn');
    const newAppointmentModal = document.getElementById('newAppointmentModal');
    const newAppointmentForm = document.getElementById('newAppointmentForm');
    const specialtySelect = document.getElementById('specialty');
    const doctorSelect = document.getElementById('doctor');
    const appointmentsList = document.getElementById('appointmentsList');
    const todayAppointmentsCount = document.getElementById('todayAppointmentsCount');
    const upcomingAppointmentsCount = document.getElementById('upcomingAppointmentsCount');
    const totalPatientsCount = document.getElementById('totalPatientsCount');

    if (!newAppointmentBtn) return; // Não está na página de agendamentos

    newAppointmentBtn.addEventListener('click', () => {
        newAppointmentModal.style.display = 'flex';
    });

    window.closeModal = function () {
        newAppointmentModal.style.display = 'none';
        newAppointmentForm.reset();
        doctorSelect.innerHTML = '<option value="">Selecione um Médico</option>';
    };

    specialtySelect.addEventListener('change', () => {
        const selectedSpecialty = specialtySelect.value;
        doctorSelect.innerHTML = '<option value="">Selecione um Médico</option>';
        if (doctorsBySpecialty[selectedSpecialty]) {
            doctorsBySpecialty[selectedSpecialty].forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor;
                option.textContent = doctor;
                doctorSelect.appendChild(option);
            });
        }
    });

    newAppointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newAppointment = {
            patientName: document.getElementById('patientName').value.trim(),
            patientCPF: document.getElementById('patientCPF').value.trim(),
            specialty: specialtySelect.options[specialtySelect.selectedIndex]?.text || 'Não informado',
            doctor: doctorSelect.options[doctorSelect.selectedIndex]?.text || 'Não informado',
            appointmentDate: document.getElementById('appointmentDate').value,
            observations: document.getElementById('observations').value.trim()
        };

        appointments.push(newAppointment);
        renderAppointments();
        updateStats();
        closeModal();
    });

    function renderAppointments() {
        appointmentsList.innerHTML = '';
        appointments.forEach((appt, index) => {
            const apptDiv = document.createElement('div');
            apptDiv.className = 'appointment-item';
            apptDiv.style = `
                border: 1px solid #ddd;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            const apptInfo = document.createElement('div');
            apptInfo.innerHTML = `
                <strong>${appt.patientName || 'Não informado'}</strong><br>
                ${appt.specialty || 'Especialidade não informada'}<br>
                ${appt.doctor || 'Médico não informado'}<br>
                ${appt.appointmentDate ? formatDateTime(appt.appointmentDate) : 'Data não informada'}
            `;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-outline btn-delete';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', () => deleteAppointment(index));

            apptDiv.appendChild(apptInfo);
            apptDiv.appendChild(deleteBtn);

            appointmentsList.appendChild(apptDiv);
        });
    }

    function updateStats() {
        const today = new Date();
        let todayCount = 0;
        let upcomingCount = 0;

        appointments.forEach(appt => {
            const apptDate = new Date(appt.appointmentDate);
            if (isSameDay(apptDate, today)) todayCount++;
            if (apptDate > today) upcomingCount++;
        });

        todayAppointmentsCount.textContent = todayCount;
        upcomingAppointmentsCount.textContent = upcomingCount;
        totalPatientsCount.textContent = appointments.length;
    }

    function deleteAppointment(index) {
        if (confirm("Deseja realmente excluir este agendamento?")) {
            appointments.splice(index, 1);
            renderAppointments();
            updateStats();
        }
    }

    function isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    function formatDateTime(dateStr) {
        const date = new Date(dateStr);
        if (isNaN(date)) return 'Data inválida';
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    window.addEventListener('click', (e) => {
        if (e.target === newAppointmentModal) {
            closeModal();
        }
    });
}

// ------------------------------
// Funções para Médicos
// ------------------------------

const especialidades = ["Cardiologia", "Neurologia", "Pediatria", "Ortopedia", "Ginecologia"];
let medicos = [
    {
        nome: "Dr. João Silva",
        especialidade: "Cardiologia",
        crm: "123456",
        telefone: "(11) 91234-5678"
    },
    {
        nome: "Dra. Maria Oliveira",
        especialidade: "Pediatria",
        crm: "654321",
        telefone: "(21) 99876-5432"
    }
];

function initMedicos() {
    const formNovoMedico = document.getElementById('formNovoMedico');
    const formCadastrarMedico = document.getElementById('formCadastrarMedico');
    const especialidadeSelect = document.getElementById('especialidadeMedico');
    const nomeInput = document.getElementById('nomeMedico');
    const crmInput = document.getElementById('crmMedico');
    const telefoneInput = document.getElementById('telefoneMedico');
    const appointmentsList = document.querySelector('.appointments-list');

    if (!formNovoMedico) return; // Não está na página de médicos

    function preencherEspecialidades() {
        especialidadeSelect.innerHTML = '<option value="">Selecione uma Especialidade</option>';
        especialidades.forEach(esp => {
            const option = document.createElement('option');
            option.value = esp;
            option.textContent = esp;
            especialidadeSelect.appendChild(option);
        });
    }

    window.abrirFormularioMedico = function () {
        formNovoMedico.style.display = 'flex';
    };

    window.fecharFormulario = function () {
        formNovoMedico.style.display = 'none';
        formCadastrarMedico.reset();
    };

    function renderizarMedicos() {
        appointmentsList.innerHTML = '';

        medicos.forEach((medico, index) => {
            const card = document.createElement('div');
            card.className = 'appointment-card';

            const detalhes = document.createElement('div');
            detalhes.className = 'appointment-details';
            detalhes.innerHTML = `
                <h3>${medico.nome}</h3>
                <p>Especialidade: ${medico.especialidade}</p>
                <p>CRM: ${medico.crm}</p>
                <p>Telefone: ${medico.telefone}</p>
            `;

            const acoes = document.createElement('div');
            acoes.className = 'appointment-actions';

            const editarBtn = document.createElement('button');
            editarBtn.className = 'btn btn-outline';
            editarBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editarBtn.addEventListener('click', () => editarMedico(index));

            const excluirBtn = document.createElement('button');
            excluirBtn.className = 'btn btn-outline';
            excluirBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            excluirBtn.addEventListener('click', () => excluirMedico(index));

            acoes.appendChild(editarBtn);
            acoes.appendChild(excluirBtn);

            card.appendChild(detalhes);
            card.appendChild(acoes);

            appointmentsList.appendChild(card);
        });
    }

    formCadastrarMedico.addEventListener('submit', (e) => {
        e.preventDefault();

        const novoMedico = {
            nome: nomeInput.value.trim(),
            especialidade: especialidadeSelect.value,
            crm: crmInput.value.trim(),
            telefone: telefoneInput.value.trim()
        };

        medicos.push(novoMedico);
        renderizarMedicos();
        fecharFormulario();
    });

    function excluirMedico(index) {
        if (confirm("Deseja realmente excluir este médico?")) {
            medicos.splice(index, 1);
            renderizarMedicos();
        }
    }

    function editarMedico(index) {
        const medico = medicos[index];
        nomeInput.value = medico.nome;
        especialidadeSelect.value = medico.especialidade;
        crmInput.value = medico.crm;
        telefoneInput.value = medico.telefone;

        abrirFormularioMedico();

        medicos.splice(index, 1);
    }

    window.addEventListener('click', (e) => {
        if (e.target === formNovoMedico) {
            fecharFormulario();
        }
    });

    preencherEspecialidades();
    renderizarMedicos();
}

// ------------------------------
// Inicialização automática
// ------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initAgendamentos();
    initMedicos();
});
