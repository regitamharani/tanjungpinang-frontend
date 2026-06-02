import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { X, Plus, ExternalLink, ChevronLeft } from "lucide-react";

const BUDGET_OPTIONS = ["hemat", "menengah", "premium"];

const GROUP_OPTIONS = ["solo", "couple", "family", "group"];

const FACILITIES = [
  "Parkir",
  "Toilet",
  "Mushola",
  "Warung Makan",
  "Pemandu Wisata",
  "Area Foto",
  "Kolam Renang",
  "Snorkeling",
  "Camping Ground",
  "Gazebo",
  "Penginapan",
];

const inputCls =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200";

function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
      <p className="text-sm font-semibold text-gray-800 border-b border-gray-50 pb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
        {hint && (
          <span className="text-gray-400 font-normal ml-1">{hint}</span>
        )}
      </label>
      {children}
    </div>
  );
}

const defaultForm = {
  name: "",
  categoryId: "",
  category: "",
  location: "",
  shortDescription: "",
  fullDescription: "",
  mainImage: "",
  image: "",
  gallery: [],
  facilities: [],
  openingHours: "",
  ticketPrice: 0,
  mapsUrl: "",
  mapsLink: "",
  googlePlaceId: "",
  googleRating: 0,
  googleReviewCount: 0,
  googleMapsUrl: "",
  googleLastSyncAt: null,
  estimatedCostMin: 0,
  estimatedCostMax: 0,
  recommendedDuration: "",
  bestVisitTime: "",
  travelTips: "",
  transportRecommendation: "",
  aiRecommended: false,
  suitableForBudget: "hemat",
  suitableForGroup: [],
  isPublished: false,
};

