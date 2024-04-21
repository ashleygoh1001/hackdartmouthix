import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import readline from 'readline';

dotenv.config()

// Get the OpenAI API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Create a readline interface to read user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
  miscellaneous: ["Pedagogical Model", "Pedagogical Model", "Pedagogical Model", "Pedagogical Model"]
};

function getCategory() {
  return new Promise((resolve, reject) => {
    rl.question("Enter a topic you want to learn about: ", async (topic) => {
      try {
        const completion = await openai.completions.create({
          model: "gpt-3.5-turbo-instruct",
          prompt: `classify ${topic} as only one of the following categories: ${categories.join(', ')}`,
          max_tokens: 150
        });
        if (completion && completion.choices && completion.choices.length > 0) {
          let category = completion.choices[0].text.trim().toLowerCase();
          if (categories.includes(category)) {
            resolve({ category, pedagogy: pedagogyMap[category].join(', ') });
          } else {
            reject(new Error("Invalid category received."));
          }
        } else {
          reject(new Error("No completion choices found in the response."));
        }
      } catch (error) {
        reject(error);
      } finally {
        rl.close();
      }
    });
  });
}

async function main() {
  try {
    const { category, pedagogy } = await getCategory();
    console.log(`Category: ${category}`);
    console.log(`Pedagogy: ${pedagogy}`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
