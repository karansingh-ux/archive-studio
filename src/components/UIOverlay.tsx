import React, { useState } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';

interface UIOverlayProps {
  selectedId: string | null;
  onSelectShopNow: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ selectedId, onSelectShopNow }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 md:p-12 overflow-hidden">
      {/* ================= TOP BAR ================= */}
      <header className="flex items-center justify-between w-full pointer-events-auto">
        {/* Brand Logo in Top-Left (Cursive Script Style inspired by reference) */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <span className="font-script text-3xl md:text-4xl text-white tracking-wide select-none drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            Archive
          </span>
        </div>

        {/* Minimal Hamburger Menu in Top-Right (Two horizontal lines matching reference) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 flex flex-col items-end justify-center gap-1.5 p-2 focus:outline-none group cursor-pointer"
          aria-label="Toggle navigation menu"
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

      {/* ================= CENTER HERO TITLE ================= */}
      {/* Positioned right behind the rail, matching the reference image */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-700 select-none ${
          selectedId
            ? 'opacity-15 scale-95 blur-sm -translate-y-8'
            : 'opacity-100 scale-100 translate-y-[-7%]'
        }`}
      >
        <span className="text-white/80 text-xs md:text-sm font-semibold tracking-[0.45em] uppercase mb-1 drop-shadow-sm font-sub">
          THE
        </span>
        <h1 className="text-white text-[15vw] md:text-[13vw] font-black leading-none tracking-[-0.035em] font-archive drop-shadow-2xl">
          ARCHIVE
        </h1>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      {/* Matches reference: NEVER BASIC (bottom-left), Tagline (bottom-center), SHOP NOW (bottom-right) */}
      <footer
        className={`w-full flex items-end justify-between pointer-events-auto transition-opacity duration-500 ${
          selectedId ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Bottom Left: NEVER BASIC */}
        <div className="text-left select-none cursor-default">
          <p className="text-white text-base md:text-lg font-black tracking-tight leading-none uppercase font-sub">
            NEVER<br />BASIC
          </p>
        </div>

        {/* Bottom Center: Tagline */}
        <div className="hidden sm:block text-center max-w-sm px-4">
          <p className="text-white/85 text-[11px] md:text-xs font-normal tracking-wide font-sub drop-shadow">
            Designed for those who never follow the crowd.
          </p>
        </div>

        {/* Bottom Right: SHOP NOW button */}
        <div className="text-right">
          <button
            onClick={onSelectShopNow}
            className="text-white text-base md:text-lg font-black tracking-tight leading-none uppercase font-sub group cursor-pointer inline-flex flex-col items-end"
          >
            <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              SHOP<br />NOW
            </span>
            <span className="w-0 group-hover:w-full h-[2px] bg-white transition-all duration-300 mt-1" />
          </button>
        </div>
      </footer>

      {/* ================= SLIDE-OUT MENU DRAWER ================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 pointer-events-auto flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-md bg-[#161514]/95 border-l border-white/10 p-8 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-400">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <span className="font-script text-3xl text-white">Archive</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="mt-8 flex flex-col gap-6">
                {[
                  { name: 'Collection 01 — Autumn / Winter', count: '10 Pieces' },
                  { name: 'Varsity & Outerwear', count: '4 Pieces' },
                  { name: 'Heavyweight Knitwear', count: '3 Pieces' },
                  { name: 'Japanese Selvedge Denim', count: '1 Piece' },
                  { name: 'Craftsmanship & Materials', count: 'Manifesto' },
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href="#collection"
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuOpen(false);
                      onSelectShopNow();
                    }}
                    className="flex items-center justify-between group py-1 text-left"
                  >
                    <span className="text-lg font-semibold tracking-tight text-white/90 group-hover:text-amber-200 transition-colors">
                      {item.name}
                    </span>
                    <span className="text-xs text-white/40 tracking-widest uppercase">
                      {item.count}
                    </span>
                  </a>
                ))}
              </nav>
            </div>

            {/* Bottom menu info */}
            <div className="pt-6 border-t border-white/10 text-xs text-white/50 space-y-2">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Worldwide Express Shipping & Carbon Neutral
              </p>
              <p className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
                14-Day Vault Complimentary Exchange
              </p>
              <p className="text-[10px] text-white/30 pt-3">
                © {new Date().getFullYear()} THE ARCHIVE STUDIO. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
