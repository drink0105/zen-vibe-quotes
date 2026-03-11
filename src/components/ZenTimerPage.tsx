import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { 
  MdTimer, 
  MdPlayArrow, 
  MdPause, 
  MdStop, 
  MdVibration 
} from "react-icons/md";

interface Quote {
  id: number;
  text: string;
  author?: string;
  category: string;
  tier: "free" | "premium";
}

interface ZenTimerPageProps {
  isPremium: boolean;
  allQuotes: Quote[];
}

export function ZenTimerPage({ isPremium, allQuotes }: ZenTimerPageProps) {
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);
  const { t } = useLanguage();
  
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const maxDuration = isPremium ? 300 : 60;
  
  const mindfulnessQuotes = allQuotes.filter(q => 
    q.category === "Mindfulness" && (isPremium || q.tier === "free")
  );

  useEffect(() => {
    if (mindfulnessQuotes.length > 0 && !currentQuote) {
      setCurrentQuote(mindfulnessQuotes[Math.floor(Math.random() * mindfulnessQuotes.length)]);
    }
  }, [mindfulnessQuotes, currentQuote]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (vibrateEnabled && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isRunning, timeLeft, vibrateEnabled]);

  const startTimer = () => {
    if (timeLeft === 0) setTimeLeft(duration);
    setIsRunning(true);
    if (mindfulnessQuotes.length > 0) {
      setCurrentQuote(mindfulnessQuotes[Math.floor(Math.random() * mindfulnessQuotes.length)]);
    }
  };

  const pauseTimer = () => setIsRunning(false);
  const stopTimer = () => { setIsRunning(false); setTimeLeft(duration); };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  const presetTimes = isPremium 
    ? [60, 120, 180, 240, 300]
    : [60];

  return (
    <div className="min-h-screen pb-32 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <MdTimer className="w-16 h-16 mx-auto mb-4 text-primary animate-glow-pulse" />
          <h1 className="text-3xl font-bold mb-2">{t("timer.title")}</h1>
          <p className="text-muted-foreground">{t("timer.subtitle")}</p>
        </div>

        <div className="glass-card p-8 mb-6 text-center">
          <div className="relative w-64 h-64 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" className="text-muted-foreground/20" />
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" fill="none"
                className="text-primary glow-primary transition-all duration-1000"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{formatTime(timeLeft)}</div>
                <div className="text-sm text-muted-foreground">
                  {isRunning ? t("timer.breathing") : t("timer.ready")}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            {!isRunning ? (
              <Button onClick={startTimer} variant="zen" size="lg" className="glow-primary">
                <MdPlayArrow className="w-6 h-6 mr-2" />
                {t("timer.start")}
              </Button>
            ) : (
              <Button onClick={pauseTimer} variant="outline" size="lg">
                <MdPause className="w-6 h-6 mr-2" />
                {t("timer.pause")}
              </Button>
            )}
            <Button onClick={stopTimer} variant="outline" size="lg">
              <MdStop className="w-6 h-6 mr-2" />
              {t("timer.stop")}
            </Button>
          </div>

          <Button
            onClick={() => setVibrateEnabled(!vibrateEnabled)}
            variant="ghost"
            size="sm"
            className={vibrateEnabled ? 'text-primary' : 'text-muted-foreground'}
          >
            <MdVibration className="w-4 h-4 mr-2" />
            {t("timer.vibrateOnFinish")}
          </Button>
        </div>

        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">{t("timer.duration")}</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {presetTimes.map(time => (
              <Button
                key={time}
                onClick={() => { setDuration(time); setTimeLeft(time); setIsRunning(false); }}
                variant={duration === time ? "zen" : "outline"}
                size="sm"
                className="transition-all duration-300 hover:scale-105"
              >
                {time / 60}{t("timer.min")}
              </Button>
            ))}
          </div>
          {!isPremium && (
            <p className="text-sm text-muted-foreground mt-4 text-center">{t("timer.freeLimit")}</p>
          )}
        </div>

        {currentQuote && (
          <div className="glass-card p-6 gradient-mindfulness">
            <div className="text-center text-white">
              <h3 className="text-sm font-semibold mb-4 opacity-90">{t("timer.mindfulnessQuote")}</h3>
              <blockquote className="text-lg font-quote mb-4 leading-relaxed">
                "{currentQuote.text}"
              </blockquote>
              {currentQuote.author && (
                <p className="text-white/80 text-sm">— {currentQuote.author}</p>
              )}
            </div>
          </div>
        )}

        {!isPremium && (
          <div className="glass-card p-6 mt-6 text-center gradient-creativity">
            <h3 className="text-lg font-semibold mb-2 text-white">{t("timer.premiumTitle")}</h3>
            <p className="text-white/90 text-sm mb-4">{t("timer.premiumDesc")}</p>
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              {t("shared.upgradeFor")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
