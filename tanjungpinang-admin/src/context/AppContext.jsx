import { createContext, useContext, useState } from 'react'
// ─── DUMMY DATA ──────────────────────────────────────────────
const initialCategories = [
  { id: 1, name: 'Historical Tourism', icon: '🏛️', description: 'Explore historical sites and heritage', totalDestinations: 38, status: 'active' },
  { id: 2, name: 'Beach',             icon: '🏖️', description: 'Beautiful beaches and coastal areas',   totalDestinations: 45, status: 'active' },
  { id: 3, name: 'Culinary',          icon: '🍽️', description: 'Local food and dining experiences',     totalDestinations: 62, status: 'active' },
  { id: 4, name: 'Religious Tourism', icon: '🕌', description: 'Religious sites and places of worship', totalDestinations: 28, status: 'active' },
  { id: 5, name: 'Nature',            icon: '🌿', description: 'Natural attractions and eco-tourism',   totalDestinations: 41, status: 'active' },
  { id: 6, name: 'Culture',           icon: '🎭', description: 'Cultural experiences and traditional arts', totalDestinations: 34, status: 'hidden' },
]
const initialDestinations = [
  {
    id: 1, name: 'Pulau Penyengat', categoryId: 1,
    address: 'Penyengat Island, Tanjung Pinang',
    description: 'A historic island with a beautiful yellow mosque built with egg whites. One of the most iconic symbols of Riau Islands.',
    ticketPrice: 'Rp 5.000', openingHours: '08:00 - 17:00',
    mapsLink: 'https://maps.google.com/?q=Pulau+Penyengat',
    latitude: '0.9213', longitude: '104.4624',
    image: 'https://picsum.photos/seed/penyengat/400/260',
    gallery: ['https://picsum.photos/seed/pen1/400/260','https://picsum.photos/seed/pen2/400/260'],
    bookmarks: 1245, status: 'active',
  },
  {
    id: 2, name: 'Masjid Raya Sultan Riau', categoryId: 4,
    address: 'Masjid Raya, Tanjung Pinang',
    description: 'A grand royal mosque with stunning architecture, historically significant as a center of Islamic learning.',
    ticketPrice: 'Free', openingHours: '05:00 - 21:00',
    mapsLink: 'https://maps.google.com/?q=Masjid+Raya+Sultan+Riau',
    latitude: '0.9241', longitude: '104.4631',
    image: 'https://picsum.photos/seed/masjid/400/260',
    gallery: ['https://picsum.photos/seed/msj1/400/260'],
    bookmarks: 982, status: 'active',
  },
  {
    id: 3, name: 'Pantai Trikora', categoryId: 2,
    address: 'Bintan Island, Tanjung Pinang',
    description: 'A pristine beach stretching 35km with crystal clear water, white sand and beautiful sunsets.',
    ticketPrice: 'Rp 10.000', openingHours: '24 Hours',
    mapsLink: 'https://maps.google.com/?q=Pantai+Trikora',
    latitude: '1.0553', longitude: '104.6821',
    image: 'https://picsum.photos/seed/trikora/400/260',
    gallery: ['https://picsum.photos/seed/tri1/400/260','https://picsum.photos/seed/tri2/400/260','https://picsum.photos/seed/tri3/400/260'],
    bookmarks: 856, status: 'active',
  },
  {
    id: 4, name: 'Vihara Dharma Sasana', categoryId: 4,
    address: 'Vihara, Tanjung Pinang',
    description: 'One of the oldest Chinese temples in Riau Islands, beautifully decorated and spiritually peaceful.',
    ticketPrice: 'Free', openingHours: '06:00 - 18:00',
    mapsLink: 'https://maps.google.com/?q=Vihara+Dharma+Sasana',
    latitude: '0.9191', longitude: '104.4569',
    image: 'https://picsum.photos/seed/vihara/400/260',
    gallery: ['https://picsum.photos/seed/vih1/400/260'],
    bookmarks: 723, status: 'active',
  },
  {
    id: 5, name: 'Senggarang Village', categoryId: 6,
    address: 'Senggarang, Tanjung Pinang',
    description: 'Traditional Chinese-Malay village with ancient temples and colorful heritage houses over the water.',
    ticketPrice: 'Free', openingHours: '08:00 - 17:00',
    mapsLink: 'https://maps.google.com/?q=Senggarang+Village',
    latitude: '0.8894', longitude: '104.4423',
    image: 'https://picsum.photos/seed/sengg/400/260',
    gallery: ['https://picsum.photos/seed/sng1/400/260','https://picsum.photos/seed/sng2/400/260'],
    bookmarks: 645, status: 'active',
  },
  {
    id: 6, name: 'Gunung Bintan', categoryId: 5,
    address: 'Bintan, Tanjung Pinang',
    description: 'The highest peak in Bintan offering panoramic views of the archipelago and surrounding seas.',
    ticketPrice: 'Rp 15.000', openingHours: '07:00 - 16:00',
    mapsLink: 'https://maps.google.com/?q=Gunung+Bintan',
    latitude: '1.1023', longitude: '104.5891',
    image: 'https://picsum.photos/seed/gunung/400/260',
    gallery: [],
    bookmarks: 512, status: 'active',
  },
  {
    id: 7, name: 'Lagoi Bay Beach', categoryId: 2,
    address: 'Lagoi, Bintan',
    description: 'A premium beach resort area with luxury hotels, water sports, and pristine shoreline.',
    ticketPrice: 'Free', openingHours: '24 Hours',
    mapsLink: 'https://maps.google.com/?q=Lagoi+Bay',
    latitude: '1.1820', longitude: '104.3211',
    image: 'https://picsum.photos/seed/lagoi/400/260',
    gallery: ['https://picsum.photos/seed/lag1/400/260'],
    bookmarks: 489, status: 'active',
  },
  {
    id: 8, name: 'Pasar Oleh-oleh Tanjung Pinang', categoryId: 3,
    address: 'Jl. Merdeka, Tanjung Pinang',
    description: 'The main souvenir market offering local delicacies, handicrafts and traditional Malay products.',
    ticketPrice: 'Free', openingHours: '08:00 - 20:00',
    mapsLink: 'https://maps.google.com/?q=Pasar+Tanjung+Pinang',
    latitude: '0.9189', longitude: '104.4456',
    image: 'https://picsum.photos/seed/pasar/400/260',
    gallery: [],
    bookmarks: 387, status: 'hidden',
  },
  {
    id: 9, name: 'Museum Provinsi Kepulauan Riau', categoryId: 1,
    address: 'Jl. Pemuda, Tanjung Pinang',
    description: 'A provincial museum showcasing the rich cultural heritage and history of the Riau Archipelago.',
    ticketPrice: 'Rp 5.000', openingHours: '08:00 - 16:00',
    mapsLink: 'https://maps.google.com/?q=Museum+Kepri',
    latitude: '0.9243', longitude: '104.4502',
    image: 'https://picsum.photos/seed/museum/400/260',
    gallery: ['https://picsum.photos/seed/mus1/400/260'],
    bookmarks: 298, status: 'active',
  },
  {
    id: 10, name: 'Pantai Nongsa', categoryId: 2,
    address: 'Nongsa, Batam',
    description: 'A tranquil beach with calm waters, perfect for swimming and enjoying breathtaking sunsets.',
    ticketPrice: 'Rp 5.000', openingHours: '07:00 - 19:00',
    mapsLink: 'https://maps.google.com/?q=Pantai+Nongsa',
    latitude: '1.0842', longitude: '104.1523',
    image: 'https://picsum.photos/seed/nongsa/400/260',
    gallery: [],
    bookmarks: 211, status: 'hidden',
  },
]
const initialUsers = [
  { id: 1, name: 'John Doe',      email: 'john.doe@email.com',      avatar: 'https://i.pravatar.cc/48?img=11', registrationDate: '2024-03-15', status: 'active',    bookmarks: 24 },
  { id: 2, name: 'Jane Smith',    email: 'jane.smith@email.com',    avatar: 'https://i.pravatar.cc/48?img=5',  registrationDate: '2024-04-02', status: 'active',    bookmarks: 18 },
  { id: 3, name: 'Ahmad Rahman',  email: 'ahmad.rahman@email.com',  avatar: 'https://i.pravatar.cc/48?img=12', registrationDate: '2024-02-20', status: 'suspended', bookmarks: 12 },
  { id: 4, name: 'Sarah Johnson', email: 'sarah.j@email.com',       avatar: 'https://i.pravatar.cc/48?img=9',  registrationDate: '2024-05-10', status: 'active',    bookmarks: 31 },
  { id: 5, name: 'Michael Chen',  email: 'michael.chen@email.com',  avatar: 'https://i.pravatar.cc/48?img=15', registrationDate: '2024-01-08', status: 'active',    bookmarks: 45 },
  { id: 6, name: 'Siti Rahayu',   email: 'siti.rahayu@email.com',   avatar: 'https://i.pravatar.cc/48?img=20', registrationDate: '2024-06-01', status: 'active',    bookmarks: 8  },
  { id: 7, name: 'Budi Santoso',  email: 'budi.s@email.com',        avatar: 'https://i.pravatar.cc/48?img=16', registrationDate: '2024-05-22', status: 'active',    bookmarks: 19 },
  { id: 8, name: 'Linda Wijaya',  email: 'linda.w@email.com',       avatar: 'https://i.pravatar.cc/48?img=25', registrationDate: '2024-07-03', status: 'suspended', bookmarks: 3  },
]
const initialGallery = [
  { id: 1, title: 'Pulau Penyengat Main View',      destinationId: 1, type: 'main',    image: 'https://picsum.photos/seed/penyengat/600/400', uploadDate: '2024-05-20', status: 'active' },
  { id: 2, title: 'Pantai Trikora Sunset',          destinationId: 3, type: 'gallery', image: 'https://picsum.photos/seed/trikora/600/400',   uploadDate: '2024-05-19', status: 'active' },
  { id: 3, title: 'Masjid Raya Exterior',           destinationId: 2, type: 'main',    image: 'https://picsum.photos/seed/masjid2/600/400',   uploadDate: '2024-05-18', status: 'active' },
  { id: 4, title: 'Senggarang Traditional House',   destinationId: 5, type: 'gallery', image: 'https://picsum.photos/seed/sengg2/600/400',    uploadDate: '2024-05-17', status: 'active' },
  { id: 5, title: 'Vihara Interior',                destinationId: 4, type: 'gallery', image: 'https://picsum.photos/seed/vihara2/600/400',   uploadDate: '2024-05-16', status: 'active' },
  { id: 6, title: 'Gunung Bintan Summit',           destinationId: 6, type: 'main',    image: 'https://picsum.photos/seed/gunung2/600/400',   uploadDate: '2024-05-15', status: 'active' },
  { id: 7, title: 'Lagoi Bay Aerial',               destinationId: 7, type: 'gallery', image: 'https://picsum.photos/seed/lagoi2/600/400',    uploadDate: '2024-05-14', status: 'hidden'  },
  { id: 8, title: 'Museum Riau Artifacts',          destinationId: 9, type: 'gallery', image: 'https://picsum.photos/seed/museum2/600/400',   uploadDate: '2024-05-12', status: 'active' },
]
const initialFeatured = [
  { id: 1, destinationId: 1, order: 1, status: 'active',   startDate: '2024-05-01', endDate: '2024-07-31', image: 'https://picsum.photos/seed/feat1/600/340' },
  { id: 2, destinationId: 3, order: 2, status: 'active',   startDate: '2024-05-01', endDate: '2024-08-31', image: 'https://picsum.photos/seed/feat2/600/340' },
  { id: 3, destinationId: 2, order: 3, status: 'active',   startDate: '2024-06-01', endDate: '2024-09-30', image: 'https://picsum.photos/seed/feat3/600/340' },
  { id: 4, destinationId: 5, order: 4, status: 'inactive', startDate: '2024-07-01', endDate: '2024-10-31', image: 'https://picsum.photos/seed/feat4/600/340' },
]
const initialActivity = [
  { id: 1, type: 'user',        icon: '👤', label: 'New user registered',       detail: 'johndoe@email.com',                     time: '2 minutes ago' },
  { id: 2, type: 'destination', icon: '📍', label: 'Destination updated',        detail: 'Pantai Trikora',                        time: '15 minutes ago' },
  { id: 3, type: 'gallery',     icon: '🖼️', label: 'Image uploaded',             detail: '5 new images for Pulau Penyengat',      time: '1 hour ago' },
  { id: 4, type: 'featured',    icon: '⭐', label: 'Featured destination changed',detail: 'Grotto Santa Maria added to featured', time: '2 hours ago' },
  { id: 5, type: 'destination', icon: '📍', label: 'New destination added',       detail: 'Pantai Melur',                          time: '8 hours ago' },
]
const userGrowthData = [
  { month: 'Jan', users: 240 },
  { month: 'Feb', users: 310 },
  { month: 'Mar', users: 390 },
  { month: 'Apr', users: 510 },
  { month: 'May', users: 620 },
  { month: 'Jun', users: 750 },
]
const bookmarkTrend = [
  { month: 'Jan', bookmarks: 1200 },
  { month: 'Feb', bookmarks: 2100 },
  { month: 'Mar', bookmarks: 3400 },
  { month: 'Apr', bookmarks: 5800 },
  { month: 'May', bookmarks: 9200 },
  { month: 'Jun', bookmarks: 15234 },
]
// ─── CONTEXT ──────────────────────────────────────────────────
const AppContext = createContext(null)
export function AppProvider({ children }) {
  const [destinations, setDestinations] = useState(initialDestinations)
  const [categories, setCategories]     = useState(initialCategories)
  const [users, setUsers]               = useState(initialUsers)
  const [gallery, setGallery]           = useState(initialGallery)
  const [featured, setFeatured]         = useState(initialFeatured)
  const [activity, setActivity]         = useState(initialActivity)
  // ── helpers ──
  const addActivity = (entry) => {
    setActivity(prev => [{ ...entry, id: Date.now(), time: 'Just now' }, ...prev.slice(0, 9)])
  }
  // ── Destinations ──
  const addDestination = (dest) => {
    const newDest = { ...dest, id: Date.now(), bookmarks: 0, gallery: [] }
    setDestinations(prev => [newDest, ...prev])
    addActivity({ type: 'destination', icon: '📍', label: 'New destination added', detail: dest.name })
  }
  const updateDestination = (id, data) => {
    setDestinations(prev => prev.map(d => d.id === id ? { ...d, ...data } : d))
    addActivity({ type: 'destination', icon: '📍', label: 'Destination updated', detail: data.name })
  }
  const deleteDestination = (id) => {
    const dest = destinations.find(d => d.id === id)
    setDestinations(prev => prev.filter(d => d.id !== id))
    if (dest) addActivity({ type: 'destination', icon: '🗑️', label: 'Destination deleted', detail: dest.name })
  }
  const toggleDestinationStatus = (id) => {
    setDestinations(prev => prev.map(d =>
      d.id === id ? { ...d, status: d.status === 'active' ? 'hidden' : 'active' } : d
    ))
  }
  // ── Categories ──
  const addCategory = (cat) => {
    setCategories(prev => [...prev, { ...cat, id: Date.now(), totalDestinations: 0 }])
  }
  const updateCategory = (id, data) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
  }
  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id))
  }
  const toggleCategoryStatus = (id) => {
    setCategories(prev => prev.map(c =>
      c.id === id ? { ...c, status: c.status === 'active' ? 'hidden' : 'active' } : c
    ))
  }
  // ── Users ──
  const toggleUserStatus = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
    ))
  }
  const addUser = (user) => {
    setUsers(prev => [...prev, { ...user, id: Date.now(), bookmarks: 0, registrationDate: new Date().toISOString().split('T')[0] }])
    addActivity({ type: 'user', icon: '👤', label: 'New user registered', detail: user.email })
  }
  // ── Gallery ──
  const addGalleryImage = (img) => {
    setGallery(prev => [{ ...img, id: Date.now(), uploadDate: new Date().toISOString().split('T')[0], status: 'active' }, ...prev])
    addActivity({ type: 'gallery', icon: '🖼️', label: 'Image uploaded', detail: img.title })
  }
  const deleteGalleryImage = (id) => {
    setGallery(prev => prev.filter(g => g.id !== id))
  }
  const setMainImage = (id) => {
    const img = gallery.find(g => g.id === id)
    if (!img) return
    setGallery(prev => prev.map(g =>
      g.id === id ? { ...g, type: 'main' } :
      (g.destinationId === img.destinationId && g.type === 'main' ? { ...g, type: 'gallery' } : g)
    ))
  }
  const toggleGalleryStatus = (id) => {
    setGallery(prev => prev.map(g =>
      g.id === id ? { ...g, status: g.status === 'active' ? 'hidden' : 'active' } : g
    ))
  }
  // ── Featured ──
  const addFeatured = (feat) => {
    const maxOrder = featured.reduce((m, f) => Math.max(m, f.order), 0)
    setFeatured(prev => [...prev, { ...feat, id: Date.now(), order: maxOrder + 1 }])
    addActivity({ type: 'featured', icon: '⭐', label: 'Featured destination changed', detail: 'New featured added' })
  }
  const removeFeatured = (id) => {
    setFeatured(prev => prev.filter(f => f.id !== id))
  }
  const toggleFeaturedStatus = (id) => {
    setFeatured(prev => prev.map(f =>
      f.id === id ? { ...f, status: f.status === 'active' ? 'inactive' : 'active' } : f
    ))
  }
  const reorderFeatured = (id, direction) => {
    setFeatured(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order)
      const idx = sorted.findIndex(f => f.id === id)
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev
      const result = [...sorted]
      const tmp = result[idx].order
      result[idx] = { ...result[idx], order: result[swapIdx].order }
      result[swapIdx] = { ...result[swapIdx], order: tmp }
      return result
    })
  }
  const updateFeatured = (id, data) => {
    setFeatured(prev => prev.map(f => f.id === id ? { ...f, ...data } : f))
  }
  // ── Computed stats ──
  const stats = {
    totalDestinations: destinations.length,
    totalUsers: users.length,
    totalCategories: categories.length,
    totalBookmarks: destinations.reduce((s, d) => s + d.bookmarks, 0),
    activeDestinations: destinations.filter(d => d.status === 'active').length,
    hiddenDestinations: destinations.filter(d => d.status === 'hidden').length,
    activeUsers: users.filter(u => u.status === 'active').length,
    suspendedUsers: users.filter(u => u.status === 'suspended').length,
    activeCategories: categories.filter(c => c.status === 'active').length,
    hiddenCategories: categories.filter(c => c.status === 'hidden').length,
    totalImages: gallery.length,
    mainImages: gallery.filter(g => g.type === 'main').length,
    galleryImages: gallery.filter(g => g.type === 'gallery').length,
    activeImages: gallery.filter(g => g.status === 'active').length,
  }
  const value = {
    destinations, categories, users, gallery, featured, activity,
    userGrowthData, bookmarkTrend,
    stats,
    // actions
    addDestination, updateDestination, deleteDestination, toggleDestinationStatus,
    addCategory, updateCategory, deleteCategory, toggleCategoryStatus,
    toggleUserStatus, addUser,
    addGalleryImage, deleteGalleryImage, setMainImage, toggleGalleryStatus,
    addFeatured, removeFeatured, toggleFeaturedStatus, reorderFeatured, updateFeatured,
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}