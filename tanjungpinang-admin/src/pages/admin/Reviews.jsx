import { useCallback, useEffect, useMemo, useState } from "react";
import { Star, Search, Trash2, X, RefreshCw } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

const API_URL = "http://localhost:3000/api";
const PER_PAGE = 10;

function StarRow({ rating }) {
  const value = Number(rating || 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={11}
          className={
            i < value
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 fill-gray-200"
          }
        />
      ))}
    </div>
  );
}

function formatDate(date) {
  if (!date) return "-";

  try {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(date);
  }
}

function getInitial(name = "U") {
  return String(name || "U").charAt(0).toUpperCase();
}

function UserAvatar({ name }) {
  return (
    <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
      {getInitial(name)}
    </div>
  );
}

function normalizeReview(review) {
  const verifiedValue =
    review.isVerifiedVisit || review.is_verified_visit || false;

  return {
    id: review.id,
    destinationId: review.destinationId || review.destination_id,
    destinationName:
      review.destinationName ||
      review.destination_name ||
      review.name ||
      "Destinasi",
    userId: review.userId || review.user_id || null,
    userName:
      review.userName ||
      review.user_name ||
      review.nama ||
      review.email ||
      "Pengguna",
    rating: Number(review.rating || 0),
    comment: review.comment || "",
    status: review.status || "visible",
    createdAt: review.createdAt || review.created_at || "",
    isVerifiedVisit: verifiedValue ? true : false,
  };
}

function ReviewDetail({ review, onClose, onDelete }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="Tutup modal"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
              {getInitial(review.userName)}
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900">
                {review.userName}
              </p>
              <p className="text-xs text-gray-500">
                {review.destinationName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <StarRow rating={review.rating} />

          <span className="text-xs text-gray-400">
            {formatDate(review.createdAt)}
          </span>
        </div>

        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 mb-5 leading-relaxed">
          {review.comment || "Tidak ada komentar."}
        </p>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1.5 px-4 py-2 text-sm border border-red-200 text-red-500 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={13} />
            Hapus Ulasan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterDest, setFilterDest] = useState("all");

  const [page, setPage] = useState(1);
  const [detailReview, setDetailReview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setErrorText("");

    try {
      const res = await fetch(`${API_URL}/reviews/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setReviews([]);
        setErrorText(json.message || "Gagal mengambil data ulasan");
        return;
      }

      setReviews((json.data || []).map(normalizeReview));
    } catch {
      setReviews([]);
      setErrorText(
        "Tidak bisa terhubung ke server. Pastikan backend Express berjalan."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDestinations = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/destinations/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setDestinations([]);
        return;
      }

      setDestinations(json.data || []);
    } catch {
      setDestinations([]);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
    fetchDestinations();
  }, [fetchReviews, fetchDestinations]);

  const filtered = useMemo(() => {
    return reviews.filter((review) => {
      const q = search.toLowerCase();

      const matchSearch =
        review.userName.toLowerCase().includes(q) ||
        review.destinationName.toLowerCase().includes(q) ||
        review.comment.toLowerCase().includes(q);

      const matchRating =
        filterRating === "all" ||
        Number(review.rating) === Number(filterRating);

      const matchDestination =
        filterDest === "all" ||
        String(review.destinationId) === String(filterDest);

      return matchSearch && matchRating && matchDestination;
    });
  }, [reviews, search, filterRating, filterDest]);

  const totalPages = Math.max(Math.ceil(filtered.length / PER_PAGE), 1);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "—";

  const handleDelete = async (id) => {
    if (!id) return;

    try {
      const res = await fetch(`${API_URL}/reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.message || "Gagal menghapus ulasan");
        return;
      }

      setDeleteTarget(null);

      if (detailReview?.id === id) {
        setDetailReview(null);
      }

      await fetchReviews();
    } catch {
      alert("Tidak bisa terhubung ke server.");
    }
  };

  const resetPage = (callback) => {
    callback();
    setPage(1);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">
            Rating & Ulasan
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {reviews.length} ulasan · avg rating {avgRating}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            fetchReviews();
            fetchDestinations();
          }}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="px-6 md:px-8 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">Total Ulasan</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {reviews.length}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">Rating Rata-rata</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">
              {avgRating}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                resetPage(() => {
                  setSearch(e.target.value);
                })
              }
              placeholder="Cari user, destinasi, komentar..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <select
            value={filterRating}
            onChange={(e) =>
              resetPage(() => {
                setFilterRating(e.target.value);
              })
            }
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none"
          >
            <option value="all">Semua Rating</option>
            {[5, 4, 3, 2, 1].map((ratingValue) => (
              <option key={ratingValue} value={ratingValue}>
                ⭐ {ratingValue}
              </option>
            ))}
          </select>

          <select
            value={filterDest}
            onChange={(e) =>
              resetPage(() => {
                setFilterDest(e.target.value);
              })
            }
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none"
          >
            <option value="all">Semua Destinasi</option>
            {destinations.map((destination) => (
              <option key={destination.id} value={String(destination.id)}>
                {destination.name || destination.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-400">
              Memuat data ulasan...
            </div>
          ) : errorText ? (
            <div className="py-16 text-center text-sm text-red-500">
              {errorText}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[650px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        User
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                        Destinasi
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Rating
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
                        Komentar
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                        Tanggal
                      </th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50">
                    {paginated.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-16 text-center text-sm text-gray-400"
                        >
                          Tidak ada ulasan ditemukan
                        </td>
                      </tr>
                    ) : (
                      paginated.map((review) => (
                        <tr
                          key={review.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <UserAvatar name={review.userName} />
                              <p className="text-xs font-semibold text-gray-800 truncate max-w-[120px]">
                                {review.userName}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-3.5 hidden md:table-cell">
                            <p className="text-xs text-gray-700 truncate max-w-[140px]">
                              {review.destinationName}
                            </p>
                          </td>

                          <td className="px-5 py-3.5">
                            <StarRow rating={review.rating} />
                          </td>

                          <td className="px-5 py-3.5 hidden lg:table-cell">
                            <p className="text-xs text-gray-500 truncate max-w-[220px]">
                              {review.comment}
                            </p>
                          </td>

                          <td className="px-5 py-3.5 text-xs text-gray-400 hidden md:table-cell">
                            {formatDate(review.createdAt)}
                          </td>

                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1 justify-end">
                              <button
                                type="button"
                                onClick={() => setDetailReview(review)}
                                className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                              >
                                Detail
                              </button>

                              <button
                                type="button"
                                onClick={() => setDeleteTarget(review.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    {filtered.length} ulasan · Halaman {page} dari {totalPages}
                  </p>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() =>
                        setPage((prevPage) => Math.max(prevPage - 1, 1))
                      }
                      className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                    >
                      ←
                    </button>

                    <button
                      type="button"
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((prevPage) =>
                          Math.min(prevPage + 1, totalPages)
                        )
                      }
                      className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {detailReview && (
        <ReviewDetail
          review={
            reviews.find((review) => review.id === detailReview.id) ||
            detailReview
          }
          onClose={() => setDetailReview(null)}
          onDelete={() => setDeleteTarget(detailReview.id)}
        />
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Hapus Ulasan"
        description="Ulasan ini akan dihapus secara permanen."
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}