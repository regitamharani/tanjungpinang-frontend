import { useCallback, useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  Navigation,
  MessageSquare,
  Zap,
  Trash2,
  RefreshCw,
} from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

const API_URL = "http://localhost:3000/api";

const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  suspended: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_LABELS = {
  active: "Aktif",
  suspended: "Ditangguhkan",
};

const ROLE_STYLES = {
  admin: "bg-violet-50 text-violet-700 border-violet-200",
  user: "bg-gray-100 text-gray-500 border-gray-200",
};

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

const getUserId = (user) => {
  return user?.id || user?.userId || user?.user_id || null;
};

const getUserName = (user) => {
  return user?.name || user?.nama || "Pengguna";
};

const getUserAvatar = (user) => {
  return (
    user?.avatar ||
    user?.avatar_url ||
    user?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      getUserName(user)
    )}&background=e0e7ff&color=4f46e5`
  );
};

const getTotalVisits = (user) => {
  return Number(
    user?.totalVisits ??
      user?.total_visits ??
      user?.viewedCount ??
      user?.viewed_count ??
      user?.visitsCount ??
      user?.visits_count ??
      0
  );
};

const getTotalReviews = (user) => {
  return Number(
    user?.totalReviews ??
      user?.total_reviews ??
      user?.reviewCount ??
      user?.review_count ??
      user?.reviewsCount ??
      user?.reviews_count ??
      0
  );
};

const getTotalItineraries = (user) => {
  return Number(
    user?.totalItineraries ??
      user?.total_itineraries ??
      user?.itineraryCount ??
      user?.itinerary_count ??
      user?.itinerariesCount ??
      user?.itineraries_count ??
      0
  );
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function UserDetail({ user, onBack, onToggleStatus, onDelete }) {
  const userName = getUserName(user);
  const avatar = getUserAvatar(user);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <h1 className="text-base font-bold text-gray-900">
          Detail Pengguna
        </h1>
      </div>

      <div className="px-6 md:px-8 py-6 max-w-xl">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={avatar}
              alt={userName}
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 bg-gray-100"
            />

            <div>
              <p className="text-base font-bold text-gray-900">
                {userName}
              </p>

              <p className="text-sm text-gray-500">
                {user.email || "-"}
              </p>

              <div className="flex gap-2 mt-1">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
                    STATUS_STYLES[user.status] || STATUS_STYLES.active
                  }`}
                >
                  {STATUS_LABELS[user.status] || "Aktif"}
                </span>

                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
                    ROLE_STYLES[user.role] || ROLE_STYLES.user
                  }`}
                >
                  {user.role || "user"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-indigo-50 rounded-xl p-3 text-center">
              <Navigation
                size={16}
                className="text-indigo-500 mx-auto mb-1"
              />
              <p className="text-lg font-bold text-indigo-600">
                {getTotalVisits(user)}
              </p>
              <p className="text-xs text-gray-400">Kunjungan</p>
            </div>

            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <MessageSquare
                size={16}
                className="text-amber-500 mx-auto mb-1"
              />
              <p className="text-lg font-bold text-amber-600">
                {getTotalReviews(user)}
              </p>
              <p className="text-xs text-gray-400">Ulasan</p>
            </div>

            <div className="bg-rose-50 rounded-xl p-3 text-center">
              <Zap size={16} className="text-rose-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-rose-600">
                {getTotalItineraries(user)}
              </p>
              <p className="text-xs text-gray-400">Itinerary</p>
            </div>
          </div>

          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Terdaftar</span>
              <span className="text-gray-700 font-medium">
                {formatDate(
                  user.registeredAt ||
                    user.registered_at ||
                    user.createdAt ||
                    user.created_at
                )}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">No. Telepon</span>
              <span className="text-gray-700 font-medium">
                {user.telepon || user.phone || user.no_telepon || "-"}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-gray-500">Role</span>
              <span className="text-gray-700 font-medium capitalize">
                {user.role || "user"}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onToggleStatus}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                user.status === "active"
                  ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              {user.status === "active"
                ? "Tangguhkan Akun"
                : "Aktifkan Akun"}
            </button>

            <button
              onClick={onDelete}
              className="px-4 py-2.5 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 flex items-center gap-1.5"
            >
              <Trash2 size={13} /> Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const fetchUserStats = useCallback(async (user) => {
    const userId = getUserId(user);

    if (!userId) {
      return user;
    }

    try {
      const res = await apiRequest(
        `/profile/${encodeURIComponent(userId)}/stats`
      );

      const json = await res.json();

      if (!res.ok || !json.success) {
        return user;
      }

      const stats = json.data || {};

      return {
        ...user,

        totalVisits: Number(
          stats.totalVisits ??
            stats.total_visits ??
            stats.viewedCount ??
            stats.viewed_count ??
            user.totalVisits ??
            user.total_visits ??
            0
        ),

        totalReviews: Number(
          stats.totalReviews ??
            stats.total_reviews ??
            stats.reviewCount ??
            stats.review_count ??
            user.totalReviews ??
            user.total_reviews ??
            0
        ),

        totalItineraries: Number(
          stats.totalItineraries ??
            stats.total_itineraries ??
            stats.itineraryCount ??
            stats.itinerary_count ??
            stats.itinerariesCount ??
            stats.itineraries_count ??
            user.totalItineraries ??
            user.total_itineraries ??
            0
        ),

        viewedCount: Number(
          stats.viewedCount ??
            stats.viewed_count ??
            stats.totalVisits ??
            stats.total_visits ??
            user.viewedCount ??
            user.viewed_count ??
            0
        ),

        reviewCount: Number(
          stats.reviewCount ??
            stats.review_count ??
            stats.totalReviews ??
            stats.total_reviews ??
            user.reviewCount ??
            user.review_count ??
            0
        ),
      };
    } catch (error) {
      return user;
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setErrorText("");

    try {
      const res = await apiRequest("/users");
      const json = await res.json();

      if (!res.ok || !json.success) {
        setUsers([]);
        setErrorText(json.message || "Gagal mengambil data pengguna");
        return;
      }

      const rawUsers = Array.isArray(json.data) ? json.data : [];

      const usersWithStats = await Promise.all(
        rawUsers.map((user) => fetchUserStats(user))
      );

      setUsers(usersWithStats);
    } catch (error) {
      setUsers([]);
      setErrorText(
        "Tidak bisa terhubung ke server. Pastikan backend Express sudah berjalan."
      );
    } finally {
      setLoading(false);
    }
  }, [fetchUserStats]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();

    const name = getUserName(u).toLowerCase();
    const email = (u.email || "").toLowerCase();

    return (
      (name.includes(q) || email.includes(q)) &&
      (filterStatus === "all" || u.status === filterStatus)
    );
  });

  const toggleStatus = async (user) => {
    const userId = getUserId(user);
    const newStatus = user.status === "active" ? "suspended" : "active";

    if (!userId) {
      alert("ID pengguna tidak ditemukan.");
      return;
    }

    try {
      const res = await apiRequest(`/users/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.message || "Gagal mengubah status pengguna");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          getUserId(u) === userId
            ? {
                ...u,
                status: newStatus,
              }
            : u
        )
      );

      if (selected && getUserId(selected) === userId) {
        setSelected({
          ...selected,
          status: newStatus,
        });
      }
    } catch (error) {
      alert("Tidak bisa terhubung ke server.");
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;

    try {
      const res = await apiRequest(`/users/${deleteTarget}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.message || "Gagal menghapus pengguna");
        return;
      }

      setUsers((prev) => prev.filter((u) => getUserId(u) !== deleteTarget));
      setDeleteTarget(null);
      setSelected(null);
    } catch (error) {
      alert("Tidak bisa terhubung ke server.");
    }
  };

  if (selected) {
    const selectedId = getUserId(selected);
    const fresh =
      users.find((u) => getUserId(u) === selectedId) || selected;

    return (
      <>
        <UserDetail
          user={fresh}
          onBack={() => setSelected(null)}
          onToggleStatus={() => toggleStatus(fresh)}
          onDelete={() => setDeleteTarget(getUserId(fresh))}
        />

        <ConfirmModal
          open={!!deleteTarget}
          title="Hapus Pengguna"
          description="Pengguna ini akan dihapus secara permanen beserta semua datanya."
          onConfirm={handleDeleteUser}
          onCancel={() => setDeleteTarget(null)}
        />
      </>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">
            Kelola Pengguna
          </h1>

          <p className="text-sm text-gray-500 mt-0.5">
            {users.length} pengguna ·{" "}
            {users.filter((u) => u.status === "active").length} aktif
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="px-6 md:px-8 py-5">
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau email..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="suspended">Ditangguhkan</option>
          </select>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-10 text-center text-sm text-gray-400">
            Memuat data pengguna...
          </div>
        ) : errorText ? (
          <div className="bg-white border border-red-100 rounded-xl shadow-sm p-10 text-center text-sm text-red-500">
            {errorText}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Pengguna
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                      Role
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
                      Kunjungan
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
                      Ulasan
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
                      Itinerary
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Status
                    </th>

                    <th className="px-6 py-3" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-16 text-center text-sm text-gray-400"
                      >
                        Tidak ada pengguna ditemukan
                      </td>
                    </tr>
                  ) : (
                    filtered.map((u) => {
                      const userId = getUserId(u);
                      const userName = getUserName(u);
                      const avatar = getUserAvatar(u);

                      return (
                        <tr
                          key={userId}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={avatar}
                                alt={userName}
                                className="w-8 h-8 rounded-full object-cover bg-gray-100 shrink-0"
                              />

                              <div className="min-w-0">
                                <p className="font-semibold text-gray-800 truncate">
                                  {userName}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                  {u.email || "-"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-3.5 hidden md:table-cell">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
                                ROLE_STYLES[u.role] || ROLE_STYLES.user
                              }`}
                            >
                              {u.role || "user"}
                            </span>
                          </td>

                          <td className="px-6 py-3.5 text-gray-600 hidden lg:table-cell tabular-nums">
                            {getTotalVisits(u)}
                          </td>

                          <td className="px-6 py-3.5 text-gray-600 hidden lg:table-cell tabular-nums">
                            {getTotalReviews(u)}
                          </td>

                          <td className="px-6 py-3.5 text-gray-600 hidden lg:table-cell tabular-nums">
                            {getTotalItineraries(u)}
                          </td>

                          <td className="px-6 py-3.5">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
                                STATUS_STYLES[u.status] ||
                                STATUS_STYLES.active
                              }`}
                            >
                              {STATUS_LABELS[u.status] || "Aktif"}
                            </span>
                          </td>

                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-1 justify-end">
                              <button
                                onClick={() => setSelected(u)}
                                className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                              >
                                Detail
                              </button>

                              <button
                                onClick={() => toggleStatus(u)}
                                className={`px-2.5 py-1 text-xs rounded-lg border transition-colors hidden sm:block ${
                                  u.status === "active"
                                    ? "border-red-200 text-red-500 hover:bg-red-50"
                                    : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                }`}
                              >
                                {u.status === "active"
                                  ? "Tangguhkan"
                                  : "Aktifkan"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus Pengguna"
        description="Pengguna ini akan dihapus secara permanen beserta semua datanya."
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}