import { 
  Project, ProjectMeeting, ProjectIPC, ProjectClaim, ProjectVariationOrder, ProjectNOC, 
  ProjectSPR, ProjectSubcontract, ProjectDocument, ProjectAttachment, ProjectHistory,
  WBSPackage, ContextualAttachment, ProjectSettings
} from '../domain/projects/Project';

export class ProjectRepository {
  private apiEndpoint = '/api/projects';

  /**
   * Retrieves all projects from local storage or seeds them.
   */
  public async getAll(): Promise<Project[]> {
    const list = this.getOrSeed('pmo_projects_master', baselineProjects);
    // Auto-migrate if any project is missing lifecycleStage or settings
    let modified = false;
    const migrated = list.map(p => {
      let changed = false;
      if (!p.lifecycleStage) {
        p.lifecycleStage = p.status === 'Pre-Award' ? 'Pre-Award' : 'Execution';
        changed = true;
      }
      if (!p.settings) {
        p.settings = this.getDefaultProjectSettings(p);
        changed = true;
      }
      if (changed) {
        modified = true;
      }
      return p;
    });
    if (modified) {
      localStorage.setItem('pmo_projects_master', JSON.stringify(migrated));
    }
    return migrated;
  }

  /**
   * Saves or updates a project.
   */
  public async save(project: Project): Promise<boolean> {
    try {
      const list = await this.getAll();
      const index = list.findIndex(p => p.id === project.id);
      if (index !== -1) {
        list[index] = project;
      } else {
        list.push(project);
      }
      localStorage.setItem('pmo_projects_master', JSON.stringify(list));
      this.addHistory(
        project.id, 
        index !== -1 ? 'Project Settings Updated' : 'Project Registered', 
        project.createdBy || 'System',
        `Project code: ${project.code}`,
        'Project',
        project.id,
        project.code
      );
      return true;
    } catch (e) {
      console.error('Error saving project', e);
      return false;
    }
  }

