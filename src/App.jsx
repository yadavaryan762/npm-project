import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tasks from './pages/Tasks.jsx';
import Upcoming from './pages/Upcoming.jsx';
import Settings from './pages/Settings.jsx';
import {
  getTasks,
  saveTasks,
  getTheme,
  saveTheme,
  getCategories,
  checkStorageAvailable,
} from './utils/storage.js';
import { createTask } from './utils/taskHelpers.js';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState('light');
  const [categories, setCategories] = useState([]);
  const [storageOk, setStorageOk] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const avail = checkStorageAvailable();
    setStorageOk(avail);
    setTasks(getTasks());
    setTheme(getTheme());
    setCategories(getCategories());
  }, []);

  // ── Apply theme to <html> ──────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ── Task CRUD ──────────────────────────────────────────────────────────────
  const addTask = useCallback((fields) => {
    const task = createTask(fields);
    setTasks((prev) => {
      const updated = [task, ...prev];
      saveTasks(updated);
      return updated;
    });
    return task;
  }, []);

  const updateTask = useCallback((id, changes) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...changes } : t));
      saveTasks(updated);
      return updated;
    });
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTasks(updated);
      return updated;
    });
  }, []);

  const toggleComplete = useCallback((id) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      saveTasks(updated);
      return updated;
    });
  }, []);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
    saveTasks([]);
  }, []);

  // ── Theme ──────────────────────────────────────────────────────────────────
  const handleThemeChange = useCallback((newTheme) => {
    setTheme(newTheme);
    saveTheme(newTheme);
  }, []);

  // ── Shared props ───────────────────────────────────────────────────────────
  const sharedProps = {
    tasks,
    categories,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard {...sharedProps} onNavigate={setPage} />;
      case 'tasks':
        return <Tasks {...sharedProps} />;
      case 'upcoming':
        return <Upcoming {...sharedProps} />;
      case 'settings':
        return (
          <Settings
            theme={theme}
            onThemeChange={handleThemeChange}
            onClearData={clearAllTasks}
            storageOk={storageOk}
            taskCount={tasks.length}
          />
        );
      default:
        return <Dashboard {...sharedProps} onNavigate={setPage} />;
    }
  };

  return (
    <div className={`app-root`}>
      {!storageOk && (
        <div className="storage-warning">
          ⚠️ Browser storage is unavailable. Task data will not persist after refresh.
        </div>
      )}
      <Sidebar
        currentPage={page}
        onNavigate={(p) => { setPage(p); setSidebarOpen(false); }}
        theme={theme}
        taskCount={tasks.length}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-wrapper">
        <Header
          page={page}
          theme={theme}
          onThemeToggle={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
