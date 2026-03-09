/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

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
