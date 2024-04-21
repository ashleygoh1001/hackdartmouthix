import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  try {
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: "teach me how to make a paper airplane",
      max_tokens: 150,
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
}

main();
