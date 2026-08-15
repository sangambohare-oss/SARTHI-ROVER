import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, LayoutGrid, Languages, Moon, Bell, Save, Camera } from 'lucide-react';
import { useAuth, useLanguage } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import type { Language } from '../types';

export function Profile() {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [farmLocation, setFarmLocation] = useState(user?.farmLocation || '');
  const [notifications, setNotifications] = useState(user?.notifications ?? true);

  const handleSave = () => {
    updateUser({ name, phone, email, farmLocation, notifications, preferredLanguage: language, darkMode: theme === 'dark' });
    showToast('Profile updated successfully!', 'success');
  };

  const fields = [
    { icon: User, label: 'Full Name', value: name, onChange: setName, type: 'text' },
    { icon: Phone, label: 'Phone Number', value: phone, onChange: setPhone, type: 'tel' },
    { icon: Mail, label: 'Email Address', value: email, onChange: setEmail, type: 'email' },
    { icon: MapPin, label: 'Farm Location', value: farmLocation, onChange: setFarmLocation, type: 'text' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold font-display">{user?.name?.charAt(0) || 'F'}</div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 flex items-center justify-center text-surface-500 hover:text-primary-600 transition-colors shadow-sm"><Camera className="w-3.5 h-3.5" /></button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-surface-900 dark:text-white font-display">{user?.name}</h2>
            <p className="text-sm text-surface-500 dark:text-surface-400">{user?.email}</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-medium"><LayoutGrid className="w-3 h-3" /> {user?.numberOfFarms} Farms</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 text-xs font-medium"><MapPin className="w-3 h-3" /> {user?.farmLocation}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <h3 className="font-semibold text-surface-900 dark:text-white mb-5">Edit Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map((f, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">{f.label}</label>
              <div className="relative"><f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" /><input type={f.type} value={f.value} onChange={(e) => f.onChange(e.target.value)} className="input-field pl-10" /></div>
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">Number of Farms</label>
            <div className="relative"><LayoutGrid className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" /><input type="number" value={user?.numberOfFarms || 0} readOnly className="input-field pl-10 bg-surface-50 dark:bg-surface-800 cursor-not-allowed" /></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">Preferred Language</label>
            <div className="relative"><Languages className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 z-10" /><select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="input-field pl-10"><option value="en">English</option><option value="hi">हिन्दी (Hindi)</option><option value="mr">मराठी (Marathi)</option></select></div>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          <ToggleRow icon={<Moon className="w-4 h-4" />} label="Dark Mode" desc="Switch between light and dark themes" checked={theme === 'dark'} onChange={toggleTheme} />
          <ToggleRow icon={<Bell className="w-4 h-4" />} label="Notifications" desc="Receive alerts about your farm and rover" checked={notifications} onChange={() => setNotifications((p) => !p)} />
        </div>
        <button onClick={handleSave} className="btn-primary mt-6"><Save className="w-4 h-4" /> Save Changes</button>
      </motion.div>
    </div>
  );
}

function ToggleRow({ icon, label, desc, checked, onChange }: { icon: React.ReactNode; label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white dark:bg-surface-700 text-surface-600 dark:text-surface-300 flex items-center justify-center">{icon}</div>
        <div><p className="text-sm font-medium text-surface-800 dark:text-surface-100">{label}</p><p className="text-xs text-surface-500 dark:text-surface-400">{desc}</p></div>
      </div>
      <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'}`}>
        <motion.span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm" animate={{ x: checked ? 20 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
      </button>
    </div>
  );
}
