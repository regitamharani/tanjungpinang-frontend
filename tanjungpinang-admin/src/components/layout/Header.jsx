import { useLocation } from 'react-router-dom'
import { Bell, Settings, LogOut } from 'lucide-react'
import './Header.css'
const PAGE_TITLES = {
  '/dashboard':    { title: 'Dashboard',           sub: 'Welcome back! Here\'s what\'s happening.' },
  '/destinations': { title: 'Destination Management', sub: 'Manage all tourism destinations' },
  '/users':        { title: 'User Management',     sub: 'View and manage registered users' },
  '/categories':   { title: 'Category Management', sub: 'Manage destination categories' },
  '/gallery':      { title: 'Gallery Management',  sub: 'Manage destination images' },
  '/bookmarks':    { title: 'Bookmark Analytics',  sub: 'Track popular destinations' },
  '/featured':     { title: 'Featured Destinations', sub: 'Manage homepage recommendations' },
}
export default function Header() {
  const location = useLocation()
  const page = PAGE_TITLES[location.pathname] || { title: 'Dashboard', sub: '' }
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{page.title}</h1>
        <p className="header-sub">{page.sub}</p>
      </div>
      <div className="header-right">
        <button className="header-btn" id="header-notifications" title="Notifications">
          <Bell size={18} />
          <span className="notif-dot" />
        </button>
        <button className="header-btn" id="header-settings" title="Settings">
          <Settings size={18} />
        </button>
        <button className="header-btn header-btn--danger" id="header-logout" title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}