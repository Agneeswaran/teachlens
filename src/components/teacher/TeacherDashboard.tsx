import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  GraduationCap,
  Search,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { ClassHeatmap } from './ClassHeatmap';
import { EarlyWarningSignals } from './EarlyWarningSignals';
import { StudentDetailDrawer } from './StudentDetailDrawer';
import { mockTeacherStudents } from '../../data/mockData';

export const TeacherDashboard: React.FC = () => {
  const {
    openStudentDrawer,
    isStudentDrawerOpen,
    closeStudentDrawer,
    selectedStudent
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'improving' | 'needs_attention'>('all');

  const weaknessData = [
    { concept: 'Differentiation', averageScore: 58, gapRate: 36, fill: '#EF4444' },
    { concept: 'Limits', averageScore: 64, gapRate: 28, fill: '#F59E0B' },
    { concept: 'Matrices', averageScore: 71, gapRate: 19, fill: '#3B82F6' },
    { concept: 'Functions', averageScore: 82, gapRate: 8, fill: '#10B981' },
    { concept: 'Algebra', averageScore: 89, gapRate: 4, fill: '#10B981' }
  ];

  const commonMistakes = [
    { pattern: 'Exponent Invariance (Power Rule)', frequency: 42, count: 28 },
    { pattern: 'Negative Sign Flip in Fractions', frequency: 31, count: 20 },
    { pattern: 'Limit vs Function Value Confusion', frequency: 24, count: 16 },
    { pattern: 'Non-Commutative Matrix Product', frequency: 19, count: 12 }
  ];

  const filteredStudents = mockTeacherStudents.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.weakestConcept.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || std.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Educator Portal
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Calculus & Linear Foundations (Section 04)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Cohort Diagnostic Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Classroom-wide learning gap analytics, student roster interventions, and early drop detection.
          </p>
        </div>

        <button
          onClick={() => alert('Batch recovery paths assigned to all 18 students needing attention!')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Batch Intervene: 18 Students</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top Stat Cards (From Prompt Section 15) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Students"
          value={128}
          trend={4}
          trendLabel="enrolled students"
          icon={Users}
          colorScheme="blue"
        />

        <StatCard
          title="Students Improving"
          value={94}
          trend={12}
          trendLabel="post-recovery"
          icon={TrendingUp}
          colorScheme="emerald"
        />

        <StatCard
          title="Needing Attention"
          value={18}
          trend={-5}
          trendLabel="down from last week"
          icon={AlertTriangle}
          colorScheme="amber"
        />

        <StatCard
          title="Average Class Mastery"
          value={74}
          suffix="%"
          trend={6}
          trendLabel="vs semester baseline"
          icon={GraduationCap}
          colorScheme="indigo"
        />
      </div>

      {/* Early Learning Warning Signals Component */}
      <EarlyWarningSignals />

      {/* Class Concept Heatmap Matrix */}
      <ClassHeatmap />

      {/* Two Column: Concept Weakness Chart & Common Mistake Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Concept Weakness Chart */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Cohort Concept Weakness Spectrum
              </h3>
              <p className="text-xs text-slate-500">
                Average score and flagged gap frequency across syllabus
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              Class Average: 74%
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weaknessData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="concept" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
                  }}
                />
                <Bar dataKey="averageScore" radius={[8, 8, 0, 0]} barSize={44}>
                  {weaknessData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Common Mistake Patterns */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Classroom Mistake Fingerprint™
              </h3>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Most Frequent
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Repeated cognitive missteps aggregated across recent homework and diagnostic tests.
            </p>

            <div className="space-y-3.5">
              {commonMistakes.map((mistake, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate max-w-[200px]">
                      {mistake.pattern}
                    </span>
                    <span className="font-extrabold text-blue-700">
                      {mistake.frequency}% ({mistake.count} students)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${mistake.frequency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Primary Focus: Power Rule</span>
            <span className="font-semibold text-blue-600">Assign in next lecture</span>
          </div>
        </div>

      </div>

      {/* Student Roster Table (Clicking opens StudentDetailDrawer) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Student Diagnostic Roster
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any student to view detailed concept breakdown and assign individual recovery paths.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student or concept..."
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border text-xs font-semibold">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('improving')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === 'improving' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Improving
              </button>
              <button
                onClick={() => setFilterStatus('needs_attention')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === 'needs_attention' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Attention
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-bold">Student</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold">Weakest Topic</th>
                <th className="pb-3 font-bold text-center">Overall Mastery</th>
                <th className="pb-3 font-bold">Last Active</th>
                <th className="pb-3 font-bold text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((std) => (
                <tr
                  key={std.id}
                  onClick={() => openStudentDrawer(std)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {std.name}
                    </div>
                    <div className="text-[11px] text-slate-400">{std.email}</div>
                  </td>

                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        std.status === 'improving'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : std.status === 'needs_attention'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {std.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3.5">
                    <span className="font-semibold text-slate-700">
                      {std.weakestConcept}
                    </span>
                    <span className="text-slate-400 ml-1">
                      ({std.weakestConceptScore}%)
                    </span>
                  </td>

                  <td className="py-3.5 text-center">
                    <span className="font-black text-sm text-slate-900">
                      {std.overallMastery}%
                    </span>
                  </td>

                  <td className="py-3.5 text-slate-500">
                    {std.lastActive}
                  </td>

                  <td className="py-3.5 text-right pr-2">
                    <span className="text-blue-600 font-bold group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Slide-over Profile Drawer for selected student */}
      <StudentDetailDrawer
        isOpen={isStudentDrawerOpen}
        onClose={closeStudentDrawer}
        student={selectedStudent}
      />

    </div>
  );
};
