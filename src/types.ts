export interface GarmentAngles {
  side: string;         // Resting profile view on hanger (default state)
  front: string;        // Full front-facing view (hover state)
  back: string;         // Rear view (for detail drawer)
  threeQuarter?: string;// Optional legacy field
}

export interface GarmentItemData {
  id: string;
  name: string;
  category: string;
  price: string;
  colorName: string;
  colorHex: string;
  angles: GarmentAngles;
  campaignFront?: string; // Editorial render used in the product presentation
  description: string;
  details: string[];
  sizes: string[];
  fit: string;
  hangerType?: 'coat' | 'clip' | 'hoodie' | 'pullover';
}

export interface CartItem {
  id: string; // Unique cart line item ID: `${garmentId}-${size}`
  garmentId: string;
  name: string;
  price: string;
  priceNumber: number; // e.g. 340 from "$340"
  size: string;
  colorName: string;
  image: string;
  quantity: number;
}

export interface CustomerInfo {
  email: string;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderConfirmationData {
  orderId: string;
  createdAt: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  isDemo: boolean;
  providerInfo?: string;
}
