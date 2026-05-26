import { useAppStore } from "@/store/appStore";
import { Link } from "react-router-dom";
import { MapPin, Users, Tag, Bookmark, TrendingUp, Eye } from "lucide-react";

export default function Dashboard() {
  const { destinations, categories, users, featured, activity } = useAppStore();

  const totalBookmarks = destinations.reduce((s, d) => s + d.bookmarks, 0);
  const activeDestinations = destinations.filter((d) => d.status === "active").length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const topDestinations = [...destinations].sort((a, b) => b.bookmarks - a.bookmarks).slice(0, 5);

  const stats = [
    { label: "Total Destinasi", value: destinations.length, sub: `${activeDestinations} aktif`, icon: MapPin, color: "bg-indigo-50 text-indigo-600 border-indigo-100", link: "/destinations" },
    { label: "Pengguna", value: users.length, sub: `${activeUsers} aktif`, icon: Users, color: "bg-emerald-50 text-emerald-600 border-emerald-100", link: "/users" },
    { label: "Kategori", value: categories.length, sub: `${categories.filter(c => c.status === "active").length} aktif`, icon: Tag, color: "bg-violet-50 text-violet-600 border-violet-100", link: "/categories" },
    { label: "Total Bookmark", value: totalBookmarks.toLocaleString("id-ID"), sub: "dari semua destinasi", icon: Bookmark, color: "bg-amber-50 text-amber-600 border-amber-100", link: "/bookmarks" },
    { label: "Destinasi Unggulan", value: featured.filter(f => f.status === "active").length, sub: "aktif di homepage", icon: TrendingUp, color: "bg-rose-50 text-rose-600 border-rose-100", link: "/featured" },
    { label: "Destinasi Hidden", value: destinations.filter(d => d.status === "hidden").length, sub: "tidak tampil", icon: Eye, color: "bg-gray-50 text-gray-500 border-gray-200", link: "/destinations" },
  ];

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5">
        <h1 className="text-base font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Ringkasan data aplikasi wisata</p>
      </div>

      <div className="px-6 md:px-8 py-6 max-w-6xl">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.label} to={s.link}
                className={`rounded-xl border p-4 md:p-5 flex flex-col gap-3 hover:shadow-md transition-shadow ${s.color.split(" ")[0]} ${s.color.split(" ")[2]}`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-500">{s.label}</p>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color.split(" ")[0]} `}>
                    <Icon size={15} className={s.color.split(" ")[1]} />
                  </div>
                </div>
                <div>
                  <p className={`text-2xl md:text-3xl font-bold ${s.color.split(" ")[1]}`}>{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Bookmarked */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-800">Destinasi Terpopuler</p>
              <Link to="/bookmarks" className="text-xs text-indigo-600 hover:underline">Lihat semua</Link>
            </div>
            <div className="space-y-3">
              {topDestinations.map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-300 w-4 shrink-0">{i + 1}</span>
                  <img src={d.image} alt={d.name} className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{d.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                        <div className="h-1.5 bg-indigo-500 rounded-full" style={{ width: `${(d.bookmarks / topDestinations[0].bookmarks) * 100}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 shrink-0 tabular-nums">{d.bookmarks}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-4">Aktivitas Terbaru</p>
            <div className="space-y-4">
              {activity.slice(0, 6).map((a, i) => (
                <div key={a.id ?? i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">{a.text}</p>
                    <p className="text-xs text-gray-400 truncate">{a.detail}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}