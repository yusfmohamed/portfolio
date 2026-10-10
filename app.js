/* Youssef Mohamed — portfolio. One script: router, menu, theme, filter, lightbox.
   Replaces BOTH old app.js and theme.js. */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var views = {};
  Array.prototype.forEach.call(document.querySelectorAll('.view'), function (v) { views[v.id.slice(5)] = v; });

  var menu = document.getElementById('menu');
  var menuBtn = document.getElementById('menu-btn');
  var first = true;

  /* ───── theme ───── */
  var themeBtn = document.getElementById('theme');
  function setTheme(t, persist) {
    root.setAttribute('data-theme', t);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', t === 'dark' ? '#0e0e0e' : '#ececec');
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    if (persist) { try { localStorage.setItem('ym-theme', t); } catch (e) {} }
  }
  setTheme(root.getAttribute('data-theme') || 'light', false);
  themeBtn.addEventListener('click', function () {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });

  /* ───── menu (phones) ───── */
  function setMenu(open) {
    menu.hidden = !open;
    body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
  document.getElementById('menu-close').addEventListener('click', function () { setMenu(false); });

  /* ───── typing animation for the hero role ───── */
  var tws = document.querySelectorAll('.tw');
  var typeRun = 0;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function startTyping() {
    if (reduce || !tws.length) return;
    var run = ++typeRun;
    var line = 0;
    Array.prototype.forEach.call(tws, function (el) { el.textContent = ''; el.classList.remove('typing'); });

    function nextLine() {
      if (run !== typeRun || line >= tws.length) return;
      var el = tws[line];
      var text = el.getAttribute('data-text');
      var n = 0;
      el.classList.add('typing');
      (function tick() {
        if (run !== typeRun) return;
        n += 1;
        el.textContent = text.slice(0, n);
        if (n < text.length) { setTimeout(tick, 75); return; }
        if (line < tws.length - 1) el.classList.remove('typing');   // cursor stays on the last line
        line += 1;
        setTimeout(nextLine, 400);
      })();
    }
    setTimeout(nextLine, 500);
  }

  /* ───── router ───── */
  function slug() {
    var h = (location.hash || '').replace(/^#\/?/, '').replace(/\/$/, '');
    return views[h] ? h : 'home';
  }

  function route() {
    var s = slug();
    var view = views[s];
    Object.keys(views).forEach(function (k) { views[k].classList.toggle('is-active', views[k] === view); });
    document.title = view.getAttribute('data-title') + (s === 'home' ? '' : ' — Youssef Mohamed');

    var key = (s === 'home' || s === 'about' || s === 'contact') ? s : 'work';
    Array.prototype.forEach.call(document.querySelectorAll('[data-nav]'), function (a) {
      if (a.getAttribute('data-nav') === key) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    setMenu(false);
    closeLightbox(true);
    window.scrollTo(0, 0);
    if (s === 'home') startTyping();
    if (!first) { var h1 = view.querySelector('h1'); if (h1) h1.focus({ preventScroll: true }); }
    first = false;
  }
  window.addEventListener('hashchange', route);

  /* ───── "scroll to" buttons (Seniors: front → back) ───── */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-scroll]');
    if (!b) return;
    var t = document.getElementById(b.getAttribute('data-scroll'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ───── work filter ───── */
  var chips = document.querySelectorAll('.chip');
  var wraps = document.querySelectorAll('.tile-wrap');
  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      Array.prototype.forEach.call(chips, function (c) {
        c.classList.toggle('is-on', c === chip);
        c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
      });
      Array.prototype.forEach.call(wraps, function (w) {
        w.hidden = !(f === 'all' || w.getAttribute('data-tab') === f);
      });
    });
  });

  /* ───── lightbox ───── */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbCount = document.getElementById('lb-count');
  var items = [], idx = 0, lastFocus = null;

  function show(i) {
    idx = (i + items.length) % items.length;
    var a = items[idx];
    lbImg.alt = a.getAttribute('data-caption') || '';
    lbImg.src = a.getAttribute('href');
    lbCap.textContent = a.getAttribute('data-caption') || '';
    lbCount.textContent = (idx + 1) + ' / ' + items.length;
  }
  function openLightbox(a) {
    items = Array.prototype.slice.call(a.closest('.view').querySelectorAll('a.lb'));
    lastFocus = a;
    lb.classList.toggle('lb-single', items.length < 2);
    lb.hidden = false;
    body.classList.add('lb-open');
    show(items.indexOf(a));
    lb.querySelector('.lb-close').focus();
  }
  function closeLightbox(silent) {
    if (lb.hidden) return;
    lb.hidden = true;
    lbImg.removeAttribute('src');
    body.classList.remove('lb-open');
    if (!silent && lastFocus) lastFocus.focus({ preventScroll: true });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.lb');
    if (a) { e.preventDefault(); openLightbox(a); return; }
    if (e.target === lb || e.target.classList.contains('lb-stage')) closeLightbox();
  });
  lb.querySelector('.lb-close').addEventListener('click', function () { closeLightbox(); });
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!lb.hidden) closeLightbox(); else setMenu(false); return; }
    if (lb.hidden) return;
    if (e.key === 'ArrowRight') show(idx + 1);
    else if (e.key === 'ArrowLeft') show(idx - 1);
  });
  var sx = null;
  lb.addEventListener('touchstart', function (e) { sx = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (sx === null || items.length < 2) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    sx = null;
  }, { passive: true });

  /* ───── reveal on scroll ───── */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('in'); });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  route();
})();