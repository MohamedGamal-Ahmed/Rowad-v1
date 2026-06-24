# ROWAD Enterprise - AI Handoff Document

This log maps current system health, completed sprint milestones, pending tasks, and guidelines for future AI systems.

For full coding criteria, known technical debts, and development commandments, see the [Living Product Specification (PROJECT_BOOK.md)](./PROJECT_BOOK.md).

---

## 1. System Quality Audit

* **Linter Status**: ✅ Fully verified. High-speed TypeScript compilation returns zero errors.
* **Compiler Status**: ✅ Successfully compiled and fully verified.
* **Database Emulator Layer**: `localStorage` schemas run seamlessly with zero console outputs.

To run immediate validation sweeps, consult [Immediate Diagnostics in the Quick Start Guide](./QUICK_START.md#1-fast-diagnostics).

---

## 2. Completed Milestones (Current Sprint)

### ✅ Milestone 1: Decoupled Domain-Driven Modeling
* Domain models and bilingual VO keys isolated into `/src/domain`.
* Structural conversion rules defined inside the Mapper layers, preserving view files.
* For database planning structures, see [Database Planning (PROJECT_BOOK.md#11-database-planning--relational-schemas-erd)](./PROJECT_BOOK.md#11-database-planning--relational-schemas-erd).

### ✅ Milestone 2: Orchestration Service Abstraction
* Math and formulas extracted from component wrappers.
* `DashboardService` coordinates total calculations, metrics caching, and combined commitments.
* Created pluggable interfaces for `CacheService`, `SearchService`, and `AuditService`.
* For dependent structures, refer to [Service Dependency Matrix (PROJECT_BOOK.md#7-service-dependency-matrix)](./PROJECT_BOOK.md#7-service-dependency-matrix).

### ✅ Milestone 3: Presentation UI Refactoring
* Core views redesigned into atomic presentation layers.
* Created 5-step interactive proposal wizard under Pre-Award layouts with modular date calculators.
* Introduced file metadata submittal trackers and integrated slide drawer elements under Document Control.

### ✅ Milestone 4: Operations Center & Enterprise Control Room Specifications
* Structured a premium Operations Center design blueprint (`/docs/ui-blueprint/operations-calendar.md`) detailing its 9 multi-view tabs, including the personalized **My Work** hub.
* Designed the DAG-based **Event Dependency Model** facilitating automatic rescheduling propagation across predecessor/successor networks with lag buffers.
* Replaced the simple sliding drawer with a comprehensive **Operations Command Panel** integrating detailed project summaries, metadata, related documents/meetings, deep source links, and direct quick operations.
* Formulated the **Global AI Command Bar** NLP syntax patterns, renamed Heatmaps to **Operational Load** using subtle brand-opacity density indicators, and established direct action controls directly on calendar events.
* Aligned all data schemas, relational ERD models, UI components, and API REST contracts across the master `PROJECT_BOOK.md` specification.

### ✅ Milestone 5: Operations Center - High-Fidelity Implementation
* Implemented the core data synthesis layer in `/src/features/operations-center/services/OperationsCenterService.ts`, parsing on-the-fly and mapping events directly from pre-award tenders, project controls ledger db, and document registers.
* Configured recursive DAG date-propagation math so shifting a predecessor's date shifts successors forward recursively, logging audit comments on the affected tasks.
* Created distinct custom React hooks under `/src/features/operations-center/hooks/` (`useCalendarEvents`, `useAgenda`, `useWorkload`, `useConflicts`, `useTimeline`) to enforce the Single Responsibility Principle and strict UI/logic decoupling.
* Built 8 highly polished, responsive views including the **My Work** personal priorities grid, **Operational Load** calendar month-grid, **High-Density Chronicle** list, **Horizontal Project Gantt** tracker, **Kanban** lanes, **Resource Capacity** trackers, and **Diagnostics** panels.
* Integrated the **AI NLP Command Bar** with instant keyword action parsing and bilingual triggers.
* Implemented the **Operations Command Panel** as a persistent sliding side bezel supporting real-time date adjustments, reassignments, comment logging, and drag-and-drop file uploads.
* Completed full app compilation and TypeScript validations, registering 100% clean builds.

---

## 3. Sprint Roadmap (Pendings & Backlog)

1. **PostgreSQL Relational Storage Migration**: Transition local browser storages to live Postgres databases. Follow [Database Planning Roadmap](./PROJECT_BOOK.md#11-database-planning--relational-schemas-erd).
2. **OpenAPI API Integration**: Implement REST contracts detailed in [API Contract Planning](./PROJECT_BOOK.md#12-api-contract-planning).
3. **Global Submittal Search**: Bind structural views to lookups via `SearchService`.
4. **Active Notification Channels**: Implement live integrations with MS Teams and target SMTP gateways.

To evaluate refactoring plans, consult the [Known Technical Debt Index (PROJECT_BOOK.md#20-known-technical-debt)](./PROJECT_BOOK.md#20-known-technical-debt).

---

## 4. Operational Commander Guide for incoming AI Assistants

If you are an AI assistant tasked with continuing work on this codebase, you MUST adhere to these foundational constraints:

1. **Review Reference Files First**: You must read `docs/ai/PROJECT_BOOK.md` before performing edit operations.
2. **Zero In-View Math**: Do not write calculations inside React files. Business formulas belong inside `/src/business-rules/` and orchestration services.
3. **No Unrequested Playground Features**: Do not add visual playgrounds or buttons unless they are directly requested by the user.

For the binding developer commandments, review [AI Collaboration Guide (PROJECT_BOOK.md#21-ai-collaboration-guide-mandatory-commandments)](./PROJECT_BOOK.md#21-ai-collaboration-guide-mandatory-commandments).
