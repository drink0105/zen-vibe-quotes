import { useEffect } from "react";

interface AdMobBannerProps {
  isPremium: boolean;
}

export function AdMobBanner({ isPremium }: AdMobBannerProps) {

  useEffect(() => {
    if (isPremium) return;

    // Inject AdSense script
    const scriptId = "adsbygoogle-js";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3940256099942544";
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    }

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log("Ad error:", e);
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
        data-ad-client="ca-pub-3940256099942544"
        data-ad-slot="6300978111"
      />
    </div>
  );
}

