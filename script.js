/* Funcionalidades e preenchimento dos conteúdos do site. */

function colocarTexto(id, texto) {
  const elemento = document.getElementById(id);
  if (elemento && typeof texto === "string") {
    elemento.textContent = texto;
  }
}

// Destaque na última expressão: preserva o visual quando trocamos os títulos.
function colocarTituloComDestaque(id, texto) {
  const elemento = document.getElementById(id);
  if (!elemento || typeof texto !== "string") return;
  const posicao = texto.lastIndexOf(" ");
  if (posicao === -1) {
    elemento.textContent = texto;
    return;
  }
  const primeiraParte = texto.slice(0, posicao + 1);
  const ultimaPalavra = texto.slice(posicao + 1);
  elemento.textContent = primeiraParte;
  const destaque = document.createElement("em");
  destaque.textContent = ultimaPalavra;
  elemento.appendChild(destaque);
}

function preencherTextos() {
  colocarTexto("hero-etiqueta", conteudo.hero.etiqueta);
  colocarTexto("hero-linha-1", conteudo.hero.linha1);
  colocarTexto("hero-linha-2", conteudo.hero.linha2);
  colocarTexto("hero-subtitulo", conteudo.hero.subtitulo);

  colocarTituloComDestaque("mensagem-titulo", conteudo.mensagem.titulo);
  colocarTexto("mensagem-resumo", conteudo.mensagem.resumo);
  colocarTexto("carta-saudacao", conteudo.mensagem.saudacao);
  colocarTexto("carta-paragrafo-1", conteudo.mensagem.paragrafo1);
  colocarTexto("carta-paragrafo-2", conteudo.mensagem.paragrafo2);
  colocarTexto("carta-assinatura", conteudo.mensagem.assinatura);

  colocarTituloComDestaque("galeria-titulo", conteudo.galeria.titulo);
  colocarTexto("galeria-subtitulo", conteudo.galeria.subtitulo);
  colocarTituloComDestaque("video-titulo", conteudo.video.titulo);
  colocarTexto("video-descricao", conteudo.video.descricao);
  colocarTituloComDestaque("recados-titulo", conteudo.recados.titulo);
  colocarTexto("recados-subtitulo", conteudo.recados.subtitulo);
  colocarTituloComDestaque("encerramento-titulo", conteudo.encerramento.titulo);
  colocarTexto("encerramento-mensagem", conteudo.encerramento.mensagem);
}

function preencherLogo() {
  if (!conteudo.logo) return;
  const emblema = document.getElementById("brand-emblem");
  const imagem = document.createElement("img");
  imagem.src = conteudo.logo;
  imagem.alt = "";
  imagem.onload = function () {
    emblema.replaceChildren(imagem);
    emblema.classList.add("brand-emblem-image");
  };
}

function preencherFotoPrincipal() {
  if (!conteudo.hero.fotoPrincipal) return;
  const local = document.getElementById("foto-principal");
  const imagem = document.createElement("img");
  imagem.className = "photo-loaded";
  imagem.src = conteudo.hero.fotoPrincipal;
  imagem.alt = conteudo.hero.fotoAlt || "Homenagem aos professores";
  imagem.onload = function () { local.replaceChildren(imagem); };
}

