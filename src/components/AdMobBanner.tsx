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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile (<600px)
    const checkMobile = () => setIsMobile(window.innerWidth < 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Don't show ads for premium users or non-mobile
    if (isPremium || !isMobile) return;

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
  }, [isPremium, adLoaded, isMobile]);

  // Don't render for premium users or non-mobile
  if (isPremium || !isMobile) return null;

  return (
    <div 
      id="admob-banner-container"
      className="fixed bottom-0 left-0 right-0 z-[999] w-full bg-[#f5f5f5] border-t border-border flex items-center justify-center"
      style={{ 
        height: "50px",
        maxHeight: "50px",
        minHeight: "50px",
        overflow: "hidden"
      }}
    >
      <div 
        id="admob-banner"
        ref={adContainerRef}
        className="w-full flex items-center justify-center"
        style={{ 
          height: "50px",
          maxHeight: "50px",
          minHeight: "50px"
        }}
      >
        {showFallback && !adLoaded ? (
          <div className="text-xs text-muted-foreground">
            📱 Test Ad Banner (Google AdMob)
          </div>
        ) : (
          <ins
            className="adsbygoogle"
            style={{ 
              display: "block",
              width: "100%",
              height: "50px",
              maxHeight: "50px",
              minHeight: "50px",
              margin: 0,
              padding: 0,
              border: "none"
            }}
            data-ad-client="ca-app-pub-3940256099942544"
            data-ad-slot="6300978111"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </div>
  );
}
