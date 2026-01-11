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
import CheckInPage from "./pages/CheckInPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { Navigation } from "@/components/Navigation";
import { AdMobBanner } from "@/components/AdMobBanner";
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
  const [isPremium, setIsPremium] = useLocalStorage<boolean>("zenvibes-premium", false);
  const [backgroundTheme, setBackgroundTheme] = useLocalStorage<string>("zenvibes-background", "default");
  const [appVersion, setAppVersion] = useLocalStorage<string>("zenvibes-version", "1.0.0");
  const [testFreemiumMode, setTestFreemiumMode] = useState(false);
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  // Effective premium status (considers test mode)
  const effectiveIsPremium = isPremium && !testFreemiumMode;

  // Check for premium purchase on app start
  useEffect(() => {
    const checkPremium = async () => {
      // Check mock purchase first (for web testing)
      const mockPremium = localStorage.getItem('zenvibe-mock-premium');
      if (mockPremium === 'true') {
        setIsPremium(true);
        return;
      }

      // Check real Google Play purchase
      try {
        const { verifyPremiumPurchase } = await import('@/services/googlePlayBilling');
        const hasPremium = await verifyPremiumPurchase();
        if (hasPremium) {
          setIsPremium(true);
        }
      } catch (error) {
        console.log('Premium check skipped:', error);
      }
    };

    checkPremium();
  }, []);

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
        // Fallback to empty array if loading fails
        setAllQuotes([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuotes();
  }, []);

  // Apply color mode (.dark class) and background theme (data-theme attribute)
  // These are SEPARATE concerns:
  // - .dark/.light controls semantic tokens (text, card, border colors)
  // - data-theme controls decorative elements (app background, gradients)
  useEffect(() => {
    const root = document.documentElement;

    // 1. Apply color mode (controls ALL semantic tokens)
    root.classList.remove("dark", "light");
    root.classList.add(theme);

    // 2. Apply background theme (ONLY decorative - never touches semantic tokens)
    // "default" = no data-theme attribute = pure defaults
    if (backgroundTheme === "default") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", backgroundTheme.toLowerCase());
    }
  }, [theme, backgroundTheme]);

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

  const handlePremiumUpgrade = async () => {
    const { purchasePremium, mockPurchasePremium, isGooglePlayAvailable } = await import('@/services/googlePlayBilling');
    
    if (!isGooglePlayAvailable()) {
      // For web testing: use mock purchase
      mockPurchasePremium();
      window.location.reload();
    } else {
      // Real Google Play purchase
      const result = await purchasePremium();
      if (result) {
        window.location.reload();
      } else {
        alert('Purchase failed. Please try again.');
      }
    }
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
                  isPremium={effectiveIsPremium}
                />
              } />
              <Route path="/favorites" element={
                <FavoritesPage 
                  favorites={favorites}
                  onRemoveFavorite={handleRemoveFavorite}
                  onShare={handleShare}
                  isPremium={effectiveIsPremium}
                />
              } />
              <Route path="/playlists" element={
                <PlaylistsPage 
                  allQuotes={allQuotes}
                  isPremium={effectiveIsPremium}
                  onPremiumUpgrade={handlePremiumUpgrade}
                />
              } />
              <Route path="/timer" element={
                <TimerPage 
                  allQuotes={allQuotes}
                  isPremium={effectiveIsPremium}
                />
              } />
              <Route path="/checkin" element={
                <CheckInPage 
                  allQuotes={allQuotes}
                  isPremium={effectiveIsPremium}
                  onPremiumUpgrade={handlePremiumUpgrade}
                />
              } />
              <Route path="/settings" element={
                <SettingsPage 
                  theme={theme}
                  onThemeChange={setTheme}
                  isPremium={effectiveIsPremium}
                  onPremiumChange={setIsPremium}
                  backgroundTheme={backgroundTheme}
                  onBackgroundThemeChange={setBackgroundTheme}
                  appVersion={appVersion}
                  onVersionChange={setAppVersion}
                  testFreemiumMode={testFreemiumMode}
                  onTestFreemiumModeChange={setTestFreemiumMode}
                />
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Navigation isPremium={effectiveIsPremium} />
          </div>
          <AdMobBanner isPremium={effectiveIsPremium} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
