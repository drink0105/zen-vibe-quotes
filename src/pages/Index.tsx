import { useState, useEffect } from "react";
import { QuoteCard } from "@/components/QuoteCard";
import { MoodSelector } from "@/components/MoodSelector";
import { Navigation } from "@/components/Navigation";
import { FavoritesPage } from "@/components/FavoritesPage";
import { SettingsPage } from "@/components/SettingsPage";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import quotesData from "@/data/quotes.json";

interface Quote {
  id: number;
  text: string;
  author?: string;
  category: string;
  tier: "free" | "premium";
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedMood, setSelectedMood] = useState("all");
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [favorites, setFavorites] = useLocalStorage<Quote[]>("zenvibes-favorites", []);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>("zenvibes-theme", "light");
  const [isAnimating, setIsAnimating] = useState(false);

  // Combine affirmations and quotes into one array
  const allQuotes: Quote[] = [...quotesData.affirmations as Quote[], ...quotesData.quotes as Quote[]];

  // Filter quotes based on selected mood
  const getFilteredQuotes = () => {
    if (selectedMood === "all") return allQuotes;
    return allQuotes.filter(quote => quote.category === selectedMood);
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
      const filteredQuotes = mood === "all" ? allQuotes : allQuotes.filter(q => q.category === mood);
      if (filteredQuotes.length > 0) {
        setCurrentQuote(filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)]);
      }
    }, 100);
  };

  // Handle favorite toggle
  const handleFavorite = (quote: Quote) => {
    const isFavorite = favorites.some(fav => fav.id === quote.id);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== quote.id));
    } else {
      setFavorites([...favorites, quote]);
    }
  };

  // Handle share
  const handleShare = async (quote: Quote) => {
    const shareText = quote.author 
      ? `"${quote.text}" - ${quote.author}`
      : `"${quote.text}"`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ZenVibe Quote",
          text: shareText,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText);
      // You could show a toast here
    }
  };

  // Handle remove from favorites
  const handleRemoveFavorite = (id: number) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Initialize with random quote
  useEffect(() => {
    if (!currentQuote) {
      setCurrentQuote(getRandomQuote());
    }
  }, []);

  const isFavorite = currentQuote ? favorites.some(fav => fav.id === currentQuote.id) : false;

  if (currentPage === "favorites") {
    return (
      <>
        <FavoritesPage 
          favorites={favorites}
          onRemoveFavorite={handleRemoveFavorite}
          onShare={handleShare}
        />
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      </>
    );
  }

  if (currentPage === "settings") {
    return (
      <>
        <SettingsPage theme={theme} onThemeChange={setTheme} />
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
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
              onFavorite={handleFavorite}
              onShare={handleShare}
              isFavorite={isFavorite}
              isAnimating={isAnimating}
            />
          )}
        </div>
      </div>
      
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </>
  );
};

export default Index;
