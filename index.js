const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// عرض الصفحة الرئيسية عند الدخول على /
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// إعداد مفتاح OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// نقطة استقبال السؤال
app.post('/ask', async (req, res) => {
  const question = req.body.question;
  const finalPrompt = `أجب كخبير قانوني يمني معتمد، لا تخرج عن القوانين اليمنية. السؤال: ${question}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: finalPrompt }],
    });

    res.json({ answer: response.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ answer: '❌ حدث خطأ أثناء الاتصال بـ GPT. حاول لاحقًا.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
