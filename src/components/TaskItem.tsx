import { Task } from '../types'

interface TaskItemProps {
  task: Task
  onProgressChange: (id: string, progress: number) => void
  onDelete: (id: string) => void
}

export default function TaskItem({ task, onProgressChange, onDelete }: TaskItemProps) {
  return (
    <div className="glass-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-white font-medium truncate flex-1">{task.name}</span>
        <span className="text-white/90 font-bold text-sm bg-white/20 rounded-full px-3 py-1 min-w-[52px] text-center">
          {task.progress}%
        </span>
        <button
          onClick={() => onDelete(task.id)}
          className="text-white/70 hover:text-white hover:bg-white/20 rounded-full w-7 h-7 flex items-center justify-center transition-all flex-shrink-0"
          aria-label="Delete task"
        >
          ✕
        </button>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-white/60 text-xs">0%</span>
        <input
          type="range"
          min={0}
          max={100}
          value={task.progress}
          onChange={(e) => onProgressChange(task.id, Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-white/60 text-xs">100%</span>
      </div>
    </div>
  )
}
