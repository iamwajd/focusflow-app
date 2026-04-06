import { useState, useEffect } from 'react'
import { Task } from '../types'
import TaskItem from './TaskItem'
import ProgressBar from './ProgressBar'

function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem('focusflow-tasks')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [newTaskName, setNewTaskName] = useState('')

  useEffect(() => {
    localStorage.setItem('focusflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  const overallProgress =
    tasks.length === 0
      ? 0
      : tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length

  function addTask() {
    const name = newTaskName.trim()
    if (!name) return
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, progress: 0, createdAt: Date.now() },
    ])
    setNewTaskName('')
  }

  function updateProgress(id: string, progress: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, progress } : t)))
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') addTask()
  }

  return (
    <section className="glass-card p-6 flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-white">📋 Tasks</h2>

      <ProgressBar progress={overallProgress} />

      <div className="flex gap-2">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-2.5 text-white placeholder-white/50 outline-none focus:border-white/60 focus:bg-white/30 transition-all"
        />
        <button
          onClick={addTask}
          className="bg-white/30 hover:bg-white/50 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95"
        >
          Add
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-white/50 text-center py-8">
          No tasks yet. Add one above! ✨
        </p>
      ) : (
        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onProgressChange={updateProgress}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}
    </section>
  )
}
