import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  ArrowLeft,
  Plane,
  Home,
  Utensils,
  Ship,
  Bike,
  Lightbulb,
  Hotel,
  Info,
  RefreshCw,
} from "lucide-react";
import Footer from "@/components/layout/Footer";

const API_URL = "http://localhost:3000/api";

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

interface TravelGuide {
  id: number;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

const ICON_MAP = {
  Plane,
  Bike,
  Lightbulb,
  Hotel,
  MapPin,
  Info,
  Home,
  Utensils,
  Ship,
};

function GuideIcon({
  icon,
  className = "w-6 h-6",
}: {
  icon: string;
  className?: string;
}) {
  const Icon = ICON_MAP[icon as keyof typeof ICON_MAP] || Info;
  return <Icon className={className} />;
}

const isActiveValue = (value: unknown) => {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true" ||
    value === "active" ||
    value === "aktif"
  );
};

const toNumber = (value: unknown, fallback = 0) => {
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? fallback : numberValue;
};

const normalizeDestination = (item: any): Destination => {
  return {
    id: toNumber(item.id, 0),
    slug: item.slug || "",
    name: item.name || item.nama || "Destinasi",
    category: item.category || item.kategori || "Wisata",
    location: item.location || item.lokasi || "-",
    description: item.description || item.deskripsi || "",
    image: item.image || item.mainImage || item.gambar || item.img || "",
    ratingAverage: toNumber(
      item.ratingAverage ?? item.rating_average ?? item.rata_rating,
      0
    ),
    reviewCount: toNumber(
      item.reviewCount ?? item.review_count ?? item.jumlah_ulasan,
      0
    ),
    visitCount: toNumber(
      item.visitCount ??
        item.visit_count ??
        item.views ??
        item.kunjungan ??
        item.jumlah_kunjungan,
      0
    ),
    isPublished: isActiveValue(
      item.isPublished ?? item.is_published ?? item.status ?? true
    ),
  };
};

const normalizeGuide = (item: any, index: number): TravelGuide => {
  return {
    id: toNumber(item.id, index + 1),
    title: item.title || "Panduan Liburan",
    description: item.description || "",
    icon: item.icon || "Info",
    sortOrder: toNumber(item.sortOrder ?? item.sort_order, index + 1),
    isActive: isActiveValue(item.isActive ?? item.is_active ?? true),
  };
};

