import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
  MapPin,
  Eye,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

/* ── API ─────────────────────────────────────────────────────────────────── */

const API_URL = "http://localhost:3000/api";
const RECO_URL = "https://sirojulf-recommendation-system.hf.space";

const FALLBACK_HERO_IMAGE =
  "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=2574&auto=format&fit=crop";

const FALLBACK_CARD_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop";

/* ── Data Structures ──────────────────────────────────────────────────────── */

interface Destination {
  id: number;
  slug: string;
  name: string;
  category: string;
  location: string;
  description: string;
  image: string;
  ratingAverage: number;
  reviewCount: number;
  visitCount: number;
  isPublished: boolean;
}

interface Category {
  id: string;
  name: string;
  image: string;
  emoji: string;
  count: number;
  isActive: boolean;
}

interface HomepageHighlight {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  badge: string;
  isActive: boolean;
}

interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  destinationName: string;
  destinationSlug: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerifiedVisit: boolean;
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

const isActiveValue = (value: unknown) => {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true" ||
    value === "published" ||
    value === "aktif" ||
    value === "active"
  );
};

const toNumber = (value: unknown, fallback = 0) => {
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? fallback : numberValue;
};

const createSlug = (value: string) => {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const normalizeCategoryText = (value: string) => {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/^wisata\s+/i, "")
    .replace(/\s+/g, " ");
};

const normalizePlaceName = (value: string) => {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
};

const getMatchedDestinationCategory = (
  categoryName: string,
  destinations: Destination[]
) => {
  const normalizedCategory = normalizeCategoryText(categoryName);

  const matchedDestination = destinations.find(
    (destination) =>
      normalizeCategoryText(destination.category) === normalizedCategory
  );

  return matchedDestination?.category || categoryName;
};

const formatCompactNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(value >= 10000000 ? 0 : 1)}M+`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K+`;
  }

  return `${value}+`;
};

const getInitial = (name: string) => {
  return String(name || "U").charAt(0).toUpperCase();
};

/* ── Normalizer ───────────────────────────────────────────────────────────── */

const normalizeDestination = (item: any, index: number): Destination => {
  const name = item.name || item.nama || item.title || "Destinasi";
  const slug = item.slug || item.id || createSlug(name);

  const ratingAverage = toNumber(
    item.ratingAverage ??
      item.rating_average ??
      item.rata_rating ??
      item.rating ??
      item.averageRating,
    0
  );

  const reviewCount = toNumber(
    item.reviewCount ??
      item.review_count ??
      item.jumlah_ulasan ??
      item.reviews_count ??
      item.totalReviews,
    0
  );

  const visitCount = toNumber(
    item.visitCount ??
      item.visit_count ??
      item.views ??
      item.view_count ??
      item.visits ??
      item.total_visits ??
      item.kunjungan ??
      item.jumlah_kunjungan,
    0
  );

  return {
    id: toNumber(item.id, index + 1),
    slug: String(slug),
    name: String(name),
    category: item.category || item.kategori || "Wisata",
    location: item.location || item.lokasi || "Tanjung Pinang",
    description: item.description || item.deskripsi || "",
    image:
      item.image ||
      item.gambar ||
      item.img ||
      item.mainImage ||
      item.main_image ||
      FALLBACK_CARD_IMAGE,
    ratingAverage,
    reviewCount,
    visitCount,
    isPublished: isActiveValue(
      item.isPublished ??
        item.is_published ??
        item.published ??
        item.status ??
        true
    ),
  };
};

