import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Index from "./pages/Index";
import FavoritesPage from "./pages/FavoritesPage";
import PlaylistsPage from "./pages/PlaylistsPage";
import TimerPage from "./pages/TimerPage";
import AlarmsPage from "./pages/AlarmsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { Navigation } from "@/components/Navigation";
import quotesData from "@/data/quotes.json";

const queryClient = new QueryClient();

interface Quote {
  id: number;
  text: string;
  author?: string;
  category: string;
  tier: "free" | "premium";
}

const App = () => {
  const [favorites, setFavorites] = useLocalStorage<Quote[]>("zenvibes-favorites", []);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>("zenvibes-theme", "light");
  const [isPremium, setIsPremium] = useLocalStorage<boolean>("zenvibes-premium", false);

  const allQuotes: Quote[] = [...quotesData.affirmations as Quote[], ...quotesData.quotes as Quote[]];

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Shared handlers
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
      navigator.clipboard.writeText(shareText);
    }
  };

  const handleFavorite = (quote: Quote) => {
    const isFavorite = favorites.some(fav => fav.id === quote.id);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== quote.id));
    } else {
      if (!isPremium && favorites.length >= 10) {
        alert("Free tier allows up to 10 favorites. Upgrade to Premium for unlimited favorites!");
        return;
      }
      setFavorites([...favorites, quote]);
    }
  };

  const handleRemoveFavorite = (id: number) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={
                <Index 
                  allQuotes={allQuotes}
                  favorites={favorites}
                  onFavorite={handleFavorite}
                  onShare={handleShare}
                  isPremium={isPremium}
                />
              } />
              <Route path="/favorites" element={
                <FavoritesPage 
                  favorites={favorites}
                  onRemoveFavorite={handleRemoveFavorite}
                  onShare={handleShare}
                />
              } />
              <Route path="/playlists" element={
                <PlaylistsPage 
                  allQuotes={allQuotes}
                  isPremium={isPremium}
                />
              } />
              <Route path="/timer" element={
                <TimerPage 
                  allQuotes={allQuotes}
                  isPremium={isPremium}
                />
              } />
              <Route path="/alarms" element={
                <AlarmsPage 
                  isPremium={isPremium}
                />
              } />
              <Route path="/settings" element={
                <SettingsPage 
                  theme={theme}
                  onThemeChange={setTheme}
                  isPremium={isPremium}
                  onPremiumChange={setIsPremium}
                />
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Navigation />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
