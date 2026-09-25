import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  RotateCcw,
  BrainCircuit
} from 'lucide-react';
import type { TeacherStudentView } from '../../types';

interface StudentDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: TeacherStudentView | null;
}

export const StudentDetailDrawer: React.FC<StudentDetailDrawerProps> = ({
  isOpen,
  onClose,
  student
}) => {
  if (!student) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 border-l border-slate-100 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                  {student.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{student.email}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Overall Snapshot Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Overall Mastery
                  </span>
                  <span className="text-3xl font-extrabold text-slate-900">
                    {student.overallMastery}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Weakest Topic
                  </span>
                  <span className="text-sm font-bold text-rose-600">
                    {student.weakestConcept} ({student.weakestConceptScore}%)
                  </span>
                </div>
              </div>

              {/* Concept Mastery Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Concept Mastery Breakdown
                </h4>
                <div className="space-y-2.5">
                  {Object.entries(student.conceptScores).map(([cKey, score]) => {
                    const isWeak = score < 60;
                    return (
                      <div
                        key={cKey}
                        className="p-3 rounded-xl bg-white border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-slate-700 capitalize">
                          {cKey}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className={`font-bold ${isWeak ? 'text-rose-600' : 'text-slate-900'}`}>
                            {score}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Diagnostic Summary */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <BrainCircuit className="w-4 h-4 text-blue-600" />
                  <span>TeachLens Evidence-Based Summary</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Student exhibits persistent formula confusion in differentiation, specifically neglecting the exponent decrement step. 
                  Recommended prerequisite intervention on exponent manipulation before advancing to quotient and chain rule drills.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => alert(`Assigned Targeted Recovery Path to ${student.name}!`)}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Assign 15-Minute Recovery Path</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
                >
                  Close Profile
                </button>
              </div>

            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
