import { motion } from 'framer-motion';

interface LoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };

export function Loader({ label = 'Loading...', size = 'md' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <motion.div
        className={`${sizes[size]} rounded-full border-4 border-primary-100 border-t-primary-600`}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{label}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-5 overflow-hidden relative">
      <div className="space-y-3">
        <div className="h-3 w-20 bg-surface-200 dark:bg-surface-700 rounded-full" />
        <div className="h-7 w-28 bg-surface-200 dark:bg-surface-700 rounded-full" />
        <div className="h-3 w-16 bg-surface-200 dark:bg-surface-700 rounded-full" />
      </div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent"
        animate={{ x: ['100%', '-100%'] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader label="Loading..." size="lg" />
    </div>
  );
}
