/* ADweb — démo site vitrine (cabinet fictif, tout se passe dans le navigateur) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function num(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('on'); }, 2800); }
  function fmt(s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k]; }); }

  // ---------- Contenu modifiable depuis l'espace gérant ----------
  var cfg = {
    title: 'Des soins dentaires <em>en douceur</em>, au cœur de Blida.',
    phone: '025 12 34 56',
    closed: false,
    closedMsg: 'Le cabinet est fermé exceptionnellement ce jeudi. Réouverture samedi à 9 h.',
    // index = jour JS (0 = dimanche)
    hours: [['09:00', '18:00'], ['09:00', '18:00'], ['09:00', '18:00'], ['09:00', '18:00'], ['09:00', '13:00'], null, ['09:00', '18:00']],
    services: [
      { id: 'consult', fr: 'Consultation et bilan', ar: 'فحص وتشخيص', dfr: 'On fait le point, on vous explique tout, sans jargon.', dar: 'نفحص ونشرح لك كل شيء بوضوح.', price: 1500, ic: 'search' },
      { id: 'detart', fr: 'Détartrage', ar: 'إزالة الجير', dfr: 'Des gencives saines et des dents nettes, en une séance.', dar: 'لثة صحية وأسنان نظيفة في جلسة واحدة.', price: 2500, ic: 'drop' },
      { id: 'carie', fr: 'Soins des caries', ar: 'علاج التسوس', dfr: 'Des soins précis et sans douleur, avec anesthésie douce.', dar: 'علاج دقيق وبدون ألم مع تخدير لطيف.', price: 3000, ic: 'tooth' },
      { id: 'blanc', fr: 'Blanchiment', ar: 'تبييض الأسنان', dfr: 'Retrouvez un sourire éclatant, en toute sécurité.', dar: 'ابتسامة مشرقة بأمان تام.', price: 25000, ic: 'spark' },
      { id: 'implant', fr: 'Implants', ar: 'زراعة الأسنان', dfr: 'Remplacer une dent manquante de façon durable.', dar: 'تعويض السن المفقودة بشكل دائم.', price: 80000, ic: 'pin' },
      { id: 'ortho', fr: 'Aligneurs transparents', ar: 'تقويم شفاف', dfr: 'Redresser les dents discrètement, sans bagues visibles.', dar: 'تقويم الأسنان بشكل خفي دون أسلاك ظاهرة.', price: 0, ic: 'smile' }
    ]
  };
  var DAYS = { fr: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'], ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'] };
  var MONTHS = { fr: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'], ar: ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'] };
  var T = {
    fr: { brand: 'Dr Selma Haddad', sub: 'Chirurgien-dentiste · Blida', soins: 'Soins', cabinet: 'Le cabinet', avis: 'Avis', acces: 'Accès', rdvBtn: 'Prendre RDV',
      lead: 'Consultations, soins, esthétique et implants. Un cabinet moderne, des explications claires et des rendez-vous qui tiennent l’horaire.',
      book: 'Prendre rendez-vous', call: 'Appeler', wa: 'WhatsApp', open: 'Ouvert maintenant · ferme à {t}', shut: 'Fermé · ouvre {w} à {t}', today: 'aujourd’hui', tomorrow: 'demain', excep: 'Fermé exceptionnellement',
      t1: 'note des patients', t2: 'ans d’expérience', t3: 'rendez-vous par an', revTag: '230 avis vérifiés', revSub: 'Patients du cabinet',
      soinsEb: 'Nos soins', soinsH: 'Tout ce qu’il faut pour un sourire en bonne santé.', soinsL: 'Des tarifs affichés, pour venir sans mauvaise surprise.', from: 'dès {p} DA', quote: 'sur devis',
      cabEb: 'Le cabinet', cabH: 'Un lieu pensé pour que vous soyez à l’aise.', r1: 'Salle de soins', r2: 'Accueil', r3: 'Équipement moderne',
      avisEb: 'Avis patients', avisH: 'Ils nous ont confié leur sourire.',
      revs: [['J’avais une vraie peur du dentiste. Tout m’a été expliqué avant chaque geste, je n’ai rien senti.', 'Nadia B.', 'Soins des caries'], ['Rendez-vous pris le soir sur le site, confirmé le lendemain matin par SMS. Simple.', 'Riad M.', 'Détartrage'], ['Résultat superbe pour mon implant, et un suivi très sérieux.', 'Samia K.', 'Implant']],
      rdvEb: 'Rendez-vous', rdvH: 'Réservez en moins d’une minute.', rdvL: 'Choisissez le soin et le créneau : le cabinet vous confirme par SMS.',
      p1: 'Confirmation par SMS dans la journée', p2: 'Rappel automatique la veille', p3: 'Annulation en un simple message',
      q1: 'Quel soin ?', q2: 'Quel jour ?', q3: 'Quelle heure ?', name: 'Nom et prénom', tel: 'Téléphone', test: '⚡ Remplir avec les infos de test', send: 'Envoyer la demande',
      err: 'Choisissez un soin, un jour, une heure, et indiquez votre nom et un mobile valide.', sentH: 'Demande envoyée !', sentP: 'Le cabinet vous confirme par SMS au {tel}.<br>Demande : {svc}, {when}.', again: 'Faire une autre demande',
      accEb: 'Horaires & accès', accH: 'Facile à trouver, facile à joindre.', closedD: 'Fermé', addr: '12 rue des Orangers, Blida', park: 'Parking à 50 m · accès PMR', itin: 'Itinéraire',
      foot: '© Cabinet Dr Selma Haddad — site de démonstration ADweb · Photos : Unsplash', mb1: 'Appeler', mb2: 'WhatsApp', mb3: 'Rendez-vous', at: 'à' },
    ar: { brand: 'د. سلمى حداد', sub: 'جراحة الأسنان · البليدة', soins: 'العلاجات', cabinet: 'العيادة', avis: 'الآراء', acces: 'العنوان', rdvBtn: 'احجز موعدًا',
      lead: 'فحوصات وعلاجات وتجميل وزراعة. عيادة حديثة، شرح واضح، ومواعيد تُحترم.',
      book: 'احجز موعدًا', call: 'اتصل بنا', wa: 'واتساب', open: 'مفتوح الآن · يغلق على {t}', shut: 'مغلق · يفتح {w} على {t}', today: 'اليوم', tomorrow: 'غدًا', excep: 'مغلق استثنائيًا',
      t1: 'تقييم المرضى', t2: 'سنة خبرة', t3: 'موعد في السنة', revTag: '230 رأيًا موثقًا', revSub: 'مرضى العيادة',
      soinsEb: 'علاجاتنا', soinsH: 'كل ما يلزم لابتسامة صحية.', soinsL: 'أسعار معلنة، حتى تأتي دون مفاجآت.', from: 'ابتداءً من {p} دج', quote: 'حسب التقدير',
      cabEb: 'العيادة', cabH: 'مكان صُمّم لراحتكم.', r1: 'غرفة العلاج', r2: 'الاستقبال', r3: 'معدات حديثة',
      avisEb: 'آراء المرضى', avisH: 'وثقوا بنا في ابتسامتهم.',
      revs: [['كنت أخاف كثيرًا من طبيب الأسنان. شُرح لي كل شيء قبل كل خطوة ولم أشعر بأي ألم.', 'نادية ب.', 'علاج التسوس'], ['حجزت الموعد ليلًا من الموقع، وتم التأكيد صباحًا برسالة. بسيط جدًا.', 'رياض م.', 'إزالة الجير'], ['نتيجة رائعة لزراعة السن، ومتابعة جدية للغاية.', 'سامية ك.', 'زراعة']],
      rdvEb: 'المواعيد', rdvH: 'احجز في أقل من دقيقة.', rdvL: 'اختر العلاج والموعد، وتؤكد لك العيادة برسالة قصيرة.',
      p1: 'تأكيد برسالة قصيرة خلال اليوم', p2: 'تذكير تلقائي قبل الموعد بيوم', p3: 'إلغاء برسالة واحدة',
      q1: 'أي علاج؟', q2: 'أي يوم؟', q3: 'أي ساعة؟', name: 'الاسم واللقب', tel: 'الهاتف', test: '⚡ املأ ببيانات تجريبية', send: 'أرسل الطلب',
      err: 'اختر العلاج واليوم والساعة، وأدخل اسمك ورقم هاتف صحيح.', sentH: 'تم إرسال الطلب!', sentP: 'ستؤكد لك العيادة برسالة على {tel}.<br>الطلب: {svc}، {when}.', again: 'طلب جديد',
      accEb: 'الأوقات والعنوان', accH: 'سهل الوصول، سهل الاتصال.', closedD: 'مغلق', addr: '12 شارع البرتقال، البليدة', park: 'موقف سيارات على بعد 50 م', itin: 'الاتجاهات',
      foot: '© عيادة د. سلمى حداد — موقع تجريبي من ADweb · الصور: Unsplash', mb1: 'اتصال', mb2: 'واتساب', mb3: 'موعد', at: 'على' }
  };
  var TITLE_AR = 'علاج أسنان <em>بلطف</em> في قلب البليدة.';

  var S = { lang: 'fr', device: 'desktop', view: 'site', tab: 'rdv', svc: null, day: null, slot: null, name: '', tel: '', filled: false, sent: false, err: false, asked: false, hot: null, siteVisited: false };
  var stats = { visits: 1284, calls: 96, wa: 141, rdv: 58 };
  function t(k) { return T[S.lang][k]; }
  function svcName(s) { return S.lang === 'ar' ? s.ar : s.fr; }
  function svcById(id) { return cfg.services.filter(function (s) { return s.id === id; })[0]; }

  // ---------- Horaires & statut en direct ----------
  function mins(hm) { var p = hm.split(':'); return +p[0] * 60 + +p[1]; }
  function status() {
    if (cfg.closed) return { open: false, txt: t('excep') };
    var now = new Date(), d = now.getDay(), m = now.getHours() * 60 + now.getMinutes(), h = cfg.hours[d];
    if (h && m >= mins(h[0]) && m < mins(h[1])) return { open: true, txt: fmt(t('open'), { t: h[1] }) };
    for (var k = 0; k < 8; k++) {
      var dd = (d + k) % 7, hh = cfg.hours[dd];
      if (!hh || (k === 0 && m >= mins(hh[0]))) continue;
      var w = k === 0 ? t('today') : k === 1 ? t('tomorrow') : DAYS[S.lang][dd];
      return { open: false, txt: fmt(t('shut'), { w: w, t: hh[0] }) };
    }
    return { open: false, txt: t('closedD') };
  }
  function openDays() {
    var out = [], d = new Date(); d.setHours(12, 0, 0, 0);
    for (var k = 1; out.length < 6 && k < 20; k++) { var x = new Date(d.getTime() + k * 864e5); if (cfg.hours[x.getDay()]) out.push(x); }
    return out;
  }
  function dayKey(x) { return x.toISOString().slice(0, 10); }
  function dayLabel(x, long) {
    var L = S.lang;
    return long ? DAYS[L][x.getDay()] + ' ' + x.getDate() + ' ' + MONTHS[L][x.getMonth()] : DAYS[L][x.getDay()].slice(0, L === 'ar' ? 10 : 3) + '.';
  }
  function slotsFor(x) {
    var h = cfg.hours[x.getDay()]; if (!h) return [];
    var out = []; for (var m = mins(h[0]); m + 30 <= mins(h[1]); m += 30) {
      if (m >= 12 * 60 && m < 13 * 60 + 30 && mins(h[1]) > 14 * 60) continue; // pause déjeuner
      var hm = String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
      var taken = ((x.getDate() * 7 + m / 30 * 13) % 5) < 2;
      out.push([hm, taken]);
    }
    return out;
  }

  // ---------- Icônes ----------
  var IC = {
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    tooth: '<path d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 5 2.2 8.5.4 2 1 5 2.6 5 1.8 0 1.6-5 4.2-5s2.4 5 4.2 5c1.6 0 2.2-3 2.6-5 .7-3.5 2.2-5.5 2.2-8.5C21 5 19.5 3 17 3c-2 0-3 1.2-5 1.2S9 3 7 3z"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>',
    pin: '<path d="M8 3h8l-1 5H9z"/><path d="M10 8v3h4V8M9.5 11h5l-.5 3h-4zM10 14l.5 3h3l.5-3M11 17l1 4 1-4"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    wa: '<path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.4-1.8-1.2-2.2-2.2l1-1-1-2L9 9.5z"/>',
    cal: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    map: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'
  };
  function ic(k, s) { return '<svg width="' + (s || 22) + '" height="' + (s || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[k] + '</svg>'; }

  // ---------- Site ----------
  // Photos : Unsplash (licence libre, usage commercial autorisé), servies par leur CDN.
  function ph(id, w, h, alt) { return '<img src="https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + w + '&h=' + h + '&q=72" alt="' + esc(alt) + '" loading="lazy" decoding="async">'; }
  function heroArt() { return ph('1777331903190-341a3dd0441b', 900, 960, S.lang === 'ar' ? 'طبيبة الأسنان تتحدث مع مريضة' : 'La dentiste échange avec une patiente au cabinet'); }
  var ROOMS = ['1606811841689-23dfddce3e95', '1762625570087-6d98fca29531', '1629909613654-28e377c37b09'];
  function room(i) { return ph(ROOMS[i], i === 0 ? 900 : 600, 520, [t('r1'), t('r2'), t('r3')][i]); }
  function mapArt() {
    return '<svg viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="600" height="340" fill="#e7efe6"/>' +
      '<g stroke="#fff" stroke-width="14" fill="none"><path d="M-10 90h620M-10 230h620M130-10v360M420-10v360M0 340L600 0"/></g><g stroke="#fff" stroke-width="6" fill="none" opacity=".8"><path d="M-10 160h620M270-10v360M520-10v360"/></g>' +
      '<rect x="150" y="105" width="100" height="110" rx="6" fill="#d7e5d4"/><rect x="440" y="250" width="150" height="80" rx="6" fill="#cfe0f3"/><circle cx="345" cy="60" r="40" fill="#c9dfc5"/>' +
      '<g transform="translate(300 128)"><circle r="34" fill="#0f766e" opacity=".15"/><path d="M0 18s-16-14-16-26a16 16 0 0 1 32 0C16 4 0 18 0 18z" fill="#0f766e" transform="translate(0 -8)"/><circle cy="-16" r="6" fill="#fff"/></g></svg>';
  }
  function renderSite() {
    var site = $('#site'), st = status(), today = new Date().getDay(), L = S.lang;
    site.setAttribute('lang', L); site.setAttribute('dir', L === 'ar' ? 'rtl' : 'ltr');
    var order = [6, 0, 1, 2, 3, 4, 5];
    site.innerHTML =
      (cfg.closed ? '<div class="closed" id="closedBanner" role="status">⚠ ' + esc(cfg.closedMsg) + '</div>' : '') +
      '<nav class="nav"><div class="in"><a class="logo" href="#" data-noop><span class="mk">' + ic('tooth') + '</span><span><b>' + t('brand') + '</b><small>' + t('sub') + '</small></span></a>' +
      '<div class="links"><a href="#s-soins" data-jump="s-soins">' + t('soins') + '</a><a href="#s-cab" data-jump="s-cab">' + t('cabinet') + '</a><a href="#s-avis" data-jump="s-avis">' + t('avis') + '</a><a href="#s-acc" data-jump="s-acc">' + t('acces') + '</a></div>' +
      '<div class="navr"><div class="lang" id="langSw" role="group" aria-label="Langue"><button type="button" data-lang="fr" class="' + (L === 'fr' ? 'on' : '') + '">FR</button><button type="button" data-lang="ar" class="' + (L === 'ar' ? 'on' : '') + '">عربي</button></div>' +
      '<button class="btn t" type="button" data-book>' + t('rdvBtn') + '</button></div></div></nav>' +
      '<header class="hero" id="s-hero"><div class="in"><div>' +
      '<div class="live' + (st.open ? '' : ' off') + '" id="live"><i></i>' + esc(st.txt) + '</div>' +
      '<h1>' + (L === 'ar' ? TITLE_AR : cfg.title) + '</h1><p class="lead">' + t('lead') + '</p>' +
      '<div class="cta"><button class="btn t" type="button" id="heroRdv" data-book>' + ic('cal', 18) + t('book') + '</button>' +
      '<button class="btn o" type="button" data-call>' + ic('phone', 18) + cfg.phone + '</button></div>' +
      '<div class="trust"><div><b>4,9/5</b>' + t('t1') + '</div><div><b>15</b>' + t('t2') + '</div><div><b>3 000+</b>' + t('t3') + '</div></div></div>' +
      '<div class="art">' + heroArt() + '<div class="tag"><span class="s">★★★★★</span><span><b>' + t('revTag') + '</b><small>' + t('revSub') + '</small></span></div></div></div></header>' +
      '<section class="blk" id="s-soins"><div class="in"><p class="eb">' + t('soinsEb') + '</p><h2 class="h">' + t('soinsH') + '</h2><p class="lead">' + t('soinsL') + '</p><div class="grid3">' +
      cfg.services.map(function (s) { return '<article class="svc"><div class="ic">' + ic(s.ic) + '</div><h3>' + esc(svcName(s)) + '</h3><p>' + esc(L === 'ar' ? s.dar : s.dfr) + '</p><span class="pr" data-price="' + s.id + '">' + (s.price ? fmt(t('from'), { p: num(s.price) }) : t('quote')) + '</span></article>'; }).join('') +
      '</div></div></section>' +
      '<section class="blk alt" id="s-cab"><div class="in"><p class="eb">' + t('cabEb') + '</p><h2 class="h">' + t('cabH') + '</h2><div class="rooms">' +
      [t('r1'), t('r2'), t('r3')].map(function (n, i) { return '<div class="room">' + room(i) + '<span>' + n + '</span></div>'; }).join('') + '</div></div></section>' +
      '<section class="blk" id="s-avis"><div class="in"><p class="eb">' + t('avisEb') + '</p><h2 class="h">' + t('avisH') + '</h2><div class="revs">' +
      t('revs').map(function (r) { return '<figure class="rev" style="margin:0"><div class="s" aria-label="5/5">★★★★★</div><p>« ' + r[0] + ' »</p><b>' + r[1] + '</b><small>' + r[2] + '</small></figure>'; }).join('') + '</div></div></section>' +
      '<section class="blk alt" id="rdv"><div class="in rdv"><div><p class="eb">' + t('rdvEb') + '</p><h2 class="h">' + t('rdvH') + '</h2><p class="lead">' + t('rdvL') + '</p><div class="perk">' +
      [t('p1'), t('p2'), t('p3')].map(function (p) { return '<div><span>' + ic('check', 16) + '</span>' + p + '</div>'; }).join('') + '</div></div><div class="rbox" id="rbox"></div></div></section>' +
      '<section class="blk" id="s-acc"><div class="in"><p class="eb">' + t('accEb') + '</p><h2 class="h">' + t('accH') + '</h2><div class="acc"><div class="hrs" id="hours">' +
      order.map(function (d) { var h = cfg.hours[d]; return '<div class="' + (d === today ? 'today' : '') + '"><span>' + DAYS[L][d].charAt(0).toUpperCase() + DAYS[L][d].slice(1) + '</span><span>' + (h && !(cfg.closed && d === today) ? h[0] + ' – ' + h[1] : t('closedD')) + '</span></div>'; }).join('') +
      '</div><div class="map">' + mapArt() + '<div class="ad"><span><b>' + t('addr') + '</b><small>' + t('park') + '</small></span><button class="btn t" type="button" data-itin>' + ic('map', 16) + t('itin') + '</button></div></div></div></div></section>' +
      '<footer class="foot"><div class="in"><span>' + t('foot') + '</span><span>' + cfg.phone + '</span></div></footer>' +
      '<div class="mbar" id="mbar"><button class="btn o" type="button" data-call>' + ic('phone', 16) + t('mb1') + '</button><button class="btn wa" type="button" data-wa>' + ic('wa', 16) + t('mb2') + '</button><button class="btn t" type="button" data-book>' + ic('cal', 16) + t('mb3') + '</button></div>';
    renderRdv();
  }

  function renderRdv() {
    var box = $('#rbox'); if (!box) return;
    if (S.sent) {
      var s = svcById(S.svc), dd = new Date(S.day + 'T12:00:00');
      box.innerHTML = '<div class="sent"><div class="ck">' + ic('check', 32) + '</div><h3>' + t('sentH') + '</h3><p>' + fmt(t('sentP'), { tel: esc(S.tel), svc: esc(svcName(s)), when: dayLabel(dd, true) + ' ' + t('at') + ' ' + S.slot }) + '</p>' +
        '<button class="btn o" type="button" id="again" style="margin-top:18px">' + t('again') + '</button></div>';
      return;
    }
    var days = openDays();
    if (S.day && !days.some(function (d) { return dayKey(d) === S.day; })) { S.day = null; S.slot = null; }
    var cur = S.day ? days.filter(function (d) { return dayKey(d) === S.day; })[0] : null;
    box.innerHTML = '<p class="st2">' + t('q1') + '</p><div class="ch2" id="svcPick">' + cfg.services.map(function (s) { return '<button type="button" class="c2' + (S.svc === s.id ? ' on' : '') + '" data-svc="' + s.id + '">' + esc(svcName(s)) + '</button>'; }).join('') + '</div>' +
      '<p class="st2">' + t('q2') + '</p><div class="ch2" id="dayPick">' + days.map(function (d) { return '<button type="button" class="c2 day' + (S.day === dayKey(d) ? ' on' : '') + '" data-day="' + dayKey(d) + '"><small>' + dayLabel(d) + '</small><b>' + d.getDate() + '</b></button>'; }).join('') + '</div>' +
      (cur ? '<p class="st2">' + t('q3') + '</p><div class="slots" id="slotPick">' + slotsFor(cur).map(function (x) { return '<button type="button" class="c2' + (S.slot === x[0] ? ' on' : '') + '" data-slot="' + x[0] + '"' + (x[1] ? ' disabled aria-label="' + x[0] + ' — pris"' : '') + '>' + x[0] + '</button>'; }).join('') + '</div>' : '') +
      '<button type="button" class="tf2" id="rdvTest">' + t('test') + '</button>' +
      '<div class="f2"><input id="r-name" autocomplete="name" placeholder="' + t('name') + '" aria-label="' + t('name') + '" value="' + esc(S.name) + '"><input id="r-tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="' + t('tel') + '" aria-label="' + t('tel') + '" value="' + esc(S.tel) + '"></div>' +
      (S.err ? '<p class="er2">' + t('err') + '</p>' : '') +
      '<button class="btn t" type="button" id="rdvSend">' + ic('cal', 18) + t('send') + '</button>';
  }

  function fillRdv() {
    var days = openDays();
    if (!S.svc) S.svc = 'detart';
    if (!S.day) S.day = dayKey(days[0]);
    if (!S.slot) { var free = slotsFor(new Date(S.day + 'T12:00:00')).filter(function (x) { return !x[1]; })[0]; S.slot = free ? free[0] : null; }
    S.name = 'Amine Benali'; S.tel = '0555 12 34 56'; S.filled = true; S.err = false; renderRdv();
  }
  function sendRdv() {
    var nm = $('#r-name'), tl = $('#r-tel'); if (nm) S.name = nm.value.trim(); if (tl) S.tel = tl.value.trim();
    if (!S.svc || !S.day || !S.slot || S.name.length < 3 || !/^0[5-7]\d{8}$/.test(S.tel.replace(/\s/g, ''))) { S.err = true; renderRdv(); return; }
    S.sent = true; S.err = false; stats.rdv++;
    var r = { id: Date.now(), name: S.name, tel: S.tel, svc: S.svc, day: S.day, slot: S.slot, st: 'new', ago: 'à l’instant', fresh: true };
    reqs.unshift(r); S.lastReq = r.id; renderRdv();
    setTimeout(function () { notify(r); }, 1400);
  }

  $('#site').addEventListener('click', function (e) {
    var b = e.target.closest('button, a'); if (!b) return;
    if (b.hasAttribute('data-noop')) { e.preventDefault(); return; }
    if (b.dataset.jump) { e.preventDefault(); var x = document.getElementById(b.dataset.jump); if (x) x.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (b.dataset.lang) { S.lang = b.dataset.lang; renderSite(); return; }
    if (b.hasAttribute('data-book')) { S.asked = true; var rv = $('#rdv'); if (rv) rv.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (b.hasAttribute('data-call')) { stats.calls++; toast('Sur le vrai site, ce bouton lance l’appel vers le cabinet.'); return; }
    if (b.hasAttribute('data-wa')) { stats.wa++; toast('Sur le vrai site, WhatsApp s’ouvre avec un message déjà rédigé.'); return; }
    if (b.hasAttribute('data-itin')) { toast('Sur le vrai site, l’itinéraire s’ouvre dans Google Maps.'); return; }
    if (b.dataset.svc) { S.svc = b.dataset.svc; S.err = false; renderRdv(); return; }
    if (b.dataset.day) { S.day = b.dataset.day; S.slot = null; renderRdv(); return; }
    if (b.dataset.slot && !b.disabled) { S.slot = b.dataset.slot; renderRdv(); return; }
    if (b.id === 'rdvTest') { fillRdv(); return; }
    if (b.id === 'rdvSend') { sendRdv(); return; }
    if (b.id === 'again') { S.sent = false; S.svc = S.day = S.slot = null; S.filled = false; renderRdv(); }
  });
  $('#site').addEventListener('input', function (e) { if (e.target.id === 'r-name') S.name = e.target.value; if (e.target.id === 'r-tel') S.tel = e.target.value; });

  // ---------- Aperçu ordinateur / téléphone ----------
  function setDevice(d) {
    S.device = d; $('#stage').classList.toggle('phone', d === 'phone');
    $$('#devToggle button').forEach(function (b) { b.classList.toggle('on', b.dataset.dev === d); });
    if (S.view !== 'site') go('site');
  }
  $('#devToggle').addEventListener('click', function (e) { var b = e.target.closest('[data-dev]'); if (b) setDevice(b.dataset.dev); });

  // ---------- Notification ----------
  function notify(r) {
    var s = svcById(r.svc), d = new Date(r.day + 'T12:00:00');
    $('#notif').innerHTML = '<span class="ic" style="background:#0f766e">' + ic('cal', 20) + '</span><span><span class="t">Cabinet Dr Haddad · Demande de RDV <span>maintenant</span></span><span class="m">' + esc(r.name) + ' — ' + esc(s.fr) + ', ' + DAYS.fr[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS.fr[d.getMonth()] + ' à ' + r.slot + '</span></span>';
    $('#notif').classList.add('on'); S.notified = r.id;
  }
  $('#notif').onclick = function () { $('#notif').classList.remove('on'); S.hot = S.notified; S.tab = 'rdv'; go('admin'); };

  // ---------- Vues ----------
  function go(v) {
    S.view = v; $('#stage').hidden = v !== 'site'; $('#admin').hidden = v !== 'admin';
    $('#sw').textContent = v === 'site' ? 'Espace gérant' : 'Voir le site';
    if (v === 'site') { S.siteVisited = true; renderSite(); } else renderAdmin();
    window.scrollTo(0, 0); var st = $('#site'); if (st) st.scrollTop = 0;
  }
  $('#sw').onclick = function () { go(S.view === 'site' ? 'admin' : 'site'); };
  $('#viewSite').onclick = function () { go('site'); };

  // ---------- Espace gérant ----------
  var seedDays = openDays();
  var reqs = [
    { id: 1, name: 'Mourad Kaci', tel: '0661 40 22 18', svc: 'consult', day: dayKey(seedDays[1]), slot: '14:30', st: 'new', ago: 'il y a 2 h' },
    { id: 2, name: 'Feriel Amrani', tel: '0770 15 63 02', svc: 'blanc', day: dayKey(seedDays[2]), slot: '11:00', st: 'move', ago: 'hier', sms: 'Proposition envoyée : ' },
    { id: 3, name: 'Rania Bouzid', tel: '0550 98 31 77', svc: 'detart', day: dayKey(seedDays[0]), slot: '10:00', st: 'ok', ago: 'hier' }
  ];
  function reqWhen(r) { var d = new Date(r.day + 'T12:00:00'); return DAYS.fr[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS.fr[d.getMonth()] + ' à ' + r.slot; }
  function renderAdmin() {
    $$('.tab').forEach(function (b) { b.classList.toggle('on', b.dataset.tab === S.tab); b.setAttribute('aria-selected', b.dataset.tab === S.tab); });
    var n = reqs.filter(function (r) { return r.st === 'new'; }).length; $('#newCount').hidden = !n; $('#newCount').textContent = n;
    if (S.tab === 'rdv') renderReqs(); else if (S.tab === 'stats') renderStats(); else renderEditor();
  }
  $('.tabs').addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (b) { S.tab = b.dataset.tab; renderAdmin(); } });

  function renderReqs() {
    var c = function (s) { return reqs.filter(function (r) { return r.st === s; }).length; };
    $('#pane').innerHTML = '<div class="kpis"><div class="kpi"><small>À confirmer</small><b>' + c('new') + '</b></div><div class="kpi"><small>Confirmés</small><b>' + c('ok') + '</b></div><div class="kpi"><small>Créneau proposé</small><b>' + c('move') + '</b></div><div class="kpi"><small>Demandes ce mois</small><b>' + stats.rdv + '</b><em>via le site</em></div></div>' +
      '<div class="bar2"><h2>Demandes de rendez-vous</h2></div>' +
      reqs.map(function (r) {
        var s = svcById(r.svc), pill = r.st === 'new' ? '<span class="pill p-new"><i></i>À confirmer</span>' : r.st === 'ok' ? '<span class="pill p-ok"><i></i>Confirmé</span>' : '<span class="pill p-move"><i></i>Autre créneau proposé</span>';
        return '<div class="req' + (r.id === S.hot ? ' hot' : '') + '" data-r="' + r.id + '"><div class="who"><b>' + esc(r.name) + '</b><a href="tel:' + esc(r.tel.replace(/\s/g, '')) + '">' + esc(r.tel) + '</a></div>' +
          '<div class="when"><b>' + esc(s ? s.fr : '') + '</b><br>' + reqWhen(r) + ' · reçue ' + esc(r.ago) + '</div>' +
          '<div class="acts">' + pill + (r.st === 'new' ? '<button class="b pri sm" type="button" data-ok="' + r.id + '">Confirmer</button><button class="b sec sm" type="button" data-move="' + r.id + '">Proposer un autre créneau</button>' : '') + '</div>' +
          (r.smsText ? '<div class="sms"><b>SMS envoyé au patient ✓</b><br>' + esc(r.smsText) + '</div>' : '') + '</div>';
      }).join('');
  }
  $('#pane').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var id = +(b.dataset.ok || b.dataset.move || 0), r = reqs.filter(function (x) { return x.id === id; })[0];
    if (r && b.dataset.ok) { r.st = 'ok'; r.smsText = 'Bonjour ' + r.name.split(' ')[0] + ', votre rendez-vous (' + svcById(r.svc).fr + ') du ' + reqWhen(r) + ' est confirmé. Cabinet Dr Haddad, ' + cfg.phone + '.'; renderAdmin(); toast('Rendez-vous confirmé, SMS envoyé'); }
    else if (r && b.dataset.move) { r.st = 'move'; r.smsText = 'Bonjour ' + r.name.split(' ')[0] + ', le créneau demandé n’est plus libre. Nous vous proposons le même jour à 16:00. Répondez OUI pour confirmer.'; renderAdmin(); toast('Proposition envoyée par SMS'); }
    else if (b.id === 'goSite') go('site');
  });

  function renderStats() {
    var weeks = [212, 238, 251, 263, 241, 288, 302, 319, 297, 334, 352, 371], mx = Math.max.apply(null, weeks);
    var plain = cfg.title.replace(/<[^>]+>/g, '');
    $('#pane').innerHTML = '<div class="kpis" id="skpis"><div class="kpi"><small>Visiteurs (30 j)</small><b>' + num(stats.visits) + '</b><em>+22 %</em></div><div class="kpi"><small>Appels depuis le site</small><b>' + stats.calls + '</b><em>+9</em></div><div class="kpi"><small>Clics WhatsApp</small><b>' + stats.wa + '</b><em>+17</em></div><div class="kpi"><small>Demandes de RDV</small><b>' + stats.rdv + '</b><em>+11</em></div></div>' +
      '<div class="ed"><div class="box"><h3>Visiteurs par semaine</h3><p class="d">Sur les 12 dernières semaines.</p><div class="chart" aria-label="Visiteurs par semaine">' + weeks.map(function (w, i) { return '<div style="height:' + Math.round(w / mx * 100) + '%" title="' + w + '"><small>S' + (i + 1) + '</small></div>'; }).join('') + '</div><div style="height:22px"></div></div>' +
      '<div class="box"><h3>D’où viennent vos patients</h3><p class="d">Ce qui a amené les visiteurs sur le site.</p><div class="src">' +
      [['Recherche Google', 52], ['Facebook & Instagram', 24], ['Google Maps', 16], ['Lien direct / bouche-à-oreille', 8]].map(function (x) { return '<div><span>' + x[0] + '</span><span>' + x[1] + ' %</span><i><u style="width:' + x[1] / 52 * 100 + '%"></u></i></div>'; }).join('') + '</div></div></div>' +
      '<div class="ed" style="margin-top:16px"><div class="box"><h3>Votre site dans les résultats de recherche</h3><p class="d">Titre et description travaillés pour donner envie de cliquer.</p><div class="serp"><div class="u"><i>' + ic('tooth', 14) + '</i><span>dr-haddad-dentiste.dz</span></div><div class="ti">Dentiste à Blida — Dr Selma Haddad | Rendez-vous en ligne</div><div class="ds">' + esc(plain) + ' Soins, blanchiment, implants. Ouvert du samedi au jeudi. Prenez rendez-vous en ligne en une minute.</div><div class="rt"><b>★★★★★</b> 4,9 · 230 avis</div></div></div>' +
      '<div class="box"><h3>Pages les plus vues</h3><p class="d">Ce qui intéresse vraiment vos visiteurs.</p><div class="src">' + [['Accueil', 100], ['Implants', 46], ['Blanchiment', 38], ['Rendez-vous', 33]].map(function (x) { return '<div><span>' + x[0] + '</span><span>' + x[1] + ' %</span><i><u style="width:' + x[1] + '%"></u></i></div>'; }).join('') + '</div></div></div>' +
      '<p class="note">Chiffres de démonstration (les clics que vous avez faits sur la démo sont comptés). Chez vous, ce sont vos vraies visites.</p>';
  }

  function renderEditor() {
    var order = [6, 0, 1, 2, 3, 4, 5];
    $('#pane').innerHTML = '<div class="bar2"><h2>Mon site</h2><button class="b pri sm" type="button" id="goSite">Voir mon site →</button></div><div class="ed">' +
      '<div><div class="box" style="margin-bottom:16px"><h3>Fermeture exceptionnelle</h3><p class="d">Congés, formation, imprévu : un bandeau s’affiche en haut du site et le statut passe à « Fermé ».</p>' +
      '<div class="tg"><span><b>Afficher le bandeau</b><small>' + (cfg.closed ? 'Actif sur le site' : 'Désactivé') + '</small></span><label class="sw2"><input type="checkbox" id="closedT" aria-label="Fermeture exceptionnelle"' + (cfg.closed ? ' checked' : '') + '><span></span></label></div>' +
      '<div class="fl"><label for="closedM">Message affiché</label><textarea id="closedM">' + esc(cfg.closedMsg) + '</textarea></div></div>' +
      '<div class="box"><h3>Textes et contact</h3><p class="d">Changez-les quand vous voulez, c’est en ligne aussitôt.</p>' +
      '<div class="fl"><label for="eTitle">Titre principal</label><textarea id="eTitle">' + esc(cfg.title.replace(/<\/?em>/g, '')) + '</textarea></div>' +
      '<div class="fl"><label for="ePhone">Téléphone du cabinet</label><input id="ePhone" value="' + esc(cfg.phone) + '"></div></div></div>' +
      '<div><div class="box" style="margin-bottom:16px"><h3>Horaires</h3><p class="d">Le statut « Ouvert / Fermé » et les créneaux de rendez-vous suivent ces horaires.</p>' +
      order.map(function (d) { var h = cfg.hours[d]; return '<div class="hr"><span>' + DAYS.fr[d].charAt(0).toUpperCase() + DAYS.fr[d].slice(1) + '</span><input type="time" data-h="' + d + '" data-i="0" value="' + (h ? h[0] : '09:00') + '"' + (h ? '' : ' disabled') + ' aria-label="Ouverture ' + DAYS.fr[d] + '"><input type="time" data-h="' + d + '" data-i="1" value="' + (h ? h[1] : '18:00') + '"' + (h ? '' : ' disabled') + ' aria-label="Fermeture ' + DAYS.fr[d] + '"><label><input type="checkbox" data-off="' + d + '"' + (h ? '' : ' checked') + '>Fermé</label></div>'; }).join('') + '</div>' +
      '<div class="box"><h3>Tarifs affichés</h3><p class="d">Mettez 0 pour afficher « sur devis ».</p>' +
      cfg.services.map(function (s) { return '<div class="pr2"><span>' + esc(s.fr) + '</span><input type="number" min="0" step="500" data-p="' + s.id + '" value="' + s.price + '" aria-label="Tarif ' + esc(s.fr) + '"></div>'; }).join('') + '</div></div></div>';
  }
  var saveT;
  function saved() { clearTimeout(saveT); saveT = setTimeout(function () { toast('Enregistré · en ligne sur le site'); }, 500); }
  $('#pane').addEventListener('input', function (e) {
    var x = e.target;
    if (x.id === 'closedM') { cfg.closedMsg = x.value; saved(); }
    else if (x.id === 'eTitle') { cfg.title = esc(x.value); saved(); }
    else if (x.id === 'ePhone') { cfg.phone = x.value; saved(); }
    else if (x.dataset.h) { var h = cfg.hours[+x.dataset.h]; if (h) { h[+x.dataset.i] = x.value; saved(); } }
    else if (x.dataset.p) { svcById(x.dataset.p).price = Math.max(0, +x.value || 0); saved(); }
  });
  $('#pane').addEventListener('change', function (e) {
    var x = e.target;
    if (x.id === 'closedT') { cfg.closed = x.checked; renderEditor(); toast(cfg.closed ? 'Bandeau de fermeture activé sur le site' : 'Bandeau retiré du site'); }
    else if (x.dataset.off) { var d = +x.dataset.off; cfg.hours[d] = x.checked ? null : ['09:00', '18:00']; renderEditor(); saved(); }
  });

  // ---------- Démarrage ----------
  renderSite();
  setInterval(function () { if (S.view === 'site') { var l = $('#live'), st = status(); if (l) { l.className = 'live' + (st.open ? '' : ' off'); l.innerHTML = '<i></i>' + esc(st.txt); } } }, 30000);

  // ---------- Visite guidée ----------
  function click(sel) { var x = typeof sel === 'string' ? $(sel) : sel; if (x) x.click(); }
  function ensureSite() { if (S.view !== 'site') go('site'); }
  function ensureAdmin(tab) { if (S.view !== 'admin') go('admin'); if (tab && S.tab !== tab) { S.tab = tab; renderAdmin(); } }
  var small = window.innerWidth <= 700;
  var deviceSteps = small ? [
    { title: 'Vous êtes déjà sur téléphone', text: 'Regardez en bas de l’écran : appeler, WhatsApp et rendez-vous restent sous le pouce, où que l’on soit dans la page. C’est là que se joue la plupart des visites.', target: '#mbar', enter: ensureSite }
  ] : [
    { title: 'Et sur téléphone ?', text: 'Plus de 8 visiteurs sur 10 arrivent depuis un mobile. Voyons ce qu’ils voient.', target: '#devToggle', hint: 'Passez en aperçu « Téléphone »', enter: ensureSite, done: function () { return S.device === 'phone'; }, act: function () { setDevice('phone'); } },
    { title: 'Pensé pour le pouce', text: 'Le site se réorganise pour l’écran. En bas, une barre reste toujours visible : appeler, WhatsApp, rendez-vous. Le patient n’a jamais à chercher comment vous joindre.', target: '#mbar' }
  ];
  var steps = [
    { title: 'Trois secondes pour convaincre', text: 'Qui vous êtes, ce que vous faites, où, et comment prendre rendez-vous : tout est visible sans faire défiler. Un visiteur qui doit chercher repart.', target: '#s-hero', enter: function () { ensureSite(); if (S.device === 'phone') setDevice('desktop'); } },
    { title: 'Ouvert ou fermé, en direct', text: 'Ce badge est calculé à partir de vos horaires et de l’heure qu’il est. Fini les patients qui se déplacent pour trouver porte close.', target: '#live' }
  ].concat(deviceSteps).concat([
    { title: 'En arabe, d’un geste', text: 'Une partie de vos patients lit plus volontiers l’arabe. Un seul bouton, et tout le site bascule.', target: '#langSw', hint: 'Appuyez sur « عربي »', enter: ensureSite, done: function () { return S.lang === 'ar'; }, act: function () { S.lang = 'ar'; renderSite(); } },
    { title: 'Tout le site, de droite à gauche', text: 'Ce n’est pas une traduction automatique collée par-dessus : la mise en page se retourne, la typographie change, chaque texte a sa version. Bon pour vos patients, et pour Google.', target: '#s-hero' },
    { title: 'Prenons rendez-vous', text: 'On repasse en français et sur ordinateur, et on se met à la place d’un patient.', target: '#heroRdv', hint: 'Appuyez sur « Prendre rendez-vous »', enter: function () { ensureSite(); if (S.device === 'phone' && !small) setDevice('desktop'); if (S.lang !== 'fr') { S.lang = 'fr'; renderSite(); } }, done: function () { return S.asked || S.sent; }, act: function () { click('#heroRdv'); } },
    { title: 'Le soin, le jour, l’heure', text: 'Les jours fermés n’apparaissent pas, les créneaux déjà pris sont barrés. Le patient réserve le soir, depuis son canapé, sans attendre que le cabinet décroche.', target: '#rbox', hint: 'Choisissez un soin, un jour puis une heure', done: function () { return !!S.slot || S.sent; }, act: function () { var d = openDays()[0]; if (!S.svc) S.svc = 'detart'; if (!S.day) S.day = dayKey(d); renderRdv(); setTimeout(function () { var b = $$('#slotPick .c2').filter(function (x) { return !x.disabled; })[0]; click(b); }, 350); } },
    { title: 'Deux champs, pas plus', text: 'Un nom et un téléphone suffisent. Pour aller vite, on vous a préparé un patient fictif.', target: '#rdvTest', hint: 'Appuyez sur « Remplir avec les infos de test »', done: function () { return S.filled || S.sent; }, act: function () { fillRdv(); } },
    { title: 'On envoie', text: 'C’est exactement ce que vivra votre patient.', target: '#rdvSend', hint: 'Appuyez sur « Envoyer la demande »', done: function () { return S.sent; }, act: function () { if (!S.filled) fillRdv(); sendRdv(); } },
    { title: 'Le cabinet est prévenu', text: 'La demande arrive aussitôt sur le téléphone du cabinet. Même pendant un soin, la secrétaire la voit passer.', target: function () { return $('#notif.on'); }, hint: 'Appuyez sur la notification', done: function () { return S.view === 'admin'; }, act: function () { if (S.notified) click('#notif'); else ensureAdmin('rdv'); } },
    { title: 'Votre espace gérant', text: 'Toutes les demandes au même endroit. Un appui sur « Confirmer » et le patient reçoit un SMS avec le jour et l’heure. Pas d’appel à passer.', target: function () { return $('.req.hot') || $('.req'); }, hint: 'Appuyez sur « Confirmer »', enter: function () { ensureAdmin('rdv'); }, done: function () { var r = reqs.filter(function (x) { return x.id === S.lastReq; })[0]; return r ? r.st !== 'new' : reqs.some(function (x) { return x.smsText; }); }, act: function () { click($('.req.hot [data-ok]') || $('[data-ok]')); } },
    { title: 'Ce que votre site vous rapporte', text: 'Combien de visiteurs, d’appels, de clics WhatsApp et de demandes de rendez-vous.', target: '[data-tab="stats"]', hint: 'Ouvrez l’onglet « Statistiques »', enter: function () { ensureAdmin(); }, done: function () { return S.view === 'admin' && S.tab === 'stats'; }, act: function () { ensureAdmin('stats'); } },
    { title: 'Des chiffres, pas des impressions', text: 'Vous savez enfin si le site travaille pour vous : d’où viennent les patients, ce qu’ils regardent, comment vous apparaissez dans les recherches. Les appels et clics que vous avez faits pendant la démo sont déjà comptés.', target: '#skpis' },
    { title: 'Vous gardez la main', text: 'Horaires, tarifs, textes, téléphone : vous les changez vous-même, sans nous attendre.', target: '[data-tab="site"]', hint: 'Ouvrez l’onglet « Mon site »', enter: function () { ensureAdmin(); }, done: function () { return S.view === 'admin' && S.tab === 'site'; }, act: function () { ensureAdmin('site'); } },
    { title: 'Un imprévu ? Un interrupteur.', text: 'Congés, formation, coupure d’eau : activez la fermeture exceptionnelle, et le site prévient vos patients à votre place.', target: '.tg', hint: 'Activez « Afficher le bandeau »', enter: function () { ensureAdmin('site'); }, done: function () { return cfg.closed; }, act: function () { var c = $('#closedT'); if (c && !c.checked) click(c); } },
    { title: 'Allons voir', text: 'Retournons sur le site, comme un patient.', target: '#goSite', hint: 'Appuyez sur « Voir mon site »', done: function () { return S.view === 'site' && cfg.closed; }, act: function () { go('site'); } },
    { title: 'C’est déjà en ligne', text: 'Le bandeau est en haut, et le badge est passé à « Fermé exceptionnellement ». Pensez à le désactiver à votre retour — en un clic, depuis l’espace gérant.', target: '#closedBanner', enter: ensureSite },
    { title: 'Et tout ce qu’on met autour', text: 'Le site, c’est la vitrine. Autour, on peut brancher ce qui vous fait gagner des patients :', target: null,
      list: ['Votre nom de domaine et des adresses e-mail professionnelles.', 'Une fiche Google Maps soignée, reliée au site.', 'Un référencement local pour sortir quand on cherche « dentiste + votre ville ».', 'Les rappels de rendez-vous par SMS ou WhatsApp.', 'Hébergement, sauvegardes et mises à jour pris en charge.'],
      buttons: '<a class="b pri" href="../../#contact">Je veux mon site</a>' }
  ]);
  var tour = Tour.create({
    welcome: { title: 'Bienvenue au cabinet Dr Haddad', text: 'Un vrai site vitrine, pas une maquette. En 3 minutes, vous le voyez sur téléphone et en arabe, vous prenez rendez-vous comme un patient, puis vous gérez tout comme le cabinet.' },
    steps: steps
  });
  tour.welcome();
})();
