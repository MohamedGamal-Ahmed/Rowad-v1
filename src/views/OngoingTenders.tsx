import React, { useState, useEffect } from 'react';
import { 
  Plus, FileText, Users, FileSignature, ArrowRight, ArrowLeft, 
  Briefcase, DollarSign, BarChart2, AlertTriangle, TrendingUp, TrendingDown, Clock, 
  Activity, CheckCircle2, ChevronRight, Sparkles, Pin, X, Settings, Star, Layers, 
  MapPin, HardHat, FileSpreadsheet, Eye, Download, Check, ShieldAlert, Laptop, AlertCircle, Trash2, Send,
  UploadCloud, RefreshCw, Layers3, CheckSquare, PlusCircle, ClipboardList, Building2, Calendar
} from 'lucide-react';
import { BiText } from '../components/BiText';
import { TimelineRules } from './Settings';

// Enterprise Tender Model matching Construction Pre-Award system
export interface Tender {
  id: string;
  projectCode: string;
  tenderNumber: string;
  projectName: { en: string; ar: string };
  location: { en: string; ar: string };
  coordinator: { en: string; ar: string };
  contractsEngineer: { en: string; ar: string };
  tenderStudyEngineer?: { en: string; ar: string };
  department?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  techSubmissionDate: string;
  commSubmissionDate: string;
  overallSubmissionDate: string;
  closingDate?: string;
  kickOffDate?: string;
  alignmentDate?: string;
  followUpDate?: string;
  riskDueDate?: string;
  contractQualsDueDate?: string;
  projectStatus: { en: string; ar: string };
  awardStatus: { en: string; ar: string };
  recordStatus: 'Active' | 'Under Review' | 'Archived' | 'On Hold';
  daysRemaining: number;
  health: 'Healthy' | 'Due Soon' | 'Overdue' | 'Archived';
  estimatedValue: string;
  estimatedCost?: string;
  bondAmount: string;
  currency: string;
  tenderType: { en: string; ar: string };
  clientName: { en: string; ar: string };
  consultant?: { en: string; ar: string };
  branch?: { en: string; ar: string };
  businessUnit?: { en: string; ar: string };
  notes: Array<{ id: string; author: string; date: string; text: string }>;
  documents: Array<{ id: string; name: string; size: string; link: string }>;
  checklistReceived?: boolean;
  checklistDrawings?: boolean;
  checklistBOQ?: boolean;
  checklistSpecs?: boolean;
  siteVisitRequired?: boolean;
  siteVisitDate?: string;
}

const parseValue = (valStr: string): number => {
  if (!valStr) return 0;
  const clean = valStr.replace(/[^\d.]/g, '');
  return parseFloat(clean) || 0;
};

export const initialTenders: Tender[] = [
  {
    id: 't-1',
    projectCode: 'PC-2026-NEOM',
    tenderNumber: 'TN-83921',
    projectName: { en: 'Neom Spine Ground Terminal Expansion', ar: 'توسعة محطة النفق الأرضية بمشروع نيوم' },
    location: { en: 'NEOM - Saudi Arabia', ar: 'نيوم - المملكة العربية السعودية' },
    coordinator: { en: 'Eng. Khalid Al-Saeed', ar: 'المهندس خالد السعيد' },
    contractsEngineer: { en: 'Ahmed Mostafa', ar: 'أحمد مصطفى' },
    tenderStudyEngineer: { en: 'Eng. Salem Al-Awadi', ar: 'المهندس سالم العوضي' },
    department: 'Pre-Award Civil Core',
    priority: 'Critical',
    techSubmissionDate: '2026-07-15',
    commSubmissionDate: '2026-08-01',
    overallSubmissionDate: '2026-08-15',
    closingDate: '2026-08-30',
    kickOffDate: '2026-06-15',
    alignmentDate: '2026-07-05',
    followUpDate: '2026-07-10',
    riskDueDate: '2026-06-24',
    contractQualsDueDate: '2026-07-01',
    projectStatus: { en: 'Ready for Submittal', ar: 'جاهز للتسليم' },
    awardStatus: { en: 'Under Negotiation', ar: 'تحت التفاوض' },
    recordStatus: 'Active',
    daysRemaining: 24,
    health: 'Healthy',
    estimatedValue: 'AED 430,200,000',
    estimatedCost: 'AED 412,000,000',
    bondAmount: 'AED 8,600,000',
    currency: 'AED',
    tenderType: { en: 'Design & Build', ar: 'تصميموتشييد' },
    clientName: { en: 'NEOM Authority Co.', ar: 'شركة نيوم المساهمة' },
    consultant: { en: 'Dar Al-Handasah', ar: 'دار الهندسة المعتمدة' },
    branch: { en: 'Riyadh HQ', ar: 'الفرع الرئيسي الرياض' },
    businessUnit: { en: 'Infrastructure', ar: 'البنية التحتية' },
    notes: [
      { id: 'n1', author: 'Eng. Khalid Al-Saeed', date: '2026-06-20', text: 'All MEP clearances have been synchronized. Preparing final structural test results for enclosure.' },
      { id: 'n2', author: 'Ahmed Mostafa', date: '2026-06-18', text: 'Secured bulk rates override with local steel fabricators. Saving 4% on material budget margins.' }
    ],
    documents: [
      { id: 'd1', name: 'NEOMspine-DesignLayout-V4.pdf', size: '24.2 MB', link: '#' },
      { id: 'd2', name: 'IPC-CostEstimatesSheet-Final.xlsx', size: '12.4 MB', link: '#' },
      { id: 'd3', name: 'BankGuarantee-TenderDraft.pdf', size: '1.8 MB', link: '#' }
    ]
  },
  {
    id: 't-2',
    projectCode: 'PC-2026-DXB',
    tenderNumber: 'TN-47291',
    projectName: { en: 'Zayed Boulevard Commercial Corridor', ar: 'الممر التجاري الرئيسي بمحور الشيخ زايد' },
    location: { en: 'Dubai - United Arab Emirates', ar: 'دبي - الإمارات العربية المتحدة' },
    coordinator: { en: 'Eng. Sherif Amin', ar: 'المهندس شريف أمين' },
    contractsEngineer: { en: 'Khaled Hassan', ar: 'خالد حسن' },
    tenderStudyEngineer: { en: 'Eng. Omar Suleiman', ar: 'المهندس عمر سليمان' },
    department: 'Commercial Infrastructure',
    priority: 'High',
    techSubmissionDate: '2026-06-25',
    commSubmissionDate: '2026-07-01',
    overallSubmissionDate: '2026-07-10',
    closingDate: '2026-07-25',
    kickOffDate: '2026-05-26',
    alignmentDate: '2026-06-15',
    followUpDate: '2026-06-20',
    riskDueDate: '2026-06-04',
    contractQualsDueDate: '2026-06-11',
    projectStatus: { en: 'Preparing Proposal', ar: 'جاري إعداد العرض العلمي والمالي' },
    awardStatus: { en: 'Pending Selection', ar: 'في انتظار تحديد المقاول' },
    recordStatus: 'Active',
    daysRemaining: 4,
    health: 'Due Soon',
    estimatedValue: 'AED 620,000,000',
    estimatedCost: 'AED 595,200,000',
    bondAmount: 'AED 12,400,000',
    currency: 'AED',
    tenderType: { en: 'EPC Contract', ar: 'عقد هندسة وتشييد' },
    clientName: { en: 'EMAAR Properties', ar: 'إعمار العقارية' },
    consultant: { en: 'Parsons International', ar: 'بارسونز العالمية للاستشارات' },
    branch: { en: 'Dubai South', ar: 'فرع جنوب دبي' },
    businessUnit: { en: 'Real Estate Dev', ar: 'التطوير العقاري والمراكز' },
    notes: [
      { id: 'n3', author: 'Eng. Sherif Amin', date: '2026-06-19', text: 'Commercial proposal is awaiting executive board margin sign-off. Everything else compiles.' }
    ],
    documents: [
      { id: 'd4', name: 'DXB-Boulevardspecs-V2.pdf', size: '48.9 MB', link: '#' },
      { id: 'd5', name: 'Emaar-RFP-Addendum3.pdf', size: '4.1 MB', link: '#' }
    ]
  },
  {
    id: 't-3',
    projectCode: 'PC-2026-CAI',
    tenderNumber: 'TN-10294',
    projectName: { en: 'Cairo Capital East Logistics Hub', ar: 'المركز اللوجستي لشرق العاصمة الإدارية' },
    location: { en: 'New Cairo - Egypt', ar: 'القاهرة الجديدة - جمهورية مصر العربية' },
    coordinator: { en: 'Eng. Ramy Fawzy', ar: 'المهندس رامي فوزي' },
    contractsEngineer: { en: 'Fatma Amer', ar: 'فاطمة عامر' },
    tenderStudyEngineer: { en: 'Eng. Tamer Al-Gohary', ar: 'المهندس تامر الجوهري' },
    department: 'Logistics Projects',
    priority: 'Medium',
    techSubmissionDate: '2026-06-10',
    commSubmissionDate: '2026-06-15',
    overallSubmissionDate: '2026-06-20',
    closingDate: '2026-07-15',
    kickOffDate: '2026-05-11',
    alignmentDate: '2026-05-31',
    followUpDate: '2026-06-05',
    riskDueDate: '2026-05-20',
    contractQualsDueDate: '2026-05-27',
    projectStatus: { en: 'Submitted', ar: 'تم التسليم والمناقشة الفنية' },
    awardStatus: { en: 'Preferred Bidder', ar: 'المناقص المفضل الأفضل في الاستعراض' },
    recordStatus: 'Active',
    daysRemaining: -1,
    health: 'Overdue',
    estimatedValue: 'EGP 1,950,000,000',
    estimatedCost: 'EGP 1,870,000,000',
    bondAmount: 'EGP 39,000,000',
    currency: 'EGP',
    tenderType: { en: 'Design & Build', ar: 'تصميم وتشييد' },
    clientName: { en: 'Administrative Capital S.A.E', ar: 'شركة العاصمة الإدارية للتنمية العمرانية' },
    consultant: { en: 'ECG Engineering', ar: 'جماعة المهندسين الاستشاريين' },
    branch: { en: 'Cairo Branch', ar: 'فرع القاهرة' },
    businessUnit: { en: 'Commercial Hubs', ar: 'المراكز التجارية واللوجستيات' },
    notes: [
      { id: 'n4', author: 'Fatma Amer', date: '2026-06-12', text: 'Clarification query raised regarding foundation soil mechanics was resolved. Document attached.' }
    ],
    documents: [
      { id: 'd6', name: 'Cairo-EastLogistics-Proposal-Submitted.pdf', size: '18.3 MB', link: '#' }
    ]
  },
  {
    id: 't-4',
    projectCode: 'PC-2026-DIR',
    tenderNumber: 'TN-91827',
    projectName: { en: 'Diriyah Blvd District Substructure', ar: 'البنية التحتية لمنطقة بوليفارد الدرعية التاريخية' },
    location: { en: 'Riyadh - Saudi Arabia', ar: 'الرياض - المملكة العربية السعودية' },
    coordinator: { en: 'Eng. Yasmin Omar', ar: 'مهندسة ياسمين عمر' },
    contractsEngineer: { en: 'Salim Mansoor', ar: 'سليم منصور' },
    tenderStudyEngineer: { en: 'Eng. Hany Roushdy', ar: 'المهندس هاني رشدي' },
    department: 'Civil Understructure Unit',
    priority: 'Low',
    techSubmissionDate: '2026-05-30',
    commSubmissionDate: '2026-06-05',
    overallSubmissionDate: '2026-06-12',
    closingDate: '2026-06-30',
    kickOffDate: '2026-04-30',
    alignmentDate: '2026-05-20',
    followUpDate: '2026-05-25',
    riskDueDate: '2026-05-09',
    contractQualsDueDate: '2026-05-16',
    projectStatus: { en: 'Archived Submission', ar: 'ملف المزايدة مؤرشف' },
    awardStatus: { en: 'Completed', ar: 'انتهت المزايدة لصالح طرف آخر' },
    recordStatus: 'Archived',
    daysRemaining: 0,
    health: 'Archived',
    estimatedValue: 'SAR 310,000,000',
    estimatedCost: 'SAR 298,000,000',
    bondAmount: 'SAR 6,200,000',
    currency: 'SAR',
    tenderType: { en: 'Lump Sum Turnkey', ar: 'عقد تسليم مفتاح' },
    clientName: { en: 'Diriyah Gate Development Corp.', ar: 'هيئة تطوير بوابة الدرعية' },
    consultant: { en: 'Buro Happold', ar: 'بيورو هابولد للاستشارات' },
    branch: { en: 'Riyadh branch', ar: 'فرع الرياض' },
    businessUnit: { en: 'Infrastructure', ar: 'البنية التحتية والمرافق الإستراتيجية' },
    notes: [
      { id: 'n5', author: 'Eng. Yasmin Omar', date: '2026-05-15', text: 'Closed and archived as other priorities took over resource matrices internally.' }
    ],
    documents: [
      { id: 'd7', name: 'DiriyahDistrictSpecs_Standard.pdf', size: '9.4 MB', link: '#' }
    ]
  },
  {
    id: 't-5',
    projectCode: 'PC-2026-ALM',
    tenderNumber: 'TN-20938',
    projectName: { en: 'Al Maktoum Terminal Cargo Runway', ar: 'مدرج الشحن بمطار آل مكتوم الدولي الجديد' },
    location: { en: 'Dubai - United Arab Emirates', ar: 'دبي - الإمارات العربية المتحدة' },
    coordinator: { en: 'Eng. Khalid Al-Saeed', ar: 'المهندس خالد السعيد' },
    contractsEngineer: { en: 'Ahmed Mostafa', ar: 'أحمد مصطفى' },
    tenderStudyEngineer: { en: 'Eng. Kamal Al-Khatib', ar: 'المهندس كمال الخطيب' },
    department: 'Aviation Projects Division',
    priority: 'Critical',
    techSubmissionDate: '2026-08-20',
    commSubmissionDate: '2026-09-05',
    overallSubmissionDate: '2026-09-15',
    closingDate: '2026-10-15',
    kickOffDate: '2026-07-21',
    alignmentDate: '2026-08-10',
    followUpDate: '2026-08-15',
    riskDueDate: '2026-07-30',
    contractQualsDueDate: '2026-08-06',
    projectStatus: { en: 'Initial Stage', ar: 'المرحلة الأولية للمشروع' },
    awardStatus: { en: 'Pending Selection', ar: 'قيد انتظار الفتح الفني' },
    recordStatus: 'Active',
    daysRemaining: 60,
    health: 'Healthy',
    estimatedValue: 'AED 840,000,000',
    estimatedCost: 'AED 805,000,000',
    bondAmount: 'AED 16,800,000',
    currency: 'AED',
    tenderType: { en: 'EPC Contract', ar: 'عقد هندسة وتشييد' },
    clientName: { en: 'Dubai Aviation Engineering Projects', ar: 'دبي لمشاريع الطيران الهندسية' },
    consultant: { en: 'AECOM Middle East', ar: 'آيكوم الشرق الأوسط للاستشارات الهندسية' },
    branch: { en: 'Dubai HQ', ar: 'المكتب الرئيسي دبي' },
    businessUnit: { en: 'Heavy Civil', ar: 'المشاريع المدنية الثقيلة والمطارات' },
    notes: [
      { id: 'n6', author: 'Eng. Khalid Al-Saeed', date: '2026-06-20', text: 'Initial feasibility tests confirm that ground soil compact meets all runway specs. No premium sub-grade reinforcing is needed.' }
    ],
    documents: []
  },
  {
    id: 't-6',
    projectCode: 'PC-2026-NCW',
    tenderNumber: 'TN-55319',
    projectName: { en: 'New Cairo Wastewater Enclosure Ring', ar: 'الحلقة الدائرية لمحطة مياه القاهرة الجديدة' },
    location: { en: 'New Cairo - Egypt', ar: 'القاهرة الجديدة - جمهورية مصر العربية' },
    coordinator: { en: 'Eng. Yasmin Omar', ar: 'مهندسة ياسمين عمر' },
    contractsEngineer: { en: 'Sherif Amin', ar: 'المهندس شريف أمين' },
    tenderStudyEngineer: { en: 'Eng. Alaa El-Din', ar: 'المهندس علاء الدين' },
    department: 'Water & Wastewater Unit',
    priority: 'Medium',
    techSubmissionDate: '2026-06-29',
    commSubmissionDate: '2026-07-05',
    overallSubmissionDate: '2026-07-15',
    closingDate: '2026-08-15',
    kickOffDate: '2026-05-30',
    alignmentDate: '2026-06-19',
    followUpDate: '2026-06-24',
    riskDueDate: '2026-06-08',
    contractQualsDueDate: '2026-06-15',
    projectStatus: { en: 'Reviewing Scope', ar: 'جاري مراجعة نطاق العمل الفعلي' },
    awardStatus: { en: 'Under Negotiation', ar: 'قيد المراجعة والمطابقة' },
    recordStatus: 'Active',
    daysRemaining: 7,
    health: 'Due Soon',
    estimatedValue: 'EGP 980,000,000',
    estimatedCost: 'EGP 940,000,000',
    bondAmount: 'EGP 19,600,000',
    currency: 'EGP',
    tenderType: { en: 'Design & Build', ar: 'تصميم وتشييد' },
    clientName: { en: 'Ministry of Housing, Utilities S.A.', ar: 'وزارة الإسكان والمرافق العمرانية' },
    consultant: { en: 'Sabbour Consulting', ar: 'صَبور للاستشارات الهندسية' },
    branch: { en: 'Cairo Branch', ar: 'فرع القاهرة الكبرى' },
    businessUnit: { en: 'Heavy Civil', ar: 'المشروعات المدنية الكبرى والمياه' },
    notes: [
      { id: 'n7', author: 'Eng. Yasmin Omar', date: '2026-06-17', text: 'Shared preliminary steel pricing with estimating engine to update structural parameters.' }
    ],
    documents: [
      { id: 'd8', name: 'RingWastewaterSpecifications-V1.pdf', size: '14.0 MB', link: '#' }
    ]
  }
];

