import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Search, TrendingUp, Bookmark, Users, MapPin } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
const BAR_COLORS = ['#3b82f6','#6366f1','#8b5cf6','#a78bfa','#60a5fa','#34d399','#f59e0b','#f87171','#fb923c','#a3e635']
export default function BookmarkAnalytics() {
  const { destinations, users, stats } = useApp()
  const [search, setSearch] = useState('')
  const sorted = [...destinations].sort((a, b) => b.bookmarks - a.bookmarks)
  const filtered = sorted.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )
  const chartData = sorted.slice(0, 10).map(d => ({
    name: d.name.length > 13 ? d.name.slice(0, 12) + '…' : d.name,
    bookmarks: d.bookmarks,
  }))
  const avgBookmarks = Math.round(stats.totalBookmarks / destinations.length)
  const avgPerUser   = Math.round(stats.totalBookmarks / users.length)
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Bookmark Analytics</h1>
          <p className="page-subtitle">Track popular destinations and user activity</p>
        </div>
      </div>
      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <StatCard label="Total Bookmarks"      value={stats.totalBookmarks} icon={<Bookmark size={20} />} color="warning" trend={802} />
        <StatCard label="Most Bookmarked"       value={sorted[0]?.bookmarks || 0} icon={<TrendingUp size={20} />} color="primary" sub={sorted[0]?.name} />
        <StatCard label="Avg. per Destination"  value={avgBookmarks} icon={<MapPin size={20} />} color="success" />
        <StatCard label="Avg. per User"         value={avgPerUser}   icon={<Users size={20} />}  color="purple" />
      </div>
      {/* Bar Chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="section-title">Top 10 Most Bookmarked Destinations</span>
          <TrendingUp size={16} color="var(--color-gray-400)" />
        </div>
        <div className="card-body">
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="bookmarks" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Popularity Table */}
      <div className="card">
        <div className="card-header">
          <span className="section-title">Destination Popularity Ranking</span>
        </div>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--color-gray-100)' }}>
          <div className="search-wrapper">
            <Search size={15} className="search-icon" />
            <input className="search-input" placeholder="Search destinations..." value={search} onChange={e => setSearch(e.target.value)} id="search-bookmarks" />
          </div>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Destination</th>
                <th>Category</th>
                <th>Bookmarks</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dest, i) => {
                const rank = sorted.findIndex(d => d.id === dest.id) + 1
                const share = ((dest.bookmarks / stats.totalBookmarks) * 100).toFixed(1)
                return (
                  <tr key={dest.id}>
                    <td>
                      <span className={`rank-number rank-${rank <= 3 ? rank : ''}`}>{rank}</span>
                    </td>
                    <td>
                      <div className="dest-cell">
                        <img src={dest.image} alt={dest.name} className="thumbnail" onError={e => { e.target.src = `https://picsum.photos/seed/${dest.id}/80/60` }} />
                        <div className="dest-info"><h4>{dest.name}</h4><p>{dest.address}</p></div>
                      </div>
                    </td>
                    <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
                      <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '2px 10px', borderRadius: '999px', fontSize: 'var(--font-size-xs)', fontWeight: 500 }}>
                        Cat {dest.categoryId}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Bookmark size={13} color="#f59e0b" />
                        <strong>{dest.bookmarks.toLocaleString()}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: 'var(--color-gray-100)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${share}%`, height: '100%', background: BAR_COLORS[i % BAR_COLORS.length], borderRadius: 3, minWidth: 2 }} />
                        </div>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', width: 36, textAlign: 'right' }}>{share}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}