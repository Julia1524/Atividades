import { useCallback, useEffect, useMemo, useState } from "react";

type TimerMode = "focus" | "shortBreak" | "longBreak";

type TimerState = {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
};

const MODE_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const MODE_LABELS: Record<TimerMode, string> = {
  focus: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export function PomodoroTimer() {
  const [timerState, setTimerState] = useState<TimerState>({
    mode: "focus",
    timeLeft: MODE_DURATIONS["focus"],
    isRunning: false,
  });

  const switchMode = useCallback((mode: TimerMode) => {
    setTimerState({
      mode,
      timeLeft: MODE_DURATIONS[mode],
      isRunning: false,
    });
  }, []);

  useEffect(() => {
    if (!timerState.isRunning) return;

    const interval = setInterval(() => {
      setTimerState((prev) => {
        if (prev.timeLeft <= 1) {
          return {
            ...prev,
            timeLeft: 0,
            isRunning: false,
          };
        }

        return {
          ...prev,
          timeLeft: prev.timeLeft - 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState.isRunning]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timerState.timeLeft / 60);
    const seconds = timerState.timeLeft % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, [timerState.timeLeft]);

  function toggleTimer() {
    setTimerState((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  }

  function resetTimer() {
    setTimerState((prev) => ({
      ...prev,
      timeLeft: MODE_DURATIONS[prev.mode],
      isRunning: false,
    }));
  }

  return (
    <div className="pomodoro-timer">
      <div className="mode-buttons">
        {(["focus", "shortBreak", "longBreak"] as TimerMode[]).map((mode) => (
          <button
            key={mode}
            className={`mode-button ${timerState.mode === mode ? "active" : ""}`}
            onClick={() => switchMode(mode)}
          >
            {MODE_LABELS[mode]}
          </button>
        ))}
      </div>

      <div className="timer-display">{formattedTime}</div>

      <div className="timer-controls">
        <button onClick={toggleTimer}>
          {timerState.isRunning ? "Pause" : "Start"}
        </button>

        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}