let fotoSelecionada = 0;
const fotosDaTimeline = conteudo.galeria.fotos;
function abrirFoto(indice) {
  fotoSelecionada = (indice + fotosDaTimeline.length) % fotosDaTimeline.length;
  const foto = fotosDaTimeline[fotoSelecionada];
  const modal = document.getElementById("lightbox");
  const imagem = document.getElementById("lightbox-imagem");
  imagem.src = foto.arquivo;
  imagem.alt = "Fotografia " + foto.numero + ": " + foto.palavra;
  colocarTexto("lightbox-legenda", foto.palavra + " — " + foto.legenda);
  colocarTexto("lightbox-contador", String(foto.numero).padStart(2,"0") + " / " + fotosDaTimeline.length);
  if (!modal.open && typeof modal.showModal === "function") modal.showModal();
}
function criarGaleria() {
  const grade = document.getElementById("grade-galeria");
  conteudo.galeria.fotos.forEach(function (foto, indice) {
    const item = document.createElement("li");
    item.className = "timeline-item reveal";
    item.id = "memoria-" + String(indice+1).padStart(2,"0");
    const marcador = document.createElement("span");
    marcador.className = "timeline-dot";
    marcador.setAttribute("aria-hidden", "true");
    marcador.textContent = "✦";
    const card = document.createElement("article");
    card.className = "timeline-card";
    const topo = document.createElement("div");
    topo.className = "timeline-card-header";
    const numeracao = document.createElement("span");
    numeracao.className = "timeline-number";
    numeracao.textContent = "MEMÓRIA " + String(foto.numero).padStart(2,"0") + " / " + fotosDaTimeline.length;
    const estrela = document.createElement("span");
    estrela.textContent = "✳";
    estrela.setAttribute("aria-hidden", "true");
    topo.append(numeracao, estrela);
    const botao = document.createElement("button");
    botao.className = "timeline-photo";
    botao.type = "button";
    botao.setAttribute("aria-label", "Ampliar fotografia " + foto.numero + ": " + foto.palavra);
    const imagem = document.createElement("img");
    imagem.src = foto.arquivo;
    imagem.alt = "Registro original recebido para a homenagem, foto " + foto.numero;
    imagem.loading = indice < 3 ? "eager" : "lazy";
    imagem.decoding = "async";
    botao.append(imagem);
    const ampliar = document.createElement("span");
    ampliar.className = "timeline-zoom";
    ampliar.setAttribute("aria-hidden","true");
    ampliar.textContent = "⤢ Ampliar";
    botao.append(ampliar);
    botao.addEventListener("click",function(){abrirFoto(indice);});
    const conteudo = document.createElement("div");
    conteudo.className = "timeline-card-copy";
    const palavra = document.createElement("h3");
    palavra.textContent = foto.palavra;
    const legenda = document.createElement("p");
    legenda.textContent = foto.legenda;
    conteudo.append(palavra,legenda);
    card.append(topo,botao,conteudo);
    item.append(marcador,card);
    grade.append(item);
  });
}

function obterLinkYouTube(url) {
  try {
    const link = new URL(url);
    let id = "";
    if (link.hostname === "youtu.be" || link.hostname === "www.youtu.be") {
      id = link.pathname.slice(1).split("/")[0];
    } else if (["youtube.com", "www.youtube.com", "m.youtube.com", "www.youtube-nocookie.com"].includes(link.hostname)) {
      id = link.searchParams.get("v") || "";
      if (!id && (link.pathname.startsWith("/shorts/") || link.pathname.startsWith("/embed/"))) {
        id = link.pathname.split("/")[2];
      }
    }
    if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return "https://www.youtube-nocookie.com/embed/" + id;
  } catch (erro) { return ""; }
  return "";
}

function preencherVideo() {
  const arquivo = conteudo.video.arquivo;
  if (!arquivo) return;
  const tela = document.getElementById("video-screen");
  const youtube = obterLinkYouTube(arquivo);
  let player;
  if (youtube) {
    player = document.createElement("iframe");
    player.src = youtube;
    player.title = "Vídeo especial — Dia dos Professores";
    player.loading = "lazy";
    player.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    player.allowFullscreen = true;
  } else {
    player = document.createElement("video");
    player.src = arquivo;
    player.controls = true;
    player.playsInline = true;
    player.preload = "metadata";
    player.poster = conteudo.video.capa || "";
    // O vídeo enviado foi gravado na vertical; o layout se ajusta automaticamente.
    player.addEventListener("loadedmetadata", function () {
      tela.classList.toggle("video-vertical", player.videoHeight > player.videoWidth);
    });
  }
  tela.replaceChildren(player);
}

function criarRecados() {
  const grade = document.getElementById("grade-recados");
  conteudo.recados.mensagens.forEach(function (recado) {
    const artigo = document.createElement("article");
    artigo.className = "note-card reveal";
    const topo = document.createElement("div");
    topo.className = "note-top";
    const numero = document.createElement("span");
    numero.textContent = "RECADO " + recado.numero;
    const estrela = document.createElement("span");
    estrela.textContent = "✳";
    estrela.setAttribute("aria-hidden", "true");
    topo.append(numero, estrela);
    const titulo = document.createElement("h3");
    titulo.textContent = recado.titulo;
    const texto = document.createElement("p");
    texto.textContent = recado.texto;
    const assinatura = document.createElement("span");
    assinatura.className = "note-signature";
    assinatura.textContent = recado.assinatura;
    artigo.append(topo, titulo, texto, assinatura);
    grade.appendChild(artigo);
  });
}

