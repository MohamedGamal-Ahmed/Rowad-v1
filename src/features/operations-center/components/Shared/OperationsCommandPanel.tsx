import React, { useState } from 'react';
import { 
  X, CheckCircle2, Calendar, User, Folder, Paperclip, Plus, Send, Link, AlertTriangle
} from 'lucide-react';
import { CalendarEvent, EventStatus, EventPriority, EventModuleType } from '../../types';
import { BiText } from '../../../../components/BiText';

interface OperationsCommandPanelProps {
  lang: 'ar' | 'en';
  event: CalendarEvent;
  onClose: () => void;
  onComplete: (id: string) => void;
  onReschedule: (id: string, start: string, end: string) => void;
  onReassign: (id: string, ownerName: string) => void;
  onAddNote: (id: string, author: string, text: string) => void;
  onAttachFile: (id: string, name: string, size: string) => void;
  onNavigateToView: (viewId: string) => void;
}

export function OperationsCommandPanel({
  lang,
  event,
  onClose,
  onComplete,
  onReschedule,
  onReassign,
  onAddNote,
  onAttachFile,
  onNavigateToView
}: OperationsCommandPanelProps) {
  const isAr = lang === 'ar';
  const [commentText, setCommentText] = useState('');
  const [newStart, setNewStart] = useState(event.startDate);
  const [newEnd, setNewEnd] = useState(event.endDate);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showReassign, setShowReassign] = useState(false);
  const [reassignName, setReassignName] = useState(event.ownerName);
  const [dragActive, setDragActive] = useState(false);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddNote(event.id, isAr ? 'المستخدم الحالي' : 'Active Admin', commentText.trim());
    setCommentText('');
  };

  const handleApplyReschedule = () => {
    onReschedule(event.id, newStart, newEnd);
    setShowReschedule(false);
  };

  const handleApplyReassign = () => {
    onReassign(event.id, reassignName);
    setShowReassign(false);
  };

  // Mock file drop handler
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      onAttachFile(event.id, file.name, sizeStr);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      onAttachFile(event.id, file.name, sizeStr);
    }
  };

  // Get localized status badge colors
  const statusColors: { [key in EventStatus]: string } = {
    [EventStatus.PENDING]: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200',
    [EventStatus.IN_PROGRESS]: 'bg-blue-50 text-blue-800 dark:bg-blue-950/20 dark:text-blue-300 border-blue-200',
    [EventStatus.WAITING_FOR_ME]: 'bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300 border-amber-200',
    [EventStatus.WAITING_FOR_OTHERS]: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200',
    [EventStatus.COMPLETED]: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 border-emerald-200',
    [EventStatus.OVERDUE]: 'bg-rose-50 text-rose-800 dark:bg-rose-950/20 dark:text-rose-300 border-rose-200 animate-pulse'
  };

  const priorityColors: { [key in EventPriority]: string } = {
    [EventPriority.CRITICAL]: 'bg-brand-red/10 text-brand-red border-brand-red/20 font-black',
    [EventPriority.HIGH]: 'bg-orange-50 text-orange-800 border-orange-200',
    [EventPriority.MEDIUM]: 'bg-slate-50 text-slate-800 border-slate-200',
    [EventPriority.LOW]: 'bg-zinc-50 text-zinc-600 border-zinc-200'
  };

  return (
    <aside 
      className="w-full lg:w-[480px] bg-white dark:bg-slate-900 border-l rtl:border-r rtl:border-l-0 border-slate-150 dark:border-slate-800 flex flex-col h-full shadow-2xl overflow-y-auto no-scrollbar z-50 animate-in slide-in-from-right duration-300"
      id="operations-command-panel"
    >
      {/* Header Bezel */}
      <div className="p-6 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/20">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-8 bg-brand-red rounded-full"></div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-sans">
              {isAr ? 'لوحة التحكم والعمليات المباشرة' : 'OPERATIONS COMMAND PANEL'}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
              {event.projectCode}
            </p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Core Event Header Card */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${statusColors[event.status]}`}>
              {isAr ? {
                [EventStatus.PENDING]: 'قيد الانتظار',
                [EventStatus.IN_PROGRESS]: 'جاري العمل',
                [EventStatus.WAITING_FOR_ME]: 'بانتظاري',
                [EventStatus.WAITING_FOR_OTHERS]: 'بانتظار الآخرين',
                [EventStatus.COMPLETED]: 'مكتمل',
                [EventStatus.OVERDUE]: 'متأخر للغاية ⚠'
              }[event.status] : event.status.replace('_', ' ')}
            </span>
            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${priorityColors[event.priority]}`}>
              {isAr ? {
                [EventPriority.CRITICAL]: 'حرِج للغاية',
                [EventPriority.HIGH]: 'أولوية عالية',
                [EventPriority.MEDIUM]: 'أولوية متوسطة',
                [EventPriority.LOW]: 'أولوية منخفضة'
              }[event.priority] : event.priority}
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
            {isAr ? event.title.ar : event.title.en}
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
            {isAr ? event.description?.ar : event.description?.en}
          </p>
        </div>

        {/* Project Summary */}
        <div className="bg-slate-50/60 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-800 rounded-2xl p-4 space-y-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">
            {isAr ? 'ملخص وبيانات المشروع' : 'PROJECT SUMMARY'}
          </span>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-400 mb-0.5">{isAr ? 'رمز المشروع:' : 'Project Code:'}</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 font-mono">{event.projectCode}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-0.5">{isAr ? 'العميل مالك المشروع:' : 'Client Authority:'}</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {isAr ? event.projectName.ar : event.projectName.en}
              </p>
            </div>
          </div>
        </div>

        {/* Active Responsible Owner */}
        <div className="space-y-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">
            {isAr ? 'المسؤول المباشر والمكلفين' : 'RESPONSIBLE OWNER'}
          </span>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-950/10 border border-slate-150 dark:border-slate-800 rounded-2xl p-3">
            <div className="w-10 h-10 rounded-full bg-brand-navy text-white font-bold flex items-center justify-center shrink-0">
              {event.ownerName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{event.ownerName}</p>
              <p className="text-[10px] text-slate-400 font-mono">
                {isAr ? 'رئيس اللجنة الفنية وإعداد المظاريف' : 'Primary Assignment Owner'}
              </p>
            </div>
          </div>
        </div>

        {/* Date & Time Settings */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
              {isAr ? 'التوقيت وجدولة المواعيد' : 'DATE & SCHEDULE'}
            </span>
            <button 
              onClick={() => setShowReschedule(!showReschedule)}
              className="text-xs text-brand-red hover:underline font-bold cursor-pointer"
            >
              {isAr ? 'تعديل الجدولة' : 'Reschedule'}
            </button>
          </div>

          <div className="bg-white dark:bg-slate-950/10 border border-slate-150 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {event.startDate} {event.startTime && `| ${event.startTime} - ${event.endTime || ''}`}
                </p>
                <p className="text-[10px] text-slate-400">
                  {isAr ? 'الجدولة الزمنية الحالية للمرحلة' : 'Currently active timeline bounds'}
                </p>
              </div>
            </div>

            {/* In-Line Rescheduling Controls */}
            {showReschedule && (
              <div className="pt-3 border-t border-slate-150 dark:border-slate-800 space-y-3 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                      {isAr ? 'تاريخ البداية' : 'Start Date'}
                    </label>
                    <input 
                      type="date" 
                      value={newStart} 
                      onChange={(e) => setNewStart(e.target.value)}
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                      {isAr ? 'تاريخ النهاية' : 'End Date'}
                    </label>
                    <input 
                      type="date" 
                      value={newEnd} 
                      onChange={(e) => setNewEnd(e.target.value)}
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 text-xs">
                  <button 
                    onClick={() => setShowReschedule(false)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button 
                    onClick={handleApplyReschedule}
                    className="px-3 py-1.5 bg-brand-red text-white rounded-lg font-bold cursor-pointer"
                  >
                    {isAr ? 'حفظ وتحديث الجدولة' : 'Apply & Propagate'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dependency DAG Path */}
        {(event.predecessorIds.length > 0 || event.successorIds.length > 0) && (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">
              {isAr ? 'سلسلة الاعتمادية والمراحل المرتبطة' : 'DEPENDENCY SEQUENCE CHAIN'}
            </span>
            <div className="border border-slate-150 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/40 dark:bg-slate-950/5 space-y-3 text-xs">
              {event.predecessorIds.length > 0 && (
                <div>
                  <p className="text-slate-400 mb-1">{isAr ? 'المرحلة السابقة (يجب اكتمالها أولاً):' : 'Predecessor (Must complete first):'}</p>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl text-slate-700 dark:text-slate-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                    <span className="truncate">{isAr ? 'الاجتماع التحضيري أو مراجعة المخاطر' : 'Prerequisite Event Task'}</span>
                    {event.lagDays && <span className="ml-auto font-mono text-[10px] text-brand-red font-bold">+{event.lagDays}d Lag</span>}
                  </div>
                </div>
              )}
              {event.successorIds.length > 0 && (
                <div>
                  <p className="text-slate-400 mb-1">{isAr ? 'المرحلة اللاحقة (تتأثر تلقائياً بالترحيل):' : 'Successor (Auto-shifts if delayed):'}</p>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl text-slate-700 dark:text-slate-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="truncate">{isAr ? 'تقديم العطاء أو مراجعة التفاصيل المالية' : 'Successive Task Milestones'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Deep Links & Source Records */}
        <div className="space-y-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">
            {isAr ? 'روابط التتبع للمصدر الأصلي' : 'DEEP LINKS & SOURCE RECORDS'}
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateToView(event.deepLinkPath)}
              className="flex items-center gap-2 bg-brand-navy text-white text-xs px-4 py-2.5 rounded-xl font-bold hover:bg-brand-navy/90 transition-all cursor-pointer"
            >
              <Link className="w-4 h-4" />
              <span>{isAr ? event.deepLinkLabel.ar : event.deepLinkLabel.en}</span>
            </button>
          </div>
        </div>

        {/* Related Files & Drop Zone */}
        <div className="space-y-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">
            {isAr ? 'المرفقات والملفات الهندسية' : 'ATTACHMENTS & MATERIALS'}
          </span>
          
          <div className="space-y-2">
            {event.attachments.map((att) => (
              <div 
                key={att.id}
                className="flex items-center justify-between border border-slate-150 dark:border-slate-800 rounded-xl p-2.5 bg-white dark:bg-slate-950/20 text-xs text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Paperclip className="w-4 h-4 text-slate-400 shrink-0" />
                  <p className="font-bold truncate">{att.fileName}</p>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{att.fileSize}</span>
                </div>
                <a 
                  href="#" 
                  className="text-xs text-brand-red font-bold hover:underline shrink-0"
                  onClick={(e) => e.preventDefault()}
                >
                  {isAr ? 'تحميل' : 'Download'}
                </a>
              </div>
            ))}

            {/* Drag & Drop Target Zone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors relative
                ${dragActive 
                  ? 'border-brand-red bg-brand-red/5' 
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
                }
              `}
            >
              <input 
                type="file" 
                id="panel-file-upload" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <label htmlFor="panel-file-upload" className="cursor-pointer block text-xs">
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'اسحب الملف هنا أو تصفح المرفقات' : 'Drag file here or browse files'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {isAr ? 'BOQ، عروض أسعار، كشوف حسابات' : 'BOQ, tenders, specifications pdf/xlsx'}
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Notes Log & Comments Engine */}
        <div className="space-y-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">
            {isAr ? 'سجل التعليقات ومحاضر المتابعة' : 'COMMENTS & AUDIT TRAIL'}
          </span>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input 
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={isAr ? 'إضافة تعليق أو ملاحظة تشغيلية...' : 'Add a new operational remark...'}
              className="flex-1 text-xs border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
            <button 
              type="submit" 
              className="bg-brand-red hover:bg-brand-red/90 text-white p-2 rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-2 pt-2">
            {event.notes.map((note) => (
              <div key={note.id} className="bg-slate-50/60 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800 rounded-xl p-3 text-xs space-y-1">
                <div className="flex items-center justify-between font-mono text-[9px] text-slate-400">
                  <span className="font-bold">{note.authorName}</span>
                  <span>{note.timestamp}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-sans">{note.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer Drawer Action Toolbar */}
      <div className="sticky bottom-0 p-5 bg-white dark:bg-slate-900 border-t border-slate-150 dark:border-slate-800 flex gap-2">
        {event.status !== EventStatus.COMPLETED && (
          <button 
            onClick={() => onComplete(event.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-3 rounded-xl font-bold transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isAr ? 'اعتماد واكتمال المرحلة' : 'Complete Event & Resolve'}</span>
          </button>
        )}
      </div>
    </aside>
  );
}
