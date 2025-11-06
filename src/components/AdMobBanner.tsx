import { useEffect, useRef } from "react";

interface AdMobBannerProps {
  adUnitId?: string;
  isPremium: boolean;
}

export function AdMobBanner({ 
  adUnitId = "ca-app-pub-3940256099942544/6300978111", 
  isPremium 
}: AdMobBannerProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't show ads for premium users
    if (isPremium) return;

    // Load AdMob script
    const script = document.createElement("script");
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.adClient = "ca-app-pub-3940256099942544";
    document.head.appendChild(script);

    // Initialize ad after script loads
    script.onload = () => {
      if (adContainerRef.current) {
        try {
          // @ts-ignore - AdSense global
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error("AdMob error:", e);
        }
      }
    };

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [isPremium]);

  // Don't render for premium users
  if (isPremium) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 w-full bg-background border-t border-border" style={{ height: "50px" }}>
      <div 
        ref={adContainerRef}
        className="w-full h-full flex items-center justify-center"
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "50px" }}
          data-ad-client="ca-app-pub-3940256099942544"
          data-ad-slot="6300978111"
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
