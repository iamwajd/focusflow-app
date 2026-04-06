import { Flame, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

const STREAK_KEY = "focusflow-streak";

interface StreakData {
  count: number;
  lastDate: string;
}

const getTodayStr = () => new Date().toISOString().slice(0, 10);

const loadStreak = (): StreakData => {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, lastDate: "" };
};

const DailyStreak = () => {
  const [streak, setStreak] = useState<StreakData>(loadStreak);

  useEffect(() => {
    const today = getTodayStr();
    if (streak.lastDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const newStreak: StreakData =
      streak.lastDate === yesterdayStr
        ? { count: streak.count + 1, lastDate: today }
        : { count: 1, lastDate: today };

    setStreak(newStreak);
    localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
  }, []);

  return (
    <div className="glass-card p-4 flex items-center justify-between animate-fade-in" style={{ animationDelay: "150ms" }}>
      <div className="flex items-center gap-2">
        <Flame size={20} className="text-peach" />
        <div>
          <p className="text-xs text-muted-foreground">سلسلة الأيام</p>
          <p className="text-lg font-bold text-foreground">{streak.count} {streak.count === 1 ? "يوم" : "أيام"}</p>
        </div>
      </div>
      {streak.count >= 7 && (
        <div className="flex items-center gap-1 bg-peach-light px-2.5 py-1 rounded-full">
          <Trophy size={14} className="text-peach" />
          <span className="text-[10px] font-semibold text-foreground">أسبوع كامل!</span>
        </div>
      )}
    </div>
  );
};

export default DailyStreak;
