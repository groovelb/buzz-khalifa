import { Footer, Header } from '@/components/layout';
import { ConstructionExperience } from '@/components/three';

export const App: React.FC = () => (
  <div className="w-full h-full">
    <ConstructionExperience />
    <Header />
    <Footer />
  </div>
);

export default App;
