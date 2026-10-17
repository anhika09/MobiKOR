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
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a1020' : '#f5f7fb');
  }
 
  apply(root.getAttribute('data-theme') || 'dark');
 
  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem('theme', next); } catch (e) { /* приватний режим */ }
  });
})();
// ---------- Карусель товарів ----------
(function () {
  var track = document.querySelector('#shop .products');
  var prev = document.getElementById('shop-prev');
  var next = document.getElementById('shop-next');
  var status = document.querySelector('#shop .carousel-status');
  if (!track || !prev || !next) return;
  var items = track.children;
 
  // Крок прокрутки = ширина однієї картки + відступ між ними
  function step() {
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return items[0].getBoundingClientRect().width + gap;
  }
 
  function update() {
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
    if (status) {
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