function configurarMenu() {
  const botao = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu-mobile");
  function fechar() {
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-label", "Abrir menu");
    menu.hidden = true;
  }
  botao.addEventListener("click", function () {
    const aberto = botao.getAttribute("aria-expanded") === "true";
    botao.setAttribute("aria-expanded", String(!aberto));
    botao.setAttribute("aria-label", aberto ? "Abrir menu" : "Fechar menu");
    menu.hidden = aberto;
  });
  menu.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", fechar); });
  document.addEventListener("keydown", function (evento) { if (evento.key === "Escape") fechar(); });
  window.addEventListener("resize", function () { if (window.innerWidth > 820) fechar(); });
}

function configurarLightbox() {
  const modal = document.getElementById("lightbox");
  document.getElementById("fechar-lightbox").addEventListener("click", function () { modal.close(); });
  modal.addEventListener("click", function (evento) { if (evento.target === modal) modal.close(); });
  document.getElementById("foto-anterior").addEventListener("click",function(){abrirFoto(fotoSelecionada-1)});
  document.getElementById("foto-proxima").addEventListener("click",function(){abrirFoto(fotoSelecionada+1)});
  document.addEventListener("keydown",function(evento){
    if(!modal.open)return;
    if(evento.key==="ArrowLeft")abrirFoto(fotoSelecionada-1);
    if(evento.key==="ArrowRight")abrirFoto(fotoSelecionada+1);
  });
  let inicioToque = null;
  modal.addEventListener("touchstart",function(evento){inicioToque=evento.touches[0].clientX;},{passive:true});
  modal.addEventListener("touchend",function(evento){
    if(inicioToque===null)return;
    const distancia=evento.changedTouches[0].clientX-inicioToque;
    if(Math.abs(distancia)>65)abrirFoto(fotoSelecionada + (distancia<0 ? 1 : -1));
    inicioToque=null;
  },{passive:true});
}

function configurarAnimacoes() {
  const elementos = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elementos.forEach(function (elemento) { elemento.classList.add("visible"); });
    return;
  }
  const observador = new IntersectionObserver(function (itens) {
    itens.forEach(function (item) {
      if (item.isIntersecting) {
        item.target.classList.add("visible");
        observador.unobserve(item.target);
      }
    });
  }, { threshold: 0.10 });
  elementos.forEach(function (elemento) { observador.observe(elemento); });
}

function configurarProgresso() {
  const barra = document.getElementById("barra-progresso");
  let agendado = false;
  function atualizar() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const percentual = total > 0 ? window.scrollY / total * 100 : 0;
    barra.style.width = Math.min(100, Math.max(0, percentual)) + "%";
    agendado = false;
  }
  window.addEventListener("scroll", function () {
    if (!agendado) {
      agendado = true;
      window.requestAnimationFrame(atualizar);
    }
  }, { passive: true });
  atualizar();
}

preencherTextos();
preencherLogo();
preencherFotoPrincipal();
criarGaleria();
preencherVideo();
criarRecados();
configurarMenu();
configurarLightbox();
configurarAnimacoes();
configurarProgresso();
configurarAudioHomenagem();


