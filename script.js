(function () {
  'use strict';

  // ===== Scroll progress bar (生成して body 先頭に挿入) =====
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.id = 'scrollProgress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  // ===== Header scroll state（影 / 進捗 / 自動開閉） =====
  const header = document.getElementById('siteHeader');
  const siteNavEl = document.getElementById('siteNav');
  let ticking = false;
  let lastY = window.scrollY;

  function onScroll() {
    const y = window.scrollY;

    // 影：少しでもスクロールしたら
    if (header) header.classList.toggle('scrolled', y > 8);

    // 進捗バー：読了率に応じて 0→1
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(y / max, 1) : 0;
    progress.style.transform = 'scaleX(' + ratio + ')';

    // 自動開閉：下スクロールで隠す / 上スクロールで出す
    // （メニュー展開中・最上部付近では常に表示）
    if (header) {
      const menuOpen = siteNavEl && siteNavEl.classList.contains('open');
      if (!menuOpen && y > 160 && y > lastY + 4) {
        header.classList.add('header-hidden');
      } else if (y < lastY - 4 || y <= 160) {
        header.classList.remove('header-hidden');
      }
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  // ===== Mobile nav (hamburger) =====
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const open = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    });
    siteNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'メニューを開く');
      });
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== Hero light motes（陽光に舞う金色の光の粒） =====
  const heroEl = document.querySelector('.hero');
  if (heroEl && !reduceMotion) {
    const motes = document.createElement('div');
    motes.className = 'hero-motes';
    motes.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('span');
      const size = (4 + Math.random() * 7).toFixed(1) + 'px';
      s.style.left = (Math.random() * 100).toFixed(2) + '%';
      s.style.width = size;
      s.style.height = size;
      s.style.animationDuration = (11 + Math.random() * 12).toFixed(1) + 's';
      s.style.animationDelay = (-Math.random() * 16).toFixed(1) + 's';
      motes.appendChild(s);
    }
    heroEl.appendChild(motes);
  }

  // ===== Back to top（スクロールで現れるフロートボタン） =====
  const toTop = document.createElement('button');
  toTop.id = 'toTop';
  toTop.type = 'button';
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'ページ上部へ戻る');
  toTop.textContent = '↑';
  document.body.appendChild(toTop);
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
  let toTopTick = false;
  function onToTop() {
    toTop.classList.toggle('show', window.scrollY > 600);
    toTopTick = false;
  }
  window.addEventListener('scroll', () => {
    if (!toTopTick) { window.requestAnimationFrame(onToTop); toTopTick = true; }
  }, { passive: true });
  onToTop();

  // ===== Reveal on scroll =====
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }
})();