const normalizeAiFeaturedDestination = (
  item: any,
  index: number,
  databaseDestinations: Destination[]
): Destination => {
  const placeName =
    item.place_name ||
    item.recommended_place ||
    item.name ||
    item.title ||
    "Destinasi";

  const matched = databaseDestinations.find(
    (destination) =>
      normalizePlaceName(destination.name) === normalizePlaceName(placeName)
  );

  if (matched) {
    return {
      ...matched,
      ratingAverage: toNumber(
        item.weighted_rating ?? item.rating ?? matched.ratingAverage,
        matched.ratingAverage
      ),
    };
  }

  return {
    id: index + 10000,
    slug: createSlug(placeName),
    name: String(placeName),
    category: item.category || "Wisata",
    location:
      item.locationarea ||
      item.location_area ||
      item.locationcluster ||
      item.location ||
      "Tanjung Pinang",
    description: "",
    image: FALLBACK_CARD_IMAGE,
    ratingAverage: toNumber(item.weighted_rating ?? item.rating, 0),
    reviewCount: toNumber(item.review_count ?? item.reviews_count, 0),
    visitCount: 0,
    isPublished: true,
  };
};

const normalizeCategory = (item: any): Category => {
  return {
    id: String(item.id ?? item.name ?? ""),
    name: item.name || item.NAME || "Kategori",
    image: item.image || FALLBACK_CARD_IMAGE,
    emoji: item.emoji || "🧭",
    count: toNumber(
      item.count ?? item.destinationCount ?? item.destination_count,
      0
    ),
    isActive: isActiveValue(item.isActive ?? item.is_active ?? true),
  };
};

const normalizeHighlight = (item: any): HomepageHighlight => {
  return {
    id: toNumber(item.id, 0),
    title: item.title || "",
    subtitle: item.subtitle || "",
    image: item.image || FALLBACK_CARD_IMAGE,
    buttonText: item.buttonText || item.button_text || "Jelajahi Sekarang",
    buttonLink: item.buttonLink || item.button_link || "/destination",
    badge: item.badge || "Pilihan Editor",
    isActive: isActiveValue(item.isActive ?? item.is_active ?? true),
  };
};

const normalizeReview = (item: any, index: number): Review => {
  const userName =
    item.userName ||
    item.user_name ||
    item.nama ||
    item.email ||
    item.username ||
    "Pengunjung";

  const destinationName =
    item.destinationName ||
    item.destination_name ||
    item.nama_destinasi ||
    item.destination ||
    item.name ||
    "Destinasi";

  return {
    id: toNumber(item.id, index + 1),
    userName,
    userAvatar:
      item.userAvatar ||
      item.user_avatar ||
      item.avatar ||
      item.avatar_url ||
      getInitial(userName),
    destinationName,
    destinationSlug:
      item.destinationSlug ||
      item.destination_slug ||
      item.slug ||
      createSlug(destinationName),
    rating: toNumber(item.rating || item.nilai || item.stars, 0),
    comment: item.comment || item.komentar || item.review || "",
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    isVerifiedVisit: isActiveValue(
      item.isVerifiedVisit ?? item.is_verified_visit ?? item.verified ?? true
    ),
  };
};

/* ── Review helpers ───────────────────────────────────────────────────────── */

const AVATAR_COLORS = [
  "bg-primary/10 text-primary",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-700",
  "bg-orange-100 text-orange-700",
  "bg-teal-100 text-teal-700",
];

function avatarColor(idx: number) {
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
}

