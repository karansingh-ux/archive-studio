import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CartItem, GarmentItemData, OrderConfirmationData } from '../types';
import { sfx } from '../utils/audio';
import { syncCartWithBackend, getPaymentConfig, PaymentConfigResponse } from '../utils/api';
import { GARMENTS } from '../data/garments';
import { listPrice, salePrice } from '../utils/pricing';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  listSubtotal: number;
  discountAmount: number;
  formattedSubtotal: string;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  confirmedOrder: OrderConfirmationData | null;
  paymentConfig: PaymentConfigResponse | null;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  addToBag: (garment: GarmentItemData, size: string, quantity?: number, openDrawer?: boolean) => void;
  updateQuantity: (itemId: string, deltaOrExact: number, isDelta?: boolean) => void;
  removeFromBag: (itemId: string) => void;
  clearBag: () => void;
  setConfirmedOrder: (order: OrderConfirmationData | null) => void;
}

const CART_STORAGE_KEY = 'the_archive_cart_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.flatMap((item: CartItem) => {
        const garment = GARMENTS.find((g) => g.id === item.garmentId);
        if (!garment || !garment.sizes.includes(item.size)) return [];
        return [{ ...item, priceNumber: salePrice(garment.price), price: garment.price,
          image: garment.angles.front, quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)) }];
      });
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderConfirmationData | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfigResponse | null>(null);

  // Sync to localStorage and backend whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage quota or private mode safe
    }
    syncCartWithBackend(items);
  }, [items]);

  // Load payment configuration on mount
  useEffect(() => {
    getPaymentConfig().then((cfg) => setPaymentConfig(cfg));
  }, []);

  // Total quantity count across all items
  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  // Subtotal in dollars
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.priceNumber * item.quantity, 0);
  }, [items]);

  const listSubtotal = useMemo(() => items.reduce((sum, item) => sum + listPrice(item.price) * item.quantity, 0), [items]);
  const discountAmount = listSubtotal - subtotal;

  const formattedSubtotal = useMemo(() => {
    return `$${subtotal.toLocaleString()}`;
  }, [subtotal]);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
    sfx.playHover();
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
    sfx.playWhoosh();
  }, []);

  const openCheckout = useCallback(() => {
    setIsCartOpen(false); // Close cart drawer
    setIsCheckoutOpen(true);
    sfx.playSelect();
  }, []);

  const closeCheckout = useCallback(() => {
    setIsCheckoutOpen(false);
    sfx.playWhoosh();
  }, []);

  const addToBag = useCallback(
    (garment: GarmentItemData, size: string, quantity = 1, openDrawer = true) => {
      // Parse numeric price from "$340" -> 340
      const priceNum = salePrice(garment.price);
      const lineItemId = `${garment.id}-${size}`;

      setItems((prev) => {
        const existingIdx = prev.findIndex((item) => item.id === lineItemId);
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + quantity,
          };
          return updated;
        } else {
          const newItem: CartItem = {
            id: lineItemId,
            garmentId: garment.id,
            name: garment.name,
            price: garment.price,
            priceNumber: priceNum,
            size,
            colorName: garment.colorName,
            image: garment.angles.front,
            quantity,
          };
          return [...prev, newItem];
        }
      });

      sfx.playSelect();

      if (openDrawer) {
        // Small delay to allow button click animation to register cleanly
        setTimeout(() => {
          setIsCartOpen(true);
        }, 150);
      }
    },
    []
  );

  const updateQuantity = useCallback((itemId: string, val: number, isDelta = false) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId) {
            const nextQty = isDelta ? item.quantity + val : val;
            return { ...item, quantity: Math.max(0, nextQty) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
    sfx.playHover();
  }, []);

  const removeFromBag = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    sfx.playWhoosh();
  }, []);

  const clearBag = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // safe
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        listSubtotal,
        discountAmount,
        formattedSubtotal,
        isCartOpen,
        isCheckoutOpen,
        confirmedOrder,
        paymentConfig,
        openCart,
        closeCart,
        openCheckout,
        closeCheckout,
        addToBag,
        updateQuantity,
        removeFromBag,
        clearBag,
        setConfirmedOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};
