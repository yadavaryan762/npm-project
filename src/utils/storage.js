/**
 * storage.js — TaskFlow Storage Utility
 *
 * All persistent data operations go through this module.
 * Uses the safe-storage-lite NPM package exclusively.
 * Never calls localStorage directly.
 */

import {
  setItem,
  getItem,
  removeItem,
  clear,
  hasItem,
  isStorageAvailable,
} from 'safe-storage-lite';

// ─── Storage Keys ───────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks',
  THEME: 'taskflow_theme',
  PREFERENCES: 'taskflow_preferences',
  CATEGORIES: 'taskflow_categories',
};

// ─── Storage Availability ───────────────────────────────────────────────────
export function checkStorageAvailable() {
  return isStorageAvailable();
}

// ─── Tasks ──────────────────────────────────────────────────────────────────

/**
 * Retrieve all tasks from storage.
 * Returns an empty array if none exist or storage is unavailable.
 */
export function getTasks() {
  const tasks = getItem(STORAGE_KEYS.TASKS);
  if (!Array.isArray(tasks)) return [];
  return tasks;
}

/**
 * Persist the full tasks array to storage.
 * Tasks are permanent (no TTL).
 * Returns true on success, false on failure.
 */
export function saveTasks(tasks) {
  if (!Array.isArray(tasks)) return false;
  return setItem(STORAGE_KEYS.TASKS, tasks);
}

/**
 * Remove all task data from storage.
 */
export function clearTasks() {
  return removeItem(STORAGE_KEYS.TASKS);
}

// ─── Theme ──────────────────────────────────────────────────────────────────

/**
 * Get the persisted theme preference ('light' | 'dark').
 * Defaults to 'light' if not set.
 */
export function getTheme() {
  const theme = getItem(STORAGE_KEYS.THEME);
  if (theme === 'dark' || theme === 'light') return theme;
  return 'light';
}

/**
 * Persist the theme preference permanently.
 */
export function saveTheme(theme) {
  if (theme !== 'light' && theme !== 'dark') return false;
  return setItem(STORAGE_KEYS.THEME, theme);
}

// ─── Preferences ────────────────────────────────────────────────────────────

/**
 * Get user preferences object.
 */
export function getPreferences() {
  const prefs = getItem(STORAGE_KEYS.PREFERENCES);
  if (!prefs || typeof prefs !== 'object') {
    return { sortBy: 'createdAt', sortOrder: 'desc' };
  }
  return prefs;
}

/**
 * Save user preferences permanently.
 */
export function savePreferences(prefs) {
  if (!prefs || typeof prefs !== 'object') return false;
  return setItem(STORAGE_KEYS.PREFERENCES, prefs);
}

// ─── Categories ─────────────────────────────────────────────────────────────

export const DEFAULT_CATEGORIES = ['Personal', 'Work', 'Study', 'Other'];

/**
 * Get categories — returns default list if none saved.
 */
export function getCategories() {
  const cats = getItem(STORAGE_KEYS.CATEGORIES);
  if (!Array.isArray(cats) || cats.length === 0) return DEFAULT_CATEGORIES;
  return cats;
}

/**
 * Save categories permanently.
 */
export function saveCategories(categories) {
  if (!Array.isArray(categories)) return false;
  return setItem(STORAGE_KEYS.CATEGORIES, categories);
}

// ─── Clear All App Data ──────────────────────────────────────────────────────

/**
 * Remove all TaskFlow data from storage using namespace-safe removal.
 * Uses removeItem for each key — does NOT call clear() which would
 * wipe unrelated app data on the same origin.
 */
export function clearAllData() {
  removeItem(STORAGE_KEYS.TASKS);
  removeItem(STORAGE_KEYS.PREFERENCES);
  removeItem(STORAGE_KEYS.CATEGORIES);
  // Intentionally keep theme preference
}

/**
 * Checks if tasks key exists in storage.
 */
export function hasTasksStored() {
  return hasItem(STORAGE_KEYS.TASKS);
}
