import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Ticket,
  Check,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Eye,
  Globe,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/layout/Footer";
import { isLoggedIn, getUser } from "@/services/api";

interface Destination {
  id: number;
  slug: string;
  name: string;
  categoryId: number;
  category: string;
  location: string;
  shortDescription: string;
  fullDescription: string;
  mainImage: string;
  galleryImages: string[];
  facilities: string[];
  openingHours: string;
  ticketPrice: string;
  mapsUrl: string;
  googlePlaceId: string;
  googleRating: number;
  googleReviewCount: number;
  googleMapsUrl: string;
  ratingAverage: number;
  reviewCount: number;
  visitCount: number;
  tips: string[];
  isPublished: boolean;
}

interface Review {
  id: number;
  destinationId: number;
  userId: number;
  userName: string;
  userPhoto: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: "visible" | "pending" | "hidden";
}

interface VisitedDestination {
  id: number;
  userId: number;
  destinationId: number;
  visitedAt: string;
}

const dummyVisited: VisitedDestination[] = [
  { id: 1, userId: 1, destinationId: 1, visitedAt: "2025-03-15" },
  { id: 2, userId: 1, destinationId: 2, visitedAt: "2025-04-20" },
];

const dummyReviews: Review[] = [
  {
    id: 1,
    destinationId: 1,
    userId: 2,
    userName: "Ahmad Fauzi",
    userPhoto: "",
    rating: 5,
    comment:
      "Tempat yang sangat menakjubkan! Arsitektur masjidnya sangat indah dan bersejarah. Wajib dikunjungi kalau ke Tanjung Pinang.",
    createdAt: "2025-04-10",
    status: "visible",
  },
  {
    id: 2,
    destinationId: 1,
    userId: 3,
    userName: "Siti Rahayu",
    userPhoto: "",
    rating: 5,
    comment:
      "Perjalanan dengan pompong sangat menyenangkan. Pulau Penyengat penuh cerita sejarah yang luar biasa.",
    createdAt: "2025-03-28",
    status: "visible",
  },
  {
    id: 3,
    destinationId: 1,
    userId: 4,
    userName: "Budi Santoso",
    userPhoto: "",
    rating: 4,
    comment:
      "Sangat berkesan. Masjidnya terawat dengan baik. Tapi jalanannya agak panas siang hari.",
    createdAt: "2025-02-15",
    status: "visible",
  },
  {
    id: 4,
    destinationId: 1,
    userId: 5,
    userName: "Dewi Kartika",
    userPhoto: "",
    rating: 5,
    comment:
      "Sangat puas berkunjung ke sini. Suasananya tenang dan damai. Pemandangan sekitar pulau juga indah banget!",
    createdAt: "2025-01-20",
    status: "visible",
  },
  {
    id: 5,
    destinationId: 1,
    userId: 6,
    userName: "Rizal Hakim",
    userPhoto: "",
    rating: 4,
    comment:
      "Tempatnya bagus, sejarahnya kaya. Sarankan datang pagi biar tidak terlalu panas.",
    createdAt: "2024-12-05",
    status: "visible",
  },
];

