import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './views/Dashboard';
import { ProjectProfile } from './views/ProjectProfile';
import { OngoingTenders, initialTenders, Tender } from './views/OngoingTenders';
import { ProjectExecution, ExecutionRecord, mockExecutionData } from './views/ProjectExecution';
import { DocumentControl, DocumentRecord, mockDocuments } from './views/DocumentControl';
import { SettingsView, TimelineRules } from './views/Settings';
import { mockProjects } from './data';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Unified pre-award portfolio state
  const [tendersList, setTendersList] = useState<Tender[]>(initialTenders);

  // Unified execution & document control states
  const [executionRecords, setExecutionRecords] = useState<ExecutionRecord[]>(mockExecutionData);
  const [documentRecords, setDocumentRecords] = useState<DocumentRecord[]>(mockDocuments);

  // Configurable administrative timeline rules
  const [timelineRules, setTimelineRules] = useState<TimelineRules>(() => {
    const saved = localStorage.getItem('preaward_timeline_rules');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      kickOffOffset: -30,
      riskAssessmentOffset: -21,
      contractQualificationOffset: -14,
      alignmentOffset: -10,
      intermediateFollowUpOffset: -5
    };
  });

  const handleUpdateRules = (newRules: TimelineRules) => {
    setTimelineRules(newRules);
    localStorage.setItem('preaward_timeline_rules', JSON.stringify(newRules));
  };

  useEffect(() => {
    // Set to logical properties mechanism layout handler
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'ar' : 'en');
  
  const handleNavigate = (viewId: string) => {
    setCurrentView(viewId);
    setSelectedProjectId(null); // Reset project view when clicking sidebar
  };

  const selectedProject = selectedProjectId ? mockProjects.find(p => p.id === selectedProjectId) : null;

  return (
    <div className="flex min-h-screen bg-brand-gray w-full font-sans text-brand-navy selection:bg-brand-red/20 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        currentView={selectedProjectId ? 'projects' : currentView} 
        onNavigate={handleNavigate} 
        lang={lang} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header lang={lang} onToggleLang={toggleLanguage} />
        
        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          {selectedProject ? (
            <ProjectProfile 
              lang={lang} 
              project={selectedProject} 
              onBack={() => setSelectedProjectId(null)} 
            />
          ) : currentView === 'dashboard' ? (
            <Dashboard 
              lang={lang} 
              list={tendersList}
              executionRecords={executionRecords}
              documentRecords={documentRecords}
            />
          ) : currentView === 'ongoing-tenders' ? (
            <OngoingTenders 
              lang={lang} 
              list={tendersList}
              onUpdateList={setTendersList}
              timelineRules={timelineRules}
            />
          ) : currentView === 'project-execution' ? (
            <ProjectExecution 
              lang={lang} 
              records={executionRecords}
              onUpdateRecords={setExecutionRecords}
            />
          ) : currentView === 'document-control' ? (
            <DocumentControl 
              lang={lang} 
              documents={documentRecords}
              onUpdateDocuments={setDocumentRecords}
            />
          ) : currentView === 'settings' ? (
            <SettingsView 
              lang={lang}
              rules={timelineRules}
              onUpdateRules={handleUpdateRules}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 p-8">
              <div className="text-center max-w-md bg-white p-12 rounded-[32px] shadow-sm border border-gray-100">
                <h2 className={`text-2xl font-bold text-brand-navy mb-4 ${lang === 'ar' ? 'font-arabic' : ''}`}>
                  {lang === 'en' ? 'Module Coming Soon' : 'الوحدة قيد التطوير'}
                </h2>
                <p className="text-sm">
                  {lang === 'en' 
                    ? 'This module is part of the future enterprise platform roadmap.' 
                    : 'هذه الوحدة جزء من خارطة طريق منصة المؤسسة المستقبلية.'}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
