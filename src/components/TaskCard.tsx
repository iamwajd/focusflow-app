import { Star, Trash2, Pencil, Clock } from "lucide-react";
import { Task, CompletionLevel } from "@/lib/types";
import CategoryBadge from "./CategoryBadge";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { format, isPast, isToday } from "date-fns";
import { toast } from "sonner";

const levels: CompletionLevel[] = [0, 25, 50, 75, 100];

const levelColors: Record<CompletionLevel, string> = {
  0: "bg-muted",
  25: "bg-peach",
  50: "bg-rose",
  75: "bg-mint",
  100: "bg-primary",
};

interface TaskCardProps {
  task: Task;
  onCycleLevel: (id: string) => void;
  onDelete: (id: string) => void;
  onStar: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  index: number;
}

const TaskCard = ({ task, onCycleLevel, onDelete, onStar, onEdit, index }: TaskCardProps) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const [prevCompletion, setPrevCompletion] = useState(task.completionLevel);
  const isComplete = task.completionLevel === 100;

  useEffect(() => {
    if (task.completionLevel === 100 && prevCompletion !== 100) {
      toast.success("🎉 Awesome! Task completed!", {
        description: "Great job! Keep up the momentum!",
        duration: 3000,
      });
      
      triggerConfetti();
    }
    setPrevCompletion(task.completionLevel);
  }, [task.completionLevel, prevCompletion]);

  const triggerConfetti = () => {
    const confettiPieces = 50;
    for (let i = 0; i < confettiPieces; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.top = "-10px";
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = confetti.style.width;
      confetti.style.backgroundColor = [
        "#bb95c4",
        "#9dcbc8",
        "#edd3eb",
        "#e5f6f3",
      ][Math.floor(Math.random() * 4)];
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      confetti.style.pointerEvents = "none";
      confetti.style.zIndex = "9999";
      document.body.appendChild(confetti);

      const duration = Math.random() * 2000 + 2000;
      const xOffset = (Math.random() - 0.5) * 200;
      
      confetti.animate(
        [
          { transform: "translateY(0px) translateX(0px) rotate(0deg)", opacity: 1 },
          { transform: `translateY(${window.innerHeight + 20}px) translateX(${xOffset}px) rotate(${Math.random() * 360}deg)`, opacity: 0 },
        ],
        {
          duration,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }
      );

      setTimeout(() => confetti.remove(), duration);
    }
  };

  const handleSave = () => {
    if (editValue.trim()) onEdit(task.id, editValue.trim());
    setEditing(false);
  };

  const deadlineDate = task.deadline ? new Date(task.deadline) : null;
  const isOverdue = deadlineDate && isPast(deadlineDate) && !isToday(deadlineDate) && !isComplete;
  const isDueToday = deadlineDate && isToday(deadlineDate) && !isComplete;

  return (
    <div
      className={`glass-card-hover p-4 flex items-center gap-3 animate-slide-up ${isComplete ? "opacity-60" : ""}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button
        onClick={() => onCycleLevel(task.id)}
        className="relative w-8 h-8 flex-shrink-0"
        title={`${task.completionLevel}% — Click to change`}
      >
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
            strokeLinecap="round" strokeDasharray={`${task.completionLevel * 0.9425} 94.25`}
            className="transition-all duration-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-foreground">
          {task.completionLevel}
        </span>
      </button>

      <div className="flex-1 min-w-0">
        {editing ? (
          <Input
            value={editValue} onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave} onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="h-8 text-sm" autoFocus
          />
        ) : (
          <p className={`text-sm font-medium truncate transition-all duration-300 ${isComplete ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {task.title}
          </p>
        )}
        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          <CategoryBadge category={task.category} />
          <div className="flex gap-0.5">
            {levels.map((lvl) => (
              <div
                key={lvl}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  task.completionLevel >= lvl && lvl > 0 ? levelColors[lvl] : "bg-border"
                }`}
              />
            ))}
          </div>
          {deadlineDate && (
            <span className={`flex items-center gap-1 text-[10px] font-medium ${
              isOverdue ? "text-destructive" : isDueToday ? "text-peach" : "text-muted-foreground"
            }`}>
              <Clock size={10} />
              {isOverdue ? "Overdue!" : format(deadlineDate, "dd/MM")}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => onStar(task.id)} className="p-1.5 rounded-full hover:bg-muted transition-colors">
          <Star size={16} className={task.starred ? "fill-peach text-peach" : "text-muted-foreground"} />
        </button>
        <button onClick={() => { setEditing(true); setEditValue(task.title); }} className="p-1.5 rounded-full hover:bg-muted transition-colors">
          <Pencil size={14} className="text-muted-foreground" />
        </button>
        <button onClick={() => onDelete(task.id)} className="p-1.5 rounded-full hover:bg-destructive/10 transition-colors">
          <Trash2 size={14} className="text-muted-foreground hover:text-destructive" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
