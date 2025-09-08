import { useState, useEffect } from "react";
import { QuoteCard } from "@/components/QuoteCard";
import { MoodSelector } from "@/components/MoodSelector";

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
}

export default function Index({ allQuotes, favorites, onFavorite, onShare, isPremium }: IndexProps) {
  const [selectedMood, setSelectedMood] = useState("all");
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Filter quotes based on selected mood and premium status
  const getFilteredQuotes = () => {
    let filtered = isPremium ? allQuotes : allQuotes.filter(q => q.tier === "free");
    if (selectedMood !== "all") {
      filtered = filtered.filter(quote => quote.category === selectedMood);
    }
    return filtered;
  };

  // Get random quote from filtered list
  const getRandomQuote = () => {
    const filteredQuotes = getFilteredQuotes();
    if (filteredQuotes.length === 0) return allQuotes[0];
    return filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  };

  // Handle new quote with animation
  const handleNewQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote());
      setIsAnimating(false);
    }, 200);
  };

  // Handle mood change
  const handleMoodChange = (mood: string) => {
    setSelectedMood(mood);
    // Auto-generate new quote for the mood
    setTimeout(() => {
      const filteredQuotes = getFilteredQuotes();
      if (filteredQuotes.length > 0) {
        setCurrentQuote(filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)]);
      }
    }, 100);
  };

  // Initialize with random quote
  useEffect(() => {
    if (!currentQuote) {
      setCurrentQuote(getRandomQuote());
    }
  }, [allQuotes]);

  const isFavorite = currentQuote ? favorites.some(fav => fav.id === currentQuote.id) : false;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="text-center py-8 px-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-2">
          ZenVibe
        </h1>
        <p className="text-muted-foreground">Your daily dose of inspiration</p>
      </header>

      {/* Mood Selector */}
      <MoodSelector selectedMood={selectedMood} onMoodChange={handleMoodChange} />

      {/* Quote Card */}
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

      {/* Premium upsell banner (free tier only) */}
      {!isPremium && (
        <div className="mx-4 mb-6">
          <div className="glass-card p-4 text-center gradient-creativity">
            <h3 className="text-lg font-semibold mb-2 text-white">Go Premium</h3>
            <p className="text-white/90 text-sm mb-4">
              Unlock 300+ premium quotes, unlimited favorites, and remove ads
            </p>
            <button className="bg-white/20 border border-white/30 text-white px-6 py-2 rounded-lg hover:bg-white/30 transition-colors">
              Upgrade for $2.99
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
