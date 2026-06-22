# ROWAD Enterprise - Business Rules Index

This document catalogues every official policy calculation, mathematical formula, and state boundary locked inside the ROWAD enterprise kernel.

---

## 1. Pre-Award Proposal Planning Rules

| ID | Title / Rule Name | Formula / State Boundary | Implementation Code |
| :--- | :--- | :--- | :--- |
| **BR-PRE-001** | Bidding Bond Calculation | $\text{Bond Amount} = \text{Estimated Tender Value} \times 2.0\%$ | `FinancialsCalculator.ts` |
| **BR-PRE-002** | Milestone Date Propagation | Key milestones (Kickoff, Risk Assessments, Agreements) propagate automatically relative to the Technical Submission date using configured day offsets. | `TimelineCalculator.ts` |
| **BR-PRE-003** | Standard Commercial Offset | Standard Commercial Submission date defaults precisely to **12 days** after the baseline Technical Submission date. | `TimelineCalculator.ts` |
| **BR-PRE-004** | Dual Language Constraint | All projects, clients, departments, and tender categories require concurrent English and Arabic text input. | `TenderValidator.ts` |

---

## 2. Post-Award Project Controls Rules

| ID | Title / Rule Name | Formula / State Boundary | Implementation Code |
| :--- | :--- | :--- | :--- |
| **BR-CON-001** | Ledger Separation | Interim Payment Certificates (IPCs), Claims, and Variation Orders (VOs) are treated as separate ledger operations with distinct structural workflows. | `ProjectControlsMapper.ts` |
| **BR-CON-002** | Single Page Reporting (SPR) | Executive Project Performance Reports (SPRs) are dynamic creations, synthesized on demand directly from current ledger states. Reports are never stored statically inside transactional schemas. | `ADR-011.md` / `DashboardService.ts` |
| **BR-CON-003** | Currency Standarization | All execution values parse and summarize relative to the UAE Dirham (AED) base currency. | `FinancialsCalculator.ts` |

---

## 3. Operations & Audits Rules

| ID | Title / Rule Name | Formula / State Boundary | Implementation Code |
| :--- | :--- | :--- | :--- |
| **BR-AUD-001** | Immutable Audit Trail | High-risk events (Tender Creation, Status Modification, Workflow Transitions) generate immutable audit logs sealed into the audit storage provider. | `AuditService.ts` |
| **BR-AUD-002** | Role-Based Authorization | Access to edit financial columns or submit proposals requires corresponding Role permissions. Roles must never be hardcoded block patterns. | `PermissionService.ts` |
| **BR-AUD-003** | Dashboard Caching | Executive dashboard KPIs are cached in memory for **60 seconds** to prevent database overload. Cache remains hot-swappable. | `CacheService.ts` |
