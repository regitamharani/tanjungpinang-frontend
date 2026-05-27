import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { X, Plus, ExternalLink, ChevronLeft } from "lucide-react";

const BUDGET_OPTIONS = ["hemat", "menengah", "premium"];
const GROUP_OPTIONS = ["solo", "couple", "family", "group"];
const FACILITIES = ["Parkir", "Toilet", "Mushola", "Warung Makan", "Pemandu Wisata", "Area Foto", "Kolam Renang", "Snorkeling", "Camping Ground", "Gazebo", "Penginapan"];

export default function DestinationForm({ initial, onSave, onCancel }) {
  const { categories, addDestination, updateDestination } = useAppStore();

  const [form, setForm] = useState(initial ? { ...initial } : {
    name: "", categoryId: "", category: "", location: "",
    shortDescription: "", fullDescription: "",
    mainImage: "", gallery: [], facilities: [],
    openingHours: "", ticketPrice: 0,
    mapsUrl: "", googlePlaceId: "", googleRating: 0, googleReviewCount: 0,
    googleMapsUrl: "", googleLastSyncAt: null,
    estimatedCostMin: 0, estimatedCostMax: 0,
    recommendedDuration: "", bestVisitTime: "",
    travelTips: "", transportRecommendation: "",
    aiRecommended: false,
    suitableForBudget: "hemat",
    suitableForGroup: [],
    isPublished: false,
  });

  const [imgModalOpen, setImgModalOpen] = useState(false);
  const [imgTarget, setImgTarget] = useState(null);
  const [urlInput, setUrlInput] = useState("");

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const cat = categories.find(c => c.id === Number(form.categoryId));
    const finalForm = { ...form, category: cat?.name || form.category };
    if (initial) updateDestination(initial.id, finalForm);
    else addDestination(finalForm);
    onSave();
  };

  const toggleFacility = (f) => {
    const facs = form.facilities || [];
    set("facilities", facs.includes(f) ? facs.filter(x => x !== f) : [...facs, f]);
  };

  const toggleGroup = (g) => {
    const grps = form.suitableForGroup || [];
    set("suitableForGroup", grps.includes(g) ? grps.filter(x => x !== g) : [...grps, g]);
  };

  const openImg = (target) => { setImgTarget(target); setUrlInput(""); setImgModalOpen(true); };
  const confirmUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (imgTarget === "main") {
      set("mainImage", url);
    } else {
      const g = form.gallery || [];
      if (g.length < 8) set("gallery", [...g, { id: Date.now(), url, caption: "", sortOrder: g.length + 1 }]);
    }
    setImgModalOpen(false);
  };

  const removeGallery = (id) => set("gallery", (form.gallery || []).filter(g => g.id !== id));

  const Section = ({ title, children }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
      <p className="text-sm font-semibold text-gray-800 border-b border-gray-50 pb-3">{title}</p>
      {children}
    </div>
  );

  const Field = ({ label, children, hint }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}{hint && <span className="text-gray-400 font-normal ml-1">{hint}</span>}</label>
      {children}
    </div>
  );

  const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200";

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-4 flex items-center gap-4">
        <button onClick={onCancel} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"><ChevronLeft size={18} /></button>
        <div>
          <h1 className="text-base font-bold text-gray-900">{initial ? "Edit Destinasi" : "Tambah Destinasi"}</h1>
          <p className="text-sm text-gray-500">{initial ? initial.name : "Isi informasi destinasi baru"}</p>
        </div>
      </div>

      <div className="px-6 md:px-8 py-6">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">

          <Section title="Informasi Dasar">
            <Field label="Nama Destinasi *">
              <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Kategori *">
                <select required value={form.categoryId} onChange={(e) => set("categoryId", Number(e.target.value))}
                  className={`${inputCls} bg-white`}>
                  <option value="">Pilih kategori</option>
                  {categories.filter(c => c.isActive).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Status Publish">
                <select value={form.isPublished ? "true" : "false"} onChange={(e) => set("isPublished", e.target.value === "true")}
                  className={`${inputCls} bg-white`}>
                  <option value="false">Unpublished (Draft)</option>
                  <option value="true">Published (Tampil di User)</option>
                </select>
              </Field>
            </div>
            <Field label="Lokasi / Alamat">
              <input value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls} placeholder="Kecamatan, Kota, Provinsi" />
            </Field>
            <Field label="Deskripsi Singkat" hint="(tampil di card destinasi)">
              <textarea rows={2} value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} className={`${inputCls} resize-none`} />
            </Field>
            <Field label="Deskripsi Lengkap" hint="(tampil di halaman detail)">
              <textarea rows={4} value={form.fullDescription} onChange={(e) => set("fullDescription", e.target.value)} className={`${inputCls} resize-none`} />
            </Field>
          </Section>

          <Section title="Informasi Kunjungan">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Jam Buka">
                <input value={form.openingHours} onChange={(e) => set("openingHours", e.target.value)} placeholder="08:00 - 17:00" className={inputCls} />
              </Field>
              <Field label="Harga Tiket (Rp)">
                <input type="number" min={0} value={form.ticketPrice} onChange={(e) => set("ticketPrice", +e.target.value)} className={inputCls} />
              </Field>
              <Field label="Durasi Rekomendasi">
                <input value={form.recommendedDuration} onChange={(e) => set("recommendedDuration", e.target.value)} placeholder="2-3 jam" className={inputCls} />
              </Field>
              <Field label="Waktu Terbaik Berkunjung">
                <input value={form.bestVisitTime} onChange={(e) => set("bestVisitTime", e.target.value)} placeholder="Pagi hari" className={inputCls} />
              </Field>
            </div>
            <Field label="Fasilitas">
              <div className="flex flex-wrap gap-2">
                {FACILITIES.map(f => (
                  <button key={f} type="button" onClick={() => toggleFacility(f)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${(form.facilities || []).includes(f) ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </Field>
          </Section>

          <Section title="AI Itinerary Data">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Estimasi Biaya Min (Rp)">
                <input type="number" min={0} value={form.estimatedCostMin} onChange={(e) => set("estimatedCostMin", +e.target.value)} className={inputCls} />
              </Field>
              <Field label="Estimasi Biaya Max (Rp)">
                <input type="number" min={0} value={form.estimatedCostMax} onChange={(e) => set("estimatedCostMax", +e.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label="Tips Perjalanan">
              <textarea rows={2} value={form.travelTips} onChange={(e) => set("travelTips", e.target.value)} className={`${inputCls} resize-none`} />
            </Field>
            <Field label="Rekomendasi Transportasi">
              <input value={form.transportRecommendation} onChange={(e) => set("transportRecommendation", e.target.value)} className={inputCls} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Cocok untuk Budget">
                <select value={form.suitableForBudget} onChange={(e) => set("suitableForBudget", e.target.value)} className={`${inputCls} bg-white`}>
                  {BUDGET_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="AI Recommended">
                <select value={form.aiRecommended ? "true" : "false"} onChange={(e) => set("aiRecommended", e.target.value === "true")} className={`${inputCls} bg-white`}>
                  <option value="false">Tidak</option>
                  <option value="true">Ya</option>
                </select>
              </Field>
            </div>
            <Field label="Cocok untuk Grup">
              <div className="flex gap-2 flex-wrap">
                {GROUP_OPTIONS.map(g => (
                  <button key={g} type="button" onClick={() => toggleGroup(g)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${(form.suitableForGroup || []).includes(g) ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </Field>
          </Section>

          <Section title="Lokasi & Google">
            <Field label="Google Maps Link (mapsUrl)">
              <div className="flex gap-2">
                <input value={form.mapsUrl} onChange={(e) => set("mapsUrl", e.target.value)} placeholder="https://maps.google.com/..." className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                {form.mapsUrl && <a href={form.mapsUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 flex items-center gap-1 shrink-0"><ExternalLink size={13} /></a>}
              </div>
            </Field>
            <Field label="Google Place ID" hint="(untuk API sync)">
              <input value={form.googlePlaceId} onChange={(e) => set("googlePlaceId", e.target.value)} placeholder="ChIJ..." className={`${inputCls} font-mono text-xs`} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Google Rating" hint="(info eksternal)">
                <input type="number" step="0.1" min={0} max={5} value={form.googleRating} onChange={(e) => set("googleRating", +e.target.value)} className={inputCls} />
              </Field>
              <Field label="Google Review Count">
                <input type="number" min={0} value={form.googleReviewCount} onChange={(e) => set("googleReviewCount", +e.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label="Last Sync Google" hint="(tanggal terakhir sync)">
              <input type="date" value={form.googleLastSyncAt || ""} onChange={(e) => set("googleLastSyncAt", e.target.value)} className={inputCls} />
            </Field>
          </Section>

          <Section title="Gambar Destinasi">
            <Field label="Gambar Utama">
              {form.mainImage ? (
                <div className="relative inline-block">
                  <img src={form.mainImage} alt="main" className="w-48 h-32 object-cover rounded-xl border border-gray-200" />
                  <button type="button" onClick={() => set("mainImage", "")} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white shadow"><X size={10} /></button>
                  <button type="button" onClick={() => openImg("main")} className="mt-2 block text-xs text-indigo-600 hover:underline">Ganti</button>
                </div>
              ) : (
                <button type="button" onClick={() => openImg("main")} className="w-48 h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors">
                  <Plus size={22} /><span className="text-xs">Tambah URL Gambar</span>
                </button>
              )}
            </Field>
            <Field label={`Galeri (${(form.gallery || []).length}/8 gambar)`}>
              <div className="flex flex-wrap gap-3">
                {(form.gallery || []).map((g) => (
                  <div key={g.id} className="relative">
                    <img src={g.url} alt={g.caption} className="w-24 h-20 object-cover rounded-lg border border-gray-200" />
                    <button type="button" onClick={() => removeGallery(g.id)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white shadow"><X size={10} /></button>
                  </div>
                ))}
                {(form.gallery || []).length < 8 && (
                  <button type="button" onClick={() => openImg("gallery")} className="w-24 h-20 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors">
                    <Plus size={16} /><span className="text-[11px]">Tambah</span>
                  </button>
                )}
              </div>
            </Field>
          </Section>

          <div className="flex justify-end gap-3 pb-4">
            <button type="button" onClick={onCancel} className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
            <button type="submit" className="px-5 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              {initial ? "Simpan Perubahan" : "Tambah Destinasi"}
            </button>
          </div>
        </form>
      </div>

      {imgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setImgModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{imgTarget === "main" ? "URL Gambar Utama" : "URL Gambar Galeri"}</h3>
            <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && confirmUrl()}
              placeholder="https://images.unsplash.com/..." autoFocus
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 mb-3" />
            {urlInput && <img src={urlInput} alt="preview" className="w-full h-36 object-cover rounded-lg bg-gray-100 mb-4" onError={(e) => { e.target.style.display = "none"; }} />}
            <div className="flex justify-end gap-2">
              <button onClick={() => setImgModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Batal</button>
              <button onClick={confirmUrl} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Gunakan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}