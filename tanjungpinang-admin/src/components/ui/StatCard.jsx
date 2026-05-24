import './StatCard.css'
export default function StatCard({ label, value, sub, icon, color = 'primary', trend }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card-body">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value?.toLocaleString()}</div>
        {sub && <div className="stat-sub">{sub}</div>}
        {trend && (
          <div className={`stat-trend ${trend > 0 ? 'stat-trend--up' : 'stat-trend--down'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)} this week
          </div>
        )}
      </div>
      <div className="stat-icon-wrap">
        {icon}
      </div>
    </div>
  )
}