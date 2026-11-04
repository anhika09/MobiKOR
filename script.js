/* ==========================================================================
   MobiKOR — Scripts (Navigation, Theme, Carousels, Filters, Calculator, Cart)
   ========================================================================== */

// ---------- 1. Перемикач теми (Dark / Light) ----------
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    btn.innerHTML = theme === 'dark' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
    btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a1020' : '#d0d9ea');
  }

  var savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem('theme') || root.getAttribute('data-theme') || 'dark';
  } catch (e) {
    savedTheme = root.getAttribute('data-theme') || 'dark';
  }
  apply(savedTheme);

  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
  });
})();

// ---------- 2. Мобільне меню (Hamburger) ----------
(function () {
  var toggle = document.getElementById('menu-toggle');
  var navigation = document.getElementById('primary-navigation');
  if (!toggle || !navigation) return;

  var icon = toggle.querySelector('i');

  function closeMenu() {
    navigation.classList.add('max-[900px]:hidden');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Відкрити меню');
    if (icon) {
      icon.classList.remove('bi-x-lg');
      icon.classList.add('bi-list');
    }
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    var isHidden = navigation.classList.contains('max-[900px]:hidden');
    navigation.classList.toggle('max-[900px]:hidden', !isHidden);
    toggle.setAttribute('aria-expanded', String(isHidden));
    toggle.setAttribute('aria-label', isHidden ? 'Закрити меню' : 'Відкрити меню');
    if (icon) {
      icon.classList.toggle('bi-list', !isHidden);
      icon.classList.toggle('bi-x-lg', isHidden);
    }
  });

  navigation.addEventListener('click', function (event) {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('click', function (event) {
    if (!toggle.contains(event.target) && !navigation.contains(event.target)) {
      closeMenu();
    }
  });

  window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
    if (e.matches) closeMenu();
  });
})();

// ---------- 3. Динаміка карток для мобільних пристроїв (Touch Tactile Dynamics) ----------
(function () {
  var touchCards = document.querySelectorAll('.card-lift, .step-card, .badge-advantage, .product-item, .hero nav a');
  touchCards.forEach(function (el) {
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

// ---------- 4. Карусель фото у розділі "Про нас" ----------
(function () {
  var carousel = document.querySelector('.about-carousel');
  if (!carousel) return;

  var slides = carousel.querySelectorAll('.about-carousel__slide');
  var dots = carousel.querySelectorAll('.about-carousel__dot');
  var prevBtn = document.getElementById('about-photo-prev');
  var nextBtn = document.getElementById('about-photo-next');
  if (!slides.length) return;

  var currentIndex = 0;
  var timer = null;
  var intervalMs = 4500;

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    slides.forEach(function (slide, i) {
      var isActive = i === currentIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    dots.forEach(function (dot, i) {
      var isActive = i === currentIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function nextSlide() { showSlide(currentIndex + 1); }
  function prevSlide() { showSlide(currentIndex - 1); }

  function startAutoPlay() {
    stopAutoPlay();
    timer = setInterval(nextSlide, intervalMs);
  }

  function stopAutoPlay() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); startAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); startAutoPlay(); });

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
      startAutoPlay();
    });
  });

  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  var touchStartX = 0;
  carousel.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    stopAutoPlay();
  }, { passive: true });

  carousel.addEventListener('touchend', function (e) {
    var diffX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diffX) > 40) {
      if (diffX < 0) nextSlide();
      else prevSlide();
    }
    startAutoPlay();
  }, { passive: true });

  showSlide(0);
  startAutoPlay();
})();

