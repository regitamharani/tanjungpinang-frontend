import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { get, put, del as apiDel, getUser, clearAuth } from "../services/api";

const accountMenus = [
  {
    icon: "🔔",
    label: "Notifikasi",
    desc: "Atur notifikasi wisata",
  },
  {
    icon: "⚙️",
    label: "Pengaturan",
    desc: "Preferensi & keamanan akun",
  },
  {
    icon: "🚪",
    label: "Keluar",
    desc: "Logout dari akun",
    danger: true,
  },
];

const statistikList = [
  {
    key: "dikunjungi",
    label: "Dikunjungi",
    color: "text-[#0AABCF]",
  },
  {
    key: "favorit",
    label: "Favorit",
    color: "text-rose-500",
  },
  {
    key: "rating",
    label: "Avg Rating",
    color: "text-orange-400",
  },
  {
    key: "baruDilihat",
    label: "Baru Dilihat",
    color: "text-purple-500",
  },
];

function getStoredArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function handleLogout() {
  clearAuth();
  localStorage.removeItem("favorit");
  localStorage.removeItem("dilihat");
  window.location.href = "/login";
}

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
            className="text-sm md:text-base text-gray-500 hover:text-gray-800 transition-colors"
          >
            Destination
          </Link>

          <Link
            to="/account"
            className="text-sm md:text-base font-medium text-[#0AAEFF] border-b-2 border-[#0AAEFF] pb-1"
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

          <button
            onClick={handleLogout}
            className="p-3 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
            title="Logout"
          >
            <img
              src="/keluar.png"
              alt="Logout"
              className="w-6 h-6 object-contain"
            />
          </button>
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
              className="text-base text-gray-500 hover:text-gray-800 transition-colors"
            >
              Destination
            </Link>

            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="text-base font-medium text-[#0AAEFF]"
            >
              Account
            </Link>

            <div className="flex flex-wrap items-center gap-3 pt-2">
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

              <button
                onClick={handleLogout}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                title="Logout"
              >
                <img
                  src="/keluar.png"
                  alt="Logout"
                  className="w-6 h-6 object-contain"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type }) {
  if (!message) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[1000] flex w-[calc(100%-2rem)] max-w-md items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-white text-sm font-medium ${
        type === "error" ? "bg-red-600" : "bg-green-500"
      }`}
    >
      <span>{type === "error" ? "❌" : "✅"}</span>
      {message}
    </div>
  );
}

// ── Edit Profile Modal ────────────────────────────────────────────────────────
function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ ...user });

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6">
      <div className="relative w-full max-w-[440px] bg-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="px-5 sm:px-6 pt-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-xl leading-none"
            aria-label="Close modal"
          >
            ×
          </button>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
            Edit Profil
          </h3>

          <p className="text-sm text-gray-400 mt-1">
            Perbarui informasi profil Anda di sini.
          </p>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mt-5 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#009BD8] flex items-center justify-center">
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.7"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            <button
              type="button"
              className="absolute right-0 bottom-0 w-7 h-7 rounded-full bg-[#0AAEFF] border-2 border-white flex items-center justify-center shadow-md"
              aria-label="Change photo"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Klik ikon kamera untuk ubah foto
          </p>
        </div>

        {/* Form */}
        <div className="px-5 sm:px-6 pb-5">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                value={form.nama || ""}
                onChange={handleChange}
                className="w-full h-9 bg-gray-100 rounded-xl px-4 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#0AAEFF]/30"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email || ""}
                readOnly
                className="w-full h-9 bg-gray-100 rounded-xl px-4 text-sm text-gray-400 outline-none cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email tidak dapat diubah</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="telepon"
                value={form.telepon || ""}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                className="w-full h-9 bg-gray-100 rounded-xl px-4 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#0AAEFF]/30"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">
                Bio
              </label>
              <textarea
                name="bio"
                value={form.bio || ""}
                onChange={handleChange}
                rows={3}
                className="w-full h-[76px] bg-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none resize-none focus:ring-2 focus:ring-[#0AAEFF]/30"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-gray-100 bg-white text-gray-500 text-sm font-bold hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={() => onSave(form)}
              className="h-11 rounded-xl bg-[#009BD8] text-white text-sm font-bold hover:bg-[#008ac2] transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Profile Card ──────────────────────────────────────────────────────────────
function ProfileCard({ user, favorit, dilihat, onEdit }) {
  const stats = [
    { val: dilihat.length, label: "Dikunjungi" },
    { val: favorit.length, label: "Disimpan" },
    { val: "4.8", label: "Avg Rating" },
    { val: "12", label: "Review" },
  ];

  return (
    <div
      className="relative overflow-hidden rounded-[28px] md:rounded-[32px] shadow-md"
      style={{
        background: "linear-gradient(135deg, #0AABCF 0%, #0087BF 100%)",
      }}
    >
      <div className="p-6 md:p-12">
        <div className="flex justify-end mb-6 md:mb-0">
          <button
            onClick={onEdit}
            className="md:absolute md:top-10 md:right-10 flex items-center gap-2 bg-white/20 text-white text-sm md:text-base font-semibold px-5 md:px-7 py-2.5 md:py-3 rounded-full border border-white/25 hover:bg-white/30 transition-colors"
          >
            <span>✎</span>
            Edit Profil
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-7 md:gap-9 md:pr-52">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/15 border-4 border-white/30 flex items-center justify-center shadow-md">
              <svg
                width="62"
                height="62"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.6"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            <button className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0AABCF"
                strokeWidth="2"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 w-full pt-1">
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold leading-tight break-words">
              {user.nama}
            </h2>

            <p className="text-white/75 text-sm sm:text-base md:text-lg mt-3 tracking-wide break-all">
              {user.email}
            </p>

            <p className="text-white/75 text-base md:text-lg mt-4 leading-relaxed">
              {user.bio}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 max-w-[620px]">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="h-[92px] rounded-2xl bg-white/15 border border-white/15 flex flex-col items-center justify-center"
                >
                  <p className="text-white text-2xl md:text-3xl font-bold">
                    {stat.val}
                  </p>
                  <p className="text-white/75 text-sm md:text-base mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Account Settings ──────────────────────────────────────────────────────────
function AccountSettings() {
  return (
    <div className="bg-white rounded-[28px] border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-5 sm:px-8 pt-7 pb-3">
        <p className="text-sm sm:text-base font-bold text-gray-400 uppercase tracking-widest">
          Pengaturan Akun
        </p>
      </div>

      {accountMenus.map((item, index) => (
        <button
          key={item.label}
          onClick={item.danger ? handleLogout : undefined}
          className={`w-full flex items-center gap-4 sm:gap-5 px-5 sm:px-8 py-5 sm:py-6 hover:bg-gray-50 transition-colors text-left ${
            index < accountMenus.length - 1 ? "border-b border-gray-100" : ""
          }`}
        >
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
              item.danger ? "bg-red-50" : "bg-cyan-50"
            }`}
          >
            <span className="text-xl sm:text-2xl">{item.icon}</span>
          </div>

          <div className="flex-1 min-w-0">
            <p
              className={`text-lg sm:text-xl font-semibold ${
                item.danger ? "text-red-500" : "text-gray-700"
              }`}
            >
              {item.label}
            </p>
            <p className="text-sm sm:text-base text-gray-400 mt-1">
              {item.desc}
            </p>
          </div>

          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c7c7c7"
            strokeWidth="2"
            className="shrink-0"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ── Destination Tabs ──────────────────────────────────────────────────────────
