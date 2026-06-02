import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

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

function SidebarContent({ collapsed, setCollapsed, onNavClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

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

      {/* User / Logout */}
      <div
        className={cn(
          "border-t border-gray-100 shrink-0",
          collapsed ? "p-2" : "p-3"
        )}
      >
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600 shrink-0">
              A
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">
                Admin
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                admin@tanjungpinang.id
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
        ) : (
          <div className="flex justify-center">
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

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);
  }, []);

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
              src="/logo.jpg"
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