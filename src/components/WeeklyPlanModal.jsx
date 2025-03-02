// import React, { useState } from 'react';
// import { FaCalendar, FaCheckCircle } from 'react-icons/fa';

// function WeeklyPlanModal({ isOpen, onClose, onAddGoal }) {
//   const [summary, setSummary] = useState('');
//   const [weeklyPlan, setWeeklyPlan] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch('/api/plan-week', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-api-key': import.meta.env.VITE_GEMINI_API_KEY || 'mysecretkey123',
//         },
//         body: JSON.stringify({ summary }),
//       });
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const data = await response.json();
//       console.log('Weekly plan data received:', data.weeklyPlan);
//       setWeeklyPlan(data.weeklyPlan || {});
//     } catch (error) {
//       setError('Failed to generate weekly plan: ' + (error.message || 'Try again.'));
//       console.error('Weekly plan error:', error);
//       setWeeklyPlan({
//         Monday: [{ text: 'Exercise 20 min', category: 'Health' }, { text: 'Read 10 pages', category: 'Learning' }, { text: 'Plan tasks', category: 'Work' }],
//         Tuesday: [{ text: 'Work 1 hour', category: 'Work' }, { text: 'Walk 15 min', category: 'Health' }, { text: 'Relax', category: 'Personal' }],
//         Wednesday: [{ text: 'Study notes', category: 'Learning' }, { text: 'Call a friend', category: 'Social' }, { text: 'Meditate 10 min', category: 'Health' }],
//         Thursday: [{ text: 'Complete project', category: 'Work' }, { text: 'Exercise', category: 'Health' }, { text: 'Read', category: 'Learning' }],
//         Friday: [{ text: 'Submit work project', category: 'Work' }, { text: 'Finish reading book', category: 'Learning' }, { text: 'Prepare for weekend activities', category: 'Personal' }],
//         Saturday: [{ text: 'Outdoor activity (hike/bike)', category: 'Health' }, { text: 'Spend time with friends', category: 'Social' }, { text: 'Relax and unwind', category: 'Personal' }, { text: 'Grocery shopping', category: 'Personal' }],
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const addGoalToDay = (day, goal) => {
//     onAddGoal(day, { text: goal.text, category: goal.category, startTimer: false });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-gray-950/80 backdrop-blur-sm p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto custom-scrollbar">
//         <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
//           <h2 className="text-2xl font-bold text-gray-100 flex items-center">
//             <FaCalendar className="mr-2 text-yellow-400" /> Plan Your Weekly Schedule
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-200 transition p-2 rounded-full hover:bg-gray-800"
//             aria-label="Close"
//           >
//             <FaCheckCircle className="w-6 h-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="mb-6">
//           <textarea
//             value={summary}
//             onChange={(e) => setSummary(e.target.value)}
//             placeholder="Describe your weekly goals (e.g., 'I want to exercise, finish a work project, read a book, and spend time with friends this week')"
//             className="w-full p-3 mb-4 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none text-gray-100 bg-gray-900/80"
//             required
//           />
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
//           >
//             {isLoading ? 'Generating Plan...' : 'Generate Schedule'}
//           </button>
//           {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//         </form>

//         {Object.keys(weeklyPlan).length > 0 && (
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold text-gray-200 mb-4">Weekly Schedule</h3>
//             {days.map((day) => (
//               <div key={day} className="mb-4 pb-2 border-b border-gray-700 last:border-b-0">
//                 <h4 className="font-medium text-gray-100 mb-2 flex items-center">
//                   <FaCalendar className="mr-2 text-blue-400 text-sm" /> {day}
//                 </h4>
//                 <ul className="list-disc pl-5 space-y-2">
//                   {weeklyPlan[day].map((goal, index) => (
//                     <li key={index} className="text-gray-300 flex items-center justify-between gap-3 py-1">
//                       <span className="flex-1 truncate">
//                         {goal.text} <span className="text-gray-400 text-xs italic">({goal.category})</span>
//                       </span>
//                       <button
//                         onClick={() => addGoalToDay(day, goal)}
//                         className="bg-green-600 text-white px-2 py-1 rounded-lg text-sm hover:bg-green-700 transition-all duration-300 flex items-center gap-1 shadow-md hover:shadow-lg"
//                       >
//                         <FaCheckCircle className="inline" /> Add to {day}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         )}

//         <button
//           onClick={onClose}
//           className="mt-4 bg-gray-600 text-gray-100 px-4 py-2 rounded-lg hover:bg-gray-700 w-full transition-all duration-300 shadow-md hover:shadow-lg"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// }

// export default WeeklyPlanModal;

import React, { useState } from 'react';
import { FaCalendar, FaCheckCircle } from 'react-icons/fa';

function WeeklyPlanModal({ isOpen, onClose, onAddGoal }) {
  const [summary, setSummary] = useState('');
  const [weeklyPlan, setWeeklyPlan] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/plan-week', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_GEMINI_API_KEY || 'mysecretkey123',
        },
        body: JSON.stringify({ summary }),
      });
      if (!response.ok) {
        const errorText = await response.text(); // Log the full response for debugging
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      console.log('Weekly plan data received:', data.weeklyPlan);
      setWeeklyPlan(data.weeklyPlan || {});
    } catch (error) {
      setError('Failed to generate weekly plan: ' + (error.message || 'Try again.'));
      console.error('Weekly plan error:', error);
      setWeeklyPlan({
        Monday: [{ text: 'Exercise 20 min', category: 'Health' }, { text: 'Read 10 pages', category: 'Learning' }, { text: 'Plan tasks', category: 'Work' }],
        Tuesday: [{ text: 'Work 1 hour', category: 'Work' }, { text: 'Walk 15 min', category: 'Health' }, { text: 'Relax', category: 'Personal' }],
        Wednesday: [{ text: 'Study notes', category: 'Learning' }, { text: 'Call a friend', category: 'Social' }, { text: 'Meditate 10 min', category: 'Health' }],
        Thursday: [{ text: 'Complete project', category: 'Work' }, { text: 'Exercise', category: 'Health' }, { text: 'Read', category: 'Learning' }],
        Friday: [{ text: 'Submit work project', category: 'Work' }, { text: 'Finish reading book', category: 'Learning' }, { text: 'Prepare for weekend activities', category: 'Personal' }],
        Saturday: [{ text: 'Outdoor activity (hike/bike)', category: 'Health' }, { text: 'Spend time with friends', category: 'Social' }, { text: 'Relax and unwind', category: 'Personal' }, { text: 'Grocery shopping', category: 'Personal' }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addGoalToDay = (day, goal) => {
    onAddGoal(day, { text: goal.text, category: goal.category, startTimer: false });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-950/80 backdrop-blur-sm p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-100 flex items-center">
            <FaCalendar className="mr-2 text-yellow-400" /> Plan Your Weekly Schedule
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition p-2 rounded-full hover:bg-gray-800"
            aria-label="Close"
          >
            <FaCheckCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Describe your weekly goals (e.g., 'I want to exercise, finish a work project, read a book, and spend time with friends this week')"
            className="w-full p-3 mb-4 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none text-gray-100 bg-gray-900/80"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isLoading ? 'Generating Plan...' : 'Generate Schedule'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>

        {Object.keys(weeklyPlan).length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Weekly Schedule</h3>
            {days.map((day) => (
              <div key={day} className="mb-4 pb-2 border-b border-gray-700 last:border-b-0">
                <h4 className="font-medium text-gray-100 mb-2 flex items-center">
                  <FaCalendar className="mr-2 text-blue-400 text-sm" /> {day}
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {weeklyPlan[day].map((goal, index) => (
                    <li key={index} className="text-gray-300 flex items-center justify-between gap-3 py-1">
                      <span className="flex-1 truncate">
                        {goal.text} <span className="text-gray-400 text-xs italic">({goal.category})</span>
                      </span>
                      <button
                        onClick={() => addGoalToDay(day, goal)}
                        className="bg-green-600 text-white px-2 py-1 rounded-lg text-sm hover:bg-green-700 transition-all duration-300 flex items-center gap-1 shadow-md hover:shadow-lg"
                      >
                        <FaCheckCircle className="inline" /> Add to {day}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-gray-600 text-gray-100 px-4 py-2 rounded-lg hover:bg-gray-700 w-full transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default WeeklyPlanModal;