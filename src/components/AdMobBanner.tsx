import { useEffect } from "react";

interface AdMobBannerProps {
  isPremium: boolean;
}

export function AdMobBanner({ isPremium }: AdMobBannerProps) {
  useEffect(() => {
    if (isPremium) return;

    const scriptId = "adsbygoogle-js";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4014613680442567";
      script.crossOrigin = "anonymous";
      script.onload = () => {
        // Push only after script loads
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error("AdSense push error:", e);
        }
      };
      document.head.appendChild(script);
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
