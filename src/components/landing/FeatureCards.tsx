import React from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  BarChart2,
  Fingerprint,
  RotateCcw,
  Sparkles,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FeatureCards: React.FC = () => {
  const { setCurrentTab } = useApp();

  const features = [
    {
      id: 'ai-analysis',
      title: 'AI Learning Analysis',
      desc: 'Dissects student responses using cognitive diagnostic modeling, separating evidence from inference.',
      icon: BrainCircuit,
      color: 'blue',
      tab: 'gap-analysis',
      badge: 'Flagship Core'
    },
    {
      id: 'mastery',
      title: 'Concept-Level Mastery',
      desc: 'Granular topic tracking replacing blunt test grades with continuous, actionable knowledge states.',
      icon: BarChart2,
      color: 'sky',
      tab: 'mastery',
      badge: 'Topic Granular'
    },
    {
      id: 'fingerprint',
      title: 'Mistake Pattern Detection',
      desc: 'Classifies repeat errors into structural categories: concept gap, formula confusion, sign slips.',
      icon: Fingerprint,
      color: 'indigo',
      tab: 'gap-analysis',
      badge: 'Fingerprint™'
    },
    {
      id: 'recovery',
      title: 'Personalized Recovery',
      desc: 'Generates lean 15-minute targeted remediation workflows that rebuild foundational prerequisites.',
      icon: RotateCcw,
      color: 'blue',
      tab: 'recovery',
      badge: '15-Min Scaffolding'
    },
    {
      id: 'adaptive',
      title: 'Adaptive Practice',
      desc: 'Calibrates question difficulty against real-time confidence to isolate guesses from true comprehension.',
      icon: Sparkles,
      color: 'sky',
      tab: 'quiz',
      badge: 'Confidence Calibrated'
    },
    {
      id: 'reassessment',
      title: 'Continuous Reassessment',
      desc: 'Direct empirical verification of learning gains before upgrading concept dependency status.',
      icon: TrendingUp,
      color: 'emerald',
      tab: 'reassessment',
      badge: '+44% Verified Delta'
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Why TeachLens?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Pedagogical Intelligence Engineered for True Comprehension
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Standard LMS tools stop at scores. TeachLens identifies the exact cognitive root cause and cures it.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;

            return (
              <motion.div
                key={feat.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => setCurrentTab(feat.tab as any)}
                className="group relative p-7 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200/80 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50/80 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Explore module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section bottom interactive callout */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 border border-blue-100/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-slate-900">
              Ready to see your hidden learning gaps?
            </h4>
            <p className="text-sm text-slate-600 mt-1">
              Start our 3-minute diagnostic assessment to generate your personalized Mistake Fingerprint™.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('quiz')}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span>Take Diagnostic Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