// EXPERIÊNCIA DE BOAS-VINDAS E ÁUDIO DE FUNDO
// Os navegadores bloqueiam áudio automático com som antes de um gesto do visitante.
function configurarAudioHomenagem() {
  const dialogo = document.getElementById("abertura-homenagem");
  const audio = document.getElementById("audio-homenagem");
  const entrarComSom = document.getElementById("entrar-com-audio");
  const entrarSemSom = document.getElementById("entrar-sem-audio");
  const botaoPlay = document.getElementById("audio-botao-play");
  const botaoSom = document.getElementById("audio-botao-som");
  const iconePlay = document.getElementById("audio-icon-play");
  const iconePause = document.getElementById("audio-icon-pause");
  const iconeVolume = document.getElementById("audio-icon-volume");
  const iconeMudo = document.getElementById("audio-icon-muted");
  const progresso = document.getElementById("audio-progresso");
  const tempoAtual = document.getElementById("audio-tempo-atual");
  const tempoTotal = document.getElementById("audio-tempo-total");
  const status = document.getElementById("audio-status");
  const botaoNativo = document.getElementById("audio-reprodutor-padrao");
  const painelAudio = document.getElementById("painel-audio");

  function formatarTempo(segundos) {
    if (!Number.isFinite(segundos)) return "0:00";
    const s = Math.floor(segundos);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }
  function atualizarInterface() {
    const tocando = !audio.paused && !audio.ended;
    iconePlay.hidden = tocando;
    iconePause.hidden = !tocando;
    botaoPlay.setAttribute("aria-label", tocando ? "Pausar mensagem" : "Reproduzir mensagem");
    const mudo = audio.muted || audio.volume === 0;
    iconeVolume.hidden = mudo;
    iconeMudo.hidden = !mudo;
    botaoSom.setAttribute("aria-label", mudo ? "Ativar som" : "Silenciar áudio");
    if (audio.ended) status.textContent = "Mensagem concluída";
    else if (tocando) status.textContent = "Reproduzindo a homenagem";
    else if (audio.currentTime > 0) status.textContent = "Mensagem pausada";
    else status.textContent = "Pronta para ouvir";
  }
  function atualizarProgresso() {
    const duracao = audio.duration;
    const percentual = Number.isFinite(duracao) && duracao > 0
      ? audio.currentTime / duracao * 100 : 0;
    progresso.value = String(percentual);
    progresso.style.setProperty("--audio-progress", percentual + "%");
    tempoAtual.textContent = formatarTempo(audio.currentTime);
    if (Number.isFinite(duracao)) tempoTotal.textContent = formatarTempo(duracao);
  }
  function iniciarReproducao() {
    // Executado diretamente no clique, para cumprir a política de reprodução dos navegadores.
    const tentativa = audio.play();
    if (tentativa && typeof tentativa.catch === "function") {
      tentativa.catch(function () {
        status.textContent = "Toque em reproduzir para ouvir";
      });
    }
  }
  botaoNativo.addEventListener("click", function () {
    const mostrar = !audio.controls;
    audio.controls = mostrar;
    botaoNativo.setAttribute("aria-expanded", String(mostrar));
    botaoNativo.textContent = mostrar ? "Ocultar o reprodutor padrão" : "Não saiu som? Usar o reprodutor do celular";
    if (mostrar) painelAudio.appendChild(audio);
  });
  audio.addEventListener("error", function () {
    status.textContent = "Não foi possível carregar o som. Use os controles padrão.";
    audio.controls = true;
    painelAudio.appendChild(audio);
    botaoNativo.setAttribute("aria-expanded", "true");
  });
  function fecharAbertura() {
    if (dialogo.open) dialogo.close();
    document.body.classList.remove("boas-vindas-aberta");
  }

  entrarComSom.addEventListener("click", function () {
    iniciarReproducao();
    fecharAbertura();
  });
  entrarSemSom.addEventListener("click", fecharAbertura);
  botaoPlay.addEventListener("click", function () {
    if (audio.paused) iniciarReproducao();
    else audio.pause();
    atualizarInterface();
  });
  botaoSom.addEventListener("click", function () {
    audio.muted = !audio.muted;
    atualizarInterface();
  });
  progresso.addEventListener("input", function () {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = Number(progresso.value) / 100 * audio.duration;
      atualizarProgresso();
    }
  });
  ["play", "pause", "ended", "volumechange"].forEach(function (evento) {
    audio.addEventListener(evento, atualizarInterface);
  });
  ["loadedmetadata", "durationchange", "timeupdate", "ended", "seeked"].forEach(function (evento) {
    audio.addEventListener(evento, atualizarProgresso);
  });

  // Evita que a narração de fundo concorra com um vídeo local reproduzido no site.
  const videoLocal = document.querySelector("#video-screen video");
  if (videoLocal) {
    videoLocal.addEventListener("play", function () { audio.pause(); });
    audio.addEventListener("play", function () { videoLocal.pause(); });
  }

  // Modal nativo mantém foco e permite prosseguir também usando teclado.
  if (typeof dialogo.showModal === "function") {
    dialogo.showModal();
    document.body.classList.add("boas-vindas-aberta");
  }
  dialogo.addEventListener("close", function () {
    document.body.classList.remove("boas-vindas-aberta");
  });
  atualizarProgresso();
  atualizarInterface();
}