function StarRow({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "xs";
}) {
  const sz = size === "xs" ? "w-3 h-3" : "w-4 h-4";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sz} ${
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const date = new Date(review.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative"
    >
      <Quote className="absolute top-5 right-5 w-8 h-8 text-primary/8" />

      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${avatarColor(
            index
          )}`}
        >
          {review.userAvatar}
        </div>

        <div className="min-w-0">
          <p className="font-bold text-foreground text-sm leading-tight">
            {review.userName}
          </p>
          <p className="text-xs text-muted-foreground truncate">{date}</p>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-2">
        <StarRow rating={review.rating} />
        <Link
          href={`/destination/${review.destinationSlug}`}
          className="text-xs text-primary font-semibold truncate hover:underline max-w-[55%] text-right"
        >
          {review.destinationName}
        </Link>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 flex-1">
        "{review.comment}"
      </p>
    </motion.div>
  );
}

/* ── Testimoni Section ────────────────────────────────────────────────────── */

function TestimoniSection({ reviews }: { reviews: Review[] }) {
  const visibleReviews = reviews
    .filter((review) => review.rating >= 4 && review.comment)
    .sort(
      (a, b) =>
        b.rating - a.rating ||
        new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 6);

  const avg =
    visibleReviews.length > 0
      ? visibleReviews.reduce((sum, review) => sum + review.rating, 0) /
        visibleReviews.length
      : 0;

  const totalApproved = visibleReviews.length;
  const [page, setPage] = useState(0);

  const COLS = 3;
  const totalPages = Math.ceil(visibleReviews.length / COLS);
  const visible = visibleReviews.slice(page * COLS, page * COLS + COLS);

  const ratingLabel =
    avg >= 4.8
      ? "Excellent"
      : avg >= 4.5
      ? "Very Good"
      : avg >= 4
      ? "Good"
      : "Fair";

  if (visibleReviews.length === 0) {
    return (
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">
            Ulasan
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Apa Kata Pengunjung?
          </h2>

          <div className="mt-10 py-16 bg-white rounded-2xl border border-border">
            <p className="text-muted-foreground">
              Belum ada ulasan pengunjung.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">
            Ulasan Pengunjung
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Apa Kata Pengunjung?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Ulasan asli dari wisatawan yang sudah mengunjungi destinasi di
            Tanjung Pinang.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-6 bg-white border border-border rounded-2xl shadow-sm px-8 py-6 max-w-lg mx-auto"
        >
          <div className="flex flex-col items-center sm:items-start sm:border-r sm:border-border sm:pr-6">
            <span className="text-4xl font-black text-foreground">
              {avg.toFixed(1)}
            </span>
            <StarRow rating={avg} />
            <span className="text-xs text-muted-foreground mt-1 font-medium">
              {totalApproved} Ulasan
            </span>
          </div>

          <div className="text-center sm:text-left">
            <span className="text-2xl font-extrabold text-primary">
              {ratingLabel}
            </span>
            <p className="text-xs text-muted-foreground mt-1 leading-tight">
              Sumber: Pengunjung
              <br className="hidden sm:block" /> Tanjung Pinang Guide
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(totalPages <= 1 ? visibleReviews : visible).map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 hidden lg:flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setPage(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === page
                    ? "bg-primary w-4"
                    : "bg-border hover:bg-primary/40"
                }`}
              />
            ))}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="mt-10 text-center">
          <Button
            variant="outline"
            asChild
            className="rounded-full px-8 h-11 font-semibold border-primary/30 text-primary hover:bg-primary/5 hover:border-primary"
          >
            <Link href="/destination">
              Lihat Semua Ulasan <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ── Destination Card ─────────────────────────────────────────────────────── */

function DestinationCard({
  destination,
  index,
  badge,
  rankNumber,
  bgTint,
}: {
  destination: Destination;
  index: number;
  badge?: string;
  rankNumber?: string;
  bgTint?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group h-full"
    >
      <Link
        href={`/destination/${destination.slug}`}
        className={`block h-full ${
          bgTint || "bg-white"
        } rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative`}
        data-testid={`card-destination-${destination.id}`}
      >
        {rankNumber && (
          <div className="absolute -top-3 -left-3 z-20 text-6xl font-black text-primary/15 pointer-events-none select-none leading-none">
            {rankNumber}
          </div>
        )}

        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={destination.image || FALLBACK_CARD_IMAGE}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_CARD_IMAGE;
            }}
          />

          {badge && (
            <div
              className={`absolute top-3 right-3 px-2.5 py-1 backdrop-blur-md text-xs font-bold rounded-full shadow-sm z-10 ${
                badge.includes("Unggulan")
                  ? "bg-amber-400/90 text-amber-950"
                  : "bg-primary/90 text-white"
              }`}
            >
              {badge}
            </div>
          )}

          <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-md text-xs font-semibold text-foreground rounded-full shadow-sm z-10">
            {destination.category}
          </div>
        </div>

        <div className="p-4 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              <span className="font-bold text-sm">
                {destination.ratingAverage.toFixed(1)}
              </span>
              <span className="text-muted-foreground text-xs">
                ({destination.reviewCount.toLocaleString("id-ID")})
              </span>
            </div>

            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {destination.visitCount >= 1000
                ? `${(destination.visitCount / 1000).toFixed(0)}K`
                : destination.visitCount}
            </div>
          </div>

          <h3 className="font-bold text-base text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {destination.name}
          </h3>

          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{destination.location}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────────────── */

