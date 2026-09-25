import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ElementType;
  colorScheme?: 'blue' | 'emerald' | 'amber' | 'indigo';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix = '',
  trend,
  trendLabel = 'vs last assessment',
  icon: Icon,
  colorScheme = 'blue',
  onClick
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 900;
    const stepTime = 20;
    const increment = value / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const colorStyles = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      accentGlow: 'hover:border-blue-200'
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      accentGlow: 'hover:border-emerald-200'
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      accentGlow: 'hover:border-amber-200'
    },
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      accentGlow: 'hover:border-indigo-200'
    }
  }[colorScheme];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`p-6 rounded-2xl bg-white border border-slate-100/90 shadow-xs hover:shadow-lg hover:shadow-blue-500/5 transition-all ${colorStyles.accentGlow} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs ${colorStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {displayValue}
        </span>
        {suffix && (
          <span className="text-lg font-bold text-slate-500">{suffix}</span>
        )}
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-50 text-xs">
          {trend >= 0 ? (
            <span className="flex items-center gap-0.5 text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-md">
              <TrendingUp className="w-3.5 h-3.5" />
              +{trend}%
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded-md">
              <TrendingDown className="w-3.5 h-3.5" />
              {trend}%
            </span>
          )}
          <span className="text-slate-400 font-normal">{trendLabel}</span>
        </div>
      )}
    </motion.div>
  );
};
