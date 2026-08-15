import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScanLine, Cpu, FileText, Clock } from 'lucide-react';
import { mockHistory } from '../services/mockData';
import { getHistory } from '../services/api';
import type { HistoryEntry } from '../types';

const typeConfig = {
  detection: { icon: ScanLine, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  mission: { icon: Cpu, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' },
  report: { icon: FileText, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.max(0, (now.getTime() - d.getTime()) / 1000);
  if (diff < 3600) return `${Math.round(diff / 60) || 1} min ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)} hours ago`;
  return `${Math.round(diff / 86400)} days ago`;
}

export function History() {
  const [history, setHistory] = useState<HistoryEntry[]>(mockHistory);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getHistory();
        if (data && data.length > 0) {
          setHistory(data);
        }
      } catch (err) {
        // fallback to mock history
      }
    }
    fetchHistory();
  }, []);

  return (
    <div className="space-y-4">
      {history.map((entry, i) => {
        const config = typeConfig[entry.type] || typeConfig.detection;
        return (
          <motion.div key={entry.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card card-hover p-4 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}><config.icon className="w-5 h-5" /></div>
            <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-surface-800 dark:text-surface-100">{entry.title}</p><p className="text-xs text-surface-500 dark:text-surface-400">{entry.description}</p></div>
            <span className="flex items-center gap-1 text-xs text-surface-400 shrink-0"><Clock className="w-3 h-3" />{formatTime(entry.timestamp)}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