// ---------- 5. Карусель товарів у магазині (Головна) ----------
(function () {
  var track = document.querySelector('#shop .products');
  var prev = document.getElementById('shop-prev');
  var next = document.getElementById('shop-next');
  var status = document.querySelector('#shop .carousel-status');
  if (!track || !prev || !next) return;
  var items = track.children;

  function step() {
    var gap = 20;
    return (items[0] ? items[0].getBoundingClientRect().width : 280) + gap;
  }

  function update() {
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    if (status && items.length) {
      var i = Math.min(Math.round(track.scrollLeft / step()) + 1, items.length);
      status.textContent = 'Товар ' + i + ' із ' + items.length;
    }
  }

  prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
  next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// ---------- 6. Фільтри та пошук магазину ----------
(function () {
  var searchInput = document.getElementById('catalog-search');
  var btnSearch = document.getElementById('btn-search-trigger');
  var priceMinInput = document.getElementById('price-min');
  var priceMaxInput = document.getElementById('price-max');
  var priceRange = document.getElementById('price-range');
  var priceRangeVal = document.getElementById('price-range-val');
  var btnPriceApply = document.getElementById('btn-price-apply');
  var stockOnly = document.getElementById('stock-only');
  var sortSelect = document.getElementById('sort-select');
  var btnReset = document.getElementById('btn-reset-filters');
  var btnResetEmpty = document.getElementById('btn-reset-empty');
  var productCountEl = document.getElementById('product-count');
  var noProductsEl = document.getElementById('no-products');
  var tagPills = document.querySelectorAll('.tag-pill');
  var productList = document.getElementById('products-catalog-list');

  if (!productList) return;

  var items = Array.from(productList.querySelectorAll('.product-item'));

  function filterAndSort() {
    var query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    var minPrice = priceMinInput ? parseFloat(priceMinInput.value) || 0 : 0;
    var maxPrice = priceMaxInput ? parseFloat(priceMaxInput.value) || 999999 : 999999;
    var requireStock = stockOnly ? stockOnly.checked : false;

    // Вибрані категорії
    var selectedCats = Array.from(document.querySelectorAll('input[name="cat"]:checked')).map(function (cb) { return cb.value; });
    // Вибрані бренди
    var selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(function (cb) { return cb.value; });

    var visibleCount = 0;

    items.forEach(function (item) {
      var name = (item.getAttribute('data-name') || '').toLowerCase();
      var brand = item.getAttribute('data-brand') || '';
      var cat = item.getAttribute('data-category') || '';
      var price = parseFloat(item.getAttribute('data-price')) || 0;
      var inStock = item.getAttribute('data-stock') === '1';

      var matchQuery = !query || name.includes(query) || brand.toLowerCase().includes(query) || cat.toLowerCase().includes(query);
      var matchPrice = price >= minPrice && price <= maxPrice;
      var matchStock = !requireStock || inStock;
      var matchCat = !selectedCats.length || selectedCats.includes(cat);
      var matchBrand = !selectedBrands.length || selectedBrands.includes(brand);

      if (matchQuery && matchPrice && matchStock && matchCat && matchBrand) {
        item.classList.remove('hidden');
        visibleCount++;
      } else {
        item.classList.add('hidden');
      }
    });

    // Сортування
    var sortType = sortSelect ? sortSelect.value : 'pop';
    items.sort(function (a, b) {
      var priceA = parseFloat(a.getAttribute('data-price')) || 0;
      var priceB = parseFloat(b.getAttribute('data-price')) || 0;
      var popA = parseFloat(a.getAttribute('data-pop')) || 0;
      var popB = parseFloat(b.getAttribute('data-pop')) || 0;
      var nameA = a.getAttribute('data-name') || '';
      var nameB = b.getAttribute('data-name') || '';

      if (sortType === 'price-asc') return priceA - priceB;
      if (sortType === 'price-desc') return priceB - priceA;
      if (sortType === 'name') return nameA.localeCompare(nameB);
      return popB - popA;
    });

    items.forEach(function (item) { productList.appendChild(item); });

    if (productCountEl) productCountEl.textContent = String(visibleCount);
    if (noProductsEl) noProductsEl.classList.toggle('hidden', visibleCount > 0);
  }

  // Синхронізація повзунка цін
  if (priceRange) {
    priceRange.addEventListener('input', function () {
      if (priceMaxInput) priceMaxInput.value = priceRange.value;
      if (priceRangeVal) priceRangeVal.textContent = 'до ' + Number(priceRange.value).toLocaleString('uk-UA') + ' ₴';
      filterAndSort();
    });
  }

  if (priceMaxInput) {
    priceMaxInput.addEventListener('input', function () {
      if (priceRange) priceRange.value = priceMaxInput.value;
      if (priceRangeVal) priceRangeVal.textContent = 'до ' + Number(priceMaxInput.value).toLocaleString('uk-UA') + ' ₴';
    });
  }

  if (btnPriceApply) btnPriceApply.addEventListener('click', filterAndSort);
  if (searchInput) searchInput.addEventListener('input', filterAndSort);
  if (btnSearch) btnSearch.addEventListener('click', filterAndSort);
  if (stockOnly) stockOnly.addEventListener('change', filterAndSort);
  if (sortSelect) sortSelect.addEventListener('change', filterAndSort);

  document.querySelectorAll('input[name="cat"], input[name="brand"]').forEach(function (cb) {
    cb.addEventListener('change', filterAndSort);
  });

  // Клік на теги швидких категорій
  tagPills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var tag = pill.getAttribute('data-tag');
      tagPills.forEach(function (p) {
        p.classList.remove('border-accent', 'bg-accent/15', 'text-accent-text', 'font-semibold');
        p.classList.add('border-border', 'bg-surface');
      });
      pill.classList.remove('border-border', 'bg-surface');
      pill.classList.add('border-accent', 'bg-accent/15', 'text-accent-text', 'font-semibold');

      document.querySelectorAll('input[name="cat"]').forEach(function (cb) {
        cb.checked = (cb.value === tag);
      });
      filterAndSort();
    });
  });

  // Скидання всіх фільтрів
  function resetAll() {
    if (searchInput) searchInput.value = '';
    if (priceMinInput) priceMinInput.value = 0;
    if (priceMaxInput) priceMaxInput.value = 7000;
    if (priceRange) priceRange.value = 7000;
    if (priceRangeVal) priceRangeVal.textContent = 'до 7 000 ₴';
    if (stockOnly) stockOnly.checked = false;
    document.querySelectorAll('input[name="cat"], input[name="brand"]').forEach(function (cb) {
      cb.checked = false;
    });
    tagPills.forEach(function (p, i) {
      var isFirst = i === 0;
      p.classList.toggle('border-accent', isFirst);
      p.classList.toggle('bg-accent/15', isFirst);
      p.classList.toggle('text-accent-text', isFirst);
      p.classList.toggle('font-semibold', isFirst);
      p.classList.toggle('border-border', !isFirst);
      p.classList.toggle('bg-surface', !isFirst);
    });
    filterAndSort();
  }

  if (btnReset) btnReset.addEventListener('click', resetAll);
  if (btnResetEmpty) btnResetEmpty.addEventListener('click', resetAll);
})();

