import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
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
  const [duration, setDuration] = useState(60); // seconds
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  
  const maxDuration = isPremium ? 300 : 60; // 5 minutes for premium, 1 minute for free
  
  const mindfulnessQuotes = allQuotes.filter(q => 
    q.category === "Mindfulness" && (isPremium || q.tier === "free")
  );

  useEffect(() => {
    if (mindfulnessQuotes.length > 0 && !currentQuote) {
      const randomQuote = mindfulnessQuotes[Math.floor(Math.random() * mindfulnessQuotes.length)];
      setCurrentQuote(randomQuote);
    }
  }, [mindfulnessQuotes, currentQuote]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsRunning(false);
      if (vibrateEnabled && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, vibrateEnabled]);

  const startTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration);
    }
    setIsRunning(true);
    
    // Change quote when starting
    if (mindfulnessQuotes.length > 0) {
      const randomQuote = mindfulnessQuotes[Math.floor(Math.random() * mindfulnessQuotes.length)];
      setCurrentQuote(randomQuote);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  const presetTimes = isPremium 
    ? [60, 120, 180, 240, 300] // 1-5 minutes for premium
    : [60]; // 1 minute only for free

  return (
    <div className="min-h-screen pb-32 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <MdTimer className="w-16 h-16 mx-auto mb-4 text-primary animate-glow-pulse" />
          <h1 className="text-3xl font-bold mb-2">Zen Timer</h1>
          <p className="text-muted-foreground">
            Mindful breathing with inspirational quotes
          </p>
        </div>

        {/* Timer Circle */}
        <div className="glass-card p-8 mb-6 text-center">
          <div className="relative w-64 h-64 mx-auto mb-6">
            {/* Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-muted-foreground/20"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-primary glow-primary transition-all duration-1000"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Timer Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{formatTime(timeLeft)}</div>
                <div className="text-sm text-muted-foreground">
                  {isRunning ? 'Breathing...' : 'Ready'}
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            {!isRunning ? (
              <Button 
                onClick={startTimer}
                variant="zen"
                size="lg"
                className="glow-primary"
              >
                <MdPlayArrow className="w-6 h-6 mr-2" />
                Start
              </Button>
            ) : (
              <Button 
                onClick={pauseTimer}
                variant="outline"
                size="lg"
              >
                <MdPause className="w-6 h-6 mr-2" />
                Pause
              </Button>
            )}
            
            <Button 
              onClick={stopTimer}
              variant="outline"
              size="lg"
            >
              <MdStop className="w-6 h-6 mr-2" />
              Stop
            </Button>
          </div>

          {/* Vibration Toggle */}
          <Button
            onClick={() => setVibrateEnabled(!vibrateEnabled)}
            variant="ghost"
            size="sm"
            className={vibrateEnabled ? 'text-primary' : 'text-muted-foreground'}
          >
            <MdVibration className="w-4 h-4 mr-2" />
            Vibrate on finish
          </Button>
        </div>

        {/* Duration Presets */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Timer Duration</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {presetTimes.map(time => (
              <Button
                key={time}
                onClick={() => {
                  setDuration(time);
                  setTimeLeft(time);
                  setIsRunning(false);
                }}
                variant={duration === time ? "zen" : "outline"}
                size="sm"
                className="transition-all duration-300 hover:scale-105"
              >
                {time / 60}min
              </Button>
            ))}
          </div>
          
          {!isPremium && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Free tier: 1 minute only. Premium: up to 5 minutes
            </p>
          )}
        </div>

        {/* Current Quote */}
        {currentQuote && (
          <div className="glass-card p-6 gradient-mindfulness">
            <div className="text-center text-white">
              <h3 className="text-sm font-semibold mb-4 opacity-90">
                Mindfulness Quote
              </h3>
              <blockquote className="text-lg font-quote mb-4 leading-relaxed">
                "{currentQuote.text}"
              </blockquote>
              {currentQuote.author && (
                <p className="text-white/80 text-sm">— {currentQuote.author}</p>
              )}
            </div>
          </div>
        )}

        {/* Premium upsell */}
        {!isPremium && (
          <div className="glass-card p-6 mt-6 text-center gradient-creativity">
            <h3 className="text-lg font-semibold mb-2 text-white">Go Premium</h3>
            <p className="text-white/90 text-sm mb-4">
              Unlock 1-5 minute timers and access to all premium mindfulness quotes
            </p>
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              Upgrade for $2.99
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}