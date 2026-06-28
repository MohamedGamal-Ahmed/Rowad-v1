import { 
  Project, ProjectMeeting, ProjectIPC, ProjectClaim, ProjectVariationOrder, ProjectNOC, 
  ProjectSPR, ProjectSubcontract, ProjectDocument, ProjectAttachment, ProjectHistory,
  WBSPackage, ContextualAttachment
} from '../domain/projects/Project';

// --- BASELINE DATA SEEDING (Relational, using Master Data values) ---

export const baselineProjects: Project[] = [
  {
    id: "p-1",
    code: "ZED-Z02",
    nameEn: "ZED East - Zone 02 Infrastructure Expansion",
    nameAr: "زيد إيست - المنطقة 02 لتوسعة البنية التحتية",
    client: "ORA Developers",
    employer: "ORA Developers Group",
    consultant: "ECOGIM Engineering",
    mainContractor: "Rowad General Contracting",
    contractType: "Lump Sum",
    contractValue: 1250000000, // 1.25 Billion
    currency: "EGP",
    country: "Egypt",
    city: "New Cairo",
    projectManager: "Eng. Sherif Kamel",
    coordinator: "Ahmed Mansoor",
    department: "Infrastructure",
    startDate: "2024-01-12",
    completionDate: "2026-12-30",
    status: "Active",
    lifecycleStage: "Execution",
    description: "Zone 02 infrastructure works for ORA's ZED East project including utility mains, structural excavation, roads, and landscape preparation.",
    createdBy: "System",
    createdDate: "2024-01-10"
  },
  {
    id: "p-2",
    code: "PA-2026-011",
    nameEn: "Diriyah II - Boulevard Historical District",
    nameAr: "الدرعية 2 - بوليفارد المنطقة التاريخية",
    client: "Diriyah Gate Development Authority (DGDA)",
    employer: "DGDA Executive Office",
    consultant: "Dar Al-Handasah",
    mainContractor: "Rowad General Contracting",
    contractType: "Design & Build",
    contractValue: 2450000000, // 2.45 Billion
    currency: "SAR",
    country: "Saudi Arabia",
    city: "Riyadh",
    projectManager: "Eng. Abdulrahman Al-Saud",
    coordinator: "Khaled Bin Walid",
    department: "Executive Operations",
    startDate: "2024-06-01",
    completionDate: "2027-08-15",
    status: "Pre-Award",
    lifecycleStage: "Pre-Award",
    description: "Detailed engineering design and premium restoration works of the central Diriyah boulevard sub-structures with traditional mudbrick cladding integration.",
    createdBy: "System",
    createdDate: "2024-05-15"
  },
  {
    id: "p-3",
    code: "EASTOWN-R3",
    nameEn: "Eastown Residences - Phase 3 Structural Works",
    nameAr: "إيستاون ريزيدنس - المرحلة 3 الهياكل الخرسانية",
    client: "SODIC Developers",
    employer: "Sixth of October Development & Investment",
    consultant: "KEO International Consultants",
    mainContractor: "Rowad General Contracting",
    contractType: "Unit Rate",
    contractValue: 850000000,
    currency: "EGP",
    country: "Egypt",
    city: "New Cairo",
    projectManager: "Eng. Tarek Lashin",
    coordinator: "Mariam El-Fayoumy",
    department: "Design & Engineering",
    startDate: "2023-09-10",
    completionDate: "2026-05-20",
    status: "Active",
    lifecycleStage: "Execution",
    description: "Superstructure concrete frames and blockwork partition installation for residential clusters in Phase 3 of Eastown New Cairo.",
    createdBy: "System",
    createdDate: "2023-09-01"
  }
];

