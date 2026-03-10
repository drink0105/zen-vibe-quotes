import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ensureUser } from "./lib/user";
import { detectInstallerPackage } from "./lib/installerDetect";

// Initialize anonymous auth session and ensure user row exists
ensureUser().then(id => {
  console.log('[ZenVibe] User session initialized:', id);
}).catch(err => {
  console.error('[ZenVibe] Failed to initialize user session:', err);
});

// Detect and log installer on startup
detectInstallerPackage().then(installer => {
  console.log('[ZenVibe] App installer package:', installer ?? 'unknown (defaulting to Play Billing)');
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
