
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import Experience from './components/Experience';
import Overlay from './components/Overlay';

const App: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        orthographic
        camera={{ zoom: 100, position: [10, 10, 10] }}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#f8f9fa']} />

        <Suspense fallback={null}>
          {/* 5 Pages for 5 Construction Stages */}
          <ScrollControls pages={5} damping={0.25}>
            <Experience />

            <Scroll html>
              <Overlay />
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>

      {/* Fixed UI Header */}
      <header className="fixed top-0 left-0 p-8 z-10 pointer-events-none">
        <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-800">
          The Vertical Breath
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          A Journey Through Architectural Growth
        </p>
      </header>
    </div>
  );
};

export default App;
