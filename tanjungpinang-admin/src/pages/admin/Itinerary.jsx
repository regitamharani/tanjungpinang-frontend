import { useEffect, useMemo, useState } from "react";
import {
  Zap,
  X,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

const API_BASE_URL = "http://localhost:3000/api";

const BUDGET_STYLES = {
  hemat: "bg-emerald-50 text-emerald-700 border-emerald-200",
  menengah: "bg-blue-50 text-blue-700 border-blue-200",
  premium: "bg-violet-50 text-violet-700 border-violet-200",
};

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function formatRp(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function getDestinationUrl(item) {
  if (!item?.destinationSlug) return null;

  return `/destination/${item.destinationSlug}`;
}

async function fetchAdminItineraryLogs() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}/itineraries/admin/logs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    console.error("Response bukan JSON:", text);
    throw new Error(
      "Backend tidak mengembalikan JSON. Cek route /api/itineraries/admin/logs."
    );
  }

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Gagal mengambil data itinerary.");
  }

  return json.data || [];
}

function DestinationName({ item }) {
  const detailUrl = getDestinationUrl(item);

  if (!detailUrl) {
    return (
      <p className="text-sm font-semibold text-gray-800">
        {item.destinationName}
      </p>
    );
  }

  return (
    <a
      href={detailUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:text-indigo-900 hover:underline"
      title="Buka detail destinasi"
    >
      {item.destinationName}
      <ExternalLink size={12} />
    </a>
  );
}

function LogDetail({ log: it, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="Tutup modal"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-base font-bold text-gray-900">{it.userName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{it.userEmail}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatDate(it.createdAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <X size={15} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Durasi</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">
              {it.duration} hari
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Peserta</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">
              {it.people || 1} orang
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Budget</p>
            <p
              className={`text-sm font-semibold mt-0.5 capitalize ${
                it.budget === "hemat"
                  ? "text-emerald-700"
                  : it.budget === "premium"
                  ? "text-violet-700"
                  : "text-blue-700"
              }`}
            >
              {it.budget}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Estimasi</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">
              {formatRp(it.estimatedCostMin)}
            </p>
          </div>
        </div>

        {(it.interests || []).length > 0 && (
          <div className="mb-5">
            <p className="text-xs text-gray-400 mb-2">Minat Wisata</p>
            <div className="flex flex-wrap gap-1.5">
              {it.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {it.notes && (
          <div className="mb-5">
            <p className="text-xs text-gray-400 mb-2">Catatan User / AI</p>
            <div className="px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
              {it.notes}
            </div>
          </div>
        )}

        {(it.items || []).length > 0 && (
          <div>
            <p className="text-xs text-gray-400 mb-2">
              Detail Itinerary yang Dihasilkan AI
            </p>

            <div className="space-y-2">
              {it.items.map((item, index) => (
                <div
                  key={`${item.day}-${item.time}-${index}`}
                  className="flex items-start gap-3 px-3 py-3 bg-gray-50 rounded-xl"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <DestinationName item={item} />

                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500">
                        Hari {item.day}
                      </span>

                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500">
                        {item.time}
                      </span>

                      {item.destinationId || item.destinationSlug ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                          Terhubung DB
                        </span>
                      ) : (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700">
                          Dari AI
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      {item.category || "Wisata"} · {item.duration || "-"} ·{" "}
                      {formatRp(item.estimatedCost)}
                    </p>

                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {item.tips && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        Tips: {item.tips}
                      </p>
                    )}

                    {item.mapsUrl && (
                      <a
                        href={item.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
                      >
                        Buka Maps
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!it.items || it.items.length === 0) && (
          <div className="py-8 text-center text-sm text-gray-400">
            Detail itinerary belum tersedia.
          </div>
        )}
      </div>
    </div>
  );
}

export default function Itinerary() {
  const [itineraryLogs, setItineraryLogs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filterBudget, setFilterBudget] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await fetchAdminItineraryLogs();
      setItineraryLogs(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    return itineraryLogs.filter((it) => {
      const q = search.toLowerCase();

      const matchSearch =
        String(it.userName || "").toLowerCase().includes(q) ||
        String(it.userEmail || "").toLowerCase().includes(q) ||
        String(it.title || "").toLowerCase().includes(q) ||
        (it.generatedDestinations || []).some((destination) =>
          String(destination || "").toLowerCase().includes(q)
        );

      const matchBudget = filterBudget === "all" || it.budget === filterBudget;

      return matchSearch && matchBudget;
    });
  }, [itineraryLogs, search, filterBudget]);

  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [filtered]);

  const analytics = useMemo(() => {
    const budgetCount = { hemat: 0, menengah: 0, premium: 0 };
    const interestCount = {};
    const destCount = {};
    let connectedDestinationCount = 0;
    let totalItemCount = 0;

    itineraryLogs.forEach((it) => {
      if (it.budget) {
        budgetCount[it.budget] = (budgetCount[it.budget] || 0) + 1;
      }

      (it.interests || []).forEach((interest) => {
        interestCount[interest] = (interestCount[interest] || 0) + 1;
      });

      (it.items || []).forEach((item) => {
        totalItemCount += 1;

        if (item.destinationId || item.destinationSlug) {
          connectedDestinationCount += 1;
        }

        if (item.destinationName) {
          destCount[item.destinationName] =
            (destCount[item.destinationName] || 0) + 1;
        }
      });
    });

    const topInterests = Object.entries(interestCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topDests = Object.entries(destCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const avgDuration = itineraryLogs.length
      ? (
          itineraryLogs.reduce((sum, it) => sum + Number(it.duration || 0), 0) /
          itineraryLogs.length
        ).toFixed(1)
      : 0;

    const topBudget =
      Object.entries(budgetCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    const connectedPercentage = totalItemCount
      ? Math.round((connectedDestinationCount / totalItemCount) * 100)
      : 0;

    return {
      budgetCount,
      topInterests,
      topDests,
      avgDuration,
      topBudget,
      connectedDestinationCount,
      totalItemCount,
      connectedPercentage,
    };
  }, [itineraryLogs]);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-gray-900">
              Itinerary Logs
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {itineraryLogs.length} itinerary dibuat via AI · data dari
              database user
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="px-6 md:px-8 py-5 max-w-6xl">
        <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl mb-6">
          <Zap size={15} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Halaman ini menampilkan itinerary yang dibuat user melalui AI.
            Destinasi yang cocok dengan tabel <strong>destinations</strong>{" "}
            akan memiliki <strong>destination_id</strong> dan{" "}
            <strong>destination_slug</strong>, sehingga bisa diarahkan ke detail
            destinasi.
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl mb-6">
            <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">Total Generate</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">
              {itineraryLogs.length}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">Rata-rata Durasi</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {analytics.avgDuration}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">hari</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">Budget Terpopuler</p>
            <p className="text-sm font-bold text-gray-800 mt-1 capitalize">
              {analytics.topBudget}
            </p>
            <p className="text-xs text-gray-400">
              {analytics.budgetCount[analytics.topBudget] || 0}x dipilih
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">Minat Terpopuler</p>
            <p className="text-sm font-bold text-gray-800 mt-1">
              {analytics.topInterests[0]?.[0] || "—"}
            </p>
            <p className="text-xs text-gray-400">
              {analytics.topInterests[0]?.[1] || 0}x dipilih
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">Terhubung DB</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {analytics.connectedPercentage}%
            </p>
            <p className="text-xs text-gray-400">
              {analytics.connectedDestinationCount}/{analytics.totalItemCount}{" "}
              item
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-4">
              Destinasi Paling Sering Direkomendasikan AI
            </p>

            <div className="space-y-2.5">
              {analytics.topDests.map(([dest, count], index) => (
                <div key={dest} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-300 w-4 shrink-0">
                    {index + 1}
                  </span>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-700">{dest}</span>
                      <span className="text-xs font-semibold text-indigo-600">
                        {count}x
                      </span>
                    </div>

                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div
                        className="h-1.5 bg-indigo-400 rounded-full"
                        style={{
                          width: `${
                            (count / (analytics.topDests[0]?.[1] || 1)) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {analytics.topDests.length === 0 && (
                <p className="text-xs text-gray-400">Belum ada data</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-4">
              Minat Wisata Terpopuler
            </p>

            <div className="space-y-2.5">
              {analytics.topInterests.map(([interest, count]) => (
                <div
                  key={interest}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-700">{interest}</span>

                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full">
                      <div
                        className="h-1.5 bg-rose-400 rounded-full"
                        style={{
                          width: `${
                            (count / (analytics.topInterests[0]?.[1] || 1)) *
                            100
                          }%`,
                        }}
                      />
                    </div>

                    <span className="text-xs font-semibold text-rose-600 w-6 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}

              {analytics.topInterests.length === 0 && (
                <p className="text-xs text-gray-400">Belum ada data</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              🔍
            </span>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama user, email, judul, atau destinasi..."
              className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <select
            value={filterBudget}
            onChange={(event) => setFilterBudget(event.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none"
          >
            <option value="all">Semua Budget</option>
            <option value="hemat">Hemat</option>
            <option value="menengah">Menengah</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    User
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Durasi
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Peserta
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Budget
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
                    Minat
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                    Tanggal
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-16 text-center text-sm text-gray-400"
                    >
                      Memuat data itinerary...
                    </td>
                  </tr>
                ) : sorted.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-16 text-center text-sm text-gray-400"
                    >
                      Belum ada log itinerary
                    </td>
                  </tr>
                ) : (
                  sorted.map((it) => (
                    <tr
                      key={it.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold text-gray-800">
                          {it.userName}
                        </p>
                        <p className="text-xs text-gray-400">{it.userEmail}</p>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-gray-700">
                          {it.duration}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">hari</span>
                      </td>

                      <td className="px-5 py-3.5 text-sm text-gray-700">
                        {it.people || 1} orang
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${
                            BUDGET_STYLES[it.budget] ||
                            "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          {it.budget}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(it.interests || []).slice(0, 2).map((interest) => (
                            <span
                              key={interest}
                              className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[11px]"
                            >
                              {interest}
                            </span>
                          ))}

                          {(it.interests || []).length > 2 && (
                            <span className="text-[11px] text-gray-400">
                              +{it.interests.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-gray-400 hidden md:table-cell">
                        {formatDate(it.createdAt)}
                      </td>

                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => setSelected(it)}
                          className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <LogDetail log={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}