export default function DestinationPage() {
  const [searchParams] = useState(
    () => new URLSearchParams(window.location.search)
  );

  const defaultKategori = searchParams.get("kategori") || "Semua";

  const [activeKategori, setActiveKategori] = useState(
    defaultKategori === "all" ? "Semua" : defaultKategori
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [travelGuides, setTravelGuides] = useState<TravelGuide[]>([]);

  const [loading, setLoading] = useState(true);
  const [guideLoading, setGuideLoading] = useState(true);
  const [error, setError] = useState("");
  const [guideError, setGuideError] = useState("");

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/destinations`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Gagal mengambil data destinasi");
        setDestinations([]);
        return;
      }

      const data = Array.isArray(json.data) ? json.data : [];
      setDestinations(data.map(normalizeDestination));
    } catch {
      setError(
        "Tidak bisa terhubung ke server. Pastikan backend Express sudah berjalan."
      );
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTravelGuides = async () => {
    try {
      setGuideLoading(true);
      setGuideError("");

      const res = await fetch(`${API_URL}/travel-guides`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setGuideError(json.message || "Gagal mengambil panduan liburan");
        setTravelGuides([]);
        return;
      }

      const data = Array.isArray(json.data) ? json.data : [];
      setTravelGuides(
        data
          .map(normalizeGuide)
          .filter((guide) => guide.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder)
      );
    } catch {
      setGuideError(
        "Tidak bisa mengambil panduan liburan dari database."
      );
      setTravelGuides([]);
    } finally {
      setGuideLoading(false);
    }
  };

  const fetchPageData = async () => {
    await Promise.all([fetchDestinations(), fetchTravelGuides()]);
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      const query = searchQuery.toLowerCase();

      const matchCat =
        activeKategori === "Semua" || destination.category === activeKategori;

      const matchSearch =
        destination.name.toLowerCase().includes(query) ||
        destination.location.toLowerCase().includes(query) ||
        destination.category.toLowerCase().includes(query);

      return matchCat && matchSearch && destination.isPublished;
    });
  }, [destinations, activeKategori, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <div className="flex-1">
        <div className="bg-primary/5 pb-12 pt-8">
          <div className="max-w-7xl mx-auto px-6 container">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Beranda
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Eksplorasi Destinasi
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mb-10">
              Temukan berbagai pilihan destinasi wisata menarik di Tanjung
              Pinang untuk melengkapi liburan Anda.
            </p>

            <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
              <div className="relative w-full md:w-96 bg-white rounded-full shadow-sm flex items-center px-4 py-2 border border-border">
                <Search className="w-5 h-5 text-muted-foreground mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Cari nama, lokasi, atau kategori..."
                  className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={fetchPageData}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    loading || guideLoading ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </button>
            </div>

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
          {loading ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-border">
              <RefreshCw className="w-10 h-10 text-muted-foreground mx-auto mb-4 animate-spin opacity-60" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Memuat destinasi...
              </h3>
              <p className="text-muted-foreground">
                Sedang mengambil data dari database.
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-border">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Gagal memuat destinasi
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {error}
              </p>
              <button
                onClick={fetchDestinations}
                className="mt-6 text-primary font-medium hover:underline"
              >
                Coba Lagi
              </button>
            </div>
          ) : filteredDestinations.length > 0 ? (
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
                  <Link
                    href={`/destination/${dest.slug}`}
                    className="block h-full bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {dest.image ? (
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/40">
                          <MapPin className="w-12 h-12" />
                        </div>
                      )}

                      <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-md text-xs font-semibold text-foreground rounded-full shadow-sm">
                        {dest.category}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 fill-current text-yellow-500 stroke-yellow-500" />
                            <span className="font-bold text-sm">
                              {Number(dest.ratingAverage || 0).toFixed(1)}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              (
                              {Number(dest.reviewCount || 0).toLocaleString(
                                "id-ID"
                              )}
                              )
                            </span>
                          </div>

                          <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                            👁{" "}
                            {Number(dest.visitCount || 0).toLocaleString(
                              "id-ID"
                            )}
                          </div>
                        </div>

                        <h3 className="font-bold text-xl text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {dest.name}
                        </h3>

                        <div className="flex items-center gap-1 mt-2 text-muted-foreground text-sm">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{dest.location}</span>
                        </div>

                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                          {dest.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-border">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Belum ada destinasi dalam kategori ini
              </h3>
              <p className="text-muted-foreground">
                Coba ubah kata kunci pencarian atau kategori Anda.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveKategori("Semua");
                }}
                className="mt-6 text-primary font-medium hover:underline"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>

        <div
          id="panduan"
          className="max-w-7xl mx-auto px-6 container py-16 border-t border-border"
        >
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">
              Panduan Liburan
            </p>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Panduan Liburan ke Tanjung Pinang
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Informasi penting dari admin agar perjalanan Anda lebih mudah,
              nyaman, dan terencana.
            </p>
          </div>

          {guideLoading ? (
            <div className="py-14 text-center bg-white border border-border rounded-2xl">
              <RefreshCw className="w-8 h-8 text-muted-foreground mx-auto mb-3 animate-spin opacity-60" />
              <p className="text-sm text-muted-foreground">
                Memuat panduan liburan...
              </p>
            </div>
          ) : guideError ? (
            <div className="py-14 text-center bg-white border border-border rounded-2xl">
              <Info className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
              <p className="text-sm text-muted-foreground">{guideError}</p>
              <button
                onClick={fetchTravelGuides}
                className="mt-4 text-primary text-sm font-semibold hover:underline"
              >
                Coba Lagi
              </button>
            </div>
          ) : travelGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {travelGuides.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <GuideIcon icon={guide.icon} />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-foreground">
                      {guide.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      #{guide.sortOrder}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {guide.description || "Belum ada deskripsi panduan."}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-14 text-center bg-white border border-border rounded-2xl">
              <Info className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
              <p className="text-sm text-muted-foreground">
                Belum ada panduan liburan aktif dari admin.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}