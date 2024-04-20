import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import readline from 'readline';

dotenv.config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Determine which category the topic falls under - math, science, art, history, english, business/finance, engineering, computer science, or foreign language
const categories = ['math', 'science', 'art', 'history', 'english', 'business/finance', 'engineering', 'computer science', 'foreign language', 'government and politics', 'miscellaneous'];

async function main() {
  try {
    rl.question("Enter a topic you want to learn about: ", async (topic) => {
      try {
        const completion = await openai.completions.create({
          model: "gpt-3.5-turbo-instruct",
          prompt: `classify ${topic} as only one of the following categories: ${categories.join(', ')}`,
          max_tokens: 150
        });
        if (completion && completion.choices && completion.choices.length > 0) {
          console.log(completion.choices[0].text);
        } else {
          console.error("No completion choices found in the response.");
          console.log("Completion Response:", completion);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
      rl.close();
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();