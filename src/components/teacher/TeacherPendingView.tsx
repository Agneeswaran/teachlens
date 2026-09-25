import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldAlert, XCircle, RefreshCw, LogOut, GraduationCap, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TeacherPendingView: React.FC = () => {
  const { currentUser, teacherStatus, checkTeacherVerification, logout } = useApp();
  const [isChecking, setIsChecking] = useState(false);

  const handleRefreshStatus = async () => {
    setIsChecking(true);
    await checkTeacherVerification();
    setIsChecking(false);
  };

  const getStatusConfig = () => {
    switch (teacherStatus) {
      case 'PENDING':
        return {
          icon: Clock,
          iconBg: 'bg-amber-100 text-amber-600 border-amber-200',
          title: 'Account Awaiting Verification',
          badge: 'Status: Pending Administrator Review',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
          desc: 'Your teacher account has been created and is currently awaiting verification by a TeachLens administrator. For academic security and student privacy, teacher privileges are only activated after institutional verification.',
          quote: '"Your teacher account is awaiting verification."'
        };
      case 'REJECTED':
        return {
          icon: XCircle,
          iconBg: 'bg-rose-100 text-rose-600 border-rose-200',
          title: 'Verification Not Approved',
          badge: 'Status: Rejected',
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
          desc: 'Your application for educator credentials could not be verified by the administrator. Please reach out to your school administration or contact TeachLens support.',
          quote: '"Your teacher account has been rejected."'
        };
      case 'SUSPENDED':
        return {
          icon: ShieldAlert,
          iconBg: 'bg-red-100 text-red-600 border-red-200',
          title: 'Account Suspended',
          badge: 'Status: Suspended',
          badgeBg: 'bg-red-50 text-red-700 border-red-200',
          desc: 'This educator account is currently suspended. Please contact the platform administrator to reactivate access.',
          quote: '"Your teacher account has been suspended."'
        };
      default:
        return {
          icon: Clock,
          iconBg: 'bg-amber-100 text-amber-600 border-amber-200',
          title: 'Account In Review',
          badge: 'Status: In Review',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
          desc: 'Your educator profile is currently undergoing verification.',
          quote: '"Your teacher account is awaiting verification."'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-300">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-6 text-center"
      >
        <div className={`w-16 h-16 rounded-2xl ${config.iconBg} border mx-auto flex items-center justify-center shadow-xs`}>
          <Icon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2">
            <span className={config.badgeBg}>{config.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {config.title}
          </h2>
          <p className="text-sm font-semibold text-blue-600">
            {config.quote}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
            {config.desc}
          </p>
        </div>

        {/* Profile Details Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Registered Educator Information
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500">Educator:</span>{' '}
              <strong className="text-slate-800">{currentUser?.name || 'Educator'}</strong>
            </div>
            <div>
              <span className="text-slate-500">Email:</span>{' '}
              <strong className="text-slate-800">{currentUser?.email || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-slate-500">Institution:</span>{' '}
              <strong className="text-slate-800">{currentUser?.teacher_institution || 'Academy'}</strong>
            </div>
            <div>
              <span className="text-slate-500">Access Level:</span>{' '}
              <span className="font-semibold text-amber-700">Gated (Pending Verification)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRefreshStatus}
            disabled={isChecking}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking status...' : 'Check Verification Status'}</span>
          </button>

          <button
            onClick={logout}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
          Tip: Administrators can approve this teacher immediately via the Admin Verification Dashboard.
        </div>
      </motion.div>
    </div>
  );
};
