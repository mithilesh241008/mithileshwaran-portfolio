const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const mobile = window.matchMedia('(max-width: 699px)');

document.addEventListener('DOMContentLoaded', () => {
  splitName();
  setYear();
  startClock();
  initMenu();
  initReveal();
  initActiveSection();
  initScrollEffects();
  initPractice();
  initPortrait();
  initCopyEmail();

  if (finePointer.matches && !reducedMotion.matches) {
    initCursor();
    initMagnetic();
  }

  // Two frames so the browser paints the hidden state before we remove it.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.body.classList.add('is-loaded'));
  });
  setTimeout(() => document.body.classList.add('is-settled'), 1600);
});


/* ---------- Hero name ---------- */

function splitName() {
  const name = document.querySelector('.hero__name');
  const letters = [...name.textContent.trim()];

  // The h1 keeps its aria-label, so screen readers hear the name, not sixteen letters.
  name.innerHTML = letters
    .map((letter, i) => `<span class="char" aria-hidden="true" style="--c:${i}">${letter}</span>`)
    .join('');
}


/* ---------- Year & Madurai clock ---------- */

function setYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll('.js-year').forEach((el) => (el.textContent = year));
}

function startClock() {
  const clock = document.querySelector('.js-clock');
  const format = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  function update() {
    const now = new Date();
    clock.textContent = format.format(now);
    clock.dateTime = now.toISOString();
  }

  update();

  // Line the updates up with the start of each minute so the clock never lags by up to 59s.
  const msToNextMinute = 60000 - (Date.now() % 60000);
  setTimeout(() => {
    update();
    setInterval(update, 60000);
  }, msToNextMinute);
}


/* ---------- Mobile menu ---------- */

function initMenu() {
  const topbar = document.querySelector('.topbar');
  const toggle = document.querySelector('.menu-toggle');
  const label = toggle.querySelector('.menu-toggle__label');
  const links = document.querySelectorAll('.nav a');

  function setOpen(open) {
    topbar.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open);
    label.textContent = open ? 'Close' : 'Menu';
    if (open) links[0].focus();
  }

  toggle.addEventListener('click', () => {
    setOpen(!topbar.classList.contains('is-open'));
  });

  links.forEach((link) => link.addEventListener('click', () => setOpen(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && topbar.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  mobile.addEventListener('change', () => setOpen(false));
}


/* ---------- Scroll reveals ---------- */

function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  items.forEach((item) => observer.observe(item));
}


/* ---------- Active section (nav + progress counter) ---------- */

function initActiveSection() {
  const sections = document.querySelectorAll('[data-section]');
  const navLinks = document.querySelectorAll('[data-nav]');
  const counter = document.querySelector('.js-section-count');

  // A thin band across the middle of the viewport decides which section is "current".
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const index = entry.target.dataset.section;

      counter.textContent = index.padStart(2, '0');
      navLinks.forEach((link) => {
        if (link.dataset.nav === index) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((section) => observer.observe(section));
}


/* ---------- Scroll-linked motion: progress, portrait parallax, strip ---------- */

function initScrollEffects() {
  const topbar = document.querySelector('.topbar');
  const progress = document.querySelector('.progress');
  const hero = document.querySelector('.hero');
  const portraitImg = document.querySelector('.portrait__img');
  const frame = document.querySelector('.portrait__frame');
  const strip = document.querySelector('.strip');
  const stripText = document.querySelector('.strip__text');

  let heroVisible = true;
  let stripVisible = false;
  let ticking = false;
  let maxScroll = 1;
  let heroHeight = 1;
  let frameHeight = 1;

  function measure() {
    maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
    heroHeight = hero.offsetHeight;
    frameHeight = frame.offsetHeight;
  }

  const visibility = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target === hero) heroVisible = entry.isIntersecting;
      if (entry.target === strip) stripVisible = entry.isIntersecting;
    });
  });
  visibility.observe(hero);
  visibility.observe(strip);

  function update() {
    const y = window.scrollY;

    progress.style.setProperty('--progress', Math.min(1, y / maxScroll).toFixed(4));
    topbar.classList.toggle('is-scrolled', y > 8);

    if (!reducedMotion.matches) {
      if (heroVisible) {
        // Keep the parallax small so the portrait still feels anchored to the layout.
        // The image has about 8% spare height below the frame; phones use half of that.
        const travel = frameHeight * (mobile.matches ? 0.035 : 0.07);
        const amount = Math.min(1, y / heroHeight);
        portraitImg.style.setProperty('--parallax', `${(-amount * travel).toFixed(1)}px`);
      }

      if (stripVisible) {
        stripText.style.setProperty('--strip-x', `${(-y * 0.25).toFixed(1)}px`);
      }
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  measure();
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    measure();
    onScroll();
  });
  // Fonts change the page height once they arrive.
  if (document.fonts) document.fonts.ready.then(measure);
}


