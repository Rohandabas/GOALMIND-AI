import React from 'react';
import DayGoals from './DayGoals';
import ReportModal from './ReportModal';
import WeeklyPlanModal from './WeeklyPlanModal';
import '../index.css';

function GoalTracker() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [goals, setGoals] = React.useState(() => {
    const savedGoals = localStorage.getItem('weeklyGoals');
    console.log('Loaded goals from localStorage:', savedGoals ? JSON.parse(savedGoals) : 'No saved goals');
    return savedGoals ? JSON.parse(savedGoals) : {};
  });
  const [showReport, setShowReport] = React.useState(false);
  const [showWeeklyPlan, setShowWeeklyPlan] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    try {
      localStorage.setItem('weeklyGoals', JSON.stringify(goals));
      console.log('Goals updated in localStorage:', goals);
    } catch (err) {
      console.error('Error saving to localStorage:', err);
      setError('Failed to save goals. Please check your browser settings.');
    }
  }, [goals]);

  const addGoal = (day, goalData) => {
    setGoals((prev) => ({
      ...prev,
      [day]: [
        ...(prev[day] || []),
        { text: goalData.text, category: goalData.category || 'Personal', startTimer: goalData.startTimer || false, completed: false, timeElapsed: 0 },
      ],
    }));
  };

  const deleteGoal = (day, index) => {
    setGoals((prev) => {
      const updatedDay = prev[day]?.filter((_, i) => i !== index) || [];
      return { ...prev, [day]: updatedDay };
    });
  };

  const deleteAllGoals = (day) => {
    setGoals((prev) => {
      const newGoals = { ...prev };
      delete newGoals[day];
      return newGoals;
    });
  };

  const toggleGoal = (day, index) => {
    setGoals((prev) => {
      const updatedDay = prev[day]?.map((g, i) => {
        if (i === index) {
          const updatedGoal = { ...g, completed: !g.completed };
          if (updatedGoal.completed && g.timerStarted) {
            updatedGoal.timerStarted = false;
          }
          return updatedGoal;
        }
        return g;
      }) || [];
      return { ...prev, [day]: updatedDay };
    });
  };

  const startTimer = (day, index) => {
    setGoals((prev) => {
      const updatedDay = prev[day]?.map((g, i) => {
        if (i === index) {
          return { ...g, timerStarted: true };
        }
        return g;
      }) || [];
      return { ...prev, [day]: updatedDay };
    });
  };

  const updateTimeElapsed = (day, index, time) => {
    setGoals((prev) => {
      const updatedDay = prev[day]?.map((g, i) => {
        if (i === index && g.timerStarted) {
          return { ...g, timeElapsed: time };
        }
        return g;
      }) || [];
      return { ...prev, [day]: updatedDay };
    });
  };

  const generateReport = () => {
    try {
      console.log('Generating report with goals (detailed):', {
        goals,
        days,
        allGoals: Object.values(goals).flat().filter((g) => g !== undefined),
      });
      const allGoals = Object.values(goals).flat().filter((g) => g !== undefined);
      const totalGoals = allGoals.length;

      const completedGoals = allGoals.filter((g) => g.completed);
      const unfinishedGoals = allGoals.filter((g) => !g.completed).map((g) => g.text);

      const completedByCategory = completedGoals.reduce((acc, goal) => {
        acc[goal.category] = acc[goal.category] || [];
        acc[goal.category].push({ text: goal.text, timeElapsed: goal.timeElapsed });
        return acc;
      }, {});

      const totalTimeElapsed = completedGoals.reduce((sum, goal) => sum + (goal.timeElapsed || 0), 0);
      const formattedTime = formatTime(totalTimeElapsed);

      const score = totalGoals > 0 ? Math.round((completedGoals.length / totalGoals) * 100) : 0;
      let reward = '';

      if (totalGoals === 0) {
        reward = 'No goals to report.';
      } else if (score >= 90) {
        reward = 'Treat yourself to a movie night!';
      } else if (score >= 70) {
        reward = 'Enjoy a relaxing coffee break.';
      } else if (score >= 50) {
        reward = 'Keep it up—try a short walk.';
      } else {
        reward = 'Don’t worry, set new goals for next week!';
      }

      console.log('Report data:', { totalGoals, completedGoals, unfinishedGoals, completedByCategory, totalTimeElapsed, score, reward });
      return {
        unfinishedGoals,
        completedByCategory,
        totalTimeElapsed: formattedTime,
        score,
        reward,
        goalsByDay: days.reduce((acc, day) => {
          acc[day] = {
            completed: (goals[day] || []).filter((g) => g.completed),
            unfinished: (goals[day] || []).filter((g) => !g.completed),
          };
          return acc;
        }, {}),
      };
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.message || 'Failed to generate report.');
      return {
        unfinishedGoals: [],
        completedByCategory: {},
        totalTimeElapsed: '0:00 min',
        score: 0,
        reward: 'No goals to report.',
        goalsByDay: {},
      };
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds} min`;
  };

  const handleGenerateReport = () => {
    console.log('Report button clicked, day:', new Date().getDay());
    setShowReport(true);
    setError(null);
  };

  const handlePlanSchedule = () => {
    setShowWeeklyPlan(true);
  };

  const report = React.useMemo(() => generateReport(), [goals, showReport]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 overflow-x-hidden">
      <header className="bg-gray-950/80 backdrop-blur-sm p-4 rounded-lg shadow-lg mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-400 flex items-center">
            <span className="mr-2">📋</span> Weekly Goal Tracker
          </h1>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleGenerateReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Generate Report
          </button>
          <button
            onClick={handlePlanSchedule}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Plan Schedule
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {days.map((day, index) => (
          <DayGoals
            key={day}
            day={day}
            goals={goals[day] || []}
            onAddGoal={addGoal}
            onDeleteGoal={(index) => deleteGoal(day, index)}
            onDeleteAllGoals={() => deleteAllGoals(day)}
            onToggleGoal={(index) => toggleGoal(day, index)}
            onStartTimer={(index) => startTimer(day, index)}
            updateTimeElapsed={(index, time) => updateTimeElapsed(day, index, time)}
          />
        ))}
      </main>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        report={report}
        days={days}
      />
      <WeeklyPlanModal
        isOpen={showWeeklyPlan}
        onClose={() => setShowWeeklyPlan(false)}
        onAddGoal={addGoal}
      />
      <footer className="bg-gray-950/80 backdrop-blur-sm text-white text-center p-4 mt-6 rounded-lg">
        <p>© 2025 Daily Goals. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default GoalTracker;