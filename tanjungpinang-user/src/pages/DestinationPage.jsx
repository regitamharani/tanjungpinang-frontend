import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { get } from "../services/api";

const panduan = [
  {
    icon: "✈️",
    judul: "Transportasi Udara",
    deskripsi:
      "Bandara Raja Haji Fisabilillah melayani penerbangan dari Jakarta, Batam, dan kota besar lainnya.",
  },
  {
    icon: "🏨",
    judul: "Penginapan",
    deskripsi:
      "Tersedia berbagai pilihan hotel bintang hingga homestay dengan harga terjangkau di pusat kota.",
  },
  {
    icon: "🍜",
    judul: "Kuliner Khas",
    deskripsi:
      "Jangan lewatkan Gonggong kukus, Otak-otak, Mie Tarempa, dan berbagai seafood segar khas Kepulauan Riau.",
  },
  {
    icon: "⛴️",
    judul: "Transportasi Laut",
    deskripsi:
      "Feri tersedia dari Batam dan Johor Bahru Malaysia. Kapal lokal ke Pulau Penyengat beroperasi setiap hari.",
  },
];

const kategoriList = [
  "Semua",
  "Wisata Alam",
  "Wisata Pantai",
  "Wisata Sejarah",
  "Wisata Kuliner",
];

