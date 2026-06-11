import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Star } from "lucide-react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { post, isLoggedIn } from "@/services/api";

const ADMIN_URL = "http://localhost:5174";

const GOOGLE_CLIENT_ID = String(
  import.meta.env.VITE_GOOGLE_CLIENT_ID || ""
).trim();

const isValidGoogleClientId = (clientId: string) => {
  return /^[0-9]+-[a-zA-Z0-9_-]+\.apps\.googleusercontent\.com$/.test(
    clientId
  );
};

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  remember: z.boolean().optional(),
});

const registerSchema = z
  .object({
    nama: z.string().min(3, { message: "Nama minimal 3 karakter" }),
    email: z.string().email({ message: "Email tidak valid" }),
    telepon: z.string().optional(),
    password: z.string().min(6, { message: "Password minimal 6 karakter" }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "Anda harus menyetujui syarat & ketentuan",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

type AuthPageProps = {
  defaultMode?: "login" | "register";
};

export default function AuthPage({ defaultMode = "login" }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">(
    defaultMode
  );

  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isRegister = mode === "register";

  const googleClientReady = useMemo(() => {
    return isValidGoogleClientId(GOOGLE_CLIENT_ID);
  }, []);

  useEffect(() => {
    console.log("GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID);
    console.log("GOOGLE_CLIENT_READY:", googleClientReady);

    if (!googleClientReady) {
      console.warn(
        "Google Client ID belum valid. Cek file .env dan restart npm run dev."
      );
    }
  }, [googleClientReady]);

  const clearAuthLocal = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    sessionStorage.clear();
  };

  const redirectByRole = (user: any, token?: string, refreshToken?: string) => {
    const role = String(user?.role || "").trim().toLowerCase();

    if (role === "admin") {
      const encodedUser = encodeURIComponent(JSON.stringify(user));

      let adminUrl = `${ADMIN_URL}/?user=${encodedUser}`;

      if (token) {
        adminUrl += `&token=${encodeURIComponent(token)}`;
      }

      if (refreshToken) {
        adminUrl += `&refreshToken=${encodeURIComponent(refreshToken)}`;
      }

      window.location.href = adminUrl;
      return;
    }

    setLocation("/");
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const logout = params.get("logout");

    if (logout === "1") {
      clearAuthLocal();
      window.history.replaceState({}, document.title, "/login");
      return;
    }

    if (!isLoggedIn()) return;

    const userRaw = localStorage.getItem("user");
    const token = localStorage.getItem("token") || "";
    const refreshToken = localStorage.getItem("refreshToken") || "";

    if (!userRaw) {
      clearAuthLocal();
      return;
    }

    try {
      const user = JSON.parse(userRaw);
      redirectByRole(user, token, refreshToken);
    } catch {
      clearAuthLocal();
    }
  }, [setLocation]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nama: "",
      email: "",
      telepon: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);

    try {
      const res = await post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast({
          title: "Login gagal",
          description: json.message || "Email atau password salah.",
          variant: "destructive",
        });
        return;
      }

      const token = json.data.token;
      const refreshToken = json.data.refreshToken;
      const user = json.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      toast({
        title: "Login berhasil",
        description: `Selamat datang, ${user.nama}!`,
      });

      redirectByRole(user, token, refreshToken);
    } catch (error) {
      toast({
        title: "Login gagal",
        description:
          "Tidak bisa terhubung ke server. Pastikan backend Express sudah berjalan.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleLogin = async (credential?: string) => {
    if (!googleClientReady) {
      toast({
        title: "Google Client ID belum valid",
        description:
          "Cek VITE_GOOGLE_CLIENT_ID di file .env, pastikan pakai Client ID asli, lalu restart npm run dev.",
        variant: "destructive",
      });
      return;
    }

    if (!credential) {
      toast({
        title: "Login Google gagal",
        description: "Credential Google tidak ditemukan.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await post("/auth/google", {
        credential,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast({
          title: "Login Google gagal",
          description: json.message || "Terjadi kesalahan saat login Google.",
          variant: "destructive",
        });
        return;
      }

      const token = json.data.token;
      const refreshToken = json.data.refreshToken;
      const user = json.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      toast({
        title: "Login Google berhasil",
        description: `Selamat datang, ${user.nama}!`,
      });

      redirectByRole(user, token, refreshToken);
    } catch (error) {
      toast({
        title: "Login Google gagal",
        description:
          "Google berhasil memberi credential, tapi backend belum bisa memproses. Pastikan endpoint POST /api/auth/google sudah dibuat.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true);

    try {
      const res = await post("/auth/register", {
        nama: data.nama,
        email: data.email,
        telepon: data.telepon,
        password: data.password,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast({
          title: "Pendaftaran gagal",
          description: json.message || "Terjadi kesalahan saat mendaftar.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Pendaftaran berhasil",
        description: "Silakan login menggunakan akun baru Anda.",
      });

      registerForm.reset();
      setMode("login");
    } catch (error) {
      toast({
        title: "Pendaftaran gagal",
        description:
          "Tidak bisa terhubung ke server. Pastikan backend Express sudah berjalan.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "Fitur belum tersedia",
      description:
        "Reset password akan dibuat setelah endpoint backend tersedia.",
    });

    setMode("login");
  };

  const GoogleAuthButton = ({ type }: { type: "login" | "register" }) => {
    return (
      <div className="mt-4">
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>

          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-muted-foreground">
              {type === "login" ? "atau masuk dengan" : "atau daftar dengan"}
            </span>
          </div>
        </div>

        {!googleClientReady ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Google Login belum aktif. Cek file{" "}
            <span className="font-semibold">.env</span>, isi{" "}
            <span className="font-semibold">VITE_GOOGLE_CLIENT_ID</span> dengan
            Client ID asli dari Google Cloud, lalu restart{" "}
            <span className="font-semibold">npm run dev</span>.
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const credential = credentialResponse.credential;

                if (!credential) {
                  toast({
                    title: "Login Google gagal",
                    description: "Credential Google tidak ditemukan.",
                    variant: "destructive",
                  });
                  return;
                }

                onGoogleLogin(credential);
              }}
              onError={() => {
                toast({
                  title: "Login Google gagal",
                  description:
                    "Akun Google gagal diproses. Cek Authorized JavaScript origins di Google Cloud.",
                  variant: "destructive",
                });
              }}
              useOneTap={false}
              theme="outline"
              size="large"
              text={type === "login" ? "signin_with" : "signup_with"}
              shape="rectangular"
            />
          </div>
        )}
      </div>
    );
  };

  const AuthContent = (
    <div className="min-h-screen bg-white md:h-screen md:overflow-hidden">
      <div className="relative min-h-screen md:h-screen">
        {/* Image Panel */}
        <div
          className={`relative z-10 w-full h-[30vh] min-h-[260px] bg-slate-900 overflow-hidden flex flex-col justify-between p-6 sm:p-8 text-white md:absolute md:left-0 md:top-0 md:h-full md:w-1/2 md:min-h-0 md:p-12 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isRegister ? "md:translate-x-full" : "md:translate-x-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0064B4] via-[#12A9D0] to-[#00658F] z-0" />

          <div
            className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay z-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isRegister ? "scale-x-[-1]" : "scale-x-100"
            }`}
          />

          <div
            className={`relative z-10 hidden md:block transition-all duration-500 ease-out ${
              isRegister ? "md:text-right" : ""
            }`}
          >
            <Link
              href="/"
              className={`flex items-center gap-2 group w-max transition-all duration-500 ease-out ${
                isRegister ? "md:ml-auto" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary font-bold text-xl">
                T
              </div>
              <span className="font-bold text-2xl tracking-tight">
                Tanjung Pinang Guide
              </span>
            </Link>
          </div>

          <div
            className={`relative z-10 flex-1 flex flex-col justify-center max-w-md mt-6 md:mt-0 transition-all duration-500 ease-out ${
              isRegister ? "md:ml-auto md:text-right md:items-end" : ""
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`panel-title-${mode}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {isRegister
                    ? "Gabung Bersama Kami."
                    : "Mulai Perjalanan Anda."}
                </h1>

                <p className="text-base sm:text-lg text-white/80 font-medium mb-8 hidden md:block">
                  {isRegister
                    ? "Buat akun dan simpan destinasi favorit, ulasan, serta rencana perjalanan wisata Anda dengan lebih mudah."
                    : "Bergabunglah dengan ribuan wisatawan lainnya dan temukan pesona tersembunyi di sudut kota Tanjung Pinang."}
                </p>
              </motion.div>
            </AnimatePresence>

            <div
              className={`hidden md:flex gap-8 mb-12 transition-all duration-500 ease-out ${
                isRegister ? "justify-end" : ""
              }`}
            >
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm text-white/70">Destinasi</div>
              </div>

              <div>
                <div className="text-3xl font-bold">4.8</div>
                <div className="text-sm text-white/70">Rating</div>
              </div>

              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-white/70">Pengunjung</div>
              </div>
            </div>
          </div>

          <div
            className={`relative z-10 hidden md:block transition-all duration-500 ease-out ${
              isRegister ? "md:ml-auto md:text-right" : ""
            }`}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-md">
              <div
                className={`flex items-center gap-1 mb-3 text-yellow-400 transition-all duration-500 ease-out ${
                  isRegister ? "justify-end" : ""
                }`}
              >
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>

              <p className="text-white/90 italic mb-4">
                "Aplikasi ini sangat membantu saya menemukan kuliner lokal yang
                luar biasa dan tempat bersejarah yang belum pernah saya ketahui
                sebelumnya!"
              </p>

              <div
                className={`flex items-center gap-3 transition-all duration-500 ease-out ${
                  isRegister ? "justify-end flex-row-reverse" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/50" />

                <div>
                  <div className="font-semibold text-sm">Budi Santoso</div>
                  <div className="text-xs text-white/60">
                    Wisatawan dari Jakarta
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div
          className={`relative z-20 w-full min-h-[70vh] flex items-start justify-center bg-white px-6 py-10 sm:px-8 md:absolute md:left-0 md:top-0 md:h-full md:w-1/2 md:min-h-0 md:items-center md:p-12 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isRegister ? "md:translate-x-0" : "md:translate-x-full"
          }`}
        >
          <div className="w-full max-w-md">
            <div className="md:hidden flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                T
              </div>
              <span className="font-bold text-xl text-foreground">
                Tanjung Pinang Guide
              </span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                initial={{
                  opacity: 0,
                  x: isRegister ? 28 : -28,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: isRegister ? -28 : 28,
                }}
                transition={{
                  duration: 0.32,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {mode === "login" && (
                  <>
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-foreground mb-2">
                        Selamat Datang Kembali
                      </h2>
                      <p className="text-muted-foreground">
                        Silakan masuk ke akun Anda untuk melanjutkan.
                      </p>
                    </div>

                    <Form {...loginForm}>
                      <form
                        onSubmit={loginForm.handleSubmit(onLogin)}
                        className="space-y-5"
                      >
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="nama@email.com"
                                  {...field}
                                  className="h-12 bg-muted/30"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex justify-between items-center">
                                <FormLabel>Password</FormLabel>

                                <button
                                  type="button"
                                  onClick={() => setMode("forgot")}
                                  className="text-xs text-primary font-medium hover:underline"
                                >
                                  Lupa password?
                                </button>
                              </div>

                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...field}
                                    className="h-12 bg-muted/30 pr-10"
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                  >
                                    {showPassword ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={loginForm.control}
                          name="remember"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-2 space-y-0 py-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>

                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal text-muted-foreground">
                                  Ingat saya
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full h-12 text-md font-bold mt-2 shadow-lg shadow-primary/20"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            "Masuk"
                          )}
                        </Button>

                        <GoogleAuthButton type="login" />
                      </form>
                    </Form>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                      Belum punya akun?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("register")}
                        className="text-primary font-bold hover:underline"
                      >
                        Daftar sekarang
                      </button>
                    </p>
                  </>
                )}

                {mode === "register" && (
                  <>
                    <div className="mb-7">
                      <h2 className="text-3xl font-bold text-foreground mb-2">
                        Buat Akun Baru
                      </h2>
                      <p className="text-muted-foreground">
                        Daftar untuk mulai menyimpan destinasi favorit Anda.
                      </p>
                    </div>

                    <Form {...registerForm}>
                      <form
                        onSubmit={registerForm.handleSubmit(onRegister)}
                        className="space-y-4"
                      >
                        <FormField
                          control={registerForm.control}
                          name="nama"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nama Lengkap</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Budi Santoso"
                                  {...field}
                                  className="h-11 bg-muted/30"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="nama@email.com"
                                  {...field}
                                  className="h-11 bg-muted/30"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="telepon"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>No. Telepon Opsional</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="08123456789"
                                  {...field}
                                  className="h-11 bg-muted/30"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type={
                                        showRegisterPassword
                                          ? "text"
                                          : "password"
                                      }
                                      placeholder="••••••••"
                                      {...field}
                                      className="h-11 bg-muted/30 pr-10"
                                    />

                                    <button
                                      type="button"
                                      onClick={() =>
                                        setShowRegisterPassword(
                                          !showRegisterPassword
                                        )
                                      }
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                      {showRegisterPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                      ) : (
                                        <Eye className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Konfirmasi</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type={
                                        showConfirmPassword
                                          ? "text"
                                          : "password"
                                      }
                                      placeholder="••••••••"
                                      {...field}
                                      className="h-11 bg-muted/30 pr-10"
                                    />

                                    <button
                                      type="button"
                                      onClick={() =>
                                        setShowConfirmPassword(
                                          !showConfirmPassword
                                        )
                                      }
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                      {showConfirmPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                      ) : (
                                        <Eye className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={registerForm.control}
                          name="terms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-2 space-y-0 py-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>

                              <div className="space-y-1 leading-tight">
                                <FormLabel className="text-xs font-normal text-muted-foreground">
                                  Saya menyetujui{" "}
                                  <a
                                    href="#"
                                    className="text-primary hover:underline"
                                  >
                                    Syarat & Ketentuan
                                  </a>{" "}
                                  serta{" "}
                                  <a
                                    href="#"
                                    className="text-primary hover:underline"
                                  >
                                    Kebijakan Privasi
                                  </a>
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full h-12 text-md font-bold shadow-lg shadow-primary/20"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            "Daftar Akun"
                          )}
                        </Button>

                        <GoogleAuthButton type="register" />
                      </form>
                    </Form>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                      Sudah punya akun?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="text-primary font-bold hover:underline"
                      >
                        Masuk di sini
                      </button>
                    </p>
                  </>
                )}

                {mode === "forgot" && (
                  <>
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-foreground mb-2">
                        Lupa Password
                      </h2>
                      <p className="text-muted-foreground">
                        Masukkan email Anda untuk menerima tautan reset
                        password.
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          type="email"
                          placeholder="nama@email.com"
                          className="h-12 bg-muted/30"
                        />
                      </div>

                      <Button
                        type="button"
                        className="w-full h-12 text-md font-bold shadow-lg shadow-primary/20"
                        onClick={handleForgotPassword}
                      >
                        Kirim Link Reset
                      </Button>
                    </div>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                      Ingat password Anda?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="text-primary font-bold hover:underline"
                      >
                        Kembali ke Login
                      </button>
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );

  if (!googleClientReady) {
    return AuthContent;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {AuthContent}
    </GoogleOAuthProvider>
  );
}