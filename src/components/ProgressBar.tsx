import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tasks } from '@/entities';

interface ProgressBarProps {
  tasks: Tasks[];
  animated?: boolean;
}

export default function ProgressBar({ tasks, animated = true }: ProgressBarProps) {
  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.isCompleted).length;
    return (completed / tasks.length) * 100;
  }, [tasks]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-heading text-sm uppercase tracking-widest text-foreground">
          Progress
        </span>
        <span className="font-heading text-lg text-primary">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={animated ? { duration: 0.8, ease: 'easeOut' } : { duration: 0 }}
        />
      </div>

      <div className="flex justify-between text-xs font-paragraph text-foreground/60">
        <span>{tasks.filter(t => t.isCompleted).length} completed</span>
        <span>{tasks.filter(t => !t.isCompleted).length} remaining</span>
      </div>
    </div>
  );
}
