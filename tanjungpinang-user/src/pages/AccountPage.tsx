import { useCallback, useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import {
  MapPin,
  Settings,
  Heart,
  Clock,
  Bell,
  LogOut,
  Camera,
  Star,
  Edit3,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/layout/Footer";
import { clearAuth, getUser, isLoggedIn } from "@/services/api";

const API_URL = "http://localhost:3000/api";

const profileSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  telepon: z.string().optional(),
  bio: z.string().max(150, "Bio maksimal 150 karakter").optional(),
});

const defaultStats = {
  viewedCount: 0,
  savedCount: 0,
  averageRating: 0,
  reviewCount: 0,
};

const getUserId = (user: any) => {
  return user?.id || user?.userId || user?.user_id || null;
};

const getName = (dest: any) => {
  return dest.name || dest.nama || dest.destinationName || "Destinasi";
};

const getSlug = (dest: any) => {
  return dest.slug || dest.destinationSlug || dest.destination_slug || "";
};

const getImage = (dest: any) => {
  return (
    dest.image ||
    dest.mainImage ||
    dest.main_image ||
    dest.img ||
    dest.gambar ||
    ""
  );
};

const getCategory = (dest: any) => {
  return dest.category || dest.kategori || "Wisata";
};

const getRating = (dest: any) => {
  return Number(
    dest.ratingAverage ||
      dest.rating_average ||
      dest.rating ||
      dest.rata_rating ||
      0
  );
};