const emojiMap = {
  "Wisata Alam": "🌿",
  "Wisata Pantai": "🏙️",
  "Wisata Sejarah": "🏺",
  "Wisata Kuliner": "🍜",
};

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-16 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3 md:gap-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="text-[#0AAEFF] font-semibold text-base sm:text-lg md:text-xl whitespace-nowrap">
            Tanjung Pinang Guide
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            to="/"
            className="text-sm md:text-base text-gray-500 hover:text-gray-800 transition-colors"
          >
            Home
          </Link>

          <Link
            to="/destination"
            className="text-sm md:text-base font-medium text-[#0AAEFF] border-b-2 border-[#0AAEFF] pb-1"
          >
            Destination
          </Link>

          <Link
            to="/account"
            className="text-sm md:text-base text-gray-500 hover:text-gray-800 transition-colors"
          >
            Account
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="p-3 rounded-full hover:bg-gray-100 transition-colors">
            <img
              src="/search.png"
              alt="Search"
              className="w-6 h-6 object-contain"
            />
          </button>

          <Link
            to="/account"
            className="flex items-center gap-2 bg-[#0AAEFF] text-white px-5 py-2 rounded-full hover:bg-blue-500 transition-colors text-base"
          >
            <img
              src="/Profil.png"
              alt="Profile"
              className="w-5 h-5 object-contain"
            />
            Profile
          </Link>

          <Link
            to="/login"
            className="p-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <img
              src="/keluar.png"
              alt="Logout"
              className="w-6 h-6 object-contain"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors text-2xl text-[#0AAEFF]"
          aria-label="Toggle menu"
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 bg-white border-t border-gray-100">
          <div className="flex flex-col gap-4 pt-4">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="text-base text-gray-500 hover:text-gray-800 transition-colors"
            >
              Home
            </Link>

            <Link
              to="/destination"
              onClick={() => setOpen(false)}
              className="text-base font-medium text-[#0AAEFF]"
            >
              Destination
            </Link>

            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="text-base text-gray-500 hover:text-gray-800 transition-colors"
            >
              Account
            </Link>

            <div className="flex items-center gap-3 pt-2">
              <button className="p-3 rounded-full hover:bg-gray-100 transition-colors">
                <img
                  src="/search.png"
                  alt="Search"
                  className="w-6 h-6 object-contain"
                />
              </button>

              <Link
                to="/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 bg-[#0AAEFF] text-white px-5 py-2 rounded-full hover:bg-blue-500 transition-colors text-base"
              >
                <img
                  src="/Profil.png"
                  alt="Profile"
                  className="w-5 h-5 object-contain"
                />
                Profile
              </Link>

              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                <img
                  src="/keluar.png"
                  alt="Logout"
                  className="w-6 h-6 object-contain"
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// ── Destination Card ──────────────────────────────────────────────────────────
function DestCard({ dest }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link to={`/destination/${dest.slug}`} className="block">
      <div className="rounded-xl overflow-hidden border border-gray-100 bg-white hover:shadow-md transition-shadow duration-200">
        <div className="relative h-44 bg-cyan-50 overflow-hidden">
          {dest.img && !imgError ? (
            <img
              src={dest.img}
              alt={dest.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-cyan-50">
              {emojiMap[dest.kategori] || "🗺️"}
            </div>
          )}

          <span className="absolute top-2.5 left-2.5 bg-[#0AAEFF] text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {dest.kategori}
          </span>

          <span className="absolute top-2.5 right-2.5 bg-white text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
            ⭐ {dest.rating}
          </span>
        </div>

        <div className="bg-[#0AAEFF] px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-tight line-clamp-2">
              {dest.name}
            </p>
            <p className="text-white/75 text-xs mt-0.5">{dest.ulasan}</p>
          </div>

          <span className="text-yellow-300 font-semibold text-sm shrink-0">
            ★ {dest.rating}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Destination Section ───────────────────────────────────────────────────────
function DestinationSection() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await get("/destinations");
        const json = await res.json();
        if (json.success) {
          const mapped = json.data.map((d) => ({
            id: d.id,
            slug: d.slug,
            name: d.nama,
            rating: parseFloat(d.rata_rating || 0).toFixed(1),
            ulasan: `${d.jumlah_ulasan} ulasan`,
            kategori: d.kategori,
            img: d.gambar,
          }));
          setDestinations(mapped);
        }
      } catch {
        // tetap tampilkan kosong jika gagal
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const filtered = destinations.filter((dest) => {
    const matchFilter =
      activeFilter === "Semua" || dest.kategori === activeFilter;
    const matchSearch = dest.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <section className="w-full py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 w-full">
        <div className="w-full md:w-auto">
          <p className="text-lg md:text-xl font-semibold tracking-widest text-[#0AAEFF] uppercase mb-2">
            Pinang Guide
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Semua Destinasi
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-500">
            Jelajahi {loading ? "..." : destinations.length} destinasi wisata terbaik di Tanjung
            Pinang
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 border border-gray-200 rounded-full px-4 py-2 bg-white w-full sm:w-[320px] md:mt-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#aaa"
            strokeWidth="2"
            className="shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari destinasi wisata..."
            className="text-base md:text-xl outline-none bg-transparent text-gray-700 w-full placeholder-gray-400"
          />
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap mb-4 w-full">
        <span className="text-sm md:text-base text-gray-500 flex items-center gap-2 mr-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          Filter:
        </span>

        {kategoriList.map((kategori) => (
          <button
            key={kategori}
            type="button"
            onClick={() => setActiveFilter(kategori)}
            className={`text-sm md:text-base px-3 py-1.5 rounded-full border transition-colors ${
              activeFilter === kategori
                ? "bg-[#0AAEFF] text-white border-[#0AAEFF]"
                : "bg-white text-gray-600 border-gray-200 hover:border-cyan-300"
            }`}
          >
            {kategori}
          </button>
        ))}
      </div>

      <p className="text-sm md:text-lg text-gray-400 text-left sm:text-right mb-6">
        Menampilkan{" "}
        <span className="text-[#0AAEFF] font-semibold">{filtered.length}</span>{" "}
        destinasi
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {loading ? (
          <div className="sm:col-span-2 text-center py-20 text-gray-400 text-lg">
            Memuat destinasi...
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((dest) => <DestCard key={dest.id} dest={dest} />)
        ) : (
          <div className="sm:col-span-2 text-center py-20 text-gray-400 text-lg md:text-xl">
            Tidak ada destinasi yang sesuai.
          </div>
        )}
      </div>
    </section>
  );
}

// ── Panduan Section ───────────────────────────────────────────────────────────
function PanduanSection() {
  return (
    <section className="mb-16">
      <p className="text-xs font-semibold tracking-widest text-[#0AAEFF] uppercase mb-1">
        Tips Perjalanan
      </p>

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Panduan Wisata
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {panduan.map((item) => (
          <div
            key={item.judul}
            className="border border-gray-100 rounded-xl p-5 bg-white hover:border-cyan-200 transition-colors"
          >
            <div className="text-2xl mb-3">{item.icon}</div>

            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              {item.judul}
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed">
              {item.deskripsi}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#0AAEFF] px-6 md:px-12 py-16">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Deskripsi */}
          <div>
            <div className="flex items-center gap-2 text-white font-semibold mb-4 text-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  stroke="#fff"
                  strokeWidth="2"
                  fill="none"
                />
                <circle cx="12" cy="9" r="3" stroke="#fff" strokeWidth="2" />
              </svg>
              Pinang Guide
            </div>

            <p className="text-white/75 text-sm md:text-base leading-relaxed mb-5">
              Panduan wisata terbaik di Tanjung Pinang, Kepulauan Riau. Temukan
              destinasi, kuliner, dan budaya terbaik.
            </p>

            <div className="flex gap-2">
              <a
                href="https://instagram.com/akunmu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <img
                  src="/ig.png"
                  alt="Instagram"
                  className="w-5 h-5 object-contain"
                />
              </a>

              <a
                href="https://facebook.com/akunmu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <img
                  src="/fb.png"
                  alt="Facebook"
                  className="w-5 h-5 object-contain"
                />
              </a>

              <a
                href="https://twitter.com/akunmu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <img
                  src="/twiter.png"
                  alt="Twitter"
                  className="w-5 h-5 object-contain"
                />
              </a>

              <a
                href="https://youtube.com/channel/akunmu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <img
                  src="/yt.png"
                  alt="YouTube"
                  className="w-5 h-5 object-contain"
                />
              </a>
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-white text-base md:text-lg font-semibold mb-4 uppercase tracking-wide">
              Navigasi
            </h4>

            {["Home", "Destination", "Account"].map((item) => (
              <a
                key={item}
                href="#"
                className="block text-white/75 text-base md:text-sm mb-3 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Kategori Wisata */}
          <div>
            <h4 className="text-white text-base md:text-lg font-semibold mb-4 uppercase tracking-wide">
              Kategori Wisata
            </h4>

            {[
              "Wisata Alam",
              "Wisata Pantai",
              "Wisata Sejarah",
              "Kuliner",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="block text-white/75 text-base md:text-sm mb-3 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-white text-base md:text-lg font-semibold mb-4 uppercase tracking-wide">
              Kontak
            </h4>

            <p className="text-white/75 text-base md:text-sm mb-3">
              📍 Tanjung Pinang, Kepulauan Riau
            </p>

            <p className="text-white/75 text-base md:text-sm mb-3">
              ✉️ info@pinangguide.id
            </p>

            <p className="text-white/75 text-base md:text-sm">
              📞 +62 771 123 456
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/25 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-white/60 text-base md:text-sm">
            © 2025 Pinang Guide. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-4 md:gap-8">
            {["Kebijakan Privasi", "Syarat & Ketentuan", "Sitemap"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-white/60 text-base md:text-sm hover:text-white transition-colors"
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DestinationPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <DestinationSection />
        <PanduanSection />
      </main>

      <Footer />
    </div>
  );
}