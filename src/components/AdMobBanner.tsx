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
    script.dataset.adClient = adUnitId.split('/')[0];
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
  }, [adUnitId, isPremium]);

  // Don't render for premium users
  if (isPremium) return null;

  return (
    <div className="w-full flex justify-center py-4 px-4">
      <div 
        ref={adContainerRef}
        className="glass-card overflow-hidden rounded-lg"
        style={{ maxWidth: "728px", width: "100%" }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "90px" }}
          data-ad-client={adUnitId.split('/')[0]}
          data-ad-slot={adUnitId.split('/')[1]}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}