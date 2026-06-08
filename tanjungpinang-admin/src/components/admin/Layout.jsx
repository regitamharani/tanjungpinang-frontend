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
const USER_LOGIN_URL = "http://localhost:5173/login?logout=1";

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

function SidebarContent({ collapsed, setCollapsed, onNavClick }) {
  const location = useLocation();

  const [adminUser, setAdminUser] = useState({
    nama: "Admin",
    email: "admin@tanjungpinang.id",
    role: "admin",
  });

  useEffect(() => {
    const savedUser = getStoredUser();

    if (savedUser) {
      setAdminUser({
        nama: savedUser.nama || "Admin",
        email: savedUser.email || "admin@tanjungpinang.id",
        role: savedUser.role || "admin",
      });
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    sessionStorage.clear();

    window.location.replace(USER_LOGIN_URL);
  };

  const handleOpenWebsite = () => {
    window.open(USER_WEBSITE_URL, "_blank", "noopener,noreferrer");
  };

  const initial = adminUser.nama?.charAt(0)?.toUpperCase() || "A";

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
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

      {/* Nav */}
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

      {/* Website Access + User / Logout */}
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

    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const userParam = params.get("user");

    if (token && userParam) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userParam));
        const role = String(parsedUser.role || "").trim().toLowerCase();

        if (role !== "admin") {
          clearAuth();
          window.location.replace(USER_LOGIN_URL);
          return;
        }

        localStorage.setItem("token", token);

        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        localStorage.setItem("user", JSON.stringify(parsedUser));

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } catch {
        clearAuth();
        window.location.replace(USER_LOGIN_URL);
        return;
      }
    }

    const savedToken = localStorage.getItem("token");
    const savedUser = getStoredUser();

    if (!savedToken || !savedUser) {
      clearAuth();
      window.location.replace(USER_LOGIN_URL);
      return;
    }

    const role = String(savedUser.role || "").trim().toLowerCase();

    if (role !== "admin") {
      clearAuth();
      window.location.replace(USER_LOGIN_URL);
      return;
    }

    setCheckingAuth(false);
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

      {/* Mobile drawer */}
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

      {/* Desktop sidebar */}
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

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top navbar */}
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