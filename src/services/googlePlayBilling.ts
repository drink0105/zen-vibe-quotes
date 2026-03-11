/**
 * Google Play Billing Integration via Android TWA Bridge
 *
 * The TWA wrapper (Bubblewrap) must expose:
 *   window.AndroidBilling.purchasePremium()  — launches Play Billing flow
 *   window.Android.getInstaller()            — returns installer package name
 *
 * Product ID: zenvibe_premium
 * Price: $2.99 (one-time lifetime)
 * Payments Profile ID: 2169-6428-6724
 */

/** Check if the Android billing bridge is available */
export const isPlayBillingAvailable = (): boolean => {
  return typeof (window as any).AndroidBilling?.purchasePremium === "function";
};

/**
 * Launch Google Play Billing for the premium purchase.
 * Returns true if the purchase was successful, false otherwise.
 * This calls into the native Android code via the TWA JS bridge.
 */
export const purchasePremium = async (): Promise<boolean> => {
  if (!isPlayBillingAvailable()) {
    console.error("[ZenVibe] Play Billing bridge not available. Ensure the TWA wrapper exposes window.AndroidBilling.purchasePremium()");
    return false;
  }

  try {
    console.log("[ZenVibe] Launching Play Billing for zenvibe_premium...");
    const result = await (window as any).AndroidBilling.purchasePremium();
    console.log("[ZenVibe] Play Billing result:", result);
    // The native bridge should return a truthy value on success
    return !!result;
  } catch (error) {
    console.error("[ZenVibe] Play Billing purchase failed:", error);
    return false;
  }
};

/** Restore purchases via native bridge (if exposed) */
export const restorePurchases = async (): Promise<boolean> => {
  try {
    if (typeof (window as any).AndroidBilling?.restorePurchases === "function") {
      const result = await (window as any).AndroidBilling.restorePurchases();
      console.log("[ZenVibe] Purchases restored:", result);
      return !!result;
    }
  } catch (error) {
    console.error("[ZenVibe] Failed to restore purchases:", error);
  }
  return false;
};
