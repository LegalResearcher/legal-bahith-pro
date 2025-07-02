const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/ask', async (req, res) => {
  const question = req.body.question;
  const finalPrompt = `أجب كخبير قانوني يمني معتمد، لا تخرج عن القوانين اليمنية. السؤال: ${question}`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: finalPrompt }],
    });

    res.json({ answer: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("🔴 GPT Error:", error);  // ← هذا السطر يعرض الخطأ في لوحة Render
    res.status(500).json({ answer: 'حدث خطأ أثناء الاتصال بـ GPT. حاول لاحقًا.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