const DUMMY_DESTINATIONS: Destination[] = [
  {
    id: 1,
    slug: "masjid-raya-penyengat",
    name: "Masjid Raya Sultan Riau Penyengat",
    categoryId: 1,
    category: "Wisata Religi",
    location: "Pulau Penyengat",
    shortDescription:
      "Masjid bersejarah yang konon dibangun dengan campuran putih telur.",
    fullDescription:
      "Masjid Raya Sultan Riau adalah masjid bersejarah yang terletak di Pulau Penyengat, Kota Tanjung Pinang. Masjid ini dibangun pada tahun 1832 di masa pemerintahan Yang Dipertuan Muda VII Raja Abdurrahman. Keunikan utama dari masjid ini adalah campuran putih telur pada bahan bangunannya yang dipercaya membuatnya kokoh berdiri hingga saat ini. Warna kuning cerah dan hijau pada bangunan masjid menjadikannya ikon wisata yang sangat mencolok di pulau ini. Pulau Penyengat sendiri merupakan bekas ibu kota Kerajaan Riau-Lingga, sebuah kerajaan Melayu yang pernah berjaya di kawasan ini.",
    mainImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600",
    galleryImages: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1200",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200",
    ],
    facilities: [
      "Area Parkir Pompong",
      "Kamar Mandi/Toilet",
      "Tempat Wudu",
      "Perpustakaan Mini",
      "Penyewaan Pakaian Muslim",
      "Warung Makan",
      "Pemandu Wisata",
    ],
    openingHours: "Setiap Hari, 04.00 – 21.00 WIB",
    ticketPrice: "Gratis (Biaya pompong Rp 8.000/orang)",
    mapsUrl: "https://maps.google.com/?q=Masjid+Raya+Sultan+Riau+Penyengat",
    googlePlaceId: "ChIJexample123",
    googleRating: 4.8,
    googleReviewCount: 3200,
    googleMapsUrl:
      "https://maps.google.com/?q=Masjid+Raya+Sultan+Riau+Penyengat",
    ratingAverage: 4.9,
    reviewCount: 2087,
    visitCount: 45200,
    tips: [
      "Gunakan pakaian yang sopan dan menutup aurat",
      "Bawa uang tunai pecahan kecil untuk transportasi kapal pompong",
      "Datang saat pagi atau sore hari untuk menghindari terik matahari",
      "Jaga ketenangan karena masih digunakan sebagai tempat ibadah aktif",
    ],
    isPublished: true,
  },
  {
    id: 2,
    slug: "pantai-trikora",
    name: "Pantai Trikora",
    categoryId: 2,
    category: "Wisata Pantai",
    location: "Bintan Timur",
    shortDescription:
      "Pantai berpasir putih dengan air jernih dan pemandangan indah.",
    fullDescription:
      "Pantai Trikora adalah salah satu pantai paling populer di Pulau Bintan, Kepulauan Riau. Dengan pasir putih yang lembut dan air laut yang jernih berwarna biru kehijauan, pantai ini menjadi surga bagi pecinta wisata bahari. Sepanjang garis pantai terdapat pohon-pohon kelapa yang memberikan keteduhan alami. Pengunjung dapat menikmati berbagai aktivitas seperti berenang, snorkeling, bermain pasir, atau sekadar bersantai menikmati pemandangan sunset yang memukau.",
    mainImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600",
    galleryImages: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1200",
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=1200",
      "https://images.unsplash.com/photo-1484821582734-6692f35f2297?q=80&w=1200",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200",
      "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?q=80&w=1200",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200",
    ],
    facilities: [
      "Area Parkir",
      "Kamar Ganti",
      "Toilet Umum",
      "Warung Makan",
      "Penyewaan Pelampung",
      "Gazebo",
      "Area Camping",
    ],
    openingHours: "Setiap Hari, 07.00 – 18.00 WIB",
    ticketPrice: "Rp 10.000/orang",
    mapsUrl: "https://maps.google.com/?q=Pantai+Trikora+Bintan",
    googlePlaceId: "ChIJexample456",
    googleRating: 4.5,
    googleReviewCount: 5100,
    googleMapsUrl: "https://maps.google.com/?q=Pantai+Trikora+Bintan",
    ratingAverage: 4.7,
    reviewCount: 3240,
    visitCount: 38900,
    tips: [
      "Datang saat pagi untuk menghindari keramaian dan terik matahari",
      "Bawa sunscreen dan perlengkapan snorkeling sendiri",
      "Jangan membuang sampah sembarangan untuk menjaga kebersihan pantai",
      "Hati-hati dengan ombak jika membawa anak kecil",
    ],
    isPublished: true,
  },
];

function getDummyBySlug(slug: string): Destination {
  return DUMMY_DESTINATIONS.find((d) => d.slug === slug) || DUMMY_DESTINATIONS[0];
}

