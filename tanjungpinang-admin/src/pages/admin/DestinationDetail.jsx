import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  Pencil,
  MapPin,
  Clock,
  Ticket,
  Bookmark,
  ExternalLink,
  ChevronLeft as Prev,
  ChevronRight as Next,
  Images,
} from "lucide-react";

const readImageUrl = (item) => {
  if (!item) return "";

  if (typeof item === "string") return item;

  return (
    item.url ||
    item.image ||
    item.src ||
    item.path ||
    item.file ||
    item.mainImage ||
    item.gambar ||
    ""
  );
};

const normalizeGallery = (...values) => {
  const result = [];

  const read = (value) => {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        const url = readImageUrl(item);
        if (url) result.push(url);
      });
      return;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();

      if (!trimmed) return;

      if (
        trimmed.startsWith("data:image") ||
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("/")
      ) {
        result.push(trimmed);
        return;
      }

      try {
        const parsed = JSON.parse(trimmed);

        if (Array.isArray(parsed)) {
          parsed.forEach((item) => {
            const url = readImageUrl(item);
            if (url) result.push(url);
          });
        }

        return;
      } catch {
        return;
      }
    }

    if (typeof value === "object") {
      const url = readImageUrl(value);
      if (url) result.push(url);
    }
  };

  values.forEach(read);

  return result.filter(Boolean).filter((url, index, arr) => arr.indexOf(url) === index);
};

const formatTicketPrice = (value) => {
  const price = Number(value || 0);

  if (!price) return "Gratis";

  return `Rp ${price.toLocaleString("id-ID")}`;
};

function ImageFallback() {
  return (
    <div className="w-full h-56 md:h-72 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
      <Images size={34} className="mb-2 text-gray-300" />
      <p className="text-sm">Foto destinasi belum tersedia</p>
    </div>
  );
}

function DetailImage({ src, alt }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (!src || error) {
    return <ImageFallback />;
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className="w-full h-56 md:h-72 object-cover"
    />
  );
}

function ThumbImage({ src, active, onClick }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (!src || error) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 w-14 h-11 rounded-lg overflow-hidden border-2 transition-all ${
        active ? "border-indigo-500" : "border-transparent opacity-60"
      }`}
    >
      <img
        src={src}
        alt=""
        onError={() => setError(true)}
        className="w-full h-full object-cover"
      />
    </button>
  );
}

export default function DestinationDetail({ destination: d, onBack, onEdit }) {
  const [imgIdx, setImgIdx] = useState(0);

  const mainImage =
    d?.mainImage ||
    d?.main_image ||
    d?.image ||
    d?.gambar ||
    d?.img ||
    "";

  const gallery = useMemo(
    () =>
      normalizeGallery(
        d?.gallery,
        d?.galleryImages,
        d?.gallery_images,
        d?.images,
        d?.photos
      ),
    [d?.gallery, d?.galleryImages, d?.gallery_images, d?.images, d?.photos]
  );

  const allImages = useMemo(() => {
    return normalizeGallery(mainImage, gallery);
  }, [mainImage, gallery]);

  useEffect(() => {
    setImgIdx(0);
  }, [d?.id]);

  useEffect(() => {
    if (imgIdx >= allImages.length) {
      setImgIdx(0);
    }
  }, [allImages.length, imgIdx]);

  const name = d?.name || d?.nama || "Detail Destinasi";
  const category = d?.category || d?.kategori || "-";
  const location = d?.location || d?.address || d?.lokasi || "-";
  const description =
    d?.description || d?.fullDescription || d?.full_description || d?.deskripsi || "";
  const openingHours = d?.openingHours || d?.opening_hours || "-";
  const ticketPrice = d?.ticketPrice ?? d?.ticket_price ?? 0;
  const bookmarks = d?.bookmarks || d?.favorite || 0;
  const mapsLink =
    d?.mapsLink ||
    d?.mapsUrl ||
    d?.googleMapsUrl ||
    d?.google_maps_url ||
    d?.maps_url ||
    "";

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-4 flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-gray-900 truncate">{name}</h1>
          <p className="text-sm text-gray-500">{category}</p>
        </div>

        <button
          type="button"
          onClick={() => onEdit(d)}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
        >
          <Pencil size={13} /> Edit
        </button>
      </div>

      <div className="px-6 md:px-8 py-6 max-w-3xl">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-5">
          <div className="relative">
            <DetailImage src={allImages[imgIdx]} alt={name} />

            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setImgIdx((i) => (i === 0 ? allImages.length - 1 : i - 1))
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
                >
                  <Prev size={16} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setImgIdx((i) => (i === allImages.length - 1 ? 0 : i + 1))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
                >
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
                <ThumbImage
                  key={`${url}-${i}`}
                  src={url}
                  active={i === imgIdx}
                  onClick={() => setImgIdx(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={14} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Alamat</p>
                <p className="text-sm text-gray-700 mt-0.5">{location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                <Ticket size={14} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Harga Tiket</p>
                <p className="text-sm text-gray-700 mt-0.5">
                  {Number(ticketPrice || 0) === 0 ? (
                    <span className="text-emerald-600 font-semibold">Gratis</span>
                  ) : (
                    formatTicketPrice(ticketPrice)
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={14} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Jam Buka</p>
                <p className="text-sm text-gray-700 mt-0.5">{openingHours}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
                <Bookmark size={14} className="text-rose-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Bookmark</p>
                <p className="text-sm text-gray-700 mt-0.5">
                  {bookmarks} pengguna
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
                <Images size={14} className="text-violet-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Galeri</p>
                <p className="text-sm text-gray-700 mt-0.5">
                  {gallery.length} gambar galeri · {allImages.length} total foto
                </p>
              </div>
            </div>

            {mapsLink && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                  <ExternalLink size={14} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Google Maps</p>
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:underline mt-0.5 block"
                  >
                    Buka di Maps
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {description && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Deskripsi
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}