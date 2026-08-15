import { useState } from 'react';
import { motion } from 'framer-motion';
import { Languages, Bell, Moon, Sun, LogOut, Globe, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import type { Language } from '../types';

const languages: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); showToast('Logged out successfully.', 'info'); navigate('/'); };

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex items-center gap-2 mb-5"><Languages className="w-5 h-5 text-primary-600 dark:text-primary-400" /><h3 className="font-semibold text-surface-900 dark:text-white">Language</h3></div>
        <div className="grid sm:grid-cols-3 gap-3">
          {languages.map((lang) => (
            <button key={lang.code} onClick={() => { setLanguage(lang.code); showToast(`Language changed to ${lang.label}.`, 'success'); }} className={`relative p-4 rounded-xl border-2 transition-all text-left ${language === lang.code ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'}`}>
              {language === lang.code && <Check className="absolute top-3 right-3 w-4 h-4 text-primary-600" />}
              <Globe className="w-5 h-5 text-surface-400 mb-2" />
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-100">{lang.label}</p>
              <p className="text-xs text-surface-500">{lang.native}</p>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <div className="flex items-center gap-2 mb-5">{theme === 'dark' ? <Moon className="w-5 h-5 text-primary-600 dark:text-primary-400" /> : <Sun className="w-5 h-5 text-primary-600 dark:text-primary-400" />}<h3 className="font-semibold text-surface-900 dark:text-white">Theme</h3></div>
        <div className="grid sm:grid-cols-2 gap-3">
          <button onClick={() => setTheme('light')} className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${theme === 'light' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'}`}>
            <Sun className="w-5 h-5 text-amber-500" /><div><p className="text-sm font-semibold text-surface-800 dark:text-surface-100">Light</p><p className="text-xs text-surface-500">Bright and clean</p></div>
          </button>
          <button onClick={() => setTheme('dark')} className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${theme === 'dark' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'}`}>
            <Moon className="w-5 h-5 text-blue-500" /><div><p className="text-sm font-semibold text-surface-800 dark:text-surface-100">Dark</p><p className="text-xs text-surface-500">Easy on the eyes</p></div>
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6">
        <div className="flex items-center gap-2 mb-5"><Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" /><h3 className="font-semibold text-surface-900 dark:text-white">Notification Settings</h3></div>
        <div className="space-y-3">
          {[
            { label: 'Disease Detection Alerts', desc: 'Get notified when a disease is detected', defaultOn: true },
            { label: 'Rover Mission Updates', desc: 'Updates on rover status and missions', defaultOn: true },
            { label: 'Weather Alerts', desc: 'Severe weather warnings for your area', defaultOn: true },
            { label: 'Weekly Reports', desc: 'Summary of your farm health every week', defaultOn: false },
          ].map((n, i) => <NotifToggle key={i} {...n} />)}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <LogOut className="w-5 h-5" /><div className="text-left"><p className="text-sm font-semibold">Logout</p><p className="text-xs text-surface-500">Sign out of your account</p></div>
        </button>
      </motion.div>
    </div>
  );
}

function NotifToggle({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800">
      <div><p className="text-sm font-medium text-surface-800 dark:text-surface-100">{label}</p><p className="text-xs text-surface-500 dark:text-surface-400">{desc}</p></div>
      <button onClick={() => setOn((p) => !p)} className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'}`}>
        <motion.span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm" animate={{ x: on ? 20 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
      </button>
    </div>
  );
}
