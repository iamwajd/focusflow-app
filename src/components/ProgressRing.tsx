interface ProgressRingProps {
  completed: number;
  total: number;
}

const ProgressRing = ({ completed, total }: ProgressRingProps) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--lavender-light))" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--lavender))" strokeWidth="6"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            className="animate-progress-fill transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-foreground">{percentage}%</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">Overall Completion</p>
    </div>
  );
};

export default ProgressRing;
