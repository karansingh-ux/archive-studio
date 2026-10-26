import React, { useRef, useCallback } from 'react';
import { GarmentItemData } from '../data/garments';

interface ClothingRackProps {
  garments: GarmentItemData[];
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

export const ClothingRack: React.FC<ClothingRackProps> = ({
  garments,
  hoveredId,
  selectedId,
  onHover,
  onSelect,
}) => {
  const rackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const hoveredIndex = garments.findIndex((g) => g.id === hoveredId);

  // Pointer tracking across the entire rack for continuous, flicker-free hover detection
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // If an item is locked/selected, disable rack hover tracking
      if (selectedId) return;

      const rack = rackRef.current;
      if (!rack) return;

      const rackRect = rack.getBoundingClientRect();
      const pointerX = e.clientX;
      const pointerY = e.clientY;

      // Vertical bounding check: cursor must be near the clothing rack vertically
      if (pointerY < rackRect.top - 40 || pointerY > rackRect.bottom + 60) {
        if (hoveredId !== null) onHover(null);
        return;
      }

      // Find the closest garment slot to the pointer X coordinate
      let closestIdx = -1;
      let minDistance = Infinity;

      for (let i = 0; i < garments.length; i++) {
        const itemEl = itemRefs.current[i];
        if (!itemEl) continue;

        const itemRect = itemEl.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2;
        const dist = Math.abs(pointerX - itemCenterX);

        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = i;
        }
      }

