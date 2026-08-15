import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, RadialBarChart, RadialBar,
} from 'recharts';
import { Leaf, Heart, Droplets, Sun, TrendingUp, Calendar, FlaskConical, Sprout } from 'lucide-react';
import { mockCropHealth } from '../services/mockData';
import { getCropHealth } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import type { CropHealth as CropHealthType } from '../types';

export function CropHealth() {
  const { theme } = useTheme();
  const [data, setData] = useState<CropHealthType>(mockCropHealth);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getCropHealth();
        if (res) setData(res);
      } catch (err) {
        // Fallback to mock
      }
    }
    fetchData();
  }, []);

  const healthPieData = [
    { name: 'Healthy', value: data.healthyPercent, color: '#22c55e' },
    { name: 'Diseased', value: data.diseasePercent, color: '#ef4444' },
  ];

  const soilData = [{ name: 'Soil Health', value: data.soilHealth, fill: '#16a34a' }];
  const timelineData = (data.timeline || []).map((t) => ({ week: t.week, health: t.health }));

  const axisColor = theme === 'dark' ? '#78716c' : '#a8a29e';
  const gridColor = theme === 'dark' ? '#292524' : '#e7e5e4';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Healthy', value: data.healthyPercent, unit: '%', icon: Heart, color: 'green' as const },
          { label: 'Disease', value: data.diseasePercent, unit: '%', icon: Leaf, color: 'red' as const },
          { label: 'Soil Health', value: data.soilHealth, unit: '%', icon: Sprout, color: 'amber' as const },
          { label: 'Growth Stage', value: data.growthStage, icon: TrendingUp, color: 'blue' as const },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card card-hover p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color === 'green' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : s.color === 'red' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : s.color === 'amber' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-surface-900 dark:text-white font-display">{s.value}{s.unit && <span className="text-base text-surface-400 ml-1">{s.unit}</span>}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Health Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={healthPieData} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {healthPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px -8px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {healthPieData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: d.color }} /><span className="text-xs text-surface-600 dark:text-surface-300">{d.name}: {d.value}%</span></div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
          <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Soil Health Index</h3>
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="40%" outerRadius="90%" data={soilData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={10} background={{ fill: gridColor }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-3xl font-bold text-surface-900 dark:text-white font-display">{data.soilHealth}%</p>
              <p className="text-xs text-surface-500">Healthy</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5 space-y-4">
          <h3 className="font-semibold text-surface-900 dark:text-white">Nutrient & Water Status</h3>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800"><FlaskConical className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" /><div><p className="text-xs font-semibold text-surface-500 dark:text-surface-400">Nutrient Status</p><p className="text-sm text-surface-800 dark:text-surface-100">{data.nutrientStatus}</p></div></div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800"><Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-0.5 shrink-0" /><div><p className="text-xs font-semibold text-surface-500 dark:text-surface-400">Water Requirement</p><p className="text-sm text-surface-800 dark:text-surface-100">{data.waterRequirement}</p></div></div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800"><Sun className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" /><div><p className="text-xs font-semibold text-surface-500 dark:text-surface-400">Growth Stage</p><p className="text-sm text-surface-800 dark:text-surface-100">{data.growthStage}</p></div></div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-5">
        <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-surface-900 dark:text-white">Health Trend — Last 6 Weeks</h3><span className="text-xs text-surface-400">Weekly average</span></div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs><linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="100%" stopColor="#22c55e" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="week" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px -8px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="health" stroke="#16a34a" strokeWidth={2} fill="url(#healthGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
        <div className="flex items-center gap-2 mb-5"><Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" /><h3 className="font-semibold text-surface-900 dark:text-white">Recommendation Timeline</h3></div>
        <div className="space-y-4">
          {[
            { week: 'This Week', task: 'Apply fungicide spray for Early Blight', status: 'urgent' },
            { week: 'Week 2', task: 'Monitor affected plants for recovery signs', status: 'pending' },
            { week: 'Week 3', task: 'Repeat fungicide application if needed', status: 'pending' },
            { week: 'Week 4', task: 'Apply NPK fertilizer to boost plant immunity', status: 'upcoming' },
            { week: 'Week 6', task: 'Full crop health reassessment scan', status: 'upcoming' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full shrink-0 ${item.status === 'urgent' ? 'bg-red-500' : item.status === 'pending' ? 'bg-amber-500' : 'bg-surface-300'}`} />
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-4 border-b border-surface-100 dark:border-surface-800 last:border-0 last:pb-0">
                <p className="text-sm text-surface-700 dark:text-surface-200">{item.task}</p>
                <span className="text-xs font-medium text-surface-400 shrink-0">{item.week}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
