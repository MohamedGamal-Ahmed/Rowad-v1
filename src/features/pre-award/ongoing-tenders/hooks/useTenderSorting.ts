import { useState } from 'react';
import { Tender } from '../types';

export type SortField = 'projectCode' | 'tenderNumber' | 'projectName' | 'location' | 'daysRemaining' | 'estimatedValue';
export type SortDirection = 'asc' | 'desc';

export function useTenderSorting() {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortTenders = (tenders: Tender[]) => {
    if (!sortField) return tenders;

    return [...tenders].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      // Handle nested structures like bilingual name
      if (sortField === 'projectName') {
        valA = a.projectName.en || '';
        valB = b.projectName.en || '';
      }

      if (typeof valA === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else if (typeof valA === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });
  };

  return {
    sortField,
    sortDirection,
    handleSort,
    sortTenders,
  };
}
