import { useEffect } from "react";

interface AdSenseBannerProps {
  isPremium: boolean;
}

export function AdSenseBanner({ isPremium }: AdSenseBannerProps) {

  useEffect(() => {
    if (isPremium) return;

    // Load AdSense script only once
    const scriptId = "adsbygoogle-js";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4014613680442567";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);  // append to head, not body
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
      <script>
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </script>
    </div>
  );
}

