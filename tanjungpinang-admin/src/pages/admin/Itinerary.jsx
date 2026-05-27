import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Zap, Users, Calendar, MapPin, X } from "lucide-react";

const BUDGET_STYLES = {
  hemat: "bg-emerald-50 text-emerald-700 border-emerald-200",
  menengah: "bg-blue-50 text-blue-700 border-blue-200",
  premium: "bg-violet-50 text-violet-700 border-violet-200",
};

function LogDetail({ log: it, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-gray-900">{it.userName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{it.createdAt}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X size={15} /></button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Durasi</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{it.duration} hari</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Budget</p>
            <p className={`text-sm font-semibold mt-0.5 capitalize ${it.budget === "hemat" ? "text-emerald-700" : it.budget === "premium" ? "text-violet-700" : "text-blue-700"}`}>{it.budget}</p>
          </div>
        </div>
        {(it.interests || []).length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">Minat Wisata</p>
            <div className="flex flex-wrap gap-1.5">
              {it.interests.map(i => <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs">{i}</span>)}
            </div>
          </div>
        )}
        {(it.generatedDestinations || []).length > 0 && (
          <div>
            <p className="text-xs text-gray-400 mb-2">Destinasi Direkomendasikan AI</p>
            <div className="space-y-1.5">
              {it.generatedDestinations.map((d, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">{i + 1}</div>
                  <span className="text-sm text-gray-700">{d}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Itinerary() {
  const { itineraryLogs, destinations } = useAppStore();
  const [selected, setSelected] = useState(null);
  const [filterBudget, setFilterBudget] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = itineraryLogs.filter(it => {
    const q = search.toLowerCase();
    return (
      it.userName.toLowerCase().includes(q) &&
      (filterBudget === "all" || it.budget === filterBudget)
    );
  });
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Analytics
  const budgetCount = { hemat: 0, menengah: 0, premium: 0 };
  itineraryLogs.forEach(it => { budgetCount[it.budget] = (budgetCount[it.budget] || 0) + 1; });

  const interestCount = {};
  itineraryLogs.forEach(it => (it.interests || []).forEach(i => { interestCount[i] = (interestCount[i] || 0) + 1; }));
  const topInterests = Object.entries(interestCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const destCount = {};
  itineraryLogs.forEach(it => (it.generatedDestinations || []).forEach(d => { destCount[d] = (destCount[d] || 0) + 1; }));
  const topDests = Object.entries(destCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const avgDuration = itineraryLogs.length ? (itineraryLogs.reduce((s, it) => s + it.duration, 0) / itineraryLogs.length).toFixed(1) : 0;
  const topBudget = Object.entries(budgetCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5">
        <h1 className="text-base font-bold text-gray-900">Itinerary Logs</h1>
        <p className="text-sm text-gray-500 mt-0.5">{itineraryLogs.length} itinerary dibuat via AI · analytics & monitoring</p>
      </div>

      <div className="px-6 md:px-8 py-5 max-w-5xl">
        {/* Info Banner */}
        <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl mb-6">
          <Zap size={15} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">AI Itinerary menggunakan REST API dari tim AI. Data destinasi (estimasi biaya, durasi, tips, transportasi) dikelola di menu <strong>Kelola Destinasi</strong>. Halaman ini hanya untuk monitoring & analytics.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">Total Generate</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{itineraryLogs.length}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">Rata-rata Durasi</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{avgDuration}</p>
            <p className="text-xs text-gray-400 mt-0.5">hari</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">Budget Terpopuler</p>
            <p className="text-sm font-bold text-gray-800 mt-1 capitalize">{topBudget}</p>
            <p className="text-xs text-gray-400">{budgetCount[topBudget] || 0}x dipilih</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">Minat Terpopuler</p>
            <p className="text-sm font-bold text-gray-800 mt-1">{topInterests[0]?.[0] || "—"}</p>
            <p className="text-xs text-gray-400">{topInterests[0]?.[1] || 0}x dipilih</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          {/* Destinasi paling sering direkomendasikan */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-4">Destinasi Paling Sering Direkomendasikan AI</p>
            <div className="space-y-2.5">
              {topDests.map(([dest, count], i) => (
                <div key={dest} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-300 w-4 shrink-0">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-700">{dest}</span>
                      <span className="text-xs font-semibold text-indigo-600">{count}x</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className="h-1.5 bg-indigo-400 rounded-full" style={{ width: `${(count / (topDests[0]?.[1] || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
              {topDests.length === 0 && <p className="text-xs text-gray-400">Belum ada data</p>}
            </div>
          </div>

          {/* Minat terpopuler */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-4">Minat Wisata Terpopuler</p>
            <div className="space-y-2.5">
              {topInterests.map(([interest, count]) => (
                <div key={interest} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{interest}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full">
                      <div className="h-1.5 bg-rose-400 rounded-full" style={{ width: `${(count / (topInterests[0]?.[1] || 1)) * 100}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-rose-600 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
              {topInterests.length === 0 && <p className="text-xs text-gray-400">Belum ada data</p>}
            </div>
          </div>
        </div>

        {/* Log Table */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama user..."
              className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
          <select value={filterBudget} onChange={(e) => setFilterBudget(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none">
            <option value="all">Semua Budget</option>
            <option value="hemat">Hemat</option>
            <option value="menengah">Menengah</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[550px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">User</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Durasi</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">Budget</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Minat</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Tanggal</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sorted.length === 0 ? (
                  <tr><td colSpan={6} className="py-16 text-center text-sm text-gray-400">Belum ada log itinerary</td></tr>
                ) : sorted.map((it) => (
                  <tr key={it.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-gray-800">{it.userName}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-gray-700">{it.duration}</span>
                      <span className="text-xs text-gray-400 ml-1">hari</span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${BUDGET_STYLES[it.budget]}`}>{it.budget}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(it.interests || []).slice(0, 2).map(i => (
                          <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[11px]">{i}</span>
                        ))}
                        {(it.interests || []).length > 2 && <span className="text-[11px] text-gray-400">+{it.interests.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400 hidden md:table-cell">{it.createdAt}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setSelected(it)} className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">Detail</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && <LogDetail log={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}