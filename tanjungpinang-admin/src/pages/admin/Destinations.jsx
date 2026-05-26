import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Plus, Pencil, Trash2, Eye, Search, ChevronDown } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";
import DestinationForm from "@/pages/admin/DestinationForm";
import DestinationDetail from "@/pages/admin/DestinationDetail";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  hidden: "bg-gray-100 text-gray-500 border-gray-200",
};
const statusLabels = { active: "Aktif", hidden: "Disembunyikan" };

export default function Destinations() {
  const { destinations, categories, deleteDestination } = useAppStore();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [view, setView] = useState("list"); // list | form | detail
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = destinations.filter((d) => {
    const q = search.toLowerCase();
    return (
      (d.name.toLowerCase().includes(q) || d.address.toLowerCase().includes(q)) &&
      (filterCat === "all" || d.category === filterCat) &&
      (filterStatus === "all" || d.status === filterStatus)
    );
  });

  if (view === "form") {
    return <DestinationForm initial={selected} onSave={() => setView("list")} onCancel={() => setView("list")} />;
  }
  if (view === "detail") {
    return <DestinationDetail destination={selected} onBack={() => setView("list")} onEdit={(d) => { setSelected(d); setView("form"); }} />;
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">Destinasi</h1>
          <p className="text-sm text-gray-500 mt-0.5">{destinations.length} destinasi terdaftar</p>
        </div>
        <button onClick={() => { setSelected(null); setView("form"); }}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shrink-0 shadow-sm">
          <Plus size={14} />
          <span className="hidden sm:inline">Tambah Destinasi</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      <div className="px-6 md:px-8 py-5">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari destinasi..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200">
            <option value="all">Semua Kategori</option>
            {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200">
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Destinasi</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Kategori</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Harga</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Bookmark</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-16 text-center text-sm text-gray-400">Tidak ada destinasi ditemukan</td></tr>
                ) : filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={d.image} alt={d.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{d.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[180px]">{d.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{d.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 hidden lg:table-cell">
                      {d.ticketPrice === 0 ? <span className="text-emerald-600 font-medium">Gratis</span> : `Rp ${d.ticketPrice.toLocaleString("id-ID")}`}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[d.status]}`}>
                        {statusLabels[d.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell tabular-nums">{d.bookmarks}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => { setSelected(d); setView("detail"); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Lihat detail">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => { setSelected(d); setView("form"); }} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget(d.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus Destinasi"
        description="Destinasi ini akan dihapus secara permanen beserta data unggulannya."
        onConfirm={() => { deleteDestination(deleteTarget); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}