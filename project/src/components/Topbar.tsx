import { useState } from 'react';
import { Menu, Bell, Moon, Sun, Wifi } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface TopbarProps {
  onMenuClick: () => void;
  title: string;
  subtitle?: string;
}

export function Topbar({ onMenuClick, title, subtitle }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { text: 'Early Blight detected in North Field', time: '10 min ago' },
    { text: 'Rover mission completed — 2.4 acres', time: '2 hours ago' },
    { text: 'Low water tank — refill recommended', time: '5 hours ago' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-surface-900/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-800">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 h-16">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 rounded-lg text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-white font-display truncate">{title}</h1>
            {subtitle && <p className="text-xs text-surface-500 dark:text-surface-400 truncate hidden sm:block">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-medium">
            <Wifi className="w-3.5 h-3.5" /><span>Online</span>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <div className="relative">
            <button onClick={() => setNotifOpen((p) => !p)} className="relative p-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-surface-900" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 card p-3 shadow-soft z-50">
                <p className="text-sm font-semibold text-surface-700 dark:text-surface-200 mb-2 px-1">Notifications</p>
                <div className="space-y-1">
                  {notifications.map((n, i) => (
                    <div key={i} className="p-2.5 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                      <p className="text-sm text-surface-700 dark:text-surface-200 leading-snug">{n.text}</p>
                      <p className="text-xs text-surface-400 mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 ml-1 sm:ml-2 border-l border-surface-200 dark:border-surface-800">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {user?.name?.charAt(0) || 'F'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-100 leading-tight">{user?.name || 'Farmer'}</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">Farm Owner</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
