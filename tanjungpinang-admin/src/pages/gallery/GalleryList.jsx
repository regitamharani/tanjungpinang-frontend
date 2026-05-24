import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Upload, Search, Trash2, Star, Eye, EyeOff, Image as ImageIcon } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Modal from '../../components/ui/Modal'
function UploadForm({ onClose }) {
  const { destinations, addGalleryImage } = useApp()
  const [form, setForm] = useState({ title: '', destinationId: '', type: 'gallery', image: '' })
  const [preview, setPreview] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) { const url = URL.createObjectURL(file); setPreview(url); set('image', url) }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.destinationId || !form.image) return
    addGalleryImage({ ...form, destinationId: Number(form.destinationId) })
    onClose()
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Image Title *</label>
        <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Pulau Penyengat Main View" id="input-gallery-title" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Related Destination *</label>
          <select className="form-select" value={form.destinationId} onChange={e => set('destinationId', e.target.value)} id="input-gallery-dest">
            <option value="">Select destination</option>
            {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Image Type</label>
          <select className="form-select" value={form.type} onChange={e => set('type', e.target.value)} id="input-gallery-type">
            <option value="main">Main Image</option>
            <option value="gallery">Gallery Image</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Image *</label>
        {preview ? (
          <div style={{ marginBottom: 8 }}>
            <img src={preview} alt="preview" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 10 }} />
            <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={() => { setPreview(''); set('image', '') }}>Remove</button>
          </div>
        ) : (
          <label className="upload-zone" htmlFor="gallery-image-upload">
            <input type="file" id="gallery-image-upload" accept="image/*" onChange={handleFile} />
            <Upload size={24} color="var(--color-gray-400)" style={{ margin: '0 auto 8px' }} />
            <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>Click to upload image</p>
          </label>
        )}
        <p className="hint" style={{ marginTop: 4 }}>Or paste a URL:</p>
        <input className="form-input" value={form.image} onChange={e => { set('image', e.target.value); setPreview(e.target.value) }} placeholder="https://..." id="input-gallery-url" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
        <button type="button" className="btn btn-secondary" onClick={onClose} id="btn-cancel-gallery">Cancel</button>
        <button type="submit" className="btn btn-primary" id="btn-save-gallery">Upload Image</button>
      </div>
    </form>
  )
}
export default function GalleryList() {
  const { gallery, destinations, stats, deleteGalleryImage, setMainImage, toggleGalleryStatus } = useApp()
  const [search, setSearch] = useState('')
  const [filterDest, setFilterDest] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [viewing, setViewing] = useState(null)
  const getDestName = (id) => destinations.find(d => d.id === id)?.name || '—'
  const filtered = gallery.filter(g => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase())
    const matchDest   = !filterDest || g.destinationId === Number(filterDest)
    return matchSearch && matchDest
  })
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gallery Management</h1>
          <p className="page-subtitle">Manage destination images</p>
        </div>
        <button className="btn btn-primary" id="btn-upload-image" onClick={() => setShowUpload(true)}>
          <Upload size={16} /> Upload Images
        </button>
      </div>
      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <StatCard label="Total Images"   value={stats.totalImages}   icon={<ImageIcon size={20} />}    color="primary" />
        <StatCard label="Main Images"    value={stats.mainImages}    icon={<Star size={20} />}         color="warning" />
        <StatCard label="Gallery Images" value={stats.galleryImages} icon={<ImageIcon size={20} />}   color="purple" />
        <StatCard label="Active Images"  value={stats.activeImages}  icon={<Eye size={20} />}         color="success" />
      </div>
      {/* Toolbar */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-body" style={{ padding: '14px 20px' }}>
          <div className="toolbar">
            <div className="search-wrapper">
              <Search size={15} className="search-icon" />
              <input className="search-input" placeholder="Search images..." value={search} onChange={e => setSearch(e.target.value)} id="search-gallery" />
            </div>
            <select className="filter-select" value={filterDest} onChange={e => setFilterDest(e.target.value)} id="filter-gallery-dest">
              <option value="">All Destinations</option>
              {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>
      </div>
      {/* Result count */}
      <p className="result-count">Showing <strong>{filtered.length}</strong> of <strong>{gallery.length}</strong> images</p>
      {filtered.length === 0 ? (
        <EmptyState title="No images found" message="Upload images or adjust your filters." />
      ) : (
        <div className="gallery-grid">
          {filtered.map(img => (
            <div key={img.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Image */}
              <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--color-gray-100)' }}>
                <img
                  src={img.image}
                  alt={img.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease', cursor: 'pointer' }}
                  onClick={() => setViewing(img)}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  onError={e => { e.target.src = `https://picsum.photos/seed/${img.id + 100}/400/300` }}
                  id={`gallery-img-${img.id}`}
                />
                {img.type === 'main' && (
                  <div style={{ position: 'absolute', top: 8, right: 8, background: '#f59e0b', color: 'white', borderRadius: 8, padding: '2px 6px', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Star size={11} /> Main
                  </div>
                )}
              </div>
              {/* Info */}
              <div style={{ padding: '12px 14px' }}>
                <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 2 }}>{img.title}</h4>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: 8 }}>{getDestName(img.destinationId)}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Badge type={img.type} />
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)' }}>{img.uploadDate}</span>
                </div>
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, padding: '10px 14px', borderTop: '1px solid var(--color-gray-100)', background: 'var(--color-gray-50)' }}>
                <button className="btn btn-secondary btn-sm" id={`view-img-${img.id}`} onClick={() => setViewing(img)}>
                  <Eye size={13} /> View
                </button>
                {img.type !== 'main' && (
                  <button className="btn btn-secondary btn-sm" id={`main-img-${img.id}`} onClick={() => setMainImage(img.id)}>
                    <Star size={13} /> Set Main
                  </button>
                )}
                <button className="btn btn-ghost btn-sm" id={`delete-img-${img.id}`} style={{ color: 'var(--color-danger)', marginLeft: 'auto' }} onClick={() => setConfirmDelete(img)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Upload Modal */}
      {showUpload && (
        <Modal title="Upload Image" onClose={() => setShowUpload(false)}>
          <UploadForm onClose={() => setShowUpload(false)} />
        </Modal>
      )}
      {/* View Modal */}
      {viewing && (
        <Modal title={viewing.title} onClose={() => setViewing(null)} size="lg">
          <img src={viewing.image} alt={viewing.title} style={{ width: '100%', borderRadius: 10, marginBottom: 16 }} />
          <div className="detail-grid">
            <div className="detail-field"><label>Destination</label><p>{getDestName(viewing.destinationId)}</p></div>
            <div className="detail-field"><label>Type</label><Badge type={viewing.type} /></div>
            <div className="detail-field"><label>Upload Date</label><p>{viewing.uploadDate}</p></div>
            <div className="detail-field"><label>Status</label><Badge type={viewing.status} /></div>
          </div>
        </Modal>
      )}
      {/* Delete Confirm */}
      {confirmDelete && (
        <ConfirmModal
          title="Delete Image?"
          message={`Delete "${confirmDelete.title}"? This cannot be undone.`}
          onConfirm={() => { deleteGalleryImage(confirmDelete.id); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}