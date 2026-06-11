import { useEffect } from "react";

export default function AdminAccessHandler() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const forceLogout = params.get("forceLogout");
    const adminAccess = params.get("adminAccess");
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const userParam = params.get("user");

    if (forceLogout === "1") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("favorit");
      localStorage.removeItem("dilihat");

      sessionStorage.clear();

      window.dispatchEvent(new Event("authChanged"));
      window.dispatchEvent(new Event("storage"));

      window.history.replaceState({}, document.title, "/login");
      window.location.replace("/login");
      return;
    }

    if (adminAccess !== "1") {
      return;
    }

    if (!token || !userParam) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      window.location.replace("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(decodeURIComponent(userParam));
      const role = String(parsedUser.role || "").trim().toLowerCase();

      if (role !== "admin") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        window.location.replace("/login");
        return;
      }

      localStorage.setItem("token", token);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        localStorage.removeItem("refreshToken");
      }

      localStorage.setItem("user", JSON.stringify(parsedUser));

      window.dispatchEvent(new Event("authChanged"));
      window.dispatchEvent(new Event("storage"));

      window.history.replaceState({}, document.title, window.location.pathname);

      window.location.reload();
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      window.location.replace("/login");
    }
  }, []);

  return null;
}