export default function DestinationForm({ initial, onSave, onCancel }) {
  const { categories, addDestination, updateDestination } = useAppStore();

  const [form, setForm] = useState(() => {
    if (!initial) return defaultForm;

    return {
      ...defaultForm,
      ...initial,
      mainImage: initial.mainImage || initial.image || initial.img || "",
      image: initial.image || initial.mainImage || initial.img || "",
      location: initial.location || initial.address || initial.lokasi || "",
      mapsUrl: initial.mapsUrl || initial.mapsLink || initial.googleMapsUrl || "",
      mapsLink: initial.mapsLink || initial.mapsUrl || initial.googleMapsUrl || "",
      fullDescription:
        initial.fullDescription || initial.description || initial.deskripsi || "",
      shortDescription:
        initial.shortDescription || initial.summary || initial.deskripsiSingkat || "",
      gallery: Array.isArray(initial.gallery)
        ? initial.gallery.map((item, index) => {
            if (typeof item === "string") {
              return {
                id: Date.now() + index,
                url: item,
                caption: "",
                sortOrder: index + 1,
              };
            }

            return {
              id: item.id || Date.now() + index,
              url: item.url || item.image || item.src || "",
              caption: item.caption || "",
              sortOrder: item.sortOrder || index + 1,
            };
          })
        : [],
    };
  });

  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("File harus berupa gambar"));
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 1200;
          const maxHeight = 800;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
          resolve(compressedBase64);
        };

        img.onerror = () => {
          reject(new Error("Gagal membaca gambar"));
        };

        img.src = event.target.result;
      };

      reader.onerror = () => {
        reject(new Error("Gagal membaca file"));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const imageBase64 = await compressImage(file);

      setForm((prev) => ({
        ...prev,
        mainImage: imageBase64,
        image: imageBase64,
      }));
    } catch (error) {
      alert(error.message || "Gagal upload gambar");
    }

    e.target.value = "";
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const currentGallery = form.gallery || [];
    const remainingSlots = 8 - currentGallery.length;
    const selectedFiles = files.slice(0, remainingSlots);

    try {
      const uploadedImages = await Promise.all(
        selectedFiles.map(async (file, index) => {
          const imageBase64 = await compressImage(file);

          return {
            id: Date.now() + index + Math.random(),
            url: imageBase64,
            caption: "",
            sortOrder: currentGallery.length + index + 1,
          };
        })
      );

      setForm((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...uploadedImages].slice(0, 8),
      }));
    } catch (error) {
      alert(error.message || "Gagal upload galeri");
    }

    e.target.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedCategory = categories.find(
      (category) => category.id === Number(form.categoryId)
    );

    const finalForm = {
      ...form,

      category: selectedCategory?.name || form.category,

      mainImage: form.mainImage || form.image || "",
      image: form.mainImage || form.image || "",

      location: form.location || "",
      address: form.location || "",

      description: form.fullDescription || form.shortDescription || "",
      fullDescription: form.fullDescription || "",
      shortDescription: form.shortDescription || "",

      mapsUrl: form.mapsUrl || "",
      mapsLink: form.mapsUrl || form.mapsLink || "",

      ticketPrice: Number(form.ticketPrice) || 0,
      googleRating: Number(form.googleRating) || 0,
      googleReviewCount: Number(form.googleReviewCount) || 0,
      estimatedCostMin: Number(form.estimatedCostMin) || 0,
      estimatedCostMax: Number(form.estimatedCostMax) || 0,

      gallery: (form.gallery || []).map((item, index) => ({
        id: item.id || Date.now() + index,
        url: item.url || item.image || item.src || "",
        caption: item.caption || "",
        sortOrder: item.sortOrder || index + 1,
      })),
    };

    if (initial) {
      updateDestination(initial.id, finalForm);
    } else {
      addDestination(finalForm);
    }

    onSave();
  };

  const toggleFacility = (facility) => {
    const facilities = form.facilities || [];

    if (facilities.includes(facility)) {
      set(
        "facilities",
        facilities.filter((item) => item !== facility)
      );
    } else {
      set("facilities", [...facilities, facility]);
    }
  };

  const toggleGroup = (group) => {
    const groups = form.suitableForGroup || [];

    if (groups.includes(group)) {
      set(
        "suitableForGroup",
        groups.filter((item) => item !== group)
      );
    } else {
      set("suitableForGroup", [...groups, group]);
    }
  };

  const removeGallery = (id) => {
    set(
      "gallery",
      (form.gallery || []).filter((item) => item.id !== id)
    );
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-4 flex items-center gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <div>
          <h1 className="text-base font-bold text-gray-900">
            {initial ? "Edit Destinasi" : "Tambah Destinasi"}
          </h1>
          <p className="text-sm text-gray-500">
            {initial ? form.name : "Isi informasi destinasi baru"}
          </p>
        </div>
      </div>

      <div className="px-6 md:px-8 py-6">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
          <Section title="Informasi Dasar">
            <Field label="Nama Destinasi *">
              <input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={inputCls}
                placeholder="Contoh: Pantai Trikora"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Kategori *">
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => set("categoryId", e.target.value)}
                  className={`${inputCls} bg-white`}
                >
                  <option value="">Pilih kategori</option>
                  {categories
                    .filter((category) => category.isActive)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </Field>

              <Field label="Status Publish">
                <select
                  value={form.isPublished ? "true" : "false"}
                  onChange={(e) =>
                    set("isPublished", e.target.value === "true")
                  }
                  className={`${inputCls} bg-white`}
                >
                  <option value="false">Unpublished (Draft)</option>
                  <option value="true">Published (Tampil di User)</option>
                </select>
              </Field>
            </div>

            <Field label="Lokasi / Alamat">
              <input
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                className={inputCls}
                placeholder="Kecamatan, Kota, Provinsi"
              />
            </Field>

            <Field label="Deskripsi Singkat" hint="(tampil di card destinasi)">
              <textarea
                rows={2}
                value={form.shortDescription}
                onChange={(e) => set("shortDescription", e.target.value)}
                className={`${inputCls} resize-none`}
                placeholder="Tulis deskripsi singkat destinasi"
              />
            </Field>

            <Field label="Deskripsi Lengkap" hint="(tampil di halaman detail)">
              <textarea
                rows={4}
                value={form.fullDescription}
                onChange={(e) => set("fullDescription", e.target.value)}
                className={`${inputCls} resize-none`}
                placeholder="Tulis deskripsi lengkap destinasi"
              />
            </Field>
          </Section>

          <Section title="Informasi Kunjungan">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Jam Buka">
                <input
                  value={form.openingHours}
                  onChange={(e) => set("openingHours", e.target.value)}
                  placeholder="08:00 - 17:00"
                  className={inputCls}
                />
              </Field>

              <Field label="Harga Tiket (Rp)">
                <input
                  type="number"
                  min={0}
                  value={form.ticketPrice}
                  onChange={(e) => set("ticketPrice", e.target.value)}
                  className={inputCls}
                />
              </Field>

              <Field label="Durasi Rekomendasi">
                <input
                  value={form.recommendedDuration}
                  onChange={(e) => set("recommendedDuration", e.target.value)}
                  placeholder="2-3 jam"
                  className={inputCls}
                />
              </Field>

              <Field label="Waktu Terbaik Berkunjung">
                <input
                  value={form.bestVisitTime}
                  onChange={(e) => set("bestVisitTime", e.target.value)}
                  placeholder="Pagi hari"
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Fasilitas">
              <div className="flex flex-wrap gap-2">
                {FACILITIES.map((facility) => (
                  <button
                    key={facility}
                    type="button"
                    onClick={() => toggleFacility(facility)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                      (form.facilities || []).includes(facility)
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {facility}
                  </button>
                ))}
              </div>
            </Field>
          </Section>

          <Section title="AI Itinerary Data">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Estimasi Biaya Min (Rp)">
                <input
                  type="number"
                  min={0}
                  value={form.estimatedCostMin}
                  onChange={(e) => set("estimatedCostMin", e.target.value)}
                  className={inputCls}
                />
              </Field>

              <Field label="Estimasi Biaya Max (Rp)">
                <input
                  type="number"
                  min={0}
                  value={form.estimatedCostMax}
                  onChange={(e) => set("estimatedCostMax", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Tips Perjalanan">
              <textarea
                rows={2}
                value={form.travelTips}
                onChange={(e) => set("travelTips", e.target.value)}
                className={`${inputCls} resize-none`}
              />
            </Field>

            <Field label="Rekomendasi Transportasi">
              <input
                value={form.transportRecommendation}
                onChange={(e) =>
                  set("transportRecommendation", e.target.value)
                }
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Cocok untuk Budget">
                <select
                  value={form.suitableForBudget}
                  onChange={(e) => set("suitableForBudget", e.target.value)}
                  className={`${inputCls} bg-white`}
                >
                  {BUDGET_OPTIONS.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="AI Recommended">
                <select
                  value={form.aiRecommended ? "true" : "false"}
                  onChange={(e) =>
                    set("aiRecommended", e.target.value === "true")
                  }
                  className={`${inputCls} bg-white`}
                >
                  <option value="false">Tidak</option>
                  <option value="true">Ya</option>
                </select>
              </Field>
            </div>

            <Field label="Cocok untuk Grup">
              <div className="flex gap-2 flex-wrap">
                {GROUP_OPTIONS.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => toggleGroup(group)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                      (form.suitableForGroup || []).includes(group)
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </Field>
          </Section>

          <Section title="Lokasi & Google">
            <Field label="Google Maps Link">
              <div className="flex gap-2">
                <input
                  value={form.mapsUrl}
                  onChange={(e) => set("mapsUrl", e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />

                {form.mapsUrl && (
                  <a
                    href={form.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 flex items-center gap-1 shrink-0"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </Field>

            <Field label="Google Place ID" hint="(untuk API sync)">
              <input
                value={form.googlePlaceId}
                onChange={(e) => set("googlePlaceId", e.target.value)}
                placeholder="ChIJ..."
                className={`${inputCls} font-mono text-xs`}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Google Rating" hint="(info eksternal)">
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={5}
                  value={form.googleRating}
                  onChange={(e) => set("googleRating", e.target.value)}
                  className={inputCls}
                />
              </Field>

              <Field label="Google Review Count">
                <input
                  type="number"
                  min={0}
                  value={form.googleReviewCount}
                  onChange={(e) => set("googleReviewCount", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Last Sync Google" hint="(tanggal terakhir sync)">
              <input
                type="date"
                value={form.googleLastSyncAt || ""}
                onChange={(e) => set("googleLastSyncAt", e.target.value)}
                className={inputCls}
              />
            </Field>
          </Section>

          <Section title="Gambar Destinasi">
            <Field label="Gambar Utama">
              {form.mainImage ? (
                <div className="relative inline-block">
                  <img
                    src={form.mainImage}
                    alt="Gambar utama"
                    className="w-48 h-32 object-cover rounded-xl border border-gray-200"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        mainImage: "",
                        image: "",
                      }))
                    }
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white shadow"
                  >
                    <X size={10} />
                  </button>

                  <label className="mt-2 inline-block text-xs text-indigo-600 hover:underline cursor-pointer">
                    Ganti gambar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="w-48 h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors cursor-pointer">
                  <Plus size={22} />
                  <span className="text-xs">Upload Gambar</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </Field>

            <Field label={`Galeri (${(form.gallery || []).length}/8 gambar)`}>
              <div className="flex flex-wrap gap-3">
                {(form.gallery || []).map((item) => (
                  <div key={item.id} className="relative">
                    <img
                      src={item.url}
                      alt={item.caption || "Galeri destinasi"}
                      className="w-24 h-20 object-cover rounded-lg border border-gray-200"
                    />

                    <button
                      type="button"
                      onClick={() => removeGallery(item.id)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white shadow"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}

                {(form.gallery || []).length < 8 && (
                  <label className="w-24 h-20 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors cursor-pointer">
                    <Plus size={16} />
                    <span className="text-[11px]">Upload</span>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </Field>
          </Section>

          <div className="flex justify-end gap-3 pb-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              {initial ? "Simpan Perubahan" : "Tambah Destinasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}