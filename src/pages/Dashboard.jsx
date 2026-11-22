import { useState, useMemo } from 'react';
import {
  CheckCircle2,
  ListTodo,
  Clock,
  AlertTriangle,
  TrendingUp,
  Plus,
  ArrowRight,
} from 'lucide-react';
import StatCard from '../components/StatCard.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskForm from '../components/TaskForm.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { computeStats } from '../utils/taskHelpers.js';

export default function Dashboard({
  tasks,
  categories,
  addTask,
  updateTask,
  deleteTask,
  toggleComplete,
  onNavigate,
}) {
  const [showForm, setShowForm] = useState(false);

  const stats = useMemo(() => computeStats(tasks), [tasks]);

  // Recent 5 tasks (newest first)
  const recentTasks = useMemo(
    () => [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [tasks]
  );

  const handleAdd = (fields) => {
    addTask(fields);
    setShowForm(false);
  };

  const handleEdit = (task) => {
    // On dashboard, navigate to tasks for editing
    onNavigate('tasks');
  };

  return (
    <div className="page">
      {/* Stats grid */}
      <section className="stats-grid">
        <StatCard
          icon={ListTodo}
          label="Total Tasks"
          value={stats.total}
          colorClass="stat-card--blue"
          description="All tasks created"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completed}
          colorClass="stat-card--green"
          description="Tasks finished"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={stats.pending}
          colorClass="stat-card--amber"
          description="Tasks in progress"
        />
        <StatCard
          icon={AlertTriangle}
          label="Overdue"
          value={stats.overdue}
          colorClass="stat-card--red"
          description="Past due date"
        />
      </section>

      {/* Progress bar */}
      <section className="progress-section card">
        <div className="progress-header">
          <div className="progress-title-row">
            <TrendingUp size={18} />
            <h2 className="section-title">Completion Rate</h2>
          </div>
          <span className="progress-pct">{stats.completionRate}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
        <p className="progress-desc">
          {stats.completed} of {stats.total} tasks completed
        </p>
      </section>

      {/* Recent tasks */}
      <section className="recent-section">
        <div className="section-header">
          <h2 className="section-title">Recent Tasks</h2>
          <div className="section-header-actions">
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
              <Plus size={15} /> New Task
            </button>
            {tasks.length > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('tasks')}>
                View all <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description="Create your first task to get started with TaskFlow."
            action={{ label: 'Create Task', onClick: () => setShowForm(true) }}
          />
        ) : (
          <div className="task-list">
            {recentTasks.map((task) => (
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
      </section>

      {showForm && (
        <TaskForm
          onSubmit={handleAdd}
          onClose={() => setShowForm(false)}
          categories={categories}
        />
      )}
    </div>
  );
}
