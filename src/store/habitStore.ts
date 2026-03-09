import { create } from 'zustand';

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
}

export interface HabitStreakData {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  completionHistory: HabitCompletion[];
}

interface HabitStore {
  streakData: Map<string, HabitStreakData>;
  theme: 'pastel' | 'dark';
  
  // Actions
  setStreakData: (habitId: string, data: HabitStreakData) => void;
  getStreakData: (habitId: string) => HabitStreakData | undefined;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  calculateStreak: (habitId: string) => number;
  getCompletionForDate: (habitId: string, date: string) => boolean;
  setTheme: (theme: 'pastel' | 'dark') => void;
  initializeHabitData: (habitId: string) => void;
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  streakData: new Map(),
  theme: 'pastel',

  setStreakData: (habitId: string, data: HabitStreakData) => {
    set((state) => {
      const newMap = new Map(state.streakData);
      newMap.set(habitId, data);
      return { streakData: newMap };
    });
  },

  getStreakData: (habitId: string) => {
    return get().streakData.get(habitId);
  },

  toggleHabitCompletion: (habitId: string, date: string) => {
    set((state) => {
      const newMap = new Map(state.streakData);
      const data = newMap.get(habitId);
      
      if (!data) return state;

      const existingCompletion = data.completionHistory.find(c => c.date === date);
      
      if (existingCompletion) {
        existingCompletion.completed = !existingCompletion.completed;
      } else {
        data.completionHistory.push({ habitId, date, completed: true });
      }

      newMap.set(habitId, data);
      return { streakData: newMap };
    });
  },

  calculateStreak: (habitId: string) => {
    const data = get().getStreakData(habitId);
    if (!data) return 0;

    const sorted = [...data.completionHistory]
      .filter(c => c.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sorted.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);

    for (const completion of sorted) {
      const completionDate = new Date(completion.date);
      const daysDiff = Math.floor((currentDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0 || daysDiff === 1) {
        streak++;
        currentDate = completionDate;
      } else {
        break;
      }
    }

    return streak;
  },

  getCompletionForDate: (habitId: string, date: string) => {
    const data = get().getStreakData(habitId);
    if (!data) return false;
    
    const completion = data.completionHistory.find(c => c.date === date && c.completed);
    return !!completion;
  },

  setTheme: (theme: 'pastel' | 'dark') => {
    set({ theme });
  },

  initializeHabitData: (habitId: string) => {
    const existing = get().getStreakData(habitId);
    if (!existing) {
      set((state) => {
        const newMap = new Map(state.streakData);
        newMap.set(habitId, {
          habitId,
          currentStreak: 0,
          longestStreak: 0,
          completionHistory: [],
        });
        return { streakData: newMap };
      });
    }
  },
}));
