import React from 'react';
import { Sparkles, Shield, Cpu, BookOpen, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentTab, setUserRole } = useApp();

  return (
    <footer className="bg-slate-50/80 border-t border-slate-100 text-slate-600 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-black text-xl text-slate-900 tracking-tight">
                Teach<span className="text-blue-600">Lens</span>
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 italic">
              "See the Gap. Understand the Mistake. Master the Concept."
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enterprise AI EdTech platform identifying root conceptual misconceptions through evidence-backed diagnostic learning science.
            </p>
          </div>

          {/* Platform Columns */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Student Engine
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setCurrentTab('gap-analysis')}
                  className="hover:text-blue-600 transition-colors"
                >
                  AI Gap Diagnosis
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('prerequisites')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Prerequisite Graph
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('recovery')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Targeted Recovery Path
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('quiz')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Adaptive Calibration Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('mastery')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Concept Mastery Grid
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Educator Portal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    setUserRole('teacher');
                    setCurrentTab('teacher');
                  }}
                  className="hover:text-blue-600 transition-colors"
                >
                  Cohort Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setUserRole('teacher');
                    setCurrentTab('early-warnings');
                  }}
                  className="hover:text-blue-600 transition-colors"
                >
                  Early Warning Signals
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setUserRole('teacher');
                    setCurrentTab('teacher');
                  }}
                  className="hover:text-blue-600 transition-colors"
                >
                  Class Concept Heatmap
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setUserRole('teacher');
                    setCurrentTab('teacher');
                  }}
                  className="hover:text-blue-600 transition-colors"
                >
                  Roster Interventions
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Pedagogical Standards
            </h4>
            <div className="space-y-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Evidence-Grounding Separation</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-500" />
                <span>Confidence-Calibration Matrix</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Bloom’s Taxonomy Alignment</span>
              </div>
              <p className="pt-2 text-[11px] text-slate-400">
                TeachLens strictly avoids raw score penalization, focusing solely on cognitive gap remediation.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TeachLens Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-blue-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-blue-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-blue-600 cursor-pointer">System Status</span>
            <span className="text-slate-400">v1.0.0-production</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
