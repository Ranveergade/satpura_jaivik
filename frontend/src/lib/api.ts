const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function fetchProjects() {
  try {
    const res = await fetch(`${API_BASE}/projects/`);
    if (!res.ok) throw new Error("API failed");
    return await res.json();
  } catch (err) {
    return [
      {
        id: "p101",
        project_code: "SJ-PROJ-101",
        title: "Bio-Dynamic Organic Rice & Soil Carbon Regeneration Plot",
        farmer_name: "Rameshwar Patel",
        supervisor_name: "Sunil Yadav",
        land_area_acres: "10.00",
        gps_lat: 22.7512,
        gps_lng: 77.7245,
        crop_type: "Heirloom Champa Rice",
        total_budget: "240000.00",
        allocated_subsidy: "72000.00",
        start_date: "2026-04-15",
        target_completion: "2026-11-30",
        status: "IN_PROGRESS",
      },
      {
        id: "p102",
        project_code: "SJ-PROJ-102",
        title: "Rainfed Kodo Millet & Medicinal Wild Turmeric Unit",
        farmer_name: "Rameshwar Patel",
        supervisor_name: "Sunil Yadav",
        land_area_acres: "4.50",
        gps_lat: 22.6845,
        gps_lng: 77.8102,
        crop_type: "Kodo Millet & Wild Turmeric",
        total_budget: "110000.00",
        allocated_subsidy: "33000.00",
        start_date: "2026-05-01",
        target_completion: "2026-12-15",
        status: "VERIFICATION",
      }
    ];
  }
}

export async function fetchExpenses() {
  try {
    const res = await fetch(`${API_BASE}/expenses/`);
    if (!res.ok) throw new Error("API failed");
    return await res.json();
  } catch (err) {
    return [
      {
        id: "e1",
        project_code: "SJ-PROJ-101",
        submitted_by_name: "Sunil Yadav",
        title: "Drip Irrigation Pipe Lines & Bio-Fertilizer",
        category: "IRRIGATION",
        amount: "28500.00",
        expense_date: "2026-08-12",
        vendor_name: "Satpura Kisan Agri Tech",
        gst_number: "23AAAAA0000A1Z5",
        status: "PAID",
        verification_notes: "GST verified & approved by Admin",
      },
      {
        id: "e2",
        project_code: "SJ-PROJ-101",
        submitted_by_name: "Rameshwar Patel",
        title: "Solar Dewatering Pump Maintenance",
        category: "MACHINERY",
        amount: "14200.00",
        expense_date: "2026-09-02",
        vendor_name: "Narmada Solar Systems",
        gst_number: "23BBBBB1111B2Z8",
        status: "ADMIN_APPROVED",
        verification_notes: "Accounts verified invoice. Ready for bank dispatch.",
      },
      {
        id: "e3",
        project_code: "SJ-PROJ-101",
        submitted_by_name: "Sunil Yadav",
        title: "Labour Payment - Transplanting & Soil Mulching",
        category: "LABOUR",
        amount: "18000.00",
        expense_date: "2026-09-25",
        vendor_name: "Sohagpur Labour Collective",
        gst_number: "N/A",
        status: "ACCOUNTS_VERIFIED",
        verification_notes: "Muster roll verified by Accounts.",
      },
      {
        id: "e4",
        project_code: "SJ-PROJ-101",
        submitted_by_name: "Sunil Yadav",
        title: "Vermicompost & Neem Extract Bio Inputs",
        category: "FERTILIZER",
        amount: "9500.00",
        expense_date: "2026-10-01",
        vendor_name: "Satpura Jaivik Bio Center",
        gst_number: "23CCCCC2222C3Z1",
        status: "SUBMITTED",
        verification_notes: "Pending Accounts review.",
      }
    ];
  }
}

export async function updateExpenseStatus(id: string, newStatus: string, notes: string = "") {
  try {
    const res = await fetch(`${API_BASE}/expenses/${id}/update_status/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, notes }),
    });
    if (!res.ok) throw new Error("API failed");
    return await res.json();
  } catch (err) {
    return { id, status: newStatus, notes };
  }
}

export async function approveExpense(id: string, toStatus: string = "ACCOUNTS_VERIFIED") {
  return updateExpenseStatus(id, toStatus, "Approved");
}

export async function rejectExpense(id: string, reason: string = "Rejected") {
  return updateExpenseStatus(id, "REJECTED", reason);
}

export async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE}/users/`);
    if (!res.ok) throw new Error("API failed");
    return await res.json();
  } catch (err) {
    return [
      { id: "u1", name: "Rameshwar Patel", role: "FARMER", phone: "+91-9876543210", village: "Sohagpur" },
      { id: "u2", name: "Geeta Bai", role: "FARMER", phone: "+91-9876543211", village: "Pipariya" },
      { id: "u3", name: "Sunil Yadav", role: "SUPERVISOR", phone: "+91-9876543212", village: "Hoshangabad" },
      { id: "u4", name: "Rajesh Verma", role: "ACCOUNTS", phone: "+91-9876543213", village: "Hoshangabad" },
      { id: "u5", name: "Dinesh Patel", role: "ADMIN", phone: "+91-9876543214", village: "Bhopal" },
      { id: "u6", name: "Kavita Singh", role: "SUPER_ADMIN", phone: "+91-9876543215", village: "Bhopal" },
    ];
  }
}

export async function fetchWorkLogs() {
  try {
    const res = await fetch(`${API_BASE}/work-logs/`);
    if (!res.ok) throw new Error("API failed");
    return await res.json();
  } catch (err) {
    return [
      {
        id: "w1",
        project_code: "SJ-PROJ-101",
        supervisor_name: "Sunil Yadav",
        log_date: "2026-10-04",
        gps_checkin_lat: 22.7515,
        gps_checkin_lng: 77.7248,
        work_description: "Completed bio-fertilizer application and checked soil moisture sensors across Plot 3.",
        labor_count: 8,
        site_expense_amount: "1200.00",
        is_synced: true,
      }
    ];
  }
}

export async function fetchAuditLogs() {
  try {
    const res = await fetch(`${API_BASE}/audit/`);
    if (!res.ok) throw new Error("API failed");
    return await res.json();
  } catch (err) {
    return [
      {
        id: "a1",
        action: "PROJECT_STATUS_UPDATE",
        entity: "FarmProject",
        user_name: "Sunil Yadav",
        ip_address: "192.168.1.45",
        device_info: "Samsung Galaxy S22 / Satpura PWA App",
        timestamp: "2026-10-06T09:30:00Z",
      },
      {
        id: "a2",
        action: "EXPENSE_ACCOUNTS_VERIFIED",
        entity: "Expense",
        user_name: "Rajesh Verma",
        ip_address: "192.168.1.80",
        device_info: "Chrome Desktop / Web Portal",
        timestamp: "2026-10-06T08:15:00Z",
      }
    ];
  }
}
