import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Plane,
  Bike,
  Lightbulb,
  Hotel,
  MapPin,
  Info,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

const API_URL = "http://localhost:3000/api";

const ICON_OPTIONS = [
  { label: "Pesawat", value: "Plane", Icon: Plane },
  { label: "Motor/Sepeda", value: "Bike", Icon: Bike },
  { label: "Tips", value: "Lightbulb", Icon: Lightbulb },
  { label: "Hotel", value: "Hotel", Icon: Hotel },
  { label: "Lokasi", value: "MapPin", Icon: MapPin },
  { label: "Info", value: "Info", Icon: Info },
];

const ICON_MAP = {
  Plane,
  Bike,
  Lightbulb,
  Hotel,
  MapPin,
  Info,
};

function GuideIcon({ icon, size = 16, className = "text-gray-500" }) {
  const Icon = ICON_MAP[icon] || Info;
  return <Icon size={size} className={className} />;
}

const normalizeGuide = (item, index) => ({
  id: item.id ?? index + 1,
  title: item.title || "",
  description: item.description || "",
  icon: item.icon || "Info",
  sortOrder: Number(item.sortOrder ?? item.sort_order ?? index + 1),
  isActive:
    item.isActive === true ||
    item.is_active === true ||
    item.is_active === 1 ||
    item.is_active === "1",
  createdAt: item.createdAt || item.created_at || null,
  updatedAt: item.updatedAt || item.updated_at || null,
});

function GuideForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(
    initial || {
      title: "",
      description: "",
      icon: "Info",
      sortOrder: 1,
      isActive: true,
    }
  );

  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const inputCls =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-5">
          {initial ? "Edit Panduan" : "Tambah Panduan"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Judul *
            </label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputCls}
              placeholder="Contoh: Transportasi ke Tanjung Pinang"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Icon
            </label>

            <div className="grid grid-cols-3 gap-2">
              {ICON_OPTIONS.map(({ label, value, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("icon", value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                    form.icon === value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <Icon size={14} />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Deskripsi
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={`${inputCls} resize-none`}
              placeholder="Tulis panduan singkat untuk user..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Urutan
              </label>
              <input
                type="number"
                min={1}
                value={form.sortOrder}
                onChange={(e) => set("sortOrder", Number(e.target.value))}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Status
              </label>
              <select
                value={form.isActive ? "true" : "false"}
                onChange={(e) => set("isActive", e.target.value === "true")}
                className={`${inputCls} bg-white`}
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => {
              if (!form.title.trim()) return;
              onSave(form);
            }}
            className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TravelGuide() {
  const [travelGuides, setTravelGuides] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorText, setErrorText] = useState("");

  const fetchJson = useCallback(async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        ...(options.headers || {}),
      },
    });

    const text = await response.text();

    let json = {};

    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      throw new Error("Response backend bukan JSON");
    }

    if (!response.ok || !json.success) {
      throw new Error(json.message || "Terjadi kesalahan pada server");
    }

    return json;
  }, []);

  const fetchTravelGuides = useCallback(async () => {
    try {
      setLoading(true);
      setErrorText("");

      const json = await fetchJson(`${API_URL}/travel-guides/admin`);

      const data = Array.isArray(json.data) ? json.data : [];
      setTravelGuides(data.map(normalizeGuide));
    } catch (error) {
      setTravelGuides([]);
      setErrorText(
        error instanceof Error
          ? error.message
          : "Tidak bisa terhubung ke server."
      );
    } finally {
      setLoading(false);
    }
  }, [fetchJson]);

  useEffect(() => {
    fetchTravelGuides();
  }, [fetchTravelGuides]);

  const sorted = useMemo(() => {
    return [...travelGuides].sort(
      (a, b) => a.sortOrder - b.sortOrder || a.id - b.id
    );
  }, [travelGuides]);

  const handleSave = async (data) => {
    try {
      setSaving(true);

      const payload = {
        title: data.title,
        description: data.description,
        icon: data.icon,
        sortOrder: Number(data.sortOrder) || 1,
        isActive: data.isActive,
      };

      if (editing?.id) {
        await fetchJson(`${API_URL}/travel-guides/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await fetchJson(`${API_URL}/travel-guides`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setFormOpen(false);
      setEditing(null);
      await fetchTravelGuides();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan panduan liburan"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setSaving(true);

      await fetchJson(`${API_URL}/travel-guides/${deleteTarget}`, {
        method: "DELETE",
      });

      setDeleteTarget(null);
      await fetchTravelGuides();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus panduan liburan"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await fetchJson(`${API_URL}/travel-guides/${id}/toggle`, {
        method: "PATCH",
      });

      await fetchTravelGuides();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Gagal mengubah status panduan"
      );
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">
            Panduan Liburan
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Panduan perjalanan yang tampil di halaman user
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTravelGuides}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors shrink-0"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
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
        {errorText && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{errorText}</p>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center bg-white border border-gray-100 rounded-xl">
            <RefreshCw className="mx-auto mb-3 animate-spin text-gray-300" />
            <p className="text-sm text-gray-400">Memuat panduan liburan...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((guide) => (
              <div
                key={guide.id}
                className={`bg-white border rounded-xl shadow-sm p-5 flex items-start gap-4 ${
                  guide.isActive
                    ? "border-gray-100"
                    : "border-gray-100 opacity-60"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <GuideIcon
                    icon={guide.icon}
                    size={18}
                    className="text-indigo-500"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-semibold text-gray-800">
                      {guide.title}
                    </p>

                    <span className="text-xs text-gray-300">
                      #{guide.sortOrder}
                    </span>

                    <span
                      className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium border ${
                        guide.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-100 text-gray-400 border-gray-200"
                      }`}
                    >
                      {guide.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    {guide.description || "Tidak ada deskripsi"}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleToggle(guide.id)}
                    className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hidden sm:block"
                  >
                    {guide.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>

                  <button
                    onClick={() => {
                      setEditing(guide);
                      setFormOpen(true);
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Pencil size={13} />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(guide.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}

            {sorted.length === 0 && (
              <div className="py-16 text-center bg-white border border-gray-100 rounded-xl">
                <p className="text-sm text-gray-400">
                  Belum ada panduan liburan
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {formOpen && (
        <GuideForm
          initial={editing}
          saving={saving}
          onSave={handleSave}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus Panduan"
        description="Panduan ini akan dihapus secara permanen."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}