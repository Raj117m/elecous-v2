import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus } from 'lucide-react';
import { discoverRealProducts, collectRealSignals } from '../utils/discovery';

export const DiscoveryConfig: React.FC = () => {
  const { categories, addCategory, addCandidate, clearCandidates } = useStore();
  const [newCat, setNewCat] = useState('');
  const [selectedCat, setSelectedCat] = useState(categories[0]);
  const [productCount, setProductCount] = useState(10);
  const [discovering, setDiscovering] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddCategory = () => {
    if (newCat && !categories.includes(newCat)) {
      addCategory(newCat);
      setNewCat('');
    }
  };

  const handleDiscover = async () => {
    setDiscovering(true);
    setErrorMsg('');
    setLogs(['Initializing Discovery Engine...']);
    clearCandidates();

    try {
      setLogs(prev => [...prev, `Searching Google autocomplete for ${selectedCat} products...`]);
      const productNames = await discoverRealProducts(selectedCat, productCount);

      if (productNames.length === 0) {
        setErrorMsg('NO_PRODUCTS_FOUND');
        setLogs(prev => [...prev, 'Discovery complete. No active products found.']);
        setDiscovering(false);
        return;
      }

      setLogs(prev => [...prev, `Discovered ${productNames.length} real candidates: ${productNames.join(', ')}`]);

      for (let i = 0; i < productNames.length; i++) {
        const name = productNames[i];
        setLogs(prev => [...prev, `[${i + 1}/${productNames.length}] Harvesting signals for ${name}...`]);
        const rawData = await collectRealSignals(name);
        
        addCandidate({
          id: `cand-${Date.now()}-${i}`,
          name,
          category: selectedCat,
          discoveryDate: new Date().toISOString().split('T')[0],
          status: 'PENDING',
          rawData
        });
      }

      setLogs(prev => [...prev, 'Data collection finished. Candidates added to Candidate Pool.']);
    } catch (e) {
      console.error(e);
      setErrorMsg('DISCOVERY_FAILED');
      setLogs(prev => [...prev, 'Error running discovery. Check connection.']);
    } finally {
      setDiscovering(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1>Discovery Configuration</h1>
      
      <div className="grid-2">
        <div className="glass-card">
          <h2>1. Category Selection</h2>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
            <input 
              placeholder="New Category..." 
              value={newCat} 
              onChange={e => setNewCat(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
            />
            <button className="secondary" onClick={handleAddCategory}><Plus size={20}/></button>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2>2. Target Discovery Size</h2>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>Number of products to discover and add to candidate pool.</p>
            <select value={productCount} onChange={e => setProductCount(Number(e.target.value))}>
              {[10, 25, 50, 75, 100].map(n => <option key={n} value={n}>{n} Products</option>)}
            </select>
          </div>

          <button 
            style={{ width: '100%', marginTop: '2rem' }} 
            onClick={handleDiscover}
            disabled={discovering}
          >
            {discovering ? 'Discovering...' : 'Start Discovery Workflow'}
          </button>
        </div>
      </div>

      {(discovering || logs.length > 1 || errorMsg) && (
        <div className="glass-card" style={{ marginTop: '2rem', background: 'rgba(0, 0, 0, 0.4)' }}>
          <h2>System Logs</h2>
          {errorMsg && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid var(--accent-danger)', 
              color: 'var(--accent-danger)', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1rem',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}>
              {errorMsg}
            </div>
          )}
          <div style={{ 
            fontFamily: 'monospace', 
            fontSize: '0.85rem', 
            maxHeight: '200px', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.5rem',
            color: 'var(--text-muted)'
          }}>
            {logs.map((log, index) => (
              <div key={index} style={{ color: log.startsWith('[') ? 'var(--accent-success)' : 'inherit' }}>
                &gt; {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
