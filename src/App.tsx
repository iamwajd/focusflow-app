import TaskManager from './components/TaskManager'
import PomodoroTimer from './components/PomodoroTimer'

export default function App() {
  return (
    <div className="min-h-screen px-4 py-8">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg tracking-tight">
          🎯 FocusFlow
        </h1>
        <p className="text-white/80 mt-2 text-lg font-light">
          Elegant task management meets deep focus
        </p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TaskManager />
        <PomodoroTimer />
      </main>
    </div>
  )
}
