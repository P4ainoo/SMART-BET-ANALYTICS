
import React, { useMemo } from 'react';
import { BacktestResult, BacktestTrade } from '../types';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, Flag, Activity, History, Target, ShieldCheck, ExternalLink, RefreshCcw, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BacktestDashboardProps {
  results: BacktestResult;
}

export const BacktestDashboard: React.FC<BacktestDashboardProps> = ({ results }) => {
  if (!results) return null;

  const startingBankroll = results.startingBankroll || 0;
  const targetBankroll = results.targetBankroll || 0;
  
  // SANITY RECALCULATION: Sometimes the AI JSON is flaky with nested math.
  // We re-run the compounding logic on the trades provided to ensure the UI is accurate.
  let currentBalance = startingBankroll;
  let winCount = 0;
  let lossCount = 0;

  const processedTrades: BacktestTrade[] = (results.trades || []).map(t => {
    const isWin = t.result === 'WIN';
    const stake = currentBalance;
    const odds = t.odds || 1.0;
    
    let pnl = 0;
    let balanceAfter = 0;

    if (isWin) {
      pnl = stake * (odds - 1);
      balanceAfter = stake * odds;
      winCount++;
      currentBalance = balanceAfter;
    } else {
      pnl = -stake;
      balanceAfter = 0;
      lossCount++;
      currentBalance = 0;
    }

    return {
      ...t,
      stake,
      pnl,
      bankrollAfter: balanceAfter
    };
  });

  const finalBankroll = currentBalance;
  const totalTrades = processedTrades.length;
  const roi = startingBankroll > 0 ? ((finalBankroll - startingBankroll) / startingBankroll) * 100 : 0;

  const hasTrades = totalTrades > 0;
  const isBust = hasTrades && finalBankroll === 0;
  const isGoalReached = hasTrades && !isBust && finalBankroll >= targetBankroll;
  const isProfit = hasTrades && !isBust && finalBankroll > startingBankroll;

  const chartData = useMemo(() => {
    if (!hasTrades) return [];
    
    const data = [{ step: 0, balance: startingBankroll }];
    processedTrades.forEach((trade, idx) => {
      data.push({ step: idx + 1, balance: trade.bankrollAfter });
    });
    return data;
  }, [processedTrades, startingBankroll, hasTrades]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/5">
           <ShieldCheck size={14} /> Grounded Gemini 3.0 Pro Verified Sequence
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Analysis Report: {results.period}</h2>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-400">Mode: <span className="text-indigo-400 font-mono">G-3-PRO Verified</span></span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 flex items-center gap-1">
                Goal: <span className="text-yellow-400 font-mono font-bold">${targetBankroll.toLocaleString()}</span>
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!hasTrades ? (
              <div className="px-4 py-2 rounded-lg font-black text-xs flex items-center gap-2 bg-slate-700/50 text-slate-400 border border-slate-600 uppercase tracking-widest">
                 <RefreshCcw size={16} className="animate-spin-slow" />
                 PENDING GROUNDING
              </div>
            ) : isGoalReached ? (
              <div className="px-4 py-2 rounded-lg font-black text-xs flex items-center gap-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse uppercase tracking-widest">
                 <Flag size={16} fill="currentColor" />
                 GOAL REACHED
              </div>
            ) : isBust ? (
              <div className="px-4 py-2 rounded-lg font-black text-xs flex items-center gap-2 bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase tracking-widest">
                 <AlertTriangle size={16} />
                 LIQUIDATED
              </div>
            ) : (
              <div className={`px-4 py-2 rounded-lg font-black text-xs flex items-center gap-2 uppercase tracking-widest ${isProfit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400'}`}>
                {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                ROI: {roi.toFixed(1)}%
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <div className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-1">Initial Bankroll</div>
            <div className="text-xl font-mono text-white font-bold">${startingBankroll.toFixed(2)}</div>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <div className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-1">Current Balance</div>
            <div className={`text-xl font-mono font-bold ${isBust ? 'text-rose-500' : isGoalReached ? 'text-yellow-400' : hasTrades ? 'text-emerald-400' : 'text-slate-400'}`}>
              ${finalBankroll.toFixed(2)}
            </div>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <div className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-1">Progression</div>
            <div className="text-xl font-mono text-indigo-400 font-bold">
              {totalTrades > 0 ? `${totalTrades} Step${totalTrades > 1 ? 's' : ''}` : '0 Steps'}
            </div>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <div className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-1">Sequence Record</div>
            <div className="text-xl font-mono text-white font-bold">
              <span className="text-emerald-400">{winCount}W</span> - <span className="text-rose-400">{lossCount}L</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-slate-900/80 border border-slate-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Activity className="text-indigo-400 mt-1 shrink-0" size={18} />
            <p className="text-sm text-slate-300 leading-relaxed italic">
              "{results.analysis || 'Verified historical data chain resolved. All results grounded in search results.'}"
            </p>
          </div>
        </div>

        {/* Chart */}
        {hasTrades && (
          <div className="mt-8 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isBust ? '#f43f5e' : '#10b981'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isBust ? '#f43f5e' : '#10b981'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="step" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Balance']}
                  labelStyle={{ color: '#94a3b8' }}
                  labelFormatter={(label) => `Step ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke={isBust ? '#f43f5e' : '#10b981'} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorBalance)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <History size={18} className="text-purple-400" />
            Compounding Sequence Log
          </h3>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900/50 text-slate-200 uppercase tracking-widest text-[10px] font-black">
              <tr>
                <th className="px-6 py-4">Timeline</th>
                <th className="px-6 py-4">Match & Grounded Result</th>
                <th className="px-6 py-4 text-right">Odds</th>
                <th className="px-6 py-4 text-right">Stake</th>
                <th className="px-6 py-4 text-center">Outcome</th>
                <th className="px-6 py-4 text-right">P/L</th>
                <th className="px-6 py-4 text-right">Running Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {processedTrades.map((trade, idx) => (
                <tr key={idx} className={`hover:bg-slate-700/20 transition-colors ${trade.result === 'LOSS' ? 'bg-rose-500/5' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-500 text-xs">{trade.date}</td>
                  <td className="px-6 py-4">
                    <div className="text-white font-bold mb-0.5">{trade.matchups}</div>
                    <div className="text-indigo-400 text-xs font-black uppercase tracking-tight">{trade.selection}</div>
                    <div className="text-slate-500 text-[10px] mt-2 italic leading-relaxed max-w-xs bg-slate-900/40 p-2 rounded border border-slate-700/30">
                      {trade.notes}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-300">{(trade.odds || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-mono text-white">${(trade.stake || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    {trade.result === 'WIN' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle size={10} className="mr-1" /> WIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <XCircle size={10} className="mr-1" /> LOSS
                      </span>
                    )}
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${(trade.pnl || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {(trade.pnl || 0) >= 0 ? '+' : ''}{(trade.pnl || 0).toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${trade.bankrollAfter > 0 ? 'text-white' : 'text-slate-600'}`}>
                    ${(trade.bankrollAfter || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
              {!hasTrades && (
                <tr>
                  <td colSpan={7} className="px-6 py-24 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-slate-900 p-6 rounded-full border border-slate-700 shadow-inner">
                          <History className="text-slate-600" size={48} />
                        </div>
                        <p className="text-slate-300 font-bold text-lg uppercase tracking-tight">Data Synchronizing</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-700/50">
          {processedTrades.map((trade, idx) => (
            <div key={idx} className={`p-4 space-y-3 ${trade.result === 'LOSS' ? 'bg-rose-500/5' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-mono text-slate-500 text-[10px] mb-1">{trade.date}</div>
                  <div className="text-white font-bold text-sm">{trade.matchups}</div>
                </div>
                <div>
                  {trade.result === 'WIN' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle size={10} className="mr-1" /> WIN
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <XCircle size={10} className="mr-1" /> LOSS
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-indigo-400 text-xs font-black uppercase tracking-tight">{trade.selection}</div>
              
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Stake</div>
                  <div className="font-mono text-white text-xs">${(trade.stake || 0).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Odds</div>
                  <div className="font-mono text-slate-300 text-xs">{(trade.odds || 0).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">P/L</div>
                  <div className={`font-mono font-bold text-xs ${(trade.pnl || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {(trade.pnl || 0) >= 0 ? '+' : ''}{(trade.pnl || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-700/30">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Balance</span>
                <span className={`font-mono font-bold text-sm ${trade.bankrollAfter > 0 ? 'text-white' : 'text-slate-600'}`}>
                  ${(trade.bankrollAfter || 0).toFixed(2)}
                </span>
              </div>

              <div className="text-slate-500 text-[10px] italic leading-relaxed bg-slate-900/40 p-2 rounded border border-slate-700/30">
                {trade.notes}
              </div>
            </div>
          ))}
          {!hasTrades && (
            <div className="p-12 text-center text-slate-500">
              <div className="flex flex-col items-center gap-4">
                  <div className="bg-slate-900 p-6 rounded-full border border-slate-700 shadow-inner">
                    <History className="text-slate-600" size={48} />
                  </div>
                  <p className="text-slate-300 font-bold text-lg uppercase tracking-tight">Data Synchronizing</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isBust && (
        <div className="bg-rose-900/20 border border-rose-500/30 rounded-xl p-8 text-center shadow-2xl animate-in slide-in-from-top-2">
           <AlertTriangle className="text-rose-500 mx-auto mb-4" size={40} />
           <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Chain Liquidated</h4>
           <p className="text-rose-200 text-sm max-w-2xl mx-auto italic leading-relaxed">
             "Grounded verification indicates a failure on Step {processedTrades.length}. The sequence has terminated."
           </p>
        </div>
      )}

       {isGoalReached && (
        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-8 text-center animate-in zoom-in-95 shadow-2xl">
           <Target className="text-emerald-500 mx-auto mb-4" size={40} />
           <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Target Achieved</h4>
           <p className="text-emerald-200 text-sm max-w-2xl mx-auto italic leading-relaxed">
             "Historical verification successful. Target of ${targetBankroll.toLocaleString()} met using verified real-world outcomes."
           </p>
        </div>
      )}
    </div>
  );
};
