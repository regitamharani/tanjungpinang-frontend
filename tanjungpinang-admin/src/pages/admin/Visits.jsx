import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, AlertCircle, Eye, Mail } from "lucide-react";

const API_URL = "http://localhost:3000/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop";

const toNumber = (value, fallback = 0) => {
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? fallback : numberValue;
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeDestination = (item, index) => {
  return {
    id: item.id ?? index + 1,
    slug: item.slug || "",
    name: item.name || item.nama || "Destinasi",
    category: item.category || item.kategori || "Wisata",
    location: item.location || item.lokasi || "-",
    image:
      item.mainImage ||
      item.main_image ||
      item.image ||
      item.gambar ||
      item.img ||
      FALLBACK_IMAGE,
    visitCount: toNumber(
      item.visitCount ??
        item.visit_count ??
        item.views ??
        item.kunjungan ??
        item.jumlah_kunjungan,
      0
    ),
    createdAt: item.createdAt || item.created_at || null,
    updatedAt: item.updatedAt || item.updated_at || null,
    isPublished:
      item.isPublished === true ||
      item.is_published === 1 ||
      item.is_published === true ||
      item.status === "published",
  };
};

const normalizeVisitLog = (item, index) => {
  return {
    id: item.id ?? index + 1,
    destinationId: item.destinationId || item.destination_id || null,
    destinationName:
      item.destinationName ||
      item.destination_name ||
      item.nama_destinasi ||
      item.destination ||
      "Destinasi",
    destinationSlug: item.destinationSlug || item.destination_slug || "",
    userId: item.userId || item.user_id || null,
    userName:
      item.userName ||
      item.user_name ||
      item.nama_user ||
      item.name ||
      item.email ||
      "Pengunjung",
    userEmail:
      item.userEmail ||
      item.user_email ||
      item.email ||
      "",
    userAvatar:
      item.userAvatar ||
      item.user_avatar ||
      item.avatar ||
      item.avatar_url ||
      "",
    visitedAt:
      item.visitedAt ||
      item.visited_at ||
      item.createdAt ||
      item.created_at ||
      null,
  };
};

export default function Visits() {
  const [destinations, setDestinations] = useState([]);
  const [visitLogs, setVisitLogs] = useState([]);

  const [search, setSearch] = useState("");
  const [filterDest, setFilterDest] = useState("all");
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [logWarning, setLogWarning] = useState("");

  const fetchJson = useCallback(async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        ...(options.headers || {}),
      },
    });

    const text = await response.text();

    let json;

    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Response bukan JSON dari ${url}`);
    }

    if (!response.ok || !json.success) {
      throw new Error(json.message || `Gagal mengambil data dari ${url}`);
    }

    return Array.isArray(json.data) ? json.data : [];
  }, []);

  const fetchVisitsData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorText("");
      setLogWarning("");

      const destinationData = await fetchJson(`${API_URL}/destinations/admin`);
      setDestinations(destinationData.map(normalizeDestination));

      try {
        const logData = await fetchJson(`${API_URL}/visits`);
        setVisitLogs(logData.map(normalizeVisitLog));
      } catch (error) {
        setVisitLogs([]);
        setLogWarning(
          "Endpoint /api/visits belum terbaca. Pastikan visitRoutes sudah didaftarkan di server.js dan tabel destination_visits sudah ada."
        );
      }
    } catch (error) {
      setErrorText(
        error instanceof Error
          ? error.message
          : "Tidak bisa terhubung ke server."
      );
      setDestinations([]);
      setVisitLogs([]);
    } finally {
      setLoading(false);
    }
  }, [fetchJson]);

  useEffect(() => {
    fetchVisitsData();
  }, [fetchVisitsData]);

  const visitStats = useMemo(() => {
    return [...destinations]
      .map((destination) => ({
        ...destination,
        visits: destination.visitCount,
        lastVisit: destination.updatedAt,
      }))
      .sort((a, b) => b.visits - a.visits);
  }, [destinations]);

  const totalVisits = useMemo(() => {
    return visitStats.reduce((sum, destination) => sum + destination.visits, 0);
  }, [visitStats]);

  const filteredLogs = useMemo(() => {
    const q = search.toLowerCase();

    return visitLogs.filter((visit) => {
      const matchSearch =
        visit.userName.toLowerCase().includes(q) ||
        visit.userEmail.toLowerCase().includes(q) ||
        visit.destinationName.toLowerCase().includes(q);

      const matchDestination =
        filterDest === "all" || String(visit.destinationId) === filterDest;

      return matchSearch && matchDestination;
    });
  }, [visitLogs, search, filterDest]);

  const filteredStats = useMemo(() => {
    const q = search.toLowerCase();

    return visitStats.filter((destination) => {
      const matchSearch =
        destination.name.toLowerCase().includes(q) ||
        destination.category.toLowerCase().includes(q);

      const matchDestination =
        filterDest === "all" || String(destination.id) === filterDest;

      return matchSearch && matchDestination;
    });
  }, [visitStats, search, filterDest]);

  const maxVisit = visitStats[0]?.visits || 1;

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">
              Riwayat Kunjungan
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {totalVisits.toLocaleString("id-ID")} total kunjungan dari
              database · {visitLogs.length.toLocaleString("id-ID")} log user
              tercatat
            </p>
          </div>

          <button
            type="button"
            onClick={fetchVisitsData}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="px-6 md:px-8 py-6 max-w-6xl">
        {errorText && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{errorText}</p>
          </div>
        )}

        {logWarning && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{logWarning}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-sm text-gray-400">
            Memuat data kunjungan...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <p className="text-xs text-gray-400 font-medium">
                  Total Kunjungan
                </p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {totalVisits.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <p className="text-xs text-gray-400 font-medium">
                  Log User
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {visitLogs.length.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <p className="text-xs text-gray-400 font-medium">
                  Destinasi Teratas
                </p>
                <p className="text-sm font-semibold text-gray-800 mt-2 truncate">
                  {visitStats[0]?.name || "Belum ada"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {(visitStats[0]?.visits || 0).toLocaleString("id-ID")}{" "}
                  kunjungan
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-5">
              <div className="relative flex-1 min-w-[220px]">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari destinasi, kategori, user, atau email..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <select
                value={filterDest}
                onChange={(e) => setFilterDest(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none"
              >
                <option value="all">Semua Destinasi</option>
                {destinations.map((destination) => (
                  <option key={destination.id} value={String(destination.id)}>
                    {destination.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-800 mb-3">
                Statistik Kunjungan per Destinasi
              </p>

              <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          #
                        </th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Destinasi
                        </th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Total Kunjungan
                        </th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                          Terakhir Update
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                      {filteredStats.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-12 text-center text-sm text-gray-400"
                          >
                            Tidak ada data kunjungan dari database
                          </td>
                        </tr>
                      ) : (
                        filteredStats.map((destination, index) => (
                          <tr
                            key={destination.id}
                            className="hover:bg-gray-50/50"
                          >
                            <td className="px-5 py-3 text-xs font-bold text-gray-300">
                              {index + 1}
                            </td>

                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={destination.image || FALLBACK_IMAGE}
                                  alt={destination.name}
                                  className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0"
                                  onError={(event) => {
                                    event.currentTarget.src = FALLBACK_IMAGE;
                                  }}
                                />

                                <div>
                                  <p className="text-xs font-semibold text-gray-800">
                                    {destination.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {destination.category}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-1.5 bg-gray-100 rounded-full">
                                  <div
                                    className="h-1.5 bg-indigo-500 rounded-full"
                                    style={{
                                      width: `${
                                        (destination.visits / maxVisit) * 100
                                      }%`,
                                    }}
                                  />
                                </div>

                                <span className="text-sm font-bold text-gray-700 tabular-nums">
                                  {destination.visits.toLocaleString("id-ID")}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-3 text-xs text-gray-400 hidden md:table-cell">
                              {formatDate(destination.lastVisit)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-800 mb-3">
              Log Kunjungan User
            </p>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        User
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                        Destinasi
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Tanggal
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-12 text-center text-sm text-gray-400"
                        >
                          <Eye
                            className="mx-auto mb-2 text-gray-300"
                            size={26}
                          />
                          Belum ada log kunjungan user. Login sebagai user,
                          buka detail destinasi, lalu refresh halaman ini.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((visit) => (
                        <tr
                          key={visit.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              {visit.userAvatar ? (
                                <img
                                  src={visit.userAvatar}
                                  alt={visit.userName}
                                  className="w-8 h-8 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                                  {visit.userName.charAt(0).toUpperCase()}
                                </div>
                              )}

                              <div>
                                <p className="text-xs font-semibold text-gray-800">
                                  {visit.userName}
                                </p>

                                {visit.userEmail ? (
                                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                                    <Mail size={10} />
                                    {visit.userEmail}
                                  </p>
                                ) : (
                                  <p className="text-[11px] text-gray-400 mt-0.5">
                                    Email tidak tersedia
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-3.5 text-xs text-gray-600 hidden md:table-cell">
                            {visit.destinationName}
                          </td>

                          <td className="px-5 py-3.5 text-xs text-gray-400">
                            {formatDate(visit.visitedAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}