function GallerySlider({
  images,
  mainImage,
  name,
}: {
  images: string[];
  mainImage: string;
  name: string;
}) {
  const allImages = [mainImage, ...images.filter((img) => img !== mainImage)].slice(
    0,
    8
  );

  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prev = () =>
    setCurrent((c) => (c === 0 ? allImages.length - 1 : c - 1));

  const next = () =>
    setCurrent((c) => (c === allImages.length - 1 ? 0 : c + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const dx = e.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
    }

    touchStartX.current = null;
  };

  return (
    <div className="mb-0">
      <div
        className="relative w-full h-[420px] md:h-[520px] bg-slate-900 overflow-hidden cursor-pointer group"
        onClick={() => setLightboxOpen(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        data-testid="gallery-main"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={allImages[current]}
            alt={`${name} - foto ${current + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = allImages[0];
            }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
          data-testid="gallery-prev"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
          data-testid="gallery-next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {allImages.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(i);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-white w-5" : "bg-white/50"
              }`}
              data-testid={`gallery-dot-${i}`}
            />
          ))}
        </div>

        <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-medium rounded-full">
          {current + 1} / {allImages.length}
        </div>

        <div className="absolute bottom-4 right-4 z-20 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          Klik untuk perbesar
        </div>
      </div>

      <div className="flex gap-2 p-3 bg-slate-900/5 border-b border-border overflow-x-auto scrollbar-hide">
        {allImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              i === current
                ? "border-primary shadow-md"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
            data-testid={`gallery-thumb-${i}`}
          >
            <img
              src={img}
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = allImages[0];
              }}
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2"
              onClick={() => setLightboxOpen(false)}
            >
              <ChevronRight className="w-6 h-6 rotate-45" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={allImages[current]}
              alt={`${name} fullscreen`}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <p className="absolute bottom-6 text-white/60 text-sm">
              {current + 1} / {allImages.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RatingStars({
  value,
  count,
  label,
  variant = "web",
}: {
  value: number;
  count: number;
  label: string;
  variant?: "web" | "google";
}) {
  const filled = Math.round(value);

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${
        variant === "google"
          ? "bg-blue-50 border-blue-100"
          : "bg-white border-border"
      }`}
    >
      {variant === "google" && (
        <div className="flex items-center gap-1.5 mb-2">
          <Globe className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            Google
          </span>
        </div>
      )}

      {variant === "web" && (
        <div className="flex items-center gap-1.5 mb-2">
          <Star className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
            Pengunjung Web
          </span>
        </div>
      )}

      <div className="text-4xl font-black text-foreground mb-1">
        {value.toFixed(1)}
      </div>

      <div className="flex mb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i <= filled
                ? variant === "google"
                  ? "fill-blue-500 text-blue-500"
                  : "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted-foreground opacity-30"
            }`}
          />
        ))}
      </div>

      <div className="text-xs text-muted-foreground font-medium">
        {count.toLocaleString("id-ID")} {label}
      </div>
    </div>
  );
}

