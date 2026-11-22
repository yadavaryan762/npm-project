import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { PRIORITIES, PRIORITY_LABELS } from '../utils/taskHelpers.js';

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'Other',
  priority: 'medium',
  dueDate: '',
};

export default function TaskForm({ onSubmit, onClose, initialData, categories }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'Other',
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (form.title.trim().length > 100) errs.title = 'Title must be under 100 characters.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const isEditing = !!initialData;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form className="task-form" onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">
              Title <span className="form-required">*</span>
            </label>
            <input
              id="task-title"
              name="title"
              className={`form-input ${errors.title ? 'form-input--error' : ''}`}
              type="text"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              autoFocus
              maxLength={100}
            />
            {errors.title && (
              <span className="form-error">
                <AlertCircle size={13} /> {errors.title}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-desc">
              Description
            </label>
            <textarea
              id="task-desc"
              name="description"
              className="form-input form-textarea"
              placeholder="Add more details (optional)"
              value={form.description}
              onChange={handleChange}
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Category + Priority row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="task-category">
                Category
              </label>
              <select
                id="task-category"
                name="category"
                className="form-input form-select"
                value={form.category}
                onChange={handleChange}
              >
                {(categories || ['Personal', 'Work', 'Study', 'Other']).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-priority">
                Priority
              </label>
              <select
                id="task-priority"
                name="priority"
                className="form-input form-select"
                value={form.priority}
                onChange={handleChange}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-due">
              Due Date
            </label>
            <input
              id="task-due"
              name="dueDate"
              className="form-input"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
