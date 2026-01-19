import { Button } from "@/components/ui/button";
import { MdFavorite, MdDelete, MdShare, MdVolumeUp, MdStop } from "react-icons/md";
import { useSpeakQuote } from "@/hooks/useSpeakQuote";
import { useState } from "react";

interface Quote {
  id: number;
  text: string;
  author?: string;
  category: string;
  tier: "free" | "premium";
}

interface FavoritesPageProps {
  favorites: Quote[];
  onRemoveFavorite: (id: number) => void;
  onShare: (quote: Quote) => void;
  isPremium: boolean;
}

const categoryGradients = {
  Motivation: "gradient-motivation",
  Mindfulness: "gradient-mindfulness", 
  Humor: "gradient-humor",
  Productivity: "gradient-productivity",
  Creativity: "gradient-creativity",
  Resilience: "gradient-resilience",
};

export default function FavoritesPage({ favorites, onRemoveFavorite, onShare, isPremium }: FavoritesPageProps) {
  const { speakQuote, stopSpeaking, isSpeaking } = useSpeakQuote(isPremium);
  const [speakingQuoteId, setSpeakingQuoteId] = useState<number | null>(null);

  const handleListen = (quote: Quote) => {
    if (isSpeaking && speakingQuoteId === quote.id) {
      stopSpeaking();
      setSpeakingQuoteId(null);
    } else {
      // Stop any current playback first
      stopSpeaking();
      setSpeakingQuoteId(quote.id);
      speakQuote(quote);
    }
  };

  // Reset speaking state when speech ends
  const handleSpeakQuote = (quote: Quote) => {
    handleListen(quote);
    // Listen for speech end to reset state
    if ('speechSynthesis' in window) {
      const checkEnd = setInterval(() => {
        if (!speechSynthesis.speaking) {
          setSpeakingQuoteId(null);
          clearInterval(checkEnd);
        }
      }, 100);
    }
  };

  if (favorites.length === 0) {
    return (
      <div className={`min-h-screen ${isPremium ? 'pb-[80px]' : 'pb-[130px]'} px-4 py-8`}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <MdFavorite className="w-16 h-16 mx-auto mb-4 text-primary animate-glow-pulse" />
            <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
            <p className="text-muted-foreground">Save quotes you love to see them here</p>
          </div>
          
          <div className="glass-card p-8 text-center">
            <MdFavorite className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No favorites yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Tap the heart icon on quotes to save them here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isPremium ? 'pb-[80px]' : 'pb-[130px]'} px-4 py-8`}>
      <div className="max-w-2xl mx-auto">
        {/* Gradient blue header */}
        <div className="gradient-blue glass-card p-6 mb-8 border-2 border-blue-400">
          <MdFavorite className="w-16 h-16 mx-auto mb-4 text-black" />
          <h1 className="text-3xl font-bold mb-2 text-black text-center">Your Favorites</h1>
          <p className="text-black/80 text-center">
            {favorites.length} saved quote{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="space-y-4">
          {favorites.map((quote) => (
            <div 
              key={quote.id} 
              className={`glass-card p-6 ${categoryGradients[quote.category as keyof typeof categoryGradients] || 'gradient-default'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 text-xs font-semibold bg-white/30 text-black rounded-full backdrop-blur-sm">
                  {quote.category}
                </span>
                {quote.tier === "premium" && (
                  <span className="px-2 py-1 text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full">
                    Premium
                  </span>
                )}
              </div>
              
              <blockquote className="text-lg mb-4 leading-relaxed font-quote text-black">
                "{quote.text}"
              </blockquote>
              
              {quote.author && (
                <p className="text-sm text-black/80 mb-4">— {quote.author}</p>
              )}
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => handleSpeakQuote(quote)}
                  variant="outline"
                  size="sm"
                  className="bg-white/20 border-black/20 text-black hover:bg-white/30"
                >
                  {isSpeaking && speakingQuoteId === quote.id ? (
                    <>
                      <MdStop className="w-4 h-4 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <MdVolumeUp className="w-4 h-4 mr-2" />
                      Listen
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => onShare(quote)}
                  variant="outline"
                  size="sm"
                  className="bg-white/20 border-black/20 text-black hover:bg-white/30"
                >
                  <MdShare className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  onClick={() => onRemoveFavorite(quote.id)}
                  variant="destructive"
                  size="sm"
                >
                  <MdDelete className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}