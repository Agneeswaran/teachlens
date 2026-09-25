import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  BrainCircuit,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  User,
  Building,
  GraduationCap,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authMode,
    openAuthModal,
    login,
    register
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (authMode === 'login') {
        await login({ email, password });
      } else {
        await register({
          name: name.trim() || 'Learner',
          email: email.trim().toLowerCase(),
          password,
          role: selectedRole,
          institution:
            selectedRole === 'teacher'
              ? institution.trim() || 'Institution'
              : undefined,
          department:
            selectedRole === 'teacher'
              ? department.trim() || 'STEM'
              : undefined
        });
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Authentication failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto"
          >

            {/* Close Button */}
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column */}
            <div className="md:col-span-5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">

              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-sky-300" />
                  </div>

                  <span className="font-extrabold text-2xl tracking-tight text-white">
                    TeachLens
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold leading-snug tracking-tight">
                  See the Gap. Understand the Mistake. Master the Concept.
                </h3>

                <p className="text-xs text-blue-100/90 mt-3 leading-relaxed">
                  TeachLens doesn't judge where you are. It measures how far
                  you've come through real adaptive diagnosis.
                </p>
              </div>

              {/* Feature Badges */}
              <div className="relative z-10 my-8 space-y-3">

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
                  <BrainCircuit className="w-5 h-5 text-sky-300 shrink-0" />

                  <div>
                    <div className="text-xs font-bold text-white">
                      Persistent Learning Intelligence
                    </div>

                    <div className="text-[11px] text-blue-200">
                      Real database storage across all sessions
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0" />

                  <div>
                    <div className="text-xs font-bold text-white">
                      Educator Verification Gating
                    </div>

                    <div className="text-[11px] text-blue-200">
                      Protected teacher portals and student privacy
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-200">
                <span>Production SQLite Backend</span>
                <span>Port 8010</span>
              </div>

            </div>

            {/* Right Column */}
            <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white">

              {/* Header */}
              <div className="mb-6">

                <div className="flex items-center gap-2 mb-2">

                  <button
                    onClick={() => {
                      setErrorMessage(null);
                      openAuthModal('login');
                    }}
                    className={`text-sm font-bold pb-1 transition-all ${
                      authMode === 'login'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Sign In
                  </button>

                  <span className="text-slate-300">|</span>

                  <button
                    onClick={() => {
                      setErrorMessage(null);
                      openAuthModal('register');
                    }}
                    className={`text-sm font-bold pb-1 transition-all ${
                      authMode === 'register'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Create Real Account
                  </button>

                </div>

                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {authMode === 'login'
                    ? 'Welcome back'
                    : 'Start your learning journey'}
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  {authMode === 'login'
                    ? 'Enter your institutional credentials to load your persistent learning records.'
                    : 'Create your account. New accounts start with a clean dashboard until assessments are taken.'}
                </p>

              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">

                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />

                  <span>{errorMessage}</span>

                </div>
              )}

              {/* Role Toggle */}
              {authMode === 'register' && (
                <div className="mb-4">

                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Account Type
                  </label>

                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/70">

                    <button
                      type="button"
                      onClick={() => setSelectedRole('student')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        selectedRole === 'student'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Student Account
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('teacher')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        selectedRole === 'teacher'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Educator Account
                    </button>

                  </div>

                </div>
              )}

              {/* Teacher Verification Notice */}
              {authMode === 'register' && selectedRole === 'teacher' && (
                <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">

                  <div className="font-bold flex items-center gap-1.5">

                    <Clock className="w-3.5 h-3.5 text-amber-600" />

                    Teacher Verification Required

                  </div>

                  <p className="text-[11px] text-amber-800">
                    Educator registrations are created with{' '}
                    <strong>PENDING</strong> status. An administrator must
                    verify your credentials before class analytics become
                    accessible.
                  </p>

                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">

                {/* Name */}
                {authMode === 'register' && (
                  <div>

                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>

                    <div className="relative">

                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                      />

                    </div>

                  </div>
                )}

                {/* Teacher Information */}
                {authMode === 'register' && selectedRole === 'teacher' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <div>

                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Institution / School
                      </label>

                      <div className="relative">

                        <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                        <input
                          type="text"
                          required
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          placeholder="e.g. Your University"
                          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                        />

                      </div>

                    </div>

                    <div>

                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Department
                      </label>

                      <div className="relative">

                        <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                        <input
                          type="text"
                          required
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="e.g. Computer Science"
                          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                        />

                      </div>

                    </div>

                  </div>
                )}

                {/* Email */}
                <div>

                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@academy.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                    />

                  </div>

                </div>

                {/* Password */}
                <div>

                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>

                  <div className="relative">

                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                    />

                  </div>

                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >

                  <span>
                    {isLoading
                      ? 'Authenticating...'
                      : authMode === 'login'
                      ? 'Sign In to TeachLens'
                      : 'Create Real Account'}
                  </span>

                  <ArrowRight className="w-4 h-4" />

                </button>

              </form>

              {/* Secure Authentication Notice */}
              <div className="mt-5 pt-3 border-t border-slate-100">

                <div className="flex items-center gap-2 text-[11px] text-slate-500">

                  <ShieldCheck className="w-4 h-4 text-emerald-600" />

                  <span>
                    Secure authentication. Use your registered account
                    credentials to continue.
                  </span>

                </div>

              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};