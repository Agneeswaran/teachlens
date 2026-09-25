import React from 'react';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  User,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { mockEarlyWarnings } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const EarlyWarningSignals: React.FC = () => {
  const { openStudentDrawer } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Predictive Retention System
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Continuous Trend Slopes</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Early Learning Signals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Detecting downward trajectory slopes before students fail major summative exams. Grounded strictly in empirical data.
          </p>
        </div>

        <div className="p-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span>{mockEarlyWarnings.length} Active Negative Slopes</span>
        </div>
      </div>

      {/* Early Warning Signal Cards */}
      <div className="space-y-4">
        {mockEarlyWarnings.map((signal) => {
          const isCritical = signal.severity === 'critical';

          return (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-3xl border transition-all ${
                isCritical
                  ? 'bg-rose-50/30 border-rose-200/90 shadow-xs'
                  : 'bg-amber-50/30 border-amber-200/90 shadow-xs'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left Information */}
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border flex items-center gap-1 ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {signal.severity.toUpperCase()} ALERT
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {signal.studentName}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{signal.detectedAt}</span>
                  </div>

                  {/* Concrete Trend Metric Callout */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-900">
                      ⚠ {signal.conceptName} mastery decreased continuously:
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-xs font-extrabold text-rose-600 bg-white px-2 py-0.5 rounded-md border border-rose-200">
                      <span>{signal.historicalTrend[0]}%</span>
                      <span>&rarr;</span>
                      <span>{signal.historicalTrend[1]}%</span>
                      <span>&rarr;</span>
                      <span className="text-rose-700 underline">{signal.historicalTrend[2]}%</span>
                    </div>
                  </div>

                  {/* Measurable Evidence */}
                  <div className="text-xs text-slate-600 leading-relaxed pl-1">
                    <strong className="text-slate-800">Empirical Evidence:</strong> {signal.evidence}
                  </div>

                  {/* Grounded Recommendation */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2 shadow-2xs">
                    <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-blue-900 block mb-0.5">Pedagogical Recommendation:</strong>
                      "{signal.recommendation}"
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                  <button
                    onClick={() => alert(`Assigned targeted recovery to ${signal.studentName}!`)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Assign Recovery Path</span>
                  </button>

                  <button
                    onClick={() => {
                      const studentObj = {
                        id: signal.studentId,
                        name: signal.studentName,
                        email: `${signal.studentName.toLowerCase().replace(' ', '.')}@academy.edu`,
                        overallMastery: 48,
                        status: 'needs_attention' as const,
                        weakestConcept: signal.conceptName,
                        weakestConceptScore: signal.historicalTrend[2],
                        trend: 'down' as const,
                        lastActive: '12 mins ago',
                        conceptScores: { algebra: 82, functions: 74, limits: 55, differentiation: 32, matrices: 60, probability: 70 }
                      };
                      openStudentDrawer(studentObj);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Student Profile</span>
                  </button>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
