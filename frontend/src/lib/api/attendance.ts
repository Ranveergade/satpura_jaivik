import { apiFetch } from "./client";
import type { Attendance } from "../types";

export async function fetchAttendance(): Promise<Attendance[]> {
  const data = await apiFetch<Attendance[]>("/api/work-logs/attendance/");
  return data;
}

export async function createAttendance(input: {
  work_log: number;
  worker: number;
  status: "PRESENT" | "ABSENT" | "HALF_DAY";
}): Promise<Attendance> {
  const data = await apiFetch<Attendance>("/api/work-logs/attendance/", {
    method: "POST",
    body: input,
  });
  return data;
}
