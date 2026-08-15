import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

export function AnimatedCounter({ value, duration = 1.2, decimals = 0, suffix = '', prefix = '' }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState('0');

  useEffect(() => { if (inView) motionValue.set(value); }, [inView, value, motionValue]);

  useEffect(() => {
    const unsub = spring.on('change', (latest) => setDisplay(latest.toFixed(decimals)));
    return () => unsub();
  }, [spring, decimals]);

  return <motion.span ref={ref}>{prefix}{display}{suffix}</motion.span>;
}
