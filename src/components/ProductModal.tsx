import React, { useState } from 'react';
import { GarmentData } from '../types';
import { RotateCw, X, ChevronLeft, ChevronRight, Check, ShoppingBag, Sparkles } from 'lucide-react';

interface ProductModalProps {
  garment: GarmentData;
  inspectRotation: number;
  onSetRotation: (rot: number) => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  garment,
  inspectRotation,
  onSetRotation,
  onClose,
  onPrev,
  onNext,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(garment.sizes[1] || garment.sizes[0]);
  const [addedToCart, setAddedToCart] = useState(false);

  const isBack = Math.abs(inspectRotation - Math.PI) < 0.2 || Math.abs(inspectRotation + Math.PI) < 0.2;

  const toggleFlip = () => {
    onSetRotation(isBack ? 0 : Math.PI);
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2400);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-6 md:p-10">
      {/* Top Bar with Navigation & Close */}
      <div className="flex items-center justify-between pointer-events-auto">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest bg-black/40 hover:bg-black/60 text-white/90 hover:text-white rounded-full border border-white/15 backdrop-blur-md transition-all duration-300 group shadow-lg"
        >
          <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Collection</span>
          <span className="text-[10px] text-white/40 ml-1">(Esc)</span>
        </button>

        {/* Previous / Next Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/70 text-white/90 border border-white/15 backdrop-blur-md transition-all"
            title="Previous Garment (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNext}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/70 text-white/90 border border-white/15 backdrop-blur-md transition-all"
            title="Next Garment (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating 360 Inspection Control at bottom center */}
      <div className="flex justify-center pointer-events-auto mb-2">
        <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl">
          <button
            onClick={toggleFlip}
            className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-white hover:text-amber-200 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{isBack ? 'View Front' : 'Inspect Back (180°)'}</span>
          </button>
          <div className="w-[1px] h-4 bg-white/20" />
          {/* Fine scrub control */}
          <input
            type="range"
            min={-Math.PI}
            max={Math.PI}
            step={0.05}
            value={inspectRotation}
            onChange={(e) => onSetRotation(parseFloat(e.target.value))}
            className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>

      {/* Bottom Product Info Glass Card */}
      <div className="pointer-events-auto max-w-md w-full glass-panel rounded-2xl p-6 text-white shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-amber-200/90 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> {garment.category}
            </span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight font-sub mt-1">
              {garment.name}
            </h2>
          </div>
          <span className="text-xl font-bold tracking-tight font-sub text-white/95">
            {garment.price}
          </span>
        </div>

        {/* Color info */}
        <div className="flex items-center gap-2 mt-3">
          <div
            className="w-4 h-4 rounded-full border border-white/30 shadow-inner"
            style={{ backgroundColor: garment.colorHex }}
          />
          <span className="text-xs text-white/70 font-medium">
            {garment.colorName}
          </span>
        </div>

        {/* Material description */}
        <p className="text-xs text-white/75 mt-3 leading-relaxed font-light line-clamp-2 md:line-clamp-3">
          {garment.description}
        </p>

        {/* Size Selection */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-white/60 mb-2">
            <span>SELECT SIZE</span>
            <span className="text-[10px] text-white/40">{garment.fit}</span>
          </div>
          <div className="flex gap-2">
            {garment.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  selectedSize === size
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-white/5 text-white/80 border-white/10 hover:border-white/30'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Archive Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full mt-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 shadow-xl ${
            addedToCart
              ? 'bg-emerald-500 text-white'
              : 'bg-white text-black hover:bg-neutral-200 active:scale-[0.98]'
          }`}
        >
          {addedToCart ? (
            <>
              <Check className="w-4 h-4" /> Added to Archive
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> Acquire Piece — {garment.price}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
