import { Task } from "@/lib/types";
import { CheckCircle2, Clock, Star, ListTodo } from "lucide-react";

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats = ({ tasks }: TaskStatsProps) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completionLevel === 100).length;
  const starred = tasks.filter((t) => t.starred).length;
  const inProgress = tasks.filter((t) => t.completionLevel > 0 && t.completionLevel < 100).length;

  const stats = [
    { icon: ListTodo, label: "Total", value: total, color: "text-primary" },
    { icon: CheckCircle2, label: "Done", value: completed, color: "text-mint" },
    { icon: Clock, label: "In Progress", value: inProgress, color: "text-lavender" },
    { icon: Star, label: "Starred", value: starred, color: "text-peach" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 animate-fade-in" style={{ animationDelay: "120ms" }}>
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="glass-card p-3 text-center">
          <Icon size={16} className={`mx-auto mb-1 ${color}`} />
          <p className="text-lg font-bold text-foreground">{value}</p>
          <p className="text-[10px] text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;
