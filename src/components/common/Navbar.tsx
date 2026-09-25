import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  LayoutDashboard,
  BrainCircuit,
  Network,
  Activity,
  RotateCcw,
  History,
  GraduationCap,
  Bell,
  User,
  ShieldAlert,
  ArrowRight,
  BarChart3,
  Users,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Flame,
  Trophy
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab, SubjectItem } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    userRole,
    setUserRole,
    isLoggedIn,
    currentUser,
    logout,
    unreadNotifsCount,
    setIsNotificationsOpen,
    openAuthModal,
    subjects,
    selectedSubject,
    setSelectedSubject
  } = useApp();

  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const studentNavItems: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quiz', label: 'Adaptive Quiz', icon: Activity },
    { id: 'gap-analysis', label: 'AI Gap Analysis', icon: BrainCircuit },
    { id: 'recovery', label: 'Recovery Path', icon: RotateCcw },
    { id: 'mastery', label: 'Mastery', icon: BarChart3 },
    { id: 'squads', label: 'Peer Squads', icon: Users },
    { id: 'leaderboard', label: 'Comeback Rank', icon: TrendingUp },
    { id: 'history', label: 'History', icon: History }
  ];

  const teacherNavItems: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'teacher', label: 'Teacher Portal', icon: GraduationCap },
    { id: 'early-warnings', label: 'Early Warning Signals', icon: ShieldAlert },
    { id: 'squads', label: 'Peer Squads', icon: Users }
  ];

  const adminNavItems: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'admin-teachers', label: 'Teacher Verification Admin', icon: ShieldCheck }
  ];

  const getNavItems = () => {
    if (userRole === 'admin') return adminNavItems;
    if (userRole === 'teacher') return teacherNavItems;
    return studentNavItems;
  };

  const isLanding = currentTab === 'landing';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Subject Picker */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => setCurrentTab(isLoggedIn ? 'dashboard' : 'landing')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                    Teach<span className="text-blue-600">Lens</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                    AI
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-400 hidden sm:block tracking-tight">
                  Learning-Gap Intelligence
                </p>
              </div>
            </div>

            {/* Subject Selector Dropdown (When logged in as student or in app) */}
            {selectedSubject && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 hover:bg-slate-100 hover:border-blue-200 transition-all text-xs font-bold text-slate-800"
                >
                  <span className="text-sm">{selectedSubject.icon}</span>
                  <span>{selectedSubject.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <AnimatePresence>
                  {isSubjectDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 space-y-1"
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                        Select Active Subject
                      </div>
                      {subjects.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setSelectedSubject(sub);
                            setIsSubjectDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                            selectedSubject.id === sub.id
                              ? 'bg-blue-50 text-blue-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-base">{sub.icon}</span>
                          <div>
                            <div>{sub.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{sub.description}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Center Navigation Links */}
          {isLoggedIn && !isLanding && (
            <nav className="hidden xl:flex items-center gap-1 p-1 bg-slate-50/80 rounded-full border border-slate-200/60 shadow-xs">
              {getNavItems().map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`relative px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                      isActive
                        ? 'text-blue-700 bg-white shadow-xs border border-blue-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* Streak and Comeback Badges for Student */}
                {userRole === 'student' && currentUser && (
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold" title="Current Learning Streak">
                      <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      <span>{currentUser.streak_days}d</span>
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold" title="Comeback Points Earned">
                      <Trophy className="w-3.5 h-3.5 text-blue-600" />
                      <span>{currentUser.comeback_points} pts</span>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                <button
                  onClick={() => setIsNotificationsOpen(true)}
                  aria-label="Notifications"
                  className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200/80 hover:border-blue-200 hover:bg-slate-50 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {(currentUser?.name || 'U')[0].toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                      {currentUser?.name?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 space-y-1"
                      >
                        <div className="px-3 py-2 border-b border-slate-100">
                          <div className="font-bold text-xs text-slate-900">{currentUser?.name}</div>
                          <div className="text-[11px] text-slate-400 truncate">{currentUser?.email}</div>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 capitalize">
                            {userRole}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setCurrentTab('profile');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Learning Profile</span>
                        </button>

                        {userRole === 'admin' && (
                          <button
                            onClick={() => {
                              setCurrentTab('admin-teachers');
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                            <span>Teacher Approvals</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            logout();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile secondary tab bar when in application */}
        {isLoggedIn && !isLanding && (
          <div className="xl:hidden flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-slate-100">
            {getNavItems().map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
