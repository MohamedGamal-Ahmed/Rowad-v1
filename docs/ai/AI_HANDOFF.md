# ROWAD Enterprise - AI Handoff Document

This document tracks the current sprint state, completed items, unresolved items, and instructions for incoming AI agents contributing to the next sprint.

---

## 1. System Health Audit

* **Linter Status**: ✅ Passed smoothly without syntax or import errors.
* **Compiler Status**: ✅ Successfully compiled and ready for deployment.
* **Dependencies**: No newly added external node modules, preserving absolute stability.

---

## 2. Completed Milestones

### ✅ Milestone 1: Domain-Driven Design (DDD) & Entities
We have fully populated pure, framework-free entities in `src/domain/` mapping:
* Pre-award aggregates (`Tender`, `Money`, `BilingualString`).
* Post-award records (`ProjectControlsRecord`, `DocumentRecord`).

### ✅ Milestone 2: Service Orchestration & Decoupling
* Excluded all mathematical formulas and estimations from React.
* Configured `DashboardService` to calculate totals, bonds, and safety ratios.
* Built `TenderService` & `ProjectControlsService` to translate data lists smoothly.
* Created pluggable service interfaces for `CacheService`, `LoggingService`, `PermissionService`, `SearchService`, and `AuditService`.

### ✅ Milestone 3: UI Blueprints & Prepared Extensions
* **Dashboard View**: Clean, high-contrast KPI panels powered by `DashboardService`.
* **Ongoing Tenders View**: Formulated a modular 5-step wizard (General information, Assignments, Timeline, Financial Verification, Review & Submit) and mapped details panel to prepare modular conversion gateways.
* **Document Control View**: Added structural registration cards and created a hot-pluggable engineering bar preparing downstream EDMS interfaces with zero visual regression.
* **Project Controls View**: Clean ledger filtering of transactional vouchers.

---

## 3. Pending Tasks (Next Sprint)

1. **FastAPI & PostgreSQL Transition**: Transition from local emulators (`localStorage`) to resilient backend relational SQL endpoints.
2. **Global Real-Time Search**: Map search entries across panels using the instantiated `SearchService`.
3. **Pluggable Alerts Dispatching**: Connect actual providers to SMS and Teams APIs using `NotificationService`.
4. **Makers-Checkers Workflow Approvals**: Enhance state transitions to fully validate permission roles before completing submission phases.

---

## 4. Advice for the Next AI Assistant
* **Do not modify the core business rules**: The formulas in `/src/business-rules/` and calculating pipelines are frozen. Keep them unchanged.
* **Add new features inside the existing architecture**: Always follow the sequence `React -> Service -> Repo -> Mapper -> Domain`. Never bypass these layers.
* **Verify before finalizing work**: Always run the build compiler (`compile_applet`) and the linter (`lint_applet`) before concluding.
