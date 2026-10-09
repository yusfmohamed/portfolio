/* theme.js — load AFTER app.js (defer). Dark/light toggle, scroll reveal, mobile tab bar. */
(function () {
  'use strict';

  var root = document.documentElement;
  var KEY = 'ym-theme';
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(t) { try { localStorage.setItem(KEY, t); } catch (e) {} }

  /* ───────── theme toggle ───────── */
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'theme-toggle';
  btn.innerHTML =
    '<svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>' +
    '<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  function apply(t) {
    root.setAttribute('data-theme', t);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#0f0e17' : '#f6f5fb');
    btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
  }

  var bar = document.querySelector('.site-header .bar');
  if (bar) bar.insertBefore(btn, document.getElementById('burger'));
  apply(stored() || (mq && mq.matches ? 'dark' : 'light'));

  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.classList.add('theme-anim');
    apply(next);
    save(next);
    setTimeout(function () { root.classList.remove('theme-anim'); }, 450);
  });

  // follow the system setting until the visitor picks one
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', function (e) { if (!stored()) apply(e.matches ? 'dark' : 'light'); });
  }

  /* ───────── mobile tab bar ───────── */
  var tabs = [['home', '#/', 'Home'], ['work', '#/work', 'Work'], ['about', '#/about', 'About'], ['contact', '#/contact', 'Contact']];
  var tabbar = document.createElement('nav');
  tabbar.className = 'tabbar';
  tabbar.setAttribute('aria-label', 'Quick navigation');
  tabbar.innerHTML = tabs.map(function (t) { return '<a href="' + t[1] + '" data-tab="' + t[0] + '">' + t[2] + '</a>'; }).join('');
  document.body.appendChild(tabbar);

  function syncTabs() {
    var slug = (location.hash || '').replace(/^#\/?/, '').replace(/\/$/, '') || 'home';
    var known = { home: 1, work: 1, about: 1, contact: 1 };
    var key = known[slug] ? slug : (document.getElementById('view-' + slug) ? 'work' : 'home');
    Array.prototype.forEach.call(tabbar.querySelectorAll('a'), function (a) {
      if (a.getAttribute('data-tab') === key) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('hashchange', syncTabs);
  syncTabs();

  /* ───────── scroll reveal ───────── */
  var sel = '.gallery > li, .tile-wrap, .section .tiles > .tile, .contact-grid > a, .stack-group, .about-text, .pager';
  var els = Array.prototype.slice.call(document.querySelectorAll(sel));

  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty('--d', Math.min(sibs, 6) * 60 + 'ms');
      el.classList.add('in');
      io.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
})();