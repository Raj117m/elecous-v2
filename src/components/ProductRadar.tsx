import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import type { Product } from '../types';
import { AuditTraceModal } from './AuditTraceModal';
import { ShieldAlert, CheckCircle2, Search } from 'lucide-react';

export const ProductRadar: React.FC = () => {
  const { products } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sort by ERS desc
  const sortedProducts = [...products].sort((a, b) => b.scores.normalizedERS - a.scores.normalizedERS);

  const handleUpdateProduct = (id: string, updates: any) => {
    // We update the product in store. Note: in our simple store, we might need an updateProduct fn.
    // Since we don't have it explicitly mapped for products, we can dispatch it.
    // To keep it simple, we'll force re-render by calling a dummy function or we can add it to useStore.
    // For this prototype, we'll just mutate the object directly to reflect in the UI for the session, 
    // but ideally we should update the Zustand store.
    const product = products.find(p => p.id === id);
    if (product) {
      product.scores = { ...product.scores, ...updates };
      setSelectedProduct({ ...product }); // trigger modal re-render
    }
  };

  return (
    <div className="animate-fade-in">
      <h1>Product Radar</h1>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>Showing products ranked by ELECOUS Radar Score (ERS).</p>

      <div className="grid-3">
        {sortedProducts.map(p => (
          <div 
            key={p.id} 
            className="glass-card" 
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            onClick={() => setSelectedProduct(p)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{p.name}</h3>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>{p.category}</div>
              </div>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 700, fontSize: '1.2rem' }}>
                {p.scores.normalizedERS.toFixed(1)}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              {p.scores.discoveryConfidence === 1 ? (
                <><CheckCircle2 size={16} color="var(--accent-success)" /> <span style={{color: 'var(--accent-success)'}}>High Confidence</span></>
              ) : (
                <><ShieldAlert size={16} color="var(--accent-warning)" /> <span style={{color: 'var(--accent-warning)'}}>Partial Signals</span></>
              )}
            </div>

            {p.scores.finalOpportunityScore !== undefined && (
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Validation FOS</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>{p.scores.finalOpportunityScore.toFixed(2)}</span>
              </div>
            )}
            
            {!p.scores.finalOpportunityScore && (
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'center' }}>
                <span className="text-muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Search size={14}/> Needs Validation</span>
              </div>
            )}
          </div>
        ))}
        
        {sortedProducts.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            No products on the radar. Promote candidates from the Candidate Pool.
          </div>
        )}
      </div>

      {selectedProduct && (
        <AuditTraceModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onUpdateProduct={(updates) => handleUpdateProduct(selectedProduct.id, updates)}
        />
      )}
    </div>
  );
};
