import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Settings,
  Zap,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'upcoming', label: 'Upcoming', icon: Calendar },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ currentPage, onNavigate, taskCount, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Zap size={20} />
          </div>
          <span className="sidebar-logo-text">TaskFlow</span>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        {/* Task count badge */}
        <div className="sidebar-meta">
          <span className="sidebar-meta-label">Total tasks</span>
          <span className="sidebar-badge">{taskCount}</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  className={`sidebar-nav-item ${currentPage === id ? 'sidebar-nav-item--active' : ''}`}
                  onClick={() => onNavigate(id)}
                >
                  <Icon size={18} className="sidebar-nav-icon" />
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <p className="sidebar-footer-text">TaskFlow v1.0.0</p>
          <p className="sidebar-footer-sub">Powered by safe-storage-lite</p>
        </div>
      </aside>
    </>
  );
}
