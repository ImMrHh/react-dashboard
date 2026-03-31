import HeaderStats from './components/HeaderStats';
import FilterControls from './components/FilterControls';
import MetricsGrid from './components/MetricsGrid';
import InsightBox from './components/InsightBox';
import GrowthSection from './components/GrowthSection';
import ActivityAnalysis from './components/ActivityAnalysis';
import ProfessorsTable from './components/ProfessorsTable';
import MateriasGrid from './components/MateriasGrid';

export default function App() {
  return (
    <div className="app">
      <HeaderStats />
      <main>
        <FilterControls />
        <MetricsGrid />
        <InsightBox />
        <GrowthSection />
        <ActivityAnalysis />
        <ProfessorsTable />
        <MateriasGrid />
      </main>
    </div>
  );
}
