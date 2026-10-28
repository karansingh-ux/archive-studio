import React, { useState, useEffect, useCallback } from 'react';
import { GarmentItemData } from '../types';
import { sfx } from '../utils/audio';
import { useCart } from '../context/CartContext';
import { X, ChevronDown, ArrowRight, Check, ShoppingBag } from 'lucide-react';
import { GARMENTS } from '../data/garments';
import { formatPrice, salePrice, SALE_PERCENT } from '../utils/pricing';
import { useDialogFocus } from '../hooks/useDialogFocus';

interface ProductDetailDrawerProps {
  garment: GarmentItemData;
  onClose: () => void;
}

export const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({
  garment,
  onClose,
}) => {
  const { addToBag, openCart, itemCount } = useCart();
  const collectionIndex = GARMENTS.findIndex((item) => item.id === garment.id) + 1;
  const dialogRef = useDialogFocus(true);
  const [selectedAngle, setSelectedAngle] = useState<'front' | 'side' | 'back'>('front');
  const [selectedSize, setSelectedSize] = useState<string>(garment.sizes[0] || 'M');
  const [added, setAdded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);

  // Transition state: hardware-accelerated slide up & slide down on the container only
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Reset angle & size if garment prop changes
  useEffect(() => {
    setSelectedAngle('front');
    setSelectedSize(garment.sizes[0] || 'M');
    setAdded(false);
  }, [garment.id]);

  useEffect(() => {
    // Double requestAnimationFrame guarantees initial translate-y-full has painted before transition starts
    const frameId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsOpen(true);
      });
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setIsOpen(false);
    sfx.playWhoosh();
    setTimeout(() => {
      onClose();
    }, 500); // Matches transition duration
  }, [isClosing, onClose]);

  // Read URL query parameter for deep-linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const angleParam = params.get('angle') as 'front' | 'side' | 'back' | null;
    if (angleParam && ['front', 'side', 'back'].includes(angleParam)) {
      setSelectedAngle(angleParam);
    }
  }, []);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  // Available thumbnails list
  const thumbnails: { key: 'front' | 'side' | 'back'; label: string; src: string }[] = [
    { key: 'front', label: 'Front View', src: garment.campaignFront || garment.angles.front },
    { key: 'side', label: 'Side Profile', src: garment.angles.side },
    { key: 'back', label: 'Back View', src: garment.angles.back || garment.angles.front },
  ];

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${garment.name} details`}
      className={`fixed inset-0 z-50 w-screen min-h-dvh overflow-y-auto lg:overflow-hidden font-sans bg-[#171512] text-white will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="fixed inset-0 pointer-events-none bg-cover bg-center opacity-35" style={{ backgroundImage: "url('/studio-stage.jpg')" }} aria-hidden="true" />
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(17,16,14,.68),rgba(17,16,14,.87))]" aria-hidden="true" />
      <div className="relative z-10 px-6 md:px-12 lg:px-16 pt-6 md:pt-8 flex items-center gap-3 font-wordmark text-[11px] tracking-[0.24em]">
        <span>THE ARCHIVE</span><span className="text-white/35">/</span><span className="text-white/55">COLLECTION 01</span>
      </div>
      {/* ================= TOP-RIGHT CONTROLS: CART & CLOSE BUTTON ================= */}
      <div className="absolute top-4 right-5 md:top-6 md:right-10 z-40 flex items-center gap-2.5">
        {itemCount > 0 && (
          <button
            onClick={openCart}
            className="h-10 px-3.5 rounded-full bg-white/10 border border-white/20 text-white flex items-center gap-2 hover:bg-white/20 transition-all cursor-pointer shadow-sm text-xs font-sans font-medium"
            aria-label={`View shopping bag with ${itemCount} items`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-white" />
            <span>Bag ({itemCount})</span>
          </button>
        )}
        <button
          onClick={handleClose}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 bg-white/10 border border-white/20 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close product view"
        >
          <X className="w-5 h-5 stroke-[1.75]" />
        </button>
      </div>

      {/* ================= THREE-COLUMN FULL-VIEWPORT LAYOUT ================= */}
      <div className="relative z-10 w-full min-h-[calc(100dvh-64px)] max-w-[1440px] mx-auto px-5 md:px-12 lg:px-16 flex flex-col lg:justify-center py-8 lg:py-4 box-border">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[78px_1fr_400px] xl:grid-cols-[90px_1fr_430px] items-center gap-5 lg:gap-8">
          
          {/* ================= COLUMN 1 (LEFT): VERTICAL PRODUCT THUMBNAILS ================= */}
          <section
            aria-label="Product angle thumbnails"
            className="flex flex-row lg:flex-col items-center justify-center gap-3 z-20 flex-shrink-0 order-2 lg:order-1"
          >
            {thumbnails.map(({ key, label, src }) => {
              const isActive = selectedAngle === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedAngle(key);
                    sfx.playHover();
                  }}
                  className={`relative w-[72px] h-[88px] lg:w-[68px] lg:h-[88px] rounded-lg overflow-hidden flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    isActive
                      ? 'border-2 border-white bg-white/20 shadow-lg'
                      : 'border border-white/20 bg-white/10 hover:border-white/60 hover:bg-white/20 opacity-80 hover:opacity-100'
                  }`}
                  aria-label={`View ${label}`}
                  aria-pressed={isActive}
                >
                  <img
                    src={src}
                    alt={`${garment.name} - ${label}`}
                    className="w-full h-full object-contain p-1.5 select-none pointer-events-none"
                    draggable={false}
                  />
                  <span className="sr-only">{label}</span>
                </button>
              );
            })}
          </section>

          {/* ================= COLUMN 2 (CENTER): MAIN GARMENT VIEW ================= */}
          <section
            aria-label="Main garment presentation"
            className="relative flex flex-col items-center justify-center w-full z-10 order-1 lg:order-2"
          >
            <div className="self-start text-[11px] font-mono uppercase tracking-[0.2em] text-white/65 mb-2">{String(collectionIndex).padStart(2, '0')} / {String(GARMENTS.length).padStart(2, '0')} &nbsp;—&nbsp; {garment.category}</div>
            {/* Frameless transparent cutout, reduced ~18% with balanced whitespace */}
            <div className="relative w-full max-w-[300px] md:max-w-[360px] lg:max-w-[390px] h-[min(42vh,360px)] md:h-[min(55vh,520px)] lg:h-[min(66vh,620px)] flex items-center justify-center">
              {/* Natural soft contact floor shadow */}
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-44 md:w-56 h-6 rounded-[50%] pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.14) 0%, rgba(0, 0, 0, 0.04) 45%, transparent 70%)',
                  filter: 'blur(8px)',
                }}
              />

              {/* Main Product Image: No competing scale/zoom animations, smooth crossfade */}
              <img
                key={`${garment.id}-${selectedAngle}`}
                src={selectedAngle === 'front' ? (garment.campaignFront || garment.angles.front) : (garment.angles[selectedAngle] || garment.angles.front)}
                alt={`${garment.name} - ${selectedAngle}`}
                className="w-full h-full object-contain drop-shadow-[0_24px_38px_rgba(0,0,0,0.5)] select-none product-render-enter"
                draggable={false}
              />
            </div>
            <span className="hidden lg:block mt-3 text-[10px] font-mono tracking-[0.22em] text-white/45 uppercase">A study in form, fabric &amp; movement</span>
          </section>

          {/* ================= COLUMN 3 (RIGHT): PRODUCT INFORMATION ================= */}
          <section
            aria-label="Product specifications and purchase"
            className="w-full flex flex-col z-20 flex-shrink-0 order-3 text-neutral-900 bg-[#f3efe7] rounded-2xl p-6 md:p-8 shadow-[0_28px_80px_rgba(0,0,0,0.32)]"
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.23em] text-neutral-500 mb-4">THE ARCHIVE &nbsp; / &nbsp; {garment.category}</div>
            {/* 1. Product Name */}
            <h1 className="text-[26px] md:text-[30px] lg:text-[32px] font-headline font-bold text-neutral-950 tracking-tight leading-tight">
              {garment.name}
            </h1>

            {/* 2. Price */}
            <p className="flex items-center gap-3 text-lg md:text-xl font-mono text-neutral-900 font-semibold mt-2">
              {formatPrice(salePrice(garment.price))}
              <span className="text-sm text-neutral-400 line-through">{garment.price}</span>
              <span className="text-[10px] tracking-widest text-[#d71919] uppercase font-bold">-{SALE_PERCENT}%</span>
            </p>

            {/* 3. Short Description */}
            <p className="text-xs md:text-sm text-neutral-600 font-body leading-relaxed mt-3.5">
              {garment.description}
            </p>

            {/* 4. Size Selector */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-medium">
                  Select Size
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  True to size
                </span>
              </div>
              <div className="flex items-center gap-2">
                {garment.sizes.map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedSize(s);
                        sfx.playHover();
                      }}
                      className={`min-w-[42px] h-9 px-3 rounded-lg border text-xs font-mono font-medium transition-all cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ${
                        isSelected
                          ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm font-bold'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:text-neutral-950'
                      }`}
                      aria-pressed={isSelected}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Add to Bag Action Button */}
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  addToBag(garment, selectedSize, 1, false);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 2400);
                }}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-xs uppercase tracking-[0.2em] transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer font-sans group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-950 ${
                  added
                    ? 'bg-emerald-800 text-white'
                    : 'bg-neutral-950 hover:bg-neutral-800 text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <span>Add to Bag: {formatPrice(salePrice(garment.price))}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {added && (
                <button
                  onClick={openCart}
                  className="w-full py-1.5 text-center text-xs font-sans text-neutral-600 hover:text-black underline underline-offset-4 cursor-pointer animate-in fade-in duration-200"
                >
                  View Shopping Bag ({itemCount}) →
                </button>
              )}
            </div>

            {/* 6. Compact Expandable Rows: Details & Shipping/Returns */}
            <div className="mt-6 pt-4 border-t border-neutral-200/80 space-y-2.5">
              {/* Accordion 1: Details */}
              <div className="border-b border-neutral-200/80 pb-2.5">
                <button
                  onClick={() => setDetailsOpen(!detailsOpen)}
                  className="w-full flex items-center justify-between text-left py-1 cursor-pointer group focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 rounded"
                  aria-expanded={detailsOpen}
                >
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-800 group-hover:text-black font-medium transition-colors">
                    Details
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 group-hover:text-neutral-800 transition-transform duration-200 ${
                      detailsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {detailsOpen && (
                  <div className="mt-2.5 pt-1">
                    <ul className="space-y-1 text-xs text-neutral-600 font-body leading-relaxed">
                      {garment.details && garment.details.length > 0 ? (
                        garment.details.map((d, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-neutral-400 mt-0.5">•</span>
                            <span>{d}</span>
                          </li>
                        ))
                      ) : (
                        <li>Crafted from premium archive materials.</li>
                      )}
                      {garment.fit && (
                        <li className="flex items-start gap-2 pt-1 border-t border-neutral-100 text-neutral-500">
                          <span className="text-neutral-400 mt-0.5">•</span>
                          <span>Fit: {garment.fit}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Shipping & Returns */}
              <div className="border-b border-neutral-200/80 pb-2.5">
                <button
                  onClick={() => setShippingOpen(!shippingOpen)}
                  className="w-full flex items-center justify-between text-left py-1 cursor-pointer group focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 rounded"
                  aria-expanded={shippingOpen}
                >
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-800 group-hover:text-black font-medium transition-colors">
                    Shipping & Returns
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 group-hover:text-neutral-800 transition-transform duration-200 ${
                      shippingOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {shippingOpen && (
                  <div className="mt-2.5 pt-1 text-xs text-neutral-600 font-body leading-relaxed space-y-1.5">
                    <p className="flex items-start gap-2">
                      <span className="text-neutral-900 mt-0.5">•</span>
                      <span>
                        <strong>Demo storefront:</strong> Shipping options are shown for preview only. No order is dispatched.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-neutral-900 mt-0.5">•</span>
                      <span>
                        <strong>Returns:</strong> Terms will be available when live commerce launches.
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
};
