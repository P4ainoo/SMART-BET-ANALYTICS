import React, { useState } from 'react';
import { AppState, UserSettings, MatchData, ParlayRecommendation } from './types';
import { SetupForm } from './components/SetupForm';
import { ParlayCard } from './components/ParlayCard';
import { LoadingScreen } from './components/LoadingScreen';
import { fetchUpcomingMatches, analyzeAndGenerateParlays } from './services/geminiService';
import { ShieldAlert, BarChart2, RefreshCw, Calendar, Settings2 } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>('setup');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [parlays, setParlays] = useState<ParlayRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSetupComplete = async (userSettings: UserSettings) => {
    setSettings(userSettings);
    setState('searching');
    setError(null);

    try {
      // Step 1: Search
      const { matches: foundMatches, rawContext } = await fetchUpcomingMatches(
        userSettings.selectedLeagues, 
        userSettings.targetDate
      );
      setMatches(foundMatches);
      
      if (foundMatches.length === 0) {
        setError("No upcoming matches found for selected leagues on this date. Try a different date.");
        setState('error');
        return;
      }

      // Step 2: Analyze
      setState('analyzing');
      const recommendations = await analyzeAndGenerateParlays(rawContext, userSettings);
      setParlays(recommendations);
      setState('results');

    } catch (err) {
      console.error(err);
      setError("Something went wrong during the AI analysis. Please check your API key or try again.");
      setState('error');
    }
  };

  const handleReset = () => {
    setState('setup');
    setSettings(null);
    setMatches([]);
    setParlays([]);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BarChart2 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">SmartBet Analytics</h1>
              <span className="text-xs text-blue-400 font-mono uppercase tracking-widest">AI-Powered Value Finder</span>
            </div>
          </div>
          {state === 'results' && (
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <Settings2 size={16} /> Adjust Parameters
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {state === 'setup' && (
            <div className="mt-8">
              <SetupForm onComplete={handleSetupComplete} />
            </div>
          )}

          {(state === 'searching' || state === 'analyzing') && (
            <div className="mt-12">
              <LoadingScreen stage={state} />
            </div>
          )}

          {state === 'error' && (
            <div className="mt-12 text-center">
              <div className="inline-flex bg-red-500/10 p-4 rounded-full mb-4">
                <ShieldAlert className="text-red-500" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
              <p className="text-slate-400 mb-6">{error}</p>
              <button 
                onClick={handleReset}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {state === 'results' && (
            <div className="space-y-8">
              {/* Summary Bar */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                 <div className="flex items-center gap-3 text-slate-300">
                    <div className="bg-slate-700 p-2 rounded-md">
                        <Calendar size={20} />
                    </div>
                    <span className="text-sm">
                        Analyzed <strong className="text-white">{matches.length}</strong> matches 
                        across {settings?.selectedLeagues.length} leagues for {settings?.targetDate}.
                    </span>
                 </div>
                 <div className="flex gap-4 text-sm text-slate-400">
                    <div>
                        Markets: <span className="text-white">{settings?.preferredMarkets.length} selected</span>
                    </div>
                    <div>
                        Max Legs: <span className="text-white">{settings?.maxLegs}</span>
                    </div>
                    <div>
                        Bankroll: <span className="text-emerald-400 font-mono font-bold">${settings?.bankroll}</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {parlays.map((parlay, idx) => (
                  <div key={idx} className="h-full">
                    <ParlayCard parlay={parlay} />
                  </div>
                ))}
              </div>

              {parlays.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-400">No high-value parlays found matching your specific criteria and safety thresholds.</p>
                    <button onClick={handleReset} className="mt-4 text-blue-400 hover:underline">Adjust settings</button>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Footer: Responsible Gambling */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-rose-500 font-bold mb-3 uppercase tracking-widest text-sm">
            <ShieldAlert size={16} />
            Responsible Gambling Warning
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">
            This tool uses artificial intelligence to analyze historical data and statistical probabilities. 
            <strong>It is not a crystal ball and cannot predict the future.</strong> 
            Sports betting involves significant risk. Never bet money you cannot afford to lose. 
            The "Recommended Stake" is a mathematical suggestion based on bankroll management principles, not a guarantee of safety.
            If you or someone you know has a gambling problem, please seek help immediately.
          </p>
        </div>
      </footer>
    </div>
  );
}