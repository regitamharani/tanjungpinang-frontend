import { useAppStore } from "@/store/appStore";

export default function Bookmarks() {
  const { destinations } = useAppStore();
  const sorted = [...destinations].sort((a, b) => b.bookmarks - a.bookmarks);
  const total = destinations.reduce((s, d) => s + d.bookmarks, 0);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5">
        <h1 className="text-base font-bold text-gray-900">Analitik Bookmark</h1>
        <p className="text-sm text-gray-500 mt-0.5">Destinasi paling banyak disimpan pengguna</p>
      </div>

      <div className="px-6 md:px-8 py-6 max-w-4xl">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
            <p className="text-xs font-medium text-gray-500">Total Bookmark</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">{total.toLocaleString("id-ID")}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <p className="text-xs font-medium text-gray-500">Terpopuler</p>
            <p className="text-base font-bold text-emerald-700 mt-1 leading-tight truncate">{sorted[0]?.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sorted[0]?.bookmarks} bookmark</p>
          </div>
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-5">
            <p className="text-xs font-medium text-gray-500">Rata-rata</p>
            <p className="text-3xl font-bold text-violet-600 mt-1">
              {destinations.length ? Math.round(total / destinations.length) : 0}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">per destinasi</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">Peringkat Popularitas</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">#</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Destinasi</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Kategori</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Bookmark</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">Proporsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sorted.map((d, i) => (
                  <tr key={d.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-bold ${i === 0 ? "text-amber-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-700" : "text-gray-300"}`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={d.image} alt={d.name} className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0" />
                        <span className="font-semibold text-gray-800">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500 hidden md:table-cell">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{d.category}</span>
                    </td>
                    <td className="px-6 py-3.5 font-bold text-gray-800 tabular-nums">{d.bookmarks}</td>
                    <td className="px-6 py-3.5 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-28 h-1.5 bg-gray-100 rounded-full">
                          <div className="h-1.5 bg-indigo-500 rounded-full" style={{ width: `${(d.bookmarks / sorted[0].bookmarks) * 100}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 tabular-nums">{total ? Math.round((d.bookmarks / total) * 100) : 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}