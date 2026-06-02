import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import {
  Pencil,
  Trash2,
  Plus,
  Landmark,
  Waves,
  UtensilsCrossed,
  MoonStar,
  TreePine,
  Palette,
  Mountain,
  Building2,
  Star,
  Compass,
  Search,
  X,
} from "lucide-react";
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

export const iconMap = {
  Landmark,
  Waves,
  UtensilsCrossed,
  MoonStar,
  TreePine,
  Palette,
  Mountain,
  Building2,
  Star,
  Compass,
};

export function CategoryIcon({
  icon,
  size = 15,
  className = "text-gray-500",
}) {
  const Icon = iconMap[icon] || Compass;
  return <Icon size={size} className={className} />;
}

const statusStyles = {
  true: "bg-emerald-50 text-emerald-700 border-emerald-200",
  false: "bg-gray-100 text-gray-500 border-gray-200",
};

function CategoryForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || {
      name: "",
      icon: "Landmark",
      image: "",
      description: "",
      isActive: true,
    }
  );

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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const imageBase64 = await compressImage(file);
      set("image", imageBase64);
    } catch (error) {
      alert(error.message || "Gagal upload gambar");
    }

    e.target.value = "";
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    onSave({
      ...form,
      name: form.name.trim(),
      description: form.description || "",
      image: form.image || "",
      icon: form.icon || "Landmark",
      isActive: Boolean(form.isActive),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-bold text-gray-900 mb-5">
          {initial ? "Edit Kategori" : "Tambah Kategori"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Nama Kategori *
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Contoh: Pantai"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Icon{" "}
              <span className="text-gray-400 font-normal">
                (filter & tampilan compact)
              </span>
            </label>

            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map(({ label, value, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("icon", value)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                    form.icon === value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-[10px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Image/Banner{" "}
              <span className="text-gray-400 font-normal">
                (card kategori di homepage)
              </span>
            </label>

            {form.image ? (
              <div className="relative">
                <img
                  src={form.image}
                  alt="Preview kategori"
                  className="w-full h-28 object-cover rounded-xl border border-gray-200"
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
              <label className="w-full h-28 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors cursor-pointer">
                <Plus size={22} />
                <span className="text-xs">Upload Gambar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Deskripsi Singkat
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
              placeholder="Tulis deskripsi singkat kategori"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Status
            </label>
            <select
              value={form.isActive ? "true" : "false"}
              onChange={(e) => set("isActive", e.target.value === "true")}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none bg-white"
            >
              <option value="true">Aktif (tampil di user web)</option>
              <option value="false">Nonaktif (sembunyikan)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Categories() {
  const {
    categories,
    destinations,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useAppStore();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = categories.filter((category) =>
    (category.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const getCount = (name) => {
    return destinations.filter((destination) => destination.category === name)
      .length;
  };

  const handleSave = (item) => {
    if (item.id) {
      updateCategory(item.id, item);
    } else {
      addCategory(item);
    }

    setFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">Kategori</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {categories.length} kategori ·{" "}
            {categories.filter((category) => category.isActive).length} aktif
          </p>
        </div>

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

      <div className="px-6 md:px-8 py-5">
        <div className="flex gap-3 mb-5">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kategori..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 w-56"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-sm text-gray-400">
            Tidak ada kategori ditemukan
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((category) => (
              <div
                key={category.id}
                className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-24 object-cover"
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
                    <CategoryIcon
                      icon={category.icon}
                      size={28}
                      className="text-gray-300"
                    />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <CategoryIcon
                          icon={category.icon}
                          size={14}
                          className="text-indigo-500"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {category.name}
                        </p>
                        <span
                          className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium border ${
                            category.isActive
                              ? statusStyles.true
                              : statusStyles.false
                          }`}
                        >
                          {category.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(category);
                          setFormOpen(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Pencil size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(category.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                    {category.description}
                  </p>

                  <p className="text-xs text-indigo-600 font-medium mt-2">
                    {getCount(category.name)} destinasi
                  </p>
                </div>
              </div>
            ))}
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
        />
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus Kategori"
        description="Kategori ini akan dihapus secara permanen."
        onConfirm={() => {
          deleteCategory(deleteTarget);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}