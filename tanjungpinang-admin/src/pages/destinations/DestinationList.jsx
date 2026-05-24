import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Plus, Search, Eye, Pencil, Trash2, Clock, Bookmark, DollarSign } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Modal from '../../components/ui/Modal'
import DestinationForm from './DestinationForm'
import DestinationDetail from './DestinationDetail'
export default function DestinationList() {
  const { destinations, categories, deleteDestination, toggleDestinationStatus } = useApp()
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const getCatName = (id) => categories.find(c => c.id === id)?.name || '—'
  const filtered = destinations.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                        d.address.toLowerCase().includes(search.toLowerCase())
    const matchCat    = !filterCat    || d.categoryId === Number(filterCat)
    const matchStatus = !filterStatus || d.status === filterStatus
    return matchSearch && matchCat && matchStatus
  })
  const handleDelete = () => {
    deleteDestination(confirmDelete.id)
    setConfirmDelete(null)
  }
  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Destination Management</h1>
          <p className="page-subtitle">Manage all tourism destinations</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" id="btn-add-destination" onClick={() => { setEditing(null); setShowForm(true) }}>
            <Plus size={16} /> Add Destination
          </button>
        </div>
      </div>
      {/* Toolbar */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-body" style={{ padding: '14px 20px' }}>
          <div className="toolbar">
            <div className="search-wrapper">
              <Search size={15} className="search-icon" />
              <input
                className="search-input"
                placeholder="Search destinations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                id="search-destinations"
              />
            </div>
            <select className="filter-select" value={filterCat} onChange={e => setFilterCat(e.target.value)} id="filter-category">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} id="filter-status">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--color-gray-100)' }}>
            <p className="result-count" style={{ marginBottom: 0 }}>
              Showing <strong>{filtered.length}</strong> of <strong>{destinations.length}</strong> destinations
            </p>
          </div>
          {filtered.length === 0 ? (
            <EmptyState title="No destinations found" message="Try adjusting your search filters or add a new destination." />
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Destination</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Opening Hours</th>
                    <th>Bookmarks</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(dest => (
                    <tr key={dest.id}>
                      <td>
                        <div className="dest-cell">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="thumbnail"
                            onError={e => { e.target.src = `https://picsum.photos/seed/${dest.id}/80/60` }}
                          />
                          <div className="dest-info">
                            <h4>{dest.name}</h4>
                            <p>{dest.address}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          background: '#dbeafe', color: '#1d4ed8',
                          padding: '2px 10px', borderRadius: '999px',
                          fontSize: 'var(--font-size-xs)', fontWeight: 500
                        }}>
                          {getCatName(dest.categoryId)}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--font-size-xs)' }}>
                          <DollarSign size={12} color="var(--color-gray-400)" />
                          {dest.ticketPrice}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-600)' }}>
                          <Clock size={12} color="var(--color-gray-400)" />
                          {dest.openingHours}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                          <Bookmark size={13} color="#f59e0b" />
                          {dest.bookmarks.toLocaleString()}
                        </span>
                      </td>
                      <td><Badge type={dest.status} /></td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="btn btn-ghost btn-icon"
                            title="View"
                            id={`view-dest-${dest.id}`}
                            onClick={() => setViewing(dest)}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="btn btn-ghost btn-icon"
                            title="Edit"
                            id={`edit-dest-${dest.id}`}
                            onClick={() => { setEditing(dest); setShowForm(true) }}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="btn btn-ghost btn-icon"
                            title={dest.status === 'active' ? 'Hide' : 'Show'}
                            id={`toggle-dest-${dest.id}`}
                            onClick={() => toggleDestinationStatus(dest.id)}
                            style={{ color: dest.status === 'active' ? 'var(--color-warning)' : 'var(--color-success)' }}
                          >
                            {dest.status === 'active' ? <Eye size={15} /> : <Eye size={15} />}
                          </button>
                          <button
                            className="btn btn-ghost btn-icon"
                            title="Delete"
                            id={`delete-dest-${dest.id}`}
                            onClick={() => setConfirmDelete(dest)}
                            style={{ color: 'var(--color-danger)' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Form Modal */}
      {showForm && (
        <Modal
          title={editing ? 'Edit Destination' : 'Add New Destination'}
          onClose={() => setShowForm(false)}
          size="lg"
        >
          <DestinationForm
            initial={editing}
            onClose={() => setShowForm(false)}
          />
        </Modal>
      )}
      {/* Detail Modal */}
      {viewing && (
        <Modal title="Destination Detail" onClose={() => setViewing(null)} size="lg">
          <DestinationDetail dest={viewing} />
        </Modal>
      )}
      {/* Delete Confirm */}
      {confirmDelete && (
        <ConfirmModal
          title="Delete Destination?"
          message={`Are you sure you want to delete "${confirmDelete.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}