import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  Users,
  Tag,
  Images,
  ChevronLeft,
  Menu,
  LogOut,
  X,
  MessageSquare,
  Navigation,
  Globe,
  BookOpen,
  Zap,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const USER_WEBSITE_URL = "http://localhost:5173";
const USER_LOGIN_URL = "http://localhost:5173/login";
const ADMIN_LOGIN_URL = "/login";

const navGroups = [
  {
    label: null,
    items: [{ label: "Dashboard", path: "/", icon: LayoutDashboard }],
  },
  {
    label: "Kelola Konten",
    items: [
      { label: "Destinasi", path: "/destinations", icon: MapPin },
      { label: "Kategori", path: "/categories", icon: Tag },
      { label: "Galeri", path: "/gallery", icon: Images },
      { label: "Homepage Highlight", path: "/highlight", icon: Globe },
      { label: "Panduan Liburan", path: "/travel-guide", icon: BookOpen },
    ],
  },
  {
    label: "Interaksi User",
    items: [
      { label: "Rating & Ulasan", path: "/reviews", icon: MessageSquare },
      { label: "Riwayat Kunjungan", path: "/visits", icon: Navigation },
      { label: "Pengguna", path: "/users", icon: Users },
    ],
  },
  {
    label: "AI Analytics",
    items: [{ label: "Itinerary Logs", path: "/itinerary", icon: Zap }],
  },
];

const getStoredUser = () => {
  try {
    const userRaw = localStorage.getItem("user");
    return userRaw ? JSON.parse(userRaw) : null;
  } catch {
    return null;
  }
};

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

const isAdminUser = (user) => {
  const role = String(user?.role || "").trim().toLowerCase();
  return role === "admin";
};

