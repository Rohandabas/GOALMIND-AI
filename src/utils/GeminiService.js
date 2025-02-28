import { GoogleGenerativeAI } from "@google/generative-ai";

// Create a singleton instance of the service
let geminiService = null;

class GeminiService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("API key is required for Gemini service initialization");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7, // Controls randomness (0.7 for balanced creativity)
        topK: 40,        // Limits the token pool for sampling
        topP: 0.95,      // Nucleus sampling for diversity
        maxOutputTokens: 2048, // Maximum tokens in response
      },
    });
    console.log("Gemini service initialized successfully");
  }

  static getInstance(apiKey) {
    if (!geminiService) {
      try {
        geminiService = new GeminiService(apiKey);
      } catch (error) {
        console.error("Failed to initialize Gemini service:", error.message);
        throw error; // Re-throw to handle upstream
      }
    }
    return geminiService;
  }

  async getGoalSuggestions(prompt) {
    console.log('Sending prompt to Gemini:', prompt);
    try {
      const result = await this.model.generateContent({
        contents: [{ parts: [{ text: `Based on the user’s plan: "${prompt}", suggest 3 specific, achievable daily goals related to this plan. Consider entertainment, dining, and learning activities. Keep responses concise and actionable (under 100 characters each). Return in JSON format, e.g., [{ text: 'string' }, { text: 'string' }, { text: 'string' }].` }] }],
      });
      const responseText = result.response.text();
      console.log('Raw response from Gemini:', responseText);
      let suggestions;
      try {
        suggestions = JSON.parse(responseText.replace(/```json\n|\n```/g, '').trim());
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        throw new Error('Invalid response format from Gemini');
      }
      console.log('Parsed suggestions:', suggestions);
      if (!Array.isArray(suggestions) || !suggestions.every(s => s.text)) {
        throw new Error('Unexpected response structure from Gemini');
      }
      return suggestions.map(suggestion => suggestion.text);
    } catch (error) {
      console.error('Error fetching AI goal suggestions:', error.message);
      if (error.message.includes('network') || error.message.includes('connection')) {
        return ['Check your internet connection', 'Try again later', 'Enter a goal manually'];
      } else if (error.message.includes('API key') || error.message.includes('authentication') || error.message.includes('quota')) {
        return ['Invalid API key or quota exceeded', 'Check your .env file', 'Enter a goal manually'];
      } else if (error.message.includes('Invalid response format') || error.message.includes('Unexpected response structure')) {
        return ['API response format error', 'Try a different prompt', 'Enter a goal manually'];
      }
      return ['Complete a small task today', 'Take a 10-minute walk', 'Plan tomorrow’s goals'];
    }
  }
}

export default GeminiService;