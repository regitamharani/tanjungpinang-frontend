export default function Badge({ type }) {
  const map = {
    active:    { cls: 'badge-active',    label: 'Active' },
    hidden:    { cls: 'badge-hidden',    label: 'Hidden' },
    suspended: { cls: 'badge-suspended', label: 'Suspended' },
    main:      { cls: 'badge-main',      label: 'Main Image' },
    gallery:   { cls: 'badge-gallery',   label: 'Gallery Image' },
    featured:  { cls: 'badge-featured',  label: 'Featured' },
    inactive:  { cls: 'badge-inactive',  label: 'Inactive' },
  }
  const { cls, label } = map[type] || map['hidden']
  return (
    <span className={`badge ${cls}`}>
      <span className="badge-dot" />
      {label}
    </span>
  )
}