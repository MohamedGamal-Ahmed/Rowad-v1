import React from 'react';
import { Tender } from '../types';

interface TenderTimelineTabProps {
  selectedTender: Tender;
  isAr: boolean;
}

export function TenderTimelineTab({ selectedTender, isAr }: TenderTimelineTabProps) {
  return (
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
              <div className="flex-1 pt-0.5 ml-1.5 ltr:ml-1.5 rtl:mr-1.5 rtl:ml-0">
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
  );
}
