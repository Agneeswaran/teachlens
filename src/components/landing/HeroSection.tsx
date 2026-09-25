import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Target,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeroSection: React.FC = () => {
  const { setCurrentTab } = useApp();

  return (
    <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Floating subtle ambient blue gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-blue-200/30 via-sky-100/40 to-cyan-100/20 blur-3xl pointer-events-none rounded-full -z-10" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100/30 blur-2xl rounded-full pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-sky-100/40 blur-2xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/70 text-blue-700 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Next-Gen AI Learning-Gap Intelligence</span>
            <span className="text-blue-400">|</span>
            <span className="text-slate-600 font-medium">Built for Mastery, Not Just Scores</span>
          </div>
        </motion.div>

        {/* Large Headline */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08]"
          >
            See the Gap.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-blue-800">
              Master the Concept.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            TeachLens uses AI to understand how students learn, detect hidden learning gaps, and create personalized recovery paths.
          </motion.p>

          {/* Primary & Secondary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setCurrentTab('gap-analysis')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white text-slate-700 font-semibold text-sm border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Explore TeachLens AI</span>
            </button>
          </motion.div>
        </div>

        {/* Hero Visual: Sophisticated Interactive Live Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="relative mt-12 max-w-5xl mx-auto"
        >
          {/* Glass frame */}
          <div className="relative rounded-3xl bg-white border border-slate-200/80 shadow-2xl shadow-blue-500/10 overflow-hidden">
            {/* Window bar */}
            <div className="px-6 py-3.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-semibold text-slate-500">
                  TeachLens Adaptive Engine — Live Realtime Diagnostic
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>AI Synced</span>
              </div>
            </div>

            {/* Dashboard content inside preview */}
            <div className="p-6 sm:p-8 bg-white space-y-6">
              
              {/* Top row cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Detected Gap Card */}
                <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Detected Gap
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">
                      Critical Gap
                    </span>
                  </div>
                  <div className="my-2">
                    <h4 className="text-lg font-bold text-slate-900">Differentiation</h4>
                    <p className="text-xs text-slate-500">Mastery: 32% (Drops on Power Rule)</p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full w-[32%]" />
                  </div>
                </div>

                {/* 2. AI Root Cause Insight */}
                <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                      <BrainCircuit className="w-3.5 h-3.5" />
                      AI Diagnosis
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                      Evidence-Backed
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 my-2 leading-relaxed font-medium">
                    "Repeatedly omits exponent decrement <code className="bg-white px-1 py-0.5 rounded text-blue-800">n - 1</code> while multiplying coefficients correctly."
                  </p>
                  <div className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                    <span>Evidence: 4 incorrect answers flagged</span>
                  </div>
                </div>

                {/* 3. Recovery Path Active */}
                <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      Personalized Recovery
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      15 Min Plan
                    </span>
                  </div>
                  <div className="my-2">
                    <h4 className="text-sm font-bold text-slate-900">Step 3 of 5 In Progress</h4>
                    <p className="text-xs text-slate-500">Guided practice drills + instant re-check</p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[60%]" />
                  </div>
                </div>
              </div>

              {/* Bottom live teaser banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">Targeted Recovery boosts retention by 44%</h5>
                    <p className="text-xs text-slate-300">
                      Reassess immediately after completing your personalized micro-module.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentTab('gap-analysis')}
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold transition-colors whitespace-nowrap"
                >
                  View Gap Engine
                </button>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
