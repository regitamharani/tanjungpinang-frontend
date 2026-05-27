import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Search, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function Visits() {
  const { visitedDestinations, destinations, deleteVisit } = useAppStore();
  const [search, setSearch] = useState("");
  const [filterDest, setFilterDest] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = visitedDestinations.filter((v) => {
    const q = search.toLowerCase();
    return (
      (v.userName.toLowerCase().includes(q) || v.destinationName.toLowerCase().includes(q)) &&
      (filterDest === "all" || String(v.destinationId) === filterDest)
    );
  });

  // Statistik per destinasi (untuk "Paling Banyak Dikunjungi" di homepage)
  const visitStats = destinations.map(d => ({
    ...d,
    visits: visitedDestinations.filter(v => v.destinationId === d.id).length,
    lastVisit: visitedDestinations.filter(v => v.destinationId === d.id).sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt))[0]?.visitedAt,
  })).sort((a, b) => b.visits - a.visits);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5">
        <h1 className="text-base font-bold text-gray-900">Riwayat Kunjungan</h1>
        <p className="text-sm text-gray-500 mt-0.5">{visitedDestinations.length} kunjungan tercatat · data otomatis dipakai homepage "Paling Banyak Dikunjungi"</p>
      </div>

      <div className="px-6 md:px-8 py-6 max-w-5xl">
        {/* Visit Stats per destinasi */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-800 mb-3">Statistik Kunjungan per Destinasi</p>
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">#</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Destinasi</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Total Kunjungan</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Terakhir Dikunjungi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {visitStats.map((d, i) => (
                    <tr key={d.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3 text-xs font-bold text-gray-300">{i + 1}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={d.mainImage} alt={d.name} className="w-8 h-8 rounded-lg object-cover bg-gray-100 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-gray-800">{d.name}</p>
                            <p className="text-xs text-gray-400">{d.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full">
                            <div className="h-1.5 bg-indigo-500 rounded-full" style={{ width: `${(d.visits / (visitStats[0]?.visits || 1)) * 100}%` }} />
                          </div>
                          <span className="text-sm font-bold text-gray-700 tabular-nums">{d.visits}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400 hidden md:table-cell">{d.lastVisit || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Log Kunjungan Detail */}
        <p className="text-sm font-semibold text-gray-800 mb-3">Log Kunjungan</p>
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari user atau destinasi..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
          <select value={filterDest} onChange={(e) => setFilterDest(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none">
            <option value="all">Semua Destinasi</option>
            {destinations.map(d => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
          </select>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">User</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Destinasi</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Tanggal</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} className="py-12 text-center text-sm text-gray-400">Tidak ada data kunjungan</td></tr>
                ) : filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={v.userAvatar} alt={v.userName} className="w-7 h-7 rounded-full object-cover shrink-0" />
                        <p className="text-xs font-semibold text-gray-800">{v.userName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 hidden md:table-cell">{v.destinationName}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">{v.visitedAt}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setDeleteTarget(v.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal open={!!deleteTarget} title="Hapus Data Kunjungan" description="Data kunjungan ini akan dihapus secara permanen."
        onConfirm={() => { deleteVisit(deleteTarget); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}