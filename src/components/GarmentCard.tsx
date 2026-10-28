import React from 'react';
import { GarmentItemData } from '../types';
import { formatPrice, salePrice } from '../utils/pricing';

interface GarmentCardProps {
  garment: GarmentItemData;
  idx: number;
  isHovered: boolean;
  translateX: number;
  translateY: number;
  zIndex: number;
  onClick: () => void;
  setRef: (el: HTMLDivElement | null) => void;
}

export const GarmentCard: React.FC<GarmentCardProps> = ({
  garment,
  idx,
  isHovered,
  translateX,
  translateY,
  zIndex,
  onClick,
  setRef,
}) => {
  return (
    <div
      ref={setRef}
      className="relative w-[84px] flex flex-col items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white select-none group flex-shrink-0 snap-center"
      style={{ zIndex }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      tabIndex={0}
      role="button"
      aria-label={`View ${garment.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* ================= REALISTIC STUDIO CYCLORAMA FLOOR SHADOW ================= */}
      {/* Beneath each garment, dynamically widening and shifting with horizontal displacement */}
      <div
        className="absolute pointer-events-none transition-all duration-360 ease-out z-0"
        style={{
          top: '305px',
          left: '50%',
          width: isHovered ? '176px' : '96px',
          height: isHovered ? '28px' : '18px',
          transform: `translateX(-50%) translateX(${translateX}px)`,
          opacity: isHovered ? 0.40 : 0.24,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(16, 14, 12, 0.72) 0%, rgba(20, 18, 16, 0.32) 45%, rgba(25, 22, 20, 0) 75%)',
          filter: isHovered ? 'blur(12px)' : 'blur(9px)',
          transition: 'width 0.35s cubic-bezier(0.2, 0.85, 0.25, 1), height 0.35s cubic-bezier(0.2, 0.85, 0.25, 1), opacity 0.35s ease, transform 0.36s cubic-bezier(0.2, 0.85, 0.25, 1), filter 0.35s ease',
        }}
      />

      {/* ================= GARMENT CONTAINER WITH HORIZONTAL SPREAD (+22% SCALE: 198px) ================= */}
      <div
        className="relative w-[198px] min-w-[198px] flex items-center justify-center will-change-transform flex-shrink-0"
        style={{
          // Garment assets already include a hook. Align that hook with the photographed rail.
          transform: `translateX(${translateX}px) translateY(${translateY - 23}px) scale(${isHovered ? 1.03 : 1})`,
          transformOrigin: '50% 24px',
          transition: 'transform 0.36s cubic-bezier(0.2, 0.85, 0.25, 1)',
        }}
      >
        {/* ================= SUBTLE RESTRAINED HANGER PENDULUM SWAY ================= */}
        {/* Anchored at exact hook contact point (50% 24px) with +20% sway intensity (+/-1.05 deg) */}
        <div
          className={`w-full h-full relative will-change-transform ${isHovered ? 'animate-subtle-sway' : ''}`}
          style={{
            transformOrigin: '50% 24px',
            ...(!isHovered ? { transform: 'rotate(0deg)', transition: 'transform 0.45s ease-out' } : {}),
          }}
        >
          {/* ================= 3D PERSPECTIVE TURN CONTAINER (UNIFIED SHADOW, NO GHOSTING) ================= */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              perspective: '900px',
              // Single unified container drop-shadow eliminates twin/duplicate shadow silhouettes completely
              filter: 'drop-shadow(0 16px 30px rgba(0,0,0,0.38))',
            }}
          >
            {/* Layer 1: Resting Side Profile View (Default on rail) */}
            <img
              src={garment.angles.side}
              alt={`${garment.name} - Side View`}
              className="w-full h-auto object-contain pointer-events-none select-none"
              style={{
                transformOrigin: '50% 24px',
                transform: isHovered ? 'rotateY(30deg) scale(0.96)' : 'rotateY(0deg) scale(1)',
                opacity: isHovered ? 0 : 1,
                visibility: isHovered ? 'hidden' : 'visible',
                transition: isHovered
                  ? 'transform 0.24s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.16s ease-out, visibility 0s 0.24s'
                  : 'transform 0.32s cubic-bezier(0.2, 0.85, 0.25, 1), opacity 0.24s ease-in, visibility 0s',
              }}
              loading="eager"
              draggable={false}
            />

            {/* Layer 2: Front Facing View (Hover state facing viewer) */}
            <img
              src={garment.angles.front}
              alt={`${garment.name} - Front View`}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              style={{
                transformOrigin: '50% 24px',
                transform: isHovered ? 'rotateY(0deg) scale(1)' : 'rotateY(-30deg) scale(0.96)',
                opacity: isHovered ? 1 : 0,
                visibility: isHovered ? 'visible' : 'hidden',
                transition: isHovered
                  ? 'transform 0.35s cubic-bezier(0.2, 0.85, 0.25, 1), opacity 0.24s ease-in, visibility 0s'
                  : 'transform 0.24s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.16s ease-out, visibility 0s 0.24s',
              }}
              loading="eager"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* ================= EDITORIAL PRODUCT HOVER TAG ================= */}
      <div
        className={`absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1 rounded-full bg-[#141312]/90 backdrop-blur-md border border-white/15 text-white transition-all duration-300 pointer-events-none shadow-xl z-50 flex items-center gap-2 ${
          isHovered
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
        }`}
      >
        <span className="text-[11px] font-medium tracking-wide text-white/90 font-body">
          {garment.name}
        </span>
        <span className="text-white/30 text-[10px]">•</span>
        <span className="text-[11px] font-mono font-medium text-white/80">
          {formatPrice(salePrice(garment.price))}
        </span>
      </div>
    </div>
  );
};
