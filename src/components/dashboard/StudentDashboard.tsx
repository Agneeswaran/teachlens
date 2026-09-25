import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  BrainCircuit,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Target,
  BookOpen,
  Compass,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';

export const StudentDashboard: React.FC = () => {
  const {
    studentProfile,
    currentUser,
    setCurrentTab,
    concepts,
    recoveryPlan,
    gapDiagnosis,
    subjects,
    selectedSubject,
    setSelectedSubject,
    startQuiz
  } = useApp();

  const isNewStudent = !studentProfile.hasStarted || studentProfile.completedAssessments === 0;

  const handleStartFirstAssessment = () => {
    if (selectedSubject) {
      startQuiz(selectedSubject.id);
    } else {
      setCurrentTab('quiz');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hello, {(currentUser?.name || studentProfile.name).split(' ')[0]} 👋
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
              Personalized Learning Space
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isNewStudent
              ? 'Welcome to TeachLens. Select a subject and complete your first diagnostic assessment.'
              : `Current progress in ${selectedSubject?.name || 'Curriculum'}. Compete with your previous self and rebuild foundational mastery.`}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleStartFirstAssessment()}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isNewStudent ? 'Take First Assessment' : 'New Assessment'}</span>
          </button>

          {recoveryPlan && (
            <button
              onClick={() => setCurrentTab('recovery')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
              <span>Resume Recovery</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-Subject Selector Strip */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            Active Learning Domain
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Subjects are database-driven
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {subjects.map((sub) => {
            const isSelected = selectedSubject?.id === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                }`}
              >
                <span className="text-base">{sub.icon}</span>
                <span>{sub.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* If NEW STUDENT: Elegant Empty State (No fake percentages!) */}
      {isNewStudent ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-50/70 via-sky-50/40 to-white border border-blue-200/80 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-100/80 text-blue-600 mx-auto flex items-center justify-center border border-blue-200 shadow-xs">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Your learning journey starts here.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              TeachLens does not display fake sample scores. Once you complete your first diagnostic in <strong className="text-blue-700">{selectedSubject?.name || 'Mathematics'}</strong>, our AI engine will map your conceptual mastery, isolate specific mistake patterns, and build your personalized recovery pathway.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-1">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div className="text-xs font-bold text-slate-800">Adaptive Diagnostic</div>
              <p className="text-[11px] text-slate-400">5 targeted concept items evaluated with confidence calibration.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-1">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div className="text-xs font-bold text-slate-800">AI Gap Isolation</div>
              <p className="text-[11px] text-slate-400">Strictly grounded in your actual misconceptions without hallucination.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-1">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div className="text-xs font-bold text-slate-800">Measured Comeback</div>
              <p className="text-[11px] text-slate-400">Earn Comeback Points based on your improvement delta (+%).</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleStartFirstAssessment()}
              className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all inline-flex items-center gap-2 hover:scale-[1.02]"
            >
              <span>Take Your First Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* If RETURNING STUDENT: Real Statistics & Active Gap Cards */
        <>
          {/* Top Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Overall Mastery"
              value={studentProfile.overallMastery}
              suffix="%"
              icon={Trophy}
              colorScheme="blue"
              onClick={() => setCurrentTab('mastery')}
            />

            <StatCard
              title="Concepts Mastered"
              value={studentProfile.conceptsMasteredCount}
              icon={CheckCircle2}
              colorScheme="emerald"
              onClick={() => setCurrentTab('mastery')}
            />

            <StatCard
              title="Needs Practice"
              value={studentProfile.needsPracticeCount}
              icon={AlertTriangle}
              colorScheme="amber"
              onClick={() => setCurrentTab('gap-analysis')}
            />

            <StatCard
              title="Learning Streak"
              value={studentProfile.streakDays}
              suffix=" days"
              icon={Flame}
              colorScheme="indigo"
              onClick={() => setCurrentTab('profile')}
            />
          </div>

          {/* Critical Learning Gap Banner (Only if gap exists) */}
          {gapDiagnosis ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-blue-50/70 via-sky-50/50 to-white border border-blue-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      Identified Learning Gap
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Concept: {gapDiagnosis.conceptName}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {gapDiagnosis.conceptName} Mastery Calibrated at {gapDiagnosis.masteryScore}%
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {gapDiagnosis.whyHappening || 'Persistent misconception detected in foundational application rules.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>{gapDiagnosis.evidence?.length || 1} empirical evidence items</span>
                    </div>
                    {gapDiagnosis.prerequisiteGaps && gapDiagnosis.prerequisiteGaps.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Prerequisite: {gapDiagnosis.prerequisiteGaps[0].conceptName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <button
                    onClick={() => setCurrentTab('gap-analysis')}
                    className="px-5 py-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 text-slate-700 text-xs font-bold shadow-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <BrainCircuit className="w-4 h-4 text-blue-600" />
                    <span>Inspect Gap Diagnosis</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('recovery')}
                    className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Start Recovery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-900">All Assessed Concepts on Track!</h3>
                  <p className="text-xs text-emerald-700">No critical learning gaps detected in your latest diagnostic submissions.</p>
                </div>
              </div>
              <button
                onClick={() => handleStartFirstAssessment()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Challenge Next Topic
              </button>
            </div>
          )}

          {/* Concepts Overview */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedSubject?.name || 'Subject'} Concept Spectrum
                </h3>
                <p className="text-xs text-slate-500">Live calibration from your assessments</p>
              </div>
              <button
                onClick={() => setCurrentTab('mastery')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Full Concept Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {concepts.map((concept) => (
                <div
                  key={concept.id}
                  onClick={() => setCurrentTab('gap-analysis')}
                  className="p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{concept.name}</span>
                    <span className="font-extrabold text-xs text-blue-700">{concept.masteryPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        concept.masteryPercentage >= 80
                          ? 'bg-emerald-500'
                          : concept.masteryPercentage >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${concept.masteryPercentage}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize flex items-center justify-between">
                    <span>{concept.category}</span>
                    <span>{concept.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
};
