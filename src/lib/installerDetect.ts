/**
 * Detect the installer package name.
 * Priority:
 *   1. Capacitor App.getInfo() → installerPackageName
 *   2. Android WebView JS bridge
 *   3. Meta tag / query param (testing)
 *   4. Default: null (treated as Play install)
 *
 * IMPORTANT: When installer is null/unknown, we default to
 * Google Play Billing (assumes Play Store install).
 */

let cachedInstaller: string | null | undefined = undefined;

export async function detectInstallerPackage(): Promise<string | null> {
  if (cachedInstaller !== undefined) return cachedInstaller;

  // 1. Try Capacitor App API
  try {
    const { App } = await import("@capacitor/app");
    const info = await App.getInfo();
    // Capacitor may not have installerPackageName on web
    const installer = (info as any).installerPackageName ?? null;
    if (installer) {
      console.log("[ZenVibe] Capacitor installer detected:", installer);
      cachedInstaller = installer;
      return cachedInstaller;
    }
  } catch (e) {
    console.log("[ZenVibe] Capacitor App API not available:", e);
  }

  // 2. Try Android WebView JS bridge
  try {
    if (typeof (window as any).AndroidBridge !== "undefined") {
      const installer =
        (window as any).AndroidBridge.getInstallerPackage?.() ?? null;
      if (installer) {
        console.log("[ZenVibe] AndroidBridge installer detected:", installer);
        cachedInstaller = installer;
        return cachedInstaller;
      }
    }
  } catch (e) {
    console.log("[ZenVibe] AndroidBridge not available");
  }

  // 3. Fallback: meta tag or query param (for testing)
  const meta = document.querySelector('meta[name="installer-package"]');
  if (meta) {
    cachedInstaller = meta.getAttribute("content");
    console.log("[ZenVibe] Meta tag installer:", cachedInstaller);
    return cachedInstaller;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const paramInstaller = urlParams.get("installer");
  if (paramInstaller) {
    cachedInstaller = paramInstaller;
    console.log("[ZenVibe] Query param installer:", cachedInstaller);
    return cachedInstaller;
  }

  // 4. No detection available
  cachedInstaller = null;
  console.log("[ZenVibe] No installer detected — defaulting to Play Billing");
  return cachedInstaller;
}

/**
 * Returns true if the app should use Stripe (non-Play-Store install).
 * Only returns true when we POSITIVELY know the installer is NOT Google Play.
 * Unknown/null defaults to Play Billing.
 */
export async function shouldUseStripe(): Promise<boolean> {
  const installer = await detectInstallerPackage();
  // Only use Stripe if we positively detected a non-Play installer
  if (installer && installer !== "com.android.vending") {
    console.log("[ZenVibe] Using Stripe — installer:", installer);
    return true;
  }
  console.log("[ZenVibe] Using Play Billing — installer:", installer ?? "unknown");
  return false;
}

/** Synchronous legacy check — prefer shouldUseStripe() */
export function isGooglePlayInstall(): boolean {
  // If cached, use it; otherwise assume Play
  if (cachedInstaller !== undefined) {
    return !cachedInstaller || cachedInstaller === "com.android.vending";
  }
  return true; // default to Play
}
