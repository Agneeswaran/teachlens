import React from 'react';
import { motion } from 'framer-motion';
import {
  History,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LearningHistoryTimeline: React.FC = () => {
  const { studentProfile, setCurrentTab } = useApp();

  const historyItems = [
    {
      id: 'h-1',
      date: 'Today',
      time: '09:45 AM',
      title: 'Differentiation Reassessed',
      desc: 'Completed Power Rule Targeted Recovery. Score jumped from 32% to 76%.',
      delta: 44,
      type: 'reassessment',
      tag: 'Reassessment'
    },
    {
      id: 'h-2',
      date: 'Today',
      time: '09:20 AM',
      title: 'AI Gap Analysis Triggered',
      desc: 'Flagged power rule omission error fingerprint on polynomial derivative diagnostic.',
      delta: -14,
      type: 'diagnostic',
      tag: 'AI Diagnostic'
    },
    {
      id: 'h-3',
      date: 'Yesterday',
      time: '04:15 PM',
      title: 'Completed Recovery Plan',
      desc: 'Limits & Continuity: One-sided limits and infinite boundary behavior verified.',
      delta: 18,
      type: 'recovery',
      tag: 'Recovery'
    },
    {
      id: 'h-4',
      date: '2 days ago',
      time: '11:30 AM',
      title: 'Limits & Continuity Assessment',
      desc: 'Adaptive diagnostic quiz completed. 8 out of 10 items answered correctly.',
      delta: 6,
      type: 'quiz',
      tag: 'Adaptive Quiz'
    },
    {
      id: 'h-5',
      date: '4 days ago',
      time: '02:00 PM',
      title: 'Functions & Graphs Mastered',
      desc: 'Domain and inverse function transformations reached 88% verified threshold.',
      delta: 12,
      type: 'mastery',
      tag: 'Milestone'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Verified Progress Audit
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Student ID: {studentProfile.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Learning Journey & History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Chronological audit of diagnostic events, recovery interventions, and validated mastery upgrades.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('quiz')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start New Diagnostic</span>
        </button>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 sm:pl-10 space-y-6 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
        {historyItems.map((item, idx) => {
          const isPositive = item.delta > 0;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-6 sm:-left-10 top-5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-blue-600 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              </div>

              {/* Item Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">
                      {item.date} • {item.time}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 ${
                      isPositive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    {isPositive ? `+${item.delta}%` : `${item.delta}%`} Mastery
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
