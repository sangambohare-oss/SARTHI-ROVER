import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: 'green' | 'blue' | 'amber' | 'red' | 'purple' | 'cyan';
}

const colorMap = {
  green: { bg: 'bg-primary-50 dark:bg-primary-900/20', text: 'text-primary-600 dark:text-primary-400', ring: 'ring-primary-500/10' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-500/10' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-500/10' },
  red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', ring: 'ring-red-500/10' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', ring: 'ring-purple-500/10' },
  cyan: { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400', ring: 'ring-cyan-500/10' },
};

export function StatCard({ title, value, unit, icon, trend, trendUp, color = 'green' }: StatCardProps) {
  const c = colorMap[color];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="card card-hover p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide">{title}</p>
          <p className="mt-2 text-2xl font-bold text-surface-900 dark:text-white font-display">
            {value}{unit && <span className="ml-1 text-base font-medium text-surface-400">{unit}</span>}
          </p>
          {trend && <p className={`mt-1.5 text-xs font-medium ${trendUp ? 'text-primary-600 dark:text-primary-400' : 'text-red-500'}`}>{trend}</p>}
        </div>
        <div className={`shrink-0 w-11 h-11 rounded-xl ${c.bg} ${c.text} flex items-center justify-center ring-1 ${c.ring}`}>{icon}</div>
      </div>
    </motion.div>
  );
}
