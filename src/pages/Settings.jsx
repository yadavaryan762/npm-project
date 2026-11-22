import { useState } from 'react';
import {
  Sun,
  Moon,
  Trash2,
  Info,
  Database,
  CheckCircle2,
  XCircle,
  Package,
} from 'lucide-react';

export default function Settings({ theme, onThemeChange, onClearData, storageOk, taskCount }) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClear = () => {
    if (showClearConfirm) {
      onClearData();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
    }
  };

  return (
    <div className="page">
      {/* Theme Section */}
      <section className="settings-section card">
        <div className="settings-section-header">
          <h2 className="settings-section-title">Appearance</h2>
          <p className="settings-section-desc">Customize how TaskFlow looks for you.</p>
        </div>
        <div className="settings-theme-row">
          <button
            className={`theme-option ${theme === 'light' ? 'theme-option--active' : ''}`}
            onClick={() => onThemeChange('light')}
          >
            <div className="theme-option-preview theme-option-preview--light">
              <Sun size={22} />
            </div>
            <span className="theme-option-label">Light</span>
            {theme === 'light' && <CheckCircle2 size={16} className="theme-option-check" />}
          </button>
          <button
            className={`theme-option ${theme === 'dark' ? 'theme-option--active' : ''}`}
            onClick={() => onThemeChange('dark')}
          >
            <div className="theme-option-preview theme-option-preview--dark">
              <Moon size={22} />
            </div>
            <span className="theme-option-label">Dark</span>
            {theme === 'dark' && <CheckCircle2 size={16} className="theme-option-check" />}
          </button>
        </div>
      </section>

      {/* Storage Status */}
      <section className="settings-section card">
        <div className="settings-section-header">
          <h2 className="settings-section-title">Storage Status</h2>
          <p className="settings-section-desc">Powered by the safe-storage-lite package.</p>
        </div>
        <div className="settings-storage-status">
          {storageOk ? (
            <div className="storage-status-ok">
              <CheckCircle2 size={18} className="storage-status-icon storage-status-icon--ok" />
              <div>
                <strong>Storage available</strong>
                <p>Your tasks persist automatically between sessions.</p>
              </div>
            </div>
          ) : (
            <div className="storage-status-error">
              <XCircle size={18} className="storage-status-icon storage-status-icon--error" />
              <div>
                <strong>Storage unavailable</strong>
                <p>Tasks will not persist after page refresh.</p>
              </div>
            </div>
          )}
          <div className="settings-info-row">
            <Database size={15} />
            <span>Tasks stored: <strong>{taskCount}</strong></span>
          </div>
        </div>
      </section>

      {/* Package Info */}
      <section className="settings-section card">
        <div className="settings-section-header">
          <h2 className="settings-section-title">NPM Package</h2>
          <p className="settings-section-desc">TaskFlow uses a custom storage package.</p>
        </div>
        <div className="package-info">
          <Package size={20} />
          <div className="package-info-details">
            <code className="package-info-name">safe-storage-lite</code>
            <p className="package-info-desc">
              A lightweight, zero-dependency browser localStorage utility with automatic JSON
              serialization, TTL expiration, and safe fallback handling.
            </p>
            <ul className="package-info-features">
              <li>✓ Automatic JSON serialization / deserialization</li>
              <li>✓ TTL expiration with lazy eviction</li>
              <li>✓ Safe fallback when storage is unavailable</li>
              <li>✓ Namespace-isolated clear()</li>
              <li>✓ Quota-exceeded errors handled gracefully</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="settings-section card settings-section--danger">
        <div className="settings-section-header">
          <h2 className="settings-section-title settings-section-title--danger">Danger Zone</h2>
          <p className="settings-section-desc">Irreversible actions below.</p>
        </div>
        <div className="danger-zone">
          <div>
            <strong>Clear all task data</strong>
            <p>Permanently removes all {taskCount} task{taskCount !== 1 ? 's' : ''} from storage. This cannot be undone.</p>
          </div>
          {showClearConfirm ? (
            <div className="danger-confirm">
              <span className="danger-confirm-text">Are you sure?</span>
              <button className="btn btn-danger" onClick={handleClear}>
                <Trash2 size={15} /> Yes, delete all
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="btn btn-danger-outline"
              onClick={handleClear}
              disabled={taskCount === 0}
            >
              <Trash2 size={15} /> Clear All Data
            </button>
          )}
        </div>
      </section>

      {/* App Info */}
      <section className="settings-section card">
        <div className="settings-section-header">
          <h2 className="settings-section-title">About TaskFlow</h2>
        </div>
        <div className="app-info">
          <Info size={16} />
          <div>
            <p><strong>TaskFlow v1.0.0</strong> — Smart Task Management</p>
            <p>Built with React, Vite, and safe-storage-lite.</p>
            <p>All data is stored locally in your browser.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
