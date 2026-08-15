import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu, Battery, Droplets, MapPinned, ListChecks, CloudSun, Thermometer, Droplet,
  Camera, Bell, Signal, Activity, PlayCircle, AlertTriangle, CheckCircle2, Clock,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { mockWeather, mockRoverState } from '../services/mockData';
import { getRoverStatus, getWeather } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { RoverState, WeatherData } from '../types';

const notifications = [
  { icon: AlertTriangle, color: 'text-amber-500', text: 'Early Blight detected in North Field', time: '10 min ago' },
  { icon: CheckCircle2, color: 'text-primary-500', text: 'Rover mission completed — 2.4 acres', time: '2 hours ago' },
  { icon: Droplets, color: 'text-blue-500', text: 'Water tank below 30% — refill soon', time: '5 hours ago' },
  { icon: Bell, color: 'text-surface-400', text: 'Weekly crop health report ready', time: '1 day ago' },
];

export function Dashboard() {
  const { user } = useAuth();
  const [roverState, setRoverState] = useState<RoverState>(mockRoverState);
  const [weather, setWeather] = useState<WeatherData>(mockWeather);

  useEffect(() => {
    async function fetchData() {
      try {
        const [rRes, wRes] = await Promise.all([getRoverStatus(), getWeather()]);
        if (rRes) setRoverState(rRes);
        if (wRes) setWeather(wRes);
      } catch (err) {
        // Fallback to mock data if offline
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-6 sm:p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20"><div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 blur-3xl" /></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-primary-100 text-sm">Welcome back,</p>
            <h2 className="font-display text-2xl font-bold text-white">{user?.name || 'Farmer'}</h2>
            <p className="text-primary-100 text-sm mt-1">Your farm is looking healthy today.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur text-white text-sm font-medium w-fit">
            <PlayCircle className="w-4 h-4" /><span>Rover Ready · Status: {roverState.status}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Rover Status" value={roverState.status} icon={<Cpu className="w-5 h-5" />} color="green" trend="Ready for mission" trendUp />
        <StatCard title="Battery" value={Math.round(roverState.battery)} unit="%" icon={<Battery className="w-5 h-5" />} color="blue" trend="Charging complete" trendUp />
        <StatCard title="Water Tank" value={roverState.waterTank} unit="%" icon={<Droplets className="w-5 h-5" />} color="cyan" trend="Refill recommended" />
        <StatCard title="Area Covered" value={(roverState.coverage || 2.4).toFixed(1)} unit="ac" icon={<MapPinned className="w-5 h-5" />} color="amber" trend="Today's coverage" trendUp />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Current Task" value={roverState.currentTask || 'Standby'} icon={<ListChecks className="w-5 h-5" />} color="green" />
        <StatCard title="Weather" value={weather.condition} icon={<CloudSun className="w-5 h-5" />} color="amber" />
        <StatCard title="Temperature" value={weather.temperature} unit="°C" icon={<Thermometer className="w-5 h-5" />} color="red" />
        <StatCard title="Humidity" value={weather.humidity} unit="%" icon={<Droplet className="w-5 h-5" />} color="cyan" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Camera className="w-5 h-5 text-primary-600 dark:text-primary-400" /><h3 className="font-semibold text-surface-900 dark:text-white">Live Camera Feed</h3></div>
            <span className="flex items-center gap-1.5 text-xs font-medium text-red-500"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />LIVE</span>
          </div>
          <div className="relative rounded-xl overflow-hidden aspect-video bg-surface-100 dark:bg-surface-800">
            <img src="https://images.pexels.com/photos/268415/pexels-photo-268415.jpeg" alt="Live rover camera feed" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-surface-950/60 backdrop-blur text-white text-xs font-medium">North Field · Row 3</div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="px-2.5 py-1 rounded-lg bg-surface-950/60 backdrop-blur text-white text-xs">{new Date().toLocaleTimeString()}</div>
              <div className="px-2.5 py-1 rounded-lg bg-surface-950/60 backdrop-blur text-white text-xs flex items-center gap-1.5"><Signal className="w-3 h-3" /> {roverState.signalStrength}%</div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
          <div className="flex items-center gap-2 mb-4"><Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" /><h3 className="font-semibold text-surface-900 dark:text-white">Notifications</h3><span className="ml-auto text-xs font-medium text-surface-400">{notifications.length} new</span></div>
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                <n.icon className={`w-5 h-5 ${n.color} shrink-0 mt-0.5`} />
                <div className="min-w-0"><p className="text-sm text-surface-700 dark:text-surface-200 leading-snug">{n.text}</p><p className="text-xs text-surface-400 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> {n.time}</p></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Soil Moisture', value: weather.soilMoisture, unit: '%', icon: Droplet, color: 'cyan' as const },
          { label: 'Air Quality', value: weather.airQuality, unit: ' AQI', icon: Activity, color: 'green' as const },
          { label: 'Signal Strength', value: roverState.signalStrength, unit: '%', icon: Signal, color: 'blue' as const },
          { label: 'Motor Status', value: roverState.motorStatus || 'Online', icon: Cpu, color: 'green' as const },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center"><s.icon className="w-6 h-6" /></div>
            <div>
              <p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide">{s.label}</p>
              <p className="text-xl font-bold text-surface-900 dark:text-white font-display">{typeof s.value === 'number' ? <AnimatedCounter value={s.value} suffix={s.unit} /> : s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
