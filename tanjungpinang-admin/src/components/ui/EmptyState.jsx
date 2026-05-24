import { PackageOpen } from 'lucide-react'
export default function EmptyState({ title = 'No data found', message = 'Try adjusting your search or add new items.', action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <PackageOpen size={28} />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action && <div style={{ marginTop: '16px' }}>{action}</div>}
    </div>
  )
}