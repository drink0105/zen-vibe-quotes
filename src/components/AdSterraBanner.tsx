import { useEffect, useRef } from "react";

export function Banner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create a completely isolated container for the ad
    const adContainer = document.createElement("div");
    adContainer.style.cssText = `
      width: 100%;
      height: 50px;
      overflow: hidden;
      position: relative;
    `;

    // Adsterra script
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://pl29048034.profitablecpmratenetwork.com/5a65b743694be49d4a9d785f7e86c0a9/invoke.js";
    adContainer.appendChild(script);

    containerRef.current.appendChild(adContainer);

  }, []);

  return (
    <div
      ref={containerRef}
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
        pointerEvents: "none",   // prevent clicks from escaping
      }}
    />
  );
}
