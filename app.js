/* Youssef Mohammed — portfolio
   Hash router (one view per collection), mobile menu, work filter, lightbox. */
(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  var views = Array.prototype.slice.call(document.querySelectorAll('.view'));
  var byId = {};
  views.forEach(function (v) { byId[v.id.replace(/^view-/, '')] = v; });
  var firstRoute = true;

  /* ───────── image loading: drop the shimmer once an image is in ───────── */
  function markLoaded(img) {
    var m = img.closest('.media');
    if (m) m.classList.add('is-loaded');
  }
  document.addEventListener('load', function (e) {
    if (e.target && e.target.tagName === 'IMG') markLoaded(e.target);
  }, true);
  Array.prototype.forEach.call(document.images, function (img) {
    if (img.complete && img.naturalWidth > 0) markLoaded(img);
  });
  document.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') {
      var m = e.target.closest('.media');
      if (m) { m.classList.add('is-loaded'); m.style.minHeight = '120px'; }
    }
  }, true);

  /* ───────── routing ───────── */
  function currentSlug() {
    var h = (location.hash || '').replace(/^#\/?/, '').replace(/\/$/, '');
    return byId[h] ? h : 'home';
  }

  function route() {
    var slug = currentSlug();
    var view = byId[slug];

    views.forEach(function (v) { v.classList.toggle('is-active', v === view); });
    document.title = view.getAttribute('data-title') + (slug === 'home' ? '' : ' — Youssef Mohammed');

    // nav highlight: collections belong to "Work"
    var navKey = (slug === 'home' || slug === 'work' || slug === 'about' || slug === 'contact') ? slug : 'work';
    Array.prototype.forEach.call(document.querySelectorAll('.menu > a[data-nav], .has-dd > a[data-nav]'), function (a) {
      if (a.getAttribute('data-nav') === navKey) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    Array.prototype.forEach.call(document.querySelectorAll('.dd a'), function (a) {
      if (a.getAttribute('href') === '#/' + slug) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    setMenu(false);
    closeLightbox(true);
    window.scrollTo(0, 0);

    if (!firstRoute) {
      var h1 = view.querySelector('h1');
      if (h1) h1.focus({ preventScroll: true });
    }
    firstRoute = false;
  }
  window.addEventListener('hashchange', route);

  /* ───────── mobile menu ───────── */
  function setMenu(open) {
    header.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  burger.addEventListener('click', function () {
    setMenu(!header.classList.contains('nav-open'));
  });
  document.addEventListener('click', function (e) {
    if (header.classList.contains('nav-open') && !header.contains(e.target)) setMenu(false);
  });

  /* ───────── work filter ───────── */
  var chips = document.querySelectorAll('.chip');
  var wraps = document.querySelectorAll('.tile-wrap');
  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      Array.prototype.forEach.call(chips, function (c) {
        var on = c === chip;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      Array.prototype.forEach.call(wraps, function (w) {
        w.hidden = !(f === 'all' || w.getAttribute('data-tab') === f);
      });
    });
  });

  /* ───────── lightbox ───────── */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbCount = document.getElementById('lb-count');
  var items = [];
  var idx = 0;
  var lastFocus = null;

  function show(i) {
    idx = (i + items.length) % items.length;
    var a = items[idx];
    lbImg.alt = a.getAttribute('data-caption') || '';
    lbImg.src = a.href;
    lbCap.textContent = a.getAttribute('data-caption') || '';
    lbCount.textContent = (idx + 1) + ' / ' + items.length;
    // warm the neighbours so next/prev feels instant
    [idx + 1, idx - 1].forEach(function (n) {
      if (items.length > 1) { var p = new Image(); p.src = items[(n + items.length) % items.length].href; }
    });
  }

  function openLightbox(a) {
    var view = a.closest('.view');
    items = Array.prototype.slice.call(view.querySelectorAll('a.lb'));
    lastFocus = a;
    lb.classList.toggle('lb-single', items.length < 2);
    lb.hidden = false;
    document.body.classList.add('lb-open');
    show(items.indexOf(a));
    lb.querySelector('.lb-close').focus();
  }

  function closeLightbox(silent) {
    if (lb.hidden) return;
    lb.hidden = true;
    lbImg.removeAttribute('src');
    document.body.classList.remove('lb-open');
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
    if (lb.hidden) {
      if (e.key === 'Escape') setMenu(false);
      return;
    }
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') show(idx + 1);
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'Tab') {
      var btns = Array.prototype.filter.call(lb.querySelectorAll('button'), function (b) { return b.offsetParent !== null; });
      var first = btns[0], last = btns[btns.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // swipe on touch screens
  var sx = null;
  lb.addEventListener('touchstart', function (e) { sx = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (sx === null || items.length < 2) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    sx = null;
  }, { passive: true });

  /* ───────── misc ───────── */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  route();
})();
