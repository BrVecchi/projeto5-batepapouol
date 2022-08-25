let dados = [];

const mensagens = document.querySelector(".mensagens");
mensagens.innerHTML = "";
let mensagem = "";

const promessa = axios.get(
  "https://mock-api.driven.com.br/api/v6/uol/messages"
);
promessa.then(mensagensRecebidas);

function mensagensRecebidas(resposta) {
  console.log(resposta.data);
  dados = resposta.data;
  for (let i = 0; i < dados.length; i++) {
    const tipo = dados[i].type;
    const nome = dados[i].from;
    const post = dados[i].text;
    const horario = dados[i].time;
    const destinatario = dados[i].to;
    if (tipo === "status") {
      mensagem = `<li class='mensagem mensagem-${tipo}'> 
        <span class='textos-mensagem'>
            <span class='horario'>${horario}</span>
            <span class='nome'>${nome}</span>
            <span class='post'>${post}</span>
        </span>
    </li>`;
    } else {
      mensagem = `<li class='mensagem mensagem-${tipo}'> 
        <span class='textos-mensagem'>
            <span class='horario'>${horario}</span>
            <span class='nome'>${nome}</span>
            <span class='post'>para</span>
            <span class='nome'>${destinatario}:</span>
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
  requisicao.then(setInterval(requisicaoContinua, 5000));
  requisicao.catch(deuRuim);
  document.querySelector(".inicio-container").classList.add("hidden");
}

function requisicaoContinua() {
  const nome = document.querySelector(".inicio-input").value;
  const requisicao = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    { name: nome }
  );
  requisicao.then();
}

function deuRuim() {
  document.querySelector(".inicio-container").classList.remove("hidden");
  alert(
    "Já existe um usuário com esse nome. Por favor, escolha outro e tente novamente!"
  );
}
