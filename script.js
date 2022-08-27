let dados = [];
let destinatarios = [];
let destinatariosUnicos = [];
let modos = [];

const mensagens = document.querySelector(".mensagens");
mensagens.innerHTML = "";
let mensagem = "";

const contatos = document.querySelector(".contatos-modal");
contatos.innerHTML = "";
let contato = "";

const footer = document.querySelector("footer");

function pegarMensagens() {
  const promessa = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  promessa.then(mostrarMenssagens);
}

function mostrarMenssagens(resposta) {
  dados = resposta.data;
  mensagens.innerHTML = "";
  const meuNome = document.querySelector(".inicio-input").value;
  for (let i = 0; i < dados.length; i++) {
    const tipo = dados[i].type;
    const nome = dados[i].from;
    const post = dados[i].text;
    const horario = dados[i].time;
    const destinatario = dados[i].to;
    destinatarios.push(nome);
    let ultimo;
    if (tipo === "status") {
      mensagem = `<li class='mensagem mensagem-${tipo} id${i}' > 
        <span class='textos-mensagem'>
            <span class='horario'>(${horario})</span>
            <span class='nome'>&nbsp${nome}&nbsp</span>
            <span class='post'>${post}</span>
        </span>
    </li>`;
    } else if (
      tipo === "private_message" &&
      destinatario !== meuNome &&
      nome !== meuNome
    ) {
      mensagem = `<li class='hidden mensagem mensagem-${tipo} id${i}' ></li>`;
    } else {
      mensagem = `<li class='mensagem mensagem-${tipo} id${i}' > 
        <span class='textos-mensagem'>
            <span class='horario'>(${horario})</span>
            <span class='nome'>&nbsp${nome}</span>
            <span class='post'>para</span>
            <span class='nome'>${destinatario}:&nbsp</span>
            <span class='post'>${post}</span>
        </span>
    </li>`;
    }
    mensagens.innerHTML = mensagens.innerHTML + mensagem;
    ultimo = document.querySelector(`.id${i}`);
    ultimo.scrollIntoView();
  }
  destinatariosUnicos = [...new Set(destinatarios)];
  destinatariosUnicos = destinatariosUnicos.filter(tirarMeuNome);
}

function tirarMeuNome(meuNome) {
  const nome = document.querySelector(".inicio-input").value;
  return meuNome !== nome;
}

function mostrarDestinatarios() {
  const destinatarioMarcado = document.querySelector(".dest-marcado");
  if (
    destinatarioMarcado === null ||
    destinatarioMarcado.parentElement.querySelector(".nome-modal").innerHTML ===
      "Todos"
  ) {
    contatos.innerHTML = `
    <li class="contato-modal" onclick="marcarDestinatario(this); atualizarAtivo()">
      <div class="separa-modal">
        <ion-icon class="icone-modal" name="people"></ion-icon>
        <p class="nome-modal">Todos</p>
      </div>
      <ion-icon class="icone-check hidden dest-marcado" name="checkmark-outline"></ion-icon>
    </li>`;
    for (let i = 0; i < destinatariosUnicos.length; i++) {
      contato = `
    <li class="contato-modal" onclick="marcarDestinatario(this); atualizarAtivo()">
      <div class="separa-modal">
        <ion-icon class="icone-modal" name="person-circle"></ion-icon>
        <p class="nome-modal">${destinatariosUnicos[i]}</p>
      </div>
      <ion-icon class="icone-check hidden" name="checkmark-outline"></ion-icon>
    </li>`;
      contatos.innerHTML = contatos.innerHTML + contato;
    }
  } else {
    contatos.innerHTML = `
    <li class="contato-modal" onclick="marcarDestinatario(this); atualizarAtivo()">
      <div class="separa-modal">
        <ion-icon class="icone-modal" name="people"></ion-icon>
        <p class="nome-modal">Todos</p>
      </div>
      <ion-icon class="icone-check hidden" name="checkmark-outline"></ion-icon>
    </li>`;
    for (let i = 0; i < destinatariosUnicos.length; i++) {
      if (
        destinatariosUnicos[i] !==
        destinatarioMarcado.parentElement.querySelector(".nome-modal").innerHTML
      ) {
        contato = `
    <li class="contato-modal" onclick="marcarDestinatario(this); atualizarAtivo()">
      <div class="separa-modal">
        <ion-icon class="icone-modal" name="person-circle"></ion-icon>
        <p class="nome-modal">${destinatariosUnicos[i]}</p>
      </div>
      <ion-icon class="icone-check hidden" name="checkmark-outline"></ion-icon>
    </li>`;
        contatos.innerHTML = contatos.innerHTML + contato;
      } else {
        contato = `
    <li class="contato-modal" onclick="marcarDestinatario(this); atualizarAtivo()">
      <div class="separa-modal">
        <ion-icon class="icone-modal" name="person-circle"></ion-icon>
        <p class="nome-modal">${destinatariosUnicos[i]}</p>
      </div>
      <ion-icon class="icone-check hidden dest-marcado" name="checkmark-outline"></ion-icon>
    </li>`;
        contatos.innerHTML = contatos.innerHTML + contato;
      }
    }
  }
}

