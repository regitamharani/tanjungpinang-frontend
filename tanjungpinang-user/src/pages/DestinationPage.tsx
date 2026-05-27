import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, MapPin, Star, ArrowLeft, Plane, Home, Utensils, Ship } from "lucide-react";
import Footer from "@/components/layout/Footer";

const KATEGORI_LIST = [
  "Semua",
  "Wisata Alam",
  "Wisata Pantai",
  "Wisata Sejarah",
  "Wisata Kuliner",
  "Wisata Budaya",
  "Wisata Religi",
];

interface Destination {
  id: number;
  slug: string;
  name: string;
  category: string;
  location: string;
  description: string;
  image: string;
  ratingAverage: number;
  reviewCount: number;
  visitCount: number;
  isPublished: boolean;
}

const dummyDestinations: Destination[] = [
  { id: 1, slug: 'masjid-raya-penyengat', name: 'Masjid Raya Sultan Riau Penyengat', category: 'Wisata Religi', location: 'Pulau Penyengat', description: 'Masjid bersejarah yang konon dibangun dengan campuran putih telur.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Masjid_Raya_Sultan_Riau_Penyengat.jpg/1280px-Masjid_Raya_Sultan_Riau_Penyengat.jpg', ratingAverage: 4.9, reviewCount: 2087, visitCount: 45200, isPublished: true },
  { id: 2, slug: 'pantai-trikora', name: 'Pantai Trikora', category: 'Wisata Pantai', location: 'Bintan Timur', description: 'Pantai berpasir putih dengan air jernih dan pemandangan indah.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000', ratingAverage: 4.7, reviewCount: 3240, visitCount: 38900, isPublished: true },
  { id: 3, slug: 'gurun-pasir-busung', name: 'Gurun Pasir Busung', category: 'Wisata Alam', location: 'Bintan Timur', description: 'Hamparan pasir putih luas seperti gurun sahara di tengah pulau.', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1000', ratingAverage: 4.6, reviewCount: 1897, visitCount: 28750, isPublished: true },
  { id: 4, slug: 'patung-seribu', name: 'Patung Seribu', category: 'Wisata Budaya', location: 'Tanjung Pinang', description: 'Kawasan penuh patung tradisional yang menceritakan sejarah dan budaya Melayu.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000', ratingAverage: 4.5, reviewCount: 1456, visitCount: 22300, isPublished: true },
  { id: 5, slug: 'melayu-square', name: 'Melayu Square', category: 'Wisata Kuliner', location: 'Tanjung Pinang', description: 'Pusat kuliner dan belanja dengan nuansa budaya Melayu yang kental.', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000', ratingAverage: 4.4, reviewCount: 893, visitCount: 19800, isPublished: true },
  { id: 6, slug: 'vihara-avalokitesvara', name: 'Vihara Avalokitesvara', category: 'Wisata Religi', location: 'Tanjung Pinang', description: 'Vihara tertua dan terbesar di Tanjung Pinang dengan arsitektur Tiongkok yang megah.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000', ratingAverage: 4.8, reviewCount: 1780, visitCount: 31500, isPublished: true },
  { id: 7, slug: 'pantai-batu-hitam', name: 'Pantai Batu Hitam', category: 'Wisata Pantai', location: 'Bintan Utara', description: 'Pantai unik dengan batuan granit hitam besar yang menjadi daya tarik utama.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', ratingAverage: 4.3, reviewCount: 654, visitCount: 16200, isPublished: true },
  { id: 8, slug: 'bukit-kucing', name: 'Bukit Kucing', category: 'Wisata Alam', location: 'Tanjung Pinang', description: 'Spot terbaik untuk menikmati panorama kota Tanjung Pinang dari ketinggian.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000', ratingAverage: 4.4, reviewCount: 892, visitCount: 17400, isPublished: true },
];

export default function DestinationPage() {
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const defaultKategori = searchParams.get("kategori") || "Semua";
  
  const [activeKategori, setActiveKategori] = useState(defaultKategori === "all" ? "Semua" : defaultKategori);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDestinations = dummyDestinations.filter((d) => {
    const matchCat = activeKategori === "Semua" || d.category === activeKategori;
    const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <div className="flex-1">
        <div className="bg-primary/5 pb-12 pt-8">
          <div className="max-w-7xl mx-auto px-6 container">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Beranda
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Eksplorasi Destinasi</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-10">
              Temukan berbagai pilihan destinasi wisata menarik di Tanjung Pinang untuk melengkapi liburan Anda.
            </p>

            <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-96 bg-white rounded-full shadow-sm flex items-center px-4 py-2 border border-border">
                <Search className="w-5 h-5 text-muted-foreground mr-2 shrink-0" />
                <input 
                  type="text"
                  placeholder="Cari nama destinasi..."
                  className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-hide no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
              {KATEGORI_LIST.map((kat) => (
                <button
                  key={kat}
                  onClick={() => setActiveKategori(kat)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeKategori === kat
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-white text-muted-foreground border border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 container py-12 min-h-[400px]">
          {filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((dest, i) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                  className="group h-full"
                >
                  <Link href={`/destination/${dest.slug}`} className="block h-full bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-md text-xs font-semibold text-foreground rounded-full shadow-sm">
                        {dest.category}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col h-[calc(100%-75%)] justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 fill-current text-yellow-500 stroke-yellow-500" />
                            <span className="font-bold text-sm">{dest.ratingAverage}</span>
                            <span className="text-muted-foreground text-xs">({dest.reviewCount})</span>
                          </div>
                          <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                            👁 {dest.visitCount.toLocaleString('id-ID')}
                          </div>
                        </div>
                        <h3 className="font-bold text-xl text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {dest.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-2 text-muted-foreground text-sm">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{dest.location}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-border">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-foreground mb-2">Belum ada destinasi dalam kategori ini</h3>
              <p className="text-muted-foreground">Coba ubah kata kunci pencarian atau kategori Anda.</p>
              <button onClick={() => {setSearchQuery(""); setActiveKategori("Semua");}} className="mt-6 text-primary font-medium hover:underline">
                Reset Pencarian
              </button>
            </div>
          )}
        </div>

        {/* Tips Guide Section */}
        <div id="panduan" className="max-w-7xl mx-auto px-6 container py-16 border-t border-border">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Panduan Liburan ke Tanjung Pinang</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Transportasi Udara</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Penerbangan langsung ke Bandara Raja Haji Fisabilillah (TNJ) tersedia dari Jakarta (CGK) setiap harinya.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Penginapan</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tersedia dari hotel bintang 4, resort pinggir pantai, hingga homestay budget yang nyaman di pusat kota.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Kuliner Khas</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Wajib mencoba Gonggong (Siput laut), Mie Lendir, Otak-otak, dan Kopi khas kedai lokal di pagi hari.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-500 flex items-center justify-center mb-4">
                <Ship className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Transportasi Laut</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Gunakan kapal feri dari Pelabuhan Sri Bintan Pura menuju Batam, Singapura, atau pulau-pulau sekitarnya.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
