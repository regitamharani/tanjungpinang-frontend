import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Users,
  Tag,
  Star,
  MessageSquare,
  Eye,
  Zap,
  RefreshCw,
  AlertCircle,
  ImagePlus,
  Trash2,
} from "lucide-react";

const API_URL = "http://localhost:3000/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop";

const toBoolean = (value) => {
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

const toNumber = (value, fallback = 0) => {
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? fallback : numberValue;
};

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString("id-ID");
};

const formatDate = (date) => {
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
};

const normalizeDestination = (item, index) => {
  const name = item.name || item.nama || item.title || "Destinasi";

  return {
    id: item.id ?? index + 1,
    slug: item.slug || String(item.id || ""),
    name,
    category: item.category || item.kategori || "Wisata",
    location: item.location || item.lokasi || "Tanjung Pinang",
    image:
      item.image ||
      item.gambar ||
      item.img ||
      item.mainImage ||
      item.main_image ||
      FALLBACK_IMAGE,
    ratingAverage: toNumber(
      item.ratingAverage ??
        item.rating_average ??
        item.rata_rating ??
        item.rating ??
        item.averageRating,
      0
    ),
    reviewCount: toNumber(
      item.reviewCount ??
        item.review_count ??
        item.jumlah_ulasan ??
        item.reviews_count ??
        item.totalReviews,
      0
    ),
    visitCount: toNumber(
      item.visitCount ??
        item.visit_count ??
        item.views ??
        item.view_count ??
        item.visits ??
        item.total_visits,
      0
    ),
    isPublished: toBoolean(
      item.isPublished ??
        item.is_published ??
        item.published ??
        item.status ??
        true
    ),
    createdAt: item.createdAt || item.created_at || null,
  };
};

const normalizeCategory = (item) => {
  return {
    id: item.id,
    name: item.name || item.NAME || "Kategori",
    image: item.image || "",
    emoji: item.emoji || "🧭",
    isActive: toBoolean(item.isActive ?? item.is_active ?? true),
    createdAt: item.createdAt || item.created_at || null,
  };
};

const normalizeUser = (item, index) => {
  return {
    id: item.id ?? index + 1,
    name: item.name || item.nama || item.username || "User",
    email: item.email || "",
    role: item.role || "user",
    status: item.status || (toBoolean(item.is_active) ? "active" : "active"),
    createdAt: item.createdAt || item.created_at || null,
  };
};

const normalizeReview = (item, index) => {
  return {
    id: item.id ?? index + 1,
    destinationId: item.destinationId || item.destination_id,
    destinationName:
      item.destinationName ||
      item.destination_name ||
      item.name ||
      item.nama_destinasi ||
      item.destination ||
      "Destinasi",
    userId: item.userId || item.user_id || null,
    userName:
      item.userName ||
      item.user_name ||
      item.nama ||
      item.email ||
      "Pengguna",
    userAvatar:
      item.userAvatar ||
      item.user_avatar ||
      item.avatar ||
      item.avatar_url ||
      "",
    rating: Number(item.rating || 0),
    comment: item.comment || "",
    status: item.status || "visible",
    createdAt: item.createdAt || item.created_at || "",
  };
};

const normalizeHighlight = (item) => {
  return {
    id: item.id,
    title: item.title || "",
    isActive: toBoolean(item.isActive ?? item.is_active),
  };
};

const colorMap = {
  indigo: {
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    text: "text-indigo-600",
    icon: "text-indigo-500",
  },
  violet: {
    bg: "bg-violet-50",
    border: "border-violet-100",
    text: "text-violet-600",
    icon: "text-violet-500",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    text: "text-emerald-600",
    icon: "text-emerald-500",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-100",
    text: "text-amber-600",
    icon: "text-amber-500",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    text: "text-blue-600",
    icon: "text-blue-500",
  },
  rose: {
    bg: "bg-rose-50",
    border: "border-rose-100",
    text: "text-rose-600",
    icon: "text-rose-500",
  },
};

