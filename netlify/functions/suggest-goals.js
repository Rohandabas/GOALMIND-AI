const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const { prompt } = JSON.parse(event.body);
  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Prompt is required' }),
    };
  }

  try {
    if (!process.env.GEMINI_KEY) {
      throw new Error('GEMINI_KEY environment variable is missing');
    }

    console.log('Initializing GoogleGenerativeAI with GEMINI_KEY:', process.env.GEMINI_KEY ? 'Found' : 'Not Found');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.1,  // Lower temperature for more deterministic output
        topK: 1,          // Limit to top 1 token for stricter output
        topP: 0.1,        // Lower probability for stricter output
        maxOutputTokens: 512, // Reduce to ensure concise JSON
      },
    });

    console.log('Generating content with prompt:', prompt);
    const promptText = 'Suggest 3 concise, actionable, and specific goals based on this prompt: "' + prompt + '". Output ONLY a raw JSON array of strings, e.g., ["Goal 1", "Goal 2", "Goal 3"], without any additional formatting, markdown, or text. Do not include ```json or any other wrappers.';
    const result = await model.generateContent(promptText);
    console.log('Raw Gemini response:', result.response.text());

    // Clean the response to remove any potential Markdown or extra whitespace
    let cleanedResponse = result.response.text().trim();
    if (cleanedResponse.startsWith('```json') && cleanedResponse.endsWith('```')) {
      cleanedResponse = cleanedResponse.slice(7, -3).trim(); // Remove ```json and ```
    }
    // Remove any other common Markdown or text wrappers
    cleanedResponse = cleanedResponse.replace(/^\s*\/\/.*$/gm, '').replace(/^\s*\/\*.*?\*\//gs, '').trim();

    console.log('Cleaned Gemini response:', cleanedResponse);
    const suggestions = JSON.parse(cleanedResponse) || ['Complete a small task today', 'Take a 10-minute walk', 'Plan tomorrow’s goals'];

    return {
      statusCode: 200,
      body: JSON.stringify({ suggestions }),
    };
  } catch (error) {
    console.error('Error in suggest-goals:', error.message, error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error: ' + error.message }),
    };
  }
};