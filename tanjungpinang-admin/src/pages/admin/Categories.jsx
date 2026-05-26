import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Pencil, Trash2, Plus, Landmark, Waves, UtensilsCrossed, MoonStar, TreePine, Palette, Mountain, Building2, Star, Compass, Search } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

export const iconOptions = [
  { label: "Landmark", value: "Landmark", Icon: Landmark },
  { label: "Pantai", value: "Waves", Icon: Waves },
  { label: "Kuliner", value: "UtensilsCrossed", Icon: UtensilsCrossed },
  { label: "Religi", value: "MoonStar", Icon: MoonStar },
  { label: "Alam", value: "TreePine", Icon: TreePine },
  { label: "Seni", value: "Palette", Icon: Palette },
  { label: "Gunung", value: "Mountain", Icon: Mountain },
  { label: "Kota", value: "Building2", Icon: Building2 },
  { label: "Unggulan", value: "Star", Icon: Star },
  { label: "Jelajah", value: "Compass", Icon: Compass },
];

export const iconMap = { Landmark, Waves, UtensilsCrossed, MoonStar, TreePine, Palette, Mountain, Building2, Star, Compass };

export function CategoryIcon({ icon, size = 15, className = "text-gray-500" }) {
  const Icon = iconMap[icon] || Compass;
  return <Icon size={size} className={className} />;
}

const statusStyles = { active: "bg-emerald-50 text-emerald-700 border-emerald-200", hidden: "bg-gray-100 text-gray-500 border-gray-200" };
const statusLabels = { active: "Aktif", hidden: "Disembunyikan" };

function CategoryForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: "", icon: "Landmark", description: "", status: "active" });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-5">{initial ? "Edit Kategori" : "Tambah Kategori"}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Kategori *</label>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Ikon</label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map(({ label, value, Icon }) => (
                <button key={value} type="button" onClick={() => set("icon", value)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                    form.icon === value ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                  }`}>
                  <Icon size={16} />
                  <span className="text-[10px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Deskripsi</label>
            <textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none bg-white">
              <option value="active">Aktif</option>
              <option value="hidden">Disembunyikan</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Batal</button>
          <button onClick={() => { if (form.name) onSave(form); }} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Simpan</button>
        </div>
      </div>
    </div>
  );
}

export default function Categories() {
  const { categories, destinations, addCategory, updateCategory, deleteCategory } = useAppStore();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const getCount = (name) => destinations.filter((d) => d.category === name).length;

  const handleSave = (item) => {
    if (item.id) updateCategory(item.id, item);
    else addCategory(item);
    setFormOpen(false);
    setEditing(null);
  };

  const toggleStatus = (cat) => {
    updateCategory(cat.id, { status: cat.status === "active" ? "hidden" : "active" });
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">Kategori</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} kategori tersedia</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shrink-0 shadow-sm">
          <Plus size={14} /> Tambah
        </button>
      </div>

      <div className="px-6 md:px-8 py-5">
        <div className="flex gap-3 mb-5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kategori..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 w-56" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">Tidak ada kategori ditemukan</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Kategori</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Deskripsi</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Destinasi</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                            <CategoryIcon icon={c.icon} size={15} className="text-indigo-500" />
                          </div>
                          <span className="font-semibold text-gray-800">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-gray-500 max-w-xs truncate hidden md:table-cell">{c.description}</td>
                      <td className="px-6 py-3.5">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">{getCount(c.name)}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[c.status]}`}>
                          {statusLabels[c.status]}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => toggleStatus(c)}
                            className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors hidden sm:block">
                            {c.status === "active" ? "Sembunyikan" : "Tampilkan"}
                          </button>
                          <button onClick={() => { setEditing(c); setFormOpen(true); }} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteTarget(c.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {formOpen && (
        <CategoryForm initial={editing} onSave={handleSave} onCancel={() => { setFormOpen(false); setEditing(null); }} />
      )}
      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus Kategori"
        description="Kategori ini akan dihapus secara permanen."
        onConfirm={() => { deleteCategory(deleteTarget); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}