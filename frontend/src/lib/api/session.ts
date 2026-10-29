import type { Role, SessionUser } from "../types";
import { ROLES } from "../types";

const ACCESS_KEY = "sj.access";
const REFRESH_KEY = "sj.refresh";
const USER_KEY = "sj.user";

let memoryAccess: string | null = null;
let memoryRefresh: string | null = null;
let memoryUser: SessionUser | null = null;

type SessionListener = () => void;
const sessionListeners = new Set<SessionListener>();

export function subscribeSession(listener: SessionListener): () => void {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

function notifySessionListeners(): void {
  for (const listener of [...sessionListeners]) {
    listener();
  }
}

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage;
}

export function loadSession(): {
  access: string | null;
  refresh: string | null;
  user: SessionUser | null;
} {
  const store = storage();
  if (!store) {
    return { access: memoryAccess, refresh: memoryRefresh, user: memoryUser };
  }
  memoryAccess = store.getItem(ACCESS_KEY);
  memoryRefresh = store.getItem(REFRESH_KEY);
  const raw = store.getItem(USER_KEY);
  memoryUser = parseUser(raw);
  return { access: memoryAccess, refresh: memoryRefresh, user: memoryUser };
}

export function getAccessToken(): string | null {
  if (memoryAccess) return memoryAccess;
  return loadSession().access;
}

export function getRefreshToken(): string | null {
  if (memoryRefresh) return memoryRefresh;
  return loadSession().refresh;
}

export function getSessionUser(): SessionUser | null {
  if (memoryUser) return memoryUser;
  return loadSession().user;
}

export function setTokens(access: string, refresh?: string | null): void {
  memoryAccess = access;
  const store = storage();
  store?.setItem(ACCESS_KEY, access);
  if (typeof refresh === "string") {
    memoryRefresh = refresh;
    store?.setItem(REFRESH_KEY, refresh);
  }
}

export function setSessionUser(user: SessionUser): void {
  memoryUser = user;
  storage()?.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  memoryAccess = null;
  memoryRefresh = null;
  memoryUser = null;
  const store = storage();
  store?.removeItem(ACCESS_KEY);
  store?.removeItem(REFRESH_KEY);
  store?.removeItem(USER_KEY);
  notifySessionListeners();
}

function parseUser(raw: string | null): SessionUser | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { username?: unknown; role?: unknown };
    if (typeof parsed.username !== "string") return null;
    if (typeof parsed.role !== "string") return null;
    if (!ROLES.includes(parsed.role as Role)) return null;
    return { username: parsed.username, role: parsed.role as Role };
  } catch {
    return null;
  }
}
