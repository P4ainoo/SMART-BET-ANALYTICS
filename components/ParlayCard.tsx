import React from 'react';
import { ParlayRecommendation } from '../types';
import { RISK_COLORS } from '../constants';
import { TrendingUp, ShieldCheck, History, Info } from 'lucide-react';

interface ParlayCardProps {
  parlay: ParlayRecommendation;
}

export const ParlayCard: React.FC<ParlayCardProps> = ({ parlay }) => {
  const riskStyle = RISK_COLORS[parlay.riskLevel] || RISK_COLORS['Medium'];

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-300 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-700/50 flex justify-between items-start bg-slate-800/50">
        <div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border ${riskStyle}`}>
            <ShieldCheck size={12} />
            {parlay.riskLevel} Risk
          </div>
          <h3 className="text-white font-bold text-lg">
            Total Odds: <span className="text-blue-400 font-mono">{parlay.totalOdds.toFixed(2)}</span>
          </h3>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Expected Value</div>
          <div className={`text-lg font-mono font-bold ${parlay.expectedValue > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
            {parlay.expectedValue > 0 ? '+' : ''}{parlay.expectedValue}%
          </div>
        </div>
      </div>

      {/* Legs */}
      <div className="p-5 space-y-6 flex-grow">
        {parlay.legs.map((leg, idx) => (
          <div key={idx} className="relative pl-4 border-l-2 border-slate-600">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm text-slate-300 font-bold">{leg.matchId}</span>
              <span className="text-xs font-mono bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                {leg.odds.toFixed(2)}
              </span>
            </div>
            <div className="text-blue-300 font-semibold text-lg mb-1">{leg.selection}</div>
            
            <p className="text-xs text-slate-400 leading-relaxed mb-2">{leg.reasoning}</p>
            
            {/* Historical Insight Section */}
            {leg.historicalInsight && (
               <div className="bg-slate-900/60 rounded p-2 flex gap-2 items-start border border-slate-700/50">
                  <History size={14} className="text-purple-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-300 italic">{leg.historicalInsight}</span>
               </div>
            )}

            {leg.edge > 2 && (
              <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <TrendingUp size={10} />
                {leg.edge.toFixed(1)}% Value Edge
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stats & Stake */}
      <div className="bg-slate-900/50 p-5 border-t border-slate-700/50">
        <div className="mb-3">
           <div className="flex items-center gap-1.5 mb-1 text-slate-500 text-xs font-bold uppercase">
              <Info size={12} /> Strategy
           </div>
          <p className="text-xs text-slate-400 italic leading-relaxed">
            "{parlay.overallReasoning.length > 120 ? parlay.overallReasoning.substring(0, 120) + '...' : parlay.overallReasoning}"
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex flex-col">
             <span className="text-xs text-slate-400 mb-1">Model Confidence</span>
             <div className="flex items-center gap-1">
                <div className="h-1.5 w-16 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${parlay.confidenceScore * 10}%` }}></div>
                </div>
                <span className="text-xs text-blue-400 font-bold">{parlay.confidenceScore}/10</span>
             </div>
          </div>

          <div className="text-right">
             <span className="text-xs text-slate-400 block mb-1">Recommended Stake</span>
             <div className="text-xl font-bold text-white font-mono flex items-center justify-end gap-1">
               <span className="text-slate-500 text-sm">$</span>
               {parlay.recommendedStake.toFixed(2)}
             </div>
             <span className="text-[10px] text-slate-500 block">
               ({parlay.stakePercentage.toFixed(1)}% of Bankroll)
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};