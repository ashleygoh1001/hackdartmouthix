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

// Determine which category the topic falls under
const categories = ['math', 'science', 'art', 'history', 'english', 'business/finance', 'engineering', 'computer science', 'foreign language', 'government and politics', 'miscellaneous'];

// Outline the pedagogy method for [0] < 20 min, [1] 20 min - 1 hr, [2] 1 hr - 3 hr, [3] > 3 hr
const pedagogyMap = {
  math: ["Khan Academy", "Peer Instruction", "Differentiated Instruction", "Project-based Learning"],
  science: ["Khan Academy", "Small Group Discussion", "Inquiry-based Learning", "Project-based Model or Inquiry-based Model"],
  art: ["Khan Academy", "Peer Instruction", "Differentiated Instruction", "Project-based Learning"],
  history: ["Khan Academy", "Differentiated Instruction", "Peer Instruction", "Project-based Learning"],
  english: ["Khan Academy", "Peer Instruction", "Differentiated Instruction", "Project-based Learning"],
  'business/finance': ["Khan Academy", "Peer Instruction", "Inquiry-based Instruction through Case Studies", "Project-based Learning"],
  engineering: ["Khan Academy", "Peer Instruction", "Inquiry-based Instruction", "Project-based Learning"],
  'computer science': ["Khan Academy", "Peer Instruction", "Project-based Learning", "Project-based Learning"],
  'foreign language': ["Khan Academy", "Peer Instruction", "Differentiated Instruction", "Project-based Learning"],
  'government and politics': ["Khan Academy", "Peer Instruction", "Inquiry-based Instruction through Case Studies", "Project-based Learning"],
  miscellaneous: ["Pedagogical Model", "Pedagogical Model", "Pedagogical Model", "Pedagogical Model"],
};

app.post('/generate-content', async (req, res) => {
  const { topic, students, duration } = req.body; // Assuming detailLevel is now handled within each prompt for specificity

  let category = 'miscellaneous'
  let pedagogy
  // classify the topic into a category
  try {
    const result = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `classify ${topic} as only one of the following categories: ${categories.join(', ')}`,
      max_tokens: 150,
    });
    if (result && result.choices && result.choices.length > 0) {
      category = result.choices[0].text.trim().toLowerCase();
      // get pedagogy
      if (categories.includes(category)) {
        pedagogy = pedagogyMap[category]
      }
    }
  } catch (error) {
    console.error(`Failed to classify category for ${topic}:`, error);
    return res.status(500).json({ message: `Failed to classify category for ${topic}`, detailedError: error.message });
  }

  console.log("category", category);
  console.log("pedagogy", pedagogy);
  
  // find duration things
  if (duration === '20') {
    pedagogy = pedagogy[0]
  } else if (duration === '60') {
    pedagogy = pedagogy[1]
  } else if (duration === '120') {
    pedagogy = pedagogy[2]
  } else {
    pedagogy = pedagogy[3]
  }

  console.log("pedagogy-specific", pedagogy);

  // Define specific prompts for different sections of the lesson plan
  const prompts = [
    { key: 'overview', prompt: `Succinctly describe a ${pedagogy} pedagogical learning model for ${topic} for ${students} students.`, tokens: 200 },
    { key: 'objectives', prompt: `List the key objectives for that learning model about ${topic}.`, tokens: 100 },
    { key: 'materials', prompt: `List the materials needed for that learning model on ${topic}.`, tokens: 100 },
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
