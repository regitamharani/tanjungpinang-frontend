import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  Star,
  Globe,
} from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";
import DestinationForm from "@/pages/admin/DestinationForm";
import DestinationDetail from "@/pages/admin/DestinationDetail";

const statusStyles = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  unpublished: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function Destinations() {
  const {
    destinations,
    categories,
    deleteDestination,
    togglePublish,
  } = useAppStore();

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = destinations.filter((d) => {
    const q = search.trim().toLowerCase();

    const name = (d.name || d.nama || "").toLowerCase();
    const category = (d.category || d.kategori || "").toLowerCase();

    const currentCategory = d.category || d.kategori || "";

    const matchSearch =
      q === "" ||
      name.includes(q) ||
      category.includes(q);

    const matchCategory =
      filterCat === "all" || currentCategory === filterCat;

    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && d.isPublished) ||
      (filterStatus === "unpublished" && !d.isPublished);

    return matchSearch && matchCategory && matchStatus;
  });

  if (view === "form") {
    return (
      <DestinationForm
        initial={selected}
        onSave={() => setView("list")}
        onCancel={() => setView("list")}
      />
    );
  }

  if (view === "detail") {
    return (
      <DestinationDetail
        destination={selected}
        onBack={() => setView("list")}
        onEdit={(d) => {
          setSelected(d);
          setView("form");
        }}
      />
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">
            Kelola Destinasi
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {destinations.length} destinasi ·{" "}
            {destinations.filter((d) => d.isPublished).length} published
          </p>
        </div>

        <button
          onClick={() => {
            setSelected(null);
            setView("form");
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shrink-0 shadow-sm"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Tambah Destinasi</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      <div className="px-6 md:px-8 py-5">
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama destinasi atau kategori..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="all">Semua Status</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Destinasi
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                    Kategori
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
                    Rating Web
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
                    Rating Google
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                    Views
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-16 text-center text-sm text-gray-400"
                    >
                      Tidak ada destinasi ditemukan
                    </td>
                  </tr>
                ) : (
                  filtered.map((d) => {
                    const name = d.name || d.nama || "-";
                    const location = d.location || d.lokasi || "-";
                    const category = d.category || d.kategori || "-";
                    const image = d.mainImage || d.gambar || d.img || "";

                    return (
                      <tr
                        key={d.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={image}
                              alt={name}
                              className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                            />

                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 truncate">
                                {name}
                              </p>
                              <p className="text-xs text-gray-400 truncate max-w-[180px]">
                                {location}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            {category}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 hidden lg:table-cell">
                          {d.ratingAverage > 0 ? (
                            <div className="flex items-center gap-1">
                              <Star
                                size={12}
                                className="text-amber-400 fill-amber-400"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {d.ratingAverage}
                              </span>
                              <span className="text-xs text-gray-400">
                                ({d.reviewCount})
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 hidden lg:table-cell">
                          {d.googleRating > 0 ? (
                            <div className="flex items-center gap-1">
                              <Globe size={11} className="text-blue-400" />
                              <span className="text-sm text-gray-600">
                                {d.googleRating}
                              </span>
                              <span className="text-xs text-gray-400">
                                ({d.googleReviewCount})
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell tabular-nums">
                          {d.visitCount || 0}
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
                              d.isPublished
                                ? statusStyles.published
                                : statusStyles.unpublished
                            }`}
                          >
                            {d.isPublished ? "Published" : "Unpublished"}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => {
                                setSelected(d);
                                setView("detail");
                              }}
                              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Detail"
                            >
                              <Eye size={14} />
                            </button>

                            <button
                              onClick={() => {
                                setSelected(d);
                                setView("form");
                              }}
                              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>

                            <button
                              onClick={() => togglePublish(d.id)}
                              className={`px-2 py-1 text-xs rounded border transition-colors hidden sm:block ${
                                d.isPublished
                                  ? "border-gray-200 text-gray-500 hover:bg-gray-50"
                                  : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                              }`}
                            >
                              {d.isPublished ? "Unpublish" : "Publish"}
                            </button>

                            <button
                              onClick={() => setDeleteTarget(d.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus Destinasi"
        description="Destinasi ini akan dihapus secara permanen."
        onConfirm={() => {
          deleteDestination(deleteTarget);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}