function DestinationTabs({
  activeTab,
  setActiveTab,
  favorit,
  dilihat,
  hapusFavorit,
}) {
  return (
    <div className="bg-white rounded-[28px] border border-gray-100 overflow-hidden shadow-sm">
      <div className="flex gap-6 sm:gap-8 overflow-x-auto border-b border-gray-100 px-5 sm:px-8 pt-6">
        <button
          onClick={() => setActiveTab("tersimpan")}
          className={`shrink-0 flex items-center gap-2 text-base sm:text-lg pb-5 transition-colors ${
            activeTab === "tersimpan"
              ? "text-[#0AABCF] border-b-4 border-[#0AABCF] font-semibold"
              : "text-gray-400"
          }`}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          Tersimpan
        </button>

        <button
          onClick={() => setActiveTab("dilihat")}
          className={`shrink-0 flex items-center gap-2 text-base sm:text-lg pb-5 transition-colors ${
            activeTab === "dilihat"
              ? "text-[#0AABCF] border-b-4 border-[#0AABCF] font-semibold"
              : "text-gray-400"
          }`}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Baru Dilihat
        </button>
      </div>

      <div className="p-5 sm:p-10">
        {activeTab === "tersimpan" ? (
          <SavedDestinations favorit={favorit} hapusFavorit={hapusFavorit} />
        ) : (
          <ViewedDestinations dilihat={dilihat} />
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5 text-4xl text-gray-300">
        {icon}
      </div>

      <p className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
        {title}
      </p>

      <p className="text-sm sm:text-base text-gray-400 mb-7 max-w-md">
        {description}
      </p>

      <Link
        to="/destination"
        className="text-base font-semibold bg-[#0AABCF] text-white px-8 sm:px-10 py-4 rounded-full hover:bg-cyan-600 transition-colors shadow-md"
      >
        Jelajahi Destinasi
      </Link>
    </div>
  );
}

function SavedDestinations({ favorit, hapusFavorit }) {
  if (favorit.length === 0) {
    return (
      <EmptyState
        icon="🤍"
        title="Belum ada destinasi yang disimpan"
        description="Simpan destinasi favoritmu untuk mengaksesnya dengan mudah!"
      />
    );
  }

  return (
    <div className="space-y-5">
      {favorit.map((dest) => (
        <div
          key={dest.id}
          className="flex items-center gap-4 sm:gap-5 p-3 sm:p-4 rounded-2xl hover:bg-gray-50 transition-colors"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-cyan-50">
            <img
              src={dest.img}
              alt={dest.name}
              className="w-full h-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-base sm:text-xl font-semibold text-gray-800 line-clamp-2">
              {dest.name}
            </p>
            <p className="text-sm sm:text-base text-gray-400 mt-1">
              {dest.kategori}
            </p>
            <p className="text-sm sm:text-base text-yellow-500 mt-1">
              ★ {dest.rating}
            </p>
          </div>

          <button
            onClick={() => hapusFavorit(dest.id)}
            className="text-red-400 hover:text-red-500 text-2xl sm:text-3xl shrink-0"
            aria-label="Hapus favorit"
          >
            ❤️
          </button>
        </div>
      ))}
    </div>
  );
}

function ViewedDestinations({ dilihat }) {
  if (dilihat.length === 0) {
    return (
      <EmptyState
        icon="🕐"
        title="Belum ada destinasi yang dilihat"
        description="Destinasi yang kamu kunjungi akan muncul di sini."
      />
    );
  }

  return (
    <div className="space-y-5">
      {dilihat.map((dest) => (
        <Link key={dest.id} to={`/destination/${dest.slug}`} className="block">
          <div className="flex items-center gap-4 sm:gap-5 p-3 sm:p-4 rounded-2xl hover:bg-gray-50 transition-colors">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-cyan-50">
              <img
                src={dest.img}
                alt={dest.name}
                className="w-full h-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-base sm:text-xl font-semibold text-gray-800 line-clamp-2">
                {dest.name}
              </p>
              <p className="text-sm sm:text-base text-gray-400 mt-1">
                {dest.kategori}
              </p>
              <p className="text-sm sm:text-base text-yellow-500 mt-1">
                ★ {dest.rating}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── Statistik Perjalanan ──────────────────────────────────────────────────────
function TravelStats({ favorit, dilihat }) {
  const values = {
    dikunjungi: dilihat.length,
    favorit: favorit.length,
    rating: "4.8",
    baruDilihat: dilihat.length,
  };

  return (
    <div className="bg-white rounded-[28px] border border-gray-100 overflow-hidden shadow-sm mb-6">
      <div className="px-5 sm:px-8 pt-7">
        <p className="text-sm sm:text-base font-bold text-gray-500 uppercase tracking-[0.18em]">
          Statistik Perjalanan
        </p>
      </div>

      <div className="px-5 sm:px-8 pt-8 sm:pt-12 pb-10 flex justify-center">
        <div className="w-full max-w-[560px] space-y-5 sm:space-y-6">
          {statistikList.map((stat) => (
            <div
              key={stat.key}
              className="h-[96px] sm:h-[105px] bg-gray-50 rounded-2xl flex flex-col items-center justify-center"
            >
              <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>
                {values[stat.key]}
              </p>
              <p className="text-sm sm:text-base text-gray-500 mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
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

// ── Main Account Page ─────────────────────────────────────────────────────────
export default function AccountPage() {
  const storedUser = getUser();
  const [user, setUser] = useState(
    storedUser || { nama: "", email: "", bio: "" }
  );
  const [showEdit, setShowEdit] = useState(false);
  const [activeTab, setActiveTab] = useState("tersimpan");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [favorit, setFavorit] = useState([]);
  const [dilihat] = useState(() => getStoredArray("dilihat"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, bmRes] = await Promise.all([
          get("/users/me"),
          get("/bookmarks"),
        ]);
        const profileJson = await profileRes.json();
        const bmJson = await bmRes.json();

        if (profileJson.success) {
          setUser(profileJson.data);
          localStorage.setItem("user", JSON.stringify(profileJson.data));
        }
        if (bmJson.success) {
          const mapped = bmJson.data.map((d) => ({
            id: d.id,
            slug: d.slug,
            name: d.nama,
            kategori: d.kategori,
            rating: parseFloat(d.rata_rating || 0).toFixed(1),
            img: d.gambar,
          }));
          setFavorit(mapped);
        }
      } catch {
        setFavorit(getStoredArray("favorit"));
      }
    };
    fetchData();
  }, []);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const handleSave = async (newUser) => {
    try {
      const res = await put("/users/me", {
        nama: newUser.nama,
        bio: newUser.bio,
        telepon: newUser.telepon,
      });
      const json = await res.json();
      if (json.success) {
        setUser(json.data);
        localStorage.setItem("user", JSON.stringify(json.data));
        showToast("Profil berhasil diperbarui! ✨", "success");
      } else {
        showToast(json.message || "Gagal memperbarui profil", "error");
      }
    } catch {
      showToast("Tidak bisa terhubung ke server.", "error");
    }
    setShowEdit(false);
  };

  const hapusFavorit = async (id) => {
    try {
      await apiDel(`/bookmarks/${id}`);
    } catch {
      // silent
    }
    setFavorit((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <Toast message={toast.message} type={toast.type} />

      {showEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSave={handleSave}
        />
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-12 space-y-8 sm:space-y-12">
        <ProfileCard
          user={user}
          favorit={favorit}
          dilihat={dilihat}
          onEdit={() => setShowEdit(true)}
        />

        <AccountSettings />

        <DestinationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          favorit={favorit}
          dilihat={dilihat}
          hapusFavorit={hapusFavorit}
        />

        <TravelStats favorit={favorit} dilihat={dilihat} />
      </main>

      <Footer />
    </div>
  );
}