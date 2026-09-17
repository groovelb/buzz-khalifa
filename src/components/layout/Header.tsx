export const Header: React.FC = () => (
  <header className="fixed top-0 left-0 right-0 p-8 md:p-10 z-10 pointer-events-none">
    <div className="flex items-start justify-between">
      <div>
        <p className="font-body text-[10px] tracking-editorial uppercase text-stone mb-2">
          Architectural Review · Construction Series
        </p>
        <h1 className="font-headline text-4xl md:text-5xl uppercase tracking-wider text-ink">
          The Vertical Breath
        </h1>
        <div className="flex items-center gap-3 mt-3">
          <div className="h-px w-8 bg-gold" />
          <p className="font-condensed text-sm tracking-wide uppercase font-medium text-slate">
            Burj Khalifa · A Study in Verticality
          </p>
        </div>
      </div>

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
