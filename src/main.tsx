import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ensureUser } from "./lib/user";
import { detectInstallerPackage, getInstallerDebugInfo, shouldUsePlayBilling } from "./lib/installerDetect";

// Initialize anonymous auth session and ensure user row exists
ensureUser().then(id => {
  console.log('[ZenVibe] User session initialized:', id);
}).catch(err => {
  console.error('[ZenVibe] Failed to initialize user session:', err);
});

// Detect and log installer on startup with full debug info
detectInstallerPackage().then(async (installer) => {
  const usePlay = await shouldUsePlayBilling();
  const debugInfo = getInstallerDebugInfo();
  console.log('[ZenVibe] Installer debug:', debugInfo);
  console.log('[ZenVibe] Will use Play Billing:', usePlay);

  // Show visible debug banner for on-device testing (auto-hides after 8s)
  const msg = `Installer: ${installer ?? 'none'}\nPlay Billing: ${usePlay}\nUA: ${navigator.userAgent.substring(0, 60)}`;
  const banner = document.createElement('div');
  banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:#000;color:#0f0;font-size:11px;padding:8px;font-family:monospace;white-space:pre-wrap;opacity:0.9';
  banner.textContent = msg;
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 8000);
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
