import { useState, type ReactNode } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Star, MapPin, Eye, Plane, Home, Utensils, Ship, Anchor, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import { getTopReviews, getAverageRating, type Review } from "@/data/reviews";
import { isLoggedIn } from "@/services/api";

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

/* ── Dummy Data ───────────────────────────────────────────────────────────── */

const dummyDestinations: Destination[] = [
  { id: 1, slug: "masjid-raya-penyengat", name: "Masjid Raya Sultan Riau Penyengat", category: "Wisata Religi", location: "Pulau Penyengat", description: "Masjid bersejarah yang konon dibangun dengan campuran putih telur.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800", ratingAverage: 4.9, reviewCount: 2087, visitCount: 45200, isPublished: true },
  { id: 2, slug: "pantai-trikora", name: "Pantai Trikora", category: "Wisata Pantai", location: "Bintan Timur", description: "Pantai berpasir putih dengan air jernih dan pemandangan indah.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800", ratingAverage: 4.7, reviewCount: 3240, visitCount: 38900, isPublished: true },
  { id: 3, slug: "gurun-pasir-busung", name: "Gurun Pasir Busung", category: "Wisata Alam", location: "Bintan Timur", description: "Hamparan pasir putih luas seperti gurun sahara di tengah pulau.", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=800", ratingAverage: 4.6, reviewCount: 1897, visitCount: 28750, isPublished: true },
  { id: 4, slug: "patung-seribu", name: "Patung Seribu", category: "Wisata Budaya", location: "Tanjung Pinang", description: "Kawasan penuh patung tradisional yang menceritakan budaya Melayu.", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800", ratingAverage: 4.5, reviewCount: 1456, visitCount: 22300, isPublished: true },
  { id: 5, slug: "melayu-square", name: "Melayu Square", category: "Wisata Kuliner", location: "Tanjung Pinang", description: "Pusat kuliner dan belanja dengan nuansa budaya Melayu yang kental.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800", ratingAverage: 4.4, reviewCount: 893, visitCount: 19800, isPublished: true },
  { id: 6, slug: "vihara-avalokitesvara", name: "Vihara Avalokitesvara", category: "Wisata Religi", location: "Tanjung Pinang", description: "Vihara tertua dan terbesar di Tanjung Pinang dengan arsitektur Tiongkok.", image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800", ratingAverage: 4.8, reviewCount: 1780, visitCount: 31500, isPublished: true },
  { id: 7, slug: "pantai-batu-hitam", name: "Pantai Batu Hitam", category: "Wisata Pantai", location: "Bintan Utara", description: "Pantai unik dengan batuan granit hitam besar yang menjadi daya tarik utama.", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800", ratingAverage: 4.3, reviewCount: 654, visitCount: 16200, isPublished: true },
  { id: 8, slug: "bukit-kucing", name: "Bukit Kucing", category: "Wisata Alam", location: "Tanjung Pinang", description: "Spot terbaik untuk menikmati panorama kota Tanjung Pinang dari ketinggian.", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800", ratingAverage: 4.4, reviewCount: 892, visitCount: 17400, isPublished: true },
];

const dummyCategories: Category[] = [
  { id: "Wisata Alam", name: "Wisata Alam", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600", emoji: "🌿", count: 12, isActive: true },
  { id: "Wisata Pantai", name: "Wisata Pantai", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600", emoji: "🏖️", count: 8, isActive: true },
  { id: "Wisata Sejarah", name: "Wisata Sejarah", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600", emoji: "🏛️", count: 10, isActive: true },
  { id: "Wisata Kuliner", name: "Wisata Kuliner", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600", emoji: "🍽️", count: 15, isActive: true },
  { id: "Wisata Budaya", name: "Wisata Budaya", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600", emoji: "🎭", count: 6, isActive: true },
];

const dummyHighlights: HomepageHighlight[] = [
  {
    id: 1,
    title: "Jelajahi Sejarah Budaya Melayu",
    subtitle: "Temukan peninggalan bersejarah dan rasakan kentalnya budaya Melayu di setiap sudut kota Tanjung Pinang. Dari masjid yang dibangun dengan putih telur hingga istana kerajaan yang megah.",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop",
    buttonText: "Baca Selengkapnya",
    buttonLink: "/destination/masjid-raya-penyengat",
    badge: "Pilihan Editor",
    isActive: true,
  },
  {
    id: 2,
    title: "Surga Tersembunyi: Gurun Pasir Busung",
    subtitle: "Rasakan sensasi berjalan di hamparan pasir putih yang luas bak gurun Sahara di tengah kepulauan Riau yang tropis. Pengalaman yang tak terlupakan menanti Anda.",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2000",
    buttonText: "Lihat Destinasi",
    buttonLink: "/destination/gurun-pasir-busung",
    badge: "Rekomendasi",
    isActive: false,
  },
];

/* ── Computed Data ────────────────────────────────────────────────────────── */

const publishedDestinations = dummyDestinations.filter(d => d.isPublished);

const destinasiUnggulan = [...publishedDestinations]
  .sort((a, b) => b.ratingAverage - a.ratingAverage || b.reviewCount - a.reviewCount || b.visitCount - a.visitCount)
  .slice(0, 4);

const destinasiPopuler = [...publishedDestinations]
  .sort((a, b) => b.visitCount - a.visitCount)
  .slice(0, 4);

const activeCategories = dummyCategories.filter(c => c.isActive);
const activeHighlight = dummyHighlights.find(h => h.isActive);

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

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "xs" }) {
  const sz = size === "xs" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${sz} ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const date = new Date(review.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
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
        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${avatarColor(index)}`}>
          {review.userAvatar}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-foreground text-sm leading-tight">{review.userName}</p>
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

function TestimoniSection() {
  const reviews = getTopReviews(6);
  const avg = getAverageRating(reviews);
  const totalApproved = reviews.length;
  const [page, setPage] = useState(0);

  const COLS = 3;
  const totalPages = Math.ceil(reviews.length / COLS);
  const visible = reviews.slice(page * COLS, page * COLS + COLS);

  const ratingLabel = avg >= 4.8 ? "Excellent" : avg >= 4.5 ? "Very Good" : avg >= 4 ? "Good" : "Fair";

  if (reviews.length === 0) {
    return (
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Ulasan</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Apa Kata Pengunjung?</h2>
          <div className="mt-10 py-16 bg-white rounded-2xl border border-border">
            <p className="text-muted-foreground">Belum ada ulasan pengunjung.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Ulasan Pengunjung</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Apa Kata Pengunjung?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Ulasan asli dari wisatawan yang sudah mengunjungi destinasi di Tanjung Pinang.
          </p>
        </div>

        {/* Rating Summary Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-6 bg-white border border-border rounded-2xl shadow-sm px-8 py-6 max-w-lg mx-auto"
        >
          <div className="flex flex-col items-center sm:items-start sm:border-r sm:border-border sm:pr-6">
            <span className="text-4xl font-black text-foreground">{avg.toFixed(1)}</span>
            <StarRow rating={avg} />
            <span className="text-xs text-muted-foreground mt-1 font-medium">{totalApproved} Ulasan</span>
          </div>
          <div className="text-center sm:text-left">
            <span className="text-2xl font-extrabold text-primary">{ratingLabel}</span>
            <p className="text-xs text-muted-foreground mt-1 leading-tight">
              Sumber: Pengunjung<br className="hidden sm:block" /> Tanjung Pinang Guide
            </p>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(totalPages <= 1 ? reviews : visible).map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>

        {/* Pagination dots (only if more than 3 reviews on desktop) */}
        {totalPages > 1 && (
          <div className="mt-8 hidden lg:flex items-center justify-center gap-3">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === page ? "bg-primary w-4" : "bg-border hover:bg-primary/40"}`}
              />
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <Button variant="outline" asChild className="rounded-full px-8 h-11 font-semibold border-primary/30 text-primary hover:bg-primary/5 hover:border-primary">
            <Link href="/destination">
              Lihat Semua Ulasan <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ── Icon renderer for TravelGuide ───────────────────────────────────────── */
function GuideIcon({ icon, color }: { icon: string; color: string }) {
  const cls = `w-6 h-6`;
  const map: Record<string, ReactNode> = {
    plane: <Plane className={cls} />,
    home: <Home className={cls} />,
    utensils: <Utensils className={cls} />,
    ship: <Ship className={cls} />,
    anchor: <Anchor className={cls} />,
  };
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-500", border: "border-l-blue-500" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-500", border: "border-l-emerald-500" },
    orange: { bg: "bg-orange-50", text: "text-orange-500", border: "border-l-orange-500" },
    cyan: { bg: "bg-cyan-50", text: "text-cyan-500", border: "border-l-cyan-500" },
  };
  const c = colorMap[color] || colorMap.blue;
  return { icon: map[icon] || <Plane className={cls} />, ...c };
}

/* ── Destination Card ─────────────────────────────────────────────────────── */
function DestinationCard({
  destination, index, badge, rankNumber, bgTint,
}: {
  destination: Destination; index: number; badge?: string; rankNumber?: string; bgTint?: string;
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
        className={`block h-full ${bgTint || "bg-white"} rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative`}
        data-testid={`card-destination-${destination.id}`}
      >
        {rankNumber && (
          <div className="absolute -top-3 -left-3 z-20 text-6xl font-black text-primary/15 pointer-events-none select-none leading-none">
            {rankNumber}
          </div>
        )}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          {badge && (
            <div className={`absolute top-3 right-3 px-2.5 py-1 backdrop-blur-md text-xs font-bold rounded-full shadow-sm z-10 ${badge.includes("Unggulan") ? "bg-amber-400/90 text-amber-950" : "bg-primary/90 text-white"}`}>
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
              <span className="font-bold text-sm">{destination.ratingAverage}</span>
              <span className="text-muted-foreground text-xs">({destination.reviewCount.toLocaleString("id-ID")})</span>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="w-3 h-3" /> {(destination.visitCount / 1000).toFixed(0)}K
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
  const authenticated = isLoggedIn();

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ── */}
      <section className="relative h-[88vh] min-h-[620px] flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#003060]/60 via-[#005A9E]/40 to-[#00090F]/80 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=2574&auto=format&fit=crop')" }}
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
            Temukan Pesona<br />
            <span className="text-[#5DD8FF]">Tanjung Pinang</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
            className="text-lg md:text-xl font-medium text-white/85 max-w-2xl mx-auto mb-10"
          >
            Jelajahi keindahan alam, kekayaan sejarah, dan kelezatan kuliner di kota gurindam negeri pantun.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="h-14 px-8 text-base font-bold shadow-xl bg-white text-primary hover:bg-white/90 rounded-full" asChild data-testid="button-jelajahi">
              <Link href="/destination">Jelajahi Sekarang</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white backdrop-blur-sm rounded-full" asChild data-testid="button-lihat-semua">
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
              { val: "50+", label: "Destinasi" },
              { val: "4.8★", label: "Rating Rata-rata" },
              { val: "10K+", label: "Pengunjung" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold">{stat.val}</span>
                <span className="text-xs md:text-sm font-medium mt-1 text-white/70">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Kategori Wisata ── */}
      <section id="kategori" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Jelajahi Tanjung Pinang</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Eksplorasi Berdasarkan Kategori</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Pilih jenis liburan yang Anda inginkan dan temukan destinasi terbaik.</p>
          </div>

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
                  href={`/destination?kategori=${encodeURIComponent(cat.id)}`}
                  className="block relative rounded-2xl overflow-hidden group aspect-[3/4] shadow-sm hover:-translate-y-1.5 transition-all duration-300"
                  data-testid={`card-category-${cat.id}`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col items-center text-center">
                    <span className="text-xl mb-1">{cat.emoji}</span>
                    <h3 className="font-bold text-white text-sm leading-tight mb-0.5">{cat.name}</h3>
                    <span className="text-xs text-white/65">{cat.count} Tempat</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Destinasi Unggulan ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">Terpopuler</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Destinasi Unggulan</h2>
              <p className="text-muted-foreground">Tempat wisata dengan rating tertinggi dari pengunjung.</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex group text-primary hover:text-primary" asChild>
              <Link href="/destination">
                Lihat Semua <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinasiUnggulan.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} index={i} badge="⭐ Unggulan" />
            ))}
          </div>

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
                src={activeHighlight.image}
                alt={activeHighlight.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
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
                <Button size="lg" className="w-max bg-white text-primary hover:bg-white/90 font-bold shadow-xl" asChild data-testid="button-highlight-cta">
                  <Link href={activeHighlight.buttonLink}>{activeHighlight.buttonText} →</Link>
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
              <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">Trending</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Paling Banyak Dikunjungi</h2>
              <p className="text-muted-foreground">Destinasi favorit wisatawan berdasarkan jumlah kunjungan.</p>
            </div>
          </div>

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
        </div>
      </section>

      {/* ── Testimoni / Apa Kata Pengunjung ── */}
      <TestimoniSection />

      {/* ── CTA ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0064B4] via-primary to-[#00C4E8] z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200')] bg-cover bg-center opacity-10 mix-blend-overlay z-0" />

        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              Siap Menjelajahi<br />Tanjung Pinang?
            </h2>
            <p className="text-lg md:text-xl text-white/85 mb-3 max-w-2xl mx-auto font-medium">
              Temukan destinasi terbaik, kuliner lokal, dan panduan liburan dalam satu platform.
            </p>
            <p className="text-white/60 text-sm mb-10">Bergabung dengan 10.000+ wisatawan yang telah mempercayai kami.</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="h-14 px-10 text-base font-bold rounded-full shadow-2xl bg-white text-primary hover:bg-white/95 transition-all hover:-translate-y-0.5"
                asChild
                data-testid="button-cta-eksplorasi"
              >
                <Link href="/destination">Mulai Eksplorasi →</Link>
              </Button>
              {!authenticated && (
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 text-base font-semibold rounded-full bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
                  asChild
                  data-testid="button-cta-register"
                >
                  <Link href="/register">Daftar Gratis</Link>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
