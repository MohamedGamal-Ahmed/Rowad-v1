export interface WBSPackage {
  id: string;
  projectId: string;
  code: string;
  nameEn: string;
  nameAr?: string;
  parentId?: string; // Supports unlimited hierarchy
  description?: string;
}

export interface ProjectSettings {
  workingCalendar: string; // e.g., 'Standard'
  workingDays: number[]; // e.g., [0, 1, 2, 3, 4]
  currency: string;
  timeZone: string;
  departments: string[];
  approvers: string[];
  projectRoles: string[];
  riskMatrix: string; // e.g., '5x5'
  notificationRules: string[];
  meetingRules: string[];
  conflictRules: {
    minGapBetweenMeetings: number;
    travelBuffer: number;
    conflictThreshold: number;
  };
  documentNumberingRules: string;
  approvalWorkflow: string;
  escalationRules: string;
}

export interface ContextualAttachment {
  id: string;
  projectId: string;
  entityType: 'Claim' | 'VO' | 'IPC' | 'NOC' | 'Meeting' | 'Document' | 'Project' | 'Subcontract';
  entityId: string; // References the specific entity ID
  category: string; // e.g., 'Letters', 'Drawings', 'Photos', 'BOQ', 'Shop Drawings', 'Invoice', etc.
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
  downloadUrl?: string;
}

export interface Project {
  id: string; // ProjectId
  code: string; // Project Code
  nameEn: string; // Project Name (English) - Required
  nameAr?: string; // Project Name (Arabic) - Optional
  client: string; // References Client Name/ID
  employer: string; // References Employer Name/ID
  consultant: string; // References Consultant Name/ID
  mainContractor: string; // References Contractor Name/ID
  contractType: string; // Contract Type
  contractValue: number; // Contract Value
  currency: string; // Currency (e.g., AED, SAR, EGP)
  country: string; // Country
  city: string; // City
  projectManager: string; // Project Manager
  coordinator: string; // Coordinator
  department: string; // Department
  startDate: string; // ISO Date YYYY-MM-DD
  completionDate: string; // ISO Date YYYY-MM-DD
  status: 'Active' | 'Pre-Award' | 'Completed' | 'Closed';
  lifecycleStage: 'Pre-Award' | 'Awarded' | 'Execution' | 'Closing' | 'Archived';
  description?: string;
  createdBy: string;
  createdDate: string;
  settings?: ProjectSettings; // Project-level settings override
}

export interface ProjectMeeting {
  id: string;
  projectId: string;
  wbsId?: string; // WBS Relationship
  title: string;
  titleAr?: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingType: 'online' | 'physical';
  locationOrLink?: string;
  attendees: string[];
  remarks?: string;
  
  // Cross-Module Relationships
  relatedClaimIds?: string[];
  relatedVOIds?: string[];
  relatedDocumentIds?: string[];
}

export interface ProjectIPC {
  id: string;
  projectId: string;
  wbsId?: string; // WBS Relationship
  ipcNumber: string;
  workTill: string; // YYYY-MM-DD
  invoiceGrossValue: number;
  ipcSubmissionDate: string;
  invoiceNetValue: number;
  ipcReceiptDate?: string;
  ipcDueDate?: string;
  certifiedAmount?: number;
  paymentDueDate?: string;
  paymentReceiptDate?: string;
  delayTillDate?: string;
  actualPaidCertified?: number;
  remarks?: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Certified' | 'Paid' | 'Overdue';
  
  // Cross-Module Relationships
  relatedVOIds?: string[];
  relatedDocumentIds?: string[];
}

export interface ProjectClaim {
  id: string;
  projectId: string;
  wbsId?: string; // WBS Relationship
  claimNumber: string;
  claimType: 'Extension of Time' | 'Financial Compensation' | 'Both' | 'Other';
  submissionDate: string;
  requestedCompletionExtensionDays: number;
  approvedCompletionExtensionDays?: number;
  additionalClaimedAmount: number;
  status: 'Prepared' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Escalated';
  approvedAmount?: number;
  invoicedAmount?: number;
  notes?: string;

  // Cross-Module Relationships
  relatedVOIds?: string[];
  relatedMeetingIds?: string[];
  relatedDocumentIds?: string[];
}

export interface ProjectVariationOrder {
  id: string;
  projectId: string;
  wbsId?: string; // WBS Relationship
  voNumber: string; // Variation Order Number
  technicalDescription: {
    additionOrOmission: 'Addition' | 'Omission' | 'Transfer';
    description: string;
    merits: string;
  };
  employerInstruction: {
    instructionType: 'EI' | 'AI' | 'VO' | 'Other';
    reference: string;
    date: string;
  };
  commercialOffer: {
    submissionStatus: 'Pending' | 'Submitted' | 'Approved';
    rfvReference: string;
    commercialDate: string;
    amount: number;
    extensionOfTimeDays: number;
  };
  approval?: {
    approvalDate: string;
    approvedAmount: number;
    approvalReference: string;
  };
  remarks?: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';

  // Cross-Module Relationships
  relatedClaimIds?: string[];
  relatedDocumentIds?: string[];
}

export interface ProjectNOC {
  id: string;
  projectId: string;
  wbsId?: string; // WBS Relationship
  nocNumber: string;
  reference: string;
  subject: string;
  pendingActionBy: string;
  remarks?: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Under Review';

  // Cross-Module Relationships
  relatedDocumentIds?: string[];
}

export interface ProjectSPR {
  id: string;
  projectId: string;
  reportingMonth: string; // YYYY-MM
  overallProgressPercentage: number;
  scheduleVariance: number;
  costVariance: number;
  keyAchievements: string;
  bottlenecksAndRisks: string;
  pmoSummary: string;
  status: 'Draft' | 'Submitted' | 'Reviewed';
}

export interface ProjectSubcontract {
  id: string;
  projectId: string;
  wbsId?: string; // WBS Relationship
  subcontractNumber: string;
  contractorId: string; // References ContractorId
  scopeId: string; // References ScopeId
  totalSubcontractAmount: number;
  tillDateInvoicedAmount: number;
  completionPercentage: number;
  status: 'Active' | 'Completed' | 'Terminated';
  remarks?: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  wbsId?: string; // WBS Relationship
  code: string;
  titleEn: string;
  titleAr?: string;
  category: 'Drawing' | 'Transmittal' | 'Incoming' | 'Outgoing';
  docTypeId: string; // References DocumentType ID
  sender: string;
  recipient: string;
  dateReceived: string;
  status: string;
  priority: 'High' | 'Medium' | 'Low';
  version: string;

  // Cross-Module Relationships
  relatedMeetingIds?: string[];
  relatedVOIds?: string[];
  relatedClaimIds?: string[];
}

export interface ProjectAttachment {
  id: string;
  projectId: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
  downloadUrl?: string;
}

export interface ProjectHistory {
  id: string;
  projectId: string;
  action: string;
  performedBy: string;
  timestamp: string; // YYYY-MM-DD HH:mm:ss
  details?: string;
  // Enhanced Activity Timelines
  module?: string; // e.g., 'IPC', 'Claim', 'VO'
  entityId?: string; // ID of the business record
  entityCode?: string; // e.g., 'IPC-08'
}
