import React, { useRef, useCallback } from 'react';
import { GarmentItemData } from '../types';
import { GarmentCard } from './GarmentCard';

interface HangingRailProps {
  garments: GarmentItemData[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (garment: GarmentItemData) => void;
}

export const HangingRail: React.FC<HangingRailProps> = ({
  garments,
  hoveredId,
  onHover,
  onSelect,
}) => {
  const rackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const hoveredIndex = garments.findIndex((g) => g.id === hoveredId);

  // Pointer tracking across the rack container with hysteresis to eliminate rapid switching and jitter
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === 'touch') return;
      const rack = rackRef.current;
      if (!rack) return;

      const rackRect = rack.getBoundingClientRect();
      const pointerX = e.clientX;
      const pointerY = e.clientY;

      // Vertical bounding check: cursor must be near the rack vertically
      if (pointerY < rackRect.top - 30 || pointerY > rackRect.bottom + 60) {
        if (hoveredId !== null) onHover(null);
        return;
      }

      // Find closest garment slot with hysteresis buffer for current active garment
      let bestIdx = -1;
      let minAdjustedDist = Infinity;
      const HYSTERESIS_BUFFER = 14; // 14px stickiness buffer prevents boundary jitter

      for (let i = 0; i < garments.length; i++) {
        const itemEl = itemRefs.current[i];
        if (!itemEl) continue;

        const itemRect = itemEl.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2;
        const rawDist = Math.abs(pointerX - itemCenterX);

        const isCurrent = garments[i].id === hoveredId;
        const adjustedDist = isCurrent ? rawDist - HYSTERESIS_BUFFER : rawDist;

        if (adjustedDist < minAdjustedDist) {
          minAdjustedDist = adjustedDist;
          bestIdx = i;
        }
      }

      // Check within horizontal activation range (compact 84px slots)
      if (bestIdx !== -1) {
        const itemEl = itemRefs.current[bestIdx];
        if (itemEl) {
          const itemRect = itemEl.getBoundingClientRect();
          const itemCenterX = itemRect.left + itemRect.width / 2;
          const actualDist = Math.abs(pointerX - itemCenterX);

          if (actualDist < 75) {
            const targetId = garments[bestIdx].id;
            if (targetId !== hoveredId) {
              onHover(targetId);
            }
            return;
          }
        }
      }

      // Smoothly reset hover if pointer leaves garment zones
      if (hoveredId !== null) {
        onHover(null);
      }
    },
    [garments, hoveredId, onHover]
  );

  const handlePointerLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  return (
    <div
      ref={rackRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-[960px] mx-auto overflow-x-auto md:overflow-visible scrollbar-none snap-x snap-mandatory md:snap-none select-none touch-pan-x"
    >
      <div className="w-max md:w-full flex flex-col items-center pl-[calc(50vw-126px)] pr-[calc(50vw-42px)] md:px-4">
        {/* ================= HANGING GARMENTS ROW (HANGS DIRECTLY ONTO BACKGROUND ROD) ================= */}
        <div className="relative flex items-start justify-start md:justify-center">
          {garments.map((garment, idx) => {
            const isHovered = hoveredId === garment.id;

            let translateX = 0;
            let zIndex = 20 + idx;

            if (hoveredIndex !== -1) {
              if (isHovered) {
                translateX = 0;
                zIndex = 50;
              } else if (idx < hoveredIndex) {
                // Symmetrical left displacement: creates space for enlarged active garment
                const dist = hoveredIndex - idx;
                const push = Math.round(52 * Math.pow(0.54, dist - 1));
                translateX = -push;
              } else {
                // Symmetrical right displacement: creates space for enlarged active garment
                const dist = idx - hoveredIndex;
                const push = Math.round(52 * Math.pow(0.54, dist - 1));
                translateX = push;
              }
            }

            return (
              <GarmentCard
                key={garment.id}
                garment={garment}
                idx={idx}
                isHovered={isHovered}
                translateX={translateX}
                translateY={0}
                zIndex={zIndex}
                onClick={() => onSelect(garment)}
                setRef={(el) => (itemRefs.current[idx] = el)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
