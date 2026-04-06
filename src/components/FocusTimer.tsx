import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

const DURATIONS = [15, 25, 45, 60];

const FocusTimer = () => {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = totalSeconds === 0 ? 0 : ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  const selectDuration = (minutes: number) => {
    if (isRunning) return;
    setSelectedMinutes(minutes);
    setTotalSeconds(minutes * 60);
    setRemainingSeconds(minutes * 60);
    setIsComplete(false);
  };

  const playCompletionSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new AudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.5);
        osc.start(ctx.currentTime + i * 0.2);
        osc.stop(ctx.currentTime + i * 0.2 + 0.5);
      });
    } catch {}
  }, [soundEnabled]);

  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            playCompletionSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, playCompletionSound]);

  const toggleTimer = () => {
    if (isComplete) return;
    setIsRunning((r) => !r);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    setIsComplete(false);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (progress / 100) * circumference;

  const confettiColors = [
    "hsl(var(--lavender))",
    "hsl(var(--mint))",
    "hsl(var(--rose))",
    "hsl(var(--peach))",
    "hsl(var(--primary))",
  ];

  return (
    <div className="glass-card p-6 animate-fade-in space-y-5" style={{ animationDelay: "50ms" }}>
      <div className="flex items-center justify-center gap-2">
        {DURATIONS.map((d) => (
          <button
            key={d}
            onClick={() => selectDuration(d)}
            disabled={isRunning}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
              selectedMinutes === d
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-40"
            }`}
          >
            {d}m
          </button>
        ))}
      </div>

      <div className="relative w-36 h-36 mx-auto">
        {isComplete && (
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  backgroundColor: confettiColors[i % confettiColors.length],
                  left: "50%",
                  top: "50%",
                  animationDelay: `${i * 0.06}s`,
                  "--confetti-x": `${(Math.random() - 0.5) * 180}px`,
                  "--confetti-y": `${(Math.random() - 0.5) * 180}px`,
                  "--confetti-r": `${Math.random() * 720 - 360}deg`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--border))" strokeWidth="5" />
          <circle
            cx="60" cy="60" r="54" fill="none"
            stroke={isComplete ? "hsl(var(--mint))" : "hsl(var(--primary))"}
            strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground font-sans tabular-nums">
            {formatTime(remainingSeconds)}
          </span>
          <span className="text-[10px] text-muted-foreground">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9" onClick={resetTimer}>
          <RotateCcw size={16} />
        </Button>
        <Button
          onClick={toggleTimer} size="icon"
          className={`rounded-full w-12 h-12 transition-all duration-300 ${isComplete ? "bg-mint" : ""}`}
          disabled={isComplete}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9" onClick={() => setSoundEnabled(!soundEnabled)}>
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </Button>
      </div>

      <p className="text-center text-[11px] text-muted-foreground">
        {isComplete ? "🎉 Well done!" : isRunning ? "⏱️ Stay focused..." : "Pick a duration and start focusing"}
      </p>
    </div>
  );
};

export default FocusTimer;
