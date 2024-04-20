import OpenAI from 'openai'; // Correct
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // Import the dotenv package to load environment variables

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Use cors middleware to allow all origins

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/generate-content', async (req, res) => {
  const { topic, detailLevel } = req.body;
  console.error('Request Body:', req.body); // Log incoming request body
  try {
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `You are a helpful assistant providing detailed educational content. Explain the topic ${topic} in detail level ${detailLevel}.`,
      max_tokens: 400,
    });
    console.error('OpenAI Response:', response); // Log API response data

    res.json({ lessonContent: response.choices[0].text });
    console.error('OpenAI Response:', response.choices[0].text); // Log API response data
  } catch (error) {
    console.error('OpenAI API Error:', error.message); // Detailed API error
    res.status(500).json({ message: 'Error generating content', detailedError: error.message });
  }
});

const PORT = process.env.PORT || 5172;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
