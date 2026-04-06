import { useState } from "react";
import { Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import CategoryBadge from "./CategoryBadge";

const categories: Category[] = ["study", "personal", "projects", "quick-notes"];

interface AddTaskFormProps {
  onAdd: (title: string, category: Category, deadline?: string) => void;
}

const AddTaskForm = ({ onAdd }: AddTaskFormProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("personal");
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), category, deadline?.toISOString());
    setTitle("");
    setDeadline(undefined);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="glass-card-hover w-full p-4 flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        <div className="w-6 h-6 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center">
          <Plus size={14} />
        </div>
        <span className="text-sm font-medium">Add a new task...</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-4 space-y-3 animate-fade-in">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What do you need to do?"
        className="border-none bg-muted/50 focus-visible:ring-primary/30"
        autoFocus
      />
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <CategoryBadge key={cat} category={cat} selected={category === cat} onClick={() => setCategory(cat)} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button" variant="outline" size="sm"
              className={cn("text-xs gap-1.5", !deadline && "text-muted-foreground")}
            >
              <CalendarIcon size={14} />
              {deadline ? format(deadline, "dd/MM/yyyy") : "Deadline"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single" selected={deadline} onSelect={setDeadline}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {deadline && (
          <Button type="button" variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={() => setDeadline(undefined)}>
            ✕
          </Button>
        )}
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
        <Button type="submit" size="sm" disabled={!title.trim()}>Add</Button>
      </div>
    </form>
  );
};

export default AddTaskForm;
