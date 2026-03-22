
export interface GroundingSource {
  title: string;
  uri: string;
}

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

export type MarketType = 'Match Winner' | 'Over/Under' | 'BTTS' | 'Double Chance' | 'Correct Score';

export interface BetLeg {
  matchId: string;
  selection: string;
  odds: number;
  modelProbability: number;
  edge: number;
  reasoning: string;
  historicalInsight?: string;
}

export interface ParlayRecommendation {
  id: string;
  legs: BetLeg[];
  totalOdds: number;
  modelWinProbability: number;
  expectedValue: number;
  recommendedStake: number;
  stakePercentage: number;
  riskLevel: 'Safe' | 'Medium' | 'Risky';
  confidenceScore: number;
  overallReasoning: string;
  sources?: GroundingSource[];
}

export interface BacktestTrade {
  date: string;
  matchups: string;
  selection: string;
  odds: number;
  stake: number;
  result: 'WIN' | 'LOSS';
  pnl: number;
  bankrollAfter: number;
  notes: string;
}

export interface BacktestResult {
  period: string;
  startingBankroll: number;
  targetBankroll: number;
  finalBankroll: number;
  totalTrades: number;
  wins: number;
  losses: number;
  roi: number;
  trades: BacktestTrade[];
  analysis: string;
  sources?: GroundingSource[];
}

export interface StrategyStep {
  stepNumber: number;
  date: string;
  plannedStake: number;
  projectedWin: number;
  parlayRecommendation?: ParlayRecommendation;
  status: 'ready' | 'pending_previous_win' | 'future_placeholder';
  note: string;
}

export interface StrategyPlan {
  createdAt: string;
  startingBankroll: number;
  targetBankroll: number;
  targetOdds: number;
  totalSteps: number;
  steps: StrategyStep[];
  analysis: string;
  sources?: GroundingSource[];
}

export type AnalysisMode = 'live' | 'backtest' | 'strategy_prep' | 'betslip_of_the_week' | 'one_shot_challenge' | 'one_shot_backtest' | 'correct_score';

export interface UserSettings {
  bankroll: number;
  targetBankroll: number;
  isGlobalScan: boolean;
  selectedLeagues: string[];
  preferredMarkets: MarketType[];
  maxLegs: number;
  targetDate: string;
  targetOdds: number;
  minConfidence: number;
  analysisMode: AnalysisMode;
  backtestDate?: string;
}

export type AppState = 'welcome' | 'setup' | 'searching' | 'analyzing' | 'results' | 'error' | 'backtesting' | 'backtest_results' | 'strategy_prep' | 'strategy_results' | 'betslip_results';
