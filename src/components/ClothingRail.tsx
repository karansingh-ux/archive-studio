import React, { useMemo } from 'react';
import * as THREE from 'three';

export const RAIL_HALF_WIDTH = 3.3;
export const RAIL_SAG = 0.22;
export const RAIL_CENTER_Y = 0.72;

/**
 * Returns 3D coordinate along the rail given normalized offset (-1 to 1) or world X
 */
export function getRailTransform(railOffset: number) {
  // Normalize t between -1 and 1
  const t = Math.max(-1, Math.min(1, railOffset / RAIL_HALF_WIDTH));
  const x = t * RAIL_HALF_WIDTH;
  const y = RAIL_CENTER_Y + RAIL_SAG * Math.pow(t, 2);
  const z = -0.05 * Math.sin(t * Math.PI); // subtle Z depth curve
  const slope = (2 * RAIL_SAG * t) / RAIL_HALF_WIDTH;
  const angleZ = Math.atan(slope);

  return { x, y, z, angleZ };
}

export const ClothingRail: React.FC = () => {
  // Metallic chrome material with high reflectivity
  const chromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f0f0f0',
    metalness: 0.98,
    roughness: 0.12,
    envMapIntensity: 2.0,
  }), []);

  const cableMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8c8c8c',
    metalness: 0.9,
    roughness: 0.3,
  }), []);

  const brassFittingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d4af37',
    metalness: 0.85,
    roughness: 0.25,
  }), []);

  // Generate 3D curved rail tube geometry
  const railCurve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const t = -1 + (i / segments) * 2;
      const { x, y, z } = getRailTransform(t * RAIL_HALF_WIDTH);
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // Cable anchor positions
  const leftCableTransform = getRailTransform(-2.85);
  const rightCableTransform = getRailTransform(2.85);
  const ceilingY = 5.0;

  return (
    <group position={[0, 0, 0]}>
      {/* Main Curved Chrome Rail */}
      <mesh castShadow receiveShadow>
        <tubeGeometry args={[railCurve, 64, 0.024, 16, false]} />
        <primitive object={chromeMaterial} attach="material" />
      </mesh>

      {/* Left End Cap & Collar */}
      {(() => {
        const leftEnd = getRailTransform(-RAIL_HALF_WIDTH);
        return (
          <group position={[leftEnd.x, leftEnd.y, leftEnd.z]} rotation={[0, 0, leftEnd.angleZ]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.032, 0.032, 0.08, 24]} />
              <primitive object={chromeMaterial} attach="material" />
            </mesh>
            <mesh position={[-0.045, 0, 0]} castShadow>
              <sphereGeometry args={[0.032, 24, 24]} />
              <primitive object={brassFittingMaterial} attach="material" />
            </mesh>
          </group>
        );
      })()}

      {/* Right End Cap & Collar */}
      {(() => {
        const rightEnd = getRailTransform(RAIL_HALF_WIDTH);
        return (
          <group position={[rightEnd.x, rightEnd.y, rightEnd.z]} rotation={[0, 0, rightEnd.angleZ]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.032, 0.032, 0.08, 24]} />
              <primitive object={chromeMaterial} attach="material" />
            </mesh>
            <mesh position={[0.045, 0, 0]} castShadow>
              <sphereGeometry args={[0.032, 24, 24]} />
              <primitive object={brassFittingMaterial} attach="material" />
            </mesh>
          </group>
        );
      })()}

      {/* Left Suspension Cable & Hardware */}
      <group position={[leftCableTransform.x, leftCableTransform.y, leftCableTransform.z]}>
        {/* Cable wire up to ceiling */}
        <mesh position={[0, (ceilingY - leftCableTransform.y) / 2, 0]} castShadow>
          <cylinderGeometry args={[0.003, 0.003, ceilingY - leftCableTransform.y, 12]} />
          <primitive object={cableMaterial} attach="material" />
        </mesh>
        {/* Rail Clamp Fitting */}
        <mesh position={[0, 0.03, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 16]} />
          <primitive object={chromeMaterial} attach="material" />
        </mesh>
        {/* Turnbuckle tensioner */}
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.18, 16]} />
          <primitive object={brassFittingMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.27, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.04, 16]} />
          <primitive object={chromeMaterial} attach="material" />
        </mesh>
      </group>

      {/* Right Suspension Cable & Hardware */}
      <group position={[rightCableTransform.x, rightCableTransform.y, rightCableTransform.z]}>
        {/* Cable wire up to ceiling */}
        <mesh position={[0, (ceilingY - rightCableTransform.y) / 2, 0]} castShadow>
          <cylinderGeometry args={[0.003, 0.003, ceilingY - rightCableTransform.y, 12]} />
          <primitive object={cableMaterial} attach="material" />
        </mesh>
        {/* Rail Clamp Fitting */}
        <mesh position={[0, 0.03, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 16]} />
          <primitive object={chromeMaterial} attach="material" />
        </mesh>
        {/* Turnbuckle tensioner */}
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.18, 16]} />
          <primitive object={brassFittingMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.27, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.04, 16]} />
          <primitive object={chromeMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  );
};
