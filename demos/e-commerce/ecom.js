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
  // Photos : Unsplash (licence libre, usage commercial autorisé), servies par leur CDN.
  var IMG = {
    dates: ['1629738601425-494c3d6ba3e2', '1614061811858-dde54a522f5e', '1642073537056-20608544f111', '1648288718348-4b6d53755716', '1648178630847-b857b1a6f45d', '1784043436531-a1d56a34dff0'],
    honey: ['1587049352851-8d4e89133924', '1471943311424-646960669fbc', '1642067958024-1a2d9f836920', '1558642452-9d2a7deb7f62', '1654515722385-c684c5331c04'],
    oil: ['1474979266404-7eaacbcd87c5', '1552592074-ea7a91b851b3', '1610547939489-73202bc6afda', '1707827914998-0d56ee13c161'],
    olives: ['1775252498481-e90755fb91f9', '1698775942613-3e9fc114b2a1', '1765814735038-4f9d09fa678b', '1591122523233-22037c1dec9f', '1544475925-9199e8ed85ab'],
    figs: ['1524593313283-1e092f06b2f0', '1670775231064-a27ca2c0178d', '1556216583-cb1ac9559189', '1633972767433-7e31be8575e7'],
    almonds: ['1608797178974-15b35a64ede9', '1508779018996-601e37fa274e', '1631815333332-e3ffb24e2bf8'],
    spices: ['1716816211590-c15a328a5ff0', '1581600140682-d4e68c8cde32', '1771541897176-44a3e01dc484', '1784382265423-d5b445f04405', '1532336414038-cf19250c5757'],
    couscous: ['1686820740904-3cb27426c47d', '1582576163090-09d3b6f8a969', '1541518763669-27fef04b14ea']
  };
  function u(id) { return 'https://images.unsplash.com/photo-' + id; }
  var P = [
    { id: 1, n: 'Deglet Nour de Tolga', r: 'Dattes & fruits secs', o: 'Biskra', im: [IMG.dates[1], IMG.dates[2], IMG.dates[0]], nw: 1, notes: ['Récolte de l’année', 'Triées à la main', 'Sans conservateur'], d: 'La reine des dattes, cueillie dans les palmeraies de Tolga. Chair dorée, translucide et fondante.', v: [['500 g', 650, 20], ['1 kg', 1200, 0], ['5 kg', 5500, 4]] },
    { id: 2, n: 'Miel de jujubier', r: 'Miels', o: 'Djelfa', im: [IMG.honey[0], IMG.honey[3], IMG.honey[2]], notes: ['Miel de sidr', '100 % pur', 'Apiculteur partenaire'], d: 'Un miel ambré et puissant, récolté sur les jujubiers sauvages des hauts plateaux. Le plus recherché.', v: [['250 g', 2200, 3], ['500 g', 4200, 8], ['1 kg', 8000, 0]] },
    { id: 3, n: 'Huile d’olive extra vierge', r: 'Huiles & olives', o: 'Kabylie', im: [IMG.oil[0], IMG.oil[2], IMG.olives[3]], notes: ['Première pression à froid', 'Récolte 2026'], d: 'Une huile verte et fruitée, pressée à froid au moulin du village. Un léger piquant en fin de bouche.', v: [['1 L', 1400, 0], ['5 L', 6500, 7]] },
    { id: 4, n: 'Figues sèches', r: 'Dattes & fruits secs', o: 'Béjaïa', im: [IMG.figs[0], IMG.figs[1], IMG.figs[2]], notes: ['Séchées au soleil', 'Sans sucre ajouté'], d: 'Des figues de Kabylie séchées au soleil, moelleuses et naturellement sucrées.', v: [['500 g', 900, 14], ['1 kg', 1700, 0]] },
    { id: 5, n: 'Miel toutes fleurs', r: 'Miels', o: 'Kabylie', im: [IMG.honey[1], IMG.honey[4], IMG.honey[2]], nw: 1, notes: ['Miel de montagne', 'Non chauffé'], d: 'Un miel doux et floral, récolté au printemps dans les montagnes du Djurdjura.', v: [['500 g', 2500, 15], ['1 kg', 4800, 6]] },
    { id: 6, n: 'Olives vertes cassées', r: 'Huiles & olives', o: 'Kabylie', im: [IMG.olives[0], IMG.olives[2], IMG.olives[1]], notes: ['Recette traditionnelle', 'Saumure maison'], d: 'Olives cassées à la main et marinées à l’ancienne, avec ail et zeste de citron.', v: [['500 g', 450, 25], ['1 kg', 850, 10]] },
    { id: 7, n: 'Ras el hanout maison', r: 'Épicerie', o: 'Ghardaïa', im: [IMG.spices[1], IMG.spices[0], IMG.spices[2]], notes: ['27 épices', 'Moulu à la commande'], d: 'Notre mélange de 27 épices, torréfiées puis moulues pour chaque commande. Pour la chorba et les tajines.', v: [['100 g', 450, 30], ['250 g', 950, 11]] },
    { id: 8, n: 'Amandes décortiquées', r: 'Dattes & fruits secs', o: 'Tlemcen', im: [IMG.almonds[0], IMG.almonds[1], IMG.almonds[2]], notes: ['Calibre extra', 'Non salées'], d: 'Des amandes croquantes, idéales pour les gâteaux traditionnels ou à grignoter.', v: [['250 g', 900, 10], ['500 g', 1700, 2]] },
    { id: 9, n: 'Couscous roulé main', r: 'Épicerie', o: 'Kabylie', im: [IMG.couscous[0], IMG.couscous[1], IMG.couscous[2]], notes: ['Roulé à la main', 'Blé dur local'], d: 'Un couscous fin, roulé à la main et séché à l’air libre, comme à la maison.', v: [['1 kg', 600, 18], ['5 kg', 2800, 5]] },
    { id: 10, n: 'Huile d’olive fruitée', r: 'Huiles & olives', o: 'Tlemcen', im: [IMG.oil[1], IMG.oil[3], IMG.olives[4]], notes: ['Fruité doux', 'Oliviers centenaires'], d: 'Une huile ronde et douce, parfaite pour les salades et la cuisine de tous les jours.', v: [['1 L', 1300, 9], ['5 L', 6000, 3]] },
    { id: 11, n: 'Dattes Ghars', r: 'Dattes & fruits secs', o: 'Biskra', im: [IMG.dates[3], IMG.dates[4], IMG.dates[5]], notes: ['Dattes molles', 'Idéales pour les makrouts'], d: 'Des dattes molles et très sucrées, la base des pâtisseries traditionnelles.', v: [['1 kg', 700, 12], ['5 kg', 3200, 6]] }
  ];
  var nextPid = 12;
  function fmtKey(l) { var m = /([\d.,]+)\s*(g|kg|L)/.exec(l) || [0, 0, 'g']; var n = parseFloat(String(m[1]).replace(',', '.')); return (m[2] === 'kg' ? n * 1000 : m[2] === 'L' ? n * 1000 + 0.5 : n); }

  // ---------- Photos ----------
  function photo(p, i, w) {
    var src = p.im && p.im[i || 0];
    if (!src) return '<div class="ph" role="img" aria-label="' + esc(p.n) + '">' + esc(p.n.charAt(0)) + '</div>';
    var url = src.indexOf('blob:') === 0 || src.indexOf('data:') === 0 ? src : u(src) + '?auto=format&fit=crop&w=' + (w || 700) + '&h=' + (w || 700) + '&q=72';
    return '<img src="' + url + '" alt="' + esc(p.n) + '" loading="lazy" decoding="async">';
  }

  // ---------- État ----------
  var S = { rayon: null, origine: null, ml: null, cart: [], view: 'shop', tab: 'orders', product: null, size: null, qty: 1, img: 0, lastOrder: null, filled: false, coStep: 'form', hot: null };
  var orders = [
    { id: 1037, name: 'Sara Meziane', tel: '0661 23 45 18', w: 16, commune: 'Hydra', mode: 'domicile', items: [{ pid: 1, ml: '500 g', q: 2, price: 650 }, { pid: 5, ml: '500 g', q: 1, price: 2500 }], ship: 400, st: 'livree', ago: '2 j' },
    { id: 1038, name: 'Yacine Boudiaf', tel: '0550 81 02 77', w: 31, commune: 'Bir El Djir', mode: 'relais', items: [{ pid: 3, ml: '5 L', q: 1, price: 6500 }], ship: 400, st: 'livree', ago: '2 j' },
    { id: 1039, name: 'Lina Haddad', tel: '0770 45 66 12', w: 25, commune: 'Ali Mendjeli', mode: 'domicile', items: [{ pid: 2, ml: '500 g', q: 1, price: 4200 }], ship: 650, st: 'confirmee', ago: 'hier' },
    { id: 1040, name: 'Karim Ait Ali', tel: '0558 19 30 44', w: 15, commune: 'Azazga', mode: 'domicile', items: [{ pid: 9, ml: '5 kg', q: 1, price: 2800 }, { pid: 7, ml: '100 g', q: 2, price: 450 }], ship: 650, st: 'confirmee', ago: 'hier' },
    { id: 1041, name: 'Imane Cherif', tel: '0662 70 11 93', w: 19, commune: 'El Eulma', mode: 'relais', items: [{ pid: 5, ml: '1 kg', q: 1, price: 4800 }], ship: 400, st: 'appelee', ago: '3 h' },
    { id: 1042, name: 'Nassim Belkacem', tel: '0771 02 58 36', w: 6, commune: 'Akbou', mode: 'domicile', items: [{ pid: 2, ml: '250 g', q: 2, price: 2200 }, { pid: 4, ml: '500 g', q: 1, price: 900 }], ship: 650, st: 'nouvelle', ago: '40 min' }
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
      return (!S.rayon || p.r === S.rayon) && (!S.origine || p.o === S.origine) &&
        (!S.ml || p.v.some(function (v) { return v[0] === S.ml; }));
    });
  }
  var prevMl = [];
  function renderFilters() {
    var rayons = uniq(P.map(function (p) { return p.r; }));
    var pool = P.filter(function (p) { return !S.rayon || p.r === S.rayon; });
    var familles = uniq(pool.map(function (p) { return p.o; }));
    if (S.origine && familles.indexOf(S.origine) < 0) S.origine = null;
    var pool2 = pool.filter(function (p) { return !S.origine || p.o === S.origine; });
    var mls = uniq([].concat.apply([], pool2.map(function (p) { return p.v.map(function (v) { return v[0]; }); }))).sort(function (a, b) { return fmtKey(a) - fmtKey(b); });
    if (S.ml && mls.indexOf(S.ml) < 0) S.ml = null;
    function chips(list, key, fmt) {
      return list.map(function (x) {
        var isNew = key === 'ml' && prevMl.length && prevMl.indexOf(x) < 0;
        return '<button type="button" class="chip' + (S[key] === x ? ' on' : '') + (isNew ? ' new' : '') + '" data-k="' + key + '" data-v="' + x + '">' + (fmt ? fmt(x) : esc(x)) + '</button>';
      }).join('');
    }
    $('#filters').innerHTML =
      '<div class="frow" id="fRayon"><span class="lb">Rayon</span>' + chips(rayons, 'rayon') + '</div>' +
      '<div class="frow" id="fFam"><span class="lb">Origine</span>' + chips(familles, 'origine') + '</div>' +
      '<div class="frow" id="fMl"><span class="lb">Format</span>' + chips(mls, 'ml') +
      (S.rayon || S.origine || S.ml ? '<button type="button" class="reset" id="reset">Réinitialiser</button>' : '') + '</div>';
    prevMl = mls;
  }
  function renderGrid() {
    var list = visible();
    $('#count').textContent = list.length + ' produit' + (list.length > 1 ? 's' : '') + ' · livraison 58 wilayas · paiement à la livraison';
    $('#grid').innerHTML = list.length ? list.map(function (p, i) {
      var out = stockOf(p) === 0;
      return '<button type="button" class="pc" data-p="' + p.id + '" style="animation-delay:' + (i * 40) + 'ms">' +
        '<div class="im">' + photo(p, 0, 600) + (p.nw ? '<span class="bd nw">Nouveau</span>' : out ? '<span class="bd">Épuisé</span>' : '') + '</div>' +
        '<div class="tx"><div class="mt">' + esc(p.r) + ' · ' + esc(p.o) + '</div><h3 class="serif">' + esc(p.n) + '</h3>' +
        '<div class="pr"><small>dès</small> ' + da(minPrice(p)) + '</div></div></button>';
    }).join('') : '<div class="empty">Aucun produit ne correspond. <button class="reset" type="button" id="reset2">Tout afficher</button></div>';
  }
  function renderShop() { renderFilters(); renderGrid(); renderCartCount(); }
  $('#filters').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.id === 'reset') { S.rayon = S.origine = S.ml = null; }
    else { var k = b.dataset.k, v = b.dataset.v; S[k] = S[k] === v ? null : v; }
    renderShop();
  });
  $('#grid').addEventListener('click', function (e) {
    if (e.target.id === 'reset2') { S.rayon = S.origine = S.ml = null; renderShop(); return; }
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
      '<div class="gal" id="gal"><div class="main">' + photo(p, S.img, 900) + '</div><div class="thumbs">' +
      [0, 1, 2].map(function (v) { return '<button type="button" class="' + (S.img === v ? 'on' : '') + '" data-img="' + v + '" aria-label="Photo ' + (v + 1) + '">' + photo(p, v, 180) + '</button>'; }).join('') +
      '</div></div><div class="inf"><div class="mt">' + esc(p.r) + ' · ' + esc(p.o) + '</div><h2 class="serif">' + esc(p.n) + '</h2>' +
      '<div class="pr">' + (sel ? '' : '<small style="font-size:14px;color:#9a8b78;font-weight:600">dès </small>') + da(price) + '</div>' +
      '<p>' + esc(p.d) + '</p><div class="notes">' + p.notes.map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('') + '</div>' +
      '<div class="lbl"><span>Format</span>' + (S.size ? '' : '<span style="text-transform:none;letter-spacing:0;font-weight:600">Choisissez un format</span>') + '</div>' +
      '<div class="sizes" id="sizes">' + p.v.map(function (v) {
        return '<button type="button" class="sz' + (S.size === v[0] ? ' on' : '') + '" data-ml="' + v[0] + '"' + (v[2] === 0 ? ' disabled aria-label="' + v[0] + ', épuisé"' : '') + '><b>' + v[0] + '</b><small>' + (v[2] === 0 ? 'Épuisé' : da(v[1])) + '</small></button>';
      }).join('') + '</div><div class="low">' + low + '</div>' +
      '<div class="addrow"><div class="qty"><button type="button" data-q="-1" aria-label="Moins">−</button><span>' + S.qty + '</span><button type="button" data-q="1" aria-label="Plus">+</button></div>' +
      '<button type="button" class="b gold" id="addBtn"' + (S.size ? '' : ' disabled') + '>Ajouter au panier</button></div>' +
      '<div class="perks"><div>🚚 Livraison en 24 à 72 h selon la wilaya</div><div>💵 Vous payez à la réception du colis</div><div>✓ Produit non conforme ? Remplacé sans discussion</div></div>' +
      '</div></div></div>';
  }
  $('#pm').addEventListener('click', function (e) {
    if (e.target === $('#pm') || e.target.closest('[data-x]')) return closeProduct();
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.img) { S.img = +b.dataset.img; renderProduct(); }
    else if (b.dataset.ml) { S.size = b.dataset.ml; S.qty = 1; renderProduct(); }
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
    closeProduct(); renderCartCount(true); toast(p.n + ' (' + S.size + ') ajouté au panier');
  }
  function cartQty() { return S.cart.reduce(function (a, c) { return a + c.q; }, 0); }
  function cartSub() { return S.cart.reduce(function (a, c) { return a + c.q * c.price; }, 0); }
  function renderCartCount(bump) {
    var n = $('#cc'); n.textContent = cartQty(); var nl = $('#ccL'); if (nl) nl.textContent = cartQty();
    if (bump) { n.classList.add('bump'); setTimeout(function () { n.classList.remove('bump'); }, 450); }
  }

  // ---------- Panier ----------
  function openCart() { renderCart(); $('#cart').classList.add('on'); $('#cart').setAttribute('aria-hidden', 'false'); $('#scrim').classList.add('on'); }
  function closeCart() { $('#cart').classList.remove('on'); $('#cart').setAttribute('aria-hidden', 'true'); $('#scrim').classList.remove('on'); }
  function renderCart() {
    $('#cartItems').innerHTML = S.cart.length ? S.cart.map(function (c, i) {
      var p = prod(c.pid) || { n: 'Produit retiré', im: [] };
      return '<div class="it"><div class="th">' + photo(p, 0, 200) + '</div><div><h4 class="serif">' + esc(p.n) + '</h4><div class="s">' + c.ml + ' · quantité ' + c.q + '</div><button class="rm" type="button" data-rm="' + i + '">Retirer</button></div><div class="p">' + da(c.price * c.q) + '</div></div>';
    }).join('') : '<p style="color:#7a6c5c;padding:30px 0;text-align:center">Votre panier est vide.</p>';
    $('#cartFoot').innerHTML = S.cart.length ? '<div class="tot"><span>Sous-total</span><span>' + da(cartSub()) + '</span></div><div class="tot"><span>Livraison</span><span>calculée selon la wilaya</span></div>' +
      '<div class="tot big"><span>Total articles</span><span>' + da(cartSub()) + '</span></div><button class="b gold" type="button" id="toCheckout">Commander — paiement à la livraison</button>' :
      '<button class="b gold" type="button" id="keepShop">Découvrir les produits</button>';
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
    n.innerHTML = '<span class="ic">DN</span><span><span class="t">Dar Nour · Nouvelle commande <span>maintenant</span></span><span class="m">#' + o.id + ' — ' + esc(o.name) + ', ' + esc(WILAYAS[o.w - 1]) + ' · ' + o.items.reduce(function (a, i) { return a + i.q; }, 0) + ' article(s) · <b>' + da(orderTotal(o)) + '</b></span></span>';
    n.classList.add('on'); S.notified = o.id;
  }
  $('#notif').onclick = function () { $('#notif').classList.remove('on'); closeCheckout(); S.hot = S.notified; S.tab = 'orders'; go('admin'); };

  // ---------- Vues ----------
  function go(v) {
    S.view = v; $('#shop').hidden = v !== 'shop'; $('#admin').hidden = v !== 'admin';
    $('#sw').textContent = v === 'shop' ? 'Voir l’admin' : 'Voir la boutique';
    closeCart(); closeProduct(); $('#checkout').hidden = true; document.body.style.overflow = '';
    var hv = $('.hvid'); if (v === 'admin' && hv) hv.pause();
    if (v === 'shop' && window.DN) DN.setPage('catalog');
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
          '<div class="what">' + o.items.map(function (it) { var p = prod(it.pid); return '<b>' + esc(p ? p.n : 'Produit') + '</b> ' + it.ml + ' × ' + it.q; }).join('<br>') + '<br>' + esc(wname(o.w)) + ' — ' + esc(o.commune) + ' · ' + (o.mode === 'relais' ? 'point relais' : 'à domicile') + '</div>' +
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
    orders.forEach(function (o) { rows.push([o.id, o.name, o.tel, WILAYAS[o.w - 1], o.commune, o.mode, o.items.map(function (it) { var p = prod(it.pid); return (p ? p.n : '') + ' ' + it.ml + ' x' + it.q; }).join(' + '), orderTotal(o), ST[o.st]]); });
    var csv = '﻿' + rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(';'); }).join('\r\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'commandes-dar-nour.csv'; document.body.appendChild(a); a.click(); a.remove();
    toast('Fichier des commandes téléchargé');
  }

  function renderProducts() {
    $('#pane').innerHTML = '<div class="bar2"><h2>Produits <span style="color:var(--soft);font-weight:600;font-size:15px">· ' + P.length + ' en ligne</span></h2><button class="b pri sm" type="button" id="addP">+ Ajouter un produit</button></div>' +
      P.map(function (p) {
        return '<div class="prow"><div class="th">' + photo(p, 0, 160) + '</div><div><b>' + esc(p.n) + '</b><small>' + esc(p.r) + ' · ' + esc(p.o) + '</small><div class="vars">' +
          p.v.map(function (v) { return '<span class="' + (v[2] === 0 ? 'z' : v[2] <= 3 ? 'l' : '') + '">' + v[0] + ' · ' + da(v[1]) + ' · ' + (v[2] === 0 ? 'épuisé' : 'stock ' + v[2]) + '</span>'; }).join('') +
          '</div></div><div class="acts"><button class="b sec sm" type="button" data-edit="' + p.id + '">Modifier</button><button class="b sec sm" type="button" data-del="' + p.id + '" aria-label="Supprimer ' + esc(p.n) + '">Supprimer</button></div></div>';
      }).join('');
  }
  var editing = null, upImg = null;
  var RAYONS = ['Dattes & fruits secs', 'Miels', 'Huiles & olives', 'Épicerie'];
  function openForm(id) {
    editing = id ? prod(id) : null; upImg = null;
    var p = editing || { n: '', r: 'Miels', o: '', im: [], v: [['500 g', 1500, 10]] };
    function opt(list, cur) { return list.map(function (x) { return '<option' + (x === cur ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join(''); }
    $('#aform').innerHTML = '<div class="md af" role="dialog" aria-modal="true" aria-label="' + (editing ? 'Modifier le produit' : 'Nouveau produit') + '"><button class="mx" type="button" data-x aria-label="Fermer">✕</button>' +
      '<h2>' + (editing ? 'Modifier « ' + esc(p.n) + ' »' : 'Nouveau produit') + '</h2><form id="pf">' +
      '<div class="upl"><div class="upv" id="upv">' + photo(p, 0, 200) + '</div><div><label class="b sec sm" for="pf-img" style="cursor:pointer">' + (p.im.length ? 'Changer la photo' : 'Ajouter une photo') + '</label><input id="pf-img" name="img" type="file" accept="image/*" hidden><small>Prise avec votre téléphone, elle est en ligne aussitôt.</small></div></div>' +
      '<div class="fld"><label for="pf-n">Nom</label><input id="pf-n" name="n" required value="' + esc(p.n) + '" placeholder="Ex. Miel de thym"></div>' +
      '<div class="two"><div class="fld"><label for="pf-r">Rayon</label><select id="pf-r" name="r">' + opt(RAYONS, p.r) + '</select></div>' +
      '<div class="fld"><label for="pf-o">Origine</label><input id="pf-o" name="o" value="' + esc(p.o) + '" placeholder="Ex. Tizi Ouzou"></div></div>' +
      '<div class="vh"><span>Format</span><span>Prix (DA)</span><span>Stock</span></div>' +
      p.v.map(function (v, i) { return '<div class="vt">' + (editing ? '<span>' + esc(v[0]) + '</span>' : '<input name="f' + i + '" value="' + esc(v[0]) + '" aria-label="Format">') + '<input type="number" min="0" step="50" name="p' + i + '" value="' + v[1] + '" aria-label="Prix ' + esc(v[0]) + '"><input type="number" min="0" name="s' + i + '" value="' + v[2] + '" aria-label="Stock ' + esc(v[0]) + '"></div>'; }).join('') +
      '<button class="b pri" type="submit" style="width:100%;margin-top:14px">' + (editing ? 'Enregistrer' : 'Mettre en ligne') + '</button></form></div>';
    $('#aform').hidden = false;
    setTimeout(function () { var i = $('#pf-n'); if (i) i.focus(); }, 50);
  }
  $('#aform').addEventListener('click', function (e) { if (e.target === $('#aform') || e.target.closest('[data-x]')) $('#aform').hidden = true; });
  $('#aform').addEventListener('change', function (e) {
    if (e.target.id !== 'pf-img' || !e.target.files[0]) return;
    upImg = URL.createObjectURL(e.target.files[0]);
    $('#upv').innerHTML = '<img src="' + upImg + '" alt="Aperçu">';
  });
  $('#aform').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, name = f.n.value.trim(); if (!name) { f.n.focus(); return; }
    if (editing) {
      editing.n = name; editing.r = f.r.value; editing.o = f.o.value.trim() || editing.o;
      editing.v.forEach(function (v, i) { v[1] = Math.max(0, +f['p' + i].value || 0); v[2] = Math.max(0, +f['s' + i].value || 0); });
      if (upImg) editing.im = [upImg].concat(editing.im.slice(0, 2));
      toast('Modifications en ligne sur la boutique');
    } else {
      P.unshift({ id: nextPid++, n: name, r: f.r.value, o: f.o.value.trim() || 'Algérie', im: upImg ? [upImg] : [], nw: 1, notes: ['Nouveauté'], d: 'Nouvelle référence ajoutée depuis l’administration.', v: [[f.f0.value.trim() || '1 kg', Math.max(0, +f.p0.value || 0), Math.max(0, +f.s0.value || 0)]] });
      toast('« ' + name + ' » est en ligne');
    }
    $('#aform').hidden = true; renderAdmin();
  });

  function renderStats() {
    var base = [21, 27, 24, 33, 29, 38]; var fresh = orders.filter(function (o) { return o.fresh; });
    var today = 25 + fresh.length; var days = base.concat([today]);
    var nOrders = days.reduce(function (a, b) { return a + b; }, 0);
    var ca = 812000 + fresh.reduce(function (a, o) { return a + orderTotal(o); }, 0);
    var inprog = 14 + orders.filter(function (o) { return ['nouvelle', 'appelee', 'confirmee'].indexOf(o.st) >= 0; }).length;
    var labels = ['Mer', 'Jeu', 'Ven', 'Sam', 'Dim', 'Lun', 'Auj.'];
    var max = Math.max.apply(null, days), W = 560, H = 190;
    var bars = days.map(function (v, i) { var h = Math.round(v / max * (H - 40)), x = 20 + i * 76; return '<rect x="' + x + '" y="' + (H - 22 - h) + '" width="44" height="' + h + '" rx="7" fill="' + (i === 6 ? '#2563eb' : '#bfd2fb') + '"/><text x="' + (x + 22) + '" y="' + (H - 28 - h) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#4b5775">' + v + '</text><text x="' + (x + 22) + '" y="' + (H - 4) + '" text-anchor="middle" font-size="12" fill="#8a96b3">' + labels[i] + '</text>'; }).join('');
    var top = [['Deglet Nour de Tolga', 64], ['Miel de jujubier', 41], ['Huile d’olive extra vierge', 37], ['Ras el hanout maison', 25], ['Couscous roulé main', 19]];
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
  function ensureShop() { if (S.view !== 'shop') go('shop'); if (window.DN && DN.page() !== 'catalog') DN.setPage('catalog'); }
  function ensureAdmin() { if (S.view !== 'admin') go('admin'); }
  var tour = Tour.create({
    welcome: { title: 'Bienvenue chez Dar Nour', text: 'Une vraie boutique, pas une capture d’écran. En 3 minutes, vous passez une commande comme un client, puis vous la traitez comme le gérant.' },
    steps: [
      { title: 'La première impression', text: 'Plein écran, une vidéo qui pose l’ambiance, et le menu intégré dedans. Le visiteur comprend en une seconde ce que vous vendez et d’où ça vient. Les produits ont leur propre page : on y entre comme dans une boutique.', target: '#ctaDiscover', hint: 'Appuyez sur « Découvrir les produits »', enter: function () { if (S.view !== 'shop') go('shop'); if (window.DN && DN.page() !== 'landing') DN.setPage('landing'); }, done: function () { return window.DN && DN.page() === 'catalog' && !DN.busy(); }, act: function () { DN.goto('catalog'); } },
      { title: 'Des filtres qui se construisent seuls', text: 'Rayon, origine, format : rien n’est écrit à la main. Les filtres sont tirés de votre catalogue. Ajoutez un produit de Tlemcen dans l’admin, l’origine « Tlemcen » apparaît ici toute seule.', target: '#filters', enter: ensureShop },
      { title: 'Mettez-vous à la place du client', text: 'Une cliente cherche du miel pur pour sa famille. Elle ne veut voir que ce qui la concerne.', target: '#fRayon', hint: 'Appuyez sur « Miels »', done: function () { return S.rayon === 'Miels'; }, act: function () { ensureShop(); click('#fRayon [data-v="Miels"]'); } },
      { title: 'La boutique s’adapte', text: 'Il ne reste que les miels, et les autres filtres se sont ajustés : les origines et les formats proposés sont ceux des miels, plus de « 5 L » qui traîne. Le client ne tombe jamais sur un choix vide.', target: '#grid' },
      { title: 'Ouvrons une fiche', text: 'Chaque produit a ses photos, son origine, et ses prix par format.', target: firstCard, hint: 'Appuyez sur un produit', done: function () { return !!S.product; }, act: function () { ensureShop(); click(firstCard()); } },
      { title: 'Les photos d’abord', text: 'Plusieurs photos par produit, avec des vignettes pour passer de l’une à l’autre. Sur téléphone, c’est la photo qui fait vendre — et vous les ajoutez vous-même depuis l’administration, en prenant la photo avec votre téléphone.', target: '#gal' },
      { title: 'Le stock, format par format', text: 'Ce qui est épuisé est barré et ne se clique pas : personne ne commande ce que vous ne pouvez pas livrer. Quand il en reste peu, le client est prévenu.', target: '#sizes', hint: 'Choisissez un format disponible', done: function () { return !!S.size; }, act: function () { var b = $$('#sizes .sz').filter(function (x) { return !x.disabled; })[0]; click(b); } },
      { title: 'Au panier', text: 'Tant qu’aucun format n’est choisi, le bouton reste grisé. Une commande incomplète, c’est un appel de plus pour vous.', target: '#addBtn', hint: 'Appuyez sur « Ajouter au panier »', done: function () { return S.cart.length > 0 || !!S.lastOrder; }, act: function () { click('#addBtn'); } },
      { title: 'Le panier', text: 'Le compteur s’est allumé en haut à droite. Pas de compte client, pas de carte bancaire : en Algérie, c’est le paiement à la livraison qui fait acheter.', target: '#cartBtn', hint: 'Ouvrez le panier', done: function () { return $('#cart').classList.contains('on') || !$('#checkout').hidden; }, act: function () { click('#cartBtn'); } },
      { title: 'On passe commande', text: 'Le récapitulatif, et un seul bouton.', target: '#toCheckout', hint: 'Appuyez sur « Commander »', done: function () { return !$('#checkout').hidden; }, act: function () { if (!$('#cart').classList.contains('on')) openCart(); setTimeout(function () { click('#toCheckout'); }, 300); } },
      { title: 'Quatre champs, pas un de plus', text: 'Nom, téléphone, wilaya, commune. Chaque champ en trop fait fuir un client. Les frais de livraison se calculent selon la wilaya et le mode choisi. Pour aller vite, on vous a préparé un client fictif.', target: '#checkout .md', hint: 'Appuyez sur « Remplir avec les infos de test »', done: function () { return S.filled || S.coStep === 'done'; }, act: function () { if ($('#checkout').hidden) openCheckout(); fillTest(); } },
      { title: 'On commande', text: 'C’est exactement ce que vivra votre client : trois écrans, trente secondes.', target: '#confirmBtn', hint: 'Appuyez sur « Confirmer la commande »', done: function () { return S.coStep === 'done'; }, act: function () { if (!S.filled) fillTest(); submitOrder(); } },
      { title: 'Et vous êtes prévenu', text: 'La commande est passée, la notification tombe sur votre téléphone. Où que vous soyez, vous le savez dans la seconde.', target: function () { return $('#notif.on'); }, hint: 'Appuyez sur la notification', done: function () { return S.view === 'admin'; }, act: function () { if (S.notified) click('#notif'); else go('admin'); } },
      { title: 'Votre back-office', text: 'La commande est là, en haut, avec le nom, le téléphone (un appui pour appeler), la wilaya et le produit. Nouvelle, appelée, confirmée, livrée : un bouton par étape, et les compteurs suivent.', target: function () { return $('.ord.hot') || $('.ord'); }, hint: 'Appuyez sur « Marquer appelée »', enter: function () { ensureAdmin(); if (S.tab !== 'orders') { S.tab = 'orders'; renderAdmin(); } }, done: function () { var o = freshOrder(); return o ? o.st !== 'nouvelle' : orders.some(function (x) { return x.touched; }); }, act: function () { var b = $('.ord.hot [data-adv]') || $('[data-adv]'); click(b); } },
      { title: 'Vos produits', text: 'C’est ici que vous reprenez la main sur le catalogue, sans nous appeler.', target: '[data-tab="products"]', hint: 'Ouvrez l’onglet « Produits »', enter: ensureAdmin, done: function () { return S.view === 'admin' && S.tab === 'products'; }, act: function () { ensureAdmin(); click('[data-tab="products"]'); } },
      { title: 'Vous êtes autonome', text: 'Ajouter un produit avec sa photo, changer un prix, corriger un stock, retirer une référence : vous le faites vous-même, le soir, depuis votre téléphone. Essayez « Modifier » : la boutique est mise à jour aussitôt.', target: '#pane' },
      { title: 'Et les chiffres', text: 'Le tableau de bord que vous regarderez chaque soir.', target: '[data-tab="stats"]', hint: 'Ouvrez l’onglet « Statistiques »', enter: ensureAdmin, done: function () { return S.view === 'admin' && S.tab === 'stats'; }, act: function () { ensureAdmin(); click('[data-tab="stats"]'); } },
      { title: 'Ce qui compte, en un coup d’œil', text: 'Commandes de la semaine, chiffre d’affaires, panier moyen, ce qui reste à traiter, vos meilleures ventes et vos wilayas. Ici, ils sont inventés ; chez vous, ce sont les vôtres.', target: '#skpis' },
      { title: 'Et tout ce qui tourne en coulisses', text: 'Ce que vous venez d’essayer, c’est la partie visible. Derrière, on branche la boutique sur votre façon de travailler :', target: null,
        list: ['Chaque commande arrive aussi dans un Google Sheets ou un Excel, en direct.', 'Le bon d’expédition se crée chez votre livreur (Yalidine, ZR Express, Maystro…) sans rien ressaisir.', 'Le client reçoit un SMS ou un WhatsApp de confirmation automatiquement.', 'Vos pubs Facebook et TikTok sont mesurées, commande par commande.', 'Vous êtes alerté quand un produit passe sous un seuil de stock.'],
        buttons: '<a class="b pri" href="../../#contact">Je veux ma boutique</a>' }
    ]
  });
  tour.welcome();
})();
