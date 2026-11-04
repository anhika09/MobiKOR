// ---------- 7. Фільтри та пошук магазину ----------
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
  var filtersPanel = document.getElementById('catalog-filters');
  var activeFilterCount = document.querySelectorAll('.filter-active-count');

  if (!productList) return;

  var items = Array.from(productList.querySelectorAll('.product-item'));
  var desktopFilters = window.matchMedia('(min-width: 1024px)');

  function syncFilterPanel() {
    if (filtersPanel) filtersPanel.open = desktopFilters.matches;
  }

  syncFilterPanel();
  if (desktopFilters.addEventListener) desktopFilters.addEventListener('change', syncFilterPanel);
  else desktopFilters.addListener(syncFilterPanel);

  function updateActiveFilterCount() {
    var minPrice = priceMinInput ? parseFloat(priceMinInput.value) || 0 : 0;
    var maxPrice = priceMaxInput ? parseFloat(priceMaxInput.value) || 999999 : 999999;
    var selectedCats = document.querySelectorAll('input[name="cat"]:checked').length;
    var selectedBrands = document.querySelectorAll('input[name="brand"]:checked').length;
    var activeCount = (searchInput && searchInput.value.trim() ? 1 : 0) +
      (minPrice !== 0 || maxPrice !== 7000 ? 1 : 0) +
      (stockOnly && stockOnly.checked ? 1 : 0) +
      (selectedCats ? 1 : 0) +
      (selectedBrands ? 1 : 0);

    activeFilterCount.forEach(function (counter) {
      counter.textContent = String(activeCount);
    });
  }

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

    updateActiveFilterCount();
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
      updateActiveFilterCount();
    });
  }
  if (priceMinInput) priceMinInput.addEventListener('input', updateActiveFilterCount);

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
  filterAndSort();
})();