function marcarDestinatario(contato) {
  if (document.querySelector(".dest-marcado") !== null) {
    document.querySelector(".dest-marcado").classList.remove("dest-marcado");
  }
  contato.querySelector(".icone-check").classList.add("dest-marcado");
}

function marcarModo(modo) {
  if (document.querySelector(".modo-marcado") !== null) {
    document.querySelector(".modo-marcado").classList.remove("modo-marcado");
  }
  modo.querySelector(".icone-check").classList.add("modo-marcado");
}

function atualizarAtivo() {
  const nomeDestinaratio = document
    .querySelector(".dest-marcado")
    .parentElement.querySelector(".nome-modal").innerHTML;
  const modo = document
    .querySelector(".modo-marcado")
    .parentElement.querySelector(".nome-modal").innerHTML;
  footer.innerHTML = "";
  if (nomeDestinaratio !== "Todos") {
    footer.innerHTML = `
    <div class="placeholder">
      <input type="text" class="input" placeholder="Escreva aqui..." />
      <p class="enviando">Enviando para ${nomeDestinaratio} (${modo})</p>
    </div>
    <ion-icon type="submit" class="icone-footer" name="paper-plane-outline" onclick="enviarMensagem()"></ion-icon>`;
  } else {
    footer.innerHTML = `
    <div class="placeholder">
      <input type="text" class="input" placeholder="Escreva aqui..." />
      <p class="enviando">Enviando para Todos</p>
    </div>
    <ion-icon type="submit" class="icone-footer" name="paper-plane-outline" onclick="enviarMensagem()"></ion-icon>`;
  }
}

function iniciar() {
  document.querySelector(".inicio-imagem").innerHTML =
    "<img src='./imgs/loading-bar.gif' alt='logo batepapo Uol' />";
  const nome = document.querySelector(".inicio-input").value;
  const requisicao = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    { name: nome }
  );
  requisicao.then(podeEntrar);
  requisicao.catch(usuarioErro);
}

function podeEntrar() {
  document.querySelector(".inicio-container").classList.add("hidden");
  requisicaoContinua();
  pegarMensagens();
  setTimeout(mostrarDestinatarios, 1000);
  setInterval(requisicaoContinua, 5000);
  setInterval(pegarMensagens, 3000);
  setInterval(mostrarDestinatarios, 10000);
}

function requisicaoContinua() {
  const nome = document.querySelector(".inicio-input").value;
  const dados = { name: nome };
  const requisicao = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    dados
  );
  requisicao.then(function () {
    console.log("tudo ok");
  });
  requisicao.catch(statusErro);
}

function usuarioErro() {
  alert(
    "Já existe um usuário com esse nome. Por favor, escolha outro e tente novamente!"
  );
}

function statusErro() {
  window.location.reload();
  alert("Desconectado por inatividade!");
}

function mensagensErro() {
  alert("Você digitou algo inapropriado. Sua mensagem não foi enviada!");
}

function enviarMensagem() {
  const nome = document.querySelector(".inicio-input").value;
  const texto = document.querySelector(".input").value;
  let destinatario = "Todos";
  let tipo = "message";
  const destMarcado = document.querySelector(".dest-marcado");
  destinatario =
    destMarcado.parentElement.querySelector(".nome-modal").innerHTML;
  const modoMarcado = document.querySelector(".modo-marcado");
  if (
    modoMarcado.parentElement.querySelector(".nome-modal").innerHTML ===
    "Reservado"
  ) {
    tipo = "private_message";
  }
  const dados = {
    from: nome,
    to: destinatario,
    text: texto,
    type: tipo,
  };
  const requisicao = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    dados
  );
  requisicao.then(atualizarMensagens);
  requisicao.catch(mensagensErro);
}

function atualizarMensagens() {
  pegarMensagens();
}

function toggleModal() {
  document.querySelector(".modal").classList.toggle("hidden");
}

function limparForm() {
  document.querySelector(".input").value = "";
}
