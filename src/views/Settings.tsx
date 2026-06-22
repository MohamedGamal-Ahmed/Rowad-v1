import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Clock, Shield, Sliders, Save, RefreshCw, Check 
} from 'lucide-react';
import { BiText } from '../components/BiText';

export interface TimelineRules {
  kickOffOffset: number;
  riskAssessmentOffset: number;
  contractQualificationOffset: number;
  alignmentOffset: number;
  intermediateFollowUpOffset: number;
}

interface SettingsViewProps {
  lang: 'ar' | 'en';
  rules: TimelineRules;
  onUpdateRules: (rules: TimelineRules) => void;
}

export function SettingsView({ lang, rules, onUpdateRules }: SettingsViewProps) {
  const isAr = lang === 'ar';
  
  // Local forms state initialized with current active rules
  const [localRules, setLocalRules] = useState<TimelineRules>({ ...rules });
  const [activeTab, setActiveTab] = useState<'pre-award' | 'security'>('pre-award');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRules(localRules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const resetToDefaults = () => {
    const defaults: TimelineRules = {
      kickOffOffset: -30,
      riskAssessmentOffset: -21,
      contractQualificationOffset: -14,
      alignmentOffset: -10,
      intermediateFollowUpOffset: -5
    };
    setLocalRules(defaults);
  };

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-navy/5 text-brand-navy rounded-2xl">
            <SettingsIcon className="w-6 h-6 text-brand-red animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-brand-navy tracking-tight">
              {isAr ? "إعدادات النظام والصلاحيات" : "System Settings & Administration"}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {isAr ? "إدارة القواعد الذكية للمخططات الزمنية وبند مصفوفة المدد للمناقصات الجارية (Pre-Award)." : "Configure smart timeline milestones, tender thresholds, and administration rules."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] font-bold text-gray-400 uppercase font-mono">
            {isAr ? "وضع المشرف" : "ADMIN MODE ACTIVE"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Settings Navigation Menu */}
        <div className="md:col-span-1 space-y-1">
          <button
            onClick={() => setActiveTab('pre-award')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer
              ${activeTab === 'pre-award' 
                ? 'bg-brand-navy text-white shadow-md' 
                : 'bg-white border border-gray-50 text-gray-500 hover:bg-gray-50'
              }`}
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>{isAr ? "قواعد العطاءات" : "Pre-Award Settings"}</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer
              ${activeTab === 'security' 
                ? 'bg-brand-navy text-white shadow-md' 
                : 'bg-white border border-gray-50 text-gray-500 hover:bg-gray-50'
              }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>{isAr ? "الأمان والتراخيص" : "Security & Access"}</span>
          </button>
        </div>

        {/* Configurations Form Container */}
        <div className="md:col-span-3">
          {activeTab === 'pre-award' ? (
            <form onSubmit={handleSave} className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 space-y-6">
              
              <div className="border-b border-gray-50 pb-4">
                <span className="text-[10px] text-brand-red font-black uppercase tracking-wider block">
                  {isAr ? "إعدادات المناقصات الجارية" : "PRE-AWARD SETTINGS"}
                </span>
                <h3 className="text-lg font-black text-brand-navy mt-1">
                  {isAr ? "قواعد المدد والمخططات الزمنية" : "Timeline Rules & Target Offsets"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {isAr ? "حدد الفوراق الزمنية بالأيام (بالسالب) بالنسبة لتاريخ تقديم العرض الفني لتوليد المواعيد المقترحة تلقائياً." : "Define days offset (negative value) relative to the Technical Submission Date to automatically calculate suggestions."}
                </p>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 flex items-center gap-2 text-xs font-bold animate-in fade-in duration-200">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "تم حفظ القواعد الزمنية بنجاح وتعميمها على المخططات الذكية!" : "Business rules updated successfully and deployed to all dynamic wizards!"}</span>
                </div>
              )}

              <div className="space-y-4 text-xs font-sans">
                
                {/* Rule: Internal Kick-off */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="font-extrabold text-brand-navy">
                      {isAr ? "الاجتماع التحضيري الداخلي (Kick-off)" : "Internal Kick-off Meeting Offset"}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                      {isAr ? "اقتراح موعد الاجتماع لبدء صياغة دراسة العقود." : "Suggestions of start of detailed contracts analysis."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input 
                      type="number"
                      required
                      value={localRules.kickOffOffset}
                      onChange={(e) => setLocalRules(prev => ({ ...prev, kickOffOffset: parseInt(e.target.value) || 0 }))}
                      className="w-20 bg-white border border-gray-200 rounded-lg p-2 font-bold font-mono text-center text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    />
                    <span className="font-bold text-gray-400">{isAr ? "أيام" : "days"}</span>
                  </div>
                </div>

                {/* Rule: Risk Assessment */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="font-extrabold text-brand-navy">
                      {isAr ? "تقييم مخاطر المشروع وجاهزية كلفة العطاء" : "Risk Assessment Due Offset"}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                      {isAr ? "الموعد النهائي لمطابقة عوامل الخطورة وتأكيد بند الأثر المالي." : "Cut-off milestone to verify project risks and commercial margins."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input 
                      type="number"
                      required
                      value={localRules.riskAssessmentOffset}
                      onChange={(e) => setLocalRules(prev => ({ ...prev, riskAssessmentOffset: parseInt(e.target.value) || 0 }))}
                      className="w-20 bg-white border border-gray-200 rounded-lg p-2 font-bold font-mono text-center text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    />
                    <span className="font-bold text-gray-400">{isAr ? "أيام" : "days"}</span>
                  </div>
                </div>

                {/* Rule: Contract Qualifications */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="font-extrabold text-brand-navy">
                      {isAr ? "شروط ومؤهلات العقد القانونية" : "Contract Qualifications Due Offset"}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                      {isAr ? "تقديم المسوغات والتحفظات القانونية على كراسة الشروط." : "Determining necessary variations and legal contract deviations."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input 
                      type="number"
                      required
                      value={localRules.contractQualificationOffset}
                      onChange={(e) => setLocalRules(prev => ({ ...prev, contractQualificationOffset: parseInt(e.target.value) || 0 }))}
                      className="w-20 bg-white border border-gray-200 rounded-lg p-2 font-bold font-mono text-center text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    />
                    <span className="font-bold text-gray-400">{isAr ? "أيام" : "days"}</span>
                  </div>
                </div>

                {/* Rule: 1st Alignment */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="font-extrabold text-brand-navy">
                      {isAr ? "اجتماع المطابقة والتنسيق الأول" : "1st Alignment Meeting Offset"}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                      {isAr ? "اجتماع توحيد الرؤى وتوزيع أدوار كلفة الأقسام الفنية." : "Consolidated presentation layout and pricing roles distribution."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input 
                      type="number"
                      required
                      value={localRules.alignmentOffset}
                      onChange={(e) => setLocalRules(prev => ({ ...prev, alignmentOffset: parseInt(e.target.value) || 0 }))}
                      className="w-20 bg-white border border-gray-200 rounded-lg p-2 font-bold font-mono text-center text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    />
                    <span className="font-bold text-gray-400">{isAr ? "أيام" : "days"}</span>
                  </div>
                </div>

                {/* Rule: Intermediate Follow-up */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="font-extrabold text-brand-navy">
                      {isAr ? "المراجعة البينية والمتابعة الفنية" : "Intermediate Follow-up Meeting Offset"}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                      {isAr ? "متابعة تجميع العرض الفني والمالي ومطابقة التسعير." : "Check on compilation progress of physical dossier."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input 
                      type="number"
                      required
                      value={localRules.intermediateFollowUpOffset}
                      onChange={(e) => setLocalRules(prev => ({ ...prev, intermediateFollowUpOffset: parseInt(e.target.value) || 0 }))}
                      className="w-20 bg-white border border-gray-200 rounded-lg p-2 font-bold font-mono text-center text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    />
                    <span className="font-bold text-gray-400">{isAr ? "أيام" : "days"}</span>
                  </div>
                </div>

              </div>

              {/* Actions Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={resetToDefaults}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  {isAr ? "إعادة تعيين الافتراضات" : "Reset to Defaults"}
                </button>
                <div className="flex items-center gap-2.5">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-navy hover:bg-brand-navy/95 text-white font-extrabold rounded-xl shadow-md cursor-pointer transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isAr ? "حفظ القواعد الأمنية" : "Save Active Rules"}</span>
                  </button>
                </div>
              </div>

            </form>
          ) : (
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-12 text-center space-y-4">
              <Shield className="w-12 h-12 text-brand-red mx-auto animate-pulse" />
              <h3 className="text-lg font-black text-brand-navy">
                {isAr ? "أمان الصلاحيات وحماية السجلات" : "Security & Role Based Isolation"}
              </h3>
              <p className="text-gray-400 text-xs max-w-md mx-auto">
                {isAr ? "هذا القسم مقيد لمسؤولي تكنولوجيا المعلومات بالمنصة. يمكنك التعديل والتحكم الكامل في قواعد المدد الزمنية للمناقصات تحت قسم (قواعد العطاءات) في القائمة الجانبية." : "This subsystem coordinates standard directory permissions. Timeline calculations are fully active and configurable in the Pre-Award settings tab."}
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
