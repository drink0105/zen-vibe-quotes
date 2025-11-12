import { useEffect, useRef, useState } from "react";

interface AdMobBannerProps {
  adUnitId?: string;
  isPremium: boolean;
}

export function AdMobBanner({ 
  adUnitId = "ca-app-pub-3940256099942544/6300978111", 
  isPremium 
}: AdMobBannerProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Don't show ads for premium users
    if (isPremium) return;

    // Set timeout for fallback
    const fallbackTimer = setTimeout(() => {
      if (!adLoaded) {
        setShowFallback(true);
      }
    }, 3000);

    // Initialize ad
    const initAd = () => {
      if (adContainerRef.current) {
        try {
          // @ts-ignore - AdSense global
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        } catch (e) {
          console.error("AdMob error:", e);
          setShowFallback(true);
        }
      }
    };

    // Check if script is already loaded
    // @ts-ignore - AdSense global
    if (window.adsbygoogle) {
      initAd();
    } else {
      // Wait for script to load
      const checkInterval = setInterval(() => {
        // @ts-ignore - AdSense global
        if (window.adsbygoogle) {
          clearInterval(checkInterval);
          initAd();
        }
      }, 100);

      return () => {
        clearInterval(checkInterval);
        clearTimeout(fallbackTimer);
      };
    }

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [isPremium, adLoaded]);

  // Don't render for premium users
  if (isPremium) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 w-full bg-background border-t border-border" style={{ height: "50px" }}>
      <div 
        ref={adContainerRef}
        className="w-full h-full flex items-center justify-center"
      >
        {showFallback && !adLoaded ? (
          <div className="text-xs text-muted-foreground">Test Ad Banner</div>
        ) : (
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", height: "50px" }}
            data-ad-client="ca-app-pub-3940256099942544"
            data-ad-slot="6300978111"
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </div>
  );
}
