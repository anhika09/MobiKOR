(function () {
  var page = document.body.dataset.page;
  var headerHost = document.getElementById('site-header');
  var footerHost = document.getElementById('site-footer');

  if (headerHost) {
    var destinations = {
      home: 'index.html#home',
      about: 'index.html#about',
      shop: 'shop.html',
      repair: 'repair.html',
      contacts: '#footer-contacts',
    };

    headerHost.innerHTML = `
      <header class="site-header fixed top-0 inset-x-0 z-50 border-b border-border backdrop-blur-md">
        <div class="container-page flex h-full items-center justify-between gap-0">
          <a href="index.html" aria-label="MobiKOR — на головну" class="shrink-0">
            <img id="logo" class="h-9 w-24 object-contain transition-transform hover:scale-105 md:h-10 md:w-auto" src="assets/MobiKOR%20Logo%20Horizontal.png" alt="MobiKOR">
          </a>
          <nav id="primary-navigation" class="absolute inset-x-0 top-full z-50 hidden max-h-[calc(100dvh-var(--header-h))] overflow-y-auto border-b border-border bg-header p-4 shadow-xl md:static md:z-auto md:block md:max-h-none md:overflow-visible md:border-0 md:bg-transparent md:p-0 md:shadow-none" aria-label="Головна навігація">
            <ul class="m-0 flex list-none flex-col items-stretch gap-1 p-0 md:flex-row md:items-center md:gap-1 lg:gap-2">
              <li><a class="block min-h-11 px-3 py-2 text-sm font-medium text-text-header transition-colors hover:text-accent-text" href="${destinations.home}" data-nav-page="home">Головна</a></li>
              <li><a class="block min-h-11 px-3 py-2 text-sm font-medium text-text-header transition-colors hover:text-accent-text" href="${destinations.about}">Про нас</a></li>
              <li><a class="block min-h-11 px-3 py-2 text-sm font-medium text-text-header transition-colors hover:text-accent-text" href="${destinations.shop}" data-nav-page="shop">Магазин</a></li>
              <li><a class="block min-h-11 px-3 py-2 text-sm font-medium text-text-header transition-colors hover:text-accent-text" href="${destinations.repair}" data-nav-page="repair">Ремонт</a></li>
              <li><a class="block min-h-11 px-3 py-2 text-sm font-medium text-text-header transition-colors hover:text-accent-text" href="${destinations.contacts}">Контакти</a></li>
              <li class="md:hidden"><a class="mobile-account-link flex min-h-11 items-center gap-2 px-3 py-2 text-sm font-medium text-text-header transition-colors hover:text-accent-text" href="account.html" data-nav-page="account"><i class="bi bi-person" aria-hidden="true"></i> Увійти</a></li>
            </ul>
          </nav>
          <div class="flex shrink-0 items-center gap-1">
            <button type="button" id="cart-open-btn" class="relative flex size-11 items-center justify-center rounded-control border border-border bg-surface text-text transition hover:-translate-y-0.5 hover:border-accent-text hover:shadow-md" aria-label="Кошик">
              <i class="bi bi-cart3 text-lg text-accent-text" aria-hidden="true"></i>
              <span id="cart-badge" class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-white">0</span>
            </button>
            <a class="flex size-11 items-center justify-center gap-1 rounded-control border border-border bg-surface text-text transition hover:-translate-y-0.5 hover:border-accent-text hover:shadow-md sm:w-auto sm:px-3 md:w-11 md:px-0 lg:w-auto lg:px-3" href="account.html" aria-label="Особистий кабінет" data-nav-page="account">
              <i class="bi bi-person text-lg" aria-hidden="true"></i>
              <span class="hidden text-sm font-semibold sm:inline md:hidden lg:inline">Увійти</span>
            </a>
            <button type="button" id="theme-toggle" class="flex size-11 items-center justify-center rounded-control border border-border bg-surface text-text transition hover:-translate-y-0.5 hover:border-accent-text hover:shadow-md" aria-label="Змінити тему">
              <i class="bi bi-sun" aria-hidden="true"></i>
            </button>
            <button type="button" id="menu-toggle" class="flex size-11 items-center justify-center rounded-control border border-border bg-surface text-text transition hover:-translate-y-0.5 hover:border-accent-text hover:shadow-md md:hidden" aria-controls="primary-navigation" aria-expanded="false" aria-label="Відкрити меню">
              <i class="bi bi-list text-xl" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </header>`;

    headerHost.querySelectorAll('[data-nav-page]').forEach(function (link) {
      if (link.dataset.navPage === page) link.setAttribute('aria-current', 'page');
    });
  }

  if (footerHost) {
    footerHost.innerHTML = `
      <footer id="footer-contacts" class="site-footer border-t border-border bg-section py-12">
        <div class="container-page">
          <div class="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h2 class="mb-3 text-xl font-bold text-text" id="footer-brand">MobiKOR</h2>
              <p class="mb-2 text-sm text-text-muted">Сервісний центр та магазин оригінальної техніки</p>
              <address class="mb-3 not-italic text-sm text-text-muted">Калинівка, Вінницька обл., вул. Незалежності, 49, автовокзал</address>
              <a href="https://www.google.com/maps/place/%D0%9C%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD+MobiKOR+%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D1%82+%D1%82%D0%B0+%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B6+%D0%BC%D0%BE%D0%B1%D1%96%D0%BB%D1%8C%D0%BD%D0%B8%D1%85+%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D1%96%D0%B2+%D0%9A%D0%B0%D0%BB%D0%B8%D0%BD%D1%96%D0%B2%D0%BA%D0%B0+%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D1%82+%D0%BA%D0%BE%D0%BC%D0%BF%D1%8E%D1%82%D0%B5%D1%80%D1%96%D0%B2/@49.4517449,28.5219571,17z/data=!3m1!4b1!4m6!3m5!1s0x472d1562dd1456b5:0x5cbb80b00bb0fbf2!8m2!3d49.4517449!4d28.524532!16s%2Fg%2F11gjxcx8g0?hl=uk-UA&amp;entry=ttu&amp;g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-sm text-link hover:underline">
                Переглянути на Google Maps <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
              </a>
            </div>
            <div>
              <h2 class="mb-4 text-sm font-bold uppercase tracking-widest text-text-muted">Навігація</h2>
              <ul class="m-0 list-none space-y-3 p-0 text-sm">
                <li><a href="repair.html">Послуги ремонту</a></li>
                <li><a href="shop.html">Магазин техніки</a></li>
                <li><a href="account.html">Відстежити квитанцію</a></li>
                <li><a href="#footer-contacts">Контакти / Зворотний зв'язок</a></li>
              </ul>
            </div>
            <div>
              <h2 class="mb-4 text-sm font-bold uppercase tracking-widest text-text-muted">Контакти</h2>
              <p class="mb-3"><a href="tel:+380983964147" class="text-sm font-medium">+38 (098) 396-41-47</a></p>
              <ul class="m-0 list-none space-y-2 p-0 text-sm">
                <li><a href="https://www.instagram.com/mobikor.ua?cplk=ODJndXF0dzQ3ZXZu" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1">Instagram <i class="bi bi-arrow-up-right" aria-hidden="true"></i></a></li>
                <li><a href="https://www.tiktok.com/@mobikor?_r=1&amp;_t=ZS-9AdCAi2yNQg" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1">TikTok <i class="bi bi-arrow-up-right" aria-hidden="true"></i></a></li>
                <li><a href="https://www.facebook.com/share/1DXXqAekvH/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1">Facebook <i class="bi bi-arrow-up-right" aria-hidden="true"></i></a></li>
              </ul>
            </div>
            <div>
              <h2 class="mb-4 text-sm font-bold uppercase tracking-widest text-text-muted">Графік роботи</h2>
              <ul class="m-0 list-none space-y-2 p-0 text-sm text-text-muted">
                <li>Пн–Пт: 09:00–18:00</li>
                <li>Сб: 09:00–18:00</li>
                <li>Нд: вихідний</li>
              </ul>
            </div>
          </div>
          <hr class="footer-divider">
          <div class="flex flex-col justify-between gap-2 text-sm text-text-muted sm:flex-row sm:items-center">
            <small>MobiKOR © All rights reserved.</small>
            <span>Сервіс та техніка для вашого комфорту</span>
          </div>
        </div>
      </footer>`;
  }

  var cartDrawer = document.createElement('div');
  cartDrawer.id = 'cart-drawer';
  cartDrawer.className = 'cart-drawer hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm justify-end';
  cartDrawer.setAttribute('aria-labelledby', 'cart-title');
  cartDrawer.setAttribute('aria-modal', 'true');
  cartDrawer.setAttribute('aria-hidden', 'true');
  cartDrawer.setAttribute('role', 'dialog');
  cartDrawer.innerHTML = `
    <div id="cart-drawer-panel" class="cart-drawer-panel w-full sm:max-w-md bg-surface border-l border-border h-full flex flex-col p-6 pb-[env(safe-area-inset-bottom)] shadow-2xl" tabindex="-1">
      <div class="flex items-center justify-between pb-4 border-b border-border">
        <h2 id="cart-title" class="text-h3 font-bold text-text flex items-center gap-2">
          <i class="bi bi-cart3 text-accent-text" aria-hidden="true"></i> Ваш кошик
        </h2>
        <button type="button" id="cart-close-btn" class="button flex h-11 w-11 items-center justify-center rounded-control text-text-muted hover:text-text" aria-label="Закрити кошик">
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      </div>
      <div id="cart-items-container" class="flex-grow overflow-y-auto py-4 space-y-3">
        <p class="text-sm text-text-muted text-center py-8">Кошик порожній. Оберіть потрібні товари з каталогу.</p>
      </div>
      <div class="pt-4 border-t border-border space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-text-muted">Загальна сума:</span>
          <span id="cart-total-price" class="text-xl font-bold text-accent-text">0 ₴</span>
        </div>
        <button type="button" class="button button--primary w-full" onclick="alert('Замовлення оформлено! Наш менеджер зателефонує вам для підтвердження доставки.'); window.closeCartDrawer();">
          Оформити замовлення <i class="bi bi-arrow-right" aria-hidden="true"></i>
        </button>
        <small class="block text-center text-sm text-text-muted">Безкоштовна доставка у відділення сервісу в Калинівці</small>
      </div>
    </div>`;
  document.body.appendChild(cartDrawer);
})();
