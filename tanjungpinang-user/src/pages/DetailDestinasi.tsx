import { useCallback, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Ticket,
  Check,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Eye,
  Globe,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/layout/Footer";
import { isLoggedIn } from "@/services/api";

const API_URL = "http://localhost:3000/api";

interface Destination {
  id: number;
  slug: string;
  name: string;
  category: string;
  location: string;
  description: string;
  shortDescription: string;
  fullDescription: string;
  mainImage: string;
  image: string;
  galleryImages: string[];
  facilities: string[];
  openingHours: string;
  ticketPrice: string;
  mapsUrl: string;
  googlePlaceId: string;
  googleRating: number;
  googleReviewCount: number;
  googleMapsUrl: string;
  ratingAverage: number;
  reviewCount: number;
  visitCount: number;
  tips: string[];
  isPublished: boolean;
}

interface Review {
  id: number;
  destinationId: number;
  userId: number | null;
  userName: string;
  userPhoto: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: "visible" | "pending" | "hidden";
}

const getLocalUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const getUserId = () => {
  const localUser = getLocalUser();
  return localUser?.id || localUser?.userId || localUser?.user_id || null;
};

const formatTicketPrice = (price: any) => {
  const numberPrice = Number(price || 0);

  if (!numberPrice) return "Gratis / Tidak tersedia";

  return `Rp ${numberPrice.toLocaleString("id-ID")}/orang`;
};

const parseArray = (value: any): string[] => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item: any) => {
        if (typeof item === "string") return item;
        return item.url || item.name || item.label || item.title || "";
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed
          .map((item: any) => {
            if (typeof item === "string") return item;
            return item.url || item.name || item.label || item.title || "";
          })
          .filter(Boolean);
      }
    } catch {
      return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const parseGallery = (value: any): string[] => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item: any) => {
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
          .map((item: any) => {
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

const normalizeDestination = (data: any): Destination => {
  const image = data.mainImage || data.image || data.gambar || data.img || "";

  const facilities = parseArray(data.facilities);

  const galleryImages =
    Array.isArray(data.galleryImages) && data.galleryImages.length > 0
      ? data.galleryImages
      : parseGallery(data.gallery);

  const tipsFromTravelTips = data.travelTips
    ? String(data.travelTips)
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  return {
    id: Number(data.id || 0),
    slug: data.slug || "",
    name: data.name || data.nama || "Destinasi",
    category: data.category || data.kategori || "Wisata",
    location: data.location || data.lokasi || "-",

    description: data.description || data.deskripsi || "",
    shortDescription:
      data.shortDescription ||
      data.summary ||
      data.description ||
      data.deskripsi ||
      "",
    fullDescription:
      data.fullDescription ||
      data.description ||
      data.deskripsi ||
      "Belum ada deskripsi lengkap untuk destinasi ini.",

    mainImage: image,
    image,

    galleryImages,

    facilities,

    openingHours:
      data.openingHours ||
      data.opening_hours ||
      "Jam operasional belum tersedia",

    ticketPrice:
      typeof data.ticketPrice === "string"
        ? data.ticketPrice
        : formatTicketPrice(data.ticketPrice || data.ticket_price),

    mapsUrl:
      data.mapsUrl ||
      data.mapsLink ||
      data.googleMapsUrl ||
      data.google_maps_url ||
      "",

    googlePlaceId: data.googlePlaceId || data.google_place_id || "",

    googleRating: Number(data.googleRating || data.google_rating || 0),
    googleReviewCount: Number(
      data.googleReviewCount || data.google_review_count || 0
    ),

    googleMapsUrl:
      data.googleMapsUrl ||
      data.google_maps_url ||
      data.mapsUrl ||
      data.mapsLink ||
      "",

    ratingAverage: Number(data.ratingAverage || data.rating_average || 0),
    reviewCount: Number(data.reviewCount || data.review_count || 0),
    visitCount: Number(
      data.visitCount ||
        data.visit_count ||
        data.views ||
        data.kunjungan ||
        data.jumlah_kunjungan ||
        0
    ),

    tips: Array.isArray(data.tips)
      ? data.tips
      : tipsFromTravelTips.length > 0
      ? tipsFromTravelTips
      : [],

    isPublished: Boolean(data.isPublished ?? data.is_published ?? true),
  };
};

function GallerySlider({
  images,
  mainImage,
  name,
}: {
  images: string[];
  mainImage: string;
  name: string;
}) {
  const allImages = [mainImage, ...images.filter((img) => img !== mainImage)]
    .filter(Boolean)
    .filter((img, index, arr) => arr.indexOf(img) === index)
    .slice(0, 8);

  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (current >= allImages.length) {
      setCurrent(0);
    }
  }, [allImages.length, current]);

  const prev = () =>
    setCurrent((c) => (c === 0 ? allImages.length - 1 : c - 1));

  const next = () =>
    setCurrent((c) => (c === allImages.length - 1 ? 0 : c + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const dx = e.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(dx) > 50 && allImages.length > 1) {
      dx < 0 ? next() : prev();
    }

    touchStartX.current = null;
  };

  if (allImages.length === 0) {
    return (
      <div className="relative w-full h-[420px] md:h-[520px] bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
        <div className="text-center text-white/70">
          <MapPin className="w-16 h-16 mx-auto mb-4 opacity-60" />
          <p className="font-semibold">Gambar destinasi belum tersedia</p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10" />
      </div>
    );
  }

  return (
    <div className="mb-0">
      <div
        className="relative w-full h-[420px] md:h-[520px] bg-slate-900 overflow-hidden cursor-pointer group"
        onClick={() => setLightboxOpen(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={allImages[current]}
            alt={`${name} - foto ${current + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10" />

        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {allImages.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrent(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? "bg-white w-5" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-medium rounded-full">
          {current + 1} / {allImages.length}
        </div>

        <div className="absolute bottom-4 right-4 z-20 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          Klik untuk perbesar
        </div>
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 p-3 bg-slate-900/5 border-b border-border overflow-x-auto scrollbar-hide">
          {allImages.map((img, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                i === current
                  ? "border-primary shadow-md"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2"
              onClick={() => setLightboxOpen(false)}
            >
              <ChevronRight className="w-6 h-6 rotate-45" />
            </button>

            {allImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={allImages[current]}
              alt={`${name} fullscreen`}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {allImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <p className="absolute bottom-6 text-white/60 text-sm">
              {current + 1} / {allImages.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RatingStars({
  value,
  count,
  label,
  variant = "web",
}: {
  value: number;
  count: number;
  label: string;
  variant?: "web" | "google";
}) {
  const safeValue = Number(value || 0);
  const filled = Math.round(safeValue);

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${
        variant === "google"
          ? "bg-blue-50 border-blue-100"
          : "bg-white border-border"
      }`}
    >
      {variant === "google" ? (
        <div className="flex items-center gap-1.5 mb-2">
          <Globe className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            Google
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 mb-2">
          <Star className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
            Pengunjung Web
          </span>
        </div>
      )}

      <div className="text-4xl font-black text-foreground mb-1">
        {safeValue.toFixed(1)}
      </div>

      <div className="flex mb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i <= filled
                ? variant === "google"
                  ? "fill-blue-500 text-blue-500"
                  : "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted-foreground opacity-30"
            }`}
          />
        ))}
      </div>

      <div className="text-xs text-muted-foreground font-medium">
        {Number(count || 0).toLocaleString("id-ID")} {label}
      </div>
    </div>
  );
}

export default function DetailDestinasi({
  params,
}: {
  params?: { slug?: string };
}) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const slugParam =
    params?.slug ||
    decodeURIComponent(
      window.location.pathname.replace("/destination/", "").split("?")[0]
    );

  const [dest, setDest] = useState<Destination | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const authenticated = isLoggedIn();

  const incrementVisit = useCallback(async (destination: Destination) => {
    if (!destination.id && !destination.slug) return;

    const visitId = destination.id || destination.slug;
    const localUser = getLocalUser();

    try {
      const res = await fetch(`${API_URL}/destinations/${visitId}/visit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          userId: getUserId(),
          userName:
            localUser?.name ||
            localUser?.nama ||
            localUser?.email ||
            "Pengunjung",
          userEmail: localUser?.email || null,
        }),
      });

      const text = await res.text();

      let json: any = {};

      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        console.error("Response visit bukan JSON:", text);
        return;
      }

      if (!res.ok || !json.success) {
        console.error("Gagal menambah kunjungan:", json.message);
        return;
      }

      setDest((prev) => {
        if (!prev || prev.id !== destination.id) return prev;

        return {
          ...prev,
          visitCount:
            typeof json.data?.visitCount === "number"
              ? json.data.visitCount
              : prev.visitCount + 1,
        };
      });
    } catch (error) {
      console.error("Gagal menambah kunjungan:", error);
    }
  }, []);

  const fetchFavoriteStatus = useCallback(async (destinationId: number) => {
    const userId = getUserId();

    if (!userId || !destinationId) {
      setIsSaved(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/favorites/check/${destinationId}?userId=${encodeURIComponent(
          userId
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      const json = await res.json();

      if (!res.ok || !json.success) {
        setIsSaved(false);
        return;
      }

      setIsSaved(Boolean(json.data?.isFavorite));
    } catch (error) {
      console.error("Gagal cek favorit:", error);
      setIsSaved(false);
    }
  }, []);

  const fetchReviews = useCallback(async (destinationId: number) => {
    try {
      const res = await fetch(`${API_URL}/reviews/destination/${destinationId}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setReviews([]);
        return;
      }

      setReviews(json.data || []);
    } catch {
      setReviews([]);
    }
  }, []);

  const fetchDestination = useCallback(async () => {
    try {
      setLoading(true);
      setErrorText("");

      if (!slugParam || slugParam === "undefined") {
        setDest(null);
        setReviews([]);
        setErrorText("Slug destinasi tidak ditemukan");
        return;
      }

      const res = await fetch(`${API_URL}/destinations/${slugParam}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setDest(null);
        setReviews([]);
        setErrorText(json.message || "Destinasi tidak ditemukan");
        return;
      }

      const normalized = normalizeDestination(json.data);

      setDest(normalized);

      await Promise.all([
        fetchReviews(normalized.id),
        incrementVisit(normalized),
        fetchFavoriteStatus(normalized.id),
      ]);
    } catch (error) {
      console.error("Fetch destination error:", error);

      setDest(null);
      setReviews([]);
      setErrorText(
        "Tidak bisa terhubung ke server. Pastikan backend Express berjalan."
      );
    } finally {
      setLoading(false);
    }
  }, [slugParam, fetchReviews, incrementVisit, fetchFavoriteStatus]);

  useEffect(() => {
    fetchDestination();
  }, [fetchDestination]);

  useEffect(() => {
    /*
      Riwayat "Terakhir Dilihat" tidak disimpan ke localStorage lagi.
      Data riwayat profil diambil dari database melalui:
      GET /api/visits/user/:userId/recent

      Log kunjungan sudah dikirim oleh incrementVisit().
    */
  }, [dest]);

  const toggleSave = async () => {
    if (!dest) return;

    if (!authenticated) {
      toast({
        title: "Perlu Login",
        description: "Silakan login untuk menyimpan destinasi favorit.",
        variant: "destructive",
      });

      setLocation("/login");
      return;
    }

    const userId = getUserId();

    if (!userId) {
      toast({
        title: "Data user tidak ditemukan",
        description: "Silakan logout lalu login kembali.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isSaved) {
        const res = await fetch(`${API_URL}/favorites/${dest.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({
            userId,
          }),
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          toast({
            title: "Gagal menghapus favorit",
            description: json.message || "Terjadi kesalahan.",
            variant: "destructive",
          });
          return;
        }

        setIsSaved(false);
        toast({ title: "Dihapus dari favorit" });
      } else {
        const res = await fetch(`${API_URL}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({
            userId,
            destinationId: dest.id,
          }),
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          toast({
            title: "Gagal menyimpan favorit",
            description: json.message || "Terjadi kesalahan.",
            variant: "destructive",
          });
          return;
        }

        setIsSaved(true);
        toast({ title: "Disimpan ke favorit! ❤️" });
      }
    } catch (error) {
      console.error("Gagal update favorit:", error);

      toast({
        title: "Gagal terhubung ke server",
        description: "Pastikan backend Express berjalan.",
        variant: "destructive",
      });
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dest) return;

    if (rating === 0) {
      toast({
        title: "Pilih rating terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length < 20) {
      toast({
        title: "Ulasan minimal 20 karakter",
        variant: "destructive",
      });
      return;
    }

    const localUser = getLocalUser();

    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          destinationId: dest.id,
          userId: getUserId(),
          userName:
            localUser?.nama ||
            localUser?.name ||
            localUser?.email ||
            "Pengguna",
          rating,
          comment: comment.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast({
          title: "Gagal mengirim ulasan",
          description:
            json.message || "Terjadi kesalahan saat menyimpan ulasan.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Ulasan terkirim! 🎉",
        description: "Rating destinasi berhasil diperbarui.",
      });

      setRating(0);
      setComment("");
      await fetchDestination();
    } catch {
      toast({
        title: "Gagal terhubung ke server",
        description: "Pastikan backend Express berjalan.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/10 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat detail destinasi...</p>
        </div>
      </div>
    );
  }

  if (!dest || errorText) {
    return (
      <div className="min-h-screen bg-muted/10 flex items-center justify-center px-6">
        <div className="bg-white border border-border rounded-2xl p-8 text-center max-w-md">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h1 className="text-xl font-bold text-foreground mb-2">
            Destinasi tidak ditemukan
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            {errorText || "Data destinasi tidak tersedia."}
          </p>
          <Link
            href="/destination"
            className="inline-flex items-center justify-center h-11 px-5 rounded-xl bg-primary text-white font-semibold text-sm"
          >
            Kembali ke Destinasi
          </Link>
        </div>
      </div>
    );
  }

  const visibleReviews = reviews.filter(
    (review) => review.status === "visible" && review.destinationId === dest.id
  );

  const displayedReviews = showAllReviews
    ? visibleReviews
    : visibleReviews.slice(0, 3);

  const canReview = authenticated;

  const totalReviews = Math.max(visibleReviews.length, 1);

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    pct:
      visibleReviews.length === 0
        ? 0
        : Math.round(
            (visibleReviews.filter((review) => review.rating === star).length /
              totalReviews) *
              100
          ),
  }));

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="relative">
        <GallerySlider
          images={dest.galleryImages}
          mainImage={dest.mainImage}
          name={dest.name}
        />

        <div className="absolute top-4 left-4 z-30">
          <Link
            href="/destination"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        <div className="absolute top-4 right-4 z-30">
          <button
            type="button"
            onClick={toggleSave}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md transition-all duration-300 ${
              isSaved
                ? "bg-red-500/80 text-white hover:bg-red-600/80"
                : "bg-black/40 text-white hover:bg-black/60"
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="absolute bottom-24 md:bottom-28 left-0 w-full z-20 px-4 sm:px-6 md:px-12 pointer-events-none">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex px-3 py-1 bg-primary text-white text-xs md:text-sm font-semibold rounded-full mb-3 shadow-md">
              {dest.category}
            </span>

            <h1 className="max-w-4xl text-2xl md:text-4xl font-bold text-white leading-tight drop-shadow-lg mb-3">
              {dest.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-white text-xs md:text-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-sm">
                <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-yellow-400 text-yellow-400 shrink-0" />
                <span className="font-bold">
                  {dest.ratingAverage.toFixed(1)}
                </span>
                <span className="text-white/80">
                  ({dest.reviewCount.toLocaleString("id-ID")} ulasan)
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-sm">
                <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                <span>{dest.visitCount.toLocaleString("id-ID")} kunjungan</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-sm max-w-full">
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" />
                <span className="truncate">{dest.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Tentang Destinasi
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              {dest.fullDescription}
            </p>
          </motion.section>

          {dest.tips.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Tips Berkunjung
              </h2>

              <ul className="space-y-3">
                {dest.tips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-muted-foreground bg-white p-4 rounded-xl border border-border"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {dest.facilities.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Fasilitas
              </h2>

              <div className="flex flex-wrap gap-2">
                {dest.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </motion.section>
          )}

          <div className="w-full h-px bg-border" />

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Penilaian Destinasi
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <RatingStars
                value={dest.ratingAverage}
                count={dest.reviewCount}
                label="ulasan pengunjung web"
                variant="web"
              />

              <div className="relative">
                <RatingStars
                  value={dest.googleRating}
                  count={dest.googleReviewCount}
                  label="ulasan di Google"
                  variant="google"
                />

                {dest.googleMapsUrl && (
                  <a
                    href={dest.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-4 right-4 flex items-center gap-1 text-xs text-blue-500 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat di Google
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
                Distribusi Rating Pengunjung Web
              </h3>

              <div className="space-y-2.5">
                {ratingBreakdown.map((row) => (
                  <div
                    key={row.star}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="font-medium w-3 text-right">
                      {row.star}
                    </span>

                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 shrink-0" />

                    <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-yellow-400 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${row.pct}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.8,
                          delay: (5 - row.star) * 0.1,
                        }}
                      />
                    </div>

                    <span className="text-muted-foreground w-10 text-right text-xs">
                      {row.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Ulasan Pengunjung
            </h2>

            {visibleReviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-border">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-muted-foreground">
                  Belum ada ulasan untuk destinasi ini.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-5 rounded-2xl border border-border"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold flex items-center justify-center uppercase text-sm shrink-0">
                          {review.userName.charAt(0)}
                        </div>

                        <div>
                          <h4 className="font-bold text-sm text-foreground">
                            {review.userName}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`w-3.5 h-3.5 ${
                              index < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted-foreground opacity-30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </motion.div>
                ))}

                {visibleReviews.length > 3 && (
                  <Button
                    variant="outline"
                    className="w-full h-12"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                  >
                    {showAllReviews
                      ? "Tampilkan Lebih Sedikit"
                      : `Lihat Semua ${visibleReviews.length} Ulasan`}
                  </Button>
                )}
              </div>
            )}
          </motion.section>

          <div className="w-full h-px bg-border" />

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Tulis Ulasan
            </h2>

            {!authenticated ? (
              <div className="bg-white border border-border p-8 rounded-2xl text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />

                <h3 className="text-lg font-bold text-foreground mb-2">
                  Login untuk memberi ulasan
                </h3>

                <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                  Anda harus masuk ke akun terlebih dahulu untuk membagikan
                  pengalaman berkunjung.
                </p>

                <Button onClick={() => setLocation("/login")}>
                  Masuk Sekarang
                </Button>
              </div>
            ) : !canReview ? (
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>

                <div>
                  <h3 className="font-bold text-amber-800 mb-1">
                    Belum Ada Kunjungan Tercatat
                  </h3>
                  <p className="text-amber-700/80 text-sm leading-relaxed">
                    Kamu dapat memberi ulasan setelah login dan mengunjungi
                    destinasi ini.
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleReviewSubmit}
                className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm"
              >
                <div className="mb-6">
                  <label className="block font-semibold text-sm mb-3 text-foreground">
                    Berapa rating untuk tempat ini?
                  </label>

                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          className={`w-9 h-9 transition-colors ${
                            star <= (hoverRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground fill-muted opacity-30"
                          }`}
                        />
                      </button>
                    ))}

                    {rating > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground self-center">
                        {
                          [
                            "",
                            "Buruk",
                            "Kurang",
                            "Cukup",
                            "Bagus",
                            "Luar Biasa",
                          ][rating]
                        }
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="comment"
                    className="block font-semibold text-sm mb-2 text-foreground"
                  >
                    Bagikan pengalaman Anda
                  </label>

                  <textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ceritakan apa yang Anda suka dari tempat ini..."
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-sm"
                  />

                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>
                      {comment.length < 20
                        ? `Minimal 20 karakter (${20 - comment.length} lagi)`
                        : "✓ Siap dikirim"}
                    </span>
                    <span>{comment.length}/500</span>
                  </div>
                </div>

                <Button type="submit" className="h-12 px-8 font-semibold">
                  Kirim Ulasan
                </Button>
              </form>
            )}
          </motion.section>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="sticky top-24 space-y-4"
          >
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-lg text-foreground mb-5">
                Informasi Kunjungan
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                      Jam Buka
                    </h4>
                    <p className="text-foreground text-sm font-medium">
                      {dest.openingHours}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <Ticket className="w-4 h-4" />
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                      Harga Tiket
                    </h4>
                    <p className="text-foreground text-sm font-medium">
                      {dest.ticketPrice}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                      Lokasi
                    </h4>
                    <p className="text-foreground text-sm font-medium">
                      {dest.location}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                      Total Kunjungan
                    </h4>
                    <p className="text-foreground text-sm font-medium">
                      {dest.visitCount.toLocaleString("id-ID")} pengunjung
                    </p>
                  </div>
                </div>
              </div>

              {dest.googleMapsUrl && (
                <a
                  href={dest.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                >
                  <MapPin className="w-4 h-4" /> Buka di Google Maps
                </a>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-bold text-blue-700">
                  Rating Google
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-blue-700">
                  {dest.googleRating.toFixed(1)}
                </span>

                <div>
                  <div className="flex mb-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i <= Math.round(dest.googleRating)
                            ? "fill-blue-500 text-blue-500"
                            : "fill-blue-200 text-blue-200"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-xs text-blue-600/70">
                    {dest.googleReviewCount.toLocaleString("id-ID")} ulasan
                    Google
                  </span>
                </div>
              </div>

              {dest.googleMapsUrl && (
                <a
                  href={dest.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 text-xs text-blue-500 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Lihat di Google Maps
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}