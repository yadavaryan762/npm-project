export default function StatCard({ icon: Icon, label, value, colorClass, description }) {
  return (
    <div className={`stat-card ${colorClass || ''}`}>
      <div className="stat-card-header">
        <div className="stat-card-icon">
          <Icon size={20} />
        </div>
        <span className="stat-card-label">{label}</span>
      </div>
      <div className="stat-card-value">{value}</div>
      {description && <p className="stat-card-desc">{description}</p>}
    </div>
  );
}
