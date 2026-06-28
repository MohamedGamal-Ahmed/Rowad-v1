import React, { useState, useEffect } from 'react';
import { 
  Building2, Calendar, DollarSign, FileText, Pickaxe, Award, Receipt, 
  AlertTriangle, PenTool, Clock, Settings, Paperclip, Plus, ArrowLeft, 
  ArrowRight, Save, Trash2, CheckCircle2, AlertCircle, Eye, Download, Landmark,
  Send, ListFilter, Activity, Link, Users, FilePlus2, Play, Folder, Search
} from 'lucide-react';
import { 
  Project, ProjectMeeting, ProjectIPC, ProjectClaim, ProjectVariationOrder, ProjectNOC, 
  ProjectSPR, ProjectSubcontract, ProjectDocument, ProjectAttachment, ProjectHistory, WBSPackage 
} from '../../../domain/projects/Project';
import { ProjectRepository } from '../../../repositories/ProjectRepository';
import { MasterDataRepository } from '../../../repositories/MasterDataRepository';
import { Contractor, ScopeOfWork, DocumentType } from '../../../domain/master/MasterData';
import { BiText } from '../../../components/BiText';
import { FinancialsCalculator } from '../../../business-rules/FinancialsCalculator';

// Enterprise modular components imports
import { ProjectDashboard } from './workspace/ProjectDashboard';
import { WBSManager } from './workspace/WBSManager';
import { ProjectSettingsPanel } from './workspace/ProjectSettingsPanel';
import { ContextualAttachmentsList } from './workspace/ContextualAttachmentsList';
import { ActivityFeedTimeline } from './workspace/ActivityFeedTimeline';
import { GlobalSearchPanel } from './workspace/GlobalSearchPanel';
import { SprReportingEngine } from './registers/SprReportingEngine';
import { SubcontractorsPanel } from './workspace/SubcontractorsPanel';
import { DocumentsPanel } from './workspace/DocumentsPanel';
import { AttachmentsPanel } from './workspace/AttachmentsPanel';

interface ProjectWorkspaceProps {
  projectId: string;
  lang: 'ar' | 'en';
  onBack: () => void;
}

const TABS = [
  { id: 'dashboard', icon: Building2, label: { en: 'Dashboard', ar: 'لوحة التحكم' } },
  { id: 'wbs', icon: Folder, label: { en: 'WBS Hierarchy', ar: 'هيكل الأعمال (WBS)' } },
  { id: 'overview', icon: Building2, label: { en: 'Overview', ar: 'ميثاق المشروع' } },
  { id: 'meetings', icon: Users, label: { en: 'Meetings', ar: 'الاجتماعات' } },
  { id: 'ipc', icon: Receipt, label: { en: 'IPC Accounts', ar: 'المستخلصات' } },
  { id: 'claims', icon: AlertTriangle, label: { en: 'Claims', ar: 'المطالبات' } },
  { id: 'vo', icon: PenTool, label: { en: 'Variation Orders', ar: 'الأوامر التغييرية' } },
  { id: 'noc', icon: Award, label: { en: 'NOC Permits', ar: 'تصاريح عدم الممانعة' } },
  { id: 'spr', icon: Activity, label: { en: 'SPR Reporting', ar: 'تقارير الإنجاز الشهرية' } },
  { id: 'subcontractors', icon: Pickaxe, label: { en: 'Subcontractors', ar: 'المقاولات الباطنة' } },
  { id: 'documents', icon: FileText, label: { en: 'Documents', ar: 'المستندات' } },
  { id: 'search', icon: Search, label: { en: 'Global Search', ar: 'البحث المؤسسي' } },
  { id: 'settings', icon: Settings, label: { en: 'Project Settings', ar: 'إعدادات المشروع' } },
  { id: 'history', icon: Clock, label: { en: 'Activity Feed', ar: 'شريط الأحداث الميداني' } },
];

