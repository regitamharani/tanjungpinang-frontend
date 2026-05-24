import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import {
  Plus,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Pencil,
  GripVertical,
  Search,
} from 'lucide-react'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Modal from '../../components/ui/Modal'

function FeaturedForm({ initial, onClose }) {
  const { destinations, addFeatured, updateFeatured } = useApp()

  const [form, setForm] = useState(
    initial
      ? {
          destinationId: initial.destinationId,
          image: initial.image || '',
          status: initial.status,
          startDate: initial.startDate,
          endDate: initial.endDate,
        }
      : {
          destinationId: '',
          image: '',
          status: 'active',
          startDate: '',
          endDate: '',
        }
  )

  const [preview, setPreview] = useState(initial?.image || '')

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.destinationId) return

    const data = {
      ...form,
      destinationId: Number(form.destinationId),
    }

    if (initial) updateFeatured(initial.id, data)
    else addFeatured(data)

    onClose()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Destination *</label>
        <select
          className="form-select"
          value={form.destinationId}
          onChange={(e) => set('destinationId', e.target.value)}
        >
          <option value="">Select destination</option>
          {destinations.map((destination) => (
            <option key={destination.id} value={destination.id}>
              {destination.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Featured Image URL</label>
        <input
          className="form-input"
          value={form.image}
          onChange={(e) => {
            set('image', e.target.value)
            setPreview(e.target.value)
          }}
          placeholder="https://..."
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="featured-form-preview"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-input"
            value={form.startDate}
            onChange={(e) => set('startDate', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-input"
            value={form.endDate}
            onChange={(e) => set('endDate', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={form.status}
          onChange={(e) => set('status', e.target.value)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="featured-form-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initial ? 'Update' : 'Add Featured Destination'}
        </button>
      </div>
    </form>
  )
}

export default function FeaturedList() {
  const {
    featured,
    destinations,
    removeFeatured,
    toggleFeaturedStatus,
  } = useApp()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [search, setSearch] = useState('')

  const sorted = [...featured].sort((a, b) => a.order - b.order)

  const getDestination = (id) => {
    return destinations.find((destination) => destination.id === id)
  }

  const rows = sorted
    .map((item) => ({
      ...item,
      destination: getDestination(item.destinationId),
    }))
    .filter((item) => item.destination)
    .filter((item) =>
      item.destination.name.toLowerCase().includes(search.toLowerCase())
    )

  const activeCount = sorted.filter((item) => item.status === 'active').length
  const inactiveCount = sorted.filter((item) => item.status !== 'active').length

  const averageDuration = (() => {
    const durations = sorted
      .map((item) => {
        if (!item.startDate || !item.endDate) return null
        const start = new Date(item.startDate)
        const end = new Date(item.endDate)
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      })
      .filter((day) => day && day > 0)

    if (!durations.length) return 0

    return Math.round(
      durations.reduce((total, day) => total + day, 0) / durations.length
    )
  })()

  return (
    <div className="featured-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Featured Destinations</h1>
          <p className="page-subtitle">Manage homepage recommendations</p>
        </div>

        <button
          className="btn btn-primary featured-add-button"
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
        >
          <Plus size={18} />
          Add Featured Destination
        </button>
      </div>

      <div className="featured-hero">
        <div className="featured-hero-small">
          <Star size={18} />
          Homepage Preview
        </div>
        <h2>Featured Destinations</h2>
        <p>
          These destinations will appear in the recommended section on the
          mobile app homepage. Drag to reorder their display position.
        </p>
      </div>

      <div className="featured-stats">
        <div className="featured-stat-card">
          <p>Total Featured</p>
          <h3>{sorted.length}</h3>
        </div>

        <div className="featured-stat-card">
          <p>Active</p>
          <h3 className="text-success">{activeCount}</h3>
        </div>

        <div className="featured-stat-card">
          <p>Inactive</p>
          <h3 className="text-danger">{inactiveCount}</h3>
        </div>

        <div className="featured-stat-card">
          <p>Avg. Duration</p>
          <h3 className="text-primary">{averageDuration} days</h3>
        </div>
      </div>

      <div className="featured-search-card">
        <div className="featured-search">
          <Search size={20} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search featured destinations..."
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No featured destinations"
          message="Add destinations to the featured list to show them on the app homepage."
          action={
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={16} /> Add Featured
            </button>
          }
        />
      ) : (
        <div className="featured-table-card">
          <table className="featured-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Destination</th>
                <th>Category</th>
                <th>Display Period</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((item) => {
                const destination = item.destination

                return (
                  <tr key={item.id}>
                    <td>
                      <div className="featured-order">
                        <GripVertical size={18} />
                        <span>{item.order}</span>
                      </div>
                    </td>

                    <td>
                      <div className="featured-destination">
                        <img
                          src={item.image || destination.image}
                          alt={destination.name}
                          onError={(e) => {
                            e.currentTarget.src = `https://picsum.photos/seed/${destination.id}/120/90`
                          }}
                        />
                        <strong>{destination.name}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="featured-category">
                        {destination.category || 'Tourism'}
                      </span>
                    </td>

                    <td>
                      <div className="featured-period">
                        <span>{item.startDate || '-'}</span>
                        <span>to</span>
                        <span>{item.endDate || '-'}</span>
                      </div>
                    </td>

                    <td>
                      <Badge type={item.status} />
                    </td>

                    <td>
                      <div className="featured-actions">
                        <button
                          className="icon-btn warning"
                          title={
                            item.status === 'active'
                              ? 'Deactivate'
                              : 'Activate'
                          }
                          onClick={() => toggleFeaturedStatus(item.id)}
                        >
                          {item.status === 'active' ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>

                        <button
                          className="icon-btn"
                          title="Edit"
                          onClick={() => {
                            setEditing(item)
                            setShowForm(true)
                          }}
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          className="icon-btn danger"
                          title="Delete"
                          onClick={() => setConfirmDelete(item)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <Modal
          title={editing ? 'Edit Featured Destination' : 'Add Featured Destination'}
          onClose={() => setShowForm(false)}
        >
          <FeaturedForm initial={editing} onClose={() => setShowForm(false)} />
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Remove from Featured?"
          message="This destination will be removed from the featured list."
          onConfirm={() => {
            removeFeatured(confirmDelete.id)
            setConfirmDelete(null)
          }}
          onCancel={() => setConfirmDelete(null)}
          confirmLabel="Remove"
        />
      )}
    </div>
  )
}