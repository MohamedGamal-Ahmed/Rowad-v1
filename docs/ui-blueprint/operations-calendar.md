# UI Blueprint: Operations Center & Calendar

## 1. Executive Strategy & UX Vision

### 1.1 The Operational Heartbeat of ROWAD
Traditional digital calendars (Google Calendar, Microsoft Outlook) are designed for personal time management, chronological schedules, and single-resource availability. For mega-scale infrastructure engineering firms overseeing dozens of simultaneous tenders, complex site logistics, and hundreds of compliance dates, these tools fail catastrophically under load. Putting 500+ events per month into a standard month grid creates a visual cluster of overlapping text boxes that is completely unusable for contracts engineers and PMO directors.

The **ROWAD Operations Center (with integrated Operations Calendar)** is a high-density, business-intelligent operations dashboard. It aggregates event dates from **Pre-Award (Tenders)**, **Post-Award (Project Controls)**, and **Manual/Administrative Logs** into a single readable interface. Rather than trying to cram all event text boxes onto a single calendar view, it treats dates as **data points** backing integrated views, relying on **workload intensity heatmaps**, **operational timelines**, **engineer assignment matrices**, and **conflict alerts** to facilitate PMO decision-making.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        OPERATIONS CENTER BOARD                         │
├────────────────────────────────────────────────────────────────────────┤
│  [ Tabs ]                                                              │
│  ● Calendar   ○ Agenda   ○ Timeline   ○ Workload   ○ Deadlines   ...   │
├───────────────────┬──────────────────────────────────┬─────────────────┤
│ FILTERS & SIDEBAR │           CENTER ACTIVE VIEW     │ RIGHT DIAGNOSTICS|
│                   │                                  │                 │
│ ▢ Project NEOM    │   [  HEATMAP MONTH MATRIX  ]     │ Today's Agenda  │
│ ▢ Project JED     │   Mon  Tue  Wed  Thu  Fri  ...   │ ■ Tech Subm.    │
│ ▢ Pre-Award Est.  │   [02] [04] [18] [03] [01]       │ ■ NOC Deadline  │
│ ▢ Post-Award Ctrl │   (G)  (Y)  (R )  (Y)  (G )      │                 │
│ ▢ High Priority   │                                  │ Late Warnings   │
│                   │   [  EXPANSION PANEL: JUN 23  ]  │ ⚠ 2 Claims Late │
│ ▢ Save View       │   • 09:00 - PC-2026-RCL (Conflict)│                 │
│                   │   • 14:00 - Jeddah PIP (Critical)│ Eng. Workload   │
│ ▢ Reset Filter    │                                  │ Sara [██████] 15│
└───────────────────┴──────────────────────────────────┴─────────────────┘
```

---

## 2. Tabs and Navigation Hierarchy

The module is structured as a top-level **Operations Center** providing 8 functional tabs:

1. **Calendar Tab**: The primary high-density view. Integrates the Month, Week, and Smart Workload Heatmap grid.
2. **Agenda Tab**: Fast linear chronicle tracking of events, grouped cleanly by week/day with status flags and immediate quick-actions.
3. **Timeline Tab**: Horizontal project-centric Gantt/Schedule illustrating overlapping project tracks and upcoming 14-day/30-day deadlines.
4. **Workload Tab**: Human resource allocation metric charts showing active engineer tasks, meeting counts, and saturation scores to resolve burnout.
5. **Deadlines Tab**: Specialized PMO compliance view displaying countdown clocks, submission days-to-closing, and late risk assessments.
6. **Meetings Tab**: Meeting coordinator center showing technical alignments, client kick-offs, negotiation clusters, and meeting room allocations.
7. **Conflicts Tab**: Automated system diagnostics dashboard identifying dual-schedule engineers, project milestone overlaps, and missing documentation dependencies.
8. **AI Insights Tab (Future Vision)**: predictive scheduling layer analyzing estimator success patterns and پیشنهاد optimally-spaced submission dates based on historical speed and risk parameters.

---

## 3. High-Density Event Data Model (TypeScript Schema)

To avoid duplicating data structures across the platform, the Unified Event Model is a unified consumer object. The Calendar does **not** write or persist these schemas; it listens to read-only service outputs compiled from underlying datasets.

```typescript
export enum EventModuleType {
  PRE_AWARD = 'pre-award',
  PROJECT_CONTROLS = 'project-controls',
  ADMINISTRATIVE = 'administrative',
  MANUAL = 'manual'
}

