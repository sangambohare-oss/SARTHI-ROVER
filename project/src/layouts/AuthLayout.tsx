import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Tractor, Sprout, ScanLine, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent-400/30 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <p className="font-display font-bold text-lg">SARTHI</p>
              <p className="text-[10px] text-primary-100 font-medium uppercase tracking-wider">Smart Farming Rover</p>
            </div>
          </Link>
          <div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-display text-4xl font-bold leading-tight mb-6">
              AI Powered Autonomous Crop Health Monitoring & Treatment Rover
            </motion.h2>
            <div className="space-y-3">
              {[
                { icon: ScanLine, text: 'AI Crop Detection & Disease Diagnosis' },
                { icon: MapPin, text: 'GPS Navigation & Precision Agriculture' },
                { icon: Sprout, text: 'Smart Farming for Every Farmer' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center gap-3 text-primary-50">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="text-xs text-primary-100/70">© 2026 SARTHI. Empowering farmers with technology.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Tractor className="w-6 h-6 text-white" />
            </div>
            <p className="font-display font-bold text-surface-900 dark:text-white">SARTHI</p>
          </Link>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white font-display mb-1.5">{title}</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-8">{subtitle}</p>
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
