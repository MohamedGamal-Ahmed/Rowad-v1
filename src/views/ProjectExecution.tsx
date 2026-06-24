import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, AlertCircle, FileText, ClipboardList, PenTool, 
  Layers, Search, Filter, Plus, ArrowUpRight, CheckCircle2, 
  Clock, ShieldAlert, ChevronRight, X, Send, Eye, DollarSign,
  Award, Sparkles, TrendingUp, Printer, Download, Building2,
  CalendarRange, Activity, CheckSquare, AlertTriangle
} from 'lucide-react';
import { BiText } from '../components/BiText';

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

export function ProjectExecution({ 
  lang, 
  records, 
  onUpdateRecords 
}: { 
  lang: 'ar' | 'en'; 
  records: ExecutionRecord[]; 
  onUpdateRecords: React.Dispatch<React.SetStateAction<ExecutionRecord[]>>;
}) {
  const isAr = lang === 'ar';
  const setRecords = onUpdateRecords;
  const [activeTab, setActiveTab] = useState<'IPC' | 'Claim' | 'Variation Order' | 'NOC' | 'Reports'>('IPC');
  const [searchQuery, setSearchQuery] = useState('');
  const [healthFilter, setHealthFilter] = useState('all');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>('E-001');

  // New submittal form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitType, setSubmitType] = useState<'IPC' | 'Claim' | 'Variation Order' | 'NOC'>('IPC');
  const [submitCode, setSubmitCode] = useState('');
  const [projNameEn, setProjNameEn] = useState('');
  const [projNameAr, setProjNameAr] = useState('');
  const [submitValue, setSubmitValue] = useState('');
  const [statusEn, setStatusEn] = useState('');
  const [statusAr, setStatusAr] = useState('');
  const [submitHealth, setSubmitHealth] = useState<'Healthy' | 'Urgent' | 'Under Review'>('Under Review');
  const [deptEn, setDeptEn] = useState('');
  const [deptAr, setDeptAr] = useState('');
  const [submitContractor, setSubmitContractor] = useState('');
  const [submitProgress, setSubmitProgress] = useState(10);

  // SPR Report Generator States
  const [selectedReportProject, setSelectedReportProject] = useState<string>('Neom Spine Ground Terminal Expansion');
  const [reportingDate, setReportingDate] = useState<string>('2026-06-23');
  const [useCurrentSnapshot, setUseCurrentSnapshot] = useState<boolean>(true);
  const [reportTemplate, setReportTemplate] = useState<string>('executive_insights');
  const [isReportGenerated, setIsReportGenerated] = useState<boolean>(false);

  // Aggregated dynamic SPR data compiler (aggregates from database/transactional records on-the-fly)
  const compileSPRReport = () => {
    // Find all records matching the selected project name (case-insensitive checks)
    const projectRecords = records.filter(r => 
      r.projectName.en.toLowerCase().includes(selectedReportProject.toLowerCase()) ||
      selectedReportProject.toLowerCase().includes(r.projectName.en.toLowerCase()) ||
      r.projectName.ar.includes(selectedReportProject) ||
      selectedReportProject.includes(r.projectName.ar)
    );

    const ipcs = projectRecords.filter(r => r.type === 'IPC');
    const claims = projectRecords.filter(r => r.type === 'Claim');
    const vos = projectRecords.filter(r => r.type === 'Variation Order');
    const nocs = projectRecords.filter(r => r.type === 'NOC');

    // Parse financial values safely
    const parseValue = (valStr: string): number => {
      const cleanNum = valStr.replace(/[^0-9.]/g, '');
      return cleanNum ? parseFloat(cleanNum) : 0;
    };

    const totalCertified = ipcs.reduce((acc, r) => acc + parseValue(r.valueAED), 0);
    const totalClaims = claims.reduce((acc, r) => acc + parseValue(r.valueAED), 0);
    const totalVOs = vos.reduce((acc, r) => acc + parseValue(r.valueAED), 0);

    // Calculate progress dynamically
    const avgProgress = projectRecords.length > 0 
      ? Math.round(projectRecords.reduce((acc, r) => acc + r.progress, 0) / projectRecords.length)
      : selectedReportProject.includes('ZED') ? 68
      : selectedReportProject.includes('Diriyah') ? 42
      : selectedReportProject.includes('Eastown') ? 85
      : 60; // Default baseline progress

    const urgentCount = projectRecords.filter(r => r.health === 'Urgent').length;
    const reviewCount = projectRecords.filter(r => r.health === 'Under Review').length;
    const isUrgent = urgentCount > 0 || claims.length > 0;

    return {
      projectRecords,
      ipcs,
      claims,
      vos,
      nocs,
      totalCertified,
      totalClaims,
      totalVOs,
      avgProgress,
      isUrgent,
      urgentCount,
      reviewCount
    };
  };

  // Sync modal's preselected type with activeTab if it is a transaction type
  useEffect(() => {
    if (activeTab !== 'Reports') {
      setSubmitType(activeTab as any);
    }
  }, [activeTab]);

  // Form suggestions trigger
  useEffect(() => {
    if (isAddModalOpen) {
      const nextNum = records.length + 1;
      if (submitType === 'IPC') {
        setSubmitCode(`IPC-0${nextNum}-NEOM`);
        setStatusEn('Awaiting Technical Approval');
        setStatusAr('بانتظار الاعتماد الفني والمطابقة');
        setDeptEn('Infrastructure & QA');
        setDeptAr('البنية التحتية وضمان الجودة');
      } else if (submitType === 'Claim') {
        setSubmitCode(`CLM-0${nextNum}-ALM`);
        setStatusEn('Under Valuation Analysis');
        setStatusAr('تحت التقييم المالي ودراسة المطالبة');
        setDeptEn('Commercial Claims');
        setDeptAr('المطالبات الهندسية والتجارية');
      } else if (submitType === 'Variation Order') {
        setSubmitCode(`VO-0${nextNum}-DIR`);
        setStatusEn('Draft prepared for PMO');
        setStatusAr('مسودة معدة للمراجعة من قبل استشاري إدارة المشاريع');
        setDeptEn('Design & Pricing');
        setDeptAr('التصميم وقوائم التسعير');
      } else {
        setSubmitCode(`${submitType.substring(0,3).toUpperCase()}-0${nextNum}`);
        setStatusEn('Submitted for Verification');
        setStatusAr('تم التسليم للتدقيق');
        setDeptEn('Operations Division');
        setDeptAr('قسم العمليات والتدقيق المسندي');
      }
    }
  }, [submitType, isAddModalOpen, records.length]);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          record.projectName.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          record.projectName.ar.includes(searchQuery);
    const matchesType = activeTab === 'Reports' || record.type === activeTab;
    const matchesHealth = healthFilter === 'all' || record.health === healthFilter;
    return matchesSearch && matchesType && matchesHealth;
  });

  const selectedRecord = records.find(r => r.id === selectedRecordId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projNameEn || !projNameAr) {
      alert(isAr ? 'الرجاء إدخال اسم المشروع باللغتين' : 'Please input project names in both English and Arabic');
      return;
    }

    const nextId = 'E-' + (records.length + 1).toString().padStart(3, '0');
    const newRec: ExecutionRecord = {
      id: nextId,
      type: submitType,
      code: submitCode || `${submitType.substring(0,3).toUpperCase()}-0${records.length + 1}`,
      projectName: { en: projNameEn, ar: projNameAr },
      submittedDate: new Date().toISOString().split('T')[0],
      valueAED: submitValue ? (submitValue.startsWith('AED') ? submitValue : `AED ${submitValue}`) : 'N/A',
      status: { en: statusEn, ar: statusAr },
      health: submitHealth,
      department: { en: deptEn || 'Engineering Services', ar: deptAr || 'الخدمات الهندسية الفنية' },
      contractor: submitContractor || 'Rowad General Contracting Co.',
      progress: Number(submitProgress)
    };

    setRecords([newRec, ...records]);
    setSelectedRecordId(newRec.id);
    setIsAddModalOpen(false);

    // Reset fields
    setProjNameEn('');
    setProjNameAr('');
    setSubmitValue('');
    setSubmitContractor('');
    setSubmitProgress(10);
  };

  // Dynamic statistics compiled from the active in-memory ledger
  const ipcsList = records.filter(r => r.type === 'IPC');
  const claimsList = records.filter(r => r.type === 'Claim');
  const vosList = records.filter(r => r.type === 'Variation Order');
  const nocsList = records.filter(r => r.type === 'NOC');

  const parseValueStr = (valStr: string): number => {
    const cleanNum = valStr.replace(/[^0-9.]/g, '');
    return cleanNum ? parseFloat(cleanNum) : 0;
  };

  const ipcsSum = ipcsList.reduce((acc, r) => acc + parseValueStr(r.valueAED), 0);
  const claimsSum = claimsList.reduce((acc, r) => acc + parseValueStr(r.valueAED), 0);
  const vosSum = vosList.reduce((acc, r) => acc + parseValueStr(r.valueAED), 0);

  const ipcsValFormatted = `AED ${(ipcsSum / 1000000).toFixed(1)}M`;
  const claimsValFormatted = `AED ${(claimsSum / 1000000).toFixed(1)}M`;
  const vosValFormatted = `AED ${(vosSum / 1000000).toFixed(1)}M`;

  // Render Reports/SPR view
  const renderReportsView = () => {
    // Unique list of projects to select
    const projectsList = [
      { id: 'p1', name: { en: 'Neom Spine Ground Terminal Expansion', ar: 'توسعة محطة النفق الأرضية بمشروع نيوم' }, code: 'NEOM-SPINE' },
      { id: 'p2', name: { en: 'Zayed Boulevard Commercial Corridor', ar: 'الممر التجاري بمحور الشيخ زايد' }, code: 'ZAYED-CORR' },
      { id: 'p3', name: { en: 'Cairo Capital East Logistics Hub', ar: 'المركز اللوجستي لشرق العاصمة الإدارية' }, code: 'CAIRO-HUB' },
      { id: 'p4', name: { en: 'Diriyah Blvd District Substructure', ar: 'البنية التحتية لمنطقة بوليفارد الدرعية التاريخية' }, code: 'DIRIYAH-SUB' },
      { id: 'p5', name: { en: 'Al Maktoum Terminal Cargo Ramp', ar: 'مدرج الشحن بمطار آل مكتوم الدولي الجديد' }, code: 'MAKTOUM-RAMP' },
      { id: 'p6', name: { en: 'ZED East - Zone 02', ar: 'زيد إيست - المنطقة 02' }, code: 'ZED-Z02' },
      { id: 'p7', name: { en: 'Diriyah II - Boulevard', ar: 'الدرعية 2 - البوليفارد' }, code: 'PA-2026-011' },
      { id: 'p8', name: { en: 'Eastown Residences - Ph3', ar: 'إيستاون ريزيدنس - المرحلة 3' }, code: 'EASTOWN-R3' }
    ];

    const compiledData = compileSPRReport();

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        
        {/* Setup Configuration Panel */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span>{isAr ? "توليد تقرير الورقة الواحدة (SPR)" : "Generate Single Paper Report (SPR)"}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {isAr 
                ? "تقارير قراءة فقط تنفيذية يتم تجميعها حياً من بيانات شهادات الدفع، المطالبات، والاعتمادات الميدانية." 
                : "Computed read-only executive summary compiled live from certified IPCs, pending claims, variations, & permits."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Select Project */}
            <div className="space-y-2">
              <label className="text-[13px] font-extrabold text-brand-navy uppercase tracking-wider block">
                {isAr ? "1. اختر المشروع" : "1. Select Project"}
              </label>
              <select
                value={selectedReportProject}
                onChange={(e) => {
                  setSelectedReportProject(e.target.value);
                  setIsReportGenerated(false);
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-brand-navy focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
              >
                {projectsList.map(p => (
                  <option key={p.id} value={p.name.en}>
                    {isAr ? p.name.ar : p.name.en} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Select Reporting Date */}
            <div className="space-y-2">
              <label className="text-[13px] font-extrabold text-brand-navy uppercase tracking-wider block">
                {isAr ? "2. تاريخ التقرير" : "2. Reporting Date"}
              </label>
              <div className="space-y-3">
                <input
                  type="date"
                  value={reportingDate}
                  onChange={(e) => {
                    setReportingDate(e.target.value);
                    setIsReportGenerated(false);
                  }}
                  disabled={useCurrentSnapshot}
                  className={`w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-4 focus:ring-indigo-500/10 ${
                    useCurrentSnapshot ? 'bg-gray-100/70 text-gray-400 cursor-not-allowed' : 'bg-gray-50'
                  }`}
                />
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useCurrentSnapshot}
                    onChange={(e) => {
                      setUseCurrentSnapshot(e.target.checked);
                      if (e.target.checked) setReportingDate('2026-06-23');
                      setIsReportGenerated(false);
                    }}
                    className="rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 w-4 h-4"
                  />
                  <span>{isAr ? "استخدام لقطة البيانات الحالية (Current Snapshot)" : "Use Current Snapshot"}</span>
                </label>
              </div>
            </div>

            {/* 3. Select Report Template */}
            <div className="space-y-2">
              <label className="text-[13px] font-extrabold text-brand-navy uppercase tracking-wider block">
                {isAr ? "3. قالب التقرير" : "3. Report Template"}
              </label>
              <select
                value={reportTemplate}
                onChange={(e) => {
                  setReportTemplate(e.target.value);
                  setIsReportGenerated(false);
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-brand-navy focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
              >
                <option value="executive_insights">📊 {isAr ? "ملخص قيادي لمكتب إدارة المشاريع" : "Executive PMO Summary"}</option>
                <option value="financial_audit">💸 {isAr ? "المراجعة المالية والمطالبات الشاملة" : "Financial & Claims Audit"}</option>
                <option value="risk_compliance">🛡️ {isAr ? "الخطة الزمنية وإدارة المخاطر والامتثال" : "Milestone & Risk Compliance"}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-100">
            <button
              onClick={() => setIsReportGenerated(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-brand-navy hover:from-indigo-700 hover:to-brand-navy text-white rounded-2xl shadow-lg shadow-indigo-500/10 flex items-center gap-2 text-sm font-extrabold transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isAr ? "توليد التقرير التنفيذي" : "Generate Executive Report"}</span>
            </button>
          </div>
        </div>

        {/* Generated SPR Document Sheet */}
        {isReportGenerated ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Print Header Controls */}
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center print:hidden">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
                <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">{isAr ? "تم إعداد لقطة التقرير بنجاح" : "SPR Compiled Successfully"}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl flex items-center gap-2 text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isAr ? "طباعة الورقة" : "Print Sheet"}</span>
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('spr-canvas-content');
                    if (el) {
                      navigator.clipboard.writeText(el.innerText);
                      alert(isAr ? 'تم نسخ نص التقرير للحافظة' : 'Report text copied to clipboard!');
                    }
                  }}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-xl flex items-center gap-2 text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isAr ? "نسخ الملخص" : "Copy Digest"}</span>
                </button>
              </div>
            </div>

            {/* Premium Document Layout (Letterhead Sheet) */}
            <div id="spr-canvas-content" className="p-8 md:p-12 space-y-8 bg-white text-brand-navy">
              
              {/* Document Header */}
              <div className="border-b-2 border-brand-navy pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-brand-navy p-2 rounded-xl text-white">
                      <Award className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight uppercase leading-none font-sans text-brand-navy">ROWAD ENTERPRISE PLATFORM</h3>
                      <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-0.5">Project Controls & Site Execution Division</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <h1 className="text-3xl font-black text-brand-navy tracking-tight leading-none">
                      {isAr ? "تقرير الصفحة الواحدة - ملخص الأداء التنفيذي" : "Single Paper Report (SPR) - Executive Performance Digest"}
                    </h1>
                    <p className="text-xs text-gray-400 font-semibold mt-1">
                      {isAr 
                        ? `لقطة من التقرير في ${reportingDate} | الفئة: تجميع البيانات الحية المستقلة` 
                        : `Executive snapshot as of ${reportingDate} | Category: Standalone Aggregated Read-Only Summary`}
                    </p>
                  </div>
                </div>

                <div className="text-start md:text-end space-y-1 font-mono text-[11px] text-gray-500 bg-gray-50/80 p-3 rounded-2xl border border-gray-150 shrink-0">
                  <div><strong>Ref Code:</strong> SPR-{projectsList.find(p => p.name.en === selectedReportProject)?.code || 'GEN'}-2026</div>
                  <div><strong>Status:</strong> COMPUTED SECURE SNAPSHOT</div>
                  <div><strong>Template:</strong> {reportTemplate.toUpperCase()}</div>
                  <div><strong>Database Source:</strong> POSGRESQL_RECORDS_DB</div>
                </div>
              </div>

              {/* Project Target metadata */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                <div>
                  <div className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">{isAr ? "اسم المشروع" : "Project Name"}</div>
                  <div className="text-sm font-black text-brand-navy mt-1">
                    {isAr ? (projectsList.find(p => p.name.en === selectedReportProject)?.name.ar || selectedReportProject) : selectedReportProject}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">{isAr ? "رمز العقد" : "Contract Code"}</div>
                  <div className="text-sm font-black text-brand-navy mt-1">
                    {projectsList.find(p => p.name.en === selectedReportProject)?.code || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">{isAr ? "تاريخ لقطة التقرير" : "Reporting Baseline Date"}</div>
                  <div className="text-sm font-black text-brand-navy mt-1">{reportingDate}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">{isAr ? "نوع القالب" : "Selected Template Style"}</div>
                  <div className="text-sm font-black text-brand-navy mt-1">
                    {reportTemplate === 'executive_insights' ? (isAr ? "الملخص التنفيذي القيادي" : "Executive PMO Summary") :
                     reportTemplate === 'financial_audit' ? (isAr ? "التدقيق المالي الشامل" : "Financial & Claims Audit") :
                     (isAr ? "الخطة الزمنية والمخاطر" : "Milestone & Risk Audit")}
                  </div>
                </div>
              </div>

              {/* KPIs Bento Section */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* 1. Overall Progress */}
                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start text-gray-400">
                      <span className="text-[10px] uppercase font-extrabold tracking-wider">{isAr ? "نسبة إنجاز المشروع" : "Overall Physical Progress"}</span>
                      <Activity className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="text-3xl font-black text-brand-navy mt-2 leading-none">{compiledData.avgProgress}%</div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${compiledData.avgProgress}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold block mt-1">
                      {isAr ? "متوسط الإنجاز الميداني للأعمال" : "Weighted progress of active submittals"}
                    </span>
                  </div>
                </div>

                {/* 2. Total Certified Value */}
                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start text-gray-400">
                      <span className="text-[10px] uppercase font-extrabold tracking-wider">{isAr ? "إجمالي الدفعات المعتمدة (IPC)" : "Total Certified (IPC)"}</span>
                      <FileCheck2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-3xl font-black text-brand-navy mt-2 leading-none">
                      AED {compiledData.totalCertified.toLocaleString()}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold mt-4">
                    {isAr ? `بناءً على ${compiledData.ipcs.length} شهادات دفع مستخرجة` : `Extracted from ${compiledData.ipcs.length} payment certificates`}
                  </p>
                </div>

                {/* 3. Claims Exposure */}
                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start text-gray-400">
                      <span className="text-[10px] uppercase font-extrabold tracking-wider">{isAr ? "المطالبات المالية المعلقة" : "Contractual Claims Value"}</span>
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-3xl font-black text-amber-600 mt-2 leading-none">
                      AED {compiledData.totalClaims.toLocaleString()}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold mt-4">
                    {isAr ? `عدد ${compiledData.claims.length} مطالبات تعاقدية جارية` : `Reflects ${compiledData.claims.length} pending contractual claims`}
                  </p>
                </div>

                {/* 4. Variations Weight */}
                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start text-gray-400">
                      <span className="text-[10px] uppercase font-extrabold tracking-wider">{isAr ? "قيمة أوامر التغيير المعتمدة" : "Approved Variation Inflows"}</span>
                      <PenTool className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-3xl font-black text-blue-600 mt-2 leading-none">
                      AED {compiledData.totalVOs.toLocaleString()}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold mt-4">
                    {isAr ? `قيمة التغير في أوامر الأعمال الموقعة` : `Net scope alterations approved to date`}
                  </p>
                </div>
              </div>

              {/* Main Content Sections split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
                
                {/* Left Side: Financial Ledger Audit & Milestones */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Ledger Breakdown Card */}
                  <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-brand-navy flex items-center gap-2 uppercase tracking-wide">
                      <TrendingUp className="w-4.5 h-4.5 text-indigo-500" />
                      <span>{isAr ? "تفصيل الموقف المالي وحالة الإنجاز" : "Financial & Site Ledger Analysis"}</span>
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs py-2 border-b border-gray-100">
                        <span className="text-gray-400 font-bold">{isAr ? "الدفعات المستلمة المعتمدة حياً" : "Net Certified Payments to Date (IPC)"}</span>
                        <span className="text-brand-navy font-black">AED {compiledData.totalCertified.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs py-2 border-b border-gray-100">
                        <span className="text-gray-400 font-bold">{isAr ? "التعويضات والمطالبات التعاقدية المعلقة" : "Pending Claim Exposures (Claims)"}</span>
                        <span className="text-amber-600 font-black">AED {compiledData.totalClaims.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs py-2 border-b border-gray-100">
                        <span className="text-gray-400 font-bold">{isAr ? "موازنة التغيير المعتمدة من المالك" : "Net Variations Approved (VO)"}</span>
                        <span className="text-blue-600 font-black">AED {compiledData.totalVOs.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs py-2 border-b border-gray-100">
                        <span className="text-gray-400 font-bold">{isAr ? "تراخيص الهيئات الحكومية المعتمدة" : "Active Regulatory Permits (NOC)"}</span>
                        <span className="text-emerald-600 font-black">{compiledData.nocs.length} {isAr ? "تصاريح نشطة" : "Permits Approved"}</span>
                      </div>
                      <div className="flex justify-between text-sm py-3 border-t-2 border-dashed border-gray-200 bg-indigo-50/20 px-3 rounded-xl mt-3">
                        <span className="text-brand-navy font-extrabold">{isAr ? "إجمالي القيمة المعتمدة الكلية للتعاقد" : "Net Authorized Baseline Value (Value)"}</span>
                        <span className="text-indigo-700 font-black">
                          AED {(compiledData.totalCertified + compiledData.totalVOs).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Milestones Card */}
                  <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-brand-navy flex items-center gap-2 uppercase tracking-wide">
                      <CalendarRange className="w-4.5 h-4.5 text-indigo-500" />
                      <span>{isAr ? "المراحل التعاقدية ونقاط التدقيق للمشروع" : "Project Control Milestones & Submittal Logs"}</span>
                    </h3>

                    {compiledData.projectRecords.length === 0 ? (
                      <div className="text-center py-6 text-gray-400 text-xs font-bold">
                        {isAr ? "لا توجد معاملات مسجلة لهذا المشروع في النظام حالياً." : "No live logs found. Showing simulated milestone sequence."}
                        <div className="mt-4 space-y-3 text-start max-w-md mx-auto">
                          {[
                            { step: "M1", title: isAr ? "تجهيز الموقع والمسوحات الأولية" : "Site Mobilization & Engineering Survey", status: isAr ? "مكتمل" : "Completed", date: "2026-05-10" },
                            { step: "M2", title: isAr ? "اعتماد شهادة الدفع الأولى IPC-01" : "First Interim Certificate (IPC-01) approval", status: isAr ? "مكتمل" : "Completed", date: "2026-05-28" },
                            { step: "M3", title: isAr ? "تدقيق تصاريح البنية التحتية" : "Infrastructure Civil Utility Permits (NOC)", status: isAr ? "قيد المراجعة" : "Under Review", date: "2026-06-15" }
                          ].map((mil, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-[11px]">
                              <span className="font-extrabold text-brand-navy flex items-center gap-1.5">
                                <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md text-[10px]">{mil.step}</span>
                                {mil.title}
                              </span>
                              <span className="text-gray-400 font-mono">{mil.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {compiledData.projectRecords.map((rec, idx) => (
                          <div key={rec.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100/50 transition-all">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-lg text-[10px] font-extrabold ${
                                rec.type === 'IPC' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                rec.type === 'Claim' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                rec.type === 'Variation Order' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                'bg-red-50 text-brand-red border border-red-100'
                              }`}>
                                {rec.type}
                              </span>
                              <div className="text-xs">
                                <p className="font-black text-brand-navy">{rec.code}</p>
                                <p className="text-[10px] text-gray-400 font-semibold">{rec.submittedDate}</p>
                              </div>
                            </div>
                            <div className="text-end">
                              <p className="text-xs font-extrabold text-brand-navy">{isAr ? rec.status.ar : rec.status.en}</p>
                              <span className={`inline-block w-2 h-2 rounded-full mt-1 ${
                                rec.health === 'Healthy' ? 'bg-emerald-500 animate-pulse' :
                                rec.health === 'Urgent' ? 'bg-red-500 animate-bounce' :
                                'bg-amber-500 animate-pulse'
                              }`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Risk Summary & Strategic Insights */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Risks & Health Registry */}
                  <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-brand-navy flex items-center gap-2 uppercase tracking-wide text-brand-navy">
                      <ShieldAlert className="w-4.5 h-4.5 text-brand-red" />
                      <span>{isAr ? "سجل المخاطر والامتثال التنظيمي" : "Risk Registry & Compliance Insights"}</span>
                    </h3>

                    <div className="space-y-3 text-xs">
                      {compiledData.isUrgent ? (
                        <div className="bg-red-50/50 border border-red-100 text-brand-red p-4 rounded-2xl flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                          <div>
                            <p className="font-black text-brand-navy leading-tight">{isAr ? "تنبيه خطورة عالية: مطلوب تدخل فوري" : "Critical Risk Event Triggered"}</p>
                            <p className="text-[11px] text-brand-red/90 font-medium mt-1">
                              {isAr 
                                ? `تم رصد عدد ${compiledData.urgentCount} معاملات عاجلة معلقة و ${compiledData.claims.length} مطالبات نشطة تحتاج إلى تصعيد لإدارة المشاريع.`
                                : `The system detected ${compiledData.urgentCount} urgent transactional items and ${compiledData.claims.length} claim logs requiring immediate commercial arbitration escalation.`}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-emerald-50/40 border border-emerald-100 text-emerald-700 p-4 rounded-2xl flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-black text-brand-navy leading-tight">{isAr ? "الموقف التشغيلي مستقر" : "Operational Status Stable"}</p>
                            <p className="text-[11px] text-emerald-600/90 font-medium mt-1">
                              {isAr 
                                ? "جميع المطالبات الحالية تقع ضمن الهوامش المالية والزمنية المقررة، ولا توجد مستندات عاجلة متأخرة."
                                : "No high-priority blockages detected. Active claims & payments conform to scheduled baseline float."}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 mt-4">
                        <p className="font-extrabold text-[11px] text-gray-400 uppercase tracking-wider">{isAr ? "مخرجات المراجعة والتدقيق" : "Compliance Checklist Status"}</p>
                        {[
                          { label: isAr ? "مطابقة قيم شهادات الدفع المسلمة" : "Certified Value Audit Reconciliation", done: compiledData.ipcs.length > 0 },
                          { label: isAr ? "حصر ومطابقة نطاقات أوامر التغيير" : "Variation Order Scope Validation", done: compiledData.vos.length > 0 || !compiledData.isUrgent },
                          { label: isAr ? "التحقق من المهل التعاقدية للمطالبات" : "Contractual Claim Boundary Checks", done: compiledData.claims.length === 0 },
                          { label: isAr ? "استيفاء الموافقات البلدية والرقابية" : "Government Regulatory Permit Check", done: compiledData.nocs.length > 0 || selectedReportProject.includes('ZED') }
                        ].map((chk, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 py-1.5 border-b border-gray-100 last:border-0">
                            {chk.done ? (
                              <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded border border-gray-300 shrink-0 bg-gray-50" />
                            )}
                            <span className={`text-[11px] font-bold ${chk.done ? 'text-gray-500 line-through' : 'text-brand-navy'}`}>{chk.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Strategic PMO recommendation */}
                  <div className="bg-indigo-900 text-white rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10">
                      <Award className="w-40 h-40" />
                    </div>
                    <div className="relative z-10 space-y-2">
                      <h4 className="text-xs uppercase tracking-widest font-extrabold text-indigo-200">
                        {isAr ? "توجيه تنفيذي لمكتب إدارة المشاريع (PMO)" : "Strategic Executive Directive"}
                      </h4>
                      <p className="text-xs leading-relaxed font-bold">
                        {reportTemplate === 'executive_insights' ? (
                          isAr 
                            ? "يوصى بتسريع وتيرة المراجعة الفنية مع الاستشاري لضمان السيولة النقدية وسد فجوات الإنجاز، مع استهداف تقليل النزاعات بنسبة 15%."
                            : "Accelerate standard technical review cycles with the Consultant to preserve positive cash flows and mitigate milestone slippage on site, target 15% claim reduction."
                        ) : reportTemplate === 'financial_audit' ? (
                          isAr
                            ? "التحقق من تسييل المطالبات الفنية وتعديل نطاقات العقود فوراً لتجنب غرامات تأخير التوريدات وتخصيص احتياطي للطوارئ."
                            : "Conduct a granular reconciliation of pending technical claims against actual cash flow margins. Authorize scope amendments promptly to avoid materials delay penalties."
                        ) : (
                          isAr
                            ? "متابعة تراخيص الهيئات المعلقة والتصاريح لتفادي أي غرامات بلدية، مع جدولة عمليات تفتيش الجودة الدورية لموقع العمل."
                            : "Direct immediate attention to municipal permitting gaps. Ensure regulatory NOC approvals are completed before initiating next phase substructure works."
                        )}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Verified Ledger Verification Disclaimer footer */}
              <div className="pt-6 border-t border-gray-150 text-[10px] text-gray-400 font-bold flex flex-col md:flex-row justify-between gap-4">
                <div>
                  © 2026 ROWAD INDUSTRIAL & GENERAL CONTRACTING GROUP. ALL RIGHTS RESERVED.
                </div>
                <div className="font-mono text-[10px] uppercase">
                  DOCUMENT AUTHENTICATION VERIFIED VIA SECURE DATABASE COMPILATION CHECKSUM
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Empty / Un-generated report placeholder */
          <div className="bg-white rounded-3xl border border-gray-150 p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-black text-brand-navy">{isAr ? "بانتظار توليد التقرير" : "Awaiting SPR Compilation"}</h3>
              <p className="text-xs text-gray-400">
                {isAr 
                  ? "اختر المشروع المطلوب، تاريخ التقرير وقالب العرض القيادي للبدء في تجميع التقرير حياً من سجلات شهادات الدفع، المطالبات، والاعتمادات الميدانية."
                  : "Select the desired project, reporting baseline, and leadership template style above to compile the Single Paper Report (SPR) directly from active construction records."}
              </p>
            </div>
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="px-6 py-6 max-w-[1800px] mx-auto space-y-6 animate-in fade-in duration-500 relative select-none">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-[32px] font-black text-brand-navy tracking-tight leading-tight font-sans">
            {isAr ? "تنفيذ المشاريع وإدارتها" : "Project Execution Division"}
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            {isAr ? "إدارة المستندات التعاقدية كـ IPCs، المطالبات، والتقارير التنفيذية الموحدة لشركة رواد." : "Manage live site claims, interim payment certificates (IPC), variations, NOCs, & SPRs."}
          </p>
        </div>
        
        {activeTab !== 'Reports' && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-3 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-2xl shadow-md flex items-center gap-2 text-[15px] font-bold transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? "تقديم وثيقة جديدة" : "New Document Submittal"}</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Directory Tree Category Navigation Bar (IPC, Claims, Variation Orders, NOC, Reports) */}
      <div className="flex border border-gray-150 bg-white p-2 rounded-2xl shadow-sm gap-2">
        {[
          { id: 'IPC', label: isAr ? 'شهادات الدفع (IPC)' : 'Interim Payments (IPC)', icon: FileCheck2, color: 'text-emerald-500 bg-emerald-50/50' },
          { id: 'Claim', label: isAr ? 'المطالبات والمنازعات' : 'Contractual Claims', icon: AlertCircle, color: 'text-amber-500 bg-amber-50/50' },
          { id: 'Variation Order', label: isAr ? 'أوامر التغيير العالقة' : 'Variation Orders', icon: PenTool, color: 'text-blue-500 bg-blue-50/50' },
          { id: 'NOC', label: isAr ? 'عدم ممانعة (NOC)' : 'Government NOCs', icon: ClipboardList, color: 'text-brand-red bg-red-50/50' },
          { id: 'Reports', label: isAr ? 'التقارير التنفيذية (SPR)' : 'Executive Reports (SPR)', icon: FileText, color: 'text-indigo-500 bg-indigo-50/50' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setIsReportGenerated(false); // Reset report preview on tab change
              }}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 text-xs font-black tracking-tight transition-all cursor-pointer ${
                isActive 
                  ? 'bg-brand-navy text-white shadow-md scale-[1.02]' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-brand-navy'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color.split(' ')[0]}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'Reports' ? (
        renderReportsView()
      ) : (
        <>
          {/* 3. Micro Dashboards Metric Grid (Dashboard summaries for this module - restricted to 4 record types) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { key: 'IPC', label: isAr ? 'شهادات الدفع (IPC)' : 'Interim Payments (IPC)', count: isAr ? `${ipcsList.length} شهادات` : `${ipcsList.length} Certificates`, val: ipcsValFormatted, color: 'border-emerald-500 text-emerald-600', bg: 'bg-emerald-50/50', icon: FileCheck2 },
              { key: 'Claim', label: isAr ? 'المطالبات الفنية المعلقة' : 'Pending Claims Value', count: isAr ? `${claimsList.length} مطالبات نشطة` : `${claimsList.length} Claims Active`, val: claimsValFormatted, color: 'border-amber-500 text-amber-600', bg: 'bg-amber-50/50', icon: AlertCircle },
              { key: 'Variation Order', label: isAr ? 'أوامر التغيير المعتمدة' : 'Approved Variation Orders', count: isAr ? `${vosList.length} أوامر معتمدة` : `${vosList.length} Variations Approved`, val: vosValFormatted, color: 'border-blue-500 text-blue-600', bg: 'bg-blue-50/50', icon: PenTool },
              { key: 'NOC', label: isAr ? 'تراخيص جهات وموافقات' : 'Government NOC Permits', count: isAr ? `${nocsList.length} تصاريح معتمدة` : `${nocsList.length} Permits Active`, val: 'N/A', color: 'border-brand-red text-brand-red', bg: 'bg-red-50/30', icon: ClipboardList }
            ].map((met, idx) => (
              <div key={idx} className={`bg-white p-5 rounded-2xl border-l-4 ${met.color} shadow-sm space-y-2`}>
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider">{met.label}</span>
                  <met.icon className="w-4 h-4 opacity-75" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-brand-navy leading-none">{met.val}</span>
                </div>
                <p className="text-[11px] text-gray-400/90 font-medium">{met.count}</p>
              </div>
            ))}
          </div>

          {/* 4. Operational Filter Matrix */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row self-stretch gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute inset-y-0 left-4 rtl:left-auto rtl:right-4 my-auto w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? "ابحث برقم المعاملة، أو اسم المشروع..." : "Search transaction code, contractor, or project..."}
                  className="w-full bg-gray-50 border border-gray-150 focus:border-brand-navy rounded-2xl py-3.5 pl-11 pr-5 rtl:pr-11 rtl:pl-5 text-[14px] text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/5 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select 
                  value={healthFilter}
                  onChange={(e) => setHealthFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-150 rounded-2xl px-4 py-3 text-[14px] text-gray-600 font-bold focus:outline-none focus:ring-4 focus:ring-brand-navy/5 cursor-pointer"
                >
                  <option value="all">{isAr ? "الحالة: الكل" : "All Health Levels"}</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>
            </div>
          </div>

      {/* 4. Canvas Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Table layout (Left side) */}
        <div className={`transition-all duration-300 ${selectedRecordId ? 'xl:col-span-8' : 'xl:col-span-12'} space-y-4`}>
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden pb-4">
            <div className="overflow-x-auto premium-scrollbar">
              <table className="w-full text-start border-collapse text-sans text-[15px]">
                <thead>
                  <tr className="bg-gray-50/60 border-b border-gray-100 text-[15px] font-extrabold uppercase text-gray-400 tracking-wider">
                    <th className="py-4.5 px-5 text-start">{isAr ? "نوع السند" : "Doc Type"}</th>
                    <th className="py-4.5 px-5 text-start">{isAr ? "كود السند" : "Doc Code"}</th>
                    <th className="py-4.5 px-5 text-start min-w-[210px]">{isAr ? "المشروع" : "Project"}</th>
                    <th className="py-4.5 px-5 text-start">{isAr ? "القيمة المالية" : "Value"}</th>
                    <th className="py-4.5 px-5 text-start">{isAr ? "تاريخ التقديم" : "Submitted"}</th>
                    <th className="py-4.5 px-5 text-start">{isAr ? "درجة المتابعة" : "Priority"}</th>
                    <th className="py-4.5 px-5 text-center">{isAr ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400">
                        {isAr ? "لا توجد معاملات تطابق البحث حالياً." : "No live site execution claims match the parameters."}
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((rec) => {
                      const isSelected = rec.id === selectedRecordId;
                      let badgeColor = '';
                      if (rec.health === 'Healthy') badgeColor = 'bg-emerald-50 text-emerald-700';
                      else if (rec.health === 'Urgent') badgeColor = 'bg-rose-50 text-brand-red animate-pulse';
                      else badgeColor = 'bg-amber-50 text-amber-700';

                      return (
                        <tr 
                          key={rec.id}
                          onClick={() => setSelectedRecordId(rec.id)}
                          className={`hover:bg-gray-50/50 transition-all duration-150 cursor-pointer text-[15px] font-semibold text-gray-700
                            ${isSelected ? 'bg-brand-navy/5 shadow-inner border-y' : ''}
                          `}
                        >
                          <td className="py-4.5 px-5 whitespace-nowrap">
                            <span className="px-3.5 py-1 rounded-full bg-brand-navy/10 text-brand-navy text-[12px] font-extrabold">
                              {rec.type}
                            </span>
                          </td>
                          <td className="py-4.5 px-5 font-mono text-[12px] text-gray-400 whitespace-nowrap">{rec.code}</td>
                          <td className="py-4.5 px-5">
                            <BiText 
                              text={rec.projectName} 
                              primaryLang={lang}
                              primaryClassName="font-extrabold text-brand-navy text-[16px] block tracking-tight"
                              secondaryClassName="text-[11px] text-gray-400 leading-normal block mt-1"
                            />
                          </td>
                          <td className="py-4.5 px-5 font-mono text-gray-900 font-bold">{rec.valueAED}</td>
                          <td className="py-4.5 px-5 text-[13px] font-medium text-gray-500 whitespace-nowrap">{rec.submittedDate}</td>
                          <td className="py-4.5 px-5 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-[12px] font-extrabold flex items-center gap-1.5 w-fit ${badgeColor}`}>
                              <span>●</span>
                              <span>{rec.health}</span>
                            </span>
                          </td>
                          <td className="py-4.5 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => setSelectedRecordId(rec.id)}
                              className="p-1.5 hover:bg-gray-100 hover:text-brand-navy text-gray-400 rounded-lg transition-colors"
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

        {/* Audit Details Panel (Right side) */}
        {selectedRecord && (
          <div className="xl:col-span-4 bg-white rounded-[32px] border border-gray-150 shadow-xl p-7 space-y-7 animate-in slide-in-from-right-8 duration-300 xl:sticky xl:top-4 overflow-y-auto max-h-[85vh] no-scrollbar">
            
            <div className="flex justify-between items-start pb-5 border-b border-gray-150">
              <div className="space-y-1">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block font-sans">
                  {selectedRecord.code} • AUDIT PROFILE
                </span>
                <h3 className="text-[20px] font-black text-brand-navy leading-tight font-sans">
                  {isAr ? selectedRecord.projectName.ar : selectedRecord.projectName.en}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedRecordId(null)}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-brand-red transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Financial Scope */}
            <div className="bg-gray-900 text-white rounded-3xl p-6 space-y-4 border border-brand-navy/10 shadow-sm font-mono">
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-[11px] text-gray-400 uppercase font-bold">{isAr ? "القيمة المدرجة بالمعاملة" : "Certified Transaction Value"}</span>
                <span className="text-[18px] font-black text-white">{selectedRecord.valueAED}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-3.5 text-[14px]">
                <span className="text-[11px] text-gray-400 uppercase font-bold">{isAr ? "الشركة المنفذة للعقود الفرعية" : "Certified Contractor"}</span>
                <span className="text-[13px] font-bold text-emerald-400 truncate max-w-[160px]">{selectedRecord.contractor}</span>
              </div>
            </div>

            {/* Stage indicator */}
            <div className="bg-gray-50 p-5 rounded-[24px] border border-gray-150 space-y-3">
              <span className="text-[11px] text-gray-400 uppercase font-black block tracking-wider font-sans">{isAr ? "الحالة التعاقدية الحالية" : "Current Contractual Workflow Status"}</span>
              <p className="text-[15px] font-bold text-brand-navy">{isAr ? selectedRecord.status.ar : selectedRecord.status.en}</p>
              
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-brand-navy bg-brand-navy/5">
                      {isAr ? "نسبة إتمام الإجراء" : "Progress Rate"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-brand-navy">
                      {selectedRecord.progress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div style={{ width: `${selectedRecord.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-navy"></div>
                </div>
              </div>
            </div>

            {/* Execution Audit Trail (Interactive workflow timeline) */}
            <div className="space-y-4 border-t border-gray-100 pt-6">
               <span className="text-[11px] text-gray-400 uppercase font-black block tracking-widest font-sans">
                  Enterprise Action & Audit Trail
               </span>
               <div className="space-y-6 pt-2">
                  {[
                    { label: 'Document Ingestion & Schema Mapping', date: selectedRecord.submittedDate, status: 'done', author: 'Commercial Dept' },
                    { label: 'QS & PMO Compliance Sign-Off', date: '2026-06-20', status: selectedRecord.progress > 50 ? 'done' : 'now', author: 'PMO Engineer' },
                    { label: 'Final Owner / Executive Approval', date: '2026-06-25', status: selectedRecord.progress === 100 ? 'done' : selectedRecord.progress > 50 ? 'now' : 'pending', author: 'Platform Architect' }
                  ].map((task, i) => {
                     const isDone = task.status === 'done';
                     const isNow = task.status === 'now';
                     return (
                      <div key={i} className="flex gap-4 text-[14px] items-start font-sans relative">
                         <div className="flex flex-col items-center shrink-0 relative">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] border transition-colors z-10
                              ${isDone ? 'bg-brand-navy text-white border-brand-navy' : 
                                isNow ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse' : 
                                'bg-gray-50 text-gray-400 border-gray-200'}
                            `}>
                               {isDone ? '✓' : i + 1}
                            </div>
                            {i < 2 && <div className="w-0.5 h-12 bg-gray-100 absolute top-8 left-1/2 -translate-x-1/2" />}
                         </div>
                         <div className="flex-1 pt-1 ml-1 rtl:mr-1 rtl:ml-0">
                            <div className="flex justify-between items-center font-bold text-brand-navy text-[13px]">
                               <span>{task.label}</span>
                               <span className="font-mono text-[10px] text-gray-400">{task.date}</span>
                            </div>
                            <span className="text-[11px] text-gray-400 block mt-0.5">
                               {isAr ? `الجهة المسؤولة: ${task.author}` : `Responsible Actor: ${task.author}`}
                            </span>
                         </div>
                      </div>
                     );
                  })}
               </div>
            </div>

          </div>
        )}

      </div>

      {/* Stateful Submittal Dialog Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-2xl border border-gray-150 shadow-2xl overflow-hidden p-8 space-y-6 relative border-t-8 border-brand-navy max-h-[90vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-black text-brand-navy font-sans flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-brand-red" />
                  <span>{isAr ? "تقديم مستند مالي أو تعاقدي جديد" : "New Contractual/Financial Submittal"}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {isAr ? "أضف شهادة دفع مؤقتة، مطالبة مالية، أو أمر تغيير لصالح شركة رواد." : "Register site IPCs, claims, or change orders onto the active ledger."}
                </p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-brand-red rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Type & Schema Generated Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                    {isAr ? "نوع السند أو المعاملة" : "Submittal Class Type"}
                  </label>
                  <select
                    value={submitType}
                    onChange={(e) => setSubmitType(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/5 cursor-pointer"
                  >
                    <option value="IPC">📥 IPC (Interim Payment Certificate)</option>
                    <option value="Claim">⚠️ Claim (Contractual Dispute)</option>
                    <option value="Variation Order">🖋️ Variation Order (Change Scope)</option>
                    <option value="NOC">📋 NOC (Civil / Regulatory Permit)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                    {isAr ? "كود المستند" : "Generated Doc Code"}
                  </label>
                  <input
                    type="text"
                    required
                    value={submitCode}
                    onChange={(e) => setSubmitCode(e.target.value)}
                    placeholder="e.g. IPC-08-NEOM"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-navy rounded-xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/5 transition-all"
                  />
                </div>
              </div>

              {/* Project Title (English & Arabic) */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                  {isAr ? "اسم المشروع المعني بالتنفيذ" : "Target Execution Project"}
                </label>
                <div className="p-3 bg-brand-navy/5 rounded-xl flex flex-wrap gap-2 mb-2">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase py-1">{isAr ? "مقترحات سريعة:" : "Proposals:"}</span>
                  {[
                    { en: 'Neom Spine Ground Terminal Expansion', ar: 'توسعة محطة النفق الأرضية بمشروع نيوم' },
                    { en: 'Zayed Boulevard Commercial Corridor', ar: 'الممر التجاري بمحور الشيخ زايد' },
                    { en: 'Cairo Capital East Logistics Hub', ar: 'المركز اللوجستي لشرق العاصمة الإدارية' }
                  ].map((proj, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setProjNameEn(proj.en);
                        setProjNameAr(proj.ar);
                      }}
                      className="px-2.5 py-1 bg-white text-[11px] font-bold rounded-lg border border-gray-200 text-brand-navy hover:border-brand-navy hover:bg-brand-navy hover:text-white transition-all cursor-pointer"
                    >
                      {isAr ? proj.ar : proj.en}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={projNameEn}
                    onChange={(e) => setProjNameEn(e.target.value)}
                    placeholder="Project Name (English)"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-navy rounded-xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/5 transition-all"
                  />
                  <input
                    type="text"
                    required
                    value={projNameAr}
                    onChange={(e) => setProjNameAr(e.target.value)}
                    placeholder="اسم المشروع (بالعربية)"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-navy rounded-xl px-4 py-3 text-sm font-bold text-brand-navy text-right focus:outline-none focus:ring-4 focus:ring-brand-navy/5 transition-all"
                  />
                </div>
              </div>

              {/* Certified Value & Client Contractor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                    {isAr ? "القيمة المالية للاتفاقية (درهم/ريال)" : "Certified Valuation (e.g. AED 4,500,000)"}
                  </label>
                  <input
                    type="text"
                    value={submitValue}
                    onChange={(e) => setSubmitValue(e.target.value)}
                    placeholder="e.g. AED 4,500,000 or N/A"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-navy rounded-xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/5 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                    {isAr ? "المقاول المنفذ / الطرف الثاني" : "Contractor / Vendor Party"}
                  </label>
                  <input
                    type="text"
                    value={submitContractor}
                    onChange={(e) => setSubmitContractor(e.target.value)}
                    placeholder="e.g. Rowad Civil Engineering Co."
                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-navy rounded-xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/5 transition-all"
                  />
                </div>
              </div>

              {/* Status and Department description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                    {isAr ? "حالة الإجراء الحالية (English)" : "Workflow Status (English)"}
                  </label>
                  <input
                    type="text"
                    value={statusEn}
                    onChange={(e) => setStatusEn(e.target.value)}
                    placeholder="e.g. Awaiting signature"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-navy rounded-xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/5 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                    {isAr ? "حالة الإجراء الحالية (بالعربية)" : "Workflow Status (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={statusAr}
                    onChange={(e) => setStatusAr(e.target.value)}
                    placeholder="مثال: بانتظار توقيع الاستشاري"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-navy text-right rounded-xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/5 transition-all"
                  />
                </div>
              </div>

              {/* Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                    {isAr ? "القسم المعني (English)" : "Responsible Division (English)"}
                  </label>
                  <input
                    type="text"
                    value={deptEn}
                    onChange={(e) => setDeptEn(e.target.value)}
                    placeholder="e.g. Commercial Claims"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-navy rounded-xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/5 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                    {isAr ? "القسم المعني (بالعربية)" : "Responsible Division (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={deptAr}
                    onChange={(e) => setDeptAr(e.target.value)}
                    placeholder="مثال: قسم المطالبات والميزانيات"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-navy text-right rounded-xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/5 transition-all"
                  />
                </div>
              </div>

              {/* Progress Slider & Health Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                    {isAr ? "مستوى الخطورة والمتابعة" : "Health Control State"}
                  </label>
                  <select
                    value={submitHealth}
                    onChange={(e) => setSubmitHealth(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/5 cursor-pointer"
                  >
                    <option value="Healthy">🟢 Healthy (سليم وعادي)</option>
                    <option value="Under Review">🟡 Under Review (تحت المراجعة والتحقق)</option>
                    <option value="Urgent">🔴 Urgent (متعثر / خطورة عالية مستعجلة)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                    <span>{isAr ? "مستشار تقدم الإنجاز:" : "Workflow Progress:"}</span>
                    <span className="text-brand-navy">{submitProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={submitProgress}
                    onChange={(e) => setSubmitProgress(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-navy mt-4"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-150 rounded-xl text-xs font-black text-gray-500 cursor-pointer"
                >
                  {isAr ? "إلغاء الأمر" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 shadow-md active:translate-y-0 transition-all"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? "تسجيل وإنجاز السند" : "Submit & Register Record"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

        </>
      )}

    </div>
  );
}
