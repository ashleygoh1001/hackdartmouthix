import OpenAI from 'openai'; // Ensure OpenAI SDK is correctly imported
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pipeline } from 'stream';
import { promisify } from 'util';

// cool pdf moment wowow

import PDFDocument from 'pdfkit';
import fs from 'fs';

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
      const response = openai.completions.create({
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

const cleanContent = (content) => {
  // Improved regex that precisely targets the Markdown code block for JSON
  const cleanedContent = content.replace(/```json\n([\s\S]*?)\n```/g, '$1');
  return cleanedContent;
};

function generatePDF(chatGPTOutput, res) {
  // Extract the JSON content from the request
  const content = chatGPTOutput;

  try {
    const cleanedContent = cleanContent(content);
    const jsonData = JSON.parse(cleanedContent);
    const { lessonPlan } = jsonData;

    if (!lessonPlan) {
      throw new Error('Lesson plan data is missing');
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="LessonPlan.pdf"');

    doc.pipe(res);

    // Set general document styling from the lesson plan's style settings
    const { colors, typography, layout } = lessonPlan.style;
    doc.font(typography.fontFamily || 'Helvetica');
    doc.fontSize(typography.fontSize || 12);
    doc.lineGap(typography.lineHeight || 5);

    // Document title
    doc.fillColor(colors.primary || 'black');
    doc.text('Lesson Plan', { align: 'center', underline: true });
    doc.moveDown();

    // Overview section
    doc.fillColor(colors.secondary || 'black');
    doc.text('Overview:', { underline: true });
    doc.text(lessonPlan.overview.text, {
      align: 'justify',
      indent: 40,
      continued: false,
    });
    doc.moveDown();

    // Objectives section
    doc.text('Objectives:', { underline: true });
    Object.keys(lessonPlan.objectives).forEach((key) => {
      const objective = lessonPlan.objectives[key];
      doc.text(`${objective.title}: ${objective.description}`, {
        indent: 40,
        align: 'justify',
        continued: false,
      });
      doc.moveDown(0.5);
    });

    // Materials Needed section
    doc.text('Materials Needed:', { underline: true });
    lessonPlan.materialsNeeded.forEach((item) => {
      doc.text(`- ${item}`, { indent: 40 });
    });
    doc.moveDown();

    // Activities section
    doc.text('Activities:', { underline: true });
    doc.text(lessonPlan.activities.description, {
      indent: 40,
      align: 'justify',
    });
    if (lessonPlan.activities.details) {
      doc.text(`Setting: ${lessonPlan.activities.details.setting}`, { indent: 60 });
      doc.text(`Participation: ${lessonPlan.activities.details.participation}`, { indent: 60 });
      doc.text(`Interaction: ${lessonPlan.activities.details.interaction}`, { indent: 60 });
      doc.text(`Learning: ${lessonPlan.activities.details.learning}`, { indent: 60 });
    }
    doc.moveDown();

    // Assessment Methods section
    doc.text('Assessment Methods:', { underline: true });
    lessonPlan.assessmentMethods.forEach((method) => {
      doc.text(`${method.method}: ${method.description}`, {
        indent: 40,
        align: 'justify',
      });
      doc.moveDown(0.5);
    });

    doc.end(); // Finalize the PDF and end the stream
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    res.status(500).send(`Failed to generate PDF: ${error.message}`);
  }
}

app.post('/generate-pdf', async (req, res) => {
  const { text } = req.body;
  // Using GPT-4 to stylize text and structure it for a PDF
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a educational assistant, skilled in explaining complex topics in an understandable way. Your prupose is to generate high quality professional educational content that is clean, modern, and stylish.' },
        { role: 'user', content: `Convert the following text:" ${text} " to a beautifully styled, clean, colored, and professional JSON object with style attributes for each section.` },
      ],
    });
    if (!response.choices[0].message) throw new Error('No content returned by OpenAI.');

    console.error('Response:', response.choices[0].message);
    generatePDF(response, res);
  } catch (error) {
    console.error('Error processing PDF generation:', error);
    res.status(500).json({ message: 'Failed to generate PDF', detailedError: error.message });
  }
});

const PORT = process.env.PORT || 5172;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
