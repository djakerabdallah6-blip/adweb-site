/* Dar Nour — bandeau d'accueil « Sahara » : version vidéo ou version sable interactive.
   Choix par l'adresse : ?fond=video ou ?fond=sable (sans paramètre : pas de bandeau). */
(function () {
  'use strict';
  var params = new URLSearchParams(location.search);
  var mode = params.get('fond');
  var hero = document.getElementById('hero');
  if (!hero || (mode !== 'video' && mode !== 'sable')) return;
  hero.hidden = false;
  var bg = hero.querySelector('.hbg');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (vid) { if (visible && !reduce) vid.play().catch(function () {}); else vid.pause(); } }).observe(hero);
  }

  // Bouton « Découvrir »
  hero.querySelector('[data-scroll]').addEventListener('click', function () { document.getElementById('filters').scrollIntoView({ behavior: 'smooth', block: 'center' }); });

  // Petit sélecteur pour comparer les deux versions
  var sw = hero.querySelector('.hsw');
  sw.innerHTML = '<span>Fond :</span><a href="?fond=video" class="' + (mode === 'video' ? 'on' : '') + '">Vidéo</a><a href="?fond=sable" class="' + (mode === 'sable' ? 'on' : '') + '">Sable interactif</a>';

  // ---------- Version 1 : vidéo ----------
  var vid = null;
  if (mode === 'video') {
    // Vidéo Pexels (licence libre, usage commercial autorisé)
    var base = 'https://videos.pexels.com/video-files/10794810/10794810-';
    var file = window.innerWidth < 760 ? 'sd_960_540_30fps.mp4' : 'hd_1920_1080_30fps.mp4';
    bg.innerHTML = '<video class="hvid" muted loop playsinline autoplay preload="auto" poster="https://images.pexels.com/videos/10794810/desert-sand-sun-sunrise-10794810.jpeg?auto=compress&cs=tinysrgb&w=1600" aria-hidden="true"><source src="' + base + file + '" type="video/mp4"></video><div class="hgrain"></div>';
    vid = bg.querySelector('video');
    if (reduce) { vid.removeAttribute('autoplay'); vid.pause(); }
    else vid.play().catch(function () {});
    hero.classList.add('is-video');
    return;
  }

  // ---------- Version 2 : sable interactif ----------
  hero.classList.add('is-sand');
  bg.innerHTML = '<canvas class="hc sky" aria-hidden="true"></canvas><canvas class="hc back" aria-hidden="true"></canvas><canvas class="hc front" aria-hidden="true"></canvas>' +
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="heat" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.003 0.09" numOctaves="1" seed="3" result="n"><animate attributeName="baseFrequency" dur="5s" values="0.003 0.09;0.004 0.11;0.003 0.09" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" in2="n" scale="5"/></filter></svg>';
  var sky = bg.querySelector('.sky'), back = bg.querySelector('.back'), front = bg.querySelector('.front');
  var sx = sky.getContext('2d'), bx = back.getContext('2d'), fx = front.getContext('2d');
  var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 1.5), small = false;
  var mouse = { x: -999, y: -999, vx: 0, vy: 0, on: false }, par = 0, parT = 0;
  var grains = [], t0 = performance.now();

  function resize() {
    var r = hero.getBoundingClientRect(); W = Math.round(r.width); H = Math.round(r.height); small = W < 640;
    [sky, back, front].forEach(function (c) { c.width = W * DPR; c.height = H * DPR; c.style.width = W + 'px'; c.style.height = H + 'px'; });
    sx.setTransform(DPR, 0, 0, DPR, 0, 0); bx.setTransform(DPR, 0, 0, DPR, 0, 0); fx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var n = Math.round(Math.min(480, W * H / 2600));
    grains = []; for (var i = 0; i < n; i++) grains.push(newGrain(true));
  }
  function dune(x, L) {
    var s = Math.sin(x * L.f1 + L.p1) * L.a1 + Math.sin(x * L.f2 + L.p2) * L.a2 + Math.sin(x * L.f3 + L.p3) * L.a3;
    return L.base * H - Math.pow(Math.abs(Math.sin(x * L.f1 * 0.5 + L.p1)), 3) * L.a1 * 0.7 + s;
  }
  // couleurs : [face éclairée haut, face éclairée bas, ombre]
  var LAYERS = [
    { base: .66, a1: 22, f1: .0045, p1: .4, a2: 10, f2: .012, p2: 1.2, a3: 3, f3: .03, p3: 2, lit: ['#f6c78e', '#eeb172'], sh: '#d99863', depth: .12, haze: .45 },
    { base: .74, a1: 32, f1: .0036, p1: 2.1, a2: 14, f2: .0095, p2: .3, a3: 4, f3: .026, p3: 1, lit: ['#f4b26a', '#e69a4c'], sh: '#c5773a', depth: .3, haze: .22 },
    { base: .85, a1: 44, f1: .0029, p1: 4.0, a2: 18, f2: .0078, p2: 2.6, a3: 5, f3: .021, p3: 3, lit: ['#f0a052', '#d9813a'], sh: '#a95d26', depth: .6, haze: 0 },
    { base: .97, a1: 54, f1: .0023, p1: 1.0, a2: 20, f2: .0062, p2: 4.2, a3: 6, f3: .018, p3: .5, lit: ['#e48f42', '#c06f2c'], sh: '#8c4a1c', depth: 1, haze: 0 }
  ];
  function sunPos() { return small ? { x: W * .82 - par * 10, y: H * .12 } : { x: W * .76 - par * 18, y: H * .24 }; }

  function drawSky(t) {
    var g = sx.createLinearGradient(0, 0, 0, H * .8);
    g.addColorStop(0, '#1f5fa8'); g.addColorStop(.38, '#5c9ad0'); g.addColorStop(.7, '#b9d6ea'); g.addColorStop(1, '#f8e4c4');
    sx.fillStyle = g; sx.fillRect(0, 0, W, H);
    var s = sunPos(), R = Math.min(W, H) * (small ? .07 : .075);
    var halo = sx.createRadialGradient(s.x, s.y, 0, s.x, s.y, R * 10);
    halo.addColorStop(0, 'rgba(255,255,250,1)'); halo.addColorStop(.1, 'rgba(255,252,236,.85)'); halo.addColorStop(.3, 'rgba(255,240,205,.35)'); halo.addColorStop(1, 'rgba(255,240,210,0)');
    sx.fillStyle = halo; sx.fillRect(0, 0, W, H);
    // éblouissement : quelques rayons très doux
    sx.save(); sx.translate(s.x, s.y); sx.rotate(t * .00003); sx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < 10; i++) {
      sx.rotate(Math.PI * 2 / 10 + (i % 2 ? .12 : -.08));
      var len = R * (i % 3 ? 5 : 8), rg = sx.createLinearGradient(0, 0, len, 0);
      rg.addColorStop(0, 'rgba(255,250,235,.10)'); rg.addColorStop(1, 'rgba(255,250,235,0)');
      sx.fillStyle = rg; sx.beginPath(); sx.moveTo(0, 0); sx.lineTo(len, -R * .22); sx.lineTo(len, R * .22); sx.closePath(); sx.fill();
    }
    sx.restore();
    var pulse = 1 + Math.sin(t * .0015) * .02;
    sx.fillStyle = '#fffef9'; sx.shadowColor = 'rgba(255,250,230,1)'; sx.shadowBlur = R * 1.6;
    sx.beginPath(); sx.arc(s.x, s.y, R * pulse, 0, Math.PI * 2); sx.fill(); sx.shadowBlur = 0;
    // reflets d'objectif
    sx.save(); sx.globalCompositeOperation = 'lighter';
    var cx = W * .5, cy = H * .55;
    [[.35, .5, .06], [.6, .25, .04], [.85, .8, .05]].forEach(function (f) {
      var x = s.x + (cx - s.x) * f[0] * 1.6, y = s.y + (cy - s.y) * f[0] * 1.6, r = R * f[1];
      var lg = sx.createRadialGradient(x, y, 0, x, y, r); lg.addColorStop(0, 'rgba(255,230,190,' + f[2] + ')'); lg.addColorStop(1, 'rgba(255,230,190,0)');
      sx.fillStyle = lg; sx.beginPath(); sx.arc(x, y, r, 0, Math.PI * 2); sx.fill();
    });
    sx.restore();
  }
  function dunePath(c, L, off, dx, dy) {
    c.beginPath(); c.moveTo(-10, H + 10);
    for (var x = -10; x <= W + 10; x += 6) c.lineTo(x, dune(x + off + dx, L) + dy);
    c.lineTo(W + 10, H + 10); c.closePath();
  }
  function drawDune(c, L, t) {
    var off = par * 60 * L.depth + t * .003 * L.depth;
    // 1) toute la dune dans la couleur d'ombre
    dunePath(c, L, off, 0, 0); c.fillStyle = L.sh; c.fill();
    // 2) la face éclairée : même profil décalé, découpé dans la dune → l'ombre reste derrière chaque crête
    c.save(); dunePath(c, L, off, 0, 0); c.clip();
    var g = c.createLinearGradient(0, L.base * H - 60, 0, H); g.addColorStop(0, L.lit[0]); g.addColorStop(1, L.lit[1]);
    dunePath(c, L, off, -(46 + 46 * L.depth), 3 + 3 * L.depth); c.fillStyle = g; c.fill();
    c.restore();
    if (L.haze) { dunePath(c, L, off, 0, 0); c.fillStyle = 'rgba(248,228,196,' + L.haze + ')'; c.fill(); }
    // 3) liseré de lumière sur la crête
    c.beginPath(); for (var x = -10; x <= W + 10; x += 6) { var y = dune(x + off, L); if (x < -9) c.moveTo(x, y); else c.lineTo(x, y); }
    c.strokeStyle = 'rgba(255,232,190,' + (.6 - L.haze) + ')'; c.lineWidth = 1.4; c.stroke();
  }
  function drawBack(t) { bx.clearRect(0, 0, W, H); drawDune(bx, LAYERS[0], t); drawDune(bx, LAYERS[1], t); }
  function drawFront(t) {
    fx.clearRect(0, 0, W, H);
    drawDune(fx, LAYERS[2], t);
    drawDune(fx, LAYERS[3], t);
    var L = LAYERS[3], off = par * 60 + t * .003;
    fx.save(); dunePath(fx, L, off, 0, 0); fx.clip(); fx.strokeStyle = 'rgba(110,55,15,.18)'; fx.lineWidth = 1;
    for (var r = 1; r < 10; r++) {
      fx.beginPath();
      for (var x = 0; x <= W + 10; x += 10) {
        var y = dune(x + off, L) + r * 12 + Math.sin(x * .05 + r * 1.7 + off * .02) * 3;
        if (x === 0) fx.moveTo(x, y); else fx.lineTo(x, y);
      }
      fx.stroke();
    }
    fx.restore();
    var wind = 1.1 + Math.sin(t * .0005) * .6;
    fx.fillStyle = '#ffe9c4';
    for (var i = 0; i < grains.length; i++) {
      var p = grains[i];
      var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      if (mouse.on && d2 < 14400) { var d = Math.sqrt(d2) || 1, f = (120 - d) / 120; p.vx += dx / d * f * 1.6 + mouse.vx * f * .08; p.vy += dy / d * f * 1.6 + mouse.vy * f * .08; }
      p.vx += (wind * p.w - p.vx) * .03; p.vy += (Math.sin((p.x + t * .05) * .02 + p.s) * .25 - .02 - p.vy) * .04;
      p.x += p.vx; p.y += p.vy; p.life -= 1;
      if (p.x > W + 10 || p.x < -20 || p.y < -10 || p.y > H + 10 || p.life < 0) grains[i] = p = newGrain(false);
      fx.globalAlpha = Math.min(1, p.life / 60) * p.a;
      fx.fillRect(p.x, p.y, p.r, p.r * .8);
    }
    fx.globalAlpha = 1;
    mouse.vx *= .9; mouse.vy *= .9;
  }
  function newGrain(anywhere) {
    var x = anywhere ? Math.random() * W : -10 - Math.random() * 40;
    var L = LAYERS[2 + (Math.random() < .6 ? 1 : 0)];
    var y = dune(x + par * 60 * L.depth, L) - Math.random() * H * .22;
    return { x: x, y: y, vx: 1 + Math.random(), vy: 0, w: .6 + Math.random() * .9, s: Math.random() * 6, r: Math.random() < .2 ? 2 : 1.2, a: .35 + Math.random() * .55, life: 240 + Math.random() * 420 };
  }
  function burst(x, y) {
    for (var i = 0; i < 70; i++) {
      var a = Math.random() * Math.PI * 2, v = 1.5 + Math.random() * 4.5, g = newGrain(true);
      g.x = x; g.y = y; g.vx = Math.cos(a) * v; g.vy = Math.sin(a) * v - 1.5; g.life = 140 + Math.random() * 120; g.a = .9;
      grains[(Math.random() * grains.length) | 0] = g;
    }
  }
  hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (mouse.on) { mouse.vx = x - mouse.x; mouse.vy = y - mouse.y; }
    mouse.x = x; mouse.y = y; mouse.on = true;
    par += ((x / W - .5) - par) * .08;
  });
  hero.addEventListener('pointerleave', function () { mouse.on = false; mouse.x = mouse.y = -999; });
  hero.addEventListener('pointerdown', function (e) {
    if (e.target.closest('a,button')) return;
    var r = hero.getBoundingClientRect(); burst(e.clientX - r.left, e.clientY - r.top);
  });
  window.addEventListener('resize', resize);
  resize();
  back.style.filter = reduce ? 'none' : 'url(#heat)';
  function frame(now) {
    if (visible) { var t = now - t0; parT = t / 1000; drawSky(t); drawBack(t); drawFront(t); }
    if (!reduce) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
