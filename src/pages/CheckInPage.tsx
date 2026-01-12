import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSpeakQuote } from "@/hooks/useSpeakQuote";
import { CheckInHistory } from "@/components/CheckInHistory";
import { MdSelfImprovement, MdWbSunny, MdNightlight, MdLocalFireDepartment, MdCheck, MdVolumeUp, MdVolumeOff } from "react-icons/md";

interface Quote {
  id: number;
  text: string;
  author?: string;
  category: string;
  tier: "free" | "premium";
}

interface CheckInData {
  date: string;
  morning: boolean;
  evening: boolean;
  reflection: string;
}

interface CheckInPageProps {
  allQuotes: Quote[];
  isPremium: boolean;
  onPremiumUpgrade: () => void;
}

export default function CheckInPage({ allQuotes, isPremium, onPremiumUpgrade }: CheckInPageProps) {
  const [checkIns, setCheckIns] = useLocalStorage<CheckInData[]>("zenvibe-checkins", []);
  const [streak, setStreak] = useLocalStorage<number>("zenvibe-streak", 0);
  const [lastCheckInDate, setLastCheckInDate] = useLocalStorage<string>("zenvibe-last-checkin", "");
  const [reflection, setReflection] = useState("");
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const { speakQuote, speakText, isSpeaking } = useSpeakQuote(isPremium);

  const today = new Date().toISOString().split("T")[0];
  const currentHour = new Date().getHours();
  const isMorning = currentHour < 12;
  const isEvening = currentHour >= 17;

  const todayCheckIn = checkIns.find(c => c.date === today);
  const canDoMorning = !todayCheckIn?.morning;
  const canDoEvening = isPremium && !todayCheckIn?.evening && isEvening;

  // Calculate streak on mount
  useEffect(() => {
    if (!lastCheckInDate) return;
    
    const lastDate = new Date(lastCheckInDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Reset streak if more than 1 day has passed
    if (diffDays > 1) {
      setStreak(0);
    }
  }, [lastCheckInDate, today, setStreak]);

  // Breathing animation
  useEffect(() => {
    if (!showBreathing) return;

    const phases = [
      { phase: "inhale" as const, duration: 4000 },
      { phase: "hold" as const, duration: 4000 },
      { phase: "exhale" as const, duration: 6000 },
    ];

    let phaseIndex = 0;
    setBreathPhase(phases[0].phase);

    const interval = setInterval(() => {
      phaseIndex = (phaseIndex + 1) % phases.length;
      setBreathPhase(phases[phaseIndex].phase);
    }, phases[phaseIndex].duration);

    return () => clearInterval(interval);
  }, [showBreathing]);

  const getRandomQuote = () => {
    const availableQuotes = isPremium ? allQuotes : allQuotes.filter(q => q.tier === "free");
    const mindfulQuotes = availableQuotes.filter(q => 
      q.category.toLowerCase().includes("mindfulness") || 
      q.category.toLowerCase().includes("motivation")
    );
    const pool = mindfulQuotes.length > 0 ? mindfulQuotes : availableQuotes;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const [dailyQuote] = useState(() => getRandomQuote());

  const completeCheckIn = (type: "morning" | "evening") => {
    const reflectionText = reflection.trim();
    const existingCheckIn = checkIns.find(c => c.date === today);
    
    let updatedCheckIns: CheckInData[];
    
    if (existingCheckIn) {
      // Append to existing reflection, don't overwrite
      const existingReflection = existingCheckIn.reflection || "";
      const newReflection = reflectionText 
        ? (existingReflection ? `${existingReflection}\n\n[${type === "morning" ? "Morning" : "Evening"}] ${reflectionText}` : `[${type === "morning" ? "Morning" : "Evening"}] ${reflectionText}`)
        : existingReflection;
      
      updatedCheckIns = checkIns.map(c => 
        c.date === today 
          ? { ...c, [type]: true, reflection: newReflection }
          : c
      );
    } else {
      updatedCheckIns = [...checkIns, {
        date: today,
        morning: type === "morning",
        evening: type === "evening",
        reflection: reflectionText ? `[${type === "morning" ? "Morning" : "Evening"}] ${reflectionText}` : ""
      }];
    }
    
    // Save to localStorage immediately
    setCheckIns(updatedCheckIns);

    // Update streak
    const lastDate = new Date(lastCheckInDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (lastCheckInDate === today) {
      // Already checked in today, no streak change
    } else if (diffDays === 1 || !lastCheckInDate) {
      // Consecutive day or first check-in
      setStreak(streak + 1);
    } else if (diffDays > 1) {
      // Missed days, start new streak
      setStreak(1);
    }

    setLastCheckInDate(today);
    setReflection("");
    setShowCompletionMessage(true);
    setTimeout(() => setShowCompletionMessage(false), 3000);
  };

  const reflectionPrompts = isPremium 
    ? [
        "What intention will guide your day?",
        "What are you grateful for in this moment?",
        "How do you want to feel today?",
        "What is one small act of kindness you can offer?",
        "What would make today meaningful?"
      ]
    : [
        "What's one thing you're looking forward to?"
      ];

  const eveningPrompts = [
    "What went well today?",
    "What did you learn about yourself?",
    "How did you show up for yourself today?",
    "What moment brought you joy?",
    "What are you ready to release?"
  ];

  const currentPrompt = isEvening && isPremium 
    ? eveningPrompts[Math.floor(Math.random() * eveningPrompts.length)]
    : reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)];

  return (
    <div className={`min-h-screen ${isPremium ? 'pb-[80px]' : 'pb-[130px]'} px-4 py-8`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <MdSelfImprovement className="w-16 h-16 mx-auto mb-4 text-primary animate-glow-pulse" />
          <h1 className="text-3xl font-bold mb-2">Daily Check-In</h1>
          <p className="text-muted-foreground">
            A gentle moment to center yourself
          </p>
        </div>

        {/* Streak Display */}
        <div className="glass-card p-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold">
            <MdLocalFireDepartment className={`w-8 h-8 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
            <span>{streak} Day Streak</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {streak === 0 
              ? "Start your mindfulness journey today"
              : streak === 1 
                ? "Great start! Keep it going"
                : `${streak} consecutive days of presence`
            }
          </p>
        </div>

        {/* Daily Quote */}
        {dailyQuote && (
          <div className="glass-card p-6 mb-6 gradient-mindfulness">
            <blockquote className="text-lg font-quote leading-relaxed text-black mb-2">
              "{dailyQuote.text}"
            </blockquote>
            <div className="flex items-center justify-between">
              {dailyQuote.author && (
                <p className="text-sm text-black/70">— {dailyQuote.author}</p>
              )}
              <Button
                onClick={() => speakQuote(dailyQuote)}
                variant="ghost"
                size="sm"
                className={`ml-auto text-black hover:bg-black/10 ${isSpeaking ? 'animate-pulse' : ''}`}
                title={isSpeaking ? "Stop listening" : "Listen to quote"}
              >
                {isSpeaking ? (
                  <MdVolumeOff className="w-5 h-5" />
                ) : (
                  <MdVolumeUp className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Completion Celebration */}
        {showCompletionMessage && (
          <div className="glass-card p-4 mb-6 text-center bg-green-500/20 border-green-500/30">
            <p className="text-green-600 dark:text-green-400 font-medium">
              ✨ Check-in complete! You're doing great. ✨
            </p>
            <Button
              onClick={() => speakText("Check-in complete! You're doing great. Keep nurturing your inner peace.")}
              variant="ghost"
              size="sm"
              className="mt-2"
            >
              <MdVolumeUp className="w-4 h-4 mr-2" />
              Hear Confirmation
            </Button>
          </div>
        )}

        {/* Check-In Sections */}
        <div className="space-y-4 mb-6">
          {/* Morning Check-In */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <MdWbSunny className="w-6 h-6 text-amber-500" />
              <h3 className="text-lg font-semibold">Morning Check-In</h3>
              {todayCheckIn?.morning && (
                <span className="ml-auto flex items-center gap-1 text-green-500 text-sm">
                  <MdCheck className="w-4 h-4" /> Complete
                </span>
              )}
            </div>
            
            {canDoMorning ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">
                    {currentPrompt}
                  </label>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Take a moment to reflect..."
                    className="glass-button w-full p-3 rounded-lg border text-foreground min-h-[80px] resize-none"
                  />
                </div>
                <Button 
                  onClick={() => completeCheckIn("morning")} 
                  variant="zen" 
                  className="w-full"
                >
                  Complete Morning Check-In
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                You've completed your morning check-in. Wonderful! 🌅
              </p>
            )}
          </div>

          {/* Evening Check-In (Premium) */}
          {isPremium ? (
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <MdNightlight className="w-6 h-6 text-indigo-500" />
                <h3 className="text-lg font-semibold">Evening Check-In</h3>
                {todayCheckIn?.evening && (
                  <span className="ml-auto flex items-center gap-1 text-green-500 text-sm">
                    <MdCheck className="w-4 h-4" /> Complete
                  </span>
                )}
              </div>
              
              {!isEvening ? (
                <p className="text-muted-foreground text-sm">
                  Available after 5 PM. Take your time. ✨
                </p>
              ) : canDoEvening ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">
                      {eveningPrompts[Math.floor(Math.random() * eveningPrompts.length)]}
                    </label>
                    <textarea
                      value={reflection}
                      onChange={(e) => setReflection(e.target.value)}
                      placeholder="Reflect on your day..."
                      className="glass-button w-full p-3 rounded-lg border text-foreground min-h-[80px] resize-none"
                    />
                  </div>
                  <Button 
                    onClick={() => completeCheckIn("evening")} 
                    variant="zen" 
                    className="w-full"
                  >
                    Complete Evening Check-In
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  You've completed your evening check-in. Rest well. 🌙
                </p>
              )}
            </div>
          ) : (
            <div className="glass-card p-6 opacity-60">
              <div className="flex items-center gap-3 mb-2">
                <MdNightlight className="w-6 h-6 text-indigo-500" />
                <h3 className="text-lg font-semibold">Evening Check-In</h3>
                <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Premium</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Unlock evening reflections with Premium
              </p>
            </div>
          )}
        </div>

        {/* Breathing Exercise (Premium) */}
        {isPremium && (
          <div className="glass-card p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Mindful Breathing</h3>
            
            {showBreathing ? (
              <div className="text-center py-8">
                <div 
                  className={`w-32 h-32 mx-auto rounded-full bg-primary/20 flex items-center justify-center transition-all duration-1000 ${
                    breathPhase === "inhale" ? "scale-125" : 
                    breathPhase === "hold" ? "scale-125" : 
                    "scale-75"
                  }`}
                >
                  <span className="text-lg font-medium capitalize">{breathPhase}</span>
                </div>
                <p className="text-muted-foreground mt-4 text-sm">
                  {breathPhase === "inhale" && "Breathe in slowly..."}
                  {breathPhase === "hold" && "Hold gently..."}
                  {breathPhase === "exhale" && "Release slowly..."}
                </p>
                <Button 
                  onClick={() => setShowBreathing(false)} 
                  variant="outline" 
                  size="sm"
                  className="mt-6"
                >
                  End Session
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-4">
                  A simple 4-4-6 breathing pattern to calm your mind
                </p>
                <Button onClick={() => setShowBreathing(true)} variant="outline">
                  Start Breathing Exercise
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Premium Upsell */}
        {!isPremium && (
          <div className="glass-card p-6 text-center gradient-creativity">
            <h3 className="text-lg font-semibold mb-2 text-white">Deepen Your Practice</h3>
            <p className="text-white/90 text-sm mb-4">
              Unlock evening check-ins, breathing exercises, and expanded reflection prompts
            </p>
            <Button 
              onClick={onPremiumUpgrade}
              variant="outline" 
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Upgrade for $2.99
            </Button>
          </div>
        )}

        {/* Check-In History */}
        <div className="mt-6">
          <CheckInHistory checkIns={checkIns} streak={streak} />
        </div>
      </div>
    </div>
  );
}