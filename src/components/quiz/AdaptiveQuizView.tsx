import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  HelpCircle,
  BrainCircuit,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Zap,
  TrendingUp,
  AlertCircle,
  Compass,
  Trophy,
  Check,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfidenceLevel } from '../../types';
import { AIExplanationModal } from './AIExplanationModal';
import { TeachLensAPI } from '../../services/api';

export const AdaptiveQuizView: React.FC = () => {
  const {
    subjects,
    selectedSubject,
    setSelectedSubject,
    quizQuestions,
    activeQuizIndex,
    setActiveQuizIndex,
    startQuiz,
    submitQuiz,
    setCurrentTab,
    generateRecovery
  } = useApp();

  const [selectedConfidence, setSelectedConfidence] = useState<ConfidenceLevel>('confident');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasEvaluatedSingle, setHasEvaluatedSingle] = useState<boolean>(false);
  const [singleEvaluation, setSingleEvaluation] = useState<any | null>(null);
  const [accumulatedAnswers, setAccumulatedAnswers] = useState<{
    questionId: string;
    selectedOptionId: string;
    confidenceLevel: string;
    timeSpentSeconds: number;
  }[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<any | null>(null);
  const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(false);

  // If no questions loaded, offer subject selection to start
  const [selectedConceptId, setSelectedConceptId] = useState<string>('');

  const currentQ = quizQuestions[activeQuizIndex];

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedOptionId(null);
    setHasEvaluatedSingle(false);
    setSingleEvaluation(null);
  }, [activeQuizIndex, quizQuestions]);

  const confidenceOptions: { id: ConfidenceLevel; label: string; icon: string }[] = [
    { id: 'very_confident', label: 'Very confident', icon: '🎯' },
    { id: 'confident', label: 'Confident', icon: '✨' },
    { id: 'not_sure', label: 'Not sure', icon: '🤔' },
    { id: 'guessing', label: 'Guessing', icon: '🎲' }
  ];

  const handleStartFreshQuiz = async () => {
    const subId = selectedSubject?.id || 'subj-math';
    await startQuiz(subId, selectedConceptId || undefined);
    setQuizResult(null);
    setAccumulatedAnswers([]);
    setActiveQuizIndex(0);
  };

  const handleSelectOption = (optId: string) => {
    if (hasEvaluatedSingle) return;
    setSelectedOptionId(optId);
  };

  const handleEvaluateAnswer = async () => {
    if (!selectedOptionId || !currentQ) return;
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    // Save answer
    const answerEntry = {
      questionId: currentQ.id,
      selectedOptionId: selectedOptionId,
      confidenceLevel: selectedConfidence,
      timeSpentSeconds: timeSpent
    };

    setAccumulatedAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== currentQ.id);
      return [...filtered, answerEntry];
    });

    try {
      const evalRes = await TeachLensAPI.evaluateAnswer('temp', answerEntry);
      setSingleEvaluation(evalRes);
      setHasEvaluatedSingle(true);
    } catch {
      setHasEvaluatedSingle(true);
    }
  };

  const handleNextQuestion = async () => {
    if (activeQuizIndex < quizQuestions.length - 1) {
      setActiveQuizIndex(activeQuizIndex + 1);
    } else {
      // Completed all questions -> Final submit
      setIsSubmitting(true);
      try {
        const result = await submitQuiz(accumulatedAnswers);
        setQuizResult(result);
      } catch (err) {
        console.error('Failed to submit quiz:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // If no questions in state, show Start Assessment Launcher
  if (!currentQ && !quizResult) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-300">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 mx-auto flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Start Adaptive Assessment
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Questions are drawn directly from the TeachLens database with prerequisite trees and difficulty scaling.
            </p>
          </div>

          {/* Subject Selector */}
          <div className="space-y-2 text-left">
            <label className="block text-xs font-bold text-slate-700">Choose Subject</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {subjects.map((sub) => {
                const isSelected = selectedSubject?.id === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubject(sub)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span>{sub.icon}</span>
                    <span>{sub.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStartFreshQuiz}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Begin 5-Question Diagnostic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If Quiz Completed -> Show Result Card
  if (quizResult) {
    const isComeback = quizResult.score >= 70;
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 animate-in fade-in duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-6 text-center"
        >
          <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-xs ${
            isComeback ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-amber-100 text-amber-600 border border-amber-200'
          }`}>
            {isComeback ? <Trophy className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Assessment Completed
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Calibrated Score: {quizResult.score}%
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Evaluated {quizResult.total_questions} items across {quizResult.concept_id || 'concept'} in {selectedSubject?.name}.
            </p>
          </div>

          {/* Points & Delta Grid */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 text-left">
              <div className="text-[11px] font-semibold text-blue-600">Comeback Points</div>
              <div className="text-xl font-extrabold text-blue-800">+{quizResult.comeback_points_earned || 25} pts</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-left">
              <div className="text-[11px] font-semibold text-emerald-600">Correct Answers</div>
              <div className="text-xl font-extrabold text-emerald-800">
                {quizResult.correct_count} / {quizResult.total_questions}
              </div>
            </div>
          </div>

          {/* Action Suggestions */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-3">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-blue-600" />
              <span>TeachLens AI Diagnostic Assessment</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your answer selections and confidence intervals have been recorded in the database. 
              {quizResult.score < 80
                ? ' A targeted learning gap was isolated. We recommend reviewing the root-cause diagnosis.'
                : ' Excellent conceptual grasp demonstrated! You can challenge the next topic or help peers in study squads.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentTab('gap-analysis')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Inspect AI Gap Diagnosis</span>
            </button>

            <button
              onClick={() => {
                if (quizResult.concept_id) {
                  generateRecovery(quizResult.concept_id);
                } else {
                  setCurrentTab('recovery');
                }
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-blue-600" />
              <span>Begin Recovery Plan</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active Quiz View
  const progressPercentage = Math.round(((activeQuizIndex + 1) / quizQuestions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header & Progress */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
              Q{activeQuizIndex + 1}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Concept: {currentQ.conceptName}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {currentQ.difficulty} Difficulty
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-800">
                Question {activeQuizIndex + 1} of {quizQuestions.length}
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-500">
              {progressPercentage}% Completed
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-blue-600 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-8">
        
        {/* Prompt */}
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            {currentQ.prompt}
          </h3>

          {currentQ.expression && (
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80 inline-block font-mono text-lg font-bold text-blue-900 tracking-wide">
              {currentQ.expression}
            </div>
          )}
        </div>

        {/* Confidence Pre-Answer Selector */}
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              How confident are you in this answer?
            </span>
            <span className="text-[11px] text-slate-400">Used for calibration analysis</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {confidenceOptions.map((conf) => (
              <button
                key={conf.id}
                type="button"
                disabled={hasEvaluatedSingle}
                onClick={() => setSelectedConfidence(conf.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  selectedConfidence === conf.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-200'
                }`}
              >
                <span>{conf.icon}</span>
                <span>{conf.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select the correct answer:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((option, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isSelected = selectedOptionId === option.id;

              let optionStyle = 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/20';

              if (hasEvaluatedSingle) {
                if (singleEvaluation && option.id === singleEvaluation.correct_option_id) {
                  optionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-500/20';
                } else if (isSelected && singleEvaluation && !singleEvaluation.is_correct) {
                  optionStyle = 'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-500/20';
                } else {
                  optionStyle = 'bg-slate-50 border-slate-200 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'bg-blue-50/80 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs';
              }

              return (
                <button
                  key={option.id}
                  disabled={hasEvaluatedSingle}
                  onClick={() => handleSelectOption(option.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="font-mono text-base font-bold text-slate-900">
                      {option.text}
                    </span>
                  </div>

                  {hasEvaluatedSingle && singleEvaluation && option.id === singleEvaluation.correct_option_id && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                  {hasEvaluatedSingle && singleEvaluation && isSelected && !singleEvaluation.is_correct && (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Snippet if evaluated */}
        {hasEvaluatedSingle && singleEvaluation && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border text-xs leading-relaxed ${
              singleEvaluation.is_correct
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/80 border-rose-200 text-rose-900'
            }`}
          >
            <div className="font-bold mb-1">
              {singleEvaluation.is_correct ? '✓ Correct Answer!' : '✗ Concept Misconception Detected'}
            </div>
            <div>
              {singleEvaluation.explanation ||
                (singleEvaluation.is_correct
                  ? 'Power rule correctly executed.'
                  : 'Power was not decremented while multiplying coefficient.')}
            </div>
          </motion.div>
        )}

        {/* Bottom Action Strip */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            {selectedOptionId ? (
              hasEvaluatedSingle ? (
                <span className="font-semibold text-slate-600">Answer checked. Proceed to next question.</span>
              ) : (
                <span className="font-semibold text-blue-600">Option selected. Ready to verify.</span>
              )
            ) : (
              <span>Select an option above to continue</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!hasEvaluatedSingle ? (
              <button
                type="button"
                disabled={!selectedOptionId}
                onClick={handleEvaluateAnswer}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                Check Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>
                  {activeQuizIndex < quizQuestions.length - 1 ? 'Next Question' : 'Complete Assessment'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
