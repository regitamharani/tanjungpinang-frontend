import { useApp } from '../context/AppContext'
import StatCard from '../components/ui/StatCard'
import {
  MapPin, Users, Tag, Bookmark, Eye, EyeOff,
  TrendingUp, Activity
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts'
import './Dashboard.css'

const ACTIVITY_COLORS = {
  user:        { bg: '#dbeafe', color: '#1d4ed8' },
  destination: { bg: '#dcfce7', color: '#16a34a' },
  gallery:     { bg: '#ede9fe', color: '#7c3aed' },
  featured:    { bg: '#fef3c7', color: '#b45309' },
}

export default function Dashboard() {
  const { stats, destinations, categories, userGrowthData, bookmarkTrend, activity } = useApp()

  const topBookmarks = [...destinations]
    .sort((a, b) => b.bookmarks - a.bookmarks)
    .slice(0, 7)
    .map(d => ({ name: d.name.length > 14 ? d.name.slice(0, 13) + '…' : d.name, bookmarks: d.bookmarks }))

  const catData = categories.map(c => ({
    name: c.name.length > 14 ? c.name.slice(0, 13) + '…' : c.name,
    destinations: c.totalDestinations,
  }))

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <StatCard label="Total Destinations" value={stats.totalDestinations} icon={<MapPin size={22} />} color="primary" trend={12} />
        <StatCard label="Total Users"         value={stats.totalUsers}        icon={<Users size={22} />}   color="success" trend={156} />
        <StatCard label="Categories"          value={stats.totalCategories}   icon={<Tag size={22} />}     color="purple"  trend={2} />
        <StatCard label="Total Bookmarks"     value={stats.totalBookmarks}    icon={<Bookmark size={22} />} color="warning" trend={802} />
        <StatCard label="Active Destinations" value={stats.activeDestinations} icon={<Eye size={22} />}    color="teal"   />
        <StatCard label="Hidden Destinations" value={stats.hiddenDestinations} icon={<EyeOff size={22} />} color="danger" />
      </div>

      <div className="charts-grid" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header">
            <span className="section-title">Most Bookmarked Destinations</span>
            <TrendingUp size={16} color="var(--color-gray-400)" />
          </div>
          <div className="card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topBookmarks} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }} cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="bookmarks" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="section-title">Destinations by Category</span>
            <Tag size={16} color="var(--color-gray-400)" />
          </div>
          <div className="card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catData} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="destinations" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header">
            <span className="section-title">User Registration Growth</span>
            <Users size={16} color="var(--color-gray-400)" />
          </div>
          <div className="card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} />
                  <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2.5} fill="url(#userGrad)" dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="section-title">Bookmark Activity Trend</span>
            <Activity size={16} color="var(--color-gray-400)" />
          </div>
          <div className="card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bookmarkTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bmGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} />
                  <Area type="monotone" dataKey="bookmarks" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#bmGrad)" dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="section-title">Recent Activity</span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)' }}>Live updates</span>
        </div>
        <div className="card-body" style={{ padding: '0 var(--space-6)' }}>
          <div className="activity-list">
            {activity.map(item => {
              const col = ACTIVITY_COLORS[item.type] || ACTIVITY_COLORS.destination
              return (
                <div key={item.id} className="activity-item">
                  <div className="activity-icon" style={{ background: col.bg, color: col.color }}>
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                  </div>
                  <div className="activity-content">
                    <h4>{item.label}</h4>
                    <p>{item.detail}</p>
                  </div>
                  <div className="activity-time">{item.time}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
