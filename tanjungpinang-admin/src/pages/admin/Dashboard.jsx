import { useAppStore } from "@/store/appStore";
import { Link } from "react-router-dom";
import { MapPin, Users, Tag, Star, MessageSquare, Eye, Zap, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const { destinations, categories, users, reviews, visitedDestinations, itineraryLogs, activity } = useAppStore();

  const publishedDest = destinations.filter((d) => d.isPublished);
  const totalReviews = reviews.length;
  const verifiedReviews = reviews.filter(r => r.isVerifiedVisit);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  // Auto testimonial (homepage logic)
  const autoTestimonials = reviews
    .filter(r => r.rating >= 4 && r.isVerifiedVisit && r.comment)
    .sort((a, b) => b.rating - a.rating || new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  // Top destinations by rating (otomatis = destinasi unggulan homepage)
  const topByRating = [...destinations].filter(d => d.reviewCount > 0 && d.isPublished)
    .sort((a, b) => b.ratingAverage - a.ratingAverage).slice(0, 5);

  // Top by visitCount (otomatis = paling banyak dikunjungi homepage)
  const topByVisit = [...destinations].filter(d => d.isPublished)
    .sort((a, b) => b.visitCount - a.visitCount).slice(0, 5);

  const recentReviews = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

  const stats = [
    { label: "Total Destinasi", value: destinations.length, sub: `${publishedDest.length} published`, icon: MapPin, color: "indigo", link: "/destinations" },
    { label: "Total Kategori", value: categories.length, sub: `${categories.filter(c => c.isActive).length} aktif`, icon: Tag, color: "violet", link: "/categories" },
    { label: "Total Pengguna", value: users.length, sub: `${users.filter(u => u.status === "active").length} aktif`, icon: Users, color: "emerald", link: "/users" },
    { label: "Total Ulasan", value: totalReviews, sub: `avg ★ ${avgRating}`, icon: MessageSquare, color: "amber", link: "/reviews" },
    { label: "Verified Visit", value: verifiedReviews.length, sub: "ulasan terverifikasi", icon: CheckCircle, color: "emerald", link: "/reviews" },
    { label: "Total Kunjungan", value: visitedDestinations.length, sub: "semua destinasi", icon: Eye, color: "blue", link: "/visits" },
    { label: "Auto Testimonial", value: autoTestimonials.length, sub: "tampil di homepage", icon: Star, color: "amber", link: "/reviews" },
    { label: "AI Itinerary", value: itineraryLogs.length, sub: "total generate", icon: Zap, color: "rose", link: "/itinerary" },
  ];

  const colorMap = {
    indigo: { bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-600", icon: "text-indigo-500" },
    violet: { bg: "bg-violet-50", border: "border-violet-100", text: "text-violet-600", icon: "text-violet-500" },
    emerald: { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600", icon: "text-emerald-500" },
    amber: { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-600", icon: "text-amber-500" },
    blue: { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600", icon: "text-blue-500" },
    rose: { bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-600", icon: "text-rose-500" },
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5">
        <h1 className="text-base font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Tanjung Pinang Guide — Pusat Pengelolaan Konten</p>
      </div>

      <div className="px-6 md:px-8 py-6 max-w-7xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {stats.map((s) => {
            const Icon = s.icon;
            const c = colorMap[s.color];
            return (
              <Link key={s.label} to={s.link}
                className={`rounded-xl border p-4 flex flex-col gap-3 hover:shadow-md transition-shadow bg-white ${c.border}`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-500">{s.label}</p>
                  <div className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center`}>
                    <Icon size={14} className={c.icon} />
                  </div>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${c.text}`}>{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Homepage data flow info */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mb-6">
          <p className="text-sm font-semibold text-gray-800 mb-3">Data Otomatis Homepage Frontend</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Eksplorasi Kategori", src: "Kelola Kategori", color: "violet", link: "/categories" },
              { label: "Destinasi Unggulan", src: "Rating tertinggi (otomatis)", color: "amber", link: "/destinations" },
              { label: "Paling Banyak Dikunjungi", src: "visitCount (otomatis)", color: "blue", link: "/visits" },
              { label: "Testimonial Pengunjung", src: "Rating ≥4 + Verified Visit", color: "emerald", link: "/reviews" },
            ].map(({ label, src, color, link }) => {
              const c = colorMap[color];
              return (
                <Link key={label} to={link} className={`p-3 rounded-xl border ${c.border} ${c.bg} hover:opacity-80 transition-opacity`}>
                  <p className={`text-xs font-semibold ${c.text}`}>{label}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{src}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top by Rating */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">Destinasi Unggulan</p>
                <p className="text-[11px] text-gray-400 mt-0.5">otomatis dari rating tertinggi</p>
              </div>
              <Link to="/destinations" className="text-xs text-indigo-600 hover:underline">Lihat semua</Link>
            </div>
            <div className="space-y-3">
              {topByRating.length === 0 && <p className="text-xs text-gray-400">Belum ada data rating</p>}
              {topByRating.map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-300 w-4 shrink-0">{i + 1}</span>
                  <img src={d.mainImage} alt={d.name} className="w-8 h-8 rounded-lg object-cover bg-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{d.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs text-gray-500">{d.ratingAverage} ({d.reviewCount} ulasan)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top by Visit */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">Paling Banyak Dikunjungi</p>
                <p className="text-[11px] text-gray-400 mt-0.5">otomatis dari visitCount</p>
              </div>
              <Link to="/visits" className="text-xs text-indigo-600 hover:underline">Lihat semua</Link>
            </div>
            <div className="space-y-3">
              {topByVisit.map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-300 w-4 shrink-0">{i + 1}</span>
                  <img src={d.mainImage} alt={d.name} className="w-8 h-8 rounded-lg object-cover bg-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{d.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex-1 h-1 bg-gray-100 rounded-full max-w-16">
                        <div className="h-1 bg-indigo-400 rounded-full" style={{ width: `${(d.visitCount / (topByVisit[0]?.visitCount || 1)) * 100}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{d.visitCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aktivitas Terbaru */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-4">Aktivitas Terbaru</p>
            <div className="space-y-3.5">
              {activity.slice(0, 6).map((a, i) => (
                <div key={a.id ?? i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700">{a.text}</p>
                    <p className="text-xs text-gray-400 truncate">{a.detail}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ulasan Terbaru + Auto Testimonial */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-800">Ulasan Terbaru</p>
              <Link to="/reviews" className="text-xs text-indigo-600 hover:underline">Lihat semua</Link>
            </div>
            <div className="space-y-3">
              {recentReviews.map((r) => (
                <div key={r.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <img src={r.userAvatar} alt={r.userName} className="w-7 h-7 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-gray-800 truncate">{r.userName}</p>
                      {r.isVerifiedVisit && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[10px] shrink-0">✓ V</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{r.destinationName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} size={9} className={i < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">Auto Testimonial Homepage</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Rating ≥4 + Verified Visit · maks. 6</p>
              </div>
              <Link to="/reviews" className="text-xs text-indigo-600 hover:underline">Lihat ulasan</Link>
            </div>
            <div className="space-y-3">
              {autoTestimonials.slice(0, 4).map((r) => (
                <div key={r.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <img src={r.userAvatar} alt={r.userName} className="w-7 h-7 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">{r.userName}</p>
                    <p className="text-xs text-gray-500 truncate">{r.comment}</p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Star size={9} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-amber-600">{r.rating}</span>
                  </div>
                </div>
              ))}
              {autoTestimonials.length === 0 && <p className="text-xs text-gray-400">Belum ada testimonial (perlu rating ≥4 + verified visit)</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}