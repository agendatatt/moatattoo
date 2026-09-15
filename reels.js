/* Vídeos curtos dos trabalhos.
   Vídeo novo: mp4 (sem áudio, ~9:16, até ~1 MB) + capa webp em videos/, e uma linha em VIDEOS.
   Na página: <div class="reels" data-reels="onca,luffy"></div> */
(function () {
  var WA = 'https://wa.me/5581992244674?text=';
  var VIDEOS = {
    onca:    { arq:'onca-peonias-coxa',       nome:'Onça com peônias', sub:'Coxa',                      tag:'Preto e cinza', cta:'Quero uma assim', msg:'Olá, Moacir! Vi no site o vídeo da onça com peônias e quero uma tatuagem nesse estilo.' },
    jinwoo:  { arq:'jinwoo-panturrilha',      nome:'Sung Jin-Woo',     sub:'Solo Leveling · Panturrilha', tag:'Colorido',      cta:'Quero uma assim', msg:'Olá, Moacir! Vi no site o vídeo do Jin-Woo e quero uma tatuagem de anime.' },
    pantera: { arq:'pantera-negra-cobertura', nome:'Pantera negra',    sub:'Cobertura · Antebraço',      tag:'Cobertura',     cta:'Cobrir a minha', msg:'Olá, Moacir! Vi no site o vídeo da cobertura da pantera negra e quero cobrir uma tatuagem antiga. Posso mandar a foto?' },
    luffy:   { arq:'luffy-gear5-antebraco',   nome:'Luffy · Gear 5',   sub:'One Piece · Antebraço',      tag:'Preto e cinza', cta:'Quero uma assim', msg:'Olá, Moacir! Vi no site o vídeo do Luffy e quero uma tatuagem de anime em preto e cinza.' }
  };

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var economia = navigator.connection && navigator.connection.saveData;
  var autoplay = !reduce && !economia && 'IntersectionObserver' in window;
  var jaTocou = {};

  function evento(nome, id) { if (typeof gtag === 'function') gtag('event', nome, { trabalho: id }); }

  function card(id) {
    var v = VIDEOS[id]; if (!v) return null;
    var fig = document.createElement('figure');
    fig.className = 'reel';
    fig.innerHTML =
      '<div class="reel-v">' +
        '<video muted loop playsinline preload="none" poster="videos/' + v.arq + '.webp" aria-label="Vídeo da tatuagem: ' + v.nome + '">' +
          '<source src="videos/' + v.arq + '.mp4" type="video/mp4"></video>' +
        '<span class="reel-tag">' + v.tag + '</span>' +
        '<button class="reel-play" type="button" aria-label="Tocar vídeo: ' + v.nome + '"' + (autoplay ? ' hidden' : '') + '>▶</button>' +
      '</div>' +
      '<figcaption><b>' + v.nome + '</b><small>' + v.sub + '</small></figcaption>' +
      '<a class="reel-cta" target="_blank" rel="noopener" data-trabalho="' + id + '" href="' + WA + encodeURIComponent(v.msg) + '">' + v.cta + ' <span aria-hidden="true">→</span></a>';

    var video = fig.querySelector('video'), play = fig.querySelector('.reel-play');
    video.dataset.id = id;
    function tocar() {
      var p = video.play(); if (p && p.catch) p.catch(function () { play.hidden = false; });
      play.hidden = true;
      if (!jaTocou[id]) { jaTocou[id] = 1; evento('video_play', id); }
    }
    video.addEventListener('click', function () {
      if (video.paused) { video.dataset.parado = ''; tocar(); }
      else { video.pause(); video.dataset.parado = '1'; play.hidden = false; }
    });
    play.addEventListener('click', function () { video.dataset.parado = ''; tocar(); });
    fig.querySelector('.reel-cta').addEventListener('click', function () { evento('clique_whatsapp_video', id); });
    video._tocar = tocar;
    return fig;
  }

  var obs = autoplay ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var video = e.target;
      if (e.isIntersecting && e.intersectionRatio >= .6) { if (!video.dataset.parado) video._tocar(); }
      else if (!video.paused) video.pause();
    });
  }, { threshold:[0, .6] }) : null;

  document.querySelectorAll('.reels[data-reels]').forEach(function (box) {
    var ids = box.getAttribute('data-reels').split(',');
    ids.forEach(function (id) {
      var c = card(id.trim()); if (!c) return;
      box.appendChild(c);
      if (obs) obs.observe(c.querySelector('video'));
    });
    if (ids.length > 1) {
      var dica = document.createElement('p');
      dica.className = 'reels-dica'; dica.textContent = 'Arraste pro lado →';
      box.parentNode.insertBefore(dica, box.nextSibling);
    }
  });
})();
