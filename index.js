import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-proj-xJzafClO9P64ENiNG8DDT3BlbkFJdaoAM08mSCFnavPP4htp',
  apiKey: process.env['sk-proj-xJzafClO9P64ENiNG8DDT3BlbkFJdaoAM08mSCFnavPP4htp'],
});

const createChatCompletion = async () => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Who won the world series in 2020?' },
        { role: 'assistant', content: 'The Los Angeles Dodgers won the World Series in 2020.' },
        { role: 'user', content: 'Where was it played?' },
        { role: 'assistant', content: 'The World Series was played in Arlington, Texas at the Globe Life Field.' },
      ],
    });

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('Error creating chat completion:', error);
  }
};

createChatCompletion();