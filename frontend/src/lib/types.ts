export const ROLES = [
  "SUPER_ADMINISTRATOR",
  "ADMINISTRATOR",
  "ACCOUNTS",
  "SUPERVISOR",
  "FARMER",
  "MANAGEMENT",
] as const;

export type Role = (typeof ROLES)[number];

export const PROJECT_STATUSES = [
  "PLANNED",
  "IN_PROGRESS",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const ATTENDANCE_STATUSES = ["PRESENT", "ABSENT", "HALF_DAY"] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export const EXPENSE_CATEGORIES = [
  "LABOUR",
  "MATERIALS",
  "TRANSPORT",
  "EQUIPMENT",
  "SEEDS_AND_FERTILIZERS",
  "OTHER",
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const EXPENSE_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;
export type ExpenseStatus = (typeof EXPENSE_STATUSES)[number];

export type SessionUser = {
  username: string;
  role: Role;
};

export type LoginChallenge = {
  message: string;
  challenge_id: number;
  expires_in_seconds: number;
};

export type VerifyResponse = {
  message: string;
  username: string;
  role: Role;
  refresh: string;
  access: string;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type ProjectListItem = {
  id: number;
  farmer: string;
  supervisor: string;
  crop_type: string;
  status: ProjectStatus;
  project_budget: string;
};

export type ProjectDetail = {
  id: number;
  farmer: string;
  supervisor: string;
  land_details: string;
  land_area: string;
  latitude: string | null;
  longitude: string | null;
  crop_type: string;
  project_budget: string;
  subsidy_amount: string;
  loan_amount: string;
  start_date: string;
  estimated_completion_date: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
};

export type WorkLog = {
  id: number;
  project: number;
  supervisor: string;
  work_date: string;
  activities: string;
  laborers_present: number;
  observations: string;
  check_in_latitude: string | null;
  check_in_longitude: string | null;
  created_at: string;
  updated_at: string;
};

export type Worker = {
  id: number;
  name: string;
  phone_number: string;
  skill: string;
  daily_wage: string;
  is_active: boolean;
  created_by: number;
  created_by_username: string;
  created_at: string;
  updated_at: string;
};

export type Assignment = {
  id: number;
  project: number;
  project_name: string;
  worker: number;
  worker_name: string;
  assigned_by: number;
  assigned_by_username: string;
  start_date: string;
  end_date: string | null;
  agreed_daily_wage: string;
  is_active: boolean;
  created_at: string;
};

export type Attendance = {
  id: number;
  work_log: number;
  worker: number | null;
  worker_name: string;
  status: AttendanceStatus;
  recorded_by: string;
  created_at: string;
};

export type Expense = {
  id: number;
  project: number;
  submitted_by: string;
  amount: string;
  category: ExpenseCategory;
  description: string;
  expense_date: string;
  status: ExpenseStatus;
  reviewed_by: string | null;
  review_note: string;
  created_at: string;
  updated_at: string;
};

export type FarmerProfile = {
  id: number;
  user: number;
  username: string;
  email: string;
  phone_number: string;
  address: string;
  village: string;
  date_of_birth: string | null;
  emergency_contact: string;
  created_at: string;
  updated_at: string;
};

export type AuditLog = {
  id: number;
  user_id: number | null;
  username: string | null;
  action: string;
  entity_type: string;
  record_id: string;
  timestamp: string;
  ip_address: string | null;
  user_agent: string;
  changes: Record<string, unknown>;
};

export type AuditPage = {
  count: number;
  total_pages: number;
  current_page: number;
  results: AuditLog[];
};

export type LabourSummary = {
  project_id: number;
  work_date: string;
  present_count: number;
  half_day_count: number;
  absent_count: number;
  total_recorded: number;
  labour_cost: string;
};

export type CreateProjectInput = {
  farmer_id: number;
  supervisor_id: number;
  land_details: string;
  land_area: string;
  crop_type: string;
  project_budget: string;
  subsidy_amount?: string;
  loan_amount?: string;
  start_date: string;
  estimated_completion_date: string;
  latitude?: string | null;
  longitude?: string | null;
};

export type UpdateProjectInput = Partial<Omit<CreateProjectInput, "farmer_id" | "supervisor_id">> & {
  status?: ProjectStatus;
};

export type CreateWorkerInput = {
  name: string;
  phone_number: string;
  skill?: string;
  daily_wage: string;
  is_active?: boolean;
};

export type UpdateWorkerInput = Partial<Omit<CreateWorkerInput, "name">>;

export type CreateAssignmentInput = {
  project: number;
  worker: number;
  start_date: string;
  end_date?: string | null;
  agreed_daily_wage: string;
};

export type UpdateAssignmentInput = Partial<
  Omit<CreateAssignmentInput, "project" | "worker">
>;

export type CreateWorkLogInput = {
  project: number;
  work_date: string;
  activities: string;
  laborers_present: number;
  observations?: string;
  check_in_latitude?: string | null;
  check_in_longitude?: string | null;
};

export type CreateExpenseInput = {
  project: number;
  amount: string;
  category: ExpenseCategory;
  description: string;
  expense_date: string;
};

export type ReviewExpenseInput = {
  decision: "APPROVED" | "REJECTED";
  review_note?: string;
};
