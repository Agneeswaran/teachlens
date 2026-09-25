import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Users,
  Plus,
  KeyRound,
  Trophy,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  LogOut,
  RefreshCw,
  Search,
  BookOpen
} from 'lucide-react';
import { TeachLensAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import type { SquadItem } from '../../types';

export const PeerSquadsView: React.FC = () => {
  const { subjects, selectedSubject } = useApp();
  const [squads, setSquads] = useState<SquadItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSquad, setActiveSquad] = useState<SquadItem | null>(null);
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [isJoinLoading, setIsJoinLoading] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [newSquadName, setNewSquadName] = useState<string>('');
  const [newSquadSubject, setNewSquadSubject] = useState<string>(selectedSubject?.id || 'subj-math');
  const [newSquadGoal, setNewSquadGoal] = useState<string>('Solve 50 targeted practice questions');
  const [newSquadTarget, setNewSquadTarget] = useState<number>(50);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchSquads = async () => {
    setIsLoading(true);
    try {
      const data = await TeachLensAPI.getSquads(selectedSubject?.id);
      setSquads(data);
      if (data.length > 0 && !activeSquad) {
        // If user is a member of any squad, select that first
        const mySquad = data.find((s) => s.is_member) || data[0];
        loadSquadDetails(mySquad.id);
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load study squads.' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSquadDetails = async (squadId: string) => {
    try {
      const details = await TeachLensAPI.getSquadDetails(squadId);
      setActiveSquad(details);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchSquads();
  }, [selectedSubject]);

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    setIsJoinLoading(true);
    setFeedback(null);
    try {
      const res = await TeachLensAPI.joinSquad(joinCodeInput.trim());
      setFeedback({ type: 'success', message: res.message });
      setJoinCodeInput('');
      await fetchSquads();
      if (res.squad_id) {
        await loadSquadDetails(res.squad_id);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Invalid join code.' });
    } finally {
      setIsJoinLoading(false);
    }
  };

  const handleCreateSquad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName.trim()) return;
    try {
      const created = await TeachLensAPI.createSquad({
        name: newSquadName.trim(),
        subject_id: newSquadSubject,
        goal_description: newSquadGoal,
        goal_target: newSquadTarget
      });
      setIsCreateOpen(false);
      setNewSquadName('');
      setFeedback({ type: 'success', message: `Squad "${created.name}" created! Invite code: ${created.join_code}` });
      await fetchSquads();
      await loadSquadDetails(created.id);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to create squad.' });
    }
  };

  const handleLeaveSquad = async (squadId: string) => {
    try {
      await TeachLensAPI.leaveSquad(squadId);
      setFeedback({ type: 'success', message: 'Left squad.' });
      await fetchSquads();
      setActiveSquad(null);
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Could not leave squad.' });
    }
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#38BDF8', '#10B981', '#F59E0B']
      });
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Peer Squads & Study Guilds
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
              Collaborative Comeback
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Group up with peers sharing similar concept gaps. Complete shared recovery goals, earn squad points, and rebuild mastery together.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Squad</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-sm font-bold opacity-70 hover:opacity-100">
            ×
          </button>
        </div>
      )}

      {/* Join Squad Code Strip */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Have an Invite Code?</div>
            <div className="text-[11px] text-slate-400">Join a friend's study group with their squad code (e.g. SQUAD-ABC123)</div>
          </div>
        </div>

        <form onSubmit={handleJoinByCode} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="SQUAD-XXXXXX"
            value={joinCodeInput}
            onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-44"
          />
          <button
            type="submit"
            disabled={isJoinLoading || !joinCodeInput.trim()}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all disabled:opacity-50 shrink-0"
          >
            {isJoinLoading ? 'Joining...' : 'Join Squad'}
          </button>
        </form>
      </div>

      {/* Main Grid: Squad List vs Squad Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Squads List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
            <span>Available Study Guilds ({squads.length})</span>
            <button onClick={fetchSquads} className="text-blue-600 hover:underline flex items-center gap-1">
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-200/90 text-center text-xs text-slate-400">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
              Loading squads...
            </div>
          ) : squads.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-200/90 text-center space-y-3">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700">No squads active yet in this subject.</div>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Be the first to start a study guild and invite peers to conquer challenging concepts!
              </p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Create Squad
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {squads.map((sq) => {
                const isSelected = activeSquad?.id === sq.id;
                const progressPct = Math.round((sq.goal_progress / Math.max(1, sq.goal_target)) * 100);

                return (
                  <div
                    key={sq.id}
                    onClick={() => loadSquadDetails(sq.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:border-blue-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-slate-900">{sq.name}</span>
                      {sq.is_member && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Joined
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 mb-2.5 flex items-center gap-2">
                      <span className="font-medium text-blue-600">{sq.subject_name}</span>
                      <span>•</span>
                      <span>{sq.members_count} member{sq.members_count === 1 ? '' : 's'}</span>
                      <span>•</span>
                      <span className="font-semibold text-amber-600 flex items-center gap-0.5">
                        <Trophy className="w-3 h-3" /> {sq.points} pts
                      </span>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span className="truncate max-w-[200px]">{sq.goal_description}</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, progressPct)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Squad Profile & Active Goal (7 cols) */}
        <div className="lg:col-span-7">
          {activeSquad ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
              
              {/* Squad Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {activeSquad.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {activeSquad.subject_name}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>Created {activeSquad.created_at}</span>
                    <span>•</span>
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
                      Code: {activeSquad.join_code}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeSquad.is_member ? (
                    <button
                      onClick={() => handleLeaveSquad(activeSquad.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-400" />
                      <span>Leave</span>
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        await TeachLensAPI.joinSquad(activeSquad.join_code);
                        await fetchSquads();
                        await loadSquadDetails(activeSquad.id);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      Join Guild
                    </button>
                  )}
                </div>
              </div>

              {/* Shared Collaborative Goal Box */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-50/60 to-sky-50/40 border border-blue-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                        Active Squad Objective
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        {activeSquad.goal_description}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-extrabold text-blue-700">
                      {activeSquad.goal_progress} / {activeSquad.goal_target}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      Items Completed
                    </div>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-white/80 rounded-full h-3 p-0.5 border border-blue-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, (activeSquad.goal_progress / Math.max(1, activeSquad.goal_target)) * 100)}%`
                      }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="bg-gradient-to-r from-blue-600 to-sky-500 h-full rounded-full"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span>
                      {Math.round((activeSquad.goal_progress / Math.max(1, activeSquad.goal_target)) * 100)}% complete
                    </span>
                    {activeSquad.goal_progress >= activeSquad.goal_target ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Goal Achieved!
                      </span>
                    ) : (
                      <span>{activeSquad.goal_target - activeSquad.goal_progress} more to goal celebration</span>
                    )}
                  </div>
                </div>

                {activeSquad.goal_progress >= activeSquad.goal_target && (
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-emerald-800 font-semibold">
                      🎉 Celebration Unlocked! Reassessment bonus credited to all squad members.
                    </span>
                    <button
                      onClick={triggerCelebration}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                    >
                      Celebrate
                    </button>
                  </div>
                )}
              </div>

              {/* Squad Members Leaderboard */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Squad Contributors ({activeSquad.members?.length || 0})
                  </h4>
                  <span className="text-[11px] text-slate-400">Ranked by points contributed</span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                  {activeSquad.members && activeSquad.members.length > 0 ? (
                    activeSquad.members.map((member, idx) => (
                      <div
                        key={member.student_id}
                        className="p-3.5 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-bold text-slate-800">{member.display_name}</div>
                            <div className="text-[10px] text-slate-400">Joined {member.joined_at}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 font-bold text-blue-700">
                          <span>+{member.points_contributed}</span>
                          <span className="text-[10px] font-normal text-slate-400">pts</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No members listed yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                🔒 <strong>Privacy Guard:</strong> Only squad points and anonymized participation are shared with squad members. Private assessment mistakes, diagnostic curves, and individual answers remain isolated to your personal account.
              </div>

            </div>
          ) : (
            <div className="p-12 bg-white rounded-3xl border border-slate-200/90 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">Select a Peer Squad</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Pick a squad from the left or create your own to view live group objectives and contribute recovery drills.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Create Squad Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">Create Study Squad</h3>
                </div>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateSquad} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Squad Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Calculus Comeback Guild"
                    value={newSquadName}
                    onChange={(e) => setNewSquadName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={newSquadSubject}
                    onChange={(e) => setNewSquadSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Squad Objective</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solve 50 Differentiation drills"
                    value={newSquadGoal}
                    onChange={(e) => setNewSquadGoal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Count</label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={newSquadTarget}
                    onChange={(e) => setNewSquadTarget(parseInt(e.target.value) || 20)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    Launch Squad
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