export default function AccountPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [user, setUser] = useState<any>({
    nama: "Pengguna",
    name: "Pengguna",
    email: "",
    bio: "Wisatawan penjelajah keindahan Tanjung Pinang.",
    telepon: "",
  });

  const [stats, setStats] = useState(defaultStats);
  const [savedDests, setSavedDests] = useState<any[]>([]);
  const [viewedDests, setViewedDests] = useState<any[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nama: "",
      email: "",
      telepon: "",
      bio: "",
    },
  });

  const getLocalUser = useCallback(() => {
    try {
      return getUser() || JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const fetchJson = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          ...(options.headers || {}),
        },
      });

      const text = await response.text();

      let json: any = {};

      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Response backend bukan JSON");
      }

      if (!response.ok || !json.success) {
        throw new Error(json.message || "Terjadi kesalahan pada server");
      }

      return json;
    },
    []
  );

  const fetchProfileData = useCallback(async () => {
    const localUser = getLocalUser();
    const userId = getUserId(localUser);

    if (!userId) {
      setLoading(false);
      setStats(defaultStats);
      setSavedDests([]);
      setViewedDests([]);
      setErrorText("Data user tidak ditemukan. Silakan logout lalu login ulang.");
      return;
    }

    try {
      setLoading(true);
      setErrorText("");

      const [statsJson, favoritesJson, visitsJson] = await Promise.all([
        fetchJson(`${API_URL}/profile/${encodeURIComponent(userId)}/stats`),
        fetchJson(`${API_URL}/favorites?userId=${encodeURIComponent(userId)}`),
        fetchJson(`${API_URL}/visits/user/${encodeURIComponent(userId)}/recent`),
      ]);

      setStats({
        viewedCount: Number(statsJson.data?.viewedCount || 0),
        savedCount: Number(statsJson.data?.savedCount || 0),
        averageRating: Number(statsJson.data?.averageRating || 0),
        reviewCount: Number(statsJson.data?.reviewCount || 0),
      });

      setSavedDests(Array.isArray(favoritesJson.data) ? favoritesJson.data : []);
      setViewedDests(Array.isArray(visitsJson.data) ? visitsJson.data : []);
    } catch (error) {
      setStats(defaultStats);
      setSavedDests([]);
      setViewedDests([]);
      setErrorText(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data profil dari database."
      );
    } finally {
      setLoading(false);
    }
  }, [fetchJson, getLocalUser]);

  useEffect(() => {
    if (!isLoggedIn()) {
      setLocation("/login");
      return;
    }

    const localUser = getLocalUser();

    if (localUser) {
      const fixedUser = {
        ...localUser,
        nama: localUser.nama || localUser.name || "Pengguna",
        name: localUser.name || localUser.nama || "Pengguna",
        email: localUser.email || "",
        telepon: localUser.telepon || "",
        bio:
          localUser.bio ||
          "Wisatawan penjelajah keindahan Tanjung Pinang.",
      };

      setUser(fixedUser);
    }

    fetchProfileData();
  }, [setLocation, getLocalUser, fetchProfileData]);

  useEffect(() => {
    form.reset({
      nama: user.nama || user.name || "",
      email: user.email || "",
      telepon: user.telepon || "",
      bio: user.bio || "",
    });
  }, [user, form]);

  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    const updatedUser = {
      ...user,
      ...data,
      nama: data.nama,
      name: data.nama,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditOpen(false);

    toast({
      title: "Profil Diperbarui",
      description: "Perubahan Anda telah disimpan.",
    });
  };

  const handleLogout = () => {
    clearAuth();

    localStorage.removeItem("favorit");
    localStorage.removeItem("dilihat");

    setLocation("/login");
  };

  const removeSaved = async (destinationId: number) => {
    const localUser = getLocalUser();
    const userId = getUserId(localUser);

    if (!userId) {
      toast({
        title: "Data user tidak ditemukan",
        description: "Silakan logout lalu login kembali.",
        variant: "destructive",
      });
      return;
    }

    try {
      await fetchJson(`${API_URL}/favorites/${destinationId}`, {
        method: "DELETE",
        body: JSON.stringify({
          userId,
        }),
      });

      toast({
        title: "Dihapus dari favorit",
      });

      await fetchProfileData();
    } catch (error) {
      toast({
        title: "Gagal menghapus favorit",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan.",
        variant: "destructive",
      });
    }
  };

  if (!isLoggedIn()) return null;

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <div className="bg-gradient-to-br from-[#0064B4] to-[#00A0E0] pt-20 pb-24 border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-6 container text-white">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-white/20 shadow-xl bg-white/10 backdrop-blur-sm">
                <AvatarFallback className="text-4xl bg-transparent text-white font-bold">
                  {(user.nama || user.name || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                className="absolute bottom-0 right-0 p-2 bg-white text-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1 translate-y-1"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left mb-2">
              <h1 className="text-3xl font-bold mb-1">
                {user.nama || user.name}
              </h1>
              <p className="text-white/80 font-medium mb-3">{user.email}</p>
              <p className="text-white/90 max-w-lg">{user.bio}</p>
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 mb-2"
                >
                  <Edit3 className="w-4 h-4 mr-2" /> Edit Profil
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Profil</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 py-4"
                  >
                    <FormField
                      control={form.control}
                      name="nama"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} disabled className="bg-muted" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="telepon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. Telepon</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="resize-none h-24"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-2 flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditOpen(false)}
                      >
                        Batal
                      </Button>
                      <Button type="submit">Simpan</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 container -mt-10 mb-16 flex-1 w-full">
        <div className="bg-white rounded-2xl p-6 border border-border shadow-xl shadow-primary/5 flex flex-wrap md:flex-nowrap items-center justify-between gap-6 mb-10">
          <div className="flex-1 text-center border-r border-border last:border-0 pr-6 md:pr-0">
            <div className="text-3xl font-bold text-foreground mb-1">
              {stats.viewedCount}
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Destinasi Dilihat
            </div>
          </div>

          <div className="flex-1 text-center border-r border-border last:border-0 px-6 md:px-0 hidden sm:block">
            <div className="text-3xl font-bold text-foreground mb-1">
              {stats.savedCount}
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Tersimpan
            </div>
          </div>

          <div className="flex-1 text-center border-r border-border last:border-0 pl-6 md:pl-0">
            <div className="text-3xl font-bold text-foreground flex items-center justify-center gap-1 mb-1">
              {stats.averageRating > 0
                ? stats.averageRating.toFixed(1)
                : "0.0"}{" "}
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Rata-rata Rating
            </div>
          </div>

          <div className="flex-1 text-center hidden md:block">
            <div className="text-3xl font-bold text-foreground mb-1">
              {stats.reviewCount}
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Ulasan Ditulis
            </div>
          </div>
        </div>

        {loading && (
          <div className="mb-6 rounded-xl border border-border bg-white px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Memuat data profil dari database...
          </div>
        )}

        {errorText && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorText}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="p-4 bg-muted/30 border-b border-border">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  Pengaturan Akun
                </h3>
              </div>

              <div className="flex flex-col">
                <button className="flex items-center gap-3 px-6 py-4 text-left text-primary bg-primary/5 border-l-2 border-primary font-medium">
                  <Heart className="w-5 h-5" /> Destinasi Favorit
                </button>

                <button className="flex items-center gap-3 px-6 py-4 text-left text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors font-medium">
                  <Bell className="w-5 h-5" /> Notifikasi
                </button>

                <button className="flex items-center gap-3 px-6 py-4 text-left text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors font-medium">
                  <Settings className="w-5 h-5" /> Preferensi
                </button>

                <div className="w-full h-px bg-border my-2" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-6 py-4 text-left text-red-500 hover:bg-red-50 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" /> Keluar
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Tabs defaultValue="saved" className="w-full">
              <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-6 gap-6">
                <TabsTrigger
                  value="saved"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 pb-3 font-semibold text-base"
                >
                  <Heart className="w-4 h-4 mr-2" /> Tersimpan
                </TabsTrigger>

                <TabsTrigger
                  value="viewed"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 pb-3 font-semibold text-base"
                >
                  <Clock className="w-4 h-4 mr-2" /> Terakhir Dilihat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="saved" className="m-0">
                {savedDests.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedDests.map((dest) => {
                      const slug = getSlug(dest);

                      return (
                        <div
                          key={dest.id}
                          className="flex bg-white border border-border rounded-xl p-3 gap-4 group hover:shadow-md transition-shadow"
                        >
                          <Link
                            href={slug ? `/destination/${slug}` : "/destination"}
                            className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-muted"
                          >
                            {getImage(dest) ? (
                              <img
                                src={getImage(dest)}
                                alt={getName(dest)}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/40">
                                <MapPin className="w-8 h-8" />
                              </div>
                            )}
                          </Link>

                          <div className="flex-1 py-1 flex flex-col justify-between">
                            <div>
                              <Link
                                href={
                                  slug ? `/destination/${slug}` : "/destination"
                                }
                              >
                                <h3 className="font-bold text-foreground leading-tight hover:text-primary transition-colors line-clamp-2">
                                  {getName(dest)}
                                </h3>
                              </Link>

                              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                {getRating(dest).toFixed(1)}
                              </div>
                            </div>

                            <button
                              onClick={() => removeSaved(Number(dest.id))}
                              className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center w-max mt-2"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-border">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      Belum ada destinasi favorit
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Mulai jelajahi dan simpan tempat impian Anda.
                    </p>
                    <Button asChild>
                      <Link href="/destination">Eksplorasi Sekarang</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="viewed" className="m-0">
                {viewedDests.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {viewedDests.map((dest) => {
                      const slug = getSlug(dest);

                      return (
                        <Link
                          key={`${dest.destinationId || dest.id}-${dest.visitedAt}`}
                          href={slug ? `/destination/${slug}` : "/destination"}
                          className="flex bg-white border border-border rounded-xl p-3 gap-4 group hover:shadow-md transition-shadow"
                        >
                          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                            {getImage(dest) ? (
                              <img
                                src={getImage(dest)}
                                alt={getName(dest)}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/40">
                                <MapPin className="w-6 h-6" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 py-1 flex flex-col justify-center">
                            <h3 className="font-bold text-sm text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-1">
                              {getName(dest)}
                            </h3>

                            <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-md w-max">
                              {getCategory(dest)}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-border">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      Riwayat kosong
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Destinasi yang Anda lihat akan muncul di sini.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}