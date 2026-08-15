import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/app': { title: 'Dashboard', subtitle: 'Your farm at a glance' },
  '/app/detection': { title: 'AI Detection', subtitle: 'Scan crops for diseases' },
  '/app/crop-health': { title: 'Crop Health', subtitle: 'Monitor plant health metrics' },
  '/app/farm-map': { title: 'Farm Map', subtitle: 'GPS field mapping & boundaries' },
  '/app/rover-control': { title: 'Rover Control', subtitle: 'Mission control panel' },
  '/app/monitoring': { title: 'Live Monitoring', subtitle: 'Real-time rover & sensor data' },
  '/app/reports': { title: 'Reports', subtitle: 'Detection & treatment history' },
  '/app/history': { title: 'History', subtitle: 'Recent activity log' },
  '/app/profile': { title: 'Profile', subtitle: 'Your account details' },
  '/app/settings': { title: 'Settings', subtitle: 'App preferences' },
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const meta = pageTitles[location.pathname] || { title: 'Dashboard', subtitle: '' };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
