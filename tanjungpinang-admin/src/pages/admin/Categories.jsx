import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Pencil, Trash2, Plus, Landmark, Waves, UtensilsCrossed, MoonStar, TreePine, Palette, Mountain, Building2, Star, Compass, Search, X } from "lucide-react";
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

const statusStyles = { true: "bg-emerald-50 text-emerald-700 border-emerald-200", false: "bg-gray-100 text-gray-500 border-gray-200" };

function CategoryForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: "", icon: "Landmark", image: "", description: "", isActive: true });
  const [imgInput, setImgInput] = useState(form.image || "");
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-bold text-gray-900 mb-5">{initial ? "Edit Kategori" : "Tambah Kategori"}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Kategori *</label>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Icon <span className="text-gray-400 font-normal">(filter & tampilan compact)</span></label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map(({ label, value, Icon }) => (
                <button key={value} type="button" onClick={() => set("icon", value)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${form.icon === value ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                  <Icon size={16} /><span className="text-[10px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Image/Banner <span className="text-gray-400 font-normal">(card kategori di homepage)</span>
            </label>
            <input value={imgInput} onChange={(e) => { setImgInput(e.target.value); set("image", e.target.value); }}
              placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            {imgInput && <img src={imgInput} alt="preview" className="mt-2 w-full h-24 object-cover rounded-lg" onError={(e) => { e.target.style.display = "none"; }} />}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Deskripsi Singkat</label>
            <textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
            <select value={form.isActive ? "true" : "false"} onChange={(e) => set("isActive", e.target.value === "true")}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none bg-white">
              <option value="true">Aktif (tampil di user web)</option>
              <option value="false">Nonaktif (sembunyikan)</option>
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
    setFormOpen(false); setEditing(null);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">Kategori</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} kategori · {categories.filter(c => c.isActive).length} aktif</p>
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
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari kategori..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 w-56" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              {c.image ? (
                <img src={c.image} alt={c.name} className="w-full h-24 object-cover" />
              ) : (
                <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
                  <CategoryIcon icon={c.icon} size={28} className="text-gray-300" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                      <CategoryIcon icon={c.icon} size={14} className="text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium border ${c.isActive ? statusStyles.true : statusStyles.false}`}>
                        {c.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => { setEditing(c); setFormOpen(true); }} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => setDeleteTarget(c.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{c.description}</p>
                <p className="text-xs text-indigo-600 font-medium mt-2">{getCount(c.name)} destinasi</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {formOpen && <CategoryForm initial={editing} onSave={handleSave} onCancel={() => { setFormOpen(false); setEditing(null); }} />}
      <ConfirmModal open={!!deleteTarget} title="Hapus Kategori" description="Kategori ini akan dihapus secara permanen."
        onConfirm={() => { deleteCategory(deleteTarget); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}