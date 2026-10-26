import React from 'react';
import { GarmentItemData } from '../data/garments';
import { ChevronLeft, ChevronRight, X, ArrowUpRight } from 'lucide-react';

interface FocusControlsProps {
  garment: GarmentItemData;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const FocusControls: React.FC<FocusControlsProps> = ({
  garment,
  onClose,
  onPrev,
  onNext,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-6 md:p-10 animate-in fade-in duration-300">
      {/* Top Bar Navigation / Close Button */}
      <div className="w-full flex items-center justify-between pointer-events-auto">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/15 backdrop-blur-md text-xs uppercase tracking-widest transition-all shadow-lg group cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Collection</span>
          <span className="text-white/40 text-[10px] ml-1">(Esc)</span>
        </button>

        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/15 backdrop-blur-md text-xs uppercase tracking-widest transition-all group cursor-pointer shadow-lg"
          aria-label="Close product focus"
        >
          <span>Close</span>
          <X className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
        </button>
      </div>

      {/* Left / Right Cycle Arrows (Centered Vertically) */}
      <div className="absolute inset-x-4 md:inset-x-12 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-40">
        <button
          onClick={onPrev}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-all pointer-events-auto shadow-2xl cursor-pointer"
          title="Previous Garment (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onNext}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-all pointer-events-auto shadow-2xl cursor-pointer"
          title="Next Garment (Right Arrow)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Bottom Center Product Info & Action Card */}
      <div className="w-full flex justify-center pointer-events-auto mb-6 md:mb-10">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-6 py-3.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
          <div className="text-center sm:text-left">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-300">
              {garment.category} • {garment.colorName}
            </span>
            <h2 className="text-base md:text-lg font-bold tracking-tight font-sub">
              {garment.name}
            </h2>
          </div>

          <div className="hidden sm:block w-[1px] h-8 bg-white/20" />

          <div className="flex items-center gap-3">
            <span className="text-base font-bold font-mono text-white/95">
              {garment.price}
            </span>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-1 shadow-md"
            >
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
