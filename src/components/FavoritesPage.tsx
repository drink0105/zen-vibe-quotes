import { Trash2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

const categoryGradients = {
  Motivation: "gradient-motivation",
  Mindfulness: "gradient-mindfulness",
  Humor: "gradient-humor",
  Productivity: "gradient-productivity",
  Creativity: "gradient-creativity",
  Resilience: "gradient-resilience",
};

export function FavoritesPage({ favorites, onRemoveFavorite, onShare }: FavoritesPageProps) {
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pb-20">
        <div className="text-center">
          <div className="text-6xl mb-4">💝</div>
          <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground">
            Start saving quotes you love by tapping the heart icon
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Your Favorites</h1>
        
        <div className="space-y-4">
          {favorites.map((quote) => {
            const gradientClass = categoryGradients[quote.category as keyof typeof categoryGradients] || "gradient-default";
            
            return (
              <div key={quote.id} className="quote-card">
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 ${gradientClass} opacity-10 rounded-2xl`} />
                
                <div className="relative">
                  {/* Category tag */}
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${gradientClass} mb-4`}>
                    {quote.category}
                  </span>
                  
                  {/* Quote text */}
                  <blockquote className="text-lg font-medium text-foreground leading-relaxed mb-2">
                    "{quote.text}"
                  </blockquote>
                  
                  {quote.author && (
                    <cite className="text-muted-foreground text-sm mb-4 block">
                      — {quote.author}
                    </cite>
                  )}
                  
                  {/* Action buttons */}
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => onShare(quote)}
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onRemoveFavorite(quote.id)}
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}