import React from 'react';
import { motion } from 'framer-motion';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  status?: 'mastered' | 'needs_practice' | 'critical_gap';
  label?: string;
  sublabel?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 140,
  strokeWidth = 10,
  status = 'mastered',
  label,
  sublabel
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorConfig = {
    mastered: {
      stroke: '#10B981', // Emerald
      track: '#ECFDF5',
      text: 'text-emerald-700'
    },
    needs_practice: {
      stroke: '#F59E0B', // Amber
      track: '#FFFBEB',
      text: 'text-amber-700'
    },
    critical_gap: {
      stroke: '#EF4444', // Red
      track: '#FEF2F2',
      text: 'text-rose-700'
    }
  }[status];

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorConfig.track}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorConfig.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`text-2xl font-black tracking-tight ${colorConfig.text}`}>
          {percentage}%
        </span>
        {label && (
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            {label}
          </span>
        )}
      </div>

      {sublabel && (
        <span className="text-xs font-medium text-slate-500 mt-2">{sublabel}</span>
      )}
    </div>
  );
};
