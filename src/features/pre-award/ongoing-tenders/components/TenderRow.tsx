import React from 'react';
import { Eye } from 'lucide-react';
import { Tender } from '../types';
import { BiText } from '../../../../components/BiText';

interface TenderRowProps {
  key?: string;
  t: Tender;
  isSelected: boolean;
  isChecked: boolean;
  isAr: boolean;
  lang: 'ar' | 'en';
  onSelect: (id: string | null) => void;
  onToggleCheck: (id: string) => void;
  onShowAlert: (msg: string) => void;
}

export function TenderRow({
  t,
  isSelected,
  isChecked,
  isAr,
  lang,
  onSelect,
  onToggleCheck,
  onShowAlert,
}: TenderRowProps) {
  // Health indicators mapping based on Tender department request
  const healthIndicator =
    t.health === 'Healthy'
      ? { icon: '🟢', txt: 'Healthy', col: 'text-emerald-700 bg-emerald-50' }
      : t.health === 'Due Soon'
      ? { icon: '🟡', txt: 'Due Soon', col: 'text-amber-700 bg-amber-50' }
      : t.health === 'Overdue'
      ? { icon: '🔴', txt: 'Overdue', col: 'text-rose-700 bg-rose-50' }
      : { icon: '⚫', txt: 'Archived', col: 'text-gray-500 bg-gray-100' };

  return (
    <tr
      onClick={() => onSelect(t.id)}
      onDoubleClick={() => {
        onShowAlert(
          isAr
            ? 'سيتم تفعيل صفحة تفاصيل المشروع الكاملة قريباً كجزء من الميزات المستقبلية!'
            : 'Full Project Details page will be activated soon as a future feature!'
        );
      }}
      className={`hover:bg-gray-50/50 transition-all duration-150 cursor-pointer text-[15px] font-semibold text-gray-700
        ${isSelected ? 'bg-brand-navy/5 shadow-inner' : ''}
        ${isChecked ? 'bg-brand-navy/10' : ''}
        ${t.recordStatus === 'Archived' ? 'opacity-70 bg-gray-100/30' : ''}
      `}
    >
      {/* Row Checkbox & Toggle */}
      <td className="py-4.5 px-5 text-center" onClick={e => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onToggleCheck(t.id)}
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
        <span
          className={`px-2.5 py-1 rounded text-xs font-bold leading-none ${
            t.daysRemaining < 0
              ? 'bg-red-55/15 text-red-700 font-sans'
              : t.daysRemaining <= 7
              ? 'bg-amber-50 text-amber-700 font-sans animate-pulse'
              : 'bg-gray-55 text-gray-600 font-mono'
          }`}
        >
          {t.daysRemaining < 0
            ? isAr
              ? 'متأخر'
              : 'Overdue'
            : t.daysRemaining === 0
            ? isAr
              ? 'اليوم'
              : 'Today'
            : `${t.daysRemaining} ${isAr ? 'يوم' : 'days'}`}
        </span>
      </td>

      {/* Actions */}
      <td className="py-4.5 px-5 text-center" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onSelect(t.id)}
          className="p-1.5 hover:bg-gray-100/80 rounded-xl text-gray-400 hover:text-brand-navy cursor-pointer transition-colors"
          title={isAr ? 'عرض التفاصيل' : 'View Details'}
        >
          <Eye className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
}
