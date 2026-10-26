import React from 'react';
import { ContactShadows } from '@react-three/drei';

export const StudioEnvironment: React.FC = () => {
  return (
    <>
      {/* Background color and studio fog */}
      <color attach="background" args={['#96938e']} />
      <fog attach="fog" args={['#96938e', 9, 22]} />

      {/* Ambient Fill */}
      <ambientLight intensity={1.1} color="#f5f0eb" />

      {/* Main Studio Key Light (Top Left Front) */}
      <directionalLight
        position={[-4.5, 6.0, 5.0]}
        intensity={2.6}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0001}
      />

      {/* Fill Light (Soft Cool Right) */}
      <directionalLight
        position={[4.5, 3.5, 4.0]}
        intensity={1.1}
        color="#e4ecf5"
      />

      {/* Golden Backlight / Rim Light Left (Creates iconic golden rim shine from reference) */}
      <directionalLight
        position={[-3.0, 3.8, -3.2]}
        intensity={3.8}
        color="#ffe2be"
      />

      {/* Golden Backlight / Rim Light Right */}
      <directionalLight
        position={[3.0, 3.8, -3.2]}
        intensity={3.8}
        color="#ffe2be"
      />

      {/* Top Grazing Rim Light */}
      <directionalLight
        position={[0, 5.5, -1.5]}
        intensity={2.2}
        color="#fff6e8"
      />

      {/* Curved Studio Cyclorama Floor */}
      <mesh position={[0, -1.95, -2]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#908c87"
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* Studio Back Wall */}
      <mesh position={[0, 5, -8]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial
          color="#97948f"
          roughness={0.98}
          metalness={0.01}
        />
      </mesh>

      {/* Realistic Soft Contact Shadows on Floor */}
      <ContactShadows
        position={[0, -1.94, 0]}
        opacity={0.75}
        scale={16}
        blur={2.4}
        far={4.5}
        resolution={1024}
        color="#1f1d1b"
      />
    </>
  );
};
