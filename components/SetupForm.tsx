
import React, { useState } from 'react';
import { AVAILABLE_LEAGUES } from '../constants';
import { UserSettings, MarketType, AnalysisMode } from '../types';
import { Settings, DollarSign, Globe, ArrowRight, Target, Calendar, Gauge, History, Zap, Map, ScrollText, Flag, Rocket, Binary, ShieldCheck } from 'lucide-react';

interface SetupFormProps {
  onComplete: (settings: UserSettings) => void;
  onError: (message: string) => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({ onComplete, onError }) => {
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('live');
  const [bankroll, setBankroll] = useState<string>('10');
  const [targetBankroll, setTargetBankroll] = useState<string>('1000');
  const [isGlobalScan, setIsGlobalScan] = useState<boolean>(true);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>(['Premier League', 'La Liga']);
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString()?.split('T')[0] || '');
  const [backtestDate, setBacktestDate] = useState<string>(new Date(Date.now() - 86400000).toISOString()?.split('T')[0] || '');
  const [minConfidence, setMinConfidence] = useState<number>(9);

  const toggleLeague = (league: string) => {
    if (selectedLeagues.includes(league)) {
      setSelectedLeagues(selectedLeagues.filter(l => l !== league));
    } else {
      setSelectedLeagues([...selectedLeagues, league]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(bankroll);
    const targetAmount = parseFloat(targetBankroll);

    if (analysisMode !== 'correct_score') {
      if (isNaN(amount) || amount <= 0) return onError("Enter valid bankroll.");
    }
    
    if (['one_shot_challenge', 'strategy_prep', 'backtest', 'one_shot_backtest'].includes(analysisMode)) {
      if (isNaN(targetAmount) || targetAmount <= amount) return onError("Target must be higher than bankroll.");
    }

    if (!isGlobalScan && selectedLeagues.length === 0) return onError("Select at least one league or enable Global Scan.");

    // Target odds are now derived from the goal for One Shot, or set to a safe default for Live Banker mode.
    const calculatedOdds = (analysisMode === 'one_shot_challenge' || analysisMode === 'one_shot_backtest') 
      ? (targetAmount / amount) 
      : 1.8; // Default "Banker" target for safety

    onComplete({ 
      bankroll: amount,
      targetBankroll: targetAmount,
      isGlobalScan,
      selectedLeagues: isGlobalScan ? [] : selectedLeagues, 
      preferredMarkets: ['Double Chance', 'Over/Under'], 
      maxLegs: 2, 
      targetDate, 
      targetOdds: calculatedOdds,
      minConfidence,
      analysisMode,
      backtestDate
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-600/20 text-emerald-400 mb-4">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Banker Engine Pro</h2>
        <p className="text-slate-400">AI-optimized for safest paths to your target goal.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Mode Toggle */}
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 lg:grid-cols-7 gap-2 snap-x hide-scrollbar">
          {[
            { id: 'live', icon: <Zap size={16}/>, label: 'Live', color: 'bg-blue-600' },
            { id: 'betslip_of_the_week', icon: <ScrollText size={16}/>, label: 'Week Slip', color: 'bg-amber-600' },
            { id: 'correct_score', icon: <Binary size={16}/>, label: 'Scores', color: 'bg-cyan-600' },
            { id: 'one_shot_challenge', icon: <Rocket size={16}/>, label: 'One Shot', color: 'bg-rose-600' },
            { id: 'strategy_prep', icon: <Map size={16}/>, label: 'Strategy', color: 'bg-emerald-600' },
            { id: 'backtest', icon: <History size={16}/>, label: 'Backtest', color: 'bg-purple-600' },
            { id: 'one_shot_backtest', icon: <History size={16}/>, label: 'Shot Hist', color: 'bg-pink-600' }
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setAnalysisMode(mode.id as AnalysisMode)}
              className={`snap-start shrink-0 w-28 md:w-auto py-3 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all border ${
                analysisMode === mode.id ? `${mode.color} border-transparent text-white shadow-lg` : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {mode.icon} {mode.label}
            </button>
          ))}
        </div>

        {/* Global Scan Toggle */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isGlobalScan ? 'bg-emerald-600/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                <Globe size={20} />
              </div>
              <div>
                <div className="font-bold text-white">Universal Banker Scan</div>
                <div className="text-xs text-slate-500">Scanning all leagues for 90%+ probability banker legs.</div>
              </div>
           </div>
           <button 
              type="button"
              onClick={() => setIsGlobalScan(!isGlobalScan)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isGlobalScan ? 'bg-emerald-600' : 'bg-slate-700'}`}
           >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isGlobalScan ? 'left-7' : 'left-1'}`}></div>
           </button>
        </div>

        {analysisMode !== 'correct_score' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <DollarSign size={16} className="text-emerald-400" /> Current Bankroll
              </label>
              <input
                type="number"
                value={bankroll}
                onChange={(e) => setBankroll(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white font-mono text-lg focus:ring-2 focus:ring-emerald-500/50 outline-none"
                placeholder="e.g. 10"
              />
            </div>

            {['one_shot_challenge', 'strategy_prep', 'backtest', 'one_shot_backtest'].includes(analysisMode) && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <Flag size={16} className="text-yellow-400" /> Target Goal
                </label>
                <input
                  type="number"
                  value={targetBankroll}
                  onChange={(e) => setTargetBankroll(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white font-mono text-lg focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  placeholder="e.g. 1000"
                />
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
             <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Calendar size={16} className="text-blue-400" />
              {analysisMode.includes('backtest') ? 'Historical Date' : 'Target Match Date'}
            </label>
            <input
              type="date"
              value={analysisMode.includes('backtest') ? backtestDate : targetDate}
              onChange={(e) => analysisMode.includes('backtest') ? setBacktestDate(e.target.value) : setTargetDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white [color-scheme:dark] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Gauge size={16} className="text-emerald-400" /> Risk Level: {minConfidence > 9 ? 'Strict Banker' : minConfidence > 8 ? 'Safe Path' : 'Standard'}
            </label>
            <input 
              type="range" min="7" max="10" value={minConfidence} 
              onChange={(e) => setMinConfidence(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg accent-emerald-500 mt-4"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-2 px-1">
              <span>Optimized (7)</span>
              <span>Ultra-Safe (10)</span>
            </div>
          </div>
        </div>

        {!isGlobalScan && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Target size={16} className="text-yellow-400" /> Targeted Leagues
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {AVAILABLE_LEAGUES.map((league) => (
                <button
                  key={league}
                  type="button"
                  onClick={() => toggleLeague(league)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    selectedLeagues.includes(league) ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}
                >
                  {league}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform active:scale-95"
        >
          {analysisMode === 'live' && 'Scan Live Bankers'}
          {analysisMode === 'betslip_of_the_week' && 'Generate Week Slip'}
          {analysisMode === 'correct_score' && 'Predict Correct Scores'}
          {analysisMode === 'one_shot_challenge' && 'Generate One Shot'}
          {analysisMode === 'strategy_prep' && 'Build Strategy Plan'}
          {analysisMode === 'backtest' && 'Run Historical Backtest'}
          {analysisMode === 'one_shot_backtest' && 'Run One Shot Backtest'}
          <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
};
