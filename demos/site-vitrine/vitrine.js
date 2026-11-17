/* ADweb — démo site vitrine « dentaire » : cabinet ou fournisseur de matériel. Tout se passe dans le navigateur. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function num(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function fmt(s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k]; }); }
  function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('on'); }, 2800); }
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- État ----------
  var S = { sector: 'cabinet', lang: 'fr', device: 'desktop', view: 'site', page: 'home', tab: 'req', sel: [], color: 'bleu', mode: 'showroom', day: null, slot: null, name: '', tel: '', filled: false, sent: false, err: false, ba: 50, baMoved: false, umod: false, hot: null, notified: null, lastReq: null, reminded: false };
  var SECT = window.SECTORS, UI = window.UI;
  var CFG = {}, REQS = {}, BLOCK = {}, STATS = {};
  Object.keys(SECT).forEach(function (k) {
    var s = SECT[k];
    CFG[k] = { hours: s.hours.map(function (h) { return h ? h.slice() : null; }), closed: false, closedMsg: k === 'cabinet' ? 'Le cabinet est fermé exceptionnellement ce jeudi (formation). Réouverture samedi à 9 h.' : 'Le showroom est fermé exceptionnellement ce jeudi (inventaire). Le SAV reste joignable.', phone: s.phone, title: null };
    BLOCK[k] = {};
    STATS[k] = { visits: k === 'cabinet' ? 1284 : 2310, calls: k === 'cabinet' ? 96 : 74, wa: k === 'cabinet' ? 141 : 188, req: k === 'cabinet' ? 58 : 31, est: k === 'cabinet' ? 212 : 167 };
  });
  function sec() { return SECT[S.sector]; }
  function C() { return CFG[S.sector]; }
  function t(k) { return UI[S.lang][k]; }
  function L(o) { return o ? (o[S.lang] !== undefined ? o[S.lang] : o.fr) : ''; }
  function item(id) { return sec().services.items.filter(function (x) { return x.id === id; })[0]; }
  function isMat() { return S.sector === 'materiel'; }
  function isPlat() { return S.sector === 'cabinet'; }

  // ---------- Icônes ----------
  var IC = {
    tooth: '<path d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 5 2.2 8.5.4 2 1 5 2.6 5 1.8 0 1.6-5 4.2-5s2.4 5 4.2 5c1.6 0 2.2-3 2.6-5 .7-3.5 2.2-5.5 2.2-8.5C21 5 19.5 3 17 3c-2 0-3 1.2-5 1.2S9 3 7 3z"/>',
    chair: '<path d="M6 3c1.5 0 2.5 1 2.8 2.5L10 12h7a2 2 0 0 1 2 2v1H9.2a2 2 0 0 1-2-1.6L5 5.2A1.8 1.8 0 0 1 6 3z"/><path d="M12 15v4M8 21h8M18 12l2-4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>',
    pin: '<path d="M8 3h8l-1 5H9z"/><path d="M10 8v3h4V8M9.5 11h5l-.5 3h-4zM10 14l.5 3h3l.5-3M11 17l1 4 1-4"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    stool: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M12 9v8M7 21l5-4 5 4"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    wa: '<path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.4-1.8-1.2-2.2-2.2l1-1-1-2L9 9.5z"/>',
    cal: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    check: '<path d="M5 12l5 5L20 7"/>', alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17h.01"/>', map: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'
  };
  function ic(k, s) { return '<svg width="' + (s || 22) + '" height="' + (s || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[k] || IC.spark) + '</svg>'; }
  function img(src, w, h, alt) { return '<img src="' + src + '?auto=format&fit=crop&w=' + w + '&h=' + h + '&q=72" alt="' + esc(alt || '') + '" loading="lazy" decoding="async">'; }

  // ---------- Horaires, statut, créneaux ----------
  var DAYS = { fr: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'], ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'], en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] };
  var MON = { fr: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'], ar: ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'], en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] };
  function mins(hm) { var p = hm.split(':'); return +p[0] * 60 + +p[1]; }
  function hm(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
  function status() {
    if (C().closed) return { open: false, txt: t('excep') };
    var now = new Date(), d = now.getDay(), m = now.getHours() * 60 + now.getMinutes(), h = C().hours[d];
    if (h && m >= mins(h[0]) && m < mins(h[1])) return { open: true, txt: fmt(t('open'), { t: h[1] }) };
    for (var k = 0; k < 8; k++) {
      var dd = (d + k) % 7, hh = C().hours[dd];
      if (!hh || (k === 0 && m >= mins(hh[0]))) continue;
      return { open: false, txt: fmt(t('shut'), { w: k === 0 ? t('today') : k === 1 ? t('tomorrow') : DAYS[S.lang][dd], t: hh[0] }) };
    }
    return { open: false, txt: t('closedD') };
  }
  function openDays(key) {
    var cfg = CFG[key || S.sector], out = [], d = new Date(); d.setHours(12, 0, 0, 0);
    for (var k = 1; out.length < 6 && k < 20; k++) { var x = new Date(d.getTime() + k * 864e5); if (cfg.hours[x.getDay()]) out.push(x); }
    return out;
  }
  function dkey(x) { return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); }
  function dfrom(k) { return new Date(k + 'T12:00:00'); }
  function dlabel(x, lang, long) { lang = lang || S.lang; return long ? DAYS[lang][x.getDay()] + ' ' + x.getDate() + ' ' + MON[lang][x.getMonth()] : DAYS[lang][x.getDay()].slice(0, lang === 'ar' ? 12 : 3) + (lang === 'ar' ? '' : '.'); }
  function daySlots(x, key) {
    var h = CFG[key || S.sector].hours[x.getDay()]; if (!h) return [];
    var out = [], a = mins(h[0]), b = mins(h[1]);
    for (var m = a; m + 30 <= b; m += 30) { if (b - a > 360 && m >= 12 * 60 + 30 && m < 13 * 60 + 30) continue; out.push(hm(m)); }
    return out;
  }
  function taken(day, slot, key) {
    key = key || S.sector;
    if (BLOCK[key][day + '|' + slot]) return 'blocked';
    var r = REQS[key].filter(function (q) { return q.day === day && q.slot === slot && q.st !== 'move'; })[0];
    return r ? r : null;
  }

  // ---------- Demandes (seed) ----------
  Object.keys(SECT).forEach(function (k) {
    var days = openDays(k);
    REQS[k] = SECT[k].seed.map(function (r, i) { return { id: k + i, name: r[0], tel: r[1], items: [r[2]], day: dkey(days[r[3]]), slot: r[4], st: r[5], ago: ['il y a 2 h', 'hier', 'hier', 'il y a 3 j'][i] || 'hier', thread: r[5] === 'ok' ? [{ o: 1, x: 'confirm' }] : [] }; });
  });

  // ---------- Prix & sélection ----------
  function priceTxt(it) {
    if (!it.min && !it.max) return L({ fr: 'Offert', ar: 'مجاني', en: 'Included' });
    if (it.min === it.max) return isMat() ? num(it.min) + (S.lang === 'en' ? ' DZD' : S.lang === 'ar' ? ' دج' : ' DA') : fmt(t('from'), { p: num(it.min) });
    return fmt(t('from'), { p: num(it.min) });
  }
  function estimate(sel) {
    var a = 0, b = 0, d = 0;
    sel.forEach(function (id) { var it = item(id); if (it) { a += it.min; b += it.max; d += it.dur || 0; } });
    return { a: a, b: b, d: d };
  }
  function moneyRange(e) { return e.a === e.b ? num(e.a) + (S.lang === 'en' ? ' DZD' : S.lang === 'ar' ? ' دج' : ' DA') : fmt(t('range'), { a: num(e.a), b: num(e.b) }); }
  function toggleSel(id) {
    var it = item(id);
    if (isMat() && it.model) { S.sel = S.sel.filter(function (x) { return !item(x).model; }); S.sel.unshift(id); }
    else { var i = S.sel.indexOf(id); if (i >= 0) S.sel.splice(i, 1); else S.sel.push(id); }
    STATS[S.sector].est++;
  }
  function resetSel() { S.sel = isMat() ? ['k3', 'install'] : []; S.color = 'bleu'; S.mode = 'showroom'; S.day = S.slot = null; S.filled = S.sent = S.err = false; }

  // ---------- Vidéo de fond (une par métier, conservée entre deux rendus) ----------
  var VID = {};
  function video() {
    var k = S.sector;
    if (!VID[k]) {
      var v = document.createElement('video'), s = sec().video;
      v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.setAttribute('aria-hidden', 'true');
      v.preload = 'auto'; v.poster = s.poster; v.src = window.innerWidth < 760 ? s.sd : s.hd;
      VID[k] = v;
    }
    return VID[k];
  }
  function playVideo() { var v = VID[S.sector]; if (v && !reduce && S.view === 'site' && S.page === 'home') v.play().catch(function () {}); }

  // ---------- Thème ----------
  function applyTheme() {
    var th = sec().theme, st = $('#site').style;
    st.setProperty('--p', th.p); st.setProperty('--pd', th.pd); st.setProperty('--pt', th.pt); st.setProperty('--bg', th.bg); st.setProperty('--bg2', th.bg2); st.setProperty('--card', th.card); st.setProperty('--glow', th.glow);
  }

  // ---------- Rendu du site ----------
  function renderSite() {
    var site = $('#site');
    site.setAttribute('lang', S.lang); site.setAttribute('dir', S.lang === 'ar' ? 'rtl' : 'ltr');
    applyTheme();
    if (S.page === 'rdv') { site.innerHTML = rdvPage(); renderBooking(); return; }
    site.innerHTML = homePage();
    var v = video(); $('.vbg').appendChild(v); playVideo();
    renderEst(); setBa(S.ba);
  }
  function logoHtml() { var s = sec(); return '<span class="mk">' + ic(s.icon, 22) + '</span><span><b>' + esc(L(s.brand)) + '</b><small>' + esc(L(s.sub)) + '</small></span>'; }
  function homePage() {
    var s = sec(), st = status(), nav = L(s.nav), ids = ['s-svc', 's-est', 's-ba', 's-rev', 's-acc'], today = new Date().getDay();
    var h1 = S.lang === 'fr' && C().title ? esc(C().title) : L(s.hero.h1);
    var models = s.services.items.filter(function (x) { return isMat() ? x.model : true; });
    var order = [6, 0, 1, 2, 3, 4, 5];
    return (C().closed ? '<div class="closed" id="closedBanner" role="status">⚠ ' + esc(C().closedMsg) + '</div>' : '') +
      '<section class="landing" id="home"><div class="vbg"></div>' +
      '<header class="lhead"><div class="in"><a class="logo" href="#" data-noop>' + logoHtml() + '</a>' +
      '<nav class="lnav">' + nav.map(function (n, i) { return '<a href="#' + ids[i] + '" data-jump="' + ids[i] + '">' + esc(n) + '</a>'; }).join('') + '</nav>' +
      '<div class="lr"><div class="lang" id="langSw" role="group" aria-label="Langue">' + [['fr', 'FR'], ['ar', 'ع'], ['en', 'EN']].map(function (l) { return '<button type="button" data-lang="' + l[0] + '" class="' + (S.lang === l[0] ? 'on' : '') + '">' + l[1] + '</button>'; }).join('') + '</div>' +
      '<button class="ubtn" type="button" id="urgBtn" data-urg>' + ic('alert', 16) + '<span>' + esc(L(s.urgent.btn)) + '</span></button></div></div></header>' +
      '<div class="hin"><div class="live rise' + (st.open ? '' : ' off') + '" id="live" style="animation-delay:.1s"><i></i>' + esc(st.txt) + '</div>' +
      '<p class="eb rise" style="animation-delay:.2s">' + esc(L(s.hero.eb)) + '</p><h1 class="rise" style="animation-delay:.3s">' + h1 + '</h1><p class="lead rise" style="animation-delay:.45s">' + esc(L(s.hero.lead)) + '</p>' +
      '<div class="cta rise" style="animation-delay:.6s"><button class="btn w" type="button" id="heroBook" data-book>' + ic('cal', 18) + esc(L(s.hero.book)) + '</button><button class="btn g" type="button" data-jump="s-est">' + esc(L(s.hero.second)) + '</button></div>' +
      '<div class="trust rise" style="animation-delay:.75s">' + s.trust.map(function (x) { return '<div><b>' + x[0] + '</b>' + esc(L(x[1])) + '</div>'; }).join('') + '</div></div></section>' +
      '<nav class="snav"><div class="in"><a class="logo" href="#" data-top>' + logoHtml() + '</a><div class="links">' + nav.map(function (n, i) { return '<a href="#' + ids[i] + '" data-jump="' + ids[i] + '">' + esc(n) + '</a>'; }).join('') + '</div><button class="btn p" type="button" data-book>' + esc(L(s.hero.book)) + '</button></div></nav>' +
      '<div class="tex">' +
      '<section class="blk" id="s-svc"><div class="in"><p class="eb">' + esc(L(s.services.eb)) + '</p><h2 class="h">' + esc(L(s.services.h)) + '</h2><p class="lead">' + esc(L(s.services.lead)) + '</p><div class="grid3">' +
      models.map(function (it) { return '<article class="svc">' + (it.img ? '<div class="ph">' + img(it.img, 640, 400, L(it.n)) + '</div>' : '<div class="ic">' + ic(it.ic) + '</div>') + '<h3>' + esc(L(it.n)) + '</h3><p>' + esc(L(it.d)) + '</p><span class="pr">' + priceTxt(it) + '</span></article>'; }).join('') + '</div></div></section>' +
      '<section class="blk alt" id="s-est"><div class="in"><p class="eb">' + esc(L(s.estim.eb)) + '</p><h2 class="h">' + esc(L(s.estim.h)) + '</h2><p class="lead">' + esc(L(s.estim.lead)) + '</p><div class="est" id="estBox"></div></div></section>' +
      '<section class="blk" id="s-ba"><div class="in"><p class="eb">' + esc(L(s.ba.eb)) + '</p><h2 class="h">' + esc(L(s.ba.h)) + '</h2><p class="lead">' + esc(L(s.ba.lead)) + '</p>' +
      '<div class="ba" id="ba">' + img(s.ba.img, 1400, 700, L(s.ba.h)).replace('<img ', '<img class="af" ') + img(s.ba.img, 1400, 700, '').replace('<img ', '<img class="bf" style="filter:' + s.ba.before + '" ') +
      '<div class="hd"><i>⇆</i></div><span class="tg l">' + t('baBefore') + '</span><span class="tg r">' + t('baAfter') + '</span><span class="nt">' + t('baNote') + '</span>' +
      '<input type="range" min="0" max="100" value="' + S.ba + '" id="baRange" aria-label="' + esc(t('baBefore') + ' / ' + t('baAfter')) + '"></div></div></section>' +
      '<section class="blk alt" id="s-gal"><div class="in"><p class="eb">' + esc(L(s.gallery.eb)) + '</p><h2 class="h">' + esc(L(s.gallery.h)) + '</h2><div class="gal">' +
      s.gallery.items.map(function (g, i) { return '<figure>' + img(g[0], i ? 600 : 900, 560, L(g[1])) + '<figcaption>' + esc(L(g[1])) + '</figcaption></figure>'; }).join('') + '</div></div></section>' +
      '<section class="blk" id="s-rev"><div class="in"><p class="eb">' + esc(L(s.reviews.eb)) + '</p><h2 class="h">' + esc(L(s.reviews.h)) + '</h2><div class="revs">' +
      s.reviews.items.map(function (r) { return '<figure class="rev"><div class="s" aria-label="5/5">★★★★★</div><p>« ' + esc(L(r[0])) + ' »</p><b>' + esc(r[1]) + '</b><small>' + esc(L(r[2])) + '</small></figure>'; }).join('') + '</div></div></section>' +
      '<section class="blk alt" id="s-acc"><div class="in"><p class="eb">' + t('hoursEb') + '</p><h2 class="h">' + t('hoursH') + '</h2><div class="acc"><div class="hrs">' +
      order.map(function (d) { var h = C().hours[d]; return '<div class="' + (d === today ? 'today' : '') + '"><span>' + DAYS[S.lang][d].charAt(0).toUpperCase() + DAYS[S.lang][d].slice(1) + '</span><span>' + (h && !(C().closed && d === today) ? h[0] + ' – ' + h[1] : t('closedD')) + '</span></div>'; }).join('') +
      '</div><div class="map">' + mapArt() + '<div class="ad"><span><b>' + esc(L(s.access.addr)) + '</b><small>' + esc(L(s.access.park)) + '</small></span><button class="btn p sm" type="button" data-itin>' + ic('map', 16) + t('itin') + '</button></div></div></div></div></section>' +
      '</div><footer class="foot"><div class="in"><span>© ' + esc(L(s.brand)) + ' — ADweb · ' + t('photos') + '</span><span>' + esc(C().phone) + '</span></div></footer>' +
      '<div class="mbar" id="mbar"><button class="btn o" type="button" data-call>' + ic('phone', 16) + t('call') + '</button><button class="btn wa" type="button" data-wa>' + ic('wa', 16) + t('wa') + '</button><button class="btn p" type="button" data-book>' + ic('cal', 16) + esc(isMat() ? L({ fr: 'Démo', ar: 'عرض', en: 'Demo' }) : L({ fr: 'RDV', ar: 'موعد', en: 'Book' })) + '</button></div>';
  }
  function mapArt() {
    return '<svg viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="600" height="340" fill="#e7efe6"/><g stroke="#fff" stroke-width="14" fill="none"><path d="M-10 90h620M-10 230h620M130-10v360M420-10v360M0 340L600 0"/></g><g stroke="#fff" stroke-width="6" fill="none" opacity=".8"><path d="M-10 160h620M270-10v360M520-10v360"/></g><rect x="150" y="105" width="100" height="110" rx="6" fill="#d7e5d4"/><rect x="440" y="250" width="150" height="80" rx="6" fill="#cfe0f3"/><g transform="translate(300 128)"><circle r="34" fill="' + sec().theme.p + '" opacity=".15"/><path d="M0 18s-16-14-16-26a16 16 0 0 1 32 0C16 4 0 18 0 18z" fill="' + sec().theme.p + '" transform="translate(0 -8)"/><circle cy="-16" r="6" fill="#fff"/></g></svg>';
  }

  // Simulateur (cabinet) / configurateur (fournisseur)
  function renderEst() {
    var box = $('#estBox'); if (!box) return;
    var s = sec(), e = estimate(S.sel), ck = ic('check', 14);
    var left;
    if (isMat()) {
      var models = s.services.items.filter(function (x) { return x.model; }), opts = s.services.items.filter(function (x) { return !x.model; });
      left = '<div><p class="st2">' + esc(L({ fr: 'Fauteuil', ar: 'الكرسي', en: 'Chair' })) + '</p><div class="opts" id="estModels">' + models.map(function (it) { return '<button type="button" class="opt rad' + (S.sel.indexOf(it.id) >= 0 ? ' on' : '') + '" data-sel="' + it.id + '"><span class="th">' + img(it.img, 120, 120, '') + '</span><span><b>' + esc(L(it.n)) + '</b><small>' + priceTxt(it) + '</small></span></button>'; }).join('') + '</div>' +
        '<p class="st2">' + esc(L({ fr: 'Sellerie', ar: 'التنجيد', en: 'Upholstery' })) + '</p><div class="sw" id="estColors">' + s.colors.map(function (c) { return '<button type="button" data-color="' + c[0] + '" class="' + (S.color === c[0] ? 'on' : '') + '" style="background:' + c[1] + '" aria-label="' + esc(L(c[3])) + '" title="' + esc(L(c[3])) + '"></button>'; }).join('') + '</div>' +
        '<p class="st2">' + esc(L({ fr: 'Équipements', ar: 'المعدات', en: 'Equipment' })) + '</p><div class="opts" id="estOpts">' + opts.map(function (it) { return '<button type="button" class="opt' + (S.sel.indexOf(it.id) >= 0 ? ' on' : '') + '" data-sel="' + it.id + '"><span class="ck">' + ck + '</span><span><b>' + esc(L(it.n)) + '</b><small>' + priceTxt(it) + '</small></span></button>'; }).join('') + '</div></div>';
    } else {
      left = '<div class="opts" id="estOpts">' + s.services.items.map(function (it) { return '<button type="button" class="opt' + (S.sel.indexOf(it.id) >= 0 ? ' on' : '') + '" data-sel="' + it.id + '"><span class="ck">' + ck + '</span><span><b>' + esc(L(it.n)) + '</b><small>' + (it.min === it.max ? num(it.min) : num(it.min) + ' – ' + num(it.max)) + (S.lang === 'ar' ? ' دج' : S.lang === 'en' ? ' DZD' : ' DA') + ' · ' + it.dur + ' ' + t('min') + '</small></span></button>'; }).join('') + '</div>';
    }
    var col = isMat() ? s.colors.filter(function (c) { return c[0] === S.color; })[0] : null;
    var pv = isMat() ? '<div class="pv">' + img(col ? col[2] : s.services.items[1].img, 800, 500, '') + '</div>' : '';
    box.innerHTML = left + '<aside class="sum" id="estSum">' + pv + '<small>' + t('estTotal') + '</small>' +
      (S.sel.length ? '<div class="tot" id="estTot">' + moneyRange(e) + '</div>' + (e.d ? '<div style="color:#94a3b8;font-size:13px;font-weight:600">≈ ' + e.d + ' ' + t('min') + '</div>' : '') +
        '<ul>' + S.sel.map(function (id) { var it = item(id); return '<li><span>' + esc(L(it.n)) + '</span><span>' + (it.min ? num(it.min) : '—') + '</span></li>'; }).join('') + (col ? '<li><span>' + esc(L({ fr: 'Sellerie', ar: 'التنجيد', en: 'Upholstery' })) + '</span><span>' + esc(L(col[3])) + '</span></li>' : '') + '</ul><p>' + t('estNote') + '</p>'
        : '<div class="tot" id="estTot">—</div><p style="margin-top:10px">' + t('estNone') + '</p>') +
      '<button class="btn p" type="button" id="estBook" data-book' + (S.sel.length ? '' : ' disabled') + '>' + ic('cal', 18) + t('estBook') + '</button></aside>';
  }
  function setBa(v) { S.ba = v; var b = $('#ba'); if (b) b.style.setProperty('--pos', v + '%'); }

  // Page rendez-vous / démonstration
  function rdvPage() {
    var s = sec();
    return '<div class="rdvp tex"><header class="rhead"><div class="in"><div class="top"><a class="logo" href="#" data-home style="color:#fff">' + logoHtml() + '</a><a class="bk" href="#" data-home>' + t('back') + '</a></div>' +
      '<h1>' + esc(L(s.booking.h)) + '</h1><p>' + esc(L(s.booking.lead)) + '</p></div></header>' +
      '<div class="in"><div class="rbody"><div class="rbox" id="rbox"></div><aside class="sum" id="rsum"></aside></div></div></div>';
  }
  function renderBooking() {
    var box = $('#rbox'); if (!box) return;
    var s = sec(), days = openDays();
    if (S.sent) {
      var r = REQS[S.sector].filter(function (q) { return q.id === S.lastReq; })[0];
      box.innerHTML = '<div class="sent"><div class="ok">' + ic('check', 32) + '</div><h3>' + t('sentH') + '</h3><p>' + fmt(t('sentP'), { tel: esc(S.tel), what: esc(r.items.map(function (i) { return L(item(i).n); }).join(', ')), when: dlabel(dfrom(r.day), null, true) + ' ' + t('at') + ' ' + r.slot }) + '</p><button class="btn o" type="button" id="again" style="margin-top:18px">' + t('again') + '</button></div>';
    } else {
      if (S.day && !days.some(function (d) { return dkey(d) === S.day; })) { S.day = null; S.slot = null; }
      var cur = S.day ? dfrom(S.day) : null;
      var modes = isMat() ? [['showroom', { fr: 'Au showroom', ar: 'في صالة العرض', en: 'At the showroom' }], ['cabinet', { fr: 'Dans mon cabinet', ar: 'في عيادتي', en: 'At my practice' }], ['visio', { fr: 'En visio', ar: 'عن بعد', en: 'Video call' }]] : null;
      box.innerHTML = '<p class="st2">' + esc(L(s.booking.q1)) + '</p><div class="ch2" id="bkItems">' + s.services.items.filter(function (it) { return !(isMat() && it.id === 'install'); }).map(function (it) { return '<button type="button" class="c2' + (S.sel.indexOf(it.id) >= 0 ? ' on' : '') + '" data-sel="' + it.id + '">' + esc(L(it.n)) + '</button>'; }).join('') + '</div>' +
        (modes ? '<p class="st2">' + esc(L({ fr: 'Où ?', ar: 'أين؟', en: 'Where?' })) + '</p><div class="ch2">' + modes.map(function (m) { return '<button type="button" class="c2' + (S.mode === m[0] ? ' on' : '') + '" data-mode="' + m[0] + '">' + esc(L(m[1])) + '</button>'; }).join('') + '</div>' : '') +
        '<p class="st2">' + t('q2') + '</p><div class="ch2" id="dayPick">' + days.map(function (d) { return '<button type="button" class="c2 day' + (S.day === dkey(d) ? ' on' : '') + '" data-day="' + dkey(d) + '"><small>' + dlabel(d) + '</small><b>' + d.getDate() + '</b></button>'; }).join('') + '</div>' +
        (cur ? '<p class="st2">' + t('q3') + '</p><div class="slots" id="slotPick">' + daySlots(cur).map(function (x) { var tk = taken(S.day, x); return '<button type="button" class="c2' + (S.slot === x ? ' on' : '') + '" data-slot="' + x + '"' + (tk ? ' disabled' : '') + '>' + x + '</button>'; }).join('') + '</div>' : '') +
        '<button type="button" class="tf2" id="bkTest">' + t('test') + '</button>' +
        '<div class="f2"><input id="r-name" autocomplete="name" placeholder="' + t('name') + '" aria-label="' + t('name') + '" value="' + esc(S.name) + '"><input id="r-tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="' + t('tel') + '" aria-label="' + t('tel') + '" value="' + esc(S.tel) + '"></div>' +
        (S.err ? '<p class="er2">' + t('err') + '</p>' : '') + '<button class="btn p" type="button" id="bkSend">' + ic('cal', 18) + t('send') + '</button>';
    }
    var e = estimate(S.sel), sum = $('#rsum');
    if (sum) sum.innerHTML = '<small>' + t('estTotal') + '</small><div class="tot">' + (S.sel.length ? moneyRange(e) : '—') + '</div>' +
      (S.sel.length ? '<ul>' + S.sel.map(function (id) { return '<li><span>' + esc(L(item(id).n)) + '</span><span>' + (item(id).min ? num(item(id).min) : '—') + '</span></li>'; }).join('') + '</ul>' : '<p style="margin-top:10px">' + t('estNone') + '</p>') +
      '<p>' + t('estNote') + '</p><div style="display:grid;gap:8px;font-size:13px;color:#cbd5e1">' + [L({ fr: 'Confirmation par SMS dans la journée', ar: 'تأكيد برسالة خلال اليوم', en: 'Text confirmation the same day' }), (isPlat() ? L({ fr: 'Rappel automatique la veille', ar: 'تذكير تلقائي قبل يوم', en: 'Automatic reminder the day before' }) : L({ fr: 'Un conseiller dédié à votre projet', ar: 'مستشار مخصص لمشروعك', en: 'A dedicated advisor for your project' })), L({ fr: 'Annulation en un message', ar: 'إلغاء برسالة واحدة', en: 'Cancel with one message' })].map(function (x) { return '<div>✓ ' + esc(x) + '</div>'; }).join('') + '</div>';
  }
  function fillBooking() {
    var days = openDays();
    if (!S.sel.length) S.sel = isMat() ? ['k3'] : ['detart'];
    if (!S.day) S.day = dkey(days[0]);
    if (!S.slot) { var f = daySlots(dfrom(S.day)).filter(function (x) { return !taken(S.day, x); })[0]; S.slot = f || null; }
    S.name = isMat() ? 'Dr Amine Benali' : 'Amine Benali'; S.tel = '0555 12 34 56'; S.filled = true; S.err = false; renderBooking();
  }
  function sendBooking() {
    var nm = $('#r-name'), tl = $('#r-tel'); if (nm) S.name = nm.value.trim(); if (tl) S.tel = tl.value.trim();
    var items = S.sel.filter(function (x) { return x !== 'install'; });
    if (!items.length || !S.day || !S.slot || S.name.length < 3 || !/^0[5-7]\d{8}$/.test(S.tel.replace(/\s/g, ''))) { S.err = true; renderBooking(); return; }
    var r = { id: 'n' + Date.now(), name: S.name, tel: S.tel, items: items, day: S.day, slot: S.slot, st: 'new', ago: 'à l’instant', thread: [], fresh: true, mode: isMat() ? S.mode : null };
    REQS[S.sector].unshift(r); S.lastReq = r.id; S.sent = true; S.err = false; STATS[S.sector].req++;
    renderBooking();
    setTimeout(function () { notify(r); }, 1300);
  }

  // ---------- Fenêtre urgence / SAV ----------
  function openUrgent() {
    var s = sec(), st = status();
    $('#umodal').innerHTML = '<div class="umod" id="umod"><div class="ubox" role="dialog" aria-modal="true" dir="' + (S.lang === 'ar' ? 'rtl' : 'ltr') + '"><div class="uh"><button class="x" type="button" data-ux aria-label="Fermer">✕</button><span class="live' + (st.open ? '' : ' off') + '" style="margin:0;background:rgba(255,255,255,.18)"><i></i>' + esc(st.txt) + '</span><h3>' + esc(L(s.urgent.title)) + '</h3><p>' + esc(L(s.urgent.text)) + '</p></div>' +
      '<div class="ub"><div class="row" id="urgActs"><button class="btn u" type="button" data-call>' + ic('phone', 18) + t('call') + '</button><button class="btn wa" type="button" data-wa>' + ic('wa', 18) + t('wa') + '</button></div><ul>' + L(s.urgent.tips).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></div></div>';
    S.umod = true;
  }
  function closeUrgent() { $('#umodal').innerHTML = ''; S.umod = false; }
  $('#umodal').addEventListener('click', function (e) {
    if (e.target.id === 'umod' || e.target.closest('[data-ux]')) return closeUrgent();
    if (e.target.closest('[data-call]')) { STATS[S.sector].calls++; toast(L({ fr: 'Sur le vrai site, ce bouton lance l’appel.', ar: 'في الموقع الحقيقي، يطلق هذا الزر المكالمة.', en: 'On the real site, this button starts the call.' })); }
    if (e.target.closest('[data-wa]')) { STATS[S.sector].wa++; toast(L({ fr: 'Sur le vrai site, WhatsApp s’ouvre avec un message prêt.', ar: 'في الموقع الحقيقي، يُفتح واتساب برسالة جاهزة.', en: 'On the real site, WhatsApp opens with a ready message.' })); }
  });

  // ---------- Interactions du site ----------
  function siteScrollTop() { window.scrollTo(0, 0); var s = $('#site'); if (s) s.scrollTop = 0; }
  $('#site').addEventListener('click', function (e) {
    var b = e.target.closest('button, a'); if (!b) return;
    if (b.hasAttribute('data-noop')) { e.preventDefault(); return; }
    if (b.hasAttribute('data-top')) { e.preventDefault(); siteScrollTop(); return; }
    if (b.dataset.jump) { e.preventDefault(); var x = document.getElementById(b.dataset.jump); if (x) x.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (b.dataset.lang) { S.lang = b.dataset.lang; renderSite(); return; }
    if (b.hasAttribute('data-urg')) { openUrgent(); return; }
    if (b.hasAttribute('data-book')) { if (b.disabled) return; var r = b.getBoundingClientRect(); goPage('rdv', r.left + r.width / 2, r.top + r.height / 2); return; }
    if (b.hasAttribute('data-home')) { e.preventDefault(); goPage('home', window.innerWidth / 2, 80); return; }
    if (b.hasAttribute('data-call')) { STATS[S.sector].calls++; toast(L({ fr: 'Sur le vrai site, ce bouton lance l’appel.', ar: 'في الموقع الحقيقي، يطلق هذا الزر المكالمة.', en: 'On the real site, this button starts the call.' })); return; }
    if (b.hasAttribute('data-wa')) { STATS[S.sector].wa++; toast(L({ fr: 'Sur le vrai site, WhatsApp s’ouvre avec un message prêt.', ar: 'في الموقع الحقيقي، يُفتح واتساب برسالة جاهزة.', en: 'On the real site, WhatsApp opens with a ready message.' })); return; }
    if (b.hasAttribute('data-itin')) { toast(L({ fr: 'Sur le vrai site, l’itinéraire s’ouvre dans Google Maps.', ar: 'في الموقع الحقيقي، تُفتح الاتجاهات في خرائط Google.', en: 'On the real site, directions open in Google Maps.' })); return; }
    if (b.dataset.sel) { toggleSel(b.dataset.sel); if (S.page === 'rdv') renderBooking(); else { renderEst(); var tt = $('#estTot'); if (tt) { tt.classList.add('flash'); setTimeout(function () { tt.classList.remove('flash'); }, 500); } } return; }
    if (b.dataset.color) { S.color = b.dataset.color; renderEst(); return; }
    if (b.dataset.mode) { S.mode = b.dataset.mode; renderBooking(); return; }
    if (b.dataset.day) { S.day = b.dataset.day; S.slot = null; renderBooking(); return; }
    if (b.dataset.slot && !b.disabled) { S.slot = b.dataset.slot; renderBooking(); return; }
    if (b.id === 'bkTest') { fillBooking(); return; }
    if (b.id === 'bkSend') { sendBooking(); return; }
    if (b.id === 'again') { resetSel(); renderBooking(); }
  });
  $('#site').addEventListener('input', function (e) {
    if (e.target.id === 'baRange') { setBa(+e.target.value); S.baMoved = true; }
    if (e.target.id === 'r-name') S.name = e.target.value;
    if (e.target.id === 'r-tel') S.tel = e.target.value;
  });

  // ---------- Pages et transition avec logo ----------
  var busy = false;
  function setPage(p, push) {
    S.page = p; renderSite(); siteScrollTop();
    if (push !== false) { try { if (p === 'rdv') history.pushState(null, '', '#rendez-vous'); else if (location.hash) history.pushState(null, '', location.pathname + location.search); } catch (e) {} }
  }
  function goPage(p, x, y) {
    if (busy || S.page === p) return;
    busy = true;
    veil(x, y, function () { if (p === 'rdv' && !S.sent) S.sent = false; setPage(p); }).then(function () { busy = false; });
  }
  window.addEventListener('popstate', function () { if (S.view === 'site') setPage(location.hash === '#rendez-vous' ? 'rdv' : 'home', false); });
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function veil(x0, y0, mid) {
    if (reduce) { mid(); return Promise.resolve(); }
    var c = document.createElement('canvas'); c.id = 'trx';
    var d = Math.min(window.devicePixelRatio || 1, 1.5), W = window.innerWidth, H = window.innerHeight;
    c.width = W * d; c.height = H * d; document.body.appendChild(c);
    var x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0);
    var th = sec().theme, D1 = 620, HOLD = 620, D2 = 720, swapped = false, R = Math.hypot(Math.max(x0, W - x0), Math.max(y0, H - y0)) * 1.05;
    var iconPath = new Path2D(sec().icon === 'chair' ? 'M6 3c1.5 0 2.5 1 2.8 2.5L10 12h7a2 2 0 0 1 2 2v1H9.2a2 2 0 0 1-2-1.6L5 5.2A1.8 1.8 0 0 1 6 3zM12 15v4M8 21h8M18 12l2-4' : 'M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 5 2.2 8.5.4 2 1 5 2.6 5 1.8 0 1.6-5 4.2-5s2.4 5 4.2 5c1.6 0 2.2-3 2.6-5 .7-3.5 2.2-5.5 2.2-8.5C21 5 19.5 3 17 3c-2 0-3 1.2-5 1.2S9 3 7 3z');
    var brand = L(sec().brand), sub = L(sec().sub);
    function fill() { var g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, th.p); g.addColorStop(1, th.pd); return g; }
    function logo(a) {
      var s = Math.min(1, W / 720);
      x.save(); x.globalAlpha = a; x.translate(W / 2, H / 2 + (1 - a) * 16);
      x.fillStyle = 'rgba(255,255,255,.14)'; x.beginPath(); x.arc(0, -70 * s, 44 * s, 0, Math.PI * 2); x.fill();
      x.save(); x.translate(-24 * s, -94 * s); x.scale(2 * s, 2 * s); x.strokeStyle = '#fff'; x.lineWidth = 1.6; x.lineCap = 'round'; x.lineJoin = 'round'; x.stroke(iconPath); x.restore();
      x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = '800 ' + Math.round(54 * s) + 'px ' + (S.lang === 'ar' ? '"Noto Kufi Arabic",' : '') + '"Plus Jakarta Sans", sans-serif'; x.fillText(brand, 0, 14 * s);
      x.font = '700 ' + Math.round(14 * s) + 'px ' + (S.lang === 'ar' ? '"Noto Kufi Arabic",' : '') + '"Plus Jakarta Sans", sans-serif'; x.fillStyle = 'rgba(255,255,255,.75)'; x.fillText(sub.toUpperCase(), 0, 58 * s);
      x.restore();
    }
    return new Promise(function (res) {
      var t0 = performance.now();
      (function f(now) {
        var t = now - t0; x.clearRect(0, 0, W, H);
        if (t < D1) { x.fillStyle = fill(); x.beginPath(); x.arc(x0, y0, Math.max(1, ease(t / D1) * R), 0, Math.PI * 2); x.fill(); }
        else {
          if (!swapped) { swapped = true; mid(); }
          x.fillStyle = fill(); x.fillRect(0, 0, W, H);
          if (t > D1 + HOLD) { var k = ease(Math.min(1, (t - D1 - HOLD) / D2)); x.save(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(W / 2, H / 2, Math.max(1, k * Math.hypot(W, H) * .6), 0, Math.PI * 2); x.fill(); x.restore(); }
        }
        var la = t < D1 - 150 ? 0 : t < D1 + 150 ? (t - D1 + 150) / 300 : t < D1 + HOLD ? 1 : Math.max(0, 1 - (t - D1 - HOLD) / 260);
        if (la > 0) logo(ease(Math.min(1, la)));
        if (t < D1 + HOLD + D2) requestAnimationFrame(f); else { c.remove(); res(); }
      })(t0);
    });
  }

  // ---------- Barre démo : métier, aperçu ----------

  function setDevice(d) {
    S.device = d; $('#stage').classList.toggle('phone', d === 'phone');
    $$('#devToggle button').forEach(function (b) { b.classList.toggle('on', b.dataset.dev === d); });
    if (S.view !== 'site') go('site');
  }
  $('#devToggle').addEventListener('click', function (e) { var b = e.target.closest('[data-dev]'); if (b) setDevice(b.dataset.dev); });

  // ---------- Vues site / espace gérant ----------
  function go(v) {
    S.view = v; $('#stage').hidden = v !== 'site'; $('#admin').hidden = v !== 'admin';
    $('#sw').textContent = v === 'site' ? 'Espace gérant' : 'Voir le site';
    closeUrgent();
    if (v === 'site') { renderSite(); } else { if (VID[S.sector]) VID[S.sector].pause(); renderAdmin(); }
    siteScrollTop();
  }
  $('#sw').onclick = function () { go(S.view === 'site' ? 'admin' : 'site'); };
  $('#viewSite').onclick = function () { S.page = 'home'; go('site'); };

  // ---------- Notification ----------
  function notify(r) {
    var s = sec(), d = dfrom(r.day);
    $('#notif').innerHTML = '<span class="ic" style="background:' + s.theme.p + '">' + ic(s.icon, 20) + '</span><span><span class="t">' + esc(L(s.brand)) + ' · ' + (isMat() ? 'Demande de démo' : 'Demande de RDV') + ' <span>maintenant</span></span><span class="m">' + esc(r.name) + ' — ' + esc(r.items.map(function (i) { return item(i).n.fr; }).join(', ')) + ', ' + dlabel(d, 'fr', true) + ' à ' + r.slot + '</span></span>';
    $('#notif').classList.add('on'); S.notified = r.id;
  }
  $('#notif').onclick = function () { $('#notif').classList.remove('on'); S.hot = S.notified; S.tab = 'req'; go('admin'); };

  // ---------- Espace gérant ----------
  var COLORS = ['#0f766e', '#2563eb', '#7c3aed', '#c2410c', '#db2777', '#0891b2', '#65a30d'];
  function itemColor(id) { var i = sec().services.items.map(function (x) { return x.id; }).indexOf(id); return COLORS[(i < 0 ? 0 : i) % COLORS.length]; }
  function whenFr(r) { return dlabel(dfrom(r.day), 'fr', true) + ' à ' + r.slot; }
  function renderAdmin() {
    var s = sec();
    $('#aLogo').innerHTML = ic(s.icon, 22); $('#aLogo').style.background = s.theme.p; $('#aName').textContent = s.brand.fr;
    var n = REQS[S.sector].filter(function (r) { return r.st === 'new'; }).length;
    var tabs = isPlat() ? [['agenda', 'Agenda'], ['req', s.admin.reqTab], ['stats', 'Statistiques'], ['site', 'Mon site']] : [['req', s.admin.reqTab], ['stats', 'Statistiques'], ['site', 'Mon site']];
    if (!isPlat() && S.tab === 'agenda') S.tab = 'req';
    $('#tabs').innerHTML = tabs.map(function (x) { return '<button class="tab' + (S.tab === x[0] ? ' on' : '') + '" data-tab="' + x[0] + '" type="button" role="tab" aria-selected="' + (S.tab === x[0]) + '">' + x[1] + (x[0] === 'req' && n ? '<span class="c">' + n + '</span>' : '') + '</button>'; }).join('');
    if (S.tab === 'agenda') renderAgenda(); else if (S.tab === 'req') renderReqs(); else if (S.tab === 'stats') renderStats(); else renderEditor();
  }
  $('#tabs').addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (b) { S.tab = b.dataset.tab; renderAdmin(); } });

  function renderAgenda() {
    var days = openDays(), rows = [], lo = 24 * 60, hi = 0;
    days.forEach(function (d) { var h = C().hours[d.getDay()]; lo = Math.min(lo, mins(h[0])); hi = Math.max(hi, mins(h[1])); });
    for (var m = lo; m + 30 <= hi; m += 30) rows.push(hm(m));
    var html = '<div class="bar2"><h2>Agenda de la semaine</h2><p>Cliquez sur un créneau libre pour le <b>bloquer</b> (congés, formation…) : il disparaît aussitôt de la prise de rendez-vous en ligne.</p></div>' +
      '<div class="leg"><span><i style="background:' + COLORS[0] + '"></i>Rendez-vous confirmé</span><span><i style="background:#94a3b8;outline:2px dashed #fff;outline-offset:-3px"></i>À confirmer</span><span><i style="background:repeating-linear-gradient(135deg,#fee2e2,#fee2e2 3px,#fecaca 3px,#fecaca 6px)"></i>Créneau bloqué</span></div>' +
      '<div class="ag" id="agenda"><table><thead><tr><th></th>' + days.map(function (d) { return '<th>' + DAYS.fr[d.getDay()].charAt(0).toUpperCase() + DAYS.fr[d.getDay()].slice(1, 3) + '.<small>' + d.getDate() + ' ' + MON.fr[d.getMonth()] + '</small></th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (slot) {
        return '<tr><td class="h">' + (slot.slice(3) === '00' ? slot : '') + '</td>' + days.map(function (d) {
          var k = dkey(d), ok = daySlots(d).indexOf(slot) >= 0;
          if (!ok) return '<td class="off"></td>';
          var tk = taken(k, slot);
          if (tk === 'blocked') return '<td><button class="cell bl" type="button" data-blk="' + k + '|' + slot + '" aria-label="Débloquer ' + slot + '">Bloqué</button></td>';
          if (tk) { var it = item(tk.items[0]); return '<td><div class="ev' + (tk.st === 'new' ? ' new' : '') + '" style="background:' + (tk.st === 'new' ? '#94a3b8' : itemColor(tk.items[0])) + '">' + esc(tk.name.replace(/^Dr /, 'Dr ').split(' ').slice(0, 2).join(' ')) + '<small>' + esc(it ? it.n.fr : '') + '</small></div></td>'; }
          return '<td><button class="cell" type="button" data-blk="' + k + '|' + slot + '" aria-label="Bloquer ' + slot + '">+ Bloquer</button></td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
    $('#pane').innerHTML = html;
  }
  function renderReqs() {
    var R = REQS[S.sector], c = function (s) { return R.filter(function (r) { return r.st === s; }).length; };
    var who = sec().admin.who;
    $('#pane').innerHTML = '<div class="kpis"><div class="kpi"><small>À confirmer</small><b>' + c('new') + '</b></div><div class="kpi"><small>Confirmées</small><b>' + (c('ok') + c('conf')) + '</b></div>' + (isPlat() ? '<div class="kpi"><small>Présence confirmée par SMS</small><b>' + c('conf') + '</b></div>' : '<div class="kpi"><small>Autre créneau proposé</small><b>' + c('move') + '</b></div>') + '<div class="kpi"><small>Demandes ce mois</small><b>' + STATS[S.sector].req + '</b><em>via le site</em></div></div>' +
      '<div class="bar2"><h2>' + esc(sec().admin.reqTab) + '</h2><p>Confirmer envoie un SMS au ' + who + ' avec le jour et l’heure.' + (isPlat() ? ' Un rappel part automatiquement la veille : il répond 1 pour confirmer, 2 pour annuler.' : '') + '</p></div>' +
      R.map(function (r) {
        var pill = r.st === 'new' ? '<span class="pill p-new"><i></i>À confirmer</span>' : r.st === 'ok' ? '<span class="pill p-ok"><i></i>Confirmé</span>' : r.st === 'conf' ? '<span class="pill p-conf"><i></i>Présence confirmée ✓</span>' : '<span class="pill p-move"><i></i>Autre créneau proposé</span>';
        var acts = r.st === 'new' ? '<button class="b pri sm" type="button" data-ok="' + r.id + '">Confirmer</button><button class="b sec sm" type="button" data-move="' + r.id + '">Proposer un autre créneau</button>' : '';
        var rem = r.st === 'ok' && isPlat() ? '<div class="rem">⏰ Rappel automatique programmé la veille à 18 h <button class="b sec sm" type="button" data-remind="' + r.id + '">Envoyer le rappel maintenant</button></div>' : '';
        return '<div class="req' + (r.id === S.hot ? ' hot' : '') + '" data-r="' + r.id + '"><div class="who"><b>' + esc(r.name) + '</b><a href="tel:' + esc(r.tel.replace(/\s/g, '')) + '">' + esc(r.tel) + '</a></div>' +
          '<div class="when"><b>' + esc(r.items.map(function (i) { return item(i) ? item(i).n.fr : i; }).join(', ')) + '</b>' + (r.mode ? ' · ' + { showroom: 'au showroom', cabinet: 'dans son cabinet', visio: 'en visio' }[r.mode] : '') + '<br>' + whenFr(r) + ' · reçue ' + esc(r.ago) + '</div>' +
          '<div class="acts">' + pill + acts + '</div>' + rem + thread(r) + '</div>';
      }).join('');
  }
  function smsText(r, kind) {
    var parts = r.name.split(' '), first = r.name.indexOf('Dr ') === 0 ? 'Dr ' + parts[parts.length - 1] : parts[0], brand = sec().brand.fr, what = r.items.map(function (i) { return item(i) ? item(i).n.fr : i; }).join(', ');
    if (kind === 'confirm') return '<b>SMS envoyé ✓</b><br>Bonjour ' + esc(first) + ', votre rendez-vous (' + esc(what) + ') du ' + whenFr(r) + ' est confirmé. ' + esc(brand) + ', ' + esc(C().phone) + '.';
    if (kind === 'move') return '<b>SMS envoyé ✓</b><br>Bonjour ' + esc(first) + ', ce créneau n’est plus libre. Nous vous proposons le même jour à 16:00. Répondez OUI pour confirmer.';
    if (kind === 'remind') return '<b>Rappel envoyé ✓</b><br>Rappel : rendez-vous demain, ' + whenFr(r) + ', chez ' + esc(brand) + '. Répondez 1 pour confirmer, 2 pour annuler.';
    return '';
  }
  function thread(r) {
    if (!r.thread || !r.thread.length) return '';
    return '<div class="thread">' + r.thread.map(function (m) { return m.o ? '<div class="bub out">' + smsText(r, m.x) + '</div>' : '<div class="bub in">' + esc(m.x) + '<small>Réponse du ' + sec().admin.who + '</small></div>'; }).join('') + '</div>';
  }
  $('#pane').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var R = REQS[S.sector], find = function (id) { return R.filter(function (x) { return x.id === id; })[0]; };
    if (b.dataset.ok) { var r = find(b.dataset.ok); r.st = 'ok'; r.thread.push({ o: 1, x: 'confirm' }); renderAdmin(); toast('Rendez-vous confirmé, SMS envoyé'); }
    else if (b.dataset.move) { var m = find(b.dataset.move); m.st = 'move'; m.thread.push({ o: 1, x: 'move' }); renderAdmin(); toast('Proposition envoyée par SMS'); }
    else if (b.dataset.remind) {
      var q = find(b.dataset.remind); q.thread.push({ o: 1, x: 'remind' }); S.reminded = true; renderAdmin(); toast('Rappel envoyé');
      setTimeout(function () { q.thread.push({ o: 0, x: '1' }); q.st = 'conf'; if (S.view === 'admin' && S.tab === 'req') renderAdmin(); toast('Le ' + sec().admin.who + ' a confirmé sa présence'); }, 1700);
    }
    else if (b.dataset.blk) {
      var key = b.dataset.blk; if (BLOCK[S.sector][key]) { delete BLOCK[S.sector][key]; toast('Créneau débloqué : de nouveau réservable en ligne'); } else { BLOCK[S.sector][key] = 1; toast('Créneau bloqué : il n’est plus proposé en ligne'); }
      renderAgenda();
    }
    else if (b.id === 'goSite') { S.page = 'home'; go('site'); }
  });

  function gauge(v, label) {
    var r = 34, c = 2 * Math.PI * r, col = v >= 90 ? '#16a34a' : v >= 50 ? '#d97706' : '#dc2626';
    return '<div><svg viewBox="0 0 84 84" role="img" aria-label="' + label + ' ' + v + '/100"><circle cx="42" cy="42" r="' + r + '" fill="none" stroke="#e2e8f0" stroke-width="7"/><circle cx="42" cy="42" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="7" stroke-linecap="round" stroke-dasharray="' + (c * v / 100).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 42 42)"/><text x="42" y="48" text-anchor="middle" font-size="19" font-weight="800" fill="' + col + '">' + v + '</text></svg><b>' + label + '</b></div>';
  }
  function renderStats() {
    var st = STATS[S.sector], weeks = [212, 238, 251, 263, 241, 288, 302, 319, 297, 334, 352, 371], mx = Math.max.apply(null, weeks), a = sec().admin;
    $('#pane').innerHTML = '<div class="kpis" id="skpis"><div class="kpi"><small>Visiteurs (30 j)</small><b>' + num(st.visits) + '</b><em>+22 %</em></div><div class="kpi"><small>Appels depuis le site</small><b>' + st.calls + '</b><em>+9</em></div><div class="kpi"><small>Clics WhatsApp</small><b>' + st.wa + '</b><em>+17</em></div><div class="kpi"><small>' + (isMat() ? 'Demandes de démo' : 'Demandes de RDV') + '</small><b>' + st.req + '</b><em>' + num(st.est) + ' simulations de devis</em></div></div>' +
      '<div class="ed"><div class="box" id="perf"><h3>Performance du site</h3><p class="d">Exemple de rapport Lighthouse, l’outil de mesure de Google : vitesse, lisibilité, bonnes pratiques et référencement.</p><div class="gauges">' + gauge(97, 'Vitesse') + gauge(100, 'Accessibilité') + gauge(100, 'Bonnes pratiques') + gauge(100, 'Référencement') + '</div></div>' +
      '<div class="box"><h3>D’où viennent vos ' + (isMat() ? 'clients' : 'patients') + '</h3><p class="d">Ce qui a amené les visiteurs sur le site.</p><div class="src">' + [['Recherche Google', 52], ['Facebook & Instagram', 24], ['Google Maps', 16], ['Lien direct / bouche-à-oreille', 8]].map(function (x) { return '<div><span>' + x[0] + '</span><span>' + x[1] + ' %</span><i><u style="width:' + x[1] / 52 * 100 + '%"></u></i></div>'; }).join('') + '</div></div></div>' +
      '<div class="ed" style="margin-top:16px"><div class="box"><h3>Visiteurs par semaine</h3><p class="d">Sur les 12 dernières semaines.</p><div class="chart">' + weeks.map(function (w, i) { return '<div style="height:' + Math.round(w / mx * 100) + '%" title="' + w + '"><small>S' + (i + 1) + '</small></div>'; }).join('') + '</div><div style="height:22px"></div></div>' +
      '<div class="box"><h3>Votre site dans les résultats de recherche</h3><p class="d">Titre et description travaillés pour donner envie de cliquer.</p><div class="serp"><div class="u">' + esc(sec().domain) + '</div><div class="ti">' + esc(a.serp) + '</div><div class="ds">' + esc(a.serpD) + '</div></div></div></div>' +
      '<p class="note">Chiffres de démonstration (vos clics sur la démo sont comptés). Chez vous, ce sont vos vraies visites.</p>';
  }
  function renderEditor() {
    var order = [6, 0, 1, 2, 3, 4, 5], s = sec();
    $('#pane').innerHTML = '<div class="bar2"><h2>Mon site</h2><button class="b pri sm" type="button" id="goSite">Voir mon site →</button></div><div class="ed">' +
      '<div><div class="box" style="margin-bottom:16px"><h3>Fermeture exceptionnelle</h3><p class="d">Un bandeau s’affiche en haut du site et le statut passe à « Fermé ».</p><div class="tg"><span><b>Afficher le bandeau</b><small>' + (C().closed ? 'Actif sur le site' : 'Désactivé') + '</small></span><label class="sw2"><input type="checkbox" id="closedT" aria-label="Fermeture exceptionnelle"' + (C().closed ? ' checked' : '') + '><span></span></label></div>' +
      '<div class="fl"><label for="closedM">Message affiché</label><textarea id="closedM">' + esc(C().closedMsg) + '</textarea></div></div>' +
      '<div class="box"><h3>Textes et contact</h3><p class="d">C’est en ligne aussitôt.</p><div class="fl"><label for="eTitle">Titre principal (français)</label><textarea id="eTitle">' + esc(C().title || s.hero.h1.fr.replace(/<\/?em>/g, '')) + '</textarea></div><div class="fl"><label for="ePhone">Téléphone</label><input id="ePhone" value="' + esc(C().phone) + '"></div></div></div>' +
      '<div><div class="box" style="margin-bottom:16px"><h3>Horaires</h3><p class="d">Le statut « Ouvert / Fermé » et les créneaux en ligne suivent ces horaires.</p>' +
      order.map(function (d) { var h = C().hours[d]; return '<div class="hr"><span>' + DAYS.fr[d].charAt(0).toUpperCase() + DAYS.fr[d].slice(1) + '</span><input type="time" data-h="' + d + '" data-i="0" value="' + (h ? h[0] : '09:00') + '"' + (h ? '' : ' disabled') + ' aria-label="Ouverture ' + DAYS.fr[d] + '"><input type="time" data-h="' + d + '" data-i="1" value="' + (h ? h[1] : '18:00') + '"' + (h ? '' : ' disabled') + ' aria-label="Fermeture ' + DAYS.fr[d] + '"><label><input type="checkbox" data-off="' + d + '"' + (h ? '' : ' checked') + '>Fermé</label></div>'; }).join('') + '</div>' +
      '<div class="box"><h3>Tarifs affichés</h3><p class="d">Repris par le site et par le simulateur de devis.</p>' + s.services.items.filter(function (it) { return it.min || it.max; }).map(function (it) { return '<div class="pr2"><span>' + esc(it.n.fr) + '</span><input type="number" min="0" step="500" data-p="' + it.id + '" value="' + it.min + '" aria-label="Tarif ' + esc(it.n.fr) + '"></div>'; }).join('') + '</div></div></div>';
  }
  var saveT;
  function saved() { clearTimeout(saveT); saveT = setTimeout(function () { toast('Enregistré · en ligne sur le site'); }, 500); }
  $('#pane').addEventListener('input', function (e) {
    var x = e.target;
    if (x.id === 'closedM') { C().closedMsg = x.value; saved(); }
    else if (x.id === 'eTitle') { C().title = x.value; saved(); }
    else if (x.id === 'ePhone') { C().phone = x.value; saved(); }
    else if (x.dataset.h) { var h = C().hours[+x.dataset.h]; if (h) { h[+x.dataset.i] = x.value; saved(); } }
    else if (x.dataset.p) { var it = item(x.dataset.p), v = Math.max(0, +x.value || 0), ratio = it.min ? it.max / it.min : 1; it.min = v; it.max = Math.round(v * ratio); saved(); }
  });
  $('#pane').addEventListener('change', function (e) {
    var x = e.target;
    if (x.id === 'closedT') { C().closed = x.checked; renderEditor(); toast(C().closed ? 'Bandeau de fermeture activé sur le site' : 'Bandeau retiré du site'); }
    else if (x.dataset.off) { var d = +x.dataset.off; C().hours[d] = x.checked ? null : ['09:00', '18:00']; renderEditor(); saved(); }
  });

  // ---------- Démarrage ----------
  // Métier fixé par la page : site vitrine = fournisseur, plateforme = cabinet
  S.sector = document.body.getAttribute('data-metier') === 'cabinet' ? 'cabinet' : 'materiel';
  if (S.sector === 'cabinet') S.tab = 'agenda';
  resetSel();
  if (location.hash === '#rendez-vous') S.page = 'rdv';
  renderSite();
  setInterval(function () { if (S.view === 'site' && S.page === 'home') { var l = $('#live'), st = status(); if (l) { l.className = 'live' + (st.open ? '' : ' off'); l.innerHTML = '<i></i>' + esc(st.txt); } } }, 30000);

  // ---------- Visite guidée ----------
  function click(sel) { var x = typeof sel === 'string' ? $(sel) : sel; if (x) x.click(); }
  function ensureHome() { if (S.view !== 'site') go('site'); if (S.page !== 'home') setPage('home'); }
  function ensureAdmin(tab) { if (S.view !== 'admin') go('admin'); if (tab && S.tab !== tab) { S.tab = tab; renderAdmin(); } }
  var small = window.innerWidth <= 760;
  var deviceSteps = small ? [{ title: 'Vous êtes déjà sur téléphone', text: 'En bas de l’écran, appeler, WhatsApp et rendez-vous restent sous le pouce, où que l’on soit dans la page.', target: '#mbar', enter: function () { ensureHome(); } }] : [
    { title: 'Et sur téléphone ?', text: 'Plus de 8 visiteurs sur 10 arrivent depuis un mobile. Voyons ce qu’ils voient.', target: '#devToggle', hint: 'Passez en aperçu « Téléphone »', enter: function () { ensureHome(); }, done: function () { return S.device === 'phone'; }, act: function () { setDevice('phone'); } },
    { title: 'Pensé pour le pouce', text: 'La vidéo s’adapte à l’écran et, dès qu’on fait défiler, une barre reste en bas : appeler, WhatsApp, rendez-vous.', target: '#site', enter: function () { setTimeout(function () { var s = $('#site'); if (s) s.scrollTo({ top: 500, behavior: 'smooth' }); }, 300); } }
  ];
  var common = {
    send: { title: 'On envoie', text: 'C’est exactement ce que vivra votre visiteur.', target: '#bkSend', hint: 'Appuyez sur « Envoyer la demande »', done: function () { return S.sent; }, act: function () { if (!S.filled) fillBooking(); sendBooking(); } },
    fill: { title: 'Deux champs, pas plus', text: 'Un nom et un téléphone suffisent. On vous a préparé un visiteur fictif.', target: '#bkTest', hint: 'Appuyez sur « Remplir avec les infos de test »', done: function () { return S.filled || S.sent; }, act: function () { fillBooking(); } },
    lang: { title: 'Trois langues, d’un geste', text: 'Français, arabe ou anglais : tout le site bascule, la mise en page passe de droite à gauche en arabe.', target: '#langSw', hint: 'Appuyez sur « ع »', enter: function () { closeUrgent(); if (S.device === 'phone' && !small) setDevice('desktop'); ensureHome(); siteScrollTop(); }, done: function () { return S.lang === 'ar'; }, act: function () { S.lang = 'ar'; renderSite(); } },
    ba: function (txt) { return { title: 'Avant / après', text: txt, target: '#ba', hint: 'Faites glisser la barre', enter: function () { var x = $('#s-ba'); if (x) x.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, done: function () { return S.baMoved; }, act: function () { var v = 50, dir = 1; var iv = setInterval(function () { v += dir * 3; if (v > 85) dir = -1; if (v < 22) { clearInterval(iv); S.baMoved = true; } setBa(v); }, 25); } }; },
    slot: function (txt) { return { title: 'Le jour et l’heure', text: txt, target: '#rbox', hint: 'Choisissez un jour puis une heure', done: function () { return !!S.slot || S.sent; }, act: function () { if (!S.day) { S.day = dkey(openDays()[0]); renderBooking(); } setTimeout(function () { var b = $$('#slotPick .c2').filter(function (x) { return !x.disabled; })[0]; click(b); }, 300); } }; },
    notif: function (txt) { return { title: 'Vous êtes prévenu', text: txt, target: function () { return $('#notif.on'); }, hint: 'Appuyez sur la notification', done: function () { return S.view === 'admin'; }, act: function () { if (S.notified) click('#notif'); else ensureAdmin('req'); } }; },
    confirm: function (txt) { return { title: 'Un appui pour confirmer', text: txt, target: function () { return $('.req.hot') || $('.req'); }, hint: 'Appuyez sur « Confirmer »', enter: function () { ensureAdmin('req'); }, done: function () { var r = REQS[S.sector].filter(function (x) { return x.id === S.lastReq; })[0]; return r ? r.st !== 'new' : true; }, act: function () { click($('.req.hot [data-ok]') || $('[data-ok]')); } }; },
    stats: { title: 'Ce que le site vous rapporte', text: 'Visites, appels, clics WhatsApp, demandes… et la performance du site, mesurée comme le fait Google.', target: '[data-tab="stats"]', hint: 'Ouvrez l’onglet « Statistiques »', done: function () { return S.view === 'admin' && S.tab === 'stats'; }, act: function () { ensureAdmin('stats'); } }
  };
  var first = function (txt) { return { title: 'La première impression', text: txt, target: '#home', enter: function () { if (S.device === 'phone' && !small) setDevice('desktop'); ensureHome(); siteScrollTop(); } }; };
  var steps, welcome;
  if (isPlat()) {
    welcome = { title: 'Bienvenue au cabinet Ibtissama', text: 'Un site relié à son outil de gestion. En 4 minutes : urgence, devis en ligne, rendez-vous, puis tout ce que le cabinet gère derrière : confirmations, rappels SMS, agenda et statistiques.' };
    steps = [
      first('Plein écran, une vraie vidéo du cabinet, et le menu intégré dedans. En une seconde, le visiteur sait où il est, si c’est ouvert, et comment prendre rendez-vous.'),
      { title: 'L’urgence, en un geste', text: 'Une dent cassée un soir ? Le bouton rouge est toujours visible : il dit si le cabinet est ouvert, propose d’appeler ou d’écrire sur WhatsApp, et donne les bons réflexes en attendant.', target: '#urgBtn', hint: 'Appuyez sur « Urgence dentaire »', enter: function () { ensureHome(); }, done: function () { return S.umod; }, act: function () { openUrgent(); } },
      { title: 'Rassurer avant tout', text: 'Le patient inquiet trouve tout de suite quoi faire. C’est ce genre de détail qui fait choisir un cabinet plutôt qu’un autre.', target: '.ubox' }
    ].concat(deviceSteps).concat([
      common.lang,
      { title: 'Le simulateur de devis', text: 'On repasse en français. Le patient coche les soins qui le concernent : il obtient une fourchette de prix et la durée. Plus d’appels « c’est combien ? ».', target: '#s-est', hint: 'Cochez deux soins', enter: function () { if (S.lang !== 'fr') { S.lang = 'fr'; renderSite(); } setTimeout(function () { var x = $('#s-est'); if (x) x.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80); }, done: function () { return S.sel.length >= 2; }, act: function () { if (S.sel.indexOf('detart') < 0) click('[data-sel="detart"]'); setTimeout(function () { if (S.sel.indexOf('blanc') < 0) click('[data-sel="blanc"]'); }, 400); } },
      common.ba('Le patient voit l’effet d’un blanchiment avant de se décider. Ici c’est une simulation clairement signalée ; chez vous, ce seront vos propres cas.'),
      { title: 'On réserve ces soins', text: 'Retour au simulateur : un bouton envoie la sélection directement vers la prise de rendez-vous, avec une transition aux couleurs du cabinet.', target: '#estBook', hint: 'Appuyez sur « Réserver avec cette sélection »', enter: function () { var x = $('#estBook'); if (x) x.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, done: function () { return S.page === 'rdv' && !busy; }, act: function () { click('#estBook'); } },
      common.slot('Les soins choisis sont déjà cochés et le prix est rappelé. Les jours fermés n’apparaissent pas, les créneaux pris ou bloqués par le cabinet sont barrés.'),
      common.fill, common.send,
      common.notif('La demande arrive aussitôt sur le téléphone du cabinet, même pendant un soin. Entrons dans l’outil de gestion.'),
      common.confirm('La demande est en haut. « Confirmer » envoie un SMS au patient avec le jour et l’heure. Pas d’appel à passer.'),
      { title: 'Fini les rendez-vous oubliés', text: 'La veille, un rappel part tout seul. Le patient répond 1 pour confirmer ou 2 pour annuler, et le créneau se libère s’il annule. Essayons tout de suite.', target: function () { return $('.req.hot .rem') || $('.rem'); }, hint: 'Appuyez sur « Envoyer le rappel maintenant »', done: function () { return S.reminded; }, act: function () { click($('.req.hot [data-remind]') || $('[data-remind]')); } },
      { title: 'Tout votre planning', text: 'L’agenda de la semaine, en couleurs. Cliquez sur un créneau libre pour le bloquer : il disparaît aussitôt de la réservation en ligne.', target: '#agenda', hint: 'Bloquez un créneau libre', enter: function () { setTimeout(function () { ensureAdmin('agenda'); }, 1800); }, done: function () { return Object.keys(BLOCK.cabinet).length > 0; }, act: function () { ensureAdmin('agenda'); click($('#agenda .cell:not(.bl)')); } },
      common.stats,
      { title: 'Rapide et bien référencé', text: 'Un site lent perd la moitié de ses visiteurs. Ces quatre scores montrent ce qu’un site ADweb vise : vitesse, accessibilité, bonnes pratiques et référencement.', target: '#perf' },
      { title: 'Et ce qu’on peut ajouter', text: 'Ce que vous venez d’essayer, c’est le cœur. La plateforme grandit avec le cabinet :', target: null,
        list: ['Fiches patients : historique des soins, notes et documents.', 'Comptes pour l’équipe : secrétaire, praticiens, droits d’accès.', 'Devis signés en ligne et suivi des paiements.', 'Stock de consommables avec alertes de réapprovisionnement.', 'Hébergement, sauvegardes et mises à jour pris en charge.'],
        buttons: '<a class="b pri" href="../../#contact">Je veux ma plateforme</a>' }
    ]);
  } else {
    welcome = { title: 'Bienvenue chez Kalimed', text: 'Un vrai site vitrine, pas une maquette. En 3 minutes : vidéo plein écran, SAV express, configurateur de fauteuil avec prix en direct, et demande de démonstration.' };
    steps = [
      first('Plein écran, une vraie vidéo du produit, et le menu intégré dedans. En une seconde, le visiteur comprend ce que vous vendez et comment vous contacter.'),
      { title: 'Le SAV, en un geste', text: 'Un fauteuil en panne, c’est un cabinet à l’arrêt. Le bouton rouge propose d’appeler un technicien ou d’envoyer une photo sur WhatsApp, avec les bons réflexes.', target: '#urgBtn', hint: 'Appuyez sur « SAV express »', enter: function () { ensureHome(); }, done: function () { return S.umod; }, act: function () { openUrgent(); } },
      { title: 'Rassurer vos clients', text: 'Vos clients savent qu’ils ne seront pas seuls après l’achat. C’est souvent ce qui fait signer.', target: '.ubox' }
    ].concat(deviceSteps).concat([
      common.lang,
      { title: 'Le configurateur', text: 'On repasse en français. Le dentiste choisit son fauteuil, la couleur de sellerie et ses équipements : le prix se calcule en direct.', target: '#s-est', hint: 'Choisissez un autre fauteuil ou une couleur', enter: function () { if (S.lang !== 'fr') { S.lang = 'fr'; renderSite(); } setTimeout(function () { var x = $('#s-est'); if (x) x.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80); }, done: function () { return S.sel.indexOf('k3') < 0 || S.color !== 'bleu'; }, act: function () { click('[data-sel="k5"]'); setTimeout(function () { click('[data-color="menthe"]'); }, 400); } },
      common.ba('Le visiteur voit la différence d’un équipement neuf. Ici c’est une simulation clairement signalée ; chez vous, ce seront vos vraies installations.'),
      { title: 'On demande une démo', text: 'La configuration part directement dans la demande de démonstration, avec une transition aux couleurs de la marque.', target: '#estBook', hint: 'Appuyez sur « Réserver avec cette sélection »', enter: function () { var x = $('#estBook'); if (x) x.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, done: function () { return S.page === 'rdv' && !busy; }, act: function () { click('#estBook'); } },
      common.slot('L’équipement choisi est déjà coché. Le client choisit où (showroom, son cabinet ou en visio), puis le jour et l’heure.'),
      common.fill, common.send,
      common.notif('La demande arrive aussitôt sur le téléphone du commercial.'),
      common.confirm('Toutes les demandes au même endroit. « Confirmer » envoie un SMS au client avec le jour et l’heure.'),
      common.stats,
      { title: 'Et pour aller plus loin', text: 'Ce site vitrine peut évoluer avec vous :', target: null,
        list: ['Catalogue complet avec fiches techniques à télécharger.', 'Espace revendeurs avec tarifs dédiés.', 'Suivi des interventions SAV et des contrats d’entretien.', 'Fiche Google Maps et référencement local du showroom.', 'Hébergement, sauvegardes et mises à jour pris en charge.'],
        buttons: '<a class="b pri" href="../../#contact">Je veux mon site</a>' }
    ]);
  }
  var tour = Tour.create({ welcome: welcome, steps: steps });
  tour.welcome();
  window.__vit = { S: S };
})();
