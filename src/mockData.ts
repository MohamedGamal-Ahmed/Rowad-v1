import { BilingualString } from './data';

export const extendedKPIs = [
  { id: 'health', label: { en: 'Portfolio Health', ar: 'صحة المحفظة' }, value: '92%', trend: '+2%', status: 'success', sparkline: [40, 50, 60, 55, 80, 92] },
  { id: 'revenue', label: { en: 'Total Revenue', ar: 'إجمالي الإيرادات' }, value: '1.8B', trend: '+15%', status: 'success', sparkline: [1.2, 1.3, 1.4, 1.5, 1.6, 1.8] },
  { id: 'cost', label: { en: 'Total Cost', ar: 'إجمالي التكاليف' }, value: '950.4M', trend: '-3%', status: 'success', sparkline: [980, 970, 985, 960, 955, 950] },
  { id: 'margin', label: { en: 'Profit Margin', ar: 'هامش الربح' }, value: '18.4%', trend: '+1.2%', status: 'success', sparkline: [16, 16.5, 17, 17.2, 18, 18.4] },
  { id: 'cashflow', label: { en: 'Cash Flow', ar: 'التدفق النقدي' }, value: '+240M', trend: '+8%', status: 'success', sparkline: [100, 150, 120, 200, 220, 240] },
  { id: 'active', label: { en: 'Active Projects', ar: 'المشاريع النشطة' }, value: '42', trend: '+4', status: 'neutral', sparkline: [38, 38, 39, 40, 41, 42] },
  { id: 'at_risk', label: { en: 'At Risk Projects', ar: 'مشاريع في خطر' }, value: '3', trend: '-1', status: 'warning', sparkline: [4, 4, 5, 4, 3, 3] },
  { id: 'delayed', label: { en: 'Delayed Projects', ar: 'مشاريع متأخرة' }, value: '2', trend: '+0', status: 'danger', sparkline: [1, 2, 2, 2, 2, 2] },
  { id: 'claims', label: { en: 'Pending Claims', ar: 'مطالبات معلقة' }, value: '18', trend: '+3', status: 'warning', sparkline: [12, 14, 15, 15, 16, 18] },
  { id: 'variations', label: { en: 'Pending Variations', ar: 'أوامر تغييرية معلقة' }, value: '24', trend: '-2', status: 'neutral', sparkline: [28, 27, 26, 25, 26, 24] },
  { id: 'ipc', label: { en: 'Outstanding IPC', ar: 'مستخلصات غير مسددة' }, value: '320M', trend: '+15M', status: 'warning', sparkline: [280, 290, 300, 310, 305, 320] },
  { id: 'eot', label: { en: 'EOT Requests', ar: 'طلبات تمديد' }, value: '5', trend: '+1', status: 'warning', sparkline: [2, 3, 3, 4, 4, 5] }
];

export const smartAlerts = [
  { id: 'a1', priority: 'critical', type: 'overdue_ipc', project: 'Zayed Industrial Complex', days: 14, user: 'K. Hassan', action: { en: 'Review', ar: 'مراجعة' }, title: { en: 'Overdue IPC Payment', ar: 'دفعة مستخلص متأخرة' } },
  { id: 'a2', priority: 'high', type: 'budget_risk', project: 'New Capital Hub', days: 0, user: 'M. Ali', action: { en: 'Analyze', ar: 'تحليل' }, title: { en: 'Budget Overrun Risk', ar: 'خطر تجاوز الميزانية' } },
  { id: 'a3', priority: 'high', type: 'claims', project: 'Diriyah II - Boulevard', days: 5, user: 'S. Ahmed', action: { en: 'Approve', ar: 'اعتماد' }, title: { en: 'Claims Awaiting Review', ar: 'مطالبات بانتظار المراجعة' } },
  { id: 'a4', priority: 'medium', type: 'schedule', project: 'Eastown Residences', days: 2, user: 'F. Saleh', action: { en: 'Assign', ar: 'تعيين' }, title: { en: 'Minor Schedule Delay', ar: 'تأخير بسيط في الجدول' } },
  { id: 'a5', priority: 'low', type: 'report', project: 'Portfolio', days: 0, user: 'A. Mostafa', action: { en: 'Open', ar: 'فتح' }, title: { en: 'Missing Monthly Report', ar: 'التقرير الشهري مفقود' } }
];

export const projectHealthMatrix = Array.from({ length: 42 }).map((_, i) => ({
  id: `pm-${i}`,
  name: `Project ${i + 1}`,
  client: 'EMAAR',
  health: Math.random() > 0.8 ? 'danger' : Math.random() > 0.6 ? 'warning' : 'success',
  progress: Math.floor(Math.random() * 100),
  budget: Math.floor(Math.random() * 100),
  budgetStatus: Math.random() > 0.8 ? 'Overrun' : 'On Track',
  scheduleStatus: Math.random() > 0.8 ? 'Delayed' : 'On Schedule',
  daysRemaining: Math.floor(Math.random() * 300) + 10,
  riskLevel: Math.random() > 0.8 ? 'High' : Math.random() > 0.6 ? 'Medium' : 'Low',
  manager: 'Ahmed Mostafa'
}));

