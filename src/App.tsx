import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GARMENTS } from './data/garments';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { ProductModal } from './components/ProductModal';
import { sfx } from './utils/audio';
import { Volume2, VolumeX } from 'lucide-react';

export default function App() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inspectRotation, setInspectRotation] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Active selected garment
  const selectedGarment = useMemo(() => {
    return GARMENTS.find((g) => g.id === selectedId) || null;
  }, [selectedId]);

  // Entrance timing
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // Sync sound settings
  useEffect(() => {
    sfx.enabled = soundEnabled;
  }, [soundEnabled]);

  // Hover handler with sound feedback
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
    setInspectRotation(0);
    sfx.playSelect();
  }, []);

  // Close inspection
  const handleClose = useCallback(() => {
    setSelectedId(null);
    setInspectRotation(0);
    sfx.playWhoosh();
  }, []);

  // Previous garment in collection
  const handlePrevGarment = useCallback(() => {
    if (!selectedId) return;
    const currentIndex = GARMENTS.findIndex((g) => g.id === selectedId);
    const prevIndex = (currentIndex - 1 + GARMENTS.length) % GARMENTS.length;
    setSelectedId(GARMENTS[prevIndex].id);
    setInspectRotation(0);
    sfx.playSelect();
  }, [selectedId]);

  // Next garment in collection
  const handleNextGarment = useCallback(() => {
    if (!selectedId) return;
    const currentIndex = GARMENTS.findIndex((g) => g.id === selectedId);
    const nextIndex = (currentIndex + 1) % GARMENTS.length;
    setSelectedId(GARMENTS[nextIndex].id);
    setInspectRotation(0);
    sfx.playSelect();
  }, [selectedId]);

  // Keyboard accessibility navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        if (selectedId) handlePrevGarment();
      } else if (e.key === 'ArrowRight') {
        if (selectedId) handleNextGarment();
      } else if (e.key === ' ' || e.code === 'Space') {
        if (selectedId) {
          e.preventDefault();
          setInspectRotation((prev) => (Math.abs(prev) < 0.2 ? Math.PI : 0));
          sfx.playWhoosh();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, handleClose, handlePrevGarment, handleNextGarment]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#96938e] select-none font-sans">
      {/* 3D Scene Viewport */}
      <Scene
        hoveredId={hoveredId}
        selectedId={selectedId}
        inspectRotation={inspectRotation}
        onHover={handleHover}
        onSelect={handleSelect}
      />

      {/* Main UI Overlay (Header, Title, Bottom Bar, Slide Menu) */}
      <UIOverlay
        selectedId={selectedId}
        onSelectShopNow={() => handleSelect('varsity-jacket')}
      />

      {/* Focused Product Inspection Modal */}
      {selectedGarment && (
        <ProductModal
          garment={selectedGarment}
          inspectRotation={inspectRotation}
          onSetRotation={setInspectRotation}
          onClose={handleClose}
          onPrev={handlePrevGarment}
          onNext={handleNextGarment}
        />
      )}

      {/* Audio Mute Toggle at Top Center */}
      <div className="absolute top-7 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/25 hover:bg-black/50 text-white/70 hover:text-white backdrop-blur-md border border-white/10 text-[11px] tracking-wider transition-all duration-300"
          title={soundEnabled ? 'Mute Audio Effects' : 'Enable Audio Effects'}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono">AUDIO ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-white/40" />
              <span className="hidden sm:inline font-mono text-white/40">AUDIO MUTED</span>
            </>
          )}
        </button>
      </div>

      {/* Initial cinematic fade-in curtain */}
      <div
        className={`fixed inset-0 bg-[#96938e] pointer-events-none transition-opacity duration-1000 z-50 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </main>
  );
}
