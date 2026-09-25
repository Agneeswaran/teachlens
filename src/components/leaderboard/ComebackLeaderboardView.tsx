import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Sparkles,
  Trophy,
  Award,
  ShieldCheck,
  RotateCcw,
  RefreshCw,
  Info,
  Medal,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';
import { TeachLensAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import type { ComebackLeaderboardEntry } from '../../types';

export const ComebackLeaderboardView: React.FC = () => {
  const { subjects, selectedSubject, currentUser } = useApp();
  const [entries, setEntries] = useState<ComebackLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string>(selectedSubject?.id || '');

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = await TeachLensAPI.getComebackLeaderboard(activeSubjectFilter || undefined);
      setEntries(data);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [activeSubjectFilter]);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 font-extrabold flex items-center justify-center text-sm border border-amber-300 shadow-xs">
            🥇
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center text-sm border border-slate-300 shadow-xs">
            🥈
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 font-extrabold flex items-center justify-center text-sm border border-amber-200 shadow-xs">
            🥉
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-600 font-bold flex items-center justify-center text-xs border border-slate-200">
            #{rank}
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Comeback Leaderboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Delta Rank
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Celebrating genuine learning growth. Students are ranked by their <strong>mastery improvement delta (+%)</strong> after completing targeted recovery, not starting baseline scores.
          </p>
        </div>

        {/* Refresh */}
        <button
          onClick={fetchLeaderboard}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Rankings</span>
        </button>
      </div>

      {/* Core Philosophy Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-lg space-y-2 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full bg-white/5 rounded-l-full pointer-events-none" />
        <div className="relative z-10 flex items-start gap-3">
          <HeartHandshake className="w-6 h-6 text-sky-300 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
              "TeachLens doesn't judge where you are. It measures how far you've come."
            </h3>
            <p className="text-xs text-blue-100 leading-relaxed max-w-2xl">
              Starting at 30% and climbing to 75% earns more Comeback Points (+45%) than cruising at 85% to 90% (+5%). 
              We reward dedication to repairing foundational misconceptions through personalized remediation.
            </p>
          </div>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveSubjectFilter('')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeSubjectFilter === ''
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-200'
          }`}
        >
          All Subjects
        </button>
        {subjects.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSubjectFilter(sub.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeSubjectFilter === sub.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-200'
            }`}
          >
            <span>{sub.icon}</span>
            <span>{sub.name}</span>
          </button>
        ))}
      </div>

      {/* Leaderboard Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-slate-800">
              Top Comeback Champions {activeSubjectFilter ? `in ${subjects.find(s => s.id === activeSubjectFilter)?.name}` : 'Platform-Wide'}
            </span>
          </div>
          <span className="text-xs text-slate-400">Live Database Calculations</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
            Loading comeback rankings...
          </div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-blue-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">No Comeback Records Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Complete your first recovery plan and take the post-recovery reassessment to log your improvement delta!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Rank</th>
                  <th className="py-3.5 px-6">Student</th>
                  <th className="py-3.5 px-6">Concept Rebuilt</th>
                  <th className="py-3.5 px-6">Subject</th>
                  <th className="py-3.5 px-6 text-center">Improvement Delta</th>
                  <th className="py-3.5 px-6 text-right">Comeback Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((entry) => {
                  return (
                    <tr
                      key={`${entry.student_id}-${entry.concept_name}`}
                      className={`transition-colors ${
                        entry.is_current_user
                          ? 'bg-blue-50/70 font-semibold'
                          : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <td className="py-4 px-6">
                        {getRankBadge(entry.rank)}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {entry.display_name}
                          </span>
                          {entry.is_current_user && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                              You
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-medium text-slate-800">
                          {entry.concept_name || 'Differentiation'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-500">
                        {entry.subject_name || 'Mathematics'}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <TrendingUp className="w-3 h-3 text-emerald-600" />
                          +{entry.improvement_delta}%
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right font-extrabold text-blue-700 text-sm">
                        {entry.total_comeback_points} pts
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Points = (Improvement Delta) + (Recovery Plan Completion Bonus)</span>
          <span>Privacy Protected</span>
        </div>
      </div>

    </div>
  );
};
