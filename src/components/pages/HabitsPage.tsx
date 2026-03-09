import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Flame, Calendar, TrendingUp, Moon, Sun } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Habits } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import HabitGrid from '@/components/HabitGrid';
import TodaysFocus from '@/components/TodaysFocus';
import { useHabitStore } from '@/store/habitStore';

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habits[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState('Daily');
  const theme = useHabitStore((state) => state.theme);
  const setTheme = useHabitStore((state) => state.setTheme);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<Habits>('habits');
      setHabits(result.items.sort((a, b) => (b.streakCount || 0) - (a.streakCount || 0)));
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHabit = async () => {
    if (!newHabitName.trim()) return;

    const newHabit: Habits = {
      _id: crypto.randomUUID(),
      habitName: newHabitName,
      frequency: newHabitFrequency,
      streakCount: 0,
      isCompletedToday: false,
      creationDate: new Date(),
    };

    setHabits([newHabit, ...habits]);
    setNewHabitName('');
    setNewHabitFrequency('Daily');

    try {
      await BaseCrudService.create('habits', newHabit);
    } catch (error) {
      console.error('Error creating habit:', error);
      loadHabits();
    }
  };

  const handleToggleHabit = async (habit: Habits) => {
    const isCompleted = !habit.isCompletedToday;
    const newStreak = isCompleted ? (habit.streakCount || 0) + 1 : Math.max(0, (habit.streakCount || 0) - 1);

    setHabits(habits.map(h =>
      h._id === habit._id
        ? { ...h, isCompletedToday: isCompleted, streakCount: newStreak, lastCompletedDate: isCompleted ? new Date() : h.lastCompletedDate }
        : h
    ));

    try {
      await BaseCrudService.update<Habits>('habits', {
        _id: habit._id,
        isCompletedToday: isCompleted,
        streakCount: newStreak,
        lastCompletedDate: isCompleted ? new Date() : habit.lastCompletedDate,
      });
    } catch (error) {
      console.error('Error updating habit:', error);
      loadHabits();
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    setHabits(habits.filter(h => h._id !== habitId));

    try {
      await BaseCrudService.delete('habits', habitId);
    } catch (error) {
      console.error('Error deleting habit:', error);
      loadHabits();
    }
  };

  const heroRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const isFormInView = useInView(formSectionRef, { once: true, margin: "-100px" });

  const themeClasses = theme === 'pastel' 
    ? 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'
    : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900';

  return (
    <div className={`min-h-screen flex flex-col ${themeClasses} text-foreground selection:bg-primary selection:text-primary-foreground overflow-clip`}>
      <Header />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative w-full bg-gradient-to-br from-primary via-primary-dark to-dark-bg pt-20 md:pt-32 pb-20 md:pb-32 px-4 md:px-8 lg:px-12 min-h-[85vh] flex items-center"
      >
        <div className="w-full max-w-[120rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-20 flex flex-col justify-center"
            >
              <p className="font-heading text-sm md:text-base uppercase tracking-[0.3em] text-primary-foreground/80 mb-6">
                HabitFlow Master
              </p>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-primary-foreground mb-8">
                Build Better Habits
              </h1>
              <p className="font-paragraph text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-8 max-w-lg">
                Track your daily habits with our advanced streak system. Visualize your progress and celebrate consistency with real-time analytics.
              </p>

              <ul className="space-y-4 mb-12">
                <li className="flex items-center gap-3 text-primary-foreground font-paragraph">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  <span>7-day visual habit grid with streak tracking</span>
                </li>
                <li className="flex items-center gap-3 text-primary-foreground font-paragraph">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  <span>🔥 Flame icon for streaks over 3 days</span>
                </li>
                <li className="flex items-center gap-3 text-primary-foreground font-paragraph">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  <span>Real-time progress analytics and insights</span>
                </li>
              </ul>

              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setTheme(theme === 'pastel' ? 'dark' : 'pastel')}
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12 px-6 text-sm font-heading uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-2"
                >
                  {theme === 'pastel' ? (
                    <>
                      <Moon className="w-4 h-4" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4" />
                      Pastel Mode
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-accent-blue/20 to-primary/20 flex items-center justify-center"
            >
              <div className="text-center">
                <Flame className="w-24 h-24 text-accent-blue mx-auto mb-4 opacity-80" />
                <p className="text-primary-foreground/60 font-heading text-lg">Your Habit Dashboard</p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Add Habit Form */}
      <section
        ref={formSectionRef}
        className="relative w-full bg-background py-24 md:py-40 px-4 md:px-8 lg:px-12"
      >
        <div className="w-full max-w-[120rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="font-heading text-sm uppercase tracking-[0.3em] text-primary mb-4">
              Create New Habit
            </p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase leading-tight text-foreground mb-6">
              Add a New Habit
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="bg-secondary p-8 md:p-12 rounded-3xl border border-foreground/10 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <div className="group">
                <label className="font-heading text-xs text-foreground mb-3 block uppercase tracking-[0.15em] transition-colors group-focus-within:text-primary">
                  Habit Name *
                </label>
                <Input
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g., Morning Exercise, Read 30 minutes..."
                  className="bg-transparent border-0 border-b-2 border-foreground/20 rounded-none px-0 h-16 text-2xl md:text-3xl font-heading placeholder:text-foreground/20 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                />
              </div>

              <div className="group">
                <label className="font-heading text-xs text-foreground mb-3 block uppercase tracking-[0.15em] transition-colors group-focus-within:text-primary flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Frequency
                </label>
                <select
                  value={newHabitFrequency}
                  onChange={(e) => setNewHabitFrequency(e.target.value)}
                  className="w-full bg-background border border-foreground/10 rounded-xl h-14 px-4 font-paragraph focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                >
                  <option>Daily</option>
                  <option>3 times a week</option>
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <div className="pt-6">
                <Button
                  onClick={handleAddHabit}
                  disabled={!newHabitName.trim()}
                  className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary-dark h-14 px-12 text-sm font-heading uppercase tracking-widest rounded-full transition-all duration-300 disabled:opacity-50 disabled:hover:bg-primary group shadow-lg"
                >
                  <span className="flex items-center gap-3">
                    Add Habit
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Habits List */}
      <section className="relative w-full bg-dark-bg py-24 md:py-40 px-4 md:px-8 lg:px-12">
        <div className="w-full max-w-[120rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase leading-tight text-primary-foreground mb-6">
              Your Habits
            </h2>
            <p className="font-paragraph text-lg text-primary-foreground/80">
              Track your daily habits and build consistency
            </p>
          </motion.div>

          <div className="relative min-h-[400px]">
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm"
                >
                  <div className="flex flex-col items-center gap-4">
                    <LoadingSpinner />
                    <p className="font-heading text-xs uppercase tracking-widest text-accent-blue">Loading Habits</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isLoading && habits.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full py-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-primary-foreground/20 rounded-3xl bg-primary/5"
              >
                <Flame className="w-16 h-16 text-accent-blue mx-auto mb-6 opacity-60" />
                <h3 className="font-heading text-2xl uppercase text-primary-foreground mb-2">No Habits Yet</h3>
                <p className="font-paragraph text-primary-foreground/60 max-w-md">
                  Create your first habit above to start building consistency.
                </p>
              </motion.div>
            )}

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-opacity duration-500 ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <AnimatePresence mode="popLayout">
                {habits.map((habit, index) => (
                  <motion.div
                    key={habit._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`group relative flex flex-col bg-gradient-to-br ${
                      habit.isCompletedToday
                        ? 'from-accent-blue/20 to-primary/20 border-accent-blue/50'
                        : 'from-primary-foreground/5 to-primary-foreground/10 border-primary-foreground/20'
                    } border-2 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg p-6 md:p-8`}
                  >
                    {/* Streak Indicator */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <h3 className={`font-heading text-xl md:text-2xl uppercase leading-tight transition-all duration-300 ${
                          habit.isCompletedToday ? 'text-accent-blue' : 'text-primary-foreground'
                        }`}>
                          {habit.habitName}
                        </h3>
                        <p className="font-paragraph text-sm text-primary-foreground/60 mt-2">
                          {habit.frequency}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleHabit(habit)}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                            habit.isCompletedToday
                              ? 'bg-accent-blue border-accent-blue text-dark-bg'
                              : 'bg-dark-bg border-primary-foreground/20 text-primary-foreground/40 hover:border-accent-blue hover:text-accent-blue'
                          }`}
                          aria-label={habit.isCompletedToday ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          <Flame className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => handleDeleteHabit(habit._id)}
                          className="w-12 h-12 rounded-xl flex items-center justify-center bg-dark-bg border-2 border-primary-foreground/20 text-primary-foreground/40 hover:bg-destructive hover:border-destructive hover:text-destructiveforeground transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                          aria-label="Delete habit"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Habit Grid */}
                    <div className="mb-6">
                      <HabitGrid habit={habit} onUpdate={loadHabits} />
                    </div>

                    {/* Streak Display */}
                    <div className="mt-auto pt-6 border-t border-primary-foreground/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-accent-blue" />
                        <span className="font-heading text-lg text-accent-blue">{habit.streakCount || 0}</span>
                        <span className="font-paragraph text-sm text-primary-foreground/60">day streak</span>
                      </div>
                      <div className="text-xs font-heading uppercase tracking-widest text-primary-foreground/30">
                        ID: {habit._id.substring(0, 6)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Focus Section */}
      <TodaysFocus />

      <Footer />
    </div>
  );
}
