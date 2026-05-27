import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Plus, Pencil, Trash2, GripVertical, Plane, Bike, Lightbulb, Hotel, MapPin, Info } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

const ICON_OPTIONS = [
  { label: "Pesawat", value: "Plane", Icon: Plane },
  { label: "Motor/Sepeda", value: "Bike", Icon: Bike },
  { label: "Tips", value: "Lightbulb", Icon: Lightbulb },
  { label: "Hotel", value: "Hotel", Icon: Hotel },
  { label: "Lokasi", value: "MapPin", Icon: MapPin },
  { label: "Info", value: "Info", Icon: Info },
];
const ICON_MAP = { Plane, Bike, Lightbulb, Hotel, MapPin, Info };

function GuideIcon({ icon, size = 16, className = "text-gray-500" }) {
  const Icon = ICON_MAP[icon] || Info;
  return <Icon size={size} className={className} />;
}

function GuideForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { title: "", description: "", icon: "Info", sortOrder: 1, isActive: true });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-5">{initial ? "Edit Panduan" : "Tambah Panduan"}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Judul *</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Icon</label>
            <div className="grid grid-cols-3 gap-2">
              {ICON_OPTIONS.map(({ label, value, Icon }) => (
                <button key={value} type="button" onClick={() => set("icon", value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${form.icon === value ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                  <Icon size={14} /><span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Deskripsi</label>
            <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className={`${inputCls} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Urutan</label>
              <input type="number" min={1} value={form.sortOrder} onChange={(e) => set("sortOrder", +e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
              <select value={form.isActive ? "true" : "false"} onChange={(e) => set("isActive", e.target.value === "true")} className={`${inputCls} bg-white`}>
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Batal</button>
          <button onClick={() => { if (form.title) onSave(form); }} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Simpan</button>
        </div>
      </div>
    </div>
  );
}

export default function TravelGuide() {
  const { travelGuides, addTravelGuide, updateTravelGuide, deleteTravelGuide } = useAppStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const sorted = [...travelGuides].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleSave = (data) => {
    if (data.id) updateTravelGuide(data.id, data);
    else addTravelGuide(data);
    setFormOpen(false); setEditing(null);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">Panduan Liburan</h1>
          <p className="text-sm text-gray-500 mt-0.5">Panduan perjalanan yang tampil di halaman panduan user</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shrink-0 shadow-sm">
          <Plus size={14} /> Tambah
        </button>
      </div>

      <div className="px-6 md:px-8 py-6 max-w-3xl">
        <div className="space-y-3">
          {sorted.map((g) => (
            <div key={g.id} className={`bg-white border rounded-xl shadow-sm p-5 flex items-start gap-4 ${g.isActive ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <GuideIcon icon={g.icon} size={18} className="text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-800">{g.title}</p>
                  <span className="text-xs text-gray-300">#{g.sortOrder}</span>
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium border ${g.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-400 border-gray-200"}`}>
                    {g.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{g.description}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => updateTravelGuide(g.id, { isActive: !g.isActive })}
                  className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hidden sm:block">
                  {g.isActive ? "Nonaktifkan" : "Aktifkan"}
                </button>
                <button onClick={() => { setEditing(g); setFormOpen(true); }} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"><Pencil size={13} /></button>
                <button onClick={() => setDeleteTarget(g.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <div className="py-16 text-center bg-white border border-gray-100 rounded-xl">
              <p className="text-sm text-gray-400">Belum ada panduan liburan</p>
            </div>
          )}
        </div>
      </div>

      {formOpen && <GuideForm initial={editing} onSave={handleSave} onCancel={() => { setFormOpen(false); setEditing(null); }} />}
      <ConfirmModal open={!!deleteTarget} title="Hapus Panduan" description="Panduan ini akan dihapus secara permanen."
        onConfirm={() => { deleteTravelGuide(deleteTarget); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}