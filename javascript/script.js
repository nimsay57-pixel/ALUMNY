const conteudo = document.getElementById("conteudo");
const busca = document.getElementById("busca");
const botoes = document.querySelectorAll(".filtro");
const temaEsc = document.getElementById("temaEsc");

if (localStorage.getItem("tema") === "escuro"){
  document.documentElement.setAttribute("data-theme", "escuro");
  temaEsc.textContent = "☀️Modo claro";
  temaEsc.setAttribute("aria-pressed", "true");
}

temaEsc.addEventListener("click", () => {
  const estaEscuro = document.documentElement.getAttribute("data-theme") === "escuro";
  if (estaEscuro){
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("tema", "claro");
    temaEsc.textContent = "🌙 Modo escuro";
    temaEsc.setAttribute("aria-pressed", "false");
  } else {
    document.documentElement.setAttribute("data-theme", "escuro");
    localStorage.setItem("tema", "escuro");
    temaEsc.textContent = "☀️Modo claro";
    temaEsc.setAttribute("aria-pressed", "true");
  }
    })


let ACERVO = [];
let categoriaAtiva = "todos";

const nomesCategoria = { sites: "Sites", documentos: "Documentos", jogos: "Jogos" };

fetch("dados.json")
  .then(resposta => {
    if (!resposta.ok) throw new Error("Não foi possível carregar dados.json");
    return resposta.json();
  })
  .then(dados => {
    ACERVO = dados;
    renderizar();
  })
  .catch(erro => {
    conteudo.innerHTML = `<p class="vazio">Erro ao carregar os dados: ${erro.message}</p>`;
  });

function renderizar(){
  const termo = busca.value.trim().toLowerCase();

  let itens = ACERVO.filter(item => {
    const passaCategoria = categoriaAtiva === "todos" || item.categoria === categoriaAtiva;
    const passaBusca = !termo ||
      item.titulo.toLowerCase().includes(termo) ||
      item.desc.toLowerCase().includes(termo);
    return passaCategoria && passaBusca;
  });

  conteudo.innerHTML = "";

  if(itens.length === 0){
    conteudo.innerHTML = '<p class="vazio">Nenhum item encontrado.</p>';
    return;
  }

  const grupos = {};
  itens.forEach(item => {
    if(!grupos[item.categoria]) grupos[item.categoria] = [];
    grupos[item.categoria].push(item);
  });

  Object.keys(grupos).forEach(cat => {
    const secao = document.createElement("section");
    secao.className = "grupo";

    const titulo = document.createElement("h2");
    titulo.textContent = nomesCategoria[cat] || cat;
    secao.appendChild(titulo);

    const lista = document.createElement("div");
    lista.className = "lista";

    grupos[cat].forEach(item => {
      const a = document.createElement("a");
      a.className = "item";
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.innerHTML = `<strong>${item.titulo}</strong><span>${item.desc}</span>`;
      lista.appendChild(a);
    });

    secao.appendChild(lista);
    conteudo.appendChild(secao);
  });
}

busca.addEventListener("input", renderizar);

botoes.forEach(btn => {
  btn.addEventListener("click", () => {
    botoes.forEach(b => b.setAttribute("aria-pressed", "false"));
    btn.setAttribute("aria-pressed", "true");
    categoriaAtiva = btn.dataset.cat;
    renderizar();
  });
});
