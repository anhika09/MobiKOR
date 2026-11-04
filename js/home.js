// ---------- 5. Карусель фото у розділі "Про нас" ----------
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
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

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
    if (!motionQuery.matches) timer = setInterval(nextSlide, intervalMs);
  }

  function stopAutoPlay() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  if (motionQuery.addEventListener) motionQuery.addEventListener('change', function (event) {
    if (event.matches) stopAutoPlay();
    else startAutoPlay();
  });
  else motionQuery.addListener(function (event) {
    if (event.matches) stopAutoPlay();
    else startAutoPlay();
  });

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

// ---------- 6. Карусель товарів у магазині (Головна) ----------
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
