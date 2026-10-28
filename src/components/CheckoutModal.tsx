import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { CustomerInfo } from '../types';
import { processCheckout } from '../utils/api';
import { X, ArrowRight, Loader2, Info } from 'lucide-react';
import { useDialogFocus } from '../hooks/useDialogFocus';

export const CheckoutModal: React.FC = () => {
  const {
    items,
    formattedSubtotal,
    subtotal,
    listSubtotal,
    discountAmount,
    isCheckoutOpen,
    closeCheckout,
    clearBag,
    setConfirmedOrder,
    paymentConfig,
  } = useCart();
  const dialogRef = useDialogFocus(isCheckoutOpen);

  const [customer, setCustomer] = useState<CustomerInfo>({
    email: 'client@thearchive.studio',
    fullName: 'Alexander Wright',
    address: '452 West Broadway, Suite 4B',
    city: 'New York',
    postalCode: '10012',
    country: 'United States',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCheckoutOpen) {
        closeCheckout();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCheckoutOpen, closeCheckout]);

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.email || !customer.fullName || !customer.address || !customer.city || !customer.postalCode || !customer.country) {
      setErrorMsg('Please complete all required contact and delivery fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await processCheckout(
        customer,
        items,
        'Demo checkout — no payment collected'
      );

      if (response.success && response.order) {
        setConfirmedOrder(response.order);
        clearBag();
        closeCheckout();
      } else {
        setErrorMsg(response.message || 'Payment processing failed. Please try again.');
      }
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Demo checkout could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Guest Checkout"
      className="fixed inset-0 z-[70] flex items-start md:items-center justify-center p-0 md:p-6 overflow-y-auto bg-black/75 transition-opacity animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-4xl min-h-dvh md:min-h-0 md:max-h-[88vh] bg-[#161514] border border-white/10 rounded-none md:rounded-2xl shadow-2xl text-white flex flex-col md:overflow-hidden animate-in zoom-in-95 duration-250">
        
        {/* ================= MODAL HEADER (FIXED TOP) ================= */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1c1b1a] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="font-wordmark text-xs tracking-[0.24em] text-white font-bold uppercase">
              THE ARCHIVE / DEMO CHECKOUT
            </span>
          </div>
          <button
            onClick={closeCheckout}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================= MODAL BODY: 2-COLUMN CHECKOUT WITH INDEPENDENT SCROLLING ================= */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 p-5 sm:p-6 md:p-8 md:overflow-hidden">
          
          {/* LEFT COLUMN (7 COLS): CUSTOMER & PAYMENT DETAILS (SCROLLABLE ON DESKTOP) */}
          <div className="md:col-span-7 flex flex-col space-y-6 md:overflow-y-auto md:max-h-full md:pr-2">
            
            {/* 1. Contact Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/60 flex items-center gap-2 font-semibold">
                <span className="w-4 h-4 rounded-full bg-white/15 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                Client Information
              </h3>
              <div className="space-y-3 font-sans">
                <div>
                  <label htmlFor="checkout-email" className="block text-[11px] font-medium text-white/60 mb-1">
                    Email for Demo Order
                  </label>
                  <input
                    type="email"
                    id="checkout-email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="client@thearchive.studio"
                    className="w-full h-11 px-3.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/25 text-xs font-sans focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-name" className="block text-[11px] font-medium text-white/60 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    id="checkout-name"
                    required
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    placeholder="Alexander Wright"
                    className="w-full h-11 px-3.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/25 text-xs font-sans focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Destination */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/60 flex items-center gap-2 font-semibold">
                <span className="w-4 h-4 rounded-full bg-white/15 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                Delivery Destination
              </h3>
              <div className="space-y-3 font-sans">
                <div>
                  <label htmlFor="checkout-address" className="block text-[11px] font-medium text-white/60 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="checkout-address"
                    required
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="452 West Broadway"
                    className="w-full h-11 px-3.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/25 text-xs font-sans focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="checkout-city" className="block text-[11px] font-medium text-white/60 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="checkout-city"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="New York"
                      className="w-full h-11 px-3.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/25 text-xs font-sans focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-postal" className="block text-[11px] font-medium text-white/60 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="checkout-postal"
                      required
                      value={customer.postalCode}
                      onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                      placeholder="10012"
                      className="w-full h-11 px-3.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/25 text-xs font-sans focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/60 flex items-center gap-2 font-semibold">
                <span className="w-4 h-4 rounded-full bg-white/15 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                Order Mode
              </h3>

              {/* Informative mode banner */}
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="leading-relaxed text-[11px]">
                  <strong className="text-white block font-medium">
                    Demonstration checkout
                  </strong>
                  {paymentConfig?.instructions || 'No payment is collected and no order is dispatched.'}
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (5 COLS): BAG SUMMARY & SUBMIT CTA (ANCHORED) */}
          <div className="md:col-span-5 flex flex-col justify-between bg-black/40 p-5 md:p-6 rounded-xl border border-white/10 md:max-h-full md:overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                  Bag Summary
                </h3>
                <span className="text-[11px] font-mono text-white/50">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items scrollable preview */}
              <div className="max-h-48 overflow-y-auto space-y-3 pr-1 divide-y divide-white/5">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <div className="w-12 h-14 rounded bg-black/50 border border-white/10 p-1 flex-shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-white/95 truncate">{item.name}</p>
                      <p className="text-[11px] text-white/50 font-mono">
                        Size: {item.size}, Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-semibold text-white/95 tabular-nums">
                      ${(item.priceNumber * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Totals Breakdown */}
              <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-sans">
                <div className="flex items-center justify-between text-white/55">
                  <span>Original subtotal</span><span className="font-mono">${listSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[#ff7770]">
                  <span>Archive sale · 20% off</span><span className="font-mono">−${discountAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span>Sale subtotal</span>
                  <span className="font-mono text-white/95 tabular-nums">{formattedSubtotal}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span>Demo shipping</span>
                  <span className="font-mono text-white/75 font-medium">$0</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-sm font-bold text-white">
                  <span>Demo Total</span>
                  <span className="font-mono text-base text-white tabular-nums">${subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer font-sans disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Verifying with Ledger...</span>
                  </>
                ) : (
                  <>
                    <span>Place Demo Order: ${subtotal.toLocaleString()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/45 text-center leading-normal">
                <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>For demonstration only. No payment, receipt, or delivery.</span>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};
