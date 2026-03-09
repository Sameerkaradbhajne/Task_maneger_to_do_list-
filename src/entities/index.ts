/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: habits
 * Interface for Habits
 */
export interface Habits {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  habitName?: string;
  /** @wixFieldType text */
  frequency?: string;
  /** @wixFieldType number */
  streakCount?: number;
  /** @wixFieldType boolean */
  isCompletedToday?: boolean;
  /** @wixFieldType date */
  lastCompletedDate?: Date | string;
  /** @wixFieldType datetime */
  creationDate?: Date | string;
}


/**
 * Collection ID: tasks
 * Interface for Tasks
 */
export interface Tasks {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType boolean */
  isCompleted?: boolean;
  /** @wixFieldType datetime */
  dueDate?: Date | string;
  /** @wixFieldType number */
  priority?: number;
  /** @wixFieldType text */
  notes?: string;
}


/**
 * Collection ID: timetable
 * Interface for TimetableEntries
 */
export interface TimetableEntries {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  eventTitle?: string;
  /** @wixFieldType datetime */
  startTime?: Date | string;
  /** @wixFieldType datetime */
  endTime?: Date | string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  location?: string;
  /** @wixFieldType boolean */
  isAllDay?: boolean;
}
