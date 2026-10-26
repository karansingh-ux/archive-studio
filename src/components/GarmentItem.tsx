import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GarmentData } from '../types';
import { Hanger } from './Hanger';
import { ProceduralGarment } from './ProceduralGarment';
import { useGarmentModel } from '../hooks/useGarmentModel';
import { getRailTransform } from './ClothingRail';

interface GarmentItemProps {
  garment: GarmentData;
  index: number;
  totalGarments: number;
  hoveredId: string | null;
  selectedId: string | null;
  inspectRotation: number;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

// Initial 3/4 viewing angle for all garments matching the reference image
const DEFAULT_ROT_Y = -0.38;

export const GarmentItem: React.FC<GarmentItemProps> = ({
  garment,
  index,
  totalGarments,
  hoveredId,
  selectedId,
  inspectRotation,
  onHover,
  onSelect,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const innerGarmentRef = useRef<THREE.Group>(null);

  // Check for GLB model asset
  const { scene: customModelScene, hasCustomModel } = useGarmentModel(garment.id);

  // Base rail placement
  const railPos = useMemo(() => getRailTransform(garment.railOffset), [garment.railOffset]);

  // Track animated state smoothly without React re-renders
  const anim = useRef({
    x: railPos.x,
    y: railPos.y,
    z: railPos.z,
    rotY: DEFAULT_ROT_Y,
    rotX: 0,
    rotZ: railPos.angleZ,
    scale: 1,
    hangerTilt: railPos.angleZ,
  });

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Dampening factor (time-independent smoothing)
    const factor = Math.min(1, delta * 8.5);

    const isHovered = hoveredId === garment.id;
    const isSelected = selectedId === garment.id;
    const hasSelection = selectedId !== null;

    let targetX = railPos.x;
    let targetY = railPos.y;
    let targetZ = railPos.z;
    let targetRotY = DEFAULT_ROT_Y;
    let targetRotX = 0;
    let targetRotZ = railPos.angleZ;
    let targetScale = 1.0;

    if (isSelected) {
      // Focused / Inspection presentation mode
      targetX = 0;
      targetY = 0.15;
      targetZ = 2.1;
      targetRotY = inspectRotation;
      targetRotX = 0;
      targetRotZ = 0;
      targetScale = 1.32;
    } else if (hasSelection) {
      // Another garment is currently inspected; push back subtly
      targetZ = railPos.z - 0.7;
      targetScale = 0.88;
      targetRotY = DEFAULT_ROT_Y;
    } else {
      // Default rail state or hover spread state
      if (hoveredId) {
        if (isHovered) {
          // Hovered garment moves forward, rotates towards camera, scales up subtly
          targetZ = railPos.z + 0.38;
          targetY = railPos.y + 0.05;
          targetRotY = 0.02; // facing front with subtle angle
          targetScale = 1.08;
          targetRotX = -0.04;
        } else {
          // Neighbour garments spread outward naturally
          // Find index of hovered garment
          const hoveredIndex = (totalGarments - 1) * ((garment.railOffset + 2.7) / 5.4); // approx or pass index
          const offsetDist = garment.railOffset;
          const isLeft = garment.railOffset < 0;

          // Spread magnitude decreases with distance from hovered garment
          const spreadFactor = 0.22;
          if (hoveredId) {
            // Determine whether this item is to the left or right of the hovered item
            // We use railOffset relative to the hovered item's railOffset
            const hoveredOffset = getHoveredOffset(hoveredId);
            const dist = garment.railOffset - hoveredOffset;

            if (Math.abs(dist) > 0.01) {
              const dir = Math.sign(dist);
              const push = (spreadFactor / (Math.abs(dist) * 0.9 + 0.4)) * dir;
              targetX = railPos.x + push;
            }
          }
        }
      }
    }

    // Smoothly damp current transforms to target transforms
    anim.current.x = THREE.MathUtils.damp(anim.current.x, targetX, 10, delta);
    anim.current.y = THREE.MathUtils.damp(anim.current.y, targetY, 10, delta);
    anim.current.z = THREE.MathUtils.damp(anim.current.z, targetZ, 10, delta);
    anim.current.rotY = THREE.MathUtils.damp(anim.current.rotY, targetRotY, 10, delta);
    anim.current.rotX = THREE.MathUtils.damp(anim.current.rotX, targetRotX, 10, delta);
    anim.current.rotZ = THREE.MathUtils.damp(anim.current.rotZ, targetRotZ, 10, delta);
    anim.current.scale = THREE.MathUtils.damp(anim.current.scale, targetScale, 10, delta);

    groupRef.current.position.set(anim.current.x, anim.current.y, anim.current.z);
    groupRef.current.rotation.set(anim.current.rotX, anim.current.rotY, anim.current.rotZ);
    groupRef.current.scale.setScalar(anim.current.scale);
  });

  return (
    <group
      ref={groupRef}
      position={[railPos.x, railPos.y, railPos.z]}
      rotation={[0, DEFAULT_ROT_Y, railPos.angleZ]}
    >
      {/* Invisible Raycast Hit Box for ultra-stable, smooth hover detection without jitter */}
      <mesh
        position={[0, -0.48, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(garment.id);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(garment.id);
        }}
        visible={false}
      >
        <boxGeometry args={[0.75, 1.25, 0.45]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Physical Hanger */}
      <Hanger type={garment.hangerType} />

      {/* Garment Mesh (either custom loaded GLB or high-detail Procedural Model) */}
      <group ref={innerGarmentRef} position={[0, -0.02, 0]}>
        {hasCustomModel && customModelScene ? (
          <primitive object={customModelScene.clone()} />
        ) : (
          <ProceduralGarment garment={garment} />
        )}
      </group>
    </group>
  );
};

// Helper to look up the railOffset of any garment by id
function getHoveredOffset(id: string): number {
  const map: Record<string, number> = {
    'varsity-jacket': -2.7,
    'heavyweight-hoodie-oatmeal': -2.1,
    'piped-pullover-navy': -1.5,
    'chunky-knit-burgundy': -0.9,
    'mohair-striped-cardigan': -0.3,
    'washed-field-jacket': 0.3,
    'wide-leg-denim': 0.9,
    'chore-work-jacket': 1.5,
    'fleece-hoodie-heather': 2.1,
    'shadow-plaid-overshirt': 2.7,
  };
  return map[id] ?? 0;
}
