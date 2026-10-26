import React, { useMemo } from 'react';
import * as THREE from 'three';

interface HangerProps {
  type?: 'coat' | 'clip';
}

export const Hanger: React.FC<HangerProps> = ({ type = 'coat' }) => {
  // Materials
  const hookMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e8e8e8',
    metalness: 0.96,
    roughness: 0.12,
    envMapIntensity: 1.5,
  }), []);

  const woodMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1918',
    roughness: 0.72,
    metalness: 0.05,
  }), []);

  const brassMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#cbb387',
    metalness: 0.88,
    roughness: 0.25,
  }), []);

  // Hook curve geometry
  const hookCurve = useMemo(() => {
    const curve = new THREE.CurvePath<THREE.Vector3>();
    // Straight vertical stem going up from hanger
    const line1 = new THREE.LineCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.22, 0)
    );
    // Arc curving up and over the rail
    // Rail radius is ~0.04, so hook inner radius is ~0.05
    const arc = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.22, 0),
      new THREE.Vector3(0, 0.35, 0.06),
      new THREE.Vector3(0, 0.35, 0.12)
    );
    const returnArc = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.35, 0.12),
      new THREE.Vector3(0, 0.30, 0.17),
      new THREE.Vector3(0, 0.24, 0.14)
    );
    curve.add(line1);
    curve.add(arc);
    curve.add(returnArc);
    return curve;
  }, []);

  if (type === 'clip') {
    // Pant hanger with horizontal bar and two metallic clips
    return (
      <group position={[0, 0, 0]}>
        {/* Metal Hook */}
        <mesh position={[0, 0.06, 0]}>
          <tubeGeometry args={[hookCurve, 32, 0.008, 12, false]} />
          <primitive object={hookMaterial} attach="material" />
        </mesh>

        {/* Brass collar ring */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.02, 16]} />
          <primitive object={brassMaterial} attach="material" />
        </mesh>

        {/* Horizontal Wooden Bar */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.76, 0.025, 0.02]} />
          <primitive object={woodMaterial} attach="material" />
        </mesh>

        {/* Left Clip */}
        <group position={[-0.22, 0.01, 0]}>
          {/* Clip wire rod */}
          <mesh position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.09, 12]} />
            <primitive object={hookMaterial} attach="material" />
          </mesh>
          {/* Clamp jaws */}
          <mesh position={[0, -0.09, 0]}>
            <boxGeometry args={[0.05, 0.035, 0.025]} />
            <primitive object={hookMaterial} attach="material" />
          </mesh>
          <mesh position={[0, -0.09, 0.014]}>
            <boxGeometry args={[0.042, 0.025, 0.006]} />
            <primitive object={woodMaterial} attach="material" />
          </mesh>
        </group>

        {/* Right Clip */}
        <group position={[0.22, 0.01, 0]}>
          {/* Clip wire rod */}
          <mesh position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.09, 12]} />
            <primitive object={hookMaterial} attach="material" />
          </mesh>
          {/* Clamp jaws */}
          <mesh position={[0, -0.09, 0]}>
            <boxGeometry args={[0.05, 0.035, 0.025]} />
            <primitive object={hookMaterial} attach="material" />
          </mesh>
          <mesh position={[0, -0.09, 0.014]}>
            <boxGeometry args={[0.042, 0.025, 0.006]} />
            <primitive object={woodMaterial} attach="material" />
          </mesh>
        </group>
      </group>
    );
  }

  // Standard Coat / Jacket Hanger
  return (
    <group position={[0, 0, 0]}>
      {/* Metal Hook */}
      <mesh position={[0, 0.06, 0]}>
        <tubeGeometry args={[hookCurve, 32, 0.008, 12, false]} />
        <primitive object={hookMaterial} attach="material" />
      </mesh>

      {/* Brass ferrule */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.018, 16]} />
        <primitive object={brassMaterial} attach="material" />
      </mesh>

      {/* Central neck block */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.1, 0.05, 0.032]} />
        <primitive object={woodMaterial} attach="material" />
      </mesh>

      {/* Subtle brand tag plate */}
      <mesh position={[0, 0.03, 0.017]}>
        <boxGeometry args={[0.06, 0.02, 0.002]} />
        <primitive object={brassMaterial} attach="material" />
      </mesh>

      {/* Left Sloped Arm */}
      <mesh position={[-0.24, -0.035, 0]} rotation={[0, 0, 0.32]}>
        <boxGeometry args={[0.42, 0.035, 0.032]} />
        <primitive object={woodMaterial} attach="material" />
      </mesh>

      {/* Right Sloped Arm */}
      <mesh position={[0.24, -0.035, 0]} rotation={[0, 0, -0.32]}>
        <boxGeometry args={[0.42, 0.035, 0.032]} />
        <primitive object={woodMaterial} attach="material" />
      </mesh>
    </group>
  );
};
