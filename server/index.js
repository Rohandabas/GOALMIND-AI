const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware for logging and authentication
app.use((req, res, next) => {
  console.log("---- Incoming Request ----");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));

  const providedKey = req.headers["x-api-key"] || process.env.API_SECRET; // Optional client key or server secret
  if (providedKey === process.env.API_SECRET) {
    console.log("✅ API Key Matched");
    next();
  } else {
    console.error("❌ API Key Mismatch - Forbidden Access");
    res.status(403).json({ error: "Forbidden - Invalid API Key" });
  }
});

console.log("Server is starting...");
console.log(`PORT: ${port}`);
console.log(`API SECRET: ${process.env.API_SECRET ? "Loaded" : "Missing"}`);
console.log(`GEMINI API KEY: ${process.env.GEMINI_KEY ? "Loaded" : "Missing"}`);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
});

async function getGoalSuggestions(prompt) {
  console.log("LOG: Calling Gemini AI with prompt:", prompt);
  try {
    const result = await model.generateContent(
      `Based on the user’s plan: "${prompt}", suggest 3 specific, achievable daily goals related to this plan. Consider entertainment, dining, and learning activities. Keep responses concise and actionable (under 100 characters each). Return in JSON format, e.g., [{ text: 'string' }, { text: 'string' }, { text: 'string' }].`
    );
    const responseText = result.response.text();
    console.log("LOG: Raw response from Gemini:", responseText);
    let suggestions;
    try {
      suggestions = JSON.parse(responseText.replace(/```json\n|\n```/g, '').trim());
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
    console.log("LOG: Parsed suggestions:", suggestions);
    if (!Array.isArray(suggestions) || !suggestions.every(s => s.text)) {
      throw new Error("Unexpected response structure from Gemini");
    }
    return suggestions.map(suggestion => suggestion.text);
  } catch (error) {
    console.error("❌ ERROR: Failed to fetch Gemini AI response", error.message);
    if (error.message.includes('network') || error.message.includes('connection')) {
      return ['Check your internet connection', 'Try again later', 'Enter a goal manually'];
    } else if (error.message.includes('API key') || error.message.includes('authentication') || error.message.includes('quota')) {
      return ['Invalid API key or quota exceeded', 'Check server .env file', 'Enter a goal manually'];
    } else if (error.message.includes('Invalid response format') || error.message.includes('Unexpected response structure')) {
      return ['API response format error', 'Try a different prompt', 'Enter a goal manually'];
    }
    return ['Complete a small task today', 'Take a 10-minute walk', 'Plan tomorrow’s goals'];
  }
}

async function getWeeklyPlan(prompt) {
  console.log("LOG: Calling Gemini AI for weekly plan:", prompt);
  try {
    const result = await model.generateContent(
      `Create an optimized weekly schedule (Monday to Saturday) based on this user’s tasks: "${prompt}". Assign 3–5 specific, achievable goals per day, prioritizing productivity, well-being, and balance. Include categories (Health, Learning, Work, Social, Personal) for each goal. Keep goals concise (under 150 characters each). Return in JSON format, e.g., { Monday: [{ text: 'string', category: 'string' }, ...], Tuesday: [...], ..., Saturday: [...] }.`
    );
    const responseText = result.response.text();
    console.log("LOG: Raw weekly plan response from Gemini:", responseText);
    let plan;
    try {
      plan = JSON.parse(responseText.replace(/```json\n|\n```/g, '').trim());
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
    console.log("LOG: Parsed weekly plan:", plan);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (!Object.keys(plan).every(day => days.includes(day) && Array.isArray(plan[day]) && plan[day].every(g => g.text && g.category && ['Health', 'Learning', 'Work', 'Social', 'Personal'].includes(g.category) && plan[day].length >= 3 && plan[day].length <= 5))) {
      throw new Error("Unexpected response structure from Gemini");
    }
    return plan;
  } catch (error) {
    console.error("❌ ERROR: Failed to generate weekly plan", error.message);
    return {
      Monday: [{ text: 'Exercise 20 min', category: 'Health' }, { text: 'Read 10 pages', category: 'Learning' }, { text: 'Plan tasks', category: 'Work' }],
      Tuesday: [{ text: 'Work 1 hour', category: 'Work' }, { text: 'Walk 15 min', category: 'Health' }, { text: 'Relax', category: 'Personal' }],
      Wednesday: [{ text: 'Study notes', category: 'Learning' }, { text: 'Call a friend', category: 'Social' }, { text: 'Meditate 10 min', category: 'Health' }],
      Thursday: [{ text: 'Complete project', category: 'Work' }, { text: 'Exercise 30 min', category: 'Health' }, { text: 'Read article', category: 'Learning' }],
      Friday: [{ text: 'Social event', category: 'Social' }, { text: 'Finish tasks', category: 'Work' }, { text: 'Stretch 15 min', category: 'Health' }],
      Saturday: [{ text: 'Read novel', category: 'Learning' }, { text: 'Relax outdoors', category: 'Personal' }, { text: 'Meet friends', category: 'Social' }],
    };
  }
}

app.post("/api/suggest-goals", async (req, res) => {
  try {
    console.log("---- Processing /api/suggest-goals ----");
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    const suggestions = await getGoalSuggestions(prompt);
    console.log("LOG: Suggestions completed successfully:", suggestions);
    res.json({ suggestions });
  } catch (error) {
    console.error("❌ ERROR: Suggestion Processing Failed", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/plan-week", async (req, res) => {
  try {
    console.log("---- Processing /api/plan-week ----");
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    const { summary } = req.body;
    if (!summary) {
      return res.status(400).json({ error: "Weekly goal summary is required" });
    }
    const weeklyPlan = await getWeeklyPlan(summary);
    console.log("LOG: Weekly plan completed successfully:", weeklyPlan);
    res.json({ weeklyPlan });
  } catch (error) {
    console.error("❌ ERROR: Weekly Plan Processing Failed", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});