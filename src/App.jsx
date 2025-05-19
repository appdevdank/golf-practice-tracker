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

  const nextStep = () => {
    const next = step + 1;
    if (next < drills.length) {
      setStep(next);
      setSeconds(drills[next].time);
      setRunning(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{drills[step].title}</h1>
      <p className="mb-4">{drills[step].instructions}</p>
      <div className="text-4xl font-mono mb-4">
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
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
    </div>
  );
};

export default App;
