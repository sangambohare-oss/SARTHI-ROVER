import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Play, Pause, Square, AlertOctagon, Battery, Droplets, Cpu, Gauge, MapPin, Clock, CheckCircle2, Radio } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useToast } from '../context/ToastContext';
import type { RoverStatus } from '../types';

const roverIcon = L.divIcon({
  html: '<div style="width:24px;height:24px;background:#16a34a;border:3px solid white;border-radius:50%;box-shadow:0 2px 12px rgba(22,163,74,0.5);display:flex;align-items:center;justify-content:center"><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg></div>',
  className: '', iconSize: [24, 24], iconAnchor: [12, 12],
});

const statusConfig: Record<RoverStatus, { color: string; bg: string; label: string }> = {
  Idle: { color: 'text-surface-500', bg: 'bg-surface-100 dark:bg-surface-800', label: 'Idle' },
  Scanning: { color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'Scanning' },
  Moving: { color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20', label: 'Moving' },
  Spraying: { color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', label: 'Spraying' },
  Returning: { color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', label: 'Returning' },
  Completed: { color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20', label: 'Completed' },
};

const route: [number, number][] = [
  [18.5204, 73.8567], [18.5215, 73.8575], [18.5225, 73.8585], [18.5228, 73.8595],
  [18.5218, 73.8605], [18.5205, 73.8608], [18.519, 73.86], [18.5185, 73.8585],
  [18.5195, 73.857], [18.5204, 73.8567],
];

export function RoverControl() {
  const { showToast } = useToast();
  const [status, setStatus] = useState<RoverStatus>('Idle');
  const [battery, setBattery] = useState(87);
  const [waterTank] = useState(64);
  const [speed, setSpeed] = useState(0);
  const [coverage, setCoverage] = useState(0);
  const [roverPosIndex, setRoverPosIndex] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (status === 'Idle' || status === 'Completed' || paused) return;
    const interval = setInterval(() => {
      setRoverPosIndex((prev) => {
        const next = (prev + 1) % route.length;
        if (next === 0 && status !== 'Returning') { setStatus('Returning'); }
        if (next === 0 && status === 'Returning') {
          setStatus('Completed'); setSpeed(0); setCoverage(100); setEstimatedTime(0);
          showToast('Mission completed! Rover returned to base.', 'success');
        }
        return next;
      });
      setBattery((b) => Math.max(0, b - 0.15));
      setCoverage((c) => Math.min(100, c + 100 / route.length));
      const statuses: RoverStatus[] = ['Moving', 'Scanning', 'Spraying'];
      const random = statuses[Math.floor(Math.random() * statuses.length)];
      if (roverPosIndex < route.length - 2) {
        setStatus((s) => (s === 'Returning' ? s : random));
        setSpeed(2 + Math.random() * 3);
        setEstimatedTime((t) => Math.max(0, t - 0.5));
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [status, paused, roverPosIndex, showToast]);

  const startMission = () => { setStatus('Moving'); setPaused(false); setSpeed(3.5); setCoverage(0); setRoverPosIndex(0); setEstimatedTime(45); showToast('Mission started! Rover is now moving.', 'success'); };
  const pauseMission = () => { setPaused(true); setStatus('Idle'); setSpeed(0); showToast('Mission paused.', 'info'); };
  const resumeMission = () => { setPaused(false); setStatus('Moving'); setSpeed(3.5); showToast('Mission resumed.', 'success'); };
  const stopMission = () => { setStatus('Idle'); setPaused(false); setSpeed(0); setRoverPosIndex(0); setCoverage(0); setEstimatedTime(0); showToast('Mission stopped. Rover returned to base.', 'info'); };
  const emergencyStop = () => { setStatus('Idle'); setPaused(false); setSpeed(0); showToast('EMERGENCY STOP activated! Rover halted immediately.', 'error'); };

  const sc = statusConfig[status];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl p-5 sm:p-6 ${sc.bg} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-surface-900 flex items-center justify-center shadow-sm"><Cpu className={`w-7 h-7 ${sc.color}`} /></div>
            {status !== 'Idle' && status !== 'Completed' && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary-500 animate-pulse-ring" />}
          </div>
          <div><p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide">Rover Status</p><p className={`text-xl font-bold font-display ${sc.color}`}>{sc.label}</p></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {status === 'Idle' && !paused && <button onClick={startMission} className="btn-primary"><Play className="w-4 h-4" /> Start Mission</button>}
          {status !== 'Idle' && status !== 'Completed' && !paused && <button onClick={pauseMission} className="btn-secondary"><Pause className="w-4 h-4" /> Pause</button>}
          {paused && <button onClick={resumeMission} className="btn-primary"><Play className="w-4 h-4" /> Resume</button>}
          {status !== 'Idle' && <button onClick={stopMission} className="btn-secondary"><Square className="w-4 h-4" /> Stop</button>}
          <button onClick={emergencyStop} className="btn-danger"><AlertOctagon className="w-4 h-4" /> Emergency Stop</button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 card p-5">
          <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Live Rover Tracking</h3>
          <div className="rounded-xl overflow-hidden h-[400px]">
            <MapContainer center={[18.5204, 73.858]} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
              <Polyline positions={route} pathOptions={{ color: '#16a34a', weight: 3, dashArray: '8,6', opacity: 0.6 }} />
              <Marker position={route[roverPosIndex]} icon={roverIcon} />
            </MapContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2 text-surface-600 dark:text-surface-300"><Battery className="w-4 h-4" /><span className="text-sm font-medium">Battery</span></div><span className="text-sm font-bold text-surface-900 dark:text-white">{battery.toFixed(0)}%</span></div>
            <div className="h-2 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden"><motion.div className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600" animate={{ width: `${battery}%` }} transition={{ duration: 0.5 }} /></div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2 text-surface-600 dark:text-surface-300"><Droplets className="w-4 h-4" /><span className="text-sm font-medium">Water Tank</span></div><span className="text-sm font-bold text-surface-900 dark:text-white">{waterTank}%</span></div>
            <div className="h-2 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden"><motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" animate={{ width: `${waterTank}%` }} transition={{ duration: 0.5 }} /></div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2 text-surface-600 dark:text-surface-300"><CheckCircle2 className="w-4 h-4" /><span className="text-sm font-medium">Coverage</span></div><span className="text-sm font-bold text-surface-900 dark:text-white">{coverage.toFixed(0)}%</span></div>
            <div className="h-2 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden"><motion.div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-primary-500" animate={{ width: `${coverage}%` }} transition={{ duration: 0.5 }} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-3.5"><Gauge className="w-4 h-4 text-primary-600 dark:text-primary-400 mb-1.5" /><p className="text-xs text-surface-500">Speed</p><p className="text-lg font-bold text-surface-900 dark:text-white">{speed.toFixed(1)} <span className="text-xs text-surface-400">km/h</span></p></div>
            <div className="card p-3.5"><Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 mb-1.5" /><p className="text-xs text-surface-500">Est. Time</p><p className="text-lg font-bold text-surface-900 dark:text-white">{estimatedTime} <span className="text-xs text-surface-400">min</span></p></div>
            <div className="card p-3.5"><MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1.5" /><p className="text-xs text-surface-500">Latitude</p><p className="text-sm font-bold text-surface-900 dark:text-white">{route[roverPosIndex][0].toFixed(4)}</p></div>
            <div className="card p-3.5"><MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1.5" /><p className="text-xs text-surface-500">Longitude</p><p className="text-sm font-bold text-surface-900 dark:text-white">{route[roverPosIndex][1].toFixed(4)}</p></div>
          </div>
          <div className="card p-3.5 flex items-center gap-3"><Radio className="w-5 h-5 text-primary-600 dark:text-primary-400" /><div className="flex-1"><p className="text-xs text-surface-500">Motor Status</p><p className="text-sm font-bold text-primary-600 dark:text-primary-400">Online</p></div><span className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse" /></div>
        </motion.div>
      </div>
    </div>
  );
}
