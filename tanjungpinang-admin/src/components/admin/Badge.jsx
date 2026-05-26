import { cn } from "@/lib/utils";

const variants = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  hidden: "bg-gray-50 text-gray-500 border-gray-200",
  suspended: "bg-red-50 text-red-600 border-red-200",
  inactive: "bg-amber-50 text-amber-600 border-amber-200",
  main: "bg-blue-50 text-blue-600 border-blue-200",
  gallery: "bg-purple-50 text-purple-600 border-purple-200",
};

const labels = {
  active: "Aktif",
  hidden: "Disembunyikan",
  suspended: "Ditangguhkan",
  inactive: "Nonaktif",
  main: "Gambar Utama",
  gallery: "Galeri",
};

export default function Badge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs border font-medium",
        variants[status] || variants.hidden
      )}
    >
      {labels[status] || status}
    </span>
  );
}