function SidebarContent({ collapsed, setCollapsed, onNavClick }) {
  const location = useLocation();

  const [adminUser, setAdminUser] = useState({
    nama: "Admin",
    email: "admin@tanjungpinang.id",
    role: "admin",
  });

  useEffect(() => {
    const savedUser = getStoredUser();

    if (savedUser && isAdminUser(savedUser)) {
      setAdminUser({
        nama: savedUser.nama || savedUser.name || "Admin",
        email: savedUser.email || "admin@tanjungpinang.id",
        role: savedUser.role || "admin",
      });
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    sessionStorage.clear();

    /*
      Logout dari dashboard admin.
      Website utama ikut dipaksa logout lewat forceLogout=1.
      Pastikan di website utama sudah ada AdminAccessHandler.
    */
    window.location.replace(`${USER_LOGIN_URL}?forceLogout=1`);
  };

  const handleOpenWebsite = () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const user = getStoredUser();

    if (!token || !user || !isAdminUser(user)) {
      clearAuth();
      sessionStorage.clear();

      alert("Silakan login sebagai admin terlebih dahulu.");

      window.location.replace(USER_LOGIN_URL);
      return;
    }

    const encodedToken = encodeURIComponent(token);
    const encodedRefreshToken = encodeURIComponent(refreshToken || "");
    const encodedUser = encodeURIComponent(JSON.stringify(user));

    /*
      Jangan buka USER_WEBSITE_URL biasa.
      Harus kirim token admin supaya website utama menimpa akun user biasa
      menjadi akun admin.
    */
    const adminAccessUrl = `${USER_WEBSITE_URL}/?adminAccess=1&token=${encodedToken}&refreshToken=${encodedRefreshToken}&user=${encodedUser}`;

    window.open(adminAccessUrl, "_blank");
  };

  const initial = adminUser.nama?.charAt(0)?.toUpperCase() || "A";

  return (
    <div className="flex flex-col h-full">
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="/logo.png"
              alt="TanjungPinang Guide"
              className="w-8 h-8 rounded-lg object-cover shrink-0 border border-gray-100"
            />

            <span className="text-sm font-bold text-gray-800 tracking-tight truncate">
              TanjungPinang Guide
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
        >
          {collapsed ? <Menu size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        <div className="px-2 space-y-0.5">
          {navGroups.map((group) => (
            <div key={group.label || "main"} className="mb-1">
              {group.label && !collapsed && (
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 pt-3 pb-1.5">
                  {group.label}
                </p>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;

                const active =
                  item.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onNavClick}
                    title={collapsed ? item.label : ""}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                      active
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <Icon size={16} className="shrink-0" />

                    {!collapsed && (
                      <span className="font-medium truncate">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </nav>

      <div
        className={cn(
          "border-t border-gray-100 shrink-0",
          collapsed ? "p-2" : "p-3"
        )}
      >
        {!collapsed ? (
          <>
            <button
              type="button"
              onClick={handleOpenWebsite}
              className="w-full mb-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              <ExternalLink size={14} />
              Akses Website
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600 shrink-0">
                {initial}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700 truncate">
                  {adminUser.nama}
                </p>
                <p className="text-[11px] text-gray-400 truncate">
                  {adminUser.email}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
              >
                <LogOut size={14} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleOpenWebsite}
              title="Akses Website"
              className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-colors"
            >
              <ExternalLink size={14} />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    /*
      Dipakai saat admin logout dari website utama.
      Website utama akan redirect ke:
      http://localhost:5174/?logout=1
    */
    const logout = params.get("logout");

    if (logout === "1") {
      clearAuth();
      sessionStorage.clear();

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

      window.location.replace(ADMIN_LOGIN_URL);
      return;
    }

    /*
      Dipakai saat login dari website utama lalu redirect ke dashboard admin:
      http://localhost:5174/?token=...&refreshToken=...&user=...
    */
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const userParam = params.get("user");

    if (token && userParam) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userParam));

        if (!isAdminUser(parsedUser)) {
          clearAuth();
          sessionStorage.clear();
          window.location.replace(USER_LOGIN_URL);
          return;
        }

        localStorage.setItem("token", token);

        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        } else {
          localStorage.removeItem("refreshToken");
        }

        localStorage.setItem("user", JSON.stringify(parsedUser));

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } catch {
        clearAuth();
        sessionStorage.clear();
        window.location.replace(USER_LOGIN_URL);
        return;
      }
    }

    const savedToken = localStorage.getItem("token");
    const savedUser = getStoredUser();

    if (!savedToken || !savedUser || !isAdminUser(savedUser)) {
      clearAuth();
      sessionStorage.clear();
      window.location.replace(USER_LOGIN_URL);
      return;
    }

    setCheckingAuth(false);
  }, []);

  /*
    Ini penting untuk kasus tab admin masih terbuka.
    Saat balik ke tab admin, sistem cek lagi apakah akun masih admin.
    Kalau user biasa login atau token hilang, dashboard admin langsung logout.
  */
  useEffect(() => {
    const checkAdminStillValid = () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = getStoredUser();

      if (!savedToken || !savedUser || !isAdminUser(savedUser)) {
        clearAuth();
        sessionStorage.clear();
        window.location.replace(USER_LOGIN_URL);
      }
    };

    window.addEventListener("focus", checkAdminStillValid);
    window.addEventListener("storage", checkAdminStillValid);

    return () => {
      window.removeEventListener("focus", checkAdminStillValid);
      window.removeEventListener("storage", checkAdminStillValid);
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-sm font-medium text-gray-500">
          Memeriksa akses admin...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-100 shadow-xl transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute top-3 right-3 p-1 rounded-md text-gray-400 hover:text-gray-600 z-10"
        >
          <X size={16} />
        </button>

        <SidebarContent
          collapsed={false}
          setCollapsed={() => {}}
          onNavClick={() => setMobileOpen(false)}
        />
      </aside>

      <aside
        className={cn(
          "hidden md:flex flex-col bg-white border-r border-gray-100 transition-all duration-300 shrink-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onNavClick={() => {}}
        />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden flex items-center gap-3 px-4 h-12 bg-white border-b border-gray-100 shrink-0">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <img
              src="/logo.png"
              alt="TanjungPinang Guide"
              className="w-6 h-6 rounded-md object-cover shrink-0 border border-gray-100"
            />

            <span className="text-sm font-bold text-gray-800 truncate">
              TanjungPinang Guide
            </span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}