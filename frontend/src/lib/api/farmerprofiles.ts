import { apiFetch } from "./client";
import type { FarmerProfile } from "../types";

export type CreateFarmerProfileInput = {
  user: number;
  phone_number: string;
  address: string;
  village: string;
  date_of_birth?: string | null;
  emergency_contact?: string;
};

export type UpdateFarmerProfileInput = Partial<
  Omit<CreateFarmerProfileInput, "user">
>;

export async function fetchFarmerProfiles(): Promise<FarmerProfile[]> {
  const data = await apiFetch<FarmerProfile[]>(
    "/api/accounts/farmer-profiles/",
  );
  return data;
}

export async function fetchFarmerProfile(
  farmerProfileId: number,
): Promise<FarmerProfile> {
  const data = await apiFetch<FarmerProfile>(
    `/api/accounts/farmer-profiles/${farmerProfileId}/`,
  );
  return data;
}

export async function createFarmerProfile(
  input: CreateFarmerProfileInput,
): Promise<FarmerProfile> {
  const data = await apiFetch<FarmerProfile>(
    "/api/accounts/farmer-profiles/",
    { method: "POST", body: input },
  );
  return data;
}

export async function updateFarmerProfile(
  farmerProfileId: number,
  input: UpdateFarmerProfileInput,
): Promise<FarmerProfile> {
  const data = await apiFetch<FarmerProfile>(
    `/api/accounts/farmer-profiles/${farmerProfileId}/`,
    { method: "PATCH", body: input },
  );
  return data;
}
