let dados = [];

const mensagens = document.querySelector(".mensagens");
mensagens.innerHTML = "";
let mensagem = "";

function pegarMensagens() {
  const promessa = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  promessa.then(mensagensRecebidas);
}
setInterval(pegarMensagens, 3000);

function mensagensRecebidas(resposta) {
  dados = resposta.data;
  mensagens.innerHTML = "";
  for (let i = 0; i < dados.length; i++) {
    const tipo = dados[i].type;
    const nome = dados[i].from;
    const post = dados[i].text;
    const horario = dados[i].time;
    const destinatario = dados[i].to;
    if (tipo === "status") {
      mensagem = `<li class='mensagem mensagem-${tipo}'> 
        <span class='textos-mensagem'>
            <span class='horario'>(${horario})</span>
            <span class='nome'>&nbsp${nome}&nbsp</span>
            <span class='post'>${post}</span>
        </span>
    </li>`;
    } else {
      mensagem = `<li class='mensagem mensagem-${tipo}'> 
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
  }
}

function iniciar() {
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
  setInterval(requisicaoContinua, 5000);
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
  const dados = {
    from: nome,
    to: "Todos",
    text: texto,
    type: "message",
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
