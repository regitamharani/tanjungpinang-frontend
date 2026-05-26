import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialDestinations = [
  {
    id: 1,
    name: "Candi Borobudur",
    category: "Wisata Sejarah",
    address: "Jl. Badrawati, Kw. Candi Borobudur, Magelang, Jawa Tengah",
    description: "Candi Buddha terbesar di dunia yang dibangun pada abad ke-9, merupakan warisan dunia UNESCO.",
    ticketPrice: 50000,
    openingHours: "06:00 - 17:00",
    mapsLink: "https://maps.google.com/?q=Candi+Borobudur",
    googlePlaceId: "ChIJ6f7wAAAAACUR_sGeXrWqBpY",
    image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600&q=80",
      "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=600&q=80",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80",
    ],
    status: "active",
    bookmarks: 342,
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    name: "Pantai Kuta",
    category: "Pantai",
    address: "Kuta, Kabupaten Badung, Bali",
    description: "Pantai terkenal di Bali dengan pasir putih dan ombak yang cocok untuk surfing.",
    ticketPrice: 0,
    openingHours: "24 Jam",
    mapsLink: "https://maps.google.com/?q=Pantai+Kuta+Bali",
    googlePlaceId: "ChIJsW8ShbFF0i0RUQUgnKqElA0",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    ],
    status: "active",
    bookmarks: 289,
    createdAt: "2024-02-05",
  },
  {
    id: 3,
    name: "Kawah Ijen",
    category: "Alam",
    address: "Banyuwangi, Jawa Timur",
    description: "Danau kawah vulkanik dengan fenomena api biru yang langka di dunia.",
    ticketPrice: 100000,
    openingHours: "00:00 - 12:00",
    mapsLink: "https://maps.google.com/?q=Kawah+Ijen",
    googlePlaceId: "",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    ],
    status: "active",
    bookmarks: 198,
    createdAt: "2024-02-20",
  },
  {
    id: 4,
    name: "Warung Sate Mak Beng",
    category: "Kuliner",
    address: "Jl. Hang Tuah No.45, Sanur, Bali",
    description: "Warung sate babi legendaris yang sudah berdiri sejak 1941.",
    ticketPrice: 0,
    openingHours: "10:00 - 16:00",
    mapsLink: "https://maps.google.com/?q=Warung+Sate+Mak+Beng",
    googlePlaceId: "",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    gallery: [],
    status: "active",
    bookmarks: 154,
    createdAt: "2024-03-01",
  },
  {
    id: 5,
    name: "Masjid Istiqlal",
    category: "Religi",
    address: "Jl. Taman Wijaya Kusuma, Ps. Baru, Jakarta Pusat",
    description: "Masjid terbesar di Asia Tenggara yang menjadi kebanggaan Indonesia.",
    ticketPrice: 0,
    openingHours: "04:00 - 22:00",
    mapsLink: "https://maps.google.com/?q=Masjid+Istiqlal",
    googlePlaceId: "ChIJKfy-7eAaai4RDIPuJLxGYqk",
    image: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=600&q=80",
    ],
    status: "active",
    bookmarks: 121,
    createdAt: "2024-03-15",
  },
  {
    id: 6,
    name: "Desa Penglipuran",
    category: "Budaya",
    address: "Penglipuran, Bangli, Bali",
    description: "Desa adat Bali yang terkenal sebagai salah satu desa terbersih di dunia.",
    ticketPrice: 25000,
    openingHours: "07:00 - 18:00",
    mapsLink: "https://maps.google.com/?q=Desa+Penglipuran",
    googlePlaceId: "",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
    gallery: [],
    status: "hidden",
    bookmarks: 87,
    createdAt: "2024-04-01",
  },
];

