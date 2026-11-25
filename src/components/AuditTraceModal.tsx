import React from 'react';
import type { Product } from '../types';
import { X, Search, TrendingUp, Activity } from 'lucide-react';
import { ValidationLayer } from './ValidationLayer';

interface Props {
  product: Product;
  onClose: () => void;
  onUpdateProduct: (updates: any) => void;
}

export const AuditTraceModal: React.FC<Props> = ({ product, onClose, onUpdateProduct }) => {
  const { growthVariables: gv, normalizedParameters: np, scores, rawData } = product;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '900px' }}>
        <div className="modal-header">
          <div>
            <h2 style={{ marginBottom: 0 }}>{product.name}</h2>
            <div className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{product.category} • Audited: {new Date(product.discoveryDate).toLocaleString()}</div>
          </div>
          <button className="secondary" style={{ padding: '0.5rem' }} onClick={onClose}><X size={20} /></button>
        </div>

        {/* Trace Layer 1: ERS & Confidence */}
        <div className="grid-2" style={{ marginBottom: '2rem' }}>
          <div className="glass-card" style={{ background: 'rgba(99, 102, 241, 0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div className="text-muted" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>ELECOUS Radar Score</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--accent-primary)', lineHeight: 1 }}>{scores.normalizedERS.toFixed(2)}</div>
            <div className="text-muted" style={{ marginTop: '0.5rem' }}>Raw: {scores.rawERS.toFixed(2)}</div>
          </div>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div className="text-muted" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Discovery Confidence</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 600, color: scores.discoveryConfidence === 1 ? 'var(--accent-success)' : 'var(--accent-warning)', lineHeight: 1.2 }}>
              {(scores.discoveryConfidence * 100).toFixed(0)}%
            </div>
            <div className="text-muted" style={{ marginTop: '0.5rem' }}>Signals: {scores.discoveryConfidence * 10} / 10</div>
          </div>
        </div>

        {/* Trace Layer 2: Parameters & Normalization */}
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="var(--accent-primary)" /> Parameter Calculations
        </h3>
        <div className="grid-4" style={{ gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'P1: Demand Momentum', data: np.p1, formula: '0.60(SG) + 0.40(SugG)' },
            { label: 'P2: Demand Expansion', data: np.p2, formula: 'RQG' },
            { label: 'P3: Attention Momentum', data: np.p3, formula: '0.40(CG) + 0.60(VG)' },
            { label: 'P4: Persistence', data: np.p4, formula: 'Positive / Observed' }
          ].map((param, i) => (
            <div key={i} className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{param.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{param.data.normalized.toFixed(2)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Raw: {param.data.raw.toFixed(2)}<br/>
                Top: {param.data.percentile.toFixed(1)}%<br/>
                <span style={{ opacity: 0.5, display: 'block', marginTop: '0.5rem' }}>{param.formula}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trace Layer 3: Growth Variables & Raw Data */}
        <div className="grid-2">
          <div>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--accent-success)" /> Growth Variables
            </h3>
            <table style={{ background: 'var(--bg-card)', borderRadius: '8px', overflow: 'hidden' }}>
              <tbody>
                <tr><td>Search Growth (SG)</td><td style={{ textAlign: 'right', fontWeight: 600 }}>{(gv.searchGrowth * 100).toFixed(1)}%</td></tr>
                <tr><td>Suggestion Growth (SugG)</td><td style={{ textAlign: 'right', fontWeight: 600 }}>{(gv.suggestionGrowth * 100).toFixed(1)}%</td></tr>
                <tr><td>Related Query Growth (RQG)</td><td style={{ textAlign: 'right', fontWeight: 600 }}>{(gv.relatedQueryGrowth * 100).toFixed(1)}%</td></tr>
                <tr><td>Content Growth (CG)</td><td style={{ textAlign: 'right', fontWeight: 600 }}>{(gv.contentGrowth * 100).toFixed(1)}%</td></tr>
                <tr><td>View Growth (VG)</td><td style={{ textAlign: 'right', fontWeight: 600 }}>{(gv.viewGrowth * 100).toFixed(1)}%</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={18} color="var(--text-muted)" /> Raw Data Snapshot
            </h3>
            <table style={{ background: 'var(--bg-card)', borderRadius: '8px', overflow: 'hidden' }}>
              <tbody>
                <tr><td>Google Trends</td><td style={{ textAlign: 'right' }}>{rawData?.previousTrendScore} → {rawData?.currentTrendScore}</td></tr>
                <tr><td>Search Suggestions</td><td style={{ textAlign: 'right' }}>{rawData?.previousSuggestionCount} → {rawData?.currentSuggestionCount}</td></tr>
                <tr><td>Related Queries</td><td style={{ textAlign: 'right' }}>{rawData?.previousRelatedQueryCount} → {rawData?.currentRelatedQueryCount}</td></tr>
                <tr><td>YouTube Content</td><td style={{ textAlign: 'right' }}>{rawData?.previousContentCount} → {rawData?.currentContentCount}</td></tr>
                <tr><td>YouTube Views</td><td style={{ textAlign: 'right' }}>{rawData?.previousViewCount} → {rawData?.currentViewCount}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <ValidationLayer product={product} onUpdate={onUpdateProduct} />

      </div>
    </div>
  );
};
