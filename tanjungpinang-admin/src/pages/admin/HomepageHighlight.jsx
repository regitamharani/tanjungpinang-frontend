import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Plus, Pencil, Trash2, Globe, ExternalLink } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

function HighlightForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { title: "", subtitle: "", image: "", buttonText: "Jelajahi Sekarang", buttonLink: "/destinasi", isActive: false });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-bold text-gray-900 mb-5">{initial ? "Edit Highlight" : "Tambah Highlight"}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Judul *</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="Jelajahi Tanjungpinang" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Subtitle</label>
            <textarea rows={2} value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={`${inputCls} resize-none`} placeholder="Kota Gurindam, Kota Bersejarah..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">URL Gambar/Banner</label>
            <input value={form.image} onChange={(e) => set("image", e.target.value)} className={inputCls} placeholder="https://..." />
            {form.image && <img src={form.image} alt="preview" className="mt-2 w-full h-28 object-cover rounded-lg" onError={(e) => { e.target.style.display = "none"; }} />}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Teks Button</label>
              <input value={form.buttonText} onChange={(e) => set("buttonText", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Link Button</label>
              <input value={form.buttonLink} onChange={(e) => set("buttonLink", e.target.value)} className={inputCls} placeholder="/destinasi" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
            <select value={form.isActive ? "true" : "false"} onChange={(e) => set("isActive", e.target.value === "true")}
              className={`${inputCls} bg-white`}>
              <option value="false">Nonaktif</option>
              <option value="true">Aktif (tampil di homepage)</option>
            </select>
            <p className="text-xs text-amber-600 mt-1">⚠ Hanya 1 highlight boleh aktif. Mengaktifkan ini akan menonaktifkan yang lain.</p>
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

export default function HomepageHighlight() {
  const { homepageHighlights, updateHighlight, addHighlight, deleteHighlight } = useAppStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSave = (data) => {
    if (data.id) updateHighlight(data.id, data);
    else addHighlight(data);
    setFormOpen(false); setEditing(null);
  };

  const activeHighlight = homepageHighlights.find(h => h.isActive);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">Homepage Highlight</h1>
          <p className="text-sm text-gray-500 mt-0.5">Section hero/banner utama di homepage user</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shrink-0 shadow-sm">
          <Plus size={14} /> Tambah
        </button>
      </div>

      <div className="px-6 md:px-8 py-6 max-w-3xl">
        {activeHighlight && (
          <div className="mb-5 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <Globe size={15} className="text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-800">Aktif di homepage: <strong>"{activeHighlight.title}"</strong></p>
          </div>
        )}

        <div className="space-y-4">
          {homepageHighlights.map((h) => (
            <div key={h.id} className={`bg-white border rounded-xl shadow-sm overflow-hidden ${h.isActive ? "border-emerald-200" : "border-gray-100"}`}>
              {h.image && <img src={h.image} alt={h.title} className="w-full h-36 object-cover" />}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-gray-900">{h.title}</p>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${h.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                        {h.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{h.subtitle}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs font-medium">{h.buttonText}</span>
                      <span className="text-xs text-gray-400">{h.buttonLink}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!h.isActive && (
                      <button onClick={() => updateHighlight(h.id, { isActive: true })}
                        className="px-2.5 py-1 text-xs border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                        Aktifkan
                      </button>
                    )}
                    <button onClick={() => { setEditing(h); setFormOpen(true); }} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => setDeleteTarget(h.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {homepageHighlights.length === 0 && (
            <div className="py-16 text-center bg-white border border-gray-100 rounded-xl">
              <p className="text-sm text-gray-400">Belum ada homepage highlight</p>
            </div>
          )}
        </div>
      </div>

      {formOpen && <HighlightForm initial={editing} onSave={handleSave} onCancel={() => { setFormOpen(false); setEditing(null); }} />}
      <ConfirmModal open={!!deleteTarget} title="Hapus Highlight" description="Highlight ini akan dihapus secara permanen."
        onConfirm={() => { deleteHighlight(deleteTarget); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}