import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ScanLine, Leaf, Map, Cpu, FileText, History, User, Settings,
  LogOut, X, Tractor, Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/detection', label: 'AI Detection', icon: ScanLine },
  { to: '/app/crop-health', label: 'Crop Health', icon: Leaf },
  { to: '/app/farm-map', label: 'Farm Map', icon: Map },
  { to: '/app/rover-control', label: 'Rover Control', icon: Cpu },
  { to: '/app/monitoring', label: 'Live Monitoring', icon: Activity },
  { to: '/app/reports', label: 'Reports', icon: FileText },
  { to: '/app/history', label: 'History', icon: History },
  { to: '/app/profile', label: 'Profile', icon: User },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { logout } = useAuth();

  return (
    <>
      {open && <div className="fixed inset-0 bg-surface-950/40 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 lg:z-30 h-screen w-72 shrink-0 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 transition-transform duration-300 flex flex-col ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between px-6 h-16 border-b border-surface-200 dark:border-surface-800 shrink-0">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
              <Tractor className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-surface-900 dark:text-white text-sm leading-tight">AgriVision</p>
              <p className="text-[10px] text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wider">AI Rover</p>
            </div>
          </NavLink>
          <button onClick={onClose} className="lg:hidden text-surface-400 hover:text-surface-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive ? 'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20' : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <motion.div layoutId="sidebar-active" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary-600" />}
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-surface-200 dark:border-surface-800 shrink-0">
          <button onClick={() => logout()} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200">
            <LogOut className="w-[18px] h-[18px]" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
