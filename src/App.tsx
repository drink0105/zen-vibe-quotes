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
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [backgroundTheme, setBackgroundTheme] = useLocalStorage<string>("zenvibes-background", "default");
  const [appVersion, setAppVersion] = useLocalStorage<string>("zenvibes-version", "1.0.0");
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  // Check premium status from backend on app start
  useEffect(() => {
    const checkPremium = async () => {
      try {
        const { isPremium: checkBackendPremium } = await import('@/lib/premium');
        const premium = await checkBackendPremium();
        setIsPremium(premium);
      } catch (error) {
        console.log('Premium check failed:', error);
        setIsPremium(false);
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

  const pollPremiumStatus = async (maxAttempts = 20, intervalMs = 3000) => {
    const { isPremium: checkPremium } = await import('@/lib/premium');
    for (let i = 0; i < maxAttempts; i++) {
      const premium = await checkPremium();
      if (premium) {
        setIsPremium(true);
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
    return false;
  };

  const handlePremiumUpgrade = async () => {
    try {
      // Direct bridge check — no installer detection needed
      if (typeof (window as any).AndroidBilling?.purchasePremium === 'function') {
        console.log('[ZenVibe] Play Billing bridge detected — launching purchase');
        try {
          const result = await (window as any).AndroidBilling.purchasePremium();
          if (result) {
            const confirmed = await pollPremiumStatus();
            if (!confirmed) {
              alert('Purchase is being verified. Please check back shortly.');
            }
          } else {
            alert('Purchase was not completed. Please try again.');
          }
        } catch (billingError) {
          console.error('[ZenVibe] Play Billing error:', billingError);
          alert('Purchase failed. Please try again.');
        }
        return;
      }

      // Fallback: Stripe (web, non-Play installs, no billing bridge)
      console.log('[ZenVibe] No Play Billing bridge — launching Stripe checkout');
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {},
      });
      if (error || !data?.url) {
        alert('Could not start checkout. Please try again.');
        return;
      }
      window.open(data.url, '_blank');
      const confirmed = await pollPremiumStatus();
      if (confirmed) {
        alert('Premium unlocked! Enjoy all features.');
      }
    } catch (error) {
      console.error('[ZenVibe] Upgrade error:', error);
      alert('Something went wrong. Please try again.');
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
                    isPremium={isPremium}
                    onPremiumUpgrade={handlePremiumUpgrade}
                  />
                } />
                <Route path="/favorites" element={
                  <FavoritesPage 
                    favorites={favorites}
                    onRemoveFavorite={handleRemoveFavorite}
                    onShare={handleShare}
                    isPremium={isPremium}
                  />
                } />
                <Route path="/playlists" element={
                  <PlaylistsPage 
                    allQuotes={allQuotes}
                    isPremium={isPremium}
                    onPremiumUpgrade={handlePremiumUpgrade}
                  />
                } />
                <Route path="/timer" element={
                  <TimerPage 
                    allQuotes={allQuotes}
                    isPremium={isPremium}
                  />
                } />
                <Route path="/checkin" element={
                  <CheckInPage 
                    allQuotes={allQuotes}
                    isPremium={isPremium}
                    onPremiumUpgrade={handlePremiumUpgrade}
                  />
                } />
                <Route path="/settings" element={
                  <SettingsPage 
                    theme={theme}
                    onThemeChange={setTheme}
                    isPremium={isPremium}
                    onPremiumUpgrade={handlePremiumUpgrade}
                    backgroundTheme={backgroundTheme}
                    onBackgroundThemeChange={setBackgroundTheme}
                    appVersion={appVersion}
                    onVersionChange={setAppVersion}
                  />
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Navigation isPremium={isPremium} />
            </div>
            <AdMobBanner isPremium={isPremium} />
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
