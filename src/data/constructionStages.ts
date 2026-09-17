import stage1Image from '@/assets/stages/1.jpeg';
import stage2Image from '@/assets/stages/2.jpeg';
import stage3Image from '@/assets/stages/3.jpeg';
import stage4Image from '@/assets/stages/4.jpeg';
import stage5Image from '@/assets/stages/5.jpeg';
import stage6Image from '@/assets/stages/6.jpeg';

import type { ConstructionStage } from '@/types';

export const CONSTRUCTION_STAGES: readonly ConstructionStage[] = [
  {
    number: 'I',
    title: 'Foundation',
    subtitle: 'The Hidden Architecture Below',
    description: 'Beneath the desert sands lies a foundation of extraordinary magnitude—a reinforced concrete mat spanning 3.7 meters in depth, supported by 194 bored piles reaching 50 meters into the earth. This subterranean architecture, unseen by the world above, bears the weight of humanity\'s tallest ambition.',
    technicalNote: 'The foundation uses a specialized cathodic protection system to guard against the corrosive groundwater of the Arabian Gulf.',
    measurement: '58,900 m³ of concrete',
    image: stage1Image,
  },
  {
    number: 'II',
    title: 'The Core',
    subtitle: 'A Spine of Concrete & Steel',
    description: 'Rising like a vertical city, the hexagonal concrete core forms the structural spine of this monumental tower. Cast using the slip-form technique, the core ascends continuously—a feat of engineering that required concrete capable of being pumped to unprecedented heights while maintaining its integrity under extreme pressure.',
    technicalNote: 'High-performance concrete with compressive strength of 80 MPa was developed specifically for this structure.',
    measurement: '330,000 m³ of concrete',
    image: stage2Image,
  },
  {
    number: 'III',
    title: 'Setbacks',
    subtitle: 'Dancing with the Wind',
    description: 'The tower\'s distinctive Y-shaped plan is no mere aesthetic choice—it is a dialogue with the desert winds. As the structure ascends, 27 carefully orchestrated setbacks reduce the building\'s cross-section, disrupting vortex formation and diminishing wind-induced sway. Form follows physics in this aerial choreography.',
    technicalNote: 'Wind tunnel testing involved over 40 configurations before arriving at the final spiral setback design.',
    measurement: '27 setback levels',
    image: stage3Image,
  },
  {
    number: 'IV',
    title: 'Cladding',
    subtitle: 'The Glass Membrane',
    description: 'A skin of 26,000 reflective glass panels wraps the tower in a shimmering membrane of light and shadow. Each panel, precisely calibrated to reflect the desert sun while minimizing heat gain, transforms the building into a vertical sundial—its surface alive with the shifting patterns of day and night.',
    technicalNote: 'The curtain wall system was designed to withstand Dubai\'s extreme temperature variations and solar radiation.',
    measurement: '103,000 m² of glass',
    image: stage4Image,
  },
  {
    number: 'V',
    title: 'Illumination',
    subtitle: 'When Night Embraces the Tower',
    description: 'As twilight descends upon Dubai, the Burj Khalifa undergoes its daily metamorphosis. The crown observation deck rises into the sky, housing over 70,000 LED lights that animate the tower\'s facade. This luminous structure transforms the building into a beacon visible across the desert horizon—a vertical canvas painted with light against the Arabian night.',
    technicalNote: 'The LED lighting system consumes 40% less energy than traditional lighting while producing vibrant displays across 1.2 million lumens.',
    measurement: '70,000+ LED fixtures',
    image: stage5Image,
  },
  {
    number: 'VI',
    title: 'The Spire',
    subtitle: 'Reaching for the Infinite',
    description: 'The culminating gesture—a telescopic spire of structural steel rises from within the tower\'s crown like a final exhalation toward the sky. Assembled in sections and raised by hydraulic jacks, this 200-meter pinnacle transforms engineering into poetry, marking the precise moment where earth-bound architecture surrenders to the infinite.',
    technicalNote: 'The spire houses telecommunications equipment and required specialized aviation lighting for safety.',
    measurement: '4,000 tons of steel',
    image: stage6Image,
  },
] as const;
