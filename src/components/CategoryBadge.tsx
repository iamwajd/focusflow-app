import { BookOpen, User, FolderKanban, StickyNote } from "lucide-react";
import { Category } from "@/lib/types";

const categoryConfig: Record<Category, { label: string; icon: React.ElementType; colorClass: string }> = {
  study: { label: "Study", icon: BookOpen, colorClass: "bg-lavender-light text-foreground" },
  personal: { label: "Personal", icon: User, colorClass: "bg-rose-light text-foreground" },
  projects: { label: "Projects", icon: FolderKanban, colorClass: "bg-mint-light text-foreground" },
  "quick-notes": { label: "Notes", icon: StickyNote, colorClass: "bg-peach-light text-foreground" },
};

interface CategoryBadgeProps {
  category: Category;
  selected?: boolean;
  onClick?: () => void;
}

const CategoryBadge = ({ category, selected, onClick }: CategoryBadgeProps) => {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
        config.colorClass
      } ${selected ? "ring-2 ring-primary ring-offset-1" : "opacity-70 hover:opacity-100"} ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <Icon size={13} />
      {config.label}
    </button>
  );
};

export default CategoryBadge;
export { categoryConfig };
