import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Download, Leaf, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { mockReports } from '../services/mockData';
import { getReports } from '../services/api';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/EmptyState';
import type { Report } from '../types';

const statusConfig: Record<string, { icon: any; color: string }> = {
  Completed: { icon: CheckCircle2, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' },
  'In Progress': { icon: Loader2, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  Pending: { icon: Clock, color: 'text-surface-500 bg-surface-100 dark:bg-surface-800' },
};

export function Reports() {
  const { showToast } = useToast();
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const data = await getReports();
        if (data && data.length > 0) {
          setReports(data);
        }
      } catch (err) {
        // fallback to mock reports if server is starting
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch = r.crop.toLowerCase().includes(search.toLowerCase()) || r.disease.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reports, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: reports.length },
          { label: 'Completed', value: reports.filter((r) => r.status === 'Completed').length },
          { label: 'In Progress', value: reports.filter((r) => r.status === 'In Progress').length },
          { label: 'Pending', value: reports.filter((r) => r.status === 'Pending').length },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4">
            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-white font-display mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by crop or disease..." className="input-field pl-10" /></div>
          <div className="flex items-center gap-2"><Filter className="w-4 h-4 text-surface-400" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto pr-8"><option value="all">All Status</option><option value="Completed">Completed</option><option value="In Progress">In Progress</option><option value="Pending">Pending</option></select></div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary-600 mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<FileText className="w-8 h-8" />} title="No reports found" description="Try adjusting your search or filter criteria." />
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
                  {['Date', 'Crop', 'Disease', 'Health', 'Treatment', 'Status', 'PDF'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const sc = statusConfig[r.status] || statusConfig.Pending;
                  return (
                    <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-surface-100 dark:border-surface-800 last:border-0 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                      <td className="px-4 py-3.5 text-sm text-surface-600 dark:text-surface-300 whitespace-nowrap">{r.date}</td>
                      <td className="px-4 py-3.5"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center shrink-0"><Leaf className="w-4 h-4" /></div><span className="text-sm font-medium text-surface-800 dark:text-surface-100">{r.crop}</span></div></td>
                      <td className="px-4 py-3.5 text-sm text-surface-600 dark:text-surface-300">{r.disease}</td>
                      <td className="px-4 py-3.5"><div className="flex items-center gap-2"><div className="w-16 h-1.5 rounded-full bg-surface-100 dark:bg-surface-700 overflow-hidden"><div className={`h-full rounded-full ${r.health > 70 ? 'bg-primary-500' : r.health > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${r.health}%` }} /></div><span className="text-sm font-semibold text-surface-700 dark:text-surface-200">{r.health}%</span></div></td>
                      <td className="px-4 py-3.5 text-sm text-surface-600 dark:text-surface-300">{r.treatment}</td>
                      <td className="px-4 py-3.5"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${sc.color}`}><sc.icon className={`w-3 h-3 ${r.status === 'In Progress' ? 'animate-spin' : ''}`} />{r.status}</span></td>
                      <td className="px-4 py-3.5"><button onClick={() => showToast(`Downloading report for ${r.crop}...`, 'success')} className="p-2 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"><Download className="w-4 h-4" /></button></td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
