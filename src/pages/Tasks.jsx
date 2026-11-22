import { useState, useMemo } from 'react';
import { Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import TaskCard from '../components/TaskCard.jsx';
import TaskForm from '../components/TaskForm.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { filterTasks } from '../utils/taskHelpers.js';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
];

export default function Tasks({
  tasks,
  categories,
  addTask,
  updateTask,
  deleteTask,
  toggleComplete,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [priority, setPriority] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const filtered = useMemo(
    () => filterTasks(tasks, { search, status, category, priority, sortBy, sortOrder }),
    [tasks, search, status, category, priority, sortBy, sortOrder]
  );

  const hasActiveFilters =
    search || status !== 'all' || category !== 'all' || priority !== 'all';

  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    setCategory('all');
    setPriority('all');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const handleAdd = (fields) => {
    addTask(fields);
    setShowForm(false);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleEditSubmit = (fields) => {
    updateTask(editingTask.id, fields);
    setShowForm(false);
    setEditingTask(null);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="page">
      {/* Toolbar */}
      <div className="tasks-toolbar">
        {/* Search */}
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            className="search-input"
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="toolbar-actions">
          <button
            className={`btn btn-secondary btn-sm ${showFilters ? 'btn-secondary--active' : ''}`}
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal size={15} />
            Filters
            {hasActiveFilters && <span className="filter-dot" />}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
            <Plus size={15} /> New Task
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="filter-panel card">
          <div className="filter-panel-header">
            <span className="filter-panel-title">Filter &amp; Sort</span>
            {hasActiveFilters && (
              <button className="btn btn-ghost btn-xs" onClick={clearFilters}>
                Clear all
              </button>
            )}
          </div>
          <div className="filter-grid">
            {/* Status */}
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <div className="filter-chips">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`chip ${status === opt.value ? 'chip--active' : ''}`}
                    onClick={() => setStatus(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <div className="filter-chips">
                <button
                  className={`chip ${category === 'all' ? 'chip--active' : ''}`}
                  onClick={() => setCategory('all')}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`chip ${category === cat ? 'chip--active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="filter-group">
              <label className="filter-label">Priority</label>
              <div className="filter-chips">
                {[{ value: 'all', label: 'All' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }].map(
                  (opt) => (
                    <button
                      key={opt.value}
                      className={`chip ${priority === opt.value ? 'chip--active' : ''}`}
                      onClick={() => setPriority(opt.value)}
                    >
                      {opt.label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Sort */}
            <div className="filter-group">
              <label className="filter-label">Sort by</label>
              <div className="filter-row">
                <select
                  className="form-input form-select filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <button
                  className={`chip ${sortOrder === 'desc' ? 'chip--active' : ''}`}
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                >
                  {sortOrder === 'desc' ? '↓ Newest' : '↑ Oldest'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results info */}
      {tasks.length > 0 && (
        <div className="results-info">
          <span>
            Showing <strong>{filtered.length}</strong> of <strong>{tasks.length}</strong> tasks
          </span>
        </div>
      )}

      {/* Task list */}
      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Click 'New Task' to create your first task."
          action={{ label: 'Create Task', onClick: () => setShowForm(true) }}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No results"
          description="No tasks match your current filters."
          action={{ label: 'Clear Filters', onClick: clearFilters }}
        />
      ) : (
        <div className="task-list">
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleComplete}
              onEdit={handleEdit}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}

      {showForm && (
        <TaskForm
          onSubmit={editingTask ? handleEditSubmit : handleAdd}
          onClose={handleClose}
          initialData={editingTask}
          categories={categories}
        />
      )}
    </div>
  );
}