const initialCategories = [
  { id: 1, name: "Wisata Sejarah", icon: "Landmark", description: "Destinasi bersejarah dan berbudaya tinggi", status: "active" },
  { id: 2, name: "Pantai", icon: "Waves", description: "Destinasi wisata pantai dan bahari", status: "active" },
  { id: 3, name: "Kuliner", icon: "UtensilsCrossed", description: "Wisata kuliner dan makanan khas daerah", status: "active" },
  { id: 4, name: "Religi", icon: "MoonStar", description: "Destinasi wisata religi dan ibadah", status: "active" },
  { id: 5, name: "Alam", icon: "TreePine", description: "Wisata alam, hutan, dan pegunungan", status: "active" },
  { id: 6, name: "Budaya", icon: "Palette", description: "Destinasi seni dan budaya lokal", status: "hidden" },
];

const initialUsers = [
  { id: 1, name: "Andi Pratama", email: "andi@email.com", avatar: "https://i.pravatar.cc/40?img=1", registeredAt: "2024-01-15", status: "active", totalBookmarks: 23 },
  { id: 2, name: "Siti Rahayu", email: "siti@email.com", avatar: "https://i.pravatar.cc/40?img=5", registeredAt: "2024-02-03", status: "active", totalBookmarks: 41 },
  { id: 3, name: "Budi Santoso", email: "budi@email.com", avatar: "https://i.pravatar.cc/40?img=3", registeredAt: "2024-02-18", status: "suspended", totalBookmarks: 7 },
  { id: 4, name: "Dewi Lestari", email: "dewi@email.com", avatar: "https://i.pravatar.cc/40?img=9", registeredAt: "2024-03-05", status: "active", totalBookmarks: 35 },
  { id: 5, name: "Reza Mahendra", email: "reza@email.com", avatar: "https://i.pravatar.cc/40?img=12", registeredAt: "2024-03-22", status: "active", totalBookmarks: 18 },
  { id: 6, name: "Nadia Putri", email: "nadia@email.com", avatar: "https://i.pravatar.cc/40?img=16", registeredAt: "2024-04-01", status: "active", totalBookmarks: 52 },
  { id: 7, name: "Hendra Wijaya", email: "hendra@email.com", avatar: "https://i.pravatar.cc/40?img=7", registeredAt: "2024-04-14", status: "suspended", totalBookmarks: 3 },
  { id: 8, name: "Fitriani", email: "fitri@email.com", avatar: "https://i.pravatar.cc/40?img=20", registeredAt: "2024-05-02", status: "active", totalBookmarks: 29 },
];

const initialFeatured = [
  { id: 1, destinationId: 1, order: 1, status: "active", addedAt: "2024-06-01" },
  { id: 2, destinationId: 2, order: 2, status: "active", addedAt: "2024-06-01" },
  { id: 3, destinationId: 3, order: 3, status: "inactive", addedAt: "2024-07-01" },
];

const initialActivity = [
  { id: 1, type: "user_registered", text: "Pengguna baru terdaftar", detail: "fitriani@email.com", time: "2 menit lalu" },
  { id: 2, type: "destination_added", text: "Destinasi baru ditambahkan", detail: "Warung Sate Mak Beng", time: "1 jam lalu" },
  { id: 3, type: "destination_updated", text: "Destinasi diperbarui", detail: "Kawah Ijen", time: "3 jam lalu" },
  { id: 4, type: "image_uploaded", text: "Gambar diunggah", detail: "Borobudur Detail", time: "5 jam lalu" },
  { id: 5, type: "featured_changed", text: "Rekomendasi diubah", detail: "Kawah Ijen dinonaktifkan", time: "1 hari lalu" },
];

