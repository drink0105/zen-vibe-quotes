import { Trash2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";

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
  const { t } = useLanguage();

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pb-20">
        <div className="text-center">
          <div className="text-6xl mb-4">💝</div>
          <h2 className="text-2xl font-semibold mb-2">{t("fav.empty")}</h2>
          <p className="text-muted-foreground">
            {t("fav.emptyDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">{t("fav.title")}</h1>
        
        <div className="space-y-4">
          {favorites.map((quote) => {
            const gradientClass = categoryGradients[quote.category as keyof typeof categoryGradients] || "gradient-default";
            
            return (
              <div key={quote.id} className="quote-card">
                <div className={`absolute inset-0 ${gradientClass} opacity-10 rounded-2xl`} />
                
                <div className="relative">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${gradientClass} mb-4`}>
                    {t(`cat.${quote.category}`)}
                  </span>
                  
                  <blockquote className="text-lg font-medium text-foreground leading-relaxed mb-2">
                    "{quote.text}"
                  </blockquote>
                  
                  {quote.author && (
                    <cite className="text-muted-foreground text-sm mb-4 block">
                      — {quote.author}
                    </cite>
                  )}
                  
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