export enum EventCategory {
  TECH_SUBMISSION = 'tech_submission',
  COMM_SUBMISSION = 'comm_submission',
  RISK_ASSESSMENT = 'risk_assessment',
  QUALIFICATION_DUE = 'qualification_due',
  ALIGNMENT_MEETING = 'alignment_meeting',
  CLIENT_MEETING = 'client_meeting',
  NEGOTIATION = 'negotiation',
  KICK_OFF = 'kick_off',
  IPC_DEADLINE = 'ipc_deadline',
  CLAIM_DEADLINE = 'claim_deadline',
  VO_DEADLINE = 'vo_deadline',
  NOC_DEADLINE = 'noc_deadline',
  INTERNAL_MEETING = 'internal_meeting',
  REMINDER = 'reminder',
  GENERAL_EVENT = 'general_event'
}

export enum EventPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum EventStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  OVERDUE = 'overdue'
}

export interface CalendarEvent {
  id: string;                      // Unique ID mapped from source
  title: {
    en: string;
    ar: string;
  };
  description?: {
    en: string;
    ar: string;
  };
  projectCode: string;             // Associated Project ID (e.g. PC-2026-NEOM)
  projectName: {
    en: string;
    ar: string;
  };
  module: EventModuleType;
  eventType: EventCategory;
  ownerId: string;                 // Mapped Coordinator User ID
  ownerName: string;
  assignedToIds: string[];         // Mapped Estimators & Engineers
  assignedToNames: string[];
  priority: EventPriority;
  status: EventStatus;
  startDate: string;               // ISO date string (YYYY-MM-DD)
  endDate: string;                 // ISO date string (YYYY-MM-DD)
  startTime?: string;              // ISO time string (HH:MM:SS) Optional
  endTime?: string;                // ISO time string (HH:MM:SS) Optional
  reminderOffsetMinutes?: number;  // System alerts parameter
  sourceId: string;                // References ID in parent module (e.g. Tender DB ID)
  colorTheme: {
    bg: string;                    // Tailwind BG class (e.g. bg-emerald-50)
    border: string;                // Tailwind border class (e.g. border-emerald-200)
    text: string;                  // Tailwind text class (e.g. text-emerald-800)
    iconColor: string;             // Lucide SVG fill class
  };
  lucideIconName: string;          // Icon lookup tag (e.g., "ShieldAlert")
  notes?: string;                  // Dynamic audit remarks or meeting notes
  hasConflict: boolean;            // Evaluated by system rule analyzer during load
}
```

---

## 4. UI Layout & Wireframe Specifications

### 4.1 Master Frame Structure
The Operations Center adopts a three-pane layout framed by responsive bottom visualizers and top tab selection lists.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  ROWAD ENTERPRISE  │  Operations Center                                                                    Language: EN │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  [TABS]  [● Calendar]  [○ Agenda]  [○ Timeline]  [○ Workload]  [○ Deadlines]  [○ Meetings]  [○ Conflicts]  [○ AI Insights]│
├───────────────────────────────────────┬────────────────────────────────────────────────────────┬───────────────────────┤
│ FILTERS & VIEW CONTROLLER             │ CENTER SCREEN CALENDAR MATRIX (e.g. June 2026)         │ ACTIVE DIAGNOSTICS    │
│                                       │ ◄ [ Prev ]  Today  [ Next ]   Search...       [Month▼] │                       │
│ 🔎 Search Events...                   ├────────────────────────────────────────────────────────┤ 📅 Today's Agenda      │
│                                       │ MON     TUE     WED     THU     FRI     SAT     SUN     │ - 09:00: Tech Comm    │
│ 📁 SAVED VIEWS                        │         1       2       3       4       5       6       │   NEOM Ring (Critical)│
│ [★ Pre-Award Deadlines]               │        (G)     (G)     (Y)     (O)     (G)     (G)      │                       │
│ [★ Claim Submissions]                 │ ───────┼───────┼───────┼───────┼───────┼───────┼───────│ - 14:00: NOC Review   │
│                                       │ 7       8       9       10      11      12      13      │   Jeddah Pipeline     │
│ 🏗️ PROJECTS                           │(G)     (R!)    (Y)     (G)     (Y)     (G)     (G)      │                       │
│ ☑ All Projects                        │        [ ⚠ Dual Booking Risk Warning ]                 │                       │
│ ☒ NEOM Infrastructure (NEOM)          │ ───────┼───────┼───────┼───────┼───────┼───────┼───────│ ⌛ Overdue Warnings    │
│ ☒ Jeddah Pipeline (JED)               │ 14      15      16      17      18      19      20      │ - ⚠ Risk Assessment   │
│                                       │(G)     (G)     (G)     (R!)    (G)     (G)     (G)      │   PC-2026-RCL (2d Late)│
│ 🏷️ EVENT MODULE                       │                                                        │                       │
│ ☑ Pre-Award Proposals                 │ [ DAY DETAIL EXPANSION: June 8, 2026 ]                 │ ⚙️ Resource Workload   │
│ ☑ Project Controls Ledger             │ ┌────────────────────────────────────────────────────┐ │ Sara   [████████] 15  │
│                                       │ │ • 09:00 - Pre-Award: Technical Submission           │ │ Ahmed  [████] 8       │
│ ⚠ PRIORITY LEVEL                      │ │   Project: JED | Assigned: Ahmed | Priority: Critical│ │ Mohamed[██████████]20 │
│ ☐ Critical   ☐ High   ☐ Medium  ☐ Low │ │   ⚠ Alert: Ahmed is also scheduled for Neom meeting│ │                       │
│                                       │ └────────────────────────────────────────────────────┘ │                       │
│ 👤 ACCOUNT OWNER                      │ ───────────────────────────────────────────────────────│                       │
│ ☑ All Estimators                      │ 21      22      23      24      25      26      27      │                       │
│                                       │(G)     (Y)     (Y)     (Y)     (G)     (G)     (G)      │                       │
└───────────────────────────────────────┴────────────────────────────────────────────────────────┴───────────────────────┘
│ BOTTOM PERFORMANCE COMPASS: Project Operations Timeline                                                                │
│ Project Name     │ Day -5     Day -4     Day -3     Day -2     Day -1  │ TODAY  │ Day +1    Day +2     Day +3     Day +4    │
│ ─────────────────┼─────────────────────────────────────────────────┼────────┼──────────────────────────────────────────│
│ PC-2026-NEOM     │ [========== Risk Assessment Check ==========]   │        │     [==== Commercial Prep ====]          │
│ PC-2026-JED      │                                                 │        │              [★ Technical Submission]     │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. UI Component Specifications (Tab by Tab)

### 5.1 Calendar Tab (High-Density Workload Grid)
* **Goal**: Enable visual scanning showing days of massive operational risk versus days of open capacity without overwhelming card grids.
* **Workload Heatmap System**:
  * Instead of drawing 15 overlapping text strips in a day box, days are color-weighted dynamically:
    * **Emerald Green (Low Workload)**: 0 to 2 event records.
    * **Amber Yellow (Medium Workload)**: 3 to 5 event records.
    * **Orange (High Workload)**: 6 to 9 events.
    * **Ruby Red (Critical Operations Day)**: 10+ events, or *any* day containing a Deadline Overlap or Dual-Booking conflict. Matches high contrast priority indicators.
  * *Micro-interactions*: Hovering over a heat day shows a tooltip summarising event categories (e.g. "3 Submissions, 2 Meetings"). Clicking expands a drawer below the row directly, revealing the detailed interactive list.

### 5.2 Agenda Tab (Linear Chronicle Controls)
* **Goal**: A structured list layout optimized for contractors scrolling through action lists.
* **Component Structures**:
  * Grouped chronologically: *Today, Tomorrow, Upcoming this week, Next week*.
  * Interactive components: Each line contains inline quick-action checks (e.g., "Mark NOC approved", "Toggle Submission Done"), and dynamic metadata tags showing the owning module (Pre-Award, Controls).

### 5.3 Timeline Tab (Operations Gantt Dashboard)
* **Goal**: Provide a horizontal view mapping multiple live projects over 14-day and 30-day lookaheads.
* **Layout Design**:
  * Rows track specific infrastructure assets (NEOM, Airport, JED).
  * Horizontal timeline blocks illustrate running preparation phases (e.g., "Bidding preparation block running from Jun 1 to Jun 12").
  * Interspersed milestone pins (indicated with sharp flags and custom category emblems) point to exact submission and delivery hours.

### 5.4 Workload Tab (Engineering Capacity Index)
* **Goal**: Visual balancing of PMO staff resources to isolate bottlenecks.
* **Integration System**:
  * Generates horizontal progress bars for every estimator and contracts engineer in the division.
  * Tracks calculation score: $\text{Weight Score} = (\text{Meetings} \times 1.0) + (\text{Active Tenders Studied} \times 4.0) + (\text{Due Submissions this week} \times 3.0)$.
  * Highlighting: Saturation bars exceeding critical levels trigger red warnings ("Overloaded: Sara has 18 critical tasks active").

### 5.5 Deadlines Tab (Compliance Center)
* **Goal**: Pure compliance tracking showing only high-critical targets.
* **Layout Design**:
  * Renders cards with exact, live countdown clocks (e.g., "14 hours remaining for NEOM Commercial Submission").
  * Status bars show completion of pre-requisites: *Is Bidding Bond paid? Is Risk assessment complete? Has PMO checker signed?*

### 5.6 Meetings Tab (Alignment Coordinator)
* **Goal**: Centralized listing of interactive, engineering-centric meetings.
* **Features**:
  * Groups alignments, client face-to-face negotiation roundtables, and project kick-offs.
  * Highlights "External Meeting" vs "Internal Meeting" with clear badges to maintain professional focus.

### 5.7 Conflicts Tab (Automated Quality Guard)
* **Goal**: Diagnostic suite detailing dual assignments, milestone overlaps, and missing milestones.
* **Key Warnings**:
  * **Dual Booking Warning**: Engineer scheduled to present Technical Bid in Riyadh and join a NEOM alignment meeting at the same hour.
  * **Calculated Dates Overlap**: Commercial Bid date scheduled before technical estimates can lock.
  * **Pending Documentation Alert**: Tender is 2 days from tech submission but BOQ sheets remain incomplete.

---

## 6. Functional Business & Interaction Rules

### 6.1 Automatic Event Synthesis (Zero Duplication Rule)
Whenever database state shifts occur in other elements, the Operations Center recalculates event nodes dynamically.

* **Trigger A**: Creating a new Tender record (`TenderWizard`) automatically calculates and schedules **7 default calendar points**:
  * *T0 (Tech Date - 15 days)*: Kickoff Meeting
  * *T1 (Tech Date - 10 days)*: Risk Assessment Due
  * *T2 (Tech Date - 5 days)*: Internal Alignment Matrix
  * *T3 (Tech Date)*: Technical Submission
  * *T4 (Tech Date + 5 days)*: Technical Assessment Follow-up
  * *T5 (Tech Date + 12 days)*: Commercial Submission
  * *T6 (Tech Date + 20 days)*: Final Registration & Official Win decision
* **Trigger B**: Submitting an active project claims voucher (`ProjectControls`) automatically schedules:
  * *C0 (Logging Date)*: Claim Generation Flag
  * *C1 (Logging Date + 14 days)*: Assessment Limit Deadline
  * *C2 (Logging Date + 28 days)*: Response Target Boundary

*If any parent date evolves (e.g., client expands Technical Proposal date by 14 days), all 7 child calendar dates shift immediately inside the service mapping tree.*

---

## 7. Operational Strategies & Technical Implementations

### 7.1 Dynamic Filtering Strategy
Because filters govern hundreds of active inputs, the Left Sidebar executes multi-dimensional search:
* **Project Filters**: Checkbox arrays grouped by region (Riyadh, Western, Eastern).
* **Owner / Resource**: Typeahead lookup selecting multiple project coordinators or estimating engineers.
* **Category Filters**: Unified toggle selections dividing Pre-Award Bid tasks from Post-Award Claims or NOCs.
* **Performance Control**: All filters execute instantly via React state memoizations, resolving search indexes in under **5ms** by running against structured memory-cached indices.

### 7.2 Conflict Detection Engine (Diagnostic Mechanics)
An automated validator scans active registers whenever the browser loads the Operations Center:

$$\text{Conflict Check} (E_1, E_2) \implies | \text{Date}(E_1) - \text{Date}(E_2) | < 1 \text{ Hour} \land (\text{Owners}(E_1) \cap \text{Owners}(E_2) \neq \emptyset)$$

* **Conflict Type A (Resource Overload)**: Triggers when user `John Doe` is a specified attendee in overlapping event periods.
* **Conflict Type B (Sequential Milestones Volatilities)**: Triggers if dependent items violate chronology (e.g., site visit scheduled after technical submission date).
* **UI Feedback**: Conflict warnings generate standard small hazard badges with warning indicators inside grids. Selecting a hazard badge displays a troubleshooting popover with direct reassignment buttons.

```
┌───────────────────────────────────────┐
│ ⚠ CONFLICT DETECTED                   │
├───────────────────────────────────────┤
│ Engineer "Ahmed" has overlapping to-dos:│
│ 1. NEOM Alignment (09:00 - 10:30)     │
│ 2. JED Tech Review (10:00 - 11:30)    │
├───────────────────────────────────────┤
│ [ Reassign John ]   [ Dismiss Alert ] │
└───────────────────────────────────────┘
```

### 7.3 Real-Time Caching Strategy
To prevent dragging database transaction engines down during continuous calendar moves:
1. **Aggregated Memory Cache**: The application maintains a localized, non-persistent schema index map.
2. **Dynamic Segment Invalidation**: Editing an active date in a Tender form will invalidate *only* that tender's segment cache, leaving unrelated project caches active.

---

## 8. UX Guidelines & Design Logic

### 8.1 Color Logic & Micro-Contrast
ROWAD avoids bright colors to protect readability. Colors are highly restrained:
* **Backgrounds**: Soft off-white backgrounds (or slate dark) highlighted by light borders.
* **Category Color Accent (RESTRICTED)**:
  * **Pre-Award (Tenders)**: Royal Blue themes (`bg-blue-50/60`, `border-blue-150`, `text-blue-900`).
  * **Project Controls (Financials)**: Emerald Green themes (`bg-emerald-50/60`, `border-emerald-150`, `text-emerald-900`).
  * **Administrative / Reminders**: Cool Gray themes (`bg-gray-100`, `border-gray-200`, `text-gray-700`).
* **Visual Density Weighting (Heatmaps ONLY)**:
  * Low Intensity: Solid pastel emerald.
  * Medium Density: Textured amber stripe.
  * Overloaded: High contrast orange.
  * Critical Alert: High contrast red matching accessibility contrast rules.

### 8.2 Responsive Layout Adjustment
* **Desktop Views (MinWidth: 1280px)**: The complete 3-pane layout displays sidebars, calendar matrices, right timelines, and bottom tracking boards.
* **Tablet Views (MinWidth: 768px)**: Left filter panels slide to off-screen drawers with clean slide selectors. The bottom timeline collapses, retaining Month Heatmap views.
* **Mobile Views (Width < 768px)**: The calendar grid switches to a consolidated Week list or heat-strip layout. Clicking dates opens clean sliding bottom sheets showing listings.

---

## 9. Accessibility Specifications (Section 508 & WCAG 2.1 AA)
* **Contrast Safeguard**: All tag and border pairings are verified. For instance, gray badges use dark zinc text (`text-zinc-850`) to ensure contrast meets WCAG’s **4.5:1 ratio**.
* **Screen Reader Interoperability**: Every interactive day block implements `aria-label` stating day context and event counts (e.g., `aria-label="June 8, 2026. High workload: 4 active events. Click to expand."`).
* **Keyboard Navigation Grid**: Standard arrow keys (`←`, `↑`, `→`, `↓`) shift selection focal points between calendar matrix grids. Tab controls navigate sections.
* **Bilingual Screen-Readers**: Supports dynamic HTML lang attribute switches so screen readers adopt the correct phonetics (English/Arabic) based on localized labels.

---

## 10. Future AI Scheduling Opportunities
Beyond standard chronological plotting, future iterations can implement:
1. **RFP Due Date Risk Prognosis**: Analyzing client document quality, budget scale, and available estimating staff to predict likelihood of schedule slips.
2. **Automatic Schedule Optimizers**: Algorithms adjusting internal milestone dates when conflict alerts identify overworked estimators.
3. **Conversational Date Alterations**: Natural Language input interface (e.g., "AI Scheduler: Delay Riyadh pipeline alignment meeting to Wednesday at 2pm and warn the PMO").

---

*This UI Blueprint is verified as the Official Product and Experience Specification for the ROWAD Operations Calendar.*
