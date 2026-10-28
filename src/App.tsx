import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { GARMENTS } from './data/garments';
import { GarmentItemData } from './types';
import { HangingRail } from './components/HangingRail';
import { ProductDetailDrawer } from './components/ProductDetailDrawer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { useCart } from './context/CartContext';
import TextLoop from './components/TextLoop';
import { sfx } from './utils/audio';
import { X, ShieldCheck, RefreshCw, ShoppingBag, Volume2, VolumeX } from 'lucide-react';
import { formatPrice, salePrice } from './utils/pricing';
import { useDialogFocus } from './hooks/useDialogFocus';

export default function App() {
  const stageRef = useRef<HTMLElement>(null);
  const { openCart, itemCount } = useCart();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<GarmentItemData | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try { return localStorage.getItem('the_archive_sound') !== 'off'; } catch { return true; }
  });
  const menuRef = useDialogFocus(menuOpen);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let active = true;
    let timeoutId: number | undefined;
    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-intro="rail"] [role="button"]');
      gsap.set('[data-intro="veil"]', { autoAlpha: 1 });
      gsap.set('[data-intro="title"]', { autoAlpha: 0, y: 18 });
      gsap.set(cards, { autoAlpha: 0, y: -25 });
      gsap.set('[data-intro="controls"], [data-intro="hint"]', { autoAlpha: 0, y: -12 });
      gsap.set('[data-intro="ticker"]', { autoAlpha: 0, y: 44 });

      const entrance = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      entrance
        .to('[data-intro="veil"]', { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' }, 0)
        .to('[data-intro="title"]', { autoAlpha: 1, y: 0, duration: 0.65 }, 0.15)
        .to(cards, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.075 }, 0.3)
        .to('[data-intro="controls"], [data-intro="hint"]', { autoAlpha: 1, y: 0, duration: 0.4 }, 0.72)
        .to('[data-intro="ticker"]', { autoAlpha: 1, y: 0, duration: 0.45 }, 0.85);

      const imageReady = (src: string) => {
        const image = new Image();
        image.src = src;
        return image.decode().catch(() => undefined);
      };
      const assets = Promise.allSettled([
        document.fonts.ready,
        imageReady('/studio-stage.jpg'),
        ...GARMENTS.slice(0, 3).map((garment) => imageReady(garment.angles.side)),
      ]);
      Promise.race([
        assets,
        new Promise<void>((resolve) => { timeoutId = window.setTimeout(resolve, 1000); }),
      ]).then(() => { if (active) entrance.play(); });

    }, stage);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      context.revert();
    };
  }, []);

  useEffect(() => {
    sfx.enabled = soundEnabled;
    try { localStorage.setItem('the_archive_sound', soundEnabled ? 'on' : 'off'); } catch { /* storage optional */ }
  }, [soundEnabled]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  // Read URL query parameters on mount for direct verification & deep-linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hoverParam = params.get('hover');
    if (hoverParam) {
      const match = GARMENTS.find((g, i) => g.id === hoverParam || String(i) === hoverParam);
      if (match) setHoveredId(match.id);
    }
    const detailParam = params.get('detail');
    if (detailParam) {
      const match = GARMENTS.find((g, i) => g.id === detailParam || String(i) === detailParam);
      if (match) setSelectedGarment(match);
    }
  }, []);

  // Hover handler with subtle audio feedback
  const handleHover = useCallback((id: string | null) => {
    setHoveredId((prev) => {
      if (prev !== id && id !== null) {
        sfx.playHover();
      }
      return id;
    });
  }, []);

  // Selection handler (click only)
  const handleSelect = useCallback((garment: GarmentItemData) => {
    setSelectedGarment(garment);
    sfx.playSelect();
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedGarment(null);
    sfx.playWhoosh();
  }, []);

  return (
    <main
      ref={stageRef}
      className="relative w-screen h-screen overflow-hidden select-none font-sans bg-cover bg-center bg-no-repeat flex flex-col items-center"
      style={{
        backgroundImage: "url('/studio-stage.jpg')",
        backgroundColor: '#9e9a93',
      }}
    >
      <div data-intro="veil" aria-hidden="true" className="absolute inset-0 z-20 pointer-events-none bg-[#171411]" />
      {/* ================= TOP RIGHT CONTROLS: SHOPPING BAG + HAMBURGER MENU ================= */}
      <div data-intro="controls" className="absolute top-6 right-6 md:top-8 md:right-10 z-30 pointer-events-auto flex items-center gap-2.5">
        {/* Shopping Bag Trigger Button */}
        <button
          onClick={openCart}
          className="h-10 px-3.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center gap-2 transition-all cursor-pointer group shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={`Shopping bag with ${itemCount} items`}
        >
          <ShoppingBag className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
          <span className="text-xs font-sans tracking-wider uppercase font-semibold text-white/90">Bag</span>
          {itemCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-white text-black text-[10px] font-mono font-bold leading-tight">
              {itemCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setSoundEnabled((enabled) => !enabled)}
          className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={soundEnabled ? 'Mute interaction sounds' : 'Enable interaction sounds'}
          aria-pressed={soundEnabled}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 flex flex-col items-end justify-center gap-1.5 p-2 focus:outline-none group cursor-pointer bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 rounded-full transition-all"
          aria-label="Toggle menu"
        >
          <span
            className={`h-[1.5px] bg-white transition-all duration-300 ${
              menuOpen ? 'w-5 rotate-45 translate-y-[4.5px]' : 'w-5 group-hover:w-6'
            }`}
          />
          <span
            className={`h-[1.5px] bg-white transition-all duration-300 ${
              menuOpen ? 'w-5 -rotate-45 -translate-y-[3px]' : 'w-3.5 group-hover:w-6'
            }`}
          />
        </button>
      </div>

      <div data-intro="hint" className="md:hidden fixed bottom-[68px] z-20 rounded-full bg-black/45 border border-white/20 backdrop-blur-md px-4 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-white/90 pointer-events-none">
        Swipe the rail to explore
      </div>

      {/* ================= HERO COMPOSITION ================= */}
      {/* Centered, balanced vertical layout */}
      <div className="relative w-full flex flex-col items-center z-10">
        {/* Main Title: 20% reduced font size, subtle soft drop shadow, centered vertically between ceiling and rail */}
        <h1
          data-intro="title"
          className="mt-[18vh] md:mt-[20.5vh] text-[30px] md:text-[50px] lg:text-[61px] font-headline uppercase text-white select-none text-center"
          style={{
            filter: 'drop-shadow(0 3px 12px rgba(0, 0, 0, 0.55)) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.4))',
          }}
        >
          THE ARCHIVE
        </h1>

        {/* Clothing Rail Section: Pinned directly onto the physical rod in the background image */}
        <div data-intro="rail" className="absolute top-[36.8vh] left-0 right-0 w-full">
          <HangingRail
            garments={GARMENTS}
            hoveredId={hoveredId}
            onHover={handleHover}
            onSelect={handleSelect}
          />
        </div>
      </div>

      {/* ================= BOTTOM FLUSH MARQUEE TICKER (ELECTRIC NEON RED, SALE 20%) ================= */}
      <div data-intro="ticker" className="fixed bottom-0 left-0 right-0 w-full h-[44px] bg-[#e01616] z-30 pointer-events-none select-none overflow-hidden m-0 p-0 flex items-center">
        <TextLoop
          text="SALE 20%"
          shape="line"
          speed={90}
          direction="forward"
          separator="✦"
          curviness={0}
          tilt={0}
          fontSize={22}
          fontWeight={800}
          letterSpacing={2}
          uppercase
          color="#ffffff"
          ribbon
          ribbonColor="#e01616"
          ribbonWidth={44}
          edgeFade={0}
          cross={false}
          crossAngle={16}
          draggable={false}
          scrollBoost={0}
          outline={false}
          pauseOnHover={false}
          className="h-full w-full"
        />
      </div>

      {/* ================= PRODUCT DETAIL DRAWER (Click-to-open) ================= */}
      {selectedGarment && (
        <ProductDetailDrawer
          garment={selectedGarment}
          onClose={handleCloseDetail}
        />
      )}

      {/* ================= SHOPPING BAG DRAWER ================= */}
      <CartDrawer />

      {/* ================= GUEST CHECKOUT MODAL ================= */}
      <CheckoutModal />

      {/* ================= ORDER CONFIRMATION MODAL ================= */}
      <OrderConfirmationModal />

      {/* ================= SLIDE-OUT NAVIGATION MENU ================= */}
      {menuOpen && (
        <div ref={menuRef} role="dialog" aria-modal="true" aria-label="Collection menu" className="fixed inset-0 z-50 pointer-events-auto flex justify-end">
          <div
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
          />

          <div className="relative w-full max-w-md bg-[#161514]/95 border-l border-white/10 p-8 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-400 text-white">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <span className="font-wordmark text-sm tracking-[0.3em] text-white">THE ARCHIVE</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close collection menu"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-6">
                {GARMENTS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMenuOpen(false);
                      handleSelect(item);
                    }}
                    className="flex items-center justify-between group py-1 text-left w-full cursor-pointer"
                  >
                    <span className="text-lg font-semibold tracking-tight text-white/90 group-hover:text-amber-200 transition-colors">
                      {item.name}
                    </span>
                    <span className="text-xs text-white/40 tracking-widest uppercase font-mono">
                      {formatPrice(salePrice(item.price))}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-white/50 space-y-2">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Interactive collection preview
              </p>
              <p className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
                Demo checkout · No payment collected
              </p>
              <p className="text-[10px] text-white/30 pt-3">
                © {new Date().getFullYear()} THE ARCHIVE STUDIO. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
