import { useState, useEffect } from "react";
import { MdOpenInNew, MdStars } from "react-icons/md";
import { Button } from "@/components/ui/button";

interface Quote {
  id: number;
  text: string;
  author?: string;
  category: string;
  tier: "free" | "premium";
}

interface QuoteOfTheDayProps {
  allQuotes: Quote[];
  isPremium: boolean;
  customFont?: string;
  customGradient?: string;
}

export function QuoteOfTheDay({ 
  allQuotes, 
  isPremium,
  customFont = "font-quote",
  customGradient = "gradient-motivation"
}: QuoteOfTheDayProps) {
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const getDailyQuote = () => {
      const today = new Date().toDateString();
      const stored = localStorage.getItem("zenvibe-qotd");
      
      if (stored) {
        const { date, quoteId } = JSON.parse(stored);
        if (date === today) {
          const quote = allQuotes.find(q => q.id === quoteId);
          if (quote) {
            setDailyQuote(quote);
            return;
          }
        }
      }

      // Generate new daily quote
      const availableQuotes = isPremium 
        ? allQuotes 
        : allQuotes.filter(q => q.tier === "free");
      
      if (availableQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableQuotes.length);
        const newQuote = availableQuotes[randomIndex];
        setDailyQuote(newQuote);
        
        localStorage.setItem("zenvibe-qotd", JSON.stringify({
          date: today,
          quoteId: newQuote.id
        }));
      }
    };

    getDailyQuote();

    // Check at midnight for new quote
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(() => {
      getDailyQuote();
      // Set daily interval after first midnight
      setInterval(getDailyQuote, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [allQuotes, isPremium]);

  if (!dailyQuote) return null;

  return (
    <div className="w-full max-w-md mx-auto px-4 mb-6">
      <div className="glass-card gradient-blue relative overflow-hidden p-6 border-2 border-blue-400">
        {/* Premium badge */}
        {isPremium && (
          <div className="absolute top-3 right-3">
            <MdStars className="w-5 h-5 text-yellow-400 animate-glow-pulse" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <h3 className="text-sm font-semibold text-black">
            Quote of the Day
          </h3>
        </div>

        {/* Quote */}
        <blockquote className={`
          ${customFont} text-lg leading-relaxed mb-3 text-black
        `}>
          "{dailyQuote.text}"
        </blockquote>

        {/* Author */}
        {dailyQuote.author && (
          <p className="text-sm mb-4 text-black/80">
            — {dailyQuote.author}
          </p>
        )}

        {/* Category tag */}
        <div className="flex items-center justify-center">
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-white/30 text-black">
            {dailyQuote.category}
          </span>
        </div>
      </div>
    </div>
  );
}