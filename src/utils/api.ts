import { CartItem, CustomerInfo, OrderConfirmationData } from '../types';

export interface PaymentConfigResponse {
  configured: boolean;
  provider: 'stripe' | 'sandbox';
  publicKey: string | null;
  instructions: string;
}

export interface CheckoutResponse {
  success: boolean;
  orderId: string;
  order: OrderConfirmationData;
  message?: string;
  livePaymentSetupRequired?: boolean;
}

/**
 * Fetch backend payment configuration status
 */
export async function getPaymentConfig(): Promise<PaymentConfigResponse> {
  if (import.meta.env.PROD) return localDemoPaymentConfig();
  try {
    const res = await fetch('/api/payment-config');
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback if running on purely static CDN without Node server
  }

  return localDemoPaymentConfig();
}

function localDemoPaymentConfig(): PaymentConfigResponse {
  return {
    configured: false,
    provider: 'sandbox',
    publicKey: null,
    instructions: 'Demo checkout only. No payment is collected or receipt sent.',
  };
}

/**
 * Synchronize cart items with backend session
 */
export async function syncCartWithBackend(items: CartItem[]): Promise<void> {
  if (import.meta.env.PROD) return;
  try {
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
  } catch {
    // Offline/static fallback safe
  }
}

/**
 * Submit checkout payload to backend API
 */
export async function processCheckout(
  customer: CustomerInfo,
  items: CartItem[],
  paymentMethod: string = 'Demo Credit Card'
): Promise<CheckoutResponse> {
  // Vite's in-memory API exists only in development. Static hosts use the
  // browser-local demo flow without making a failing /api request.
  if (import.meta.env.PROD) return createLocalDemoOrder(customer, items, paymentMethod);
  let res: Response;
  try {
    res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer, items, paymentMethod }),
    });

  } catch {
    // Client-side fallback if backend API is unreachable
    return createLocalDemoOrder(customer, items, paymentMethod);
  }

  if (!res.headers.get('Content-Type')?.includes('application/json')) {
    return createLocalDemoOrder(customer, items, paymentMethod);
  }

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error || 'Demo checkout could not be completed.');
  }
  return await res.json();
}

function createLocalDemoOrder(customer: CustomerInfo, items: CartItem[], paymentMethod: string): CheckoutResponse {
  if (items.length === 0) throw new Error('Your bag is empty.');
  // Resilient fallback order generation
  const subtotal = items.reduce((acc, item) => acc + item.priceNumber * item.quantity, 0);
  const shipping = 0;
  const orderId = `ARCHIVE-${Math.floor(100000 + Math.random() * 900000)}`;

  const orderData: OrderConfirmationData = {
    orderId,
    createdAt: new Date().toISOString(),
    customer,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    paymentMethod,
    isDemo: true,
    providerInfo: 'Sandbox Demonstration Mode',
  };

  // Persist order in local storage
  try {
    const existingOrders = JSON.parse(localStorage.getItem('the_archive_orders') || '[]');
    existingOrders.unshift(orderData);
    localStorage.setItem('the_archive_orders', JSON.stringify(existingOrders));
  } catch {
    // ignore local storage error
  }

  return {
    success: true,
    orderId,
    order: orderData,
    message: 'Demo order saved in this browser. No payment was collected.',
    livePaymentSetupRequired: true,
  };
}
