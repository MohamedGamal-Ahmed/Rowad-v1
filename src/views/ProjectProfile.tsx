import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Building2, MapPin, Calendar, DollarSign, FileText, Pickaxe, Award, Receipt, AlertTriangle, PenTool, Clock, Settings, Paperclip } from 'lucide-react';
import { BiText } from '../components/BiText';
import { Project } from '../data';

const TABS = [
  { id: 'info', icon: Building2, label: { en: 'Info', ar: 'المعلومات' } },
  { id: 'contract', icon: FileText, label: { en: 'Contract', ar: 'العقد' } },
  { id: 'subcontracts', icon: Pickaxe, label: { en: 'Subcontracts', ar: 'المقاولات الباطنة' } },
  { id: 'ipc', icon: Receipt, label: { en: 'IPC summary', ar: 'ملخص المستخلصات' } },
  { id: 'claims', icon: AlertTriangle, label: { en: 'Claims', ar: 'المطالبات' } },
  { id: 'vo', icon: PenTool, label: { en: 'Variation Orders', ar: 'الأوامر التغييرية' } },
  { id: 'eot', icon: Clock, label: { en: 'EOT tracking', ar: 'تمديد الزمن' } },
  { id: 'documents', icon: Paperclip, label: { en: 'Documents', ar: 'المستندات' } },
  { id: 'timeline', icon: Calendar, label: { en: 'Timeline', ar: 'الجدول الزمني' } },
];

export function ProjectProfile({ lang, project, onBack }: { lang: 'ar' | 'en', project: Project, onBack: () => void }) {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowRight : ArrowLeft;
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="px-6 py-6 max-w-[1800px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      
      {/* Header & Breadcrumbs */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[15px] text-gray-500 hover:text-brand-navy mb-6 transition-colors group px-4 py-2 border border-gray-100 rounded-xl bg-white shadow-sm"
      >
         <ArrowIcon className="w-4 h-4 transition-transform duration-150" />
         <BiText text={{en: "Back to Dashboard", ar: "العودة للوحة التحكم"}} primaryLang={lang} stacked={false} />
      </button>

      {/* Project Identity */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start justify-between relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-navy/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>

        <div className="flex gap-6 items-start z-10">
          <div className="w-20 h-20 bg-brand-navy text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
             <Building2 className="w-10 h-10" strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-brand-gray text-brand-navy text-[11px] font-bold rounded-full">
                {project.code}
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-bold rounded-full">
                <BiText text={{en: "ACTIVE", ar: "منفذ"}} primaryLang={lang} stacked={false} />
              </span>
            </div>
            <h1 className={`text-[32px] font-black text-brand-navy mb-2 tracking-tight leading-tight ${isAr ? 'font-arabic' : 'font-sans'}`}>
              {isAr ? project.name.ar : project.name.en}
            </h1>
            <h2 className={`text-xl text-gray-500 ${!isAr ? 'font-arabic' : 'font-sans'}`}>
              {!isAr ? project.name.ar : project.name.en}
            </h2>
          </div>
        </div>

        {/* Quick Stats side */}
        <div className="flex gap-8 bg-brand-gray/50 p-6 rounded-2xl border border-white z-10 w-full md:w-auto">
           <div>
              <BiText text={{en: "Total Value", ar: "القيمة الإجمالية"}} primaryLang={lang} primaryClassName="text-xs text-gray-500 uppercase tracking-wider mb-2" />
              <div className="text-2xl font-bold text-brand-navy">1.25B <span className="text-sm font-medium text-gray-400">EGP</span></div>
           </div>
           <div className="w-px bg-gray-200"></div>
           <div>
              <BiText text={{en: "Completion", ar: "نسبة الإنجاز"}} primaryLang={lang} primaryClassName="text-xs text-gray-500 uppercase tracking-wider mb-2" />
              <div className="text-2xl font-bold text-brand-red">42%</div>
           </div>
        </div>
      </div>

      {/* Notion-style Tabs Navigation */}
      <div className="mt-8 mb-6 overflow-x-auto no-scrollbar border-b border-gray-200 pb-[1px]">
        <div className="flex items-center gap-6 min-w-max px-2">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 px-1 border-b-2 transition-all font-medium text-sm
                ${activeTab === tab.id 
                  ? 'border-brand-navy text-brand-navy' 
                  : 'border-transparent text-gray-500 hover:text-gray-800'
                }
              `}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-brand-navy' : 'text-gray-400'}`} />
              <BiText text={tab.label} primaryLang={lang} stacked={false} />
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="bg-white rounded-[32px] min-h-[400px] shadow-sm border border-gray-50 p-8">
         {/* Placeholder for content - Info Tab */}
         {activeTab === 'info' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-300">
              <div className="space-y-8">
                 <div>
                    <BiText text={{en: "Client Details", ar: "بيانات العميل"}} primaryLang={lang} primaryClassName="text-lg font-bold text-brand-navy mb-4 border-b pb-2" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Client Name</p>
                        <p className="font-semibold text-brand-navy mt-1">ORA Developers</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Consultant</p>
                        <p className="font-semibold text-brand-navy mt-1">ECOGIM</p>
                      </div>
                    </div>
                 </div>
                 <div>
                    <BiText text={{en: "Location Details", ar: "بيانات الموقع"}} primaryLang={lang} primaryClassName="text-lg font-bold text-brand-navy mb-4 border-b pb-2" />
                    <div className="flex items-start gap-4">
                       <MapPin className="text-brand-red w-5 h-5 shrink-0 mt-1" />
                       <p className="text-gray-700 leading-relaxed font-medium">
                         Plot 34, Fifth Settlement, New Cairo, Cairo Governorate, Egypt
                       </p>
                    </div>
                 </div>
              </div>
              <div className="space-y-8">
                 <div>
                    <BiText text={{en: "Key Dates", ar: "التواريخ الهامة"}} primaryLang={lang} primaryClassName="text-lg font-bold text-brand-navy mb-4 border-b pb-2" />
                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-4 bg-brand-gray rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Calendar className="w-4 h-4 text-brand-navy" />
                            </div>
                            <BiText text={{en: "Commencement Date", ar: "تاريخ بدء التنفيذ"}} primaryLang={lang} primaryClassName="text-sm font-medium" />
                          </div>
                          <span className="font-bold text-brand-navy">12 Jan 2024</span>
                       </div>
                       <div className="flex items-center justify-between p-4 bg-brand-gray rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Calendar className="w-4 h-4 text-brand-red" />
                            </div>
                            <BiText text={{en: "Expected Completion", ar: "تاريخ الانتهاء المتوقع"}} primaryLang={lang} primaryClassName="text-sm font-medium" />
                          </div>
                          <span className="font-bold text-brand-navy">30 Dec 2026</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         )}
         
         {/* Other tabs placeholder */}
         {activeTab !== 'info' && (
           <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20 animate-in fade-in duration-300">
             <div className="w-20 h-20 bg-brand-gray rounded-full flex items-center justify-center mb-6">
               <Settings className="w-8 h-8 text-gray-300 animate-spin-slow" />
             </div>
             <BiText 
                text={{en: "Module under construction", ar: "الوحدة قيد الإنشاء"}} 
                primaryLang={lang} 
                primaryClassName="text-xl font-medium text-brand-navy mb-2" 
             />
             <p className="text-sm max-w-sm text-center">
               This is a Proof of Concept. The {activeTab} framework proves the unified layout architecture requested by your enterprise design guidelines.
             </p>
           </div>
         )}
      </div>
      
    </div>
  );
}
