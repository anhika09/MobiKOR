// ---------- 9. Калькулятор вартості ремонту на repair.html ----------
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
