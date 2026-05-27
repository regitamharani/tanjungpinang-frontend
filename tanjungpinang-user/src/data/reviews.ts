/* ─── Types ──────────────────────────────────────────────────────────────── */

export type ReviewStatus = "approved" | "pending" | "rejected";
export type ReviewSource = "web" | "google";

export interface Review {
  id: number;
  destinationId: number;
  destinationName: string;
  destinationSlug: string;
  userId: number;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: ReviewStatus;
  source: ReviewSource;
}

export interface VisitedDestination {
  id: number;
  userId: number;
  destinationId: number;
  visitedAt: string;
}

/* ─── Dummy Review Data ──────────────────────────────────────────────────── */

export const dummyReviews: Review[] = [
  {
    id: 1,
    destinationId: 1,
    destinationName: "Masjid Raya Sultan Riau Penyengat",
    destinationSlug: "masjid-raya-penyengat",
    userId: 101,
    userName: "Budi Santoso",
    userAvatar: "BS",
    rating: 5,
    comment: "Tempat yang luar biasa! Sejarahnya sangat kaya dan arsitekturnya memukau. Wajib dikunjungi saat ke Tanjung Pinang.",
    createdAt: "2025-05-10T08:30:00Z",
    status: "approved",
    source: "web",
  },
  {
    id: 2,
    destinationId: 2,
    destinationName: "Pantai Trikora",
    destinationSlug: "pantai-trikora",
    userId: 102,
    userName: "Sari Dewi",
    userAvatar: "SD",
    rating: 5,
    comment: "Pantainya bersih banget, pasirnya putih halus. Sunrisenya pagi itu luar biasa indah, tidak menyesal datang ke sini!",
    createdAt: "2025-05-08T07:15:00Z",
    status: "approved",
    source: "web",
  },
  {
    id: 3,
    destinationId: 6,
    destinationName: "Vihara Avalokitesvara Puri",
    destinationSlug: "vihara-avalokitesvara",
    userId: 103,
    userName: "Ahmad Fauzi",
    userAvatar: "AF",
    rating: 5,
    comment: "Vihara ini sangat megah dan tenang. Pengurus vihara juga ramah dan informatif. Bangunannya Instagramable banget!",
    createdAt: "2025-05-05T14:20:00Z",
    status: "approved",
    source: "web",
  },
  {
    id: 4,
    destinationId: 3,
    destinationName: "Gurun Pasir Busung",
    destinationSlug: "gurun-pasir-busung",
    userId: 104,
    userName: "Rina Marlina",
    userAvatar: "RM",
    rating: 4,
    comment: "Unik sekali! Nggak nyangka ada gurun pasir di kepulauan. Paling seru main di sini pagi hari sebelum terik.",
    createdAt: "2025-05-03T09:45:00Z",
    status: "approved",
    source: "web",
  },
  {
    id: 5,
    destinationId: 4,
    destinationName: "Kawasan Patung Seribu",
    destinationSlug: "patung-seribu",
    userId: 105,
    userName: "Hendra Kusuma",
    userAvatar: "HK",
    rating: 4,
    comment: "Spot foto yang keren abis. Banyak patung dengan cerita budaya Melayu yang menarik. Bawa kamera DSLR ya!",
    createdAt: "2025-04-28T11:00:00Z",
    status: "approved",
    source: "web",
  },
  {
    id: 6,
    destinationId: 7,
    destinationName: "Pantai Batu Hitam",
    destinationSlug: "pantai-batu-hitam",
    userId: 106,
    userName: "Fitri Handayani",
    userAvatar: "FH",
    rating: 5,
    comment: "Sunsetnya di sini LUAR BIASA! Batuan granit hitam dengan langit oranye, kombinasi yang sangat dramatis. Top banget!",
    createdAt: "2025-04-25T17:30:00Z",
    status: "approved",
    source: "web",
  },
  {
    id: 7,
    destinationId: 5,
    destinationName: "Melayu Square",
    destinationSlug: "melayu-square",
    userId: 107,
    userName: "Dwi Prasetyo",
    userAvatar: "DP",
    rating: 4,
    comment: "Kuliner di sini enak-enak. Gonggong dan Mie Lendir wajib dicoba. Tempatnya ramai dan meriah di malam hari.",
    createdAt: "2025-04-20T19:00:00Z",
    status: "approved",
    source: "web",
  },
  {
    id: 8,
    destinationId: 8,
    destinationName: "Bukit Kucing",
    destinationSlug: "bukit-kucing",
    userId: 108,
    userName: "Maya Putri",
    userAvatar: "MP",
    rating: 4,
    comment: "View kota dari atas sini keren banget, terutama sore hari. Treknya santai, cocok untuk semua usia.",
    createdAt: "2025-04-15T16:45:00Z",
    status: "approved",
    source: "web",
  },
  {
    id: 9,
    destinationId: 1,
    destinationName: "Masjid Raya Sultan Riau Penyengat",
    destinationSlug: "masjid-raya-penyengat",
    userId: 109,
    userName: "Irwan Setiawan",
    userAvatar: "IS",
    rating: 5,
    comment: "Perjalanan naik pompong ke Pulau Penyengat sendiri sudah seru. Masjidnya megah dan menyentuh hati. Highly recommended!",
    createdAt: "2025-04-10T10:00:00Z",
    status: "approved",
    source: "web",
  },
  {
    id: 10,
    destinationId: 2,
    destinationName: "Pantai Trikora",
    destinationSlug: "pantai-trikora",
    userId: 110,
    userName: "Lestari Ningrum",
    userAvatar: "LN",
    rating: 5,
    comment: "Air lautnya jernih banget bisa lihat ikan langsung. Pemandangan sunset juga tidak kalah indahnya. Pasti balik lagi!",
    createdAt: "2025-04-05T16:00:00Z",
    status: "pending",
    source: "web",
  },
  {
    id: 11,
    destinationId: 3,
    destinationName: "Gurun Pasir Busung",
    destinationSlug: "gurun-pasir-busung",
    userId: 111,
    userName: "Kevin Salim",
    userAvatar: "KS",
    rating: 3,
    comment: "Tempatnya cukup unik tapi agak susah dijangkau tanpa kendaraan pribadi.",
    createdAt: "2025-03-28T12:00:00Z",
    status: "approved",
    source: "web",
  },
];

/* ─── Dummy Visited Destinations ─────────────────────────────────────────── */

export const dummyVisitedDestinations: VisitedDestination[] = [
  { id: 1, userId: 1, destinationId: 1, visitedAt: "2025-04-10T08:00:00Z" },
  { id: 2, userId: 1, destinationId: 2, visitedAt: "2025-04-12T09:00:00Z" },
  { id: 3, userId: 1, destinationId: 6, visitedAt: "2025-04-15T10:30:00Z" },
  { id: 4, userId: 2, destinationId: 3, visitedAt: "2025-04-20T07:00:00Z" },
  { id: 5, userId: 2, destinationId: 7, visitedAt: "2025-04-22T15:00:00Z" },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

export function getTopReviews(maxCount = 6): Review[] {
  return dummyReviews
    .filter(r => r.status === "approved" && r.rating >= 4 && r.comment.trim() !== "" && r.source === "web")
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, maxCount);
}

export function getAverageRating(reviews: Review[]): number {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

export function hasVisited(userId: number, destinationId: number): boolean {
  return dummyVisitedDestinations.some(v => v.userId === userId && v.destinationId === destinationId);
}
