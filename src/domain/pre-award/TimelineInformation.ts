export interface TimelineInformation {
  techSubmissionDate: string; // ISO Date YYYY-MM-DD
  commSubmissionDate: string; // ISO Date YYYY-MM-DD
  overallSubmissionDate: string; // ISO Date YYYY-MM-DD
  closingDate?: string;
  kickOffDate?: string;
  alignmentDate?: string;
  followUpDate?: string;
  riskDueDate?: string;
  contractQualsDueDate?: string;
  siteVisitRequired?: boolean;
  siteVisitDate?: string;
}
