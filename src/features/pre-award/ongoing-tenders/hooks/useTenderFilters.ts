import { useState } from 'react';
import { Tender } from '../types';

export function useTenderFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [recordFilter, setRecordFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [coordinatorFilter, setCoordinatorFilter] = useState('all');
  const [engineerFilter, setEngineerFilter] = useState('all');
  const [tenderTypeFilter, setTenderTypeFilter] = useState('all');

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setRecordFilter('all');
    setLocationFilter('all');
    setCoordinatorFilter('all');
    setEngineerFilter('all');
    setTenderTypeFilter('all');
  };

  const filterTenders = (list: Tender[]) => {
    return list.filter(t => {
      const matchSearch =
        t.projectName.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.projectName.ar.includes(searchQuery) ||
        t.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tenderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.coordinator.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.coordinator.ar.includes(searchQuery) ||
        t.contractsEngineer.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.contractsEngineer.ar.includes(searchQuery);

      const matchStatus = statusFilter === 'all' || t.projectStatus.en === statusFilter;
      const matchRecord = recordFilter === 'all' || t.recordStatus === recordFilter;
      const matchLocation = locationFilter === 'all' || t.location.en.includes(locationFilter);
      const matchCoordinator = coordinatorFilter === 'all' || t.coordinator.en === coordinatorFilter;
      const matchEngineer = engineerFilter === 'all' || t.contractsEngineer.en === engineerFilter;
      const matchTenderType = tenderTypeFilter === 'all' || t.tenderType.en === tenderTypeFilter;

      return matchSearch && matchStatus && matchRecord && matchLocation && matchCoordinator && matchEngineer && matchTenderType;
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    recordFilter,
    setRecordFilter,
    locationFilter,
    setLocationFilter,
    coordinatorFilter,
    setCoordinatorFilter,
    engineerFilter,
    setEngineerFilter,
    tenderTypeFilter,
    setTenderTypeFilter,
    clearFilters,
    filterTenders,
  };
}
