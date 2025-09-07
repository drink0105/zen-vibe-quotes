import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdRefresh, MdFavorite, MdFavoriteBorder, MdShare } from "react-icons/md";

interface Quote {
  id: number;
  text: string;
  author?: string;
  category: string;
  tier: "free" | "premium";
}

interface QuoteCardProps {
  quote: Quote;
  onNewQuote: () => void;
  onFavorite: (quote: Quote) => void;
  onShare: (quote: Quote) => void;
  isFavorited: boolean;
  isPremium: boolean;
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

export function QuoteCard({ quote, onNewQuote, onFavorite, onShare, isFavorited, isPremium }: QuoteCardProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);

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
        {/* Premium indicator */}
        {quote.tier === "premium" && !isPremium && (
          <div className="absolute top-4 right-4 premium-glow px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            Premium
          </div>
        )}
        
        {/* Category tag with gradient */}
        <div className={`
          inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6
          ${gradientClass} text-white shadow-lg
        `}>
          {quote.category}
        </div>

        {/* Quote text */}
        <blockquote className="text-xl md:text-2xl font-quote leading-relaxed text-foreground mb-6 animate-float">
          "{quote.text}"
        </blockquote>

        {/* Author */}
        {quote.author && (
          <p className="text-muted-foreground font-medium mb-8">
            — {quote.author}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleNewQuote}
            variant="glass"
            size="circle"
            className="hover:scale-110 transition-all duration-300"
            disabled={isFlipping}
          >
            <MdRefresh className={`w-6 h-6 ${isFlipping ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            onClick={handleFavorite}
            variant="glass"
            size="circle"
            className={`
              hover:scale-110 transition-all duration-300
              ${heartPulse ? 'pulse-heart' : ''}
              ${isFavorited ? 'text-red-500 glow-pulse' : ''}
            `}
          >
            {isFavorited ? (
              <MdFavorite className="w-6 h-6" />
            ) : (
              <MdFavoriteBorder className="w-6 h-6" />
            )}
          </Button>

          <Button
            onClick={() => onShare(quote)}
            variant="glass"
            size="circle"
            className="hover:scale-110 transition-all duration-300"
          >
            <MdShare className="w-6 h-6" />
          </Button>
        </div>

        {/* Decorative background elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl bg-gradient-to-br from-primary to-purple-600 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-32 h-32 rounded-full opacity-10 blur-2xl bg-gradient-to-br from-blue-600 to-cyan-500 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}