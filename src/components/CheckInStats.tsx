import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { MdLocalFireDepartment, MdCheckCircle, MdCancel, MdCalendarToday } from "react-icons/md";
import { useLanguage } from "@/i18n/LanguageContext";

interface CheckInData {
  date: string;
  morning: boolean;
  evening: boolean;
  reflection: string;
}

interface CheckInStatsProps {
  checkIns: CheckInData[];
  streak: number;
  isPremium: boolean;
}

export function CheckInStats({ checkIns, streak, isPremium }: CheckInStatsProps) {
  const { t, language } = useLanguage();

  const stats = useMemo(() => {
    const today = new Date();
    const last14Days: { date: string; label: string; completed: number; missed: boolean }[] = [];
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayLabel = date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'short' }).charAt(0);
      
      const checkIn = checkIns.find(c => c.date === dateStr);
      const completedCount = checkIn 
        ? (checkIn.morning ? 1 : 0) + (checkIn.evening && isPremium ? 1 : 0)
        : 0;
      
      const isToday = i === 0;
      const missed = !isToday && !checkIn;
      
      last14Days.push({ date: dateStr, label: dayLabel, completed: completedCount, missed });
    }
    
    const totalCompleted = checkIns.length;
    const last14Completed = last14Days.filter(d => d.completed > 0).length;
    const last14Missed = last14Days.filter(d => d.missed).length;
    const completionRate = Math.round((last14Completed / 13) * 100);
    
    return { totalCompleted, last14Completed, last14Missed, completionRate, chartData: last14Days };
  }, [checkIns, isPremium, language]);

  const getBarColor = (completed: number, missed: boolean) => {
    if (completed >= 2) return "hsl(142, 76%, 36%)";
    if (completed === 1) return "hsl(45, 93%, 47%)";
    if (missed) return "hsl(0, 0%, 80%)";
    return "hsl(0, 0%, 90%)";
  };

  return (
    <div className="glass-card p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <MdCalendarToday className="w-5 h-5 text-primary" />
        {t("stats.yourProgress")}
      </h3>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 rounded-lg bg-primary/10">
          <div className="flex items-center justify-center gap-1 mb-1">
            <MdLocalFireDepartment className={`w-5 h-5 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
          </div>
          <p className="text-2xl font-bold">{streak}</p>
          <p className="text-xs text-muted-foreground">{t("stats.dayStreak")}</p>
        </div>
        
        <div className="text-center p-3 rounded-lg bg-green-500/10">
          <div className="flex items-center justify-center gap-1 mb-1">
            <MdCheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{stats.last14Completed}</p>
          <p className="text-xs text-muted-foreground">{t("stats.last14Days")}</p>
        </div>
        
        <div className="text-center p-3 rounded-lg bg-muted/30">
          <div className="flex items-center justify-center gap-1 mb-1">
            <MdCancel className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{stats.last14Missed}</p>
          <p className="text-xs text-muted-foreground">{t("stats.missed")}</p>
        </div>
      </div>

      <div className="mb-2">
        <p className="text-sm text-muted-foreground mb-3">{t("stats.last14Activity")}</p>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData} barCategoryGap="15%">
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                interval={1}
              />
              <YAxis hide domain={[0, isPremium ? 2 : 1]} />
              <Bar dataKey="completed" radius={[4, 4, 0, 0]} minPointSize={4}>
                {stats.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.completed, entry.missed)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-green-500"></div>
          <span>{isPremium ? t("stats.both") : t("stats.completeStat")}</span>
        </div>
        {isPremium && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-amber-500"></div>
            <span>{t("stats.one")}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-300"></div>
          <span>{t("stats.missed")}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50 text-center">
        <p className="text-sm">
          <span className="font-semibold text-primary">{stats.completionRate}%</span>
          <span className="text-muted-foreground"> {t("stats.completionRate")}</span>
        </p>
      </div>
    </div>
  );
}