  /**
   * Deletes a project.
   */
  public async delete(id: string): Promise<boolean> {
    try {
      const list = await this.getAll();
      const filtered = list.filter(p => p.id !== id);
      localStorage.setItem('pmo_projects_master', JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Error deleting project', e);
      return false;
    }
  }

  // --- WBS Packages CRUD ---

  public async getWBSPackages(projectId: string): Promise<WBSPackage[]> {
    const list: WBSPackage[] = this.getOrSeed('pmo_project_wbs', baselineWBS);
    return list.filter(w => w.projectId === projectId);
  }

  public async saveWBSPackage(wbs: WBSPackage): Promise<boolean> {
    return this.saveSubEntity('pmo_project_wbs', wbs, baselineWBS);
  }

  public async deleteWBSPackage(id: string): Promise<boolean> {
    try {
      const list = this.getOrSeed<WBSPackage>('pmo_project_wbs', baselineWBS);
      const filtered = list.filter(item => item.id !== id);
      localStorage.setItem('pmo_project_wbs', JSON.stringify(filtered));
      return true;
    } catch (e) {
      return false;
    }
  }

  // --- Contextual Attachments CRUD ---

  public async getContextualAttachments(projectId: string, entityType?: string, entityId?: string): Promise<ContextualAttachment[]> {
    const list: ContextualAttachment[] = this.getOrSeed('pmo_contextual_attachments', baselineContextualAttachments);
    let filtered = list.filter(a => a.projectId === projectId);
    if (entityType) {
      filtered = filtered.filter(a => a.entityType === entityType);
    }
    if (entityId) {
      filtered = filtered.filter(a => a.entityId === entityId);
    }
    return filtered;
  }

  public async saveContextualAttachment(att: ContextualAttachment): Promise<boolean> {
    return this.saveSubEntity('pmo_contextual_attachments', att, baselineContextualAttachments);
  }

  public async deleteContextualAttachment(id: string): Promise<boolean> {
    try {
      const list = this.getOrSeed<ContextualAttachment>('pmo_contextual_attachments', baselineContextualAttachments);
      const filtered = list.filter(item => item.id !== id);
      localStorage.setItem('pmo_contextual_attachments', JSON.stringify(filtered));
      return true;
    } catch (e) {
      return false;
    }
  }

  // --- Sub-entity CRUD Operations ---

  public async getMeetings(projectId: string): Promise<ProjectMeeting[]> {
    const list: ProjectMeeting[] = this.getOrSeed('pmo_project_meetings', baselineMeetings);
    return list.filter(m => m.projectId === projectId);
  }

  public async saveMeeting(meeting: ProjectMeeting): Promise<boolean> {
    return this.saveSubEntity('pmo_project_meetings', meeting, baselineMeetings);
  }

  public async getIPCs(projectId: string): Promise<ProjectIPC[]> {
    const list: ProjectIPC[] = this.getOrSeed('pmo_project_ipcs', baselineIPCs);
    return list.filter(i => i.projectId === projectId);
  }

  public async saveIPC(ipc: ProjectIPC): Promise<boolean> {
    return this.saveSubEntity('pmo_project_ipcs', ipc, baselineIPCs);
  }

  public async getClaims(projectId: string): Promise<ProjectClaim[]> {
    const list: ProjectClaim[] = this.getOrSeed('pmo_project_claims', baselineClaims);
    return list.filter(c => c.projectId === projectId);
  }

  public async saveClaim(claim: ProjectClaim): Promise<boolean> {
    return this.saveSubEntity('pmo_project_claims', claim, baselineClaims);
  }

  public async getVariationOrders(projectId: string): Promise<ProjectVariationOrder[]> {
    const list: ProjectVariationOrder[] = this.getOrSeed('pmo_project_vos', baselineVOs);
    return list.filter(v => v.projectId === projectId);
  }

  public async saveVariationOrder(vo: ProjectVariationOrder): Promise<boolean> {
    return this.saveSubEntity('pmo_project_vos', vo, baselineVOs);
  }

  public async getNOCs(projectId: string): Promise<ProjectNOC[]> {
    const list: ProjectNOC[] = this.getOrSeed('pmo_project_nocs', baselineNOCs);
    return list.filter(n => n.projectId === projectId);
  }

  public async saveNOC(noc: ProjectNOC): Promise<boolean> {
    return this.saveSubEntity('pmo_project_nocs', noc, baselineNOCs);
  }

  public async deleteNOC(id: string): Promise<boolean> {
    try {
      const list = this.getOrSeed<ProjectNOC>('pmo_project_nocs', baselineNOCs);
      const filtered = list.filter(item => item.id !== id);
      localStorage.setItem('pmo_project_nocs', JSON.stringify(filtered));
      return true;
    } catch (e) {
      return false;
    }
  }

  public async getSPRs(projectId: string): Promise<ProjectSPR[]> {
    const list: ProjectSPR[] = this.getOrSeed('pmo_project_sprs', baselineSPRs);
    return list.filter(s => s.projectId === projectId);
  }

  public async saveSPR(spr: ProjectSPR): Promise<boolean> {
    return this.saveSubEntity('pmo_project_sprs', spr, baselineSPRs);
  }

  public async getSubcontracts(projectId: string): Promise<ProjectSubcontract[]> {
    const list: ProjectSubcontract[] = this.getOrSeed('pmo_project_subcontracts', baselineSubcontracts);
    return list.filter(s => s.projectId === projectId);
  }

  public async saveSubcontract(subcontract: ProjectSubcontract): Promise<boolean> {
    return this.saveSubEntity('pmo_project_subcontracts', subcontract, baselineSubcontracts);
  }

  public async getDocuments(projectId: string): Promise<ProjectDocument[]> {
    const list: ProjectDocument[] = this.getOrSeed('pmo_project_documents', baselineDocuments);
    return list.filter(d => d.projectId === projectId);
  }

  public async saveDocument(doc: ProjectDocument): Promise<boolean> {
    return this.saveSubEntity('pmo_project_documents', doc, baselineDocuments);
  }

  public async getAttachments(projectId: string): Promise<ProjectAttachment[]> {
    const list: ProjectAttachment[] = this.getOrSeed('pmo_project_attachments', baselineAttachments);
    return list.filter(a => a.projectId === projectId);
  }

  public async saveAttachment(attachment: ProjectAttachment): Promise<boolean> {
    return this.saveSubEntity('pmo_project_attachments', attachment, baselineAttachments);
  }

  public async getHistory(projectId: string): Promise<ProjectHistory[]> {
    const list: ProjectHistory[] = this.getOrSeed('pmo_project_histories', baselineHistories);
    return list.filter(h => h.projectId === projectId);
  }

  public async addHistory(
    projectId: string, 
    action: string, 
    performedBy: string, 
    details?: string,
    module?: string,
    entityId?: string,
    entityCode?: string
  ) {
    try {
      const history: ProjectHistory = {
        id: `HST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        projectId,
        action,
        performedBy,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        details,
        module,
        entityId,
        entityCode
      };
      await this.saveSubEntity('pmo_project_histories', history, baselineHistories);
    } catch (e) {
      console.error('Failed to append history', e);
    }
  }

  // --- Helpers for generic localStorage operations ---

  private getOrSeed<T>(key: string, baseline: T[]): T[] {
    try {
      const data = localStorage.getItem(key);
      if (data && data !== "undefined") {
        return JSON.parse(data);
      } else {
        localStorage.setItem(key, JSON.stringify(baseline));
        return baseline;
      }
    } catch (e) {
      console.error(`Failed to load ${key}`, e);
      try {
        localStorage.setItem(key, JSON.stringify(baseline));
      } catch (_) {}
      return baseline;
    }
  }

  private async saveSubEntity<T extends { id: string }>(key: string, entity: T, baseline: T[]): Promise<boolean> {
    try {
      const list = this.getOrSeed(key, baseline);
      const index = list.findIndex(item => item.id === entity.id);
      if (index !== -1) {
        list[index] = entity;
      } else {
        list.push(entity);
      }
      localStorage.setItem(key, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error(`Failed to save sub entity into ${key}`, e);
      return false;
    }
  }

  public getDefaultProjectSettings(p: Project): ProjectSettings {
    return {
      workingCalendar: 'Standard 5-Day',
      workingDays: [0, 1, 2, 3, 4], // Sun to Thu
      currency: p.currency || 'SAR',
      timeZone: p.country === 'Egypt' ? 'GMT+2 (Cairo)' : 'GMT+3 (Riyadh)',
      departments: ['Infrastructure', 'Technical Office', 'Cost Control', 'Planning'],
      approvers: ['Executive PMO', 'Senior Commercial Manager', 'Technical Director'],
      projectRoles: ['Project Manager', 'Coordinator', 'Lead Engineer', 'Estimator'],
      riskMatrix: '5x5 Grid Standard',
      notificationRules: ['Email on delay > 5 days', 'System alert on claims exceeding 100k'],
      meetingRules: ['Mandatory weekly updates', 'Online as default for subcontractors'],
      conflictRules: {
        minGapBetweenMeetings: 30,
        travelBuffer: 15,
        conflictThreshold: 2
      },
      documentNumberingRules: `ROWAD-${p.code}-DOC-[SEQ]`,
      approvalWorkflow: 'Serial Approvals (PM -> Consultant -> Employer)',
      escalationRules: 'Auto-escalate to Director if pending approval exceeds 7 days'
    };
  }
}

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
