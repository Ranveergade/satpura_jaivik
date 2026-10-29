"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { LoginChallenge, SessionUser, VerifyResponse } from "./types";
import {
  clearSession,
  getRefreshToken,
  loadSession,
  setSessionUser,
  setTokens,
  subscribeSession,
} from "./api/session";
import { apiLogin, apiLogout, apiVerifyOtp } from "./api/auth";

const CHALLENGE_KEY = "sj.challenge";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: SessionUser | null;
  status: AuthStatus;
  pendingChallengeId: number | null;
  beginChallenge: (challengeId: number) => void;
  clearChallenge: () => void;
  signInWithPassword: (
    username: string,
    password: string,
  ) => Promise<LoginChallenge>;
  verifyOtp: (challengeId: number, otp: string) => Promise<VerifyResponse>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredChallengeId(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CHALLENGE_KEY);
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function storeChallengeId(challengeId: number): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CHALLENGE_KEY, String(challengeId));
  } catch {
    // Storage may be unavailable; challenge flow still works in memory.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [pendingChallengeId, setPendingChallengeId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const syncSession = () => {
      const session = loadSession();
      setUser(session.user);
      setStatus(session.user ? "authenticated" : "unauthenticated");
    };

    setPendingChallengeId(readStoredChallengeId());
    syncSession();
    return subscribeSession(syncSession);
  }, []);

  const beginChallenge = useCallback((challengeId: number) => {
    setPendingChallengeId(challengeId);
    storeChallengeId(challengeId);
  }, []);

  const clearChallenge = useCallback(() => {
    setPendingChallengeId(null);
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.removeItem(CHALLENGE_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  const signInWithPassword = useCallback(
    async (username: string, password: string) => {
      const challenge = await apiLogin(username, password);
      beginChallenge(challenge.challenge_id);
      return challenge;
    },
    [beginChallenge],
  );

  const verifyOtp = useCallback(
    async (challengeId: number, otp: string) => {
      const response = await apiVerifyOtp(challengeId, otp);
      setTokens(response.access, response.refresh);
      const sessionUser: SessionUser = {
        username: response.username,
        role: response.role,
      };
      setSessionUser(sessionUser);
      setUser(sessionUser);
      setStatus("authenticated");
      return response;
    },
    [],
  );

  const signOut = useCallback(async () => {
    const refresh = getRefreshToken();
    try {
      if (refresh) {
        await apiLogout(refresh);
      }
    } catch {
      // Local sign-out must proceed even if the server call fails.
    } finally {
      clearSession();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      pendingChallengeId,
      beginChallenge,
      clearChallenge,
      signInWithPassword,
      verifyOtp,
      signOut,
    }),
    [
      user,
      status,
      pendingChallengeId,
      beginChallenge,
      clearChallenge,
      signInWithPassword,
      verifyOtp,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
