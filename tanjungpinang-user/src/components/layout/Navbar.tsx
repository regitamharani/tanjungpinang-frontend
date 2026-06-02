import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  User,
  LogOut,
  Settings,
  Menu,
  X,
  ChevronDown,
  History,
  Heart,
  Star,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { clearAuth, isLoggedIn, getUser } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const isAuthenticated = isLoggedIn();
  const user = getUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setLocation("/login");
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Destinasi", href: "/destination" },
    { label: "Kategori", href: "/destination?kategori=all" },
    { label: "Panduan Liburan", href: "/destination#panduan" },
    { label: "AI Itinerary", href: "/ai-itinerary" },
  ];

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (href === "/ai-itinerary" && !isAuthenticated) {
      e.preventDefault();

      toast({
        title: "Login Diperlukan",
        description: "Silakan login untuk menggunakan AI Itinerary.",
        variant: "destructive",
      });

      setTimeout(() => setLocation("/login"), 1200);
      setMobileMenuOpen(false);
      return;
    }

    if (href === "/destination?kategori=all") {
      if (window.location.pathname === "/") {
        e.preventDefault();

        const el = document.getElementById("kategori");

        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }

        setMobileMenuOpen(false);
      } else {
        setLocation("/destination?kategori=all");
        setMobileMenuOpen(false);
      }
    } else {
      setLocation(href);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    if (href.includes("?")) return location === href.split("?")[0];
    if (href.includes("#")) return location === href.split("#")[0];
    return location === href;
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-2"
          : "bg-white py-4"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/logo.png"
            alt="TanjungPinang Guide"
            className="w-9 h-9 rounded-lg object-cover group-hover:scale-105 transition-transform"
          />

          <span className="font-bold text-xl tracking-tight text-foreground">
            TanjungPinang Guide
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href, e);
              }}
              className={`text-sm font-medium transition-colors relative group py-2 ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}

              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-primary rounded-t-full transition-all duration-300 ${
                  isActive(link.href)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user?.name?.charAt(0) ||
                        user?.nama?.charAt(0) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>

                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || user?.nama || "Pengguna"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setLocation("/account")}
                  className="cursor-pointer py-2 rounded-lg"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setLocation("/account/riwayat")}
                  className="cursor-pointer py-2 rounded-lg"
                >
                  <History className="mr-2 h-4 w-4" />
                  <span>Riwayat Kunjungan</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setLocation("/account")}
                  className="cursor-pointer py-2 rounded-lg"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Destinasi Tersimpan</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setLocation("/account")}
                  className="cursor-pointer py-2 rounded-lg"
                >
                  <Star className="mr-2 h-4 w-4" />
                  <span>Ulasan Saya</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setLocation("/account")}
                  className="cursor-pointer py-2 rounded-lg"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Pengaturan Akun</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500 focus:text-red-500 py-2 rounded-lg"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setLocation("/login")}
                className="font-semibold rounded-full px-6"
              >
                Login
              </Button>

              <Button
                onClick={() => setLocation("/register")}
                className="font-semibold rounded-full px-6 bg-gradient-to-r from-primary to-secondary shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                Register
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-foreground p-2 -mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-xl p-6 flex flex-col gap-6"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href, e);
                  }}
                  className={`text-lg font-medium ${
                    isActive(link.href) ? "text-primary" : "text-foreground"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="h-px w-full bg-border" />

            {isAuthenticated ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user?.name?.charAt(0) ||
                        user?.nama?.charAt(0) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-semibold text-foreground">
                      {user?.name || user?.nama || "Pengguna"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </div>

                {[
                  {
                    icon: <User className="w-5 h-5 text-muted-foreground" />,
                    label: "Profil",
                    href: "/account",
                  },
                  {
                    icon: (
                      <History className="w-5 h-5 text-muted-foreground" />
                    ),
                    label: "Riwayat Kunjungan",
                    href: "/account/riwayat",
                  },
                  {
                    icon: <Heart className="w-5 h-5 text-muted-foreground" />,
                    label: "Destinasi Tersimpan",
                    href: "/account",
                  },
                  {
                    icon: <Star className="w-5 h-5 text-muted-foreground" />,
                    label: "Ulasan Saya",
                    href: "/account",
                  },
                  {
                    icon: (
                      <Settings className="w-5 h-5 text-muted-foreground" />
                    ),
                    label: "Pengaturan Akun",
                    href: "/account",
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setLocation(item.href);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-foreground font-medium py-2.5 px-2 rounded-xl hover:bg-muted transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                ))}

                <div className="h-px w-full bg-border my-1" />

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-red-500 font-medium text-left py-2.5 px-2 rounded-xl hover:bg-red-50 transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full justify-center h-12 rounded-xl"
                  onClick={() => {
                    setLocation("/login");
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>

                <Button
                  className="w-full justify-center h-12 rounded-xl bg-gradient-to-r from-primary to-secondary shadow-md"
                  onClick={() => {
                    setLocation("/register");
                    setMobileMenuOpen(false);
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}