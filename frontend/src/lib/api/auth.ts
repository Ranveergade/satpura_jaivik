import { apiFetch } from "./client";
import type {
  LoginChallenge,
  VerifyResponse,
} from "../types";

export async function startAuthCsrf(): Promise<void> {
  await apiFetch<{ message?: string }>("/api/accounts/csrf/", {
    method: "GET",
  });
}

export async function apiLogin(
  username: string,
  password: string,
): Promise<LoginChallenge> {
  const data = await apiFetch<LoginChallenge>("/api/accounts/login/", {
    method: "POST",
    auth: false,
    body: { username, password },
  });
  return data;
}

export async function apiVerifyOtp(
  challengeId: number,
  otp: string,
): Promise<VerifyResponse> {
  const data = await apiFetch<VerifyResponse>("/api/accounts/verify-otp/", {
    method: "POST",
    auth: false,
    body: { challenge_id: challengeId, otp },
  });
  return data;
}

export async function apiLogout(refresh: string): Promise<{ message: string }> {
  const data = await apiFetch<{ message: string }>(
    "/api/accounts/logout/",
    {
      method: "POST",
      body: { refresh },
    },
  );
  return data;
}
