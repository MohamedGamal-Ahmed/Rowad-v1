import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Tender } from '../types';
import { TenderRow } from './TenderRow';

interface TenderTableProps {
  filteredTenders: Tender[];
  selectedTenderId: string | null;
  selectedRowIds: string[];
  setSelectedRowIds: React.Dispatch<React.SetStateAction<string[]>>;
  isAr: boolean;
  lang: 'ar' | 'en';
  onSelect: (id: string | null) => void;
  onShowAlert: (msg: string) => void;
}

export function TenderTable({
  filteredTenders,
  selectedTenderId,
  selectedRowIds,
  setSelectedRowIds,
  isAr,
  lang,
  onSelect,
  onShowAlert,
}: TenderTableProps) {
  const isAllChecked =
    filteredTenders.length > 0 && selectedRowIds.length === filteredTenders.length;

  const handleHeaderCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(filteredTenders.map(t => t.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleToggleCheck = (id: string) => {
    setSelectedRowIds(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden pb-4">
      {/* Table wrapper containing true data alignment */}
      <div className="overflow-x-auto premium-scrollbar">
        <table className="w-full text-start border-collapse text-sans text-[15px]">
          <thead>
            <tr className="bg-gray-50/60 border-b border-gray-100 text-[15px] font-extrabold uppercase text-gray-400 tracking-wider">
              <th className="py-4.5 px-5 text-center w-12">
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={handleHeaderCheckboxChange}
                  className="rounded border-gray-300 text-brand-navy focus:ring-brand-navy cursor-pointer w-4 h-4"
                />
              </th>
              <th className="py-4.5 px-5 text-start">{isAr ? 'مؤشر الصحة' : 'Health'}</th>
              <th className="py-4.5 px-5 text-start">{isAr ? 'كود المشروع' : 'Project Code'}</th>
              <th className="py-4.5 px-5 text-start">{isAr ? 'رقم المناقصة' : 'Tender Number'}</th>
              <th className="py-4.5 px-5 text-start min-w-[210px]">{isAr ? 'اسم المشروع' : 'Project Name'}</th>
              <th className="py-4.5 px-5 text-start">{isAr ? 'الموقع الجغرافي' : 'Location'}</th>
              <th className="py-4.5 px-5 text-start">{isAr ? 'المنسق' : 'Coordinator'}</th>
              <th className="py-4.5 px-5 text-start">{isAr ? 'مهندس العقود' : 'Contracts Eng'}</th>
              <th className="py-4.5 px-5 text-start">{isAr ? 'التسليم الفني' : 'Technical Sub'}</th>
              <th className="py-4.5 px-5 text-start">{isAr ? 'التسليم المالي' : 'Commercial Sub'}</th>
              <th className="py-4.5 px-5 text-start whitespace-nowrap">{isAr ? 'الأيام المتبقية' : 'Days Left'}</th>
              <th className="py-4.5 px-5 text-center">{isAr ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredTenders.length === 0 ? (
              <tr>
                <td colSpan={12} className="p-12 text-center text-sans">
                  <div className="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto">
                    <AlertTriangle className="w-12 h-12 text-brand-red animate-pulse" />
                    <h3 className="font-bold text-brand-navy text-sm font-sans">
                      {isAr ? 'المزايدة لم يعثر عليها' : 'No ongoing tenders match your criteria.'}
                    </h3>
                    <p className="text-xs text-gray-400 font-sans">
                      {isAr
                        ? 'يمكنك بسهولة مراجعة فلاتر التصفية أو البدء باستيراد كشف الـ PMO بضغطة زر واحدة.'
                        : 'Try resetting parameters or launch the Import Wizard for instant PMO sync.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTenders.map(t => (
                <TenderRow
                  key={t.id}
                  t={t}
                  isSelected={selectedTenderId === t.id}
                  isChecked={selectedRowIds.includes(t.id)}
                  isAr={isAr}
                  lang={lang}
                  onSelect={id => onSelect(id)}
                  onToggleCheck={handleToggleCheck}
                  onShowAlert={onShowAlert}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
