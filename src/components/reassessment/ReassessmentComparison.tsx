import React, { useState } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Network,
  Award
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';

export const ReassessmentComparison: React.FC = () => {
  const {
    reassessmentBefore,
    reassessmentAfter,
    isReassessmentCompleted,
    triggerReassessmentCompletion,
    setCurrentTab
  } = useApp();

  const [hasConfirmed, setHasConfirmed] = useState(isReassessmentCompleted);

  const chartData = [
    { name: 'Initial Diagnostic', score: reassessmentBefore, fill: '#EF4444' },
    { name: 'Post-Recovery Reassessment', score: reassessmentAfter, fill: '#2563EB' }
  ];

  const handleApplyBoost = () => {
    setHasConfirmed(true);
    triggerReassessmentCompletion();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Reassessment Evaluation Complete</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Your understanding improved
        </h1>
        <p className="text-sm text-slate-500">
          Targeted 15-minute recovery on the Power Rule resolved the exponent decrement misconception.
        </p>
      </div>

      {/* Main Score Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
        
        {/* Before Card */}
        <div className="p-6 rounded-3xl bg-rose-50/40 border border-rose-100 flex flex-col justify-between text-center sm:text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block mb-1">
              Before Recovery
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-rose-600 tracking-tight my-2">
              {reassessmentBefore}%
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
              Critical Gap
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Repeated omissions of exponent decrement (n - 1) on polynomial derivatives.
          </p>
        </div>

        {/* Delta Gain Highlight */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex flex-col justify-between items-center text-center shadow-xl shadow-blue-500/15">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-sky-300">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-200 block">
              Net Mastery Gain
            </span>
            <div className="text-5xl font-black tracking-tight my-1">
              +{reassessmentAfter - reassessmentBefore}%
            </div>
            <span className="text-xs text-blue-100 font-medium">
              Verified in 5 adaptive problems
            </span>
          </div>
          <div className="text-[11px] text-sky-200 bg-white/10 px-3 py-1 rounded-full">
            Prerequisite unlocked
          </div>
        </div>

        {/* After Card */}
        <div className="p-6 rounded-3xl bg-emerald-50/40 border border-emerald-100 flex flex-col justify-between text-center sm:text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
              After Recovery
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-emerald-600 tracking-tight my-2">
              {reassessmentAfter}%
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Mastered / Proficient
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Consistent 2-step power rule execution across polynomial and fractional powers.
          </p>
        </div>

      </div>

      {/* Chart Visualization */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Comparative Mastery Calibration
            </h3>
            <p className="text-xs text-slate-500">
              Empirical mastery delta before vs after recovery path
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            Calibrated Metrics
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#64748B" fontSize={12} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
                }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={60}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confirmation & Mastery Upgrade Action */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold">
              {hasConfirmed ? 'Mastery Badge Upgraded!' : 'Apply Mastery Gain to Profile'}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Updates your global mastery to 85% and unlocks downstream Integration lessons.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!hasConfirmed ? (
            <button
              onClick={handleApplyBoost}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/30 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>Confirm & Celebrate Mastery</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentTab('prerequisites')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Network className="w-4 h-4 text-sky-400" />
                <span>View Concept Graph</span>
              </button>
              <button
                onClick={() => setCurrentTab('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>Return to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
