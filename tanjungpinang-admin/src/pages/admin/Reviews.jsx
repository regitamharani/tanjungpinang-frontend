import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Star, Search, Trash2, ShieldCheck, X } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={11} className={i < rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
      ))}
    </div>
  );
}

function ReviewDetail({ review, onClose, onDelete }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="text-sm font-bold text-gray-900">{review.userName}</p>
              <p className="text-xs text-gray-500">{review.destinationName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X size={15} /></button>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <StarRow rating={review.rating} />
          <span className="text-xs text-gray-400">{review.createdAt}</span>
          {review.isVerifiedVisit && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs">
              <ShieldCheck size={10} />Verified Visit
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 mb-5 leading-relaxed">{review.comment}</p>
        <div className="flex justify-end">
          <button onClick={onDelete}
            className="flex items-center gap-1.5 px-4 py-2 text-sm border border-red-200 text-red-500 rounded-lg hover:bg-red-50">
            <Trash2 size={13} /> Hapus Ulasan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Reviews() {
  const { reviews, destinations, deleteReview } = useAppStore();
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterDest, setFilterDest] = useState("all");
  const [filterVerified, setFilterVerified] = useState("all");
  const [page, setPage] = useState(1);
  const [detailReview, setDetailReview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const PER_PAGE = 10;

  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.userName.toLowerCase().includes(q) || r.destinationName.toLowerCase().includes(q) || r.comment.toLowerCase().includes(q)) &&
      (filterRating === "all" || r.rating === Number(filterRating)) &&
      (filterDest === "all" || String(r.destinationId) === filterDest) &&
      (filterVerified === "all" || (filterVerified === "yes" ? r.isVerifiedVisit : !r.isVerifiedVisit))
    );
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Statistics
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";
  const verifiedCount = reviews.filter(r => r.isVerifiedVisit).length;

  // Auto testimonial logic (frontend user akan pakai ini)
  const autoTestimonials = reviews
    .filter(r => r.rating >= 4 && r.isVerifiedVisit && r.comment)
    .sort((a, b) => b.rating - a.rating || new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const handleDelete = (id) => {
    deleteReview(id);
    setDeleteTarget(null);
    if (detailReview?.id === id) setDetailReview(null);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5">
        <h1 className="text-base font-bold text-gray-900">Rating & Ulasan</h1>
        <p className="text-sm text-gray-500 mt-0.5">{reviews.length} ulasan · {verifiedCount} verified visit · avg rating {avgRating}</p>
      </div>

      <div className="px-6 md:px-8 py-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">Total Ulasan</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{reviews.length}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">Rating Rata-rata</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">{avgRating}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">Verified Visit</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{verifiedCount}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">Auto Testimonial</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{autoTestimonials.length}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">tampil di homepage</p>
          </div>
        </div>

        {/* Auto testimonial info */}
        <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl mb-5">
          <ShieldCheck size={15} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Testimonial homepage otomatis: ulasan dengan <strong>rating ≥ 4</strong> + <strong>verified visit</strong>, diurutkan rating tertinggi. Maks. 6 ulasan. Admin tidak perlu memilih manual.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari user, destinasi, komentar..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
          <select value={filterRating} onChange={(e) => { setFilterRating(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none">
            <option value="all">Semua Rating</option>
            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>⭐ {r}</option>)}
          </select>
          <select value={filterDest} onChange={(e) => { setFilterDest(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none">
            <option value="all">Semua Destinasi</option>
            {destinations.map(d => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
          </select>
          <select value={filterVerified} onChange={(e) => { setFilterVerified(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none">
            <option value="all">Verified: Semua</option>
            <option value="yes">Verified Visit</option>
            <option value="no">Belum Verified</option>
          </select>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">User</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Destinasi</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Rating</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Komentar</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Tanggal</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Verified</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.length === 0 ? (
                  <tr><td colSpan={7} className="py-16 text-center text-sm text-gray-400">Tidak ada ulasan ditemukan</td></tr>
                ) : paginated.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img src={r.userAvatar} alt={r.userName} className="w-7 h-7 rounded-full object-cover shrink-0" />
                        <p className="text-xs font-semibold text-gray-800 truncate max-w-[100px]">{r.userName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <p className="text-xs text-gray-700 truncate max-w-[130px]">{r.destinationName}</p>
                    </td>
                    <td className="px-5 py-3.5"><StarRow rating={r.rating} /></td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{r.comment}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400 hidden md:table-cell">{r.createdAt}</td>
                    <td className="px-5 py-3.5">
                      {r.isVerifiedVisit ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs">
                          <ShieldCheck size={9} />Ya
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => setDetailReview(r)} className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">Detail</button>
                        <button onClick={() => setDeleteTarget(r.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">{filtered.length} ulasan · Halaman {page} dari {totalPages}</p>
              <div className="flex gap-1">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">←</button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">→</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {detailReview && (
        <ReviewDetail
          review={reviews.find(r => r.id === detailReview.id) || detailReview}
          onClose={() => setDetailReview(null)}
          onDelete={() => setDeleteTarget(detailReview.id)}
        />
      )}
      <ConfirmModal open={!!deleteTarget} title="Hapus Ulasan" description="Ulasan ini akan dihapus secara permanen."
        onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}