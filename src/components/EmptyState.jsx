import { ClipboardList } from 'lucide-react';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <ClipboardList size={48} strokeWidth={1.2} />
      </div>
      <h3 className="empty-state-title">{title || 'Nothing here yet'}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {action && (
        <button className="btn btn-primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
