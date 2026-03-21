import { useEffect, useRef } from "react";

interface AdMobBannerProps {
  isPremium: boolean;
}

export function AdMobBanner({ isPremium }: AdMobBannerProps) {
  const adPushed = useRef(false);

  useEffect(() => {
    if (isPremium || adPushed.current) return;
    adPushed.current = true;

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log("AdSense push error:", e);
    }
  }, [isPremium]);

  if (isPremium) return null;

  return (
    <div
      id="banner-container"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "50px",
        maxHeight: "50px",
        minHeight: "50px",
        overflow: "hidden",
        zIndex: 9999,
        background: "#f5f5f5",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "50px", overflow: "hidden" }}
        data-ad-client="ca-pub-4014613680442567"
        data-ad-slot="8272900040"
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-adtest="on"
      />
    </div>
  );
}
