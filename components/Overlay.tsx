
import React from 'react';
import { useScroll } from '@react-three/drei';

const Overlay: React.FC = () => {
  return (
    <div className="w-screen">
      {/* Section 1: Foundation */}
      <Section 
        title="01. Foundation" 
        description="The base is supported by a large reinforced concrete mat, which is in turn supported by bored reinforced concrete piles."
        page={0}
      />
      
      {/* Section 2: Core */}
      <Section 
        title="02. Concrete Core" 
        description="A high-performance concrete core is constructed to provide the structural backbone for the vertical rise."
        page={1}
      />
      
      {/* Section 3: Setbacks */}
      <Section 
        title="03. Setbacks" 
        description="As the tower rises, setbacks at each level occur in a spiralling pattern, reducing the tower's mass as it reaches toward the sky."
        page={2}
      />
      
      {/* Section 4: Cladding */}
      <Section 
        title="04. Exterior Cladding" 
        description="The exterior is composed of reflective glazing with aluminum and textured stainless steel spandrel panels."
        page={3}
      />
      
      {/* Section 5: The Spire" */}
      <Section 
        title="05. The Spire" 
        description="The crowning touch, a telescopic spire composed of more than 4,000 tons of structural steel."
        page={4}
      />
    </div>
  );
};

const Section: React.FC<{ title: string; description: string; page: number }> = ({ title, description, page }) => {
  return (
    <section 
      className={`h-screen flex flex-col items-start justify-center p-12 md:p-24 max-w-2xl transition-opacity duration-1000`}
      style={{ opacity: 1 }} // Simplified for now, ScrollControls handles the flow
    >
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/20">
        <h2 className="text-4xl font-black text-slate-800 mb-4">{title}</h2>
        <p className="text-lg text-slate-600 leading-relaxed font-medium">
          {description}
        </p>
        <div className="mt-8 flex items-center gap-2">
          <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Construction Phase</span>
        </div>
      </div>
    </section>
  );
};

export default Overlay;
