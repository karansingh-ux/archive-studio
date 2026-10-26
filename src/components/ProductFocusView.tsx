import React, { useState } from 'react';
import { GarmentItemData } from '../data/garments';
import { ChevronLeft, ChevronRight, X, ArrowUpRight, Check, Tag, Info } from 'lucide-react';

interface ProductFocusViewProps {
  garment: GarmentItemData;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const ProductFocusView: React.FC<ProductFocusViewProps> = ({
  garment,
  onClose,
  onPrev,
  onNext,
}) => {
  const [viewMode, setViewMode] = useState<'front' | 'back'>('front');
  const [selectedSize, setSelectedSize] = useState<string>(garment.sizes[1] || garment.sizes[0]);
  const [added, setAdded] = useState(false);

  const hasBackImage = Boolean(garment.backImage);

  const handleAcquire = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-between p-6 md:p-12 pointer-events-auto animate-in fade-in duration-400">
      {/* Background Dim Backdrop */}
      <div
        className="absolute inset-0 bg-[#94918c]/80 backdrop-blur-md -z-10 cursor-pointer"
        onClick={onClose}
      />

      {/* ================= TOP NAVIGATION BAR ================= */}
      <div className="w-full flex items-center justify-between z-20">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/15 backdrop-blur-md text-xs uppercase tracking-widest transition-all duration-300 group shadow-md"
        >
          <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Collection</span>
          <span className="text-white/40 text-[10px] ml-1">(Esc)</span>
        </button>

        {/* Minimal CLOSE X in Top Right (replicates reference video!) */}
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/15 backdrop-blur-md text-xs uppercase tracking-widest transition-all group"
          aria-label="Close product view"
        >
          <span>Close</span>
          <X className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
        </button>
      </div>

      {/* ================= CENTER STAGE: FOCUSED GARMENT & CONTROLS ================= */}
      <div className="relative flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full my-auto">
        {/* Left / Right Collection Navigation Arrows */}
        <button
          onClick={onPrev}
          className="absolute left-0 md:-left-16 w-11 h-11 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md transition-all z-30 shadow-xl"
          title="Previous Garment (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={onNext}
          className="absolute right-0 md:-right-16 w-11 h-11 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md transition-all z-30 shadow-xl"
          title="Next Garment (Right Arrow)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Garment Stage Container */}
        <div className="relative flex items-center justify-center w-full max-w-[280px] md:max-w-[340px] transition-all duration-500">
          {/* Main Image (Front or Back) */}
          <div
            className="relative w-full transition-transform duration-500 ease-out"
            style={{
              transform: viewMode === 'back' ? 'perspective(1000px) rotateY(180deg)' : 'perspective(1000px) rotateY(0deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              src={viewMode === 'back' && hasBackImage ? garment.backImage! : garment.image}
              alt={garment.name}
              className="w-full h-auto object-contain select-none drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)]"
              draggable={false}
            />
          </div>

          {/* Color Hangtags on the Right (Replicates reference video frames 013 & 017!) */}
          <div className="absolute -right-8 md:-right-12 top-6 flex flex-col gap-3 pointer-events-auto">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/70 border border-white/20 text-[10px] uppercase font-mono tracking-wider text-white shadow-lg rotate-3"
              style={{ borderLeftColor: garment.colorHex, borderLeftWidth: '3px' }}
            >
              <Tag className="w-3 h-3 text-amber-300" />
              <span>{garment.colorName}</span>
            </div>
          </div>
        </div>

        {/* Product Title (matches reference video typography!) */}
        <div className="text-center mt-6">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white font-sub drop-shadow">
            {garment.name}
          </h2>
          <p className="text-xs md:text-sm text-white/70 font-mono tracking-wider mt-1">
            {garment.price} • {garment.category}
          </p>
        </div>

        {/* Front / Back Toggle Pills (matches reference video frames 013, 022!) */}
        <div className="flex items-center gap-1.5 mt-4 p-1 rounded-full bg-black/50 border border-white/15 backdrop-blur-md shadow-lg">
          <button
            onClick={() => setViewMode('front')}
            className={`px-4 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all ${
              viewMode === 'front'
                ? 'bg-white text-black shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Front
          </button>

          <button
            onClick={() => {
              if (hasBackImage) {
                setViewMode('back');
              }
            }}
            disabled={!hasBackImage}
            className={`px-4 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-1 ${
              viewMode === 'back'
                ? 'bg-white text-black shadow-sm'
                : hasBackImage
                ? 'text-white/70 hover:text-white'
                : 'text-white/30 cursor-not-allowed'
            }`}
            title={!hasBackImage ? 'Back view photograph not available in assets' : 'Inspect Back View'}
          >
            <span>Back</span>
            {!hasBackImage && (
              <span className="text-[9px] text-white/40 font-normal lowercase">(pending)</span>
            )}
          </button>
        </div>

        {/* Availability / Purchase Action Button */}
        <div className="mt-5 flex flex-col items-center gap-3">
          <button
            onClick={handleAcquire}
            className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shadow-2xl ${
              added
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-black hover:bg-neutral-200 active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" /> Added to Archive
              </>
            ) : (
              <>
                <span>See Availability</span>
                <ArrowUpRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Asset honesty notice */}
          {!hasBackImage && (
            <p className="flex items-center gap-1 text-[10px] text-white/40 font-mono tracking-wide">
              <Info className="w-3 h-3" /> Photographic front view active. (Back view asset pending).
            </p>
          )}
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="w-full flex items-center justify-between text-xs text-white/60 font-sub tracking-wider uppercase border-t border-white/10 pt-4 z-20">
        <span>{garment.fit}</span>
        <span>Crafted from {garment.details[0]}</span>
        <div className="flex gap-2">
          {garment.sizes.map((s) => (
            <span
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`cursor-pointer px-2 py-0.5 rounded ${
                selectedSize === s ? 'text-white bg-white/20 font-bold' : 'hover:text-white'
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
