
import React from 'react';
import TextReveal from './TextReveal';
import ImageReveal from './ImageReveal';

// Stage 이미지 import
import stage1Image from '../stages/1.jpeg';
import stage2Image from '../stages/2.jpeg';
import stage3Image from '../stages/3.jpeg';
import stage4Image from '../stages/4.jpeg';
import stage5Image from '../stages/5.jpeg';
import stage6Image from '../stages/6.jpeg';

interface StageData {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  technicalNote: string;
  measurement?: string;
  image?: string;
}

// 각 섹션의 높이 배율 (5번째가 2배)
const SECTION_HEIGHTS = [1, 1, 1, 1, 2, 1]; // 총 7 pages

const stageData: StageData[] = [
  {
    number: 'I',
    title: 'Foundation',
    subtitle: 'The Hidden Architecture Below',
    description: 'Beneath the desert sands lies a foundation of extraordinary magnitude—a reinforced concrete mat spanning 3.7 meters in depth, supported by 194 bored piles reaching 50 meters into the earth. This subterranean architecture, unseen by the world above, bears the weight of humanity\'s tallest ambition.',
    technicalNote: 'The foundation uses a specialized cathodic protection system to guard against the corrosive groundwater of the Arabian Gulf.',
    measurement: '58,900 m³ of concrete',
    image: stage1Image
  },
  {
    number: 'II',
    title: 'The Core',
    subtitle: 'A Spine of Concrete & Steel',
    description: 'Rising like a vertical city, the hexagonal concrete core forms the structural spine of this monumental tower. Cast using the slip-form technique, the core ascends continuously—a feat of engineering that required concrete capable of being pumped to unprecedented heights while maintaining its integrity under extreme pressure.',
    technicalNote: 'High-performance concrete with compressive strength of 80 MPa was developed specifically for this structure.',
    measurement: '330,000 m³ of concrete',
    image: stage2Image
  },
  {
    number: 'III',
    title: 'Setbacks',
    subtitle: 'Dancing with the Wind',
    description: 'The tower\'s distinctive Y-shaped plan is no mere aesthetic choice—it is a dialogue with the desert winds. As the structure ascends, 27 carefully orchestrated setbacks reduce the building\'s cross-section, disrupting vortex formation and diminishing wind-induced sway. Form follows physics in this aerial choreography.',
    technicalNote: 'Wind tunnel testing involved over 40 configurations before arriving at the final spiral setback design.',
    measurement: '27 setback levels',
    image: stage3Image
  },
  {
    number: 'IV',
    title: 'Cladding',
    subtitle: 'The Glass Membrane',
    description: 'A skin of 26,000 reflective glass panels wraps the tower in a shimmering membrane of light and shadow. Each panel, precisely calibrated to reflect the desert sun while minimizing heat gain, transforms the building into a vertical sundial—its surface alive with the shifting patterns of day and night.',
    technicalNote: 'The curtain wall system was designed to withstand Dubai\'s extreme temperature variations and solar radiation.',
    measurement: '103,000 m² of glass',
    image: stage4Image
  },
  {
    number: 'V',
    title: 'Illumination',
    subtitle: 'When Night Embraces the Tower',
    description: 'As twilight descends upon Dubai, the Burj Khalifa undergoes its daily metamorphosis. The crown observation deck rises into the sky, housing over 70,000 LED lights that animate the tower\'s facade. This luminous structure transforms the building into a beacon visible across the desert horizon—a vertical canvas painted with light against the Arabian night.',
    technicalNote: 'The LED lighting system consumes 40% less energy than traditional lighting while producing vibrant displays across 1.2 million lumens.',
    measurement: '70,000+ LED fixtures',
    image: stage5Image
  },
  {
    number: 'VI',
    title: 'The Spire',
    subtitle: 'Reaching for the Infinite',
    description: 'The culminating gesture—a telescopic spire of structural steel rises from within the tower\'s crown like a final exhalation toward the sky. Assembled in sections and raised by hydraulic jacks, this 200-meter pinnacle transforms engineering into poetry, marking the precise moment where earth-bound architecture surrenders to the infinite.',
    technicalNote: 'The spire houses telecommunications equipment and required specialized aviation lighting for safety.',
    measurement: '4,000 tons of steel',
    image: stage6Image
    // 6번째 Spire는 이미지 없음
  }
];

