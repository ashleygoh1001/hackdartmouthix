import OpenAI from 'openai'; // Correct
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // Import the dotenv package to load environment variables

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Use cors middleware to allow all origins

const openai = new OpenAI({ apiKey: 'sk-proj-Oiz6wiNJczjSzeMEu0ANT3BlbkFJPzXNYITGEohuHLyObo9O' });

const categories = ['math', 'science', 'art', 'history', 'english', 'business/finance', 'engineering', 'computer science', 'foreign language', 'government and politics', 'miscellaneous'];

app.post('/generate-content', async (req, res) => {
  const { topic, detailLevel } = req.body;
  let category = null;
  // get topic
  console.error('Request Body:', req.body); // Log incoming request body
  try {
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `classify ${topic} as only one of the following categories: ${categories.join(', ')}`,
      max_tokens: 50,
    });
    console.error('OpenAI Response:', response); // Log API response data
    if (response && response.choices && response.choices.length > 0) {
      console.log(response.choices[0].text);
      category = response.choices[0].text;
    } else {
      console.error('No completion choices found in the response.');
      console.log('Completion Response:', response);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error generating content', detailedError: error.message });
  }
  // get info
  if (category) {
    console.error('Request Body:', req.body); // Log incoming request body
    try {
      const response = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        prompt: `You are a helpful assistant providing detailed educational content. Explain the topic ${topic} in a lesson plan specific for active learning for ${category} type teaching.`,
        max_tokens: 400,
      });
      console.error('OpenAI Response:', response); // Log API response data

      res.json({ lessonContent: response.choices[0].text });
      console.error('OpenAI Response:', response.choices[0].text); // Log API response data
    } catch (error) {
      res.status(500).json({ message: 'Error generating content', detailedError: error.message });
      console.error('OpenAI API Error:', error.message); // Detailed API error
    }
  }
});

const PORT = process.env.PORT || 5172;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
