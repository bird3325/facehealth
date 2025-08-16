export enum Page {
  Home,
  Analyzing,
  Result,
  SharingCenter,
  SharingSettings,
}

export interface HealthDetail {
  category: string;
  score: number;
}

export interface HealthRecommendation {
  category: string;
  tip: string;
}

export interface AnalysisResult {
  overallScore: number;
  summaryText: string;
  details: HealthDetail[];
  recommendations: HealthRecommendation[];
}
