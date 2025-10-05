/**
 * Google Play Billing Integration
 * Payments Profile ID: 2169-6428-6724
 * Product ID: zenvibe_premium
 * Price: $2.99
 */

interface PurchaseDetails {
  productId: string;
  purchaseToken: string;
  orderId: string;
  packageName: string;
  purchaseTime: number;
  purchaseState: number;
}

// Check if running in Android WebView with Google Play Billing
export const isGooglePlayAvailable = (): boolean => {
  return typeof (window as any).AndroidBilling !== 'undefined';
};

// Initialize Google Play Billing
export const initializeBilling = async (): Promise<boolean> => {
  if (!isGooglePlayAvailable()) {
    console.log('Google Play Billing not available');
    return false;
  }

  try {
    const result = await (window as any).AndroidBilling.initialize();
    console.log('Billing initialized:', result);
    return result;
  } catch (error) {
    console.error('Billing initialization failed:', error);
    return false;
  }
};

// Query product details
export const getProductDetails = async (productId: string = 'zenvibe_premium') => {
  if (!isGooglePlayAvailable()) {
    return null;
  }

  try {
    const details = await (window as any).AndroidBilling.getProductDetails(productId);
    return details;
  } catch (error) {
    console.error('Failed to get product details:', error);
    return null;
  }
};

// Purchase premium ($2.99)
export const purchasePremium = async (): Promise<PurchaseDetails | null> => {
  if (!isGooglePlayAvailable()) {
    console.log('Google Play Billing not available - using mock purchase');
    // For testing/web: simulate purchase
    return {
      productId: 'zenvibe_premium',
      purchaseToken: 'mock_token_' + Date.now(),
      orderId: 'mock_order_' + Date.now(),
      packageName: 'app.zenvibe',
      purchaseTime: Date.now(),
      purchaseState: 1, // Purchased
    };
  }

  try {
    const purchase = await (window as any).AndroidBilling.purchaseProduct('zenvibe_premium');
    console.log('Purchase successful:', purchase);
    return purchase;
  } catch (error) {
    console.error('Purchase failed:', error);
    return null;
  }
};

// Verify purchase (check if user owns premium)
export const verifyPremiumPurchase = async (): Promise<boolean> => {
  if (!isGooglePlayAvailable()) {
    // Check local storage for mock purchase
    const mockPurchase = localStorage.getItem('zenvibe-mock-premium');
    return mockPurchase === 'true';
  }

  try {
    const purchases = await (window as any).AndroidBilling.getPurchases();
    return purchases.some((p: PurchaseDetails) => 
      p.productId === 'zenvibe_premium' && p.purchaseState === 1
    );
  } catch (error) {
    console.error('Failed to verify purchase:', error);
    return false;
  }
};

// Restore purchases
export const restorePurchases = async (): Promise<boolean> => {
  if (!isGooglePlayAvailable()) {
    return false;
  }

  try {
    const restored = await (window as any).AndroidBilling.restorePurchases();
    console.log('Purchases restored:', restored);
    return restored;
  } catch (error) {
    console.error('Failed to restore purchases:', error);
    return false;
  }
};

// Mock purchase for testing (web/development)
export const mockPurchasePremium = (): void => {
  localStorage.setItem('zenvibe-mock-premium', 'true');
  console.log('Mock premium purchase completed');
};

// Clear mock purchase
export const clearMockPurchase = (): void => {
  localStorage.removeItem('zenvibe-mock-premium');
  console.log('Mock purchase cleared');
};