      // If pointer is reasonably close to a garment slot, activate it
      if (closestIdx !== -1 && minDistance < 140) {
        const targetId = garments[closestIdx].id;
        if (targetId !== hoveredId) {
          onHover(targetId);
        }
      } else {
        if (hoveredId !== null) {
          onHover(null);
        }
      }
    },
    [garments, hoveredId, selectedId, onHover]
  );

  const handlePointerLeave = useCallback(() => {
    if (!selectedId) {
      onHover(null);
    }
  }, [selectedId, onHover]);

  return (
    <div
      ref={rackRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-[1360px] mx-auto px-2 select-none overflow-x-auto md:overflow-visible scrollbar-none"
    >
      {/* Container with minimum width on mobile so 10 items can be swiped smoothly */}
      <div className="min-w-[780px] md:min-w-0 w-full">
        {/* ================= SLEEK CHROME CURVED RAIL SVG ================= */}
        <div className="relative w-full h-12 pointer-events-none z-10">
          <svg
            viewBox="0 0 1200 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="chrome-rail-sleek" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#e0e0e0" />
                <stop offset="70%" stopColor="#777777" />
                <stop offset="100%" stopColor="#222222" />
              </linearGradient>

              <linearGradient id="cable-sleek" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#eaeaea" />
                <stop offset="100%" stopColor="#888888" />
              </linearGradient>
            </defs>

            {/* Left Vertical Suspension Cable */}
            <line
              x1="110"
              y1="-600"
              x2="110"
              y2="14"
              stroke="url(#cable-sleek)"
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
            <rect x="106" y="2" width="8" height="15" rx="1.5" fill="#c0c0c0" stroke="#444" strokeWidth="0.8" />
            <circle cx="110" cy="15" r="3" fill="#ffffff" />

            {/* Right Vertical Suspension Cable */}
            <line
              x1="1090"
              y1="-600"
              x2="1090"
              y2="14"
              stroke="url(#cable-sleek)"
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
            <rect x="1086" y="2" width="8" height="15" rx="1.5" fill="#c0c0c0" stroke="#444" strokeWidth="0.8" />
            <circle cx="1090" cy="15" r="3" fill="#ffffff" />

            {/* Curved Chrome Rail Line (sagging gently in center) */}
            <path
              d="M 50 14 Q 600 36 1150 14"
              stroke="url(#chrome-rail-sleek)"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Top Specular Rim Reflection */}
            <path
              d="M 50 12.5 Q 600 34.5 1150 12.5"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeOpacity="0.9"
              strokeLinecap="round"
            />

            {/* Rail End Caps */}
            <circle cx="50" cy="14" r="4.5" fill="#b0b0b0" stroke="#333" strokeWidth="1" />
            <circle cx="1150" cy="14" r="4.5" fill="#b0b0b0" stroke="#333" strokeWidth="1" />
          </svg>
        </div>

        {/* ================= 10 STREETWEAR GARMENTS ROW ================= */}
        <div className="relative w-full flex items-start justify-center -mt-9">
          {garments.map((garment, idx) => {
            const isHovered = hoveredId === garment.id;
            const isSelected = selectedId === garment.id;

            // Rail sag calculation (so hanger meets the curved rail across all screens)
            const t = idx / (garments.length - 1); // 0 to 1
            const railSagY = Math.sin(t * Math.PI) * 16;

            // Dynamic Horizontal Spread Calculation
            let translateX = 0;
            let translateY = railSagY;
            let scale = 1;
            let rotateY = -12; // Default 3/4 viewing angle for all garments
            let opacity = 1;
            let filter = 'none';
            let zIndex = 20 + idx;

            // 1. IN-PLACE PRODUCT FOCUS STATE
            if (selectedId) {
              if (isSelected) {
                // Center the active garment in-place
                const centerIndex = (garments.length - 1) / 2; // 4.5
                const offsetFromCenter = idx - centerIndex;
                translateX = -offsetFromCenter * 105;
                translateY = railSagY + 10;
                scale = 1.48;
                rotateY = 0;
                zIndex = 100;
                opacity = 1;
                filter = 'drop-shadow(0 35px 45px rgba(0,0,0,0.65))';
              } else {
                scale = 0.88;
                opacity = 0.22;
                filter = 'blur(4px)';
                zIndex = 5;
              }
            }
            // 2. HOVER SPREAD STATE
            else if (hoveredIndex !== -1) {
              if (isHovered) {
                translateX = 0;
                translateY = railSagY - 18;
                scale = 1.24;
                rotateY = 0;
                zIndex = 90;
                opacity = 1;
                filter = 'drop-shadow(0 25px 35px rgba(0,0,0,0.55))';
              } else if (idx < hoveredIndex) {
                // Left neighbours spread left with noticeable breathing gap!
                const dist = hoveredIndex - idx;
                const push = 85 * Math.max(0.2, 1 - (dist - 1) * 0.18);
                translateX = -Math.round(push);
                scale = 0.95;
                rotateY = -16;
                opacity = 0.65;
                filter = 'blur(0.5px)';
              } else {
                // Right neighbours spread right with noticeable breathing gap!
                const dist = idx - hoveredIndex;
                const push = 85 * Math.max(0.2, 1 - (dist - 1) * 0.18);
                translateX = Math.round(push);
                scale = 0.95;
                rotateY = -16;
                opacity = 0.65;
                filter = 'blur(0.5px)';
              }
            }

            return (
              <div
                key={garment.id}
                ref={(el) => (itemRefs.current[idx] = el)}
                className="relative flex-1 min-w-[75px] max-w-[125px] flex flex-col items-center cursor-pointer focus:outline-none"
                style={{
                  zIndex,
                  pointerEvents: selectedId && !isSelected ? 'none' : 'auto',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedId === garment.id) {
                    onSelect('');
                  } else {
                    onSelect(garment.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Select ${garment.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(garment.id);
                  }
                }}
              >
                {/* Garment Image Canvas with GPU Accelerated Transforms */}
                <div
                  className="relative w-full flex items-center justify-center will-change-transform"
                  style={{
                    transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) perspective(800px) rotateY(${rotateY}deg)`,
                    transformOrigin: 'top center',
                    opacity,
                    filter,
                    transition: 'transform 0.38s cubic-bezier(0.18, 0.85, 0.25, 1), opacity 0.3s ease, filter 0.3s ease',
                  }}
                >
                  <img
                    src={garment.image}
                    alt={garment.name}
                    className="w-full h-auto object-contain pointer-events-none select-none drop-shadow-[0_12px_22px_rgba(0,0,0,0.35)]"
                    loading="eager"
                    draggable={false}
                  />
                </div>

                {/* Hover Floating Product Caption */}
                <div
                  className={`absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium tracking-wide transition-all duration-300 pointer-events-none shadow-2xl z-50 ${
                    isHovered && !selectedId
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
                  }`}
                >
                  <span>{garment.name}</span>
                  <span className="text-white/40 mx-1.5">—</span>
                  <span className="text-amber-300 font-mono font-semibold">{garment.price}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
