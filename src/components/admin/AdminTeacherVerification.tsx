import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Building,
  UserCheck,
  Ban,
  Clock,
  Sparkles
} from 'lucide-react';
import { TeachLensAPI } from '../../services/api';
import type { TeacherAdminView } from '../../types';

export const AdminTeacherVerification: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherAdminView[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const data = await TeachLensAPI.getAdminTeachers();
      setTeachers(data);
    } catch (err: any) {
      setFeedbackMessage('Failed to load teachers list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleVerify = async (userId: string) => {
    setActionLoadingId(userId);
    try {
      await TeachLensAPI.verifyTeacher(userId);
      setFeedbackMessage('Teacher verified successfully! Privileges granted.');
      await fetchTeachers();
    } catch {
      setFeedbackMessage('Error verifying teacher.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (userId: string) => {
    setActionLoadingId(userId);
    try {
      await TeachLensAPI.rejectTeacher(userId);
      setFeedbackMessage('Teacher application rejected.');
      await fetchTeachers();
    } catch {
      setFeedbackMessage('Error rejecting teacher.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSuspend = async (userId: string) => {
    setActionLoadingId(userId);
    try {
      await TeachLensAPI.suspendTeacher(userId);
      setFeedbackMessage('Teacher account suspended.');
      await fetchTeachers();
    } catch {
      setFeedbackMessage('Error suspending teacher.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
            <Ban className="w-3 h-3" />
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  const pendingCount = teachers.filter((t) => t.status === 'PENDING').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Teacher Verification Administration
            </h1>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review and grant educator privileges. Only verified teachers can access student cohorts and diagnostic curves.
          </p>
        </div>

        <button
          onClick={fetchTeachers}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {feedbackMessage && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center justify-between">
          <span>{feedbackMessage}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-blue-500 hover:text-blue-800 text-sm font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Teachers Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="text-sm font-bold text-slate-800">
            Registered Educator Accounts ({teachers.length})
          </div>
          <span className="text-xs text-slate-400">Database-backed Authorization</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
            Loading registered educators...
          </div>
        ) : teachers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm space-y-2">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-600">No educator applications found.</p>
            <p className="text-xs">Teachers will appear here when they register with an educator profile.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Educator</th>
                  <th className="py-3.5 px-6">Institution & Department</th>
                  <th className="py-3.5 px-6">Registered</th>
                  <th className="py-3.5 px-6">Verification Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((teacher) => {
                  const isActioning = actionLoadingId === teacher.user_id;

                  return (
                    <tr key={teacher.user_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{teacher.name}</div>
                        <div className="text-slate-400 text-[11px]">{teacher.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{teacher.institution || 'Institutional Educator'}</span>
                        </div>
                        <div className="text-slate-400 text-[11px]">{teacher.department || 'Department of STEM'}</div>
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {teacher.created_at}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(teacher.status)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {teacher.status !== 'VERIFIED' && (
                            <button
                              onClick={() => handleVerify(teacher.user_id)}
                              disabled={isActioning}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all flex items-center gap-1 disabled:opacity-50"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>Verify</span>
                            </button>
                          )}

                          {teacher.status === 'PENDING' && (
                            <button
                              onClick={() => handleReject(teacher.user_id)}
                              disabled={isActioning}
                              className="px-3 py-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 font-bold text-[11px] transition-all flex items-center gap-1 disabled:opacity-50"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          )}

                          {teacher.status === 'VERIFIED' && (
                            <button
                              onClick={() => handleSuspend(teacher.user_id)}
                              disabled={isActioning}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-[11px] transition-all flex items-center gap-1 disabled:opacity-50"
                            >
                              <Ban className="w-3 h-3" />
                              <span>Suspend</span>
                            </button>
                          )}

                          {teacher.status === 'SUSPENDED' && (
                            <button
                              onClick={() => handleVerify(teacher.user_id)}
                              disabled={isActioning}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-all flex items-center gap-1 disabled:opacity-50"
                            >
                              <span>Reactivate</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
