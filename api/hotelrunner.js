const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { guest_name, checkin, checkout } = req.body;

  const prompt = `Misafir adı: ${guest_name}, giriş: ${checkin}, çıkış: ${checkout}. Bu bilgiye uygun samimi ve profesyonel bir rezervasyon yanıtı oluştur.`;

  try {
    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }]
  })
});

    const data = await gptRes.json();
    const reply = data.choices?.[0]?.message?.content || "Cevap alınamadı.";

    return res.status(200).json({ success: true, reply });

  } catch (error) {
    console.error("ChatGPT çağrısında hata:", error);
    return res.status(500).json({ success: false, error: "ChatGPT çağrısında hata." });
  }
};
