import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { DataEntryModal } from './DataEntryModal';
import type { Candidate } from '../types';
import { Edit2 } from 'lucide-react';

export const CandidatePool: React.FC = () => {
  const { candidates } = useStore();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const getBadgeClass = (status: string) => `badge ${status.toLowerCase()}`;

  return (
    <div className="animate-fade-in">
      <h1>Candidate Pool</h1>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>Only QUALIFIED candidates may enter the Product Database.</p>
      
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>Real Product Name</th>
              <th>Category</th>
              <th>Discovery Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td>{c.category}</td>
                <td>{c.discoveryDate}</td>
                <td><span className={getBadgeClass(c.status)}>{c.status}</span></td>
                <td>
                  {c.status !== 'PROMOTED' && (
                    <button 
                      className="secondary" 
                      style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      onClick={() => setSelectedCandidate(c)}
                    >
                      <Edit2 size={14} /> Review & Promote
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {candidates.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No candidates discovered yet. Go to Discovery Config.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedCandidate && (
        <DataEntryModal 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)} 
        />
      )}
    </div>
  );
};
