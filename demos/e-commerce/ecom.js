/* ADweb — démo boutique en ligne (données fictives, tout se passe dans le navigateur) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function da(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' DA'; }

  var WILAYAS = ['Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem', 'M’Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El M’Ghair', 'El Meniaa'];
  function wname(code) { return String(code).padStart(2, '0') + ' · ' + WILAYAS[code - 1]; }
  var NEAR = [9, 16, 35, 42];
  function fee(w, mode) { var near = NEAR.indexOf(+w) >= 0; return mode === 'relais' ? (near ? 250 : 400) : (near ? 400 : 650); }

  // ---------- Catalogue ----------
  var P = [
    { id: 1, n: 'Rose de Kabylie', r: 'Femme', f: 'Floral', sh: 'round', c: ['#f9a8c4', '#d9467a'], cap: '#c8a24a', bg: '#f7e6ea', nw: 1, notes: ['Rose', 'Litchi', 'Musc'], d: 'Une rose fraîche et lumineuse, adoucie par un fond musqué. Tenue d’une journée.', v: [[30, 4900, 8], [50, 6900, 0], [100, 9900, 5]] },
    { id: 2, n: 'Cèdre de l’Atlas', r: 'Homme', f: 'Boisé', sh: 'tall', c: ['#a8cfa6', '#2f5d3a'], cap: '#3f2a1c', bg: '#e6efe3', notes: ['Cèdre', 'Bergamote', 'Vétiver'], d: 'Un boisé sec et élégant, ouvert par la bergamote. Pensé pour le bureau comme pour le soir.', v: [[30, 4500, 0], [50, 6500, 9], [100, 9500, 2]] },
    { id: 3, n: 'Nuit d’Ambre', r: 'Homme', f: 'Oriental', sh: 'rect', c: ['#f3b664', '#a2470a'], cap: '#1f2937', bg: '#f6eadb', notes: ['Ambre', 'Vanille', 'Tabac'], d: 'Ambre chaud et vanille fumée : un sillage profond qui se remarque.', v: [[50, 7900, 6], [100, 11900, 3]] },
    { id: 4, n: 'Fleur d’Oranger', r: 'Femme', f: 'Floral', sh: 'rect', c: ['#fde68a', '#f59e0b'], cap: '#ffffff', bg: '#fbf1d9', notes: ['Néroli', 'Fleur d’oranger', 'Miel'], d: 'Le parfum des jardins au printemps, solaire et tendre.', v: [[30, 4200, 12], [50, 5900, 7]] },
    { id: 5, n: 'Brise de Tipaza', r: 'Mixte', f: 'Frais', sh: 'tall', c: ['#a5f3fc', '#0e7490'], cap: '#e5e7eb', bg: '#e1f3f6', nw: 1, notes: ['Notes marines', 'Citron', 'Sauge'], d: 'Air marin et agrumes, une fraîcheur qui se partage.', v: [[50, 6200, 4], [100, 8900, 0]] },
    { id: 6, n: 'Musc blanc', r: 'Mixte', f: 'Musc', sh: 'roll', c: ['#fafaf9', '#d6d3d1'], cap: '#a8a29e', bg: '#efece8', notes: ['Musc blanc', 'Coton'], d: 'Le classique, propre et doux, en roll-on à glisser dans le sac.', v: [[10, 1500, 30], [30, 3200, 14]] },
    { id: 7, n: 'Oud royal', r: 'Homme', f: 'Oriental', sh: 'round', c: ['#9a3412', '#3b0a0a'], cap: '#c8a24a', bg: '#efe0d6', notes: ['Oud', 'Rose', 'Safran'], d: 'Un oud intense relevé de safran, pour les grandes occasions.', v: [[50, 12900, 2], [100, 18900, 1]] },
    { id: 8, n: 'Jasmin de nuit', r: 'Femme', f: 'Floral', sh: 'tall', c: ['#e9d5ff', '#7e22ce'], cap: '#111827', bg: '#efe6f8', notes: ['Jasmin', 'Prune', 'Patchouli'], d: 'Un jasmin capiteux qui se révèle à la tombée du jour.', v: [[30, 4900, 6], [50, 6900, 3], [100, 9900, 0]] },
    { id: 9, n: 'Musc rose', r: 'Femme', f: 'Musc', sh: 'roll', c: ['#fecdd3', '#fb7185'], cap: '#fda4af', bg: '#fbe7ea', notes: ['Musc', 'Pivoine'], d: 'Musc poudré et pivoine, discret et très tenace.', v: [[10, 1600, 22], [30, 3400, 0]] },
    { id: 10, n: 'Vétiver frais', r: 'Homme', f: 'Frais', sh: 'rect', c: ['#d9f99d', '#4d7c0f'], cap: '#e5e7eb', bg: '#eef5df', notes: ['Vétiver', 'Pamplemousse'], d: 'Vert et pétillant, idéal pour les journées chaudes.', v: [[30, 4300, 5], [50, 6100, 5]] }
  ];
  var nextPid = 11;

  // ---------- Visuels (SVG générés) ----------
  var gid = 0;
  function bottle(p, view) {
    var k = ++gid, c1 = p.c[0], c2 = p.c[1], cap = p.cap, body, neck, capS, lx, ly, lw;
    var defs = '<defs><linearGradient id="l' + k + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient>' +
      '<linearGradient id="g' + k + '" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".35" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="b' + k + '" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="' + p.bg + '"/></radialGradient></defs>';
    if (p.sh === 'round') { body = '<circle cx="200" cy="258" r="92" fill="url(#l' + k + ')"/><circle cx="200" cy="258" r="92" fill="url(#g' + k + ')"/>'; neck = '<rect x="183" y="150" width="34" height="22" fill="' + c2 + '" opacity=".75"/>'; capS = '<rect x="168" y="96" width="64" height="58" rx="26" fill="' + cap + '"/>'; lx = 150; ly = 238; lw = 100; }
    else if (p.sh === 'tall') { body = '<rect x="152" y="128" width="96" height="220" rx="14" fill="url(#l' + k + ')"/><rect x="152" y="128" width="96" height="220" rx="14" fill="url(#g' + k + ')"/>'; neck = '<rect x="186" y="108" width="28" height="24" fill="' + c2 + '" opacity=".75"/>'; capS = '<rect x="174" y="58" width="52" height="54" rx="6" fill="' + cap + '"/>'; lx = 160; ly = 236; lw = 80; }
    else if (p.sh === 'roll') { body = '<rect x="168" y="178" width="64" height="168" rx="28" fill="url(#l' + k + ')"/><rect x="168" y="178" width="64" height="168" rx="28" fill="url(#g' + k + ')"/>'; neck = ''; capS = '<rect x="168" y="102" width="64" height="84" rx="28" fill="' + cap + '"/><rect x="168" y="176" width="64" height="8" fill="#000" opacity=".08"/>'; lx = 172; ly = 250; lw = 56; }
    else { body = '<rect x="128" y="160" width="144" height="186" rx="20" fill="url(#l' + k + ')"/><rect x="128" y="160" width="144" height="186" rx="20" fill="url(#g' + k + ')"/>'; neck = '<rect x="182" y="134" width="36" height="30" fill="' + c2 + '" opacity=".75"/>'; capS = '<rect x="164" y="80" width="72" height="58" rx="8" fill="' + cap + '"/>'; lx = 148; ly = 236; lw = 104; }
    var short = p.n.split(' ')[0].toUpperCase();
    var label = '<rect x="' + lx + '" y="' + ly + '" width="' + lw + '" height="40" rx="6" fill="#fff" opacity=".9"/>' +
      '<text x="200" y="' + (ly + 17) + '" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-size="13" fill="#1c1712">Yasmine</text>' +
      '<text x="200" y="' + (ly + 31) + '" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-size="7.5" font-weight="700" letter-spacing="1.6" fill="#7a6c5c">' + esc(short.slice(0, 12)) + '</text>';
    var shadow = '<ellipse cx="200" cy="352" rx="' + (p.sh === 'round' ? 96 : 84) + '" ry="10" fill="#000" opacity=".12"/>';
    var bottleG = shadow + body + neck + capS + label;
    var inner;
    if (view === 1) {
      inner = '<rect width="400" height="400" fill="url(#b' + k + ')"/>' +
        '<g transform="translate(70 0)"><rect x="196" y="120" width="120" height="232" rx="6" fill="' + c2 + '"/><rect x="196" y="120" width="120" height="232" rx="6" fill="#000" opacity=".12"/><rect x="206" y="130" width="100" height="212" rx="3" fill="none" stroke="#fff" stroke-opacity=".5"/>' +
        '<text x="256" y="246" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-size="22" fill="#fff" transform="rotate(-90 256 246)">Yasmine</text></g>' +
        '<g transform="translate(-50 10) scale(.95)">' + bottleG + '</g>';
    } else if (view === 2) {
      inner = '<rect width="400" height="400" fill="' + p.bg + '"/><g transform="translate(-200 -150) scale(2)">' + bottleG + '</g>' +
        '<rect width="400" height="400" fill="url(#g' + k + ')" opacity=".4"/>';
    } else {
      inner = '<rect width="400" height="400" fill="url(#b' + k + ')"/><circle cx="320" cy="90" r="40" fill="#fff" opacity=".35"/>' + bottleG;
    }
    return '<svg viewBox="0 0 400 400" role="img" aria-label="' + esc(p.n) + '" xmlns="http://www.w3.org/2000/svg">' + defs + inner + '</svg>';
  }

  // ---------- État ----------
  var S = { rayon: null, famille: null, ml: null, cart: [], view: 'shop', tab: 'orders', product: null, size: null, qty: 1, img: 0, lastOrder: null, filled: false, coStep: 'form', hot: null };
  var orders = [
    { id: 1037, name: 'Sara Meziane', tel: '0661 23 45 18', w: 16, commune: 'Hydra', mode: 'domicile', items: [{ pid: 1, ml: 50, q: 1, price: 6900 }], ship: 400, st: 'livree', ago: '2 j' },
    { id: 1038, name: 'Yacine Boudiaf', tel: '0550 81 02 77', w: 31, commune: 'Bir El Djir', mode: 'relais', items: [{ pid: 3, ml: 100, q: 1, price: 11900 }], ship: 400, st: 'livree', ago: '2 j' },
    { id: 1039, name: 'Lina Haddad', tel: '0770 45 66 12', w: 25, commune: 'Ali Mendjeli', mode: 'domicile', items: [{ pid: 4, ml: 30, q: 2, price: 4200 }], ship: 650, st: 'confirmee', ago: 'hier' },
    { id: 1040, name: 'Karim Ait Ali', tel: '0558 19 30 44', w: 15, commune: 'Azazga', mode: 'domicile', items: [{ pid: 2, ml: 50, q: 1, price: 6500 }, { pid: 6, ml: 10, q: 1, price: 1500 }], ship: 650, st: 'confirmee', ago: 'hier' },
    { id: 1041, name: 'Imane Cherif', tel: '0662 70 11 93', w: 19, commune: 'El Eulma', mode: 'relais', items: [{ pid: 8, ml: 50, q: 1, price: 6900 }], ship: 400, st: 'appelee', ago: '3 h' },
    { id: 1042, name: 'Nassim Belkacem', tel: '0771 02 58 36', w: 6, commune: 'Akbou', mode: 'domicile', items: [{ pid: 7, ml: 50, q: 1, price: 12900 }], ship: 650, st: 'nouvelle', ago: '40 min' }
  ];
  var nextOid = 1043;
  var ST = { nouvelle: 'Nouvelle', appelee: 'Appelée', confirmee: 'Confirmée', livree: 'Livrée', annulee: 'Annulée' };
  var NEXT = { nouvelle: ['appelee', 'Marquer appelée'], appelee: ['confirmee', 'Marquer confirmée'], confirmee: ['livree', 'Marquer livrée'] };

  function prod(id) { for (var i = 0; i < P.length; i++) if (P[i].id === id) return P[i]; return null; }
  function minPrice(p) { return Math.min.apply(null, p.v.map(function (x) { return x[1]; })); }
  function stockOf(p) { return p.v.reduce(function (a, x) { return a + x[2]; }, 0); }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
  function orderTotal(o) { return o.items.reduce(function (a, it) { return a + it.price * it.q; }, 0) + o.ship; }
  function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('on'); }, 2600); }

  // ---------- Filtres & grille ----------
  function visible() {
    return P.filter(function (p) {
      return (!S.rayon || p.r === S.rayon) && (!S.famille || p.f === S.famille) &&
        (!S.ml || p.v.some(function (v) { return v[0] === S.ml; }));
    });
  }
  var prevMl = [];
  function renderFilters() {
    var rayons = uniq(P.map(function (p) { return p.r; }));
    var pool = P.filter(function (p) { return !S.rayon || p.r === S.rayon; });
    var familles = uniq(pool.map(function (p) { return p.f; }));
    if (S.famille && familles.indexOf(S.famille) < 0) S.famille = null;
    var pool2 = pool.filter(function (p) { return !S.famille || p.f === S.famille; });
    var mls = uniq([].concat.apply([], pool2.map(function (p) { return p.v.map(function (v) { return v[0]; }); }))).sort(function (a, b) { return a - b; });
    if (S.ml && mls.indexOf(S.ml) < 0) S.ml = null;
    function chips(list, key, fmt) {
      return list.map(function (x) {
        var isNew = key === 'ml' && prevMl.length && prevMl.indexOf(x) < 0;
        return '<button type="button" class="chip' + (S[key] === x ? ' on' : '') + (isNew ? ' new' : '') + '" data-k="' + key + '" data-v="' + x + '">' + (fmt ? fmt(x) : esc(x)) + '</button>';
      }).join('');
    }
    $('#filters').innerHTML =
      '<div class="frow" id="fRayon"><span class="lb">Rayon</span>' + chips(rayons, 'rayon') + '</div>' +
      '<div class="frow" id="fFam"><span class="lb">Famille</span>' + chips(familles, 'famille') + '</div>' +
      '<div class="frow" id="fMl"><span class="lb">Contenance</span>' + chips(mls, 'ml', function (x) { return x + ' ml'; }) +
      (S.rayon || S.famille || S.ml ? '<button type="button" class="reset" id="reset">Réinitialiser</button>' : '') + '</div>';
    prevMl = mls;
  }
  function renderGrid() {
    var list = visible();
    $('#count').textContent = list.length + ' parfum' + (list.length > 1 ? 's' : '') + ' · livraison 58 wilayas · paiement à la livraison';
    $('#grid').innerHTML = list.length ? list.map(function (p, i) {
      var out = stockOf(p) === 0;
      return '<button type="button" class="pc" data-p="' + p.id + '" style="animation-delay:' + (i * 40) + 'ms">' +
        '<div class="im">' + bottle(p, 0) + (p.nw ? '<span class="bd nw">Nouveau</span>' : out ? '<span class="bd">Épuisé</span>' : '') + '</div>' +
        '<div class="tx"><div class="mt">' + esc(p.r) + ' · ' + esc(p.f) + '</div><h3 class="serif">' + esc(p.n) + '</h3>' +
        '<div class="pr"><small>dès</small> ' + da(minPrice(p)) + '</div></div></button>';
    }).join('') : '<div class="empty">Aucun parfum ne correspond. <button class="reset" type="button" id="reset2">Tout afficher</button></div>';
  }
  function renderShop() { renderFilters(); renderGrid(); renderCartCount(); }
  $('#filters').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.id === 'reset') { S.rayon = S.famille = S.ml = null; }
    else { var k = b.dataset.k, v = k === 'ml' ? +b.dataset.v : b.dataset.v; S[k] = S[k] === v ? null : v; }
    renderShop();
  });
  $('#grid').addEventListener('click', function (e) {
    if (e.target.id === 'reset2') { S.rayon = S.famille = S.ml = null; renderShop(); return; }
    var c = e.target.closest('.pc'); if (c) openProduct(+c.dataset.p);
  });

  // ---------- Fiche produit ----------
  function openProduct(id) {
    S.product = prod(id); S.size = null; S.qty = 1; S.img = 0;
    renderProduct(); $('#pm').hidden = false; document.body.style.overflow = 'hidden';
  }
  function closeProduct() { $('#pm').hidden = true; S.product = null; document.body.style.overflow = ''; }
  function renderProduct() {
    var p = S.product; if (!p) return;
    var sel = S.size && p.v.filter(function (v) { return v[0] === S.size; })[0];
    var price = sel ? sel[1] : minPrice(p);
    var low = sel && sel[2] <= 3 ? 'Plus que ' + sel[2] + ' en stock — dépêchez-vous.' : '';
    $('#pm').innerHTML = '<div class="md" role="dialog" aria-modal="true" aria-label="' + esc(p.n) + '"><button class="mx" type="button" data-x aria-label="Fermer">✕</button><div class="pd">' +
      '<div class="gal" id="gal"><div class="main">' + bottle(p, S.img) + '</div><div class="thumbs">' +
      [0, 1, 2].map(function (v) { return '<button type="button" class="' + (S.img === v ? 'on' : '') + '" data-img="' + v + '" aria-label="Photo ' + (v + 1) + '">' + bottle(p, v) + '</button>'; }).join('') +
      '</div></div><div class="inf"><div class="mt">' + esc(p.r) + ' · ' + esc(p.f) + '</div><h2 class="serif">' + esc(p.n) + '</h2>' +
      '<div class="pr">' + (sel ? '' : '<small style="font-size:14px;color:#9a8b78;font-weight:600">dès </small>') + da(price) + '</div>' +
      '<p>' + esc(p.d) + '</p><div class="notes">' + p.notes.map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('') + '</div>' +
      '<div class="lbl"><span>Contenance</span>' + (S.size ? '' : '<span style="text-transform:none;letter-spacing:0;font-weight:600">Choisissez une contenance</span>') + '</div>' +
      '<div class="sizes" id="sizes">' + p.v.map(function (v) {
        return '<button type="button" class="sz' + (S.size === v[0] ? ' on' : '') + '" data-ml="' + v[0] + '"' + (v[2] === 0 ? ' disabled aria-label="' + v[0] + ' ml, épuisé"' : '') + '><b>' + v[0] + ' ml</b><small>' + (v[2] === 0 ? 'Épuisé' : da(v[1])) + '</small></button>';
      }).join('') + '</div><div class="low">' + low + '</div>' +
      '<div class="addrow"><div class="qty"><button type="button" data-q="-1" aria-label="Moins">−</button><span>' + S.qty + '</span><button type="button" data-q="1" aria-label="Plus">+</button></div>' +
      '<button type="button" class="b gold" id="addBtn"' + (S.size ? '' : ' disabled') + '>Ajouter au panier</button></div>' +
      '<div class="perks"><div>🚚 Livraison en 24 à 72 h selon la wilaya</div><div>💵 Vous payez à la réception du colis</div><div>↺ Échange possible sous 7 jours</div></div>' +
      '</div></div></div>';
  }
  $('#pm').addEventListener('click', function (e) {
    if (e.target === $('#pm') || e.target.closest('[data-x]')) return closeProduct();
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.img) { S.img = +b.dataset.img; renderProduct(); }
    else if (b.dataset.ml) { S.size = +b.dataset.ml; S.qty = 1; renderProduct(); }
    else if (b.dataset.q) {
      var max = S.size ? S.product.v.filter(function (v) { return v[0] === S.size; })[0][2] : 9;
      S.qty = Math.max(1, Math.min(max, S.qty + +b.dataset.q)); renderProduct();
    }
    else if (b.id === 'addBtn') addToCart();
  });
  function addToCart() {
    var p = S.product, v = p.v.filter(function (x) { return x[0] === S.size; })[0];
    var line = S.cart.filter(function (c) { return c.pid === p.id && c.ml === S.size; })[0];
    if (line) line.q = Math.min(v[2], line.q + S.qty); else S.cart.push({ pid: p.id, ml: S.size, q: S.qty, price: v[1] });
    closeProduct(); renderCartCount(true); toast(p.n + ' ' + S.size + ' ml ajouté au panier');
  }
  function cartQty() { return S.cart.reduce(function (a, c) { return a + c.q; }, 0); }
  function cartSub() { return S.cart.reduce(function (a, c) { return a + c.q * c.price; }, 0); }
  function renderCartCount(bump) {
    var n = $('#cc'); n.textContent = cartQty();
    if (bump) { n.classList.add('bump'); setTimeout(function () { n.classList.remove('bump'); }, 450); }
  }

  // ---------- Panier ----------
  function openCart() { renderCart(); $('#cart').classList.add('on'); $('#cart').setAttribute('aria-hidden', 'false'); $('#scrim').classList.add('on'); }
  function closeCart() { $('#cart').classList.remove('on'); $('#cart').setAttribute('aria-hidden', 'true'); $('#scrim').classList.remove('on'); }
  function renderCart() {
    $('#cartItems').innerHTML = S.cart.length ? S.cart.map(function (c, i) {
      var p = prod(c.pid) || { n: 'Produit retiré', c: ['#ddd', '#bbb'], cap: '#999', bg: '#eee', sh: 'rect' };
      return '<div class="it"><div class="th">' + bottle(p, 0) + '</div><div><h4 class="serif">' + esc(p.n) + '</h4><div class="s">' + c.ml + ' ml · quantité ' + c.q + '</div><button class="rm" type="button" data-rm="' + i + '">Retirer</button></div><div class="p">' + da(c.price * c.q) + '</div></div>';
    }).join('') : '<p style="color:#7a6c5c;padding:30px 0;text-align:center">Votre panier est vide.</p>';
    $('#cartFoot').innerHTML = S.cart.length ? '<div class="tot"><span>Sous-total</span><span>' + da(cartSub()) + '</span></div><div class="tot"><span>Livraison</span><span>calculée selon la wilaya</span></div>' +
      '<div class="tot big"><span>Total articles</span><span>' + da(cartSub()) + '</span></div><button class="b gold" type="button" id="toCheckout">Commander — paiement à la livraison</button>' :
      '<button class="b gold" type="button" id="keepShop">Découvrir les parfums</button>';
  }
  $('#cartBtn').onclick = openCart; $('#cartX').onclick = closeCart; $('#scrim').onclick = closeCart;
  $('#cart').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.rm) { S.cart.splice(+b.dataset.rm, 1); renderCart(); renderCartCount(); }
    else if (b.id === 'toCheckout') { closeCart(); openCheckout(); }
    else if (b.id === 'keepShop') closeCart();
  });

  // ---------- Commande ----------
  var F = { name: '', tel: '', w: '', commune: '', mode: 'domicile' };
  function openCheckout() { S.coStep = 'form'; S.filled = false; renderCheckout(); $('#checkout').hidden = false; document.body.style.overflow = 'hidden'; }
  function closeCheckout() { $('#checkout').hidden = true; document.body.style.overflow = ''; }
  function renderCheckout(errors) {
    errors = errors || {};
    var box = $('#checkout');
    if (S.coStep === 'done') {
      var o = S.lastOrder;
      box.innerHTML = '<div class="md co" role="dialog" aria-modal="true"><div class="ok"><div class="ck"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></div>' +
        '<h2 class="serif">Merci ' + esc(o.name.split(' ')[0]) + ' !</h2><p class="sub">Commande n° ' + o.id + ' bien reçue · ' + da(orderTotal(o)) + '<br>Nous vous appelons au ' + esc(o.tel) + ' pour la confirmer, puis le colis part.</p>' +
        '<button class="b gold" type="button" id="coClose" style="width:100%">Continuer mes achats</button></div></div>';
      return;
    }
    var ship = F.w ? fee(F.w, F.mode) : 0;
    box.innerHTML = '<div class="md co" role="dialog" aria-modal="true" aria-label="Finaliser la commande"><button class="mx" type="button" data-x aria-label="Fermer">✕</button>' +
      '<h2 class="serif">Finaliser la commande</h2><p class="sub">Pas de compte à créer, pas de carte bancaire : vous payez au livreur.</p>' +
      '<button type="button" class="testfill" id="testFill">⚡ Remplir avec les infos de test</button>' +
      '<form id="coForm" novalidate>' +
      fld('name', 'Nom et prénom', '<input id="f-name" name="name" autocomplete="name" value="' + esc(F.name) + '" placeholder="Ex. Amine Benali">', errors) +
      fld('tel', 'Téléphone', '<input id="f-tel" name="tel" type="tel" inputmode="tel" autocomplete="tel" value="' + esc(F.tel) + '" placeholder="05 / 06 / 07 …">', errors) +
      '<div class="two">' + fld('w', 'Wilaya', '<select id="f-w" name="w"><option value="">Choisir…</option>' + WILAYAS.map(function (n, i) { return '<option value="' + (i + 1) + '"' + (+F.w === i + 1 ? ' selected' : '') + '>' + wname(i + 1) + '</option>'; }).join('') + '</select>', errors) +
      fld('commune', 'Commune', '<input id="f-commune" name="commune" value="' + esc(F.commune) + '" placeholder="Ex. Ouled Yaïch">', errors) + '</div>' +
      '<div class="modes"><label class="mode"><input type="radio" name="mode" value="domicile"' + (F.mode === 'domicile' ? ' checked' : '') + '><span><b>À domicile</b><small>' + (F.w ? da(fee(F.w, 'domicile')) : 'selon wilaya') + '</small></span></label>' +
      '<label class="mode"><input type="radio" name="mode" value="relais"' + (F.mode === 'relais' ? ' checked' : '') + '><span><b>Point relais</b><small>' + (F.w ? da(fee(F.w, 'relais')) : 'moins cher') + '</small></span></label></div>' +
      '<div class="sum"><div class="tot"><span>' + cartQty() + ' article' + (cartQty() > 1 ? 's' : '') + '</span><span>' + da(cartSub()) + '</span></div><div class="tot"><span>Livraison</span><span>' + (F.w ? da(ship) : '—') + '</span></div><div class="tot big" style="margin-bottom:0"><span>À payer au livreur</span><span>' + da(cartSub() + ship) + '</span></div></div>' +
      '<button class="b gold" type="submit" id="confirmBtn" style="width:100%">Confirmer la commande</button></form></div>';
  }
  function fld(k, label, input, errors) { return '<div class="fld"><label for="f-' + k + '">' + label + '</label>' + input + (errors[k] ? '<span class="err">' + errors[k] + '</span>' : '') + '</div>'; }
  function readForm() {
    var f = $('#coForm'); if (!f) return;
    F.name = f.name.value.trim(); F.tel = f.tel.value.trim(); F.w = f.w.value; F.commune = f.commune.value.trim();
    var m = f.querySelector('input[name=mode]:checked'); F.mode = m ? m.value : 'domicile';
  }
  function fillTest() { F.name = 'Amine Benali'; F.tel = '0555 12 34 56'; F.w = '9'; F.commune = 'Ouled Yaïch'; F.mode = 'domicile'; S.filled = true; renderCheckout(); }
  $('#checkout').addEventListener('click', function (e) {
    if (e.target === $('#checkout') || e.target.closest('[data-x]')) return closeCheckout();
    if (e.target.id === 'testFill') fillTest();
    else if (e.target.id === 'coClose') closeCheckout();
  });
  $('#checkout').addEventListener('change', function (e) { if (e.target.name === 'w' || e.target.name === 'mode') { readForm(); renderCheckout(); } });
  $('#checkout').addEventListener('submit', function (e) { e.preventDefault(); submitOrder(); });
  function submitOrder() {
    readForm();
    var er = {};
    if (F.name.length < 3) er.name = 'Indiquez votre nom.';
    if (!/^0[5-7]\d{8}$/.test(F.tel.replace(/\s/g, ''))) er.tel = 'Numéro mobile algérien à 10 chiffres.';
    if (!F.w) er.w = 'Choisissez votre wilaya.';
    if (!F.commune) er.commune = 'Indiquez votre commune.';
    if (Object.keys(er).length) return renderCheckout(er);
    var o = { id: nextOid++, name: F.name, tel: F.tel, w: +F.w, commune: F.commune, mode: F.mode, items: S.cart.map(function (c) { return { pid: c.pid, ml: c.ml, q: c.q, price: c.price }; }), ship: fee(F.w, F.mode), st: 'nouvelle', ago: 'à l’instant', fresh: true };
    o.items.forEach(function (it) { var p = prod(it.pid); if (p) p.v.forEach(function (v) { if (v[0] === it.ml) v[2] = Math.max(0, v[2] - it.q); }); });
    orders.push(o); S.lastOrder = o; S.cart = []; S.coStep = 'done';
    renderCheckout(); renderShop();
    setTimeout(function () { notify(o); }, 1400);
  }

  // ---------- Notification ----------
  function notify(o) {
    var n = $('#notif');
    n.innerHTML = '<span class="ic">Y</span><span><span class="t">Yasmine · Nouvelle commande <span>maintenant</span></span><span class="m">#' + o.id + ' — ' + esc(o.name) + ', ' + esc(WILAYAS[o.w - 1]) + ' · ' + o.items.reduce(function (a, i) { return a + i.q; }, 0) + ' article(s) · <b>' + da(orderTotal(o)) + '</b></span></span>';
    n.classList.add('on'); S.notified = o.id;
  }
  $('#notif').onclick = function () { $('#notif').classList.remove('on'); closeCheckout(); S.hot = S.notified; S.tab = 'orders'; go('admin'); };

  // ---------- Vues ----------
  function go(v) {
    S.view = v; $('#shop').hidden = v !== 'shop'; $('#admin').hidden = v !== 'admin';
    $('#sw').textContent = v === 'shop' ? 'Voir l’admin' : 'Voir la boutique';
    closeCart(); closeProduct(); $('#checkout').hidden = true; document.body.style.overflow = '';
    if (v === 'admin') renderAdmin(); else renderShop();
    window.scrollTo(0, 0);
  }
  $('#sw').onclick = function () { go(S.view === 'shop' ? 'admin' : 'shop'); };
  $('#backShop').onclick = function () { go('shop'); };

  // ---------- Administration ----------
  function renderAdmin() {
    $$('.tab').forEach(function (t) { t.classList.toggle('on', t.dataset.tab === S.tab); t.setAttribute('aria-selected', t.dataset.tab === S.tab); });
    var nn = orders.filter(function (o) { return o.st === 'nouvelle'; }).length;
    $('#newCount').hidden = !nn; $('#newCount').textContent = nn;
    if (S.tab === 'orders') renderOrders(); else if (S.tab === 'products') renderProducts(); else renderStats();
  }
  $('.tabs').addEventListener('click', function (e) { var t = e.target.closest('.tab'); if (t) { S.tab = t.dataset.tab; renderAdmin(); } });

  function countSt(s) { return orders.filter(function (o) { return o.st === s; }).length; }
  function renderOrders() {
    var k = [['nouvelle', 'Nouvelles', '#2563eb'], ['appelee', 'Appelées', '#d97706'], ['confirmee', 'Confirmées', '#7e22ce'], ['livree', 'Livrées', '#16a34a']];
    var list = orders.slice().reverse();
    $('#pane').innerHTML = '<div class="kpis" id="okpis">' + k.map(function (x) { return '<div class="kpi"><small><i style="background:' + x[2] + '"></i>' + x[1] + '</small><b data-k="' + x[0] + '">' + countSt(x[0]) + '</b></div>'; }).join('') + '</div>' +
      '<div class="bar2"><h2>Commandes</h2><button class="b sec sm" type="button" id="csv">⤓ Exporter (Excel / CSV)</button></div>' +
      list.map(function (o) {
        var nx = NEXT[o.st];
        return '<div class="ord' + (o.id === S.hot ? ' hot' : '') + '" data-o="' + o.id + '">' +
          '<div class="who"><b>' + esc(o.name) + '</b><a href="tel:' + esc(o.tel.replace(/\s/g, '')) + '">' + esc(o.tel) + '</a><small>#' + o.id + ' · ' + esc(o.ago) + '</small></div>' +
          '<div class="what">' + o.items.map(function (it) { var p = prod(it.pid); return '<b>' + esc(p ? p.n : 'Produit') + '</b> ' + it.ml + ' ml × ' + it.q; }).join('<br>') + '<br>' + esc(wname(o.w)) + ' — ' + esc(o.commune) + ' · ' + (o.mode === 'relais' ? 'point relais' : 'à domicile') + '</div>' +
          '<div class="amt">' + da(orderTotal(o)) + '</div>' +
          '<div class="acts"><span class="pill s-' + o.st + '"><i></i>' + ST[o.st] + '</span>' +
          (nx ? '<button class="b pri sm" type="button" data-adv="' + o.id + '">' + nx[1] + '</button>' : '') +
          (o.st !== 'livree' && o.st !== 'annulee' ? '<button class="b sec sm" type="button" data-cancel="' + o.id + '" aria-label="Annuler la commande ' + o.id + '">Annuler</button>' : '') + '</div></div>';
      }).join('');
  }
  $('#pane').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.adv) { var o = orders.filter(function (x) { return x.id === +b.dataset.adv; })[0]; o.st = NEXT[o.st][0]; o.touched = true; renderAdmin(); var kb = $('#okpis [data-k="' + o.st + '"]'); if (kb) { kb.classList.add('flash'); setTimeout(function () { kb.classList.remove('flash'); }, 900); } toast('Commande #' + o.id + ' : ' + ST[o.st]); }
    else if (b.dataset.cancel) { var c = orders.filter(function (x) { return x.id === +b.dataset.cancel; })[0]; c.st = 'annulee'; renderAdmin(); toast('Commande #' + c.id + ' annulée'); }
    else if (b.id === 'csv') exportCsv();
    else if (b.dataset.edit) openForm(+b.dataset.edit);
    else if (b.dataset.del) { var p = prod(+b.dataset.del); if (confirm('Supprimer « ' + p.n + ' » de la boutique ?')) { P.splice(P.indexOf(p), 1); renderAdmin(); toast('Produit supprimé de la boutique'); } }
    else if (b.id === 'addP') openForm(null);
  });
  function exportCsv() {
    var rows = [['N°', 'Client', 'Téléphone', 'Wilaya', 'Commune', 'Livraison', 'Articles', 'Total (DA)', 'Statut']];
    orders.forEach(function (o) { rows.push([o.id, o.name, o.tel, WILAYAS[o.w - 1], o.commune, o.mode, o.items.map(function (it) { var p = prod(it.pid); return (p ? p.n : '') + ' ' + it.ml + 'ml x' + it.q; }).join(' + '), orderTotal(o), ST[o.st]]); });
    var csv = '﻿' + rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(';'); }).join('\r\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'commandes-yasmine.csv'; document.body.appendChild(a); a.click(); a.remove();
    toast('Fichier des commandes téléchargé');
  }

  function renderProducts() {
    $('#pane').innerHTML = '<div class="bar2"><h2>Produits <span style="color:var(--soft);font-weight:600;font-size:15px">· ' + P.length + ' en ligne</span></h2><button class="b pri sm" type="button" id="addP">+ Ajouter un produit</button></div>' +
      P.map(function (p) {
        return '<div class="prow"><div class="th">' + bottle(p, 0) + '</div><div><b>' + esc(p.n) + '</b><small>' + esc(p.r) + ' · ' + esc(p.f) + '</small><div class="vars">' +
          p.v.map(function (v) { return '<span class="' + (v[2] === 0 ? 'z' : v[2] <= 3 ? 'l' : '') + '">' + v[0] + ' ml · ' + da(v[1]) + ' · ' + (v[2] === 0 ? 'épuisé' : 'stock ' + v[2]) + '</span>'; }).join('') +
          '</div></div><div class="acts"><button class="b sec sm" type="button" data-edit="' + p.id + '">Modifier</button><button class="b sec sm" type="button" data-del="' + p.id + '" aria-label="Supprimer ' + esc(p.n) + '">Supprimer</button></div></div>';
      }).join('');
  }
  var editing = null;
  function openForm(id) {
    editing = id ? prod(id) : null;
    var p = editing || { n: '', r: 'Femme', f: 'Floral', sh: 'rect', c: ['#fbcfe8', '#db2777'], v: [[50, 5900, 10]] };
    function opt(list, cur) { return list.map(function (x) { return '<option' + (x === cur ? ' selected' : '') + '>' + x + '</option>'; }).join(''); }
    $('#aform').innerHTML = '<div class="md af" role="dialog" aria-modal="true" aria-label="' + (editing ? 'Modifier le produit' : 'Nouveau produit') + '"><button class="mx" type="button" data-x aria-label="Fermer">✕</button>' +
      '<h2>' + (editing ? 'Modifier « ' + esc(p.n) + ' »' : 'Nouveau produit') + '</h2><form id="pf">' +
      '<div class="fld"><label for="pf-n">Nom</label><input id="pf-n" name="n" required value="' + esc(p.n) + '" placeholder="Ex. Ambre de Ghardaïa"></div>' +
      '<div class="two"><div class="fld"><label for="pf-r">Rayon</label><select id="pf-r" name="r">' + opt(['Femme', 'Homme', 'Mixte', 'Enfant'], p.r) + '</select></div>' +
      '<div class="fld"><label for="pf-f">Famille</label><select id="pf-f" name="f">' + opt(['Floral', 'Boisé', 'Oriental', 'Frais', 'Musc'], p.f) + '</select></div></div>' +
      (editing ? '' : '<div class="two"><div class="fld"><label for="pf-sh">Flacon</label><select id="pf-sh" name="sh"><option value="rect">Carré</option><option value="round">Rond</option><option value="tall">Élancé</option><option value="roll">Roll-on</option></select></div>' +
        '<div class="fld"><label for="pf-c">Couleur du jus</label><input id="pf-c" name="c" type="color" value="#db2777" style="padding:4px;height:48px"></div></div>') +
      '<div class="vh"><span>Taille</span><span>Prix (DA)</span><span>Stock</span></div>' +
      p.v.map(function (v, i) { return '<div class="vt"><span>' + v[0] + ' ml</span><input type="number" min="0" step="100" name="p' + i + '" value="' + v[1] + '" aria-label="Prix ' + v[0] + ' ml"><input type="number" min="0" name="s' + i + '" value="' + v[2] + '" aria-label="Stock ' + v[0] + ' ml"></div>'; }).join('') +
      '<button class="b pri" type="submit" style="width:100%;margin-top:14px">' + (editing ? 'Enregistrer' : 'Mettre en ligne') + '</button></form></div>';
    $('#aform').hidden = false;
    setTimeout(function () { var i = $('#pf-n'); if (i) i.focus(); }, 50);
  }
  $('#aform').addEventListener('click', function (e) { if (e.target === $('#aform') || e.target.closest('[data-x]')) $('#aform').hidden = true; });
  $('#aform').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, name = f.n.value.trim(); if (!name) { f.n.focus(); return; }
    if (editing) {
      editing.n = name; editing.r = f.r.value; editing.f = f.f.value;
      editing.v.forEach(function (v, i) { v[1] = Math.max(0, +f['p' + i].value || 0); v[2] = Math.max(0, +f['s' + i].value || 0); });
      toast('Modifications en ligne sur la boutique');
    } else {
      var col = f.c.value;
      P.unshift({ id: nextPid++, n: name, r: f.r.value, f: f.f.value, sh: f.sh.value, c: [shade(col, 60), col], cap: '#1c1712', bg: shade(col, 85), nw: 1, notes: [f.f.value], d: 'Nouvelle référence ajoutée depuis l’administration.', v: [[50, Math.max(0, +f.p0.value || 0), Math.max(0, +f.s0.value || 0)]] });
      toast('« ' + name + ' » est en ligne');
    }
    $('#aform').hidden = true; renderAdmin();
  });
  function shade(hex, pct) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function m(c) { return Math.round(c + (255 - c) * pct / 100); }
    return '#' + [m(r), m(g), m(b)].map(function (c) { return c.toString(16).padStart(2, '0'); }).join('');
  }

  function renderStats() {
    var base = [21, 27, 24, 33, 29, 38]; var fresh = orders.filter(function (o) { return o.fresh; });
    var today = 25 + fresh.length; var days = base.concat([today]);
    var nOrders = days.reduce(function (a, b) { return a + b; }, 0);
    var ca = 1824000 + fresh.reduce(function (a, o) { return a + orderTotal(o); }, 0);
    var inprog = 14 + orders.filter(function (o) { return ['nouvelle', 'appelee', 'confirmee'].indexOf(o.st) >= 0; }).length;
    var labels = ['Mer', 'Jeu', 'Ven', 'Sam', 'Dim', 'Lun', 'Auj.'];
    var max = Math.max.apply(null, days), W = 560, H = 190;
    var bars = days.map(function (v, i) { var h = Math.round(v / max * (H - 40)), x = 20 + i * 76; return '<rect x="' + x + '" y="' + (H - 22 - h) + '" width="44" height="' + h + '" rx="7" fill="' + (i === 6 ? '#2563eb' : '#bfd2fb') + '"/><text x="' + (x + 22) + '" y="' + (H - 28 - h) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#4b5775">' + v + '</text><text x="' + (x + 22) + '" y="' + (H - 4) + '" text-anchor="middle" font-size="12" fill="#8a96b3">' + labels[i] + '</text>'; }).join('');
    var top = [['Rose de Kabylie', 41], ['Musc blanc', 36], ['Nuit d’Ambre', 28], ['Cèdre de l’Atlas', 22], ['Oud royal', 13]];
    var wil = [['Alger', 46], ['Oran', 27], ['Blida', 21], ['Sétif', 17], ['Constantine', 15]];
    function rank(list) { var m = list[0][1]; return '<div class="rk">' + list.map(function (x) { return '<div><span>' + esc(x[0]) + '</span><span>' + x[1] + '</span><i><u style="width:' + Math.round(x[1] / m * 100) + '%"></u></i></div>'; }).join('') + '</div>'; }
    $('#pane').innerHTML = '<div class="kpis" id="skpis">' +
      kpi('Commandes (7 j)', nOrders, '+18 % vs sem. passée') + kpi('Chiffre d’affaires', da(ca), '+12 %') + kpi('Panier moyen', da(ca / nOrders), '') + kpi('En cours de traitement', inprog, '') + '</div>' +
      '<div class="cards2"><div class="box"><h3>Commandes par jour</h3><svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="Commandes des 7 derniers jours">' + bars + '</svg></div>' +
      '<div class="box"><h3>Meilleures ventes</h3>' + rank(top) + '</div></div>' +
      '<div class="cards2" style="margin-top:14px"><div class="box"><h3>Wilayas qui commandent le plus</h3>' + rank(wil) + '</div>' +
      '<div class="box"><h3>Taux de confirmation</h3><div style="font-size:42px;font-weight:800;letter-spacing:-.04em">82 %</div><p style="margin:6px 0 0;color:var(--muted);font-size:13.5px;line-height:1.55">des commandes passées sont confirmées au téléphone. C’est le chiffre qui dit si vos appels sont faits à temps.</p></div></div>' +
      '<p class="note">Chiffres de démonstration. Chez vous, ils sont calculés sur vos vraies commandes.</p>';
  }
  function kpi(l, v, e) { return '<div class="kpi"><small>' + l + '</small><b>' + v + '</b>' + (e ? '<em>' + e + '</em>' : '') + '</div>'; }

  // ---------- Démarrage ----------
  renderShop();

  // ---------- Visite guidée ----------
  function click(sel) { var x = typeof sel === 'string' ? $(sel) : sel; if (x) x.click(); }
  function firstCard() { return $('#grid .pc'); }
  function freshOrder() { return S.lastOrder && orders.filter(function (o) { return o.id === S.lastOrder.id; })[0]; }
  function ensureShop() { if (S.view !== 'shop') go('shop'); }
  function ensureAdmin() { if (S.view !== 'admin') go('admin'); }
  var tour = Tour.create({
    welcome: { title: 'Bienvenue dans la boutique Yasmine', text: 'Une vraie boutique, pas une capture d’écran. En 3 minutes, vous passez une commande comme un client, puis vous la traitez comme le gérant.' },
    steps: [
      { title: 'Des filtres qui se construisent seuls', text: 'Rayon, famille, contenance : rien n’est écrit à la main. Les filtres sont tirés de votre catalogue. Ajoutez un rayon « Enfant » dans l’admin, il apparaît ici tout seul.', target: '#filters', enter: ensureShop },
      { title: 'Mettez-vous à la place du client', text: 'Un homme cherche un parfum pour lui. Il ne veut voir que ce qui le concerne.', target: '#fRayon', hint: 'Appuyez sur « Homme »', done: function () { return S.rayon === 'Homme'; }, act: function () { ensureShop(); click('#fRayon [data-v="Homme"]'); } },
      { title: 'La boutique s’adapte', text: 'Il ne reste que les parfums homme, et la ligne des contenances s’est ajustée : le 10 ml a disparu, puisqu’aucun parfum homme n’existe dans ce format. Le client ne tombe jamais sur un choix vide.', target: '#grid' },
      { title: 'Ouvrons une fiche', text: 'Chaque parfum a ses photos, ses notes, et ses prix par contenance.', target: firstCard, hint: 'Appuyez sur un parfum', done: function () { return !!S.product; }, act: function () { ensureShop(); click(firstCard()); } },
      { title: 'Les photos d’abord', text: 'Plusieurs vues par produit, avec des vignettes pour passer de l’une à l’autre. Sur téléphone, c’est la photo qui fait vendre — et c’est vous qui les changez depuis l’administration.', target: '#gal' },
      { title: 'Le stock, contenance par contenance', text: 'Ce qui est épuisé est barré et ne se clique pas : personne ne commande ce que vous ne pouvez pas livrer. Quand il en reste peu, le client est prévenu.', target: '#sizes', hint: 'Choisissez une contenance disponible', done: function () { return !!S.size; }, act: function () { var b = $$('#sizes .sz').filter(function (x) { return !x.disabled; })[0]; click(b); } },
      { title: 'Au panier', text: 'Tant qu’aucune contenance n’est choisie, le bouton reste grisé. Une commande incomplète, c’est un appel de plus pour vous.', target: '#addBtn', hint: 'Appuyez sur « Ajouter au panier »', done: function () { return S.cart.length > 0 || !!S.lastOrder; }, act: function () { click('#addBtn'); } },
      { title: 'Le panier', text: 'Le compteur s’est allumé en haut à droite. Pas de compte client, pas de carte bancaire : en Algérie, c’est le paiement à la livraison qui fait acheter.', target: '#cartBtn', hint: 'Ouvrez le panier', done: function () { return $('#cart').classList.contains('on') || !$('#checkout').hidden; }, act: function () { click('#cartBtn'); } },
      { title: 'On passe commande', text: 'Le récapitulatif, et un seul bouton.', target: '#toCheckout', hint: 'Appuyez sur « Commander »', done: function () { return !$('#checkout').hidden; }, act: function () { if (!$('#cart').classList.contains('on')) openCart(); setTimeout(function () { click('#toCheckout'); }, 300); } },
      { title: 'Quatre champs, pas un de plus', text: 'Nom, téléphone, wilaya, commune. Chaque champ en trop fait fuir un client. Les frais de livraison se calculent selon la wilaya et le mode choisi. Pour aller vite, on vous a préparé un client fictif.', target: '#checkout .md', hint: 'Appuyez sur « Remplir avec les infos de test »', done: function () { return S.filled || S.coStep === 'done'; }, act: function () { if ($('#checkout').hidden) openCheckout(); fillTest(); } },
      { title: 'On commande', text: 'C’est exactement ce que vivra votre client : trois écrans, trente secondes.', target: '#confirmBtn', hint: 'Appuyez sur « Confirmer la commande »', done: function () { return S.coStep === 'done'; }, act: function () { if (!S.filled) fillTest(); submitOrder(); } },
      { title: 'Et vous êtes prévenu', text: 'La commande est passée, la notification tombe sur votre téléphone. Où que vous soyez, vous le savez dans la seconde.', target: function () { return $('#notif.on'); }, hint: 'Appuyez sur la notification', done: function () { return S.view === 'admin'; }, act: function () { if (S.notified) click('#notif'); else go('admin'); } },
      { title: 'Votre back-office', text: 'La commande est là, en haut, avec le nom, le téléphone (un appui pour appeler), la wilaya et le parfum. Nouvelle, appelée, confirmée, livrée : un bouton par étape, et les compteurs suivent.', target: function () { return $('.ord.hot') || $('.ord'); }, hint: 'Appuyez sur « Marquer appelée »', enter: function () { ensureAdmin(); if (S.tab !== 'orders') { S.tab = 'orders'; renderAdmin(); } }, done: function () { var o = freshOrder(); return o ? o.st !== 'nouvelle' : orders.some(function (x) { return x.touched; }); }, act: function () { var b = $('.ord.hot [data-adv]') || $('[data-adv]'); click(b); } },
      { title: 'Vos produits', text: 'C’est ici que vous reprenez la main sur le catalogue, sans nous appeler.', target: '[data-tab="products"]', hint: 'Ouvrez l’onglet « Produits »', enter: ensureAdmin, done: function () { return S.view === 'admin' && S.tab === 'products'; }, act: function () { ensureAdmin(); click('[data-tab="products"]'); } },
      { title: 'Vous êtes autonome', text: 'Ajouter un parfum, changer un prix, corriger un stock, retirer une référence : vous le faites vous-même, le soir, depuis votre téléphone. Essayez « Modifier » : la boutique est mise à jour aussitôt.', target: '#pane' },
      { title: 'Et les chiffres', text: 'Le tableau de bord que vous regarderez chaque soir.', target: '[data-tab="stats"]', hint: 'Ouvrez l’onglet « Statistiques »', enter: ensureAdmin, done: function () { return S.view === 'admin' && S.tab === 'stats'; }, act: function () { ensureAdmin(); click('[data-tab="stats"]'); } },
      { title: 'Ce qui compte, en un coup d’œil', text: 'Commandes de la semaine, chiffre d’affaires, panier moyen, ce qui reste à traiter, vos meilleures ventes et vos wilayas. Ici, ils sont inventés ; chez vous, ce sont les vôtres.', target: '#skpis' },
      { title: 'Et tout ce qui tourne en coulisses', text: 'Ce que vous venez d’essayer, c’est la partie visible. Derrière, on branche la boutique sur votre façon de travailler :', target: null,
        list: ['Chaque commande arrive aussi dans un Google Sheets ou un Excel, en direct.', 'Le bon d’expédition se crée chez votre livreur (Yalidine, ZR Express, Maystro…) sans rien ressaisir.', 'Le client reçoit un SMS ou un WhatsApp de confirmation automatiquement.', 'Vos pubs Facebook et TikTok sont mesurées, commande par commande.', 'Vous êtes alerté quand un produit passe sous un seuil de stock.'],
        buttons: '<a class="b pri" href="../../#contact">Je veux ma boutique</a>' }
    ]
  });
  tour.welcome();
})();
