import { useState } from "react";
import { Link } from "react-router-dom";
import AIChatGuide from "../components/AIChatGuide";

const destinations = [
  {
    id: 1,
    slug: "patung-seribu",
    name: "Patung Seribu",
    ulasan: "1.245 ulasan",
    rating: 4.7,
    img: "/patung-seribuu.jpg",
  },
  {
    id: 2,
    slug: "masijd-raya-penyengat",
    name: "Masjid Raya Sultan Riau Penyengat",
    ulasan: "2.087 ulasan",
    rating: 4.9,
    img: "/masjid-raya.jpg",
  },
  {
    id: 3,
    slug: "melayu-square",
    name: "Melayu Square",
    ulasan: "893 ulasan",
    rating: 4.5,
    img: "/melayu-square.jpg",
  },
  {
    id: 4,
    slug: "gurun-pasir",
    name: "Gurun Pasir Busung",
    ulasan: "1.565 ulasan",
    rating: 4.4,
    img: "/gurun-pasir.jpg",
  },
];

const kategori = [
  {
    iconSrc: "/Alam.png",
    label: "Wisata Alam",
    desc: "Alam terbuka",
    jumlah: "12 tempat",
  },
  {
    iconSrc: "/Sejarah.png",
    label: "Wisata Sejarah",
    desc: "Sejarah",
    jumlah: "8 tempat",
  },
  {
    iconSrc: "/Kuliner.png",
    label: "Kuliner",
    desc: "Cita rasa khas Kepri",
    jumlah: "15 tempat",
  },
  {
    iconSrc: "/Pantai.png",
    label: "Ikon Pantai",
    desc: "Pantai",
    jumlah: "5 tempat",
  },
];

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-16 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3 md:gap-4">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <span className="text-[#0AAEFF] font-semibold text-base sm:text-lg md:text-xl whitespace-nowrap">
            Tanjung Pinang Guide
          </span>
        </div>

        {/* Navigation Links Desktop */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            to="/"
            className="text-sm md:text-base font-medium text-[#0AAEFF] border-b-2 border-[#0AAEFF] pb-1"
          >
            Home
          </Link>
          <Link
            to="/destination"
            className="text-sm md:text-base text-gray-500 hover:text-gray-800 transition-colors"
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

        {/* Search & Profile Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <button className="p-3 rounded-full hover:bg-gray-100 transition-colors">
            <img src="/search.png" alt="Search" className="w-6 h-6 object-contain" />
          </button>

          <Link
            to="/account"
            className="flex items-center gap-2 bg-[#0AAEFF] text-white px-5 py-2 rounded-full hover:bg-blue-500 transition-colors text-base"
          >
            <img src="/Profil.png" alt="Profile" className="w-5 h-5 object-contain" />
            Profile
          </Link>

          <Link
            to="/login"
            className="p-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <img src="/keluar.png" alt="Logout" className="w-6 h-6 object-contain" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors text-2xl text-[#0AAEFF]"
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
              className="text-base font-medium text-[#0AAEFF]"
            >
              Home
            </Link>

            <Link
              to="/destination"
              onClick={() => setOpen(false)}
              className="text-base text-gray-500 hover:text-gray-800 transition-colors"
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
                <img src="/search.png" alt="Search" className="w-6 h-6 object-contain" />
              </button>

              <Link
                to="/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 bg-[#0AAEFF] text-white px-5 py-2 rounded-full hover:bg-blue-500 transition-colors text-base"
              >
                <img src="/Profil.png" alt="Profile" className="w-5 h-5 object-contain" />
                Profile
              </Link>

              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                <img src="/keluar.png" alt="Logout" className="w-6 h-6 object-contain" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-[610px] md:flex md:items-center overflow-hidden pb-6 md:pb-0">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/backgroound.jpg')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 px-6 sm:px-10 py-16 max-w-4xl">
        <span className="inline-flex items-center gap-1.5 bg-[#0AAEFF] text-white text-sm md:text-base px-4 py-2 rounded-full mb-6">
          📍 Kepulauan Riau, Indonesia
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-2">
          Jelajahi Keindahan
        </h1>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-[#0AAEFF] leading-tight mb-6">
          Tanjung Pinang
        </h1>

        <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-lg mb-8">
          Temukan destinasi wisata, kuliner lezat, dan budaya yang kaya di kota tertua di Provinsi Kepulauan Riau.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button className="flex items-center gap-2 bg-[#0AAEFF] text-white text-base md:text-xl px-5 md:px-7 py-3 md:py-4 rounded-full hover:bg-blue-500 transition-colors font-medium">
            Jelajahi Sekarang →
          </button>

          <button className="text-white text-base md:text-xl px-5 md:px-7 py-3 md:py-4 rounded-full border-2 border-white hover:bg-white/10 transition-colors">
            Lihat Semua
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="relative z-10 mx-6 sm:mx-10 md:mx-0 md:absolute md:bottom-6 md:right-10 bg-white rounded-3xl px-6 sm:px-8 md:px-12 py-6 md:py-8 flex flex-col sm:flex-row items-center gap-6 md:gap-16 shadow-xl">
        <div className="text-center">
          <p className="text-[#0AAEFF] font-bold text-3xl md:text-5xl">50+</p>
          <p className="text-gray-500 text-sm md:text-lg mt-1">Destinasi</p>
        </div>

        <div className="hidden sm:block w-px h-12 bg-gray-200" />

        <div className="text-center">
          <p className="text-[#0AAEFF] font-bold text-3xl md:text-5xl">4.8</p>
          <p className="text-gray-500 text-sm md:text-lg mt-1">Rating</p>
        </div>

        <div className="hidden sm:block w-px h-12 bg-gray-200" />

        <div className="text-center">
          <p className="text-[#0AAEFF] font-bold text-3xl md:text-5xl">10K+</p>
          <p className="text-gray-500 text-sm md:text-lg mt-1">Pengunjung</p>
        </div>
      </div>
    </section>
  );
}

// ── Kategori Section ──────────────────────────────────────────────────────────
function KategoriSection() {
  return (
    <section className="px-6 md:px-12 py-12 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm md:text-base font-semibold tracking-widest text-[#0AAEFF] uppercase mb-2">
              KATEGORI WISATA
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Temukan Sesuai Minat
            </h2>
          </div>

          <a
            href="/destination"
            className="text-sm md:text-base text-[#0AAEFF] hover:underline mt-1"
          >
            Lihat Semua →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {kategori.map((k) => (
            <div
              key={k.label}
              className="bg-white border border-gray-100 rounded-2xl py-16 px-8 text-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="w-20 h-20 rounded-full bg-cyan-50 flex items-center justify-center mx-auto mb-5">
                <img
                  src={k.iconSrc}
                  alt={k.label}
                  className="w-9 h-9 object-contain"
                />
              </div>

              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                {k.label}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed mb-7">
                {k.desc}
              </p>

              <span className="inline-block bg-cyan-50 text-[#0AAEFF] text-sm font-semibold px-4 py-1.5 rounded-full">
                {k.jumlah}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Destinasi Unggulan ────────────────────────────────────────────────────────
function DestinationCard({ dest }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link to={`/destination/${dest.slug}`}>
      <div className="relative rounded-2xl overflow-hidden h-80 sm:h-96 cursor-pointer group shadow-lg hover:shadow-2xl transition-shadow">
        {dest.img && !imgError ? (
          <img
            src={dest.img}
            alt={dest.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-cyan-100 flex items-center justify-center text-6xl">
            🗺️
          </div>
        )}

        {/* Info box bawah */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#0AAEFF] text-white px-4 py-5 rounded-b-2xl">
          <p className="font-semibold text-lg md:text-xl">{dest.name}</p>
          <p className="text-yellow-400 text-base md:text-base mt-1">
            ★ {dest.rating} ({dest.ulasan})
          </p>
        </div>
      </div>
    </Link>
  );
}

function DestinationUnggulan() {
  return (
    <section className="px-6 md:px-12 py-12 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm md:text-base font-semibold tracking-widest text-[#0AAEFF] uppercase mb-2">
              Destinasi Pilihan
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0AAEFF]">
              Destinasi Unggulan
            </h2>
          </div>
          <a href="/destination" className="text-sm md:text-base text-[#0AAEFF] hover:underline mt-1">
            Lihat Semua →
          </a>
        </div>

        {/* Grid 2 kolom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
          {destinations.map((d) => (
            <DestinationCard key={d.id} dest={d} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Banner ────────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="px-6 md:px-12 py-12 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="bg-[#0AAEFF] rounded-[36px] md:rounded-[70px] px-6 sm:px-10 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-white/70 text-sm md:text-sm uppercase tracking-widest mb-2">
              Siap Berpetualang?
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-snug">
              Siap Menjelajahi <br /> Tanjung Pinang?
            </h2>
            <p className="text-white/75 text-sm md:text-base leading-relaxed max-w-md mx-auto md:mx-0">
              Temukan semua destinasi wisata terbaik lengkap dengan info tiket, jam buka, dan tips perjalanan yang berguna.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-white text-[#0AAEFF] text-sm md:text-base font-semibold px-6 py-3 rounded-full shadow-sm hover:shadow transition-shadow whitespace-nowrap">
            Mulai Jelajahi →
          </button>
        </div>
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
              Panduan wisata terbaik di Tanjung Pinang, Kepulauan Riau. Temukan destinasi, kuliner, dan budaya terbaik.
            </p>

            <div className="flex gap-2">
              {/* Instagram */}
              <a
                href="https://instagram.com/akunmu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <img src="/ig.png" alt="Instagram" className="w-5 h-5 object-contain" />
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/akunmu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <img src="/fb.png" alt="Facebook" className="w-5 h-5 object-contain" />
              </a>

              {/* Twitter/X */}
              <a
                href="https://twitter.com/akunmu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <img src="/twiter.png" alt="Twitter" className="w-5 h-5 object-contain" />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/channel/akunmu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <img src="/yt.png" alt="YouTube" className="w-5 h-5 object-contain" />
              </a>
            </div>
          </div>

          {/* Navigasi */}
<div>
  <h4 className="text-white text-base md:text-lg font-semibold mb-4 uppercase tracking-wide">
    Navigasi
  </h4>

  <a
    href="/"
    className="block text-white/75 text-base md:text-sm mb-3 hover:text-white transition-colors"
  >
    Home
  </a>

  <a
    href="/destination"
    className="block text-white/75 text-base md:text-sm mb-3 hover:text-white transition-colors"
  >
    Destination
  </a>

  <a
    href="/account"
    className="block text-white/75 text-base md:text-sm mb-3 hover:text-white transition-colors"
  >
    Account
  </a>
</div>

          {/* Kategori Wisata */}
<div>
  <h4 className="text-white text-base md:text-lg font-semibold mb-4 uppercase tracking-wide">
    Kategori Wisata
  </h4>

  {[
    { label: "Wisata Alam", kategori: "Wisata Alam" },
    { label: "Wisata Pantai", kategori: "Wisata Pantai" },
    { label: "Wisata Sejarah", kategori: "Wisata Sejarah" },
    { label: "Kuliner", kategori: "Wisata Kuliner" },
  ].map((item) => (
    <a
      key={item.label}
      href={`/destination?kategori=${encodeURIComponent(item.kategori)}`}
      className="block text-white/75 text-base md:text-sm mb-3 hover:text-white transition-colors"
    >
      {item.label}
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
            {["Kebijakan Privasi", "Syarat & Ketentuan", "Sitemap"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-white/60 text-base md:text-sm hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <Hero />
      <KategoriSection />
      <DestinationUnggulan />
      <CTABanner />
      <Footer />
      <AIChatGuide />
    </div>
  );
}