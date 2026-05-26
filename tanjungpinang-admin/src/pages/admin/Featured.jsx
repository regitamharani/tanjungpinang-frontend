import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Plus, Trash2, ChevronUp, ChevronDown, Search, Ticket, Clock, Bookmark } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

const statusStyles = { active: "bg-emerald-50 text-emerald-700 border-emerald-200", inactive: "bg-gray-100 text-gray-500 border-gray-200" };
const statusLabels = { active: "Aktif", inactive: "Nonaktif" };

function DestinationPicker({ onSelect, onCancel, alreadyFeaturedIds }) {
  const { destinations } = useAppStore();
  const [search, setSearch] = useState("");
  const available = destinations.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0 gap-4">
          <h3 className="text-sm font-bold text-gray-900">Pilih Destinasi Unggulan</h3>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari..."
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 w-40" />
          </div>
        </div>
        <div className="overflow-y-auto p-4 space-y-2">
          {available.map((d) => {
            const isAdded = alreadyFeaturedIds.includes(d.id);
            return (
              <div key={d.id}
                onClick={() => !isAdded && onSelect(d.id)}
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                  isAdded ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                    : "border-gray-200 hover:border-indigo-200 hover:shadow-sm cursor-pointer hover:bg-indigo-50/30"
                }`}>
                <img src={d.image} alt={d.name} className="w-14 h-11 rounded-lg object-cover bg-gray-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{d.name}</p>
                  <p className="text-xs text-gray-400">{d.category}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Ticket size={10} />{d.ticketPrice === 0 ? "Gratis" : `Rp ${d.ticketPrice.toLocaleString("id-ID")}`}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={10} />{d.openingHours}
                    </span>
                  </div>
                </div>
                {isAdded
                  ? <span className="text-xs text-gray-400 shrink-0">Sudah ditambahkan</span>
                  : <span className="text-xs text-indigo-600 font-medium shrink-0">+ Tambah</span>}
              </div>
            );
          })}
          {available.length === 0 && <p className="text-center text-sm text-gray-400 py-8">Tidak ada destinasi</p>}
        </div>
      </div>
    </div>
  );
}

export default function Featured() {
  const { destinations, featured, addFeatured, removeFeatured, toggleFeaturedStatus, moveFeatured } = useAppStore();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const sorted = [...featured].sort((a, b) => a.order - b.order);
  const alreadyFeaturedIds = featured.map((f) => f.destinationId);

  const getDestination = (id) => destinations.find((d) => d.id === id);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">Destinasi Unggulan</h1>
          <p className="text-sm text-gray-500 mt-0.5">Rekomendasi yang tampil di homepage aplikasi</p>
        </div>
        <button onClick={() => setPickerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shrink-0 shadow-sm">
          <Plus size={14} /> Tambah
        </button>
      </div>

      <div className="px-6 md:px-8 py-6 max-w-3xl">
        {sorted.length === 0 ? (
          <div className="py-20 text-center bg-white border border-gray-100 rounded-xl shadow-sm">
            <p className="text-sm text-gray-400">Belum ada destinasi unggulan</p>
            <button onClick={() => setPickerOpen(true)}
              className="mt-3 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center gap-2 shadow-sm">
              <Plus size={14} /> Tambah Destinasi
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((f) => {
              const dest = getDestination(f.destinationId);
              if (!dest) return null;
              return (
                <div key={f.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex items-center gap-4">
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button onClick={() => moveFeatured(f.id, "up")} className="p-1 text-gray-300 hover:text-gray-500 transition-colors"><ChevronUp size={14} /></button>
                    <button onClick={() => moveFeatured(f.id, "down")} className="p-1 text-gray-300 hover:text-gray-500 transition-colors"><ChevronDown size={14} /></button>
                  </div>
                  <span className="text-xs font-bold text-gray-300 w-4 text-center shrink-0">{f.order}</span>
                  <img src={dest.image} alt={dest.name} className="w-16 h-12 rounded-xl object-cover bg-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{dest.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{dest.category}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Ticket size={10} />{dest.ticketPrice === 0 ? "Gratis" : `Rp ${dest.ticketPrice.toLocaleString("id-ID")}`}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Bookmark size={10} />{dest.bookmarks}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[f.status]}`}>
                      {statusLabels[f.status]}
                    </span>
                    <button onClick={() => toggleFeaturedStatus(f.id)}
                      className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors hidden sm:block">
                      {f.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                    <button onClick={() => setDeleteTarget(f.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {pickerOpen && (
        <DestinationPicker
          onSelect={(id) => { addFeatured(id); setPickerOpen(false); }}
          onCancel={() => setPickerOpen(false)}
          alreadyFeaturedIds={alreadyFeaturedIds}
        />
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus dari Unggulan"
        description="Destinasi ini akan dihapus dari daftar unggulan."
        onConfirm={() => { removeFeatured(deleteTarget); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}