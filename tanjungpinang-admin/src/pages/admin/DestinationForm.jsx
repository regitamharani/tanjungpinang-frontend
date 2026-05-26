import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { X, Plus, ExternalLink, ChevronLeft } from "lucide-react";

export default function DestinationForm({ initial, onSave, onCancel }) {
  const { categories, addDestination, updateDestination } = useAppStore();

  const [form, setForm] = useState(
    initial
      ? { ...initial }
      : {
          name: "", category: "", address: "", description: "",
          ticketPrice: 0, openingHours: "", mapsLink: "",
          googlePlaceId: "", image: "", gallery: [], status: "active",
        }
  );

  const [galleryPickerOpen, setGalleryPickerOpen] = useState(false);
  const [pickTarget, setPickTarget] = useState(null); // "main" | "gallery-add" | number (gallery idx)
  const [urlInput, setUrlInput] = useState("");

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initial) {
      updateDestination(initial.id, form);
    } else {
      addDestination(form);
    }
    onSave();
  };

  const openPicker = (target) => {
    setPickTarget(target);
    setUrlInput("");
    setGalleryPickerOpen(true);
  };

  const confirmUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (pickTarget === "main") {
      set("image", url);
    } else if (pickTarget === "gallery-add") {
      if ((form.gallery || []).length < 8) set("gallery", [...(form.gallery || []), url]);
    } else if (typeof pickTarget === "number") {
      const g = [...(form.gallery || [])];
      g[pickTarget] = url;
      set("gallery", g);
    }
    setGalleryPickerOpen(false);
  };

  const removeGallery = (idx) => {
    const g = [...(form.gallery || [])];
    g.splice(idx, 1);
    set("gallery", g);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-4 flex items-center gap-4">
        <button onClick={onCancel} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-900">{initial ? "Edit Destinasi" : "Tambah Destinasi"}</h1>
          <p className="text-sm text-gray-500">{initial ? initial.name : "Isi informasi destinasi baru"}</p>
        </div>
      </div>

      <div className="px-6 md:px-8 py-6">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
          {/* Informasi Dasar */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
            <p className="text-sm font-semibold text-gray-800 border-b border-gray-50 pb-3">Informasi Dasar</p>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Destinasi *</label>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Kategori *</label>
                <select required value={form.category} onChange={(e) => set("category", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white">
                  <option value="">Pilih kategori</option>
                  {categories.filter(c => c.status === "active").map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Harga Tiket (Rp)</label>
                <input type="number" min={0} value={form.ticketPrice} onChange={(e) => set("ticketPrice", +e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Alamat</label>
              <input value={form.address} onChange={(e) => set("address", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Deskripsi</label>
              <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Jam Buka</label>
                <input value={form.openingHours} onChange={(e) => set("openingHours", e.target.value)}
                  placeholder="08:00 - 17:00"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => set("status", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white">
                  <option value="active">Aktif</option>
                  <option value="hidden">Disembunyikan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lokasi */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
            <p className="text-sm font-semibold text-gray-800 border-b border-gray-50 pb-3">Lokasi & Google Maps</p>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Google Maps Link</label>
              <div className="flex gap-2">
                <input value={form.mapsLink} onChange={(e) => set("mapsLink", e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                {form.mapsLink && (
                  <a href={form.mapsLink} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 flex items-center gap-1.5 shrink-0">
                    <ExternalLink size={13} /> Preview
                  </a>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Google Place ID <span className="text-gray-400 font-normal">(untuk integrasi API nanti)</span>
              </label>
              <input value={form.googlePlaceId} onChange={(e) => set("googlePlaceId", e.target.value)}
                placeholder="ChIJ..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 font-mono text-xs" />
            </div>
          </div>

          {/* Gambar */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-5">
            <p className="text-sm font-semibold text-gray-800 border-b border-gray-50 pb-3">Gambar Destinasi</p>

            {/* Main image */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Gambar Utama</label>
              {form.image ? (
                <div className="relative inline-block">
                  <img src={form.image} alt="main" className="w-48 h-32 object-cover rounded-xl border border-gray-200" />
                  <button type="button" onClick={() => set("image", "")}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white shadow">
                    <X size={10} />
                  </button>
                  <button type="button" onClick={() => openPicker("main")}
                    className="mt-2 block text-xs text-indigo-600 hover:underline">Ganti gambar</button>
                </div>
              ) : (
                <button type="button" onClick={() => openPicker("main")}
                  className="w-48 h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors">
                  <Plus size={22} />
                  <span className="text-xs">Tambah URL Gambar</span>
                </button>
              )}
            </div>

            {/* Gallery */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Galeri <span className="text-gray-400">({(form.gallery || []).length}/8 gambar)</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {(form.gallery || []).map((url, idx) => (
                  <div key={idx} className="relative">
                    <img src={url} alt={`gallery-${idx}`} className="w-24 h-20 object-cover rounded-lg border border-gray-200" />
                    <button type="button" onClick={() => removeGallery(idx)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white shadow">
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {(form.gallery || []).length < 8 && (
                  <button type="button" onClick={() => openPicker("gallery-add")}
                    className="w-24 h-20 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors">
                    <Plus size={16} />
                    <span className="text-[11px]">Tambah</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pb-4">
            <button type="button" onClick={onCancel}
              className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button type="submit"
              className="px-5 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              {initial ? "Simpan Perubahan" : "Tambah Destinasi"}
            </button>
          </div>
        </form>
      </div>

      {/* URL Input Modal */}
      {galleryPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setGalleryPickerOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {pickTarget === "main" ? "URL Gambar Utama" : "URL Gambar Galeri"}
            </h3>
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmUrl()}
              placeholder="https://images.unsplash.com/..."
              autoFocus
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 mb-3"
            />
            {urlInput && (
              <img src={urlInput} alt="preview" className="w-full h-36 object-cover rounded-lg bg-gray-100 mb-4"
                onError={(e) => { e.target.style.display = "none"; }} />
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => setGalleryPickerOpen(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Batal</button>
              <button onClick={confirmUrl} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Gunakan URL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}