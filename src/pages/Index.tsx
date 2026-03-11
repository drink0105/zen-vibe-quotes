import { useState, useEffect } from "react";
import { QuoteCard } from "@/components/QuoteCard";
import { MoodSelector } from "@/components/MoodSelector";
import { AdMobBanner } from "@/components/AdMobBanner";
import { QuoteOfTheDay } from "@/components/QuoteOfTheDay";
import { useLanguage } from "@/i18n/LanguageContext";

interface Quote {
  id: number;
  text: string;
  author?: string;
  category: string;
  tier: "free" | "premium";
}

interface IndexProps {
  allQuotes: Quote[];
  favorites: Quote[];
  onFavorite: (quote: Quote) => void;
  onShare: (quote: Quote) => void;
  isPremium: boolean;
  onPremiumUpgrade: () => void;
}

export default function Index({
  allQuotes,
  favorites,
  onFavorite,
  onShare,
  isPremium,
}: IndexProps) {
  const [selectedMood, setSelectedMood] = useState("all");
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useLanguage();

  const getFilteredQuotes = (mood = selectedMood) => {
    let filtered = isPremium
      ? allQuotes
      : allQuotes.filter((q) => q.tier === "free");
    if (mood !== "all") {
      filtered = filtered.filter(
        (quote) => quote.category.toLowerCase() === mood.toLowerCase()
      );
    }
    return filtered;
  };

  const getRandomQuote = (mood = selectedMood) => {
    const filteredQuotes = getFilteredQuotes(mood);
    if (filteredQuotes.length === 0) return allQuotes[0];
    return filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  };

  const handleNewQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote());
      setIsAnimating(false);
    }, 200);
  };

  const handleMoodChange = (mood: string) => {
    setSelectedMood(mood);
    const filteredQuotes = getFilteredQuotes(mood);
    if (filteredQuotes.length > 0) {
      setCurrentQuote(
        filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)]
      );
    }
  };

  useEffect(() => {
    if (!currentQuote) {
      setCurrentQuote(getRandomQuote());
    }
  }, [allQuotes]);

  const isFavorite = currentQuote
    ? favorites.some((fav) => fav.id === currentQuote.id)
    : false;

  return (
    <div
      className={`min-h-screen bg-background ${
        isPremium ? "pb-[80px]" : "pb-[130px]"
      }`}
    >
      <header className="text-center py-8 px-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-2">
          ZenVibe
        </h1>
        <p className="text-muted-foreground">
          {t("home.subtitle")}
        </p>
      </header>

      <QuoteOfTheDay allQuotes={allQuotes} isPremium={isPremium} />

      <MoodSelector
        selectedMood={selectedMood}
        onMoodChange={handleMoodChange}
      />

      <div className="flex items-center justify-center px-4 py-8">
        {currentQuote && (
          <QuoteCard
            quote={currentQuote}
            onNewQuote={handleNewQuote}
            onFavorite={onFavorite}
            onShare={onShare}
            isFavorited={isFavorite}
            isPremium={isPremium}
          />
        )}
      </div>

      {!isPremium && (
        <div className="mx-4 mb-6">
          <div className="glass-card p-4 text-center gradient-creativity relative overflow-hidden">
            <h3 className="text-lg font-semibold mb-2 text-black">
              {t("home.goPremium")}
            </h3>
            <p className="text-black/80 text-sm mb-4">
              {t("home.premiumDesc")}
            </p>
            <button
              onClick={async () => {
                const {
                  purchasePremium,
                  mockPurchasePremium,
                  isGooglePlayAvailable,
                } = await import("@/services/googlePlayBilling");

                if (!isGooglePlayAvailable()) {
                  mockPurchasePremium();
                  window.location.reload();
                } else {
                  const result = await purchasePremium();
                  if (result) {
                    window.location.reload();
                  } else {
                    alert("Purchase failed. Please try again.");
                  }
                }
              }}
              className="bg-white/20 border border-black/30 text-black px-6 py-2 rounded-lg hover:bg-white/30 transition-all hover:scale-105"
            >
              {t("home.upgradeFor")}
            </button>

            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-yellow-400/20 blur-2xl animate-pulse delay-1000" />
          </div>
        </div>
      )}
    </div>
  );
}
