import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GARMENTS } from '../data/garments';
import { StudioEnvironment } from './StudioEnvironment';
import { ClothingRail } from './ClothingRail';
import { GarmentItem } from './GarmentItem';

interface SceneProps {
  hoveredId: string | null;
  selectedId: string | null;
  inspectRotation: number;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

// Camera controller with subtle mouse parallax and responsive framing
const CameraController: React.FC<{ selectedId: string | null }> = ({ selectedId }) => {
  const { camera, size } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  // Handle pointer move for gentle natural parallax
  React.useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  useFrame((_, delta) => {
    const isMobile = size.width < 768;
    const baseZ = isMobile ? 6.8 : 5.0;
    const baseY = isMobile ? 0.45 : 0.35;

    // Target camera positions
    const targetX = selectedId ? 0 : mouse.current.x * 0.25;
    const targetY = selectedId ? 0.35 : baseY + mouse.current.y * 0.15;
    const targetZ = selectedId ? (isMobile ? 5.2 : 4.6) : baseZ;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 5, delta);

    // Look target
    const lookTarget = new THREE.Vector3(0, selectedId ? 0.15 : 0.2, 0);
    camera.lookAt(lookTarget);
  });

  return null;
};

export const Scene: React.FC<SceneProps> = ({
  hoveredId,
  selectedId,
  inspectRotation,
  onHover,
  onSelect,
}) => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        camera={{ position: [0, 0.35, 5.0], fov: 46, near: 0.1, far: 50 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        onPointerMissed={() => {
          // If clicked outside on background, don't clear unless user desires or clicks away
        }}
      >
        <CameraController selectedId={selectedId} />
        <StudioEnvironment />
        <ClothingRail />

        {/* 10 Streetwear Garments */}
        <group position={[0, 0, 0]}>
          {GARMENTS.map((garment, idx) => (
            <GarmentItem
              key={garment.id}
              garment={garment}
              index={idx}
              totalGarments={GARMENTS.length}
              hoveredId={hoveredId}
              selectedId={selectedId}
              inspectRotation={inspectRotation}
              onHover={onHover}
              onSelect={onSelect}
            />
          ))}
        </group>
      </Canvas>
    </div>
  );
};
