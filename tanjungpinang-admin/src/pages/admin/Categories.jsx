import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  X,
  ImagePlus,
  Link as LinkIcon,
  Loader2,
  RefreshCw,
} from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

const API_URL = "http://localhost:3000/api/categories";

const emojiOptions = [
  "🏝️",
  "🌊",
  "🍽️",
  "🕌",
  "🌳",
  "🎨",
  "⛰️",
  "🏙️",
  "⭐",
  "🧭",
  "🏛️",
  "📸",
];

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-gray-100 text-gray-500 border-gray-200",
};

const emptyForm = {
  name: "",
  image: "",
  emoji: "🏝️",
  isActive: true,
};

function CategoryForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const set = (key, value) => {
    setError("");
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("File tidak ditemukan"));
        return;
      }

      if (!file.type.startsWith("image/")) {
        reject(new Error("File harus berupa gambar"));
        return;
      }

      const maxSize = 5 * 1024 * 1024;

      if (file.size > maxSize) {
        reject(new Error("Ukuran gambar maksimal 5MB"));
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 1000;
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

          if (!ctx) {
            reject(new Error("Browser tidak mendukung kompres gambar"));
            return;
          }

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

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const base64 = await compressImage(file);
      set("image", base64);
      setImageUrl("");
    } catch (err) {
      setError(err.message || "Gagal upload gambar");
    }

    event.target.value = "";
  };

  const handleUseUrl = () => {
    const url = imageUrl.trim();

    if (!url) {
      setError("URL gambar tidak boleh kosong");
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("URL gambar harus diawali http:// atau https://");
      return;
    }

    set("image", url);
    setImageUrl("");
  };

  const handleSubmit = () => {
    const name = form.name.trim();

    if (!name) {
      setError("Nama kategori wajib diisi");
      return;
    }

    onSave({
      id: form.id,
      name,
      image: form.image || "",
      emoji: form.emoji || "🏝️",
      isActive: Boolean(form.isActive),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Tutup modal"
        onClick={onCancel}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {initial ? "Edit Kategori" : "Tambah Kategori"}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Data kategori akan disimpan langsung ke database.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-60"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Nama Kategori <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Contoh: Pantai"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Emoji
            </label>

            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => set("emoji", emoji)}
                  className={`flex h-10 items-center justify-center rounded-xl border text-lg transition ${
                    form.emoji === emoji
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Gambar Kategori
            </label>

            {form.image ? (
              <div className="relative">
                <img
                  src={form.image}
                  alt="Preview kategori"
                  className="h-32 w-full rounded-xl border border-gray-200 object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/800x400?text=Gambar+Tidak+Valid";
                  }}
                />

                <button
                  type="button"
                  onClick={() => set("image", "")}
                  className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                >
                  <X size={14} />
                </button>

                <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-indigo-600 hover:underline">
                  <ImagePlus size={13} />
                  Ganti gambar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 transition hover:border-indigo-300 hover:text-indigo-500">
                <ImagePlus size={24} />
                <span className="text-xs font-medium">
                  Upload gambar dari perangkat
                </span>
                <span className="text-[11px] text-gray-400">
                  JPG, PNG, WEBP maksimal 5MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            )}

            <div className="mt-3 flex gap-2">
              <div className="relative flex-1">
                <LinkIcon
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Atau tempel URL gambar"
                  className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <button
                type="button"
                onClick={handleUseUrl}
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Pakai
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Status
            </label>
            <select
              value={form.isActive ? "true" : "false"}
              onChange={(e) => set("isActive", e.target.value === "true")}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="true">Aktif - tampil di user web</option>
              <option value="false">Nonaktif - sembunyikan</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil data kategori");
      }

      setCategories(result.data || []);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengambil kategori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return categories.filter((category) => {
      const name = String(category.name || "").toLowerCase();

      const matchSearch = !keyword || name.includes(keyword);

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && category.isActive) ||
        (statusFilter === "inactive" && !category.isActive);

      return matchSearch && matchStatus;
    });
  }, [categories, search, statusFilter]);

  const activeCount = categories.filter((category) => category.isActive).length;
  const inactiveCount = categories.length - activeCount;

  const handleSave = async (item) => {
    try {
      setSaving(true);

      const isEdit = Boolean(item.id);
      const url = isEdit ? `${API_URL}/${item.id}` : API_URL;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: item.name,
          image: item.image,
          emoji: item.emoji,
          isActive: item.isActive,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan kategori");
      }

      await fetchCategories();
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      alert(err.message || "Gagal menyimpan kategori");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      const response = await fetch(`${API_URL}/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menghapus kategori");
      }

      await fetchCategories();
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message || "Gagal menghapus kategori");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="border-b border-gray-100 bg-white px-5 py-5 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">Kategori</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Kelola kategori destinasi yang tersimpan di database.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={fetchCategories}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm transition hover:bg-gray-50"
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
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Plus size={14} />
              Tambah Kategori
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500">Total Kategori</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {categories.length}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs font-medium text-emerald-600">Aktif</p>
            <p className="mt-1 text-xl font-bold text-emerald-700">
              {activeCount}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500">Nonaktif</p>
            <p className="mt-1 text-xl font-bold text-gray-700">
              {inactiveCount}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 md:px-8">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kategori..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-indigo-200 md:w-44"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center rounded-xl border border-gray-100 bg-white p-10 text-sm text-gray-500">
            <Loader2 size={18} className="mr-2 animate-spin" />
            Memuat kategori...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white p-10 text-center">
            <p className="text-sm font-medium text-gray-700">
              Tidak ada kategori ditemukan
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Coba tambah kategori baru atau ubah filter pencarian.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((category) => {
              const statusClass = category.isActive
                ? statusStyles.active
                : statusStyles.inactive;

              return (
                <div
                  key={category.id}
                  className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-28 w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/800x400?text=Gambar+Tidak+Valid";
                      }}
                    />
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center bg-gray-100 text-4xl">
                      {category.emoji || "🧭"}
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-lg">
                          {category.emoji || "🧭"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-800">
                            {category.name}
                          </p>

                          <span
                            className={`mt-1 inline-flex rounded border px-1.5 py-0.5 text-xs font-medium ${statusClass}`}
                          >
                            {category.isActive ? "Aktif" : "Nonaktif"}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(category);
                            setFormOpen(true);
                          }}
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                          title="Edit kategori"
                        >
                          <Pencil size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(category)}
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                          title="Hapus kategori"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <p className="text-xs text-gray-400">
                        ID Kategori: {category.id}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {formOpen && (
        <CategoryForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          saving={saving}
        />
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus Kategori"
        description={
          deleteTarget
            ? `Kategori "${deleteTarget.name}" akan dihapus secara permanen.`
            : "Kategori ini akan dihapus secara permanen."
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}