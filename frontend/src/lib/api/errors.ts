export type FieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;
  readonly fieldErrors: FieldErrors;

  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
    this.fieldErrors = extractFieldErrors(body);
  }
}

export class NetworkError extends Error {
  constructor(message = "Network request failed.") {
    super(message);
    this.name = "NetworkError";
  }
}

export function extractMessage(body: unknown, fallback: string): string {
  if (typeof body === "string" && body.trim()) return body;
  if (!body || typeof body !== "object") return fallback;
  const record = body as Record<string, unknown>;
  if (typeof record.error === "string") return record.error;
  if (typeof record.detail === "string") return record.detail;
  if (Array.isArray(record.detail) && record.detail.length) {
    return String(record.detail[0]);
  }
  if (typeof record.message === "string") return record.message;
  if (Array.isArray(record.non_field_errors) && record.non_field_errors.length) {
    return String(record.non_field_errors[0]);
  }
  return fallback;
}

function extractFieldErrors(body: unknown): FieldErrors {
  if (!body || typeof body !== "object" || Array.isArray(body)) return {};
  const result: FieldErrors = {};
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    if (key === "error" || key === "detail" || key === "message") continue;
    if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
      result[key] = value as string[];
    } else if (typeof value === "string") {
      result[key] = [value];
    }
  }
  return result;
}

export function statusFallback(status: number): string {
  if (status === 400) return "The request was invalid.";
  if (status === 401) return "Please sign in again.";
  if (status === 403) return "You do not have permission to do that.";
  if (status === 404) return "The requested record was not found.";
  if (status === 409) return "This record already exists.";
  if (status === 429) return "Too many attempts. Please wait and try again.";
  if (status === 503) return "The service is temporarily unavailable.";
  if (status >= 500) return "The server encountered an error.";
  return `Request failed (${status}).`;
}
