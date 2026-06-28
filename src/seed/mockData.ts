export interface ExecutionRecord {
  id: string;
  type: 'IPC' | 'Claim' | 'Variation Order' | 'NOC';
  code: string;
  projectName: { en: string; ar: string };
  submittedDate: string;
  valueAED: string;
  status: { en: string; ar: string };
  health: 'Healthy' | 'Urgent' | 'Under Review';
  department: { en: string; ar: string };
  contractor: string;
  progress: number;
}

export interface DocumentRecord {
  id: string;
  code: string;
  title: { en: string; ar: string };
  category: 'Incoming' | 'Outgoing' | 'Drawing' | 'Transmittal';
  projectName: { en: string; ar: string };
  sender: string;
  recipient: string;
  dateReceived: string;
  status: { en: string; ar: string };
  priority: 'High' | 'Medium' | 'Low';
  version: string;
}

export const mockExecutionData: ExecutionRecord[] = [
  {
    id: 'E-001',
    type: 'IPC',
    code: 'IPC-08-NEOM',
    projectName: { en: 'Neom Spine Ground Terminal Expansion', ar: 'توسعة محطة النفق الأرضية بمشروع نيوم' },
    submittedDate: '2026-06-15',
    valueAED: 'AED 12,450,000',
    status: { en: 'Awaiting Consultant Signature', ar: 'بانتظار توقيع الاستشاري' },
    health: 'Healthy',
    department: { en: 'Infrastructure', ar: 'البنية التحتية' },
    contractor: 'Rowad General Contracting',
    progress: 75
  },
  {
    id: 'E-002',
    type: 'Claim',
    code: 'CLM-03-ZAYED',
    projectName: { en: 'Zayed Boulevard Commercial Corridor', ar: 'الممر التجاري بمحور الشيخ زايد' },
    submittedDate: '2026-06-10',
    valueAED: 'AED 3,200,000',
    status: { en: 'Pending PMO Escalation', ar: 'معلق بانتظار تصعيد إدارة المشاريع' },
    health: 'Urgent',
    department: { en: 'Commercial Claims', ar: 'المطالبات التجارية' },
    contractor: 'Al-Suwaidi Electrical Co.',
    progress: 30
  },
  {
    id: 'E-003',
    type: 'Variation Order',
    code: 'VO-12-LOG',
    projectName: { en: 'Cairo Capital East Logistics Hub', ar: 'المركز اللوجستي لشرق العاصمة الإدارية' },
    submittedDate: '2026-06-18',
    valueAED: 'AED 1,850,000',
    status: { en: 'Approved & Signed', ar: 'تم الاعتماد والتوقيع' },
    health: 'Healthy',
    department: { en: 'Design & Engineering', ar: 'التصميم والهندسة' },
    contractor: 'Egyptian Steel Structures',
    progress: 100
  },
  {
    id: 'E-004',
    type: 'NOC',
    code: 'NOC-44-DIR',
    projectName: { en: 'Diriyah Blvd District Substructure', ar: 'البنية التحتية لمنطقة بوليفارد الدرعية التاريخية' },
    submittedDate: '2026-06-12',
    valueAED: 'N/A (Regulatory)',
    status: { en: 'Under Municipality Review', ar: 'قيد مراجعة البلدية والهيئة' },
    health: 'Under Review',
    department: { en: 'Permits & Relations', ar: 'التصاريح والعلاقات الحكومية' },
    contractor: 'Saudi Geotechnical Lab',
    progress: 55
  },
  {
    id: 'E-005',
    type: 'IPC',
    code: 'IPC-21-ALM',
    projectName: { en: 'Al Maktoum Terminal Cargo Ramp', ar: 'مدرج الشحن بمطار آل مكتوم الدولي الجديد' },
    submittedDate: '2026-06-20',
    valueAED: 'AED 45,000,000',
    status: { en: 'Approved & Certified', ar: 'تم الاعتماد والصرف الفعلي' },
    health: 'Healthy',
    department: { en: 'Executive Operations', ar: 'العمليات التنفيذية' },
    contractor: 'Rowad Aviation Infras',
    progress: 90
  }
];

export const mockDocuments: DocumentRecord[] = [
  {
    id: 'D-001',
    code: 'ROWAD-NEOM-CIV-DRW-042',
    title: { en: 'Slab reinforcement details at station 3+400', ar: 'تفاصيل تسليح البلاطة الخرسانية عند المحطة ٣+٤٠٠' },
    category: 'Drawing',
    projectName: { en: 'Neom Spine Ground Terminal Expansion', ar: 'توسعة محطة النفق الأرضية بمشروع نيوم' },
    sender: 'Rowad Civil Design Team',
    recipient: 'Lead Construction Consultant',
    dateReceived: '2026-06-19',
    status: { en: 'Approved for Construction', ar: 'معتمد للتنفيذ' },
    priority: 'High',
    version: 'Rev 2.0'
  },
  {
    id: 'D-002',
    code: 'TRN-DIR-8812',
    title: { en: 'Transmittal of Soil compaction test reports', ar: 'محضر إرسال تقارير اختبارات دك التربة' },
    category: 'Transmittal',
    projectName: { en: 'البنية التحتية لمنطقة بوليفارد الدرعية التاريخية', ar: 'البنية التحتية لمنطقة بوليفارد الدرعية التاريخية' },
    sender: 'SGS Soils Laboratory LLC',
    recipient: 'Rowad QA/QC Department',
    dateReceived: '2026-06-20',
    status: { en: 'Under Verification', ar: 'تحت التدقيق والمطابقة' },
    priority: 'Medium',
    version: 'Rev 1.0'
  },
  {
    id: 'D-003',
    code: 'INC-MUNI-0994',
    title: { en: 'Municipality site access and load permit letter', ar: 'خطاب البلدية بشأن تصريح الدخول ومطابقة الحمولات' },
    category: 'Incoming',
    projectName: { en: 'Cairo Capital East Logistics Hub', ar: 'المركز اللوجستي لشرق العاصمة الإدارية' },
    sender: 'Cairo Urban Development Authority',
    recipient: 'Rowad Project Director',
    dateReceived: '2026-06-14',
    status: { en: 'Awaiting Response Letter', ar: 'بانتظار خطاب الرد والتعليق' },
    priority: 'High',
    version: 'Original'
  },
  {
    id: 'D-004',
    code: 'OUT-EXP-ROWG-771',
    title: { en: 'Notice of major structural excavation clearance', ar: 'إخطار رسمي بانتهاء أعمال الحفر الهيكلي الرئيسي' },
    category: 'Outgoing',
    projectName: { en: 'Al Maktoum Terminal Cargo Ramp', ar: 'مدرج الشحن بمطار آل مكتوم الدولي الجديد' },
    sender: 'Rowad HSE Manager',
    recipient: 'General Civil Aviation Authority',
    dateReceived: '2026-06-18',
    status: { en: 'Delivered & Stamped', ar: 'تم التسليم والختم بالوارد' },
    priority: 'Medium',
    version: 'Rev 1.1'
  }
];
