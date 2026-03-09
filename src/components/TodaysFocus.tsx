import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, AlertCircle, Clock } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Tasks } from '@/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import ProgressBar from '@/components/ProgressBar';

export default function TodaysFocus() {
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState(1);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<Tasks>('tasks');
      setTasks(result.items.sort((a, b) => (b.priority || 0) - (a.priority || 0)));
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Tasks = {
      _id: crypto.randomUUID(),
      title: newTaskTitle,
      notes: newTaskNotes,
      priority: newTaskPriority,
      isCompleted: false,
      dueDate: new Date().toISOString(),
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskNotes('');
    setNewTaskPriority(1);

    try {
      await BaseCrudService.create('tasks', newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      loadTasks();
    }
  };

  const handleToggleComplete = async (task: Tasks) => {
    setTasks(tasks.map(t =>
      t._id === task._id ? { ...t, isCompleted: !t.isCompleted } : t
    ));

    try {
      await BaseCrudService.update<Tasks>('tasks', {
        _id: task._id,
        isCompleted: !task.isCompleted,
      });
    } catch (error) {
      console.error('Error updating task:', error);
      loadTasks();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks(tasks.filter(t => t._id !== taskId));

    try {
      await BaseCrudService.delete('tasks', taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      loadTasks();
    }
  };

  const todaysTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    const taskDate = new Date(t.dueDate).toDateString();
    const today = new Date().toDateString();
    return taskDate === today;
  });

  return (
    <section className="relative w-full bg-gradient-to-br from-purple-50 to-pink-50 py-16 md:py-24 px-4 md:px-8 lg:px-12">
      <div className="w-full max-w-[120rem] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-heading text-sm uppercase tracking-[0.3em] text-purple-600 mb-3">
            Daily Focus
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl uppercase leading-tight text-foreground mb-4">
            Today's Focus
          </h2>
          <p className="font-paragraph text-base text-foreground/70 max-w-2xl">
            Stay focused on what matters most today. Track your daily tasks and celebrate progress.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Task Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl border-2 border-purple-200 shadow-sm"
          >
            <h3 className="font-heading text-lg uppercase tracking-widest text-foreground mb-6">
              Add Task
            </h3>

            <div className="space-y-4">
              <div>
                <label className="font-heading text-xs uppercase tracking-[0.15em] text-foreground mb-2 block">
                  Task Title *
                </label>
                <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What's your focus?"
                  className="bg-purple-50 border-purple-200 focus-visible:ring-purple-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                />
              </div>

              <div>
                <label className="font-heading text-xs uppercase tracking-[0.15em] text-foreground mb-2 block">
                  Notes
                </label>
                <Textarea
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="Add details..."
                  className="bg-purple-50 border-purple-200 focus-visible:ring-purple-400 min-h-[80px]"
                />
              </div>

              <div>
                <label className="font-heading text-xs uppercase tracking-[0.15em] text-foreground mb-2 block flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" /> Priority
                </label>
                <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(Number(e.target.value))}
                    className="flex-1 accent-purple-600"
                  />
                  <span className="font-heading text-sm text-purple-600 w-6 text-center">
                    {newTaskPriority}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 h-12 rounded-lg font-heading uppercase tracking-widest disabled:opacity-50"
              >
                <span className="flex items-center justify-center gap-2">
                  Add Task
                  <Plus className="w-4 h-4" />
                </span>
              </Button>
            </div>
          </motion.div>

          {/* Tasks List & Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Progress Bar */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-purple-200 shadow-sm">
              <ProgressBar tasks={todaysTasks} />
            </div>

            {/* Tasks Grid */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : todaysTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-8 rounded-2xl border-2 border-dashed border-purple-200 text-center"
                >
                  <p className="font-heading text-lg text-foreground/60 mb-2">
                    No tasks for today
                  </p>
                  <p className="font-paragraph text-sm text-foreground/40">
                    Add your first task to get started
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {todaysTasks.map((task, index) => (
                    <motion.div
                      key={task._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`group bg-white p-4 md:p-6 rounded-xl border-2 transition-all duration-300 ${
                        task.isCompleted
                          ? 'border-gray-200 bg-gray-50'
                          : 'border-purple-200 hover:border-purple-400'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 border-2 transition-all duration-300 ${
                            task.isCompleted
                              ? 'bg-purple-600 border-purple-600'
                              : 'border-purple-300 hover:border-purple-600'
                          }`}
                        >
                          {task.isCompleted && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <h4 className={`font-heading text-sm md:text-base uppercase tracking-wide transition-all duration-300 ${
                            task.isCompleted
                              ? 'text-foreground/40 line-through'
                              : 'text-foreground'
                          }`}>
                            {task.title}
                          </h4>
                          {task.notes && (
                            <p className={`font-paragraph text-xs md:text-sm mt-2 transition-colors duration-300 ${
                              task.isCompleted
                                ? 'text-foreground/30'
                                : 'text-foreground/60'
                            }`}>
                              {task.notes}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-3 text-xs font-heading uppercase tracking-widest text-foreground/50">
                            {task.priority && (
                              <span className="flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                P{task.priority}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-foreground/40 hover:bg-red-100 hover:text-red-600 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