export default function DetailDestinasi({
  params,
}: {
  params: { slug: string };
}) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [isSaved, setIsSaved] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const dest = getDummyBySlug(params.slug);
  const authenticated = isLoggedIn();

  const canReview =
    authenticated &&
    dummyVisited.some((visited) => visited.destinationId === dest.id);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorit") || "[]");
    setIsSaved(saved.some((d: any) => d.slug === params.slug));

    const viewed = JSON.parse(localStorage.getItem("dilihat") || "[]");

    if (!viewed.some((d: any) => d.slug === dest.slug)) {
      localStorage.setItem(
        "dilihat",
        JSON.stringify(
          [
            {
              slug: dest.slug,
              name: dest.name,
              ratingAverage: dest.ratingAverage,
              mainImage: dest.mainImage,
            },
            ...viewed,
          ].slice(0, 10)
        )
      );
    }
  }, [dest.slug, params.slug]);

  const toggleSave = () => {
    if (!authenticated) {
      toast({
        title: "Perlu Login",
        description: "Silakan login untuk menyimpan destinasi favorit.",
        variant: "destructive",
      });

      setLocation("/login");
      return;
    }

    const saved = JSON.parse(localStorage.getItem("favorit") || "[]");

    if (isSaved) {
      localStorage.setItem(
        "favorit",
        JSON.stringify(saved.filter((d: any) => d.slug !== params.slug))
      );

      setIsSaved(false);
      toast({ title: "Dihapus dari favorit" });
    } else {
      localStorage.setItem(
        "favorit",
        JSON.stringify([
          {
            slug: dest.slug,
            name: dest.name,
            ratingAverage: dest.ratingAverage,
            mainImage: dest.mainImage,
          },
          ...saved,
        ])
      );

      setIsSaved(true);
      toast({ title: "Disimpan ke favorit! ❤️" });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: "Pilih rating terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length < 20) {
      toast({
        title: "Ulasan minimal 20 karakter",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Ulasan terkirim! 🎉",
      description: "Ulasan Anda sedang menunggu persetujuan moderator.",
    });

    setRating(0);
    setComment("");
  };

  const visibleReviews = dummyReviews.filter(
    (review) => review.status === "visible" && review.destinationId === dest.id
  );

  const displayedReviews = showAllReviews
    ? visibleReviews
    : visibleReviews.slice(0, 3);

  const ratingBreakdown = [
    {
      star: 5,
      pct:
        Math.round(
          (visibleReviews.filter((review) => review.rating === 5).length /
            Math.max(visibleReviews.length, 1)) *
            100
        ) || 72,
    },
    {
      star: 4,
      pct:
        Math.round(
          (visibleReviews.filter((review) => review.rating === 4).length /
            Math.max(visibleReviews.length, 1)) *
            100
        ) || 20,
    },
    { star: 3, pct: 5 },
    { star: 2, pct: 2 },
    { star: 1, pct: 1 },
  ];

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="relative">
        <GallerySlider
          images={dest.galleryImages}
          mainImage={dest.mainImage}
          name={dest.name}
        />

        <div className="absolute top-4 left-4 z-30">
          <Link
            href="/destination"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
            data-testid="link-back-destination"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        <div className="absolute top-4 right-4 z-30">
          <button
            onClick={toggleSave}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md transition-all duration-300 ${
              isSaved
                ? "bg-red-500/80 text-white hover:bg-red-600/80"
                : "bg-black/40 text-white hover:bg-black/60"
            }`}
            data-testid="button-toggle-save"
          >
            <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Destination title overlay at bottom of gallery */}
        <div className="absolute bottom-24 md:bottom-28 left-0 w-full z-20 px-4 sm:px-6 md:px-12 pointer-events-none">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex px-3 py-1 bg-primary text-white text-xs md:text-sm font-semibold rounded-full mb-3 shadow-md">
              {dest.category}
            </span>

            <h1 className="max-w-4xl text-2xl md:text-4xl font-bold text-white leading-tight drop-shadow-lg mb-3">
              {dest.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-white text-xs md:text-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-sm">
                <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-yellow-400 text-yellow-400 shrink-0" />
                <span className="font-bold">{dest.ratingAverage}</span>
                <span className="text-white/80">
                  ({dest.reviewCount.toLocaleString("id-ID")} ulasan)
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-sm">
                <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                <span>{dest.visitCount.toLocaleString("id-ID")} kunjungan</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-sm max-w-full">
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" />
                <span className="truncate">{dest.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Tentang Destinasi
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              {dest.fullDescription}
            </p>
          </motion.section>

          {dest.tips.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Tips Berkunjung
              </h2>

              <ul className="space-y-3">
                {dest.tips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-muted-foreground bg-white p-4 rounded-xl border border-border"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {dest.facilities.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Fasilitas
              </h2>

              <div className="flex flex-wrap gap-2">
                {dest.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                    data-testid={`badge-facility-${index}`}
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </motion.section>
          )}

          <div className="w-full h-px bg-border" />

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Penilaian Destinasi
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <RatingStars
                value={dest.ratingAverage}
                count={dest.reviewCount}
                label="ulasan pengunjung web"
                variant="web"
              />

              <div className="relative">
                <RatingStars
                  value={dest.googleRating}
                  count={dest.googleReviewCount}
                  label="ulasan di Google"
                  variant="google"
                />

                <a
                  href={dest.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-4 right-4 flex items-center gap-1 text-xs text-blue-500 hover:underline"
                  data-testid="link-google-maps-rating"
                >
                  <ExternalLink className="w-3 h-3" /> Lihat di Google
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
                Distribusi Rating Pengunjung Web
              </h3>

              <div className="space-y-2.5">
                {ratingBreakdown.map((row) => (
                  <div key={row.star} className="flex items-center gap-3 text-sm">
                    <span className="font-medium w-3 text-right">
                      {row.star}
                    </span>

                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 shrink-0" />

                    <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-yellow-400 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${row.pct}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.8,
                          delay: (5 - row.star) * 0.1,
                        }}
                      />
                    </div>

                    <span className="text-muted-foreground w-10 text-right text-xs">
                      {row.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Ulasan Pengunjung
            </h2>

            {visibleReviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-border">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-muted-foreground">
                  Belum ada ulasan untuk destinasi ini.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-5 rounded-2xl border border-border"
                    data-testid={`card-review-${review.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold flex items-center justify-center uppercase text-sm shrink-0">
                          {review.userName.charAt(0)}
                        </div>

                        <div>
                          <h4 className="font-bold text-sm text-foreground">
                            {review.userName}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`w-3.5 h-3.5 ${
                              index < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted-foreground opacity-30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </motion.div>
                ))}

                {visibleReviews.length > 3 && (
                  <Button
                    variant="outline"
                    className="w-full h-12"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    data-testid="button-toggle-reviews"
                  >
                    {showAllReviews
                      ? "Tampilkan Lebih Sedikit"
                      : `Lihat Semua ${visibleReviews.length} Ulasan`}
                  </Button>
                )}
              </div>
            )}
          </motion.section>

          <div className="w-full h-px bg-border" />

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Tulis Ulasan
            </h2>

            {!authenticated ? (
              <div className="bg-white border border-border p-8 rounded-2xl text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />

                <h3 className="text-lg font-bold text-foreground mb-2">
                  Login untuk memberi ulasan
                </h3>

                <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                  Anda harus masuk ke akun terlebih dahulu untuk membagikan
                  pengalaman berkunjung.
                </p>

                <Button
                  onClick={() => setLocation("/login")}
                  data-testid="button-login-to-review"
                >
                  Masuk Sekarang
                </Button>
              </div>
            ) : !canReview ? (
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>

                <div>
                  <h3 className="font-bold text-amber-800 mb-1">
                    Belum Ada Kunjungan Tercatat
                  </h3>
                  <p className="text-amber-700/80 text-sm leading-relaxed">
                    Kamu dapat memberi ulasan setelah mengunjungi destinasi ini.
                    Tandai kunjungan Anda melalui menu{" "}
                    <strong>Riwayat Kunjungan</strong> di profil.
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleReviewSubmit}
                className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm"
              >
                <div className="mb-6">
                  <label className="block font-semibold text-sm mb-3 text-foreground">
                    Berapa rating untuk tempat ini?
                  </label>

                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                        data-testid={`button-star-${star}`}
                      >
                        <Star
                          className={`w-9 h-9 transition-colors ${
                            star <= (hoverRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground fill-muted opacity-30"
                          }`}
                        />
                      </button>
                    ))}

                    {rating > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground self-center">
                        {
                          ["", "Buruk", "Kurang", "Cukup", "Bagus", "Luar Biasa"][
                            rating
                          ]
                        }
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="comment"
                    className="block font-semibold text-sm mb-2 text-foreground"
                  >
                    Bagikan pengalaman Anda
                  </label>

                  <textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ceritakan apa yang Anda suka dari tempat ini, tips bagi pengunjung lain, atau hal yang bisa ditingkatkan..."
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-sm"
                    data-testid="textarea-review-comment"
                  />

                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>
                      {comment.length < 20
                        ? `Minimal 20 karakter (${20 - comment.length} lagi)`
                        : "✓ Siap dikirim"}
                    </span>
                    <span>{comment.length}/500</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-12 px-8 font-semibold"
                  data-testid="button-submit-review"
                >
                  Kirim Ulasan
                </Button>
              </form>
            )}
          </motion.section>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="sticky top-24 space-y-4"
          >
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-lg text-foreground mb-5">
                Informasi Kunjungan
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                      Jam Buka
                    </h4>
                    <p className="text-foreground text-sm font-medium">
                      {dest.openingHours}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <Ticket className="w-4 h-4" />
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                      Harga Tiket
                    </h4>
                    <p className="text-foreground text-sm font-medium">
                      {dest.ticketPrice}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                      Lokasi
                    </h4>
                    <p className="text-foreground text-sm font-medium">
                      {dest.location}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                      Total Kunjungan
                    </h4>
                    <p className="text-foreground text-sm font-medium">
                      {dest.visitCount.toLocaleString("id-ID")} pengunjung
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={dest.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                data-testid="link-open-google-maps"
              >
                <MapPin className="w-4 h-4" /> Buka di Google Maps
              </a>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-bold text-blue-700">
                  Rating Google
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-blue-700">
                  {dest.googleRating.toFixed(1)}
                </span>

                <div>
                  <div className="flex mb-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i <= Math.round(dest.googleRating)
                            ? "fill-blue-500 text-blue-500"
                            : "fill-blue-200 text-blue-200"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-xs text-blue-600/70">
                    {dest.googleReviewCount.toLocaleString("id-ID")} ulasan
                    Google
                  </span>
                </div>
              </div>

              <a
                href={dest.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 text-xs text-blue-500 hover:underline flex items-center gap-1"
                data-testid="link-google-maps-sidebar"
              >
                <ExternalLink className="w-3 h-3" /> Lihat di Google Maps
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}