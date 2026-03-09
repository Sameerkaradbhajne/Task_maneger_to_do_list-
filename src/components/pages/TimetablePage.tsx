import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Clock, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { TimetableEntries } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function TimetablePage() {
  const [events, setEvents] = useState<TimetableEntries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventStartTime, setNewEventStartTime] = useState('');
  const [newEventEndTime, setNewEventEndTime] = useState('');
  const [newEventIsAllDay, setNewEventIsAllDay] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<TimetableEntries>('timetable');
      setEvents(result.items.sort((a, b) => {
        const dateA = new Date(a.startTime || 0).getTime();
        const dateB = new Date(b.startTime || 0).getTime();
        return dateA - dateB;
      }));
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!newEventTitle.trim()) return;

    const newEvent: TimetableEntries = {
      _id: crypto.randomUUID(),
      eventTitle: newEventTitle,
      description: newEventDescription,
      location: newEventLocation,
      startTime: newEventStartTime || new Date(),
      endTime: newEventEndTime || new Date(),
      isAllDay: newEventIsAllDay,
    };

    setEvents([...events, newEvent].sort((a, b) => {
      const dateA = new Date(a.startTime || 0).getTime();
      const dateB = new Date(b.startTime || 0).getTime();
      return dateA - dateB;
    }));

    setNewEventTitle('');
    setNewEventDescription('');
    setNewEventLocation('');
    setNewEventStartTime('');
    setNewEventEndTime('');
    setNewEventIsAllDay(false);

    try {
      await BaseCrudService.create('timetable', newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      loadEvents();
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    setEvents(events.filter(e => e._id !== eventId));

    try {
      await BaseCrudService.delete('timetable', eventId);
    } catch (error) {
      console.error('Error deleting event:', error);
      loadEvents();
    }
  };

  const heroRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const isFormInView = useInView(formSectionRef, { once: true, margin: "-100px" });

  const formatEventTime = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  const formatEventDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-clip">
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
                Schedule & Organize
              </p>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-primary-foreground mb-8">
                Manage Your Timetable
              </h1>
              <p className="font-paragraph text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-8 max-w-lg">
                Plan your day with precision. Schedule events, set reminders, and stay organized with our intuitive timetable.
              </p>

              <ul className="space-y-4 mb-12">
                <li className="flex items-center gap-3 text-primary-foreground font-paragraph">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  <span>Schedule events with start and end times</span>
                </li>
                <li className="flex items-center gap-3 text-primary-foreground font-paragraph">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  <span>Add locations and detailed descriptions</span>
                </li>
                <li className="flex items-center gap-3 text-primary-foreground font-paragraph">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  <span>Support for all-day events</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-accent-blue/20 to-primary/20 flex items-center justify-center"
            >
              <div className="text-center">
                <CalendarIcon className="w-24 h-24 text-accent-blue mx-auto mb-4 opacity-80" />
                <p className="text-primary-foreground/60 font-heading text-lg">Your Schedule</p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Add Event Form */}
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
              Schedule Event
            </p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase leading-tight text-foreground mb-6">
              Add New Event
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
                  Event Title *
                </label>
                <Input
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g., Team Meeting, Doctor Appointment..."
                  className="bg-transparent border-0 border-b-2 border-foreground/20 rounded-none px-0 h-16 text-2xl md:text-3xl font-heading placeholder:text-foreground/20 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                />
              </div>

              <div className="group">
                <label className="font-heading text-xs text-foreground mb-3 block uppercase tracking-[0.15em] transition-colors group-focus-within:text-primary">
                  Description
                </label>
                <Textarea
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  placeholder="Add details about the event..."
                  className="bg-background border border-foreground/10 rounded-2xl p-4 min-h-[120px] text-base font-paragraph placeholder:text-foreground/30 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="font-heading text-xs text-foreground mb-3 block uppercase tracking-[0.15em] transition-colors group-focus-within:text-primary flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Start Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={newEventStartTime}
                    onChange={(e) => setNewEventStartTime(e.target.value)}
                    className="bg-background border border-foreground/10 rounded-xl h-14 px-4 font-paragraph focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                  />
                </div>

                <div className="group">
                  <label className="font-heading text-xs text-foreground mb-3 block uppercase tracking-[0.15em] transition-colors group-focus-within:text-primary flex items-center gap-2">
                    <Clock className="w-3 h-3" /> End Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={newEventEndTime}
                    onChange={(e) => setNewEventEndTime(e.target.value)}
                    className="bg-background border border-foreground/10 rounded-xl h-14 px-4 font-paragraph focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <label className="font-heading text-xs text-foreground mb-3 block uppercase tracking-[0.15em] transition-colors group-focus-within:text-primary flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Location
                </label>
                <Input
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  placeholder="e.g., Conference Room A, Online..."
                  className="bg-background border border-foreground/10 rounded-xl h-14 px-4 font-paragraph placeholder:text-foreground/30 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                />
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={newEventIsAllDay}
                  onChange={(e) => setNewEventIsAllDay(e.target.checked)}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
                <label htmlFor="allDay" className="font-heading text-sm uppercase tracking-widest text-foreground cursor-pointer">
                  All Day Event
                </label>
              </div>

              <div className="pt-6">
                <Button
                  onClick={handleAddEvent}
                  disabled={!newEventTitle.trim()}
                  className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary-dark h-14 px-12 text-sm font-heading uppercase tracking-widest rounded-full transition-all duration-300 disabled:opacity-50 disabled:hover:bg-primary group shadow-lg"
                >
                  <span className="flex items-center gap-3">
                    Add Event
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events List */}
      <section className="relative w-full bg-dark-bg py-24 md:py-40 px-4 md:px-8 lg:px-12">
        <div className="w-full max-w-[120rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase leading-tight text-primary-foreground mb-6">
              Upcoming Events
            </h2>
            <p className="font-paragraph text-lg text-primary-foreground/80">
              Your scheduled events and appointments
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
                    <p className="font-heading text-xs uppercase tracking-widest text-accent-blue">Loading Events</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isLoading && events.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full py-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-primary-foreground/20 rounded-3xl bg-primary/5"
              >
                <CalendarIcon className="w-16 h-16 text-accent-blue mx-auto mb-6 opacity-60" />
                <h3 className="font-heading text-2xl uppercase text-primary-foreground mb-2">No Events Yet</h3>
                <p className="font-paragraph text-primary-foreground/60 max-w-md">
                  Create your first event above to start scheduling.
                </p>
              </motion.div>
            )}

            <div className={`space-y-6 transition-opacity duration-500 ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <AnimatePresence mode="popLayout">
                {events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative flex flex-col bg-gradient-to-r from-primary-foreground/10 to-accent-blue/10 border-l-4 border-accent-blue rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg p-6 md:p-8"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="font-heading text-xl md:text-2xl uppercase leading-tight text-primary-foreground">
                          {event.eventTitle}
                        </h3>
                        {event.description && (
                          <p className="font-paragraph text-sm text-primary-foreground/70 mt-2 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="w-12 h-12 rounded-xl flex items-center justify-center bg-dark-bg border-2 border-primary-foreground/20 text-primary-foreground/40 hover:bg-destructive hover:border-destructive hover:text-destructiveforeground transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
                        aria-label="Delete event"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-primary-foreground/10 flex flex-wrap items-center gap-6 text-sm">
                      {event.isAllDay ? (
                        <div className="flex items-center gap-2 font-heading uppercase tracking-widest text-accent-blue">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatEventDate(event.startTime)}</span>
                          <span className="text-primary-foreground/60">All Day</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 font-heading uppercase tracking-widest text-accent-blue">
                            <Clock className="w-4 h-4" />
                            <span>{formatEventTime(event.startTime)}</span>
                            <span className="text-primary-foreground/60">-</span>
                            <span>{formatEventTime(event.endTime)}</span>
                          </div>
                          <div className="flex items-center gap-2 font-heading uppercase tracking-widest text-primary-foreground/60">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatEventDate(event.startTime)}</span>
                          </div>
                        </>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2 font-heading uppercase tracking-widest text-primary-foreground/60">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
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
