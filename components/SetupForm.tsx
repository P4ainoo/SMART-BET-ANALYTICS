import React, { useState } from 'react';
import { AVAILABLE_LEAGUES, AVAILABLE_MARKETS } from '../constants';
import { UserSettings, MarketType } from '../types';
import { Settings, DollarSign, Trophy, ArrowRight, Target, Layers, Calendar, Crosshair } from 'lucide-react';

interface SetupFormProps {
  onComplete: (settings: UserSettings) => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({ onComplete }) => {
  const [bankroll, setBankroll] = useState<string>('1000');
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>(['Premier League', 'La Liga']);
  const [preferredMarkets, setPreferredMarkets] = useState<MarketType[]>(['Match Winner', 'Over/Under']);
  const [maxLegs, setMaxLegs] = useState<number>(3);
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [targetOdds, setTargetOdds] = useState<string>('2.5');

  const toggleLeague = (league: string) => {
    if (selectedLeagues.includes(league)) {
      setSelectedLeagues(selectedLeagues.filter(l => l !== league));
    } else {
      setSelectedLeagues([...selectedLeagues, league]);
    }
  };

  const toggleMarket = (market: MarketType) => {
    if (preferredMarkets.includes(market)) {
      setPreferredMarkets(preferredMarkets.filter(m => m !== market));
    } else {
      setPreferredMarkets([...preferredMarkets, market]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(bankroll);
    const odds = parseFloat(targetOdds);

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid bankroll amount.");
      return;
    }
    if (isNaN(odds) || odds < 1.01) {
      alert("Please enter valid target odds (must be greater than 1.0).");
      return;
    }
    if (selectedLeagues.length === 0) {
      alert("Please select at least one league.");
      return;
    }
    if (preferredMarkets.length === 0) {
      alert("Please select at least one betting market.");
      return;
    }
    if (!targetDate) {
      alert("Please select a date for analysis.");
      return;
    }
    onComplete({ bankroll: amount, selectedLeagues, preferredMarkets, maxLegs, targetDate, targetOdds: odds });
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 mb-4">
          <Settings size={32} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Configuration</h2>
        <p className="text-slate-400">Customize your analysis parameters and risk profile.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bankroll Section */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-400" />
              Current Bankroll
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                value={bankroll}
                onChange={(e) => setBankroll(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-8 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="1000"
              />
            </div>
          </div>

          {/* Target Odds Section */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Crosshair size={16} className="text-red-400" />
              Target Total Odds
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={targetOdds}
                onChange={(e) => setTargetOdds(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="2.50"
              />
            </div>
          </div>

          {/* Date Selection */}
          <div>
             <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Calendar size={16} className="text-blue-400" />
              Match Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Max Legs Section */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Layers size={16} className="text-purple-400" />
              Max Parlay Legs: <span className="text-white font-bold">{maxLegs}</span>
            </label>
            <input 
              type="range" 
              min="2" 
              max="5" 
              value={maxLegs} 
              onChange={(e) => setMaxLegs(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>2 Legs</span>
              <span>5 Legs</span>
            </div>
          </div>

           {/* Markets Section */}
           <div>
             <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <Target size={16} className="text-rose-400" />
                Preferred Markets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_MARKETS.map((market) => (
                  <button
                    key={market}
                    type="button"
                    onClick={() => toggleMarket(market)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border text-left flex items-center gap-2 ${
                      preferredMarkets.includes(market)
                        ? 'bg-slate-700 border-blue-500 text-blue-400'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${preferredMarkets.includes(market) ? 'bg-blue-400' : 'bg-slate-600'}`}></div>
                    {market}
                  </button>
                ))}
              </div>
           </div>
        </div>


        {/* Leagues Section */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <Trophy size={16} className="text-yellow-400" />
            Target Leagues
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AVAILABLE_LEAGUES.map((league) => (
              <button
                key={league}
                type="button"
                onClick={() => toggleLeague(league)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  selectedLeagues.includes(league)
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                {league}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          Start Analysis <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
};