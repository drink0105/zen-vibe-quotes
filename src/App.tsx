import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Index from "./pages/Index";
import FavoritesPage from "./pages/FavoritesPage";
import PlaylistsPage from "./pages/PlaylistsPage";
import TimerPage from "./pages/TimerPage";
import CheckInPage from "./pages/CheckInPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { Navigation } from "@/components/Navigation";
import { AdSterraBanner } from "@/components/AdSterraBanner";
const queryClient = new QueryClient();

interface Quote {
  id: number;
  text: string;
  author?: string;
  category: string;
  tier: "free" | "premium";
}

interface QuotesData {
  affirmations: Quote[];
  quotes: Quote[];
}

const App = () => {
  const [favorites, setFavorites] = useLocalStorage<Quote[]>("zenvibes-favorites", []);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>("zenvibes-theme", "light");
  const [backgroundTheme, setBackgroundTheme] = useLocalStorage<string>("zenvibes-background", "default");
  const [appVersion, setAppVersion] = useLocalStorage<string>("zenvibes-version", "1.0.0");
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  // Load quotes from public folder on app start
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}ZenVibeContent.json`);
        const quotesData: QuotesData = await response.json();
        const combined = [...quotesData.affirmations, ...quotesData.quotes];
        setAllQuotes(combined);
      } catch (error) {
        console.error('Failed to load quotes:', error);
        setAllQuotes([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuotes();
  }, []);

  // Apply color mode (.dark class) and background theme (data-theme attribute)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    root.style.colorScheme = theme;
    const metaColorScheme = document.getElementById('color-scheme-meta');
    if (metaColorScheme) {
      metaColorScheme.setAttribute('content', theme);
    }
    if (backgroundTheme === "default") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", backgroundTheme.toLowerCase());
    }
  }, [theme, backgroundTheme]);

  const handleShare = async (quote: Quote) => {
    const shareText = quote.author 
      ? `"${quote.text}" - ${quote.author}`
      : `"${quote.text}"`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: "ZenVibe Quote", text: shareText });
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
      setFavorites([...favorites, quote]);
    }
  };

  const handleRemoveFavorite = (id: number) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ZenVibe...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename="">
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={
                  <Index 
                    allQuotes={allQuotes}
                    favorites={favorites}
                    onFavorite={handleFavorite}
                    onShare={handleShare}
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
                  />
                } />
                <Route path="/timer" element={
                  <TimerPage 
                    allQuotes={allQuotes}
                  />
                } />
                <Route path="/checkin" element={
                  <CheckInPage 
                    allQuotes={allQuotes}
                  />
                } />
                <Route path="/settings" element={
                  <SettingsPage 
                    theme={theme}
                    onThemeChange={setTheme}
                    backgroundTheme={backgroundTheme}
                    onBackgroundThemeChange={setBackgroundTheme}
                    appVersion={appVersion}
                    onVersionChange={setAppVersion}
                  />
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Navigation />
            </div>
            <AdSterraBanner />
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
