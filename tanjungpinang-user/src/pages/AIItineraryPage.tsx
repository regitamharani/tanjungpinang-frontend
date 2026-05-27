import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Plus, Minus, ChevronRight, ChevronLeft, Clock, MapPin,
  Wallet, Users, Calendar, Download, Bookmark, RotateCcw, Trash2,
  MessageCircle, LayoutGrid, Eye, ArrowLeft, CheckCircle2, Bus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { isLoggedIn, getUser } from "@/services/api";
import Footer from "@/components/layout/Footer";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type BudgetType = "hemat" | "menengah" | "premium";
type Period = "pagi" | "siang" | "sore" | "malam";
type AppView = "planner" | "result" | "history" | "detail";
type InputMode = "form" | "chat";

interface ItineraryItem {
  day: number;
  time: string;
  period: Period;
  destinationName: string;
  destinationId?: number;
  destinationSlug?: string;
  category: string;
  duration: string;
  estimatedCost: number;
  description: string;
  tips: string;
  mapsUrl: string;
}

interface Itinerary {
  id: string;
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

/* ─── AI Destination Pool ────────────────────────────────────────────────── */
interface AIDest {
  id: number;
  slug: string;
  name: string;
  interests: string[];
  location: string;
  baseCost: number;
  duration: string;
  bestPeriod: Period;
  description: string;
  tips: string;
  mapsUrl: string;
  aiRecommended: boolean;
  isPublished: boolean;
}

const AI_DESTINATIONS: AIDest[] = [
  { id: 1, slug: "masjid-raya-penyengat", name: "Masjid Raya Sultan Riau Penyengat", interests: ["Sejarah", "Budaya"], location: "Pulau Penyengat", baseCost: 8000, duration: "2-3 jam", bestPeriod: "pagi", description: "Masjid bersejarah abad 19 yang dibangun dengan campuran putih telur, ikon wisata Tanjung Pinang.", tips: "Naik pompong dari dermaga bawah kota, Rp 8.000/orang.", mapsUrl: "https://maps.google.com/?q=Masjid+Raya+Sultan+Riau+Penyengat", aiRecommended: true, isPublished: true },
  { id: 2, slug: "pantai-trikora", name: "Pantai Trikora", interests: ["Pantai", "Alam"], location: "Bintan Timur", baseCost: 25000, duration: "3-4 jam", bestPeriod: "pagi", description: "Pantai berpasir putih dengan air jernih dan pemandangan sunrise yang memukau.", tips: "Bawa sunscreen, tikar pantai, dan snorkel gear sendiri.", mapsUrl: "https://maps.google.com/?q=Pantai+Trikora+Bintan", aiRecommended: true, isPublished: true },
  { id: 3, slug: "gurun-pasir-busung", name: "Gurun Pasir Busung", interests: ["Alam"], location: "Bintan Timur", baseCost: 15000, duration: "2-3 jam", bestPeriod: "pagi", description: "Hamparan pasir putih luas bak gurun Sahara di tengah kepulauan tropis.", tips: "Datang pagi sebelum jam 10, terik sekali di siang hari.", mapsUrl: "https://maps.google.com/?q=Gurun+Pasir+Busung+Bintan", aiRecommended: true, isPublished: true },
  { id: 4, slug: "patung-seribu", name: "Kawasan Patung Seribu", interests: ["Budaya", "Sejarah"], location: "Tanjung Pinang", baseCost: 10000, duration: "1-2 jam", bestPeriod: "sore", description: "Kawasan unik penuh patung tradisional yang menceritakan sejarah dan legenda Melayu.", tips: "Bawa kamera karena banyak spot foto instagramable.", mapsUrl: "https://maps.google.com/?q=Patung+Seribu+Tanjung+Pinang", aiRecommended: true, isPublished: true },
  { id: 5, slug: "melayu-square", name: "Melayu Square", interests: ["Kuliner", "Budaya"], location: "Tanjung Pinang", baseCost: 40000, duration: "1-2 jam", bestPeriod: "malam", description: "Pusat kuliner dan belanja dengan nuansa budaya Melayu yang kental, ramai di malam hari.", tips: "Coba nasi dagang, laksam, dan kopi khas lokal.", mapsUrl: "https://maps.google.com/?q=Melayu+Square+Tanjung+Pinang", aiRecommended: true, isPublished: true },
  { id: 6, slug: "vihara-avalokitesvara", name: "Vihara Avalokitesvara Puri", interests: ["Budaya", "Sejarah"], location: "Tanjung Pinang", baseCost: 0, duration: "1-2 jam", bestPeriod: "pagi", description: "Vihara tertua dan terbesar di Tanjung Pinang dengan arsitektur Tiongkok yang megah.", tips: "Gratis masuk, hormati aturan berpakaian dan ketenangan.", mapsUrl: "https://maps.google.com/?q=Vihara+Avalokitesvara+Tanjung+Pinang", aiRecommended: true, isPublished: true },
  { id: 7, slug: "pantai-batu-hitam", name: "Pantai Batu Hitam", interests: ["Pantai", "Alam"], location: "Bintan Utara", baseCost: 15000, duration: "2-3 jam", bestPeriod: "sore", description: "Pantai unik dengan batuan granit hitam besar dan sunset yang luar biasa.", tips: "Bagus untuk foto sunset sekitar jam 17:30-18:00.", mapsUrl: "https://maps.google.com/?q=Pantai+Batu+Hitam+Bintan", aiRecommended: true, isPublished: true },
  { id: 8, slug: "bukit-kucing", name: "Bukit Kucing", interests: ["Alam"], location: "Tanjung Pinang", baseCost: 5000, duration: "1-2 jam", bestPeriod: "sore", description: "Spot terbaik untuk menikmati panorama kota Tanjung Pinang dari ketinggian.", tips: "Sewa ojek lokal untuk naik ke atas, lebih mudah dan murah.", mapsUrl: "https://maps.google.com/?q=Bukit+Kucing+Tanjung+Pinang", aiRecommended: true, isPublished: true },
  { id: 9, slug: "warung-gonggong", name: "Warung Gonggong Khas", interests: ["Kuliner"], location: "Tanjung Pinang Kota", baseCost: 35000, duration: "1 jam", bestPeriod: "siang", description: "Makan siang dengan gonggong (siput laut) segar khas Tanjung Pinang.", tips: "Minta saus kacang dan jeruk nipis untuk rasa terbaik.", mapsUrl: "https://maps.google.com/?q=Warung+Gonggong+Tanjung+Pinang", aiRecommended: true, isPublished: true },
  { id: 10, slug: "seafood-malam", name: "Restoran Seafood Pesisir", interests: ["Kuliner"], location: "Tepi Laut Tanjung Pinang", baseCost: 80000, duration: "1-2 jam", bestPeriod: "malam", description: "Makan malam seafood segar langsung di tepi laut dengan pemandangan lampu kota.", tips: "Pesan kepiting saus tiram dan udang bakar, sudah legendaris.", mapsUrl: "https://maps.google.com/?q=Seafood+Tanjung+Pinang", aiRecommended: true, isPublished: true },
  { id: 11, slug: "kedai-kopi-lokal", name: "Kedai Kopi Lokal Pagi", interests: ["Kuliner"], location: "Kota Tanjung Pinang", baseCost: 15000, duration: "45 menit", bestPeriod: "pagi", description: "Sarapan pagi dengan kopi khas kedai lokal Tanjung Pinang dan kue-kue tradisional.", tips: "Coba kopi susu panas dan roti bakar kaya.", mapsUrl: "https://maps.google.com/?q=Kedai+Kopi+Tanjung+Pinang", aiRecommended: true, isPublished: true },
];

/* ─── Itinerary Generator ────────────────────────────────────────────────── */
const BUDGET_MULTIPLIER: Record<BudgetType, number> = { hemat: 1, menengah: 2, premium: 3.5 };
const TRANSPORT: Record<BudgetType, string> = {
  hemat: "Angkutan kota (angkot) Rp 5.000/trip, ojek online, dan kapal pompong.",
  menengah: "Grab/Gojek, sewa motor harian Rp 80.000/hari, atau kapal pompong.",
  premium: "Sewa mobil pribadi Rp 350.000/hari, speedboat, dan tour guide lokal.",
};

function generateItinerary(params: { days: number; people: number; budgetType: BudgetType; interests: string[]; notes: string; userId: number }): Itinerary {
  const allInterests = params.interests.includes("Semua Kategori");
  const filtered = AI_DESTINATIONS.filter(d => d.isPublished && (allInterests || d.interests.some(i => params.interests.includes(i))));
  const pool = filtered.length >= 4 ? filtered : [...filtered, ...AI_DESTINATIONS.filter(d => d.isPublished)].slice(0, 8);
  const mul = BUDGET_MULTIPLIER[params.budgetType];

  const items: ItineraryItem[] = [];
  const used = new Set<number>();

  const pick = (pref: Period, fallback?: Period): AIDest => {
    const avail = pool.filter(d => !used.has(d.id) && (d.bestPeriod === pref || d.bestPeriod === fallback));
    const pick = avail.length ? avail[0] : pool.find(d => !used.has(d.id)) || pool[0];
    used.add(pick.id);
    return pick;
  };

  for (let day = 1; day <= params.days; day++) {
    used.clear();

    // Pagi: sarapan / kopi
    const breakfast = AI_DESTINATIONS.find(d => d.bestPeriod === "pagi" && d.interests.includes("Kuliner") && !used.has(d.id)) || AI_DESTINATIONS[10];
    used.add(breakfast.id);
    items.push({ day, time: "07:30", period: "pagi", destinationName: breakfast.name, destinationId: breakfast.id, destinationSlug: breakfast.slug, category: "Kuliner", duration: breakfast.duration, estimatedCost: Math.round(breakfast.baseCost * mul * params.people), description: breakfast.description, tips: breakfast.tips, mapsUrl: breakfast.mapsUrl });

    // Pagi lanjut: destinasi wisata
    const morning = pick("pagi");
    items.push({ day, time: "09:00", period: "pagi", destinationName: morning.name, destinationId: morning.id, destinationSlug: morning.slug, category: morning.interests[0], duration: morning.duration, estimatedCost: Math.round(morning.baseCost * mul * params.people), description: morning.description, tips: morning.tips, mapsUrl: morning.mapsUrl });

    // Siang: makan siang
    const lunch = AI_DESTINATIONS.find(d => d.bestPeriod === "siang" && !used.has(d.id)) || AI_DESTINATIONS[8];
    used.add(lunch.id);
    items.push({ day, time: "12:30", period: "siang", destinationName: lunch.name, destinationId: lunch.id, destinationSlug: lunch.slug, category: "Kuliner", duration: lunch.duration, estimatedCost: Math.round(lunch.baseCost * mul * params.people), description: lunch.description, tips: lunch.tips, mapsUrl: lunch.mapsUrl });

    // Sore: destinasi wisata
    const afternoon = pick("sore", "pagi");
    items.push({ day, time: "15:00", period: "sore", destinationName: afternoon.name, destinationId: afternoon.id, destinationSlug: afternoon.slug, category: afternoon.interests[0], duration: afternoon.duration, estimatedCost: Math.round(afternoon.baseCost * mul * params.people), description: afternoon.description, tips: afternoon.tips, mapsUrl: afternoon.mapsUrl });

    // Malam: makan malam
    const dinner = AI_DESTINATIONS.find(d => d.bestPeriod === "malam" && !used.has(d.id)) || AI_DESTINATIONS[9];
    items.push({ day, time: "19:00", period: "malam", destinationName: dinner.name, destinationId: dinner.id, destinationSlug: dinner.slug, category: "Kuliner", duration: dinner.duration, estimatedCost: Math.round(dinner.baseCost * mul * params.people), description: dinner.description, tips: dinner.tips, mapsUrl: dinner.mapsUrl });
  }

  const totalCost = items.reduce((sum, i) => sum + i.estimatedCost, 0);
  const hotel = params.budgetType === "hemat" ? 150000 : params.budgetType === "menengah" ? 400000 : 900000;
  const hotelTotal = hotel * params.people * params.days;

  return {
    id: `itn-${Date.now()}`,
    userId: params.userId,
    title: `Itinerary Tanjung Pinang ${params.days} Hari`,
    days: params.days,
    people: params.people,
    budgetType: params.budgetType,
    interests: params.interests,
    notes: params.notes,
    estimatedCostMin: totalCost + hotelTotal,
    estimatedCostMax: Math.round((totalCost + hotelTotal) * 1.2),
    transportRecommendation: TRANSPORT[params.budgetType],
    createdAt: new Date().toISOString(),
    items,
  };
}

function saveItinerary(itn: Itinerary) {
  const stored: Itinerary[] = JSON.parse(localStorage.getItem("ai_itineraries") || "[]");
  const exists = stored.findIndex(i => i.id === itn.id);
  if (exists >= 0) stored[exists] = itn;
  else stored.unshift(itn);
  localStorage.setItem("ai_itineraries", JSON.stringify(stored.slice(0, 20)));
}

function loadItineraries(): Itinerary[] {
  return JSON.parse(localStorage.getItem("ai_itineraries") || "[]");
}

function deleteItinerary(id: string) {
  const stored = loadItineraries().filter(i => i.id !== id);
  localStorage.setItem("ai_itineraries", JSON.stringify(stored));
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const PERIOD_LABEL: Record<Period, string> = { pagi: "Pagi", siang: "Siang", sore: "Sore", malam: "Malam" };
const PERIOD_COLOR: Record<Period, string> = { pagi: "bg-amber-50 text-amber-700 border-amber-200", siang: "bg-sky-50 text-sky-700 border-sky-200", sore: "bg-orange-50 text-orange-700 border-orange-200", malam: "bg-indigo-50 text-indigo-700 border-indigo-200" };
const BUDGET_LABEL: Record<BudgetType, string> = { hemat: "💰 Hemat", menengah: "💳 Menengah", premium: "💎 Premium" };

function formatRp(n: number) { return `Rp ${n.toLocaleString("id-ID")}`; }

/* ─── ItineraryResult Component ─────────────────────────────────────────── */
function ItineraryResult({ itn, onSave, onNew, onDetail }: { itn: Itinerary; onSave: () => void; onNew: () => void; onDetail: () => void }) {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({ title: "Membuka tampilan cetak…", description: "Gunakan Ctrl+P atau menu print browser Anda." });
    setTimeout(() => window.print(), 600);
  };

  const days = Array.from({ length: itn.days }, (_, i) => i + 1);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 print:space-y-4">
      {/* Result Header */}
      <div className="bg-gradient-to-r from-primary to-[#00C4E8] rounded-2xl p-6 md:p-8 text-white shadow-xl print:shadow-none">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold opacity-80">AI Generated</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">{itn.title}</h2>
            <p className="text-white/80 text-sm">Dibuat {new Date(itn.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button size="sm" variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30" onClick={onSave}>
              <Bookmark className="w-4 h-4 mr-1.5" /> Simpan
            </Button>
            <Button size="sm" variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-1.5" /> Unduh
            </Button>
            <Button size="sm" variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30" onClick={onNew}>
              <RotateCcw className="w-4 h-4 mr-1.5" /> Buat Baru
            </Button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <Calendar className="w-4 h-4" />, label: "Durasi", val: `${itn.days} Hari` },
            { icon: <Users className="w-4 h-4" />, label: "Peserta", val: `${itn.people} Orang` },
            { icon: <Wallet className="w-4 h-4" />, label: "Budget", val: BUDGET_LABEL[itn.budgetType] },
            { icon: <Sparkles className="w-4 h-4" />, label: "Minat", val: itn.interests.join(", ") },
          ].map((s, i) => (
            <div key={i} className="bg-white/15 rounded-xl px-3 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1">{s.icon} {s.label}</div>
              <div className="font-semibold text-sm">{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost + Transport */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><Wallet className="w-4 h-4 text-primary" /> Estimasi Total Biaya</h3>
          <div className="text-2xl font-black text-primary">{formatRp(itn.estimatedCostMin)}</div>
          <div className="text-sm text-muted-foreground">s/d {formatRp(itn.estimatedCostMax)}</div>
          <p className="text-xs text-muted-foreground mt-2">*Termasuk akomodasi & makan. Belum termasuk transport dari/ke kota asal.</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><Bus className="w-4 h-4 text-primary" /> Rekomendasi Transportasi</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{itn.transportRecommendation}</p>
        </div>
      </div>

      {/* Day Timeline */}
      {days.map(day => {
        const dayItems = itn.items.filter(i => i.day === day);
        return (
          <div key={day} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden print:break-inside-avoid">
            <div className="bg-primary/5 border-b border-border px-6 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm shrink-0">{day}</div>
              <div>
                <h3 className="font-bold text-foreground">Hari ke-{day}</h3>
                <p className="text-xs text-muted-foreground">{dayItems.length} aktivitas · Est. {formatRp(dayItems.reduce((s, i) => s + i.estimatedCost, 0))}</p>
              </div>
            </div>

            <div className="divide-y divide-border">
              {dayItems.map((item, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className="px-6 py-4 flex gap-4">
                  <div className="flex flex-col items-center shrink-0 w-14">
                    <span className="text-sm font-bold text-foreground">{item.time}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full border mt-1 font-medium ${PERIOD_COLOR[item.period]}`}>{PERIOD_LABEL[item.period]}</span>
                    {idx < dayItems.length - 1 && <div className="flex-1 w-px bg-border mt-2" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <h4 className="font-bold text-foreground text-sm leading-tight">{item.destinationName}</h4>
                      <span className="text-xs text-primary font-bold shrink-0">{formatRp(item.estimatedCost)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mb-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{item.category}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{item.duration}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{item.description}</p>
                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5 text-xs text-amber-700 mb-3">
                      💡 {item.tips}
                    </div>
                    <div className="flex flex-wrap gap-2 print:hidden">
                      {item.destinationSlug && (
                        <Link href={`/destination/${item.destinationSlug}`} className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Lihat Destinasi
                        </Link>
                      )}
                      <a href={item.mapsUrl} target="_blank" rel="noreferrer" className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground font-semibold hover:bg-muted/80 transition-colors flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Lihat di Maps
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap justify-center gap-4 pt-2 print:hidden">
        <Button onClick={onSave} className="gap-2 h-12 px-6">
          <Bookmark className="w-4 h-4" /> Simpan Itinerary
        </Button>
        <Button variant="outline" onClick={handleDownload} className="gap-2 h-12 px-6">
          <Download className="w-4 h-4" /> Unduh / Cetak
        </Button>
        <Button variant="ghost" onClick={onNew} className="gap-2 h-12 px-6">
          <RotateCcw className="w-4 h-4" /> Buat Baru
        </Button>
      </div>
    </motion.div>
  );
}

/* ─── PlannerForm Component ──────────────────────────────────────────────── */
const INTERESTS_LIST = ["Alam", "Budaya", "Sejarah", "Kuliner", "Pantai", "Semua Kategori"];
const BUDGET_OPTIONS: { key: BudgetType; label: string; desc: string }[] = [
  { key: "hemat", label: "💰 Hemat", desc: "< Rp 300K/hari" },
  { key: "menengah", label: "💳 Menengah", desc: "Rp 300K-700K/hari" },
  { key: "premium", label: "💎 Premium", desc: "> Rp 700K/hari" },
];

function PlannerForm({ onGenerate }: { onGenerate: (itn: Itinerary) => void }) {
  const user = getUser();
  const { toast } = useToast();
  const [days, setDays] = useState(2);
  const [people, setPeople] = useState(2);
  const [budget, setBudget] = useState<BudgetType>("menengah");
  const [interests, setInterests] = useState<string[]>(["Semua Kategori"]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleInterest = (i: string) => {
    if (i === "Semua Kategori") { setInterests(["Semua Kategori"]); return; }
    setInterests(prev => {
      const filtered = prev.filter(x => x !== "Semua Kategori");
      return filtered.includes(i) ? (filtered.filter(x => x !== i).length ? filtered.filter(x => x !== i) : ["Semua Kategori"]) : [...filtered, i];
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      const itn = generateItinerary({ days, people, budgetType: budget, interests, notes, userId: user?.id || 1 });
      setLoading(false);
      toast({ title: "Itinerary berhasil dibuat! 🎉", description: `${days} hari untuk ${people} orang telah disiapkan.` });
      onGenerate(itn);
    }, 1800);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      {/* Days */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Berapa hari?</h3>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5].map(d => (
            <button key={d} onClick={() => setDays(d)} className={`w-14 h-14 rounded-xl font-bold text-lg transition-all border-2 ${days === d ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "bg-muted/50 text-foreground border-transparent hover:border-primary/30"}`}>
              {d}
            </button>
          ))}
          <div className="flex items-center text-sm text-muted-foreground self-center ml-1">{days === 1 ? "Hari" : `Hari (${days} malam)`}</div>
        </div>
      </div>

      {/* People */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Berapa orang?</h3>
        <div className="flex items-center gap-4">
          <button onClick={() => setPeople(p => Math.max(1, p - 1))} className="w-11 h-11 rounded-xl bg-muted hover:bg-primary/10 text-foreground flex items-center justify-center transition-colors border border-border hover:border-primary">
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-3xl font-black text-foreground w-12 text-center">{people}</span>
          <button onClick={() => setPeople(p => Math.min(20, p + 1))} className="w-11 h-11 rounded-xl bg-muted hover:bg-primary/10 text-foreground flex items-center justify-center transition-colors border border-border hover:border-primary">
            <Plus className="w-4 h-4" />
          </button>
          <span className="text-sm text-muted-foreground">orang</span>
        </div>
      </div>

      {/* Budget */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Wallet className="w-4 h-4 text-primary" /> Budget perjalanan</h3>
        <div className="grid grid-cols-3 gap-3">
          {BUDGET_OPTIONS.map(opt => (
            <button key={opt.key} onClick={() => setBudget(opt.key)} className={`p-4 rounded-xl border-2 text-center transition-all ${budget === opt.key ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40"}`}>
              <div className="text-xl mb-1">{opt.label.split(" ")[0]}</div>
              <div className="font-bold text-sm text-foreground">{opt.label.split(" ")[1]}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Minat wisata</h3>
        <div className="flex flex-wrap gap-2">
          {INTERESTS_LIST.map(interest => (
            <button key={interest} onClick={() => toggleInterest(interest)} className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${interests.includes(interest) ? "bg-primary text-white border-primary shadow-sm" : "bg-muted/50 text-foreground border-transparent hover:border-primary/30"}`}>
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-primary" /> Catatan tambahan <span className="text-xs text-muted-foreground font-normal">(opsional)</span></h3>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Misal: ada anak kecil, vegetarian, tidak suka panas, dll..." rows={3} className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none text-sm" />
      </div>

      <Button onClick={handleSubmit} disabled={loading} className="w-full h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/20 gap-2">
        {loading ? (
          <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sedang merencanakan perjalanan…</>
        ) : (
          <><Sparkles className="w-5 h-5" /> Buat Itinerary Sekarang</>
        )}
      </Button>
    </motion.div>
  );
}

/* ─── ChatPlanner Component ──────────────────────────────────────────────── */
interface ChatMsg { role: "ai" | "user"; text: string; chips?: string[] }
const CHAT_FLOW = [
  { question: "Berapa hari kamu akan berada di Tanjung Pinang?", key: "days", chips: ["1 Hari", "2 Hari", "3 Hari", "4 Hari", "5 Hari"] },
  { question: "Mau fokus wisata apa?", key: "interests", chips: ["Alam", "Budaya", "Sejarah", "Kuliner", "Pantai", "Semua Kategori"] },
  { question: "Budget perjalanan kamu?", key: "budgetType", chips: ["💰 Hemat", "💳 Menengah", "💎 Premium"] },
  { question: "Pergi bersama siapa?", key: "people", chips: ["Sendiri", "Berdua", "Keluarga (4 org)", "Rombongan (8 org)"] },
];

function ChatPlanner({ onGenerate }: { onGenerate: (itn: Itinerary) => void }) {
  const user = getUser();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMsg[]>([{ role: "ai", text: "Halo! Aku AI Itinerary Planner Tanjung Pinang Guide. Aku akan bantu rencanakan liburanmu 🏝️", chips: undefined }, { role: "ai", text: CHAT_FLOW[0].question, chips: CHAT_FLOW[0].chips }]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" }); }, [messages]);

  const handleChip = (chip: string) => {
    if (done) return;
    const newAnswers = { ...answers, [CHAT_FLOW[step].key]: chip };
    setAnswers(newAnswers);
    setMessages(m => [...m, { role: "user", text: chip }, ...(step < CHAT_FLOW.length - 1 ? [{ role: "ai" as const, text: CHAT_FLOW[step + 1].question, chips: CHAT_FLOW[step + 1].chips }] : [{ role: "ai" as const, text: "Siap! Sedang membuat itinerary terbaik untukmu… ✨", chips: undefined }])]);
    if (step < CHAT_FLOW.length - 1) { setStep(step + 1); return; }
    setDone(true);
    const peopleCnt = { "Sendiri": 1, "Berdua": 2, "Keluarga (4 org)": 4, "Rombongan (8 org)": 8 }[chip] || 2;
    const daysCnt = parseInt(newAnswers.days?.split(" ")[0] || "2");
    const budgetMap: Record<string, BudgetType> = { "💰 Hemat": "hemat", "💳 Menengah": "menengah", "💎 Premium": "premium" };
    const btype = budgetMap[newAnswers.budgetType] || "menengah";
    const interest = newAnswers.interests || "Semua Kategori";
    setTimeout(() => {
      const itn = generateItinerary({ days: daysCnt, people: peopleCnt, budgetType: btype, interests: [interest], notes: "", userId: user?.id || 1 });
      toast({ title: "Itinerary siap! 🎉" });
      onGenerate(itn);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <div ref={ref} className="bg-white rounded-2xl border border-border shadow-sm overflow-y-auto max-h-[60vh] p-4 space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${msg.role === "ai" ? "space-y-3" : ""}`}>
              {msg.role === "ai" && <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2"><Sparkles className="w-4 h-4 text-primary" /></div>}
              <div className={`px-4 py-3 rounded-2xl text-sm font-medium ${msg.role === "ai" ? "bg-muted/50 text-foreground rounded-tl-none" : "bg-primary text-white rounded-tr-none"}`}>{msg.text}</div>
              {msg.chips && i === messages.length - 1 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.chips.map(chip => (
                    <button key={chip} onClick={() => handleChip(chip)} className="px-3 py-1.5 rounded-full border-2 border-primary/30 bg-white text-primary text-xs font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all">
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {done && <div className="flex justify-center"><div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}
      </div>
    </motion.div>
  );
}

/* ─── ItineraryHistory Component ─────────────────────────────────────────── */
function ItineraryHistory({ onView }: { onView: (itn: Itinerary) => void }) {
  const { toast } = useToast();
  const [list, setList] = useState<Itinerary[]>(loadItineraries);

  const handleDelete = (id: string) => {
    deleteItinerary(id);
    setList(loadItineraries());
    toast({ title: "Itinerary dihapus." });
  };

  const handleDownload = () => {
    toast({ title: "Membuka tampilan cetak…" });
    setTimeout(() => window.print(), 500);
  };

  if (list.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-border p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Belum ada itinerary tersimpan</h3>
          <p className="text-muted-foreground text-sm">Buat itinerary pertamamu dan simpan untuk diakses kapan saja.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-4">
      {list.map((itn, i) => (
        <motion.div key={itn.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-white rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="font-bold text-foreground">{itn.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{new Date(itn.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            </div>
            <button onClick={() => handleDelete(itn.id)} className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {[
              `${itn.days} Hari`,
              `${itn.people} Orang`,
              BUDGET_LABEL[itn.budgetType],
              itn.interests.join(", "),
            ].map((tag, j) => (
              <span key={j} className="px-2.5 py-1 bg-muted/60 rounded-full text-xs font-medium text-foreground">{tag}</span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground">Estimasi biaya</span>
              <div className="font-bold text-primary text-sm">{formatRp(itn.estimatedCostMin)} – {formatRp(itn.estimatedCostMax)}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleDownload} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Download className="w-4 h-4" />
              </button>
              <Button size="sm" onClick={() => onView(itn)} className="gap-1 rounded-xl h-9">
                <Eye className="w-3.5 h-3.5" /> Lihat
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─── Main AIItineraryPage ───────────────────────────────────────────────── */
export default function AIItineraryPage() {
  const [, setLocation] = useLocation();
  const authenticated = isLoggedIn();
  const user = getUser();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"buat" | "riwayat">("buat");
  const [inputMode, setInputMode] = useState<InputMode>("form");
  const [view, setView] = useState<AppView>("planner");
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);

  // Auth guard
  useEffect(() => {
    if (!authenticated) {
      toast({ title: "Login diperlukan", description: "Silakan login untuk menggunakan AI Itinerary.", variant: "destructive" });
      setLocation("/login");
    }
  }, [authenticated]);

  if (!authenticated) return null;

  const handleGenerate = (itn: Itinerary) => {
    setCurrentItinerary(itn);
    setView("result");
  };

  const handleSave = () => {
    if (!currentItinerary) return;
    saveItinerary(currentItinerary);
    toast({ title: "Itinerary tersimpan! ✅", description: "Kamu bisa menemukannya di tab Riwayat." });
  };

  const handleNewItinerary = () => {
    setCurrentItinerary(null);
    setView("planner");
    setActiveTab("buat");
    setInputMode("form");
  };

  const handleViewFromHistory = (itn: Itinerary) => {
    setCurrentItinerary(itn);
    setView("result");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0064B4] via-primary to-[#00C4E8] pt-10 pb-14">
        <div className="max-w-4xl mx-auto px-6">
          {view !== "planner" && (
            <button onClick={handleNewItinerary} className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Planner
            </button>
          )}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">AI Itinerary Planner</h1>
              <p className="text-white/75 text-sm">Rancang perjalananmu ke Tanjung Pinang secara otomatis.</p>
            </div>
          </div>

          {view === "planner" && (
            <div className="flex gap-1 mt-6 bg-white/15 backdrop-blur-md rounded-xl p-1 w-fit">
              {(["buat", "riwayat"] as const).map(tab => (
                <button key={tab} onClick={() => { setActiveTab(tab); setView("planner"); setCurrentItinerary(null); }} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${activeTab === tab ? "bg-white text-primary shadow-sm" : "text-white/80 hover:text-white"}`}>
                  {tab === "buat" ? "Buat Baru" : "Riwayat"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-6 pb-20">
        <AnimatePresence mode="wait">
          {view === "result" && currentItinerary ? (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ItineraryResult itn={currentItinerary} onSave={handleSave} onNew={handleNewItinerary} onDetail={() => {}} />
            </motion.div>
          ) : activeTab === "riwayat" ? (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-6">
              <ItineraryHistory onView={handleViewFromHistory} />
            </motion.div>
          ) : (
            <motion.div key="planner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-6">
              {/* Mode Toggle */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex gap-1 bg-white border border-border rounded-xl p-1 shadow-sm">
                  {([["form", LayoutGrid, "Form Planner"], ["chat", MessageCircle, "Chat AI"]] as const).map(([mode, Icon, label]) => (
                    <button key={mode} onClick={() => setInputMode(mode)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${inputMode === mode ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                      <Icon className="w-4 h-4" /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {inputMode === "form" ? (
                <PlannerForm onGenerate={handleGenerate} />
              ) : (
                <ChatPlanner onGenerate={handleGenerate} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
