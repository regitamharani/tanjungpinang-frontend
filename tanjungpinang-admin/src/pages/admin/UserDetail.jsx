import Badge from "@/components/admin/Badge";
import { ArrowLeft } from "lucide-react";

export default function UserDetail({ user: u, onBack, onToggleStatus }) {
  return (
    <div className="p-6 max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Detail Pengguna</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <img src={u.avatar} alt={u.name} className="w-14 h-14 rounded-full bg-gray-100" />
          <div>
            <p className="font-semibold text-gray-900">{u.name}</p>
            <p className="text-sm text-gray-500">{u.email}</p>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { label: "Tanggal Bergabung", value: u.registeredAt },
            { label: "Total Bookmark", value: u.totalBookmarks },
          ].map(({ label, value }) => (
            <div key={label} className="flex py-3">
              <span className="text-sm text-gray-400 w-40">{label}</span>
              <span className="text-sm text-gray-700">{value}</span>
            </div>
          ))}
          <div className="flex py-3">
            <span className="text-sm text-gray-400 w-40">Status Akun</span>
            <Badge status={u.status} />
          </div>
        </div>
      </div>

      <button
        onClick={onToggleStatus}
        className={`w-full py-2.5 text-sm rounded-md border transition-colors ${
          u.status === "active"
            ? "border-red-200 text-red-600 hover:bg-red-50"
            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        }`}
      >
        {u.status === "active" ? "Tangguhkan Akun" : "Aktifkan Akun"}
      </button>
    </div>
  );
}