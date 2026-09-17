export const Footer: React.FC = () => (
  <footer className="fixed bottom-0 left-0 right-0 p-8 md:p-10 z-10 pointer-events-none">
    <div className="flex items-end justify-between">
      <p className="font-body text-[10px] tracking-editorial uppercase text-stone">
        Interactive Architecture Visualization
      </p>

      <div className="hidden md:block text-right">
        <p className="font-editorial text-xs text-slate">
          &quot;Architecture is the learned game, correct and magnificent, of forms assembled in the light.&quot;
        </p>
        <p className="font-body text-[10px] tracking-wide text-stone mt-1">
          &mdash; Le Corbusier
        </p>
      </div>
    </div>
  </footer>
);
