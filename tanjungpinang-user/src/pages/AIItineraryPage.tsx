import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  Bus,
  Calendar,
  Clock,
  Download,
  Eye,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  deleteItineraryFromDatabase,
  generateItineraryFromDatabase,
  getUser,
  getUserItinerariesFromDatabase,
  isLoggedIn,
} from "@/services/api";
import Footer from "@/components/layout/Footer";

type BudgetType = "hemat" | "menengah" | "premium";
type Period = "pagi" | "siang" | "sore" | "malam";
type AppView = "planner" | "result";

interface User {
  id: number;
  nama?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface ItineraryItem {
  id?: number;
  day: number;
  time: string;
  period: Period;
  destinationName: string;
  destinationId?: number | null;
  destinationSlug?: string | null;
  category: string;
  duration: string;
  estimatedCost: number;
  description: string;
  tips: string;
  mapsUrl: string;
}

interface Itinerary {
  id: number | string;
  userId: number;
  title: string;
  days: number;
  people: number;
  budgetType: BudgetType;
  interests: string[];
  notes: string;
  estimatedCostMin: number;
  estimatedCostMax: number;
  transportRecommendation: string;
  createdAt: string;
  items: ItineraryItem[];
}

const PERIOD_LABEL: Record<Period, string> = {
  pagi: "Pagi",
  siang: "Siang",
  sore: "Sore",
  malam: "Malam",
};

const PERIOD_COLOR: Record<Period, string> = {
  pagi: "bg-amber-50 text-amber-700 border-amber-200",
  siang: "bg-sky-50 text-sky-700 border-sky-200",
  sore: "bg-orange-50 text-orange-700 border-orange-200",
  malam: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const BUDGET_LABEL: Record<BudgetType, string> = {
  hemat: "💰 Hemat",
  menengah: "💳 Menengah",
  premium: "💎 Premium",
};

const INTERESTS_LIST = [
  "Alam",
  "Budaya",
  "Sejarah",
  "Kuliner",
  "Pantai",
  "Semua Kategori",
];

const BUDGET_OPTIONS: { key: BudgetType; label: string; desc: string }[] = [
  { key: "hemat", label: "💰 Hemat", desc: "< Rp 300K/hari" },
  { key: "menengah", label: "💳 Menengah", desc: "Rp 300K-700K/hari" },
  { key: "premium", label: "💎 Premium", desc: "> Rp 700K/hari" },
];

function formatRp(n: number) {
  return `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
}

function getLoggedUser(): User | null {
  const user = getUser();

  if (!user || !user.id) return null;

  return user;
}

function ItineraryResult({
  itinerary,
  onNew,
}: {
  itinerary: Itinerary;
  onNew: () => void;
}) {
  const { toast } = useToast();

  const handlePrint = () => {
    toast({
      title: "Membuka tampilan cetak…",
      description:
        "Pilih Save as PDF. Jika masih ada tanggal/judul browser, matikan Headers and footers di pengaturan print.",
    });

    setTimeout(() => window.print(), 400);
  };

  const handleSavedInfo = () => {
    toast({
      title: "Itinerary sudah tersimpan ✅",
      description: "Data itinerary sudah masuk ke database.",
    });
  };

  const days = Array.from({ length: itinerary.days }, (_, index) => index + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 print:space-y-4 print:bg-white print:text-black"
    >
      <div className="hidden print:block border-b border-gray-300 pb-4 mb-4">
        <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500 mb-1">
          TanjungPinang Guide
        </p>

        <h1 className="text-2xl font-bold text-gray-900">
          {itinerary.title}
        </h1>

        <p className="text-sm text-gray-600 mt-1">
          Dibuat pada{" "}
          {new Date(itinerary.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-xl shadow-sky-100/60 overflow-hidden print:hidden">
        <div className="p-6 md:p-7">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
                <Sparkles className="w-4 h-4" />
                AI Generated
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
                {itinerary.title}
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Dibuat{" "}
                {new Date(itinerary.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSavedInfo}
                className="h-10 rounded-xl gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Tersimpan
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handlePrint}
                className="h-10 rounded-xl gap-2"
              >
                <Download className="w-4 h-4" />
                Unduh
              </Button>

              <Button
                size="sm"
                onClick={onNew}
                className="h-10 rounded-xl gap-2 bg-primary hover:bg-primary/90"
              >
                <RotateCcw className="w-4 h-4" />
                Buat Baru
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            {[
              {
                icon: <Calendar className="w-4 h-4" />,
                label: "Durasi",
                value: `${itinerary.days} Hari`,
              },
              {
                icon: <Users className="w-4 h-4" />,
                label: "Peserta",
                value: `${itinerary.people} Orang`,
              },
              {
                icon: <Wallet className="w-4 h-4" />,
                label: "Budget",
                value: BUDGET_LABEL[itinerary.budgetType],
              },
              {
                icon: <Sparkles className="w-4 h-4" />,
                label: "Minat",
                value: itinerary.interests.join(", "),
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-muted/30 px-4 py-3"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span className="text-primary">{item.icon}</span>
                  {item.label}
                </div>

                <p className="text-sm md:text-base font-bold text-foreground truncate">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden print:grid grid-cols-4 gap-2 mb-4">
        {[
          { label: "Durasi", value: `${itinerary.days} Hari` },
          { label: "Peserta", value: `${itinerary.people} Orang` },
          { label: "Budget", value: BUDGET_LABEL[itinerary.budgetType] },
          { label: "Minat", value: itinerary.interests.join(", ") },
        ].map((item, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-3 bg-gray-50"
          >
            <p className="text-[10px] uppercase tracking-wide text-gray-500">
              {item.label}
            </p>

            <p className="text-sm font-bold text-gray-900 mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm print:shadow-none print:border-gray-300 print:rounded-xl print:p-4 print:break-inside-avoid">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2 print:text-gray-900 print:text-sm">
            <Wallet className="w-4 h-4 text-primary" />
            Estimasi Total Biaya
          </h3>

          <div className="text-3xl font-black text-primary print:text-xl">
            {formatRp(itinerary.estimatedCostMin)}
          </div>

          <div className="text-sm text-muted-foreground print:text-gray-600">
            s/d {formatRp(itinerary.estimatedCostMax)}
          </div>

          <p className="text-xs text-muted-foreground mt-3 print:text-gray-500">
            *Termasuk akomodasi & makan. Belum termasuk transport dari/ke kota
            asal.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm print:shadow-none print:border-gray-300 print:rounded-xl print:p-4 print:break-inside-avoid">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2 print:text-gray-900 print:text-sm">
            <Bus className="w-4 h-4 text-primary" />
            Rekomendasi Transportasi
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed print:text-gray-600 print:text-xs">
            {itinerary.transportRecommendation}
          </p>
        </div>
      </div>

      {days.map((day) => {
        const dayItems = itinerary.items.filter((item) => item.day === day);

        return (
          <div
            key={day}
            className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden print:shadow-none print:border-gray-300 print:rounded-xl print:break-inside-avoid print:mb-4"
          >
            <div className="bg-primary/5 border-b border-border px-6 py-4 flex items-center gap-3 print:bg-gray-100 print:border-gray-300 print:px-4 print:py-3">
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm shrink-0 print:w-8 print:h-8 print:text-xs">
                {day}
              </div>

              <div>
                <h3 className="font-bold text-foreground print:text-gray-900 print:text-sm">
                  Hari ke-{day}
                </h3>

                <p className="text-xs text-muted-foreground print:text-gray-600">
                  {dayItems.length} aktivitas · Est.{" "}
                  {formatRp(
                    dayItems.reduce((sum, item) => sum + item.estimatedCost, 0)
                  )}
                </p>
              </div>
            </div>

            <div className="divide-y divide-border print:divide-gray-200">
              {dayItems.map((item, index) => (
                <div
                  key={`${day}-${item.time}-${index}`}
                  className="px-6 py-4 flex gap-4 print:px-4 print:py-3 print:gap-3 print:break-inside-avoid"
                >
                  <div className="flex flex-col items-center shrink-0 w-14 print:w-12">
                    <span className="text-sm font-bold text-foreground print:text-gray-900 print:text-xs">
                      {item.time}
                    </span>

                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full border mt-1 font-medium print:text-[10px] print:px-1.5 print:py-0.5 ${
                        PERIOD_COLOR[item.period]
                      }`}
                    >
                      {PERIOD_LABEL[item.period]}
                    </span>

                    {index < dayItems.length - 1 && (
                      <div className="flex-1 w-px bg-border mt-2 print:bg-gray-300" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <h4 className="font-bold text-foreground text-sm leading-tight print:text-gray-900 print:text-sm">
                        {item.destinationName}
                      </h4>

                      <span className="text-xs text-primary font-bold shrink-0 print:text-gray-700">
                        {formatRp(item.estimatedCost)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mb-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1 print:text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {item.category}
                      </span>

                      <span className="text-xs text-muted-foreground flex items-center gap-1 print:text-gray-600">
                        <Clock className="w-3 h-3" />
                        {item.duration}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-2 print:text-gray-600">
                      {item.description}
                    </p>

                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5 text-xs text-amber-700 mb-3 print:bg-gray-50 print:border-gray-300 print:text-gray-700 print:text-[11px] print:mb-2">
                      💡 {item.tips}
                    </div>

                    <div className="flex flex-wrap gap-2 print:hidden">
                      {item.destinationSlug && (
                        <Link
                          href={`/destination/${item.destinationSlug}`}
                          className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Lihat Destinasi
                        </Link>
                      )}

                      <a
                        href={item.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground font-semibold hover:bg-muted/80 transition-colors flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" />
                        Lihat di Maps
                      </a>
                    </div>

                    {item.mapsUrl && (
                      <div className="hidden print:block mt-2 text-[10px] text-gray-700 break-all leading-relaxed">
                        <strong>Google Maps:</strong>{" "}
                        <a href={item.mapsUrl}>{item.mapsUrl}</a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap justify-center gap-4 pt-2 print:hidden">
        <Button onClick={handleSavedInfo} className="gap-2 h-12 px-6">
          <Bookmark className="w-4 h-4" />
          Sudah Tersimpan
        </Button>

        <Button
          variant="outline"
          onClick={handlePrint}
          className="gap-2 h-12 px-6"
        >
          <Download className="w-4 h-4" />
          Unduh / Cetak
        </Button>

        <Button variant="ghost" onClick={onNew} className="gap-2 h-12 px-6">
          <RotateCcw className="w-4 h-4" />
          Buat Baru
        </Button>
      </div>
    </motion.div>
  );
}

function PlannerForm({
  onGenerate,
}: {
  onGenerate: (itinerary: Itinerary) => void;
}) {
  const { toast } = useToast();

  const [days, setDays] = useState(2);
  const [people, setPeople] = useState(2);
  const [budget, setBudget] = useState<BudgetType>("menengah");
  const [interests, setInterests] = useState<string[]>(["Semua Kategori"]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    if (interest === "Semua Kategori") {
      setInterests(["Semua Kategori"]);
      return;
    }

    setInterests((prev) => {
      const filtered = prev.filter((item) => item !== "Semua Kategori");

      if (filtered.includes(interest)) {
        const removed = filtered.filter((item) => item !== interest);
        return removed.length ? removed : ["Semua Kategori"];
      }

      return [...filtered, interest];
    });
  };

  const handleSubmit = async () => {
    const user = getLoggedUser();

    if (!user?.id) {
      toast({
        title: "User tidak ditemukan",
        description: "Silakan login ulang agar itinerary bisa disimpan.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const itinerary = await generateItineraryFromDatabase({
        userId: user.id,
        days,
        people,
        budgetType: budget,
        interests,
        notes,
      });

      toast({
        title: "Itinerary berhasil dibuat! 🎉",
        description: `${days} hari untuk ${people} orang berhasil disimpan ke database.`,
      });

      onGenerate(itinerary);
    } catch (error) {
      toast({
        title: "Gagal membuat itinerary",
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat membuat itinerary.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Berapa hari?
        </h3>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setDays(item)}
              className={`h-14 rounded-xl font-bold text-lg transition-all border-2 ${
                days === item
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                  : "bg-muted/50 text-foreground border-transparent hover:border-primary/30"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mt-3">
          {days === 1 ? "1 Hari" : `${days} Hari (${days - 1} malam)`}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Berapa orang?
        </h3>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setPeople((prev) => Math.max(1, prev - 1))}
            className="w-11 h-11 rounded-xl bg-muted hover:bg-primary/10 text-foreground flex items-center justify-center transition-colors border border-border hover:border-primary"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="text-3xl font-black text-foreground w-12 text-center">
            {people}
          </span>

          <button
            type="button"
            onClick={() => setPeople((prev) => Math.min(20, prev + 1))}
            className="w-11 h-11 rounded-xl bg-muted hover:bg-primary/10 text-foreground flex items-center justify-center transition-colors border border-border hover:border-primary"
          >
            <Plus className="w-4 h-4" />
          </button>

          <span className="text-sm text-muted-foreground">orang</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Wallet className="w-4 h-4 text-primary" />
          Budget perjalanan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BUDGET_OPTIONS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setBudget(item.key)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                budget === item.key
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className="text-xl mb-1">{item.label.split(" ")[0]}</div>
              <div className="font-bold text-sm text-foreground">
                {item.label.split(" ")[1]}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {item.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Minat wisata
        </h3>

        <div className="flex flex-wrap gap-2">
          {INTERESTS_LIST.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                interests.includes(interest)
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-muted/50 text-foreground border-transparent hover:border-primary/30"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Catatan tambahan{" "}
          <span className="text-xs text-muted-foreground font-normal">
            (opsional)
          </span>
        </h3>

        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Misal: ada anak kecil, vegetarian, tidak suka panas, dll..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none text-sm"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/20 gap-2"
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Sedang merencanakan perjalanan…
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Buat Itinerary Sekarang
          </>
        )}
      </Button>
    </motion.div>
  );
}

function ItineraryHistory({
  onView,
}: {
  onView: (itinerary: Itinerary) => void;
}) {
  const { toast } = useToast();

  const [list, setList] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    const user = getLoggedUser();

    if (!user?.id) {
      toast({
        title: "User tidak ditemukan",
        description: "Silakan login ulang.",
        variant: "destructive",
      });

      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getUserItinerariesFromDatabase(user.id);
      setList(data);
    } catch (error) {
      toast({
        title: "Gagal mengambil riwayat",
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil riwayat.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: number | string) => {
    const user = getLoggedUser();

    if (!user?.id) {
      toast({
        title: "User tidak ditemukan",
        description: "Silakan login ulang.",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteItineraryFromDatabase(id, user.id);

      setList((prev) => prev.filter((item) => item.id !== id));

      toast({
        title: "Itinerary dihapus.",
        description: "Data itinerary berhasil dihapus dari database.",
      });
    } catch (error) {
      toast({
        title: "Gagal menghapus itinerary",
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus itinerary.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-border p-10 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">
            Memuat riwayat itinerary...
          </p>
        </div>
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-2xl border border-border p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-muted-foreground opacity-50" />
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2">
            Belum ada itinerary tersimpan
          </h3>

          <p className="text-muted-foreground text-sm">
            Buat itinerary pertamamu dan simpan untuk diakses kapan saja.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-4"
    >
      {list.map((itinerary, index) => (
        <motion.div
          key={itinerary.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
          className="bg-white rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="font-bold text-foreground">{itinerary.title}</h3>

              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(itinerary.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleDelete(itinerary.id)}
              className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {[
              `${itinerary.days} Hari`,
              `${itinerary.people} Orang`,
              BUDGET_LABEL[itinerary.budgetType],
              itinerary.interests.join(", "),
            ].map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-2.5 py-1 bg-muted/60 rounded-full text-xs font-medium text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-muted-foreground">
                Estimasi biaya
              </span>

              <div className="font-bold text-primary text-sm">
                {formatRp(itinerary.estimatedCostMin)} –{" "}
                {formatRp(itinerary.estimatedCostMax)}
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => onView(itinerary)}
              className="gap-1 rounded-xl h-9 shrink-0"
            >
              <Eye className="w-3.5 h-3.5" />
              Lihat
            </Button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function AIItineraryPage() {
  const [, setLocation] = useLocation();
  const authenticated = isLoggedIn();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"buat" | "riwayat">("buat");
  const [view, setView] = useState<AppView>("planner");
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(
    null
  );

  useEffect(() => {
    if (!authenticated) {
      toast({
        title: "Login diperlukan",
        description: "Silakan login untuk menggunakan AI Itinerary.",
        variant: "destructive",
      });

      setLocation("/login");
      return;
    }

    const user = getLoggedUser();

    if (!user?.id) {
      toast({
        title: "Data user tidak valid",
        description: "Silakan login ulang.",
        variant: "destructive",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      setLocation("/login");
    }
  }, [authenticated, setLocation, toast]);

  if (!authenticated) return null;

  const handleGenerate = (itinerary: Itinerary) => {
    setCurrentItinerary(itinerary);
    setView("result");
  };

  const handleNewItinerary = () => {
    setCurrentItinerary(null);
    setView("planner");
    setActiveTab("buat");
  };

  const handleViewFromHistory = (itinerary: Itinerary) => {
    setCurrentItinerary(itinerary);
    setView("result");
  };

  return (
    <div className="min-h-screen bg-muted/20 print:bg-white">
      <div className="bg-gradient-to-br from-[#0064B4] via-primary to-[#00C4E8] pt-10 pb-14 print:hidden">
        <div className="max-w-4xl mx-auto px-6">
          {view !== "planner" && (
            <button
              type="button"
              onClick={handleNewItinerary}
              className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Planner
            </button>
          )}

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                AI Itinerary Planner
              </h1>

              <p className="text-white/75 text-sm">
                Rancang perjalananmu ke Tanjung Pinang secara otomatis.
              </p>
            </div>
          </div>

          {view === "planner" && (
            <div className="flex gap-1 mt-6 bg-white/15 backdrop-blur-md rounded-xl p-1 w-fit">
              {(["buat", "riwayat"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setView("planner");
                    setCurrentItinerary(null);
                  }}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    activeTab === tab
                      ? "bg-white text-primary shadow-sm"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {tab === "buat" ? "Buat Baru" : "Riwayat"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8 pb-20 print:mt-0 print:px-0 print:pb-0 print:max-w-none">
        <AnimatePresence mode="wait">
          {view === "result" && currentItinerary ? (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ItineraryResult
                itinerary={currentItinerary}
                onNew={handleNewItinerary}
              />
            </motion.div>
          ) : activeTab === "riwayat" ? (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-6"
            >
              <ItineraryHistory onView={handleViewFromHistory} />
            </motion.div>
          ) : (
            <motion.div
              key="planner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-6"
            >
              <PlannerForm onGenerate={handleGenerate} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}