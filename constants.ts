
import { MarketType } from "./types";

export const AVAILABLE_LEAGUES = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Champions League",
  "Europa League",
  "Conference League",
  "Championship",
  "Eredivisie",
  "Primeira Liga",
  "Süper Lig",
  "Scottish Premiership",
  "Belgian Pro League",
  "Austrian Bundesliga",
  "Swiss Super League",
  "Eliteserien", // Norway
  "Allsvenskan", // Sweden
  "Superliga", // Denmark
  "Greek Super League",
  "Cypriot First Division", // Cyprus
  "Polish Ekstraklasa",
  "Brasileirão Série A",
  "Primera División Argentina",
  "Major League Soccer",
  "Liga MX",
  "J1 League",
  "A-League",
  "Saudi Pro League"
];

export const AVAILABLE_MARKETS: MarketType[] = [
  "Double Chance",
  "Over/Under",
  "BTTS",
  "Match Winner"
];

export const DEFAULT_BANKROLL = 1000;

export const RISK_COLORS = {
  Safe: "text-emerald-400 border-emerald-400/20 bg-emerald-400/10",
  Medium: "text-yellow-400 border-yellow-400/20 bg-yellow-400/10",
  Risky: "text-rose-400 border-rose-400/20 bg-rose-400/10",
};
