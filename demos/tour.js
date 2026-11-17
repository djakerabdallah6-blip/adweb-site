/* ADweb — moteur de visite guidée (sans dépendance)
   Tour.create({ welcome:{title,text}, steps:[...] })
   Étape : { title, text, list?, target?, hint?, act?, done?, enter?, buttons? }
   - target : sélecteur CSS ou fonction qui renvoie un élément à mettre en lumière
   - done   : fonction -> true quand le visiteur a fait l'action ; la visite avance seule
   - act    : ce que fait « Montrez-moi » à la place du visiteur
*/
(function () {
  'use strict';
  var LOGO = '<span class="lg">AD<i>w</i></span>';
  var HAND = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11V5a2 2 0 0 1 4 0v6"/><path d="M13 10.5V9a2 2 0 0 1 4 0v3"/><path d="M17 11a2 2 0 0 1 4 0v3a7 7 0 0 1-7 7h-1a7 7 0 0 1-5.6-2.8L4 14.5a2 2 0 0 1 3-2.6L9 14"/></svg>';
  var ARR = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function isMobile() { return window.innerWidth <= 640; }

  function create(cfg) {
    var steps = cfg.steps, i = -1, timer = null, raf = 0, active = false, wasDone = false, advancing = false;
    var spot = el('<div class="tspot none" aria-hidden="true"></div>');
    var card = el('<div class="tcard" role="dialog" aria-live="polite" aria-label="Visite guidée"></div>');
    var relaunch = el('<button class="trelaunch" type="button">' + ARR.replace('M9 6l6 6-6 6', 'M4 4v6h6M20 20v-6h-6M20 10A8 8 0 0 0 6 6L4 10M4 14a8 8 0 0 0 14 4l2-4') + 'Relancer la visite</button>');
    spot.hidden = true; card.hidden = true; relaunch.hidden = true;
    document.body.appendChild(spot); document.body.appendChild(card); document.body.appendChild(relaunch);
    relaunch.onclick = function () { start(0); };

    function target(s) {
      if (!s || !s.target) return null;
      var t = typeof s.target === 'function' ? s.target() : document.querySelector(s.target);
      if (!t) return null;
      var r = t.getBoundingClientRect();
      return r.width || r.height ? t : null;
    }

    function place() {
      if (!active) return;
      var s = steps[i], t = target(s);
      if (!t) { spot.className = 'tspot none'; card.classList.remove('left'); return; }
      var r = t.getBoundingClientRect(), p = 6;
      spot.className = 'tspot' + (s.done && !wasDone ? ' pulse' : '');
      spot.style.left = (r.left - p) + 'px'; spot.style.top = (r.top - p) + 'px';
      spot.style.width = (r.width + p * 2) + 'px'; spot.style.height = (r.height + p * 2) + 'px';
      if (!isMobile()) {
        var c = card.getBoundingClientRect();
        var overlapRight = r.right > window.innerWidth - c.width - 40 && r.bottom > window.innerHeight - c.height - 40;
        card.classList.toggle('left', overlapRight && r.left > c.width + 40);
      }
    }
    function loop() { place(); raf = requestAnimationFrame(loop); }

    function reveal(t) {
      if (!t) return;
      var r = t.getBoundingClientRect(), vh = window.innerHeight;
      var bottomLimit = isMobile() ? vh - (card.offsetHeight || 260) - 16 : vh - 24;
      if (r.top < 60 || r.bottom > bottomLimit) {
        t.scrollIntoView({ behavior: 'smooth', block: isMobile() ? 'start' : 'center' });
        if (isMobile()) setTimeout(function () { window.scrollBy({ top: -70, behavior: 'smooth' }); }, 420);
      }
    }

    function render() {
      var s = steps[i], n = steps.length, last = i === n - 1;
      wasDone = !!(s.done && s.done());
      var pg = ''; for (var k = 0; k < n; k++) pg += '<span class="' + (k <= i ? 'd' : '') + '"></span>';
      var list = s.list ? '<ul>' + s.list.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '';
      var hint = s.hint && s.done ? '<div class="hint">' + HAND + '<span>' + (wasDone ? 'C’est fait — on continue.' : s.hint) + '</span></div>' : '';
      var mainBtn;
      if (last) mainBtn = s.buttons || '<button class="b pri" data-t="end" type="button">Terminer</button>';
      else if (s.done && !wasDone) mainBtn = '<button class="b pri" data-t="show" type="button">Montrez-moi ' + ARR + '</button>';
      else mainBtn = '<button class="b pri" data-t="next" type="button">Suivant ' + ARR + '</button>';
      card.innerHTML =
        '<div class="th">' + LOGO + '<div class="pg">' + pg + '</div><button class="x" data-t="end" type="button" aria-label="Fermer la visite">✕</button></div>' +
        '<div class="tb"><div class="st">Étape ' + (i + 1) + ' sur ' + n + '</div><h3>' + s.title + '</h3><p>' + s.text + '</p>' + list + hint + '</div>' +
        '<div class="tf"><button class="b sec" data-t="prev" type="button"' + (i === 0 ? ' disabled' : '') + '>Retour</button>' + mainBtn + '</div>';
      card.classList.remove('done-flash');
    }

    function show(k) {
      i = Math.max(0, Math.min(steps.length - 1, k));
      advancing = false;
      var s = steps[i];
      if (s.enter) { try { s.enter(); } catch (e) { console.error(e); } }
      render();
      setTimeout(function () { reveal(target(s)); }, 60);
      clearInterval(timer);
      timer = setInterval(function () {
        if (!active || advancing) return;
        var st = steps[i];
        if (st.done && !wasDone && st.done()) {
          advancing = true; wasDone = true;
          card.classList.add('done-flash');
          var h = card.querySelector('.hint span'); if (h) h.textContent = 'Bien joué — on continue.';
          setTimeout(function () { if (active) show(i + 1); }, 900);
        }
      }, 250);
    }

    card.addEventListener('click', function (e) {
      var b = e.target.closest('[data-t]'); if (!b) return;
      var t = b.getAttribute('data-t'), s = steps[i];
      if (t === 'next') show(i + 1);
      else if (t === 'prev') show(i - 1);
      else if (t === 'end') stop();
      else if (t === 'show' && s.act) { b.disabled = true; try { s.act(); } catch (er) { console.error(er); } setTimeout(function () { b.disabled = false; }, 1200); }
    });
    document.addEventListener('keydown', function (e) { if (active && e.key === 'Escape') stop(); });

    function start(k) {
      active = true; spot.hidden = false; card.hidden = false; relaunch.hidden = true;
      cancelAnimationFrame(raf); loop(); show(k || 0);
    }
    function stop() {
      active = false; clearInterval(timer); cancelAnimationFrame(raf);
      spot.hidden = true; card.hidden = true; relaunch.hidden = false;
      if (cfg.onEnd) cfg.onEnd();
    }
    function welcome() {
      var w = cfg.welcome || {};
      var box = el('<div class="twel" role="dialog" aria-modal="true" aria-labelledby="twel-t"><div class="bx"><div class="lg">AD<i>w</i></div>' +
        '<h2 id="twel-t">' + (w.title || 'Bienvenue') + '</h2><p>' + (w.text || '') + '</p><div class="row">' +
        '<button class="b pri" type="button" data-w="go">Commencer la visite ' + ARR + '</button>' +
        '<button class="b sec" type="button" data-w="free">Explorer seul</button></div></div></div>');
      document.body.appendChild(box);
      box.querySelector('[data-w="go"]').focus();
      box.addEventListener('click', function (e) {
        var b = e.target.closest('[data-w]'); if (!b) return;
        box.remove();
        if (b.getAttribute('data-w') === 'go') start(0); else relaunch.hidden = false;
      });
    }
    return { start: start, stop: stop, welcome: welcome, get index() { return i; } };
  }

  window.Tour = { create: create };
})();