export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [aiFeaturedDestinations, setAiFeaturedDestinations] = useState<
    Destination[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeHighlight, setActiveHighlight] =
    useState<HomepageHighlight | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        setLoading(true);
        setErrorText("");

        const [destinationRes, categoryRes, highlightRes, reviewRes] =
          await Promise.all([
            fetch(`${API_URL}/destinations`),
            fetch(`${API_URL}/categories/active`),
            fetch(`${API_URL}/homepage-highlights/active`),
            fetch(`${API_URL}/reviews/admin`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
              },
            }),
          ]);

        const [destinationJson, categoryJson, highlightJson, reviewJson] =
          await Promise.all([
            destinationRes.json(),
            categoryRes.json(),
            highlightRes.json(),
            reviewRes.json(),
          ]);

        if (!destinationRes.ok || !destinationJson.success) {
          throw new Error(
            destinationJson.message || "Gagal mengambil data destinasi"
          );
        }

        if (!categoryRes.ok || !categoryJson.success) {
          throw new Error(
            categoryJson.message || "Gagal mengambil data kategori"
          );
        }

        if (!highlightRes.ok || !highlightJson.success) {
          throw new Error(
            highlightJson.message || "Gagal mengambil data highlight"
          );
        }

        const destinationData = Array.isArray(destinationJson.data)
          ? destinationJson.data
          : [];

        const categoryData = Array.isArray(categoryJson.data)
          ? categoryJson.data
          : [];

        const reviewData =
          reviewRes.ok && reviewJson.success && Array.isArray(reviewJson.data)
            ? reviewJson.data
            : [];

        const normalizedDestinations = destinationData.map(
          (item: any, index: number) => normalizeDestination(item, index)
        );

        setDestinations(normalizedDestinations);
        setCategories(categoryData.map(normalizeCategory));

        setActiveHighlight(
          highlightJson.data ? normalizeHighlight(highlightJson.data) : null
        );

        setReviews(
          reviewData.map((item: any, index: number) =>
            normalizeReview(item, index)
          )
        );

        try {
          const featuredRes = await fetch(
            `${RECO_URL}/recommendations/featured?limit=4`
          );

          const featuredJson = await featuredRes.json();

          const featuredData = Array.isArray(featuredJson.results)
            ? featuredJson.results
            : Array.isArray(featuredJson.data)
            ? featuredJson.data
            : Array.isArray(featuredJson.recommendations)
            ? featuredJson.recommendations
            : [];

          if (featuredRes.ok && featuredData.length > 0) {
            setAiFeaturedDestinations(
              featuredData.map((item: any, index: number) =>
                normalizeAiFeaturedDestination(
                  item,
                  index,
                  normalizedDestinations
                )
              )
            );
          } else {
            setAiFeaturedDestinations([]);
          }
        } catch (error) {
          console.error("Gagal mengambil destinasi unggulan dari AI:", error);
          setAiFeaturedDestinations([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data homepage:", error);
        setErrorText(
          error instanceof Error
            ? error.message
            : "Tidak bisa terhubung ke server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  const publishedDestinations = useMemo(() => {
    return destinations.filter((destination) => destination.isPublished);
  }, [destinations]);

  const destinasiUnggulan = useMemo(() => {
    if (aiFeaturedDestinations.length > 0) {
      return aiFeaturedDestinations.slice(0, 4);
    }

    return [...publishedDestinations]
      .sort(
        (a, b) =>
          b.ratingAverage - a.ratingAverage ||
          b.reviewCount - a.reviewCount ||
          b.visitCount - a.visitCount
      )
      .slice(0, 4);
  }, [aiFeaturedDestinations, publishedDestinations]);

  const destinasiPopuler = useMemo(() => {
    return [...publishedDestinations]
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, 4);
  }, [publishedDestinations]);

  const activeCategories = useMemo(() => {
    return categories
      .filter((category) => category.isActive)
      .map((category) => {
        const normalizedCategory = normalizeCategoryText(category.name);

        const matchedCategoryName = getMatchedDestinationCategory(
          category.name,
          publishedDestinations
        );

        const countFromDestination = publishedDestinations.filter(
          (destination) =>
            normalizeCategoryText(destination.category) === normalizedCategory
        ).length;

        return {
          ...category,
          name: matchedCategoryName,
          count: countFromDestination || category.count,
        };
      });
  }, [categories, publishedDestinations]);

  const averageRating = useMemo(() => {
    const reviewBasedRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    if (reviewBasedRating > 0) return reviewBasedRating;

    if (publishedDestinations.length === 0) return 0;

    const total = publishedDestinations.reduce(
      (sum, destination) => sum + destination.ratingAverage,
      0
    );

    return total / publishedDestinations.length;
  }, [reviews, publishedDestinations]);

  const totalVisit = useMemo(() => {
    return publishedDestinations.reduce(
      (sum, destination) => sum + destination.visitCount,
      0
    );
  }, [publishedDestinations]);

  return (
    <div className="flex flex-col min-h-screen">
      {loading && (
        <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-xs font-medium text-gray-500 shadow">
          Memuat data homepage...
        </div>
      )}

      {errorText && (
        <div className="fixed top-20 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-xs font-medium text-red-600 shadow">
          {errorText}
        </div>
      )}

      {/* ── Hero ── */}
      <section className="relative h-[88vh] min-h-[620px] flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#003060]/60 via-[#005A9E]/40 to-[#00090F]/80 z-10" />

        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url('${FALLBACK_HERO_IMAGE}')`,
          }}
        />

        <div className="container relative z-20 mx-auto px-6 pb-20 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-medium text-white/90 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Platform Wisata #1 Tanjung Pinang
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-md leading-tight"
          >
            Temukan Pesona
            <br />
            <span className="text-[#5DD8FF]">Tanjung Pinang</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
            className="text-lg md:text-xl font-medium text-white/85 max-w-2xl mx-auto mb-10"
          >
            Jelajahi keindahan alam, kekayaan sejarah, dan kelezatan kuliner di
            kota gurindam negeri pantun.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="h-14 px-8 text-base font-bold shadow-xl bg-white text-primary hover:bg-white/90 rounded-full"
              asChild
              data-testid="button-jelajahi"
            >
              <Link href="/destination">Jelajahi Sekarang</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base font-semibold bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white backdrop-blur-sm rounded-full"
              asChild
              data-testid="button-lihat-semua"
            >
              <Link href="/destination">Lihat Semua Destinasi</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-16 flex items-center justify-center gap-10 md:gap-20 text-white/90"
          >
            {[
              {
                val: `${publishedDestinations.length}+`,
                label: "Destinasi",
              },
              {
                val:
                  averageRating > 0
                    ? `${averageRating.toFixed(1)}★`
                    : "0.0★",
                label: "Rating Rata-rata",
              },
              {
                val: formatCompactNumber(totalVisit),
                label: "Pengunjung",
              },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold">
                  {stat.val}
                </span>
                <span className="text-xs md:text-sm font-medium mt-1 text-white/70">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Kategori Wisata ── */}
      <section id="kategori" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">
              Jelajahi Tanjung Pinang
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Eksplorasi Berdasarkan Kategori
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Pilih jenis liburan yang Anda inginkan dan temukan destinasi
              terbaik.
            </p>
          </div>

          {activeCategories.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white py-12 text-center text-sm text-muted-foreground">
              Belum ada kategori aktif dari admin.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {activeCategories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link
                    href={`/destination?kategori=${encodeURIComponent(
                      cat.name
                    )}`}
                    className="block relative rounded-2xl overflow-hidden group aspect-[3/4] shadow-sm hover:-translate-y-1.5 transition-all duration-300"
                    data-testid={`card-category-${cat.id}`}
                  >
                    <img
                      src={cat.image || FALLBACK_CARD_IMAGE}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          FALLBACK_CARD_IMAGE;
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors duration-300" />

                    <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col items-center text-center">
                      <span className="text-xl mb-1">{cat.emoji}</span>
                      <h3 className="font-bold text-white text-sm leading-tight mb-0.5">
                        {cat.name}
                      </h3>
                      <span className="text-xs text-white/65">
                        {cat.count} Tempat
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Destinasi Unggulan ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">
                Terpopuler
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Destinasi Unggulan
              </h2>
              <p className="text-muted-foreground">
                Rekomendasi destinasi unggulan berdasarkan sistem AI.
              </p>
            </div>

            <Button
              variant="ghost"
              className="hidden sm:flex group text-primary hover:text-primary"
              asChild
            >
              <Link href="/destination">
                Lihat Semua{" "}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {destinasiUnggulan.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white py-12 text-center text-sm text-muted-foreground">
              Belum ada destinasi unggulan dari database atau AI.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinasiUnggulan.map((dest, i) => (
                <DestinationCard
                  key={`${dest.id}-${dest.slug}`}
                  destination={dest}
                  index={i}
                  badge="⭐ Unggulan"
                />
              ))}
            </div>
          )}

          <Button variant="outline" className="w-full mt-6 sm:hidden" asChild>
            <Link href="/destination">Lihat Semua Destinasi</Link>
          </Button>
        </div>
      </section>

      {/* ── Homepage Highlight / Pilihan Editor ── */}
      {activeHighlight && (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-2xl min-h-[360px] flex items-end"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-transparent z-10" />

              <img
                src={activeHighlight.image || FALLBACK_CARD_IMAGE}
                alt={activeHighlight.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_CARD_IMAGE;
                }}
              />

              <div className="relative z-20 p-8 md:p-14 flex flex-col md:max-w-[60%]">
                <span className="px-3 py-1 bg-primary/80 text-white font-bold rounded-full text-xs w-max mb-5 backdrop-blur-sm border border-primary/30">
                  {activeHighlight.badge}
                </span>

                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  {activeHighlight.title}
                </h2>

                <p className="text-slate-300 text-base mb-8 leading-relaxed">
                  {activeHighlight.subtitle}
                </p>

                <Button
                  size="lg"
                  className="w-max bg-white text-primary hover:bg-white/90 font-bold shadow-xl"
                  asChild
                  data-testid="button-highlight-cta"
                >
                  <Link href={activeHighlight.buttonLink}>
                    {activeHighlight.buttonText} →
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Paling Banyak Dikunjungi ── */}
      <section className="py-20 bg-gradient-to-b from-muted/40 to-muted/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">
                Trending
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Paling Banyak Dikunjungi
              </h2>
              <p className="text-muted-foreground">
                Destinasi favorit wisatawan berdasarkan jumlah kunjungan.
              </p>
            </div>
          </div>

          {destinasiPopuler.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white py-12 text-center text-sm text-muted-foreground">
              Belum ada data destinasi populer dari database.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinasiPopuler.map((dest, i) => (
                <DestinationCard
                  key={dest.id}
                  destination={dest}
                  index={i}
                  rankNumber={`0${i + 1}`}
                  badge={`#${i + 1} Populer`}
                  bgTint="bg-slate-50"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Testimoni / Apa Kata Pengunjung ── */}
      <TestimoniSection reviews={reviews} />

      <Footer />
    </div>
  );
}