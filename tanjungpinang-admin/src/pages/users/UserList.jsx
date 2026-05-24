import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Search, Eye, UserCheck, UserX, Bookmark, Calendar } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
function UserDetailModal({ user, onClose }) {
  const { toggleUserStatus } = useApp()
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div className="avatar avatar-xl">
          {user.avatar
            ? <img src={user.avatar} alt={user.name} onError={e => { e.target.style.display = 'none' }} />
            : user.name.split(' ').map(w => w[0]).join('').slice(0, 2)
          }
        </div>
        <div>
          <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>{user.name}</h3>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>{user.email}</p>
          <div style={{ marginTop: 8 }}><Badge type={user.status} /></div>
        </div>
      </div>
      <div className="detail-grid">
        <div className="detail-field">
          <label><Calendar size={12} style={{ display: 'inline' }} /> Registration Date</label>
          <p>{user.registrationDate}</p>
        </div>
        <div className="detail-field">
          <label><Bookmark size={12} style={{ display: 'inline' }} /> Total Bookmarks</label>
          <p style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>{user.bookmarks}</p>
        </div>
        <div className="detail-field">
          <label>Account Status</label>
          <p>{user.status === 'active' ? '✅ Active' : '🚫 Suspended'}</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
        <button className="btn btn-secondary" onClick={onClose} id="user-detail-close">Close</button>
        <button
          className={`btn ${user.status === 'active' ? 'btn-danger' : 'btn-primary'}`}
          id={`toggle-user-status-${user.id}`}
          onClick={() => { toggleUserStatus(user.id); onClose() }}
        >
          {user.status === 'active' ? <><UserX size={15} /> Suspend User</> : <><UserCheck size={15} /> Activate User</>}
        </button>
      </div>
    </div>
  )
}
export default function UserList() {
  const { users, stats, toggleUserStatus } = useApp()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [viewing, setViewing] = useState(null)
  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || u.status === filterStatus
    return matchSearch && matchStatus
  })
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">View and manage registered users</p>
        </div>
      </div>
      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <StatCard label="Total Users"     value={stats.totalUsers}     icon={<Eye size={20} />}       color="primary" />
        <StatCard label="Active Users"    value={stats.activeUsers}    icon={<UserCheck size={20} />} color="success" />
        <StatCard label="Suspended Users" value={stats.suspendedUsers} icon={<UserX size={20} />}    color="danger" />
        <StatCard label="Total Bookmarks" value={users.reduce((s,u) => s + u.bookmarks, 0)} icon={<Bookmark size={20} />} color="warning" />
      </div>
      {/* Toolbar */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-body" style={{ padding: '14px 20px' }}>
          <div className="toolbar">
            <div className="search-wrapper">
              <Search size={15} className="search-icon" />
              <input className="search-input" placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} id="search-users" />
            </div>
            <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} id="filter-user-status">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="card">
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--color-gray-100)' }}>
          <p className="result-count" style={{ marginBottom: 0 }}>
            Showing <strong>{filtered.length}</strong> of <strong>{users.length}</strong> users
          </p>
        </div>
        {filtered.length === 0 ? (
          <EmptyState title="No users found" message="Try adjusting your search or filter." />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Registration Date</th>
                  <th>Bookmarks</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar">
                          {user.avatar
                            ? <img src={user.avatar} alt={user.name} onError={e => { e.target.style.display = 'none' }} />
                            : user.name.split(' ').map(w => w[0]).join('').slice(0, 2)
                          }
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--color-gray-500)' }}>{user.email}</td>
                    <td style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-xs)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={12} /> {user.registrationDate}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                        <Bookmark size={13} color="#f59e0b" /> {user.bookmarks}
                      </span>
                    </td>
                    <td><Badge type={user.status} /></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-ghost btn-icon" title="View" id={`view-user-${user.id}`} onClick={() => setViewing(user)}>
                          <Eye size={15} />
                        </button>
                        <button
                          className="btn btn-ghost btn-icon"
                          title={user.status === 'active' ? 'Suspend' : 'Activate'}
                          id={`toggle-user-${user.id}`}
                          onClick={() => toggleUserStatus(user.id)}
                          style={{ color: user.status === 'active' ? 'var(--color-danger)' : 'var(--color-success)' }}
                        >
                          {user.status === 'active' ? <UserX size={15} /> : <UserCheck size={15} />}
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
      {viewing && (
        <Modal title="User Detail" onClose={() => setViewing(null)}>
          <UserDetailModal user={users.find(u => u.id === viewing.id) || viewing} onClose={() => setViewing(null)} />
        </Modal>
      )}
    </div>
  )
}