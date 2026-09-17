import { ConstructionSection } from '@/components/scroll/ConstructionSection';
import { CONSTRUCTION_STAGES } from '@/data/constructionStages';
import { SECTION_HEIGHTS } from '@/data/scrollConfig';

export const ConstructionOverlay: React.FC = () => (
  <div className="w-screen">
    {CONSTRUCTION_STAGES.map((stage, index) => (
      <ConstructionSection
        key={stage.number}
        data={stage}
        page={index}
        heightMultiplier={SECTION_HEIGHTS[index] ?? 1}
      />
    ))}
  </div>
);
