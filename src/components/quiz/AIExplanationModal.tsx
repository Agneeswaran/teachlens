import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BrainCircuit,
  CheckCircle2,
  XCircle,
  Lightbulb,
  RotateCcw
} from 'lucide-react';
import type { QuizQuestion } from '../../types';

interface AIExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: QuizQuestion;
  selectedOptionText: string;
  expectedOptionText: string;
  isCorrect: boolean;
  onPracticeSimilar: () => void;
}

export const AIExplanationModal: React.FC<AIExplanationModalProps> = ({
  isOpen,
  onClose,
  question,
  selectedOptionText,
  expectedOptionText,
  isCorrect,
  onPracticeSimilar
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 p-6 sm:p-8 space-y-6"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isCorrect
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  AI Remediation Assistant
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {isCorrect ? 'Excellent Concept Application!' : "Let's Understand the Mistake"}
                </h3>
              </div>
            </div>

            {/* Answer Comparison Block */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200/60">
                <span className="text-slate-400 font-semibold block mb-1">Your answer:</span>
                <span className={`text-sm font-bold font-mono ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {selectedOptionText}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-emerald-200/80">
                <span className="text-emerald-700 font-semibold block mb-1">Expected answer:</span>
                <span className="text-sm font-bold font-mono text-emerald-800">
                  {expectedOptionText}
                </span>
              </div>
            </div>

            {/* AI Explanation in Plain Language */}
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <BrainCircuit className="w-4 h-4 text-blue-600" />
                <span>AI Explanation</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {question.aiExplanation?.whyWrong || 'Misconception detected in formula application.'}
              </p>
              <div className="text-xs text-blue-800 font-semibold pt-1">
                Common Misstep: "{question.aiExplanation?.commonMisstep || 'Applying mechanical rule without decrementing power'}"
              </div>
            </div>

            {/* "Try This" Guided Example */}
            {question.aiExplanation?.guidedExample && (
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Try this (Mini Guided Walkthrough)</span>
                </div>
                <div className="text-xs text-slate-800 font-semibold font-mono">
                  {question.aiExplanation.guidedExample.problem}
                </div>
                <ul className="text-xs text-slate-600 space-y-1 pl-1">
                  <li>• {question.aiExplanation.guidedExample.step1}</li>
                  <li>• {question.aiExplanation.guidedExample.step2}</li>
                </ul>
                <div className="text-xs font-bold text-amber-800 pt-1">
                  {question.aiExplanation.guidedExample.result}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold"
              >
                Close & Next Question
              </button>
              <button
                onClick={onPracticeSimilar}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Practice Similar Question</span>
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
