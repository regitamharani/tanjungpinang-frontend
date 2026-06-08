import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Images,
  RefreshCw,
  MapPin,
  Upload,
} from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

const API_URL = "http://localhost:3000/api";

const getToken = () => localStorage.getItem("token");

const apiRequest = async (path, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
};

const normalizeGallery = (gallery, galleryImages) => {
  const read = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (typeof item === "string") return item;
          return item.url || item.image || item.src || "";
        })
        .filter(Boolean);
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
          return parsed
            .map((item) => {
              if (typeof item === "string") return item;
              return item.url || item.image || item.src || "";
            })
            .filter(Boolean);
        }
      } catch {
        return [];
      }
    }

    return [];
  };

  const fromGallery = read(gallery);
  const fromGalleryImages = read(galleryImages);

  return fromGallery.length > 0 ? fromGallery : fromGalleryImages;
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

function Slideshow({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);

  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/60 hover:text-white"
      >
        <X size={20} />
      </button>

      <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
        {idx + 1} / {images.length}
      </span>

      {images.length > 1 && (
        <button
          type="button"
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <div className="max-w-3xl w-full mx-16">
        <img
          src={images[idx]}
          alt=""
          className="w-full max-h-[75vh] object-contain rounded-xl"
        />
      </div>

      {images.length > 1 && (
        <button
          type="button"
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-lg overflow-x-auto px-2">
          {images.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className={`shrink-0 w-12 h-9 rounded overflow-hidden border-2 transition-all ${
                i === idx ? "border-white" : "border-transparent opacity-40"
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryManager({ destination, onClose, onUpdated }) {
  const [urlInput, setUrlInput] = useState("");
  const [addingMain, setAddingMain] = useState(false);
  const [mainUrlInput, setMainUrlInput] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [slideshow, setSlideshow] = useState(null);
  const [saving, setSaving] = useState(false);

  const gallery = normalizeGallery(destination.gallery, destination.galleryImages);

  const mainImage =
    destination.mainImage ||
    destination.image ||
    destination.gambar ||
    destination.img ||
    "";

  const allImages = [mainImage, ...gallery].filter(Boolean);

  const buildPayload = (newMainImage, newGallery) => {
    return {
      name: destination.name || destination.nama || "",
      category: destination.category || destination.kategori || "",
      location: destination.location || destination.lokasi || "",
      description:
        destination.description ||
        destination.fullDescription ||
        destination.deskripsi ||
        "-",

      image: newMainImage || "",
      mainImage: newMainImage || "",

      gallery: newGallery.map((url, index) => ({
        id: Date.now() + index,
        url,
        caption: "",
        sortOrder: index + 1,
      })),

      ratingAverage: Number(destination.ratingAverage || 0),
      reviewCount: Number(destination.reviewCount || 0),
      googleRating: Number(destination.googleRating || 0),
      googleReviewCount: Number(destination.googleReviewCount || 0),
      visitCount: Number(destination.visitCount || 0),

      openingHours: destination.openingHours || "",
      ticketPrice: Number(destination.ticketPrice || 0),
      mapsUrl: destination.mapsUrl || destination.mapsLink || "",
      googlePlaceId: destination.googlePlaceId || "",

      estimatedCostMin: Number(destination.estimatedCostMin || 0),
      estimatedCostMax: Number(destination.estimatedCostMax || 0),
      recommendedDuration: destination.recommendedDuration || "",
      bestVisitTime: destination.bestVisitTime || "",
      travelTips: destination.travelTips || "",
      transportRecommendation: destination.transportRecommendation || "",

      aiRecommended: Boolean(destination.aiRecommended),
      suitableForBudget: destination.suitableForBudget || "hemat",
      suitableForGroup: destination.suitableForGroup || [],
      facilities: destination.facilities || [],

      isPublished: Boolean(destination.isPublished),
    };
  };

  const updateDestinationImages = async (newMainImage, newGallery) => {
    setSaving(true);

    try {
      const payload = buildPayload(newMainImage, newGallery);

      const res = await apiRequest(`/destinations/${destination.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.message || "Gagal menyimpan galeri");
        return false;
      }

      await onUpdated();
      return true;
    } catch (error) {
      alert("Tidak bisa terhubung ke server.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const confirmAddGallery = async () => {
    const url = urlInput.trim();

    if (!url) return;

    if (gallery.length >= 8) {
      alert("Maksimal 8 gambar galeri.");
      return;
    }

    const ok = await updateDestinationImages(mainImage, [...gallery, url]);

    if (ok) {
      setUrlInput("");
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const remainingSlots = 8 - gallery.length;

    if (remainingSlots <= 0) {
      alert("Maksimal 8 gambar galeri.");
      e.target.value = "";
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    try {
      setSaving(true);

      const uploadedImages = await Promise.all(
        selectedFiles.map((file) => compressImage(file))
      );

      const ok = await updateDestinationImages(mainImage, [
        ...gallery,
        ...uploadedImages,
      ]);

      if (!ok) return;
    } catch (error) {
      alert(error.message || "Gagal upload gambar galeri");
    } finally {
      setSaving(false);
      e.target.value = "";
    }
  };

  const confirmSetMain = async () => {
    const url = mainUrlInput.trim();

    if (!url) return;

    const ok = await updateDestinationImages(url, gallery);

    if (ok) {
      setMainUrlInput("");
      setAddingMain(false);
    }
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setSaving(true);

      const imageBase64 = await compressImage(file);
      const ok = await updateDestinationImages(imageBase64, gallery);

      if (!ok) return;
    } catch (error) {
      alert(error.message || "Gagal upload gambar utama");
    } finally {
      setSaving(false);
      e.target.value = "";
    }
  };

  const confirmDeleteGallery = async () => {
    if (deleteTarget === null) return;

    const newGallery = gallery.filter((_, index) => index !== deleteTarget);

    const ok = await updateDestinationImages(mainImage, newGallery);

    if (ok) {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Kelola Galeri</h3>
            <p className="text-xs text-gray-400 mt-0.5">{destination.name}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Gambar Utama
              </p>

              <button
                type="button"
                onClick={() => setAddingMain(!addingMain)}
                className="text-xs text-indigo-600 hover:underline"
              >
                Ganti
              </button>
            </div>

            {addingMain && (
              <div className="space-y-3 mb-3">
                <div className="flex gap-2">
                  <input
                    value={mainUrlInput}
                    onChange={(e) => setMainUrlInput(e.target.value)}
                    placeholder="https://... atau data:image/jpeg;base64,..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />

                  <button
                    type="button"
                    onClick={confirmSetMain}
                    disabled={saving}
                    className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
                  >
                    Set
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAddingMain(false);
                      setMainUrlInput("");
                    }}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                  >
                    ✕
                  </button>
                </div>

                <label className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">
                  <Upload size={13} />
                  Upload gambar utama
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {mainImage ? (
              <img
                src={mainImage}
                alt="main"
                onClick={() =>
                  setSlideshow({
                    images: allImages,
                    startIndex: 0,
                  })
                }
                className="w-full h-36 object-cover rounded-xl border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
              />
            ) : (
              <div className="w-full h-36 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                Belum ada gambar utama
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Galeri{" "}
                <span className="text-gray-400 normal-case font-normal">
                  ({gallery.length}/8)
                </span>
              </p>
            </div>

            {gallery.length < 8 && (
              <div className="space-y-3 mb-4">
                <div className="flex gap-2">
                  <input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && confirmAddGallery()
                    }
                    placeholder="Tambah URL gambar galeri..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />

                  <button
                    type="button"
                    onClick={confirmAddGallery}
                    disabled={saving}
                    className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1.5 disabled:opacity-60"
                  >
                    <Plus size={13} /> Tambah
                  </button>
                </div>

                <label className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">
                  <Upload size={13} />
                  Upload gambar galeri
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {gallery.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-8 bg-gray-50 rounded-xl">
                Belum ada gambar galeri
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {gallery.map((url, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={url}
                      alt={`gallery-${i}`}
                      onClick={() =>
                        setSlideshow({
                          images: allImages,
                          startIndex: i + 1,
                        })
                      }
                      className="w-full h-20 object-cover rounded-xl border border-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                    />

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    >
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
        <Slideshow
          images={slideshow.images}
          startIndex={slideshow.startIndex}
          onClose={() => setSlideshow(null)}
        />
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Hapus Gambar"
        description="Gambar ini akan dihapus dari galeri destinasi ini."
        onConfirm={confirmDeleteGallery}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default function Gallery() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [managing, setManaging] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    setErrorText("");

    try {
      const res = await apiRequest("/destinations/admin");
      const json = await res.json();

      if (!res.ok || !json.success) {
        setDestinations([]);
        setErrorText(json.message || "Gagal mengambil data destinasi");
        return;
      }

      setDestinations(json.data || []);

      setManaging((current) => {
        if (!current) return current;

        const fresh = (json.data || []).find((d) => d.id === current.id);
        return fresh || current;
      });
    } catch (error) {
      setDestinations([]);
      setErrorText(
        "Tidak bisa terhubung ke server. Pastikan backend Express berjalan."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const filtered = destinations.filter((d) =>
    (d.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">Galeri</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Kelola gambar per destinasi dari database
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDestinations}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="px-6 md:px-8 py-6">
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Images
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari destinasi..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-10 text-center text-sm text-gray-400">
            Memuat data galeri...
          </div>
        ) : errorText ? (
          <div className="bg-white border border-red-100 rounded-xl shadow-sm p-10 text-center text-sm text-red-500">
            {errorText}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-10 text-center text-sm text-gray-400">
            Tidak ada destinasi ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((dest) => {
              const gallery = normalizeGallery(dest.gallery, dest.galleryImages);

              const image =
                dest.mainImage ||
                dest.image ||
                dest.gambar ||
                dest.img ||
                "";

              const allImages = [image, ...gallery].filter(Boolean);

              return (
                <div
                  key={dest.id}
                  className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="relative">
                    {image ? (
                      <img
                        src={image}
                        alt={dest.name}
                        className="w-full h-36 object-cover"
                      />
                    ) : (
                      <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
                        <MapPin size={28} className="text-gray-300" />
                      </div>
                    )}

                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded-full">
                      {allImages.length} foto
                    </span>
                  </div>

                  <div className="p-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {dest.name}
                    </p>

                    <p className="text-xs text-gray-400 mt-0.5">
                      {dest.category}
                    </p>

                    {gallery.length > 0 && (
                      <div className="flex gap-1.5 mt-3">
                        {gallery.slice(0, 4).map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt=""
                            className="w-10 h-8 rounded object-cover"
                          />
                        ))}

                        {gallery.length > 4 && (
                          <div className="w-10 h-8 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-medium">
                            +{gallery.length - 4}
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setManaging(dest)}
                      className="mt-4 w-full py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors font-medium"
                    >
                      Kelola Galeri
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {managing && (
        <GalleryManager
          destination={managing}
          onClose={() => setManaging(null)}
          onUpdated={fetchDestinations}
        />
      )}
    </div>
  );
}