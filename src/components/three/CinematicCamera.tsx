
import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

// Camera animation keyframes based on scroll progress
const CAMERA_KEYFRAMES = {
  // Start: Close-up on foundation
  start: {
    zoom: 120,
    position: new THREE.Vector3(6, 4, 6),
    lookAt: new THREE.Vector3(0, 0, 0),
  },
  // Mid-build: Pull back to see structure
  mid: {
    zoom: 80,
    position: new THREE.Vector3(10, 8, 10),
    lookAt: new THREE.Vector3(0, 5, 0),
  },
  // End: Wide shot of complete building
  end: {
    zoom: 45,
    position: new THREE.Vector3(15, 12, 15),
    lookAt: new THREE.Vector3(0, 8, 0),
  },
};

export const CinematicCamera: React.FC = () => {
  const { camera } = useThree();
  const scroll = useScroll();

  // Smooth interpolation values
  const currentZoom = useRef(CAMERA_KEYFRAMES.start.zoom);
  const currentPosition = useRef(CAMERA_KEYFRAMES.start.position.clone());
  const currentLookAt = useRef(CAMERA_KEYFRAMES.start.lookAt.clone());

  useFrame(() => {
    const offset = scroll.offset;

    // Calculate target values based on scroll
    let targetZoom: number;
    let targetPosition: THREE.Vector3;
    let targetLookAt: THREE.Vector3;

    if (offset < 0.4) {
      // Phase 1-2: Foundation to Core (close-up)
      const t = offset / 0.4;
      targetZoom = THREE.MathUtils.lerp(
        CAMERA_KEYFRAMES.start.zoom,
        CAMERA_KEYFRAMES.mid.zoom,
        easeInOutCubic(t)
      );
      targetPosition = new THREE.Vector3().lerpVectors(
        CAMERA_KEYFRAMES.start.position,
        CAMERA_KEYFRAMES.mid.position,
        easeInOutCubic(t)
      );
      targetLookAt = new THREE.Vector3().lerpVectors(
        CAMERA_KEYFRAMES.start.lookAt,
        CAMERA_KEYFRAMES.mid.lookAt,
        easeInOutCubic(t)
      );
    } else {
      // Phase 3-5: Setbacks to Spire (pull back)
      const t = (offset - 0.4) / 0.6;
      targetZoom = THREE.MathUtils.lerp(
        CAMERA_KEYFRAMES.mid.zoom,
        CAMERA_KEYFRAMES.end.zoom,
        easeInOutCubic(t)
      );
      targetPosition = new THREE.Vector3().lerpVectors(
        CAMERA_KEYFRAMES.mid.position,
        CAMERA_KEYFRAMES.end.position,
        easeInOutCubic(t)
      );
      targetLookAt = new THREE.Vector3().lerpVectors(
        CAMERA_KEYFRAMES.mid.lookAt,
        CAMERA_KEYFRAMES.end.lookAt,
        easeInOutCubic(t)
      );
    }

    // Smooth damping for buttery transitions
    const dampingFactor = 0.05;

    currentZoom.current = THREE.MathUtils.lerp(
      currentZoom.current,
      targetZoom,
      dampingFactor
    );

    currentPosition.current.lerp(targetPosition, dampingFactor);
    currentLookAt.current.lerp(targetLookAt, dampingFactor);

    // Apply to orthographic camera
    if ((camera as THREE.OrthographicCamera).isOrthographicCamera) {
      const orthoCamera = camera as THREE.OrthographicCamera;
      orthoCamera.zoom = currentZoom.current;
      orthoCamera.position.copy(currentPosition.current);
      orthoCamera.lookAt(currentLookAt.current);
      orthoCamera.updateProjectionMatrix();
    }
  });

  return null;
};

// Easing function for smooth animation
function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
