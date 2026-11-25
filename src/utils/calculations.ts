import type { RawData, GrowthVariables, Parameters, NormalizedParameters } from '../types';

export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 1 : 0; // Prevent div by 0. 100% growth if from 0 to positive.
  return (current - previous) / previous;
};

export const computeGrowthVariables = (raw: RawData): GrowthVariables => {
  return {
    searchGrowth: calculateGrowth(raw.currentTrendScore, raw.previousTrendScore),
    suggestionGrowth: calculateGrowth(raw.currentSuggestionCount, raw.previousSuggestionCount),
    relatedQueryGrowth: calculateGrowth(raw.currentRelatedQueryCount, raw.previousRelatedQueryCount),
    contentGrowth: calculateGrowth(raw.currentContentCount, raw.previousContentCount),
    viewGrowth: calculateGrowth(raw.currentViewCount, raw.previousViewCount),
  };
};

export const computeParameters = (growth: GrowthVariables, positivePeriods: number, observedPeriods: number): Parameters => {
  return {
    p1DemandMomentum: 0.60 * growth.searchGrowth + 0.40 * growth.suggestionGrowth,
    p2DemandExpansion: growth.relatedQueryGrowth,
    p3AttentionMomentum: 0.40 * growth.contentGrowth + 0.60 * growth.viewGrowth,
    p4Persistence: observedPeriods > 0 ? positivePeriods / observedPeriods : 0,
  };
};

export const calculatePercentile = (value: number, allValues: number[]): number => {
  if (allValues.length === 0) return 10; // Default max if it's the only one
  const sorted = [...allValues].sort((a, b) => a - b);
  const rank = sorted.findIndex(v => v >= value) + 1; // 1-based rank
  const percentile = (rank / sorted.length) * 100;
  
  // Convert 0-100 percentile into a 1-10 normalized scale
  // Top 1% = 10, Top 10% = 9, etc.
  const topPercentile = 100 - percentile; 
  // Formula approx: 10 - (topPercentile / 10)
  // e.g. top 10% -> 10 - 1 = 9
  const normalized = Math.max(0, 10 - (topPercentile / 10));
  return Number(normalized.toFixed(2));
};

export const computeERS = (norm: NormalizedParameters): number => {
  return 0.35 * norm.p1.normalized + 0.20 * norm.p2.normalized + 0.30 * norm.p3.normalized + 0.15 * norm.p4.normalized;
};

export const calculateConfidence = (raw: Partial<RawData>): number => {
  const expectedSignals = 10; // 5 pairs
  let availableSignals = 0;
  Object.values(raw).forEach(val => {
    if (val !== undefined && val !== null) availableSignals++;
  });
  return availableSignals / expectedSignals;
};