export function ProjectWorkspace({
  projectId,
  lang,
  onBack
}: ProjectWorkspaceProps) {
  const isAr = lang === 'ar';
  const projectRepo = new ProjectRepository();
  const masterRepo = new MasterDataRepository();

  const getFinancialSettings = () => {
    const saved = localStorage.getItem('pmo_enterprise_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.financialSettings) {
          return parsed.financialSettings;
        }
      } catch (e) {}
    }
    return {
      retentionPercentage: 10,
      vatPercentage: 15,
      bidBondPercentage: 2,
      performanceBondPercentage: 10,
      advancePaymentPercentage: 10,
      defaultCurrency: 'AED'
    };
  };

  const [currentProjectId, setCurrentProjectId] = useState(projectId);
  const [allProjectsList, setAllProjectsList] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [wbsPackages, setWbsPackages] = useState<WBSPackage[]>([]);
  
  // Track expanded cards and search focuses
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const [focusedRecordId, setFocusedRecordId] = useState<string | null>(null);
  const [selectedWbsId, setSelectedWbsId] = useState('');

  // Related data states
  const [meetings, setMeetings] = useState<ProjectMeeting[]>([]);
  const [ipcs, setIpcs] = useState<ProjectIPC[]>([]);
  const [claims, setClaims] = useState<ProjectClaim[]>([]);
  const [vos, setVos] = useState<ProjectVariationOrder[]>([]);
  const [nocs, setNocs] = useState<ProjectNOC[]>([]);
  const [sprs, setSprs] = useState<ProjectSPR[]>([]);
  const [subcontracts, setSubcontracts] = useState<ProjectSubcontract[]>([]);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [attachments, setAttachments] = useState<ProjectAttachment[]>([]);
  const [history, setHistory] = useState<ProjectHistory[]>([]);

  // Master Lists (for forms)
  const [masterContractors, setMasterContractors] = useState<Contractor[]>([]);
  const [masterScopes, setMasterScopes] = useState<ScopeOfWork[]>([]);
  const [masterDocTypes, setMasterDocTypes] = useState<DocumentType[]>([]);

  // Form Visibility States
  const [showForm, setShowForm] = useState(false);

  // --- Specialized Fields State ---

  // 1. Meeting Form States
  const [meetTitle, setMeetTitle] = useState('');
  const [meetTitleAr, setMeetTitleAr] = useState('');
  const [meetDate, setMeetDate] = useState('');
  const [meetStart, setMeetStart] = useState('09:00');
  const [meetDuration, setMeetDuration] = useState(60); // minutes
  const [meetType, setMeetType] = useState<'online' | 'physical'>('online');
  const [meetLocation, setMeetLocation] = useState('');
  const [meetAttendees, setMeetAttendees] = useState('');

  // 2. IPC Form States
  const [ipcNum, setIpcNum] = useState('');
  const [ipcWorkTill, setIpcWorkTill] = useState('');
  const [ipcGross, setIpcGross] = useState(0);
  const [ipcNet, setIpcNet] = useState(0);
  const [ipcSubDate, setIpcSubDate] = useState('');
  const [ipcRecDate, setIpcRecDate] = useState('');
  const [ipcDueDate, setIpcDueDate] = useState('');
  const [ipcCert, setIpcCert] = useState(0);
  const [ipcPayDue, setIpcPayDue] = useState('');
  const [ipcPayRec, setIpcPayRec] = useState('');
  const [ipcDelay, setIpcDelay] = useState('');
  const [ipcPaidCert, setIpcPaidCert] = useState(0);
  const [ipcRemarks, setIpcRemarks] = useState('');
  const [ipcStatus, setIpcStatus] = useState<ProjectIPC['status']>('Draft');

  // 3. Claim Form States
  const [clmNum, setClmNum] = useState('');
  const [clmType, setClmType] = useState<ProjectClaim['claimType']>('Extension of Time');
  const [clmSubDate, setClmSubDate] = useState('');
  const [clmReqEot, setClmReqEot] = useState(0);
  const [clmAppEot, setClmAppEot] = useState(0);
  const [clmAmt, setClmAmt] = useState(0);
  const [clmAppAmt, setClmAppAmt] = useState(0);
  const [clmInvAmt, setClmInvAmt] = useState(0);
  const [clmNotes, setClmNotes] = useState('');
  const [clmStatus, setClmStatus] = useState<ProjectClaim['status']>('Prepared');

  // 4. VO Form States
  const [voNum, setVoNum] = useState('');
  const [voAddOmit, setVoAddOmit] = useState<'Addition' | 'Omission' | 'Transfer'>('Addition');
  const [voTechDesc, setVoTechDesc] = useState('');
  const [voMerits, setVoMerits] = useState('');
  const [voInstType, setVoInstType] = useState<'EI' | 'AI' | 'VO' | 'Other'>('EI');
  const [voInstRef, setVoInstRef] = useState('');
  const [voInstDate, setVoInstDate] = useState('');
  const [voSubStatus, setVoSubStatus] = useState<'Pending' | 'Submitted' | 'Approved'>('Pending');
  const [voRfvRef, setVoRfvRef] = useState('');
  const [voCommDate, setVoCommDate] = useState('');
  const [voCommAmt, setVoCommAmt] = useState(0);
  const [voCommEot, setVoCommEot] = useState(0);
  const [voAppDate, setVoAppDate] = useState('');
  const [voAppAmt, setVoAppAmt] = useState(0);
  const [voAppRef, setVoAppRef] = useState('');
  const [voRemarks, setVoRemarks] = useState('');
  const [voStatus, setVoStatus] = useState<'Draft' | 'Submitted' | 'Approved' | 'Rejected'>('Draft');

  // 5. NOC Form States
  const [nocNum, setNocNum] = useState('');
  const [nocRef, setNocRef] = useState('');
  const [nocSubj, setNocSubj] = useState('');
  const [nocAction, setNocAction] = useState('');
  const [nocRemarks, setNocRemarks] = useState('');
  const [nocStatus, setNocStatus] = useState<ProjectNOC['status']>('Pending');
  const [editingNocId, setEditingNocId] = useState<string | null>(null);
  const [nocSearch, setNocSearch] = useState('');
  const [nocStatusFilter, setNocStatusFilter] = useState('all');

  // 6. SPR Form States
  const [sprMonth, setSprMonth] = useState('');
  const [sprProgress, setSprProgress] = useState(0);
  const [sprSchVar, setSprSchVar] = useState(0);
  const [sprCostVar, setSprCostVar] = useState(0);
  const [sprAchieve, setSprAchieve] = useState('');
  const [sprRisk, setSprRisk] = useState('');
  const [sprPmo, setSprPmo] = useState('');

  // 7. Subcontract Form States
  const [subNum, setSubNum] = useState('');
  const [subCtrId, setSubCtrId] = useState('');
  const [subScopeId, setSubScopeId] = useState('');
  const [subTotalAmt, setSubTotalAmt] = useState(0);
  const [subInvAmt, setSubInvAmt] = useState(0);
  const [subCompPct, setSubCompPct] = useState(0);
  const [subRemarks, setSubRemarks] = useState('');

  // 8. Document Form States
  const [docCode, setDocCode] = useState('');
  const [docTitleEn, setDocTitleEn] = useState('');
  const [docTitleAr, setDocTitleAr] = useState('');
  const [docCat, setDocCat] = useState<'Drawing' | 'Transmittal' | 'Incoming' | 'Outgoing'>('Drawing');
  const [docTypeId, setDocTypeId] = useState('');
  const [docSender, setDocSender] = useState('');
  const [docRecip, setDocRecip] = useState('');
  const [docDate, setDocDate] = useState('');
  const [docStatus, setDocStatus] = useState('');
  const [docPriority, setDocPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [docVer, setDocVer] = useState('Rev 1.0');

  // 9. File drag states
  const [isDragging, setIsDragging] = useState(false);

  // Load project details
  const reloadAllProjectData = async (targetId: string = currentProjectId) => {
    const list = await projectRepo.getAll();
    setAllProjectsList(list);
    const found = list.find(p => p.id === targetId);
    if (found) {
      setProject(found);
      
      const [wbs, m, i, c, v, n, s, sub, d, a, h] = await Promise.all([
        projectRepo.getWBSPackages(found.id),
        projectRepo.getMeetings(found.id),
        projectRepo.getIPCs(found.id),
        projectRepo.getClaims(found.id),
        projectRepo.getVariationOrders(found.id),
        projectRepo.getNOCs(found.id),
        projectRepo.getSPRs(found.id),
        projectRepo.getSubcontracts(found.id),
        projectRepo.getDocuments(found.id),
        projectRepo.getAttachments(found.id),
        projectRepo.getHistory(found.id)
      ]);

      setWbsPackages(wbs);
      setMeetings(m);
      setIpcs(i);
      setClaims(c);
      setVos(v);
      setNocs(n);
      setSprs(s);
      setSubcontracts(sub);
      setDocuments(d);
      setAttachments(a);
      setHistory(h.sort((x, y) => y.timestamp.localeCompare(x.timestamp)));
    }
  };

  useEffect(() => {
    reloadAllProjectData(currentProjectId);
    
    // Load Master Lists once
    async function loadMasters() {
      const ctrs = await masterRepo.getContractors();
      setMasterContractors(ctrs);

      const scopes = await masterRepo.getScopes();
      setMasterScopes(scopes);

      const dts = await masterRepo.getDocTypes();
      setMasterDocTypes(dts);
    }
    loadMasters();
  }, [currentProjectId]);

  // BR-CAL-005: Automatic End Time calculation for meetings based on Start Time + Duration
  const calculatedEndTime = React.useMemo(() => {
    if (!meetStart) return '';
    try {
      const [hrs, mins] = meetStart.split(':').map(Number);
      const totalMins = hrs * 60 + mins + Number(meetDuration);
      const endHrs = Math.floor(totalMins / 60) % 24;
      const endMins = totalMins % 60;
      return `${String(endHrs).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
    } catch (e) {
      return '';
    }
  }, [meetStart, meetDuration]);

  // Submit handlers for specialized forms

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !meetTitle) return;
    
    const newMeet: ProjectMeeting = {
      id: `meet-${Date.now()}`,
      projectId: project.id,
      wbsId: selectedWbsId || undefined,
      title: meetTitle,
      titleAr: meetTitleAr || undefined,
      date: meetDate || new Date().toISOString().substring(0, 10),
      startTime: meetStart,
      endTime: calculatedEndTime,
      meetingType: meetType,
      locationOrLink: meetLocation,
      attendees: meetAttendees.split(',').map(a => a.trim()).filter(Boolean),
      remarks: 'Scheduled from Project Workspace',
      relatedClaimIds: [],
      relatedVOIds: [],
      relatedDocumentIds: []
    };

    await projectRepo.saveMeeting(newMeet);
    await projectRepo.addHistory(
      project.id, 
      'Meeting Scheduled', 
      'System', 
      `Scheduled meeting: ${meetTitle}`,
      'Meeting',
      newMeet.id,
      meetStart
    );
    setShowForm(false);
    setMeetTitle('');
    setMeetTitleAr('');
    setSelectedWbsId('');
    reloadAllProjectData();
  };

  const handleIpcGrossChange = (val: number) => {
    setIpcGross(val);
    const finSettings = getFinancialSettings();
    const calc = FinancialsCalculator.calculateIpcLifecycle(val, finSettings as any);
    setIpcNet(calc.netValue);
    setIpcCert(calc.subtotal);
  };

  const handleCreateIPC = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !ipcNum) return;

    const newIpc: ProjectIPC = {
      id: `ipc-${Date.now()}`,
      projectId: project.id,
      wbsId: selectedWbsId || undefined,
      ipcNumber: ipcNum,
      workTill: ipcWorkTill || new Date().toISOString().substring(0, 10),
      invoiceGrossValue: ipcGross,
      ipcSubmissionDate: ipcSubDate || new Date().toISOString().substring(0, 10),
      invoiceNetValue: ipcNet,
      ipcReceiptDate: ipcRecDate || undefined,
      ipcDueDate: ipcDueDate || undefined,
      certifiedAmount: ipcCert || undefined,
      paymentDueDate: ipcPayDue || undefined,
      paymentReceiptDate: ipcPayRec || undefined,
      delayTillDate: ipcDelay || undefined,
      actualPaidCertified: ipcPaidCert || undefined,
      remarks: ipcRemarks || undefined,
      status: ipcStatus,
      relatedVOIds: [],
      relatedDocumentIds: []
    };

    await projectRepo.saveIPC(newIpc);
    await projectRepo.addHistory(
      project.id, 
      'IPC Created', 
      'System', 
      `Registered IPC: ${ipcNum}`,
      'IPC',
      newIpc.id,
      ipcNum
    );
    setShowForm(false);
    setIpcNum('');
    setSelectedWbsId('');
    reloadAllProjectData();
  };

  const handleUpdateClaimStatus = async (claimId: string, newStatus: ProjectClaim['status']) => {
    const claimToUpdate = claims.find(c => c.id === claimId);
    if (!claimToUpdate || !project) return;
    
    const oldStatus = claimToUpdate.status;
    let allowed = false;
    if (oldStatus === 'Prepared' && (newStatus === 'Submitted')) allowed = true;
    else if (oldStatus === 'Submitted' && (newStatus === 'Under Review' || newStatus === 'Prepared')) allowed = true;
    else if (oldStatus === 'Under Review' && (newStatus === 'Approved' || newStatus === 'Rejected' || newStatus === 'Escalated')) allowed = true;
    else if ((oldStatus === 'Approved' || oldStatus === 'Rejected' || oldStatus === 'Escalated') && newStatus === 'Under Review') allowed = true;
    
    if (!allowed) {
      alert(isAr ? 'انتقال غير مسموح به في دورة اعتماد المطالبة!' : 'Unauthorized transition in the claim approval lifecycle!');
      return;
    }

    const updatedClaim: ProjectClaim = { ...claimToUpdate, status: newStatus };
    await projectRepo.saveClaim(updatedClaim);
    await projectRepo.addHistory(
      project.id,
      'Claim Status Transition',
      'System',
      `Transitioned claim ${claimToUpdate.claimNumber} from ${oldStatus} to ${newStatus}`,
      'Claim',
      claimId,
      claimToUpdate.claimNumber
    );
    reloadAllProjectData();
  };

  const handleCreateClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !clmNum) return;

    const newClaim: ProjectClaim = {
      id: `clm-${Date.now()}`,
      projectId: project.id,
      wbsId: selectedWbsId || undefined,
      claimNumber: clmNum,
      claimType: clmType,
      submissionDate: clmSubDate || new Date().toISOString().substring(0, 10),
      requestedCompletionExtensionDays: clmReqEot,
      approvedCompletionExtensionDays: clmAppEot || undefined,
      additionalClaimedAmount: clmAmt,
      status: clmStatus,
      approvedAmount: clmAppAmt || undefined,
      invoicedAmount: clmInvAmt || undefined,
      notes: clmNotes || undefined,
      relatedVOIds: [],
      relatedMeetingIds: [],
      relatedDocumentIds: []
    };

    await projectRepo.saveClaim(newClaim);
    await projectRepo.addHistory(
      project.id, 
      'Claim Registered', 
      'System', 
      `Registered claim: ${clmNum}`,
      'Claim',
      newClaim.id,
      clmNum
    );
    setShowForm(false);
    setClmNum('');
    setSelectedWbsId('');
    reloadAllProjectData();
  };

  const handleCreateVO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !voNum) return;

    const newVo: ProjectVariationOrder = {
      id: `vo-${Date.now()}`,
      projectId: project.id,
      wbsId: selectedWbsId || undefined,
      voNumber: voNum,
      technicalDescription: {
        additionOrOmission: voAddOmit,
        description: voTechDesc,
        merits: voMerits
      },
      employerInstruction: {
        instructionType: voInstType,
        reference: voInstRef,
        date: voInstDate || new Date().toISOString().substring(0, 10)
      },
      commercialOffer: {
        submissionStatus: voSubStatus,
        rfvReference: voRfvRef,
        commercialDate: voCommDate || new Date().toISOString().substring(0, 10),
        amount: voCommAmt,
        extensionOfTimeDays: voCommEot
      },
      approval: voAppDate ? {
        approvalDate: voAppDate,
        approvedAmount: voAppAmt,
        approvalReference: voAppRef
      } : undefined,
      remarks: voRemarks || undefined,
      status: voStatus,
      relatedClaimIds: [],
      relatedDocumentIds: []
    };

    await projectRepo.saveVariationOrder(newVo);
    await projectRepo.addHistory(
      project.id, 
      'VO Registered', 
      'System', 
      `Registered Variation Order: ${voNum}`,
      'VO',
      newVo.id,
      voNum
    );
    setShowForm(false);
    setVoNum('');
    setSelectedWbsId('');
    reloadAllProjectData();
  };

  const handleCreateNOC = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !nocNum) return;

    const newNoc: ProjectNOC = {
      id: editingNocId || `noc-${Date.now()}`,
      projectId: project.id,
      wbsId: selectedWbsId || undefined,
      nocNumber: nocNum,
      reference: nocRef,
      subject: nocSubj,
      pendingActionBy: nocAction,
      remarks: nocRemarks || undefined,
      status: nocStatus,
      relatedDocumentIds: []
    };

    await projectRepo.saveNOC(newNoc);
    await projectRepo.addHistory(
      project.id, 
      editingNocId ? 'NOC Updated' : 'NOC Registered', 
      'System', 
      `${editingNocId ? 'Updated' : 'Registered'} NOC Permit: ${nocNum}`,
      'NOC',
      newNoc.id,
      nocNum
    );
    setShowForm(false);
    setNocNum('');
    setNocRef('');
    setNocSubj('');
    setNocAction('');
    setNocRemarks('');
    setNocStatus('Pending');
    setEditingNocId(null);
    setSelectedWbsId('');
    reloadAllProjectData();
  };

  const handleEditNOC = (noc: ProjectNOC) => {
    setNocNum(noc.nocNumber);
    setNocRef(noc.reference);
    setNocSubj(noc.subject);
    setNocAction(noc.pendingActionBy);
    setNocRemarks(noc.remarks || '');
    setNocStatus(noc.status);
    setSelectedWbsId(noc.wbsId || '');
    setEditingNocId(noc.id);
    setShowForm(true);
  };

  const handleDeleteNOC = async (id: string, code: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا التصريح؟' : 'Are you sure you want to delete this permit?')) return;
    await projectRepo.deleteNOC(id);
    await projectRepo.addHistory(project!.id, 'NOC Deleted', 'System', `Deleted NOC Permit: ${code}`, 'NOC', id, code);
    reloadAllProjectData();
  };

  const handleCreateSPR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !sprMonth) return;

    const newSpr: ProjectSPR = {
      id: `spr-${Date.now()}`,
      projectId: project.id,
      reportingMonth: sprMonth,
      overallProgressPercentage: sprProgress,
      scheduleVariance: sprSchVar,
      costVariance: sprCostVar,
      keyAchievements: sprAchieve,
      bottlenecksAndRisks: sprRisk,
      pmoSummary: sprPmo,
      status: 'Submitted'
    };

    await projectRepo.saveSPR(newSpr);
    await projectRepo.addHistory(project.id, 'SPR Submitted', 'System', `Submitted Performance Report for ${sprMonth}`);
    setShowForm(false);
    setSprMonth('');
    reloadAllProjectData();
  };

  const handleSubTotalAmtChange = (val: number) => {
    setSubTotalAmt(val);
    if (val > 0 && subInvAmt > 0) {
      setSubCompPct(Math.round((subInvAmt / val) * 100));
    } else if (val > 0 && subCompPct > 0) {
      setSubInvAmt(Math.round(val * (subCompPct / 100)));
    }
  };

  const handleSubInvAmtChange = (val: number) => {
    setSubInvAmt(val);
    if (subTotalAmt > 0) {
      setSubCompPct(Math.min(Math.round((val / subTotalAmt) * 100), 100));
    }
  };

  const handleSubCompPctChange = (val: number) => {
    setSubCompPct(val);
    if (subTotalAmt > 0) {
      setSubInvAmt(Math.round(subTotalAmt * (val / 100)));
    }
  };

  const handleCreateSubcontract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !subNum || !subCtrId || !subScopeId) return;

    const newSub: ProjectSubcontract = {
      id: `sub-${Date.now()}`,
      projectId: project.id,
      wbsId: selectedWbsId || undefined,
      subcontractNumber: subNum,
      contractorId: subCtrId,
      scopeId: subScopeId,
      totalSubcontractAmount: subTotalAmt,
      tillDateInvoicedAmount: subInvAmt,
      completionPercentage: subCompPct,
      status: 'Active',
      remarks: subRemarks || undefined
    };

    await projectRepo.saveSubcontract(newSub);
    await projectRepo.addHistory(
      project.id, 
      'Subcontract Created', 
      'System', 
      `Assigned Subcontract: ${subNum}`,
      'Subcontract',
      newSub.id,
      subNum
    );
    setShowForm(false);
    setSubNum('');
    setSelectedWbsId('');
    reloadAllProjectData();
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !docCode || !docTitleEn) return;

    const newDoc: ProjectDocument = {
      id: `pdoc-${Date.now()}`,
      projectId: project.id,
      wbsId: selectedWbsId || undefined,
      code: docCode,
      titleEn: docTitleEn,
      titleAr: docTitleAr || undefined,
      category: docCat,
      docTypeId,
      sender: docSender,
      recipient: docRecip,
      dateReceived: docDate || new Date().toISOString().substring(0, 10),
      status: docStatus || 'Approved',
      priority: docPriority,
      version: docVer,
      relatedMeetingIds: [],
      relatedVOIds: [],
      relatedClaimIds: []
    };

    await projectRepo.saveDocument(newDoc);
    await projectRepo.addHistory(
      project.id, 
      'Document Registered', 
      'System', 
      `Registered document: ${docCode}`,
      'Document',
      newDoc.id,
      docCode
    );
    setShowForm(false);
    setDocCode('');
    setDocTitleEn('');
    setSelectedWbsId('');
    reloadAllProjectData();
  };

  const handleMockUpload = async () => {
    if (!project) return;
    const mockFiles = [
      { name: 'Infrastructure_Excavation_Report_REV2.pdf', size: '4.8 MB' },
      { name: 'Sewer_Bypass_Alignment_Cross_Section.dwg', size: '12.1 MB' },
      { name: 'Commercial_Risk_Matrix_DGDA.xlsx', size: '2.5 MB' }
    ];

    const chosen = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    const newAtt: ProjectAttachment = {
      id: `att-${Date.now()}`,
      projectId: project.id,
      fileName: chosen.name,
      fileSize: chosen.size,
      uploadedBy: 'Estimator Pro',
      uploadedDate: new Date().toISOString().substring(0, 10)
    };

    await projectRepo.saveAttachment(newAtt);
    await projectRepo.addHistory(project.id, 'Attachment Uploaded', 'System', `Uploaded attachment: ${chosen.name}`);
    reloadAllProjectData();
  };

  const formatMoney = (val: number | undefined, curr: string) => {
    if (val === undefined) return 'N/A';
    return `${val.toLocaleString()} ${curr}`;
  };

  const ArrowIcon = isAr ? ArrowRight : ArrowLeft;

  if (!project) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        <Activity className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Workspace Header Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-[32px] p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-navy/5 dark:bg-brand-red/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>

        <div className="flex gap-4 items-start z-10 w-full md:w-auto">
          <button 
            onClick={onBack}
            className="p-3 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-2xl bg-white dark:bg-slate-900 shadow-sm shrink-0 transition-all cursor-pointer"
          >
            <ArrowIcon className="w-5 h-5 text-slate-500" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 text-[10px] font-extrabold rounded-lg border font-mono">
                {project.code}
              </span>

              {/* Single Source of Truth Project Switcher Selector */}
              <select
                value={currentProjectId}
                onChange={(e) => setCurrentProjectId(e.target.value)}
                className="bg-slate-50 dark:bg-slate-850 text-[10px] font-extrabold text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-850 rounded-lg px-2.5 py-0.5 outline-none focus:border-brand-red cursor-pointer"
                title="Switch active Project Master"
              >
                {allProjectsList.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {lang === 'ar' && p.nameAr ? p.nameAr : p.nameEn}
                  </option>
                ))}
              </select>

              <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-100/50 text-[10px] font-bold rounded-full">
                {isAr ? 'مشروع منفذ نشط' : 'PROJECT ACTIVE'}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-brand-navy dark:text-slate-100 tracking-tight leading-tight truncate">
              {isAr && project.nameAr ? project.nameAr : project.nameEn}
            </h1>
            <p className="text-xs text-slate-400 truncate mt-1">
              {isAr ? 'العميل: ' : 'Client: '} <span className="font-bold text-slate-500">{project.client}</span> | {isAr ? 'المدينة: ' : 'City: '} <span className="font-bold text-slate-500">{project.city}</span>
            </p>
          </div>
        </div>

        {/* Commercial stats rail */}
        <div className="flex gap-6 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 z-10 w-full md:w-auto text-xs shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-1">{isAr ? 'موازنة العقد الإجمالية' : 'Contract Value'}</span>
            <div className="text-sm font-black text-brand-navy dark:text-slate-200">
              {formatMoney(project.contractValue, project.currency)}
            </div>
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-1">{isAr ? 'تاريخ الإنجاز المستهدف' : 'Completion Date'}</span>
            <div className="text-sm font-bold text-brand-red font-mono">
              {project.completionDate}
            </div>
          </div>
        </div>
      </div>

      {/* Notion-style Tabs Ribbon */}
      <div className="overflow-x-auto premium-scrollbar border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-5 min-w-max px-2">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
              className={`flex items-center gap-2 pb-3.5 px-1 border-b-2 transition-all font-bold text-xs cursor-pointer
                ${activeTab === tab.id 
                  ? 'border-brand-red text-brand-red' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
                }
              `}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-brand-red' : 'text-slate-400'}`} />
              <BiText text={tab.label} primaryLang={lang} stacked={false} />
            </button>
          ))}
        </div>
      </div>

      {/* Tab Workstations Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-[32px] p-6 shadow-sm min-h-[450px]">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <ProjectDashboard
            lang={lang}
            project={project}
            meetings={meetings}
            ipcs={ipcs}
            claims={claims}
            vos={vos}
            nocs={nocs}
            documents={documents}
            attachments={attachments}
            history={history}
            onNavigateTab={(tabId) => setActiveTab(tabId)}
            onNavigateToRecord={(tabId, recordId) => {
              setActiveTab(tabId);
              setFocusedRecordId(recordId);
              setExpandedRecordId(recordId);
            }}
          />
        )}

        {/* WBS HIERARCHY TAB */}
        {activeTab === 'wbs' && (
          <WBSManager
            lang={lang}
            projectId={project.id}
            onRefreshProjectData={reloadAllProjectData}
          />
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b pb-2 mb-4 font-mono">
                  {isAr ? 'ملخص ميثاق المشروع' : 'Project Charter Profile'}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'العميل المباشر' : 'Client'}</span>
                    <p className="font-extrabold text-slate-800 dark:text-slate-100 mt-1">{project.client}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'الجهة المالكة (صاحب العمل)' : 'Employer'}</span>
                    <p className="font-extrabold text-slate-800 dark:text-slate-100 mt-1">{project.employer}</p>
                  </div>
                  <div className="mt-2">
                    <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'الاستشاري الهندسي' : 'Consultant'}</span>
                    <p className="font-extrabold text-slate-800 dark:text-slate-100 mt-1">{project.consultant}</p>
                  </div>
                  <div className="mt-2">
                    <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'المقاول الرئيسي' : 'Main Contractor'}</span>
                    <p className="font-extrabold text-slate-800 dark:text-slate-100 mt-1">{project.mainContractor}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b pb-2 mb-4 font-mono">
                  {isAr ? 'البرنامج والمنطقة الجغرافية' : 'Schedule & Geography'}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold font-sans block">{isAr ? 'تاريخ البدء المعتمد' : 'Commencement Date'}</span>
                    <p className="font-bold text-slate-800 dark:text-slate-300 mt-1">{project.startDate}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold font-sans block">{isAr ? 'تاريخ الإنجاز التعاقدي' : 'Contract Completion'}</span>
                    <p className="font-bold text-brand-red mt-1">{project.completionDate}</p>
                  </div>
                  <div className="mt-2">
                    <span className="text-[10px] text-slate-400 font-bold font-sans block">{isAr ? 'الدولة والمدينة' : 'Country / City'}</span>
                    <p className="font-bold text-slate-800 dark:text-slate-300 mt-1 font-sans">{project.country}, {project.city}</p>
                  </div>
                  <div className="mt-2">
                    <span className="text-[10px] text-slate-400 font-bold font-sans block">{isAr ? 'نوع العقد الإنشائي' : 'Contract Type'}</span>
                    <p className="font-bold text-slate-800 dark:text-slate-300 mt-1 font-sans">{project.contractType}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b pb-2 mb-4 font-mono">
                  {isAr ? 'إدارة المشروع والمتابعة' : 'Leadership & Management'}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'مدير المشروع (PM)' : 'Project Manager'}</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100 mt-1">{project.projectManager || 'Unassigned'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'منسق المشروع' : 'Project Coordinator'}</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100 mt-1">{project.coordinator || 'Unassigned'}</p>
                  </div>
                </div>
              </div>

              {project.description && (
                <div>
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b pb-2 mb-3 font-mono">
                    {isAr ? 'نطاق الأعمال والملاحظات الفنية' : 'Scope Brief & Details'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-100 dark:border-slate-850 rounded-2xl">
                    {project.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MEETINGS TAB */}
        {activeTab === 'meetings' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest font-mono">
                {isAr ? 'الاجتماعات الفنية والتنسيقية المجدولة' : 'Scheduled Interactive Meetings'}
              </h3>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-red text-white hover:bg-brand-red-dark rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'جدولة اجتماع جديد' : 'Schedule Meeting'}</span>
                </button>
              )}
            </div>

            {showForm ? (
              /* Specialized Meeting Form (BR-CAL-005 Auto end time calculation embedded) */
              <form onSubmit={handleCreateMeeting} className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-3 font-bold border-b pb-1 text-slate-600 dark:text-slate-300">
                  {isAr ? 'استمارة جدولة اجتماع جديد' : 'Schedule New Meeting (Dynamic End Time)'}
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'عنوان الاجتماع بالإنجليزية (مطلوب)' : 'Meeting Title (EN)'}</label>
                  <input required type="text" value={meetTitle} onChange={e => setMeetTitle(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'العنوان بالعربية (اختياري)' : 'Meeting Title (AR)'}</label>
                  <input type="text" value={meetTitleAr} onChange={e => setMeetTitleAr(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'تاريخ الاجتماع' : 'Date'}</label>
                  <input type="date" value={meetDate} onChange={e => setMeetDate(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'وقت البدء' : 'Start Time'}</label>
                  <input type="time" value={meetStart} onChange={e => setMeetStart(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'مدة الاجتماع (دقائق)' : 'Duration (Minutes)'}</label>
                  <select value={meetDuration} onChange={e => setMeetDuration(Number(e.target.value))} className="w-full p-2 border rounded-lg bg-white text-slate-800">
                    <option value={30}>30 mins</option>
                    <option value={60}>60 mins (1 hr)</option>
                    <option value={90}>90 mins (1.5 hrs)</option>
                    <option value={120}>120 mins (2 hrs)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'وقت الانتهاء (محسوب تلقائياً)' : 'Calculated End Time'}</label>
                  <input disabled type="text" value={calculatedEndTime} className="w-full p-2 border rounded-lg bg-slate-100 text-slate-500 font-mono font-bold" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'نوع اللقاء' : 'Meeting Format'}</label>
                  <select value={meetType} onChange={e => setMeetType(e.target.value as any)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
                    <option value="online">Online (Teams / Meet)</option>
                    <option value="physical">Physical (Site Office / HQ)</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'رابط اللقاء أو موقع الاجتماع' : 'Link or Location'}</label>
                  <input type="text" value={meetLocation} onChange={e => setMeetLocation(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'حزمة العمل (WBS)' : 'WBS Work Package'}</label>
                  <select value={selectedWbsId} onChange={e => setSelectedWbsId(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
                    <option value="">{isAr ? '-- اختر حزمة العمل --' : '-- Select WBS Package --'}</option>
                    {wbsPackages.map(w => (
                      <option key={w.id} value={w.id}>{w.code} - {isAr && w.nameAr ? w.nameAr : w.nameEn}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'الحضور (قائمة مفصولة بفواصل)' : 'Attendees (Comma-separated)'}</label>
                  <input type="text" value={meetAttendees} onChange={e => setMeetAttendees(e.target.value)} placeholder="e.g. Eng. Sherif, Consultant Rep, Al-Suwaidi Lead" className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-brand-red text-white hover:bg-brand-red-dark rounded-lg font-bold">Save Meeting</button>
                </div>
              </form>
            ) : null}

            {/* Meetings Cards */}
            {meetings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meetings.map(m => {
                  const isExpanded = expandedRecordId === m.id;
                  const isFocused = focusedRecordId === m.id;
                  const linkedWbs = wbsPackages.find(w => w.id === m.wbsId);

                  return (
                    <div 
                      key={m.id} 
                      className={`bg-slate-50 dark:bg-slate-950/20 border p-4 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all space-y-3
                        ${isFocused ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-500/5' : 'border-slate-100 dark:border-slate-850'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          m.meetingType === 'online' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {m.meetingType}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{m.date}</span>
                          </span>
                          <button
                            onClick={() => {
                              setExpandedRecordId(isExpanded ? null : m.id);
                              if (isFocused) setFocusedRecordId(null);
                            }}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500"
                            title="Toggle details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                          {isAr && m.titleAr ? m.titleAr : m.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono font-bold">
                          {m.startTime} - {m.endTime}
                        </p>
                      </div>

                      {linkedWbs && (
                        <div className="flex items-center gap-1.5 text-[10px] bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400 font-mono">
                          <Folder className="w-3.5 h-3.5 text-brand-red" />
                          <span className="font-bold">{linkedWbs.code}</span>
                          <span>-</span>
                          <span className="truncate max-w-[150px]">{isAr && linkedWbs.nameAr ? linkedWbs.nameAr : linkedWbs.nameEn}</span>
                        </div>
                      )}

                      {m.locationOrLink && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1" title={m.locationOrLink}>
                          <Link className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{m.locationOrLink}</span>
                        </p>
                      )}

                      {m.attendees.length > 0 && (
                        <div className="flex flex-wrap gap-1 items-center pt-2 border-t border-slate-100 dark:border-slate-850/40 text-[9px] font-bold text-slate-400">
                          <span>{isAr ? 'الحضور:' : 'Attendees:'}</span>
                          {m.attendees.map((att, idx) => (
                            <span key={idx} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-sans">{att}</span>
                          ))}
                        </div>
                      )}

                      {/* Expandable Contextual Attachment manager */}
                      {isExpanded && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                          <h5 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                            {isAr ? 'مرفقات الاجتماع المرتبطة' : 'Contextual Attachments'}
                          </h5>
                          <ContextualAttachmentsList
                            projectId={project.id}
                            entityType="Meeting"
                            entityId={m.id}
                            lang={lang}
                            onRefresh={reloadAllProjectData}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-10 text-xs">
                {isAr ? 'لا توجد اجتماعات مجدولة حالياً لهذا المشروع.' : 'No meetings scheduled yet.'}
              </div>
            )}
          </div>
        )}

        {/* IPC ACCOUNTS TAB */}
        {activeTab === 'ipc' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest font-mono">
                {isAr ? 'ملخص موازنات وشهادات الدفع (المستخلصات)' : 'Interim Payment Certificate (IPC) Register'}
              </h3>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-red text-white hover:bg-brand-red-dark rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تقديم مستخلص جديد' : 'Submit IPC'}</span>
                </button>
              )}
            </div>

            {showForm ? (
              /* Specialized IPC Form */
              <form onSubmit={handleCreateIPC} className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-3 font-bold border-b pb-1 text-slate-600 dark:text-slate-300">
                  {isAr ? 'استمارة تسجيل مستخلص جديد (IPC)' : 'IPC Account submission form'}
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'رقم المستخلص (مطلوب)' : 'IPC Number'}</label>
                  <input required type="text" value={ipcNum} onChange={e => setIpcNum(e.target.value)} placeholder="e.g. IPC-09" className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'تاريخ القياس والأعمال المنجزة' : 'Work till Date'}</label>
                  <input type="date" value={ipcWorkTill} onChange={e => setIpcWorkTill(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'قيمة الفاتورة الإجمالية' : 'Invoice Gross Value'}</label>
                  <input type="number" value={ipcGross || ''} onChange={e => setIpcGross(Number(e.target.value))} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'تاريخ التقديم للاستشاري' : 'Submission Date'}</label>
                  <input type="date" value={ipcSubDate} onChange={e => setIpcSubDate(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'قيمة الفاتورة الصافية' : 'Invoice Net Value'}</label>
                  <input type="number" value={ipcNet || ''} onChange={e => setIpcNet(Number(e.target.value))} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'تاريخ استلام الشهادة' : 'Receipt Date'}</label>
                  <input type="date" value={ipcRecDate} onChange={e => setIpcRecDate(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'تاريخ الاستحقاق التعاقدي' : 'Due Date'}</label>
                  <input type="date" value={ipcDueDate} onChange={e => setIpcDueDate(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'حالة الاعتماد والصرف' : 'Status'}</label>
                  <select value={ipcStatus} onChange={e => setIpcStatus(e.target.value as any)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
                    <option value="Draft">Draft / Under Prep</option>
                    <option value="Submitted">Submitted to Consultant</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Certified">Certified / Approved</option>
                    <option value="Paid">Paid Fully</option>
                    <option value="Overdue">Overdue Payment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'المبلغ المعتمد الفعلي' : 'Certified Amount'}</label>
                  <input type="number" value={ipcCert || ''} onChange={e => setIpcCert(Number(e.target.value))} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'حزمة العمل (WBS)' : 'WBS Work Package'}</label>
                  <select value={selectedWbsId} onChange={e => setSelectedWbsId(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
                    <option value="">{isAr ? '-- اختر حزمة العمل --' : '-- Select WBS Package --'}</option>
                    {wbsPackages.map(w => (
                      <option key={w.id} value={w.id}>{w.code} - {isAr && w.nameAr ? w.nameAr : w.nameEn}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'ملاحظات وتفاصيل الدورة المستندية' : 'Remarks'}</label>
                  <input type="text" value={ipcRemarks} onChange={e => setIpcRemarks(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-brand-red text-white hover:bg-brand-red-dark rounded-lg font-bold">Submit IPC</button>
                </div>
              </form>
            ) : null}

            {/* IPC List Grid */}
            {ipcs.length > 0 ? (
              <div className="space-y-4">
                {ipcs.map(ipc => {
                  const isExpanded = expandedRecordId === ipc.id;
                  const isFocused = focusedRecordId === ipc.id;
                  const linkedWbs = wbsPackages.find(w => w.id === ipc.wbsId);

                  return (
                    <div 
                      key={ipc.id} 
                      className={`bg-slate-50 dark:bg-slate-950/20 border p-5 rounded-2xl flex flex-col hover:shadow-sm transition-all text-xs space-y-4
                        ${isFocused ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-500/5' : 'border-slate-100 dark:border-slate-850'}
                      `}
                    >
                      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-brand-navy dark:text-slate-100">{ipc.ipcNumber}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              ipc.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              ipc.status === 'Certified' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                              ipc.status === 'Overdue' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                              'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              {ipc.status}
                            </span>
                          </div>
                          <div className="text-slate-400 font-mono flex items-center gap-3">
                            <span>Submitted: {ipc.ipcSubmissionDate}</span>
                            <span>|</span>
                            <span>Work till: {ipc.workTill}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="grid grid-cols-2 gap-6 text-right font-mono">
                            <div>
                              <span className="text-[10px] text-slate-400 font-sans block">{isAr ? 'القيمة الصافية الصادرة' : 'Net Submitted Value'}</span>
                              <p className="font-bold text-slate-800 dark:text-slate-200">{formatMoney(ipc.invoiceNetValue, project.currency)}</p>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-sans block">{isAr ? 'القيمة المعتمدة هندسياً' : 'Certified Amount'}</span>
                              <p className="font-extrabold text-brand-red">{formatMoney(ipc.certifiedAmount, project.currency)}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setExpandedRecordId(isExpanded ? null : ipc.id);
                              if (isFocused) setFocusedRecordId(null);
                            }}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 shrink-0"
                            title="Toggle details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {linkedWbs && (
                        <div className="flex items-center gap-1.5 text-[10px] bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400 font-mono max-w-max">
                          <Folder className="w-3.5 h-3.5 text-brand-red" />
                          <span className="font-bold">{linkedWbs.code}</span>
                          <span>-</span>
                          <span className="truncate max-w-[200px]">{isAr && linkedWbs.nameAr ? linkedWbs.nameAr : linkedWbs.nameEn}</span>
                        </div>
                      )}

                      {ipc.remarks && (
                        <p className="text-[11px] text-slate-500 bg-slate-100/50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850 leading-relaxed">
                          <span className="font-bold text-slate-400 block mb-0.5 uppercase text-[9px]">{isAr ? 'ملاحظات:' : 'Remarks:'}</span>
                          {ipc.remarks}
                        </p>
                      )}

                      {/* Expandable Contextual Attachment manager */}
                      {isExpanded && (
                        <div className="pt-4 border-t border-slate-150 dark:border-slate-800 space-y-3">
                          <h5 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                            {isAr ? 'مرفقات المستخلص المرتبطة' : 'Contextual Attachments'}
                          </h5>
                          <ContextualAttachmentsList
                            projectId={project.id}
                            entityType="IPC"
                            entityId={ipc.id}
                            lang={lang}
                            onRefresh={reloadAllProjectData}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-10 text-xs">
                {isAr ? 'لا توجد مستخلصات مسجلة لهذا المشروع.' : 'No IPCs registered yet.'}
              </div>
            )}
          </div>
        )}

        {/* CLAIMS TAB */}
        {activeTab === 'claims' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest font-mono">
                {isAr ? 'سجل تتبع وإدارة المطالبات العقدية' : 'Contractual Claims Register'}
              </h3>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-red text-white hover:bg-brand-red-dark rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تسجيل مطالبة جديدة' : 'Register Claim'}</span>
                </button>
              )}
            </div>

            {showForm ? (
              /* Specialized Claim Form */
              <form onSubmit={handleCreateClaim} className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-3 font-bold border-b pb-1 text-slate-600 dark:text-slate-300">
                  {isAr ? 'استمارة تدوين مطالبة عقدية وزمنية' : 'Specialized Claim submission form'}
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'رقم المطالبة (مطلوب)' : 'Claim Number'}</label>
                  <input required type="text" value={clmNum} onChange={e => setClmNum(e.target.value)} placeholder="e.g. CLM-03" className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'نوع المطالبة العقدية' : 'Claim Classification'}</label>
                  <select value={clmType} onChange={e => setClmType(e.target.value as any)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
                    <option value="Extension of Time">Extension of Time (EOT)</option>
                    <option value="Financial Compensation">Financial Compensation</option>
                    <option value="Both">Both (EOT + Financial)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'تاريخ التقديم الرسمي' : 'Official Submission Date'}</label>
                  <input type="date" value={clmSubDate} onChange={e => setClmSubDate(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'تمديد الزمن المطلوب (أيام)' : 'Requested Extension (Days)'}</label>
                  <input type="number" value={clmReqEot || ''} onChange={e => setClmReqEot(Number(e.target.value))} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'تمديد الزمن المعتمد (أيام)' : 'Approved Extension (Days)'}</label>
                  <input type="number" value={clmAppEot || ''} onChange={e => setClmAppEot(Number(e.target.value))} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'المبلغ المالي المطالب به' : 'Additional Claimed Amount'}</label>
                  <input type="number" value={clmAmt || ''} onChange={e => setClmAmt(Number(e.target.value))} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'المبلغ المالي المعتمد' : 'Approved Amount'}</label>
                  <input type="number" value={clmAppAmt || ''} onChange={e => setClmAppAmt(Number(e.target.value))} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'المبلغ المفوتل المعتمد' : 'Invoiced Amount'}</label>
                  <input type="number" value={clmInvAmt || ''} onChange={e => setClmInvAmt(Number(e.target.value))} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'حالة مراجعة المطالبة' : 'Status'}</label>
                  <select value={clmStatus} onChange={e => setClmStatus(e.target.value as any)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
                    <option value="Prepared">Prepared / Under Audit</option>
                    <option value="Submitted">Submitted officially</option>
                    <option value="Under Review">Under Engineer Review</option>
                    <option value="Approved">Approved / Certified</option>
                    <option value="Rejected">Rejected Fully</option>
                    <option value="Escalated">Escalated to PMO/Arbitration</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'حزمة العمل (WBS)' : 'WBS Work Package'}</label>
                  <select value={selectedWbsId} onChange={e => setSelectedWbsId(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
                    <option value="">{isAr ? '-- اختر حزمة العمل --' : '-- Select WBS Package --'}</option>
                    {wbsPackages.map(w => (
                      <option key={w.id} value={w.id}>{w.code} - {isAr && w.nameAr ? w.nameAr : w.nameEn}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'أسباب المبررات الفنية والمالية والوقائع العقدية' : 'Technical Justifications & Merits'}</label>
                  <textarea rows={2} value={clmNotes} onChange={e => setClmNotes(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-brand-red text-white hover:bg-brand-red-dark rounded-lg font-bold">Save Claim</button>
                </div>
              </form>
            ) : null}

            {/* Claims list */}
            {claims.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {claims.map(c => {
                  const isExpanded = expandedRecordId === c.id;
                  const isFocused = focusedRecordId === c.id;
                  const linkedWbs = wbsPackages.find(w => w.id === c.wbsId);

                  return (
                    <div 
                      key={c.id} 
                      className={`bg-slate-50 dark:bg-slate-950/20 border p-5 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all text-xs space-y-4
                        ${isFocused ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-500/5' : 'border-slate-100 dark:border-slate-850'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{c.claimNumber}</span>
                          <span className="text-[10px] text-slate-400 font-sans">({c.claimType})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            c.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            c.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {c.status}
                          </span>
                          <button
                            onClick={() => {
                              setExpandedRecordId(isExpanded ? null : c.id);
                              if (isFocused) setFocusedRecordId(null);
                            }}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500"
                            title="Toggle details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {linkedWbs && (
                        <div className="flex items-center gap-1.5 text-[10px] bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400 font-mono max-w-max">
                          <Folder className="w-3.5 h-3.5 text-brand-red" />
                          <span className="font-bold">{linkedWbs.code}</span>
                          <span>-</span>
                          <span className="truncate max-w-[180px]">{isAr && linkedWbs.nameAr ? linkedWbs.nameAr : linkedWbs.nameEn}</span>
                        </div>
                      )}

                      {c.notes && <p className="text-xs text-slate-400 italic line-clamp-2">{c.notes}</p>}

                      {/* Cross-Module Relationship linkages demonstration */}
                      <div className="flex flex-wrap gap-2 text-[10px]">
                        <span className="text-slate-400 flex items-center gap-1 font-bold">
                          <Link className="w-3.5 h-3.5 text-slate-400" />
                          <span>{isAr ? 'علاقات عابرة لوحدات النظام:' : 'Cross-Module Links:'}</span>
                        </span>
                        <button 
                          onClick={() => { setActiveTab('vo'); setExpandedRecordId('vo-1'); }}
                          className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 rounded font-bold transition-all"
                        >
                          VO-03-R2
                        </button>
                        <button 
                          onClick={() => { setActiveTab('documents'); setExpandedRecordId('pdoc-1'); }}
                          className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 rounded font-bold transition-all"
                        >
                          DOC-CLM-ENG-09
                        </button>
                      </div>

                      <div className="h-px bg-slate-100 dark:bg-slate-850/40" />

                      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-slate-400 font-sans block">{isAr ? 'تمديد الزمن (المطلوب / المعتمد)' : 'EOT (Requested / Approved)'}</span>
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {c.requestedCompletionExtensionDays} / <span className="text-brand-red font-extrabold">{c.approvedCompletionExtensionDays || '0'}</span> {isAr ? 'أيام' : 'days'}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-sans block">{isAr ? 'التعويض المالي المطالب به' : 'Claimed Value'}</span>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200">{formatMoney(c.additionalClaimedAmount, project.currency)}</p>
                        </div>
                      </div>

                      {/* Expandable Contextual Attachment manager */}
                      {isExpanded && (
                        <div className="pt-4 border-t border-slate-150 dark:border-slate-800 space-y-3">
                          <h5 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                            {isAr ? 'مرفقات المطالبة المرتبطة' : 'Contextual Attachments'}
                          </h5>
                          <ContextualAttachmentsList
                            projectId={project.id}
                            entityType="Claim"
                            entityId={c.id}
                            lang={lang}
                            onRefresh={reloadAllProjectData}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-10 text-xs">
                {isAr ? 'لا توجد مطالبات تعاقدية مسجلة لهذا المشروع.' : 'No contractual claims registered yet.'}
              </div>
            )}
          </div>
        )}

        {/* VARIATION ORDERS TAB */}
        {activeTab === 'vo' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest font-mono">
                {isAr ? 'تتبع الأوامر التغييرية والتعليمات الهندسية' : 'Variation Order (VO) Register'}
              </h3>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-red text-white hover:bg-brand-red-dark rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تسجيل أمر تغييري جديد' : 'New VO'}</span>
                </button>
              )}
            </div>

            {showForm ? (
              /* Specialized VO Form */
              <form onSubmit={handleCreateVO} className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-3 font-bold border-b pb-1 text-slate-600 dark:text-slate-300">
                  {isAr ? 'تسجيل ومبررات أمر تغيير هندسي' : 'Specialized Variation Order Submission Form'}
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'رقم الأمر التغييري (مطلوب)' : 'VO Number'}</label>
                  <input required type="text" value={voNum} onChange={e => setVoNum(e.target.value)} placeholder="e.g. VO-04" className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'تصنيف التغيير' : 'Addition / Omission'}</label>
                  <select value={voAddOmit} onChange={e => setVoAddOmit(e.target.value as any)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
                    <option value="Addition">Addition (إضافة قيمة)</option>
                    <option value="Omission">Omission (خصم وتنازل)</option>
                    <option value="Transfer">Transfer (نقل بنود)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'نوع ومصدر التعليمات' : 'Instruction Origin'}</label>
                  <select value={voInstType} onChange={e => setVoInstType(e.target.value as any)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
                    <option value="EI">EI (Employer Instruction)</option>
                    <option value="AI">AI (Architectural Instruction)</option>
                    <option value="VO">VO (Formal Variation)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'مرجع التعليمات' : 'Instruction Ref'}</label>
                  <input type="text" value={voInstRef} onChange={e => setVoInstRef(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'تاريخ صدور التعليمات' : 'Instruction Date'}</label>
                  <input type="date" value={voInstDate} onChange={e => setVoInstDate(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'مرجع العرض التجاري (RFV)' : 'RFV Reference'}</label>
                  <input type="text" value={voRfvRef} onChange={e => setVoRfvRef(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'تاريخ العرض التجاري' : 'Commercial Date'}</label>
                  <input type="date" value={voCommDate} onChange={e => setVoCommDate(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'قيمة العرض المالي المقدم' : 'Offer Amount'}</label>
                  <input type="number" value={voCommAmt || ''} onChange={e => setVoCommAmt(Number(e.target.value))} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'تمديد الزمن المطلوب (أيام)' : 'Requested EOT Days'}</label>
                  <input type="number" value={voCommEot || ''} onChange={e => setVoCommEot(Number(e.target.value))} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'تاريخ الاعتماد الفعلي' : 'Approved Date'}</label>
                  <input type="date" value={voAppDate} onChange={e => setVoAppDate(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'المبلغ المعتمد النهائي' : 'Approved Amount'}</label>
                  <input type="number" value={voAppAmt || ''} onChange={e => setVoAppAmt(Number(e.target.value))} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'مرجع الاعتماد الرسمي' : 'Approved Reference'}</label>
                  <input type="text" value={voAppRef} onChange={e => setVoAppRef(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'حالة مراجعة التغيير' : 'Status'}</label>
                  <select value={voStatus} onChange={e => setVoStatus(e.target.value as any)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
                    <option value="Draft">Draft / Under Study</option>
                    <option value="Submitted">Submitted officially</option>
                    <option value="Approved">Approved / Certified</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'الوصف الهندسي للتغيير وبنود جدول الكميات' : 'Technical Description'}</label>
                  <input required type="text" value={voTechDesc} onChange={e => setVoTechDesc(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'حزمة العمل (WBS)' : 'WBS Work Package'}</label>
                  <select value={selectedWbsId} onChange={e => setSelectedWbsId(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
                    <option value="">{isAr ? '-- اختر حزمة العمل --' : '-- Select WBS Package --'}</option>
                    {wbsPackages.map(w => (
                      <option key={w.id} value={w.id}>{w.code} - {isAr && w.nameAr ? w.nameAr : w.nameEn}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'مبررات ووقائع التغيير لخدمة مصلحة المشروع' : 'Merits & Business Justifications'}</label>
                  <textarea rows={2} value={voMerits} onChange={e => setVoMerits(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-brand-red text-white hover:bg-brand-red-dark rounded-lg font-bold">Save VO</button>
                </div>
              </form>
            ) : null}

            {/* VO Grid list */}
            {vos.length > 0 ? (
              <div className="space-y-4">
                {vos.map(v => {
                  const isExpanded = expandedRecordId === v.id;
                  const isFocused = focusedRecordId === v.id;
                  const linkedWbs = wbsPackages.find(w => w.id === v.wbsId);

                  return (
                    <div 
                      key={v.id} 
                      className={`bg-slate-50 dark:bg-slate-950/20 border p-5 rounded-2xl flex flex-col hover:shadow-sm transition-all text-xs space-y-4
                        ${isFocused ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-500/5' : 'border-slate-100 dark:border-slate-850'}
                      `}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{v.voNumber}</span>
                          <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded text-[9px] font-mono font-bold">
                            {v.technicalDescription.additionOrOmission}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            v.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            v.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {v.status}
                          </span>
                          <button
                            onClick={() => {
                              setExpandedRecordId(isExpanded ? null : v.id);
                              if (isFocused) setFocusedRecordId(null);
                            }}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500"
                            title="Toggle details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {linkedWbs && (
                        <div className="flex items-center gap-1.5 text-[10px] bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400 font-mono max-w-max">
                          <Folder className="w-3.5 h-3.5 text-brand-red" />
                          <span className="font-bold">{linkedWbs.code}</span>
                          <span>-</span>
                          <span className="truncate max-w-[180px]">{isAr && linkedWbs.nameAr ? linkedWbs.nameAr : linkedWbs.nameEn}</span>
                        </div>
                      )}

                      <div className="space-y-1 bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{v.technicalDescription.description}</p>
                        {v.technicalDescription.merits && <p className="text-[11px] text-slate-400 mt-1">Merits: {v.technicalDescription.merits}</p>}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-slate-400 font-sans block">{isAr ? 'مرجع التعليمات المصدق' : 'EI Reference'}</span>
                          <p className="font-bold">{v.employerInstruction.reference} ({v.employerInstruction.instructionType})</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-sans block">{isAr ? 'قيمة العرض المالي' : 'Offered Amount'}</span>
                          <p className="font-bold">{formatMoney(v.commercialOffer.amount, project.currency)}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-sans block">{isAr ? 'تمديد الزمن (أيام)' : 'EOT Days'}</span>
                          <p className="font-bold">{v.commercialOffer.extensionOfTimeDays} {isAr ? 'أيام' : 'days'}</p>
                        </div>
                        {v.approval && (
                          <div>
                            <span className="text-[10px] text-slate-400 font-sans block">{isAr ? 'القيمة المعتمدة المصادق عليها' : 'Approved Amount'}</span>
                            <p className="font-extrabold text-brand-red">{formatMoney(v.approval.approvedAmount, project.currency)}</p>
                          </div>
                        )}
                      </div>

                      {/* Expandable Contextual Attachment manager */}
                      {isExpanded && (
                        <div className="pt-4 border-t border-slate-150 dark:border-slate-800 space-y-3">
                          <h5 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                            {isAr ? 'مرفقات الأمر التغييري المرتبطة' : 'Contextual Attachments'}
                          </h5>
                          <ContextualAttachmentsList
                            projectId={project.id}
                            entityType="VO"
                            entityId={v.id}
                            lang={lang}
                            onRefresh={reloadAllProjectData}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-10 text-xs">
                {isAr ? 'لا توجد أوامر تغييرية مسجلة لهذا المشروع.' : 'No variation orders registered yet.'}
              </div>
            )}
          </div>
        )}

        {/* NOC PERMITS TAB */}
        {activeTab === 'noc' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest font-mono">
                {isAr ? 'سجل تتبع الموافقات والتصاريح الحكومية' : 'Regulatory NOC Permits Register'}
              </h3>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-red text-white hover:bg-brand-red-dark rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تسجيل تصريح جديد' : 'New Permit'}</span>
                </button>
              )}
            </div>

            {showForm ? (
              /* Specialized NOC Form */
              <form onSubmit={handleCreateNOC} className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="md:col-span-2 font-bold border-b pb-1 text-slate-600 dark:text-slate-300">
                  {isAr ? 'استمارة تتبع موافقة جهة حكومية/تنظيمية' : 'NOC / Permit details submission form'}
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'رقم السجل الداخلي (مطلوب)' : 'NOC internal number'}</label>
                  <input required type="text" value={nocNum} onChange={e => setNocNum(e.target.value)} placeholder="e.g. NOC-ZED-04" className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'الرقم المرجعي للخطاب' : 'Letter Reference'}</label>
                  <input required type="text" value={nocRef} onChange={e => setNocRef(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'موضوع التصريح ونطاق التمكين' : 'Subject of Permission'}</label>
                  <input required type="text" value={nocSubj} onChange={e => setNocSubj(e.target.value)} placeholder="e.g. Clearance of civil work crossings under Sector B" className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'الجهة المسؤولة عن المتابعة والقرار' : 'Pending Action By'}</label>
                  <input required type="text" value={nocAction} onChange={e => setNocAction(e.target.value)} placeholder="e.g. Civil Defense Authority" className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'حالة التدقيق والإصدار' : 'Status'}</label>
                  <select value={nocStatus} onChange={e => setNocStatus(e.target.value as any)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
                    <option value="Pending">Pending (قيد الانتظار)</option>
                    <option value="Under Review">Under Review (تحت التدقيق)</option>
                    <option value="Approved">Approved (تم الإصدار الفعلي)</option>
                    <option value="Rejected">Rejected / Blocked</option>
                  </select>
                </div>

                 <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'حزمة العمل (WBS)' : 'WBS Work Package'}</label>
                  <select value={selectedWbsId} onChange={e => setSelectedWbsId(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
                    <option value="">{isAr ? '-- اختر حزمة العمل --' : '-- Select WBS Package --'}</option>
                    {wbsPackages.map(w => (
                      <option key={w.id} value={w.id}>{w.code} - {isAr && w.nameAr ? w.nameAr : w.nameEn}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'الملاحظات والاشتراطات والمتابعات' : 'Remarks'}</label>
                  <textarea rows={2} value={nocRemarks} onChange={e => setNocRemarks(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
                </div>

                <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-brand-red text-white hover:bg-brand-red-dark rounded-lg font-bold">Save NOC</button>
                </div>
              </form>
            ) : null}

            {/* High-Density Search and Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={isAr ? 'ابحث برقم التصريح، الخطاب، الموضوع...' : 'Search by number, ref, subject...'}
                  value={nocSearch}
                  onChange={e => setNocSearch(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 dark:text-slate-100 outline-none w-full placeholder-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-[10px] text-slate-400 font-bold uppercase">{isAr ? 'تصفية حسب الحالة:' : 'Filter status:'}</span>
                <select
                  value={nocStatusFilter}
                  onChange={e => setNocStatusFilter(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold px-2.5 py-1 text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                >
                  <option value="all">{isAr ? 'الكل' : 'All States'}</option>
                  <option value="Pending">{isAr ? 'قيد الانتظار' : 'Pending'}</option>
                  <option value="Under Review">{isAr ? 'تحت التدقيق' : 'Under Review'}</option>
                  <option value="Approved">{isAr ? 'معتمد' : 'Approved'}</option>
                  <option value="Rejected">{isAr ? 'مرفوض' : 'Rejected'}</option>
                </select>
              </div>
            </div>

            {/* NOC Cards list */}
            {(() => {
              const filteredNocs = nocs.filter(noc => {
                const matchesSearch = noc.nocNumber.toLowerCase().includes(nocSearch.toLowerCase()) ||
                  noc.reference.toLowerCase().includes(nocSearch.toLowerCase()) ||
                  noc.subject.toLowerCase().includes(nocSearch.toLowerCase()) ||
                  noc.pendingActionBy.toLowerCase().includes(nocSearch.toLowerCase());
                const matchesStatus = nocStatusFilter === 'all' || noc.status === nocStatusFilter;
                return matchesSearch && matchesStatus;
              });

              return filteredNocs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredNocs.map(noc => {
                    const isExpanded = expandedRecordId === noc.id;
                    const isFocused = focusedRecordId === noc.id;
                    const linkedWbs = wbsPackages.find(w => w.id === noc.wbsId);

                    return (
                      <div 
                        key={noc.id} 
                        className={`bg-slate-50 dark:bg-slate-950/20 border p-4.5 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all text-xs space-y-3
                          ${isFocused ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-500/5' : 'border-slate-100 dark:border-slate-850'}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[9px] text-slate-500 bg-white dark:bg-slate-900 border px-2 py-0.5 rounded font-bold">{noc.nocNumber}</span>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              noc.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              noc.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              noc.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                              'bg-slate-50 text-slate-600 border border-slate-100'
                            }`}>
                              {noc.status}
                            </span>
                            <button
                              onClick={() => {
                                setExpandedRecordId(isExpanded ? null : noc.id);
                                if (isFocused) setFocusedRecordId(null);
                              }}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 animate-pulse-slow cursor-pointer"
                              title="Toggle details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {linkedWbs && (
                          <div className="flex items-center gap-1.5 text-[10px] bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400 font-mono max-w-max">
                            <Folder className="w-3.5 h-3.5 text-brand-red" />
                            <span className="font-bold">{linkedWbs.code}</span>
                            <span>-</span>
                            <span className="truncate max-w-[150px]">{isAr && linkedWbs.nameAr ? linkedWbs.nameAr : linkedWbs.nameEn}</span>
                          </div>
                        )}

                        <div className="space-y-1">
                          <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-xs">{noc.subject}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">Ref: {noc.reference}</p>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-800" />

                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                          <span>Pending: <span className="font-extrabold text-slate-700 dark:text-slate-300">{noc.pendingActionBy}</span></span>
                          
                          {/* Inline Actions */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleEditNOC(noc)}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-blue-500 cursor-pointer"
                              title="Edit Permit"
                            >
                              <PenTool className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteNOC(noc.id, noc.nocNumber)}
                              className="p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                              title="Delete Permit"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Expandable Contextual Attachment manager */}
                        {isExpanded && (
                          <div className="pt-4 border-t border-slate-150 dark:border-slate-800 space-y-3">
                            <h5 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                              {isAr ? 'مرفقات التصريح المرتبطة' : 'Contextual Attachments'}
                            </h5>
                            <ContextualAttachmentsList
                              projectId={project.id}
                              entityType="NOC"
                              entityId={noc.id}
                              lang={lang}
                              onRefresh={reloadAllProjectData}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-10 text-xs">
                  {isAr ? 'لا توجد تصاريح وموافقات مطابقة للبحث.' : 'No regulatory NOC permits found matching filter.'}
                </div>
              );
            })()}
          </div>
        )}

        {/* SPR REPORTING TAB */}
        {activeTab === 'spr' && (
          <SprReportingEngine
            project={project}
            meetings={meetings}
            ipcs={ipcs}
            claims={claims}
            vos={vos}
            nocs={nocs}
            documents={documents}
            subcontracts={subcontracts}
            lang={lang}
            savedSnapshots={sprs}
            onSaveSnapshot={async (snapshot) => {
              await projectRepo.saveSPR(snapshot);
              await projectRepo.addHistory(project.id, 'SPR Submitted', 'System', `Submitted Performance Report for ${snapshot.reportingMonth}`);
              reloadAllProjectData();
            }}
          />
        )}

        {activeTab === 'subcontractors' && (
          <SubcontractorsPanel
            project={project}
            lang={lang}
            subcontracts={subcontracts}
            wbsPackages={wbsPackages}
            reloadAllProjectData={reloadAllProjectData}
            expandedRecordId={expandedRecordId}
            setExpandedRecordId={setExpandedRecordId}
            focusedRecordId={focusedRecordId}
            setFocusedRecordId={setFocusedRecordId}
          />
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <DocumentsPanel
            project={project}
            lang={lang}
            documents={documents}
            wbsPackages={wbsPackages}
            reloadAllProjectData={reloadAllProjectData}
            expandedRecordId={expandedRecordId}
            setExpandedRecordId={setExpandedRecordId}
            focusedRecordId={focusedRecordId}
            setFocusedRecordId={setFocusedRecordId}
          />
        )}

        {/* ATTACHMENTS TAB */}
        {activeTab === 'attachments' && (
          <AttachmentsPanel
            project={project}
            lang={lang}
            attachments={attachments}
            reloadAllProjectData={reloadAllProjectData}
          />
        )}

        {/* GLOBAL SEARCH TAB */}
        {activeTab === 'search' && (
          <GlobalSearchPanel
            lang={lang}
            project={project}
            meetings={meetings}
            ipcs={ipcs}
            claims={claims}
            vos={vos}
            nocs={nocs}
            subcontracts={subcontracts}
            documents={documents}
            sprs={sprs}
            onNavigateToRecord={(tabId, recordId) => {
              setActiveTab(tabId);
              setFocusedRecordId(recordId);
              setExpandedRecordId(recordId);
            }}
          />
        )}

        {/* PROJECT SETTINGS TAB */}
        {activeTab === 'settings' && (
          <ProjectSettingsPanel
            lang={lang}
            project={project}
            onRefreshProjectData={reloadAllProjectData}
          />
        )}

        {/* AUDIT HISTORY / ACTIVITY TIMELINE TAB */}
        {activeTab === 'history' && (
          <ActivityFeedTimeline
            lang={lang}
            projectId={project.id}
          />
        )}

      </div>

    </div>
  );
}
