import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useDialogFocus } from '../hooks/useDialogFocus';

export const CartDrawer: React.FC = () => {
  const {
    items,
    itemCount,
    formattedSubtotal,
    listSubtotal,
    discountAmount,
    isCartOpen,
    closeCart,
    openCheckout,
    updateQuantity,
    removeFromBag,
  } = useCart();
  const dialogRef = useDialogFocus(isCartOpen);

  // Escape key listener to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      className="fixed inset-0 z-[60] pointer-events-auto flex justify-end select-none"
    >
      {/* 1. Subtle dark overlay WITHOUT heavy backdrop-blur (underlying product page remains crisp and sharp) */}
      <div
        onClick={closeCart}
        className="fixed inset-0 z-[61] bg-black/40 cursor-pointer transition-opacity duration-300 animate-in fade-in"
        aria-hidden="true"
      />

      {/* 2. Solid Opaque Near-Black Drawer Panel: Fixed to right, full height, 440px-460px width, zero bleed-through */}
      <aside
        className="fixed top-0 right-0 bottom-0 z-[62] w-full sm:w-[440px] md:w-[460px] h-full flex flex-col justify-between shadow-2xl text-white border-l border-white/10 animate-in slide-in-from-right duration-350"
        style={{ backgroundColor: '#141413' }}
      >
        {/* ================= DRAWER HEADER (FIXED TOP) ================= */}
        <div
          className="px-6 py-5 border-b border-white/10 flex items-center justify-between flex-shrink-0"
          style={{ backgroundColor: '#141413' }}
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-white/80" />
            <span className="font-wordmark text-xs tracking-[0.24em] text-white font-bold uppercase">
              SHOPPING BAG
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-white/80 font-medium">
              {itemCount}
            </span>
          </div>

          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close shopping bag"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================= DRAWER BODY (SCROLLABLE ITEM LIST) ================= */}
        <div
          className="flex-1 overflow-y-auto px-6 py-5 space-y-4 divide-y divide-white/10"
          style={{ backgroundColor: '#141413' }}
        >
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-white/40" />
              </div>
              <p className="font-headline font-bold text-lg text-white">
                Your Bag is Empty
              </p>
              <p className="text-xs text-white/50 font-sans mt-2 max-w-xs leading-relaxed">
                Explore the archive collection to select pieces for your wardrobe.
              </p>
              <button
                onClick={closeCart}
                className="mt-6 px-6 py-2.5 rounded-xl border border-white/20 hover:border-white bg-white/5 hover:bg-white text-xs font-semibold uppercase tracking-[0.15em] text-white hover:text-black transition-all cursor-pointer font-sans"
              >
                Explore Archive
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-start group">
                {/* Product Thumbnail */}
                <div className="w-20 h-24 rounded-lg bg-black/60 border border-white/15 p-1.5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain select-none"
                    draggable={false}
                  />
                </div>

                {/* Details & Controls */}
                <div className="flex-1 flex flex-col justify-between min-h-[96px]">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-headline font-bold text-sm text-white leading-tight">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeFromBag(item.id)}
                        className="text-white/40 hover:text-rose-400 transition-colors p-1 -mr-1 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded"
                        aria-label={`Remove ${item.name} size ${item.size} from bag`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-white/60">
                      <span>Size: <strong className="text-white font-medium">{item.size}</strong></span>
                      <span>•</span>
                      <span className="truncate max-w-[120px]">{item.colorName}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-white/20 bg-white/5 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, -1, true)}
                        className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-semibold text-white select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1, true)}
                        className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price calculation */}
                    <span className="font-mono text-sm font-semibold text-white tabular-nums">
                      ${(item.priceNumber * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ================= DRAWER FOOTER (ANCHORED BOTTOM) ================= */}
        {items.length > 0 && (
          <div
            className="p-6 border-t border-white/10 space-y-3 flex-shrink-0"
            style={{ backgroundColor: '#0d0c0c' }}
          >
            {/* Subtotal summary */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-white/55 font-sans">
                <span>Original subtotal</span><span className="font-mono">${listSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-[#ff7770] font-sans">
                <span>Archive sale · 20% off</span><span className="font-mono">−${discountAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-white/70 font-sans">
                <span>Sale subtotal</span>
                <span className="font-mono text-white font-semibold text-sm tabular-nums">
                  {formattedSubtotal}
                </span>
              </div>
              <div className="flex items-center justify-between text-white/70 font-sans">
                <span>Demo shipping</span>
                <span className="font-mono text-emerald-400 font-medium">
                  Complimentary
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={openCheckout}
              className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer font-sans group focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Reassurance notes */}
            <div className="pt-1 flex items-center justify-center gap-2 text-[10px] text-white/45 font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Demo checkout · No payment or delivery</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
