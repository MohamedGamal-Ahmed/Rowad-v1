import { useState } from 'react';

export function useTenderSelection() {
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>('t-1');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const selectAllRows = (ids: string[]) => {
    setSelectedRowIds(ids);
  };

  const clearSelection = () => {
    setSelectedRowIds([]);
  };

  return {
    selectedTenderId,
    setSelectedTenderId,
    selectedRowIds,
    setSelectedRowIds,
    toggleSelectRow,
    selectAllRows,
    clearSelection,
  };
}
