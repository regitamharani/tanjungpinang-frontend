import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Plus, Trash2, ChevronLeft, ChevronRight, X, Images } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

function Slideshow({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1));
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/60 hover:text-white"><X size={20} /></button>
      <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">{idx + 1} / {images.length}</span>
      {images.length > 1 && (
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
      )}
      <div className="max-w-3xl w-full mx-16">
        <img src={images[idx]} alt="" className="w-full max-h-[75vh] object-contain rounded-xl" />
      </div>
      {images.length > 1 && (
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
          <ChevronRight size={20} />
        </button>
      )}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-lg overflow-x-auto px-2">
          {images.map((url, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`shrink-0 w-12 h-9 rounded overflow-hidden border-2 transition-all ${i === idx ? "border-white" : "border-transparent opacity-40"}`}>
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryManager({ destination, onClose }) {
  const { addGalleryImage, removeGalleryImage, setMainImage } = useAppStore();
  const [urlInput, setUrlInput] = useState("");
  const [addingMain, setAddingMain] = useState(false);
  const [mainUrlInput, setMainUrlInput] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // index
  const [slideshow, setSlideshow] = useState(null);

  const allImages = [destination.image, ...(destination.gallery || [])].filter(Boolean);

  const confirmAddGallery = () => {
    const url = urlInput.trim();
    if (!url || (destination.gallery || []).length >= 8) return;
    addGalleryImage(destination.id, url);
    setUrlInput("");
  };

  const confirmSetMain = () => {
    const url = mainUrlInput.trim();
    if (!url) return;
    setMainImage(destination.id, url);
    setMainUrlInput("");
    setAddingMain(false);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Kelola Galeri</h3>
            <p className="text-xs text-gray-400 mt-0.5">{destination.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"><X size={16} /></button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main image */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gambar Utama</p>
              <button onClick={() => setAddingMain(!addingMain)} className="text-xs text-indigo-600 hover:underline">Ganti</button>
            </div>
            {addingMain && (
              <div className="flex gap-2 mb-3">
                <input value={mainUrlInput} onChange={(e) => setMainUrlInput(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                <button onClick={confirmSetMain} className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Set</button>
                <button onClick={() => { setAddingMain(false); setMainUrlInput(""); }} className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">✕</button>
              </div>
            )}
            {destination.image ? (
              <img src={destination.image} alt="main" onClick={() => setSlideshow({ images: allImages, startIndex: 0 })}
                className="w-full h-36 object-cover rounded-xl border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity" />
            ) : (
              <div className="w-full h-36 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm">Belum ada gambar utama</div>
            )}
          </div>

          {/* Gallery */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Galeri <span className="text-gray-400 normal-case font-normal">({(destination.gallery || []).length}/8)</span>
              </p>
            </div>

            {(destination.gallery || []).length < 8 && (
              <div className="flex gap-2 mb-4">
                <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && confirmAddGallery()}
                  placeholder="Tambah URL gambar galeri..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                <button onClick={confirmAddGallery}
                  className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1.5">
                  <Plus size={13} /> Tambah
                </button>
              </div>
            )}

            {(destination.gallery || []).length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-8 bg-gray-50 rounded-xl">Belum ada gambar galeri</div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {(destination.gallery || []).map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt={`gallery-${i}`}
                      onClick={() => setSlideshow({ images: allImages, startIndex: i + 1 })}
                      className="w-full h-20 object-cover rounded-xl border border-gray-100 cursor-pointer hover:opacity-80 transition-opacity" />
                    <button onClick={() => setDeleteTarget(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {slideshow && (
        <Slideshow images={slideshow.images} startIndex={slideshow.startIndex} onClose={() => setSlideshow(null)} />
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Hapus Gambar"
        description="Gambar ini akan dihapus dari galeri destinasi ini."
        onConfirm={() => { removeGalleryImage(destination.id, deleteTarget); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default function Gallery() {
  const { destinations } = useAppStore();
  const [search, setSearch] = useState("");
  const [managing, setManaging] = useState(null);

  const filtered = destinations.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">Galeri</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola gambar per destinasi</p>
        </div>
      </div>

      <div className="px-6 md:px-8 py-6">
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Images size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari destinasi..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dest) => {
            const allImages = [dest.image, ...(dest.gallery || [])].filter(Boolean);
            const previewImages = allImages.slice(0, 4);
            return (
              <div key={dest.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                {/* Main image */}
                <div className="relative">
                  {dest.image ? (
                    <img src={dest.image} alt={dest.name} className="w-full h-36 object-cover" />
                  ) : (
                    <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
                      <Images size={28} className="text-gray-300" />
                    </div>
                  )}
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded-full">
                    {allImages.length} foto
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-sm font-semibold text-gray-800">{dest.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{dest.category}</p>

                  {/* Preview thumbnails */}
                  {(dest.gallery || []).length > 0 && (
                    <div className="flex gap-1.5 mt-3">
                      {(dest.gallery || []).slice(0, 4).map((url, i) => (
                        <img key={i} src={url} alt="" className="w-10 h-8 rounded object-cover" />
                      ))}
                      {(dest.gallery || []).length > 4 && (
                        <div className="w-10 h-8 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-medium">
                          +{(dest.gallery || []).length - 4}
                        </div>
                      )}
                    </div>
                  )}

                  <button onClick={() => setManaging(dest)}
                    className="mt-4 w-full py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors font-medium">
                    Kelola Galeri
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {managing && (
        <GalleryManager
          destination={destinations.find(d => d.id === managing.id) || managing}
          onClose={() => setManaging(null)}
        />
      )}
    </div>
  );
}