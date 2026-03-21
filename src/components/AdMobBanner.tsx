import { useEffect } from "react";

interface AdSenseBannerProps {
  isPremium: boolean;
}

export function AdMobBanner({ isPremium }: AdSenseBannerProps) {
  useEffect(() => {
    if (isPremium) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log("AdSense error:", e);
    }
  }, [isPremium]);

  if (isPremium) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "50px",
        background: "#f5f5f5",
        zIndex: 999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "50px" }}
        data-ad-client="ca-pub-4014613680442567"
        data-ad-slot="8272900040"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
