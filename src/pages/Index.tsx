import { useState, useEffect } from "react";
import { QuoteCard } from "@/components/QuoteCard";
import { MoodSelector } from "@/components/MoodSelector";
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
}

export default function Index({
  allQuotes,
  favorites,
  onFavorite,
  onShare,
}: IndexProps) {
  const [selectedMood, setSelectedMood] = useState("all");
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useLanguage();

  const getFilteredQuotes = (mood = selectedMood) => {
    let filtered = allQuotes;
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
    <div className="min-h-screen bg-background pb-[130px]">
      <header className="text-center py-8 px-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-2">
          ZenVibe
        </h1>
        <p className="text-muted-foreground">
          {t("home.subtitle")}
        </p>
      </header>

      <QuoteOfTheDay allQuotes={allQuotes} />

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
          />
        )}
      </div>
    </div>
  );
}
