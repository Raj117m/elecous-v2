import React, { useState } from 'react';
import type { Candidate } from '../types';
import { useStore } from '../store/useStore';
import { X, CheckCircle, HelpCircle } from 'lucide-react';
import { calculateConfidence } from '../utils/calculations';

interface Props {
  candidate: Candidate;
  onClose: () => void;
}

export const DataEntryModal: React.FC<Props> = ({ candidate, onClose }) => {
  const { updateCandidateStatus, promoteCandidate } = useStore();
  const [positivePeriods, setPositivePeriods] = useState(3);
  const [observedPeriods, setObservedPeriods] = useState(4);

  const confidence = candidate.rawData ? calculateConfidence(candidate.rawData) : 0;
  const hasSignals = candidate.rawData && Object.keys(candidate.rawData).length > 0;

  const handleQualify = () => {
    updateCandidateStatus(candidate.id, 'QUALIFIED');
    onClose();
  };

  const handlePromote = () => {
    promoteCandidate(candidate.id, positivePeriods, observedPeriods);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2 style={{ marginBottom: 0 }}>Review Candidate</h2>
          <button className="secondary" style={{ padding: '0.5rem' }} onClick={onClose}><X size={20} /></button>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>{candidate.name}</div>
          <div className="text-muted">{candidate.category} • Discovered on {candidate.discoveryDate}</div>
        </div>

        <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'rgba(99, 102, 241, 0.05)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} color="var(--accent-success)" /> Discovery Signals
          </h3>
          {hasSignals ? (
            <div>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                All 4 discovery sources have been queried.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span className="text-muted">Discovery Confidence</span>
                <span style={{ fontWeight: 600, color: confidence === 1 ? 'var(--accent-success)' : 'var(--accent-warning)' }}>
                  {(confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span className="text-muted">Google Trends</span>
                <span style={{ fontSize: '0.85rem' }}>{candidate.rawData?.currentTrendScore === 0 ? 'NO_DATA (Fallback)' : 'Collected'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span className="text-muted">Google Suggestions</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-success)' }}>Active ({candidate.rawData?.currentSuggestionCount} suggestions)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span className="text-muted">Google Related Queries</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-success)' }}>Active ({candidate.rawData?.currentRelatedQueryCount} queries)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span className="text-muted">YouTube Content & Views</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-success)' }}>Active ({candidate.rawData?.currentViewCount?.toLocaleString()} views)</span>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--accent-danger)' }}>No signal data collected for this candidate.</p>
          )}
        </div>

        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={18} color="var(--accent-primary)" /> Persistence (P4)
          </h3>
          <div className="grid-2">
            <div>
              <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Observed Periods</label>
              <input type="number" min="1" value={observedPeriods} onChange={e => setObservedPeriods(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Positive Periods</label>
              <input type="number" min="0" max={observedPeriods} value={positivePeriods} onChange={e => setPositivePeriods(Number(e.target.value))} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button className="secondary" onClick={() => updateCandidateStatus(candidate.id, 'REJECTED')}>Reject</button>
          <button className="secondary" onClick={handleQualify}>Qualify Only</button>
          <button style={{ background: 'var(--accent-primary)' }} onClick={handlePromote}>Promote to Radar</button>
        </div>
      </div>
    </div>
  );
};
