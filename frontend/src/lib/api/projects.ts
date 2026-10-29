import { apiFetch } from "./client";
import type {
  Assignment,
  CreateAssignmentInput,
  CreateProjectInput,
  CreateWorkLogInput,
  CreateWorkerInput,
  LabourSummary,
  ProjectDetail,
  ProjectListItem,
  UpdateAssignmentInput,
  UpdateProjectInput,
  UpdateWorkerInput,
  WorkLog,
  Worker,
} from "../types";

export async function fetchProjects(): Promise<ProjectListItem[]> {
  const data = await apiFetch<{ projects: ProjectListItem[] }>(
    "/api/projects/",
  );
  return data.projects;
}

export async function fetchProject(projectId: number): Promise<ProjectDetail> {
  const data = await apiFetch<{ project: ProjectDetail }>(
    `/api/projects/${projectId}/`,
  );
  return data.project;
}

export async function createProject(
  input: CreateProjectInput,
): Promise<ProjectDetail> {
  const data = await apiFetch<{ project: ProjectDetail }>(
    "/api/projects/create/",
    { method: "POST", body: input },
  );
  return data.project;
}

export async function updateProject(
  projectId: number,
  input: UpdateProjectInput,
): Promise<ProjectDetail> {
  const data = await apiFetch<{ project: ProjectDetail }>(
    `/api/projects/${projectId}/update/`,
    { method: "PATCH", body: input },
  );
  return data.project;
}

export async function fetchWorkLogs(): Promise<WorkLog[]> {
  const data = await apiFetch<WorkLog[]>("/api/work-logs/");
  return data;
}

export async function fetchWorkLog(workLogId: number): Promise<WorkLog> {
  const data = await apiFetch<WorkLog>(`/api/work-logs/${workLogId}/`);
  return data;
}

export async function createWorkLog(
  input: CreateWorkLogInput,
): Promise<WorkLog> {
  const data = await apiFetch<WorkLog>("/api/work-logs/", {
    method: "POST",
    body: input,
  });
  return data;
}

export async function fetchWorkers(
  query: Record<string, string | undefined> = {},
): Promise<Worker[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value);
  }
  const suffix = params.toString();
  const data = await apiFetch<Worker[]>(
    `/api/work-logs/workers/${suffix ? `?${suffix}` : ""}`,
  );
  return data;
}

export async function createWorker(input: CreateWorkerInput): Promise<Worker> {
  const data = await apiFetch<Worker>("/api/work-logs/workers/", {
    method: "POST",
    body: input,
  });
  return data;
}

export async function fetchWorker(workerId: number): Promise<Worker> {
  const data = await apiFetch<Worker>(
    `/api/work-logs/workers/${workerId}/`,
  );
  return data;
}

export async function updateWorker(
  workerId: number,
  input: UpdateWorkerInput,
): Promise<Worker> {
  const data = await apiFetch<Worker>(
    `/api/work-logs/workers/${workerId}/`,
    { method: "PATCH", body: input },
  );
  return data;
}

export async function fetchAssignments(): Promise<Assignment[]> {
  const data = await apiFetch<Assignment[]>("/api/work-logs/assignments/");
  return data;
}

export async function createAssignment(
  input: CreateAssignmentInput,
): Promise<Assignment> {
  const data = await apiFetch<Assignment>("/api/work-logs/assignments/", {
    method: "POST",
    body: input,
  });
  return data;
}

export async function fetchAssignment(
  assignmentId: number,
): Promise<Assignment> {
  const data = await apiFetch<Assignment>(
    `/api/work-logs/assignments/${assignmentId}/`,
  );
  return data;
}

export async function updateAssignment(
  assignmentId: number,
  input: UpdateAssignmentInput,
): Promise<Assignment> {
  const data = await apiFetch<Assignment>(
    `/api/work-logs/assignments/${assignmentId}/`,
    { method: "PATCH", body: input },
  );
  return data;
}

export async function fetchLabourSummary(
  projectId: number,
  workDate: string,
): Promise<LabourSummary> {
  const data = await apiFetch<LabourSummary>(
    `/api/work-logs/projects/labour-summary/?project=${projectId}&date=${workDate}`,
  );
  return data;
}
