import React from 'react';
import { X } from 'lucide-react';
import { Settings } from '../domain/administration/Settings';
import { Tender } from '../features/pre-award/ongoing-tenders/types';
import { initialTenders } from '../features/pre-award/ongoing-tenders/constants/initialTenders';
import { useOngoingTenders } from '../features/pre-award/ongoing-tenders/hooks/useOngoingTenders';

// Re-export decomposed feature subcomponents and types for external consuming files
import { TenderToolbar } from '../features/pre-award/ongoing-tenders/components/TenderToolbar';
import { TenderKPICards } from '../features/pre-award/ongoing-tenders/components/TenderKPICards';
import { TenderFilters } from '../features/pre-award/ongoing-tenders/components/TenderFilters';
import { TenderActions } from '../features/pre-award/ongoing-tenders/components/TenderActions';
import { TenderTable } from '../features/pre-award/ongoing-tenders/components/TenderTable';
import { TenderDetailsDrawer } from '../features/pre-award/ongoing-tenders/components/TenderDetailsDrawer';
import { TenderImportModal } from '../features/pre-award/ongoing-tenders/components/TenderImportModal';
import { TenderWizardModal } from '../features/pre-award/ongoing-tenders/components/TenderWizardModal';

export type { Tender };
export { initialTenders };

interface OngoingTendersProps {
  lang: 'ar' | 'en';
  list: Tender[];
  onUpdateList: React.Dispatch<React.SetStateAction<Tender[]>>;
  settings: Settings;
}

export function OngoingTenders({
  lang,
  list,
  onUpdateList,
  settings,
}: OngoingTendersProps) {
  const isAr = lang === 'ar';

  const {
    selectedTenderId,
    setSelectedTenderId,
    selectedRowIds,
    setSelectedRowIds,
    showImportWizard,
    setShowImportWizard,
    showManualForm,
    setShowManualForm,
    dragActive,
    analyzingFile,
    importStep,
    setImportStep,
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
    newNoteText,
    setNewNoteText,
    newDocName,
    setNewDocName,
    newDocSize,
    setNewDocSize,
    activeTab,
    setActiveTab,
    toastAlert,
    setToastAlert,
    clearFilters,
    filteredTenders,
    selectedTender,
    executeImportMerge,
    handleAddNoteToTender,
    handleAddDocToTender,
    handleBulkArchive,
    handleBulkExport,
    handleDrag,
    handleDrop,
    triggerAnalysis,
  } = useOngoingTenders({
    list,
    onUpdateList,
    settings,
    isAr,
  });

  return (
    <div className="px-6 py-6 max-w-[1800px] mx-auto space-y-6 animate-in fade-in duration-500 relative">
      {/* Dynamic Toast Alert Portal */}
      {toastAlert && (
        <div className="fixed top-24 right-8 rtl:left-8 rtl:right-auto z-50 bg-brand-navy border border-white/10 text-white flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              toastAlert.type === 'success'
                ? 'bg-emerald-500'
                : toastAlert.type === 'warn'
                ? 'bg-brand-red'
                : 'bg-blue-400'
            }`}
          />
          <span className="text-xs font-semibold">{toastAlert.message}</span>
          <button
            onClick={() => setToastAlert(null)}
            className="p-0.5 hover:bg-white/10 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-white/50 hover:text-white" />
          </button>
        </div>
      )}

      {/* ------------------ IMPORT WIZARD MODAL ------------------ */}
      {showImportWizard && (
        <TenderImportModal
          onClose={() => {
            setShowImportWizard(false);
            setImportStep(1);
          }}
          isAr={isAr}
          importStep={importStep}
          setImportStep={setImportStep}
          dragActive={dragActive}
          handleDrag={handleDrag}
          handleDrop={handleDrop}
          analyzingFile={analyzingFile}
          triggerAnalysis={triggerAnalysis}
          executeImportMerge={executeImportMerge}
        />
      )}

      {/* ------------------ GUIDED TENDER CREATION WIZARD ------------------ */}
      {showManualForm && (
        <TenderWizardModal
          onClose={() => setShowManualForm(false)}
          isAr={isAr}
          lang={lang}
          onUpdateList={onUpdateList}
          setSelectedTenderId={setSelectedTenderId}
          setToastAlert={setToastAlert}
          settings={settings}
          list={list}
        />
      )}

      {/* 1. Page Header Section */}
      <TenderToolbar
        isAr={isAr}
        onImportClick={() => setShowImportWizard(true)}
        onManualClick={() => setShowManualForm(true)}
      />

      {/* KPI Overlays */}
      <TenderKPICards list={list} isAr={isAr} />

      {/* 2. Global Search and Filters Section */}
      <TenderFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        recordFilter={recordFilter}
        setRecordFilter={setRecordFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        coordinatorFilter={coordinatorFilter}
        setCoordinatorFilter={setCoordinatorFilter}
        engineerFilter={engineerFilter}
        setEngineerFilter={setEngineerFilter}
        tenderTypeFilter={tenderTypeFilter}
        setTenderTypeFilter={setTenderTypeFilter}
        clearFilters={clearFilters}
        isAr={isAr}
      />

      {/* Batch Operations Actions Toolbar Overlay */}
      <TenderActions
        selectedCount={selectedRowIds.length}
        onBulkArchive={handleBulkArchive}
        onBulkExport={handleBulkExport}
        isAr={isAr}
      />

      {/* 3. Main Data Canvas */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start relative select-none">
        {/* Table Column - Master view */}
        <div className="xl:col-span-8 space-y-4">
          <TenderTable
            filteredTenders={filteredTenders}
            selectedTenderId={selectedTenderId}
            selectedRowIds={selectedRowIds}
            setSelectedRowIds={setSelectedRowIds}
            isAr={isAr}
            lang={lang}
            onSelect={setSelectedTenderId}
            onShowAlert={msg => setToastAlert({ type: 'info', message: msg })}
          />
        </div>

        {/* 4. Inspection Panel - Detail Drawer view */}
        <div className="xl:col-span-4 transition-all duration-300">
          <TenderDetailsDrawer
            selectedTender={selectedTender}
            onClose={() => setSelectedTenderId(null)}
            isAr={isAr}
            lang={lang}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            newNoteText={newNoteText}
            setNewNoteText={setNewNoteText}
            onAddNote={handleAddNoteToTender}
            newDocName={newDocName}
            setNewDocName={setNewDocName}
            newDocSize={newDocSize}
            setNewDocSize={setNewDocSize}
            onAddDoc={handleAddDocToTender}
            onShowAlert={msg => setToastAlert({ type: 'info', message: msg })}
          />
        </div>
      </div>
    </div>
  );
}
