import React from 'react';
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
  const hoveredIndex = garments.findIndex((g) => g.id === hoveredId);

  return (
    <div className="relative w-full max-w-[1400px] mx-auto px-2 md:px-6 select-none">
      {/* ================= REFINED METALLIC CLOTHING RAIL ================= */}
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
              <stop offset="35%" stopColor="#d1d1d1" />
              <stop offset="70%" stopColor="#666666" />
              <stop offset="100%" stopColor="#333333" />
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
          {/* Left Hardware Fitting */}
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
          {/* Right Hardware Fitting */}
          <rect x="1086" y="2" width="8" height="15" rx="1.5" fill="#c0c0c0" stroke="#444" strokeWidth="0.8" />
          <circle cx="1090" cy="15" r="3" fill="#ffffff" />

          {/* Sleek Curved Chrome Rail Line */}
          <path
            d="M 50 14 Q 600 36 1150 14"
            stroke="url(#chrome-rail-sleek)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Subtle Top Specular Shine */}
          <path
            d="M 50 12.5 Q 600 34.5 1150 12.5"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeOpacity="0.9"
            strokeLinecap="round"
          />

          {/* End Caps */}
          <circle cx="50" cy="14" r="4.5" fill="#b0b0b0" stroke="#333" strokeWidth="1" />
          <circle cx="1150" cy="14" r="4.5" fill="#b0b0b0" stroke="#333" strokeWidth="1" />
        </svg>
      </div>

      {/* ================= 10 STREETWEAR GARMENTS ROW ================= */}
      <div
        className="relative w-full flex items-start justify-center -mt-9"
        onMouseLeave={() => onHover(null)}
      >
        {garments.map((garment, idx) => {
          const isHovered = hoveredId === garment.id;
          const isSelected = selectedId === garment.id;

          // Compute gentle downward catenary sag so hanger hook meets the curved rail
          // Rail dips by approx 18px at center
          const t = idx / (garments.length - 1); // 0 to 1
          const railSagY = Math.sin(t * Math.PI) * 16;

          // Spread calculation
          let translateX = 0;
          let scale = 1;
          let opacity = 1;
          let filter = 'none';
          let zIndex = 20 + idx;

          if (hoveredIndex !== -1) {
            if (isHovered) {
              translateX = 0;
              scale = 1.16;
              zIndex = 80;
              opacity = 1;
              filter = 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))';
            } else if (idx < hoveredIndex) {
              // Garments to the left push left
              const dist = hoveredIndex - idx;
              translateX = -Math.round(42 / Math.sqrt(dist));
              scale = 0.96;
              opacity = 0.65;
              filter = 'blur(0.5px)';
            } else {
              // Garments to the right push right
              const dist = idx - hoveredIndex;
              translateX = Math.round(42 / Math.sqrt(dist));
              scale = 0.96;
              opacity = 0.65;
              filter = 'blur(0.5px)';
            }
          }

          // Initial 3/4 viewing angle for all garments (including far-left jacket corrected!)
          const rotateY = isHovered ? 0 : -10;

          return (
            <div
              key={garment.id}
              className="relative flex-1 max-w-[130px] flex flex-col items-center group cursor-pointer focus:outline-none -mx-1 sm:-mx-2"
              style={{
                zIndex: isHovered ? 80 : zIndex,
                transition: 'all 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: `translateX(${translateX}px) translateY(${railSagY + (isHovered ? -12 : 0)}px) scale(${scale})`,
                opacity: selectedId && !isSelected ? 0.2 : opacity,
                filter: filter,
              }}
              onMouseEnter={() => onHover(garment.id)}
              onClick={() => onSelect(garment.id)}
              tabIndex={0}
              role="button"
              aria-label={`Inspect ${garment.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(garment.id);
                }
              }}
            >
              {/* Garment Image */}
              <div
                className="relative w-full transition-transform duration-500 ease-out flex items-center justify-center"
                style={{
                  transform: `perspective(700px) rotateY(${rotateY}deg)`,
                  transformOrigin: 'top center',
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

              {/* Floating Product Name & Price on Hover (replicates frame 005 from reference video!) */}
              <div
                className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium tracking-wide transition-all duration-300 pointer-events-none shadow-2xl ${
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
  );
};
