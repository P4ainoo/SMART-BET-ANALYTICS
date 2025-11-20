import React from 'react';
import { Search, BrainCircuit, Database } from 'lucide-react';

interface LoadingScreenProps {
  stage: 'searching' | 'analyzing';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ stage }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div className="relative mb-8">
        {/* Animated Rings */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping"></div>
        <div className="relative z-10 w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-2xl">
          {stage === 'searching' ? (
            <Search className="text-blue-400 animate-pulse" size={40} />
          ) : (
            <BrainCircuit className="text-purple-400 animate-pulse" size={40} />
          )}
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">
        {stage === 'searching' ? 'Scouting Matches...' : 'Running Simulation Models...'}
      </h3>
      <p className="text-slate-400 max-w-md mb-8">
        {stage === 'searching' 
          ? 'Accessing global sports data to find real-time fixtures and form guides for your selected leagues.'
          : 'Gemini 3.0 Pro is thinking... Calculating xG, analyzing implied odds, and finding value edges.'}
      </p>

      {/* Step Indicator */}
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 ${stage === 'searching' ? 'text-blue-400' : 'text-emerald-400 opacity-50'}`}>
            <Database size={16} />
            <span className="text-sm font-medium">Data Retrieval</span>
        </div>
        <div className="w-8 h-px bg-slate-700"></div>
        <div className={`flex items-center gap-2 ${stage === 'analyzing' ? 'text-purple-400' : 'text-slate-600'}`}>
            <BrainCircuit size={16} />
            <span className="text-sm font-medium">AI Analysis</span>
        </div>
      </div>
    </div>
  );
};
