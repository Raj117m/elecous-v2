export type CandidateStatus = 'PENDING' | 'QUALIFIED' | 'REJECTED' | 'PROMOTED';

export interface RawData {
  currentTrendScore: number;
  previousTrendScore: number;
  currentSuggestionCount: number;
  previousSuggestionCount: number;
  currentRelatedQueryCount: number;
  previousRelatedQueryCount: number;
  currentContentCount: number;
  previousContentCount: number;
  currentViewCount: number;
  previousViewCount: number;
}

export interface GrowthVariables {
  searchGrowth: number;
  suggestionGrowth: number;
  relatedQueryGrowth: number;
  contentGrowth: number;
  viewGrowth: number;
}

export interface Parameters {
  p1DemandMomentum: number;
  p2DemandExpansion: number;
  p3AttentionMomentum: number;
  p4Persistence: number;
}

export interface ParameterMetrics {
  raw: number;
  percentile: number;
  normalized: number;
}

export interface NormalizedParameters {
  p1: ParameterMetrics;
  p2: ParameterMetrics;
  p3: ParameterMetrics;
  p4: ParameterMetrics;
}

export interface Scores {
  rawERS: number;
  normalizedERS: number;
  discoveryConfidence: number;
  validationDSD?: number; // Calculated later
  strategicFit?: number;  // Calculated later
  finalOpportunityScore?: number; // FOS
}

export interface Candidate {
  id: string;
  name: string;
  category: string;
  discoveryDate: string;
  status: CandidateStatus;
  rawData?: Partial<RawData>; // allow partial for "NO_DATA" scenarios
}

export interface Product extends Candidate {
  growthVariables: GrowthVariables;
  parameters: Parameters;
  normalizedParameters: NormalizedParameters;
  scores: Scores;
  observationCount: number;
  historicalSnapshots: any[];
}
