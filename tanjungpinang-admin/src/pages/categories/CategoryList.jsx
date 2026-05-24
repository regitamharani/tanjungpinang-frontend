import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Modal from '../../components/ui/Modal'
function CategoryForm({ initial, onClose }) {
  const { addCategory, updateCategory } = useApp()
  const [form, setForm] = useState(initial || { name: '', icon: '📍', description: '', status: 'active' })
  const [errors, setErrors] = useState({})
  const ICONS = ['🏛️', '🏖️', '🍽️', '🕌', '🌿', '🎭', '🏔️', '⛵', '🦋', '🎨', '🏰', '🌊', '🎋', '🌴', '🗿', '🎪']
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = {}
    if (!form.name.trim()) e2.name = 'Name required'
    if (Object.keys(e2).length) { setErrors(e2); return }
    if (initial) updateCategory(initial.id, form)
    else addCategory(form)
    onClose()
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Category Name *</label>
        <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Historical Tourism" id="input-cat-name" />
        {errors.name && <span className="hint" style={{ color: 'var(--color-danger)' }}>{errors.name}</span>}
      </div>
      <div className="form-group">
        <label className="form-label">Icon</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          {ICONS.map(icon => (
            <button
              key={icon} type="button"
              onClick={() => set('icon', icon)}
              style={{
                width: 40, height: 40, fontSize: 20, borderRadius: 8, border: '2px solid',
                borderColor: form.icon === icon ? 'var(--color-primary)' : 'var(--color-gray-200)',
                background: form.icon === icon ? '#dbeafe' : 'white', cursor: 'pointer',
              }}
              id={`icon-${icon}`}
            >{icon}</button>
          ))}
        </div>
        <p className="hint">Selected: {form.icon}</p>
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe this category..." rows={2} id="input-cat-desc" />
      </div>
      <div className="form-group">
        <label className="form-label">Status</label>
        <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)} id="input-cat-status">
          <option value="active">Active</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
        <button type="button" className="btn btn-secondary" onClick={onClose} id="btn-cancel-cat">Cancel</button>
        <button type="submit" className="btn btn-primary" id="btn-save-cat">
          {initial ? 'Update Category' : 'Add Category'}
        </button>
      </div>
    </form>
  )
}
export default function CategoryList() {
  const { categories, stats, deleteCategory, toggleCategoryStatus } = useApp()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Category Management</h1>
          <p className="page-subtitle">Manage destination categories</p>
        </div>
        <button className="btn btn-primary" id="btn-add-category" onClick={() => { setEditing(null); setShowForm(true) }}>
          <Plus size={16} /> Add Category
        </button>
      </div>
      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <StatCard label="Total Categories"  value={stats.totalCategories}  icon={<span style={{ fontSize: 22 }}>🏷️</span>} color="primary" />
        <StatCard label="Active Categories" value={stats.activeCategories} icon={<Eye size={20} />}  color="success" />
        <StatCard label="Hidden Categories" value={stats.hiddenCategories} icon={<EyeOff size={20} />} color="danger" />
        <StatCard label="Total Destinations" value={stats.totalDestinations} icon={<span style={{ fontSize: 22 }}>📍</span>} color="indigo" />
      </div>
      {/* Search */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-body" style={{ padding: '14px 20px' }}>
          <div className="search-wrapper" style={{ maxWidth: '100%' }}>
            <Search size={15} className="search-icon" />
            <input className="search-input" placeholder="Search categories..." value={search} onChange={e => setSearch(e.target.value)} id="search-categories" />
          </div>
        </div>
      </div>
      {/* Card Grid */}
      {filtered.length === 0 ? (
        <EmptyState title="No categories found" message="Try a different search or add a new category." />
      ) : (
        <div className="category-grid">
          {filtered.map(cat => (
            <div key={cat.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '20px 20px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, background: 'var(--color-gray-100)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                    {cat.icon}
                  </div>
                  <Badge type={cat.status} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 'var(--font-size-md)', marginBottom: 4 }}>{cat.name}</h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: 12 }}>{cat.description}</p>
                <div style={{ background: 'var(--color-gray-50)', borderRadius: 8, padding: '8px 12px', marginBottom: 16 }}>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: 2 }}>Total Destinations</p>
                  <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-gray-900)' }}>{cat.totalDestinations}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, padding: '12px 20px', borderTop: '1px solid var(--color-gray-100)', background: 'var(--color-gray-50)' }}>
                <button className="btn btn-secondary btn-sm" id={`edit-cat-${cat.id}`} onClick={() => { setEditing(cat); setShowForm(true) }}>
                  <Pencil size={13} /> Edit
                </button>
                <button className="btn btn-secondary btn-sm" id={`toggle-cat-${cat.id}`} onClick={() => toggleCategoryStatus(cat.id)}>
                  {cat.status === 'active' ? <><EyeOff size={13} /> Hide</> : <><Eye size={13} /> Show</>}
                </button>
                <button className="btn btn-ghost btn-sm" id={`delete-cat-${cat.id}`} style={{ color: 'var(--color-danger)', marginLeft: 'auto' }} onClick={() => setConfirmDelete(cat)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showForm && (
        <Modal title={editing ? 'Edit Category' : 'Add New Category'} onClose={() => setShowForm(false)}>
          <CategoryForm initial={editing} onClose={() => setShowForm(false)} />
        </Modal>
      )}
      {confirmDelete && (
        <ConfirmModal
          title="Delete Category?"
          message={`Are you sure you want to delete "${confirmDelete.name}"?`}
          onConfirm={() => { deleteCategory(confirmDelete.id); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}