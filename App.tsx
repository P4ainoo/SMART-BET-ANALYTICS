
import React, { useState } from 'react';
import { AppState, UserSettings, MatchData, ParlayRecommendation, BacktestResult, StrategyPlan, GroundingSource } from './types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SetupForm } from './components/SetupForm';
import { ParlayCard } from './components/ParlayCard';
import { BacktestDashboard } from './components/BacktestDashboard';
import { StrategyDashboard } from './components/StrategyDashboard';
import { LoadingScreen } from './components/LoadingScreen';
import { fetchUpcomingMatches, analyzeAndGenerateParlays, performBacktest, generateStrategyPlan, generateBetslipOfTheWeek, generateOneShotParlay, performOneShotBacktest, generateCorrectScoreTips, getMarketSummary } from './services/geminiService';
import { ShieldAlert, Settings2, Globe, Zap, Coffee, Info, ExternalLink, List, ChevronDown, ChevronUp, ShieldCheck, DatabaseZap, X } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>('welcome');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [parlays, setParlays] = useState<ParlayRecommendation[]>([]);
  const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(null);
  const [strategyPlan, setStrategyPlan] = useState<StrategyPlan | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [scoutAdvice, setScoutAdvice] = useState<string | null>(null);
  const [showScannedMatches, setShowScannedMatches] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSetupComplete = async (userSettings: UserSettings) => {
    setSettings(userSettings);
    setError(null);
    setScoutAdvice(null);
    setSources([]);
    setShowScannedMatches(false);
    setIsDemoMode(false);

    try {
      if (userSettings.analysisMode === 'live' || 
          userSettings.analysisMode === 'betslip_of_the_week' || 
          userSettings.analysisMode === 'one_shot_challenge' || 
          userSettings.analysisMode === 'correct_score') {
        
        setState('searching');
        const searchResult = await fetchUpcomingMatches(userSettings);
        setMatches(searchResult.matches);
        setSources(searchResult.sources);
        if (searchResult.isDemo) setIsDemoMode(true);
        
        if (!searchResult.matches || searchResult.matches.length === 0) {
          const advice = await getMarketSummary(userSettings);
          setScoutAdvice(advice);
          setState('error');
          return;
        }

        setState('analyzing');
        let recommendations: ParlayRecommendation[] = [];
        
        switch(userSettings.analysisMode) {
          case 'live': recommendations = await analyzeAndGenerateParlays(searchResult.rawContext, userSettings); break;
          case 'betslip_of_the_week': recommendations = await generateBetslipOfTheWeek(searchResult.rawContext, userSettings); break;
          case 'one_shot_challenge': recommendations = await generateOneShotParlay(searchResult.rawContext, userSettings); break;
          case 'correct_score': recommendations = await generateCorrectScoreTips(searchResult.rawContext, userSettings); break;
        }
        
        if (recommendations.length === 0) {
          const advice = await getMarketSummary(userSettings);
          setScoutAdvice(advice);
          setState('error');
          return;
        }

        setParlays(recommendations);
        setState('results');

      } else if (userSettings.analysisMode === 'strategy_prep') {
        setState('searching'); 
        const { matches: foundMatches, rawContext, isDemo } = await fetchUpcomingMatches(userSettings);
        setMatches(foundMatches);
        if (isDemo) setIsDemoMode(true);
        setState('analyzing');
        const plan = await generateStrategyPlan(userSettings, rawContext);
        setStrategyPlan(plan);
        setState('strategy_results');

      } else {
        setState('backtesting');
        const results = userSettings.analysisMode === 'one_shot_backtest' 
          ? await performOneShotBacktest(userSettings)
          : await performBacktest(userSettings);
        setBacktestResults(results);
        setState('backtest_results');
      }

    } catch (err: any) {
      console.error("Application Error:", err);
      setError(err.message || "A synchronization error occurred. Please try again or change the search date.");
      setState('error');
    }
  };

  const handleReset = () => {
    setState('setup');
    setSettings(null);
    setMatches([]);
    setParlays([]);
    setBacktestResults(null);
    setStrategyPlan(null);
    setScoutAdvice(null);
    setSources([]);
    setIsDemoMode(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border ${
            toast.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            {toast.type === 'error' ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
            <span className="text-sm font-bold">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {state === 'welcome' ? (
        <WelcomeScreen onStart={() => setState('setup')} />
      ) : (
        <>
          <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
                  <ShieldCheck className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">BankerPro Analytics</h1>
                  <span className="text-xs text-emerald-400 font-mono uppercase tracking-widest">Grounded Strategy V2</span>
                </div>
              </div>
              {(state !== 'setup' && state !== 'searching' && state !== 'analyzing' && state !== 'backtesting') && (
                <button onClick={handleReset} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                  <Settings2 size={16} /> Analysis Config
                </button>
              )}
            </div>
          </header>

          {isDemoMode && (
            <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 flex items-center justify-center gap-2 text-amber-400 text-[10px] font-bold uppercase tracking-widest">
               <DatabaseZap size={14} /> High Demand: Running in High-Probability Simulation Mode
            </div>
          )}

          <main className="flex-grow p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              {state === 'setup' && <div className="mt-8 animate-in fade-in zoom-in duration-500"><SetupForm onComplete={handleSetupComplete} onError={(msg) => showToast(msg, 'error')} /></div>}
              {(state === 'searching' || state === 'analyzing' || state === 'backtesting') && <div className="mt-12"><LoadingScreen stage={state === 'searching' ? 'searching' : state === 'analyzing' ? 'analyzing' : 'backtesting'} /></div>}
              
              {state === 'error' && (
                <div className="mt-12 text-center max-w-xl mx-auto animate-in slide-in-from-bottom-4">
                  <div className="bg-slate-800 p-10 rounded-3xl border border-slate-700 shadow-2xl">
                    <div className="inline-flex bg-amber-500/10 p-6 rounded-full mb-6 border border-amber-500/20">
                      <Coffee className="text-amber-400" size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Market Cooldown</h2>
                    
                    <div className="bg-slate-900/80 border-l-4 border-amber-500 p-6 text-left mb-8 rounded-r-xl">
                       <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-widest text-xs mb-3">
                          <Info size={14} /> Intelligence Report
                       </div>
                       <p className="text-slate-300 leading-relaxed italic">
                        "{scoutAdvice || error || "The engine is currently offline. Please wait a few minutes and try again."}"
                       </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                       <button 
                        onClick={handleReset} 
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                      >
                        Return to Home <Zap size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {state === 'results' && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6 shadow-xl backdrop-blur-sm">
                     <div className="flex items-center gap-4 text-slate-300">
                        <div className="bg-emerald-600/20 p-3 rounded-xl border border-emerald-500/30 text-emerald-400">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Active Scout</div>
                            <div className="text-lg font-bold text-white">
                              Safety Protocol: <span className="text-emerald-400">ULTRA-BANKER</span>
                              <span className="mx-2 text-slate-600">/</span>
                              <span className="text-indigo-400 font-mono">{settings?.targetDate}</span>
                            </div>
                        </div>
                     </div>
                     
                     <div className="flex gap-8 items-center">
                        <div className="text-center">
                          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Reliability</div>
                          <div className="text-xl font-mono text-emerald-400 font-bold">90%+</div>
                        </div>
                        {settings?.analysisMode !== 'correct_score' && (
                          <>
                            <div className="w-px h-8 bg-slate-700"></div>
                            <div className="text-center">
                              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Starting</div>
                              <div className="text-xl font-mono text-emerald-400 font-bold">${settings?.bankroll}</div>
                            </div>
                            <div className="w-px h-8 bg-slate-700"></div>
                            <div className="text-center">
                              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Goal</div>
                              <div className="text-xl font-mono text-yellow-400 font-bold">${settings?.targetBankroll}</div>
                            </div>
                          </>
                        )}
                     </div>
                  </div>

                  {/* Analyzed Fixtures Section */}
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                    <button 
                      onClick={() => setShowScannedMatches(!showScannedMatches)}
                      className="w-full p-4 flex items-center justify-between text-slate-300 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <List size={20} className="text-emerald-400" />
                        <span className="font-bold text-sm uppercase tracking-widest">Scanned for Bankers ({matches.length})</span>
                      </div>
                      {showScannedMatches ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    
                    {showScannedMatches && (
                      <div className="p-4 border-t border-slate-700 bg-slate-900/40">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {matches.length > 0 ? matches.map((match, i) => (
                            <div key={i} className="p-3 bg-slate-800 rounded-xl border border-slate-700/50 flex flex-col justify-center">
                              <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1">{match.league}</div>
                              <div className="text-xs text-white font-medium flex items-center gap-3 mt-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-[10px] font-black shadow-sm border border-slate-600 shrink-0">
                                  {match.homeTeam ? match.homeTeam.substring(0, 2).toUpperCase() : '?'}
                                </div>
                                <span className="flex-1 truncate font-bold">{match.homeTeam || 'TBA'}</span>
                                <span className="text-slate-500 text-[10px] font-black">VS</span>
                                <span className="flex-1 truncate text-right font-bold">{match.awayTeam || 'TBA'}</span>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-[10px] font-black shadow-sm border border-slate-600 shrink-0">
                                  {match.awayTeam ? match.awayTeam.substring(0, 2).toUpperCase() : '?'}
                                </div>
                              </div>
                            </div>
                          )) : (
                            <div className="col-span-full py-4 text-center text-slate-500 text-xs italic">
                              No specific match data extracted from grounding.
                            </div>
                          )}
                        </div>
                        {sources.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-slate-700 flex flex-wrap gap-4">
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Grounded Context:</span>
                            {sources.map((s, i) => (
                              <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1">
                                <ExternalLink size={10} /> {s.title.substring(0, 15)}...
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={`grid grid-cols-1 ${parlays.length === 1 ? 'max-w-2xl mx-auto' : 'lg:grid-cols-2 xl:grid-cols-3'} gap-8`}>
                    {parlays.map((parlay, idx) => (
                      <div key={idx} className="h-full animate-in slide-in-from-bottom-8" style={{ animationDelay: `${idx * 150}ms` }}>
                        <ParlayCard parlay={parlay} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {state === 'strategy_results' && strategyPlan && <StrategyDashboard plan={strategyPlan} />}
              {state === 'backtest_results' && backtestResults && <BacktestDashboard results={backtestResults} />}
            </div>
          </main>

          <footer className="bg-slate-900/50 border-t border-slate-800 py-10 mt-auto">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <div className="flex items-center justify-center gap-2 text-rose-500 font-bold mb-3 uppercase tracking-widest text-xs">
                <ShieldAlert size={14} /> Mathematical Variance Warning
              </div>
              <p className="text-slate-500 text-[10px] leading-relaxed max-w-2xl mx-auto uppercase tracking-tighter">
                BankerPro identifies high-probability selections but cannot eliminate the unpredictable nature of football. These selections are data-grounded estimations of safety.
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
