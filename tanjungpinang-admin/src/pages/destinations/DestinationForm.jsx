import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Upload } from 'lucide-react'
const EMPTY = {
  name: '', categoryId: '', address: '', description: '',
  ticketPrice: '', openingHours: '', mapsLink: '',
  latitude: '', longitude: '', image: '', status: 'active',
}
export default function DestinationForm({ initial, onClose }) {
  const { categories, addDestination, updateDestination } = useApp()
  const [form, setForm] = useState(initial ? {
    name: initial.name, categoryId: initial.categoryId, address: initial.address,
    description: initial.description, ticketPrice: initial.ticketPrice,
    openingHours: initial.openingHours, mapsLink: initial.mapsLink,
    latitude: initial.latitude, longitude: initial.longitude,
    image: initial.image, status: initial.status,
  } : EMPTY)
  const [preview, setPreview] = useState(initial?.image || '')
  const [errors, setErrors] = useState({})
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const validate = () => {
    const e = {}
    if (!form.name.trim())        e.name = 'Name is required'
    if (!form.categoryId)         e.categoryId = 'Category is required'
    if (!form.address.trim())     e.address = 'Address is required'
    if (!form.description.trim()) e.description = 'Description is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      set('image', url)
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const data = { ...form, categoryId: Number(form.categoryId) }
    if (initial) updateDestination(initial.id, data)
    else addDestination(data)
    onClose()
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Destination Name *</label>
          <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Pulau Penyengat" id="input-dest-name" />
          {errors.name && <span className="hint" style={{ color: 'var(--color-danger)' }}>{errors.name}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select className="form-select" value={form.categoryId} onChange={e => set('categoryId', e.target.value)} id="input-dest-category">
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.categoryId && <span className="hint" style={{ color: 'var(--color-danger)' }}>{errors.categoryId}</span>}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Address *</label>
        <input className="form-input" value={form.address} onChange={e => set('address', e.target.value)} placeholder="e.g. Penyengat Island, Tanjung Pinang" id="input-dest-address" />
        {errors.address && <span className="hint" style={{ color: 'var(--color-danger)' }}>{errors.address}</span>}
      </div>
      <div className="form-group">
        <label className="form-label">Description *</label>
        <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe this destination..." rows={3} id="input-dest-desc" />
        {errors.description && <span className="hint" style={{ color: 'var(--color-danger)' }}>{errors.description}</span>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Ticket Price</label>
          <input className="form-input" value={form.ticketPrice} onChange={e => set('ticketPrice', e.target.value)} placeholder="e.g. Rp 5.000 or Free" id="input-dest-price" />
        </div>
        <div className="form-group">
          <label className="form-label">Opening Hours</label>
          <input className="form-input" value={form.openingHours} onChange={e => set('openingHours', e.target.value)} placeholder="e.g. 08:00 - 17:00" id="input-dest-hours" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Google Maps Link</label>
        <input className="form-input" value={form.mapsLink} onChange={e => set('mapsLink', e.target.value)} placeholder="https://maps.google.com/..." id="input-dest-maps" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Latitude</label>
          <input className="form-input" value={form.latitude} onChange={e => set('latitude', e.target.value)} placeholder="e.g. 0.9213" id="input-dest-lat" />
        </div>
        <div className="form-group">
          <label className="form-label">Longitude</label>
          <input className="form-input" value={form.longitude} onChange={e => set('longitude', e.target.value)} placeholder="e.g. 104.4624" id="input-dest-lng" />
        </div>
      </div>
      {/* Image Upload */}
      <div className="form-group">
        <label className="form-label">Main Image</label>
        {preview ? (
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <img src={preview} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10 }} />
            <button type="button" className="btn btn-secondary btn-sm" style={{ position: 'absolute', top: 8, right: 8 }} onClick={() => { setPreview(''); set('image', '') }}>
              Remove
            </button>
          </div>
        ) : (
          <label className="upload-zone" htmlFor="dest-image-upload">
            <input type="file" id="dest-image-upload" accept="image/*" onChange={handleImageChange} />
            <Upload size={24} color="var(--color-gray-400)" style={{ margin: '0 auto 8px' }} />
            <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>Click to upload main image</p>
            <p className="hint">JPG, PNG up to 5MB</p>
          </label>
        )}
        <p className="hint">Or paste an image URL:</p>
        <input className="form-input" value={form.image} onChange={e => { set('image', e.target.value); setPreview(e.target.value) }} placeholder="https://..." id="input-dest-image-url" />
      </div>
      <div className="form-group">
        <label className="form-label">Status</label>
        <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)} id="input-dest-status">
          <option value="active">Active</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
        <button type="button" className="btn btn-secondary" onClick={onClose} id="btn-cancel-dest">Cancel</button>
        <button type="submit" className="btn btn-primary" id="btn-save-dest">
          {initial ? 'Update Destination' : 'Add Destination'}
        </button>
      </div>
    </form>
  )
}