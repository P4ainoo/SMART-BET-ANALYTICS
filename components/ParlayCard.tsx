
import React from 'react';
import { ParlayRecommendation } from '../types';
import { RISK_COLORS } from '../constants';
import { TrendingUp, ShieldCheck, History, Info, ExternalLink } from 'lucide-react';

interface ParlayCardProps {
  parlay: ParlayRecommendation;
}

export const ParlayCard: React.FC<ParlayCardProps> = ({ parlay }) => {
  const riskStyle = RISK_COLORS[parlay?.riskLevel] || RISK_COLORS['Medium'];
  
  if (!parlay) return null;

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-300 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-700/50 flex justify-between items-start bg-slate-800/50">
        <div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border ${riskStyle}`}>
            <ShieldCheck size={12} />
            {parlay.riskLevel || 'Medium'} Risk
          </div>
          <h3 className="text-white font-bold text-lg">
            Total Odds: <span className="text-blue-400 font-mono">{(parlay.totalOdds || 0).toFixed(2)}</span>
          </h3>
        </div>
        <div className="text-right">
          {parlay.expectedValue > 0 && (
            <>
              <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Expected Value</div>
              <div className={`text-lg font-mono font-bold ${parlay.expectedValue > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                {parlay.expectedValue > 0 ? '+' : ''}{parlay.expectedValue}%
              </div>
            </>
          )}
        </div>
      </div>

      {/* Legs */}
      <div className="p-4 md:p-5 space-y-6 flex-grow">
        {parlay.legs?.map((leg, idx) => {
          const matchIdStr = leg.matchId || '';
          const teams = matchIdStr?.split(' vs ') || ['Home', 'Away'];
          const homeTeam = teams[0] || 'Home';
          const awayTeam = teams[1] || 'Away';

          return (
            <div key={idx} className="relative pl-3 md:pl-4 border-l-2 border-slate-600">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                <div className="flex items-center gap-2 bg-slate-900/50 px-2 md:px-3 py-2 rounded-xl border border-slate-700/50 shadow-inner w-full">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-[9px] md:text-[10px] font-black text-white shadow-sm border border-slate-600 shrink-0">
                    {homeTeam.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs md:text-sm text-slate-200 font-bold truncate flex-1">{homeTeam}</span>
                  <span className="text-[9px] md:text-[10px] text-slate-500 font-black px-1 shrink-0">VS</span>
                  <span className="text-xs md:text-sm text-slate-200 font-bold truncate flex-1 text-right">{awayTeam}</span>
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-[9px] md:text-[10px] font-black text-white shadow-sm border border-slate-600 shrink-0">
                    {awayTeam.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <span className="text-xs font-mono bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded self-start sm:self-center shrink-0">
                  {(leg.odds || 0).toFixed(2)}
                </span>
              </div>
              <div className="text-blue-300 font-semibold text-base md:text-lg mb-1">{leg.selection}</div>
              
              <p className="text-xs text-slate-400 leading-relaxed mb-2">{leg.reasoning}</p>
              
              {leg.historicalInsight && (
                 <div className="bg-slate-900/60 rounded p-2 flex gap-2 items-start border border-slate-700/50">
                    <History size={14} className="text-purple-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-slate-300 italic">{leg.historicalInsight}</span>
                 </div>
              )}

              {leg.edge && leg.edge > 2 && (
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                  <TrendingUp size={10} />
                  {leg.edge.toFixed(1)}% Value Edge
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats & Stake */}
      <div className="bg-slate-900/50 p-5 border-t border-slate-700/50">
        <div className="mb-3">
           <div className="flex items-center gap-1.5 mb-1 text-slate-500 text-xs font-bold uppercase">
              <Info size={12} /> Strategy
           </div>
          <p className="text-xs text-slate-400 italic leading-relaxed mb-4">
            "{parlay.overallReasoning && parlay.overallReasoning.length > 120 ? parlay.overallReasoning.substring(0, 120) + '...' : parlay.overallReasoning || 'No details provided.'}"
          </p>

          {parlay.sources && parlay.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-700/30">
               <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Verified Sources</div>
               <div className="flex flex-wrap gap-2">
                 {parlay.sources.slice(0, 3).map((source, i) => (
                   <a 
                    key={i} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded hover:bg-blue-500/20 transition-colors"
                   >
                     {source.title.length > 15 ? source.title.substring(0, 15) + '...' : source.title}
                     <ExternalLink size={8} />
                   </a>
                 ))}
               </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex flex-col">
             <span className="text-xs text-slate-400 mb-1">Confidence Score</span>
             <div className="flex items-center gap-1">
                <div className="h-1.5 w-16 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${(parlay.confidenceScore || 0) * 10}%` }}></div>
                </div>
                <span className="text-xs text-blue-400 font-bold">{parlay.confidenceScore || 0}/10</span>
             </div>
          </div>

          {parlay.recommendedStake > 0 && (
            <div className="text-right">
               <span className="text-xs text-slate-400 block mb-1">Rec. Stake</span>
               <div className="text-xl font-bold text-white font-mono flex items-center justify-end gap-1">
                 <span className="text-slate-500 text-sm">$</span>
                 {(parlay.recommendedStake || 0).toFixed(2)}
               </div>
               <span className="text-[10px] text-slate-500 block">
                 ({(parlay.stakePercentage || 0).toFixed(1)}% of Bankroll)
               </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
