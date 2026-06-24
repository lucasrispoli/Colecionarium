import Cookies from "js-cookie";
import { API_URL, CLIENT_ID, CLIENT_SECRET } from "./api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

function getToken(): string | undefined {
  return Cookies.get("accessToken");
}

function getRefreshToken(): string | undefined {
  return Cookies.get("refreshToken");
}

function saveTokens(accessToken: string, refreshToken: string) {
  Cookies.set("accessToken", accessToken, { secure: true, sameSite: "strict" });
  Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "strict" });
}

function clearTokens() {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Refresh-Token": refreshToken,
        "X-Client-Id": CLIENT_ID,
        "X-Client-Secret": CLIENT_SECRET,
      },
    });

    if (!res.ok) {
      clearTokens();
      return false;
    }

    const data = await res.json();
    saveTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

export async function http<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, requireAuth = true } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Client-Id": CLIENT_ID,
    "X-Client-Secret": CLIENT_SECRET,
    ...headers,
  };

  if (requireAuth) {
    const token = getToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  let res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && requireAuth) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = getToken();
      if (newToken) {
        requestHeaders["Authorization"] = `Bearer ${newToken}`;
        res = await fetch(`${API_URL}${endpoint}`, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
        });
      }
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw {
      status: res.status,
      title: error.title || "Request failed",
      fields: error.fields || [],
    };
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}
