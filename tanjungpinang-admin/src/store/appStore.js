import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─────────────────────────────────────────────
// DUMMY DATA - Tanjung Pinang Guide
// ─────────────────────────────────────────────

const initialDestinations = [
  {
    id: 1,
    name: "Pulau Penyengat",
    categoryId: 1,
    category: "Wisata Sejarah",
    location: "Pulau Penyengat, Kota Tanjungpinang, Kepulauan Riau",
    shortDescription: "Pulau bersejarah bekas pusat Kerajaan Riau-Lingga dengan masjid dan benteng berusia ratusan tahun.",
    fullDescription: "Pulau Penyengat merupakan pulau kecil yang terletak di seberang Kota Tanjungpinang. Pulau ini menjadi pusat Kerajaan Riau-Lingga pada abad ke-18 hingga awal abad ke-20.",
    mainImage: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80",
    gallery: [
      { id: 101, url: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600&q=80", caption: "Masjid Sultan Riau", sortOrder: 1 },
      { id: 102, url: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=600&q=80", caption: "Benteng Bukit Kursi", sortOrder: 2 },
    ],
    facilities: ["Parkir", "Toilet", "Pemandu Wisata", "Warung Makan"],
    openingHours: "08:00 - 17:00",
    ticketPrice: 15000,
    mapsUrl: "https://maps.google.com/?q=Pulau+Penyengat+Tanjungpinang",
    googlePlaceId: "ChIJ_penyengat_001",
    googleRating: 4.6,
    googleReviewCount: 1240,
    googleLastSyncAt: "2026-05-20",
    ratingAverage: 4.7,
    reviewCount: 38,
    visitCount: 1520,
    estimatedCostMin: 50000,
    estimatedCostMax: 150000,
    recommendedDuration: "3-4 jam",
    bestVisitTime: "Pagi hari, 07:00 - 10:00",
    travelTips: "Naik pompong dari Dermaga Penyengat. Sewa sepeda ontel untuk keliling pulau.",
    transportRecommendation: "Pompong dari Dermaga Penyengat (Rp 8.000/orang)",
    aiRecommended: true,
    suitableForBudget: "hemat",
    suitableForGroup: ["solo", "couple", "family", "group"],
    isPublished: true,
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    name: "Pantai Trikora",
    categoryId: 2,
    category: "Pantai",
    location: "Bintan, Kepulauan Riau",
    shortDescription: "Pantai pasir putih dengan air jernih dan suasana tenang, cocok untuk snorkeling dan bersantai.",
    fullDescription: "Pantai Trikora terletak di sisi timur Pulau Bintan, menawarkan hamparan pasir putih yang bersih dengan air laut yang jernih kebiruan.",
    mainImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    gallery: [
      { id: 201, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", caption: "Pantai Trikora", sortOrder: 1 },
    ],
    facilities: ["Toilet", "Gazebo", "Warung", "Parkir"],
    openingHours: "06:00 - 18:00",
    ticketPrice: 10000,
    mapsUrl: "https://maps.google.com/?q=Pantai+Trikora+Bintan",
    googlePlaceId: "ChIJ_trikora_002",
    googleRating: 4.4,
    googleReviewCount: 876,
    googleLastSyncAt: "2026-05-18",
    ratingAverage: 4.5,
    reviewCount: 25,
    visitCount: 980,
    estimatedCostMin: 30000,
    estimatedCostMax: 200000,
    recommendedDuration: "Setengah hari - 1 hari",
    bestVisitTime: "Pagi dan sore hari",
    travelTips: "Bawa peralatan snorkeling sendiri untuk hemat. Hindari hari Minggu karena ramai.",
    transportRecommendation: "Sewa motor dari Tanjungpinang atau naik Angkot ke arah Trikora",
    aiRecommended: true,
    suitableForBudget: "hemat",
    suitableForGroup: ["couple", "family", "group"],
    isPublished: true,
    createdAt: "2024-02-05",
  },
  {
    id: 3,
    name: "Vihara Ksitigarbha Bodhisattva",
    categoryId: 4,
    category: "Religi",
    location: "Senggarang, Tanjungpinang, Kepulauan Riau",
    shortDescription: "Vihara megah dengan patung dewa besar dan pemandangan laut yang indah dari ketinggian.",
    fullDescription: "Vihara Ksitigarbha Bodhisattva adalah kompleks vihara Buddha yang berdiri megah di kawasan Senggarang, Tanjungpinang.",
    mainImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    gallery: [
      { id: 301, url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", caption: "Vihara dari luar", sortOrder: 1 },
    ],
    facilities: ["Parkir", "Toilet"],
    openingHours: "07:00 - 17:00",
    ticketPrice: 0,
    mapsUrl: "https://maps.google.com/?q=Vihara+Ksitigarbha+Tanjungpinang",
    googlePlaceId: "ChIJ_vihara_003",
    googleRating: 4.5,
    googleReviewCount: 543,
    googleLastSyncAt: "2026-05-15",
    ratingAverage: 4.6,
    reviewCount: 18,
    visitCount: 650,
    estimatedCostMin: 0,
    estimatedCostMax: 50000,
    recommendedDuration: "1-2 jam",
    bestVisitTime: "Pagi hari",
    travelTips: "Berpakaian sopan saat memasuki area ibadah.",
    transportRecommendation: "Ojek atau Grab dari pusat Tanjungpinang",
    aiRecommended: false,
    suitableForBudget: "hemat",
    suitableForGroup: ["solo", "couple", "family"],
    isPublished: true,
    createdAt: "2024-02-20",
  },
  {
    id: 4,
    name: "Mie Tarempa Khas Tanjungpinang",
    categoryId: 3,
    category: "Kuliner",
    location: "Pasar Baru, Tanjungpinang, Kepulauan Riau",
    shortDescription: "Mie khas Anambas yang populer di Tanjungpinang dengan kuah gurih dan topping ikan segar.",
    fullDescription: "Mie Tarempa adalah kuliner khas dari Kepulauan Riau yang tidak boleh dilewatkan.",
    mainImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    gallery: [],
    facilities: ["Makan di Tempat", "Bawa Pulang"],
    openingHours: "07:00 - 14:00",
    ticketPrice: 0,
    mapsUrl: "https://maps.google.com/?q=Mie+Tarempa+Tanjungpinang",
    googlePlaceId: "",
    googleRating: 4.3,
    googleReviewCount: 210,
    googleLastSyncAt: null,
    ratingAverage: 4.4,
    reviewCount: 12,
    visitCount: 430,
    estimatedCostMin: 20000,
    estimatedCostMax: 50000,
    recommendedDuration: "30-60 menit",
    bestVisitTime: "Pagi hari sebelum habis",
    travelTips: "Datang sebelum jam 10 pagi agar tidak kehabisan.",
    transportRecommendation: "Jalan kaki dari area Pasar Baru",
    aiRecommended: true,
    suitableForBudget: "hemat",
    suitableForGroup: ["solo", "couple", "family", "group"],
    isPublished: true,
    createdAt: "2024-03-01",
  },
  {
    id: 5,
    name: "Gunung Bintan",
    categoryId: 5,
    category: "Alam",
    location: "Bintan, Kepulauan Riau",
    shortDescription: "Gunung tertinggi di Pulau Bintan dengan jalur pendakian dan pemandangan hutan tropis.",
    fullDescription: "Gunung Bintan adalah gunung tertinggi di Pulau Bintan dengan ketinggian sekitar 340 mdpl.",
    mainImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    gallery: [],
    facilities: ["Parkir", "Pemandu Lokal"],
    openingHours: "05:00 - 15:00",
    ticketPrice: 25000,
    mapsUrl: "https://maps.google.com/?q=Gunung+Bintan",
    googlePlaceId: "",
    googleRating: 4.2,
    googleReviewCount: 145,
    googleLastSyncAt: null,
    ratingAverage: 4.3,
    reviewCount: 8,
    visitCount: 280,
    estimatedCostMin: 50000,
    estimatedCostMax: 150000,
    recommendedDuration: "4-6 jam",
    bestVisitTime: "Pagi hari mulai subuh",
    travelTips: "Bawa air minum cukup dan gunakan alas kaki yang nyaman.",
    transportRecommendation: "Sewa motor atau mobil dari Tanjungpinang",
    aiRecommended: false,
    suitableForBudget: "menengah",
    suitableForGroup: ["solo", "group"],
    isPublished: false,
    createdAt: "2024-04-01",
  },
];

const initialCategories = [
  { id: 1, name: "Wisata Sejarah", icon: "Landmark", image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=400&q=80", description: "Destinasi bersejarah dan peninggalan budaya", isActive: true },
  { id: 2, name: "Pantai", icon: "Waves", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80", description: "Wisata pantai dan bahari Kepulauan Riau", isActive: true },
  { id: 3, name: "Kuliner", icon: "UtensilsCrossed", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80", description: "Kuliner khas Melayu dan seafood", isActive: true },
  { id: 4, name: "Religi", icon: "MoonStar", image: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=400&q=80", description: "Destinasi wisata religi dan ibadah", isActive: true },
  { id: 5, name: "Alam", icon: "TreePine", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80", description: "Wisata alam, hutan, dan bahari", isActive: true },
  { id: 6, name: "Budaya", icon: "Palette", image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&q=80", description: "Seni dan budaya Melayu", isActive: false },
];

const initialUsers = [
  { id: 1, name: "Andi Pratama", email: "andi@email.com", avatar: "https://i.pravatar.cc/40?img=1", role: "user", status: "active", totalVisits: 12, totalReviews: 5, totalItineraries: 3, registeredAt: "2024-01-15" },
  { id: 2, name: "Siti Rahayu", email: "siti@email.com", avatar: "https://i.pravatar.cc/40?img=5", role: "user", status: "active", totalVisits: 8, totalReviews: 4, totalItineraries: 2, registeredAt: "2024-02-03" },
  { id: 3, name: "Budi Santoso", email: "budi@email.com", avatar: "https://i.pravatar.cc/40?img=3", role: "user", status: "suspended", totalVisits: 2, totalReviews: 1, totalItineraries: 0, registeredAt: "2024-02-18" },
  { id: 4, name: "Dewi Lestari", email: "dewi@email.com", avatar: "https://i.pravatar.cc/40?img=9", role: "user", status: "active", totalVisits: 15, totalReviews: 7, totalItineraries: 5, registeredAt: "2024-03-05" },
  { id: 5, name: "Reza Mahendra", email: "reza@email.com", avatar: "https://i.pravatar.cc/40?img=12", role: "user", status: "active", totalVisits: 6, totalReviews: 2, totalItineraries: 1, registeredAt: "2024-03-22" },
  { id: 6, name: "Nadia Putri", email: "nadia@email.com", avatar: "https://i.pravatar.cc/40?img=16", role: "user", status: "active", totalVisits: 20, totalReviews: 9, totalItineraries: 7, registeredAt: "2024-04-01" },
];

// review: tidak ada status approval, langsung tampil di frontend
// isVerifiedVisit = user pernah visit destinasi tersebut
const initialReviews = [
  { id: 1, destinationId: 1, destinationName: "Pulau Penyengat", userId: 1, userName: "Andi Pratama", userAvatar: "https://i.pravatar.cc/40?img=1", rating: 5, comment: "Tempat yang luar biasa! Sejarahnya sangat kaya dan pemandangannya indah. Wajib dikunjungi kalau ke Tanjungpinang.", createdAt: "2026-05-10", isVerifiedVisit: true },
  { id: 2, destinationId: 2, destinationName: "Pantai Trikora", userId: 2, userName: "Siti Rahayu", userAvatar: "https://i.pravatar.cc/40?img=5", rating: 4, comment: "Pantainya bersih dan airnya jernih. Sangat cocok untuk snorkeling. Kami sekeluarga sangat senang berkunjung ke sini.", createdAt: "2026-05-08", isVerifiedVisit: true },
  { id: 3, destinationId: 1, destinationName: "Pulau Penyengat", userId: 4, userName: "Dewi Lestari", userAvatar: "https://i.pravatar.cc/40?img=9", rating: 5, comment: "Sangat recommended untuk wisata sejarah. Masjid Sultan Rianya menakjubkan!", createdAt: "2026-05-05", isVerifiedVisit: true },
  { id: 4, destinationId: 3, destinationName: "Vihara Ksitigarbha", userId: 5, userName: "Reza Mahendra", userAvatar: "https://i.pravatar.cc/40?img=12", rating: 4, comment: "Vihara yang megah dan tenang. Pemandangan lautnya dari atas sangat indah.", createdAt: "2026-05-03", isVerifiedVisit: false },
  { id: 5, destinationId: 4, destinationName: "Mie Tarempa", userId: 6, userName: "Nadia Putri", userAvatar: "https://i.pravatar.cc/40?img=16", rating: 5, comment: "Mie Tarempa-nya enak banget! Kuah ikannya gurih dan porsinya cukup. Harga terjangkau juga.", createdAt: "2026-04-28", isVerifiedVisit: true },
  { id: 6, destinationId: 2, destinationName: "Pantai Trikora", userId: 3, userName: "Budi Santoso", userAvatar: "https://i.pravatar.cc/40?img=3", rating: 2, comment: "Pantainya kurang bersih, banyak sampah di pinggir pantai.", createdAt: "2026-04-25", isVerifiedVisit: false },
  { id: 7, destinationId: 1, destinationName: "Pulau Penyengat", userId: 2, userName: "Siti Rahayu", userAvatar: "https://i.pravatar.cc/40?img=5", rating: 4, comment: "Pengalaman tak terlupakan menyeberang dengan pompong ke pulau bersejarah ini.", createdAt: "2026-04-20", isVerifiedVisit: true },
];

const initialVisitedDestinations = [
  { id: 1, userId: 1, userName: "Andi Pratama", userAvatar: "https://i.pravatar.cc/40?img=1", destinationId: 1, destinationName: "Pulau Penyengat", visitedAt: "2026-05-09" },
  { id: 2, userId: 2, userName: "Siti Rahayu", userAvatar: "https://i.pravatar.cc/40?img=5", destinationId: 2, destinationName: "Pantai Trikora", visitedAt: "2026-05-07" },
  { id: 3, userId: 4, userName: "Dewi Lestari", userAvatar: "https://i.pravatar.cc/40?img=9", destinationId: 1, destinationName: "Pulau Penyengat", visitedAt: "2026-05-04" },
  { id: 4, userId: 5, userName: "Reza Mahendra", userAvatar: "https://i.pravatar.cc/40?img=12", destinationId: 3, destinationName: "Vihara Ksitigarbha", visitedAt: "2026-05-02" },
  { id: 5, userId: 6, userName: "Nadia Putri", userAvatar: "https://i.pravatar.cc/40?img=16", destinationId: 4, destinationName: "Mie Tarempa", visitedAt: "2026-04-27" },
  { id: 6, userId: 3, userName: "Budi Santoso", userAvatar: "https://i.pravatar.cc/40?img=3", destinationId: 2, destinationName: "Pantai Trikora", visitedAt: "2026-04-24" },
  { id: 7, userId: 1, userName: "Andi Pratama", userAvatar: "https://i.pravatar.cc/40?img=1", destinationId: 4, destinationName: "Mie Tarempa", visitedAt: "2026-04-15" },
];

const initialHomepageHighlights = [
  { id: 1, title: "Jelajahi Tanjungpinang", subtitle: "Kota Gurindam, Kota Bersejarah — Temukan keindahan tersembunyi Kepulauan Riau", image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80", buttonText: "Mulai Jelajahi", buttonLink: "/destinasi", isActive: true },
  { id: 2, title: "Wisata Kuliner Melayu", subtitle: "Nikmati cita rasa asli Kepulauan Riau yang tak terlupakan", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&q=80", buttonText: "Lihat Kuliner", buttonLink: "/destinasi?kategori=kuliner", isActive: false },
];

const initialTravelGuides = [
  { id: 1, title: "Transportasi ke Tanjungpinang", description: "Tanjungpinang dapat dicapai via udara melalui Bandara Raja Haji Fisabilillah, atau via laut menggunakan ferry dari Batam, Singapore, dan Jakarta.", icon: "Plane", sortOrder: 1, isActive: true },
  { id: 2, title: "Transportasi Lokal", description: "Gunakan ojek, becak motor, atau rental sepeda motor untuk berkeliling kota. Pompong tersedia untuk menyeberang ke pulau-pulau kecil.", icon: "Bike", sortOrder: 2, isActive: true },
  { id: 3, title: "Tips Berkunjung", description: "Kunjungi di hari biasa untuk menghindari keramaian. Bawa uang tunai karena tidak semua tempat menerima pembayaran digital.", icon: "Lightbulb", sortOrder: 3, isActive: true },
  { id: 4, title: "Akomodasi", description: "Tersedia berbagai pilihan hotel dan penginapan di pusat kota Tanjungpinang mulai dari budget hingga bintang empat.", icon: "Hotel", sortOrder: 4, isActive: true },
];

// itineraryLog: hasil generate dari AI REST API, hanya untuk analytics
const initialItineraryLogs = [
  { id: 1, userId: 1, userName: "Andi Pratama", budget: "hemat", duration: 2, interests: ["Wisata Sejarah", "Kuliner"], generatedDestinations: ["Pulau Penyengat", "Mie Tarempa"], createdAt: "2026-05-12" },
  { id: 2, userId: 4, userName: "Dewi Lestari", budget: "menengah", duration: 3, interests: ["Pantai", "Alam", "Kuliner"], generatedDestinations: ["Pantai Trikora", "Vihara Ksitigarbha", "Mie Tarempa"], createdAt: "2026-05-10" },
  { id: 3, userId: 6, userName: "Nadia Putri", budget: "hemat", duration: 1, interests: ["Wisata Sejarah", "Kuliner"], generatedDestinations: ["Pulau Penyengat", "Mie Tarempa"], createdAt: "2026-05-08" },
  { id: 4, userId: 2, userName: "Siti Rahayu", budget: "premium", duration: 4, interests: ["Pantai", "Religi"], generatedDestinations: ["Pantai Trikora", "Vihara Ksitigarbha"], createdAt: "2026-05-05" },
  { id: 5, userId: 5, userName: "Reza Mahendra", budget: "menengah", duration: 2, interests: ["Alam", "Wisata Sejarah"], generatedDestinations: ["Gunung Bintan", "Pulau Penyengat"], createdAt: "2026-05-02" },
];

const initialActivity = [
  { id: 1, type: "review_new", text: "Ulasan baru masuk", detail: "Nadia Putri — Mie Tarempa ★5", time: "10 menit lalu" },
  { id: 2, type: "user_registered", text: "Pengguna baru terdaftar", detail: "nadia@email.com", time: "2 jam lalu" },
  { id: 3, type: "destination_added", text: "Destinasi baru ditambahkan", detail: "Gunung Bintan", time: "5 jam lalu" },
  { id: 4, type: "itinerary_generated", text: "AI Itinerary dibuat", detail: "Solo Trip — Andi Pratama", time: "1 hari lalu" },
  { id: 5, type: "visit_logged", text: "Kunjungan baru tercatat", detail: "Dewi Lestari — Pulau Penyengat", time: "2 hari lalu" },
];

// ─────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────

export const useAppStore = create(
  persist(
    (set, get) => ({
      destinations: initialDestinations,
      categories: initialCategories,
      users: initialUsers,
      reviews: initialReviews,
      visitedDestinations: initialVisitedDestinations,
      homepageHighlights: initialHomepageHighlights,
      travelGuides: initialTravelGuides,
      itineraryLogs: initialItineraryLogs,
      activity: initialActivity,

      // ── DESTINATIONS ──
      addDestination: (dest) => {
        const newDest = { ...dest, id: Date.now(), ratingAverage: 0, reviewCount: 0, visitCount: 0, createdAt: new Date().toISOString().split("T")[0] };
        set((s) => ({
          destinations: [...s.destinations, newDest],
          activity: [{ id: Date.now(), type: "destination_added", text: "Destinasi baru ditambahkan", detail: dest.name, time: "Baru saja" }, ...s.activity].slice(0, 20),
        }));
      },
      updateDestination: (id, data) => {
        set((s) => ({
          destinations: s.destinations.map((d) => d.id === id ? { ...d, ...data } : d),
          activity: [{ id: Date.now(), type: "destination_updated", text: "Destinasi diperbarui", detail: data.name || "", time: "Baru saja" }, ...s.activity].slice(0, 20),
        }));
      },
      deleteDestination: (id) => set((s) => ({ destinations: s.destinations.filter((d) => d.id !== id) })),
      togglePublish: (id) => set((s) => ({
        destinations: s.destinations.map((d) => d.id === id ? { ...d, isPublished: !d.isPublished } : d),
      })),

      // ── CATEGORIES ──
      addCategory: (cat) => set((s) => ({ categories: [...s.categories, { ...cat, id: Date.now() }] })),
      updateCategory: (id, data) => set((s) => ({ categories: s.categories.map((c) => c.id === id ? { ...c, ...data } : c) })),
      deleteCategory: (id) => set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

      // ── USERS ──
      updateUser: (id, data) => set((s) => ({ users: s.users.map((u) => u.id === id ? { ...u, ...data } : u) })),
      deleteUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

      // ── REVIEWS (no approval flow — all reviews visible to frontend) ──
      deleteReview: (id) => set((s) => ({ reviews: s.reviews.filter((r) => r.id !== id) })),

      // ── VISITED DESTINATIONS ──
      deleteVisit: (id) => set((s) => ({ visitedDestinations: s.visitedDestinations.filter((v) => v.id !== id) })),

      // ── GALLERY (via destination) ──
      addGalleryImage: (destinationId, imageData) => {
        set((s) => ({
          destinations: s.destinations.map((d) => {
            if (d.id !== destinationId) return d;
            const gallery = d.gallery || [];
            if (gallery.length >= 8) return d;
            return { ...d, gallery: [...gallery, { id: Date.now(), url: imageData.url, caption: imageData.caption || "", sortOrder: gallery.length + 1 }] };
          }),
        }));
      },
      removeGalleryImage: (destinationId, imageId) => {
        set((s) => ({
          destinations: s.destinations.map((d) => {
            if (d.id !== destinationId) return d;
            return { ...d, gallery: (d.gallery || []).filter(g => g.id !== imageId) };
          }),
        }));
      },
      updateGalleryImage: (destinationId, imageId, data) => {
        set((s) => ({
          destinations: s.destinations.map((d) => {
            if (d.id !== destinationId) return d;
            return { ...d, gallery: (d.gallery || []).map(g => g.id === imageId ? { ...g, ...data } : g) };
          }),
        }));
      },
      setMainImage: (destinationId, url) => {
        set((s) => ({
          destinations: s.destinations.map((d) => d.id === destinationId ? { ...d, mainImage: url } : d),
        }));
      },
      reorderGallery: (destinationId, newGallery) => {
        set((s) => ({
          destinations: s.destinations.map((d) => d.id === destinationId ? { ...d, gallery: newGallery } : d),
        }));
      },

      // ── HOMEPAGE HIGHLIGHTS ──
      updateHighlight: (id, data) => {
        set((s) => ({
          homepageHighlights: s.homepageHighlights.map((h) => {
            if (data.isActive) return h.id === id ? { ...h, ...data } : { ...h, isActive: false };
            return h.id === id ? { ...h, ...data } : h;
          }),
        }));
      },
      addHighlight: (data) => set((s) => ({
        homepageHighlights: [...s.homepageHighlights, { ...data, id: Date.now(), isActive: false }],
      })),
      deleteHighlight: (id) => set((s) => ({ homepageHighlights: s.homepageHighlights.filter((h) => h.id !== id) })),

      // ── TRAVEL GUIDES ──
      addTravelGuide: (data) => set((s) => ({ travelGuides: [...s.travelGuides, { ...data, id: Date.now() }] })),
      updateTravelGuide: (id, data) => set((s) => ({ travelGuides: s.travelGuides.map((g) => g.id === id ? { ...g, ...data } : g) })),
      deleteTravelGuide: (id) => set((s) => ({ travelGuides: s.travelGuides.filter((g) => g.id !== id) })),
    }),
    { name: "tanjungpinang-admin-store-v2" }
  )
);