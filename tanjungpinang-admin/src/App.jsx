import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import DestinationList from './pages/destinations/DestinationList'
import UserList from './pages/users/UserList'
import CategoryList from './pages/categories/CategoryList'
import GalleryList from './pages/gallery/GalleryList'
import BookmarkAnalytics from './pages/bookmarks/BookmarkAnalytics'
import FeaturedList from './pages/featured/FeaturedList'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="destinations" element={<DestinationList />} />
        <Route path="users" element={<UserList />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="gallery" element={<GalleryList />} />
        <Route path="bookmarks" element={<BookmarkAnalytics />} />
        <Route path="featured" element={<FeaturedList />} />
      </Route>
    </Routes>
  )
}

export default App
