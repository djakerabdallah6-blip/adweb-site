/* Dar Nour — page d'accueil vidéo, navigation accueil ↔ produits, et transitions « désert ». */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var landing = $('#landing'), catalog = $('#catalog'), shop = $('#shop');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var page = 'landing', busy = false;

  // ---------- Vidéo plein écran (Pexels, licence libre) ----------
  var base = 'https://videos.pexels.com/video-files/10794810/10794810-';
  var file = window.innerWidth < 760 ? 'sd_960_540_30fps.mp4' : 'hd_1920_1080_30fps.mp4';
  $('#hbg').innerHTML = '<video class="hvid" muted loop playsinline autoplay preload="auto" poster="https://images.pexels.com/videos/10794810/desert-sand-sun-sunrise-10794810.jpeg?auto=compress&cs=tinysrgb&w=1600" aria-hidden="true"><source src="' + base + file + '" type="video/mp4"></video><div class="hgrain"></div>';
  var vid = $('#hbg video');
  function playVid() { if (!reduce && page === 'landing' && !shop.hidden) vid.play().catch(function () {}); }
  if (reduce) vid.removeAttribute('autoplay'); else playVid();

  // Transition : ?transition=dune pour comparer, tempête de sable par défaut
  var kind = new URLSearchParams(location.search).get('transition') === 'dune' ? 'dune' : 'sable';

  // ---------- Pages ----------
  function setPage(p, push) {
    page = p; landing.hidden = p !== 'landing'; catalog.hidden = p !== 'catalog';
    if (p === 'landing') playVid(); else vid.pause();
    window.scrollTo(0, 0);
    if (push !== false) {
      try {
        if (p === 'catalog' && location.hash !== '#boutique') history.pushState(null, '', '#boutique');
        if (p === 'landing' && location.hash) history.pushState(null, '', location.pathname + location.search);
      } catch (e) {}
    }
  }
  function goto(p, then) {
    if (busy) return;
    if (p === page) { if (then) then(); return; }
    busy = true;
    run(kind, function () { setPage(p); }).then(function () { busy = false; if (then) setTimeout(then, 60); });
  }
  window.addEventListener('popstate', function () { setPage(location.hash === '#boutique' ? 'catalog' : 'landing', false); });
  if (location.hash === '#boutique') setPage('catalog', false);

  landing.addEventListener('click', function (e) {
    if (e.target.closest('[data-go-cat]')) goto('catalog');
    else if (e.target.closest('[data-go-cart]')) goto('catalog', function () { $('#cartBtn').click(); });
  });
  $('#toLanding').addEventListener('click', function (e) { e.preventDefault(); goto('landing'); });

  window.DN = { page: function () { return page; }, goto: goto, setPage: setPage, busy: function () { return busy; } };

  // ---------- Transitions ----------
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function overlay() {
    var c = document.createElement('canvas'); c.id = 'trx'; c.className = 'block';
    var d = Math.min(window.devicePixelRatio || 1, 1.5), W = window.innerWidth, H = window.innerHeight;
    c.width = W * d; c.height = H * d; document.body.appendChild(c);
    var x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0);
    return { c: c, x: x, W: W, H: H };
  }
  function animate(total, draw) {
    return new Promise(function (res) {
      var t0 = performance.now();
      (function f(now) { var t = now - t0; draw(Math.min(t, total)); if (t < total) requestAnimationFrame(f); else res(); })(t0);
    });
  }
  // Texture de sable pré-calculée
  var sandTex = null;
  function sandPattern(x) {
    if (!sandTex) {
      sandTex = document.createElement('canvas'); sandTex.width = sandTex.height = 160;
      var g = sandTex.getContext('2d'), im = g.createImageData(160, 160);
      for (var i = 0; i < im.data.length; i += 4) { var v = Math.random(); im.data[i] = 120 + v * 90; im.data[i + 1] = 70 + v * 60; im.data[i + 2] = 30 + v * 35; im.data[i + 3] = v < .5 ? 26 : 50; }
      g.putImageData(im, 0, 0);
    }
    return x.createPattern(sandTex, 'repeat');
  }
  function sandFill(x, H) { var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#e9b878'); g.addColorStop(.55, '#d39150'); g.addColorStop(1, '#a8652c'); return g; }

  // 1) Tempête de sable : un mur de sable traverse l'écran, puis le vent l'emporte
  function storm(mid) {
    var o = overlay(), x = o.x, W = o.W, H = o.H, D1 = 720, HOLD = 650, D2 = 780, swapped = false;
    var pat = sandPattern(x), fill = sandFill(x, H), soft = 280;
    var gr = []; for (var i = 0; i < 700; i++) gr.push({ x: -Math.random() * W * .8, y: Math.random() * H, v: 14 + Math.random() * 22, l: 8 + Math.random() * 30, a: .25 + Math.random() * .6, w: Math.random() < .25 ? 2 : 1 });
    return animate(D1 + HOLD + D2, function (t) {
      x.clearRect(0, 0, W, H);
      var lead, tail;
      if (t < D1) { lead = -soft + ease(t / D1) * (W + soft * 2); tail = -soft * 2; }
      else if (t < D1 + HOLD) { lead = W + soft; tail = -soft * 2; if (!swapped) { swapped = true; mid(); } }
      else { lead = W + soft; tail = -soft + ease((t - D1 - HOLD) / D2) * (W + soft * 2); }
      // le mur de sable, aux bords adoucis
      var g = x.createLinearGradient(tail, 0, lead, 0), span = Math.max(1, lead - tail);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(Math.min(.49, soft / span), 'rgba(0,0,0,1)'); g.addColorStop(Math.max(.51, 1 - soft / span), 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      x.save(); x.fillStyle = fill; x.fillRect(0, 0, W, H); x.fillStyle = pat; x.fillRect(0, 0, W, H);
      x.globalCompositeOperation = 'destination-in'; x.fillStyle = g; x.fillRect(0, 0, W, H); x.restore();
      // grains en traînées, poussés par le vent
      x.lineCap = 'round';
      for (var i = 0; i < gr.length; i++) {
        var p = gr[i]; p.x += p.v; if (p.x > W + 40) { p.x = -40 - Math.random() * 200; p.y = Math.random() * H; }
        var near = Math.abs(p.x - lead) < soft * 1.4 || (t > D1 + HOLD && Math.abs(p.x - tail) < soft * 1.4);
        x.strokeStyle = 'rgba(255,236,200,' + (near ? p.a : p.a * .25) + ')'; x.lineWidth = p.w;
        x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(p.x - p.l, p.y + p.l * .08); x.stroke();
      }
      // le logo Dar Nour apparaît au cœur de la tempête
      var la = t < D1 - 120 ? 0 : t < D1 + 120 ? (t - D1 + 120) / 240 : t < D1 + HOLD ? 1 : Math.max(0, 1 - (t - D1 - HOLD) / 260);
      if (la > 0) logo(x, W, H, ease(Math.min(1, la)), t);
    }).then(function () { o.c.remove(); });
  }

  function logo(x, W, H, a, t, light) {
    var cx = W / 2, cy = H / 2, s = Math.min(1, W / 700), rise = (1 - a) * 18;
    x.save(); x.globalAlpha = a; x.translate(cx, cy + rise);
    // emblème : un soleil au-dessus d'une ligne de dunes
    var R = 26 * s; x.strokeStyle = light ? '#ffe9c7' : '#3a2410'; x.lineWidth = 2.4 * s; x.lineCap = 'round';
    x.beginPath(); x.arc(0, -78 * s, R, Math.PI, 0); x.stroke();
    for (var i = 0; i < 7; i++) { var ang = Math.PI + Math.PI * (i + .5) / 7, r1 = R + 7 * s, r2 = R + 15 * s; x.beginPath(); x.moveTo(Math.cos(ang) * r1, -78 * s + Math.sin(ang) * r1); x.lineTo(Math.cos(ang) * r2, -78 * s + Math.sin(ang) * r2); x.stroke(); }
    x.beginPath(); x.moveTo(-60 * s, -72 * s); x.bezierCurveTo(-30 * s, -86 * s, -10 * s, -66 * s, 10 * s, -74 * s); x.bezierCurveTo(30 * s, -82 * s, 45 * s, -70 * s, 60 * s, -72 * s); x.stroke();
    x.fillStyle = light ? '#fff6e6' : '#2b1a0a'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = '600 ' + Math.round(64 * s) + 'px Fraunces, Georgia, serif'; x.fillText('Dar Nour', 0, -10 * s);
    x.font = '800 ' + Math.round(12 * s) + 'px "Plus Jakarta Sans", sans-serif';
    if ('letterSpacing' in x) x.letterSpacing = (6 * s) + 'px';
    x.fillStyle = light ? '#ffd58f' : '#7a4a1e'; x.fillText('PRODUITS DU TERROIR', 0, 42 * s);
    x.restore();
  }

  // 2) Dune : une dune monte et recouvre l'écran, puis continue sa course vers le haut
  function duneTr(mid) {
    var o = overlay(), x = o.x, W = o.W, H = o.H, D1 = 760, HOLD = 650, D2 = 820, swapped = false;
    var pat = sandPattern(x);
    var bands = [{ c: ['#f2c98e', '#e3a964'], d: 0, ph: .3 }, { c: ['#e3a35c', '#c98340'], d: 70, ph: 2.1 }, { c: ['#c7843f', '#9c5c25'], d: 140, ph: 4.2 }];
    function crest(px, y0, ph) { return y0 - Math.sin(px * .0045 + ph) * 34 - Math.sin(px * .011 + ph * 2) * 14 - Math.pow(Math.abs(Math.sin(px * .0022 + ph)), 3) * 30; }
    function band(b, yTop, yBot) {
      x.beginPath();
      if (yTop !== null) { x.moveTo(-10, H + 10); for (var px = -10; px <= W + 10; px += 8) x.lineTo(px, crest(px, yTop, b.ph)); x.lineTo(W + 10, H + 10); }
      else { x.moveTo(-10, -10); for (px = -10; px <= W + 10; px += 8) x.lineTo(px, crest(px, yBot, b.ph + 1)); x.lineTo(W + 10, -10); }
      x.closePath();
      var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, b.c[0]); g.addColorStop(1, b.c[1]);
      x.fillStyle = g; x.fill(); x.fillStyle = pat; x.fill();
      x.strokeStyle = 'rgba(255,238,205,.55)'; x.lineWidth = 2; x.stroke();
    }
    return animate(D1 + HOLD + D2, function (t) {
      x.clearRect(0, 0, W, H);
      if (t < D1 + HOLD) {
        var k = ease(Math.min(1, t / D1));
        bands.forEach(function (b) { band(b, H + 120 + b.d - k * (H + 380 + b.d), null); });
        if (t >= D1 && !swapped) { swapped = true; mid(); }
      } else {
        var k2 = ease((t - D1 - HOLD) / D2);
        bands.slice().reverse().forEach(function (b, i) { band(b, null, H + 60 + i * 70 - k2 * (H + 300 + i * 70)); });
      }
      // le logo Dar Nour sur la dune
      var la = t < D1 - 120 ? 0 : t < D1 + 120 ? (t - D1 + 120) / 240 : t < D1 + HOLD ? 1 : Math.max(0, 1 - (t - D1 - HOLD) / 240);
      if (la > 0) { x.save(); x.shadowColor = 'rgba(60,30,5,.35)'; x.shadowBlur = 18; logo(x, W, H, ease(Math.min(1, la)), t, true); x.restore(); }
    }).then(function () { o.c.remove(); });
  }

  // 3) Mirage : la page ondule sous la chaleur, le soleil éblouit, la nouvelle page apparaît
  var svgF = null;
  function mirage(mid) {
    if (!svgF) {
      svgF = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svgF.setAttribute('width', 0); svgF.setAttribute('height', 0); svgF.style.position = 'absolute';
      svgF.innerHTML = '<filter id="mirageF" x="0" y="0" width="100%" height="100%"><feTurbulence id="mirT" type="fractalNoise" baseFrequency="0.006 0.05" numOctaves="2" seed="2"/><feDisplacementMap id="mirD" in="SourceGraphic" scale="0"/></filter>';
      document.body.appendChild(svgF);
    }
    var D = svgF.querySelector('#mirD'), Tb = svgF.querySelector('#mirT');
    var o = overlay(), x = o.x, W = o.W, H = o.H, D1 = 650, HOLD = 120, D2 = 750, swapped = false;
    var sx = W * .7, sy = H * .3;
    shop.style.filter = 'url(#mirageF)';
    return animate(D1 + HOLD + D2, function (t) {
      var k = t < D1 ? ease(t / D1) : t < D1 + HOLD ? 1 : 1 - ease((t - D1 - HOLD) / D2);
      if (t >= D1 && !swapped) { swapped = true; mid(); }
      D.setAttribute('scale', (k * 70).toFixed(1));
      Tb.setAttribute('baseFrequency', (0.006 + Math.sin(t * .01) * .001).toFixed(4) + ' ' + (0.05 + Math.sin(t * .013) * .01).toFixed(4));
      x.clearRect(0, 0, W, H);
      var R = Math.hypot(W, H) * (.15 + k * 1.1);
      var g = x.createRadialGradient(sx, sy, 0, sx, sy, R);
      g.addColorStop(0, 'rgba(255,253,245,' + Math.min(1, k * 1.25) + ')'); g.addColorStop(.45, 'rgba(255,236,196,' + (k * .95) + ')'); g.addColorStop(1, 'rgba(255,220,170,' + (k * k) + ')');
      x.fillStyle = g; x.fillRect(0, 0, W, H);
    }).then(function () { shop.style.filter = ''; D.setAttribute('scale', 0); o.c.remove(); });
  }

  function fade(mid) {
    var o = overlay(), x = o.x, W = o.W, H = o.H, swapped = false;
    return animate(500, function (t) { var k = t < 250 ? t / 250 : 1 - (t - 250) / 250; if (t >= 250 && !swapped) { swapped = true; mid(); } x.clearRect(0, 0, W, H); x.fillStyle = 'rgba(233,184,120,' + k + ')'; x.fillRect(0, 0, W, H); }).then(function () { o.c.remove(); });
  }
  function run(k, mid) {
    if (reduce) return fade(mid);
    return (k === 'dune' ? duneTr : k === 'mirage' ? mirage : storm)(mid);
  }
})();