export const financialChartData = [
  { name: 'Jan', revenue: 4000, cost: 2400, profit: 1600 },
  { name: 'Feb', revenue: 3000, cost: 1398, profit: 1602 },
  { name: 'Mar', revenue: 2000, cost: 9800, profit: -7800 },
  { name: 'Apr', revenue: 2780, cost: 3908, profit: -1128 },
  { name: 'May', revenue: 1890, cost: 4800, profit: -2910 },
  { name: 'Jun', revenue: 2390, cost: 3800, profit: -1410 },
  { name: 'Jul', revenue: 3490, cost: 4300, profit: -810 },
  { name: 'Aug', revenue: 5490, cost: 2300, profit: 3190 },
  { name: 'Sep', revenue: 6490, cost: 3300, profit: 3190 },
  { name: 'Oct', revenue: 7490, cost: 4300, profit: 3190 },
  { name: 'Nov', revenue: 8490, cost: 5300, profit: 3190 },
  { name: 'Dec', revenue: 9490, cost: 6300, profit: 3190 },
];

export const activityFeed = [
  { id: 1, type: 'document', title: { en: 'Document Uploaded', ar: 'تم رفع مستند' }, desc: { en: 'BOQ finalized for Phase 2', ar: 'تم الانتهاء من جدول الكميات للمرحلة 2' }, time: '10 mins ago', project: 'ZED East' },
  { id: 2, type: 'ipc', title: { en: 'IPC Submitted', ar: 'تم تقديم مستخلص' }, desc: { en: 'IPC #14 value 12.5M EGP', ar: 'مستخلص 14 بقيمة 12.5 مليون' }, time: '1 hour ago', project: 'Diriyah II' },
  { id: 3, type: 'contract', title: { en: 'Contract Signed', ar: 'تم توقيع عقد' }, desc: { en: 'MEP Subcontractor Al Safa', ar: 'مقاولي الباطن - الصفا' }, time: '3 hours ago', project: 'New Capital Hub' },
  { id: 4, type: 'vo', title: { en: 'VO Updated', ar: 'تم تحديث أمر تغييري' }, desc: { en: 'VO #03 Approved by Consultant', ar: 'تم اعتماد الأمر التغييري رقم 3' }, time: '5 hours ago', project: 'Eastown' },
  { id: 5, type: 'claim', title: { en: 'Claim Approved', ar: 'تمت الموافقة على مطالبة' }, desc: { en: 'EOT Claim for Rain Delay', ar: 'مطالبة تمديد زمني بسبب الأمطار' }, time: '1 day ago', project: 'ZED East' }
];

export const timelineEvents = [
  { id: 1, type: 'meeting', title: { en: 'Executive Board Meeting', ar: 'اجتماع مجلس الإدارة' }, date: 'Oct 14, 09:00 AM' },
  { id: 2, type: 'submission', title: { en: 'Tender Submission', ar: 'تقديم العطاء' }, date: 'Oct 15, 02:00 PM' },
  { id: 3, type: 'deadline', title: { en: 'Claim #42 Deadline', ar: 'الموعد النهائي لمطالبة 42' }, date: 'Oct 18, 12:00 PM' },
  { id: 4, type: 'expiry', title: { en: 'Al Safa Contract Expiry', ar: 'انتهاء عقد الصفا' }, date: 'Oct 20, 05:00 PM' },
];

export const aiInsights = [
  { id: 1, suggestion: { en: 'Review 3 delayed projects in North Coast region. Suggested action: Reallocate resources from completed phases.', ar: 'مراجعة 3 مشاريع متأخرة في منطقة الساحل الشمالي. اقتراح إجراء: إعادة تخصيص الموارد من المراحل المكتملة.' } },
  { id: 2, suggestion: { en: 'Forecasted revenue for Q4 is 12% below target. Consider accelerating IPC submissions for Diriyah II.', ar: 'الإيرادات المتوقعة للربع الرابع أقل من المستهدف بنسبة 12%. ينصح بتسريع تقديم المستخلصات للدرعية 2.' } },
  { id: 3, suggestion: { en: 'Anomaly detected in Budget for MEP Subcontractors across 2 active hubs.', ar: 'اكتشاف خلل في ميزانية مقاولي الأعمال الكهروميكانيكية عبر مشروعي محاور نشطة.' } }
];

export const commandCenterItems = [
  { id: 1, type: 'pinned', label: { en: 'ZED East Dashboard', ar: 'لوحة تحكم زيد إيست' } },
  { id: 2, type: 'task', label: { en: 'Approve IPC #14', ar: 'اعتماد مستخلص 14' } },
  { id: 3, type: 'file', label: { en: 'Q3 Financial Report.pdf', ar: 'التقرير المالي للربع الثالث' } }
];
