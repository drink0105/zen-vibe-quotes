import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

interface Quote {
  id: number;
  text: string;
  author?: string;
  category: string;
  
}

interface QuoteOfTheDayProps {
  allQuotes: Quote[];
  customFont?: string;
  customGradient?: string;
}

export function QuoteOfTheDay({ 
  allQuotes, 
  customFont = "font-quote",
  customGradient = "gradient-motivation"
}: QuoteOfTheDayProps) {
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const { t } = useLanguage();

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

      if (allQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * allQuotes.length);
        const newQuote = allQuotes[randomIndex];
        setDailyQuote(newQuote);
        
        localStorage.setItem("zenvibe-qotd", JSON.stringify({
          date: today,
          quoteId: newQuote.id
        }));
      }
    };

    getDailyQuote();

    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(() => {
      getDailyQuote();
      setInterval(getDailyQuote, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [allQuotes]);

  if (!dailyQuote) return null;

  return (
    <div className="w-full max-w-md mx-auto px-4 mb-6">
      <div className="glass-card gradient-blue relative overflow-hidden p-6 border-2 border-blue-400">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <h3 className="text-sm font-semibold text-black">{t("qotd.title")}</h3>
        </div>

        <blockquote className={`${customFont} text-lg leading-relaxed mb-3 text-black`}>
          "{dailyQuote.text}"
        </blockquote>

        {dailyQuote.author && (
          <p className="text-sm mb-4 text-black/80">— {dailyQuote.author}</p>
        )}

        <div className="flex items-center justify-center">
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-white/30 text-black">
            {t(`cat.${dailyQuote.category}`)}
          </span>
        </div>
      </div>
    </div>
  );
}
