export interface Task {
  id: string;
  name: string;
  progress: number; // 0-100
  createdAt: number;
}

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerState {
  mode: TimerMode;
  timeLeft: number; // seconds
  isRunning: boolean;
  pomodoroCount: number;
}
