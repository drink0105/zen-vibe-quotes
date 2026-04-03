import { useEffect, useRef } from "react";

export function AdSterraBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const optionsScript = document.createElement("script");
    optionsScript.type = "text/javascript";
    optionsScript.text = `
      atOptions = {
        'key' : '59d13fc0d03e18e4518d71921432309a',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;
    containerRef.current.appendChild(optionsScript);

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = "https://www.highperformanceformat.com/59d13fc0d03e18e4518d71921432309a/invoke.js";
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
        background: "#f5f5f5",
        zIndex: 999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    />
  );
}