export const useAppStore = create(
  persist(
    (set, get) => ({
      destinations: initialDestinations,
      categories: initialCategories,
      users: initialUsers,
      featured: initialFeatured,
      activity: initialActivity,

      // ── DESTINATIONS ──
      addDestination: (dest) => {
        const newDest = { ...dest, id: Date.now(), bookmarks: 0, createdAt: new Date().toISOString().split("T")[0] };
        set((s) => ({
          destinations: [...s.destinations, newDest],
          activity: [{ id: Date.now(), type: "destination_added", text: "Destinasi baru ditambahkan", detail: dest.name, time: "Baru saja" }, ...s.activity].slice(0, 20),
        }));
      },
      updateDestination: (id, data) => {
        set((s) => ({
          destinations: s.destinations.map((d) => d.id === id ? { ...d, ...data } : d),
          activity: [{ id: Date.now(), type: "destination_updated", text: "Destinasi diperbarui", detail: data.name, time: "Baru saja" }, ...s.activity].slice(0, 20),
        }));
      },
      deleteDestination: (id) => {
        set((s) => ({
          destinations: s.destinations.filter((d) => d.id !== id),
          featured: s.featured.filter((f) => f.destinationId !== id),
        }));
      },

      // ── CATEGORIES ──
      addCategory: (cat) => set((s) => ({ categories: [...s.categories, { ...cat, id: Date.now() }] })),
      updateCategory: (id, data) => set((s) => ({ categories: s.categories.map((c) => c.id === id ? { ...c, ...data } : c) })),
      deleteCategory: (id) => set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

      // ── USERS ──
      updateUser: (id, data) => set((s) => ({ users: s.users.map((u) => u.id === id ? { ...u, ...data } : u) })),

      // ── FEATURED ──
      addFeatured: (destinationId) => {
        const { featured } = get();
        if (featured.some((f) => f.destinationId === destinationId)) return;
        const maxOrder = featured.length > 0 ? Math.max(...featured.map((f) => f.order)) : 0;
        set((s) => ({
          featured: [...s.featured, { id: Date.now(), destinationId, order: maxOrder + 1, status: "active", addedAt: new Date().toISOString().split("T")[0] }],
          activity: [{ id: Date.now(), type: "featured_changed", text: "Destinasi ditambahkan ke unggulan", detail: s.destinations.find(d=>d.id===destinationId)?.name, time: "Baru saja" }, ...s.activity].slice(0, 20),
        }));
      },
      removeFeatured: (id) => set((s) => ({ featured: s.featured.filter((f) => f.id !== id) })),
      toggleFeaturedStatus: (id) => set((s) => ({
        featured: s.featured.map((f) => f.id === id ? { ...f, status: f.status === "active" ? "inactive" : "active" } : f),
      })),
      moveFeatured: (id, dir) => {
        const { featured } = get();
        const sorted = [...featured].sort((a, b) => a.order - b.order);
        const idx = sorted.findIndex((f) => f.id === id);
        const swapIdx = dir === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= sorted.length) return;
        const updated = sorted.map((f, i) => {
          if (i === idx) return { ...f, order: sorted[swapIdx].order };
          if (i === swapIdx) return { ...f, order: sorted[idx].order };
          return f;
        });
        set({ featured: updated });
      },

      // ── GALLERY (managed via destination.gallery) ──
      addGalleryImage: (destinationId, url) => {
        set((s) => ({
          destinations: s.destinations.map((d) =>
            d.id === destinationId
              ? { ...d, gallery: [...(d.gallery || []).slice(0, 7), url] }
              : d
          ),
          activity: [{ id: Date.now(), type: "image_uploaded", text: "Gambar diunggah ke galeri", detail: s.destinations.find(d=>d.id===destinationId)?.name, time: "Baru saja" }, ...s.activity].slice(0, 20),
        }));
      },
      removeGalleryImage: (destinationId, idx) => {
        set((s) => ({
          destinations: s.destinations.map((d) => {
            if (d.id !== destinationId) return d;
            const newGallery = [...(d.gallery || [])];
            newGallery.splice(idx, 1);
            return { ...d, gallery: newGallery };
          }),
        }));
      },
      reorderGallery: (destinationId, newGallery) => {
        set((s) => ({
          destinations: s.destinations.map((d) => d.id === destinationId ? { ...d, gallery: newGallery } : d),
        }));
      },
      setMainImage: (destinationId, url) => {
        set((s) => ({
          destinations: s.destinations.map((d) => d.id === destinationId ? { ...d, image: url } : d),
        }));
      },
    }),
    {
      name: "wisata-admin-store",
    }
  )
);