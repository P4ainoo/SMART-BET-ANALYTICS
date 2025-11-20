import { MarketType } from "./types";

export const AVAILABLE_LEAGUES = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Champions League",
  "Europa League"
];

export const AVAILABLE_MARKETS: MarketType[] = [
  "Match Winner",
  "Over/Under",
  "BTTS",
  "Double Chance"
];

export const DEFAULT_BANKROLL = 1000;

export const RISK_COLORS = {
  Safe: "text-emerald-400 border-emerald-400/20 bg-emerald-400/10",
  Medium: "text-yellow-400 border-yellow-400/20 bg-yellow-400/10",
  Risky: "text-rose-400 border-rose-400/20 bg-rose-400/10",
};