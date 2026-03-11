/**
 * Detect the installer package name for billing routing.
 *
 * IMPORTANT: Default to Play Billing on Android devices.
 * Only use Stripe for clearly non-Play installs (e.g. web browser on desktop).
 *
 * Multi-method detection:
 *   1. Android native bridge: window.Android.getInstaller()
 *   2. Capacitor App API
 *   3. User-Agent heuristic (Android device → assume Play)
 *   4. Meta tag / query param (testing)
 *   5. Ultimate fallback: Android → Play Billing, else Stripe
 */

let cachedInstaller: string | null | undefined = undefined;
let cachedIsAndroid: boolean | undefined = undefined;

function isAndroidDevice(): boolean {
  if (cachedIsAndroid !== undefined) return cachedIsAndroid;
  const ua = navigator.userAgent.toLowerCase();
  cachedIsAndroid = ua.includes('android');
  return cachedIsAndroid;
}

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

  // 3. Meta tag or query param (for testing)
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

  // 4. Android UA heuristic — if on Android, assume Play Store
  if (isAndroidDevice()) {
    cachedInstaller = "com.android.vending";
    console.log("[ZenVibe] Android device detected via UA — assuming Play Store");
    return cachedInstaller;
  }

  // 5. No detection — web browser on desktop
  cachedInstaller = null;
  console.log("[ZenVibe] No installer detected (desktop web) — will use Stripe");
  return cachedInstaller;
}

/**
 * Returns true when we should use Play Billing:
 * - Positively detected Google Play installer
 * - OR on Android device (default to Play even without bridge, for review safety)
 */
export async function shouldUsePlayBilling(): Promise<boolean> {
  const installer = await detectInstallerPackage();
  const isPlay = installer === "com.android.vending" ||
                 installer === "com.google.android";

  if (isPlay) {
    const hasPlayBilling = typeof (window as any).AndroidBilling?.purchasePremium === "function";
    console.log("[ZenVibe] Play Store detected, billing bridge available:", hasPlayBilling);
    return true;
  }

  if (isAndroidDevice()) {
    console.log("[ZenVibe] Android device — defaulting to Play Billing");
    return true;
  }

  return false;
}

/**
 * Returns true when we should use Stripe:
 * - Desktop web browser (no installer, not Android)
 * - Explicitly non-Play store installs
 */
export async function shouldUseStripe(): Promise<boolean> {
  const usePlay = await shouldUsePlayBilling();
  return !usePlay;
}

/** Synchronous legacy check */
export function isGooglePlayInstall(): boolean {
  if (cachedInstaller !== undefined) {
    return cachedInstaller === "com.android.vending" || cachedInstaller === "com.google.android";
  }
  return isAndroidDevice();
}

/** Get debug info string for diagnostics */
export function getInstallerDebugInfo(): string {
  const ua = navigator.userAgent;
  const isAndroid = isAndroidDevice();
  const hasBridge = typeof (window as any).Android?.getInstaller === "function";
  const hasBilling = typeof (window as any).AndroidBilling?.purchasePremium === "function";
  return `installer=${cachedInstaller ?? 'pending'}, android=${isAndroid}, bridge=${hasBridge}, billing=${hasBilling}, ua=${ua.substring(0, 80)}`;
}
