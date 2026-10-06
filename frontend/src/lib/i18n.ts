export type Language = "en" | "hi";

export const translations = {
  en: {
    // Brand & App
    appName: "SATPURA JAIVIK FPO",
    platformSubtitle: "Farm Development & Transparency Platform",
    mobilePwa: "Mobile-First PWA",
    onlineStatus: "Online (Cloud Synced)",
    offlineStatus: "Offline Mode (Queued Sync)",
    gpsActive: "GPS Active: Sohagpur, MP",
    
    // Roles
    roleFarmer: "Farmer / Customer",
    roleSupervisor: "Field Supervisor",
    roleAccounts: "Accounts Dept",
    roleAdmin: "Administrator",
    roleSuperAdmin: "Super Administrator",
    roleManagement: "Senior Management",
    switchRole: "Switch Role",

    // Navigation & Tabs
    tabMyProjects: "My Projects",
    tabFinances: "Finances & Bills",
    tabFieldMonitoring: "Field Surveillance & IoT",
    tabWorkLogs: "Daily Work Logs",
    tabApprovals: "Expense Approvals",
    tabUserMgmt: "User Management",
    tabAuditLogs: "Audit Trails",
    tabExecutiveSummary: "Executive Summary",

    // Action Buttons
    btnCameraUpload: "Camera Bill Upload",
    btnGpsCheckin: "GPS Site Check-in",
    btnLiveCctv: "Live CCTV Feed",
    btnIotSensors: "Soil & Climate IoT",
    btnChatSupervisor: "Chat with Supervisor",
    btnNewProject: "+ Create New Project",
    btnNewExpense: "+ Submit Expense",
    btnApprove: "Approve Payment",
    btnVerifyAccounts: "Verify Invoice (Accounts)",
    btnReject: "Reject / Return",
    btnExportReport: "Export Financial Report (PDF)",
    btnSyncOffline: "Sync Offline Logs",

    // Statuses
    statusPlanned: "Planned",
    statusInProgress: "In Progress",
    statusVerification: "Under Verification",
    statusCompleted: "Completed",
    statusSubmitted: "Submitted (Pending Accounts)",
    statusAccountsVerified: "Accounts Verified",
    statusAdminApproved: "Admin Approved",
    statusPaid: "Paid (Visible to Farmer)",
    statusRejected: "Rejected",

    // Dashboard Cards & Titles
    totalBudget: "Total Project Budget",
    subsidyApproved: "Approved Subsidy",
    spentToDate: "Disbursed / Spent",
    farmArea: "Land Acreage",
    cropType: "Crop Cultivation",
    farmerName: "Member Farmer",
    supervisorAssigned: "Assigned Supervisor",

    // Sections
    sectionProjects: "Active Farm Projects",
    sectionExpenses: "Financial Transactions & Expense Approvals",
    sectionCctvIot: "Real-Time Field Surveillance & IoT Sensors",
    sectionWorkLogs: "Supervisor Daily Work Logs",
    sectionAuditLogs: "Immutable System Audit Trail",
    
    // Dialog & Form Labels
    uploadBillTitle: "Snap & Upload Bill / Site Photo",
    captureFromCamera: "Capture Photo from Camera",
    selectCategory: "Select Expense Category",
    enterAmount: "Enter Amount (₹)",
    vendorName: "Vendor Name / GST No.",
    autoGpsTagging: "Auto GPS Tagging: 22.7512° N, 77.7245° E",
    autoTimestampTagging: "Timestamp: 2026-10-06 10:30 AM",

    // Categories
    catLabour: "Labour",
    catSeeds: "Seeds",
    catFertilizer: "Bio-Fertilizer",
    catIrrigation: "Irrigation & Water",
    catMachinery: "Machinery & Tools",
    catTransport: "Transport",
    catConstruction: "Construction & Fencing",
    catMisc: "Miscellaneous",

    // Action Labels
    actionApprove: "Approve",
    actionReject: "Reject",
    actionViewReceipt: "View Receipt",
    actionMarkPaid: "Mark as Paid",

    // Messages
    msgOfflineSaved: "Log saved locally to PWA cache. Will sync automatically when connected.",
    msgExpenseApproved: "Expense payment approved and recorded on transparency ledger.",
    msgChatWelcome: "Direct FPO Communication Channel",
  },
  hi: {
    // Brand & App
    appName: "सतपुड़ा जैविक एफपीओ",
    platformSubtitle: "फार्म विकास एवं पारदर्शिता मंच",
    mobilePwa: "मोबाइल-प्रथम पीडब्ल्यूए",
    onlineStatus: "ऑनलाइन (क्लाउड सिंक हुआ)",
    offlineStatus: "ऑफ़लाइन मोड (सिंक कतार में)",
    gpsActive: "जीपीएस सक्रिय: सोहागपुर, म.प्र.",

    // Roles
    roleFarmer: "किसान / ग्राहक",
    roleSupervisor: "फील्ड पर्यवेक्षक (सुपरवाइज़र)",
    roleAccounts: "लेखा विभाग (अकाउंट्स)",
    roleAdmin: "प्रशासक (एडमिन)",
    roleSuperAdmin: "मुख्य प्रशासक (सुपर एडमिन)",
    roleManagement: "वरिष्ठ प्रबंधन (मैनेजमेंट)",
    switchRole: "भूमिका बदलें",

    // Navigation & Tabs
    tabMyProjects: "मेरी परियोजनाएं",
    tabFinances: "वित्त एवं बिल",
    tabFieldMonitoring: "फील्ड निगरानी एवं आईओटी",
    tabWorkLogs: "दैनिक कार्य लॉग",
    tabApprovals: "व्यय स्वीकृति (अनुमोदन)",
    tabUserMgmt: "उपयोगकर्ता प्रबंधन",
    tabAuditLogs: "ऑडिट ट्रेल (निरीक्षण रिकॉर्ड)",
    tabExecutiveSummary: "कार्यकारी सारांश",

    // Action Buttons
    btnCameraUpload: "कैमरा बिल अपलोड",
    btnGpsCheckin: "जीपीएस साइट चेक-इन",
    btnLiveCctv: "लाइव सीसीटीवी फीड",
    btnIotSensors: "मृदा एवं जलवायु आईओटी",
    btnChatSupervisor: "पर्यवेक्षक से चैट करें",
    btnNewProject: "+ नई परियोजना बनाएं",
    btnNewExpense: "+ नया खर्च सबमिट करें",
    btnApprove: "भुगतान स्वीकृत करें",
    btnVerifyAccounts: "बिल सत्यापित करें (अकाउंट्स)",
    btnReject: "अस्वीकार / वापस भेजें",
    btnExportReport: "वित्तीय रिपोर्ट डाउनलोड (पीडीएफ)",
    btnSyncOffline: "ऑफ़लाइन डेटा सिंक करें",

    // Statuses
    statusPlanned: "नियोजित (प्लांड)",
    statusInProgress: "प्रगति पर (इन प्रोग्रेस)",
    statusVerification: "सत्यापनाधीन (वेरिफिकेशन)",
    statusCompleted: "पूर्ण (पूर्ण)",
    statusSubmitted: "सबमिट किया गया (लेखा लंबित)",
    statusAccountsVerified: "लेखा द्वारा सत्यापित",
    statusAdminApproved: "एडमिन द्वारा स्वीकृत",
    statusPaid: "भुगतान पूर्ण (किसान को दृश्यमान)",
    statusRejected: "अस्वीकृत",

    // Dashboard Cards & Titles
    totalBudget: "कुल परियोजना बजट",
    subsidyApproved: "स्वीकृत सब्सिडी",
    spentToDate: "अब तक व्यय / संवितरित",
    farmArea: "भूमि का क्षेत्रफल",
    cropType: "फसल प्रकार",
    farmerName: "सदस्य किसान",
    supervisorAssigned: "आवंटित पर्यवेक्षक",

    // Sections
    sectionProjects: "सक्रिय खेत विकास परियोजनाएं",
    sectionExpenses: "वित्तीय लेन-देन एवं खर्च अनुमोदन",
    sectionCctvIot: "वास्तविक समय खेत निगरानी एवं आईओटी सेंसर",
    sectionWorkLogs: "पर्यवेक्षक दैनिक कार्य लॉग",
    sectionAuditLogs: "अपरिवर्तनीय सिस्टम ऑडिट ट्रेल",

    // Dialog & Form Labels
    uploadBillTitle: "फोटो लें एवं बिल / फोटो अपलोड करें",
    captureFromCamera: "कैमरे से फोटो खींचें",
    selectCategory: "खर्च श्रेणी चुनें",
    enterAmount: "राशि दर्ज करें (₹)",
    vendorName: "विक्रेता का नाम / जीएसटी नंबर",
    autoGpsTagging: "स्वचालित जीपीएस टैगिंग: 22.7512° उत्तर, 77.7245° पूर्व",
    autoTimestampTagging: "समय मोहर: 2026-10-06 10:30 पूर्वाह्न",

    // Categories
    catLabour: "मजदूरी (लेबर)",
    catSeeds: "बीज",
    catFertilizer: "जैविक खाद",
    catIrrigation: "सिंचाई एवं जल",
    catMachinery: "मशीनरी एवं उपकरण",
    catTransport: "परिवहन",
    catConstruction: "निर्माण एवं बाड़बंदी",
    catMisc: "विविध खर्च",

    // Action Labels
    actionApprove: "स्वीकृत करें",
    actionReject: "अस्वीकार करें",
    actionViewReceipt: "रसीद देखें",
    actionMarkPaid: "भुगतान चिह्नित करें",

    // Messages
    msgOfflineSaved: "लॉग स्थानीय रूप से सहेजा गया। इंटरनेट कनेक्ट होने पर स्वचालित सिंक होगा।",
    msgExpenseApproved: "खर्च भुगतान स्वीकृत हो गया और पारदर्शिता बहीखाते में दर्ज हुआ।",
    msgChatWelcome: "प्रत्यक्ष एफपीओ संचार चैनल",
  }
};
