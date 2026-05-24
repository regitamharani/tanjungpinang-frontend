import { useApp } from '../../context/AppContext'
import Badge from '../../components/ui/Badge'
import { MapPin, Clock, DollarSign, Link, Navigation } from 'lucide-react'
export default function DestinationDetail({ dest }) {
  const { categories } = useApp()
  const catName = categories.find(c => c.id === dest.categoryId)?.name || '—'
  return (
    <div>
      {dest.image && (
        <img
          src={dest.image}
          alt={dest.name}
          style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 12, marginBottom: 20 }}
          onError={e => { e.target.style.display = 'none' }}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-gray-900)' }}>{dest.name}</h2>
        <Badge type={dest.status} />
      </div>
      <div className="detail-grid" style={{ marginBottom: 20 }}>
        <div className="detail-field">
          <label>Category</label>
          <p style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{catName}</p>
        </div>
        <div className="detail-field">
          <label>Bookmarks</label>
          <p style={{ fontWeight: 600 }}>🔖 {dest.bookmarks.toLocaleString()}</p>
        </div>
        <div className="detail-field">
          <label><MapPin size={12} style={{ display: 'inline' }} /> Address</label>
          <p>{dest.address}</p>
        </div>
        <div className="detail-field">
          <label><DollarSign size={12} style={{ display: 'inline' }} /> Ticket Price</label>
          <p>{dest.ticketPrice}</p>
        </div>
        <div className="detail-field">
          <label><Clock size={12} style={{ display: 'inline' }} /> Opening Hours</label>
          <p>{dest.openingHours}</p>
        </div>
        <div className="detail-field">
          <label><Navigation size={12} style={{ display: 'inline' }} /> Coordinates</label>
          <p>{dest.latitude}, {dest.longitude}</p>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label className="form-label" style={{ display: 'block', marginBottom: 6 }}>Description</label>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.7 }}>{dest.description}</p>
      </div>
      {dest.mapsLink && (
        <a href={dest.mapsLink} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" id={`maps-link-${dest.id}`}>
          <Link size={14} /> Open in Google Maps
        </a>
      )}
      {dest.gallery?.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <label className="form-label" style={{ display: 'block', marginBottom: 10 }}>Gallery ({dest.gallery.length} images)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
            {dest.gallery.map((img, i) => (
              <img key={i} src={img} alt={`gallery-${i}`} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 8 }} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}