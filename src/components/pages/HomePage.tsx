// HPI 1.7-V
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { Plus, Check, Trash2, ArrowRight, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Tasks } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Image } from '@/components/ui/image';

// --- Main Component ---

export default function HomePage() {
  // --- Canonical Data Sources & Logic (Preserved) ---
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
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
      dueDate: newTaskDueDate || undefined,
      priority: newTaskPriority,
      isCompleted: false,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskNotes('');
    setNewTaskDueDate('');
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

  // --- Animation & Scroll Refs ---
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroTextY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  const formSectionRef = useRef<HTMLDivElement>(null);
  const isFormInView = useInView(formSectionRef, { once: true, margin: "-100px" });

  const listSectionRef = useRef<HTMLDivElement>(null);
  const isListInView = useInView(listSectionRef, { once: true, margin: "-100px" });

  // --- Derived Data for UI ---
  const activeTasksCount = tasks.filter(t => !t.isCompleted).length;
  const completedTasksCount = tasks.length - activeTasksCount;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-clip">
      <Header />
      
      {/* 
        =========================================
        HERO SECTION (Bitrix24-Inspired Layout)
        =========================================
      */}
      <section 
        ref={heroRef} 
        className="relative w-full bg-gradient-to-br from-primary via-primary to-primary/90 pt-20 md:pt-32 pb-20 md:pb-32 px-4 md:px-8 lg:px-12 min-h-[85vh] flex items-center"
      >
        <div className="w-full max-w-[120rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Column - Text Content */}
            <motion.div 
              style={{ y: heroTextY, opacity: heroOpacity }}
              className="relative z-20 flex flex-col justify-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <p className="font-heading text-sm md:text-base uppercase tracking-[0.3em] text-background/80 mb-6">
                  Organize & Execute
                </p>
                <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-background mb-8">
                  Free Online Task Manager
                </h1>
                <p className="font-paragraph text-lg md:text-xl text-background/90 leading-relaxed mb-8 max-w-lg">
                  Organize and manage your team like a boss. With our free task management tool, you can streamline workflows and boost productivity.
                </p>
                
                {/* Feature List */}
                <ul className="space-y-4 mb-12">
                  <li className="flex items-center gap-3 text-background font-paragraph">
                    <div className="w-2 h-2 bg-background rounded-full" />
                    <span>Get started in less than 30 minutes</span>
                  </li>
                  <li className="flex items-center gap-3 text-background font-paragraph">
                    <div className="w-2 h-2 bg-background rounded-full" />
                    <span>Detailed FAQ and onboarding support</span>
                  </li>
                  <li className="flex items-center gap-3 text-background font-paragraph">
                    <div className="w-2 h-2 bg-background rounded-full" />
                    <span>Migrate your data in one click</span>
                  </li>
                </ul>

                <Button
                  className="w-fit bg-background text-primary hover:bg-background/90 h-14 px-10 text-sm font-heading uppercase tracking-widest rounded-full transition-all duration-300 group shadow-lg"
                >
                  <span className="flex items-center gap-3">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-transparent z-10 rounded-3xl" />
              <Image src="https://static.wixstatic.com/media/247794_cb5cc97499fe4078914bf3f720cffc56~mv2.png?originWidth=768&originHeight=448" alt="Task Manager Dashboard" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-background/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-background/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* 
        =========================================
        CREATION ENGINE (Add Task Form)
        =========================================
      */}
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
              Create & Organize
            </p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase leading-tight text-foreground mb-6">
              Add Your Next Task
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="bg-secondary p-8 md:p-12 rounded-3xl border border-foreground/10 shadow-lg relative overflow-hidden"
          >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 space-y-8">
              {/* Title Input */}
              <div className="group">
                <label className="font-heading text-xs text-foreground mb-3 block uppercase tracking-[0.15em] transition-colors group-focus-within:text-primary">
                  Task Title *
                </label>
                <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter your task..."
                  className="bg-transparent border-0 border-b-2 border-foreground/20 rounded-none px-0 h-16 text-2xl md:text-3xl font-heading placeholder:text-foreground/20 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                />
              </div>

              {/* Notes Input */}
              <div className="group">
                <label className="font-heading text-xs text-foreground mb-3 block uppercase tracking-[0.15em] transition-colors group-focus-within:text-primary">
                  Description
                </label>
                <Textarea
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="Add details, notes, or requirements..."
                  className="bg-background border border-foreground/10 rounded-2xl p-4 min-h-[120px] text-base font-paragraph placeholder:text-foreground/30 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all resize-none"
                />
              </div>

              {/* Meta Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="font-heading text-xs text-foreground mb-3 block uppercase tracking-[0.15em] transition-colors group-focus-within:text-primary flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Due Date
                  </label>
                  <Input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="bg-background border border-foreground/10 rounded-xl h-14 px-4 font-paragraph focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                  />
                </div>

                <div className="group">
                  <label className="font-heading text-xs text-foreground mb-3 block uppercase tracking-[0.15em] transition-colors group-focus-within:text-primary flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" /> Priority
                  </label>
                  <div className="flex items-center gap-4 bg-background border border-foreground/10 rounded-xl h-14 px-4 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <span className="font-heading text-lg text-primary w-6 text-center">
                      {newTaskPriority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  onClick={handleAddTask}
                  disabled={!newTaskTitle.trim()}
                  className="w-full md:w-auto bg-primary text-background hover:bg-primary/90 h-14 px-12 text-sm font-heading uppercase tracking-widest rounded-full transition-all duration-300 disabled:opacity-50 disabled:hover:bg-primary group shadow-lg"
                >
                  <span className="flex items-center gap-3">
                    Add Task
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 
        =========================================
        VISUAL BREATHER (Features Section)
        =========================================
      */}
      <section className="relative w-full bg-foreground py-24 md:py-40 px-4 md:px-8 lg:px-12">
        <div className="w-full max-w-[120rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isListInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase leading-tight text-background mb-6">
              Why Choose Our Task Manager?
            </h2>
            <p className="font-paragraph text-lg text-background/80 max-w-2xl mx-auto">
              Everything you need to organize, prioritize, and execute your tasks efficiently.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy to Use",
                description: "Get started in minutes. Just add your tasks and start organizing your workflow.",
                icon: "✓"
              },
              {
                title: "Fully Customizable",
                description: "Set priorities, due dates, and detailed notes for each task.",
                icon: "⚙"
              },
              {
                title: "Always Accessible",
                description: "Access your tasks anytime, anywhere. Your data is always in sync.",
                icon: "☁"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isListInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-background/10 p-8 rounded-2xl border border-background/20 hover:border-primary/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-heading text-xl uppercase text-background mb-3">
                  {feature.title}
                </h3>
                <p className="font-paragraph text-background/80">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        =========================================
        THE LEDGER (Task List)
        =========================================
      */}
      <section 
        ref={listSectionRef}
        className="relative w-full bg-background py-24 md:py-40 px-4 md:px-8 lg:px-12"
      >
        <div className="w-full max-w-[120rem] mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isListInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="font-heading text-sm uppercase tracking-[0.3em] text-primary mb-4">
              Your Tasks
            </p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase leading-tight text-foreground">
              Task List
            </h2>
          </motion.div>

          {/* Task Grid Container - CRASH PREVENTION: Always render this container */}
          <div className="relative min-h-[400px]">
            
            {/* Loading Overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                >
                  <div className="flex flex-col items-center gap-4">
                    <LoadingSpinner />
                    <p className="font-heading text-xs uppercase tracking-widest text-primary">Loading Tasks</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!isLoading && tasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full py-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-foreground/20 rounded-3xl bg-secondary/50"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-heading text-2xl uppercase text-foreground mb-2">No Tasks Yet</h3>
                <p className="font-paragraph text-subtletext max-w-md">
                  Create your first task above to get started organizing your workflow.
                </p>
              </motion.div>
            )}

            {/* Task Grid */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 transition-opacity duration-500 ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <AnimatePresence mode="popLayout">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`group relative flex flex-col bg-secondary border-2 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                      task.isCompleted 
                        ? 'border-foreground/10 bg-background/50' 
                        : 'border-primary/30 hover:border-primary'
                    }`}
                  >
                    {/* Priority Indicator Line */}
                    <div 
                      className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${
                        task.isCompleted ? 'bg-foreground/10' : 'bg-primary'
                      }`}
                      style={{ opacity: task.priority ? task.priority / 5 : 0.2 }}
                    />

                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex-1">
                          <h3 className={`font-heading text-xl md:text-2xl uppercase leading-tight transition-all duration-300 ${
                            task.isCompleted ? 'text-foreground/40 line-through' : 'text-foreground'
                          }`}>
                            {task.title}
                          </h3>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleToggleComplete(task)}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                              task.isCompleted
                                ? 'bg-primary border-primary text-background'
                                : 'bg-background border-foreground/20 text-foreground/40 hover:border-primary hover:text-primary'
                            }`}
                            aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            <Check className={`w-5 h-5 ${task.isCompleted ? 'scale-100' : 'scale-0 group-hover:scale-100'} transition-transform`} />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="w-12 h-12 rounded-xl flex items-center justify-center bg-background border-2 border-foreground/20 text-foreground/40 hover:bg-destructive hover:border-destructive hover:text-destructiveforeground transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            aria-label="Delete task"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Notes */}
                      {task.notes && (
                        <p className={`font-paragraph text-sm md:text-base mb-8 flex-1 line-clamp-3 transition-colors duration-300 ${
                          task.isCompleted ? 'text-subtletext/50' : 'text-subtletext'
                        }`}>
                          {task.notes}
                        </p>
                      )}

                      {/* Card Footer (Meta) */}
                      <div className="mt-auto pt-6 border-t border-foreground/5 flex flex-wrap items-center gap-6">
                        {task.dueDate && (
                          <div className="flex items-center gap-2 text-xs font-heading uppercase tracking-widest text-foreground/60">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          </div>
                        )}
                        {task.priority !== undefined && (
                          <div className="flex items-center gap-2 text-xs font-heading uppercase tracking-widest text-foreground/60">
                            <AlertCircle className="w-3 h-3" />
                            <span>P{task.priority}</span>
                          </div>
                        )}
                        <div className="ml-auto text-xs font-heading uppercase tracking-widest text-foreground/30">
                          ID: {task._id.substring(0, 6)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
