interface ProgressBarProps {
  progress: number
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  const pct = Math.round(progress)
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-semibold text-sm uppercase tracking-wide">
          Overall Progress
        </span>
        <span className="text-white font-bold text-lg">{pct}%</span>
      </div>
      <div className="h-3 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #a78bfa, #ec4899, #60a5fa)',
          }}
        />
      </div>
    </div>
  )
}
