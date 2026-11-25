import React from 'react';
import { Radar, Users, Compass, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      <div className="brand">ELECOUS</div>
      <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '-1.5rem', marginBottom: '1rem' }}>Opportunity Discovery</div>
      
      <div className="nav-links">
        <a 
          className={`nav-link ${activeTab === 'discovery' ? 'active' : ''}`}
          onClick={() => setActiveTab('discovery')}
        >
          <Compass size={20} /> Discovery Config
        </a>
        <a 
          className={`nav-link ${activeTab === 'candidates' ? 'active' : ''}`}
          onClick={() => setActiveTab('candidates')}
        >
          <Users size={20} /> Candidate Pool
        </a>
        <a 
          className={`nav-link ${activeTab === 'radar' ? 'active' : ''}`}
          onClick={() => setActiveTab('radar')}
        >
          <Radar size={20} /> Product Radar
        </a>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <a className="nav-link">
          <Settings size={20} /> Settings
        </a>
      </div>
    </div>
  );
};
