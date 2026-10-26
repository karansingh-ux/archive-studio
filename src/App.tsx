import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GARMENTS, GarmentItemData } from './data/garments';
import { ClothingRack } from './components/ClothingRack';
import { ProductFocusView } from './components/ProductFocusView';
import { sfx } from './utils/audio';
import { Volume2, VolumeX, X, ShieldCheck, RefreshCw } from 'lucide-react';

export default function App() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Active selected garment
  const selectedGarment = useMemo(() => {
    return GARMENTS.find((g) => g.id === selectedId) || null;
  }, [selectedId]);

  // Sync sound settings
  useEffect(() => {
    sfx.enabled = soundEnabled;
  }, [soundEnabled]);

  // Hover handler with micro-sound
  const handleHover = useCallback((id: string | null) => {
    setHoveredId((prev) => {
      if (prev !== id && id !== null) {
        sfx.playHover();
      }
      return id;
    });
  }, []);

  // Selection handler
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    sfx.playSelect();
  }, []);

  // Close inspection
  const handleClose = useCallback(() => {
    setSelectedId(null);
    sfx.playWhoosh();
  }, []);

  // Previous garment in collection
  const handlePrevGarment = useCallback(() => {
    if (!selectedId) return;
    const currentIndex = GARMENTS.findIndex((g) => g.id === selectedId);
    const prevIndex = (currentIndex - 1 + GARMENTS.length) % GARMENTS.length;
    setSelectedId(GARMENTS[prevIndex].id);
    sfx.playSelect();
  }, [selectedId]);

  // Next garment in collection
  const handleNextGarment = useCallback(() => {
    if (!selectedId) return;
    const currentIndex = GARMENTS.findIndex((g) => g.id === selectedId);
    const nextIndex = (currentIndex + 1) % GARMENTS.length;
    setSelectedId(GARMENTS[nextIndex].id);
    sfx.playSelect();
  }, [selectedId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        if (selectedId) handlePrevGarment();
      } else if (e.key === 'ArrowRight') {
        if (selectedId) handleNextGarment();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, handleClose, handlePrevGarment, handleNextGarment]);

  return (
    <main
      className="relative w-screen h-screen overflow-hidden select-none font-sans flex flex-col justify-between p-6 md:p-10 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/studio-stage.jpg')",
        backgroundColor: '#94918c',
      }}
    >
      {/* ================= TOP HEADER BAR ================= */}
      <header className="relative w-full flex items-center justify-between z-20 pointer-events-auto">
        {/* Brand Logo in Top-Left (Cursive Script Style matching approved hero design) */}
        <div
          onClick={() => handleClose()}
          className="cursor-pointer group flex items-center gap-2"
        >
          <span className="font-script text-3xl md:text-5xl text-white tracking-wide drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            Archive
          </span>
        </div>

        {/* Audio Mute Pill */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white backdrop-blur-md border border-white/10 text-[10px] tracking-wider transition-all duration-300"
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono">SOUND ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-white/40" />
              <span className="hidden sm:inline font-mono text-white/40">MUTED</span>
            </>
          )}
        </button>

        {/* Minimal Two-Line Hamburger Menu in Top-Right (replicates reference design) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 flex flex-col items-end justify-center gap-1.5 p-2 focus:outline-none group cursor-pointer"
          aria-label="Toggle menu"
        >
          <span
            className={`h-[2px] bg-white transition-all duration-300 ${
              menuOpen ? 'w-6 rotate-45 translate-y-[5px]' : 'w-7 group-hover:w-8'
            }`}
          />
          <span
            className={`h-[2px] bg-white transition-all duration-300 ${
              menuOpen ? 'w-6 -rotate-45 -translate-y-[3px]' : 'w-5 group-hover:w-8'
            }`}
          />
        </button>
      </header>

      {/* ================= CENTER HERO COMPOSITION ================= */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center my-auto z-10">
        {/* Editorial Headline: Sits above the rail and NEVER overlaps the garments */}
        <div
          className={`flex flex-col items-center justify-center text-center transition-all duration-700 mb-2 md:mb-4 ${
            selectedId ? 'opacity-20 blur-sm scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <span className="text-white text-[11px] md:text-sm font-semibold tracking-[0.45em] uppercase drop-shadow font-sub">
            THE
          </span>
          <h1 className="text-white text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-none tracking-[-0.035em] font-archive drop-shadow-xl">
            ARCHIVE
          </h1>
        </div>

        {/* Clothing Rack: Suspended Chrome Rail & 10 Streetwear Garments */}
        <div
          className={`w-full transition-all duration-700 ${
            selectedId ? 'opacity-20 blur-sm scale-95 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          <ClothingRack
            garments={GARMENTS}
            hoveredId={hoveredId}
            selectedId={selectedId}
            onHover={handleHover}
            onSelect={handleSelect}
          />
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      {/* NEVER BASIC (bottom-left), Tagline (bottom-center), SHOP NOW (bottom-right) */}
      <footer
        className={`w-full flex items-end justify-between z-20 pointer-events-auto transition-opacity duration-500 ${
          selectedId ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Bottom Left: NEVER BASIC */}
        <div className="text-left select-none cursor-default">
          <p className="text-white text-base md:text-lg font-black tracking-tight leading-none uppercase font-sub drop-shadow">
            NEVER<br />BASIC
          </p>
        </div>

        {/* Bottom Center: Tagline */}
        <div className="hidden sm:block text-center max-w-sm px-4">
          <p className="text-white/85 text-[11px] md:text-xs font-normal tracking-wide font-sub drop-shadow">
            Designed for those who never follow the crowd.
          </p>
        </div>

        {/* Bottom Right: SHOP NOW */}
        <div className="text-right">
          <button
            onClick={() => handleSelect('varsity-jacket')}
            className="text-white text-base md:text-lg font-black tracking-tight leading-none uppercase font-sub group cursor-pointer inline-flex flex-col items-end drop-shadow"
          >
            <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              SHOP<br />NOW
            </span>
            <span className="w-0 group-hover:w-full h-[2px] bg-white transition-all duration-300 mt-1" />
          </button>
        </div>
      </footer>

      {/* ================= FOCUSED PRODUCT INSPECTION MODAL ================= */}
      {selectedGarment && (
        <ProductFocusView
          garment={selectedGarment}
          onClose={handleClose}
          onPrev={handlePrevGarment}
          onNext={handleNextGarment}
        />
      )}

      {/* ================= SLIDE-OUT NAVIGATION MENU ================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 pointer-events-auto flex justify-end">
          <div
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
          />

          <div className="relative w-full max-w-md bg-[#161514]/95 border-l border-white/10 p-8 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-400">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <span className="font-script text-4xl text-white">Archive</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-6">
                {[
                  { name: 'Collection 01 — Full Lineup', id: 'varsity-jacket', count: '10 Pieces' },
                  { name: 'Archive Varsity Jacket', id: 'varsity-jacket', count: '$380' },
                  { name: 'Raw Oatmeal Hoodie', id: 'heavyweight-hoodie-oatmeal', count: '$210' },
                  { name: 'Midnight Navy Pullover', id: 'piped-pullover-navy', count: '$240' },
                  { name: '14oz Skater Denim', id: 'wide-leg-denim', count: '$220' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMenuOpen(false);
                      handleSelect(item.id);
                    }}
                    className="flex items-center justify-between group py-1 text-left w-full"
                  >
                    <span className="text-lg font-semibold tracking-tight text-white/90 group-hover:text-amber-200 transition-colors">
                      {item.name}
                    </span>
                    <span className="text-xs text-white/40 tracking-widest uppercase font-mono">
                      {item.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-white/50 space-y-2">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Worldwide Express Courier & Carbon Neutral
              </p>
              <p className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
                Complimentary Returns & Vault Exchange
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