export const baselineMeetings: ProjectMeeting[] = [
  {
    id: "meet-1",
    projectId: "p-1",
    wbsId: "wbs-1", // Civil
    title: "Monthly Technical Coordination Meeting",
    titleAr: "الاجتماع الفني التنسيقي الشهري",
    date: "2026-06-25",
    startTime: "10:00",
    endTime: "11:30",
    meetingType: "online",
    locationOrLink: "https://teams.microsoft.com/l/meetup-join/19-project-zed",
    attendees: ["Eng. Sherif Kamel", "ECOGIM Consultant", "ORA Rep", "Site Engineer Ali"],
    remarks: "Reviewing shop drawing status of sewer crossings.",
    relatedClaimIds: ["clm-1"],
    relatedVOIds: ["vo-1"],
    relatedDocumentIds: ["pdoc-1"]
  },
  {
    id: "meet-2",
    projectId: "p-2",
    wbsId: "wbs-5", // Roads / Utilities
    title: "Commercial Pre-Award Alignment Session",
    titleAr: "جلسة التنسيق التجاري لمرحلة ما قبل الترسية",
    date: "2026-06-26",
    startTime: "13:00",
    endTime: "14:30",
    meetingType: "physical",
    locationOrLink: "DGDA Headquarters, Boardroom B, Riyadh",
    attendees: ["Eng. Abdulrahman Al-Saud", "DGDA Estimators", "Contracts Lead Rowad"],
    remarks: "Discussing unit pricing anomalies in bid item series 4.",
    relatedClaimIds: [],
    relatedVOIds: [],
    relatedDocumentIds: []
  }
];

export const baselineIPCs: ProjectIPC[] = [
  {
    id: "ipc-1",
    projectId: "p-1",
    wbsId: "wbs-1", // Civil
    ipcNumber: "IPC-ZED-08",
    workTill: "2026-05-31",
    invoiceGrossValue: 12450000,
    ipcSubmissionDate: "2026-06-15",
    invoiceNetValue: 10582500,
    ipcDueDate: "2026-07-15",
    certifiedAmount: 12450000,
    paymentDueDate: "2026-08-15",
    status: "Under Review",
    remarks: "Submitted to ECOGIM for verification. Measured work is 100% physically surveyed.",
    relatedVOIds: ["vo-1"],
    relatedDocumentIds: ["pdoc-1"]
  },
  {
    id: "ipc-2",
    projectId: "p-3",
    wbsId: "wbs-1", // Civil
    ipcNumber: "IPC-EASTOWN-14",
    workTill: "2026-04-30",
    invoiceGrossValue: 8500000,
    ipcSubmissionDate: "2026-05-10",
    invoiceNetValue: 7225000,
    ipcReceiptDate: "2026-06-18",
    certifiedAmount: 8350000,
    paymentReceiptDate: "2026-06-20",
    status: "Paid",
    remarks: "Certified and payment received net of standard retention and advance recovery.",
    relatedVOIds: [],
    relatedDocumentIds: []
  }
];

export const baselineClaims: ProjectClaim[] = [
  {
    id: "clm-1",
    projectId: "p-1",
    wbsId: "wbs-1",
    claimNumber: "CLM-03-ZED",
    claimType: "Extension of Time",
    submissionDate: "2026-06-10",
    requestedCompletionExtensionDays: 45,
    additionalClaimedAmount: 0,
    status: "Under Review",
    notes: "Claim submitted due to delayed handover of underground electricity duct corridors.",
    relatedVOIds: ["vo-1"],
    relatedMeetingIds: ["meet-1"],
    relatedDocumentIds: ["pdoc-1"]
  },
  {
    id: "clm-2",
    projectId: "p-3",
    wbsId: "wbs-1",
    claimNumber: "CLM-02-EASTOWN",
    claimType: "Both",
    submissionDate: "2026-03-15",
    requestedCompletionExtensionDays: 30,
    approvedCompletionExtensionDays: 20,
    additionalClaimedAmount: 3200000,
    approvedAmount: 2800000,
    invoicedAmount: 2800000,
    status: "Approved",
    notes: "Approved variation to structural foundation parameters due to unexpected limestone strata.",
    relatedVOIds: [],
    relatedMeetingIds: [],
    relatedDocumentIds: []
  }
];

export const baselineVOs: ProjectVariationOrder[] = [
  {
    id: "vo-1",
    projectId: "p-1",
    wbsId: "wbs-1",
    voNumber: "VO-ZED-012",
    technicalDescription: {
      additionOrOmission: "Addition",
      description: "Additional 400mm main water bypass lines near Zone B entry portal.",
      merits: "Required to ensure water pressure continuity for the upcoming district launch."
    },
    employerInstruction: {
      instructionType: "EI",
      reference: "EI-ZED-INF-981",
      date: "2026-05-20"
    },
    commercialOffer: {
      submissionStatus: "Approved",
      rfvReference: "RFV-ZED-442",
      commercialDate: "2026-06-01",
      amount: 1850000,
      extensionOfTimeDays: 7
    },
    approval: {
      approvalDate: "2026-06-18",
      approvedAmount: 1850000,
      approvalReference: "VO-APP-ZED-012"
    },
    status: "Approved",
    remarks: "Formally integrated into the physical work package sequence.",
    relatedClaimIds: ["clm-1"],
    relatedDocumentIds: ["pdoc-1"]
  }
];

