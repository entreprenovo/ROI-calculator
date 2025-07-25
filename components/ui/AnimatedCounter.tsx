
import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  prefix?: string;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ from = 0, to, prefix = '', suffix = '' }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, latest => `${prefix}${Math.round(latest).toLocaleString()}${suffix}`);

  useEffect(() => {
    const controls = animate(count, to, {
      duration: 1.5,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [from, to, count]);

  return <motion.span>{rounded}</motion.span>;
};

export default AnimatedCounter;
