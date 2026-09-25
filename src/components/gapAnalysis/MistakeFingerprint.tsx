import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, AlertCircle, Info, Sparkles } from 'lucide-react';
import { MistakePattern } from '../../types';

interface MistakeFingerprintProps {
  patterns: MistakePattern[];
  mostRepeatedPattern: string;
}

export const MistakeFingerprint: React.FC<MistakeFingerprintProps> = ({
  patterns,
  mostRepeatedPattern
}) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Your Mistake Fingerprint™
            </h3>
            <p className="text-xs text-slate-500">
              Cognitive error classification across diagnostic attempts
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 hidden sm:inline-block">
          AI Structural Analysis
        </span>
      </div>

      {/* Animated Horizontal Bars */}
      <div className="space-y-4">
        {patterns.map((item, idx) => {
          const colorStyles = [
            { bar: 'bg-blue-600', text: 'text-blue-900', badge: 'bg-blue-50 text-blue-700 border-blue-100' },
            { bar: 'bg-sky-500', text: 'text-sky-900', badge: 'bg-sky-50 text-sky-700 border-sky-100' },
            { bar: 'bg-indigo-500', text: 'text-indigo-900', badge: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
            { bar: 'bg-amber-500', text: 'text-amber-900', badge: 'bg-amber-50 text-amber-700 border-amber-100' }
          ][idx % 4];

          return (
            <div key={item.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <span>{item.category}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] border ${colorStyles.badge}`}>
                    {item.count} flagged instances
                  </span>
                </span>
                <span className="font-extrabold text-slate-900">
                  {item.percentage}%
                </span>
              </div>

              {/* Bar */}
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/50">
                <motion.div
                  className={`h-full rounded-full ${colorStyles.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1.1, delay: idx * 0.1, ease: 'easeOut' }}
                />
              </div>

              <p className="text-[11px] text-slate-500 italic pl-1">
                "{item.description}"
              </p>
            </div>
          );
        })}
      </div>

      {/* Most Repeated Pattern Highlight Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-sky-50/60 to-white border border-blue-200/80 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
            Your Most Repeated Pattern
          </span>
          <h4 className="text-sm font-bold text-slate-900 mt-0.5">
            "{mostRepeatedPattern}"
          </h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            The power rule is consistently triggered, but the operation <code className="bg-white px-1 py-0.5 rounded text-blue-700 font-semibold border border-blue-100">x^(n-1)</code> is missed in 80% of polynomials.
          </p>
        </div>
      </div>

    </div>
  );
};
