import React, { useState } from 'react';
import type { Product } from '../types';


interface Props {
  product: Product;
  onUpdate: (updates: any) => void;
}

export const ValidationLayer: React.FC<Props> = ({ product, onUpdate }) => {
  const [comp, setComp] = useState({ listingGrowth: 0, sellerGrowth: 0 });
  const [fit, setFit] = useState({ brand: 0, source: 0, margin: 0, brandability: 0, support: 0 });

  const handleCompChange = (key: string, val: string) => setComp(p => ({ ...p, [key]: Number(val) }));
  const handleFitChange = (key: string, val: string) => setFit(p => ({ ...p, [key]: Number(val) }));

  const calculateValidation = () => {
    const competitionScore = 0.50 * comp.listingGrowth + 0.50 * comp.sellerGrowth;
    // Demand Score -> essentially ERS or P1? Requirement says Validation DSD = Demand Score / Competition Score.
    // I'll use normalizedERS as Demand Score.
    const validationDSD = competitionScore > 0 ? product.scores.normalizedERS / competitionScore : 0;
    
    const strategicFit = (fit.brand + fit.source + fit.margin + fit.brandability + fit.support) / 5;
    const finalOpportunityScore = 0.70 * product.scores.normalizedERS + 0.30 * strategicFit;

    onUpdate({ validationDSD, strategicFit, finalOpportunityScore });
  };

  return (
    <div className="glass-card" style={{ marginTop: '2rem', background: 'rgba(236, 72, 153, 0.05)' }}>
      <h2 style={{ color: 'var(--accent-secondary)' }}>Validation Layer (Manual Research)</h2>
      
      <div className="grid-2">
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Competition Variables</h3>
          <div className="grid-2" style={{ gap: '1rem' }}>
            <div>
              <label className="text-muted">Listing Growth (0-10)</label>
              <input type="number" min="0" max="10" value={comp.listingGrowth} onChange={e => handleCompChange('listingGrowth', e.target.value)} />
            </div>
            <div>
              <label className="text-muted">Seller Growth (0-10)</label>
              <input type="number" min="0" max="10" value={comp.sellerGrowth} onChange={e => handleCompChange('sellerGrowth', e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Strategic Fit (0-10)</h3>
          <div className="grid-3" style={{ gap: '0.5rem' }}>
            <input type="number" placeholder="Brand Fit" value={fit.brand || ''} onChange={e => handleFitChange('brand', e.target.value)} />
            <input type="number" placeholder="Sourceability" value={fit.source || ''} onChange={e => handleFitChange('source', e.target.value)} />
            <input type="number" placeholder="Margin" value={fit.margin || ''} onChange={e => handleFitChange('margin', e.target.value)} />
            <input type="number" placeholder="Brandability" value={fit.brandability || ''} onChange={e => handleFitChange('brandability', e.target.value)} />
            <input type="number" placeholder="Support" value={fit.support || ''} onChange={e => handleFitChange('support', e.target.value)} />
          </div>
        </div>
      </div>
      
      <button style={{ marginTop: '1.5rem', background: 'var(--accent-secondary)' }} onClick={calculateValidation}>
        Calculate FOS & Validation
      </button>

      {product.scores.finalOpportunityScore !== undefined && (
        <div className="grid-3" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-glass)' }}>
          <div>
            <div className="text-muted">Validation DSD</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{product.scores.validationDSD?.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-muted">Strategic Fit</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{product.scores.strategicFit?.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-muted" style={{ color: 'var(--accent-secondary)' }}>FOS (Final Score)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>{product.scores.finalOpportunityScore?.toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  );
};
