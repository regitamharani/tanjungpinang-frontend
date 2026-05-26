import { useState } from "react";
import { ChevronLeft, Pencil, MapPin, Clock, Ticket, Bookmark, ExternalLink, ChevronLeft as Prev, ChevronRight as Next, Images } from "lucide-react";

export default function DestinationDetail({ destination: d, onBack, onEdit }) {
  const [imgIdx, setImgIdx] = useState(0);
  const allImages = [d.image, ...(d.gallery || [])].filter(Boolean);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-gray-900 truncate">{d.name}</h1>
          <p className="text-sm text-gray-500">{d.category}</p>
        </div>
        <button onClick={() => onEdit(d)}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shrink-0">
          <Pencil size={13} /> Edit
        </button>
      </div>

      <div className="px-6 md:px-8 py-6 max-w-3xl">
        {/* Image Viewer */}
        {allImages.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-5">
            <div className="relative">
              <img src={allImages[imgIdx]} alt={d.name} className="w-full h-56 md:h-72 object-cover" />
              {allImages.length > 1 && (
                <>
                  <button onClick={() => setImgIdx((i) => (i === 0 ? allImages.length - 1 : i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors">
                    <Prev size={16} />
                  </button>
                  <button onClick={() => setImgIdx((i) => (i === allImages.length - 1 ? 0 : i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors">
                    <Next size={16} />
                  </button>
                  <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                    {imgIdx + 1}/{allImages.length}
                  </span>
                </>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {allImages.map((url, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`shrink-0 w-14 h-11 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? "border-indigo-500" : "border-transparent opacity-60"}`}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={14} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Alamat</p>
                <p className="text-sm text-gray-700 mt-0.5">{d.address || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                <Ticket size={14} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Harga Tiket</p>
                <p className="text-sm text-gray-700 mt-0.5">
                  {d.ticketPrice === 0 ? <span className="text-emerald-600 font-semibold">Gratis</span> : `Rp ${d.ticketPrice.toLocaleString("id-ID")}`}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={14} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Jam Buka</p>
                <p className="text-sm text-gray-700 mt-0.5">{d.openingHours || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
                <Bookmark size={14} className="text-rose-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Bookmark</p>
                <p className="text-sm text-gray-700 mt-0.5">{d.bookmarks} pengguna</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
                <Images size={14} className="text-violet-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Galeri</p>
                <p className="text-sm text-gray-700 mt-0.5">{(d.gallery || []).length} gambar</p>
              </div>
            </div>
            {d.mapsLink && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                  <ExternalLink size={14} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Google Maps</p>
                  <a href={d.mapsLink} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline mt-0.5 block">Buka di Maps</a>
                </div>
              </div>
            )}
          </div>
        </div>

        {d.description && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Deskripsi</p>
            <p className="text-sm text-gray-600 leading-relaxed">{d.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}