const Overlay: React.FC = () => {
  return (
    <div className="w-screen">
      {stageData.map((stage, index) => (
        <Section
          key={index}
          data={stage}
          page={index}
          heightMultiplier={SECTION_HEIGHTS[index] || 1}
        />
      ))}
    </div>
  );
};

interface SectionProps {
  data: StageData;
  page: number;
  heightMultiplier: number;
}

const Section: React.FC<SectionProps> = ({ data, page, heightMultiplier }) => {
  const isEven = page % 2 === 0;

  // 높이 배율에 따른 스타일 (2배면 h-[200vh])
  const heightStyle = heightMultiplier > 1
    ? { height: `${heightMultiplier * 100}vh` }
    : undefined;

  return (
    <section
      className={`${heightMultiplier === 1 ? 'h-screen' : ''} flex flex-col ${isEven ? 'items-start' : 'items-end'} justify-center p-8 md:p-16 lg:p-24`}
      style={heightStyle}
    >
      {/* 텍스트 영역 */}
      <article
          className={`
            max-w-lg
            ${isEven ? 'border-l-2 pl-8' : 'border-r-2 pr-8 text-right'}
            py-10 px-8
          `}
          style={{
            borderLeftColor: isEven ? 'var(--ui-border-accent)' : undefined,
            borderRightColor: !isEven ? 'var(--ui-border-accent)' : undefined,
            transition: 'border-color 0.7s ease',
          }}
        >
          {/* Stage Number - Roman Numeral */}
          <div className={`flex items-center gap-4 mb-6 ${isEven ? '' : 'flex-row-reverse'}`}>
            <TextReveal
              text={data.number}
              className="font-editorial text-5xl md:text-6xl font-light text-gold"
              delay={0}
              staggerDelay={80}
              duration={800}
              threshold={0.3}
            />
            <div
              className="flex-1 h-px"
              style={{
                background: isEven
                  ? 'linear-gradient(to right, var(--ui-gold-muted), transparent)'
                  : 'linear-gradient(to left, var(--ui-gold-muted), transparent)',
                transition: 'background 0.7s ease'
              }}
            ></div>
          </div>

          {/* Title & Subtitle */}
          <header className="mb-6">
            <TextReveal
              text={data.title}
              as="h2"
              className="font-headline text-3xl md:text-4xl uppercase mb-2 leading-none tracking-wide text-ink"
              delay={200}
              staggerDelay={40}
              duration={700}
              threshold={0.3}
            />
            <TextReveal
              text={data.subtitle}
              as="p"
              className="font-condensed text-base md:text-lg uppercase tracking-wider font-medium text-slate"
              delay={400}
              staggerDelay={20}
              duration={600}
              threshold={0.3}
            />
          </header>

          {/* Main Description */}
          <div className="mb-6">
            <TextReveal
              text={data.description}
              as="p"
              className="font-body text-sm md:text-base leading-relaxed tracking-wide text-charcoal"
              delay={600}
              staggerDelay={6}
              duration={400}
              threshold={0.3}
            />
          </div>

          {/* Technical Note */}
          <aside
            className="border-t pt-4 mt-6"
            style={{ borderColor: 'var(--ui-gold-muted)', transition: 'border-color 0.7s ease' }}
          >
            <TextReveal
              text={data.technicalNote}
              as="p"
              className="font-body text-xs md:text-sm leading-relaxed text-stone"
              delay={800}
              staggerDelay={8}
              duration={400}
              threshold={0.3}
            />
          </aside>

          {/* Measurement Badge */}
          {data.measurement && (
            <div className={`mt-6 flex ${isEven ? '' : 'justify-end'}`}>
              <div className="inline-flex items-center gap-2">
                <div className="h-px w-4 bg-gold"></div>
                <TextReveal
                  text={data.measurement}
                  className="font-body text-[10px] tracking-editorial uppercase text-gold"
                  delay={1000}
                  staggerDelay={25}
                  duration={500}
                  threshold={0.3}
                />
              </div>
            </div>
          )}

          {/* 이미지 - 본문 아래, 원본 비율 유지 */}
          {data.image && (
            <div className={`mt-10 ${isEven ? '' : 'flex justify-end'}`}>
              <div className="max-w-sm">
                <ImageReveal
                  src={data.image}
                  alt={`${data.title} - Construction Phase`}
                  className="w-full h-auto"
                  delay={1200}
                  duration={800}
                  threshold={0.3}
                />
              </div>
            </div>
          )}
        </article>
    </section>
  );
};

export default Overlay;
