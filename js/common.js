/* ==========================================================================
   MobiKOR — Scripts (Navigation, Theme, Carousels, Filters, Calculator, Cart)
   ========================================================================== */

// ---------- Form validation feedback ----------
(function () {
  var fieldSelector = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]), select, textarea';
  var errorElements = new WeakMap();
  var errorSequence = 0;

  function getErrorMessage(field) {
    if (field.validity.valueMissing) return 'Заповніть це поле.';
    if (field.validity.patternMismatch && field.title) return field.title;
    if (field.validity.typeMismatch) return 'Перевірте формат введених даних.';
    if (field.validity.rangeOverflow || field.validity.rangeUnderflow || field.validity.stepMismatch) {
      return 'Введіть значення в допустимому діапазоні.';
    }
    return 'Перевірте коректність введених даних.';
  }

  function removeError(field) {
    var error = errorElements.get(field);
    if (!error) return;

    error.remove();
    errorElements.delete(field);
    field.removeAttribute('aria-invalid');

    var descriptions = (field.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (id) {
      return id && id !== error.id;
    });
    if (descriptions.length) field.setAttribute('aria-describedby', descriptions.join(' '));
    else field.removeAttribute('aria-describedby');
  }

  document.addEventListener('invalid', function (event) {
    var field = event.target;
    if (!(field instanceof Element) || !field.matches(fieldSelector)) return;

    var error = errorElements.get(field);
    if (!error) {
      error = document.createElement('span');
      error.id = field.id ? field.id + '-error' : 'field-error-' + (++errorSequence);
      error.className = 'field-error';
      error.setAttribute('role', 'alert');
      errorElements.set(field, error);
      field.insertAdjacentElement('afterend', error);
    }

    error.textContent = getErrorMessage(field);
    field.setAttribute('aria-invalid', 'true');
    var descriptions = (field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    if (descriptions.indexOf(error.id) === -1) descriptions.push(error.id);
    field.setAttribute('aria-describedby', descriptions.join(' '));
  }, true);

  function clearValidFieldError(event) {
    var field = event.target;
    if (!(field instanceof Element) || !field.matches(fieldSelector)) return;
    if (field.validity.valid) removeError(field);
    else {
      var error = errorElements.get(field);
      if (error) error.textContent = getErrorMessage(field);
    }
  }

  document.addEventListener('input', clearValidFieldError, true);
  document.addEventListener('change', clearValidFieldError, true);
})();

// ---------- 1. Перемикач теми (Dark / Light) ----------
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var icon = btn.querySelector('i');
    if (icon) icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
    btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a1020' : '#f2f5fa');
  }

  var savedTheme = root.getAttribute('data-theme') || 'dark';
  try {
    savedTheme = localStorage.getItem('theme') || savedTheme;
  } catch (error) {
    console.warn('Theme preference could not be read.', error);
  }
  apply(savedTheme);

  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    try {
      localStorage.setItem('theme', next);
    } catch (error) {
      console.warn('Theme preference could not be saved.', error);
    }
  });
})();

// ---------- 2. Мобільне меню (Hamburger) ----------
(function () {
  var toggle = document.getElementById('menu-toggle');
  var navigation = document.getElementById('primary-navigation');
  if (!toggle || !navigation) return;

  var icon = toggle.querySelector('i');

  function closeMenu() {
    navigation.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Відкрити меню');
    if (icon) {
      icon.classList.remove('bi-x-lg');
      icon.classList.add('bi-list');
    }
  }

  function openMenu() {
    navigation.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Закрити меню');
    if (icon) {
      icon.classList.remove('bi-list');
      icon.classList.add('bi-x-lg');
    }
    var firstLink = navigation.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  toggle.addEventListener('click', function (event) {
    event.stopPropagation();
    if (toggle.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });

  navigation.addEventListener('click', function (event) {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('click', function (event) {
    if (!toggle.contains(event.target) && !navigation.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });

  var desktopQuery = window.matchMedia('(min-width: 768px)');
  if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', function (event) {
    if (event.matches) closeMenu();
  });
  else desktopQuery.addListener(function (event) {
    if (event.matches) closeMenu();
  });
})();

// ---------- 3. Динаміка карток для мобільних пристроїв (Touch Tactile Dynamics) ----------
(function () {
  document.querySelectorAll('.card-lift, .step-card-hover, .button, .product-item').forEach(function (el) {
    el.addEventListener('touchstart', function () {
      el.classList.add('is-touch-active');
    }, { passive: true });

    el.addEventListener('touchend', function () {
      setTimeout(function () {
        el.classList.remove('is-touch-active');
      }, 250);
    }, { passive: true });

    el.addEventListener('touchcancel', function () {
      el.classList.remove('is-touch-active');
    }, { passive: true });
  });
})();

// ---------- 4. Поява карток при прокручуванні ----------
(function () {
  var revealItems = document.querySelectorAll('.card-lift');
  if (!revealItems.length) return;

  revealItems.forEach(function (item, index) {
    item.classList.add('reveal');
    item.style.setProperty('--i', String(index % 5));
  });

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(function (item) { observer.observe(item); });
})();

// ---------- 5. Video motion preference ----------
(function () {
  var video = document.querySelector('.hero video');
  if (!video) return;

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  function syncPlayback() {
    if (motionQuery.matches) {
      video.pause();
      return;
    }

    video.play().catch(function (error) {
      if (motionQuery.matches && error && error.name === 'AbortError') return;
      console.warn('Hero video could not start playback.', error);
    });
  }

  syncPlayback();
  if (motionQuery.addEventListener) motionQuery.addEventListener('change', syncPlayback);
  else motionQuery.addListener(syncPlayback);
})();
