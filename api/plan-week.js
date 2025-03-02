import { GoogleGenerativeAI } from '@google/generative-ai';

// Try ESM import, fall back to CommonJS require for dotenv
let dotenv;
try {
  dotenv = await import('dotenv');
} catch (e) {
  dotenv = require('dotenv');
}
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { summary } = req.body;
  if (!summary) {
    return res.status(400).json({ error: 'Weekly goal summary is required' });
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

    console.log('Generating content with summary:', summary);
    const promptText = 'Create a weekly schedule based on this summary: "' + summary + '". Output ONLY a raw JSON object with days (Monday to Saturday) as keys and arrays of goal objects (e.g., { text: "Goal", category: "Category" }), e.g., { "Monday": [{ text: "Exercise", category: "Health" }] }, without any additional formatting, markdown, or text. Do not include ```json or any other wrappers.';
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
    const weeklyPlan = JSON.parse(cleanedResponse) || {
      Monday: [{ text: 'Exercise 20 min', category: 'Health' }],
      Tuesday: [{ text: 'Work 1 hour', category: 'Work' }],
      Wednesday: [{ text: 'Study notes', category: 'Learning' }],
      Thursday: [{ text: 'Complete project', category: 'Work' }],
      Friday: [{ text: 'Finish reading book', category: 'Learning' }],
      Saturday: [{ text: 'Outdoor activity', category: 'Health' }],
    };

    res.status(200).json({ weeklyPlan });
  } catch (error) {
    console.error('Error in plan-week:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}