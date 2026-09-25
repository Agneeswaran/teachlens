import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Flame,
  Trophy,
  CheckCircle2,
  RotateCcw,
  Target,
  Sparkles,
  ShieldCheck,
  Download,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudentProfileView: React.FC = () => {
  const { studentProfile, concepts, setCurrentTab } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={studentProfile.avatarUrl}
            alt={studentProfile.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-50 border-2 border-white shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {studentProfile.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                Student
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{studentProfile.email}</span>
            </p>
            <p className="text-xs text-slate-600 font-semibold flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>{studentProfile.grade}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('Diagnostic summary exported as PDF report!')}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
          <button
            onClick={() => setCurrentTab('quiz')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Practice Quiz</span>
          </button>
        </div>
      </div>

      {/* Four Mini Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Overall Mastery
          </span>
          <span className="text-3xl font-extrabold text-blue-600">
            {studentProfile.overallMastery}%
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">+7% this month</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Concepts Mastered
          </span>
          <span className="text-3xl font-extrabold text-emerald-600">
            {studentProfile.conceptsMasteredCount}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">out of 31 topics</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Active Streak
          </span>
          <span className="text-3xl font-extrabold text-amber-500">
            {studentProfile.streakDays}d
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Daily practice record</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Recovery Plans
          </span>
          <span className="text-3xl font-extrabold text-indigo-600">
            5
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Successfully completed</span>
        </div>
      </div>

      {/* Two Columns: Concept Distribution & Professional Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Concept Distribution */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Curriculum Mastery Distribution
            </h3>
            <span className="text-xs font-semibold text-blue-600 cursor-pointer hover:underline" onClick={() => setCurrentTab('mastery')}>
              View All
            </span>
          </div>

          <div className="space-y-3.5">
            {concepts.map((c) => (
              <div key={c.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{c.name}</span>
                  <span className="font-extrabold text-slate-900">{c.masteryPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      c.masteryPercentage >= 80
                        ? 'bg-emerald-500'
                        : c.masteryPercentage >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${c.masteryPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Subtle & Professional Milestones */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Verified Pedagogical Milestones
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Professional achievements certified through empirical diagnostics
            </p>
          </div>

          <div className="space-y-3">
            {(studentProfile.achievements && studentProfile.achievements.length > 0) ? (
              studentProfile.achievements.map((ach: any) => (
                <div
                  key={ach.id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{ach.title}</h4>
                      <span className="text-[10px] text-slate-400">{ach.unlockedAt || 'In Progress'}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                <Sparkles className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-600">Your first achievement is waiting.</p>
                <p className="text-[11px]">Achievements are certified through real assessment and recovery events.</p>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-blue-900 leading-relaxed font-medium">
            TeachLens avoids superficial gamification badges. All milestones represent verified cognitive retention.
          </div>
        </div>

      </div>

    </div>
  );
};
