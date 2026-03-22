import React from 'react';
import { ShieldCheck, ArrowRight, TrendingUp, Zap, Target, Binary } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
          <div className="relative bg-gradient-to-br from-emerald-500 to-teal-700 w-full h-full rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 border-4 border-slate-800">
            <ShieldCheck className="text-white w-12 h-12" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            BankerPro <span className="text-emerald-400">Analytics</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">
            AI-Powered Betting Intelligence
          </p>
        </div>

        {/* Description */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm text-left space-y-4 shadow-xl">
          <p className="text-slate-300 text-sm leading-relaxed">
            Welcome to the next generation of sports analytics. BankerPro uses advanced AI to scan global football markets, identify high-value opportunities, and construct mathematically optimized betting strategies.
          </p>
          
          <ul className="space-y-3 mt-4">
            <li className="flex items-start gap-3">
              <div className="bg-blue-500/20 p-1.5 rounded-lg text-blue-400 mt-0.5">
                <Zap size={16} />
              </div>
              <div>
                <span className="text-white font-semibold text-sm block">Live Market Scanning</span>
                <span className="text-slate-400 text-xs">Real-time analysis of upcoming fixtures.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-400 mt-0.5">
                <TrendingUp size={16} />
              </div>
              <div>
                <span className="text-white font-semibold text-sm block">Bankroll Management</span>
                <span className="text-slate-400 text-xs">Calculated staking plans to protect your capital.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-rose-500/20 p-1.5 rounded-lg text-rose-400 mt-0.5">
                <Target size={16} />
              </div>
              <div>
                <span className="text-white font-semibold text-sm block">Multiple Strategies</span>
                <span className="text-slate-400 text-xs">From safe bankers to high-risk one-shot challenges.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-purple-500/20 p-1.5 rounded-lg text-purple-400 mt-0.5">
                <Binary size={16} />
              </div>
              <div>
                <span className="text-white font-semibold text-sm block">Historical Backtesting</span>
                <span className="text-slate-400 text-xs">Simulate strategies against past data.</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Action Button */}
        <button
          onClick={onStart}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg py-4 px-8 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
        >
          Initialize Engine <ArrowRight size={20} />
        </button>

        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
          18+ • Play Responsibly
        </p>
      </div>
    </div>
  );
};
