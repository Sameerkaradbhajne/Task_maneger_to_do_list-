import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useHabitStore } from '@/store/habitStore';
import { Habits } from '@/entities';
import { BaseCrudService } from '@/integrations';

interface HabitGridProps {
  habit: Habits;
  onUpdate?: () => void;
}

export default function HabitGrid({ habit, onUpdate }: HabitGridProps) {
  const [days, setDays] = useState<{ date: string; dayName: string }[]>([]);
  const toggleCompletion = useHabitStore((state) => state.toggleHabitCompletion);
  const getCompletionForDate = useHabitStore((state) => state.getCompletionForDate);
  const calculateStreak = useHabitStore((state) => state.calculateStreak);
  const initializeHabitData = useHabitStore((state) => state.initializeHabitData);

  useEffect(() => {
    initializeHabitData(habit._id);
    generateLast7Days();
  }, [habit._id]);

  const generateLast7Days = () => {
    const daysList = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      daysList.push({ date: dateStr, dayName });
    }
    
    setDays(daysList);
  };

  const handleDayClick = async (date: string) => {
    toggleCompletion(habit._id, date);
    
    try {
      const isCompleted = getCompletionForDate(habit._id, date);
      const newStreak = calculateStreak(habit._id);
      
      await BaseCrudService.update<Habits>('habits', {
        _id: habit._id,
        streakCount: newStreak,
        isCompletedToday: date === new Date().toISOString().split('T')[0] ? !isCompleted : habit.isCompletedToday,
      });
      
      onUpdate?.();
    } catch (error) {
      console.error('Error updating habit completion:', error);
    }
  };

  const currentStreak = calculateStreak(habit._id);
  const showFlame = currentStreak > 3;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-heading text-sm uppercase tracking-widest text-foreground">
          Last 7 Days
        </h4>
        {showFlame && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1"
          >
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-heading text-xs text-orange-500">{currentStreak}</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const isCompleted = getCompletionForDate(habit._id, day.date);
          const isToday = day.date === new Date().toISOString().split('T')[0];

          return (
            <motion.button
              key={day.date}
              onClick={() => handleDayClick(day.date)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-heading transition-all duration-300 border-2 ${
                isCompleted
                  ? 'bg-gradient-to-br from-blue-400 to-blue-500 border-blue-600 text-white'
                  : isToday
                  ? 'bg-gray-100 border-gray-300 text-gray-600 hover:border-blue-400'
                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300'
              }`}
              title={day.date}
            >
              <span className="text-xs">{day.dayName}</span>
              {isCompleted && <Flame className="w-3 h-3 mt-1" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
