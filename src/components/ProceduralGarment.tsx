import React, { useMemo } from 'react';
import * as THREE from 'three';
import { GarmentData } from '../types';
import {
  getPlaidTexture,
  getMohairStripeTexture,
  getDenimTexture,
  getRibbedTexture,
  getFabricBumpTexture
} from '../utils/textureGenerator';

interface ProceduralGarmentProps {
  garment: GarmentData;
}

export const ProceduralGarment: React.FC<ProceduralGarmentProps> = ({ garment }) => {
  // Common textures
  const fabricBump = useMemo(() => getFabricBumpTexture(), []);
  const ribbedTexture = useMemo(() => getRibbedTexture(), []);
  const plaidTexture = useMemo(() => getPlaidTexture(), []);
  const mohairTexture = useMemo(() => getMohairStripeTexture(), []);
  const denimTexture = useMemo(() => getDenimTexture(), []);

  // Base materials with custom cloth properties
  const bodyMaterial = useMemo(() => {
    let map: THREE.Texture | null = null;
    let color = garment.colorHex;

    if (garment.type === 'flannel') {
      map = plaidTexture;
    } else if (garment.type === 'cardigan') {
      map = mohairTexture;
    } else if (garment.type === 'denim') {
      map = denimTexture;
    }

    return new THREE.MeshStandardMaterial({
      color: map ? '#ffffff' : color,
      map: map,
      bumpMap: fabricBump,
      bumpScale: 0.003,
      roughness: garment.type === 'denim' ? 0.88 : garment.type === 'cardigan' ? 0.95 : 0.82,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });
  }, [garment, fabricBump, plaidTexture, mohairTexture, denimTexture]);

  const secondaryMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: garment.secondaryColorHex || '#ffffff',
      roughness: garment.type === 'varsity' ? 0.55 : 0.85, // leather sheen for varsity sleeves!
      metalness: garment.type === 'varsity' ? 0.12 : 0.02,
      bumpMap: fabricBump,
      bumpScale: 0.002,
    });
  }, [garment, fabricBump]);

  const ribbingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: garment.type === 'varsity' ? '#1B382B' : garment.colorHex,
      bumpMap: ribbedTexture,
      bumpScale: 0.015,
      roughness: 0.9,
    });
  }, [garment, ribbedTexture]);

  const contrastAccentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: garment.accentColorHex || '#ffffff',
      roughness: 0.4,
      metalness: 0.6,
    });
  }, [garment]);

  const buttonMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: garment.type === 'field_jacket' ? '#7A6B53' : '#e6e6e6',
      metalness: 0.85,
      roughness: 0.25,
    });
  }, [garment]);

  // Render specific garment silhouette
  switch (garment.type) {
    case 'varsity':
      return (
        <group position={[0, -0.05, 0]}>
          {/* Main Wool Body */}
          <mesh position={[0, -0.42, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.34, 0.38, 0.74, 32, 1, false]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          {/* Front Snap Placket */}
          <mesh position={[0, -0.42, 0.19]} castShadow>
            <boxGeometry args={[0.07, 0.72, 0.02]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          {/* Snap Buttons */}
          {[-0.15, -0.3, -0.45, -0.6].map((y, idx) => (
            <mesh key={idx} position={[0, y, 0.202]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.006, 16]} />
              <primitive object={buttonMaterial} attach="material" />
            </mesh>
          ))}

          {/* Left Chest Chainstitch 'M' emblem */}
          <group position={[-0.14, -0.32, 0.195]}>
            <mesh rotation={[0, 0, 0]}>
              <ringGeometry args={[0.035, 0.055, 32]} />
              <primitive object={contrastAccentMaterial} attach="material" />
            </mesh>
            <mesh position={[0.02, -0.04, 0]} rotation={[0, 0, -0.4]}>
              <boxGeometry args={[0.015, 0.08, 0.005]} />
              <primitive object={contrastAccentMaterial} attach="material" />
            </mesh>
          </group>

          {/* Leather Double-Welt Pockets */}
          <mesh position={[-0.18, -0.56, 0.18]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.13, 0.025, 0.015]} />
            <primitive object={secondaryMaterial} attach="material" />
          </mesh>
          <mesh position={[0.18, -0.56, 0.18]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.13, 0.025, 0.015]} />
            <primitive object={secondaryMaterial} attach="material" />
          </mesh>

          {/* Left Leather Sleeve */}
          <group position={[-0.34, -0.22, 0]} rotation={[0, 0, 0.28]}>
            <mesh position={[-0.1, -0.26, 0.04]} rotation={[0, 0, 0.18]} castShadow>
              <cylinderGeometry args={[0.15, 0.12, 0.58, 24]} />
              <primitive object={secondaryMaterial} attach="material" />
            </mesh>
            {/* Striped Cuff */}
            <mesh position={[-0.16, -0.56, 0.06]}>
              <cylinderGeometry args={[0.115, 0.11, 0.09, 24]} />
              <primitive object={ribbingMaterial} attach="material" />
            </mesh>
          </group>

          {/* Right Leather Sleeve */}
          <group position={[0.34, -0.22, 0]} rotation={[0, 0, -0.28]}>
            <mesh position={[0.1, -0.26, 0.04]} rotation={[0, 0, -0.18]} castShadow>
              <cylinderGeometry args={[0.15, 0.12, 0.58, 24]} />
              <primitive object={secondaryMaterial} attach="material" />
            </mesh>
            {/* Striped Cuff */}
            <mesh position={[0.16, -0.56, 0.06]}>
              <cylinderGeometry args={[0.115, 0.11, 0.09, 24]} />
              <primitive object={ribbingMaterial} attach="material" />
            </mesh>
          </group>

          {/* Striped Ribbed Baseball Collar */}
          <mesh position={[0, -0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.18, 0.038, 16, 32, Math.PI * 1.5]} />
            <primitive object={ribbingMaterial} attach="material" />
          </mesh>

          {/* Striped Ribbed Bottom Hem */}
          <mesh position={[0, -0.79, 0]}>
            <cylinderGeometry args={[0.36, 0.35, 0.08, 32]} />
            <primitive object={ribbingMaterial} attach="material" />
          </mesh>
        </group>
      );

    case 'hoodie':
    case 'grey_hoodie':
      return (
        <group position={[0, -0.05, 0]}>
          {/* Main Fleece Torso */}
          <mesh position={[0, -0.45, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.36, 0.40, 0.76, 32, 1, false]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          {/* Draped 3D Hood around the neck & back */}
          <group position={[0, -0.02, -0.02]}>
            {/* Back cowl */}
            <mesh position={[0, 0.05, -0.12]} rotation={[-0.45, 0, 0]} castShadow>
              <sphereGeometry args={[0.22, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
            {/* Front hood fold collar */}
            <mesh position={[0, 0.01, 0.11]} rotation={[0.4, 0, 0]}>
              <torusGeometry args={[0.16, 0.045, 16, 32, Math.PI * 1.2]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
          </group>

          {/* Kangaroo Pocket */}
          <mesh position={[0, -0.56, 0.21]} rotation={[-0.05, 0, 0]} castShadow>
            <boxGeometry args={[0.38, 0.22, 0.045]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          {/* Dropped Left Sleeve */}
          <group position={[-0.37, -0.22, 0]} rotation={[0, 0, 0.25]}>
            <mesh position={[-0.1, -0.28, 0.03]} rotation={[0, 0, 0.16]} castShadow>
              <cylinderGeometry args={[0.16, 0.13, 0.62, 24]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
            <mesh position={[-0.16, -0.6, 0.04]}>
              <cylinderGeometry args={[0.12, 0.11, 0.08, 24]} />
              <primitive object={ribbingMaterial} attach="material" />
            </mesh>
          </group>

          {/* Dropped Right Sleeve */}
          <group position={[0.37, -0.22, 0]} rotation={[0, 0, -0.25]}>
            <mesh position={[0.1, -0.28, 0.03]} rotation={[0, 0, -0.16]} castShadow>
              <cylinderGeometry args={[0.16, 0.13, 0.62, 24]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
            <mesh position={[0.16, -0.6, 0.04]}>
              <cylinderGeometry args={[0.12, 0.11, 0.08, 24]} />
              <primitive object={ribbingMaterial} attach="material" />
            </mesh>
          </group>

          {/* Ribbed Bottom Waist Hem */}
          <mesh position={[0, -0.84, 0]}>
            <cylinderGeometry args={[0.38, 0.36, 0.09, 32]} />
            <primitive object={ribbingMaterial} attach="material" />
          </mesh>
        </group>
      );

    case 'crewneck':
      return (
        <group position={[0, -0.05, 0]}>
          {/* Main Knit Body */}
          <mesh position={[0, -0.44, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.34, 0.37, 0.74, 32, 1, false]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          {/* Piping detail if applicable (Navy pullover) */}
          {garment.pattern === 'piping' && (
            <>
              {/* Front vertical subtle piping line */}
              <mesh position={[-0.08, -0.44, 0.188]}>
                <cylinderGeometry args={[0.004, 0.004, 0.7, 12]} />
                <primitive object={contrastAccentMaterial} attach="material" />
              </mesh>
              <mesh position={[0.08, -0.44, 0.188]}>
                <cylinderGeometry args={[0.004, 0.004, 0.7, 12]} />
                <primitive object={contrastAccentMaterial} attach="material" />
              </mesh>
            </>
          )}

          {/* Left Sleeve */}
          <group position={[-0.35, -0.21, 0]} rotation={[0, 0, 0.26]}>
            <mesh position={[-0.09, -0.26, 0.02]} rotation={[0, 0, 0.16]} castShadow>
              <cylinderGeometry args={[0.15, 0.12, 0.58, 24]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
            <mesh position={[-0.15, -0.56, 0.03]}>
              <cylinderGeometry args={[0.115, 0.105, 0.08, 24]} />
              <primitive object={ribbingMaterial} attach="material" />
            </mesh>
          </group>

          {/* Right Sleeve */}
          <group position={[0.35, -0.21, 0]} rotation={[0, 0, -0.26]}>
            <mesh position={[0.09, -0.26, 0.02]} rotation={[0, 0, -0.16]} castShadow>
              <cylinderGeometry args={[0.15, 0.12, 0.58, 24]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
            <mesh position={[0.15, -0.56, 0.03]}>
              <cylinderGeometry args={[0.115, 0.105, 0.08, 24]} />
              <primitive object={ribbingMaterial} attach="material" />
            </mesh>
          </group>

          {/* Ribbed Collar */}
          <mesh position={[0, -0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.16, 0.036, 16, 32]} />
            <primitive object={ribbingMaterial} attach="material" />
          </mesh>

          {/* Ribbed Hem */}
          <mesh position={[0, -0.81, 0]}>
            <cylinderGeometry args={[0.36, 0.35, 0.08, 32]} />
            <primitive object={ribbingMaterial} attach="material" />
          </mesh>
        </group>
      );

    case 'cardigan':
      return (
        <group position={[0, -0.05, 0]}>
          {/* Cardigan Body with Brushed Mohair Stripes */}
          <mesh position={[0, -0.45, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.34, 0.38, 0.76, 32, 1, false]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          {/* Center Button Placket */}
          <mesh position={[0, -0.46, 0.19]} castShadow>
            <boxGeometry args={[0.06, 0.72, 0.02]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          {/* Corozo Nut Buttons */}
          {[-0.22, -0.38, -0.54, -0.7].map((y, idx) => (
            <mesh key={idx} position={[0, y, 0.203]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.014, 0.014, 0.007, 16]} />
              <primitive object={buttonMaterial} attach="material" />
            </mesh>
          ))}

          {/* V-Neck Fold Trim */}
          <mesh position={[-0.08, -0.16, 0.17]} rotation={[0, 0, -0.45]}>
            <boxGeometry args={[0.04, 0.24, 0.015]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>
          <mesh position={[0.08, -0.16, 0.17]} rotation={[0, 0, 0.45]}>
            <boxGeometry args={[0.04, 0.24, 0.015]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          {/* Fuzzy Mohair Left Sleeve */}
          <group position={[-0.34, -0.22, 0]} rotation={[0, 0, 0.26]}>
            <mesh position={[-0.1, -0.26, 0.02]} rotation={[0, 0, 0.16]} castShadow>
              <cylinderGeometry args={[0.16, 0.13, 0.58, 24]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
            <mesh position={[-0.16, -0.56, 0.03]}>
              <cylinderGeometry args={[0.12, 0.11, 0.08, 24]} />
              <primitive object={ribbingMaterial} attach="material" />
            </mesh>
          </group>

          {/* Fuzzy Mohair Right Sleeve */}
          <group position={[0.34, -0.22, 0]} rotation={[0, 0, -0.26]}>
            <mesh position={[0.1, -0.26, 0.02]} rotation={[0, 0, -0.16]} castShadow>
              <cylinderGeometry args={[0.16, 0.13, 0.58, 24]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
            <mesh position={[0.16, -0.56, 0.03]}>
              <cylinderGeometry args={[0.12, 0.11, 0.08, 24]} />
              <primitive object={ribbingMaterial} attach="material" />
            </mesh>
          </group>

          {/* Ribbed Bottom Hem */}
          <mesh position={[0, -0.83, 0]}>
            <cylinderGeometry args={[0.37, 0.35, 0.08, 32]} />
            <primitive object={ribbingMaterial} attach="material" />
          </mesh>
        </group>
      );

    case 'field_jacket':
    case 'chore_coat':
    case 'flannel':
      const hasContrastCollar = garment.type === 'chore_coat';
      return (
        <group position={[0, -0.05, 0]}>
          {/* Main Structured Torso */}
          <mesh position={[0, -0.46, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.34, 0.38, 0.76, 32, 1, false]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          {/* Pointed Shirt/Workwear Collar */}
          <group position={[0, -0.06, 0.02]}>
            <mesh position={[-0.1, 0.01, 0.1]} rotation={[0.4, 0, 0.3]}>
              <boxGeometry args={[0.14, 0.07, 0.02]} />
              <primitive object={hasContrastCollar ? contrastAccentMaterial : bodyMaterial} attach="material" />
            </mesh>
            <mesh position={[0.1, 0.01, 0.1]} rotation={[0.4, 0, -0.3]}>
              <boxGeometry args={[0.14, 0.07, 0.02]} />
              <primitive object={hasContrastCollar ? contrastAccentMaterial : bodyMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0.01, -0.14]} rotation={[-0.2, 0, 0]}>
              <boxGeometry args={[0.26, 0.06, 0.02]} />
              <primitive object={hasContrastCollar ? contrastAccentMaterial : bodyMaterial} attach="material" />
            </mesh>
          </group>

          {/* Front Button / Snap Placket */}
          <mesh position={[0, -0.47, 0.19]} castShadow>
            <boxGeometry args={[0.07, 0.74, 0.018]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          {/* Metallic or Horn Buttons */}
          {[-0.18, -0.32, -0.46, -0.6, -0.74].map((y, idx) => (
            <mesh key={idx} position={[0, y, 0.203]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.007, 16]} />
              <primitive object={buttonMaterial} attach="material" />
            </mesh>
          ))}

          {/* 3D Gusseted Chest Flap Pockets */}
          <mesh position={[-0.16, -0.32, 0.195]} castShadow>
            <boxGeometry args={[0.15, 0.16, 0.03]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>
          <mesh position={[0.16, -0.32, 0.195]} castShadow>
            <boxGeometry args={[0.15, 0.16, 0.03]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          {/* Flap details */}
          <mesh position={[-0.16, -0.23, 0.21]}>
            <boxGeometry args={[0.155, 0.04, 0.015]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>
          <mesh position={[0.16, -0.23, 0.21]}>
            <boxGeometry args={[0.155, 0.04, 0.015]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          {/* Lower waist pockets for Chore / Field jacket */}
          {garment.type !== 'flannel' && (
            <>
              <mesh position={[-0.17, -0.62, 0.195]} castShadow>
                <boxGeometry args={[0.16, 0.18, 0.03]} />
                <primitive object={bodyMaterial} attach="material" />
              </mesh>
              <mesh position={[0.17, -0.62, 0.195]} castShadow>
                <boxGeometry args={[0.16, 0.18, 0.03]} />
                <primitive object={bodyMaterial} attach="material" />
              </mesh>
            </>
          )}

          {/* Left Sleeve */}
          <group position={[-0.34, -0.22, 0]} rotation={[0, 0, 0.25]}>
            <mesh position={[-0.1, -0.26, 0.02]} rotation={[0, 0, 0.15]} castShadow>
              <cylinderGeometry args={[0.15, 0.12, 0.58, 24]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
            <mesh position={[-0.16, -0.56, 0.03]}>
              <cylinderGeometry args={[0.115, 0.11, 0.08, 24]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
          </group>

          {/* Right Sleeve */}
          <group position={[0.34, -0.22, 0]} rotation={[0, 0, -0.25]}>
            <mesh position={[0.1, -0.26, 0.02]} rotation={[0, 0, -0.15]} castShadow>
              <cylinderGeometry args={[0.15, 0.12, 0.58, 24]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
            <mesh position={[0.16, -0.56, 0.03]}>
              <cylinderGeometry args={[0.115, 0.11, 0.08, 24]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
          </group>
        </group>
      );

    case 'denim':
      return (
        <group position={[0, -0.05, 0]}>
          {/* Waistband with button and belt loops */}
          <mesh position={[0, -0.08, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.33, 0.09, 32, 1, false]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          {/* Brass Shank Button */}
          <mesh position={[0, -0.07, 0.165]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.008, 16]} />
            <primitive object={buttonMaterial} attach="material" />
          </mesh>

          {/* Front Fly Topstitching */}
          <mesh position={[0, -0.18, 0.16]}>
            <boxGeometry args={[0.025, 0.15, 0.01]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          {/* Left Leg (Relaxed Wide Fit with natural stacking folds) */}
          <group position={[-0.15, -0.72, 0]} rotation={[0, 0, 0.04]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.15, 0.19, 1.05, 24, 4, false]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
            {/* Hem fold cuff */}
            <mesh position={[0, -0.52, 0]}>
              <cylinderGeometry args={[0.195, 0.195, 0.05, 24]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
          </group>

          {/* Right Leg (Relaxed Wide Fit with natural stacking folds) */}
          <group position={[0.15, -0.72, 0]} rotation={[0, 0, -0.04]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.15, 0.19, 1.05, 24, 4, false]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
            {/* Hem fold cuff */}
            <mesh position={[0, -0.52, 0]}>
              <cylinderGeometry args={[0.195, 0.195, 0.05, 24]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
          </group>
        </group>
      );

    default:
      return null;
  }
};
