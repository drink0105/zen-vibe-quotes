import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdRefresh, MdFavorite, MdFavoriteBorder, MdShare, MdVolumeUp, MdVolumeOff } from "react-icons/md";
import { useSpeakQuote } from "@/hooks/useSpeakQuote";
import { useLanguage } from "@/i18n/LanguageContext";

interface Quote {
  id: number;
  text: string;
  author?: string;
  category: string;
  
}

interface QuoteCardProps {
  quote: Quote;
  onNewQuote: () => void;
  onFavorite: (quote: Quote) => void;
  onShare: (quote: Quote) => void;
  isFavorited: boolean;
}

const categoryGradients: Record<string, string> = {
  Motivation: "gradient-motivation",
  Mindfulness: "gradient-mindfulness", 
  Humor: "gradient-humor",
  Productivity: "gradient-productivity",
  Creativity: "gradient-creativity",
  Resilience: "gradient-resilience",
};

const categoryGlows: Record<string, string> = {
  Motivation: "glow-motivation",
  Mindfulness: "glow-mindfulness",
  Humor: "glow-humor", 
  Productivity: "glow-productivity",
  Creativity: "glow-creativity",
  Resilience: "glow-resilience",
};

export function QuoteCard({ quote, onNewQuote, onFavorite, onShare, isFavorited }: QuoteCardProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);
  const { speakQuote, isSpeaking } = useSpeakQuote();
  const { t } = useLanguage();

  const handleNewQuote = () => {
    setIsFlipping(true);
    setTimeout(() => {
      onNewQuote();
      setIsFlipping(false);
    }, 200);
  };

  const handleFavorite = () => {
    setHeartPulse(true);
    onFavorite(quote);
    setTimeout(() => setHeartPulse(false), 300);
  };

  const gradientClass = categoryGradients[quote.category] || "gradient-default";
  const glowClass = categoryGlows[quote.category] || "glow-primary";

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className={`
        quote-card tilt-3d relative overflow-hidden
        ${isFlipping ? 'flip-exit-active' : 'flip-enter-active'}
        ${glowClass}
      `}>
        <div className={`
          inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6
          ${gradientClass} shadow-lg dark:text-black
        `}>
          {t(`cat.${quote.category}`)}
        </div>

        <blockquote className="text-xl md:text-2xl font-quote leading-relaxed text-foreground mb-6">
          "{quote.text}"
        </blockquote>

        {quote.author && (
          <p className="text-muted-foreground font-medium mb-8">
            — {quote.author}
          </p>
        )}

        <div className="flex justify-center gap-4">
          <Button onClick={handleNewQuote} variant="glass" size="circle" className="hover:scale-110 transition-all duration-300" disabled={isFlipping}>
            <MdRefresh className={`w-6 h-6 ${isFlipping ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleFavorite} variant="glass" size="circle" className={`hover:scale-110 transition-all duration-300 ${heartPulse ? 'pulse-heart' : ''} ${isFavorited ? 'text-red-500 glow-pulse' : ''}`}>
            {isFavorited ? <MdFavorite className="w-6 h-6" /> : <MdFavoriteBorder className="w-6 h-6" />}
          </Button>
          <Button onClick={() => onShare(quote)} variant="glass" size="circle" className="hover:scale-110 transition-all duration-300">
            <MdShare className="w-6 h-6" />
          </Button>
          <Button onClick={() => speakQuote(quote)} variant="glass" size="circle" className={`hover:scale-110 transition-all duration-300 ${isSpeaking ? 'text-primary glow-pulse' : ''}`} title={isSpeaking ? t("quote.stopListening") : t("quote.listen")}>
            {isSpeaking ? <MdVolumeOff className="w-6 h-6" /> : <MdVolumeUp className="w-6 h-6" />}
          </Button>
        </div>

        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl bg-gradient-to-br from-primary to-purple-600 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-32 h-32 rounded-full opacity-10 blur-2xl bg-gradient-to-br from-blue-600 to-cyan-500 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}
