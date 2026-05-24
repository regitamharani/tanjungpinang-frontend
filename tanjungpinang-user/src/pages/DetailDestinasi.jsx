import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { get, post, del, isLoggedIn } from "../services/api";

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
          {open ? "x" : "="}
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

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#0AAEFF] px-6 md:px-12 py-16">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
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
              Panduan wisata terbaik di Tanjung Pinang, Kepulauan Riau.
            </p>
          </div>

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

          <div>
            <h4 className="text-white text-base md:text-lg font-semibold mb-4 uppercase tracking-wide">
              Kategori Wisata
            </h4>
            {["Wisata Alam", "Wisata Pantai", "Wisata Sejarah", "Kuliner"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-white/75 text-base md:text-sm mb-3 hover:text-white transition-colors"
                >
                  {item}
                </a>
              )
            )}
          </div>

          <div>
            <h4 className="text-white text-base md:text-lg font-semibold mb-4 uppercase tracking-wide">
              Kontak
            </h4>
            <p className="text-white/75 text-base md:text-sm mb-3">
              Tanjung Pinang, Kepulauan Riau
            </p>
            <p className="text-white/75 text-base md:text-sm mb-3">
              info@pinangguide.id
            </p>
            <p className="text-white/75 text-base md:text-sm">
              +62 771 123 456
            </p>
          </div>
        </div>

        <div className="border-t border-white/25 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-white/60 text-base md:text-sm">
            2025 Pinang Guide. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function DetailDestinasi() {
  const { slug } = useParams();
  const [dest, setDest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorit, setFavorit] = useState(false);
  const loggedIn = isLoggedIn();

  useEffect(() => {
    const fetchDest = async () => {
      try {
        const res = await get(`/destinations/slug/${slug}`);
        const json = await res.json();

        if (json.success) {
          const d = json.data;
          const mapped = {
            id: d.id,
            slug: d.slug,
            name: d.nama,
            kategori: d.kategori,
            rating: parseFloat(d.rata_rating || 0),
            ulasan: d.jumlah_ulasan,
            lokasi: d.lokasi,
            jamBuka: d.jam_buka,
            hargaTiket: d.harga_tiket,
            alamat: d.alamat,
            telepon: d.telepon,
            img: d.gambar,
            tentang: d.tentang,
            tips: Array.isArray(d.tips) ? d.tips : [],
            fasilitas: Array.isArray(d.fasilitas) ? d.fasilitas : [],
          };
          setDest(mapped);

          if (loggedIn) {
            const bmRes = await get("/bookmarks");
            const bmJson = await bmRes.json();
            if (bmJson.success) {
              setFavorit(bmJson.data.some((b) => b.id === d.id));
            }
          } else {
            const saved = JSON.parse(localStorage.getItem("favorit") || "[]");
            setFavorit(saved.some((f) => f.slug === slug));
          }

          const dilihat = JSON.parse(localStorage.getItem("dilihat") || "[]");
          if (!dilihat.some((x) => x.id === d.id)) {
            localStorage.setItem(
              "dilihat",
              JSON.stringify([mapped, ...dilihat].slice(0, 10))
            );
          }
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchDest();
  }, [slug]);

  const handleFavorit = async () => {
    if (!dest) return;
    if (loggedIn) {
      try {
        if (favorit) {
          await del(`/bookmarks/${dest.id}`);
        } else {
          await post(`/bookmarks/${dest.id}`, {});
        }
        setFavorit(!favorit);
      } catch {
        // silent
      }
    } else {
      const saved = JSON.parse(localStorage.getItem("favorit") || "[]");
      if (favorit) {
        localStorage.setItem(
          "favorit",
          JSON.stringify(saved.filter((f) => f.slug !== dest.slug))
        );
      } else {
        localStorage.setItem("favorit", JSON.stringify([...saved, dest]));
      }
      setFavorit(!favorit);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] text-gray-400 text-lg">
          Memuat destinasi...
        </div>
      </div>
    );
  }

  if (!dest) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-gray-400 text-lg">Destinasi tidak ditemukan.</p>
          <Link
            to="/destination"
            className="text-[#0AABCF] hover:underline text-sm"
          >
            Kembali ke Daftar Destinasi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[460px] overflow-hidden">
        <img
          src={dest.img}
          alt={dest.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <Link
          to="/destination"
          className="absolute top-4 left-6 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-white/30 hover:bg-white/30 transition-colors"
        >
          Kembali
        </Link>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="inline-block bg-[#0AABCF] text-white text-xs px-2.5 py-1 rounded-full mb-2">
            {dest.kategori}
          </span>
          <h1 className="text-2xl font-bold text-white mb-1">{dest.name}</h1>
          <div className="flex items-center gap-4 text-white/80 text-xs flex-wrap">
            <span className="text-yellow-400">
              {"★".repeat(Math.floor(dest.rating))} {dest.rating.toFixed(1)}
            </span>
            <span>📍 {dest.lokasi}</span>
            <span>🕐 {dest.jamBuka}</span>
          </div>
        </div>
      </div>

      {/* Favorit Button */}
      <div className="max-w-3xl mx-auto px-6 py-4">
        <button
          onClick={handleFavorit}
          className={`w-full py-2.5 rounded-full text-sm font-medium border transition-colors flex items-center justify-center gap-2 ${
            favorit
              ? "bg-red-50 border-red-300 text-red-500"
              : "bg-white border-[#0AABCF] text-[#0AABCF] hover:bg-cyan-50"
          }`}
        >
          {favorit ? "Hapus dari Favorit" : "Tambah ke Favorit"}
        </button>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-16 space-y-8">
        {/* Tentang */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Tentang Destinasi
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">{dest.tentang}</p>
        </div>

        {/* Tips */}
        {dest.tips.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#0AABCF]">📍</span> Tips Berkunjung
            </h2>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {dest.tips.map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="text-[#0AABCF] mt-0.5">✓</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fasilitas */}
        {dest.fasilitas.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Fasilitas
            </h2>
            <div className="flex flex-wrap gap-2">
              {dest.fasilitas.map((f, i) => (
                <span
                  key={i}
                  className="text-xs bg-cyan-50 text-[#0AABCF] px-3 py-1.5 rounded-full border border-cyan-100"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Lokasi */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">Lokasi</h2>
          <div className="rounded-xl overflow-hidden border border-cyan-100">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                dest.name + " " + dest.alamat
              )}&output=embed`}
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title={`Lokasi ${dest.name}`}
            />
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(
                dest.name + " " + dest.alamat
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block m-4 bg-[#0AABCF] text-white text-xs px-4 py-2 rounded-full hover:bg-cyan-600 transition-colors"
            >
              Buka di Google Maps
            </a>
          </div>
        </div>

        {/* Informasi Kunjungan */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Informasi Kunjungan
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
                <span className="text-sm">🕐</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Jam Buka</p>
                <p className="text-sm text-gray-700">{dest.jamBuka}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
                <span className="text-sm">🎟️</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Harga Tiket</p>
                <p className="text-sm text-gray-700">{dest.hargaTiket}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
                <span className="text-sm">📍</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Lokasi</p>
                <p className="text-sm text-gray-700">{dest.alamat}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
                <span className="text-sm">⭐</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Rating</p>
                <p className="text-sm text-gray-700">
                  {dest.rating.toFixed(1)} / 5 ({dest.ulasan.toLocaleString()} ulasan)
                </p>
              </div>
            </div>
          </div>

          {/* Rating bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-400">Rating Keseluruhan</p>
              <p className="text-xs font-semibold text-[#0AABCF]">
                {dest.rating.toFixed(1)}/5
              </p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-[#0AABCF] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(dest.rating / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
