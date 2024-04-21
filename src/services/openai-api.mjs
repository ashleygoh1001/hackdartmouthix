/* eslint-disable */
import OpenAI from 'openai'; // Ensure OpenAI SDK is correctly imported
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/generate-content', async (req, res) => {
  const { topic } = req.body; // Assuming detailLevel is now handled within each prompt for specificity

  // Define specific prompts for different sections of the lesson plan
  const prompts = [
    { key: 'overview', prompt: `Give a brief overview of ${topic}.`, tokens: 60 },
    { key: 'objectives', prompt: `List the key objectives when learning about ${topic}.`, tokens: 100 },
    { key: 'materials', prompt: `Enumerate the materials needed for a lesson on ${topic}.`, tokens: 100 },
    { key: 'activity', prompt: `Describe an interactive activity related to ${topic}.`, tokens: 150 },
    { key: 'assessment', prompt: `Suggest methods for assessing knowledge on ${topic}.`, tokens: 80 },
  ];

  const results = {};

  for (let i = 0; i < prompts.length; i++) {
    try {
      const response = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        prompt: prompts[i].prompt,
        max_tokens: prompts[i].tokens,
        temperature: 0.2, // Lower temperature means more focused and concise text
      });
      if (response && response.choices && response.choices.length > 0 && response.choices[0].text) {
        results[prompts[i].key] = response.choices[0].text.trim();
      } else {
        throw new Error('No valid response for the prompt');
      }
    } catch (error) {
      console.error(`Failed to generate content for ${prompts[i].key}:`, error);
      return res.status(500).json({ message: `Error generating content for ${prompts[i].key}`, detailedError: error.message });
    }
  }

  res.json(results);
});

const PORT = process.env.PORT || 5172;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
