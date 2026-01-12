
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import Experience from './components/Experience';
import Overlay from './components/Overlay';

// Header Component - Uses CSS variables for automatic theme response
const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 p-8 md:p-10 z-10 pointer-events-none">
      <div className="flex items-start justify-between">
        {/* Masthead */}
        <div>
          <p className="font-body text-[10px] tracking-editorial uppercase text-stone mb-2">
            Architectural Review · Construction Series
          </p>
          <h1 className="font-headline text-4xl md:text-5xl uppercase tracking-wider text-ink">
            The Vertical Breath
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="h-px w-8 bg-gold"></div>
            <p className="font-condensed text-sm tracking-wide uppercase font-medium text-slate">
              Burj Khalifa · A Study in Verticality
            </p>
          </div>
        </div>

        {/* Magazine Issue Info */}
        <div className="hidden md:block text-right">
          <p className="font-condensed text-sm uppercase tracking-wide text-stone">
            Vol. MMXXIV · No. 828
          </p>
          <p className="font-body text-[10px] tracking-editorial uppercase text-stone mt-1">
            Dubai, United Arab Emirates
          </p>
        </div>
      </div>
    </header>
  );
};

// Footer Component - Uses CSS variables for automatic theme response
const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-8 md:p-10 z-10 pointer-events-none">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-body text-[10px] tracking-editorial uppercase text-stone">
            Interactive Architecture Visualization
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="font-editorial text-xs text-slate">
            "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
          </p>
          <p className="font-body text-[10px] tracking-wide text-stone mt-1">
            — Le Corbusier
          </p>
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        orthographic
        camera={{ zoom: 90, position: [15, 20, 15] }}
        shadows
        gl={{ antialias: true }}
      >
        {/* Background color managed by DayNightCycle component */}

        <Suspense fallback={null}>
          {/* 7 Pages for 6 Construction Stages (5th stage is 2x length) */}
          <ScrollControls pages={7} damping={0.25}>
            <Experience />

            <Scroll html>
              <Overlay />
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>

      {/* Fixed UI Header - Classic Architectural Magazine Style */}
      <Header />

      {/* Fixed Footer - Editorial Credits */}
      <Footer />
    </div>
  );
};

export default App;
