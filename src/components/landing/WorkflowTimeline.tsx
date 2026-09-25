import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileSearch,
  SearchAlert,
  BrainCircuit,
  RotateCcw,
  Sparkles,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WorkflowTimeline: React.FC = () => {
  const { setCurrentTab } = useApp();
  const [activeStep, setActiveStep] = useState<number>(3); // Diagnose active by default

  const steps = [
    {
      id: 1,
      title: 'Assess',
      tagline: 'Continuous calibration',
      icon: FileSearch,
      desc: 'Adaptive micro-evaluations measure knowledge and confidence calibration simultaneously.',
      highlight: 'Confidence calibration captures lucky guesses vs genuine mastery.'
    },
    {
      id: 2,
      title: 'Detect',
      tagline: 'Pattern extraction',
      icon: SearchAlert,
      desc: 'AI isolates isolated mistakes from recurring cognitive misconceptions across problem sets.',
      highlight: 'Filters noisy calculation slips from deep conceptual gaps.'
    },
    {
      id: 3,
      title: 'Diagnose',
      tagline: 'Evidence vs Inference',
      icon: BrainCircuit,
      desc: 'Separates empirical evidence (exact error lines) from probabilistic inference (root cause hypothesis).',
      highlight: 'Explicitly maps how prerequisite gaps like Algebra exponent laws impair Calculus.'
    },
    {
      id: 4,
      title: 'Recover',
      tagline: 'Targeted micro-plan',
      icon: RotateCcw,
      desc: 'Generates a lean 15-minute sequence directly targeting the underlying conceptual blockage.',
      highlight: 'Eliminates wasted hours re-reading entire textbook chapters.'
    },
    {
      id: 5,
      title: 'Practice',
      tagline: 'Guided scafolding',
      icon: Sparkles,
      desc: 'Solve guided drills with instantaneous diagnostic hints tailored to your exact mistake fingerprint.',
      highlight: 'Step-by-step cognitive scaffolding prevents frustration.'
    },
    {
      id: 6,
      title: 'Reassess',
      tagline: 'Verified mastery gain',
      icon: TrendingUp,
      desc: 'Targeted reassessment measures true delta (+44% gain) and upgrades prerequisite unlock status.',
      highlight: 'Concrete before-and-after verification guarantees long-term retention.'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50/60 border-y border-slate-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            The Closed-Loop Pedagogical Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            How TeachLens Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            From subtle misconception detection to certified mastery in six continuous, evidence-grounded steps.
          </p>
        </div>

        {/* Horizontal Timeline Bar */}
        <div className="relative mb-12">
          
          {/* Animated Connecting Track */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-200 rounded-full z-0">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((activeStep - 1) / 5) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              const isSelected = activeStep === step.id;
              const isCompleted = activeStep > step.id;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 text-center flex flex-col items-center border ${
                    isSelected
                      ? 'bg-white border-blue-400 shadow-lg shadow-blue-500/10 scale-105 ring-2 ring-blue-500/20'
                      : isCompleted
                      ? 'bg-white/90 border-blue-200 text-slate-700 hover:border-blue-300'
                      : 'bg-white/60 border-slate-200/70 text-slate-500 hover:bg-white'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : isCompleted
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-0.5">
                    Step 0{step.id}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{step.tagline}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Step Deep Dive Card */}
        {steps.map((step) => {
          if (step.id !== activeStep) return null;
          const Icon = step.icon;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Icon className="w-8 h-8" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Step {step.id} of 6
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mt-1">
                  {step.desc}
                </p>
                <div className="mt-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100/60 text-xs text-blue-900 font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{step.highlight}</span>
                </div>
              </div>
              <button
                onClick={() => setCurrentTab('gap-analysis')}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-sm flex items-center gap-1.5"
              >
                <span>Experience Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}

      </div>
    </section>
  );
};
