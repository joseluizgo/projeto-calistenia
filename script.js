const dias = ["segunda", "terca", "quarta", "sexta", "sabado"];

const treinos = {
  segunda: [
    { nome: "Flexão declinada", series: 4, reps: 12 },
    { nome: "Dips", series: 4, reps: "8-10" },
    { nome: "Pike push-up", series: 4, reps: 10 },
    { nome: "Flexão diamante", series: 3, reps: 12 },
    { nome: "Pseudo planche push-up", series: 3, reps: 8 },
    { nome: "Prancha", series: 3, reps: "45s" }
  ],
  terca: [
    { nome: "Barra fixa pronada", series: 4, reps: "6-8" },
    { nome: "Chin-up", series: 3, reps: "8-10" },
    { nome: "Barra australiana", series: 4, reps: 12 },
    { nome: "Negativa de barra", series: 3, reps: 5 },
    { nome: "Isometria na barra", series: 3, reps: "20s" },
    { nome: "Hollow body hold", series: 3, reps: "30s" }
  ],
  quarta: [
    { nome: "Agachamento profundo", series: 4, reps: 20 },
    { nome: "Afundo alternado", series: 4, reps: 12 },
    { nome: "Pistol squat assistido", series: 3, reps: 6 },
    { nome: "Bulgarian split squat", series: 3, reps: 10 },
    { nome: "Elevação de panturrilha", series: 4, reps: 20 },
    { nome: "Wall sit", series: 3, reps: "45s" }
  ],
  sexta: [
    { nome: "Barra fixa com pausa", series: 5, reps: 5 },
    { nome: "Dips com pausa", series: 5, reps: 5 },
    { nome: "Flexão explosiva", series: 4, reps: 6 },
    { nome: "Archer push-up", series: 3, reps: 6 },
    { nome: "Remada explosiva", series: 4, reps: 8 }
  ],
  sabado: [
    { nome: "Handstand prática", series: 1, reps: "15min" },
    { nome: "L-sit", series: 4, reps: "máx tempo" },
    { nome: "Dragon flag progressão", series: 3, reps: 6 },
    { nome: "Hanging leg raises", series: 4, reps: 10 },
    { nome: "Front lever tuck hold", series: 4, reps: "15s" }
  ]
};

function safeParse(item) {
  try { return JSON.parse(item) || []; } catch { return []; }
}

// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("dias")) {
    carregarDias();
    carregarPRs();
  }
  if (document.getElementById("lista-exercicios")) {
    carregarTreino();
    carregarNota();
  }
});

// FUNÇÕES DA TELA INICIAL (index.html)
function carregarDias() {
  const container = document.getElementById("dias");
  if (!container) return;
  container.innerHTML = "";
  
  let concluidos = 0;

  dias.forEach(dia => {
    const card = document.createElement("div");
    card.classList.add("card");
    
    if (localStorage.getItem(dia + "_done") === "true") {
      card.classList.add("concluido");
      concluidos++;
    }

    card.innerHTML = `<strong>${dia.charAt(0).toUpperCase() + dia.slice(1)}</strong>`;
    card.onclick = () => {
      localStorage.setItem("diaAtual", dia);
      window.location.href = "treino.html";
    };
    container.appendChild(card);
  });

  const progressoPercent = (concluidos / dias.length) * 100;
  document.getElementById("progress-bar-week").style.width = `${progressoPercent}%`;
  document.getElementById("progresso-semana").innerText = `Semana: ${concluidos}/${dias.length} treinos concluídos`;
}

function mudarAba(abaId, elementoBtn) {
  document.querySelectorAll('.aba-conteudo').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  
  document.getElementById(`aba-${abaId}`).classList.add('active');
  elementoBtn.classList.add('active');
}

function resetarSemana() {
  if (confirm("Deseja iniciar uma nova semana de treinos?")) {
    dias.forEach(dia => {
      localStorage.removeItem(dia);
      localStorage.removeItem(dia + "_done");
      localStorage.removeItem(dia + "_nota"); // Limpa o diário também
    });
    carregarDias();
  }
}

// FUNÇÕES DE MARCAS PESSOSAIS (PRs)
function salvarPR(id) {
  const valor = document.getElementById(id).value;
  localStorage.setItem(id, valor);
}

function carregarPRs() {
  const ids = ['pr-barras', 'pr-flexoes', 'pr-handstand', 'pr-frontlever'];
  ids.forEach(id => {
    const salvo = localStorage.getItem(id);
    if (salvo) document.getElementById(id).value = salvo;
  });
}

// FUNÇÕES DA TELA DE TREINO (treino.html)
function carregarTreino() {
  const dia = localStorage.getItem("diaAtual");
  if (!dia || !treinos[dia]) return;

  document.getElementById("titulo").innerText = dia.charAt(0).toUpperCase() + dia.slice(1);
  
  const lista = document.getElementById("lista-exercicios");
  let feitos = safeParse(localStorage.getItem(dia));

  const atualizarProgresso = () => {
    const total = treinos[dia].length;
    const completados = feitos.length;
    const porcentagem = (completados / total) * 100;
    
    document.getElementById("progress-bar-day").style.width = `${porcentagem}%`;
    document.getElementById("progresso-dia").innerText = `${completados} de ${total} exercícios`;
    
    localStorage.setItem(dia + "_done", completados === total ? "true" : "false");
  };

  treinos[dia].forEach((ex, index) => {
    const div = document.createElement("div");
    div.classList.add("exercicio");
    if (feitos.includes(index)) div.classList.add("feito");

    div.innerHTML = `
      <div class="exercicio-info">
        <strong>${ex.nome}</strong>
        <span>${ex.series} séries x ${ex.reps}</span>
      </div>
      <div class="checkbox-visual"></div>
    `;

    div.onclick = () => {
      if (feitos.includes(index)) {
        feitos = feitos.filter(i => i !== index);
        div.classList.remove("feito");
      } else {
        feitos.push(index);
        div.classList.add("feito");
      }
      localStorage.setItem(dia, JSON.stringify(feitos));
      atualizarProgresso();
    };
    lista.appendChild(div);
  });

  atualizarProgresso();
}

// CRONÔMETRO
let intervaloTimer;

function iniciarCronometro(segundos) {
  clearInterval(intervaloTimer);
  let tempo = segundos;
  atualizarDisplayCronometro(tempo);

  intervaloTimer = setInterval(() => {
    tempo--;
    atualizarDisplayCronometro(tempo);
    
    if (tempo <= 0) {
      clearInterval(intervaloTimer);
      alert("⏰ Tempo de descanso acabou! Bora pra próxima série!");
    }
  }, 1000);
}

function pararCronometro() {
  clearInterval(intervaloTimer);
  document.getElementById("tempo-restante").innerText = "00:00";
}

function atualizarDisplayCronometro(segundos) {
  const min = String(Math.floor(segundos / 60)).padStart(2, "0");
  const seg = String(segundos % 60).padStart(2, "0");
  document.getElementById("tempo-restante").innerText = `${min}:${seg}`;
}

// DIÁRIO
function salvarNota() {
  const dia = localStorage.getItem("diaAtual");
  const nota = document.getElementById("nota-dia").value;
  localStorage.setItem(dia + "_nota", nota);
  alert("Nota salva no seu diário! 📖");
}

function carregarNota() {
  const dia = localStorage.getItem("diaAtual");
  const notaSalva = localStorage.getItem(dia + "_nota");
  if (notaSalva) {
    document.getElementById("nota-dia").value = notaSalva;
  }
}

function voltar() {
  window.location.href = "index.html";
}