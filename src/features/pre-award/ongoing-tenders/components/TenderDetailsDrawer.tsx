import React from 'react';
import {
  X,
  Briefcase,
  Users,
  Calendar,
  CheckSquare,
  DollarSign,
  FileText,
  Send,
  Activity,
  MapPin,
  CheckCircle2,
  ClipboardList,
} from 'lucide-react';
import { Tender } from '../types';
import { TenderOverviewTab } from './TenderOverviewTab';
import { FinancialsCalculator } from '../../../business-rules/FinancialsCalculator';

interface TenderDetailsDrawerProps {
  selectedTender: Tender | null;
  onClose: () => void;
  isAr: boolean;
  lang: 'ar' | 'en';
  activeTab: 'overview' | 'assignments' | 'timeline' | 'activities' | 'financial' | 'docs' | 'notes' | 'history';
  setActiveTab: (tab: any) => void;
  newNoteText: string;
  setNewNoteText: (val: string) => void;
  onAddNote: (id: string) => void;
  newDocName: string;
  setNewDocName: (val: string) => void;
  newDocSize: string;
  setNewDocSize: (size: string) => void;
  onAddDoc: (id: string) => void;
  onShowAlert: (msg: string) => void;
}

export function TenderDetailsDrawer({
  selectedTender,
  onClose,
  isAr,
  lang,
  activeTab,
  setActiveTab,
  newNoteText,
  setNewNoteText,
  onAddNote,
  newDocName,
  setNewDocName,
  newDocSize,
  setNewDocSize,
  onAddDoc,
  onShowAlert,
}: TenderDetailsDrawerProps) {
  if (!selectedTender) {
    return (
      <div className="bg-white rounded-[32px] border border-gray-150 p-12 text-center text-sans flex flex-col items-center justify-center min-h-[500px] xl:sticky xl:top-4 shadow-sm">
        <ClipboardList className="w-12 h-12 text-gray-300 mb-3 animate-bounce" />
        <p className="text-gray-500 font-extrabold text-[15px] font-sans">
          {isAr ? 'الرجاء اختيار مشروع لاستعراض بياناته الكاملة' : 'Select a project to view its complete information.'}
        </p>
        <p className="text-gray-400 text-xs mt-1.5 leading-relaxed max-w-xs mx-auto font-sans">
          {isAr
            ? 'انقر فوق أي صف في الجدول لعرض التفاصيل الرقمية وتكليفات الكلفة والمواعيد الخاصة بالملف الشامل.'
            : 'Click any row in the table to display the complete digital project archive.'}
        </p>
      </div>
    );
  }

  const parseValue = (valStr: string): number => {
    return FinancialsCalculator.parseToNumber(valStr);
  };

  return (
    <div className="bg-white rounded-[32px] border border-gray-150 shadow-xl p-7 space-y-6 xl:sticky xl:top-4 overflow-y-auto max-h-[85vh] premium-scrollbar">
      {/* Drawer Close / Header controls */}
      <div className="flex justify-between items-start pb-5 border-b border-gray-150">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block font-sans truncate">
              {selectedTender.projectCode}
            </span>
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                selectedTender.priority === 'Critical'
                  ? 'bg-red-100 text-red-700 font-extrabold animate-pulse'
                  : selectedTender.priority === 'High'
                  ? 'bg-amber-100 text-amber-700'
                  : selectedTender.priority === 'Medium'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {selectedTender.priority || 'Medium'}
            </span>
          </div>
          <h3 className={`text-[20px] font-black text-brand-navy leading-tight truncate ${isAr ? 'font-arabic' : 'font-sans'}`}>
            {isAr ? selectedTender.projectName.ar : selectedTender.projectName.en}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-brand-red transition-all cursor-pointer shrink-0"
          title="Close Inspection Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Sub-Header Tabs Row - horizontal scrolling */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-gray-100 premium-scrollbar -mx-2 px-2">
        {(
          [
            { id: 'overview' as const, label: isAr ? 'الرئيسية' : 'Overview', icon: Briefcase },
            { id: 'assignments' as const, label: isAr ? 'التكليفات' : 'Assignments', icon: Users },
            { id: 'timeline' as const, label: isAr ? 'الجدول' : 'Timeline', icon: Calendar },
            { id: 'activities' as const, label: isAr ? 'التحقق' : 'Activities', icon: CheckSquare },
            { id: 'financial' as const, label: isAr ? 'المالية' : 'Financial', icon: DollarSign },
            { id: 'docs' as const, label: isAr ? 'الملفات' : 'Docs', icon: FileText },
            { id: 'notes' as const, label: isAr ? 'الملاحظات' : 'Notes', icon: Send },
            { id: 'history' as const, label: isAr ? 'السجل' : 'History', icon: Activity },
          ] as const
        ).map(t => {
          const CurrentIcon = t.icon;
          const isTabActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isTabActive ? 'bg-brand-navy text-white shadow-sm font-semibold' : 'bg-gray-55 text-gray-500 hover:bg-gray-100'
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
        <TenderOverviewTab
          selectedTender={selectedTender}
          isAr={isAr}
          onTransitionClick={() =>
            onShowAlert(
              isAr
                ? 'نقطة تحول معمارية: سيتم دمج هذه المزايدة وتوليد كشوفات السداد وبنود القياس للتشغيل تلقائياً.'
                : 'Architecture Extension Point: Core transition services prepared for automated contract instantiation.'
            )
          }
        />
      )}

      {/* TAB 2: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-4 animate-in fade-in duration-200 text-sans">
          <div className="space-y-1.5 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? 'الإدارة والوحدة الاستراتيجية' : 'Corporate Alignment'}</span>
            <div className="grid grid-cols-2 gap-3 text-xs mt-2">
              <div className="bg-white p-3 rounded-xl border border-gray-50">
                <span className="text-[10px] text-gray-400 block">{isAr ? 'القسم المسؤول' : 'Department'}</span>
                <p className="font-extrabold text-[#183B63] mt-0.5 truncate">{selectedTender.department || 'Pre-Award Civil Core'}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-50">
                <span className="text-[10px] text-gray-400 block">{isAr ? 'وحدة العمل' : 'Business Unit'}</span>
                <p className="font-extrabold text-[#183B63] mt-0.5 truncate">
                  {selectedTender.businessUnit ? (isAr ? selectedTender.businessUnit.ar : selectedTender.businessUnit.en) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? 'المهندسون الاستشاريون والمسؤولون' : 'Allocated Staffing Structure'}</span>

            <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100 font-sans">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs text-blue-800 shrink-0">TC</div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-gray-400 block font-bold">{isAr ? 'منسق دراسة العطاء' : 'Tender Coordinator (Lead)'}</span>
                <p className="text-[13px] font-extrabold text-brand-navy truncate">{isAr ? selectedTender.coordinator.ar : selectedTender.coordinator.en}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100 font-sans">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-xs text-emerald-800 shrink-0">CE</div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-gray-400 block font-bold">{isAr ? 'مهندس العقود' : 'Contracts Engineer'}</span>
                <p className="text-[13px] font-extrabold text-brand-navy truncate">{isAr ? selectedTender.contractsEngineer.ar : selectedTender.contractsEngineer.en}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100 font-sans">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-xs text-purple-800 shrink-0">SE</div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-gray-400 block font-bold">{isAr ? 'مهندس دراسة العطاء' : 'Tender Study Engineer'}</span>
                <p className="text-[13px] font-extrabold text-brand-navy truncate">
                  {selectedTender.tenderStudyEngineer
                    ? isAr
                      ? selectedTender.tenderStudyEngineer.ar
                      : selectedTender.tenderStudyEngineer.en
                    : isAr
                    ? 'لم يتم التعيين بعد'
                    : 'Not Assigned Yet'}
                </p>
              </div>
            </div>

            {selectedTender.consultant && (
              <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100 font-sans">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center font-bold text-xs text-amber-800 shrink-0">CS</div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-gray-400 block font-bold">{isAr ? 'المكتب الاستشاري' : 'Independent Consultant'}</span>
                  <p className="text-[13px] font-extrabold text-brand-navy truncate">{isAr ? selectedTender.consultant.ar : selectedTender.consultant.en}</p>
                </div>
              </div>
            )}

            {selectedTender.branch && (
              <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100 font-sans">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center font-bold text-xs text-rose-800 shrink-0">BR</div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-gray-400 block font-bold">{isAr ? 'الفرع الإقليمي' : 'Regional Branch Code'}</span>
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
            <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? 'سجل الأيام المتبقية والموعد الفتح' : 'Submission Lifespan'}</span>
            <div className="flex justify-between items-center text-sans mt-1">
              <span className="text-xs font-semibold text-gray-500">{isAr ? 'تاريخ إغلاق العطاء:' : 'Closing Date Frame:'}</span>
              <span className="font-mono text-sm font-bold text-brand-navy">{selectedTender.closingDate || '2026-08-30'}</span>
            </div>
          </div>

          <span className="text-[11px] text-gray-400 uppercase font-black block tracking-widest font-sans pl-1">
            {isAr ? 'مراحل الجدول الزمني للمزايدة' : 'Tender Milestone Roadmap'}
          </span>

          <div className="space-y-5 pt-1">
            {[
              {
                label: isAr ? 'اجتماع انطلاق المشروع' : 'Internal Kick-off Meeting',
                date: selectedTender.kickOffDate || '2026-06-15',
                status: 'done',
                step: 'K1',
              },
              {
                label: isAr ? 'موعد تقديم الاستفسارات / المخاطر' : 'Risk Assessment Due',
                date: selectedTender.riskDueDate || '2026-06-24',
                status: 'done',
                step: 'R2',
              },
              {
                label: isAr ? 'تحفظات وتعليقات المزايدة' : 'Contract Quals Due',
                date: selectedTender.contractQualsDueDate || '2026-07-01',
                status: 'now',
                step: 'C3',
              },
              {
                label: isAr ? 'اجتماع المطابقة والاصطفاف' : '1st Alignment Meeting',
                date: selectedTender.alignmentDate || '2026-07-05',
                status: 'wait',
                step: 'A4',
              },
              {
                label: isAr ? 'اجتماع المتابعة والتقدير' : 'Intermediate Follow-up',
                date: selectedTender.followUpDate || '2026-07-10',
                status: 'wait',
                step: 'F5',
              },
              { label: isAr ? 'تقديم العرض الفني' : 'Technical Submission', date: selectedTender.techSubmissionDate, status: 'wait', step: 'T6' },
              { label: isAr ? 'تقديم العرض المالي' : 'Commercial Submission', date: selectedTender.commSubmissionDate, status: 'wait', step: 'M7' },
            ].map((st, i) => {
              return (
                <div key={i} className="flex gap-3 text-[13px] items-start font-sans relative">
                  <div className="flex flex-col items-center shrink-0 relative mt-0.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] border transition-colors z-10
                      ${
                        st.status === 'done'
                          ? 'bg-brand-navy text-white border-brand-navy font-semibold'
                          : st.status === 'now'
                          ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                          : 'bg-gray-55 text-gray-400 border-gray-200'
                      }
                    `}
                    >
                      {st.step}
                    </div>
                    {i < 6 && (
                      <div className={`w-0.5 h-11 bg-gray-100 absolute top-7 left-1/2 -translate-x-1/2 ${st.status === 'done' ? 'bg-brand-navy/50' : ''}`} />
                    )}
                  </div>
                  <div className="flex-1 pt-0.5 ml-1.5 rtl:mr-1.5 rtl:ml-0">
                    <div className="flex justify-between items-center font-extrabold text-brand-navy text-[13px]">
                      <span>{st.label}</span>
                      <span className="font-mono text-[10px] text-gray-400">{st.date}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 block font-normal">
                      {st.status === 'done'
                        ? isAr
                          ? 'تم تجاوز المرحلة بنجاح'
                          : 'Phase cleared'
                        : st.status === 'now'
                        ? isAr
                          ? 'المرحلة الحالية قيد الإنجاز'
                          : 'Ongoing milestone priority'
                        : isAr
                        ? 'بانتظار التقدم الزمني'
                        : 'Future scheduled stage'}
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
            <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? 'تدقيقات ومستندات الفحص الأولي' : 'Initial Feasibility Checklists'}</span>

            <div className="space-y-2">
              {[
                { label: isAr ? 'استلام مستندات المزايدة والمخططات الأصلية' : 'Full RFP Documents Received', checked: selectedTender.checklistReceived ?? true },
                { label: isAr ? 'دراسة وفحص المخططات الهندسية' : 'Technical Drawings Audited', checked: selectedTender.checklistDrawings ?? true },
                { label: isAr ? 'مطابقة وتحديث جداول الكميات (BOQ)' : 'BOQ Cost Sheet Harmonized', checked: selectedTender.checklistBOQ ?? true },
                {
                  label: isAr ? 'مراجعة الميزات والمواصفات الفنية الخاصة بالإنشاء' : 'Technical Specifications Verified',
                  checked: selectedTender.checklistSpecs ?? true,
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-gray-100 text-[13px]">
                  {item.checked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 shrink-0" />
                  )}
                  <span className={`font-semibold ${item.checked ? 'text-gray-700' : 'text-gray-400 line-through font-normal'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-2 text-sans">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? 'معاينة الموقع والزيارات الميدانية' : 'Site Visit Verification Details'}</span>
            <div className="bg-white p-3 rounded-xl border border-gray-50 text-[13px]">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-semibold">{isAr ? 'الزيارة الميدانية مطلوبة؟' : 'Site Visit Demanded?'}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    selectedTender.siteVisitRequired ?? true ? 'bg-amber-100 text-amber-800' : 'bg-gray-55 text-gray-550'
                  }`}
                >
                  {selectedTender.siteVisitRequired ?? true
                    ? isAr
                      ? 'نعم - إلزامي'
                      : 'Yes - Mandatory'
                    : isAr
                    ? 'غير مطلوب'
                    : 'No'}
                </span>
              </div>
              {(selectedTender.siteVisitRequired ?? true) && (
                <div className="flex justify-between items-center mt-2.5 border-t border-gray-50 pt-2.5">
                  <span className="text-gray-400 font-semibold">{isAr ? 'موعد الزيارة المحدد:' : 'Scheduled Visit Date:'}</span>
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
          <span className="text-[10px] text-gray-400 font-bold uppercase block pl-1">{isAr ? 'ورقة البيانات والمؤشرات المالية' : 'Financial Metrics & Estimative Target'}</span>

          <div className="bg-gray-950 text-white rounded-2xl p-5 space-y-4 border border-brand-navy/10 shadow-sm font-mono text-[13px]">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-bold uppercase text-[10px]">{isAr ? 'القيمة التقديرية للمشروع (السعر المستهدف)' : 'Estimated Tender Value'}</span>
              <span className="text-[15px] font-black text-white">{selectedTender.estimatedValue}</span>
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-3.5">
              <span className="text-gray-400 font-bold uppercase text-[10px]">{isAr ? 'كلفة التقدير الداخلية المتوقعة' : 'Internal Estimated Cost'}</span>
              <span className="text-[14px] font-bold text-gray-300">{selectedTender.estimatedCost || 'N/A'}</span>
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-3.5">
              <span className="text-gray-400 font-bold uppercase text-[10px]">{isAr ? 'هامش الربح المتوقع' : 'Projected Margin Metrics'}</span>
              <div className="text-right">
                {(() => {
                  const val = parseValue(selectedTender.estimatedValue);
                  const cost = parseValue(selectedTender.estimatedCost || '');
                  if (val && cost && val >= cost) {
                    const margin = val - cost;
                    const marginPct = (margin / val) * 100;
                    return (
                      <div>
                        <span className="text-emerald-400 font-bold text-sm block">
                          +{selectedTender.currency} {margin.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-[10px] text-emerald-400/85">({marginPct.toFixed(2)}% Margin)</span>
                      </div>
                    );
                  }
                  return <span className="text-gray-450">N/A</span>;
                })()}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-3.5">
              <span className="text-gray-400 font-bold uppercase text-[10px]">{isAr ? 'قيمة خطابات الضمان المطلوبة (2%)' : 'Tender Bond Required (2%)'}</span>
              <span className="text-emerald-400 text-sm font-black">{selectedTender.bondAmount}</span>
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-3.5">
              <span className="text-gray-400 font-bold uppercase text-[10px]">{isAr ? 'عملة حساب العطاء والمناقصة' : 'Reporting Currency Standard'}</span>
              <span className="text-brand-red bg-red-500/10 border border-brand-red/20 px-2 py-0.5 rounded font-bold text-xs uppercase">{selectedTender.currency}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: DOCUMENTS */}
      {activeTab === 'docs' && (
        <div className="space-y-4 animate-in fade-in duration-200 text-sans">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">
              {isAr ? 'المستندات وكشوف الملف الرقمي' : 'RFP Specifications & Documents'} ({selectedTender.documents.length})
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto premium-scrollbar pr-1">
            {selectedTender.documents.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-150">
                {isAr ? 'لا توجد مستندات جمركية أو مواصفات فنية ملحقة بالملف.' : 'No documents linked to this digital project record yet.'}
              </p>
            ) : (
              selectedTender.documents.map(doc => (
                <div
                  key={doc.id}
                  className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 text-[13px] hover:bg-gray-50 transition-all duration-150"
                >
                  <div className="flex items-center gap-2 truncate min-w-0 flex-1">
                    <FileText className="w-4 h-4 text-brand-red shrink-0" />
                    <span className="font-extrabold text-[#183B63] truncate text-xs">{doc.name}</span>
                    <span className="text-[10px] text-gray-400 shrink-0 font-mono font-normal">({doc.size})</span>
                  </div>
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      onShowAlert(isAr ? 'جاري محاكاة تنزيل المستند المشفر لضمان الأمان...' : 'Simulating secure document package retrieve...');
                    }}
                    className="px-2 py-0.5 bg-white text-gray-400 hover:text-brand-navy hover:bg-gray-100 border border-gray-200 rounded text-[9px] font-bold transition-all shrink-0 ml-2"
                  >
                    {isAr ? 'تحميل' : 'DISPATCH'}
                  </a>
                </div>
              ))
            )}
          </div>

          {/* Add Document Simulation Trigger Form */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 mt-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">{isAr ? 'تسجيل مستند فني أو مراسلة جديدة' : 'Attach New Tender Document'}</span>
            <input
              type="text"
              value={newDocName}
              onChange={e => setNewDocName(e.target.value)}
              placeholder={isAr ? 'اسم الملف (مثال: جدول الكميات المحدث)' : 'Enter document name (e.g. Approved BOQ)'}
              className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-navy transition-all"
            />
            <div className="flex gap-2">
              <select
                value={newDocSize}
                onChange={e => setNewDocSize(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl p-2 text-xs focus:outline-none text-gray-500 w-24 shrink-0 font-bold"
              >
                <option value="1.2 MB">1.2 MB</option>
                <option value="2.4 MB">2.4 MB</option>
                <option value="4.8 MB">4.8 MB</option>
                <option value="12.5 MB">12.5 MB</option>
              </select>
              <button
                type="button"
                onClick={() => onAddDoc(selectedTender.id)}
                className="flex-1 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl text-xs font-bold transition-all py-2 cursor-pointer text-center"
              >
                {isAr ? 'إرفاق وتوثيق الملف' : 'Register Tender File'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-4 animate-in fade-in duration-200 text-sans">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">
              {isAr ? 'سجل المراجعات والملاحظات الداخلية font-ar' : 'Internal Engineering Notes'} ({selectedTender.notes.length})
            </span>
          </div>

          <div className="space-y-3.5 max-h-52 overflow-y-auto premium-scrollbar pr-1">
            {selectedTender.notes.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-150">
                {isAr ? 'لا توجد ملاحظات تقديرية في السجل حالياً.' : 'No engineering notes recorded.'}
              </p>
            ) : (
              selectedTender.notes.map(note => (
                <div key={note.id} className="bg-gray-50/70 p-3 rounded-xl border border-gray-150 text-[13px] space-y-1">
                  <div className="flex justify-between items-center text-gray-400 text-[10px] font-bold font-sans">
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
              onChange={e => setNewNoteText(e.target.value)}
              placeholder={isAr ? 'اكتب ملاحظة كلفة أو عقود جديدة...' : 'Type custom estimative comment...'}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-navy focus:bg-white transition-all shadow-inner"
              onKeyDown={e => {
                if (e.key === 'Enter') onAddNote(selectedTender.id);
              }}
            />
            <button
              type="button"
              onClick={() => onAddNote(selectedTender.id)}
              className="p-3 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 8: HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4 animate-in fade-in duration-200 text-sans">
          <span className="text-[10px] text-gray-400 font-bold uppercase block pl-1">{isAr ? 'سجل تتبع التعديلات والعمليات font-ar' : 'System Audit Logs (PMO Ledger)'}</span>

          <div className="space-y-3 max-h-[420px] overflow-y-auto premium-scrollbar pr-1">
            {[
              {
                admin: 'm.gamlahmed@gmail.com',
                text: isAr ? 'تم استيراد كود المشروع وتطبيق معايير التنبيه الزمني' : 'Registered in Cloud pre-award ledger and checked cron parameters',
                time: isAr ? 'الآن' : 'Just now',
              },
              {
                admin: 'Ahmed Mostafa',
                text: isAr ? 'تأكيد ملاءمة الموازنة وتسجيل الضمان الإبتدائي بنسبة 2٪' : 'Verified bond amount eligibility metrics & cost margin bounds',
                time: '2 hours ago',
              },
              {
                admin: 'ROWAD Feeder',
                text: isAr ? 'تم حفظ التعديلات الرقمية وملفات المزايدة بنجاح' : 'Digitized metadata records saved & verified against Pre-Award guidelines',
                time: '1 day ago',
              },
              {
                admin: 'System Engine',
                text: isAr ? 'المزايدة مهيأة كلياً للعمل بموجب إعدادات البوابة الإقليمية' : 'Milestone timelines synthesized automatically according to pre-award standards',
                time: '2 days ago',
              },
            ].map((log, lidx) => (
              <div key={lidx} className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 space-y-1.5 text-xs font-sans">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-[#183B63]">{log.admin}</span>
                  <span className="text-gray-400 text-[10px] font-mono font-normal">{log.time}</span>
                </div>
                <p className="text-gray-500 font-semibold leading-relaxed font-sans">{log.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
