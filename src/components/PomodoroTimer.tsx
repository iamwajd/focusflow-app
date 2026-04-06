import { useState, useEffect, useCallback, useRef } from 'react'
import { TimerMode } from '../types'

const DURATIONS: Record<TimerMode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

const MODE_LABELS: Record<TimerMode, string> = {
  work: 'Work',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
}

const RADIUS = 80
const STROKE = 8
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(DURATIONS.work)
  const [isRunning, setIsRunning] = useState(false)
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [flash, setFlash] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = DURATIONS[mode]
  const progress = (total - timeLeft) / total
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress)

  const triggerSessionEnd = useCallback(() => {
    setFlash(true)
    setTimeout(() => setFlash(false), 1000)
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.8)
    } catch {
      // Audio not available
    }
  }, [])

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      setMode(newMode)
      setTimeLeft(DURATIONS[newMode])
      setIsRunning(false)
    },
    []
  )

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setIsRunning(false)
          triggerSessionEnd()

          if (mode === 'work') {
            const next = pomodoroCount + 1
            setPomodoroCount(next)
            const nextMode: TimerMode = next % 4 === 0 ? 'longBreak' : 'shortBreak'
            setMode(nextMode)
            setTimeLeft(DURATIONS[nextMode])
          } else {
            setMode('work')
            setTimeLeft(DURATIONS.work)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, mode, pomodoroCount, triggerSessionEnd])

  function reset() {
    setIsRunning(false)
    setTimeLeft(DURATIONS[mode])
  }

  const modeColors: Record<TimerMode, string> = {
    work: '#a78bfa',
    shortBreak: '#34d399',
    longBreak: '#60a5fa',
  }

  const ringColor = modeColors[mode]

  return (
    <section
      className={`glass-card p-6 flex flex-col items-center gap-6 transition-all duration-300 ${
        flash ? 'ring-4 ring-white/80' : ''
      }`}
    >
      <h2 className="text-2xl font-bold text-white self-start">⏱️ Pomodoro</h2>

      {/* Mode selector */}
      <div className="flex gap-2 bg-white/10 rounded-xl p-1">
        {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              mode === m
                ? 'bg-white/40 text-white shadow'
                : 'text-white/60 hover:text-white hover:bg-white/20'
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Circular progress ring */}
      <div className="relative">
        <svg
          width={RADIUS * 2 + STROKE * 2}
          height={RADIUS * 2 + STROKE * 2}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background circle */}
          <circle
            cx={RADIUS + STROKE}
            cy={RADIUS + STROKE}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={STROKE}
          />
          {/* Progress circle */}
          <circle
            cx={RADIUS + STROKE}
            cy={RADIUS + STROKE}
            r={RADIUS}
            fill="none"
            stroke={ringColor}
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white text-4xl font-bold tabular-nums">
            {formatTime(timeLeft)}
          </span>
          <span className="text-white/70 text-sm mt-1">{MODE_LABELS[mode]}</span>
        </div>
      </div>

      {/* Pomodoro count dots */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i < (pomodoroCount % 4)
                ? 'bg-violet-400 shadow-lg shadow-violet-400/50'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsRunning((r) => !r)}
          className="bg-white/30 hover:bg-white/50 border border-white/30 text-white font-bold px-8 py-3 rounded-xl transition-all active:scale-95 min-w-[120px]"
        >
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </button>
        <button
          onClick={reset}
          className="bg-white/20 hover:bg-white/30 border border-white/20 text-white/80 hover:text-white font-medium px-5 py-3 rounded-xl transition-all active:scale-95"
        >
          ↺ Reset
        </button>
      </div>

      {pomodoroCount > 0 && (
        <p className="text-white/60 text-sm">
          {pomodoroCount} pomodoro{pomodoroCount !== 1 ? 's' : ''} completed today 🎉
        </p>
      )}
    </section>
  )
}
