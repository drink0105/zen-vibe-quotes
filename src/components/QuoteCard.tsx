import { useState } from "react";
import { Heart, RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  isFavorite: boolean;
  isAnimating: boolean;
}

const categoryGradients = {
  Motivation: "gradient-motivation",
  Mindfulness: "gradient-mindfulness",
  Humor: "gradient-humor",
  Productivity: "gradient-productivity",
  Creativity: "gradient-creativity",
  Resilience: "gradient-resilience",
};

export function QuoteCard({ 
  quote, 
  onNewQuote, 
  onFavorite, 
  onShare, 
  isFavorite, 
  isAnimating 
}: QuoteCardProps) {
  const [heartPulse, setHeartPulse] = useState(false);

  const handleFavorite = () => {
    setHeartPulse(true);
    onFavorite(quote);
    setTimeout(() => setHeartPulse(false), 300);
  };

  const gradientClass = categoryGradients[quote.category as keyof typeof categoryGradients] || "gradient-default";

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div 
        className={`quote-card relative min-h-[300px] ${isAnimating ? 'flip-enter-active' : ''}`}
        style={{ perspective: '1000px' }}
      >
        {/* Background gradient overlay */}
        <div className={`absolute inset-0 ${gradientClass} opacity-10 rounded-2xl`} />
        
        {/* Category tag */}
        <div className="flex justify-between items-start mb-6">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium text-white ${gradientClass}`}>
            {quote.category}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavorite}
            className={`text-primary hover:text-red-500 transition-colors ${heartPulse ? 'pulse-heart' : ''}`}
          >
            <Heart 
              className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
            />
          </Button>
        </div>

        {/* Quote text */}
        <div className="text-center mb-8">
          <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-4">
            "{quote.text}"
          </blockquote>
          {quote.author && (
            <cite className="text-muted-foreground text-lg">
              — {quote.author}
            </cite>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={onNewQuote}
            variant="zen"
            size="lg"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            New Quote
          </Button>
          
          <Button
            onClick={() => onShare(quote)}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}