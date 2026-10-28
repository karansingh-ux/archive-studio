import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, PackageCheck, Truck, ShieldCheck, X } from 'lucide-react';
import { sfx } from '../utils/audio';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { listPrice } from '../utils/pricing';

export const OrderConfirmationModal: React.FC = () => {
  const { confirmedOrder, setConfirmedOrder } = useCart();
  const dialogRef = useDialogFocus(Boolean(confirmedOrder));
  const originalSubtotal = confirmedOrder?.items.reduce((sum, item) => sum + listPrice(item.price) * item.quantity, 0) || 0;

  useEffect(() => {
    if (confirmedOrder) {
      sfx.playSelect();
    }
  }, [confirmedOrder]);

  if (!confirmedOrder) return null;

  const handleClose = () => {
    setConfirmedOrder(null);
    sfx.playWhoosh();
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Order Confirmation"
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 bg-black/60 transition-opacity animate-in fade-in duration-300 select-none"
    >
      <div className="relative w-full max-w-xl bg-[#161514] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl text-white max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-250">
        
        {/* Close Button Top Right */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          aria-label="Close order confirmation"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ================= SUCCESS BANNER ================= */}
        <div className="text-center pb-6 border-b border-white/10">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>

          <span className="font-mono text-[10px] tracking-[0.25em] text-emerald-400 uppercase font-semibold block mb-1">
            DEMO ORDER SAVED
          </span>

          <h2 className="font-headline font-bold text-2xl sm:text-3xl text-white">
            Thank you, {confirmedOrder.customer.fullName.split(' ')[0]}
          </h2>

          <p className="font-mono text-sm text-white/60 mt-1">
            Order Reference: <strong className="text-white font-bold">{confirmedOrder.orderId}</strong>
          </p>

          <p className="text-xs text-white/50 font-sans mt-3 max-w-sm mx-auto leading-relaxed">
            This is a preview order for <span className="text-white/80">{confirmedOrder.customer.email}</span>. No payment was collected and no receipt was sent.
          </p>
        </div>

        {/* ================= ORDER DETAILS ================= */}
        <div className="py-6 space-y-5">
          {/* Dispatch Notice Card */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
            <Truck className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs font-sans leading-relaxed">
              <strong className="text-white block font-medium">Demonstration only</strong>
              <span className="text-white/70">
                No shipment or delivery has been scheduled.
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/45 block mb-1.5">
              Shipping Destination
            </span>
            <div className="text-xs font-sans text-white/80 leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5">
              <p className="font-medium text-white">{confirmedOrder.customer.fullName}</p>
              <p>{confirmedOrder.customer.address}</p>
              <p>
                {confirmedOrder.customer.city}, {confirmedOrder.customer.postalCode},{' '}
                {confirmedOrder.customer.country}
              </p>
            </div>
          </div>

          {/* Items Purchased */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/45 block mb-2">
              Demo Items ({confirmedOrder.items.length})
            </span>
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {confirmedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-black/20 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-12 object-contain rounded bg-white/5 p-0.5" />
                    <div>
                      <p className="font-semibold text-white/95">{item.name}</p>
                      <p className="text-[11px] font-mono text-white/45">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-white/90 tabular-nums">
                    ${(item.priceNumber * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Receipt Breakdown */}
          <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs font-sans">
            <div className="flex justify-between text-white/50">
              <span>Original subtotal</span><span className="font-mono">${originalSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#ff7770]">
              <span>Archive sale · 20% off</span><span className="font-mono">−${(originalSubtotal - confirmedOrder.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Sale subtotal</span>
              <span className="font-mono text-white tabular-nums">${confirmedOrder.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Demo shipping</span>
              <span className="font-mono text-white/70">$0</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold text-white">
              <span>Demo Total · Not Charged</span>
              <span className="font-mono text-base tabular-nums">${confirmedOrder.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ================= ACTION BUTTON ================= */}
        <div className="pt-2">
          <button
            onClick={handleClose}
            className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all shadow-xl cursor-pointer font-sans"
          >
            Return to Collection
          </button>
        </div>

      </div>
    </div>
  );
};
