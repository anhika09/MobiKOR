// ---------- 8. Інтерактивний Кошик (Cart Slide-over) ----------
(function () {
  var openBtn = document.getElementById('cart-open-btn');
  var closeBtn = document.getElementById('cart-close-btn');
  var drawer = document.getElementById('cart-drawer');
  var panel = document.getElementById('cart-drawer-panel');
  var container = document.getElementById('cart-items-container');
  var totalEl = document.getElementById('cart-total-price');
  var badge = document.getElementById('cart-badge');
  var closeTimer = null;
  var previousOverflow = '';

  function readCart() {
    try {
      var stored = localStorage.getItem('mobikor-cart');
      if (!stored) return [];
      var parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) throw new TypeError('Stored cart is not an array.');
      return parsed.filter(function (item) {
        return item && (typeof item.id === 'string' || typeof item.id === 'number') &&
          typeof item.name === 'string' && Number.isFinite(item.price) &&
          Number.isInteger(item.quantity) && item.quantity > 0;
      });
    } catch (error) {
      console.error('Cart data could not be loaded.', error);
      return [];
    }
  }

  var cart = readCart();

  function saveCart() {
    try {
      localStorage.setItem('mobikor-cart', JSON.stringify(cart));
    } catch (error) {
      console.warn('Cart data could not be saved.', error);
    }
  }

  function updateCartUI() {
    var quantityTotal = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
    if (badge) {
      badge.textContent = String(quantityTotal);
      badge.setAttribute('aria-label', 'Кошик, товарів: ' + quantityTotal);
    }
    if (!container) return;

    if (cart.length === 0) {
      var emptyMessage = document.createElement('p');
      emptyMessage.className = 'text-sm text-text-muted text-center py-8';
      emptyMessage.textContent = 'Кошик порожній. Оберіть потрібні товари з каталогу.';
      container.replaceChildren(emptyMessage);
      if (totalEl) totalEl.textContent = '0 ₴';
      return;
    }

    var total = 0;
    var rows = cart.map(function (item) {
      total += item.price * item.quantity;
      var row = document.createElement('div');
      row.className = 'flex items-center justify-between gap-3 rounded-control border border-border bg-surface-raised p-3';

      var productInfo = document.createElement('div');
      productInfo.className = 'min-w-0 flex-1';
      var name = document.createElement('h3');
      name.className = 'truncate text-sm font-bold text-text';
      name.textContent = item.name;
      var price = document.createElement('p');
      price.className = 'm-0 text-sm font-bold text-accent-text';
      price.textContent = item.price.toLocaleString('uk-UA') + ' ₴';
      productInfo.append(name, price);

      var controls = document.createElement('div');
      controls.className = 'flex items-center gap-1';
      [['decrease', '−', 'Зменшити кількість'], ['increase', '+', 'Збільшити кількість']].forEach(function (control) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'button button--secondary button--sm';
        button.setAttribute('data-cart-action', control[0]);
        button.setAttribute('data-id', String(item.id));
        button.setAttribute('aria-label', control[2] + ': ' + item.name);
        button.textContent = control[1];
        controls.appendChild(button);
        if (control[0] === 'decrease') {
          var count = document.createElement('span');
          count.className = 'min-w-8 text-center text-sm font-semibold text-text';
          count.textContent = String(item.quantity);
          controls.appendChild(count);
        }
      });

      var removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'button button--secondary button--sm';
      removeButton.setAttribute('data-cart-action', 'remove');
      removeButton.setAttribute('data-id', String(item.id));
      removeButton.setAttribute('aria-label', 'Видалити з кошика: ' + item.name);
      var removeIcon = document.createElement('i');
      removeIcon.className = 'bi bi-trash';
      removeIcon.setAttribute('aria-hidden', 'true');
      removeButton.appendChild(removeIcon);

      row.append(productInfo, controls, removeButton);
      return row;
    });

    container.replaceChildren.apply(container, rows);
    if (totalEl) totalEl.textContent = total.toLocaleString('uk-UA') + ' ₴';
  }

  function openCart() {
    if (!drawer) return;
    if (closeTimer) window.clearTimeout(closeTimer);
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawer.classList.remove('hidden');
    drawer.setAttribute('aria-hidden', 'false');
    window.requestAnimationFrame(function () { drawer.classList.add('is-open'); });
    if (closeBtn) closeBtn.focus();
  }

  function closeCart() {
    if (!drawer || drawer.classList.contains('hidden')) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousOverflow;
    closeTimer = window.setTimeout(function () {
      drawer.classList.add('hidden');
      closeTimer = null;
    }, 300);
    if (openBtn) openBtn.focus();
  }

  window.closeCartDrawer = closeCart;

  if (openBtn) openBtn.addEventListener('click', openCart);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (drawer) {
    drawer.addEventListener('click', function (event) {
      if (event.target === drawer) closeCart();
    });

    document.addEventListener('keydown', function (event) {
      if (!drawer.classList.contains('is-open')) return;
      if (event.key === 'Escape') {
        closeCart();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      var focusable = Array.from(panel.querySelectorAll('a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) {
        event.preventDefault();
        panel.focus();
        return;
      }
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  if (container) {
    container.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-cart-action]');
      if (!button) return;
      var id = button.getAttribute('data-id');
      var item = cart.find(function (entry) { return String(entry.id) === id; });
      if (!item) return;

      var action = button.getAttribute('data-cart-action');
      if (action === 'increase') item.quantity += 1;
      else if (action === 'decrease') {
        item.quantity -= 1;
        if (item.quantity <= 0) cart = cart.filter(function (entry) { return entry !== item; });
      } else if (action === 'remove') cart = cart.filter(function (entry) { return entry !== item; });
      saveCart();
      updateCartUI();
    });
  }

  document.querySelectorAll('.btn-add-to-cart').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-id');
      var name = btn.getAttribute('data-name');
      var price = parseFloat(btn.getAttribute('data-price')) || 0;
      var existing = cart.find(function (item) { return String(item.id) === id; });
      if (existing) existing.quantity += 1;
      else cart.push({ id: id, name: name, price: price, quantity: 1 });
      saveCart();
      updateCartUI();
      openCart();
    });
  });

  updateCartUI();
})();
