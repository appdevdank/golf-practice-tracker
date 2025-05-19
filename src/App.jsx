import React, { useState, useEffect } from 'react';

const drills = [
  {
    title: "Wedges - 30, 60, 90",
    instructions: "Hit 3 shots at each number with sand wedge, then switch to 60°, cycle 3 times. 10 minutes.",
    time: 600,
  },
  {
    title: "Wedges - 3 A side",
    instructions: "Use lob wedge and launch monitor. Hit a 50-yard shot with 3-yard variance. Repeat at 60 and 70. 10 minutes.",
    time: 600,
  },
  {
    title: "Approach - GB Turr Game",
    instructions: "Target 150-170 yards, avoid water on right. Execute 5 in a row. Optional squats & rest. 15 minutes.",
    time: 900,
  },
  {
    title: "Driver Routine",
    instructions: "Pick 22-yd wide target, full routine, jumping jacks in between. Repeat 8x. 10 minutes.",
    time: 600,
  },
  {
    title: "Driver - Fairway Finder",
    instructions: "Hit 5 drives and 5 3-woods using second-serve fairway finder. 15 minutes.",
    time: 900,
  },
  {
    title: "Putting - Half Moon Drill",
    instructions: "Half moon around central tee. Hit center from 6 points, restart on 2 misses. 10 minutes.",
    time: 600,
  }
];

const App = () => {
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState(drills[0].time);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem("golfPracticeResults");
    return saved ? JSON.parse(saved) : Array(drills.length).fill("");
  });

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

  const nextStep = () => {
    const next = step + 1;
    if (next < drills.length) {
      setStep(next);
      setSeconds(drills[next].time);
      setRunning(false);
    }
  };

  const resetPractice = () => {
    setStep(0);
    setSeconds(drills[0].time);
    setRunning(false);
    setStarted(false);
    setResults(Array(drills.length).fill(""));
    localStorage.removeItem("golfPracticeResults");
  };

  const handleResultChange = (e) => {
    const newResults = [...results];
    newResults[step] = e.target.value;
    setResults(newResults);
  };

  if (!started) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Golf Practice Tracker</h1>
        <p className="mb-4">Follow a structured routine for your practice session.</p>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded"
          onClick={() => setStarted(true)}
        >
          Start Practice
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

      <div className="flex gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setRunning(!running)}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={nextStep}
          disabled={step === drills.length - 1}
        >
          Next Drill
        </button>
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