export const baselineNOCs: ProjectNOC[] = [
  {
    id: "noc-1",
    projectId: "p-1",
    wbsId: "wbs-4", // Infrastructure
    nocNumber: "NOC-ZED-CIV-04",
    reference: "NOC-44-ZED-CIV",
    subject: "Civil Defense Approval for Gas Pipelines Zone 02",
    pendingActionBy: "Civil Defense Authority",
    status: "Under Review",
    remarks: "Awaiting final site inspection. All technical document submittals are cleared.",
    relatedDocumentIds: ["pdoc-1"]
  }
];

export const baselineSPRs: ProjectSPR[] = [
  {
    id: "spr-1",
    projectId: "p-1",
    reportingMonth: "2026-06",
    overallProgressPercentage: 42,
    scheduleVariance: -1.2,
    costVariance: 45000,
    keyAchievements: "Successfully completed the sewer main pipeline installation under Zone 2 main boulevard.",
    bottlenecksAndRisks: "Delay in municipal clearance for southern electricity bypass connection.",
    pmoSummary: "The project is trending healthy but requires aggressive follow-up on Government Permits.",
    status: "Submitted"
  }
];

export const baselineSubcontracts: ProjectSubcontract[] = [
  {
    id: "sub-1",
    projectId: "p-1",
    wbsId: "wbs-2", // MEP
    subcontractNumber: "SUB-ZED-CIV-102",
    contractorId: "ctr-2", // Al-Suwaidi Electrical Co.
    scopeId: "sc-7", // Electrical
    totalSubcontractAmount: 45000000,
    tillDateInvoicedAmount: 12500000,
    completionPercentage: 35,
    status: "Active",
    remarks: "Electrical duct bank installation and primary cabling."
  },
  {
    id: "sub-2",
    projectId: "p-1",
    wbsId: "wbs-4", // Infrastructure
    subcontractNumber: "SUB-ZED-GEO-04",
    contractorId: "ctr-4", // Saudi Geotechnical Lab
    scopeId: "sc-14", // Survey / testing
    totalSubcontractAmount: 5200000,
    tillDateInvoicedAmount: 5200000,
    completionPercentage: 100,
    status: "Completed",
    remarks: "Soil investigations and pile loading load integrity tests."
  }
];

export const baselineDocuments: ProjectDocument[] = [
  {
    id: "pdoc-1",
    projectId: "p-1",
    wbsId: "wbs-1", // Civil
    code: "ROWAD-ZED-CIV-DRW-042",
    titleEn: "Slab reinforcement details at station 3+400",
    titleAr: "تفاصيل تسليح البلاطة الخرسانية عند المحطة ٣+٤٠٠",
    category: "Drawing",
    docTypeId: "dt-1",
    sender: "Rowad Civil Design Team",
    recipient: "Lead Construction Consultant",
    dateReceived: "2026-06-19",
    status: "Approved for Construction",
    priority: "High",
    version: "Rev 2.0",
    relatedMeetingIds: ["meet-1"],
    relatedVOIds: ["vo-1"],
    relatedClaimIds: ["clm-1"]
  }
];

export const baselineAttachments: ProjectAttachment[] = [
  {
    id: "att-1",
    projectId: "p-1",
    fileName: "Contract_Signed_ORA_ZED_Zone02.pdf",
    fileSize: "14.2 MB",
    uploadedBy: "Admin",
    uploadedDate: "2024-01-15"
  }
];

