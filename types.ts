export interface MatchData {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  impliedOdds?: {
    home: number;
    draw: number;
    away: number;
  };
  formAnalysis?: string;
}

export type MarketType = 'Match Winner' | 'Over/Under' | 'BTTS' | 'Double Chance';

export interface BetLeg {
  matchId: string;
  selection: string; // e.g., "Arsenal Win", "Over 2.5 Goals"
  odds: number;
  modelProbability: number; // 0-100
  edge: number; // Percentage difference between model and implied
  reasoning: string;
  historicalInsight?: string; // New: Key trend from previous seasons
}

export interface ParlayRecommendation {
  id: string;
  legs: BetLeg[];
  totalOdds: number;
  modelWinProbability: number;
  expectedValue: number;
  recommendedStake: number; // Amount
  stakePercentage: number; // % of bankroll
  riskLevel: 'Safe' | 'Medium' | 'Risky';
  confidenceScore: number; // 0-10
  overallReasoning: string;
}

export interface UserSettings {
  bankroll: number;
  selectedLeagues: string[];
  preferredMarkets: MarketType[];
  maxLegs: number;
  targetDate: string;
  targetOdds: number;
}

export type AppState = 'setup' | 'searching' | 'analyzing' | 'results' | 'error';