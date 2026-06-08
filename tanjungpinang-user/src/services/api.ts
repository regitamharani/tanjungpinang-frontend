const BASE_URL = "http://localhost:3000/api";

type BudgetType = "hemat" | "menengah" | "premium";

type GenerateItineraryPayload = {
  userId: number;
  days: number;
  people: number;
  budgetType: BudgetType;
  interests: string[];
  notes: string;
};

const getToken = () => localStorage.getItem("token");
const getRefreshToken = () => localStorage.getItem("refreshToken");

const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

const safeJson = async (res: Response) => {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!text) {
    return {};
  }

  if (!contentType.includes("application/json")) {
    console.error("Response bukan JSON:", text);

    throw new Error(
      "Backend tidak mengembalikan JSON. Pastikan route API benar dan server Express berjalan di port 3000."
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    console.error("JSON parse error:", text);
    throw new Error("Response backend bukan JSON valid.");
  }
};

const redirectToLogin = () => {
  clearAuth();

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

const request = async (path: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status !== 401) {
    return res;
  }

  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    redirectToLogin();
    return res;
  }

  try {
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshRes.ok) {
      redirectToLogin();
      return res;
    }

    const refreshJson = await safeJson(refreshRes);

    const newToken =
      refreshJson?.data?.token ||
      refreshJson?.token ||
      refreshJson?.accessToken;

    if (!newToken) {
      redirectToLogin();
      return res;
    }

    setToken(newToken);
    headers.Authorization = `Bearer ${newToken}`;

    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    return res;
  } catch (error) {
    console.error("Refresh token error:", error);
    redirectToLogin();
    return res;
  }
};

export const get = (path: string) => {
  return request(path, {
    method: "GET",
  });
};

export const post = (path: string, body: unknown) => {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const put = (path: string, body: unknown) => {
  return request(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
};

export const del = (path: string) => {
  return request(path, {
    method: "DELETE",
  });
};

export const isLoggedIn = () => {
  return Boolean(localStorage.getItem("token") && localStorage.getItem("user"));
};

export const getUser = () => {
  try {
    const user = localStorage.getItem("user");

    if (!user) return null;

    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const logout = () => {
  clearAuth();
  window.location.href = "/login";
};

const handleApiResult = async (res: Response, fallbackMessage: string) => {
  const json = await safeJson(res);

  if (!res.ok || json?.success === false) {
    throw new Error(json?.message || fallbackMessage);
  }

  return json;
};

// ===============================
// AI ITINERARY USER API
// ===============================

export const generateItineraryFromDatabase = async (
  payload: GenerateItineraryPayload
) => {
  const res = await post("/itineraries/generate", payload);

  const json = await handleApiResult(
    res,
    "Gagal membuat itinerary. Coba lagi beberapa saat."
  );

  return json.data;
};

export const getUserItinerariesFromDatabase = async (userId: number) => {
  const res = await get(`/itineraries/user/${userId}`);

  const json = await handleApiResult(
    res,
    "Gagal mengambil riwayat itinerary."
  );

  return json.data || [];
};

export const getItineraryByIdFromDatabase = async (
  id: number | string,
  userId: number
) => {
  const res = await get(`/itineraries/${id}?userId=${userId}`);

  const json = await handleApiResult(
    res,
    "Gagal mengambil detail itinerary."
  );

  return json.data;
};

export const deleteItineraryFromDatabase = async (
  id: number | string,
  userId: number
) => {
  const res = await del(`/itineraries/${id}?userId=${userId}`);

  const json = await handleApiResult(
    res,
    "Gagal menghapus itinerary."
  );

  return json;
};

// ===============================
// AI ITINERARY ADMIN API
// ===============================

export const getAdminItineraryLogs = async () => {
  const res = await get("/itineraries/admin/logs");

  const json = await handleApiResult(
    res,
    "Gagal mengambil itinerary logs."
  );

  return json.data || [];
};