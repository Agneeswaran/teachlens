import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  AlertTriangle,
  RotateCcw,
  Network,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Radar,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MistakeFingerprint } from './MistakeFingerprint';
import { EvidenceVsInference } from './EvidenceVsInference';

export const GapAnalysisView: React.FC = () => {
  const { gapDiagnosis, setCurrentTab, setActivePrereqConcept, selectedSubject, startQuiz } = useApp();
  const [isScanning, setIsScanning] = useState(false);

  const handleSimulateRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1500);
  };

  if (!gapDiagnosis) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-300">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 mx-auto flex items-center justify-center">
            <BrainCircuit className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
              AI Diagnostic Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              No Learning Gaps Diagnosed Yet
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              TeachLens requires real assessment answers to isolate conceptual misconceptions. Complete a diagnostic assessment in <strong className="text-blue-700">{selectedSubject?.name || 'your subject'}</strong> so our engine can extract empirical evidence.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                if (selectedSubject) {
                  startQuiz(selectedSubject.id);
                } else {
                  setCurrentTab('quiz');
                }
              }}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 transition-all inline-flex items-center gap-2"
            >
              <span>Take Diagnostic Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Breadcrumb & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Flagship Cognitive Engine
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Domain: {selectedSubject?.name || 'Core Curriculum'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Learning Gap Analysis
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Detecting the root conceptual blockage behind student mistakes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateRescan}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all flex items-center gap-2 shadow-xs"
          >
            <Radar className={`w-4 h-4 text-blue-600 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Analyzing Answers...' : 'Re-Run Diagnostic Scan'}</span>
          </button>

          <button
            onClick={() => setCurrentTab('recovery')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start Recovery Plan</span>
          </button>
        </div>
      </div>

      {/* Hero Gap Card: Detected Gap & What TeachLens Found */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
        
        {/* Subtle AI scanline animation */}
        {isScanning && (
          <div className="absolute inset-0 bg-blue-500/5 pointer-events-none z-10 overflow-hidden">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent scan-animation" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Gap Identification Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Critical Gap
              </span>
              <span className="text-xs font-bold text-slate-400">Concept: {gapDiagnosis.conceptId}</span>
            </div>

            <div className="flex items-baseline gap-4">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {gapDiagnosis.conceptName}
              </h2>
              <span className="text-2xl font-black text-rose-600">
                {gapDiagnosis.masteryScore}% Mastery
              </span>
            </div>

            {/* What TeachLens Found */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                What TeachLens Found:
              </h3>
              <p className="text-sm font-semibold text-slate-700 mb-2">
                The student repeatedly struggles with:
              </p>
              <ul className="space-y-1.5 pl-1">
                {gapDiagnosis.struggles.map((st, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why This May Be Happening */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5 mb-1">
                <BrainCircuit className="w-3.5 h-3.5" />
                Why this may be happening
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                "{gapDiagnosis.whyHappening}"
              </p>
            </div>
          </div>

          {/* Right: AI Diagnostic Visual Radar & Status */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col items-center text-center justify-between space-y-4">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-blue-400/40 animate-ping" />
              <div className="absolute inset-2 rounded-full border border-blue-500/30" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
                <BrainCircuit className="w-8 h-8" />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Cognitive Gap Diagnostic Active
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                TeachLens AI verified that errors are systematic (not random noise), requiring prerequisite intervention.
              </p>
            </div>

            <div className="w-full flex items-center justify-around pt-3 border-t border-slate-200/60 text-xs">
              <div>
                <span className="block font-bold text-slate-900">{gapDiagnosis.evidence?.length || 2} Items</span>
                <span className="text-[11px] text-slate-400">Failed</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="block font-bold text-rose-600">Pattern</span>
                <span className="text-[11px] text-slate-400">Isolated</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="block font-bold text-emerald-600">15 min</span>
                <span className="text-[11px] text-slate-400">Recovery</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Core Component: Evidence vs Inference Breakdown */}
      <EvidenceVsInference
        evidence={gapDiagnosis.evidence || []}
        possibleRootCauses={gapDiagnosis.possibleRootCauses || []}
        prerequisiteGaps={gapDiagnosis.prerequisiteGaps || []}
      />

      {/* Mistake Fingerprint Component */}
      <MistakeFingerprint
        patterns={gapDiagnosis.mistakeFingerprint || []}
        mostRepeatedPattern={gapDiagnosis.mostRepeatedPattern || 'Exponent decrement misstep'}
      />

      {/* Prerequisite & Recovery Launch Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Recommended Action Plan
          </span>
          <h3 className="text-lg font-bold">
            Close the Gap in 15 Minutes
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Our step-by-step recovery module reviews {gapDiagnosis.conceptName} with interactive examples, guided drills, and instant reassessment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActivePrereqConcept(gapDiagnosis.conceptId);
              setCurrentTab('prerequisites');
            }}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Network className="w-4 h-4 text-blue-400" />
            <span>View Prerequisite Tree</span>
          </button>

          <button
            onClick={() => setCurrentTab('recovery')}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
          >
            <span>Launch Recovery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
