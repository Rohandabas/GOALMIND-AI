import GeminiService from './GeminiService';

export async function getAIGoalSuggestions(prompt) {
  try {
    const service = GeminiService.getInstance(import.meta.env.VITE_GEMINI_API_KEY);
    return await service.getGoalSuggestions(prompt);
  } catch (error) {
    console.error('Failed to get suggestions from GeminiService:', error);
    return ['Complete a small task today', 'Take a 10-minute walk', 'Plan tomorrow’s goals']; // Fallback
  }
}