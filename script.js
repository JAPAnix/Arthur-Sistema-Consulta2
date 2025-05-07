// Lista para armazenar as consultas agendadas (se ainda não estiverem armazenadas)
let consultasAgendadas = JSON.parse(localStorage.getItem("consultasAgendadas")) || [];

// Função para agendar consulta
document.getElementById("form-agendamento").addEventListener("submit", function(event) {
  event.preventDefault();  // Impede o comportamento padrão de envio do formulário

  // Captura os dados do formulário
  const nome = document.getElementById("nome").value;
  const especialidade = document.getElementById("especialidade").value;
  const data = document.getElementById("data").value;

  // Cria um objeto para a consulta agendada
  const consulta = {
    nome: nome,
    especialidade: especialidade,
    data: data
  };

  // Adiciona a consulta à lista de consultas agendadas
  consultasAgendadas.push(consulta);

  // Armazenando as consultas no localStorage para persistência
  localStorage.setItem("consultasAgendadas", JSON.stringify(consultasAgendadas));

  // Redireciona para a página de consultas
  window.location.href = "consultas.html";
});

// Função para carregar as consultas agendadas na página 'consultas.html'
if (window.location.href.includes("consultas.html")) {
  const listaConsultas = document.getElementById("lista-consultas");

  if (consultasAgendadas.length > 0) {
    consultasAgendadas.forEach(consulta => {
      const divConsulta = document.createElement("div");
      divConsulta.classList.add("consulta");

      divConsulta.innerHTML = `
        <p><strong>Nome:</strong> ${consulta.nome}</p>
        <p><strong>Especialidade:</strong> ${consulta.especialidade}</p>
        <p><strong>Data e Hora:</strong> ${new Date(consulta.data).toLocaleString()}</p>
      `;
      
      listaConsultas.appendChild(divConsulta);
    });
  } else {
    listaConsultas.innerHTML = "<p>Nenhuma consulta agendada.</p>";
  }
}
