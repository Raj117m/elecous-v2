import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DiscoveryConfig } from './components/DiscoveryConfig';
import { CandidatePool } from './components/CandidatePool';
import { ProductRadar } from './components/ProductRadar';

function App() {
  const [activeTab, setActiveTab] = useState('discovery');

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        {activeTab === 'discovery' && <DiscoveryConfig />}
        {activeTab === 'candidates' && <CandidatePool />}
        {activeTab === 'radar' && <ProductRadar />}
      </main>
    </div>
  );
}

export default App;
