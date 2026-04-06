# FocusFlow - Pastel Dreams 🌟

FocusFlow is a smart, aesthetically pleasing productivity companion designed to help you manage tasks seamlessly while maintaining deep focus. Built with a modern tech stack and featuring a beautiful "Pastel Dreams" theme with glassmorphism effects, it's designed to make task management feel less like a chore and more like a delightful experience.

## ✨ Features

- **Progressive Task Management**: Tasks don't just have binary states (done/undone). You can smoothly cycle through completion levels (0%, 25%, 50%, 75%, 100%).
- **Categorization & Filtering**: Organize your life with built-in categories such as `Study`, `Personal`, `Projects`, and `Quick Notes`. Easy filtering allows you to focus on one context at a time.
- **Smart Progress Tracking**: A dynamic **Progress Ring** calculates your overall completion average across all tasks in real-time.
- **Pomodoro Focus Timer**: An integrated Focus Timer to help you employ time-blocking techniques and stay in the zone.
- **Task Statistics**: Insightful statistics summarizing your productivity and task completion momentum.
- **Daily Inspiration**: A `Quote Section` that keeps you motivated throughout the day.
- **Persistent Storage**: All tasks and progress are automatically saved to your local storage, so you never lose track.
- **Beautiful UI/UX**:
  - Dark/Light mode theme toggle.
  - Smooth "fade-in" animations and dynamic gradient backgrounds.
  - "Glass-card" aesthetic for a modern, lightweight feel.
- **Priority Management**: "Star" important tasks and edit them on the fly.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) (with SWC for blazing-fast builds)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: 
  - [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/) (Accessible, unstyled components)
  - [Lucide React](https://lucide.dev/) (Beautiful, consistent icons)
- **State & Data Management**: Custom hooks + LocalStorage
- **Animations**: Tailwind Animate & custom CSS properties

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/focusflow-pastel-dreams.git
   cd focusflow-pastel-dreams
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to see the application in action.

## 📂 Project Structure Overview

- `src/pages/Index.tsx` - The main application dashboard integrating all components.
- `src/components/` - Highly reusable UI blocks (e.g., `FocusTimer`, `ProgressRing`, `TaskCard`, `QuoteSection`).
- `src/lib/` - Utility functions, storage logic, and TypeScript interfaces.
- `src/index.css` - Global styles containing the customized "Pastel Dreams" variables and glassmorphism utilities.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/focusflow-pastel-dreams/issues).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
