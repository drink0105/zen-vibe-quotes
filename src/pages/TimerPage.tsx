import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MdTimer, MdPlayArrow, MdPause, MdStop, MdVolumeUp, MdVibration } from "react-icons/md";

interface Quote {
  id: number;
  text: string;
  author?: string;
  category: string;
  tier: "free" | "premium";
}

interface TimerPageProps {
  allQuotes: Quote[];
  isPremium: boolean;
}

export default function TimerPage({ allQuotes, isPremium }: TimerPageProps) {
  const [duration, setDuration] = useState(60); // seconds
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [selectedSound, setSelectedSound] = useState("bell1");
  const [vibrateEnabled, setVibrateEnabled] = useState(true);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement>(null);

  const availableQuotes = isPremium ? allQuotes : allQuotes.filter(q => q.tier === "free");
  const mindfulnessQuotes = availableQuotes.filter(q => q.category === "Mindfulness");

  // Select random quote
  useEffect(() => {
    if (mindfulnessQuotes.length > 0) {
      const randomQuote = mindfulnessQuotes[Math.floor(Math.random() * mindfulnessQuotes.length)];
      setCurrentQuote(randomQuote);
    }
  }, [mindfulnessQuotes.length]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Timer complete - vibrate and stop audio
            if (vibrateEnabled && 'vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, vibrateEnabled]);

  const startTimer = () => {
    setIsRunning(true);
    // Start audio - free tier gets bell1.mp3, premium gets user selection
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      const soundFile = isPremium ? selectedSound : "bell1";
      audioRef.current.src = `/${soundFile}.mp3`;
      audioRef.current.play().catch(console.error);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  const presetDurations = isPremium 
    ? [60, 120, 180, 240, 300] // 1-5 minutes
    : [60]; // 1 minute only

  return (
    <div className={`min-h-screen ${isPremium ? 'pb-[80px]' : 'pb-[130px]'} px-4 py-8`}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <MdTimer className="w-16 h-16 mx-auto mb-4 text-primary animate-glow-pulse" />
          <h1 className="text-3xl font-bold mb-2">Zen Timer</h1>
          <p className="text-muted-foreground">
            Mindful moments with inspirational quotes
          </p>
        </div>

        {/* Timer Display */}
        <div className="glass-card p-8 mb-6 text-center">
          <div className="relative w-48 h-48 mx-auto mb-6">
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
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="text-primary transition-all duration-1000 ease-linear"
                strokeLinecap="round"
              />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{formatTime(timeLeft)}</div>
                <div className="text-sm text-muted-foreground">
                  {isRunning ? 'Breathing...' : 'Ready'}
                </div>
              </div>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex justify-center gap-4 mb-6">
            {!isRunning ? (
              <Button onClick={startTimer} variant="zen" size="lg">
                <MdPlayArrow className="w-5 h-5 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={pauseTimer} variant="outline" size="lg">
                <MdPause className="w-5 h-5 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={stopTimer} variant="destructive" size="lg">
              <MdStop className="w-5 h-5 mr-2" />
              Stop
            </Button>
          </div>

          {/* Settings */}
          <div className="flex justify-center items-center gap-4">
            <Button
              onClick={() => setVibrateEnabled(!vibrateEnabled)}
              variant={vibrateEnabled ? "zen" : "outline"}
              size="sm"
            >
              <MdVibration className="w-4 h-4 mr-2" />
              {vibrateEnabled ? "ON" : "OFF"}
            </Button>
          </div>
        </div>

        {/* Duration Presets */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Duration</h3>
          <div className="grid grid-cols-3 gap-2">
            {presetDurations.map((preset) => (
              <Button
                key={preset}
                onClick={() => {
                  setDuration(preset);
                  setTimeLeft(preset);
                }}
                variant={duration === preset ? "zen" : "outline"}
                size="sm"
                disabled={isRunning}
              >
                {preset / 60}min
              </Button>
            ))}
          </div>
        </div>

        {/* Sound Selection */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MdVolumeUp className="w-5 h-5" />
            Background Sound
          </h3>
          {isPremium ? (
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "bell1", name: "Bell" },
                { id: "gong2", name: "Gong" },
                { id: "chime3", name: "Chime" },
              ].map((sound) => (
                <Button
                  key={sound.id}
                  onClick={() => setSelectedSound(sound.id)}
                  variant={selectedSound === sound.id ? "zen" : "outline"}
                  size="sm"
                >
                  {sound.name}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-2">Free tier includes Bell sound</p>
              <p className="text-sm text-muted-foreground">Upgrade to premium for Gong and Chime sounds</p>
            </div>
          )}
          
          {/* Audio element */}
          <audio
            ref={audioRef}
            preload="auto"
          />
        </div>

        {/* Current Quote */}
        {currentQuote && (
          <div className="glass-card p-6 mb-6 gradient-mindfulness">
            <div className="text-center">
              <span className="px-3 py-1 text-xs font-semibold bg-white/30 rounded-full backdrop-blur-sm text-black mb-4 inline-block">
                {currentQuote.category}
              </span>
              <blockquote className="text-lg mb-4 leading-relaxed font-quote text-black">
                "{currentQuote.text}"
              </blockquote>
              {currentQuote.author && (
                <p className="text-sm text-black/80">— {currentQuote.author}</p>
              )}
            </div>
          </div>
        )}

        {/* Premium upsell */}
        {!isPremium && (
          <div className="glass-card p-6 text-center gradient-creativity">
            <h3 className="text-lg font-semibold mb-2 text-black">Go Premium</h3>
            <p className="text-black/80 text-sm mb-4">
              Unlock 1-5 minute timers, background sounds, and access to all premium quotes
            </p>
            <Button variant="outline" className="bg-white/20 border-black/30 text-black hover:bg-white/30">
              Upgrade for $2.99
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}