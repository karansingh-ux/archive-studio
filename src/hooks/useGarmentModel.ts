import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface UseGarmentModelResult {
  scene: THREE.Group | null;
  isLoading: boolean;
  hasCustomModel: boolean;
}

// In-memory cache for loaded GLBs
const modelCache = new Map<string, THREE.Group>();

export function useGarmentModel(garmentId: string): UseGarmentModelResult {
  const [scene, setScene] = useState<THREE.Group | null>(() => modelCache.get(garmentId) || null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCustomModel, setHasCustomModel] = useState(() => modelCache.has(garmentId));

  useEffect(() => {
    if (modelCache.has(garmentId)) {
      setScene(modelCache.get(garmentId)!);
      setHasCustomModel(true);
      return;
    }

    const modelPath = `/models/${garmentId}.glb`;

    // Attempt to head check if file exists
    fetch(modelPath, { method: 'HEAD' })
      .then((res) => {
        if (!res.ok) {
          // No custom GLB provided yet; fallback to procedural model
          setHasCustomModel(false);
          return;
        }

        setIsLoading(true);
        const loader = new GLTFLoader();
        loader.load(
          modelPath,
          (gltf) => {
            // Traverse to optimize shadows and materials
            gltf.scene.traverse((node) => {
              if ((node as THREE.Mesh).isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
              }
            });
            modelCache.set(garmentId, gltf.scene);
            setScene(gltf.scene);
            setHasCustomModel(true);
            setIsLoading(false);
          },
          undefined,
          (err) => {
            console.info(`No custom GLB found at ${modelPath}, using procedural garment.`);
            setHasCustomModel(false);
            setIsLoading(false);
          }
        );
      })
      .catch(() => {
        setHasCustomModel(false);
      });
  }, [garmentId]);

  return { scene, isLoading, hasCustomModel };
}
