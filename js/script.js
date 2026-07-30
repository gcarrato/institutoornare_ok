/* =========================================================
   Instituto Ornare — script.js
   HTML5 + CSS3 + JavaScript Vanilla (sem frameworks)
   ========================================================= */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =======================================================
     CONFIGURAÇÃO GERAL — edite apenas aqui
     ======================================================= */
  var CONFIG = {
    instagramUser: 'drafabiaornare',
    instagramUrl: 'https://www.instagram.com/drafabiaornare'
  };

  /* Vídeos dos procedimentos (placeholders funcionais).
     Substitua "video" pelo arquivo real em /videos mantendo a estrutura. */
  var VIDEOS = [
    { title: 'Titulo', desc: 'Descrição', poster: 'img/icone_videos.jpg', video: 'videos/video_0.mp4' },
    { title: 'Titulo', desc: 'Descrição', poster: 'img/icone_videos.jpg', video: 'videos/video_01.mp4' },
    { title: 'Titulo', desc: 'Descrição', poster: 'img/icone_videos.jpg', video: 'videos/video_02.mp4' },
    { title: 'Titulo', desc: 'Descrição', poster: 'img/icone_videos.jpg', video: 'videos/video_03.mp4' },
    { title: 'Titulo', desc: 'Descrição', poster: 'img/icone_videos.jpg', video: 'videos/video_04.mp4' },
    { title: 'Titulo', desc: 'Descrição', poster: 'img/icone_videos.jpg', video: 'videos/video_05.mp4' },
    { title: 'Titulo', desc: 'Descrição', poster: 'img/icone_videos.jpg', video: 'videos/video_06.mp4' },
    { title: 'Titulo', desc: 'Descrição', poster: 'img/icone_videos.jpg', video: 'videos/video_07.mp4' },

  ];

  /* =======================================================
     ANO NO RODAPÉ
     ======================================================= */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =======================================================
     HEADER + BOTÃO VOLTAR AO TOPO
     ======================================================= */
  var header = $('#header');
  var toTop = $('#toTop');
  var onScroll = function () {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
    if (toTop) toTop.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* =======================================================
     MENU MOBILE
     ======================================================= */
  var hamburger = $('#hamburger');
  var mobileMenu = $('#mobileMenu');
  var backdrop = $('#menuBackdrop');

  var toggleMenu = function (open) {
    if (!mobileMenu) return;
    var isOpen = (typeof open === 'boolean') ? open : !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', isOpen);
    if (header) header.classList.toggle('menu-open', isOpen);
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    if (backdrop) backdrop.hidden = !isOpen;
    document.body.classList.toggle('no-scroll', isOpen);
  };

  if (hamburger) hamburger.addEventListener('click', function (e) {
    e.preventDefault(); e.stopPropagation();
    toggleMenu();
  });
  if (backdrop) backdrop.addEventListener('click', function () { toggleMenu(false); });
  $$('#mobileMenu a').forEach(function (a) {
    a.addEventListener('click', function () { toggleMenu(false); });
  });

  // Reset ao passar para desktop
  var desktopMQ = window.matchMedia('(min-width:1181px)');
  var handleMQ = function (mq) { if (mq.matches) toggleMenu(false); };
  if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', handleMQ);
  else if (desktopMQ.addListener) desktopMQ.addListener(handleMQ);


  /* =======================================================
     SCROLL SPY
     ======================================================= */
  var sections = $$('section[id]');
  var navLinks = $$('.nav-link');
  var spy = function () {
    var y = window.scrollY + 160;
    var current = sections.length ? sections[0].id : '';
    sections.forEach(function (s) { if (s.offsetTop <= y) current = s.id; });
    navLinks.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', spy, { passive: true });
  spy();

  /* =======================================================
     REVEAL ON SCROLL
     ======================================================= */
  var observeReveal = function (el) { revealIO.observe(el); };
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  $$('.reveal').forEach(observeReveal);

  /* =======================================================
     HERO SLIDER
     ======================================================= */
  var slides = $$('#heroSlider .slide');
  var heroDots = $('#heroDots');
  var currentSlide = 0;
  var slideTimer = null;

  if (slides.length && heroDots) {
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Ir para o slide ' + (i + 1));
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', function () { goToSlide(i); });
      heroDots.appendChild(b);
    });
  }
  var heroDotEls = $$('#heroDots button');

  function goToSlide(i) {
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    if (heroDotEls[currentSlide]) heroDotEls[currentSlide].classList.remove('active');
    currentSlide = (i + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (heroDotEls[currentSlide]) heroDotEls[currentSlide].classList.add('active');
    restartHero();
  }
  function restartHero() {
    clearInterval(slideTimer);
    if (!reduceMotion && slides.length > 1) {
      slideTimer = setInterval(function () { goToSlide(currentSlide + 1); }, 6500);
    }
  }
  restartHero();

  /* =======================================================
     LIGHTBOX (imagens e vídeos)
     ======================================================= */
  var lightbox = $('#lightbox');
  var lbContent = $('#lightboxContent');
  var lbClose = $('#lightboxClose');
  var lastFocused = null;

  function openLightbox(node) {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    lbContent.innerHTML = '';
    lbContent.appendChild(node);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    lbClose.focus();
  }
  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    var vid = lbContent.querySelector('video');
    if (vid) { vid.pause(); vid.removeAttribute('src'); vid.load(); }
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbContent.innerHTML = '';
    document.body.classList.remove('no-scroll');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeLightbox(); toggleMenu(false); }
  });

  function openImage(src, alt) {
    var img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    openLightbox(img);
  }
  function openVideo(src, poster, title) {
    var v = document.createElement('video');
    v.src = src;
    if (poster) v.poster = poster;
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('preload', 'metadata');
    if (title) v.setAttribute('aria-label', 'Vídeo: ' + title);
    openLightbox(v);
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* autoplay bloqueado: controles disponíveis */ });
  }

  /* =======================================================
     VÍDEOS DOS PROCEDIMENTOS — CARROSSEL
     ======================================================= */
  (function initVideosCarousel() {
    var root = $('#videosCarousel');
    var track = $('#videosTrack');
    var dotsWrap = $('#videosDots');
    if (!root || !track) return;

    var frag = document.createDocumentFragment();
    VIDEOS.forEach(function (item) {
      var slide = document.createElement('div');
      slide.className = 'carousel-slide';

      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'video-card reveal';
      card.setAttribute('aria-label', 'Assistir vídeo: ' + item.title);
      card.innerHTML =
        '<img src="' + item.poster + '" alt="" loading="lazy" />' +
        '<span class="play-icon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg>' +
        '</span>' +
        '<span class="video-info">' +
          '<span class="video-title">' + item.title + '</span>' +
          '<span class="video-desc">' + item.desc + '</span>' +
        '</span>';
      card.addEventListener('click', function () {
        openVideo(item.video, item.poster, item.title);
      });

      slide.appendChild(card);
      frag.appendChild(slide);
    });
    track.appendChild(frag);
    $$('.reveal', track).forEach(observeReveal);

    var slidesEls = $$('.carousel-slide', track);
    if (!slidesEls.length) return;

    var index = 0;
    var perView = 1;
    var pages = 1;
    var autoTimer = null;

    function computePerView() {
      var w = window.innerWidth;
      return w >= 1080 ? 3 : (w >= 700 ? 2 : 1);
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (var i = 0; i < pages; i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Ir para o grupo de vídeos ' + (i + 1));
        (function (i) { b.addEventListener('click', function () { goTo(i); }); })(i);
        dotsWrap.appendChild(b);
      }
    }

    function update() {
      var offset = -(index * 100);
      track.style.transform = 'translate3d(' + offset + '%,0,0)';
      $$('button', dotsWrap).forEach(function (d, i) {
        d.classList.toggle('active', i === index);
        d.setAttribute('aria-selected', String(i === index));
      });
      slidesEls.forEach(function (s, i) {
        var visible = i >= index * perView && i < index * perView + perView;
        s.setAttribute('aria-hidden', String(!visible));
      });
    }

    function goTo(i) { index = (i + pages) % pages; update(); restartAuto(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function layout() {
      perView = computePerView();
      pages = Math.ceil(slidesEls.length / perView);
      slidesEls.forEach(function (s) { s.style.flex = '0 0 ' + (100 / perView) + '%'; });
      if (index >= pages) index = pages - 1;
      buildDots();
      update();
    }

    function restartAuto() {
      clearInterval(autoTimer);
      if (!reduceMotion && pages > 1) autoTimer = setInterval(next, 8000);
    }

    var prevBtn = $('#videosPrev');
    var nextBtn = $('#videosNext');
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    root.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    root.addEventListener('mouseleave', restartAuto);

    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    });

    // Navegação por toque e arraste (mobile/tablet e mouse-drag)
    var startX = 0, delta = 0, dragging = false, suppressClick = false;
    var viewport = $('#videosViewport');

    track.addEventListener('click', function (e) {
      if (suppressClick) { e.stopPropagation(); e.preventDefault(); suppressClick = false; }
    }, true);

    viewport.addEventListener('touchstart', function (e) {
      dragging = true; startX = e.touches[0].clientX; delta = 0; clearInterval(autoTimer);
    }, { passive: true });
    viewport.addEventListener('touchmove', function (e) {
      if (!dragging) return; delta = e.touches[0].clientX - startX;
    }, { passive: true });
    viewport.addEventListener('touchend', function () {
      dragging = false;
      if (Math.abs(delta) > 50) { suppressClick = true; delta < 0 ? next() : prev(); } else { restartAuto(); }
    });

    viewport.addEventListener('mousedown', function (e) {
      dragging = true; startX = e.clientX; delta = 0; clearInterval(autoTimer);
    });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return; delta = e.clientX - startX;
    });
    window.addEventListener('mouseup', function () {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(delta) > 50) { suppressClick = true; delta < 0 ? next() : prev(); } else { restartAuto(); }
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layout, 150);
    });

    layout();
    restartAuto();
  })();

  /* =======================================================
     CARROSSEL DE RESULTADOS
     ======================================================= */
  (function initCarousel() {
    var root = $('#resultsCarousel');
    var track = $('#carouselTrack');
    var dotsWrap = $('#carouselDots');
    if (!root || !track) return;

    var slidesEls = $$('.carousel-slide', track);
    if (!slidesEls.length) return;

    var index = 0;
    var perView = 1;
    var pages = 1;
    var autoTimer = null;

    function computePerView() {
      var w = window.innerWidth;
      return w >= 1080 ? 3 : (w >= 700 ? 2 : 1);
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (var i = 0; i < pages; i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Ir para o grupo ' + (i + 1));
        (function (i) { b.addEventListener('click', function () { goTo(i); }); })(i);
        dotsWrap.appendChild(b);
      }
    }

    function update() {
      var offset = -(index * 100);
      track.style.transform = 'translate3d(' + offset + '%,0,0)';
      $$('button', dotsWrap).forEach(function (d, i) {
        d.classList.toggle('active', i === index);
        d.setAttribute('aria-selected', String(i === index));
      });
      slidesEls.forEach(function (s, i) {
        var visible = i >= index * perView && i < index * perView + perView;
        s.setAttribute('aria-hidden', String(!visible));
      });
    }

    function goTo(i) { index = (i + pages) % pages; update(); restartAuto(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function layout() {
      perView = computePerView();
      pages = Math.ceil(slidesEls.length / perView);
      slidesEls.forEach(function (s) { s.style.flex = '0 0 ' + (100 / perView) + '%'; });
      track.style.width = (pages * 100) + '%';
      track.style.width = '';
      if (index >= pages) index = pages - 1;
      buildDots();
      update();
    }

    function restartAuto() {
      clearInterval(autoTimer);
      if (!reduceMotion && pages > 1) autoTimer = setInterval(next, 7000);
    }

    $('#carouselNext').addEventListener('click', next);
    $('#carouselPrev').addEventListener('click', prev);

    root.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    root.addEventListener('mouseleave', restartAuto);

    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    });

    // Swipe (touch)
    var startX = 0, delta = 0, dragging = false;
    var viewport = $('#carouselViewport');
    viewport.addEventListener('touchstart', function (e) {
      dragging = true; startX = e.touches[0].clientX; delta = 0; clearInterval(autoTimer);
    }, { passive: true });
    viewport.addEventListener('touchmove', function (e) {
      if (!dragging) return; delta = e.touches[0].clientX - startX;
    }, { passive: true });
    viewport.addEventListener('touchend', function () {
      dragging = false;
      if (Math.abs(delta) > 50) { delta < 0 ? next() : prev(); } else { restartAuto(); }
    });

    // Clique abre a imagem em tela cheia
    slidesEls.forEach(function (s) {
      var img = s.querySelector('img');
      if (!img) return;
      s.style.cursor = 'zoom-in';
      s.addEventListener('click', function () { openImage(img.src, img.alt); });
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layout, 150);
    });

    layout();
    restartAuto();
  })();

  /* =======================================================
     INSTAGRAM FEED — @drafabiaornare
     -------------------------------------------------------
     1) API oficial (Instagram Graph / Basic Display):
        defina useApi = true e informe um token válido.
     2) LightWidget / Elfsight: defina useEmbed = true e cole
        o embed dentro de #igEmbed no index.html.
     3) Sem integração: exibe o feed demonstrativo abaixo,
        mantendo exatamente o layout final.
     ======================================================= */
  var INSTAGRAM = {
    useApi: false,
    useEmbed: false,
    token: '',           // access token da Graph API
    limit: 12,           // entre 9 e 12 publicações
    endpoint: 'https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token='
  };

  /* Feed demonstrativo (placeholders) */
  var IG_DEMO = [
    { img: 'img/ig/ig-1.jpg', caption: 'Harmonização facial com resultado natural ✨' },
    { img: 'img/ig/ig-2.jpg', caption: 'Toxina botulínica: olhar leve e descansado' },
    { img: 'img/ig/ig-3.jpg', caption: 'Preenchimento labial delicado 💋' },
    { img: 'img/ig/ig-4.jpg', caption: 'Skinbooster: pele luminosa e hidratada' },
    { img: 'img/ig/ig-5.jpg', caption: 'Bioestimuladores de colágeno' },
    { img: 'img/ig/ig-6.jpg', caption: 'Fios de PDO — lifting sutil' },
    { img: 'img/ig/ig-7.jpg', caption: 'Rinomodelação sem cirurgia' },
    { img: 'img/ig/ig-8.jpg', caption: 'Lifting facial e contorno definido' },
    { img: 'img/ig/ig-9.jpg', caption: 'Protocolo de rejuvenescimento' },
    { img: 'img/ig/ig-10.jpg', caption: 'Bastidores do atendimento' },
    { img: 'img/ig/ig-11.jpg', caption: 'Nosso espaço, pensado para você' },
    { img: 'img/ig/ig-12.jpg', caption: 'Beleza natural em cada detalhe' }
  ];

  (function initInstagram() {
    var grid = $('#igGrid');
    var embed = $('#igEmbed');
    if (!grid) return;

    if (INSTAGRAM.useEmbed) {
      if (embed) embed.hidden = false;
      grid.hidden = true;
      grid.setAttribute('aria-busy', 'false');
      return;
    }

    function tile(data) {
      var a = document.createElement('a');
      a.className = 'ig-item';
      a.href = data.permalink || CONFIG.instagramUrl;
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('aria-label', 'Abrir publicação de @' + CONFIG.instagramUser + ' no Instagram');
      a.innerHTML =
        '<img src="' + data.img + '" alt="Publicação de @' + CONFIG.instagramUser + '" loading="lazy" />' +
        '<span class="ig-overlay">' +
          '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 6.1a3.7 3.7 0 100 7.4 3.7 3.7 0 000-7.4z"/></svg>' +
          '<span class="ig-caption">' + (data.caption || '') + '</span>' +
        '</span>';
      return a;
    }

    function render(items) {
      grid.innerHTML = '';
      var f = document.createDocumentFragment();
      items.slice(0, INSTAGRAM.limit).forEach(function (it) { f.appendChild(tile(it)); });
      grid.appendChild(f);
      grid.setAttribute('aria-busy', 'false');
    }

    if (INSTAGRAM.useApi && INSTAGRAM.token) {
      fetch(INSTAGRAM.endpoint + encodeURIComponent(INSTAGRAM.token))
        .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
        .then(function (json) {
          var items = (json.data || [])
            .filter(function (p) { return p.media_type !== 'VIDEO' || p.thumbnail_url; })
            .map(function (p) {
              return {
                img: p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url,
                caption: (p.caption || '').slice(0, 90),
                permalink: p.permalink
              };
            });
          render(items.length ? items : IG_DEMO);
        })
        .catch(function () { render(IG_DEMO); });
    } else {
      render(IG_DEMO);
    }
  })();

  /* =======================================================
     FORMULÁRIO DE CONTATO
     ======================================================= */
  var form = $('#contactForm');
  var status = $('#formStatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var nome = (data.get('nome') || '').toString().trim();
      var email = (data.get('email') || '').toString().trim();
      var tel = (data.get('telefone') || '').toString().trim();

      status.classList.remove('error');

      if (!nome || !email || !tel) {
        status.classList.add('error');
        status.textContent = 'Por favor, preencha nome, e-mail e telefone.';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.classList.add('error');
        status.textContent = 'Informe um e-mail válido.';
        return;
      }
      // TODO: integrar com backend, e-mail ou API do WhatsApp.
      status.textContent = 'Mensagem enviada com sucesso. Em breve entraremos em contato.';
      form.reset();
    });
  }
})();
