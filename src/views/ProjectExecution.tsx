import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, AlertCircle, FileText, ClipboardList, PenTool, 
  Layers, Search, Filter, Plus, ArrowUpRight, CheckCircle2, 
  Clock, ShieldAlert, ChevronRight, X, Send, Eye, DollarSign 
} from 'lucide-react';
import { BiText } from '../components/BiText';

export interface ExecutionRecord {
  id: string;
  type: 'IPC' | 'Claim' | 'Variation Order' | 'NOC' | 'SPR';
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
    type: 'SPR',
    code: 'SPR-21-ALM',
    projectName: { en: 'Al Maktoum Terminal Cargo Ramp', ar: 'مدرج الشحن بمطار آل مكتوم الدولي الجديد' },
    submittedDate: '2026-06-20',
    valueAED: 'AED 45,000,000',
    status: { en: 'Active SPR Execution', ar: 'تقرير الصفحة الواحدة نشط' },
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
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [healthFilter, setHealthFilter] = useState('all');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>('E-001');

  // New submittal form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitType, setSubmitType] = useState<'IPC' | 'Claim' | 'Variation Order' | 'NOC' | 'SPR'>('IPC');
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
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
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
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-2xl shadow-md flex items-center gap-2 text-[15px] font-bold transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? "تقديم وثيقة جديدة" : "New Document Submittal"}</span>
          </button>
        </div>
      </div>

      {/* 2. Micro Dashboards Metric Grid (Dashboard summaries for this module) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { key: 'IPC', label: isAr ? 'شهادات الدفع (IPC)' : 'Interim Payments (IPC)', count: '1 Certificate', val: 'AED 12.4M', color: 'border-emerald-500 text-emerald-600', bg: 'bg-emerald-50/50', icon: FileCheck2 },
          { key: 'Claims', label: isAr ? 'المطالبات الفنية' : 'Pending Claims', count: '1 Dispute', val: 'AED 3.2M', color: 'border-amber-500 text-amber-600', bg: 'bg-amber-50/50', icon: AlertCircle },
          { key: 'Variation', label: isAr ? 'أوامر التغيير العالقة' : 'Variation Orders', count: '1 Approved', val: 'AED 1.8M', color: 'border-blue-500 text-blue-600', bg: 'bg-blue-50/50', icon: PenTool },
          { key: 'NOC', label: isAr ? 'عدم ممانعة (NOC)' : 'Government NOCs', count: '1 Regulatory Review', val: 'N/A', color: 'border-brand-red text-brand-red', bg: 'bg-red-50/30', icon: ClipboardList },
          { key: 'SPR', label: isAr ? 'تقارير الورقة الواحدة (SPR)' : 'Single Paper Reports', count: '1 Executive Track', val: 'AED 45.0M', color: 'border-indigo-500 text-indigo-600', bg: 'bg-indigo-50/30', icon: FileText },
        ].map((met, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-2xl border-l-4 ${met.color} shadow-sm space-y-2`}>
            <div className="flex justify-between items-center text-gray-400">
              <span className="text-xs uppercase font-extrabold tracking-wider">{met.label}</span>
              <met.icon className="w-4 h-4 opacity-75" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-brand-navy leading-none">{met.val}</span>
            </div>
            <p className="text-[11px] text-gray-400/90 font-medium">{met.count}</p>
          </div>
        ))}
      </div>

      {/* 3. Operational Filter Matrix */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row self-stretch gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute inset-y-0 left-4 rtl:left-auto rtl:right-4 my-auto w-4 h-4 text-gray-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث برقم المعاملة، أو اسم العقد..." : "Search project executed code, claimant, submittal..."}
              className="w-full bg-gray-50 border border-gray-150 focus:border-brand-navy rounded-2xl py-3.5 pl-11 pr-5 rtl:pr-11 rtl:pl-5 text-[14px] text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/5 focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-gray-50 border border-gray-150 rounded-2xl px-4 py-3 text-[14px] text-gray-600 font-bold focus:outline-none focus:ring-4 focus:ring-brand-navy/5 cursor-pointer"
            >
              <option value="all">{isAr ? "جميع أنواع المعاملات" : "All Types"}</option>
              <option value="IPC">IPC</option>
              <option value="Claim">Claim</option>
              <option value="Variation Order">Variation Order</option>
              <option value="NOC">NOC</option>
              <option value="SPR">SPR</option>
            </select>

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
                    <option value="SPR">📊 SPR (Single Paper Executive Report)</option>
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

    </div>
  );
}
