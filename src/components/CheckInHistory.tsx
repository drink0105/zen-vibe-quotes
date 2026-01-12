import { MdHistory, MdWbSunny, MdNightlight, MdLocalFireDepartment, MdInbox } from "react-icons/md";

interface CheckInData {
  date: string;
  morning: boolean;
  evening: boolean;
  reflection: string;
}

interface CheckInHistoryProps {
  checkIns: CheckInData[];
  streak: number;
  compact?: boolean;
}

export function CheckInHistory({ checkIns, streak, compact = false }: CheckInHistoryProps) {
  const sortedCheckIns = [...checkIns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const displayCheckIns = compact ? sortedCheckIns.slice(0, 5) : sortedCheckIns;

  // Calculate streak for specific dates
  const getStreakForDate = (date: string, index: number) => {
    if (index === 0 && sortedCheckIns.length > 0) {
      return streak;
    }
    // For past entries, we'd need to recalculate, so just show checkmark
    return null;
  };

  if (checkIns.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <MdInbox className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-semibold mb-2 text-muted-foreground">No Check-Ins Yet</h3>
        <p className="text-sm text-muted-foreground/70">
          Complete your first daily check-in to start building your mindfulness journal.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <MdHistory className="w-6 h-6 text-primary" />
        <h3 className="text-lg font-semibold">Check-In History</h3>
        {streak > 0 && (
          <span className="ml-auto flex items-center gap-1 text-orange-500 text-sm font-medium">
            <MdLocalFireDepartment className="w-5 h-5" />
            {streak} day streak
          </span>
        )}
      </div>

      <div className={`space-y-4 ${compact ? 'max-h-80' : 'max-h-[500px]'} overflow-y-auto pr-2`}>
        {displayCheckIns.map((entry, index) => {
          const entryDate = new Date(entry.date);
          const isToday = entry.date === new Date().toISOString().split("T")[0];
          const isYesterday = entry.date === new Date(Date.now() - 86400000).toISOString().split("T")[0];
          
          let dateLabel = entryDate.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long', 
            day: 'numeric',
            year: entryDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
          });
          
          if (isToday) dateLabel = "Today";
          if (isYesterday) dateLabel = "Yesterday";

          // Parse reflections into morning and evening
          const reflectionParts = entry.reflection.split('\n\n');
          const morningReflection = reflectionParts.find(p => p.startsWith('[Morning]'))?.replace('[Morning] ', '');
          const eveningReflection = reflectionParts.find(p => p.startsWith('[Evening]'))?.replace('[Evening] ', '');
          // Handle legacy format (no tags)
          const legacyReflection = !morningReflection && !eveningReflection && entry.reflection ? entry.reflection : null;

          return (
            <div 
              key={entry.date} 
              className={`
                border border-border/50 rounded-xl p-4 
                ${isToday ? 'bg-primary/5 border-primary/30' : 'bg-background/30'}
                transition-colors hover:bg-muted/30
              `}
            >
              {/* Date Header */}
              <div className="flex items-center justify-between mb-3">
                <span className={`font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                  {dateLabel}
                </span>
                <div className="flex items-center gap-2">
                  {entry.morning && (
                    <span className="flex items-center gap-1 text-xs bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-full">
                      <MdWbSunny className="w-3 h-3" />
                      Morning
                    </span>
                  )}
                  {entry.evening && (
                    <span className="flex items-center gap-1 text-xs bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full">
                      <MdNightlight className="w-3 h-3" />
                      Evening
                    </span>
                  )}
                </div>
              </div>

              {/* Reflections */}
              <div className="space-y-3">
                {morningReflection && (
                  <div className="pl-3 border-l-2 border-amber-400/50">
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">Morning Reflection</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{morningReflection}</p>
                  </div>
                )}
                
                {eveningReflection && (
                  <div className="pl-3 border-l-2 border-indigo-400/50">
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">Evening Reflection</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{eveningReflection}</p>
                  </div>
                )}
                
                {legacyReflection && (
                  <div className="pl-3 border-l-2 border-muted-foreground/30">
                    <p className="text-sm text-muted-foreground leading-relaxed">{legacyReflection}</p>
                  </div>
                )}

                {!morningReflection && !eveningReflection && !legacyReflection && (
                  <p className="text-sm text-muted-foreground/50 italic pl-3">
                    Check-in completed without reflection
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {compact && sortedCheckIns.length > 5 && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Showing 5 of {sortedCheckIns.length} entries
        </p>
      )}
    </div>
  );
}
