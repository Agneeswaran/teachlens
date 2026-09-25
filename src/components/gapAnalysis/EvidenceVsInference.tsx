import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';
import { EvidenceItem } from '../../types';

interface EvidenceVsInferenceProps {
  evidence: EvidenceItem[];
  possibleRootCauses: string[];
  prerequisiteGaps: {
    conceptId: string;
    conceptName: string;
    impactLevel: 'high' | 'medium' | 'low';
    note: string;
  }[];
}

export const EvidenceVsInference: React.FC<EvidenceVsInferenceProps> = ({
  evidence,
  possibleRootCauses,
  prerequisiteGaps
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Left Column: Concrete Observed EVIDENCE */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                1
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Observable Evidence
                </h3>
                <p className="text-[11px] text-slate-400">Directly recorded student test data</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
              Verified Fact
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            TeachLens grounds every finding in exact question timestamps and algebraic steps:
          </p>

          {/* Evidence List */}
          <div className="space-y-3">
            {evidence.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 pl-3.5 leading-relaxed">
                  {item.detail}
                </p>
                <div className="mt-2 pl-3.5 flex items-center gap-2 text-[11px]">
                  <span className="text-slate-400">Context:</span>
                  <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-700 font-mono text-[10px]">
                    {item.questionRef}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Zero guesswork: Grounded in 4 empirical attempts.</span>
        </div>
      </div>

      {/* Right Column: AI Probabilistic INFERENCE & ROOT CAUSES */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-50/50 via-white to-sky-50/30 border border-blue-200/80 shadow-xs flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
                2
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-blue-600" />
                  Probabilistic Inference
                </h3>
                <p className="text-[11px] text-slate-500">AI Diagnostic Hypothesis & Root Cause</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              AI Diagnostic
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Synthesized cognitive breakdown explaining <strong>why</strong> the errors repeat:
          </p>

          {/* Root Cause Cards */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white border border-blue-200/70 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                Primary Root Cause
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">
                Power Rule Misunderstanding
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                The student is conflating polynomial differentiation <code className="bg-blue-50 text-blue-700 px-1 py-0.5 rounded">d/dx(xⁿ) = n·xⁿ⁻¹</code> with constant rate multiplier functions, leading to systematic retention of the original power.
              </p>
            </div>

            {/* Prerequisite Contributing Factor */}
            {prerequisiteGaps.map((prereq) => (
              <div
                key={prereq.conceptId}
                className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/70"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    Contributing Prerequisite Gap
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                    {prereq.impactLevel.toUpperCase()} IMPACT
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-900 mt-1">
                  {prereq.conceptName}
                </h5>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {prereq.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-blue-100 flex items-center justify-between text-xs text-blue-900">
          <span className="font-semibold">Action: Launch targeted recovery</span>
          <span className="text-blue-600 font-bold">15 mins estimated →</span>
        </div>
      </div>

    </div>
  );
};
