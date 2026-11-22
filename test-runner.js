/**
 * test-runner.js — Functional & storage verification for TaskFlow
 */

// Simple polyfill for window/localStorage in node for testing safe-storage-lite in Node environment
const storageStore = new Map();
global.window = global;
global.localStorage = {
  getItem: (k) => storageStore.get(k) ?? null,
  setItem: (k, v) => storageStore.set(k, String(v)),
  removeItem: (k) => storageStore.delete(k),
  clear: () => storageStore.clear(),
  get length() { return storageStore.size; },
  key: (i) => Array.from(storageStore.keys())[i] ?? null
};

async function runTests() {
  console.log('=== TaskFlow Functional & Storage Verification ===\n');

  const {
    getTasks,
    saveTasks,
    getTheme,
    saveTheme,
    getCategories,
    saveCategories,
    clearAllData,
    checkStorageAvailable,
    STORAGE_KEYS
  } = await import('./src/utils/storage.js');

  const {
    createTask,
    isOverdue,
    getDueDateStatus,
    computeStats,
    filterTasks,
    getUpcomingTasks,
    getOverdueTasks
  } = await import('./src/utils/taskHelpers.js');

  let passed = 0;
  let failed = 0;

  function assert(desc, condition) {
    if (condition) {
      console.log(`✓ ${desc}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${desc}`);
      failed++;
    }
  }

  // 1. Storage Availability
  assert('Storage availability check returns true', checkStorageAvailable() === true);

  // 2. Initial empty tasks
  clearAllData();
  assert('getTasks() returns empty array when empty', Array.isArray(getTasks()) && getTasks().length === 0);

  // 3. Creating tasks
  const task1 = createTask({
    title: 'Complete project report',
    description: 'Prepare quarterly analysis',
    category: 'Work',
    priority: 'high',
    dueDate: '2026-11-25'
  });
  assert('createTask produces valid task object with id and createdAt', task1.id && task1.title === 'Complete project report' && task1.priority === 'high');

  const task2 = createTask({
    title: 'Grocery shopping',
    description: 'Milk, eggs, coffee',
    category: 'Personal',
    priority: 'low',
    dueDate: '2020-01-01' // intentionally overdue
  });

  const task3 = createTask({
    title: 'Study React patterns',
    category: 'Study',
    priority: 'medium',
    dueDate: '' // no due date
  });

  // 4. Persistence using safe-storage-lite
  const saveSuccess = saveTasks([task1, task2, task3]);
  assert('saveTasks() writes tasks via safe-storage-lite successfully', saveSuccess === true);

  const loadedTasks = getTasks();
  assert('getTasks() retrieves persisted tasks with correct length', loadedTasks.length === 3);
  assert('Task properties deserialized properly', loadedTasks[0].title === 'Complete project report' && loadedTasks[1].priority === 'low');

  // Verify safe-storage-lite prefixing / behavior
  const rawKey = `__safe_storage__:${STORAGE_KEYS.TASKS}`;
  assert('safe-storage-lite namespace prefix is applied to storage key', storageStore.has(rawKey));

  // 5. Overdue and status logic
  assert('task2 is identified as overdue', isOverdue(task2) === true);
  assert('task1 is not overdue', isOverdue(task1) === false);
  assert('task3 has no-date status', getDueDateStatus(task3) === 'no-date');

  // 6. Statistics calculation
  const stats = computeStats(loadedTasks);
  assert('Stats total is 3', stats.total === 3);
  assert('Stats completed is 0', stats.completed === 0);
  assert('Stats pending is 3', stats.pending === 3);
  assert('Stats overdue is 1', stats.overdue === 1);
  assert('Stats completion rate is 0%', stats.completionRate === 0);

  // Mark task1 completed & recalculate
  task1.completed = true;
  saveTasks([task1, task2, task3]);
  const updatedStats = computeStats(getTasks());
  assert('Completed count updates to 1', updatedStats.completed === 1);
  assert('Completion rate updates to 33%', updatedStats.completionRate === 33);

  // 7. Search & Filtering
  const searchResults = filterTasks(getTasks(), { search: 'Grocery', status: 'all', category: 'all', priority: 'all', sortBy: 'createdAt', sortOrder: 'desc' });
  assert('Search by keyword finds matching task', searchResults.length === 1 && searchResults[0].title === 'Grocery shopping');

  const completedFiltered = filterTasks(getTasks(), { status: 'completed', category: 'all', priority: 'all', sortBy: 'createdAt', sortOrder: 'desc' });
  assert('Filter by status "completed" returns 1 task', completedFiltered.length === 1 && completedFiltered[0].id === task1.id);

  const priorityFiltered = filterTasks(getTasks(), { status: 'all', category: 'all', priority: 'high', sortBy: 'createdAt', sortOrder: 'desc' });
  assert('Filter by priority "high" returns 1 task', priorityFiltered.length === 1 && priorityFiltered[0].priority === 'high');

  // 8. Upcoming & Overdue lists
  const overdueList = getOverdueTasks(getTasks());
  assert('getOverdueTasks returns the overdue task', overdueList.length === 1 && overdueList[0].id === task2.id);

  // 9. Theme persistence
  assert('Default theme is light', getTheme() === 'light');
  saveTheme('dark');
  assert('Theme persists as dark', getTheme() === 'dark');
  saveTheme('light');
  assert('Theme updates back to light', getTheme() === 'light');

  // 10. Categories persistence
  const defaultCats = getCategories();
  assert('Default categories loaded', defaultCats.includes('Work') && defaultCats.includes('Personal'));
  saveCategories([...defaultCats, 'Fitness']);
  assert('Custom categories persist', getCategories().includes('Fitness'));

  // 11. Clear all data
  clearAllData();
  assert('clearAllData removes tasks', getTasks().length === 0);
  assert('Theme remains preserved after clearAllData', getTheme() === 'light');

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Error during test execution:', err);
  process.exit(1);
});
