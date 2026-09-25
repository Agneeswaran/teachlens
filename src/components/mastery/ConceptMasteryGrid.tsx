import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  BrainCircuit,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Network
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConceptMastery, MasteryStatus } from '../../types';

export const ConceptMasteryGrid: React.FC = () => {
  const { concepts, setCurrentTab, setActivePrereqConcept } = useApp();
  const [filter, setFilter] = useState<'all' | MasteryStatus>('all');
  const [selectedConcept, setSelectedConcept] = useState<ConceptMastery | null>(null);

  const filteredConcepts = concepts.filter((c) =>
    filter === 'all' ? true : c.status === filter
  );

  const handleInspectGap = (concept: ConceptMastery) => {
    setActivePrereqConcept(concept.id);
    if (concept.status === 'critical_gap') {
      setCurrentTab('gap-analysis');
    } else {
      setSelectedConcept(concept);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Concept Mastery Landscape
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time calibrated diagnostic comprehension across topics.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({concepts.length})
          </button>
          <button
            onClick={() => setFilter('mastered')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'mastered'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mastered
          </button>
          <button
            onClick={() => setFilter('needs_practice')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'needs_practice'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Needs Practice
          </button>
          <button
            onClick={() => setFilter('critical_gap')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'critical_gap'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Critical Gap
          </button>
        </div>
      </div>

      {/* Concept Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConcepts.map((concept) => {
          const statusConfig = {
            mastered: {
              label: 'Mastered',
              badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
              progress: 'bg-emerald-500',
              icon: CheckCircle2,
              borderHover: 'hover:border-emerald-300'
            },
            needs_practice: {
              label: 'Needs Practice',
              badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
              progress: 'bg-amber-500',
              icon: AlertTriangle,
              borderHover: 'hover:border-amber-300'
            },
            critical_gap: {
              label: 'Critical Gap',
              badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
              progress: 'bg-rose-500',
              icon: AlertOctagon,
              borderHover: 'hover:border-rose-300'
            }
          }[concept.status];

          const StatusIcon = statusConfig.icon;

          return (
            <motion.div
              key={concept.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={`p-6 rounded-3xl bg-white border border-slate-100 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between ${statusConfig.borderHover}`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {concept.category}
                  </span>
                  <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${statusConfig.badge}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span>{statusConfig.label}</span>
                  </div>
                </div>

                {/* Concept Title & Description */}
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {concept.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {concept.description}
                </p>

                {/* Score & Progress Bar */}
                <div className="mt-6 mb-4">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600">Mastery Level</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      {concept.masteryPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${statusConfig.progress}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${concept.masteryPercentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Subconcepts Pills */}
                <div className="flex flex-wrap gap-1.5 my-3">
                  {concept.subconcepts.slice(0, 3).map((sub, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/70 text-[10px] font-medium text-slate-600"
                    >
                      {sub}
                    </span>
                  ))}
                  {concept.subconcepts.length > 3 && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/70 text-[10px] font-medium text-slate-400">
                      +{concept.subconcepts.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Metadata & Action Row */}
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{concept.lastAssessed}</span>
                </div>

                <div className="flex items-center gap-3">
                  {concept.trend !== 0 && (
                    <span className={`font-semibold flex items-center gap-0.5 ${
                      concept.trend > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {concept.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {concept.trend > 0 ? `+${concept.trend}%` : `${concept.trend}%`}
                    </span>
                  )}

                  <button
                    onClick={() => handleInspectGap(concept)}
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Inspect Learning Gap"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* Quick Action Footer: Open Concept Dependency Graph */}
      <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Interactive Prerequisite Concept Graph
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Visualize how foundational algebra rules flow into calculus derivatives and integrations.
            </p>
          </div>
        </div>
        <button
          onClick={() => setCurrentTab('prerequisites')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <span>Open Concept Graph</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
