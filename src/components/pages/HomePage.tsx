// HPI 1.7-V
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { Plus, Check, Trash2, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Tasks } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// --- Utility Components for Architectural Styling ---

const HairlineDivider = ({ className = "" }: { className?: string }) => (
  <div className={`w-full h-[1px] bg-foreground/10 ${className}`} />
);

const SectionHeading = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-12 md:mb-20">
    {subtitle && (
      <p className="font-heading text-xs md:text-sm uppercase tracking-[0.2em] text-foreground/60 mb-4">
        {subtitle}
      </p>
    )}
    <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl uppercase text-foreground leading-[0.9]">
      {title}
    </h2>
  </div>
);

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
  const heroImageY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const heroTextY = useTransform(heroScroll, [0, 1], ["0%", "50%"]);
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
        HERO SECTION (Inspiration Layout)
        =========================================
      */}
      <section 
        ref={heroRef} 
        className="relative w-full bg-primary pt-24 md:pt-32 pb-12 md:pb-24 px-4 md:px-8 lg:px-12 min-h-[90vh] flex flex-col"
      >
        {/* Massive Typography Header */}
        <motion.div 
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-20 w-full max-w-[120rem] mx-auto mb-8 md:mb-12"
        >
          <h1 className="font-heading text-[13vw] leading-[0.8] tracking-tighter uppercase text-foreground m-0 p-0">
            TASK. MANAGER
          </h1>
        </motion.div>

        {/* Image Container - Full Bleed within padding */}
        <div className="relative w-full max-w-[120rem] mx-auto flex-1 min-h-[50vh] md:min-h-[60vh] overflow-hidden bg-foreground">
          <motion.img
            style={{ y: heroImageY, scale: 1.05 }}
            src="https://static.wixstatic.com/media/247794_5beea19d48fb4856bd114822f29479bd~mv2.png?originWidth=1280&originHeight=704"
            alt="Architectural Workspace"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          
          {/* Overlay Card - Bottom Left */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 md:bottom-8 md:left-8 w-full md:w-[480px] bg-background p-8 md:p-10 rounded-tr-2xl md:rounded-2xl z-30 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <p className="font-heading text-xs uppercase tracking-[0.2em] text-foreground">System Active</p>
            </div>
            <h2 className="font-heading text-2xl md:text-3xl uppercase text-foreground mb-4 leading-tight">
              Master Your Workflow Architecture
            </h2>
            <p className="font-paragraph text-sm md:text-base text-subtletext leading-relaxed">
              Organize your objectives with precision and clarity. Create, track, and execute tasks efficiently in a streamlined environment designed for absolute productivity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 
        =========================================
        CREATION ENGINE (Add Task Form)
        =========================================
      */}
      <section 
        ref={formSectionRef}
        className="relative w-full max-w-[120rem] mx-auto px-4 md:px-8 lg:px-12 py-24 md:py-40"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Sticky Left Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <SectionHeading title="Initiate Protocol" subtitle="01. Data Entry" />
                <div className="w-16 h-[2px] bg-primary mb-8" />
                <p className="font-paragraph text-lg text-subtletext leading-relaxed mb-8">
                  Define the parameters of your next objective. Precision in planning yields excellence in execution. Every detail matters.
                </p>
                
                {/* Decorative Stats */}
                <div className="grid grid-cols-2 gap-4 border-t border-foreground/10 pt-8">
                  <div>
                    <p className="font-heading text-4xl text-foreground">{activeTasksCount}</p>
                    <p className="font-paragraph text-xs uppercase tracking-widest text-subtletext mt-1">Active</p>
                  </div>
                  <div>
                    <p className="font-heading text-4xl text-foreground">{completedTasksCount}</p>
                    <p className="font-paragraph text-xs uppercase tracking-widest text-subtletext mt-1">Completed</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Form Right Column */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="bg-secondary p-8 md:p-12 rounded-2xl border border-foreground/10 shadow-sm relative overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="relative z-10 space-y-8">
                {/* Title Input */}
                <div className="group">
                  <label className="font-heading text-xs text-foreground mb-3 block uppercase tracking-[0.15em] transition-colors group-focus-within:text-primary">
                    Primary Objective *
                  </label>
                  <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task title..."
                    className="bg-transparent border-0 border-b-2 border-foreground/20 rounded-none px-0 h-16 text-2xl md:text-3xl font-heading placeholder:text-foreground/20 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  />
                </div>

                {/* Notes Input */}
                <div className="group">
                  <label className="font-heading text-xs text-foreground mb-3 block uppercase tracking-[0.15em] transition-colors group-focus-within:text-primary">
                    Supporting Details
                  </label>
                  <Textarea
                    value={newTaskNotes}
                    onChange={(e) => setNewTaskNotes(e.target.value)}
                    placeholder="Add context, links, or specific requirements..."
                    className="bg-background border border-foreground/10 rounded-xl p-4 min-h-[120px] text-base font-paragraph placeholder:text-foreground/30 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all resize-none"
                  />
                </div>

                {/* Meta Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="font-heading text-xs text-foreground mb-3 block uppercase tracking-[0.15em] transition-colors group-focus-within:text-primary flex items-center gap-2">
                      <Clock className="w-3 h-3" /> Deadline
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
                      <AlertCircle className="w-3 h-3" /> Priority Level
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
                      <span className="font-heading text-xl text-primary w-6 text-center">
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
                    className="w-full md:w-auto bg-foreground text-background hover:bg-primary hover:text-primary-foreground h-16 px-12 text-sm font-heading uppercase tracking-widest rounded-xl transition-all duration-300 disabled:opacity-50 disabled:hover:bg-foreground disabled:hover:text-background group"
                  >
                    <span className="flex items-center gap-3">
                      Commit Task
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 
        =========================================
        VISUAL BREATHER (Parallax Divider)
        =========================================
      */}
      <section className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden bg-foreground">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10" />
        <motion.img
          style={{ y: useTransform(heroScroll, [0, 1], ["-20%", "20%"]) }}
          src="https://static.wixstatic.com/media/247794_60f6bcbbc1e54dea93f6523db3fb0781~mv2.png?originWidth=1280&originHeight=704"
          alt="Abstract Architecture"
          className="absolute inset-0 w-full h-[140%] object-cover grayscale opacity-50"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-background uppercase tracking-widest text-center max-w-4xl leading-tight mix-blend-overlay">
            Structure Creates Freedom
          </h2>
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
        <div className="max-w-[120rem] mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isListInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          >
            <SectionHeading title="The Ledger" subtitle="02. Execution" />
            
            {/* Filter/Sort visual placeholder (non-functional, for architectural feel) */}
            <div className="flex items-center gap-4 pb-4 md:pb-6">
              <div className="h-[1px] w-12 bg-foreground/20 hidden md:block" />
              <span className="font-heading text-xs uppercase tracking-widest text-subtletext">
                Sorted by Priority
              </span>
            </div>
          </motion.div>

          <HairlineDivider className="mb-16" />

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
                    <p className="font-heading text-xs uppercase tracking-widest text-primary">Syncing Data</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!isLoading && tasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full py-32 flex flex-col items-center justify-center text-center border border-dashed border-foreground/20 rounded-2xl bg-secondary/50"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-2xl uppercase text-foreground mb-2">Ledger is Empty</h3>
                <p className="font-paragraph text-subtletext max-w-md">
                  No active objectives found. Initiate a new protocol above to begin tracking your workflow.
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
                    className={`group relative flex flex-col bg-secondary border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl ${
                      task.isCompleted 
                        ? 'border-foreground/5 bg-background/50' 
                        : 'border-foreground/10 hover:border-primary/50'
                    }`}
                  >
                    {/* Priority Indicator Line */}
                    <div 
                      className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${
                        task.isCompleted ? 'bg-foreground/10' : 'bg-primary group-hover:bg-primary'
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
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                              task.isCompleted
                                ? 'bg-primary border-primary text-primary-foreground'
                                : 'bg-background border-foreground/20 text-foreground/40 hover:border-primary hover:text-primary'
                            }`}
                            aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            <Check className={`w-5 h-5 ${task.isCompleted ? 'scale-100' : 'scale-0 group-hover:scale-100'} transition-transform`} />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="w-12 h-12 rounded-xl flex items-center justify-center bg-background border border-foreground/20 text-foreground/40 hover:bg-destructive hover:border-destructive hover:text-destructiveforeground transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
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