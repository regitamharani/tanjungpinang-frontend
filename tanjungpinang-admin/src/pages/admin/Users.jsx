import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Search, ChevronLeft, Bookmark } from "lucide-react";

const statusStyles = { active: "bg-emerald-50 text-emerald-700 border-emerald-200", suspended: "bg-red-50 text-red-600 border-red-200" };
const statusLabels = { active: "Aktif", suspended: "Ditangguhkan" };

function UserDetail({ user, onBack, onToggleStatus }) {
  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <h1 className="text-base font-bold text-gray-900">Detail Pengguna</h1>
      </div>

      <div className="px-6 md:px-8 py-6 max-w-xl">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-100" />
            <div>
              <p className="text-base font-bold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2.5 border-b border-gray-50">
              <span className="text-gray-500">Status Akun</span>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[user.status]}`}>
                {statusLabels[user.status]}
              </span>
            </div>
            <div className="flex justify-between py-2.5 border-b border-gray-50">
              <span className="text-gray-500">Terdaftar</span>
              <span className="text-gray-700 font-medium">{user.registeredAt}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-gray-500 flex items-center gap-1.5"><Bookmark size={13} />Total Bookmark</span>
              <span className="text-gray-700 font-bold">{user.totalBookmarks}</span>
            </div>
          </div>

          <button onClick={onToggleStatus}
            className={`mt-6 w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
              user.status === "active"
                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            }`}>
            {user.status === "active" ? "Tangguhkan Akun" : "Aktifkan Akun"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const { users, updateUser } = useAppStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (filterStatus === "all" || u.status === filterStatus)
    );
  });

  const toggleStatus = (user) => {
    const updated = { ...user, status: user.status === "active" ? "suspended" : "active" };
    updateUser(user.id, updated);
    if (selected?.id === user.id) setSelected(updated);
  };

  if (selected) {
    const fresh = users.find(u => u.id === selected.id) || selected;
    return <UserDetail user={fresh} onBack={() => setSelected(null)} onToggleStatus={() => toggleStatus(fresh)} />;
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5">
        <h1 className="text-base font-bold text-gray-900">Pengguna</h1>
        <p className="text-sm text-gray-500 mt-0.5">{users.length} pengguna terdaftar</p>
      </div>

      <div className="px-6 md:px-8 py-5">
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau email..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200">
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="suspended">Ditangguhkan</option>
          </select>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Pengguna</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Bergabung</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">Bookmark</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="py-16 text-center text-sm text-gray-400">Tidak ada pengguna ditemukan</td></tr>
                ) : filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover bg-gray-100 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{u.name}</p>
                          <p className="text-xs text-gray-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500 hidden md:table-cell">{u.registeredAt}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[u.status]}`}>
                        {statusLabels[u.status]}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600 hidden sm:table-cell tabular-nums">{u.totalBookmarks}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => setSelected(u)} className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">Detail</button>
                        <button onClick={() => toggleStatus(u)}
                          className={`px-2.5 py-1 text-xs rounded-lg border transition-colors hidden sm:block ${
                            u.status === "active" ? "border-red-200 text-red-500 hover:bg-red-50" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          }`}>
                          {u.status === "active" ? "Tangguhkan" : "Aktifkan"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}