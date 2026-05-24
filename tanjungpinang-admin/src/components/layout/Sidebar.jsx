import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, MapPin, Users, Tag, Image,
  Bookmark, Star, ChevronDown, LogOut, Settings,
  Bell, MapPinned
} from 'lucide-react'
import './Sidebar.css'
const NAV = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/destinations', icon: <MapPin size={18} />, label: 'Destinations' },
  { to: '/users', icon: <Users size={18} />, label: 'Users' },
  { to: '/categories', icon: <Tag size={18} />, label: 'Categories' },
  { to: '/gallery', icon: <Image size={18} />, label: 'Gallery' },
  { to: '/bookmarks', icon: <Bookmark size={18} />, label: 'Bookmark Analytics' },
  { to: '/featured', icon: <Star size={18} />, label: 'Featured' },
]
export default function Sidebar() {
  const location = useLocation()
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <MapPinned size={20} />
        </div>
        <div className="brand-text">
          <span className="brand-name">Tanjung Pinang</span>
          <span className="brand-sub">Admin Dashboard</span>
        </div>
      </div>
      {/* Nav */}
      <nav className="sidebar-nav">
        <span className="nav-section-label">Main Menu</span>
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      {/* Footer */}
      <div className="sidebar-footer">
        <div className="admin-card">
          <div className="admin-avatar">AD</div>
          <div className="admin-info">
            <span className="admin-name">Admin User</span>
            <span className="admin-email">admin@tanjungpinang.id</span>
          </div>
        </div>
      </div>
    </aside>
  )
}