export const baselineHistories: ProjectHistory[] = [
  {
    id: "h-1",
    projectId: "p-1",
    action: "Project Seeded",
    performedBy: "System",
    timestamp: "2024-01-10 12:00:00",
    details: "Baseline project details bootstrapped.",
    module: "Project",
    entityId: "p-1",
    entityCode: "ZED-Z02"
  },
  {
    id: "h-2",
    projectId: "p-1",
    action: "IPC #8 Submitted",
    performedBy: "Ahmed Mansoor",
    timestamp: "2026-06-15 09:30:12",
    details: "IPC-ZED-08 submitted under review with ECOGIM.",
    module: "IPC",
    entityId: "ipc-1",
    entityCode: "IPC-ZED-08"
  },
  {
    id: "h-3",
    projectId: "p-1",
    action: "Variation Order Approved",
    performedBy: "Consultant ECOGIM",
    timestamp: "2026-06-18 14:15:22",
    details: "Approved VO-ZED-012 for EGP 1.85 Million and 7 EOT days.",
    module: "VO",
    entityId: "vo-1",
    entityCode: "VO-ZED-012"
  },
  {
    id: "h-4",
    projectId: "p-1",
    action: "Soil Investigation Completed",
    performedBy: "Saudi Geotechnical Lab",
    timestamp: "2026-06-20 11:00:00",
    details: "Subcontract SUB-ZED-GEO-04 physically completed 100%.",
    module: "Subcontract",
    entityId: "sub-2",
    entityCode: "SUB-ZED-GEO-04"
  }
];

export const baselineWBS: WBSPackage[] = [
  { id: "wbs-1", projectId: "p-1", code: "CIV", nameEn: "Civil Works", nameAr: "الأعمال المدنية" },
  { id: "wbs-2", projectId: "p-1", code: "MEP", nameEn: "MEP Works", nameAr: "الأعمال الكهرومايكانيكية", parentId: "wbs-1" },
  { id: "wbs-3", projectId: "p-1", code: "ARC", nameEn: "Architectural Works", nameAr: "الأعمال المعمارية" },
  { id: "wbs-4", projectId: "p-1", code: "INF", nameEn: "Infrastructure Mains", nameAr: "شبكات البنية التحتية" },
  { id: "wbs-5", projectId: "p-1", code: "RDS", nameEn: "Roads & Asphalt", nameAr: "أعمال الطرق والأسفلت", parentId: "wbs-4" },
  { id: "wbs-6", projectId: "p-1", code: "LND", nameEn: "Landscape & Planting", nameAr: "تنسيق المواقع والحدائق", parentId: "wbs-3" }
];

export const baselineContextualAttachments: ContextualAttachment[] = [
  {
    id: "catt-1",
    projectId: "p-1",
    entityType: "Claim",
    entityId: "clm-1",
    category: "Letters",
    fileName: "ORA_Delay_Handover_Notification_Letter.pdf",
    fileSize: "1.2 MB",
    uploadedBy: "Eng. Sherif Kamel",
    uploadedDate: "2026-06-10"
  },
  {
    id: "catt-2",
    projectId: "p-1",
    entityType: "Claim",
    entityId: "clm-1",
    category: "Drawings",
    fileName: "Gas_Alignment_Conflict_Drawings_Rev01.dwg",
    fileSize: "4.5 MB",
    uploadedBy: "Site Engineer Ali",
    uploadedDate: "2026-06-11"
  },
  {
    id: "catt-3",
    projectId: "p-1",
    entityType: "VO",
    entityId: "vo-1",
    category: "Engineer Instructions",
    fileName: "ECOGIM-EI-981-WaterBypassLine.pdf",
    fileSize: "850 KB",
    uploadedBy: "Ahmed Mansoor",
    uploadedDate: "2026-05-21"
  },
  {
    id: "catt-4",
    projectId: "p-1",
    entityType: "VO",
    entityId: "vo-1",
    category: "BOQ",
    fileName: "VO-ZED-012_Bypass_Re-measured_BOQ.xlsx",
    fileSize: "1.1 MB",
    uploadedBy: "Contracts Lead Rowad",
    uploadedDate: "2026-06-02"
  },
  {
    id: "catt-5",
    projectId: "p-1",
    entityType: "IPC",
    entityId: "ipc-1",
    category: "Invoice",
    fileName: "Rowad-Invoice-ZED-08_Certified.pdf",
    fileSize: "2.3 MB",
    uploadedBy: "Ahmed Mansoor",
    uploadedDate: "2026-06-15"
  }
];
