import { motion } from 'framer-motion';
import { Camera, MapPin, CloudSun, Thermometer, Droplet, Waves, Wind, Cpu, Battery, Signal, ListChecks, Activity } from 'lucide-react';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { mockWeather, mockRoverState } from '../services/mockData';

export function LiveMonitoring() {
  const widgets = [
    { label: 'Temperature', value: mockWeather.temperature, unit: '°C', icon: Thermometer, color: 'red' as const },
    { label: 'Humidity', value: mockWeather.humidity, unit: '%', icon: Droplet, color: 'cyan' as const },
    { label: 'Soil Moisture', value: mockWeather.soilMoisture, unit: '%', icon: Waves, color: 'blue' as const },
    { label: 'Air Quality', value: mockWeather.airQuality, unit: ' AQI', icon: Wind, color: 'green' as const },
    { label: 'Battery', value: mockRoverState.battery, unit: '%', icon: Battery, color: 'blue' as const },
    { label: 'Signal Strength', value: mockRoverState.signalStrength, unit: '%', icon: Signal, color: 'green' as const },
  ];

  const colorClasses = {
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><Camera className="w-5 h-5 text-primary-600 dark:text-primary-400" /><h3 className="font-semibold text-surface-900 dark:text-white">Live Camera Feed</h3></div><span className="flex items-center gap-1.5 text-xs font-medium text-red-500"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />LIVE</span></div>
          <div className="relative rounded-xl overflow-hidden aspect-video bg-surface-100 dark:bg-surface-800">
            <img src="https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg" alt="Live rover camera" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-surface-950/60 backdrop-blur text-white text-xs font-medium">North Field · Row 3</div>
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-surface-950/60 backdrop-blur text-white text-xs">{new Date().toLocaleTimeString()}</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3"><MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" /><h3 className="font-semibold text-surface-900 dark:text-white">Current GPS</h3></div>
            <p className="text-sm font-mono text-surface-700 dark:text-surface-200">{mockRoverState.coordinates.lat.toFixed(6)}</p>
            <p className="text-sm font-mono text-surface-700 dark:text-surface-200">{mockRoverState.coordinates.lng.toFixed(6)}</p>
            <p className="text-xs text-surface-400 mt-2">Pune, Maharashtra</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3"><ListChecks className="w-5 h-5 text-primary-600 dark:text-primary-400" /><h3 className="font-semibold text-surface-900 dark:text-white">Mission Status</h3></div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse" /><p className="text-sm font-semibold text-primary-600 dark:text-primary-400">{mockRoverState.currentTask}</p></div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
        <div className="flex items-center gap-2 mb-4"><CloudSun className="w-5 h-5 text-amber-600 dark:text-amber-400" /><h3 className="font-semibold text-surface-900 dark:text-white">Weather Conditions</h3></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Thermometer, val: `${mockWeather.temperature}°C`, label: 'Temperature', color: 'text-red-500' },
            { icon: Droplet, val: `${mockWeather.humidity}%`, label: 'Humidity', color: 'text-cyan-500' },
            { icon: Wind, val: `${mockWeather.windSpeed} km/h`, label: 'Wind Speed', color: 'text-blue-500' },
            { icon: Activity, val: mockWeather.condition, label: 'Condition', color: 'text-primary-500' },
          ].map((w, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800">
              <w.icon className={`w-5 h-5 ${w.color}`} />
              <div><p className="text-xs text-surface-500">{w.val}</p><p className="text-xs font-medium text-surface-600 dark:text-surface-300">{w.label}</p></div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((w, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="card card-hover p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorClasses[w.color]}`}><w.icon className="w-5 h-5" /></div>
            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide">{w.label}</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-white font-display mt-1"><AnimatedCounter value={w.value} suffix={w.unit} /></p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><Cpu className="w-6 h-6" /></div>
          <div><p className="text-sm font-semibold text-surface-900 dark:text-white">Rover Connection</p><p className="text-xs text-surface-500">All systems operational</p></div>
        </div>
        <div className="flex gap-6 sm:ml-auto">
          <div className="text-center"><p className="text-xs text-surface-400">Motor</p><p className="text-sm font-semibold text-primary-600 dark:text-primary-400">{mockRoverState.motorStatus}</p></div>
          <div className="text-center"><p className="text-xs text-surface-400">Speed</p><p className="text-sm font-semibold text-surface-800 dark:text-surface-100">{mockRoverState.speed} km/h</p></div>
          <div className="text-center"><p className="text-xs text-surface-400">Coverage</p><p className="text-sm font-semibold text-surface-800 dark:text-surface-100">{mockRoverState.coverage}%</p></div>
        </div>
      </motion.div>
    </div>
  );
}
