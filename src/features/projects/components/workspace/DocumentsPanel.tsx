import React, { useState, useEffect } from 'react';
import { Plus, Folder, Eye, FileText } from 'lucide-react';
import { Project, ProjectDocument, WBSPackage } from '../../../../domain/projects/Project';
import { ProjectRepository } from '../../../../repositories/ProjectRepository';
import { MasterDataRepository } from '../../../../repositories/MasterDataRepository';
import { DocumentType } from '../../../../domain/master/MasterData';
import { ContextualAttachmentsList } from './ContextualAttachmentsList';

interface DocumentsPanelProps {
  project: Project;
  lang: 'ar' | 'en';
  documents: ProjectDocument[];
  wbsPackages: WBSPackage[];
  reloadAllProjectData: () => void;
  expandedRecordId: string | null;
  setExpandedRecordId: (id: string | null) => void;
  focusedRecordId: string | null;
  setFocusedRecordId: (id: string | null) => void;
}

export function DocumentsPanel({
  project,
  lang,
  documents,
  wbsPackages,
  reloadAllProjectData,
  expandedRecordId,
  setExpandedRecordId,
  focusedRecordId,
  setFocusedRecordId
}: DocumentsPanelProps) {
  const isAr = lang === 'ar';
  const projectRepo = new ProjectRepository();
  const masterRepo = new MasterDataRepository();

  const [masterDocTypes, setMasterDocTypes] = useState<DocumentType[]>([]);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [docCode, setDocCode] = useState('');
  const [docTitleEn, setDocTitleEn] = useState('');
  const [docTitleAr, setDocTitleAr] = useState('');
  const [docCat, setDocCat] = useState<'Incoming' | 'Outgoing' | 'Drawing' | 'Transmittal'>('Drawing');
  const [docTypeId, setDocTypeId] = useState('');
  const [docSender, setDocSender] = useState('');
  const [docRecip, setDocRecip] = useState('');
  const [docDate, setDocDate] = useState('');
  const [docStatus, setDocStatus] = useState('');
  const [docPriority, setDocPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [docVer, setDocVer] = useState('Rev 1.0');
  const [selectedWbsId, setSelectedWbsId] = useState('');

  useEffect(() => {
    async function loadMasterData() {
      const docTypes = await masterRepo.getDocTypes();
      setMasterDocTypes(docTypes);
    }
    loadMasterData();
  }, []);

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !docCode || !docTitleEn) return;

    const newDoc: ProjectDocument = {
      id: `pdoc-${Date.now()}`,
      projectId: project.id,
      wbsId: selectedWbsId || undefined,
      code: docCode,
      titleEn: docTitleEn,
      titleAr: docTitleAr || undefined,
      category: docCat,
      docTypeId,
      sender: docSender,
      recipient: docRecip,
      dateReceived: docDate || new Date().toISOString().substring(0, 10),
      status: docStatus || 'Approved',
      priority: docPriority,
      version: docVer,
      relatedMeetingIds: [],
      relatedVOIds: [],
      relatedClaimIds: []
    };

    await projectRepo.saveDocument(newDoc);
    await projectRepo.addHistory(
      project.id, 
      'Document Registered', 
      'System', 
      `Registered document: ${docCode}`,
      'Document',
      newDoc.id,
      docCode
    );
    setShowForm(false);
    setDocCode('');
    setDocTitleEn('');
    setDocTitleAr('');
    setDocCat('Drawing');
    setDocTypeId('');
    setDocSender('');
    setDocRecip('');
    setDocDate('');
    setDocStatus('');
    setDocPriority('Medium');
    setDocVer('Rev 1.0');
    setSelectedWbsId('');
    reloadAllProjectData();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300" id="documents-panel-container">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest font-mono">
          {isAr ? 'سجل مراقبة وثائق ومستندات المشروع (Doc Control)' : 'Project Technical & Commercial Document Register'}
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-red text-white hover:bg-brand-red-dark rounded-lg text-[10px] font-bold transition-all cursor-pointer"
            id="register-doc-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'تسجيل مستند جديد' : 'New Document'}</span>
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleCreateDocument} className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs" id="document-form">
          <div className="md:col-span-3 font-bold border-b pb-1 text-slate-600 dark:text-slate-300">
            {isAr ? 'استمارة تدوين مخطط هندسي أو مراسلة رسمية صادر/وارد' : 'Specialized Document Control Entry Form'}
          </div>
          
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'كود الترميز الفني (مطلوب)' : 'Document Code'}</label>
            <input required type="text" value={docCode} onChange={e => setDocCode(e.target.value)} placeholder="e.g. ROWAD-NEOM-CIV-DRW-045" className="w-full p-2 border rounded-lg bg-white text-slate-800" />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'تصنيف المراسلة' : 'Category'}</label>
            <select value={docCat} onChange={e => setDocCat(e.target.value as any)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
              <option value="Drawing">Drawing (مخطط هندسي)</option>
              <option value="Transmittal">Transmittal (محضر إرسال)</option>
              <option value="Incoming">Incoming (بريد خطاب وارد)</option>
              <option value="Outgoing">Outgoing (بريد خطاب صادر)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'نوع الوثيقة الرئيسي' : 'Document Type'}</label>
            <select value={docTypeId} onChange={e => setDocTypeId(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
              <option value="">-- Choose Type --</option>
              {masterDocTypes.map(dt => (
                <option key={dt.id} value={dt.id}>{isAr && dt.nameAr ? dt.nameAr : dt.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'العنوان بالإنجليزية (مطلوب)' : 'Document Title (EN)'}</label>
            <input required type="text" value={docTitleEn} onChange={e => setDocTitleEn(e.target.value)} placeholder="e.g. Soil reports under main tank area" className="w-full p-2 border rounded-lg bg-white text-slate-800" />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'العنوان بالعربية (اختياري)' : 'Document Title (AR)'}</label>
            <input type="text" value={docTitleAr} onChange={e => setDocTitleAr(e.target.value)} placeholder="مثال: تقارير اختبارات التربة" className="w-full p-2 border rounded-lg bg-white text-slate-800" />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'الجهة المرسلة' : 'Sender'}</label>
            <input required type="text" value={docSender} onChange={e => setDocSender(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'الجهة المستلمة' : 'Recipient'}</label>
            <input required type="text" value={docRecip} onChange={e => setDocRecip(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'تاريخ التلقي/الإرسال' : 'Date Received'}</label>
            <input type="date" value={docDate} onChange={e => setDocDate(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'حالة الاعتماد' : 'Status'}</label>
            <input type="text" value={docStatus} onChange={e => setDocStatus(e.target.value)} placeholder="Approved, Under Audit" className="w-full p-2 border rounded-lg bg-white text-slate-800" />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'مستوى الأهمية' : 'Priority'}</label>
            <select value={docPriority} onChange={e => setDocPriority(e.target.value as any)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
              <option value="High">High Priority</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'حزمة العمل (WBS)' : 'WBS Work Package'}</label>
            <select value={selectedWbsId} onChange={e => setSelectedWbsId(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800">
              <option value="">{isAr ? '-- اختر حزمة العمل --' : '-- Select WBS Package --'}</option>
              {wbsPackages.map(w => (
                <option key={w.id} value={w.id}>{w.code} - {isAr && w.nameAr ? w.nameAr : w.nameEn}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? 'رقم الإصدار' : 'Revision Version'}</label>
            <input type="text" value={docVer} onChange={e => setDocVer(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-slate-800" />
          </div>

          <div className="md:col-span-3 flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold">Cancel</button>
            <button type="submit" className="px-4 py-1.5 bg-brand-red text-white hover:bg-brand-red-dark rounded-lg font-bold">Register Document</button>
          </div>
        </form>
      ) : null}

      {documents.length > 0 ? (
        <div className="space-y-3.5" id="documents-list">
          {documents.map(doc => {
            const isExpanded = expandedRecordId === doc.id;
            const isFocused = focusedRecordId === doc.id;
            const linkedWbs = wbsPackages.find(w => w.id === doc.wbsId);

            return (
              <div 
                key={doc.id} 
                className={`bg-slate-50 dark:bg-slate-950/20 border p-4.5 rounded-2xl flex flex-col gap-4 hover:shadow-sm transition-all text-xs
                  ${isFocused ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-500/5' : 'border-slate-100 dark:border-slate-850'}
                `}
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[9px] text-slate-500 bg-white dark:bg-slate-900 border px-2 py-0.5 rounded font-bold">{doc.code}</span>
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[9px] font-bold text-slate-500 font-mono">{doc.category}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        doc.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {doc.priority}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-850 dark:text-slate-100">
                      {isAr && doc.titleAr ? doc.titleAr : doc.titleEn}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      From: <span className="font-bold text-slate-500">{doc.sender}</span> | To: <span className="font-bold text-slate-500">{doc.recipient}</span>
                    </p>

                    {linkedWbs && (
                      <div className="flex items-center gap-1.5 text-[10px] bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400 font-mono max-w-max mt-1">
                        <Folder className="w-3.5 h-3.5 text-brand-red" />
                        <span className="font-bold">{linkedWbs.code}</span>
                        <span>-</span>
                        <span className="truncate max-w-[150px]">{isAr && linkedWbs.nameAr ? linkedWbs.nameAr : linkedWbs.nameEn}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono text-[10px] text-slate-400 font-bold self-end md:self-center">
                    <div>
                      <span className="text-[9px] font-sans text-slate-400 block">{isAr ? 'الإصدار' : 'Version'}</span>
                      <p className="text-slate-800 dark:text-slate-200 mt-0.5">{doc.version}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-sans text-slate-400 block">{isAr ? 'تاريخ التلقي' : 'Date'}</span>
                      <p className="text-slate-800 dark:text-slate-200 mt-0.5">{doc.dateReceived}</p>
                    </div>
                    <button
                      onClick={() => {
                        setExpandedRecordId(isExpanded ? null : doc.id);
                        if (isFocused) setFocusedRecordId(null);
                      }}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500"
                      title="Toggle details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="pt-4 border-t border-slate-150 dark:border-slate-850 space-y-3">
                    <h5 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      {isAr ? 'مرفقات الوثيقة المرتبطة' : 'Contextual Attachments'}
                    </h5>
                    <ContextualAttachmentsList
                      projectId={project.id}
                      entityType="Document"
                      entityId={doc.id}
                      lang={lang}
                      onRefresh={reloadAllProjectData}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-slate-400 py-10 text-xs">
          {isAr ? 'لا توجد مستندات مسجلة لهذا المشروع.' : 'No documents registered yet.'}
        </div>
      )}
    </div>
  );
}