export default function Dashboard() {
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [highlights, setHighlights] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const fetchJsonSafe = useCallback(async (url) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.message || `Gagal mengambil data: ${url}`);
    }

    return Array.isArray(json.data) ? json.data : [];
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorText("");

      const results = await Promise.allSettled([
        fetchJsonSafe(`${API_URL}/destinations`),
        fetchJsonSafe(`${API_URL}/categories`),
        fetchJsonSafe(`${API_URL}/users`),
        fetchJsonSafe(`${API_URL}/reviews/admin`),
        fetchJsonSafe(`${API_URL}/homepage-highlights`),
      ]);

      const destinationResult = results[0];
      const categoryResult = results[1];
      const userResult = results[2];
      const reviewResult = results[3];
      const highlightResult = results[4];

      if (destinationResult.status === "fulfilled") {
        setDestinations(destinationResult.value.map(normalizeDestination));
      } else {
        setDestinations([]);
      }

      if (categoryResult.status === "fulfilled") {
        setCategories(categoryResult.value.map(normalizeCategory));
      } else {
        setCategories([]);
      }

      if (userResult.status === "fulfilled") {
        setUsers(userResult.value.map(normalizeUser));
      } else {
        setUsers([]);
      }

      if (reviewResult.status === "fulfilled") {
        setReviews(reviewResult.value.map(normalizeReview));
      } else {
        setReviews([]);
      }

      if (highlightResult.status === "fulfilled") {
        setHighlights(highlightResult.value.map(normalizeHighlight));
      } else {
        setHighlights([]);
      }

      const failed = results.filter((result) => result.status === "rejected");

      if (failed.length > 0) {
        setErrorText(
          "Sebagian data gagal dimuat. Pastikan semua endpoint backend sudah tersedia."
        );
      }
    } catch (error) {
      setErrorText(
        error instanceof Error
          ? error.message
          : "Tidak bisa terhubung ke server."
      );
    } finally {
      setLoading(false);
    }
  }, [fetchJsonSafe]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const publishedDest = useMemo(() => {
    return destinations.filter((destination) => destination.isPublished);
  }, [destinations]);

  const totalReviews = reviews.length;

  const avgRating = useMemo(() => {
    if (reviews.length > 0) {
      const total = reviews.reduce((sum, review) => sum + review.rating, 0);
      return (total / reviews.length).toFixed(1);
    }

    if (publishedDest.length > 0) {
      const total = publishedDest.reduce(
        (sum, destination) => sum + destination.ratingAverage,
        0
      );
      return (total / publishedDest.length).toFixed(1);
    }

    return "—";
  }, [reviews, publishedDest]);

  const topByRating = useMemo(() => {
    return [...publishedDest]
      .filter((destination) => destination.ratingAverage > 0)
      .sort(
        (a, b) =>
          b.ratingAverage - a.ratingAverage ||
          b.reviewCount - a.reviewCount ||
          b.visitCount - a.visitCount
      )
      .slice(0, 5);
  }, [publishedDest]);

  const topByVisit = useMemo(() => {
    return [...publishedDest]
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, 5);
  }, [publishedDest]);

  const recentReviews = useMemo(() => {
    return [...reviews]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);
  }, [reviews]);

  const activeHighlight = highlights.find((highlight) => highlight.isActive);

  const totalVisit = publishedDest.reduce(
    (sum, destination) => sum + destination.visitCount,
    0
  );

  const activeUsers = users.filter((user) => user.status === "active");

  const stats = [
    {
      label: "Total Destinasi",
      value: destinations.length,
      sub: `${publishedDest.length} published`,
      icon: MapPin,
      color: "indigo",
      link: "/destinations",
    },
    {
      label: "Total Kategori",
      value: categories.length,
      sub: `${categories.filter((category) => category.isActive).length} aktif`,
      icon: Tag,
      color: "violet",
      link: "/categories",
    },
    {
      label: "Total Pengguna",
      value: users.length,
      sub: `${activeUsers.length} aktif`,
      icon: Users,
      color: "emerald",
      link: "/users",
    },
    {
      label: "Total Ulasan",
      value: totalReviews,
      sub: `avg ★ ${avgRating}`,
      icon: MessageSquare,
      color: "amber",
      link: "/reviews",
    },
    {
      label: "Total Kunjungan",
      value: formatNumber(totalVisit),
      sub: "semua destinasi",
      icon: Eye,
      color: "blue",
      link: "/destinations",
    },
    {
      label: "Highlight Aktif",
      value: activeHighlight ? 1 : 0,
      sub: activeHighlight ? activeHighlight.title : "belum aktif",
      icon: Zap,
      color: "rose",
      link: "/homepage-highlight",
    },
  ];

  const recentActivities = [
    ...destinations.slice(0, 3).map((destination) => ({
      id: `destination-${destination.id}`,
      text: `Destinasi ${destination.name}`,
      detail: destination.isPublished
        ? "Status published"
        : "Belum dipublish",
      time: "Destinasi",
    })),
    ...categories.slice(0, 2).map((category) => ({
      id: `category-${category.id}`,
      text: `Kategori ${category.name}`,
      detail: category.isActive ? "Kategori aktif" : "Kategori nonaktif",
      time: "Kategori",
    })),
    ...reviews.slice(0, 2).map((review) => ({
      id: `review-${review.id}`,
      text: `Ulasan dari ${review.userName}`,
      detail: `${review.destinationName} · ${review.rating} bintang`,
      time: "Ulasan",
    })),
    ...highlights.slice(0, 1).map((highlight) => ({
      id: `highlight-${highlight.id}`,
      text: `Highlight ${highlight.title}`,
      detail: highlight.isActive ? "Aktif di homepage" : "Nonaktif",
      time: "Highlight",
    })),
  ].slice(0, 6);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Tanjung Pinang Guide — Pusat Pengelolaan Konten
            </p>
          </div>

          <button
            type="button"
            onClick={fetchDashboardData}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="px-6 md:px-8 py-6 max-w-7xl">
        {errorText && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{errorText}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-sm text-gray-400">
            Memuat data dashboard...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                const color = colorMap[stat.color];

                return (
                  <Link
                    key={stat.label}
                    to={stat.link}
                    className={`rounded-xl border p-4 flex flex-col gap-3 hover:shadow-md transition-shadow bg-white ${color.border}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-gray-500">
                        {stat.label}
                      </p>

                      <div
                        className={`w-7 h-7 rounded-lg ${color.bg} flex items-center justify-center shrink-0`}
                      >
                        <Icon size={14} className={color.icon} />
                      </div>
                    </div>

                    <div>
                      <p className={`text-2xl font-bold ${color.text}`}>
                        {stat.value}
                      </p>

                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {stat.sub}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mb-6">
              <p className="text-sm font-semibold text-gray-800 mb-3">
                Data Otomatis Homepage Frontend
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    label: "Eksplorasi Kategori",
                    src: "Kelola Kategori",
                    color: "violet",
                    link: "/categories",
                  },
                  {
                    label: "Destinasi Unggulan",
                    src: "Rating tertinggi otomatis",
                    color: "amber",
                    link: "/destinations",
                  },
                  {
                    label: "Paling Banyak Dikunjungi",
                    src: "visitCount otomatis",
                    color: "blue",
                    link: "/destinations",
                  },
                  {
                    label: "Homepage Highlight",
                    src: activeHighlight
                      ? activeHighlight.title
                      : "Belum ada highlight aktif",
                    color: "emerald",
                    link: "/homepage-highlight",
                  },
                ].map(({ label, src, color, link }) => {
                  const colorClass = colorMap[color];

                  return (
                    <Link
                      key={label}
                      to={link}
                      className={`p-3 rounded-xl border ${colorClass.border} ${colorClass.bg} hover:opacity-80 transition-opacity`}
                    >
                      <p className={`text-xs font-semibold ${colorClass.text}`}>
                        {label}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">{src}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Destinasi Unggulan
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      otomatis dari rating tertinggi
                    </p>
                  </div>

                  <Link
                    to="/destinations"
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Lihat semua
                  </Link>
                </div>

                <div className="space-y-3">
                  {topByRating.length === 0 && (
                    <p className="text-xs text-gray-400">
                      Belum ada data rating dari database
                    </p>
                  )}

                  {topByRating.map((destination, index) => (
                    <div
                      key={destination.id}
                      className="flex items-center gap-3"
                    >
                      <span className="text-xs font-bold text-gray-300 w-4 shrink-0">
                        {index + 1}
                      </span>

                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-8 h-8 rounded-lg object-cover bg-gray-100 shrink-0"
                        onError={(event) => {
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">
                          {destination.name}
                        </p>

                        <div className="flex items-center gap-1 mt-0.5">
                          <Star
                            size={10}
                            className="text-amber-400 fill-amber-400"
                          />
                          <span className="text-xs text-gray-500">
                            {destination.ratingAverage.toFixed(1)} (
                            {destination.reviewCount} ulasan)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Paling Banyak Dikunjungi
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      otomatis dari visitCount
                    </p>
                  </div>

                  <Link
                    to="/destinations"
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Lihat semua
                  </Link>
                </div>

                <div className="space-y-3">
                  {topByVisit.length === 0 && (
                    <p className="text-xs text-gray-400">
                      Belum ada data kunjungan dari database
                    </p>
                  )}

                  {topByVisit.map((destination, index) => (
                    <div
                      key={destination.id}
                      className="flex items-center gap-3"
                    >
                      <span className="text-xs font-bold text-gray-300 w-4 shrink-0">
                        {index + 1}
                      </span>

                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-8 h-8 rounded-lg object-cover bg-gray-100 shrink-0"
                        onError={(event) => {
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">
                          {destination.name}
                        </p>

                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="flex-1 h-1 bg-gray-100 rounded-full max-w-16">
                            <div
                              className="h-1 bg-indigo-400 rounded-full"
                              style={{
                                width: `${
                                  (destination.visitCount /
                                    (topByVisit[0]?.visitCount || 1)) *
                                  100
                                }%`,
                              }}
                            />
                          </div>

                          <span className="text-xs text-gray-500">
                            {formatNumber(destination.visitCount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-800 mb-4">
                  Aktivitas Terbaru
                </p>

                <div className="space-y-3.5">
                  {recentActivities.length === 0 && (
                    <p className="text-xs text-gray-400">
                      Belum ada aktivitas dari database
                    </p>
                  )}

                  {recentActivities.map((activity, index) => (
                    <div
                      key={activity.id ?? index}
                      className="flex items-start gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700">
                          {activity.text}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {activity.detail}
                        </p>
                      </div>

                      <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">
                    Ulasan Terbaru
                  </p>

                  <Link
                    to="/reviews"
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Lihat semua
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[850px]">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          User
                        </th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Destinasi
                        </th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Rating
                        </th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Komentar
                        </th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Tanggal
                        </th>
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                      {recentReviews.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-14 text-center text-sm text-gray-400"
                          >
                            Belum ada ulasan dari database
                          </td>
                        </tr>
                      ) : (
                        recentReviews.map((review) => (
                          <tr
                            key={review.id}
                            className="hover:bg-gray-50/60 transition-colors"
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                {review.userAvatar ? (
                                  <img
                                    src={review.userAvatar}
                                    alt={review.userName}
                                    className="w-7 h-7 rounded-full object-cover shrink-0"
                                  />
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                                    {review.userName
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>
                                )}

                                <p className="text-xs font-semibold text-gray-800 truncate max-w-[130px]">
                                  {review.userName}
                                </p>
                              </div>
                            </td>

                            <td className="px-5 py-3.5">
                              <p className="text-xs text-gray-700 truncate max-w-[180px]">
                                {review.destinationName}
                              </p>
                            </td>

                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, index) => (
                                  <Star
                                    key={index}
                                    size={11}
                                    className={
                                      index < review.rating
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-gray-200 fill-gray-200"
                                    }
                                  />
                                ))}
                              </div>
                            </td>

                            <td className="px-5 py-3.5">
                              <p className="text-xs text-gray-500 truncate max-w-[260px]">
                                {review.comment || "Tidak ada komentar"}
                              </p>
                            </td>

                            <td className="px-5 py-3.5">
                              <p className="text-xs text-gray-400 whitespace-nowrap">
                                {formatDate(review.createdAt)}
                              </p>
                            </td>

                            <td className="px-5 py-3.5">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  to="/reviews"
                                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                                >
                                  Detail
                                </Link>

                                <button
                                  type="button"
                                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Hapus ulasan dari halaman ulasan"
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
              </div>
            </div>

            {destinations.length === 0 &&
              categories.length === 0 &&
              users.length === 0 &&
              reviews.length === 0 && (
                <div className="mt-6 rounded-xl border border-gray-100 bg-white p-8 text-center">
                  <ImagePlus className="mx-auto mb-3 text-gray-300" size={32} />
                  <p className="text-sm font-medium text-gray-700">
                    Data dashboard masih kosong
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Tambahkan destinasi, kategori, highlight, atau ulasan dari
                    halaman admin.
                  </p>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}