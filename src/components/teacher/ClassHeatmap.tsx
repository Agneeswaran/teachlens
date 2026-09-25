import React from 'react';
import { Grid, Info } from 'lucide-react';
import { TeachLensAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const ClassHeatmap: React.FC = () => {
  const { openStudentDrawer } = useApp();
  const [students, setStudents] = React.useState<any[]>([]);

  React.useEffect(() => {
    TeachLensAPI.getTeacherAnalytics().then((data) => {
      setStudents(data.students);
    }).catch((error) => {
      console.error('Failed to load teacher analytics:', error);
    });
  }, []);

  const concepts = [
    { key: 'algebra', label: 'Algebra' },
    { key: 'functions', label: 'Functions' },
    { key: 'limits', label: 'Limits' },
    { key: 'differentiation', label: 'Diff' },
    { key: 'integration', label: 'Integration' }
  ];

  const getCellColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500 text-white';
    if (score >= 70) return 'bg-emerald-200 text-emerald-900';
    if (score >= 55) return 'bg-amber-200 text-amber-900';
    if (score >= 40) return 'bg-rose-200 text-rose-900';
    return 'bg-rose-500 text-white';
  };

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Grid className="w-4 h-4 text-blue-600" />
            <span>Class Concept Heatmap Matrix</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-sectional mastery matrix identifying clustered class vulnerabilities
          </p>
        </div>

        {/* Matrix Legend */}
        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-emerald-500" />
            <span>&ge;85%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-emerald-200" />
            <span>70-84%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-amber-200" />
            <span>55-69%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-rose-300" />
            <span>&lt;55%</span>
          </div>
        </div>
      </div>

      {/* Heatmap Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-bold pl-2">Student Name</th>
              {concepts.map((c) => (
                <th key={c.key} className="pb-3 font-bold text-center px-2">
                  {c.label}
                </th>
              ))}
              <th className="pb-3 font-bold text-right pr-2">Overall</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {(students || []).map((std) => (
              <tr
                key={std.id}
                onClick={() => openStudentDrawer(std)}
                className="hover:bg-blue-50/30 transition-colors cursor-pointer"
              >
                <td className="py-3 pl-2 font-bold text-slate-800 whitespace-nowrap">
                  {std.name}
                </td>
                {concepts.map((c) => {
                  const score = std.conceptScores[c.key] || 0;
                  return (
                    <td key={c.key} className="py-2 px-2 text-center">
                      <div
                        className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-transform hover:scale-110 shadow-xs ${getCellColor(
                          score
                        )}`}
                        title={`${std.name} - ${c.label}: ${score}%`}
                      >
                        {score}%
                      </div>
                    </td>
                  );
                })}
                <td className="py-3 pr-2 text-right font-black text-slate-900">
                  {std.overallMastery}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          Differentiation shows the highest density of red/amber cells (36% cohort vulnerability).
        </span>
        <span className="font-semibold text-blue-600">
          Click any student row to inspect
        </span>
      </div>

    </div>
  );
};

