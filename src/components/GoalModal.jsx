import React, { useState, useEffect } from 'react';

function GoalModal({ isOpen, onClose, onAddGoal }) {
  if (!isOpen) return null;

  const [goalText, setGoalText] = useState('');
  const [category, setCategory] = useState('Personal');
  const [startTimer, setStartTimer] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState(null);

  const categories = ['Learning', 'Personal', 'Social', 'Work', 'Health'];

  const fetchSuggestions = async (userInput) => {
    setIsLoadingSuggestions(true);
    setSuggestionError(null);
    try {
      const response = await fetch('/api/suggest-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_GEMINI_API_KEY || 'mysecretkey123', // Ensure this matches API_SECRET
        },
        body: JSON.stringify({ prompt: userInput }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAiSuggestions(data.suggestions || []);
    } catch (error) {
      setSuggestionError('Failed to load suggestions: ' + error.message);
      console.error('Fetch suggestions error:', error);
      setAiSuggestions(['Complete a small task today', 'Take a 10-minute walk', 'Plan tomorrow’s goals']); // Fallback
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goalText.trim()) {
      onAddGoal({ text: goalText.trim(), category, startTimer });
      setGoalText('');
      setCategory('Personal');
      setStartTimer(false);
      setAiSuggestions([]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add a Goal for {new Date().toLocaleString('en-US', { weekday: 'long' }) || 'Monday'}</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            placeholder="Describe your goal (e.g., 'I want to go for a movie') or enter a specific goal"
            className="w-full p-2 mb-4 border rounded h-20"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={startTimer}
              onChange={(e) => setStartTimer(e.target.checked)}
              className="mr-2 h-4 w-4 text-green-500 border-gray-300 rounded"
            />
            Start timer for this goal
          </label>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => fetchSuggestions(goalText || 'be more productive')}
              disabled={isLoadingSuggestions || !goalText.trim()}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoadingSuggestions ? 'Loading Suggestions...' : 'Suggest Goals'}
            </button>
            {suggestionError && <p className="text-red-500 text-sm mt-2">{suggestionError}</p>}
            {aiSuggestions.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">AI Suggestions:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {aiSuggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm cursor-pointer hover:text-blue-600" onClick={() => setGoalText(suggestion)}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
            >
              Add Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GoalModal;