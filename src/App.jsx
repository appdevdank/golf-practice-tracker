import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const drills = [
  // same drills array as before...
];

const App = () => {
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState(drills[0].time);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [view, setView] = useState('practice'); // "practice" or "scores"

  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem("golfPracticeResults");
    return saved ? JSON.parse(saved) : Array(drills.length).fill("");
  });
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("golfPracticeCompleted");
    return saved ? JSON.parse(saved) : Array(drills.length).fill(false);
  });
  const [history, setHistory] = useState(() => {
    const h = localStorage.getItem("golfPracticeHistory");
    return h ? JSON.parse(h) : {};
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [scoreEntries, setScoreEntries] = useState(() => {
    const saved = localStorage.getItem("golfScoreEntries");
    return saved ? JSON.parse(saved) : [];
  });
  const [newScore, setNewScore] = useState({ course: '', score: '', date: '' });

  useEffect(() => {
    let timer;
    if (running && seconds > 0) {
      timer = setInterval(() => setSeconds(prev => prev - 1), 1000);
    } else if (seconds === 0 && running) {
      new Audio('/alarm.mp3').play();
      setRunning(false);
    }
    return () => clearInterval(timer);
  }, [running, seconds]);

  useEffect(() => {
    localStorage.setItem("golfPracticeResults", JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem("golfPracticeCompleted", JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    localStorage.setItem("golfScoreEntries", JSON.stringify(scoreEntries));
  }, [scoreEntries]);

  const saveSession = () => {
    const dateKey = new Date().toISOString().split('T')[0];
    const newHistory = { ...history, [dateKey]: { results, completed } };
    setHistory(newHistory);
    localStorage.setItem("golfPracticeHistory", JSON.stringify(newHistory));
    resetPractice();
  };

  const resetPractice = () => {
    setStep(0);
    setSeconds(drills[0].time);
    setRunning(false);
    setStarted(false);
    setResults(Array(drills.length).fill(""));
    setCompleted(Array(drills.length).fill(false));
    localStorage.removeItem("golfPracticeResults");
    localStorage.removeItem("golfPracticeCompleted");
  };

  const handleResultChange = (e) => {
    const newResults = [...results];
    newResults[step] = e.target.value;
    setResults(newResults);
  };

  const handleCompletedChange = (e) => {
    const newCompleted = [...completed];
    newCompleted[step] = e.target.checked;
    setCompleted(newCompleted);
  };

  const handleScoreChange = (e) => {
    const { name, value } = e.target;
    setNewScore(prev => ({ ...prev, [name]: value }));
  };

  const addScoreEntry = () => {
    if (newScore.course && newScore.score && newScore.date) {
      setScoreEntries([...scoreEntries, newScore]);
      setNewScore({ course: '', score: '', date: '' });
    }
  };

  const updateScoreEntry = (index, field, value) => {
    const updated = [...scoreEntries];
    updated[index][field] = value;
    setScoreEntries(updated);
  };

  const removeScoreEntry = (index) => {
    const updated = scoreEntries.filter((_, i) => i !== index);
    setScoreEntries(updated);
  };

  if (view === 'scores') {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Score Tracker</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setView('practice')}>Back to Practice</button>
        </div>
        <div className="mb-4">
          <input name="course" placeholder="Course" value={newScore.course} onChange={handleScoreChange} className="p-2 border rounded mr-2" />
          <input name="score" placeholder="Score" value={newScore.score} onChange={handleScoreChange} className="p-2 border rounded mr-2" />
          <input name="date" type="date" value={newScore.date} onChange={handleScoreChange} className="p-2 border rounded mr-2" />
          <button onClick={addScoreEntry} className="bg-green-600 text-white px-3 py-2 rounded">Add</button>
        </div>
        <ul>
          {scoreEntries.map((entry, i) => (
            <li key={i} className="mb-2">
              <input className="p-1 border rounded mr-2" value={entry.course} onChange={(e) => updateScoreEntry(i, 'course', e.target.value)} />
              <input className="p-1 border rounded mr-2" value={entry.score} onChange={(e) => updateScoreEntry(i, 'score', e.target.value)} />
              <input type="date" className="p-1 border rounded mr-2" value={entry.date} onChange={(e) => updateScoreEntry(i, 'date', e.target.value)} />
              <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => removeScoreEntry(i)}>X</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <div className="flex justify-between mb-4">
          <h1 className="text-3xl font-bold">Golf Practice Tracker</h1>
          <button onClick={() => setView('scores')} className="bg-blue-500 text-white px-4 py-2 rounded">Scores</button>
        </div>
        <Calendar onChange={setSelectedDate} value={selectedDate} className="mb-4 mx-auto" />
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Session History</h2>
          {history[selectedDate.toISOString().split('T')[0]] ? (
            <ul className="text-left list-disc list-inside">
              {history[selectedDate.toISOString().split('T')[0]].results.map((res, idx) => (
                <li key={idx}>
                  <strong>{drills[idx].title}:</strong> {res} {history[selectedDate.toISOString().split('T')[0]].completed[idx] ? '(Completed)' : '(Incomplete)'}
                </li>
              ))}
            </ul>
          ) : (
            <p>No session on this day.</p>
          )}
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded"
          onClick={() => setStarted(true)}
        >
          Start New Session
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((step + 1) / drills.length) * 100);

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <h1 className="text-2xl font-bold mb-4">{drills[step].title}</h1>
      <p className="mb-4">{drills[step].instructions}</p>
      <div className="text-4xl font-mono mb-4">
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
      </div>

      <textarea
        className="w-full p-2 border rounded mb-4"
        placeholder="Enter your result or notes for this drill"
        value={results[step]}
        onChange={handleResultChange}
      />

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          className="mr-2"
          checked={completed[step]}
          onChange={handleCompletedChange}
        />
        Mark as Completed
      </label>

      <div className="flex gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setRunning(!running)}
        >
          {running ? "Pause" : "Start"}
        </button>
        {step < drills.length - 1 ? (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setStep(step + 1)}
          >
            Next Drill
          </button>
        ) : (
          <button
            className="bg-green-700 text-white px-4 py-2 rounded"
            onClick={saveSession}
          >
            Save Session
          </button>
        )}
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={resetPractice}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default App;
