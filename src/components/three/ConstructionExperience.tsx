import { Suspense, useEffect } from 'react';
import { Scroll, ScrollControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

import { ConstructionOverlay } from '@/components/scroll/ConstructionOverlay';
import { ConstructionScene } from '@/components/three/ConstructionScene';
import { SCROLL_CONFIG } from '@/data/scrollConfig';
import { resetTheme } from '@/hooks/useTheme';

export const ConstructionExperience: React.FC = () => {
  useEffect(() => resetTheme, []);

  return (
    <Canvas
      orthographic
      camera={{ zoom: 90, position: [15, 20, 15] }}
      shadows
      gl={{ antialias: true }}
    >
      <Suspense fallback={null}>
        <ScrollControls pages={SCROLL_CONFIG.pages} damping={SCROLL_CONFIG.damping}>
          <ConstructionScene />
          <Scroll html>
            <ConstructionOverlay />
          </Scroll>
        </ScrollControls>

        <EffectComposer>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.025}
            mipmapBlur
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
};
