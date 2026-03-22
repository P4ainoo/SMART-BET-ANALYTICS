
import React, { useMemo } from 'react';
import { StrategyPlan } from '../types';
import { ParlayCard } from './ParlayCard';
import { Map, Target, TrendingUp, Calendar, ArrowRight, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StrategyDashboardProps {
  plan: StrategyPlan;
}

export const StrategyDashboard: React.FC<StrategyDashboardProps> = ({ plan }) => {
  if (!plan) return null;

  const totalSteps = plan.totalSteps || plan.steps?.length || 0;

  const chartData = useMemo(() => {
    if (!plan.steps || plan.steps.length === 0) return [];
    
    const data = [{ step: 0, balance: plan.startingBankroll }];
    plan.steps.forEach((step, idx) => {
      data.push({ step: idx + 1, balance: step.projectedWin || 0 });
    });
    return data;
  }, [plan]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Verification Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/5">
           <ShieldCheck size={14} /> Optimized Compounding Strategy
        </div>
      </div>

      {/* Header Summary */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
              <Map size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Strategic Roadmap</h2>
          </div>

          <p className="text-slate-300 mb-6 max-w-3xl leading-relaxed border-l-2 border-emerald-500/50 pl-4 italic">
            "{plan.analysis || 'High-probability compounding path identified for current market conditions.'}"
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-1">Starting</div>
              <div className="text-xl font-mono text-white font-bold">${plan.startingBankroll}</div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-1">Target Goal</div>
              <div className="text-xl font-mono text-yellow-400 font-bold">${plan.targetBankroll}</div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-1">Required Steps</div>
              <div className="text-xl font-mono text-indigo-400 font-bold flex items-center gap-2">
                {totalSteps} <TrendingUp size={16} />
              </div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-1">Avg Odds</div>
              <div className="text-xl font-mono text-purple-400 font-bold">{plan.targetOdds}</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="mt-8 h-64 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStrategy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="step" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Projected Balance']}
                  labelStyle={{ color: '#94a3b8' }}
                  labelFormatter={(label) => `Step ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorStrategy)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Timeline / Ladder */}
      <div className="relative space-y-12 pl-8 md:pl-0">
        {/* Vertical Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-700 transform -translate-x-1/2 hidden md:block"></div>

        {plan.steps?.map((step, index) => {
          const isLeft = index % 2 === 0;
          const hasRecommendation = !!step.parlayRecommendation;
          const confidence = step.parlayRecommendation?.confidenceScore || 0;

          return (
            <div key={index} className={`relative flex flex-col md:flex-row items-center ${isLeft ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Center Node */}
              <div className="absolute left-0 md:left-1/2 w-8 h-8 bg-slate-800 border-4 border-indigo-500 rounded-full transform -translate-x-1/2 z-20 flex items-center justify-center shadow-lg shadow-indigo-900/50 mt-6 md:mt-0">
                <span className="text-[10px] font-black text-white">{step.stepNumber}</span>
              </div>

              {/* Content Card */}
              <div className={`w-full md:w-[calc(50%-2rem)] ${isLeft ? 'md:ml-8' : 'md:mr-8'} ml-6`}>
                 <div className={`rounded-2xl border transition-all duration-300 ${
                    hasRecommendation 
                    ? 'bg-slate-800 border-indigo-500/30 shadow-lg shadow-indigo-900/10' 
                    : 'bg-slate-900/50 border-slate-700 opacity-80'
                 }`}>
                    
                    {/* Step Header */}
                    <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-500/20 text-indigo-400 p-1.5 rounded">
                                <Calendar size={16} />
                            </div>
                            <div>
                                <div className="font-bold text-white text-sm">{step.date}</div>
                                {hasRecommendation && (
                                  <div className="flex items-center gap-2 mt-1">
                                     <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < Math.floor(confidence / 2) ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                                        ))}
                                     </div>
                                     <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-tighter">
                                       {confidence}/10 Confidence
                                     </span>
                                  </div>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Projected Payout</div>
                            <div className="font-mono font-black text-emerald-400 text-lg">${(step.projectedWin || 0).toFixed(0)}</div>
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="p-4">
                        <div className="flex justify-between items-center text-sm mb-4 bg-slate-900/80 p-3 rounded-xl border border-slate-700/50">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Stake</span>
                              <span className="text-white font-mono font-bold">${(step.plannedStake || 0).toFixed(0)}</span>
                            </div>
                            <ArrowRight size={16} className="text-slate-600" />
                            <div className="flex flex-col text-right">
                              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Target</span>
                              <span className="text-emerald-400 font-mono font-bold">${(step.projectedWin || 0).toFixed(0)}</span>
                            </div>
                        </div>

                        {step.parlayRecommendation ? (
                            <div className="mt-4">
                                <ParlayCard parlay={step.parlayRecommendation} />
                            </div>
                        ) : (
                             <div className="py-8 text-center border-2 border-dashed border-slate-700/50 rounded-2xl bg-slate-900/30">
                                <div className="flex justify-center mb-3">
                                    <div className="p-2 rounded-full bg-slate-800 text-slate-600">
                                      <Lock size={20} />
                                    </div>
                                </div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Upcoming Opportunity</p>
                                <p className="text-slate-500 text-[10px] px-6 italic leading-relaxed">{step.note || 'Selections will be calculated once previous sequence settles.'}</p>
                             </div>
                        )}
                    </div>
                 </div>
              </div>
            </div>
          );
        })}
        
        {/* Finish Line */}
         <div className="relative flex flex-col items-center justify-center pt-8 pb-12">
            <div className="w-16 h-16 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center border-2 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                <Target size={32} />
            </div>
            <div className="mt-4 text-center">
                <div className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black mb-1">Target Reached</div>
                <div className="text-4xl font-black text-yellow-400 font-mono tracking-tighter">${plan.targetBankroll}</div>
            </div>
         </div>
      </div>
    </div>
  );
};