export function OngoingTenders({ 
  lang, 
  list, 
  onUpdateList,
  timelineRules 
}: { 
  lang: 'ar' | 'en'; 
  list: Tender[]; 
  onUpdateList: React.Dispatch<React.SetStateAction<Tender[]>>;
  timelineRules?: TimelineRules;
}) {
  const isAr = lang === 'ar';

  // Selected Row for detailed inspecting drawer - Pre-Opened on the first row by default
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>('t-1');
  
  // Selection matrices for batch operations
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Local state controls for modals
  const [showImportWizard, setShowImportWizard] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [analyzingFile, setAnalyzingFile] = useState(false);
  const [importStep, setImportStep] = useState<1 | 2>(1); // 1 = Upload, 2 = Compare & Resolve

  // Search and Advanced filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [recordFilter, setRecordFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [coordinatorFilter, setCoordinatorFilter] = useState('all');
  const [engineerFilter, setEngineerFilter] = useState('all');
  const [tenderTypeFilter, setTenderTypeFilter] = useState('all');

  // New Note addition inside inspect drawer
  const [newNoteText, setNewNoteText] = useState('');

  // Active Tab & Simulated Document states for Redesigned Detail Record Viewer
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'timeline' | 'activities' | 'financial' | 'docs' | 'notes' | 'history'>('overview');
  const [newDocName, setNewDocName] = useState('');
  const [newDocSize, setNewDocSize] = useState('1.8 MB');

  // Auto reset active tab on selected tender change
  useEffect(() => {
    setActiveTab('overview');
  }, [selectedTenderId]);

  // Toast notification alert system
  const [toastAlert, setToastAlert] = useState<{ type: 'success' | 'info' | 'warn'; message: string } | null>(null);

  // Auto clean toast timer
  useEffect(() => {
    if (toastAlert) {
      const timer = setTimeout(() => setToastAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastAlert]);

  // Guidelines offsets sourced from administration panel dynamics
  const rules = timelineRules || {
    kickOffOffset: -30,
    riskAssessmentOffset: -21,
    contractQualificationOffset: -14,
    alignmentOffset: -10,
    intermediateFollowUpOffset: -5
  };

  interface WizardFormState {
    projectCode: string;
    tenderNumber: string;
    projectNameAr: string;
    projectNameEn: string;
    locationEn: string;
    locationAr: string;
    tenderTypeEn: string;
    tenderTypeAr: string;
    currency: string;
    estValue: string;
    estCost: string;
    clientEn: string;
    clientAr: string;
    consultantEn: string;
    consultantAr: string;
    branchEn: string;
    branchAr: string;
    businessUnitEn: string;
    businessUnitAr: string;

    coordinatorEn: string;
    coordinatorAr: string;
    contractsEngineerEn: string;
    contractsEngineerAr: string;
    tenderStudyEngineerEn: string;
    tenderStudyEngineerAr: string;
    departmentEn: string;
    departmentAr: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';

    techDate: string;
    commDate: string;
    officialDate: string;
    closingDate: string;
    kickOffDate: string;
    alignmentDate: string;
    followUpDate: string;

    riskDueDate: string;
    contractQualsDueDate: string;
    checklistReceived: boolean;
    checklistDrawings: boolean;
    checklistBOQ: boolean;
    checklistSpecs: boolean;
    siteVisitRequired: boolean;
    siteVisitDate: string;

    overriddenFields: {
      commDate?: boolean;
      kickOffDate?: boolean;
      alignmentDate?: boolean;
      followUpDate?: boolean;
      riskDueDate?: boolean;
      contractQualsDueDate?: boolean;
    };
  }

  const getInitialWizardState = (): WizardFormState => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return {
      projectCode: `PC-2026-R${randomSuffix}`,
      tenderNumber: `TN-${randomSuffix}`,
      projectNameAr: '',
      projectNameEn: '',
      locationEn: 'Riyadh - Saudi Arabia',
      locationAr: 'الرياض - المملكة العربية السعودية',
      tenderTypeEn: 'EPC Contract',
      tenderTypeAr: 'عقد هندسة وتشييد',
      currency: 'SAR',
      estValue: '',
      estCost: '',
      clientEn: 'General Authority Co',
      clientAr: 'الهيئة العامة للتشييد',
      consultantEn: 'Dar Al-Handasah',
      consultantAr: 'دار الهندسة المعتمدة',
      branchEn: 'Riyadh Branch',
      branchAr: 'فرع الرياض الرئيسي',
      businessUnitEn: 'Infrastructure',
      businessUnitAr: 'قطاع البنية التحتية',

      coordinatorEn: 'Eng. Khalid Al-Saeed',
      coordinatorAr: 'المهندس خالد السعيد',
      contractsEngineerEn: 'Ahmed Mostafa',
      contractsEngineerAr: 'أحمد مصطفى',
      tenderStudyEngineerEn: 'Eng. Nour El-Din',
      tenderStudyEngineerAr: 'المهندس نور الدين',
      departmentEn: 'Estimating',
      departmentAr: 'قسم دراسة التكاليف',
      priority: 'Medium',

      techDate: '',
      commDate: '',
      officialDate: '',
      closingDate: '',
      kickOffDate: '',
      alignmentDate: '',
      followUpDate: '',

      riskDueDate: '',
      contractQualsDueDate: '',
      checklistReceived: false,
      checklistDrawings: false,
      checklistBOQ: false,
      checklistSpecs: false,
      siteVisitRequired: false,
      siteVisitDate: '',

      overriddenFields: {}
    };
  };

  const addDays = (dateStr: string, daysNum: number) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    date.setDate(date.getDate() + daysNum);
    return date.toISOString().split('T')[0];
  };

  // Pre-award guided Wizard setup state
  const [wizardForm, setWizardForm] = useState<WizardFormState>(getInitialWizardState());
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Auto Restore Draft
  useEffect(() => {
    if (showManualForm) {
      const saved = localStorage.getItem('preaward_wizard_draft');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setWizardForm(parsed);
        } catch (e) {
          setWizardForm(getInitialWizardState());
        }
      } else {
        setWizardForm(getInitialWizardState());
      }
      setWizardStep(1);
    }
  }, [showManualForm]);

  // Auto Save Draft whenever form data modifies
  useEffect(() => {
    if (showManualForm) {
      localStorage.setItem('preaward_wizard_draft', JSON.stringify(wizardForm));
    }
  }, [wizardForm, showManualForm]);

  const clearWizardDraft = () => {
    localStorage.removeItem('preaward_wizard_draft');
    setWizardForm(getInitialWizardState());
    setWizardStep(1);
  };

  const handleTechDateChange = (newTechDate: string) => {
    if (!newTechDate) {
      setWizardForm(prev => ({ ...prev, techDate: '' }));
      return;
    }

    const calculated: Partial<WizardFormState> = {
      techDate: newTechDate
    };

    if (!wizardForm.overriddenFields.kickOffDate) {
      calculated.kickOffDate = addDays(newTechDate, rules.kickOffOffset);
    }
    if (!wizardForm.overriddenFields.riskDueDate) {
      calculated.riskDueDate = addDays(newTechDate, rules.riskAssessmentOffset);
    }
    if (!wizardForm.overriddenFields.contractQualsDueDate) {
      calculated.contractQualsDueDate = addDays(newTechDate, rules.contractQualificationOffset);
    }
    if (!wizardForm.overriddenFields.alignmentDate) {
      calculated.alignmentDate = addDays(newTechDate, rules.alignmentOffset);
    }
    if (!wizardForm.overriddenFields.followUpDate) {
      calculated.followUpDate = addDays(newTechDate, rules.intermediateFollowUpOffset);
    }
    if (!wizardForm.overriddenFields.commDate) {
      calculated.commDate = addDays(newTechDate, 12); // Suggested 12 days after Tech
    }

    setWizardForm(prev => ({
      ...prev,
      ...calculated
    }));
  };

  const updateKickOffDate = (val: string) => {
    setWizardForm(prev => ({
      ...prev,
      kickOffDate: val,
      overriddenFields: { ...prev.overriddenFields, kickOffDate: true }
    }));
  };

  const updateRiskDueDate = (val: string) => {
    setWizardForm(prev => ({
      ...prev,
      riskDueDate: val,
      overriddenFields: { ...prev.overriddenFields, riskDueDate: true }
    }));
  };

  const updateContractQualsDueDate = (val: string) => {
    setWizardForm(prev => ({
      ...prev,
      contractQualsDueDate: val,
      overriddenFields: { ...prev.overriddenFields, contractQualsDueDate: true }
    }));
  };

  const updateAlignmentDate = (val: string) => {
    setWizardForm(prev => ({
      ...prev,
      alignmentDate: val,
      overriddenFields: { ...prev.overriddenFields, alignmentDate: true }
    }));
  };

  const updateFollowUpDate = (val: string) => {
    setWizardForm(prev => ({
      ...prev,
      followUpDate: val,
      overriddenFields: { ...prev.overriddenFields, followUpDate: true }
    }));
  };

  const updateCommDate = (val: string) => {
    setWizardForm(prev => ({
      ...prev,
      commDate: val,
      overriddenFields: { ...prev.overriddenFields, commDate: true }
    }));
  };

  // Handle Drag over style
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Simulate file analysis with high-fidelity summary feedback
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      triggerAnalysis();
    }
  };

  const triggerAnalysis = () => {
    setAnalyzingFile(true);
    setTimeout(() => {
      setAnalyzingFile(false);
      setImportStep(2);
    }, 1200);
  };

  // Confirm and ingest the parsed spreadsheet items
  const executeImportMerge = () => {
    // Inject two newly parsed tenders compared with the Tender dept PMO files
    const importedItems: Tender[] = [
      {
        id: `t-import-1`,
        projectCode: 'PC-2026-RCL',
        tenderNumber: 'TN-77121',
        projectName: { en: 'Riyadh Central Logistics Ring & Tunnels', ar: 'الطريق الدائري والأنفاق اللوجستية المركزية لمدينة الرياض' },
        location: { en: 'Riyadh - Saudi Arabia', ar: 'الرياض - المملكة العربية السعودية' },
        coordinator: { en: 'Eng. Khalid Al-Saeed', ar: 'المهندس خالد السعيد' },
        contractsEngineer: { en: 'Ahmed Mostafa', ar: 'أحمد مصطفى' },
        techSubmissionDate: '2026-08-10',
        commSubmissionDate: '2026-08-25',
        overallSubmissionDate: '2026-09-05',
        projectStatus: { en: 'Preparing Proposal', ar: 'جاري إعداد العرض العلمي والمالي' },
        awardStatus: { en: 'Pending Selection', ar: 'في انتظار تحديد المقاول' },
        recordStatus: 'Active',
        daysRemaining: 45,
        health: 'Healthy',
        estimatedValue: 'SAR 520,000,000',
        bondAmount: 'SAR 10,400,000',
        currency: 'SAR',
        tenderType: { en: 'EPC Contract', ar: 'عقد هندسة وتشييد' },
        clientName: { en: 'Ministry of Transport Services', ar: 'وزارة النقل والخدمات اللوجستية' },
        notes: [
          { id: 'in1', author: 'System Sync', date: '2026-06-21', text: 'Imported from Tender Department official release file v4.' }
        ],
        documents: []
      },
      {
        id: `t-import-2`,
        projectCode: 'PC-2026-JED',
        tenderNumber: 'TN-30291',
        projectName: { en: 'Jeddah Coastal Desalination Intake Pipeline', ar: 'مأخذ خط الأنابيب البحري لمحطة تحلية جدة' },
        location: { en: 'Jeddah - Saudi Arabia', ar: 'جدة - المملكة العربية السعودية' },
        coordinator: { en: 'Eng. Yasmin Omar', ar: 'مهندسة ياسمين عمر' },
        contractsEngineer: { en: 'Salim Mansoor', ar: 'سليم منصور' },
        techSubmissionDate: '2026-07-02',
        commSubmissionDate: '2026-07-15',
        overallSubmissionDate: '2026-07-28',
        projectStatus: { en: 'Preparing Proposal', ar: 'جاري إعداد العرض العلمي والمالي' },
        awardStatus: { en: 'Pending Selection', ar: 'في انتظار تحديد المقاول' },
        recordStatus: 'Active',
        daysRemaining: 11,
        health: 'Due Soon',
        estimatedValue: 'SAR 280,000,000',
        bondAmount: 'SAR 5,600,000',
        currency: 'SAR',
        tenderType: { en: 'Design & Build', ar: 'تصميم وتشييد' },
        clientName: { en: 'Saline Water Conversion Corporation (SWCC)', ar: 'المؤسسة العامة لتحلية المياه المالحة' },
        notes: [],
        documents: []
      }
    ];

    onUpdateList(prev => [...importedItems, ...prev]);
    setShowImportWizard(false);
    setImportStep(1);
    setSelectedTenderId(importedItems[0].id);
    setToastAlert({
      type: 'success',
      message: isAr ? 'تم دمج و استيراد السجلات وتحديث حالة المشاريع بنجاح!' : 'Pre-Award synchronization successfully completed! 2 new tenders added.'
    });
  };

  // Submit guided wizard pre-award entry
  const submitWizardTender = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!wizardForm.projectNameEn || !wizardForm.projectCode) {
      setToastAlert({
        type: 'warn',
        message: isAr ? 'يرجى ملء الاسم الإنجليزي للمشروع والرمز التلقائي.' : 'Please enter Project English Name and automatic Project Code.'
      });
      return;
    }

    if (!wizardForm.techDate || !wizardForm.commDate) {
      setToastAlert({
        type: 'warn',
        message: isAr ? 'تواريخ تقديم العطاء الفني والمالي إلزامية!' : 'Technical and Commercial submission dates are mandatory!'
      });
      return;
    }

    const isDuplicate = list.some(item => item.tenderNumber.trim().toLowerCase() === wizardForm.tenderNumber.trim().toLowerCase());
    if (isDuplicate) {
      setToastAlert({
        type: 'warn',
        message: isAr ? 'رقم المزايدة هذا مسجل بالفعل وموجود بالنظام.' : 'This Tender Number is already registered in the system.'
      });
      return;
    }

    const checklistNotes = [];
    if (wizardForm.checklistReceived) checklistNotes.push("Tender Documents Received");
    if (wizardForm.checklistDrawings) checklistNotes.push("Drawings Received");
    if (wizardForm.checklistBOQ) checklistNotes.push("BOQ Received");
    if (wizardForm.checklistSpecs) checklistNotes.push("Specifications Received");

    const extraNoteText = `Complete Pre-Award Setup Details:
• Tender Study Engineer: ${wizardForm.tenderStudyEngineerEn} (${wizardForm.tenderStudyEngineerAr})
• Department: ${wizardForm.departmentEn} • Priority: ${wizardForm.priority}
• Consultant: ${wizardForm.consultantEn}
• Branch Name: ${wizardForm.branchEn}
• Business Unit: ${wizardForm.businessUnitEn}
• Milestones:
  - Internal Kick-off: ${wizardForm.kickOffDate || 'N/A'} (Suggested: ${!wizardForm.overriddenFields.kickOffDate ? 'Yes' : 'Overridden'})
  - Risk Assessment Due: ${wizardForm.riskDueDate || 'N/A'} (Suggested: ${!wizardForm.overriddenFields.riskDueDate ? 'Yes' : 'Overridden'})
  - Qualifications Due: ${wizardForm.contractQualsDueDate || 'N/A'} (Suggested: ${!wizardForm.overriddenFields.contractQualsDueDate ? 'Yes' : 'Overridden'})
  - 1st Alignment Meeting: ${wizardForm.alignmentDate || 'N/A'} (Suggested: ${!wizardForm.overriddenFields.alignmentDate ? 'Yes' : 'Overridden'})
  - Intermediate Follow-up: ${wizardForm.followUpDate || 'N/A'} (Suggested: ${!wizardForm.overriddenFields.followUpDate ? 'Yes' : 'Overridden'})
  - Official Submission Date: ${wizardForm.officialDate || 'N/A'}
  - Closing Date: ${wizardForm.closingDate || 'N/A'}
• Checklist Completed: ${checklistNotes.join(', ') || 'None'}
• Site Visit: ${wizardForm.siteVisitRequired ? `Required on ${wizardForm.siteVisitDate}` : 'Not Required'}`;

    const createdTender: Tender = {
      id: `t-wizard-${Date.now()}`,
      projectCode: wizardForm.projectCode,
      tenderNumber: wizardForm.tenderNumber || `TN-${Math.floor(1000 + Math.random() * 9000)}`,
      projectName: { en: wizardForm.projectNameEn, ar: wizardForm.projectNameAr || wizardForm.projectNameEn },
      location: { en: wizardForm.locationEn, ar: wizardForm.locationAr },
      coordinator: { en: wizardForm.coordinatorEn, ar: wizardForm.coordinatorAr },
      contractsEngineer: { en: wizardForm.contractsEngineerEn, ar: wizardForm.contractsEngineerAr },
      tenderStudyEngineer: { en: wizardForm.tenderStudyEngineerEn, ar: wizardForm.tenderStudyEngineerAr },
      department: wizardForm.departmentEn,
      priority: wizardForm.priority,
      techSubmissionDate: wizardForm.techDate,
      commSubmissionDate: wizardForm.commDate,
      overallSubmissionDate: wizardForm.officialDate || wizardForm.commDate,
      closingDate: wizardForm.closingDate,
      kickOffDate: wizardForm.kickOffDate,
      alignmentDate: wizardForm.alignmentDate,
      followUpDate: wizardForm.followUpDate,
      riskDueDate: wizardForm.riskDueDate,
      contractQualsDueDate: wizardForm.contractQualsDueDate,
      projectStatus: { en: 'Active Study', ar: 'تحت الدراسة والتقدير' },
      awardStatus: { en: 'Pending Submission', ar: 'قيد تجهيز المغلفات' },
      recordStatus: 'Active',
      daysRemaining: wizardForm.techDate ? Math.ceil((new Date(wizardForm.techDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 30,
      health: 'Healthy',
      estimatedValue: wizardForm.estValue ? `${wizardForm.currency} ${parseFloat(wizardForm.estValue.replace(/,/g, '')).toLocaleString()}` : `${wizardForm.currency} 0`,
      estimatedCost: wizardForm.estCost ? `${wizardForm.currency} ${parseFloat(wizardForm.estCost.replace(/,/g, '')).toLocaleString()}` : `${wizardForm.currency} 0`,
      bondAmount: wizardForm.estValue ? `${wizardForm.currency} ${(parseFloat(wizardForm.estValue.replace(/,/g, '')) * 0.02).toLocaleString()}` : `${wizardForm.currency} 0`,
      currency: wizardForm.currency,
      tenderType: { en: wizardForm.tenderTypeEn, ar: wizardForm.tenderTypeAr },
      clientName: { en: wizardForm.clientEn, ar: wizardForm.clientAr },
      consultant: { en: wizardForm.consultantEn, ar: wizardForm.consultantAr },
      branch: { en: wizardForm.branchEn, ar: wizardForm.branchAr },
      businessUnit: { en: wizardForm.businessUnitEn, ar: wizardForm.businessUnitAr },
      notes: [
        { id: `wn-${Date.now()}-1`, author: 'ROWAD WIZARD', date: new Date().toISOString().split('T')[0], text: 'SaaS Guided pre-award wizard completed. System loaded timeline milestones dynamically according to Pre-Award settings.' },
        { id: `wn-${Date.now()}-2`, author: 'WIZARD LOG', date: new Date().toISOString().split('T')[0], text: extraNoteText }
      ],
      documents: []
    };

    onUpdateList(prev => [createdTender, ...prev]);
    setShowManualForm(false);
    setSelectedTenderId(createdTender.id);
    localStorage.removeItem('preaward_wizard_draft');
    
    setToastAlert({
      type: 'success',
      message: isAr ? 'تم إنشاء السجل وتوليد المواعيد والتحذيرات الزمنية وتخزينها للمناقصة الجديدة بنجاح!' : 'Tender record generated, scheduling rules applied, and timeline initialized successfully!'
    });
  };

  // Add notes directly into drawer state
  const handleAddNoteToTender = (id: string) => {
    if (!newNoteText.trim()) return;
    onUpdateList(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          notes: [
            ...t.notes,
            {
              id: `note-${Date.now()}`,
              author: isAr ? 'أحمد مصطفى' : 'Ahmed Mostafa',
              date: new Date().toISOString().split('T')[0],
              text: newNoteText.trim()
            }
          ]
        };
      }
      return t;
    }));
    setNewNoteText('');
    setToastAlert({ 
      type: 'info', 
      message: isAr ? 'تمت إضافة ملحوظتك الهندسية.' : 'Engineering note appended successfully.' 
    });
  };

  // Add document link simulation directly to the tender record state
  const handleAddDocToTender = (id: string) => {
    if (!newDocName.trim()) return;
    onUpdateList(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          documents: [
            ...t.documents,
            {
              id: `doc-${Date.now()}`,
              name: newDocName.trim().endsWith('.pdf') ? newDocName.trim() : `${newDocName.trim()}.pdf`,
              size: newDocSize || '1.8 MB',
              link: '#'
            }
          ]
        };
      }
      return t;
    }));
    setNewDocName('');
    setToastAlert({
      type: 'success',
      message: isAr ? 'تم إدراج المستند وتحديث الملف الرقمي للمشروع بنجاح!' : 'Document registered and project file updated successfully!'
    });
  };

  // Bulk archive action
  const handleBulkArchive = () => {
    if (selectedRowIds.length === 0) return;
    onUpdateList(prev => prev.map(t => {
      if (selectedRowIds.includes(t.id)) {
        return { ...t, recordStatus: 'Archived', health: 'Archived' };
      }
      return t;
    }));
    setToastAlert({ 
      type: 'success', 
      message: isAr ? `تمت أرشفة السجلات الـ ${selectedRowIds.length} المحددة بشكل كامل.` : `Archived ${selectedRowIds.length} items successfully` 
    });
    setSelectedRowIds([]);
  };

  const handleBulkExport = () => {
    if (selectedRowIds.length === 0) return;
    setToastAlert({ 
      type: 'success', 
      message: isAr ? `تصدير ملفات Excel لـ ${selectedRowIds.length} بنجاح.` : `Exporting ${selectedRowIds.length} items as a unified spreadsheet workbook.` 
    });
  };

  // Filter application
  const filteredTenders = list.filter(t => {
    const matchSearch = 
      t.projectName.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.projectName.ar.includes(searchQuery) ||
      t.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tenderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.coordinator.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.coordinator.ar.includes(searchQuery) ||
      t.contractsEngineer.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.contractsEngineer.ar.includes(searchQuery);

    const matchStatus = statusFilter === 'all' || t.projectStatus.en === statusFilter;
    const matchRecord = recordFilter === 'all' || t.recordStatus === recordFilter;
    const matchLocation = locationFilter === 'all' || t.location.en.includes(locationFilter);
    const matchCoordinator = coordinatorFilter === 'all' || t.coordinator.en === coordinatorFilter;
    const matchEngineer = engineerFilter === 'all' || t.contractsEngineer.en === engineerFilter;
    const matchTenderType = tenderTypeFilter === 'all' || t.tenderType.en === tenderTypeFilter;

    return matchSearch && matchStatus && matchRecord && matchLocation && matchCoordinator && matchEngineer && matchTenderType;
  });

  const selectedTender = list.find(t => t.id === selectedTenderId);

  return (
    <div className="px-6 py-6 max-w-[1800px] mx-auto space-y-6 animate-in fade-in duration-500 relative">
      
      {/* Dynamic Toast Alert Portal */}
      {toastAlert && (
        <div className="fixed top-24 right-8 rtl:left-8 rtl:right-auto z-50 bg-brand-navy border border-white/10 text-white flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4">
          <div className={`w-2.5 h-2.5 rounded-full ${toastAlert.type === 'success' ? 'bg-emerald-500' : toastAlert.type === 'warn' ? 'bg-brand-red' : 'bg-blue-400'}`} />
          <span className="text-xs font-semibold">{toastAlert.message}</span>
          <button onClick={() => setToastAlert(null)} className="p-0.5 hover:bg-white/10 rounded">
            <X className="w-3.5 h-3.5 text-white/50 hover:text-white" />
          </button>
        </div>
      )}

      {/* ------------------ IMPORT WIZARD MODAL ------------------ */}
      {showImportWizard && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-2xl w-full p-8 space-y-6 border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-red/10 rounded-2xl text-brand-red">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-brand-navy">
                    {isAr ? "معالج استيراد المزايدات والمناقصات" : "Tender List Import Wizard"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {isAr ? "مزامنة ومقارنة كشف المناقصات الوارد من إدارة المشتريات والـ PMO." : "Reconcile, compare, and verify central Tender Department spreadsheets."}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setShowImportWizard(false); setImportStep(1); }}
                className="p-1.5 hover:bg-gray-50 rounded-xl text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {importStep === 1 ? (
              <div className="space-y-6">
                {/* Drag Frame */}
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
                    dragActive ? 'border-brand-red bg-brand-red/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100/50'
                  }`}
                >
                  {analyzingFile ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-6">
                      <RefreshCw className="w-10 h-10 text-brand-navy animate-spin" />
                      <p className="text-xs font-bold text-brand-navy">
                        {isAr ? "جاري فك تشفير وتدقيق كشوفات إكسيل وقرائتها فنوياً..." : "Reading schema structure & checking existing project IDs..."}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">Parsing excel sheets into pre-award templates</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <UploadCloud className="w-12 h-12 text-gray-400" />
                      <p className="text-sm font-bold text-brand-navy">
                        {isAr ? "قم بسحب وإفلات كشف المناقصات (.xlsx, .csv)" : "Drag & Drop official tender spreadsheet"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {isAr ? "أو انقر لتصفح الملفات يدوياً من جهازك" : "or click to upload from local machine"}
                      </p>
                      <div className="pt-2">
                        <button 
                          onClick={triggerAnalysis}
                          className="px-4 py-2 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl text-xs font-bold shadow-sm"
                        >
                          {isAr ? "تحديد الملف يدوياً" : "Browse Files"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-extrabold text-amber-800">{isAr ? "توجيهات معيارية للمطابقة" : "Standard Reconciliation Rules"}</p>
                    <p className="text-amber-700 leading-relaxed font-sans">
                      The wizard automatically parses project codes. Existing rows will flag for validation if dates or budgets differ, protecting ongoing estimative worksheets.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Reconcile Compare Summary */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl text-center">
                    <span className="text-lg font-black text-emerald-800 block">2</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block">{isAr ? "مشاريع جديدة مكتشفة" : "New Detected"}</span>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl text-center">
                    <span className="text-lg font-black text-blue-800 block">3</span>
                    <span className="text-[10px] uppercase font-bold text-blue-600 block">{isAr ? "مشاريع مكررة ومطابقة" : "Existing Unchanged"}</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl text-center">
                    <span className="text-lg font-black text-gray-500 block">1</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">{isAr ? "مؤرشفة تلقائياً" : "Marked Archive"}</span>
                  </div>
                </div>

                {/* Comparative List Previews */}
                <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar border-t border-b border-gray-100 py-3">
                  <div className="flex justify-between items-center bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60 text-xs text-sans">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded uppercase">NEW</span>
                      <span className="font-bold text-brand-navy font-mono text-[10px]">PC-2026-RCL</span>
                      <span className="text-gray-500 truncate max-w-xs">{isAr ? "منطقة أنفاق ومسار الرياض اللوجستية" : "Riyadh Central Logistics Ring & Tunnels"}</span>
                    </div>
                    <span className="font-mono text-emerald-800 font-bold">SAR 520M</span>
                  </div>

                  <div className="flex justify-between items-center bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60 text-xs text-sans">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded uppercase">NEW</span>
                      <span className="font-bold text-brand-navy font-mono text-[10px]">PC-2026-JED</span>
                      <span className="text-gray-500 truncate max-w-xs">{isAr ? "تحلية مياه الواجهة البحرية لشاطئ جدة" : "Jeddah Coastal Desalination Pipeline"}</span>
                    </div>
                    <span className="font-mono text-emerald-800 font-bold">SAR 280M</span>
                  </div>

                  <div className="flex justify-between items-center bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/60 text-xs text-sans">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-blue-500 text-white font-black px-1.5 py-0.5 rounded uppercase">SYNC</span>
                      <span className="font-bold text-brand-navy font-mono text-[10px]">PC-2026-NEOM</span>
                      <span className="text-gray-400 truncate max-w-xs">Neom Spine Tunnel Terminal</span>
                    </div>
                    <span className="text-gray-400 text-[10px]">Budget Sync Passed</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button 
                    onClick={() => setImportStep(1)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold"
                  >
                    {isAr ? "الرجوع لخيار الرفع" : "Back to Upload"}
                  </button>
                  <button 
                    onClick={executeImportMerge}
                    className="px-6 py-2.5 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    <span>{isAr ? "تأكيد واستيراد الكشف المختار" : "Confirm Import & Merge"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ------------------ GUIDED TENDER CREATION WIZARD ------------------ */}
      {showManualForm && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="bg-white rounded-[32px] shadow-2xl max-w-6xl w-full p-6 md:p-8 space-y-6 border border-gray-100 animate-in zoom-in-95 duration-200 flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto no-scrollbar font-sans"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setShowManualForm(false);
            }}
          >
            
            {/* Left side: Wizard Steps core */}
            <div className="flex-1 flex flex-col justify-between space-y-6">
              
              {/* Header and Draft status */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-navy/10 rounded-2xl text-brand-navy shrink-0">
                    <FileSignature className="w-6 h-6 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl text-brand-navy flex items-center gap-2">
                      {isAr ? "دليل إنشاء مناقصة جديدة" : "Pre-Award Guided Tender Wizard"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isAr ? "خطوات ذكية متطابقة مع مصفوفة دراسة العطاءات ونظام التقدير للمؤسسة" : "SaaS-guided pre-award setup with real-time scheduling offsets."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    {isAr ? "مسودة تلقائية" : "Auto Saving Draft"}
                  </span>
                  <button
                    type="button"
                    onClick={clearWizardDraft}
                    className="text-[9px] text-gray-400 hover:text-brand-red font-bold underline transition-colors cursor-pointer"
                  >
                    {isAr ? "مسح المسودة والبدء من جديد" : "Clear Draft & Restart"}
                  </button>
                </div>
              </div>

              {/* Progress Stepper bar */}
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { step: 1, labelEn: 'Info', labelAr: 'البيانات العامة' },
                  { step: 2, labelEn: 'Staff', labelAr: 'التكليفات' },
                  { step: 3, labelEn: 'Dates', labelAr: 'الجدول الزمني' },
                  { step: 4, labelEn: 'Docs', labelAr: 'التحقق والمستندات' },
                  { step: 5, labelEn: 'Review', labelAr: 'المراجعة' }
                ].map((s) => {
                  const isActive = wizardStep === s.step;
                  const isCompleted = wizardStep > s.step;
                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => {
                        // Allow direct jumping if fields validated
                        if (s.step < wizardStep || (wizardForm.projectNameEn && wizardForm.projectCode)) {
                          setWizardStep(s.step);
                        }
                      }}
                      className={`flex flex-col items-center py-2.5 rounded-xl border transition-all text-center group cursor-pointer
                        ${isActive ? 'bg-brand-navy border-brand-navy text-white shadow-md' : 
                          isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 
                          'bg-gray-50/50 border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                    >
                      <span className="text-[10px] font-black tracking-widest font-mono">
                        {isCompleted ? '✓' : `0${s.step}`}
                      </span>
                      <span className="text-[10px] font-bold block truncate max-w-full px-1">
                        {isAr ? s.labelAr : s.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Steps Body */}
              <div className="flex-1 min-h-[360px] max-h-[50vh] overflow-y-auto no-scrollbar py-2 text-xs">
                
                {/* STEP 1: Project Information */}
                {wizardStep === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <span className="text-[10px] text-brand-red font-black uppercase tracking-wider block">
                      {isAr ? "القسم الأول: معلومات المشروع" : "SECTION 1 - PROJECT INFORMATION"}
                    </span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">
                          {isAr ? "كود المشروع (توليد تلقائي)" : "Project Code (Auto Generated)"}
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            disabled
                            value={wizardForm.projectCode}
                            className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold font-mono text-gray-500 flex-1 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const random = Math.floor(1000 + Math.random() * 9000);
                              setWizardForm(prev => ({ ...prev, projectCode: `PC-2026-R${random}` }));
                            }}
                            className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold cursor-pointer transition-colors"
                            title={isAr ? "توليد كود آخر" : "Regenerate unique project code"}
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">
                          {isAr ? "رقم المزايدة *" : "Tender Number *"}
                        </label>
                        <input 
                          type="text" 
                          required
                          value={wizardForm.tenderNumber}
                          onChange={(e) => setWizardForm(prev => ({ ...prev, tenderNumber: e.target.value }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold font-mono focus:outline-none focus:ring-1 focus:ring-brand-navy"
                          placeholder="TN-88291"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-450 block">
                          {isAr ? "اسم المشروع (بالعربية) *" : "Project Name (Arabic) *"}
                        </label>
                        <input 
                          type="text" 
                          required
                          value={wizardForm.projectNameAr}
                          onChange={(e) => setWizardForm(prev => ({ ...prev, projectNameAr: e.target.value }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-brand-navy"
                          placeholder="مشروع بناء خط نفط مكرر..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-450 block">
                          {isAr ? "اسم المشروع (بالإنجليزي) *" : "Project Name (English) *"}
                        </label>
                        <input 
                          type="text" 
                          required
                          value={wizardForm.projectNameEn}
                          onChange={(e) => setWizardForm(prev => ({ ...prev, projectNameEn: e.target.value }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-brand-navy"
                          placeholder="Refined Oil Pipeline Project..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">{isAr ? "الموقع الجغرافي" : "Location"}</label>
                        <input 
                          type="text" 
                          value={wizardForm.locationEn}
                          onChange={(e) => setWizardForm(prev => ({ ...prev, locationEn: e.target.value }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-brand-navy"
                          placeholder="Tabuk - Saudi Arabia"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">{isAr ? "نوع المناقصة" : "Tender Type"}</label>
                        <select 
                          value={wizardForm.tenderTypeEn}
                          onChange={(e) => setWizardForm(prev => ({ 
                            ...prev, 
                            tenderTypeEn: e.target.value,
                            tenderTypeAr: e.target.value === 'EPC Contract' ? 'عقد هندسة وتشييد' : 
                                         e.target.value === 'Design & Build' ? 'تصميم وتشييد' : 'عقد تسليم مفتاح'
                          }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-700 cursor-pointer focus:outline-none"
                        >
                          <option value="EPC Contract">EPC Contract</option>
                          <option value="Design & Build">Design & Build</option>
                          <option value="Lump Sum Turnkey">Lump Sum Turnkey</option>
                          <option value="Unit Rate Measure">Unit Rate Measure</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">{isAr ? "العملة" : "Currency"}</label>
                        <select 
                          value={wizardForm.currency}
                          onChange={(e) => setWizardForm(prev => ({ ...prev, currency: e.target.value }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-700 cursor-pointer focus:outline-none"
                        >
                          <option value="SAR">SAR (Saudi Riyal)</option>
                          <option value="AED">AED (UAE Dirham)</option>
                          <option value="USD">USD (US Dollar)</option>
                          <option value="EGP">EGP (Egyptian Pound)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">
                          {isAr ? "القيمة التقديرية للمشروع" : "Estimated Project Value"}
                        </label>
                        <input 
                          type="text" 
                          value={wizardForm.estValue}
                          onChange={(e) => setWizardForm(prev => ({ ...prev, estValue: e.target.value }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-brand-navy"
                          placeholder="e.g. 150,000,000"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">
                          {isAr ? "تكلفة العطاء التقديرية" : "Estimated Tender Cost"}
                        </label>
                        <input 
                          type="text" 
                          value={wizardForm.estCost}
                          onChange={(e) => setWizardForm(prev => ({ ...prev, estCost: e.target.value }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-brand-navy"
                          placeholder="e.g. 5,000,000"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">{isAr ? "العميل / مالك العمل" : "Client"}</label>
                        <input 
                          type="text" 
                          value={wizardForm.clientEn}
                          onChange={(e) => setWizardForm(prev => ({ ...prev, clientEn: e.target.value }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-brand-navy"
                          placeholder="Aramco"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">{isAr ? "الاستشاري" : "Consultant"}</label>
                        <input 
                          type="text" 
                          value={wizardForm.consultantEn}
                          onChange={(e) => setWizardForm(prev => ({ ...prev, consultantEn: e.target.value }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-brand-navy"
                          placeholder="Dar Al-Handasah"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">{isAr ? "الفرع المسؤول" : "Branch"}</label>
                        <select 
                          value={wizardForm.branchEn}
                          onChange={(e) => setWizardForm(prev => ({ 
                            ...prev, 
                            branchEn: e.target.value,
                            branchAr: e.target.value === 'Riyadh Branch' ? 'فرع الرياض الرئيسي' : 'فرع دبي الإقليمي'
                          }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-700 cursor-pointer focus:outline-none"
                        >
                          <option value="Riyadh Branch">Riyadh Branch</option>
                          <option value="Jeddah Branch">Jeddah Branch</option>
                          <option value="Eastern Province">Eastern Province</option>
                          <option value="Dubai District">Dubai District</option>
                          <option value="Cairo Hub">Cairo Hub</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">{isAr ? "وحدة الأعمال المقررة" : "Business Unit"}</label>
                        <select 
                          value={wizardForm.businessUnitEn}
                          onChange={(e) => setWizardForm(prev => ({ 
                            ...prev, 
                            businessUnitEn: e.target.value,
                            businessUnitAr: e.target.value === 'Infrastructure' ? 'قطاع البنية التحتية' : 'قطاع المباني والأبراج'
                          }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-700 cursor-pointer focus:outline-none"
                        >
                          <option value="Infrastructure">Infrastructure Unit</option>
                          <option value="Buildings & Towers">Buildings & Towers</option>
                          <option value="Industrial Plants">Industrial Plants</option>
                          <option value="Water & MEP">Water & MEP</option>
                        </select>
                      </div>

                    </div>
                  </div>
                )}

                {/* STEP 2: Assignments */}
                {wizardStep === 2 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <span className="text-[10px] text-brand-red font-black uppercase tracking-wider block">
                      {isAr ? "القسم الثاني: التكليفات وفريق العمل" : "SECTION 2 - ASSIGNMENTS"}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">
                          {isAr ? "منسق دراسة العطاء" : "Tender Coordinator"}
                        </label>
                        <select 
                          value={wizardForm.coordinatorEn}
                          onChange={(e) => setWizardForm(prev => ({ 
                            ...prev, 
                            coordinatorEn: e.target.value,
                            coordinatorAr: e.target.value === 'Eng. Khalid Al-Saeed' ? 'المهندس خالد السعيد' : 'مهندسة ياسمين عمر'
                          }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-700 cursor-pointer focus:outline-none"
                        >
                          <option value="Eng. Khalid Al-Saeed">Eng. Khalid Al-Saeed</option>
                          <option value="Eng. Yasmin Omar">Eng. Yasmin Omar</option>
                          <option value="Eng. Sherif Amin">Eng. Sherif Amin</option>
                          <option value="Eng. Ramy Fawzy">Eng. Ramy Fawzy</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">
                          {isAr ? "مهندس العقود الشريك" : "Contracts Engineer"}
                        </label>
                        <select 
                          value={wizardForm.contractsEngineerEn}
                          onChange={(e) => setWizardForm(prev => ({ 
                            ...prev, 
                            contractsEngineerEn: e.target.value,
                            contractsEngineerAr: e.target.value === 'Ahmed Mostafa' ? 'أحمد مصطفى' : 'خالد حسن'
                          }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-700 cursor-pointer focus:outline-none"
                        >
                          <option value="Ahmed Mostafa">Ahmed Mostafa</option>
                          <option value="Khaled Hassan">Khaled Hassan</option>
                          <option value="Fatma Amer">Fatma Amer</option>
                          <option value="Salim Mansoor">Salim Mansoor</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">
                          {isAr ? "مهندس التقديرات الفني" : "Tender Study Engineer"}
                        </label>
                        <select 
                          value={wizardForm.tenderStudyEngineerEn}
                          onChange={(e) => setWizardForm(prev => ({ 
                            ...prev, 
                            tenderStudyEngineerEn: e.target.value,
                            tenderStudyEngineerAr: e.target.value === 'Eng. Nour El-Din' ? 'المهندس نور الدين' : 'المهندس طارق قواس'
                          }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-700 cursor-pointer focus:outline-none"
                        >
                          <option value="Eng. Nour El-Din">Eng. Nour El-Din</option>
                          <option value="Eng. Tareq Kawas">Eng. Tareq Kawas</option>
                          <option value="Eng. Amr Soliman">Eng. Amr Soliman</option>
                          <option value="Eng. Hoda Mansour">Eng. Hoda Mansour</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">
                          {isAr ? "الإدارة المختصة" : "Department"}
                        </label>
                        <select 
                          value={wizardForm.departmentEn}
                          onChange={(e) => setWizardForm(prev => ({ ...prev, departmentEn: e.target.value }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-700 cursor-pointer focus:outline-none"
                        >
                          <option value="Estimating">Estimating</option>
                          <option value="Contracts">Contracts</option>
                          <option value="Engineering & Design">Engineering & Design</option>
                          <option value="Strategic Procurement">Strategic Procurement</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">
                          {isAr ? "أولوية دراسة الملف" : "Priority"}
                        </label>
                        <select 
                          value={wizardForm.priority}
                          onChange={(e) => setWizardForm(prev => ({ ...prev, priority: e.target.value as any }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-700 cursor-pointer focus:outline-none"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical Priority</option>
                        </select>
                      </div>

                    </div>
                  </div>
                )}

                {/* STEP 3: Submission Timeline & SUGGESTION ENGINE */}
                {wizardStep === 3 && (
                  <div className="space-y-4 animate-in fade-in duration-200 text-sans">
                    <span className="text-[10px] text-brand-red font-black uppercase tracking-wider block">
                      {isAr ? "القسم الثالث: المخطط الزمني وتأريخ تسليم الملفات" : "SECTION 3 - TIMELINE SUGGESTIONS"}
                    </span>

                    <div className="p-3 bg-brand-navy/5 text-brand-navy font-bold rounded-2xl flex items-start gap-2 text-[11px] border border-brand-navy/10 leading-relaxed max-w-xl">
                      <Sparkles className="w-5 h-5 text-brand-red shrink-0" />
                      <div>
                        {isAr ? "ميزة الذكاء الهيكلي نشطة: عند اختيار موعد التسليم الفني، سيقوم النظام تلقائياً بجدولة المواعيد الوسطية بناء على إعدادات الإدارة." : 
                          "Adaptive schedule suggestion active: Selecting the Technical Submission Date automatically schedules internal milestones."}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1 bg-amber-50/40 p-3 rounded-2xl border border-amber-100">
                        <label className="text-[10px] font-black uppercase text-[#183B63] block">
                          {isAr ? "تاريخ تقديم العرض الفني *" : "Technical Submission Date *"}
                        </label>
                        <input 
                          type="date" 
                          required
                          value={wizardForm.techDate}
                          onChange={(e) => handleTechDateChange(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl p-2.5 font-bold focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1 bg-amber-50/40 p-3 rounded-2xl border border-amber-100">
                        <label className="text-[10px] font-black uppercase text-[#183B63] block">
                          {isAr ? "تاريخ تقديم العرض التجاري *" : "Commercial Submission Date *"}
                        </label>
                        <div className="space-y-1.5">
                          <input 
                            type="date" 
                            required
                            value={wizardForm.commDate}
                            onChange={(e) => updateCommDate(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-2.5 font-bold focus:outline-none"
                          />
                          {wizardForm.techDate && !wizardForm.overriddenFields.commDate && (
                            <span className="text-[10px] font-black text-brand-red block">
                              ✨ {isAr ? "مقترح تلقائياً (فني + 12 أيام)" : "Suggested Automatically (+12 days)"}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">{isAr ? "تاريخ التسليم الرسمي" : "Official Submission Date"}</label>
                        <input 
                          type="date" 
                          value={wizardForm.officialDate}
                          onChange={(e) => setWizardForm(prev => ({ ...prev, officialDate: e.target.value }))}
                          className="w-full bg-gray-50 border border-gray-250 rounded-xl p-2.5 font-bold focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">{isAr ? "تاريخ إغلاق العطاء" : "Closing Date"}</label>
                        <input 
                          type="date" 
                          value={wizardForm.closingDate}
                          onChange={(e) => setWizardForm(prev => ({ ...prev, closingDate: e.target.value }))}
                          className="w-full bg-gray-50 border border-gray-250 rounded-xl p-2.5 font-bold focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5 p-3 bg-gray-50/50 rounded-2xl border border-gray-150">
                        <label className="text-[10px] font-black uppercase text-gray-450 block">{isAr ? "الاجتماع التحضيري الداخلي" : "Internal Kick-off Meeting"}</label>
                        <input 
                          type="date" 
                          value={wizardForm.kickOffDate}
                          onChange={(e) => updateKickOffDate(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl p-2 focus:outline-none"
                        />
                        {wizardForm.techDate && !wizardForm.overriddenFields.kickOffDate && (
                          <span className="text-[9px] font-bold text-emerald-600 block">
                            ✨ {isAr ? `تلميح تلقائي (${rules.kickOffOffset} أيام)` : `Suggested Automatically (${rules.kickOffOffset} days)`}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 p-3 bg-gray-50/50 rounded-2xl border border-gray-150">
                        <label className="text-[10px] font-black uppercase text-gray-450 block">{isAr ? "اجتماع المراجعة والتنسيق الأول" : "1st Alignment Meeting"}</label>
                        <input 
                          type="date" 
                          value={wizardForm.alignmentDate}
                          onChange={(e) => updateAlignmentDate(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl p-2 focus:outline-none"
                        />
                        {wizardForm.techDate && !wizardForm.overriddenFields.alignmentDate && (
                          <span className="text-[9px] font-bold text-emerald-600 block">
                            ✨ {isAr ? `تلميح تلقائي (${rules.alignmentOffset} أيام)` : `Suggested Automatically (${rules.alignmentOffset} days)`}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 p-3 bg-gray-50/50 rounded-2xl border border-gray-150">
                        <label className="text-[10px] font-black uppercase text-gray-450 block">{isAr ? "اجتماع المتابعة البيني" : "Intermediate Follow-up"}</label>
                        <input 
                          type="date" 
                          value={wizardForm.followUpDate}
                          onChange={(e) => updateFollowUpDate(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl p-2 focus:outline-none"
                        />
                        {wizardForm.techDate && !wizardForm.overriddenFields.followUpDate && (
                          <span className="text-[9px] font-bold text-emerald-600 block">
                            ✨ {isAr ? `تلميح تلقائي (${rules.intermediateFollowUpOffset} أيام)` : `Suggested Automatically (${rules.intermediateFollowUpOffset} days)`}
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* STEP 4: Contract Activities & Checklist */}
                {wizardStep === 4 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <span className="text-[10px] text-brand-red font-black uppercase tracking-wider block">
                      {isAr ? "القسم الرابع: متطلبات التعاقد والمستندات المستلمة" : "SECTION 4 - CONTRACT ACTIVITIES & CHECKLIST"}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5 p-3 bg-gray-50/50 rounded-2xl border border-gray-150">
                        <label className="text-[10px] font-black uppercase text-gray-450 block">{isAr ? "الحد الأقصى لتقرير المخاطر" : "Risk Assessment Due"}</label>
                        <input 
                          type="date" 
                          value={wizardForm.riskDueDate}
                          onChange={(e) => updateRiskDueDate(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl p-2 focus:outline-none"
                        />
                        {wizardForm.techDate && !wizardForm.overriddenFields.riskDueDate && (
                          <span className="text-[9px] font-bold text-emerald-600 block">
                            ✨ {isAr ? `تلميح تلقائي (${rules.riskAssessmentOffset} أيام)` : `Suggested Automatically (${rules.riskAssessmentOffset} days)`}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 p-3 bg-gray-50/50 rounded-2xl border border-gray-150">
                        <label className="text-[10px] font-black uppercase text-gray-450 block">{isAr ? "الحد الأقصى للمؤهلات القانونية" : "Contract Qualifications Due"}</label>
                        <input 
                          type="date" 
                          value={wizardForm.contractQualsDueDate}
                          onChange={(e) => updateContractQualsDueDate(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl p-2 focus:outline-none"
                        />
                        {wizardForm.techDate && !wizardForm.overriddenFields.contractQualsDueDate && (
                          <span className="text-[9px] font-bold text-emerald-600 block">
                            ✨ {isAr ? `تلميح تلقائي (${rules.contractQualificationOffset} أيام)` : `Suggested Automatically (${rules.contractQualificationOffset} days)`}
                          </span>
                        )}
                      </div>

                    </div>

                    {/* Checklists */}
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 space-y-3">
                      <span className="text-[10px] text-brand-navy font-black block tracking-wider uppercase">
                        🔧 {isAr ? "كشف مستندات ومرفقات العطاء" : "DOCUMENT RECEIPT CHECKLIST"}
                      </span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <label className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-150 hover:bg-gray-50 transition-colors cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={wizardForm.checklistReceived}
                            onChange={(e) => setWizardForm(prev => ({ ...prev, checklistReceived: e.target.checked }))}
                            className="rounded text-brand-red focus:ring-brand-red w-4 h-4 cursor-pointer"
                          />
                          <span className="font-bold text-gray-650">{isAr ? "تحقق مستندات العطاء الرئيسية" : "Tender Documents Received"}</span>
                        </label>

                        <label className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-150 hover:bg-gray-50 transition-colors cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={wizardForm.checklistDrawings}
                            onChange={(e) => setWizardForm(prev => ({ ...prev, checklistDrawings: e.target.checked }))}
                            className="rounded text-brand-red focus:ring-brand-red w-4 h-4 cursor-pointer"
                          />
                          <span className="font-bold text-gray-650">{isAr ? "استلام المخططات والرسوم الهندسية" : "Drawings Received"}</span>
                        </label>

                        <label className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-150 hover:bg-gray-50 transition-colors cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={wizardForm.checklistBOQ}
                            onChange={(e) => setWizardForm(prev => ({ ...prev, checklistBOQ: e.target.checked }))}
                            className="rounded text-brand-red focus:ring-brand-red w-4 h-4 cursor-pointer"
                          />
                          <span className="font-bold text-gray-650">{isAr ? "استلام كشف جداول الكميات (BOQ)" : "BOQ Received"}</span>
                        </label>

                        <label className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-150 hover:bg-gray-50 transition-colors cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={wizardForm.checklistSpecs}
                            onChange={(e) => setWizardForm(prev => ({ ...prev, checklistSpecs: e.target.checked }))}
                            className="rounded text-brand-red focus:ring-brand-red w-4 h-4 cursor-pointer"
                          />
                          <span className="font-bold text-gray-650">{isAr ? "استلام المواصفات وكراسة الشروط" : "Specifications Received"}</span>
                        </label>
                      </div>
                    </div>

                    {/* Site Visit Selection */}
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 space-y-3">
                      <span className="text-[10px] text-brand-navy font-black block tracking-wider uppercase">
                        🏗️ {isAr ? "معاينة الموقع الفعلي للمشروع" : "SITE VISIT CONTROL"}
                      </span>
                      
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <label className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-150 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={wizardForm.siteVisitRequired}
                            onChange={(e) => setWizardForm(prev => ({ ...prev, siteVisitRequired: e.target.checked }))}
                            className="rounded text-brand-red focus:ring-brand-red w-4 h-4"
                          />
                          <span className="font-bold text-gray-750">{isAr ? "زيارة الموقع مطلوبة قانوناً" : "Site Visit Required"}</span>
                        </label>

                        {wizardForm.siteVisitRequired && (
                          <div className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-150">
                            <span className="text-gray-450 font-medium">{isAr ? "تحديد موعد الزيارة مسبقاً:" : "Site Visit Date:"}</span>
                            <input 
                              type="date"
                              required
                              value={wizardForm.siteVisitDate}
                              onChange={(e) => setWizardForm(prev => ({ ...prev, siteVisitDate: e.target.value }))}
                              className="bg-white border border-gray-250 rounded-xl p-2 font-bold focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                )}

                {/* STEP 5: Review & Confirmation */}
                {wizardStep === 5 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <span className="text-[10px] text-emerald-500 font-black uppercase tracking-wider block">
                      {isAr ? "القسم الخامس: مراجعة وتأكيد بيانات العطاء" : "SECTION 5 - REVIEW & VERIFY"}
                    </span>

                    {/* Warnings and Conflicts Blocks */}
                    {(() => {
                      const warnings: string[] = [];
                      const conflicts: string[] = [];

                      // Validations
                      if (!wizardForm.projectNameEn) warnings.push(isAr ? "اسم المشروع بالإنجليزية مطلوب." : "English Project Name is required.");
                      if (!wizardForm.projectNameAr) warnings.push(isAr ? "اسم المشروع بالعربية مطلوب لتقديم السير الذاتية." : "Arabic Project Name is recommended.");
                      if (!wizardForm.tenderNumber) warnings.push(isAr ? "رقم المزايدة ضروري للمطابقة الفرعية." : "Tender Number can't be empty.");
                      if (!wizardForm.techDate) warnings.push(isAr ? "تاريخ تقديم العرض الفني إلزامي!" : "Technical Submission Date is required!");
                      if (!wizardForm.commDate) warnings.push(isAr ? "تاريخ تقديم العرض المالي إلزامي!" : "Commercial Submission Date is required!");

                      // Date conflicts logic
                      if (wizardForm.techDate && wizardForm.commDate && new Date(wizardForm.commDate) < new Date(wizardForm.techDate)) {
                        conflicts.push(isAr ? "تحذير زمني: تاريخ تقديم المالي يسبق تاريخ الفني." : "Date Conflict: Commercial Submission is scheduled before Technical Submission.");
                      }
                      if (wizardForm.techDate && wizardForm.kickOffDate && new Date(wizardForm.kickOffDate) > new Date(wizardForm.techDate)) {
                        conflicts.push(isAr ? "تضارب: موعد الاجتماع التحضيري الداخلي بعد تاريخ تسليم الفني!" : "Conflict: Internal Kick-off meeting is scheduled after Technical Submission.");
                      }
                      if (wizardForm.techDate && wizardForm.alignmentDate && new Date(wizardForm.alignmentDate) > new Date(wizardForm.techDate)) {
                        conflicts.push(isAr ? "تضارب: اجتماع التنسيق والمطابقة الأول مبرمج بعد تاريخ المزايدة!" : "Conflict: 1st Alignment meeting is configured after Technical Submission.");
                      }
                      if (wizardForm.siteVisitRequired && wizardForm.siteVisitDate && wizardForm.techDate && new Date(wizardForm.siteVisitDate) > new Date(wizardForm.techDate)) {
                        conflicts.push(isAr ? "تحذير: تاريخ معاينة الموقع تم بعد انتهاء موعد تسليم العطاء الفني!" : "Warning: Site Visit Date is planned after Technical Submission.");
                      }

                      return (
                        <div className="space-y-2">
                          {warnings.length > 0 && (
                            <div className="p-3 bg-red-50 text-red-800 rounded-2xl border border-red-100 space-y-1">
                              <span className="font-extrabold block">🚨 {isAr ? "الحقول الإلزامية المفقودة:" : "Missing Required Fields:"}</span>
                              <ul className="list-disc pl-4 rtl:pr-4 rtl:pl-0 text-[11px] font-medium">
                                {warnings.map((w, idx) => <li key={idx}>{w}</li>)}
                              </ul>
                            </div>
                          )}

                          {conflicts.length > 0 && (
                            <div className="p-3 bg-amber-50 text-amber-800 rounded-2xl border border-amber-100 space-y-1">
                              <span className="font-extrabold block">⚠️ {isAr ? "تضارب التواريخ والمحاذير:" : "Potential Date Conflicts:"}</span>
                              <ul className="list-disc pl-4 rtl:pr-4 rtl:pl-0 text-[11px] font-medium text-amber-900">
                                {conflicts.map((c, idx) => <li key={idx}>{c}</li>)}
                              </ul>
                            </div>
                          )}

                          {warnings.length === 0 && conflicts.length === 0 && (
                            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 font-bold block text-center">
                              🛡️ {isAr ? "موافقة النظام: كل التواريخ والمستندات متطابقة مئة بالمئة!" : "Compliant Structure: All date orders are logically sound!"}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Summary cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="bg-gray-50/50 p-3.5 rounded-2xl border border-gray-150 space-y-1.5">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase block">{isAr ? "الأكواد العامة" : "PROJECT IDENTIFIERS"}</span>
                        <p className="font-bold text-brand-navy block truncate"><span className="text-[#183B63] select-none">{isAr ? "الكود: " : "Code: "}</span> {wizardForm.projectCode}</p>
                        <p className="font-bold text-brand-navy block"><span className="text-[#183B63] select-none">{isAr ? "المزايدة: " : "Number: "}</span> {wizardForm.tenderNumber}</p>
                        <p className="font-extrabold text-brand-red block truncate"><span className="text-[#183B63] font-normal select-none">{isAr ? "الاسم: " : "Name: "}</span> {isAr ? (wizardForm.projectNameAr || wizardForm.projectNameEn) : wizardForm.projectNameEn}</p>
                        <p className="text-gray-550 block font-medium"><span className="text-[#183B63] font-normal select-none">{isAr ? "الموقع: " : "Location: "}</span>{wizardForm.locationEn}</p>
                      </div>

                      <div className="bg-gray-50/50 p-3.5 rounded-2xl border border-gray-150 space-y-1.5">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase block">{isAr ? "منسقين العطاء المقررة" : "ASSIGNED STAFF"}</span>
                        <p className="font-bold text-brand-navy block select-none">👔 <span className="font-medium text-gray-500">{isAr ? "المنسق: " : "Coordinator: "}</span> {wizardForm.coordinatorEn}</p>
                        <p className="font-bold text-brand-navy block select-none">📄 <span className="font-medium text-gray-500">{isAr ? "العقود: " : "Contracts: "}</span> {wizardForm.contractsEngineerEn}</p>
                        <p className="font-bold text-brand-navy block select-none">🛠️ <span className="font-medium text-gray-500">{isAr ? "التقدير: " : "Estimator: "}</span> {wizardForm.tenderStudyEngineerEn}</p>
                        <p className="font-bold text-brand-navy block select-none">🏢 <span className="font-medium text-gray-500">{isAr ? "الأولوية: " : "Priority: "}</span> <span className="text-brand-red">{wizardForm.priority}</span></p>
                      </div>

                    </div>
                  </div>
                )}

              </div>

              {/* Steps footer controls */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 flex-wrap gap-2 text-xs">
                
                <button
                  type="button"
                  onClick={() => {
                    if (wizardStep === 1) {
                      setShowManualForm(false);
                    } else {
                      setWizardStep(prev => prev - 1);
                    }
                  }}
                  className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                  <span>{wizardStep === 1 ? (isAr ? "إلغاء وإغلاق" : "Cancel") : (isAr ? "الخطوة السابقة" : "Previous")}</span>
                </button>

                <div className="flex items-center gap-2">
                  {wizardStep < 5 ? (
                    <button
                      type="button"
                      onClick={() => {
                        // Simple validations to move forward:
                        if (wizardStep === 1 && (!wizardForm.projectNameEn || !wizardForm.projectNameAr)) {
                          setToastAlert({
                            type: 'warn',
                            message: isAr ? 'يرجى ملء اسم المشروع باللغتين العربية والإنجليزية للمتابعة.' : 'Please enter Project Name in both languages to proceed.'
                          });
                          return;
                        }
                        if (wizardStep === 3 && (!wizardForm.techDate || !wizardForm.commDate)) {
                          setToastAlert({
                            type: 'warn',
                            message: isAr ? 'تواريخ تقديم العطاء الفني والمالي ضرورية جداً لمتابعة برمجة باقي الملفات.' : 'Technical and financial submittal dates are mandatory before proceeding.'
                          });
                          return;
                        }
                        setWizardStep(prev => prev + 1);
                      }}
                      className="px-6 py-2.5 bg-brand-navy hover:bg-brand-navy/95 text-white font-extrabold rounded-xl shadow-md cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <span>{isAr ? "التالي" : "Next Step"}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => submitWizardTender()}
                      disabled={!wizardForm.projectNameEn || !wizardForm.techDate || !wizardForm.commDate}
                      className="px-8 py-3 bg-brand-red hover:bg-brand-red/90 text-white font-black rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isAr ? "إنشاء وتفعيل السجل" : "Create Tender"}</span>
                    </button>
                  )}
                </div>

              </div>

            </div>

            {/* Right side: VISUAL TIMELINE PREVIEW */}
            <div className="md:w-80 md:shrink-0 bg-gray-50/70 p-5 rounded-3xl border border-gray-150 flex flex-col justify-between max-h-fit">
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3 text-center">
                  <span className="text-[10px] text-brand-red font-black tracking-widest block uppercase font-mono">
                    {isAr ? "معاينة البناء الزمني الفوري" : "LIVE SCHEDULE MONITOR"}
                  </span>
                  <h4 className="font-extrabold text-sm text-brand-navy mt-1">
                    {isAr ? "مصفوفة إجراءات ما قبل الترسية" : "Pre-Award Project Timeline"}
                  </h4>
                </div>

                {/* Milestones dynamic timeline elements */}
                <div className="relative pl-3 rtl:pl-0 rtl:pr-3 space-y-4">
                  {/* Vertical rule line of timeline */}
                  <div className="absolute top-1 bottom-1 left-4 rtl:left-auto rtl:right-4 w-0.5 border-l border-dashed border-gray-300" />
                  
                  {[
                    { key: 'received', labelEn: 'Tender Received', labelAr: 'تلقي العطاء وأبواب PMO', date: new Date().toISOString().split('T')[0], status: 'done' },
                    { key: 'kickOff', labelEn: 'Internal Kick-off', labelAr: 'الاجتماع التحضيري الداخلي', date: wizardForm.kickOffDate, status: wizardForm.kickOffDate ? 'okay' : 'empty', offset: rules.kickOffOffset },
                    { key: 'risk', labelEn: 'Risk Assessment Due', labelAr: 'تقييم مخاطر المشروع المالي', date: wizardForm.riskDueDate, status: wizardForm.riskDueDate ? 'okay' : 'empty', offset: rules.riskAssessmentOffset },
                    { key: 'quals', labelEn: 'Contract Qualifications', labelAr: 'الشروط والتحفظات القانونية', date: wizardForm.contractQualsDueDate, status: wizardForm.contractQualsDueDate ? 'okay' : 'empty', offset: rules.contractQualificationOffset },
                    { key: 'alignment', labelEn: '1st Alignment Meeting', labelAr: 'اجتماع المطابقة والتسعير الأول', date: wizardForm.alignmentDate, status: wizardForm.alignmentDate ? 'okay' : 'empty', offset: rules.alignmentOffset },
                    { key: 'tech', labelEn: 'Technical Submission', labelAr: 'تقديم العرض الفني المتكامل', date: wizardForm.techDate, status: wizardForm.techDate ? 'required-okay' : 'required-empty' },
                    { key: 'followUp', labelEn: 'Intermediate Follow-up', labelAr: 'متابعة الصياغة والتسعير البيني', date: wizardForm.followUpDate, status: wizardForm.followUpDate ? 'okay' : 'empty', offset: rules.intermediateFollowUpOffset },
                    { key: 'comm', labelEn: 'Commercial Submission', labelAr: 'تقديم السعر والعرض المالي', date: wizardForm.commDate, status: wizardForm.commDate ? 'required-okay' : 'required-empty' },
                    { key: 'official', labelEn: 'Official Submission', labelAr: 'التسجيل والتسليم الرسمي والترئيس', date: wizardForm.officialDate, status: wizardForm.officialDate ? 'okay' : 'empty' }
                  ].map((m, idx) => {
                    const isDone = m.status === 'done';
                    const isOkay = m.status === 'okay' || m.status === 'required-okay';
                    const isEmpty = m.status === 'empty' || m.status === 'required-empty';
                    const isRequired = m.status.startsWith('required-');
                    
                    // Whether it's driven automatically or overridden
                    const isSuggested = !isDone && !isEmpty && m.key !== 'official' && m.key !== 'tech' && !wizardForm.overriddenFields[m.key as any];

                    return (
                      <div key={idx} className="flex gap-4 items-start relative select-none group text-sans">
                        
                        {/* Dot container */}
                        <div className="z-10 bg-white rounded-full p-0.5 shrink-0">
                          {isDone ? (
                            <div className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
                              ✓
                            </div>
                          ) : isOkay ? (
                            <div className={`w-4.5 h-4.5 rounded-full font-black text-[9px] flex items-center justify-center border
                              ${isRequired ? 'bg-brand-red text-white border-brand-red' : 'bg-brand-navy text-white border-brand-navy'}`}>
                              •
                            </div>
                          ) : (
                            <div className={`w-4.5 h-4.5 rounded-full font-bold text-[9px] flex items-center justify-center border
                              ${isRequired ? 'bg-red-55 border-red-300 text-brand-red animate-pulse' : 'bg-gray-100 border-gray-250 text-gray-400'}`}>
                              !
                            </div>
                          )}
                        </div>

                        {/* Text labels column */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-[12px] font-extrabold leading-tight text-brand-navy flex items-center gap-1.5 wrap
                            ${isEmpty ? 'opacity-50' : ''}`}>
                            <span>{isAr ? m.labelAr : m.labelEn}</span>
                            {isRequired && <span className="text-brand-red text-xs">*</span>}
                          </p>
                          
                          <div className="flex items-center justify-between gap-1 mt-0.5">
                            <span className="text-[10px] font-bold font-mono text-gray-500">
                              {m.date ? (
                                new Date(m.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {month: 'numeric', day: 'numeric', year: '2-digit'})
                              ) : (
                                isAr ? 'غير محدد' : 'Not set'
                              )}
                            </span>

                            {isSuggested && (
                              <span className="text-[9px] font-black text-brand-red shrink-0 flex items-center gap-0.5 leading-none select-none bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                                ✨ {isAr ? 'مقترح' : 'Offset'}
                              </span>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Extra visual indicators */}
              <div className="bg-white/85 p-3 rounded-2xl border border-gray-150 mt-4 text-[10px] text-gray-400 leading-normal flex items-center gap-2">
                <span className="text-base">🔔</span>
                <p>
                  {isAr ? "تقوم الحلقات الزمنية برسم الفروقات يومياً لتنبيه منسق العقود في حالة أي تعارض طارئ." : "Days calculation warnings trigger alerts dynamically on the estimators board."}
                </p>
              </div>

            </div>

          </div>
        </div>
      )}


      {/* 1. Page Header Section with clean priority workflow */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className={`text-[32px] font-black text-brand-navy tracking-tight leading-tight ${isAr ? 'font-arabic' : 'font-sans'}`}>
            {isAr ? "المناقصات الجارية" : "Ongoing Tenders"}
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            {isAr ? "الملف التشغيلي اليومي لتتبع العروض، مواعيد التسليم الفني والمالي وتحديثات الضمانات." : "SaaS operational workspace for bid coordinators and contracts engineers."}
          </p>
        </div>
        
        {/* Actions Row aligning to strict user workflows */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setShowImportWizard(true)}
            className="px-6 py-3 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-2xl shadow-md flex items-center gap-2 text-[15px] font-extrabold transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400 transform rotate-185" />
            <span>{isAr ? "📥 استيراد كشف المناقصات" : "📥 Import Tender List"}</span>
          </button>

          <button 
            type="button"
            onClick={() => setShowManualForm(true)}
            className="px-5 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl shadow-sm flex items-center gap-2 text-[15px] font-bold transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-brand-red" />
            <span>{isAr ? "إنشاء يدوي استثنائي" : "Create Manual Tender"}</span>
          </button>
        </div>
      </div>

      {/* 2. Global Search and Filters Section */}
      <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          
          {/* Universal Search Frame */}
          <div className="relative w-full lg:max-w-md">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث برمز المشروع، أو الكود، أو المنسق، أو المهندس..." : "Search Project Code, Tender #, Coordinator, Eng..."} 
              className="w-full bg-gray-50 border border-gray-150 focus:border-brand-navy rounded-2xl py-3.5 pl-5 pr-12 rtl:pr-5 rtl:pl-12 text-[14px] text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/5 focus:bg-white transition-all animate-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 rtl:left-3 rtl:right-auto flex items-center px-2 text-gray-400 hover:text-brand-red text-sm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Clear controls */}
          <div className="flex flex-wrap items-center gap-2 text-[14px] font-sans">
            <button 
              onClick={() => {
                setStatusFilter('all');
                setRecordFilter('all');
                setLocationFilter('all');
                setCoordinatorFilter('all');
                setEngineerFilter('all');
                setTenderTypeFilter('all');
                setSearchQuery('');
              }}
              className="text-brand-red hover:underline font-bold"
            >
              {isAr ? "إعادة تعيين الفلاتر" : "Clear Filters"}
            </button>
          </div>
        </div>

        {/* Multi-Parameter Filter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-4 border-t border-gray-100 select-none">
          
          <div>
            <label className="text-[14px] uppercase font-bold text-gray-400 block mb-1.5">{isAr ? "حالة الملف الفني" : "Project Status"}</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-150 rounded-2xl px-4 py-3 text-[14px] text-gray-600 font-bold focus:outline-none focus:ring-4 focus:ring-brand-navy/5 w-full cursor-pointer"
            >
              <option value="all">{isAr ? "حالة الملف: الكل" : "All Status"}</option>
              <option value="Ready for Submittal">Ready for Submittal</option>
              <option value="Preparing Proposal">Preparing Proposal</option>
              <option value="Submitted">Submitted</option>
              <option value="Reviewing Scope">Reviewing Scope</option>
            </select>
          </div>

          <div>
            <label className="text-[14px] uppercase font-bold text-gray-400 block mb-1.5">{isAr ? "حالة السجل بالجدول" : "Record Status"}</label>
            <select 
              value={recordFilter}
              onChange={(e) => setRecordFilter(e.target.value)}
              className="bg-gray-50 border border-gray-150 rounded-2xl px-4 py-3 text-[14px] text-gray-600 font-bold focus:outline-none focus:ring-4 focus:ring-brand-navy/5 w-full cursor-pointer"
            >
              <option value="all">{isAr ? "سجلات: الكل" : "All Records"}</option>
              <option value="Active">Active</option>
              <option value="Under Review">Under Review</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="text-[14px] uppercase font-bold text-gray-400 block mb-1.5">{isAr ? "الموقع الإقليمي" : "Location"}</label>
            <select 
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-gray-50 border border-gray-150 rounded-2xl px-4 py-3 text-[14px] text-gray-600 font-bold focus:outline-none focus:ring-4 focus:ring-brand-navy/5 w-full cursor-pointer"
            >
              <option value="all">{isAr ? "الموقع: الكل" : "All Locations"}</option>
              <option value="NEOM">NEOM</option>
              <option value="Riyadh">Riyadh</option>
              <option value="Dubai">Dubai</option>
              <option value="Cairo">Cairo</option>
            </select>
          </div>

          <div>
            <label className="text-[14px] uppercase font-bold text-gray-400 block mb-1.5">{isAr ? "المنسق" : "Coordinator"}</label>
            <select 
              value={coordinatorFilter}
              onChange={(e) => setCoordinatorFilter(e.target.value)}
              className="bg-gray-50 border border-gray-150 rounded-2xl px-4 py-3 text-[14px] text-gray-600 font-bold focus:outline-none focus:ring-4 focus:ring-brand-navy/5 w-full cursor-pointer"
            >
              <option value="all">{isAr ? "المنسقين: الكل" : "All Coordinators"}</option>
              <option value="Eng. Khalid Al-Saeed">Eng. Khalid Al-Saeed</option>
              <option value="Eng. Sherif Amin">Eng. Sherif Amin</option>
              <option value="Eng. Ramy Fawzy">Eng. Ramy Fawzy</option>
              <option value="Eng. Yasmin Omar">Eng. Yasmin Omar</option>
            </select>
          </div>

          <div>
            <label className="text-[14px] uppercase font-bold text-gray-400 block mb-1.5">{isAr ? "مهندس العقود" : "Contracts Eng"}</label>
            <select 
              value={engineerFilter}
              onChange={(e) => setEngineerFilter(e.target.value)}
              className="bg-gray-50 border border-gray-150 rounded-2xl px-4 py-3 text-[14px] text-gray-600 font-bold focus:outline-none focus:ring-4 focus:ring-brand-navy/5 w-full cursor-pointer"
            >
              <option value="all">{isAr ? "مهندس العقود: الكل" : "All Engineers"}</option>
              <option value="Ahmed Mostafa">Ahmed Mostafa</option>
              <option value="Khaled Hassan">Khaled Hassan</option>
              <option value="Fatma Amer">Fatma Amer</option>
              <option value="Salim Mansoor">Salim Mansoor</option>
            </select>
          </div>

          <div>
            <label className="text-[14px] uppercase font-bold text-gray-400 block mb-1.5">{isAr ? "نوع المزايدة" : "Tender Type"}</label>
            <select 
              value={tenderTypeFilter}
              onChange={(e) => setTenderTypeFilter(e.target.value)}
              className="bg-gray-50 border border-gray-150 rounded-2xl px-4 py-3 text-[14px] text-gray-600 font-bold focus:outline-none focus:ring-4 focus:ring-brand-navy/5 w-full cursor-pointer"
            >
              <option value="all">{isAr ? "الأنواع: الكل" : "All Types"}</option>
              <option value="Design & Build">Design & Build</option>
              <option value="EPC Contract">EPC Contract</option>
              <option value="Lump Sum Turnkey">Lump Sum Turnkey</option>
            </select>
          </div>

        </div>
      </div>

      {/* 3. Main Data Canvas */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start relative select-none">
        
        {/* Table Column - True side-by-side Master-Detail split */}
        <div className="xl:col-span-8 space-y-4">
          
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden pb-4">
            
            {/* Table wrapper containing true data alignment */}
            <div className="overflow-x-auto premium-scrollbar">
              <table className="w-full text-start border-collapse text-sans text-[15px]">
                <thead>
                  <tr className="bg-gray-50/60 border-b border-gray-100 text-[15px] font-extrabold uppercase text-gray-400 tracking-wider">
                    <th className="py-4.5 px-5 text-center w-12">
                      <input 
                        type="checkbox"
                        checked={selectedRowIds.length === filteredTenders.length && filteredTenders.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRowIds(filteredTenders.map(t => t.id));
                          } else {
                            setSelectedRowIds([]);
                          }
                        }}
                        className="rounded border-gray-300 text-brand-navy focus:ring-brand-navy cursor-pointer w-4 h-4"
                      />
                    </th>
                    <th className="py-4.5 px-5 text-start">{isAr ? "مؤشر الصحة" : "Health"}</th>
                    <th className="py-4.5 px-5 text-start">{isAr ? "كود المشروع" : "Project Code"}</th>
                    <th className="py-4.5 px-5 text-start">{isAr ? "رقم المناقصة" : "Tender Number"}</th>
                    <th className="py-4.5 px-5 text-start min-w-[210px]">{isAr ? "اسم المشروع" : "Project Name"}</th>
                    <th className="py-4.5 px-5 text-start">{isAr ? "الموقع الجغرافي" : "Location"}</th>
                    <th className="py-4.5 px-5 text-start">{isAr ? "المنسق" : "Coordinator"}</th>
                    <th className="py-4.5 px-5 text-start">{isAr ? "مهندس العقود" : "Contracts Eng"}</th>
                    <th className="py-4.5 px-5 text-start">{isAr ? "التسليم الفني" : "Technical Sub"}</th>
                    <th className="py-4.5 px-5 text-start">{isAr ? "التسليم المالي" : "Commercial Sub"}</th>
                    <th className="py-4.5 px-5 text-start whitespace-nowrap">{isAr ? "الأيام المتبقية" : "Days Left"}</th>
                    <th className="py-4.5 px-5 text-center">{isAr ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTenders.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="p-12 text-center text-sans">
                        <div className="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto">
                          <AlertTriangle className="w-12 h-12 text-brand-red animate-pulse" />
                          <h3 className="font-bold text-brand-navy text-sm">{isAr ? "المزايدة لم يعثر عليها" : "No ongoing tenders match your criteria."}</h3>
                          <p className="text-xs text-gray-400">
                            {isAr ? "يمكنك بسهولة مراجعة فلاتر التصفية أو البدء باستيراد كشف الـ PMO بضغطة زر واحدة." : "Try resetting parameters or launch the Import Wizard for instant PMO sync."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTenders.map(t => {
                      const isSelected = selectedTenderId === t.id;
                      const isChecked = selectedRowIds.includes(t.id);
                      
                      // Health indicators mapping based on Tender department request
                      const healthIndicator = 
                        t.health === 'Healthy' ? { icon: '🟢', txt: 'Healthy', col: 'text-emerald-700 bg-emerald-50' } :
                        t.health === 'Due Soon' ? { icon: '🟡', txt: 'Due Soon', col: 'text-amber-700 bg-amber-50' } :
                        t.health === 'Overdue' ? { icon: '🔴', txt: 'Overdue', col: 'text-rose-700 bg-rose-50' } :
                        { icon: '⚫', txt: 'Archived', col: 'text-gray-500 bg-gray-100' };

                      return (
                        <tr 
                          key={t.id}
                          onClick={() => setSelectedTenderId(t.id)}
                          onDoubleClick={() => {
                            setToastAlert({
                              type: 'info',
                              message: isAr 
                                ? 'سيتم تفعيل صفحة تفاصيل المشروع الكاملة قريباً كجزء من الميزات المستقبلية!' 
                                : 'Full Project Details page will be activated soon as a future feature!'
                            });
                          }}
                          className={`hover:bg-gray-50/50 transition-all duration-150 cursor-pointer text-[15px] font-semibold text-gray-700
                            ${isSelected ? 'bg-brand-navy/5 shadow-inner' : ''}
                            ${isChecked ? 'bg-brand-navy/10' : ''}
                            ${t.recordStatus === 'Archived' ? 'opacity-70 bg-gray-100/30' : ''}
                          `}
                        >
                          {/* Row Checkbox & Toggle */}
                          <td className="py-4.5 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRowIds(prev => [...prev, t.id]);
                                } else {
                                  setSelectedRowIds(prev => prev.filter(uid => uid !== t.id));
                                }
                              }}
                              className="rounded border-gray-300 text-brand-navy focus:ring-brand-navy cursor-pointer w-4 h-4"
                            />
                          </td>

                          {/* Health Indicator Tag */}
                          <td className="py-4.5 px-5 whitespace-nowrap">
                            <span className={`px-3.5 py-1.5 rounded-full text-[12px] font-extrabold flex items-center gap-1.5 w-fit ${healthIndicator.col}`}>
                              <span>{healthIndicator.icon}</span>
                              <span className="font-sans uppercase">{healthIndicator.txt}</span>
                            </span>
                          </td>

                          {/* Code */}
                          <td className="py-4.5 px-5 font-mono font-bold text-[12px] text-gray-400">{t.projectCode}</td>
                          
                          {/* Tender Number */}
                          <td className="py-4.5 px-5 font-mono text-[12px] text-gray-400">{t.tenderNumber}</td>

                          {/* Project Name (Bilingual stacked layout support) */}
                          <td className="py-4.5 px-5">
                            <BiText 
                              text={t.projectName} 
                              primaryLang={lang} 
                              primaryClassName="font-extrabold text-brand-navy text-[16px] block tracking-tight" 
                              secondaryClassName="text-[11px] text-gray-400 leading-normal block mt-1" 
                            />
                          </td>

                          {/* Location */}
                          <td className="py-4.5 px-5 text-gray-500 font-bold">
                            <BiText text={t.location} primaryLang={lang} />
                          </td>

                          {/* Coordinator */}
                          <td className="py-4.5 px-5 text-brand-navy font-black">{isAr ? t.coordinator.ar : t.coordinator.en}</td>
                          
                          {/* Contracts Engineer */}
                          <td className="py-4.5 px-5 text-gray-600 font-semibold">{isAr ? t.contractsEngineer.ar : t.contractsEngineer.en}</td>

                          {/* Technical Sub */}
                          <td className="py-4.5 px-5 text-gray-500 font-semibold font-mono text-[13px]">{t.techSubmissionDate}</td>

                          {/* Commercial Sub */}
                          <td className="py-4.5 px-5 text-gray-500 font-semibold font-mono text-[13px]">{t.commSubmissionDate}</td>

                          {/* Days Left */}
                          <td className="py-4.5 px-5 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded text-xs font-bold leading-none ${
                              t.daysRemaining < 0 ? 'bg-red-50 text-red-700 font-sans' :
                              t.daysRemaining <= 7 ? 'bg-amber-50 text-amber-700 font-sans animate-pulse' :
                              'bg-gray-50 text-gray-600 font-mono'
                            }`}>
                              {t.daysRemaining < 0 ? (isAr ? 'متأخر' : 'Overdue') : 
                               (t.daysRemaining === 0 ? (isAr ? 'اليوم' : 'Today') : `${t.daysRemaining} ${isAr ? 'يوم' : 'days'}`)}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-4.5 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => setSelectedTenderId(t.id)}
                              className="p-1.5 hover:bg-gray-100/80 rounded-xl text-gray-400 hover:text-brand-navy cursor-pointer transition-colors"
                              title={isAr ? "عرض التفاصيل" : "View Details"}
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4. Right Drawer / Inspection Panel - preopened on row selected */}
        <div className="xl:col-span-4 transition-all duration-300">
          {selectedTender ? (
            <div className="bg-white rounded-[32px] border border-gray-150 shadow-xl p-7 space-y-6 xl:sticky xl:top-4 overflow-y-auto max-h-[85vh] premium-scrollbar">
              
              {/* Drawer Close / Header controls */}
              <div className="flex justify-between items-start pb-5 border-b border-gray-150">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block font-sans">
                      {selectedTender.projectCode}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      selectedTender.priority === 'Critical' ? 'bg-red-100 text-red-700 font-extrabold animate-pulse' :
                      selectedTender.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                      selectedTender.priority === 'Medium' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedTender.priority || 'Medium'}
                    </span>
                  </div>
                  <h3 className={`text-[20px] font-black text-brand-navy leading-tight ${isAr ? 'font-arabic' : 'font-sans'}`}>
                    {isAr ? selectedTender.projectName.ar : selectedTender.projectName.en}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedTenderId(null)}
                  className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-brand-red transition-all cursor-pointer"
                  title="Close Inspection Panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-Header Tabs Row - horizontal scrolling or tightly packed */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-gray-100 premium-scrollbar -mx-2 px-2">
                {[
                  { id: 'overview' as const, label: isAr ? 'الرئيسية' : 'Overview', icon: Briefcase },
                  { id: 'assignments' as const, label: isAr ? 'التكليفات' : 'Assignments', icon: Users },
                  { id: 'timeline' as const, label: isAr ? 'الجدول' : 'Timeline', icon: Calendar },
                  { id: 'activities' as const, label: isAr ? 'التحقق' : 'Activities', icon: CheckSquare },
                  { id: 'financial' as const, label: isAr ? 'المالية' : 'Financial', icon: DollarSign },
                  { id: 'docs' as const, label: isAr ? 'الملفات' : 'Docs', icon: FileText },
                  { id: 'notes' as const, label: isAr ? 'الملاحظات' : 'Notes', icon: Send },
                  { id: 'history' as const, label: isAr ? 'السجل' : 'History', icon: Activity },
                ].map(t => {
                  const CurrentIcon = t.icon;
                  const isTabActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        isTabActive 
                          ? 'bg-brand-navy text-white shadow-sm font-semibold' 
                          : 'bg-gray-50/70 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <CurrentIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{isAr ? "العميل الرئيسي" : "Main Client"}</span>
                    <p className="text-[14px] font-bold text-gray-700">
                      {selectedTender.clientName ? (isAr ? selectedTender.clientName.ar : selectedTender.clientName.en) : 'N/A'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? "رقم المناقصة" : "Tender Number"}</span>
                      <span className="text-[13px] font-mono font-bold text-brand-navy">{selectedTender.tenderNumber}</span>
                    </div>
                    <div className="space-y-1 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? "كود المشروع" : "Project Code"}</span>
                      <span className="text-[13px] font-mono font-bold text-brand-navy">{selectedTender.projectCode}</span>
                    </div>
                  </div>

                  <div className="space-y-1 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{isAr ? "الموقع الجغرافي" : "Geographic Location"}</span>
                    <div className="flex items-center gap-1 text-[13px] font-bold text-gray-700 mt-1">
                      <MapPin className="w-4 h-4 text-brand-red" />
                      <span>{isAr ? selectedTender.location.ar : selectedTender.location.en}</span>
                    </div>
                  </div>

                  <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? "حالة السجل وملخص التقييم" : "Process Levels & Record Status"}</span>
                    <div className="space-y-2 text-[13px] font-bold">
                      <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-50">
                        <span className="text-gray-400 text-xs font-semibold">{isAr ? "حالة المزايدة (Pre-Award)" : "Pre-Award State"}</span>
                        <span className="text-brand-navy text-[12px] font-extrabold">{isAr ? selectedTender.projectStatus.ar : selectedTender.projectStatus.en}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-50">
                        <span className="text-gray-400 text-xs font-semibold">{isAr ? "حالة الترسية" : "Award Standing"}</span>
                        <span className="text-emerald-700 text-[12px] font-extrabold">{isAr ? selectedTender.awardStatus.ar : selectedTender.awardStatus.en}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-50">
                        <span className="text-gray-400 text-xs font-semibold">{isAr ? "حالة الأرشفة" : "Record Filing"}</span>
                        <span className="text-blue-700 text-[12px] font-extrabold">{selectedTender.recordStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 text-sans">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{isAr ? "نوع عقد المزايدة" : "Tender Procurement Type"}</span>
                    <p className="text-[14px] font-extrabold text-brand-navy mt-1">
                      {isAr ? selectedTender.tenderType?.ar : selectedTender.tenderType?.en}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: ASSIGNMENTS */}
              {activeTab === 'assignments' && (
                <div className="space-y-4 animate-in fade-in duration-200 text-sans">
                  <div className="space-y-1.5 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? "الإدارة والوحدة الاستراتيجية" : "Corporate Alignment"}</span>
                    <div className="grid grid-cols-2 gap-3 text-xs mt-2">
                      <div className="bg-white p-3 rounded-xl border border-gray-50">
                        <span className="text-[10px] text-gray-400 block">{isAr ? "القسم المسؤول" : "Department"}</span>
                        <p className="font-extrabold text-[#183B63] mt-0.5 truncate">{selectedTender.department || 'Pre-Award Civil Core'}</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-50">
                        <span className="text-[10px] text-gray-400 block">{isAr ? "وحدة العمل" : "Business Unit"}</span>
                        <p className="font-extrabold text-[#183B63] mt-0.5 truncate">{selectedTender.businessUnit ? (isAr ? selectedTender.businessUnit.ar : selectedTender.businessUnit.en) : 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? "المهندسون الاستشاريون والمسؤولون" : "Allocated Staffing Structure"}</span>
                    
                    <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100 font-sans">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs text-blue-800 shrink-0">TC</div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-gray-400 block font-bold">{isAr ? "منسق دراسة العطاء" : "Tender Coordinator (Lead)"}</span>
                        <p className="text-[13px] font-extrabold text-brand-navy truncate">{isAr ? selectedTender.coordinator.ar : selectedTender.coordinator.en}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100 font-sans">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-xs text-emerald-800 shrink-0">CE</div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-gray-400 block font-bold">{isAr ? "مهندس العقود" : "Contracts Engineer"}</span>
                        <p className="text-[13px] font-extrabold text-brand-navy truncate">{isAr ? selectedTender.contractsEngineer.ar : selectedTender.contractsEngineer.en}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100 font-sans">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-xs text-purple-800 shrink-0">SE</div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-gray-400 block font-bold">{isAr ? "مهندس دراسة العطاء" : "Tender Study Engineer"}</span>
                        <p className="text-[13px] font-extrabold text-brand-navy truncate">
                          {selectedTender.tenderStudyEngineer ? (isAr ? selectedTender.tenderStudyEngineer.ar : selectedTender.tenderStudyEngineer.en) : (isAr ? "لم يتم التعيين بعد" : "Not Assigned Yet")}
                        </p>
                      </div>
                    </div>

                    {selectedTender.consultant && (
                      <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100 font-sans">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center font-bold text-xs text-amber-800 shrink-0">CS</div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-gray-400 block font-bold">{isAr ? "المكتب الاستشاري" : "Independent Consultant"}</span>
                          <p className="text-[13px] font-extrabold text-brand-navy truncate">{isAr ? selectedTender.consultant.ar : selectedTender.consultant.en}</p>
                        </div>
                      </div>
                    )}

                    {selectedTender.branch && (
                      <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100 font-sans">
                        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center font-bold text-xs text-rose-800 shrink-0">BR</div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-gray-400 block font-bold">{isAr ? "الفرع الإقليمي" : "Regional Branch Code"}</span>
                          <p className="text-[13px] font-extrabold text-brand-navy truncate">{isAr ? selectedTender.branch.ar : selectedTender.branch.en}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? "سجل الأيام المتبقية والموعد الفتح" : "Submission Lifespan"}</span>
                    <div className="flex justify-between items-center text-sans mt-1">
                      <span className="text-xs font-semibold text-gray-500">
                        {isAr ? "تاريخ إغلاق العطاء:" : "Closing Date Frame:"}
                      </span>
                      <span className="font-mono text-sm font-bold text-brand-navy">
                        {selectedTender.closingDate || '2026-08-30'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] text-gray-400 uppercase font-black block tracking-widest font-sans pl-1">
                    {isAr ? "مراحل الجدول الزمني للمزايدة" : "Tender Milestone Roadmap"}
                  </span>
                  
                  <div className="space-y-5 pt-1">
                    {[
                      { label: isAr ? 'اجتماع انطلاق المشروع' : 'Internal Kick-off Meeting', date: selectedTender.kickOffDate || '2026-06-15', status: 'done', step: 'K1' },
                      { label: isAr ? 'موعد تقديم الاستفسارات / المخاطر' : 'Risk Assessment Due', date: selectedTender.riskDueDate || '2026-06-24', status: 'done', step: 'R2' },
                      { label: isAr ? 'تحفظات وتعليقات المزايدة' : 'Contract Quals Due', date: selectedTender.contractQualsDueDate || '2026-07-01', status: 'now', step: 'C3' },
                      { label: isAr ? 'اجتماع المطابقة والاصطفاف' : '1st Alignment Meeting', date: selectedTender.alignmentDate || '2026-07-05', status: 'wait', step: 'A4' },
                      { label: isAr ? 'اجتماع المتابعة والتقدير' : 'Intermediate Follow-up', date: selectedTender.followUpDate || '2026-07-10', status: 'wait', step: 'F5' },
                      { label: isAr ? 'تقديم العرض الفني' : 'Technical Submission', date: selectedTender.techSubmissionDate, status: 'wait', step: 'T6' },
                      { label: isAr ? 'تقديم العرض المالي' : 'Commercial Submission', date: selectedTender.commSubmissionDate, status: 'wait', step: 'M7' },
                    ].map((st, i) => {
                      return (
                        <div key={i} className="flex gap-3 text-[13px] items-start font-sans relative">
                          <div className="flex flex-col items-center shrink-0 relative mt-0.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] border transition-colors z-10
                              ${st.status === 'done' ? 'bg-brand-navy text-white border-brand-navy' : 
                                st.status === 'now' ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse' : 
                                'bg-gray-50 text-gray-400 border-gray-200'}
                            `}>
                              {st.step}
                            </div>
                            {i < 6 && <div className={`w-0.5 h-11 bg-gray-100 absolute top-7 left-1/2 -translate-x-1/2 ${st.status === 'done' ? 'bg-brand-navy/50' : ''}`} />}
                          </div>
                          <div className="flex-1 pt-0.5 ml-1.5 rtl:mr-1.5 rtl:ml-0">
                            <div className="flex justify-between items-center font-extrabold text-brand-navy text-[13px]">
                              <span>{st.label}</span>
                              <span className="font-mono text-[10px] text-gray-400">{st.date}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 block">
                              {st.status === 'done' ? (isAr ? 'تم تجاوز المرحلة بنجاح' : 'Phase cleared') : 
                               st.status === 'now' ? (isAr ? 'المرحلة الحالية قيد الإنجاز' : 'Ongoing milestone priority') : 
                               (isAr ? 'بانتظار التقدم الزمني' : 'Future scheduled stage')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: ACTIVITIES */}
              {activeTab === 'activities' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-3.5 text-sans">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? "تدقيقات ومستندات الفحص الأولي" : "Initial Feasibility Checklists"}</span>
                    
                    <div className="space-y-2">
                      {[
                        { label: isAr ? 'استلام مستندات المزايدة والمخططات الأصلية' : 'Full RFP Documents Received', checked: selectedTender.checklistReceived ?? true },
                        { label: isAr ? 'دراسة وفحص المخططات الهندسية' : 'Technical Drawings Audited', checked: selectedTender.checklistDrawings ?? true },
                        { label: isAr ? 'مطابقة وتحديث جداول الكميات (BOQ)' : 'BOQ Cost Sheet Harmonized', checked: selectedTender.checklistBOQ ?? true },
                        { label: isAr ? 'مراجعة الميزات والمواصفات الفنية الخاصة بالإنشاء' : 'Technical Specifications Verified', checked: selectedTender.checklistSpecs ?? true },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-gray-100 text-[13px]">
                          {item.checked ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-200 shrink-0" />
                          )}
                          <span className={`font-semibold ${item.checked ? 'text-gray-700' : 'text-gray-400 line-through'}`}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-2 text-sans">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? "معاينة الموقع والزيارات الميدانية" : "Site Visit Verification Details"}</span>
                    <div className="bg-white p-3 rounded-xl border border-gray-50 text-[13px]">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-semibold">{isAr ? "الزيارة الميدانية مطلوبة؟" : "Site Visit Demanded?"}</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${selectedTender.siteVisitRequired ?? true ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'}`}>
                          {(selectedTender.siteVisitRequired ?? true) ? (isAr ? 'نعم - إلزامي' : 'Yes - Mandatory') : (isAr ? 'غير مطلوب' : 'No')}
                        </span>
                      </div>
                      {(selectedTender.siteVisitRequired ?? true) && (
                        <div className="flex justify-between items-center mt-2.5 border-t border-gray-50 pt-2.5">
                          <span className="text-gray-400 font-semibold">{isAr ? "موعد الزيارة المحدد:" : "Scheduled Visit Date:"}</span>
                          <span className="font-mono text-xs font-bold text-brand-navy">{selectedTender.siteVisitDate || '2026-06-30'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: FINANCIAL */}
              {activeTab === 'financial' && (
                <div className="space-y-4 animate-in fade-in duration-200 text-sans">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block pl-1">{isAr ? "ورقة البيانات والمؤشرات المالية" : "Financial Metrics & Estimative Target"}</span>
                  
                  <div className="bg-gray-900 text-white rounded-2xl p-5 space-y-4 border border-brand-navy/10 shadow-sm font-mono text-[13px]">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">{isAr ? "القيمة التقديرية للمشروع (السعر المستهدف)" : "Estimated Tender Value"}</span>
                      <span className="text-[15px] font-black text-white">{selectedTender.estimatedValue}</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-3.5">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">{isAr ? "كلفة التقدير الداخلية المتوقعة" : "Internal Estimated Cost"}</span>
                      <span className="text-[14px] font-bold text-gray-300">{selectedTender.estimatedCost || 'N/A'}</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-3.5">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">{isAr ? "هامش الربح المتوقع" : "Projected Margin Metrics"}</span>
                      <div className="text-right">
                        {(() => {
                          const val = parseValue(selectedTender.estimatedValue);
                          const cost = parseValue(selectedTender.estimatedCost || '');
                          if (val && cost && val >= cost) {
                            const margin = val - cost;
                            const marginPct = (margin / val) * 100;
                            return (
                              <div>
                                <span className="text-emerald-400 font-bold text-sm block">+{selectedTender.currency} {margin.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                                <span className="text-[10px] text-emerald-400/85">({marginPct.toFixed(2)}% Margin)</span>
                              </div>
                            );
                          }
                          return <span className="text-gray-400">N/A</span>;
                        })()}
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-3.5">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">{isAr ? "قيمة خطابات الضمان المطلوبة (2%)" : "Tender Bond Required (2%)"}</span>
                      <span className="text-emerald-400 text-sm font-black">{selectedTender.bondAmount}</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-3.5">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">{isAr ? "عملة حساب العطاء والمناقصة" : "Reporting Currency Standard"}</span>
                      <span className="text-brand-red bg-red-500/10 border border-brand-red/20 px-2 py-0.5 rounded font-bold text-xs uppercase">{selectedTender.currency}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: DOCUMENTS */}
              {activeTab === 'docs' && (
                <div className="space-y-4 animate-in fade-in duration-200 text-sans">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? "المستندات وكشوف الملف الرقمي" : "RFP Specifications & Documents"} ({selectedTender.documents.length})</span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto premium-scrollbar pr-1">
                    {selectedTender.documents.length === 0 ? (
                      <p className="text-xs text-gray-400 italic text-center py-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-150">
                        {isAr ? "لا توجد مستندات جمركية أو مواصفات فنية ملحقة بالملف." : "No documents linked to this digital project record yet."}
                      </p>
                    ) : (
                      selectedTender.documents.map(doc => (
                        <div key={doc.id} className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 text-[13px] hover:bg-gray-50 transition-all duration-150">
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-brand-red shrink-0" />
                            <span className="font-extrabold text-[#183B63] truncate text-xs">{doc.name}</span>
                            <span className="text-[10px] text-gray-400 shrink-0 font-mono">({doc.size})</span>
                          </div>
                          <a href="#" onClick={(e) => { e.preventDefault(); setToastAlert({ type: 'info', message: isAr ? 'جاري محاكاة تنزيل المستند المشفر لضمان الأمان...' : 'Simulating secure document package retrieve...' }); }} className="px-2 py-0.5 bg-white text-gray-400 hover:text-brand-navy hover:bg-gray-100 border border-gray-200 rounded text-[9px] font-bold transition-all">
                            {isAr ? "تحميل" : "DISPATCH"}
                          </a>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Document Simulation Trigger Form */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 mt-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? "تسجيل مستند فني أو مراسلة جديدة" : "Attach New Tender Document"}</span>
                    <input 
                      type="text" 
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      placeholder={isAr ? "اسم الملف (مثال: جدول الكميات المحدث)" : "Enter document name (e.g. Approved BOQ)"}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-navy transition-all"
                    />
                    <div className="flex gap-2">
                      <select 
                        value={newDocSize}
                        onChange={(e) => setNewDocSize(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl p-2 text-xs focus:outline-none text-gray-500"
                      >
                        <option value="1.2 MB">1.2 MB</option>
                        <option value="2.4 MB">2.4 MB</option>
                        <option value="4.8 MB">4.8 MB</option>
                        <option value="12.5 MB">12.5 MB</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleAddDocToTender(selectedTender.id)}
                        className="flex-1 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl text-xs font-bold transition-all py-2 cursor-pointer"
                      >
                        {isAr ? "إرفاق وتوثيق الملف" : "Register Tender File"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: NOTES */}
              {activeTab === 'notes' && (
                <div className="space-y-4 animate-in fade-in duration-200 text-sans">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? "سجل المراجعات والملاحظات الداخلية" : "Internal Engineering Notes"} ({selectedTender.notes.length})</span>
                  </div>

                  <div className="space-y-3.5 max-h-52 overflow-y-auto premium-scrollbar pr-1">
                    {selectedTender.notes.length === 0 ? (
                      <p className="text-xs text-gray-400 italic text-center py-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-150">
                        {isAr ? "لا توجد ملاحظات تقديرية في السجل حالياً." : "No engineering notes recorded."}
                      </p>
                    ) : (
                      selectedTender.notes.map(note => (
                        <div key={note.id} className="bg-gray-50/70 p-3 rounded-xl border border-gray-150 text-[13px] space-y-1">
                          <div className="flex justify-between items-center text-gray-400 text-[10px] font-bold">
                            <span>👨‍💻 {note.author}</span>
                            <span>{note.date}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed font-semibold">{note.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add note inside panel */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100 mt-2 font-sans">
                    <input 
                      type="text" 
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder={isAr ? "اكتب ملاحظة كلفة أو عقود جديدة..." : "Type custom estimative comment..."}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-navy focus:bg-white transition-all shadow-inner"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddNoteToTender(selectedTender.id);
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => handleAddNoteToTender(selectedTender.id)}
                      className="p-3 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 8: HISTORY */}
              {activeTab === 'history' && (
                <div className="space-y-4 animate-in fade-in duration-200 text-sans">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block pl-1">{isAr ? "سجل تتبع التعديلات والعمليات" : "System Audit Logs (PMO Ledger)"}</span>
                  
                  <div className="space-y-3 max-h-[420px] overflow-y-auto premium-scrollbar pr-1">
                    {[
                      { admin: 'm.gamlahmed@gmail.com', text: isAr ? 'تم استيراد كود المشروع وتطبيق معايير التنبيه الزمني' : 'Registered in Cloud pre-award ledger and checked cron parameters', time: isAr ? 'الآن' : 'Just now' },
                      { admin: 'Ahmed Mostafa', text: isAr ? 'تأكيد ملاءمة الموازنة وتسجيل الضمان الإبتدائي بنسبة 2٪' : 'Verified bond amount eligibility metrics & cost margin bounds', time: '2 hours ago' },
                      { admin: 'ROWAD Feeder', text: isAr ? 'تم حفظ التعديلات الرقمية وملفات المزايدة بنجاح' : 'Digitized metadata records saved & verified against Pre-Award guidelines', time: '1 day ago' },
                      { admin: 'System Engine', text: isAr ? 'المزايدة مهيأة كلياً للعمل بموجب إعدادات البوابة الإقليمية' : 'Milestone timelines synthesized automatically according to pre-award standards', time: '2 days ago' }
                    ].map((log, lidx) => (
                      <div key={lidx} className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 space-y-1.5 text-xs font-sans">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-[#183B63]">{log.admin}</span>
                          <span className="text-gray-400 text-[10px] font-mono">{log.time}</span>
                        </div>
                        <p className="text-gray-500 font-semibold leading-relaxed">{log.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-[32px] border border-gray-150 p-12 text-center text-sans flex flex-col items-center justify-center min-h-[500px] xl:sticky xl:top-4 shadow-sm">
              <ClipboardList className="w-12 h-12 text-gray-300 mb-3 animate-bounce" />
              <p className="text-gray-500 font-extrabold text-[15px]">
                {isAr ? "الرجاء اختيار مشروع لاستعراض بياناته الكاملة" : "Select a project to view its complete information."}
              </p>
              <p className="text-gray-400 text-xs mt-1.5 leading-relaxed max-w-xs mx-auto">
                {isAr ? "انقر فوق أي صف في الجدول لعرض التفاصيل الرقمية وتكليفات الكلفة والمواعيد الخاصة بالملف الشامل." : "Click any row in the table to display the complete digital project archive."}
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
