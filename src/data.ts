export interface BilingualString {
  en: string;
  ar: string;
}

export interface Project {
  id: string;
  name: BilingualString;
  code: string;
  category: 'active' | 'pre-award' | 'completed' | 'closed';
}

export const mockKPIs = {
  totalProjects: {
    value: "28",
    label: { en: "Total Projects", ar: "إجمالي المشاريع" }
  },
  activeProjects: {
    value: "16",
    label: { en: "Active Projects", ar: "المشاريع قيد التنفيذ" }
  },
  contractValue: {
    value: "3.45",
    suffix: { en: "Billion EGP", ar: "مليار جنيه" },
    label: { en: "Total Contract Value", ar: "إجمالي قيمة العقود" }
  },
  ipcThisMonth: {
    value: "245.6",
    suffix: { en: "Million EGP", ar: "مليون جنيه" },
    label: { en: "IPC This Month", ar: "مستخلصات هذا الشهر" }
  }
};

export const mockAlerts = [
  {
    id: 1,
    type: "warning",
    text: { en: "3 Contracts need review", ar: "3 عقود تحتاج مراجعة" }
  },
  {
    id: 2,
    type: "danger",
    text: { en: "5 IPCs are overdue", ar: "5 شهادات دفع متأخرة" }
  },
  {
    id: 3,
    type: "warning",
    text: { en: "2 New claims received", ar: "تم استلام 2 مطالبات جديدة" }
  }
];

export const mockProjects: Project[] = [
  {
    id: "p1",
    name: { en: "ZED East - Zone 02", ar: "زيد إيست - المنطقة 02" },
    code: "ZED-Z02",
    category: "active"
  },
  {
    id: "p2",
    name: { en: "Diriyah II - Boulevard", ar: "الدرعية 2 - البوليفارد" },
    code: "PA-2026-011",
    category: "pre-award"
  },
  {
    id: "p3",
    name: { en: "Eastown Residences - Ph3", ar: "إيستاون ريزيدنس - المرحلة 3" },
    code: "EASTOWN-R3",
    category: "active"
  }
];

export const projectChartData = [
  { name: 'Active', ar: 'منفذ', value: 16, color: '#0A192F' },
  { name: 'Pre-Award', ar: 'قبل الترسية', value: 8, color: '#388E3C' },
  { name: 'Completed', ar: 'مكتمل', value: 3, color: '#D1D5DB' },
  { name: 'Closed', ar: 'مغلق', value: 1, color: '#8B1820' },
];
