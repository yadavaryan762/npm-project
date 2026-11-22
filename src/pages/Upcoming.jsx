import { useMemo } from 'react';
import { CalendarClock, AlertTriangle, Calendar } from 'lucide-react';
import TaskCard from '../components/TaskCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { getUpcomingTasks, getOverdueTasks, formatDate } from '../utils/taskHelpers.js';

export default function Upcoming({ tasks, toggleComplete, updateTask, deleteTask }) {
  const upcomingTasks = useMemo(() => getUpcomingTasks(tasks), [tasks]);
  const overdueTasks = useMemo(() => getOverdueTasks(tasks), [tasks]);

  // Group upcoming tasks by date
  const groupedUpcoming = useMemo(() => {
    const groups = {};
    upcomingTasks.forEach((task) => {
      const dateKey = task.dueDate;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(task);
    });
    return groups;
  }, [upcomingTasks]);

  const groupDates = Object.keys(groupedUpcoming).sort();

  const getDayLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div className="page">
      {/* Overdue section */}
      {overdueTasks.length > 0 && (
        <section className="upcoming-section">
          <div className="upcoming-section-header upcoming-section-header--overdue">
            <AlertTriangle size={18} />
            <h2 className="section-title">Overdue ({overdueTasks.length})</h2>
          </div>
          <div className="task-list">
            {overdueTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleComplete}
                onEdit={() => {}}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming by date */}
      {upcomingTasks.length > 0 ? (
        <section className="upcoming-section">
          <div className="upcoming-section-header">
            <CalendarClock size={18} />
            <h2 className="section-title">Next 7 Days ({upcomingTasks.length})</h2>
          </div>
          {groupDates.map((date) => (
            <div key={date} className="upcoming-date-group">
              <div className="upcoming-date-label">
                <Calendar size={14} />
                <span>{getDayLabel(date)}</span>
                <span className="upcoming-date-full">{formatDate(date)}</span>
              </div>
              <div className="task-list">
                {groupedUpcoming[date].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={toggleComplete}
                    onEdit={() => {}}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : (
        overdueTasks.length === 0 && (
          <EmptyState
            title="No upcoming tasks"
            description="Tasks with due dates in the next 7 days will appear here."
          />
        )
      )}

      {overdueTasks.length === 0 && upcomingTasks.length === 0 && tasks.length > 0 && (
        <div className="upcoming-hint card">
          <CalendarClock size={24} />
          <div>
            <strong>Tip:</strong> Set due dates on your tasks to see them here!
          </div>
        </div>
      )}
    </div>
  );
}
