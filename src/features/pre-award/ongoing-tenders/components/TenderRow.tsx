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
  density?: 'compact' | 'standard';
  visibleColumns?: { [key: string]: boolean };
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
  density = 'compact',
  visibleColumns = {
    health: true,
    projectCode: true,
    tenderNumber: true,
    projectName: true,
    location: true,
    coordinator: true,
    contractsEngineer: true,
    techSubmissionDate: true,
    commSubmissionDate: true,
    daysRemaining: true,
  },
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

  const cellPadding = density === 'compact' ? 'py-1.5 px-3 text-xs' : 'py-3.5 px-5 text-sm';

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
      className={`hover:bg-gray-55/30 transition-all duration-150 cursor-pointer text-slate-700 font-semibold
        ${isSelected ? 'bg-brand-navy/5 shadow-inner' : ''}
        ${isChecked ? 'bg-brand-navy/10' : ''}
        ${t.recordStatus === 'Archived' ? 'opacity-70 bg-gray-100/30' : ''}
      `}
    >
      {/* Row Checkbox & Toggle */}
      <td className={`${cellPadding} text-center`} onClick={e => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onToggleCheck(t.id)}
          className="rounded border-gray-300 text-brand-navy focus:ring-brand-navy cursor-pointer w-3.5 h-3.5"
        />
      </td>

      {/* Health Indicator Tag */}
      {visibleColumns.health && (
        <td className={`${cellPadding} whitespace-nowrap`}>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 w-fit ${healthIndicator.col}`}>
            <span>{healthIndicator.icon}</span>
            <span className="font-sans uppercase text-[9px]">{healthIndicator.txt}</span>
          </span>
        </td>
      )}

      {/* Code */}
      {visibleColumns.projectCode && (
        <td className={`${cellPadding} font-mono font-bold text-slate-400 text-[11px]`}>{t.projectCode}</td>
      )}

      {/* Tender Number */}
      {visibleColumns.tenderNumber && (
        <td className={`${cellPadding} font-mono text-[11px] text-slate-400`}>{t.tenderNumber}</td>
      )}

      {/* Project Name (Bilingual stacked layout support) */}
      {visibleColumns.projectName && (
        <td className={cellPadding}>
          <BiText
            text={t.projectName}
            primaryLang={lang}
            primaryClassName="font-extrabold text-brand-navy text-[13px] block tracking-tight group-hover:text-brand-red transition-colors"
            secondaryClassName="text-[10px] text-slate-400 leading-normal block mt-0.5"
          />
        </td>
      )}

      {/* Location */}
      {visibleColumns.location && (
        <td className={`${cellPadding} text-slate-500 font-bold max-w-[120px] truncate`}>
          <BiText text={t.location} primaryLang={lang} />
        </td>
      )}

      {/* Coordinator */}
      {visibleColumns.coordinator && (
        <td className={`${cellPadding} text-brand-navy font-bold whitespace-nowrap`}>{isAr ? t.coordinator.ar : t.coordinator.en}</td>
      )}

      {/* Contracts Engineer */}
      {visibleColumns.contractsEngineer && (
        <td className={`${cellPadding} text-slate-600 font-semibold whitespace-nowrap`}>{isAr ? t.contractsEngineer.ar : t.contractsEngineer.en}</td>
      )}

      {/* Technical Sub */}
      {visibleColumns.techSubmissionDate && (
        <td className={`${cellPadding} text-slate-500 font-semibold font-mono whitespace-nowrap`}>{t.techSubmissionDate}</td>
      )}

      {/* Commercial Sub */}
      {visibleColumns.commSubmissionDate && (
        <td className={`${cellPadding} text-slate-500 font-semibold font-mono whitespace-nowrap`}>{t.commSubmissionDate}</td>
      )}

      {/* Days Left */}
      {visibleColumns.daysRemaining && (
        <td className={`${cellPadding} whitespace-nowrap`}>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold leading-none ${
              t.daysRemaining < 0
                ? 'bg-red-50 text-red-700 font-sans'
                : t.daysRemaining <= 7
                ? 'bg-amber-50 text-amber-700 font-sans animate-pulse'
                : 'bg-slate-100 text-slate-600 font-mono'
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
      )}

      {/* Actions */}
      <td className={`${cellPadding} text-center`} onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onSelect(t.id)}
          className="p-1 bg-slate-50 hover:bg-brand-red hover:text-white text-slate-500 rounded transition-all cursor-pointer"
          title={isAr ? 'عرض التفاصيل' : 'View Details'}
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}
