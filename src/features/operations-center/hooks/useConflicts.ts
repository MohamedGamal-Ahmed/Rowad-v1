import { useMemo } from 'react';
import { CalendarEvent, EventStatus } from '../types';

export interface ScheduleConflict {
  id: string;
  type: 'double_booking' | 'chronological_violation' | 'lag_buffer_violation';
  severity: 'critical' | 'high' | 'warning';
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  affectedEvents: CalendarEvent[];
}

export function useConflicts(events: CalendarEvent[]) {
  const conflicts = useMemo(() => {
    const list: ScheduleConflict[] = [];

    // Find and analyze double bookings
    const ownerDayEvents: { [key: string]: CalendarEvent[] } = {};
    events.forEach(e => {
      if (e.ownerName && e.startDate && e.startTime && e.endTime && e.status !== EventStatus.COMPLETED) {
        const key = `${e.ownerName}_${e.startDate}`;
        if (!ownerDayEvents[key]) ownerDayEvents[key] = [];
        ownerDayEvents[key].push(e);
      }
    });

    Object.keys(ownerDayEvents).forEach(key => {
      const items = ownerDayEvents[key];
      if (items.length > 1) {
        // Compare pairs for intersection
        for (let i = 0; i < items.length; i++) {
          for (let j = i + 1; j < items.length; j++) {
            const e1 = items[i];
            const e2 = items[j];
            const start1 = new Date(`${e1.startDate}T${e1.startTime}:00`);
            const end1 = new Date(`${e1.startDate}T${e1.endTime}:00`);
            const start2 = new Date(`${e2.startDate}T${e2.startTime}:00`);
            const end2 = new Date(`${e2.startDate}T${e2.endTime}:00`);

            if (start1 < end2 && start2 < end1) {
              list.push({
                id: `conflict-db-${e1.id}-${e2.id}`,
                type: 'double_booking',
                severity: 'critical',
                title: {
                  en: `Resource Dual-Booking: ${e1.ownerName}`,
                  ar: `حجز مزدوج للموظف: ${e1.ownerName}`
                },
                description: {
                  en: `Overlap on ${e1.startDate} between "${e1.title.en}" (${e1.startTime}) and "${e2.title.en}" (${e2.startTime}).`,
                  ar: `تداخل في التاريخ ${e1.startDate} بين "${e1.title.ar}" (${e1.startTime}) و "${e2.title.ar}" (${e2.startTime}).`
                },
                affectedEvents: [e1, e2]
              });
            }
          }
        }
      }
    });

    // Find and analyze chronological sequencing / lag violations
    events.forEach(e => {
      if (e.predecessorIds && e.predecessorIds.length > 0) {
        e.predecessorIds.forEach(pId => {
          const pred = events.find(item => item.id === pId);
          if (pred) {
            const predEnd = new Date(pred.endDate);
            const succStart = new Date(e.startDate);

            if (predEnd > succStart) {
              list.push({
                id: `conflict-seq-${pred.id}-${e.id}`,
                type: 'chronological_violation',
                severity: 'high',
                title: {
                  en: `Chronological Order Violation: ${e.projectCode}`,
                  ar: `خطأ في الترتيب الزمني للمراحل: ${e.projectCode}`
                },
                description: {
                  en: `Successor task "${e.title.en}" is scheduled on ${e.startDate}, which is BEFORE predecessor "${pred.title.en}" ends on ${pred.endDate}.`,
                  ar: `المرحلة اللاحقة "${e.title.ar}" تبدأ في ${e.startDate}، وهو قبل نهاية المرحلة السابقة "${pred.title.ar}" في ${pred.endDate}.`
                },
                affectedEvents: [pred, e]
              });
            } else if (e.lagDays) {
              const diffTime = succStart.getTime() - predEnd.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays < e.lagDays) {
                list.push({
                  id: `conflict-lag-${pred.id}-${e.id}`,
                  type: 'lag_buffer_violation',
                  severity: 'warning',
                  title: {
                    en: `Lag Buffer Violation: ${e.projectCode}`,
                    ar: `تجاوز الحد الأدنى للمهلة الزمنية: ${e.projectCode}`
                  },
                  description: {
                    en: `Successor "${e.title.en}" has only a ${diffDays}-day gap from "${pred.title.en}", which violates the minimum ${e.lagDays}-day lag requirement.`,
                    ar: `الفاصل الزمني بين "${pred.title.ar}" و "${e.title.ar}" هو ${diffDays} أيام فقط، وهو يقل عن الحد الأدنى للمهلة (${e.lagDays} أيام).`
                  },
                  affectedEvents: [pred, e]
                });
              }
            }
          }
        });
      }
    });

    return list;
  }, [events]);

  return conflicts;
}
