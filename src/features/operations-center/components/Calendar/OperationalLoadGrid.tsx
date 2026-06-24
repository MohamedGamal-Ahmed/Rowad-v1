import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, AlertTriangle, Clock, Calendar as CalendarIcon, MapPin
} from 'lucide-react';
import { CalendarEvent } from '../../types';

interface OperationalLoadGridProps {
  lang: 'ar' | 'en';
  events: CalendarEvent[];
  onSelectEvent: (id: string) => void;
}

export function OperationalLoadGrid({ lang, events, onSelectEvent }: OperationalLoadGridProps) {
  const isAr = lang === 'ar';
  
  // Set default calendar to June 2026 (the active timeframe of the mock portfolio)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // June (0-indexed is 5)

  const [selectedDayString, setSelectedDayString] = useState<string | null>('2026-06-25');

  const monthNames = isAr
    ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const daysOfWeek = isAr
    ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate day-by-day load
  const dayGrid = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const cells: Array<{ dayNumber: number | null; dateStr: string | null; loadCount: number; hasConflict: boolean; items: CalendarEvent[] }> = [];

    // Pre-padding empty cells
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ dayNumber: null, dateStr: null, loadCount: 0, hasConflict: false, items: [] });
    }

    // Days cells
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.startDate === dayStr);
      const hasConflict = dayEvents.some(e => e.hasConflict);

      cells.push({
        dayNumber: d,
        dateStr: dayStr,
        loadCount: dayEvents.length,
        hasConflict,
        items: dayEvents
      });
    }

    return cells;
  }, [currentYear, currentMonth, events]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Soft Shading Styling function
  const getShadingStyle = (count: number, hasConflict: boolean, isSelected: boolean) => {
    let styleClass = 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-50';
    
    if (isSelected) {
      styleClass = 'bg-slate-50 dark:bg-slate-800 border-brand-red ring-2 ring-brand-red/30 z-10';
      return styleClass;
    }

    if (hasConflict) {
      return 'bg-amber-50/90 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900 text-amber-900 dark:text-amber-300 hover:bg-amber-100/50';
    }

    if (count === 0) {
      return 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-700 hover:bg-slate-50/55';
    } else if (count <= 3) {
      // Low shading
      return 'bg-slate-50/80 dark:bg-slate-800/20 border-slate-200/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100/40';
    } else if (count <= 7) {
      // Medium shading
      return 'bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 text-blue-900 dark:text-blue-300 hover:bg-blue-100/40';
    } else if (count <= 11) {
      // High shading
      return 'bg-blue-100/50 dark:bg-blue-900/20 border-blue-200 text-blue-950 dark:text-blue-200 hover:bg-blue-100';
    } else {
      // Critical Saturation
      return 'bg-amber-100/80 dark:bg-amber-900/30 border-amber-300 text-amber-950 dark:text-amber-200 hover:bg-amber-200';
    }
  };

  const selectedDayData = useMemo(() => {
    return dayGrid.find(cell => cell.dateStr === selectedDayString) || null;
  }, [dayGrid, selectedDayString]);

  return (
    <div className="space-y-6">
      {/* Calendar Header with Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-red/10 text-brand-red rounded-xl">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-sans">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'خريطة الكثافة التشغيلية وسعة المحفظة' : 'Chronological matrix highlighting operational load'}
            </p>
          </div>
        </div>

        {/* Legend of Loads */}
        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono font-bold">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-white border border-slate-100"></span>
            <span>0</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-slate-50 border border-slate-200"></span>
            <span>1-3</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-blue-50/50 border border-blue-100"></span>
            <span>4-7</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-blue-100/50 border border-blue-200"></span>
            <span>8-11</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-amber-50 border border-amber-300"></span>
            <span>12+ / ⚠</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-slate-600 dark:text-slate-300"
          >
            <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
          </button>
          <button 
            onClick={() => {
              setCurrentYear(2026);
              setCurrentMonth(5); // June 2026
            }}
            className="text-xs bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 border border-slate-150 dark:border-slate-700 px-4 py-2 rounded-xl font-bold cursor-pointer"
          >
            {isAr ? 'اليوم' : 'Today'}
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-slate-600 dark:text-slate-300"
          >
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Grid of Weekdays and Days */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm">
        {/* Days of Week Row */}
        <div className="grid grid-cols-7 border-b border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10 text-center py-3">
          {daysOfWeek.map((day, idx) => (
            <span key={idx} className="text-xs font-black text-slate-400 dark:text-slate-500 font-sans tracking-wider">
              {day}
            </span>
          ))}
        </div>

        {/* Calendar days cells */}
        <div className="grid grid-cols-7 gap-px bg-slate-150 dark:bg-slate-800">
          {dayGrid.map((cell, idx) => {
            const isSelected = cell.dateStr === selectedDayString;
            return (
              <div
                key={idx}
                onClick={() => {
                  if (cell.dateStr) setSelectedDayString(cell.dateStr);
                }}
                className={`min-h-[100px] p-2.5 flex flex-col justify-between transition-all relative border border-transparent cursor-pointer select-none
                  ${getShadingStyle(cell.loadCount, cell.hasConflict, isSelected)}
                `}
              >
                {cell.dayNumber ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black ${isSelected ? 'text-brand-red' : 'text-slate-600 dark:text-slate-400'}`}>
                        {cell.dayNumber}
                      </span>
                      {cell.hasConflict && (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>
                    
                    {/* Compact display indicator */}
                    {cell.loadCount > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="text-[10px] font-bold text-slate-500 bg-slate-500/10 px-1.5 py-0.5 rounded-full inline-block">
                          {cell.loadCount} {isAr ? 'عنصر' : 'Items'}
                        </div>
                        {cell.items.slice(0, 1).map((item) => (
                          <div 
                            key={item.id} 
                            className="text-[9px] font-bold truncate px-1.5 py-0.5 rounded border border-blue-100 bg-blue-50/50 text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-300"
                          >
                            {isAr ? item.title.ar : item.title.en}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Row Expansion details panel */}
      {selectedDayData && selectedDayData.items.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-950/10 border border-slate-200 dark:border-slate-800 rounded-[28px] p-6 animate-in slide-in-from-top-2 duration-300 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-250 dark:border-slate-800">
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider font-sans flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{isAr ? `الأحداث والمهام لليوم (${selectedDayString})` : `Operational Events on ${selectedDayString}`}</span>
            </h4>
            <span className="text-xs text-slate-400 font-bold">
              {selectedDayData.items.length} {isAr ? 'عنصر قيد المتابعة' : 'active entries'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedDayData.items.map((e) => (
              <div
                key={e.id}
                onClick={() => onSelectEvent(e.id)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex justify-between items-center group"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded font-mono">
                      {e.projectCode}
                    </span>
                    {e.hasConflict && (
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{isAr ? 'تعارض' : 'Conflict'}</span>
                      </span>
                    )}
                  </div>

                  <h5 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate group-hover:text-brand-red transition-colors">
                    {isAr ? e.title.ar : e.title.en}
                  </h5>

                  <p className="text-xs text-slate-400 truncate">
                    {isAr ? e.description?.ar : e.description?.en}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-1">
                    <span>{e.startTime || '08:00'} - {e.endTime || '17:00'}</span>
                    <span>|</span>
                    <span className="font-semibold text-slate-500">{e.ownerName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
