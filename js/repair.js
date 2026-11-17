// =====================================================================
// Калькулятор ремонту MobiKOR.
// Число ціни рахує ЦЕЙ КОД за data/pricing.json (без вигадок).
// ШІ (функція explain) лише пояснює вже порахований результат.
// =====================================================================
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var form = $('calc-form'), categorySel = $('calc-category'), brandIn = $('calc-brand'),
      modelIn = $('calc-model'), partSel = $('calc-damage'), status = $('calc-status'),
      box = $('calc-result-container'), titleEl = $('calc-result-title'), priceEl = $('calc-result-price'),
      timeEl = $('calc-result-time').querySelector('span'), breakdownEl = $('calc-result-breakdown'),
      aiEl = $('calc-ai'), btnAI = $('btn-ai'), linkProm = $('link-prom'),
      linkAli = $('link-ali'), shops = $('calc-shops');

  var pricing = null;
  var currentAIRequest = null;
  var aiRequestInProgress = false;

  function say(text) { status.textContent = text || ''; status.hidden = !text; }
  function money(n) { return Number(n).toLocaleString('uk-UA') + ' ₴'; }
  function roundTo(n) { var s = pricing.rounding || 50; return Math.round(n / s) * s; }

  // 1) Вантажимо таблицю цін
  fetch('data/pricing.json')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) { pricing = data; })
    .catch(function () {
      say('Не вдалося завантажити дані калькулятора. Напишіть нам — порахуємо вручну.');
      categorySel.disabled = true;
    });

  // 2) Крок «категорія»: вмикаємо бренд/модель і наповнюємо список ремонтів
  categorySel.addEventListener('change', function () {
    hideResult();
    var cat = pricing && pricing.categories[categorySel.value];
    brandIn.value = modelIn.value = '';
    partSel.innerHTML = '<option value="" disabled selected>Оберіть тип пошкодження</option>';
    if (!cat) {
      brandIn.disabled = modelIn.disabled = partSel.disabled = true;
      say('Для цієї категорії напишіть нам — розрахуємо індивідуально.');
      return;
    }
    say('');
    brandIn.disabled = modelIn.disabled = partSel.disabled = false;
    cat.parts.forEach(function (id) {
      var o = document.createElement('option');
      o.value = id; o.textContent = pricing.parts[id].name;
      partSel.appendChild(o);
    });
  });

  // Змінили будь-що — старий результат ховаємо
  [brandIn, modelIn, partSel].forEach(function (el) { el.addEventListener('input', hideResult); });
  function hideResult() { box.classList.add('hidden'); }

  // 3) Рахуємо
  function estimate(catId, partId) {
    var cat = pricing.categories[catId], part = pricing.parts[partId];
    if (part.free) return { free: true, part: part };
    var range = part.price[catId];
    var labor = part.hours * pricing.hourlyRate * (cat.hoursFactor || 1);
    return {
      part: part, partMin: range[0], partMax: range[1], hours: part.hours, labor: roundTo(labor),
      min: roundTo(range[0] + labor), max: roundTo(range[1] + labor)
    };
  }

  // 4) Посилання на пошук деталі
  function slug(s) { return s.toLowerCase().trim().split(/\s+/).map(encodeURIComponent).join('-'); }
  function buildLinks(brand, model, part) {
    var qUa = encodeURIComponent((brand + ' ' + model + ' ' + part.ua).trim());
    var qEn = slug(brand + ' ' + model + ' ' + part.en);
    linkProm.href = pricing.marketplaces.prom.replace('{q}', qUa);
    linkAli.href = pricing.marketplaces.ali.replace('{q}', qEn);
  }

  // 5) Пояснення від ШІ (необов'язкове: якщо не вийшло — заглушка)
  var FALLBACK = 'Це орієнтовна оцінка: ціна деталі залежить від якості й наявності, а робота — від часу майстра. Точну суму майстер назве після безкоштовної діагностики.';
  function askAI(payload) {
    if (!payload || aiRequestInProgress) return;
    aiRequestInProgress = true;
    btnAI.disabled = true;
    btnAI.setAttribute('aria-busy', 'true');

    return fetch('/.netlify/functions/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (d) {
        if (currentAIRequest !== payload) return;
        aiEl.textContent = d.text || FALLBACK;
      })
      .catch(function (error) {
        console.error('AI explanation request failed.', error);
        if (currentAIRequest === payload) aiEl.textContent = FALLBACK;
      })
      .then(function () {
        aiRequestInProgress = false;
        btnAI.disabled = false;
        btnAI.removeAttribute('aria-busy');
      });
  }

  btnAI.addEventListener('click', function () {
    askAI(currentAIRequest);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!pricing) return;
    var brand = brandIn.value.trim(), model = modelIn.value.trim();
    if (!categorySel.value || !brand || !model || !partSel.value) { say('Заповніть усі поля.'); return; }
    say('');
    var est = estimate(categorySel.value, partSel.value);
    var device = brand + ' ' + model;

    titleEl.textContent = est.part.name + ' · ' + device;
    timeEl.textContent = 'Термін: ' + est.part.time;
    if (est.free) {
      priceEl.textContent = 'Безкоштовно';
      breakdownEl.textContent = 'Діагностика перед будь-яким ремонтом не коштує нічого.';
      shops.classList.add('hidden');
      btnAI.classList.add('hidden');
      currentAIRequest = null;
      aiEl.textContent = 'Діагностика безкоштовна. Щоб дізнатися вартість ремонту, потрібна діагностика пристрою майстром.';
    } else {
      priceEl.textContent = money(est.min) + ' – ' + money(est.max);
      breakdownEl.textContent = 'Деталь ' + money(est.partMin) + '–' + money(est.partMax) + ' + робота ' + money(est.labor) + ' (' + est.hours + ' год майстра).';
      buildLinks(brand, model, est.part);
      shops.classList.remove('hidden');
      btnAI.classList.remove('hidden');
      aiEl.textContent = FALLBACK;
      currentAIRequest = {
        device: device,
        part: est.part.name,
        partMin: est.partMin,
        partMax: est.partMax,
        hours: est.hours,
        rate: pricing.hourlyRate,
        labor: est.labor,
        min: est.min,
        max: est.max
      };
    }
    box.classList.remove('hidden');
  });
})();
