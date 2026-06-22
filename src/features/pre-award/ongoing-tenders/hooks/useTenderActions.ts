import { useState, useEffect } from 'react';
import { Tender, TimelineRules, WizardFormState } from '../types';
import { TimelineCalculator } from '../../../business-rules/TimelineCalculator';
import { FinancialsCalculator } from '../../../business-rules/FinancialsCalculator';

export function useTenderActions({
  lang,
  onUpdateList,
  timelineRules,
  setSelectedTenderId,
  selectedRowIds,
  setSelectedRowIds,
}: {
  lang: 'ar' | 'en';
  onUpdateList: React.Dispatch<React.SetStateAction<Tender[]>>;
  timelineRules?: TimelineRules;
  setSelectedTenderId: (id: string | null) => void;
  selectedRowIds: string[];
  setSelectedRowIds: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const isAr = lang === 'ar';

  // Modal control states
  const [showImportWizard, setShowImportWizard] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [analyzingFile, setAnalyzingFile] = useState(false);
  const [importStep, setImportStep] = useState<1 | 2>(1);

  // Notes and docs states inside inspect drawer
  const [newNoteText, setNewNoteText] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [newDocSize, setNewDocSize] = useState('1.8 MB');
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'timeline' | 'activities' | 'financial' | 'docs' | 'notes' | 'history'>('overview');

  // Toast alert states
  const [toastAlert, setToastAlert] = useState<{ type: 'success' | 'info' | 'warn'; message: string } | null>(null);

  useEffect(() => {
    if (toastAlert) {
      const timer = setTimeout(() => setToastAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastAlert]);

  const rules = timelineRules || {
    kickOffOffset: -30,
    riskAssessmentOffset: -21,
    contractQualificationOffset: -14,
    alignmentOffset: -10,
    intermediateFollowUpOffset: -5,
  };

  const getInitialWizardState = (): WizardFormState => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return {
      projectCode: `PC-2026-R${randomSuffix}`,
      tenderNumber: `TN-${randomSuffix}`,
      projectNameAr: '',
      projectNameEn: '',
      locationEn: 'Riyadh - Saudi Arabia',
      locationAr: 'الرياض - المملكة العربية السعودية',
      tenderTypeEn: 'EPC Contract',
      tenderTypeAr: 'عقد هندسة وتشييد',
      currency: 'SAR',
      estValue: 'SAR 150,050,000',
      estCost: 'SAR 141,300,000',
      clientEn: 'Riyadh Development Authority (RDA)',
      clientAr: 'الهيئة الملكية لمدينة الرياض',
      consultantEn: 'KEO International Consultants',
      consultantAr: 'كيو الدولية للاستشارات الهندسية',
      branchEn: 'Riyadh Division',
      branchAr: 'فرع مدينة الرياض والمناطق الوسطى',
      businessUnitEn: 'Heavy Civil',
      businessUnitAr: 'المشروعات المدنية الكبرى والمياه',
      coordinatorEn: 'Eng. Khalid Al-Saeed',
      coordinatorAr: 'المهندس خالد السعيد',
      contractsEngineerEn: 'Ahmed Mostafa',
      contractsEngineerAr: 'أحمد مصطفى',
      tenderStudyEngineerEn: 'Eng. Salem Al-Awadi',
      tenderStudyEngineerAr: 'المهندس سالم العوضي',
      departmentEn: 'Pre-Award Civil Core',
      departmentAr: 'قسم دراسة العطاءات والمشروعات المدنية',
      priority: 'Medium',
      techDate: '',
      commDate: '',
      officialDate: '',
      closingDate: '',
      kickOffDate: '',
      alignmentDate: '',
      followUpDate: '',
      riskDueDate: '',
      contractQualsDueDate: '',
      checklistReceived: true,
      checklistDrawings: false,
      checklistBOQ: false,
      checklistSpecs: false,
      siteVisitRequired: false,
      siteVisitDate: '',
      overriddenFields: {},
    };
  };

  const [wizardForm, setWizardForm] = useState<WizardFormState>(getInitialWizardState());
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Auto Restore Draft
  useEffect(() => {
    if (showManualForm) {
      const saved = localStorage.getItem('preaward_wizard_draft');
      if (saved) {
        try {
          setWizardForm(JSON.parse(saved));
        } catch (e) {
          // ignore parsing error
        }
      }
      setWizardStep(1);
    }
  }, [showManualForm]);

  // Auto Save Draft
  useEffect(() => {
    if (showManualForm) {
      localStorage.setItem('preaward_wizard_draft', JSON.stringify(wizardForm));
    }
  }, [wizardForm, showManualForm]);

  const clearWizardDraft = () => {
    localStorage.removeItem('preaward_wizard_draft');
    setWizardForm(getInitialWizardState());
    setWizardStep(1);
  };

  const handleTechDateChange = (newTechDate: string) => {
    if (!newTechDate) {
      setWizardForm(prev => ({ ...prev, techDate: '' }));
      return;
    }

    const calculated: Partial<WizardFormState> = {
      techDate: newTechDate,
    };

    const milestones = TimelineCalculator.calculateMilestones(newTechDate, rules);

    if (!wizardForm.overriddenFields.kickOffDate) {
      calculated.kickOffDate = milestones.kickOffDate;
    }
    if (!wizardForm.overriddenFields.riskDueDate) {
      calculated.riskDueDate = milestones.riskDueDate;
    }
    if (!wizardForm.overriddenFields.contractQualsDueDate) {
      calculated.contractQualsDueDate = milestones.contractQualsDueDate;
    }
    if (!wizardForm.overriddenFields.alignmentDate) {
      calculated.alignmentDate = milestones.alignmentDate;
    }
    if (!wizardForm.overriddenFields.followUpDate) {
      calculated.followUpDate = milestones.followUpDate;
    }
    if (!wizardForm.overriddenFields.commDate) {
      calculated.commDate = TimelineCalculator.calculateMilestones(newTechDate, {
        kickOffOffset: 12,
        riskAssessmentOffset: 12,
        contractQualificationOffset: 12,
        alignmentOffset: 12,
        intermediateFollowUpOffset: 12,
      }).kickOffDate;
    }

    setWizardForm(prev => ({
      ...prev,
      ...calculated,
    }));
  };

  const updateKickOffDate = (val: string) => {
    setWizardForm(prev => ({
      ...prev,
      kickOffDate: val,
      overriddenFields: { ...prev.overriddenFields, kickOffDate: true },
    }));
  };

  const updateRiskDueDate = (val: string) => {
    setWizardForm(prev => ({
      ...prev,
      riskDueDate: val,
      overriddenFields: { ...prev.overriddenFields, riskDueDate: true },
    }));
  };

  const updateContractQualsDueDate = (val: string) => {
    setWizardForm(prev => ({
      ...prev,
      contractQualsDueDate: val,
      overriddenFields: { ...prev.overriddenFields, contractQualsDueDate: true },
    }));
  };

  const updateAlignmentDate = (val: string) => {
    setWizardForm(prev => ({
      ...prev,
      alignmentDate: val,
      overriddenFields: { ...prev.overriddenFields, alignmentDate: true },
    }));
  };

  const updateFollowUpDate = (val: string) => {
    setWizardForm(prev => ({
      ...prev,
      followUpDate: val,
      overriddenFields: { ...prev.overriddenFields, followUpDate: true },
    }));
  };

  const updateCommDate = (val: string) => {
    setWizardForm(prev => ({
      ...prev,
      commDate: val,
      overriddenFields: { ...prev.overriddenFields, commDate: true },
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      triggerAnalysis();
    }
  };

  const triggerAnalysis = () => {
    setAnalyzingFile(true);
    setTimeout(() => {
      setAnalyzingFile(false);
      setImportStep(2);
    }, 1200);
  };

  const executeImportMerge = (list: Tender[]) => {
    const importedItems: Tender[] = [
      {
        id: `t-import-1`,
        projectCode: 'PC-2026-RCL',
        tenderNumber: 'TN-77121',
        projectName: {
          en: 'Riyadh Central Logistics Ring & Tunnels',
          ar: 'الطريق الدائري والأنفاق اللوجستية المركزية لمدينة الرياض',
        },
        location: { en: 'Riyadh - Saudi Arabia', ar: 'الرياض - المملكة العربية السعودية' },
        coordinator: { en: 'Eng. Khalid Al-Saeed', ar: 'المهندس خالد السعيد' },
        contractsEngineer: { en: 'Ahmed Mostafa', ar: 'أحمد مصطفى' },
        techSubmissionDate: '2026-08-10',
        commSubmissionDate: '2026-08-25',
        overallSubmissionDate: '2026-09-05',
        projectStatus: { en: 'Preparing Proposal', ar: 'جاري إعداد العرض العلمي والمالي' },
        awardStatus: { en: 'Pending Selection', ar: 'في انتظار تحديد المقاول' },
        recordStatus: 'Active',
        daysRemaining: 45,
        health: 'Healthy',
        estimatedValue: 'SAR 520,000,000',
        bondAmount: 'SAR 10,400,000',
        currency: 'SAR',
        tenderType: { en: 'EPC Contract', ar: 'عقد هندسة وتشييد' },
        clientName: { en: 'Ministry of Transport Services', ar: 'وزارة النقل والخدمات اللوجستية' },
        notes: [
          {
            id: 'in1',
            author: 'System Sync',
            date: '2026-06-21',
            text: 'Imported from Tender Department official release file v4.',
          },
        ],
        documents: [],
      },
      {
        id: `t-import-2`,
        projectCode: 'PC-2026-JED',
        tenderNumber: 'TN-30291',
        projectName: {
          en: 'Jeddah Coastal Desalination Intake Pipeline',
          ar: 'مأخذ خط الأنابيب البحري لمحطة تحلية جدة',
        },
        location: { en: 'Jeddah - Saudi Arabia', ar: 'جدة - المملكة العربية السعودية' },
        coordinator: { en: 'Eng. Yasmin Omar', ar: 'مهندسة ياسمين عمر' },
        contractsEngineer: { en: 'Salim Mansoor', ar: 'سليم منصور' },
        techSubmissionDate: '2026-07-02',
        commSubmissionDate: '2026-07-15',
        overallSubmissionDate: '2026-07-28',
        projectStatus: { en: 'Preparing Proposal', ar: 'جاري إعداد العرض العلمي والمالي' },
        awardStatus: { en: 'Pending Selection', ar: 'في انتظار تحديد المقاول' },
        recordStatus: 'Active',
        daysRemaining: 11,
        health: 'Due Soon',
        estimatedValue: 'SAR 280,000,000',
        bondAmount: 'SAR 5,600,000',
        currency: 'SAR',
        tenderType: { en: 'Design & Build', ar: 'تصميم وتشييد' },
        clientName: {
          en: 'Saline Water Conversion Corporation (SWCC)',
          ar: 'المؤسسة العامة لتحلية المياه المالحة',
        },
        notes: [],
        documents: [],
      },
    ];

    onUpdateList(prev => [...importedItems, ...prev]);
    setShowImportWizard(false);
    setImportStep(1);
    setSelectedTenderId(importedItems[0].id);
    setToastAlert({
      type: 'success',
      message: isAr
        ? 'تم دمج و استيراد السجلات وتحديث حالة المشاريع بنجاح!'
        : 'Pre-Award synchronization successfully completed! 2 new tenders added.',
    });
  };

  const submitWizardTender = (list: Tender[]) => {
    if (!wizardForm.projectNameEn || !wizardForm.projectCode) {
      setToastAlert({
        type: 'warn',
        message: isAr
          ? 'يرجى ملء الاسم الإنجليزي للمشروع والرمز التلقائي.'
          : 'Please enter Project English Name and automatic Project Code.',
      });
      return;
    }

    if (!wizardForm.techDate || !wizardForm.commDate) {
      setToastAlert({
        type: 'warn',
        message: isAr
          ? 'تواريخ تقديم العطاء الفني والمالي إلزامية!'
          : 'Technical and Commercial submission dates are mandatory!',
      });
      return;
    }

    const isDuplicate = list.some(
      item => item.tenderNumber.trim().toLowerCase() === wizardForm.tenderNumber.trim().toLowerCase()
    );
    if (isDuplicate) {
      setToastAlert({
        type: 'warn',
        message: isAr
          ? 'رقم المزايدة هذا مسجل بالفعل وموجود بالنظام.'
          : 'This Tender Number is already registered in the system.',
      });
      return;
    }

    const checklistNotes = [];
    if (wizardForm.checklistReceived) checklistNotes.push('Tender Documents Received');
    if (wizardForm.checklistDrawings) checklistNotes.push('Drawings Received');
    if (wizardForm.checklistBOQ) checklistNotes.push('BOQ Received');
    if (wizardForm.checklistSpecs) checklistNotes.push('Specifications Received');

    const extraNoteText = `Complete Pre-Award Setup Details:
• Tender Study Engineer: ${wizardForm.tenderStudyEngineerEn} (${wizardForm.tenderStudyEngineerAr})
• Department: ${wizardForm.departmentEn} • Priority: ${wizardForm.priority}
• Consultant: ${wizardForm.consultantEn}
• Branch Name: ${wizardForm.branchEn}
• Business Unit: ${wizardForm.businessUnitEn}
• Milestones:
  - Internal Kick-off: ${wizardForm.kickOffDate || 'N/A'} (Suggested: ${
      !wizardForm.overriddenFields.kickOffDate ? 'Yes' : 'Overridden'
    })
  - Risk Assessment Due: ${wizardForm.riskDueDate || 'N/A'} (Suggested: ${
      !wizardForm.overriddenFields.riskDueDate ? 'Yes' : 'Overridden'
    })
  - Qualifications Due: ${wizardForm.contractQualsDueDate || 'N/A'} (Suggested: ${
      !wizardForm.overriddenFields.contractQualsDueDate ? 'Yes' : 'Overridden'
    })
  - 1st Alignment Meeting: ${wizardForm.alignmentDate || 'N/A'} (Suggested: ${
      !wizardForm.overriddenFields.alignmentDate ? 'Yes' : 'Overridden'
    })
  - Intermediate Follow-up: ${wizardForm.followUpDate || 'N/A'} (Suggested: ${
      !wizardForm.overriddenFields.followUpDate ? 'Yes' : 'Overridden'
    })
  - Official Submission Date: ${wizardForm.officialDate || 'N/A'}
  - Closing Date: ${wizardForm.closingDate || 'N/A'}
• Checklist Completed: ${checklistNotes.join(', ') || 'None'}
• Site Visit: ${wizardForm.siteVisitRequired ? `Required on ${wizardForm.siteVisitDate}` : 'Not Required'}`;

    const parsedValue = FinancialsCalculator.parseToNumber(wizardForm.estValue);
    const parsedCost = FinancialsCalculator.parseToNumber(wizardForm.estCost);
    const calculatedBond = parsedValue * 0.02;

    const createdTender: Tender = {
      id: `t-wizard-${Date.now()}`,
      projectCode: wizardForm.projectCode,
      tenderNumber: wizardForm.tenderNumber || `TN-${Math.floor(1000 + Math.random() * 9000)}`,
      projectName: { en: wizardForm.projectNameEn, ar: wizardForm.projectNameAr || wizardForm.projectNameEn },
      location: { en: wizardForm.locationEn, ar: wizardForm.locationAr },
      coordinator: { en: wizardForm.coordinatorEn, ar: wizardForm.coordinatorAr },
      contractsEngineer: { en: wizardForm.contractsEngineerEn, ar: wizardForm.contractsEngineerAr },
      tenderStudyEngineer: { en: wizardForm.tenderStudyEngineerEn, ar: wizardForm.tenderStudyEngineerAr },
      department: wizardForm.departmentEn,
      priority: wizardForm.priority,
      techSubmissionDate: wizardForm.techDate,
      commSubmissionDate: wizardForm.commDate,
      overallSubmissionDate: wizardForm.officialDate || wizardForm.commDate,
      closingDate: wizardForm.closingDate,
      kickOffDate: wizardForm.kickOffDate,
      alignmentDate: wizardForm.alignmentDate,
      followUpDate: wizardForm.followUpDate,
      riskDueDate: wizardForm.riskDueDate,
      contractQualsDueDate: wizardForm.contractQualsDueDate,
      projectStatus: { en: 'Active Study', ar: 'تحت الدراسة والتقدير' },
      awardStatus: { en: 'Pending Submission', ar: 'قيد تجهيز المغلفات' },
      recordStatus: 'Active',
      daysRemaining: wizardForm.techDate
        ? Math.max(
            0,
            Math.ceil((new Date(wizardForm.techDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
          )
        : 30,
      health: 'Healthy',
      estimatedValue: `${wizardForm.currency} ${FinancialsCalculator.formatAmount(parsedValue)}`,
      estimatedCost: `${wizardForm.currency} ${FinancialsCalculator.formatAmount(parsedCost)}`,
      bondAmount: `${wizardForm.currency} ${FinancialsCalculator.formatAmount(calculatedBond)}`,
      currency: wizardForm.currency,
      tenderType: { en: wizardForm.tenderTypeEn, ar: wizardForm.tenderTypeAr },
      clientName: { en: wizardForm.clientEn, ar: wizardForm.clientAr },
      consultant: { en: wizardForm.consultantEn, ar: wizardForm.consultantAr },
      branch: { en: wizardForm.branchEn, ar: wizardForm.branchAr },
      businessUnit: { en: wizardForm.businessUnitEn, ar: wizardForm.businessUnitAr },
      notes: [
        {
          id: `wn-${Date.now()}-1`,
          author: 'ROWAD WIZARD',
          date: new Date().toISOString().split('T')[0],
          text: 'SaaS Guided pre-award wizard completed. System loaded timeline milestones dynamically according to Pre-Award settings.',
        },
        { id: `wn-${Date.now()}-2`, author: 'WIZARD LOG', date: new Date().toISOString().split('T')[0], text: extraNoteText },
      ],
      documents: [],
    };

    onUpdateList(prev => [createdTender, ...prev]);
    setShowManualForm(false);
    setSelectedTenderId(createdTender.id);
    localStorage.removeItem('preaward_wizard_draft');

    setToastAlert({
      type: 'success',
      message: isAr
        ? 'تم إنشاء السجل وتوليد المواعيد والتحذيرات الزمنية وتخزينها للمناقصة الجديدة بنجاح!'
        : 'Tender record generated, scheduling rules applied, and timeline initialized successfully!',
    });
  };

  const handleAddNoteToTender = (id: string) => {
    if (!newNoteText.trim()) return;
    onUpdateList(prev =>
      prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            notes: [
              ...t.notes,
              {
                id: `note-${Date.now()}`,
                author: isAr ? 'أحمد مصطفى' : 'Ahmed Mostafa',
                date: new Date().toISOString().split('T')[0],
                text: newNoteText.trim(),
              },
            ],
          };
        }
        return t;
      })
    );
    setNewNoteText('');
    setToastAlert({
      type: 'info',
      message: isAr ? 'تمت إضافة ملحوظتك الهندسية.' : 'Engineering note appended successfully.',
    });
  };

  const handleAddDocToTender = (id: string) => {
    if (!newDocName.trim()) return;
    onUpdateList(prev =>
      prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            documents: [
              ...t.documents,
              {
                id: `doc-${Date.now()}`,
                name: newDocName.trim().endsWith('.pdf') ? newDocName.trim() : `${newDocName.trim()}.pdf`,
                size: newDocSize || '1.8 MB',
                link: '#',
              },
            ],
          };
        }
        return t;
      })
    );
    setNewDocName('');
    setToastAlert({
      type: 'success',
      message: isAr
        ? 'تم إدراج المستند وتحديث الملف الرقمي للمشروع بنجاح!'
        : 'Document registered and project file updated successfully!',
    });
  };

  const handleBulkArchive = () => {
    if (selectedRowIds.length === 0) return;
    onUpdateList(prev =>
      prev.map(t => {
        if (selectedRowIds.includes(t.id)) {
          return { ...t, recordStatus: 'Archived', health: 'Archived' };
        }
        return t;
      })
    );
    setToastAlert({
      type: 'success',
      message: isAr
        ? `تمت أرشفة السجلات الـ ${selectedRowIds.length} المحددة بشكل كامل.`
        : `Archived ${selectedRowIds.length} items successfully`,
    });
    setSelectedRowIds([]);
  };

  const handleBulkExport = () => {
    if (selectedRowIds.length === 0) return;
    setToastAlert({
      type: 'success',
      message: isAr
        ? `تصدير ملفات Excel لـ ${selectedRowIds.length} بنجاح.`
        : `Exporting ${selectedRowIds.length} items as a unified spreadsheet workbook.`,
    });
  };

  return {
    showImportWizard,
    setShowImportWizard,
    showManualForm,
    setShowManualForm,
    dragActive,
    setDragActive,
    analyzingFile,
    setAnalyzingFile,
    importStep,
    setImportStep,
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
    wizardForm,
    setWizardForm,
    wizardStep,
    setWizardStep,
    clearWizardDraft,
    handleTechDateChange,
    updateKickOffDate,
    updateRiskDueDate,
    updateContractQualsDueDate,
    updateAlignmentDate,
    updateFollowUpDate,
    updateCommDate,
    handleDrag,
    handleDrop,
    triggerAnalysis,
    executeImportMerge,
    submitWizardTender,
    handleAddNoteToTender,
    handleAddDocToTender,
    handleBulkArchive,
    handleBulkExport,
    rules,
  };
}
