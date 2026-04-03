import { useEffect } from "react";

export function Banner() {
  useEffect(() => {
    // Adsterra banner-only script with strict parameters
    const script1 = document.createElement("script");
    script1.innerHTML = `
      atOptions = {
        'key' : '59d13fc0d03e18e4518d71921432309a',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {
          'disable_popup': true,        // Try to disable popups
          'disable_interstitial': true
        }
      };
    `;
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://www.highperformanceformat.com/59d13fc0d03e18e4518d71921432309a/invoke.js";
    script2.async = true;
    document.head.appendChild(script2);

  }, []);

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
      {/* Adsterra banner injection point */}
      <div id="adsterra-banner"></div>
    </div>
  );
}
