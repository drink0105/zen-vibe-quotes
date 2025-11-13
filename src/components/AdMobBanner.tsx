import { useEffect, useState } from "react";

interface AdMobBannerProps {
  isPremium: boolean;
}

export function AdMobBanner({ isPremium }: AdMobBannerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 600);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isPremium || !isMobile) return;

    const initAdMob = () => {
      // @ts-ignore - AdMob global
      if (window.admob) {
        // @ts-ignore
        window.admob.banner.config({
          id: 'ca-app-pub-3940256099942544/6300978111',
          size: 'SMART_BANNER',
          position: 'BOTTOM'
        });
        // @ts-ignore
        window.admob.banner.show();
      }
    };

    // Check if admob is already loaded
    // @ts-ignore
    if (window.admob) {
      initAdMob();
    } else {
      // Wait for admob to load
      const checkInterval = setInterval(() => {
        // @ts-ignore
        if (window.admob) {
          clearInterval(checkInterval);
          initAdMob();
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, [isPremium, isMobile]);

  // Don't render for premium users or desktop
  if (isPremium || !isMobile) return null;

  return (
    <div 
      id="admob-banner-container"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '50px',
        maxHeight: '50px',
        overflow: 'hidden',
        zIndex: 999,
        background: '#f5f5f5'
      }}
    >
      <div id="admob-banner"></div>
    </div>
  );
}
