import {
  ApiError,
  NetworkError,
  extractMessage,
  statusFallback,
} from "./errors";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearSession,
} from "./session";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "/backend").replace(
  /\/+$/,
  "",
);
const CSRF_HEADER = "X-CSRFToken";
const TIMEOUT_MS = 15000;

let refreshAccessTokenPromise: Promise<string | null> | null = null;

async function readCookie(name: string): Promise<string> {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!match) return "";
  const value = match.slice(name.length + 1);
  return decodeURIComponent(value);
}

async function ensureCsrfToken(): Promise<void> {
  if (await readCookie("csrftoken")) return;
  await apiFetch<{ message?: string }>("/api/accounts/csrf/", {
    method: "GET",
  });
}

async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function refreshAccessToken(): Promise<string | null> {
  if (!refreshAccessTokenPromise) {
    refreshAccessTokenPromise = (async () => {
      const refresh = getRefreshToken();
      if (!refresh) {
        clearSession();
        return null;
      }
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
        const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
          credentials: "same-origin",
          signal: controller.signal,
        });
        clearTimeout(timer);
        const data = (await response
          .json()
          .catch(() => null)) as { access?: string; refresh?: string } | null;
        if (response.ok && data?.access) {
          setTokens(data.access, data.refresh ?? refresh);
          return data.access;
        }
        clearSession();
        return null;
      } catch {
        clearSession();
        return null;
      } finally {
        refreshAccessTokenPromise = null;
      }
    })();
  }
  return refreshAccessTokenPromise;
}

export type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const performRequest = async (
    token: string | null,
  ): Promise<Response> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    if (method !== "GET") {
      const csrf = await readCookie("csrftoken");
      if (csrf) {
        headers[CSRF_HEADER] = csrf;
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(
        `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
        {
          method,
          headers,
          body: method === "GET" ? undefined : JSON.stringify(body ?? null),
          signal: controller.signal,
          credentials: "same-origin",
        },
      );
      return response;
    } catch (caught) {
      if (caught instanceof NetworkError) throw caught;
      if (
        typeof caught === "object" &&
        caught !== null &&
        "name" in caught &&
        (caught as { name?: unknown }).name === "AbortError"
      ) {
        throw new NetworkError("The request timed out. Please try again.");
      }
      throw new NetworkError();
    } finally {
      clearTimeout(timer);
    }
  };

  if (method !== "GET") {
    await ensureCsrfToken();
  }

  let token = auth ? getAccessToken() : null;
  let response = await performRequest(token);

  if (response.status === 401 && token) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      token = newAccess;
      response = await performRequest(token);
    }
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data,
      extractMessage(data, statusFallback(response.status)),
    );
  }

  return data as T;
}
