import { useEffect, useRef } from "react";

export function AdSterraBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const invokeScript = document.createElement("script");
    invokeScript.async = true;
    invokeScript.setAttribute("data-cfasync", "false");
    invokeScript.src = "https://pl29048034.profitablecpmratenetwork.com/5a65b743694be49d4a9d785f7e86c0a9/invoke.js";
    containerRef.current.appendChild(invokeScript);
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
        zIndex: 999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={() => window.open("https://www.profitablecpmratenetwork.com/iejctxs63?key=b06c574cea5b5c270841130b35a9db17", "_blank")}
    >
      <div id="container-5a65b743694be49d4a9d785f7e86c0a9"></div>
    </div>
  );
}
