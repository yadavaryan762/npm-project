/**
 * taskHelpers.js — Task utility functions
 */

import { v4 as generateId } from './uuid.js';

export const PRIORITIES = ['low', 'medium', 'high'];

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const PRIORITY_COLORS = {
  low: 'priority-low',
  medium: 'priority-medium',
  high: 'priority-high',
};

/**
 * Create a new task object with defaults.
 */
export function createTask({
  title,
  description = '',
  category = 'Other',
  priority = 'medium',
  dueDate = '',
}) {
  return {
    id: generateId(),
    title: title.trim(),
    description: description.trim(),
    category,
    priority,
    dueDate,
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Returns true if a task is overdue (not completed and dueDate is in the past).
 */
export function isOverdue(task) {
  if (task.completed || !task.dueDate) return false;
  const due = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

/**
 * Returns 'overdue' | 'due-today' | 'upcoming' | 'no-date'
 */
export function getDueDateStatus(task) {
  if (!task.dueDate) return 'no-date';
  if (task.completed) return 'completed';
  const due = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (due < today) return 'overdue';
  if (due.getTime() === today.getTime()) return 'due-today';
  return 'upcoming';
}

/**
 * Format a date string for display.
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns relative due date label.
 */
export function getDueDateLabel(dateStr) {
  if (!dateStr) return '';
  const due = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays <= 7) return `Due in ${diffDays}d`;
  return formatDate(dateStr);
}

/**
 * Compute dashboard statistics from a tasks array.
 */
export function computeStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;
  const overdue = tasks.filter((t) => isOverdue(t)).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pending, overdue, completionRate };
}

/**
 * Filter and sort tasks based on query options.
 */
export function filterTasks(tasks, { search, status, category, priority, sortBy, sortOrder }) {
  let result = [...tasks];

  // Search
  if (search && search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }

  // Status filter
  if (status === 'pending') result = result.filter((t) => !t.completed);
  else if (status === 'completed') result = result.filter((t) => t.completed);
  else if (status === 'overdue') result = result.filter((t) => isOverdue(t));

  // Category filter
  if (category && category !== 'all') {
    result = result.filter((t) => t.category === category);
  }

  // Priority filter
  if (priority && priority !== 'all') {
    result = result.filter((t) => t.priority === priority);
  }

  // Sort
  result.sort((a, b) => {
    let aVal, bVal;
    if (sortBy === 'dueDate') {
      aVal = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      bVal = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    } else if (sortBy === 'priority') {
      const order = { high: 0, medium: 1, low: 2 };
      aVal = order[a.priority] ?? 1;
      bVal = order[b.priority] ?? 1;
    } else {
      // createdAt (default)
      aVal = new Date(a.createdAt).getTime();
      bVal = new Date(b.createdAt).getTime();
    }
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return result;
}

/**
 * Get upcoming tasks (next 7 days, not completed).
 */
export function getUpcomingTasks(tasks) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return tasks
    .filter((t) => {
      if (t.completed || !t.dueDate) return false;
      const due = new Date(t.dueDate);
      return due >= today && due <= nextWeek;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

/**
 * Get overdue tasks.
 */
export function getOverdueTasks(tasks) {
  return tasks
    .filter((t) => isOverdue(t))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}
