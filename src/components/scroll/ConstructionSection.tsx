import { TextReveal } from '@/components/kinetic-typography/TextReveal';
import { ImageReveal } from '@/components/media/ImageReveal';

import type { ConstructionStage } from '@/types';

export interface ConstructionSectionProps {
  data: ConstructionStage;
  page: number;
  heightMultiplier: number;
}

export const ConstructionSection: React.FC<ConstructionSectionProps> = ({ data, page, heightMultiplier }) => {
  const isEven = page % 2 === 0;
  const heightStyle = heightMultiplier > 1 ? { height: `${heightMultiplier * 100}vh` } : undefined;

  return (
    <section
      className={`${heightMultiplier === 1 ? 'h-screen' : ''} flex flex-col ${isEven ? 'items-start' : 'items-end'} justify-center p-8 md:p-16 lg:p-24`}
      style={heightStyle}
    >
      <article
        className={`max-w-lg ${isEven ? 'border-l-2 pl-8' : 'border-r-2 pr-8 text-right'} py-10 px-8`}
        style={{
          borderLeftColor: isEven ? 'var(--ui-border-accent)' : undefined,
          borderRightColor: !isEven ? 'var(--ui-border-accent)' : undefined,
          transition: 'border-color 0.7s ease',
        }}
      >
        <div className={`flex items-center gap-4 mb-6 ${isEven ? '' : 'flex-row-reverse'}`}>
          <TextReveal text={data.number} className="font-editorial text-5xl md:text-6xl font-light text-gold" delay={0} staggerDelay={80} duration={800} threshold={0.3} />
          <div
            className="flex-1 h-px"
            style={{
              background: isEven ? 'linear-gradient(to right, var(--ui-gold-muted), transparent)' : 'linear-gradient(to left, var(--ui-gold-muted), transparent)',
              transition: 'background 0.7s ease',
            }}
          />
        </div>

        <header className="mb-6">
          <TextReveal text={data.title} as="h2" className="font-headline text-3xl md:text-4xl uppercase mb-2 leading-none tracking-wide text-ink" delay={200} staggerDelay={40} duration={700} threshold={0.3} />
          <TextReveal text={data.subtitle} as="p" className="font-condensed text-base md:text-lg uppercase tracking-wider font-medium text-slate" delay={400} staggerDelay={20} duration={600} threshold={0.3} />
        </header>

        <div className="mb-6">
          <TextReveal text={data.description} as="p" className="font-body text-sm md:text-base leading-relaxed tracking-wide text-charcoal" delay={600} staggerDelay={6} duration={400} threshold={0.3} />
        </div>

        <aside className="border-t pt-4 mt-6" style={{ borderColor: 'var(--ui-gold-muted)', transition: 'border-color 0.7s ease' }}>
          <TextReveal text={data.technicalNote} as="p" className="font-body text-xs md:text-sm leading-relaxed text-stone" delay={800} staggerDelay={8} duration={400} threshold={0.3} />
        </aside>

        {data.measurement && (
          <div className={`mt-6 flex ${isEven ? '' : 'justify-end'}`}>
            <div className="inline-flex items-center gap-2">
              <div className="h-px w-4 bg-gold" />
              <TextReveal text={data.measurement} className="font-body text-[10px] tracking-editorial uppercase text-gold" delay={1000} staggerDelay={25} duration={500} threshold={0.3} />
            </div>
          </div>
        )}

        {data.image && (
          <div className={`mt-10 ${isEven ? '' : 'flex justify-end'}`}>
            <div className="max-w-sm">
              <ImageReveal src={data.image} alt={`${data.title} - Construction Phase`} className="w-full h-auto" delay={1200} duration={800} threshold={0.3} />
            </div>
          </div>
        )}
      </article>
    </section>
  );
};
