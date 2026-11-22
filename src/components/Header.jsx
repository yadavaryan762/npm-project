import { Sun, Moon, Menu } from 'lucide-react';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  tasks: 'My Tasks',
  upcoming: 'Upcoming',
  settings: 'Settings',
};

const PAGE_SUBTITLES = {
  dashboard: 'Welcome back! Here\'s your productivity overview.',
  tasks: 'Manage and organize your tasks.',
  upcoming: 'Your upcoming deadlines and schedule.',
  settings: 'Customize your TaskFlow experience.',
};

export default function Header({ page, theme, onThemeToggle, onMenuToggle }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuToggle} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="header-title">{PAGE_TITLES[page] || 'TaskFlow'}</h1>
          <p className="header-subtitle">{PAGE_SUBTITLES[page] || ''}</p>
        </div>
      </div>
      <div className="header-right">
        <button
          className="theme-toggle-btn"
          onClick={onThemeToggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}
