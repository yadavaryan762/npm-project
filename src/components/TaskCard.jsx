import { useState } from 'react';
import {
  Check,
  Pencil,
  Trash2,
  Clock,
  Tag,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getDueDateStatus, getDueDateLabel, PRIORITY_COLORS, PRIORITY_LABELS } from '../utils/taskHelpers.js';

const STATUS_ICONS = {
  overdue: <AlertTriangle size={12} />,
  'due-today': <Clock size={12} />,
};

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dueDateStatus = getDueDateStatus(task);
  const dueDateLabel = getDueDateLabel(task.dueDate);

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(task.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div
      className={`task-card ${task.completed ? 'task-card--completed' : ''} ${
        dueDateStatus === 'overdue' ? 'task-card--overdue' : ''
      }`}
    >
      <div className="task-card-main">
        {/* Checkbox */}
        <button
          className={`task-checkbox ${task.completed ? 'task-checkbox--checked' : ''}`}
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
        >
          {task.completed ? <Check size={13} strokeWidth={3} /> : null}
        </button>

        {/* Content */}
        <div className="task-card-content">
          <div className="task-card-top">
            <span className={`task-card-title ${task.completed ? 'task-card-title--done' : ''}`}>
              {task.title}
            </span>
            <div className="task-card-actions">
              {task.completed ? (
                <button
                  className="task-action-btn task-action-btn--reopen"
                  onClick={() => onToggle(task.id)}
                  title="Reopen task"
                >
                  <RotateCcw size={14} />
                </button>
              ) : (
                <button
                  className="task-action-btn task-action-btn--edit"
                  onClick={() => onEdit(task)}
                  title="Edit task"
                >
                  <Pencil size={14} />
                </button>
              )}
              <button
                className={`task-action-btn task-action-btn--delete ${confirmDelete ? 'task-action-btn--confirm' : ''}`}
                onClick={handleDelete}
                title={confirmDelete ? 'Click again to confirm delete' : 'Delete task'}
              >
                <Trash2 size={14} />
              </button>
              {task.description && (
                <button
                  className="task-action-btn task-action-btn--expand"
                  onClick={() => setExpanded((v) => !v)}
                  title={expanded ? 'Collapse' : 'Expand description'}
                >
                  {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              )}
            </div>
          </div>

          {/* Meta row */}
          <div className="task-card-meta">
            <span className={`task-priority-badge ${PRIORITY_COLORS[task.priority]}`}>
              {PRIORITY_LABELS[task.priority]}
            </span>
            <span className="task-category-badge">
              <Tag size={11} />
              {task.category}
            </span>
            {task.dueDate && (
              <span className={`task-due-badge task-due-badge--${dueDateStatus}`}>
                {STATUS_ICONS[dueDateStatus]}
                {dueDateLabel}
              </span>
            )}
          </div>

          {/* Expanded description */}
          {expanded && task.description && (
            <p className="task-card-description">{task.description}</p>
          )}
        </div>
      </div>

      {/* Delete confirm banner */}
      {confirmDelete && (
        <div className="task-delete-confirm">
          Click delete again to confirm removal
        </div>
      )}
    </div>
  );
}
