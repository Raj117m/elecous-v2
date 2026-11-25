import { create } from 'zustand';
import type { Candidate, Product, RawData, NormalizedParameters } from '../types';
import { computeGrowthVariables, computeParameters, computeERS, calculateConfidence, calculatePercentile } from '../utils/calculations';

interface StoreState {
  categories: string[];
  addCategory: (cat: string) => void;
  removeCategory: (cat: string) => void;

  candidates: Candidate[];
  addCandidate: (candidate: Candidate) => void;
  clearCandidates: () => void;
  updateCandidateStatus: (id: string, status: Candidate['status']) => void;
  updateCandidateData: (id: string, data: Partial<RawData>) => void;

  products: Product[];
  promoteCandidate: (id: string, positivePeriods: number, observedPeriods: number) => void;
}

const defaultCategories = ['Travel', 'Productivity', 'Desk Setup', 'Home Organization', 'Creator Tools', 'Pet Accessories'];

export const useStore = create<StoreState>((set, get) => ({
  categories: defaultCategories,
  addCategory: (cat) => set((state) => ({ categories: [...state.categories, cat] })),
  removeCategory: (cat) => set((state) => ({ categories: state.categories.filter(c => c !== cat) })),

  candidates: [],
  addCandidate: (candidate) => set((state) => ({ candidates: [...state.candidates, candidate] })),
  clearCandidates: () => set({ candidates: [] }),
  updateCandidateStatus: (id, status) => set((state) => ({
    candidates: state.candidates.map(c => c.id === id ? { ...c, status } : c)
  })),
  updateCandidateData: (id, data) => set((state) => ({
    candidates: state.candidates.map(c => c.id === id ? { ...c, rawData: { ...c.rawData, ...data } } : c)
  })),

  products: [],
  promoteCandidate: (id, positivePeriods, observedPeriods) => {
    const { candidates, products } = get();
    const candidate = candidates.find(c => c.id === id);
    if (!candidate || !candidate.rawData) return;
    
    // Ensure all required fields exist for a full promotion, default to 0 if missing for safe math
    const raw = {
      currentTrendScore: candidate.rawData.currentTrendScore || 0,
      previousTrendScore: candidate.rawData.previousTrendScore || 0,
      currentSuggestionCount: candidate.rawData.currentSuggestionCount || 0,
      previousSuggestionCount: candidate.rawData.previousSuggestionCount || 0,
      currentRelatedQueryCount: candidate.rawData.currentRelatedQueryCount || 0,
      previousRelatedQueryCount: candidate.rawData.previousRelatedQueryCount || 0,
      currentContentCount: candidate.rawData.currentContentCount || 0,
      previousContentCount: candidate.rawData.previousContentCount || 0,
      currentViewCount: candidate.rawData.currentViewCount || 0,
      previousViewCount: candidate.rawData.previousViewCount || 0,
    };

    const growthVariables = computeGrowthVariables(raw);
    const parameters = computeParameters(growthVariables, positivePeriods, observedPeriods);
    
    // For normalization, we need all existing products' parameters
    const allP1 = [...products.map(p => p.parameters.p1DemandMomentum), parameters.p1DemandMomentum];
    const allP2 = [...products.map(p => p.parameters.p2DemandExpansion), parameters.p2DemandExpansion];
    const allP3 = [...products.map(p => p.parameters.p3AttentionMomentum), parameters.p3AttentionMomentum];
    const allP4 = [...products.map(p => p.parameters.p4Persistence), parameters.p4Persistence];

    // Helper to calc norms
    const normP1 = calculatePercentile(parameters.p1DemandMomentum, allP1);
    const normP2 = calculatePercentile(parameters.p2DemandExpansion, allP2);
    const normP3 = calculatePercentile(parameters.p3AttentionMomentum, allP3);
    const normP4 = calculatePercentile(parameters.p4Persistence, allP4);

    const normalizedParameters: NormalizedParameters = {
      p1: { raw: parameters.p1DemandMomentum, percentile: (10 - normP1) * 10, normalized: normP1 },
      p2: { raw: parameters.p2DemandExpansion, percentile: (10 - normP2) * 10, normalized: normP2 },
      p3: { raw: parameters.p3AttentionMomentum, percentile: (10 - normP3) * 10, normalized: normP3 },
      p4: { raw: parameters.p4Persistence, percentile: (10 - normP4) * 10, normalized: normP4 },
    };

    const rawERS = 0.35 * parameters.p1DemandMomentum + 0.20 * parameters.p2DemandExpansion + 0.30 * parameters.p3AttentionMomentum + 0.15 * parameters.p4Persistence;
    const normalizedERS = computeERS(normalizedParameters);
    const discoveryConfidence = calculateConfidence(candidate.rawData);

    const newProduct: Product = {
      ...candidate,
      status: 'PROMOTED',
      growthVariables,
      parameters,
      normalizedParameters,
      scores: {
        rawERS,
        normalizedERS,
        discoveryConfidence
      },
      observationCount: observedPeriods,
      historicalSnapshots: [{ date: new Date().toISOString(), raw, parameters, scores: { rawERS, normalizedERS, discoveryConfidence } }]
    };

    set((state) => ({
      candidates: state.candidates.map(c => c.id === id ? { ...c, status: 'PROMOTED' } : c),
      products: [...state.products, newProduct]
    }));
  }
}));
