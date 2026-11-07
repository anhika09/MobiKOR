// ---------- Калькулятор вартості ремонту на repair.html ----------
(function () {
  var form = document.getElementById('calc-form') || document.querySelector('#repair-calc form');
  var catSelect = document.getElementById('calc-category');
  var brandSelect = document.getElementById('calc-brand');
  var modelSelect = document.getElementById('calc-model');
  var damageSelect = document.getElementById('calc-damage');
  var resultContainer = document.getElementById('calc-result-container');
  var resultTitle = document.getElementById('calc-result-title');
  var resultPrice = document.getElementById('calc-result-price');
  var resultTime = document.getElementById('calc-result-time');

  if (!damageSelect) return;

  var priceMap = {
    'Заміна екрана': { price: '1 800 ₴', time: '~45 хв' },
    'Заміна акумулятора': { price: '950 ₴', time: '~30 хв' },
    'Ремонт плати / чистка': { price: '1 200 ₴', time: '1–2 дні' },
    'Заміна роз\'єму зарядки': { price: '650 ₴', time: '~40 хв' },
    'Відновлення після води': { price: '1 400 ₴', time: '1–3 дні' },
    'Комплексна діагностика': { price: '0 ₴ (Безкоштовно)', time: '~20 хв' }
  };

  function updateCalc(showResult) {
    var damage = damageSelect.value;
    var model = modelSelect ? modelSelect.value.trim() : '';
    var brand = brandSelect ? brandSelect.value : '';

    if (!damage) {
      if (resultContainer && !showResult) resultContainer.classList.add('hidden');
      return;
    }

    var info = priceMap[damage] || { price: '1 500 ₴', time: '~1 год' };
    var titleText = damage;
    if (model) {
      titleText += ' · ' + model;
    } else if (brand) {
      titleText += ' · ' + brand;
    }

    if (resultTitle) resultTitle.textContent = titleText;
    if (resultPrice) resultPrice.textContent = info.price;
    if (resultTime) {
      resultTime.innerHTML = '<i class="bi bi-clock" aria-hidden="true"></i> <span>' + info.time + '</span>';
    }

    if (resultContainer && showResult) {
      resultContainer.classList.remove('hidden');
    }
  }

  [catSelect, brandSelect, damageSelect].forEach(function (el) {
    if (el) {
      el.addEventListener('change', function () {
        if (damageSelect.value) {
          updateCalc(true);
        }
      });
    }
  });

  if (modelSelect) {
    modelSelect.addEventListener('input', function () {
      if (damageSelect.value) {
        updateCalc(true);
      }
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!damageSelect.value) {
        alert('Будь ласка, оберіть тип пошкодження для розрахунку.');
        damageSelect.focus();
        return;
      }
      updateCalc(true);
      if (resultContainer) {
        resultContainer.classList.remove('hidden');
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
})();
