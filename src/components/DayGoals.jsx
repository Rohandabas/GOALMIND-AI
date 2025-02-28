 import React, { useState, useEffect, useRef } from 'react';
import GoalModal from './GoalModal';

function DayGoals({ day, goals, onAddGoal, onDeleteGoal, onDeleteAllGoals, onToggleGoal, onStartTimer, updateTimeElapsed }) {
  const [showModal, setShowModal] = useState(false);

  const handleAddGoalClick = () => {
    setShowModal(true);
  };

  const handleDeleteAllGoals = () => {
    if (window.confirm(`Are you sure you want to delete all goals for ${day}? This cannot be undone.`)) {
      onDeleteAllGoals();
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-200
 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow w-[390px] mx-auto h-[28rem]">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-900">{day}</h2>
        {goals.length > 0 && (
          <button
            onClick={handleDeleteAllGoals}
            className="text-red-500 hover:text-red-700 text-sm font-medium transition"
          >
            Delete All
          </button>
        )}
      </div>
      <button
        onClick={handleAddGoalClick}
        className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 w-full transition-all font-semibold"
      >
        + Add Goal
      </button>
      <div className="mt-5 space-y-3 max-h-79 overflow-y-auto custom-scrollbar">
        {goals.length > 0 ? (
          goals.map((goal, index) => (
            <GoalItem
              key={index}
              goal={goal}
              index={index}
              onDeleteGoal={() => onDeleteGoal(index)}
              onToggleGoal={() => onToggleGoal(index)}
              onStartTimer={() => onStartTimer(index)}
              updateTimeElapsed={(time) => updateTimeElapsed(index, time)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center text-sm">No goals yet for {day}.</p>
        )}
      </div>
      <GoalModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAddGoal={(goalData) => onAddGoal(day, goalData)}
      />
    </div>
  );
}

function GoalItem({ goal, index, onDeleteGoal, onToggleGoal, onStartTimer, updateTimeElapsed }) {
  const [time, setTime] = useState(goal.timeElapsed || 0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (goal.timerStarted && !goal.completed) {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1;
          requestAnimationFrame(() => updateTimeElapsed(newTime));
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [goal.timerStarted, goal.completed, updateTimeElapsed]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds} min`;
  };

  return (
    <li className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center w-full space-x-4">
        <input
          type="checkbox"
          checked={goal.completed}
          onChange={onToggleGoal}
          className="h-5 w-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
        />
        <span className={`flex-1 text-gray-800 text-base ${goal.completed ? 'line-through text-gray-500' : ''} truncate`}>
          {goal.text}
        </span>
      </div>
      <div className="flex items-center space-x-3 mt-2 sm:mt-0">
        <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
          {goal.category}
        </span>
        <span className="text-xs text-gray-600 font-medium">{formatTime(time)}</span>
        {!goal.timerStarted && !goal.completed && (
          <button
            onClick={onStartTimer}
            className="bg-blue-600 text-white px-4 py-1 text-sm rounded-lg hover:bg-blue-700 transition"
          >
            Start
          </button>
        )}
        {!goal.completed && (
          <button
            onClick={onDeleteGoal}
            className="text-red-500 hover:text-red-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        )}
      </div>
    </li>
  );
}

export default DayGoals;