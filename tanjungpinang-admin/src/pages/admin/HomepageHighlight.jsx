import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Globe,
  X,
  ImagePlus,
  RefreshCw,
} from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

const API_URL = "http://localhost:3000/api";

const inputCls =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200";

const defaultForm = {
  title: "",
  subtitle: "",
  image: "",
  buttonText: "Jelajahi Sekarang",
  buttonLink: "/destination",
  badge: "Pilihan Editor",
  isActive: false,
};

const isActiveValue = (value) => {
  return value === true || value === 1 || value === "1" || value === "true";
};

const normalizeHighlight = (item) => ({
  id: item.id,
  title: item.title || "",
  subtitle: item.subtitle || "",
  image: item.image || "",
  buttonText: item.buttonText || item.button_text || "Jelajahi Sekarang",
  buttonLink: item.buttonLink || item.button_link || "/destination",
  badge: item.badge || "Pilihan Editor",
  isActive: isActiveValue(item.isActive ?? item.is_active),
});

function HighlightForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || defaultForm);
  const [saving, setSaving] = useState(false);

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
          const maxWidth = 1400;
          const maxHeight = 700;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpeg", 0.8));
        };

        img.onerror = () => reject(new Error("Gagal membaca gambar"));
        img.src = event.target.result;
      };

      reader.onerror = () => reject(new Error("Gagal membaca file"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const imageBase64 = await compressImage(file);
      set("image", imageBase64);
    } catch (error) {
      alert(error.message || "Gagal upload gambar");
    }

    event.target.value = "";
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert("Judul wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      await onSave({
        ...form,
        title: form.title.trim(),
        subtitle: form.subtitle || "",
        image: form.image || "",
        buttonText: form.buttonText || "Jelajahi Sekarang",
        buttonLink: form.buttonLink || "/destination",
        badge: form.badge || "Pilihan Editor",
        isActive: form.isActive ? true : false,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-bold text-gray-900 mb-5">
          {initial ? "Edit Highlight" : "Tambah Highlight"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Judul *
            </label>
            <input
              value={form.title}
              onChange={(event) => set("title", event.target.value)}
              className={inputCls}
              placeholder="Jelajahi Tanjungpinang"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Subtitle
            </label>
            <textarea
              rows={2}
              value={form.subtitle}
              onChange={(event) => set("subtitle", event.target.value)}
              className={`${inputCls} resize-none`}
              placeholder="Kota Gurindam, Kota Bersejarah..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Badge
            </label>
            <input
              value={form.badge}
              onChange={(event) => set("badge", event.target.value)}
              className={inputCls}
              placeholder="Pilihan Editor"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Gambar/Banner
            </label>

            {form.image ? (
              <div className="relative">
                <img
                  src={form.image}
                  alt="Preview highlight"
                  className="mt-2 w-full h-36 object-cover rounded-xl border border-gray-200"
                />

                <button
                  type="button"
                  onClick={() => set("image", "")}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow"
                >
                  <X size={13} />
                </button>

                <label className="mt-2 inline-block text-xs text-indigo-600 hover:underline cursor-pointer">
                  Ganti gambar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="w-full h-36 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors cursor-pointer">
                <ImagePlus size={28} />
                <span className="text-xs">Upload Gambar Banner</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Teks Button
              </label>
              <input
                value={form.buttonText}
                onChange={(event) => set("buttonText", event.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Link Button
              </label>
              <input
                value={form.buttonLink}
                onChange={(event) => set("buttonLink", event.target.value)}
                className={inputCls}
                placeholder="/destination/pantai-trikora"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Status
            </label>
            <select
              value={form.isActive ? "true" : "false"}
              onChange={(event) =>
                set("isActive", event.target.value === "true")
              }
              className={`${inputCls} bg-white`}
            >
              <option value="false">Nonaktif</option>
              <option value="true">Aktif (tampil di homepage)</option>
            </select>

            <p className="text-xs text-amber-600 mt-1">
              ⚠ Hanya 1 highlight boleh aktif. Mengaktifkan ini akan
              menonaktifkan yang lain.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-60"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomepageHighlight() {
  const [homepageHighlights, setHomepageHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchHighlights = useCallback(async () => {
    try {
      setLoading(true);
      setErrorText("");

      const res = await fetch(`${API_URL}/homepage-highlights`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setHomepageHighlights([]);
        setErrorText(json.message || "Gagal mengambil highlight");
        return;
      }

      setHomepageHighlights((json.data || []).map(normalizeHighlight));
    } catch {
      setHomepageHighlights([]);
      setErrorText("Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  const handleSave = async (data) => {
    const isEdit = data.id;
    const url = isEdit
      ? `${API_URL}/homepage-highlights/${data.id}`
      : `${API_URL}/homepage-highlights`;

    const method = isEdit ? "PUT" : "POST";

    const payload = {
      title: data.title,
      subtitle: data.subtitle,
      image: data.image,
      buttonText: data.buttonText,
      buttonLink: data.buttonLink,
      badge: data.badge,
      isActive: data.isActive ? true : false,
    };

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      alert(json.message || "Gagal menyimpan highlight");
      return;
    }

    setFormOpen(false);
    setEditing(null);
    await fetchHighlights();
  };

  const handleActivate = async (id) => {
    const res = await fetch(`${API_URL}/homepage-highlights/${id}/activate`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      alert(json.message || "Gagal mengaktifkan highlight");
      return;
    }

    await fetchHighlights();
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${API_URL}/homepage-highlights/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      alert(json.message || "Gagal menghapus highlight");
      return;
    }

    setDeleteTarget(null);
    await fetchHighlights();
  };

  const activeHighlight = homepageHighlights.find((item) => item.isActive);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">
            Homepage Highlight
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Section pilihan editor/banner yang tampil di homepage user.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchHighlights}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors shrink-0"
          >
            <RefreshCw size={14} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shrink-0 shadow-sm"
          >
            <Plus size={14} />
            Tambah
          </button>
        </div>
      </div>

      <div className="px-6 md:px-8 py-6 max-w-3xl">
        {activeHighlight && (
          <div className="mb-5 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <Globe size={15} className="text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-800">
              Aktif di homepage: <strong>"{activeHighlight.title}"</strong>
            </p>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center bg-white border border-gray-100 rounded-xl">
            <p className="text-sm text-gray-400">Memuat highlight...</p>
          </div>
        ) : errorText ? (
          <div className="py-16 text-center bg-white border border-red-100 rounded-xl">
            <p className="text-sm text-red-500">{errorText}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {homepageHighlights.map((item) => (
              <div
                key={item.id}
                className={`bg-white border rounded-xl shadow-sm overflow-hidden ${
                  item.isActive ? "border-emerald-200" : "border-gray-100"
                }`}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-36 object-cover"
                  />
                ) : (
                  <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-gray-400">
                    <ImagePlus size={28} />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-gray-900">
                          {item.title}
                        </p>

                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
                            item.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-gray-100 text-gray-500 border-gray-200"
                          }`}
                        >
                          {item.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                        {item.subtitle}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs font-medium">
                          {item.badge}
                        </span>

                        <span className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded text-xs font-medium">
                          {item.buttonText}
                        </span>

                        <span className="text-xs text-gray-400">
                          {item.buttonLink}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!item.isActive && (
                        <button
                          type="button"
                          onClick={() => handleActivate(item.id)}
                          className="px-2.5 py-1 text-xs border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                          Aktifkan
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setEditing(item);
                          setFormOpen(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Pencil size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {homepageHighlights.length === 0 && (
              <div className="py-16 text-center bg-white border border-gray-100 rounded-xl">
                <p className="text-sm text-gray-400">
                  Belum ada homepage highlight
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {formOpen && (
        <HighlightForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Hapus Highlight"
        description="Highlight ini akan dihapus secara permanen."
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}