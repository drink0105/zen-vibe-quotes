/**
 * Detect the installer package name for billing routing.
 *
 * Priority:
 *   1. Android native bridge: window.Android.getInstaller()
 *   2. Capacitor App API (if available)
 *   3. Meta tag / query param (testing)
 *   4. Default: null
 *
 * Billing routing:
 *   - "com.android.vending" → Google Play Billing via window.AndroidBilling
 *   - anything else (or null on web) → Stripe
 */

let cachedInstaller: string | null | undefined = undefined;

export async function detectInstallerPackage(): Promise<string | null> {
  if (cachedInstaller !== undefined) return cachedInstaller;

  // 1. Try Android native bridge (TWA / Bubblewrap)
  try {
    if (typeof (window as any).Android?.getInstaller === "function") {
      const installer = (window as any).Android.getInstaller();
      if (installer) {
        console.log("[ZenVibe] Android bridge installer:", installer);
        cachedInstaller = installer;
        return cachedInstaller;
      }
    }
  } catch (e) {
    console.log("[ZenVibe] Android bridge not available:", e);
  }

  // 2. Try Capacitor App API
  try {
    const { App } = await import("@capacitor/app");
    const info = await App.getInfo();
    const installer = (info as any).installerPackageName ?? null;
    if (installer) {
      console.log("[ZenVibe] Capacitor installer detected:", installer);
      cachedInstaller = installer;
      return cachedInstaller;
    }
  } catch (e) {
    console.log("[ZenVibe] Capacitor App API not available");
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

  // 4. No detection — web browser or unknown
  cachedInstaller = null;
  console.log("[ZenVibe] No installer detected — will use Stripe");
  return cachedInstaller;
}

/**
 * Returns true ONLY when we positively detect Google Play as the installer
 * AND the AndroidBilling bridge is available.
 */
export async function shouldUsePlayBilling(): Promise<boolean> {
  const installer = await detectInstallerPackage();
  if (installer === "com.android.vending") {
    const hasPlayBilling = typeof (window as any).AndroidBilling?.purchasePremium === "function";
    console.log("[ZenVibe] Play Store detected, billing bridge available:", hasPlayBilling);
    return hasPlayBilling;
  }
  return false;
}

/**
 * Returns true when we should use Stripe:
 * - Web browser (no installer)
 * - Non-Play-Store installs
 * - Play Store install but no billing bridge available
 */
export async function shouldUseStripe(): Promise<boolean> {
  const usePlay = await shouldUsePlayBilling();
  return !usePlay;
}

/** Synchronous legacy check */
export function isGooglePlayInstall(): boolean {
  if (cachedInstaller !== undefined) {
    return cachedInstaller === "com.android.vending";
  }
  return false;
}
