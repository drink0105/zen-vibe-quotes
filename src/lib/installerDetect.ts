/**
 * Detect the installer package name via Android WebView bridge.
 * Returns "com.android.vending" for Google Play installs,
 * or null/other string for sideloads / other stores.
 */
export function getInstallerPackage(): string | null {
  try {
    // Android WebView exposes this via a JS bridge
    if (typeof (window as any).AndroidBridge !== 'undefined') {
      return (window as any).AndroidBridge.getInstallerPackage?.() ?? null;
    }
    // Fallback: check a meta tag or query param for testing
    const meta = document.querySelector('meta[name="installer-package"]');
    if (meta) return meta.getAttribute('content');
    return null;
  } catch {
    return null;
  }
}

export function isGooglePlayInstall(): boolean {
  return getInstallerPackage() === 'com.android.vending';
}
