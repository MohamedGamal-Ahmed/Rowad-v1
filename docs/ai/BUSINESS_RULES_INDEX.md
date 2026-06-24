# ROWAD Enterprise - Business Rules Index Reference

This index catalogues official equations, milestone propagation offsets, and transaction rules.

For complete inputs, validation criteria, and functional requirements, consult the [Living Product Specification (PROJECT_BOOK.md)](./PROJECT_BOOK.md).

---

## 1. Systemwide Calculations Directory

| Rule ID | Title / Rule Name | Mathematical Formula | Implementation Target | Reference Link in Master Book |
| :--- | :--- | :--- | :--- | :--- |
| **BR-PRE-001** | Bidding Bond calculation | $\text{Bond Value} = \text{Estimated Tender} \times 2.0\%$ | `FinancialsCalculator.ts` | [Pre-Award Requirements](./PROJECT_BOOK.md#32-module-b-pre-award-proposals-tenders) |
| **BR-PRE-002** | Milestone Date Propagation | Auto-propagate day offsets relative to Technical Proposal date | `TimelineCalculator.ts` | [Pre-Award Requirements](./PROJECT_BOOK.md#32-module-b-pre-award-proposals-tenders) |
| **BR-PRE-003** | Commercial Offset Limit | Standard Commercial Date is Technical proposals date + **12 days** | `TimelineCalculator.ts` | [Pre-Award Requirements](./PROJECT_BOOK.md#32-module-b-pre-award-proposals-tenders) |
| **BR-CON-002** | Currency Standardization | Converts all local vouchers dynamically to UAE Dirhams (AED) | `FinancialsCalculator.ts` | [Project Execution Requirements](./PROJECT_BOOK.md#33-module-c-post-award-project-execution-project-controls) |
| **BR-CON-001** | Ledger Separation | Segregates transactional models (IPCs, Claims, VOs, NOCs) on DB schemas | `ProjectControlsRepository` | [Project Execution Requirements](./PROJECT_BOOK.md#33-module-c-post-award-project-execution-project-controls) |
| **BR-DB-001** | Analytics Caching | Executive dashboard KPI views cache dynamically for **60 seconds** | `DashboardService.ts` | [Dashboard Requirements](./PROJECT_BOOK.md#31-module-a-executive-analytics-dashboard-dashboard) |
| **BR-DOC-001** | Double-Audit checks | Makers-checkers approvals flow required prior to document releases | `DocumentService.ts` | [Document Control Requirements](./PROJECT_BOOK.md#34-module-d-engineering-document-control-document-control) |

---

## 2. Policy Decoupling Constraints

To ensure absolute design sustainability, all mathematics catalogued above are strictly barred from React UI components. Developers must enforce these decoupled interfaces:

```
[React View] ──► [Orchestration Service] ──► [Pure TypeScript Calculator]
```

To review physical repository mapping parameters, see the [Repository Mapping Matrix (PROJECT_BOOK.md#8-repository-mapping-matrix)](./PROJECT_BOOK.md#8-repository-mapping-matrix).
