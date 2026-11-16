// ==========================================================================
// MobiKOR — Swiper.js Carousels with Enhanced Swipe & Touch (Home Page)
// ==========================================================================

// 1. Swiper фото майстерні у розділі "Про нас"
(function () {
  var aboutEl = document.querySelector('.about-swiper');
  if (!aboutEl || typeof Swiper === 'undefined') return;

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  new Swiper(aboutEl, {
    loop: true,
    effect: 'slide',
    speed: 600,
    simulateTouch: true,
    allowTouchMove: true,
    grabCursor: true,
    touchRatio: 1,
    touchAngle: 45,
    threshold: 5,
    resistance: true,
    resistanceRatio: 0.85,
    preventClicks: true,
    preventClicksPropagation: true,
    mousewheel: {
      forceToAxis: true,
      releaseOnEdges: true,
    },
    autoplay: motionQuery.matches ? false : {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      nextEl: '#about-photo-next',
      prevEl: '#about-photo-prev',
    },
    pagination: {
      el: '.about-swiper-pagination',
      clickable: true,
    },
    keyboard: {
      enabled: true,
    },
    a11y: {
      prevSlideMessage: 'Попереднє фото',
      nextSlideMessage: 'Наступне фото',
      paginationBulletMessage: 'Перейти до слайду {{index}}',
    },
  });
})();

// 2. Swiper популярних товарів у розділі "Магазин" (Головна)
(function () {
  var productsEl = document.querySelector('.products-swiper');
  var statusEl = document.querySelector('#shop .carousel-status');
  if (!productsEl || typeof Swiper === 'undefined') return;

  var productsSwiper = new Swiper(productsEl, {
    slidesPerView: 1.15,
    spaceBetween: 16,
    simulateTouch: true,
    allowTouchMove: true,
    grabCursor: true,
    touchRatio: 1,
    touchAngle: 45,
    threshold: 5,
    resistance: true,
    resistanceRatio: 0.85,
    preventClicks: true,
    preventClicksPropagation: true,
    watchOverflow: true,
    mousewheel: {
      forceToAxis: true,
      releaseOnEdges: true,
    },
    navigation: {
      nextEl: '#shop-next',
      prevEl: '#shop-prev',
    },
    pagination: {
      el: '.products-swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    keyboard: {
      enabled: true,
    },
    breakpoints: {
      480: {
        slidesPerView: 1.5,
        spaceBetween: 16,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
    on: {
      init: function (swiper) {
        if (statusEl) {
          statusEl.textContent = 'Товар 1 із ' + swiper.slides.length;
        }
      },
      slideChange: function (swiper) {
        if (statusEl) {
          statusEl.textContent = 'Товар ' + (swiper.activeIndex + 1) + ' із ' + swiper.slides.length;
        }
      },
    },
    a11y: {
      prevSlideMessage: 'Попередній товар',
      nextSlideMessage: 'Наступний товар',
    },
  });
})();