/* ---------- Practice rows on touch screens ---------- */

function initPractice() {
  if (finePointer.matches) return;

  const list = document.querySelector('.practice__list');
  const rows = list.querySelectorAll('.practice-row');

  // With no hover, the row crossing the middle of the screen becomes the active one.
  // The band is only 1% tall so two rows can't be active at the same time.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-active', entry.isIntersecting);
    });
    list.classList.toggle('has-active', list.querySelector('.is-active') !== null);
  }, { rootMargin: '-49% 0px -50% 0px' });

  rows.forEach((row) => observer.observe(row));
}


/* ---------- Portrait: pointer shift + full photo dialog ---------- */

function initPortrait() {
  const figure = document.querySelector('.portrait');
  const frame = figure.querySelector('.portrait__frame');
  const img = figure.querySelector('.portrait__img');
  const dialog = document.querySelector('.photo-dialog');

  frame.addEventListener('click', () => dialog.showModal());

  // Clicking the dark backdrop closes the dialog; clicks on the photo itself don't.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  if (!finePointer.matches || reducedMotion.matches) return;

  frame.addEventListener('pointermove', (event) => {
    const rect = frame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    img.style.setProperty('--shift-x', `${(x * -12).toFixed(1)}px`);
    img.style.setProperty('--shift-y', `${(y * -12).toFixed(1)}px`);
  });

  frame.addEventListener('pointerleave', () => {
    img.style.setProperty('--shift-x', '0px');
    img.style.setProperty('--shift-y', '0px');
  });
}


/* ---------- Copy email ---------- */

function initCopyEmail() {
  const button = document.querySelector('[data-copy]');
  const label = button.querySelector('.copy-btn__label');
  const status = document.getElementById('copy-status');
  let resetTimer;

  button.addEventListener('click', async () => {
    const email = button.dataset.copy;

    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Older browsers or non-secure pages (file://) don't expose the clipboard API.
      const field = document.createElement('textarea');
      field.value = email;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }

    label.textContent = 'Copied ✓';
    button.classList.add('is-copied');
    status.textContent = 'Email address copied to clipboard';

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      label.textContent = 'Copy';
      button.classList.remove('is-copied');
      status.textContent = '';
    }, 2000);
  });
}


/* ---------- Custom cursor (desktop only) ---------- */

function initCursor() {
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot is-hidden';
  ring.className = 'cursor-ring is-hidden';
  ring.innerHTML = '<div class="cursor-ring__inner"><span>View</span></div>';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(dot, ring);
  root.classList.add('has-cursor');

  const mouse = { x: -100, y: -100 };
  const trail = { x: -100, y: -100 };
  let running = false;

  function loop() {
    // The ring eases towards the pointer; stop the loop once it has caught up.
    trail.x += (mouse.x - trail.x) * 0.2;
    trail.y += (mouse.y - trail.y) * 0.2;
    ring.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;

    if (Math.abs(mouse.x - trail.x) < 0.1 && Math.abs(mouse.y - trail.y) < 0.1) {
      running = false;
      return;
    }
    requestAnimationFrame(loop);
  }

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
    dot.classList.remove('is-hidden');
    ring.classList.remove('is-hidden');

    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    dot.classList.add('is-hidden');
    ring.classList.add('is-hidden');
  });

  document.addEventListener('pointerover', (event) => {
    const target = event.target;
    const isView = target.closest('[data-cursor="view"]');
    const isLink = !isView && target.closest('a, button, .practice-row');
    const isText = !isView && !isLink && target.closest('p, h2, dd, .skill');

    for (const el of [dot, ring]) {
      el.classList.toggle('is-view', Boolean(isView));
      el.classList.toggle('is-link', Boolean(isLink));
      el.classList.toggle('is-text', Boolean(isText));
    }
  });
}


/* ---------- Magnetic links (desktop only) ---------- */

function initMagnetic() {
  const MAX = 8;
  const STRENGTH = 0.25;

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    // Small targets like the arrows listen on their whole row, so the pull starts before you reach them.
    const area = el.closest('[data-magnetic-area]') || el;

    area.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const x = Math.max(-MAX, Math.min(MAX, dx * STRENGTH));
      const y = Math.max(-MAX, Math.min(MAX, dy * STRENGTH));
      el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });

    area.addEventListener('pointerleave', () => {
      el.style.translate = '0 0';
    });
  });
}
