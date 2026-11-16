(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.getElementById('root');
  var hero = document.getElementById('hero');
  var bg = document.getElementById('bg');
  var glow = document.getElementById('glow');
  var ACCENT = '#2563eb';
  var TRANSITION = 'rideau'; // 'rideau' ou 'cercle'

  // ---------- Fond Fils ----------
  var th = null;
  function threadProps(boost) {
    var small = window.innerWidth < 760;
    return {
      color: '#93b4ff', accentColor: ACCENT, enableMouseInteraction: true,
      lineCount: small ? 48 : 80,
      amplitude: boost === 2 ? 3.2 : boost === 1 ? 2.1 : 1.45,
      distance: 0.28, thickness: small ? 0.7 : 0.55, softness: 1.25,
      speed: boost === 2 ? 2.6 : boost === 1 ? 1.1 : 0.55,
      waves: 1.1, angle: small ? 26 : 14, parting: 0.25, taper: 0.8,
      brightness: boost ? 1.7 : 1.35, fade: 0.12
    };
  }
  function boost(level) { if (th) th.update(threadProps(level)); }
  if (window.ADTH && bg) { try { th = window.ADTH.mount(bg, threadProps(0)); } catch (e) {} }

  // ---------- Transitions ----------
  var busy = false;
  function label(id) { return id === 'contact' ? 'Parlons de votre projet.' : 'Nos services'; }
  function brand() {
    return '<div class="trl" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:#fff;text-align:center;padding:24px">' +
      '<span style="font-weight:800;font-size:22px;letter-spacing:-0.035em;opacity:.85">AD<span style="color:#0b1020">web</span></span>' +
      '<span class="trt" style="font-weight:800;font-size:clamp(36px,5vw,72px);letter-spacing:-0.045em;line-height:1"></span></div>';
  }
  function go(id, e) {
    var target = document.getElementById(id);
    if (!target) return;
    if (e) e.preventDefault();
    if (busy) return;
    if (reduce) { target.scrollIntoView({ block: 'start' }); return; }
    busy = true; boost(2);
    var ov = document.createElement('div');
    ov.setAttribute('aria-hidden', 'true');
    ov.style.cssText = 'position:fixed;inset:0;z-index:1000;pointer-events:none;overflow:hidden;display:flex';
    if (TRANSITION === 'cercle') {
      var x = e && e.clientX, y = e && e.clientY;
      if (!x && !y && e && e.currentTarget) { var r = e.currentTarget.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
      var W = innerWidth, H = innerHeight, d = 2 * Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 20;
      var ink = document.createElement('div');
      ink.className = 'ink';
      ink.style.cssText = 'position:absolute;border-radius:50%;background:' + ACCENT + ';left:' + (x - d / 2) + 'px;top:' + (y - d / 2) + 'px;width:' + d + 'px;height:' + d + 'px';
      ov.appendChild(ink);
    } else {
      var shades = [ACCENT, '#1d4ed8', ACCENT, '#1e40af'];
      for (var i = 0; i < 14; i++) {
        var b = document.createElement('div');
        b.className = 'bar';
        b.style.cssText = 'flex:1 1 0;height:100%;background:' + shades[i % 4] + ';animation-delay:' + Math.round(Math.abs(i - 6.5) * 32) + 'ms';
        ov.appendChild(b);
      }
    }
    ov.insertAdjacentHTML('beforeend', brand());
    ov.querySelector('.trt').textContent = label(id);
    root.appendChild(ov);
    setTimeout(function () { target.scrollIntoView({ block: 'start', behavior: 'auto' }); }, 640);
    setTimeout(function () { ov.remove(); busy = false; boost(0); }, 1450);
  }
  document.querySelectorAll('[data-go]').forEach(function (a) {
    a.addEventListener('click', function (e) { go(a.getAttribute('data-go'), e); });
  });
  document.querySelectorAll('[data-boost]').forEach(function (a) {
    a.addEventListener('mouseenter', function () { if (!busy) boost(1); });
    a.addEventListener('mouseleave', function () { if (!busy) boost(0); });
  });

  // ---------- Apparitions au défilement ----------
  var els = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else els.forEach(function (el) { el.classList.add('in'); });

  // ---------- Halo du curseur ----------
  var fine = !window.matchMedia || matchMedia('(pointer: fine)').matches;
  var gx = 0, gy = 0, tx = 0, ty = 0, raf = 0;
  function tick() {
    gx += (tx - gx) * 0.14; gy += (ty - gy) * 0.14;
    glow.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)';
    raf = Math.abs(tx - gx) + Math.abs(ty - gy) > 0.3 ? requestAnimationFrame(tick) : 0;
  }
  if (hero && glow && fine) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top;
      glow.style.opacity = '1'; if (!raf) raf = requestAnimationFrame(tick);
    });
    hero.addEventListener('pointerleave', function () { glow.style.opacity = '0'; });
  }

  // ---------- Lumière dans les cartes ----------
  root.addEventListener('pointermove', function (e) {
    var c = e.target.closest && e.target.closest('.card');
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  // ---------- Devis WhatsApp ----------
  var sel = { type: 'Site vitrine', delai: 'Dans le mois', deja: 'Rien encore' };
  var msgEl = document.getElementById('wamsg'), waEl = document.getElementById('walink');
  function updateMsg() {
    var msg = 'Bonjour ADweb,\nJe souhaite un projet : ' + sel.type + '.\nDélai : ' + sel.delai.toLowerCase() +
      '.\nJ’ai déjà : ' + sel.deja.toLowerCase() + '.\nPouvez-vous me recontacter ?';
    if (msgEl) msgEl.textContent = msg;
    if (waEl) waEl.href = 'https://wa.me/213799042627?text=' + encodeURIComponent(msg);
  }
  document.querySelectorAll('.opt[data-g]').forEach(function (b) {
    b.addEventListener('click', function () {
      var g = b.getAttribute('data-g');
      document.querySelectorAll('.opt[data-g="' + g + '"]').forEach(function (o) {
        o.classList.toggle('on', o === b); o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
      });
      sel[g] = b.textContent.trim(); updateMsg();
    });
  });
  updateMsg();

  // ---------- FAQ ----------
  var qas = document.querySelectorAll('.qa');
  qas.forEach(function (q) {
    q.addEventListener('click', function () {
      var open = q.getAttribute('aria-expanded') === 'true';
      qas.forEach(function (o) {
        o.setAttribute('aria-expanded', 'false');
        o.querySelector('.sg').textContent = '+';
        document.getElementById(o.getAttribute('aria-controls')).hidden = true;
      });
      if (!open) {
        q.setAttribute('aria-expanded', 'true');
        q.querySelector('.sg').textContent = '−';
        document.getElementById(q.getAttribute('aria-controls')).hidden = false;
      }
    });
  });
})();
