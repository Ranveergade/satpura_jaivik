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

export type Language = "en" | "hi";

type Dictionary = Record<string, string>;

const dictionaries: Record<Language, Dictionary> = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.projects": "Projects",
    "nav.workers": "Workers",
    "nav.assignments": "Assignments",
    "nav.workLogs": "Work Logs",
    "nav.attendance": "Attendance",
    "nav.expenses": "Expenses",
    "nav.auditLogs": "Audit Logs",
    "nav.farmerProfiles": "Farmer Profiles",

    "common.loading": "Loading…",
    "common.error": "Something went wrong.",
    "common.empty": "Nothing to show yet.",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.retry": "Retry",
    "common.back": "Back",
    "common.actions": "Actions",
    "common.logout": "Log out",
    "common.saving": "Saving…",
    "common.required": "This field is required.",
    "common.all": "All",
    "common.active": "Active",
    "common.inactive": "Inactive",
    "common.project": "Project",
    "common.amount": "Amount",
    "common.category": "Category",
    "common.date": "Date",
    "common.description": "Description",
    "common.status": "Status",
    "common.worker": "Worker",
    "common.start": "Start",
    "common.end": "End",
    "common.wage": "Wage",
    "common.page": "Page",
    "common.of": "of",
    "common.previous": "Previous",
    "common.next": "Next",
    "common.changes": "Changes",
    "common.view": "View",
    "common.system": "system",
    "common.accountId": "account ID",
    "common.latitude": "Latitude",
    "common.longitude": "Longitude",
    "common.optional": "optional",
    "common.perDay": "/ day",
    "common.confirm": "Confirm",

    "auth.loginTitle": "Satpura Jaivik Sign In",
    "auth.loginSubtitle":
      "Farmer Producer Company transparency and project management.",
    "auth.loginUsername": "Username",
    "auth.loginPassword": "Password",
    "auth.loginSubmit": "Send OTP",
    "auth.loginErrorInvalid": "Invalid username or password.",
    "auth.verifyTitle": "Verify OTP",
    "auth.verifySubtitle": "Enter the six-digit code sent to your email.",
    "auth.verifyOtp": "OTP code",
    "auth.verifySubmit": "Verify and sign in",
    "auth.verifyErrorInvalid": "Invalid or expired OTP.",
    "auth.verifyErrorUsed": "This OTP has already been used.",
    "auth.verifyErrorAttempts": "Too many incorrect attempts. Request a new OTP.",
    "auth.verifyErrorInactive": "This account is inactive.",
    "auth.verifySubmitting": "Verifying…",
    "auth.backToLogin": "Back to sign in",

    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Overview of live platform activity.",
    "dashboard.welcome": "Welcome",
    "dashboard.statProjects": "Projects",
    "dashboard.statWorkLogs": "Work Logs",
    "dashboard.statAttendance": "Attendance",
    "dashboard.statExpenses": "Expenses",
    "dashboard.statPendingReviews": "Pending Reviews",
    "dashboard.statAuditLogs": "Audit Events",

    "projects.title": "Projects",
    "projects.new": "New Project",
    "projects.edit": "Edit Project",
    "projects.farmer": "Farmer",
    "projects.supervisor": "Supervisor",
    "projects.landDetails": "Land details",
    "projects.landArea": "Land area",
    "projects.cropType": "Crop type",
    "projects.projectBudget": "Project budget",
    "projects.subsidyAmount": "Subsidy amount",
    "projects.loanAmount": "Loan amount",
    "projects.startDate": "Start date",
    "projects.estimatedCompletionDate": "Estimated completion",
    "projects.status": "Status",
    "projects.required": "This field is required.",
    "projects.save": "Create project",
    "projects.update": "Save changes",

    "worklogs.activities": "Activities",
    "worklogs.observations": "Observations",
    "worklogs.workDate": "Work date",
    "worklogs.laborersPresent": "Laborers present",

    "attendance.statusPresent": "Present",
    "attendance.statusAbsent": "Absent",
    "attendance.statusHalfDay": "Half Day",

    "expenses.statusPending": "Pending",
    "expenses.statusApproved": "Approved",
    "expenses.statusRejected": "Rejected",
    "expenses.title": "Expenses",
    "expenses.new": "New Expense",
    "expenses.submit": "Submit expense",
    "expenses.review": "Review expense",
    "expenses.reviewNote": "Review note",
    "expenses.decisionApprove": "Approve",
    "expenses.decisionReject": "Reject",
    "expenses.cannotReviewOwn": "You cannot review your own expense.",

    "auditlogs.title": "Audit Logs",
    "auditlogs.action": "Action",
    "auditlogs.entity": "Entity",
    "auditlogs.record": "Record",
    "auditlogs.user": "User",
    "auditlogs.timestamp": "Timestamp",
    "auditlogs.events": "events",
    "auditlogs.changes": "Changes",
    "auditlogs.view": "View",
    "auditlogs.system": "system",
    "auditlogs.previous": "Previous",
    "auditlogs.next": "Next",

    "projects.visibleSubtitle": "Projects visible to your role.",
    "projects.farmerSelect": "Select a farmer",
    "projects.locked":
      "Farmer and supervisor cannot be changed after creation.",
    "projects.hectares": "hectares",
    "projects.status.PLANNED": "Planned",
    "projects.status.IN_PROGRESS": "In Progress",
    "projects.status.ON_HOLD": "On Hold",
    "projects.status.COMPLETED": "Completed",
    "projects.status.CANCELLED": "Cancelled",
    "dashboard.pending": "Pending",

    "workers.new": "New Worker",
    "workers.noSkill": "No skill recorded",
    "workers.name": "Name",
    "workers.phone": "Phone number",
    "workers.skill": "Skill",
    "workers.dailyWage": "Daily wage",
    "workers.activeLabel": "Active worker",

    "assignments.new": "New Assignment",
    "assignments.assignedBy": "Assigned by",
    "assignments.selectProject": "Select a project",
    "assignments.selectWorker": "Select a worker",
    "assignments.startDate": "Start date",
    "assignments.endDate": "End date (optional)",
    "assignments.agreedWage": "Agreed daily wage",

    "worklogs.new": "New Work Log",
    "worklogs.workers": "workers",
    "worklogs.emptyMessage":
      "Work logs appear here when supervisors record daily activity.",
    "worklogs.supervisor": "Supervisor",
    "worklogs.checkInLatitude": "Check-in latitude (optional)",
    "worklogs.checkInLongitude": "Check-in longitude (optional)",
    "worklogs.checkInPair": "Provide both coordinates or neither.",
    "worklogs.workLog": "Work Log",

    "attendance.record": "Record Attendance",
    "attendance.workLog": "Work log",
    "attendance.recordedBy": "Recorded by",
    "attendance.recordedAt": "Recorded at",
    "attendance.emptyMessage":
      "Attendance appears here once supervisors record it.",
    "attendance.selectWorkLog": "Select a work log",
    "attendance.selectWorker": "Select a worker",

    "expenses.expense": "Expense",
    "expenses.projectNumber": "Project",
    "expenses.amountLabel": "Amount (₹)",
    "expenses.expenseDate": "Expense date",
    "expenses.submittedBy": "Submitted by",
    "expenses.reviewedBy": "Reviewed by",
    "expenses.rejectReasonRequired":
      "A reason is required when rejecting an expense.",
    "expenses.reviewPlaceholder": "Required when rejecting.",
    "expenses.approvedMessage": "Expense approved.",
    "expenses.rejectedMessage": "Expense rejected.",
    "expenses.alreadyReviewed":
      "This expense is already decided and cannot be reviewed again.",
    "expenses.notFound":
      "Expense was not found or is not visible to your role.",
    "expenses.category.LABOUR": "Labour",
    "expenses.category.MATERIALS": "Materials",
    "expenses.category.TRANSPORT": "Transport",
    "expenses.category.EQUIPMENT": "Equipment",
    "expenses.category.SEEDS_AND_FERTILIZERS": "Seeds and fertilizers",
    "expenses.category.OTHER": "Other",

    "farmers.new": "New Profile",
    "farmers.newTitle": "New Farmer Profile",
    "farmers.accountId": "Farmer account ID",
    "farmers.phone": "Phone number",
    "farmers.village": "Village",
    "farmers.address": "Address",
    "farmers.dob": "Date of birth (optional)",
    "farmers.emergency": "Emergency contact (optional)",
    "farmers.emptyMessage":
      "Farmer profiles appear here once they are created.",
  },
  hi: {
    "nav.dashboard": "डैशबोर्ड",
    "nav.projects": "परियोजनाएँ",
    "nav.workers": "मजदूर",
    "nav.assignments": "असाइनमेंट",
    "nav.workLogs": "वर्क लॉग",
    "nav.attendance": "उपस्थिति",
    "nav.expenses": "खर्च",
    "nav.auditLogs": "ऑडिट लॉग",
    "nav.farmerProfiles": "किसान प्रोफाइल",

    "common.loading": "लोड हो रहा है…",
    "common.error": "कुछ गड़बड़ हो गई।",
    "common.empty": "अभी कुछ नहीं दिखाई देता।",
    "common.save": "सहेजें",
    "common.cancel": "रद्द करें",
    "common.retry": "पुनः प्रयास करें",
    "common.back": "वापस",
    "common.actions": "कार्य",
    "common.logout": "लॉग आउट",
    "common.saving": "सहेज रहे हैं…",
    "common.required": "यह फील्ड आवश्यक है।",
    "common.all": "सभी",
    "common.active": "सक्रिय",
    "common.inactive": "निष्क्रिय",
    "common.project": "परियोजना",
    "common.amount": "राशि",
    "common.category": "श्रेणी",
    "common.date": "तिथि",
    "common.description": "विवरण",
    "common.status": "स्थिति",
    "common.worker": "मजदूर",
    "common.start": "प्रारंभ",
    "common.end": "समाप्ति",
    "common.wage": "मजदूरी",
    "common.page": "पृष्ठ",
    "common.of": "में से",
    "common.previous": "पिछला",
    "common.next": "अगला",
    "common.changes": "परिवर्तन",
    "common.view": "देखें",
    "common.system": "सिस्टम",
    "common.accountId": "खाता आईडी",
    "common.latitude": "अक्षांश",
    "common.longitude": "देशांतर",
    "common.optional": "वैकल्पिक",
    "common.perDay": "/ दिन",
    "common.confirm": "पुष्टि करें",

    "auth.loginTitle": "सत्पुरा जैविक साइन इन",
    "auth.loginSubtitle":
      "किसान उत्पादक कंपनी की पारदर्शिता और परियोजना प्रबंधन।",
    "auth.loginUsername": "उपयोगकर्ता नाम",
    "auth.loginPassword": "पासवर्ड",
    "auth.loginSubmit": "OTP भेजें",
    "auth.loginErrorInvalid": "अमान्य उपयोगकर्ता नाम या पासवर्ड।",
    "auth.verifyTitle": "OTP सत्यापित करें",
    "auth.verifySubtitle": "अपने ईमेल पर भेजा गया छह-अंकीय कोड दर्ज करें।",
    "auth.verifyOtp": "OTP कोड",
    "auth.verifySubmit": "सत्यापित करें और साइन इन करें",
    "auth.verifyErrorInvalid": "अमान्य या समय-सीमा पूरी OTP।",
    "auth.verifyErrorUsed": "यह OTP पहले से उपयोग हो चुका है।",
    "auth.verifyErrorAttempts":
      "बहुत अधिक गलत प्रयास। नया OTP मांगें।",
    "auth.verifyErrorInactive": "यह खाता निष्क्रिय है।",
    "auth.verifySubmitting": "सत्यापित कर रहे हैं…",
    "auth.backToLogin": "साइन इन पर वापस",

    "dashboard.title": "डैशबोर्ड",
    "dashboard.subtitle": "लाइव प्लेटफॉर्म गतिविधि का अवलोकन।",
    "dashboard.welcome": "स्वागत है",
    "dashboard.statProjects": "परियोजनाएँ",
    "dashboard.statWorkLogs": "वर्क लॉग",
    "dashboard.statAttendance": "उपस्थिति",
    "dashboard.statExpenses": "खर्च",
    "dashboard.statPendingReviews": "पेंडिंग समीक्षाएँ",
    "dashboard.statAuditLogs": "ऑडिट घटनाएँ",

    "projects.title": "परियोजनाएँ",
    "projects.new": "नई परियोजना",
    "projects.edit": "परियोजना संपादित करें",
    "projects.farmer": "किसान",
    "projects.supervisor": "पर्यवेक्षक",
    "projects.landDetails": "भूमि विवरण",
    "projects.landArea": "भूमि क्षेत्र",
    "projects.cropType": "फसल प्रकार",
    "projects.projectBudget": "परियोजना बजट",
    "projects.subsidyAmount": "सब्सिडी राशि",
    "projects.loanAmount": "ऋण राशि",
    "projects.startDate": "प्रारंभ तिथि",
    "projects.estimatedCompletionDate": "अनुमानित समापन",
    "projects.status": "स्थिति",
    "projects.required": "यह फील्ड आवश्यक है।",
    "projects.save": "परियोजना बनाएँ",
    "projects.update": "परिवर्तन सहेजें",

    "worklogs.activities": "गतिविधियाँ",
    "worklogs.observations": "अवलोकन",
    "worklogs.workDate": "काम की तिथि",
    "worklogs.laborersPresent": "मजदूर उपलब्ध",

    "attendance.statusPresent": "हाँ",
    "attendance.statusAbsent": "नहीं",
    "attendance.statusHalfDay": "आधा दिन",

    "expenses.statusPending": "पेंडिंग",
    "expenses.statusApproved": "स्वीकृत",
    "expenses.statusRejected": "अस्वीकृत",
    "expenses.title": "खर्च",
    "expenses.new": "नया खर्च",
    "expenses.submit": "खर्च सबमिट करें",
    "expenses.review": "खर्च समीक्षा करें",
    "expenses.reviewNote": "समीक्षा नोट",
    "expenses.decisionApprove": "स्वीकृत करें",
    "expenses.decisionReject": "अस्वीकृत करें",
    "expenses.cannotReviewOwn": "आप अपना खर्च समीक्षा नहीं कर सकते।",

    "auditlogs.title": "ऑडिट लॉग",
    "auditlogs.action": "कार्य",
    "auditlogs.entity": "इकाई",
    "auditlogs.record": "रिकॉर्ड",
    "auditlogs.user": "उपयोगकर्ता",
    "auditlogs.timestamp": "समय",
    "auditlogs.events": "घटनाएँ",
    "auditlogs.changes": "परिवर्तन",
    "auditlogs.view": "देखें",
    "auditlogs.system": "सिस्टम",
    "auditlogs.previous": "पिछला",
    "auditlogs.next": "अगला",

    "projects.visibleSubtitle": "आपकी भूमिका के लिए दिखाई देने वाली परियोजनाएँ।",
    "projects.farmerSelect": "किसान चुनें",
    "projects.locked":
      "निर्माण के बाद किसान और पर्यवेक्षक बदले नहीं जा सकते।",
    "projects.hectares": "हेक्टेयर",
    "projects.status.PLANNED": "नियोजित",
    "projects.status.IN_PROGRESS": "प्रगति में",
    "projects.status.ON_HOLD": "रुका हुआ",
    "projects.status.COMPLETED": "पूर्ण",
    "projects.status.CANCELLED": "रद्द",
    "dashboard.pending": "पेंडिंग",

    "workers.new": "नया मजदूर",
    "workers.noSkill": "कोई कौशल दर्ज नहीं",
    "workers.name": "नाम",
    "workers.phone": "फोन नंबर",
    "workers.skill": "कौशल",
    "workers.dailyWage": "दैनिक मजदूरी",
    "workers.activeLabel": "सक्रिय मजदूर",

    "assignments.new": "नया असाइनमेंट",
    "assignments.assignedBy": "असाइन करने वाला",
    "assignments.selectProject": "परियोजना चुनें",
    "assignments.selectWorker": "मजदूर चुनें",
    "assignments.startDate": "प्रारंभ तिथि",
    "assignments.endDate": "समाप्ति तिथि (वैकल्पिक)",
    "assignments.agreedWage": "तय दैनिक मजदूरी",

    "worklogs.new": "नया वर्क लॉग",
    "worklogs.workers": "मजदूर",
    "worklogs.emptyMessage":
      "पर्यवेक्षक द्वारा दैनिक गतिविधि दर्ज करने पर वर्क लॉग यहाँ दिखेंगे।",
    "worklogs.supervisor": "पर्यवेक्षक",
    "worklogs.checkInLatitude": "चेक-इन अक्षांश (वैकल्पिक)",
    "worklogs.checkInLongitude": "चेक-इन देशांतर (वैकल्पिक)",
    "worklogs.checkInPair": "दोनों निर्देशांक दें या कोई नहीं।",
    "worklogs.workLog": "वर्क लॉग",

    "attendance.record": "उपस्थिति दर्ज करें",
    "attendance.workLog": "वर्क लॉग",
    "attendance.recordedBy": "दर्ज करने वाला",
    "attendance.recordedAt": "दर्ज समय",
    "attendance.emptyMessage":
      "पर्यवेक्षक द्वारा उपस्थिति दर्ज करने पर यह यहाँ दिखेगी।",
    "attendance.selectWorkLog": "वर्क लॉग चुनें",
    "attendance.selectWorker": "मजदूर चुनें",

    "expenses.expense": "खर्च",
    "expenses.projectNumber": "परियोजना",
    "expenses.amountLabel": "राशि (₹)",
    "expenses.expenseDate": "खर्च की तिथि",
    "expenses.submittedBy": "सबमिट करने वाला",
    "expenses.reviewedBy": "समीक्षा करने वाला",
    "expenses.rejectReasonRequired": "खर्च अस्वीकार करने का कारण आवश्यक है।",
    "expenses.reviewPlaceholder": "अस्वीकार करते समय आवश्यक।",
    "expenses.approvedMessage": "खर्च स्वीकृत हुआ।",
    "expenses.rejectedMessage": "खर्च अस्वीकृत हुआ।",
    "expenses.alreadyReviewed":
      "इस खर्च पर निर्णय हो चुका है, दोबारा समीक्षा नहीं हो सकती।",
    "expenses.notFound":
      "खर्च नहीं मिला या आपकी भूमिका के लिए दिखाई नहीं देता।",
    "expenses.category.LABOUR": "मजदूरी",
    "expenses.category.MATERIALS": "सामग्री",
    "expenses.category.TRANSPORT": "परिवहन",
    "expenses.category.EQUIPMENT": "उपकरण",
    "expenses.category.SEEDS_AND_FERTILIZERS": "बीज और उर्वरक",
    "expenses.category.OTHER": "अन्य",

    "farmers.new": "नई प्रोफाइल",
    "farmers.newTitle": "नई किसान प्रोफाइल",
    "farmers.accountId": "किसान खाता आईडी",
    "farmers.phone": "फोन नंबर",
    "farmers.village": "गांव",
    "farmers.address": "पता",
    "farmers.dob": "जन्म तिथि (वैकल्पिक)",
    "farmers.emergency": "आपातकालीन संपर्क (वैकल्पिक)",
    "farmers.emptyMessage":
      "प्रोफाइल बनने पर किसान यहाँ दिखाई देंगे।",
  },
};


type I18nContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function lookup(dictionary: Dictionary, key: string): string | null {
  return Object.prototype.hasOwnProperty.call(dictionary, key)
    ? dictionary[key]
    : null;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("sj.lang");
      if (stored === "en" || stored === "hi") {
        setLangState(stored);
      }
    } catch {
      // Ignore storage failures; default to English.
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("sj.lang", next);
      } catch {
        // Ignore storage failures.
      }
    }
  }, []);

  const t = useCallback(
    (key: string) => {
      const value = lookup(dictionaries[lang], key);
      if (value) return value;
      return lookup(dictionaries.en, key) ?? key;
    },
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, t }),
    [lang, setLang, t],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