// ---------- 7. Інтерактивний Кошик (Cart Slide-over) ----------
(function () {
  var openBtn = document.getElementById('cart-open-btn');
  var closeBtn = document.getElementById('cart-close-btn');
  var drawer = document.getElementById('cart-drawer');
  var container = document.getElementById('cart-items-container');
  var totalEl = document.getElementById('cart-total-price');
  var badge = document.getElementById('cart-badge');

  var cart = [];

  function updateCartUI() {
    if (badge) badge.textContent = String(cart.length);
    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = '<p class="text-sm text-text-muted text-center py-8">Кошик порожній. Оберіть потрібні товари з каталогу.</p>';
      if (totalEl) totalEl.textContent = '0 ₴';
      return;
    }

    var total = 0;
    container.innerHTML = '';
    cart.forEach(function (item, index) {
      total += item.price;
      var el = document.createElement('div');
      el.className = 'flex items-center justify-between p-3 rounded-xl bg-surface-raised border border-border';
      el.innerHTML = '<div class="min-w-0 pr-2">' +
        '<h4 class="text-xs font-bold text-white truncate">' + item.name + '</h4>' +
        '<p class="text-xs text-accent-text font-bold m-0">' + item.price.toLocaleString('uk-UA') + ' ₴</p>' +
        '</div>' +
        '<button type="button" class="w-7 h-7 rounded-lg text-text-muted hover:text-red-400 flex items-center justify-center text-sm" data-remove="' + index + '"><i class="bi bi-trash"></i></button>';
      container.appendChild(el);
    });

    if (totalEl) totalEl.textContent = total.toLocaleString('uk-UA') + ' ₴';

    container.querySelectorAll('[data-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-remove'), 10);
        cart.splice(idx, 1);
        updateCartUI();
      });
    });
  }

  if (openBtn && drawer) {
    openBtn.addEventListener('click', function () {
      drawer.classList.remove('hidden');
    });
  }
  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', function () {
      drawer.classList.add('hidden');
    });
  }
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) drawer.classList.add('hidden');
    });
  }

  document.querySelectorAll('.btn-add-to-cart').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-id');
      var name = btn.getAttribute('data-name');
      var price = parseFloat(btn.getAttribute('data-price')) || 0;
      cart.push({ id: id, name: name, price: price });
      updateCartUI();
      if (drawer) drawer.classList.remove('hidden');
    });
  });
})();

// ---------- 8. Калькулятор вартості ремонту на repair.html ----------
(function () {
  var catSelect = document.getElementById('calc-category');
  var brandSelect = document.getElementById('calc-brand');
  var modelSelect = document.getElementById('calc-model');
  var damageSelect = document.getElementById('calc-damage');
  var resultTitle = document.getElementById('calc-result-title');
  var resultPrice = document.getElementById('calc-result-price');

  if (!catSelect || !damageSelect || !resultTitle || !resultPrice) return;

  var priceMap = {
    'Заміна екрана': { price: '1 800 ₴', time: '45 хв' },
    'Заміна акумулятора': { price: '950 ₴', time: '30 хв' },
    'Ремонт плати / чистка': { price: '1 200 ₴', time: '1-2 дні' },
    'Заміна роз\'єму зарядки': { price: '650 ₴', time: '40 хв' }
  };

  function updateCalc() {
    var damage = damageSelect.value;
    var model = modelSelect ? modelSelect.value : 'iPhone 14 Pro';
    resultTitle.textContent = damage + ' · ' + model;

    var info = priceMap[damage] || { price: '1 800 ₴', time: '45 хв' };
    resultPrice.textContent = info.price;
  }

  [catSelect, brandSelect, modelSelect, damageSelect].forEach(function (el) {
    if (el) el.addEventListener('change', updateCalc);
  });
})();