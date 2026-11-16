// Серверна функція Netlify: ховає ключ LLM від браузера.
// Змінні середовища (Netlify → Site settings → Environment variables):
//   LLM_KEY, LLM_BASE_URL (напр. https://api.groq.com/openai/v1), LLM_MODEL
exports.handler = async (event) => {
  const reply = (text) => ({ statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
  try {
    const d = JSON.parse(event.body || '{}');
    const num = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0);   
    const str = (x) => String(x || '').slice(0, 80);
    const prompt =
`Ти асистент сервісного центру MobiKOR. Не вигадуй цін — використовуй ЛИШЕ ці числа.
Пристрій: ${str(d.device)}. Ремонт: ${str(d.part)}.
Деталь: ${num(d.partMin)}–${num(d.partMax)} ₴. Робота: ${num(d.hours)} год × ${num(d.rate)} ₴ = ${num(d.labor)} ₴.
Разом орієнтовно: ${num(d.min)}–${num(d.max)} ₴.
Поясни клієнту українською, коротко (до 4 речень): з чого складається ціна, чому діапазон широкий,
і порадь наступний крок (подивитись ціни на деталь або залишити заявку). Нагадай, що точну суму назве майстер після діагностики.`;

    const r = await fetch(process.env.LLM_BASE_URL + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.LLM_KEY },
      body: JSON.stringify({ model: process.env.LLM_MODEL, max_tokens: 250, messages: [{ role: 'user', content: prompt }] })
    });
    if (!r.ok) return reply(null);
    const data = await r.json();
    return reply(data.choices?.[0]?.message?.content || null);
  } catch (e) {
    return reply(null);          
  }
};
