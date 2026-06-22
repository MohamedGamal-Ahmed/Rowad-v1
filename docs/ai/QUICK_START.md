# ROWAD Enterprise - AI & Developer Quick Start Guide

Welcome to the **ROWAD Enterprise Platform**. This guide provides a rapid 5-minute onboarding path explaining the core architecture, execution flows, and key constraints.

---

## 1. Core Architecture Blueprint

ROWAD separates structural business rules from decorative presentation layouts. The dependency flow is strictly unidirectional:

```
[React View] ──► [Application Service] ──► [Repository Layer] ──► [Mapper] ──► [Pure Domain Model / Rules]
```

* **React Components**: Strictly for rendering. They trigger actions and display state.
* **Services**: Orchestrates database queries and business logic transactions.
* **Repositories**: Manages local memory emulators, ready for REST API adapters.
* **Mappers**: Bidirectional data translation between Domain aggregates and persistent legacy/DTO objects.

---

## 2. Immediate Diagnostic Checks

To verify code health, execute:

```bash
# Run the fast typescript compiler and linter
npm run lint
```

Make sure that **Zero TypeScript Errors** and **Zero ESLint Warnings** are maintained.

---

## 3. The Coding Commandments (Must Never Break)

1. **Zero Math inside React**: Calculations, offsets, currency formatting, and state formulas belong in `/src/business-rules/` or separate services.
2. **Never Import Repositories directly in React**: UI elements must never know databases or repositories exist. Always invoke through `src/services/`.
3. **No Const Enums**: Use standard TypeScript `enum` declarations. All imports must reside at the top of file headers.

---

## 4. Key Orchestration Files

* **`DashboardService`**: Resolves combined KPIs across pre-award plans and execution ledgers. Contains real-time cache configurations.
* **`TenderService`**: Connects wizard data structures to validation rules and maps outputs to repositories.
* **`ProjectControlsService`**: Manages site transaction structures (IPCs, Claims, Variation Orders).
* **`FinancialsCalculator` / `TimelineCalculator`**: Pure typescript math libraries.

---

Now, you are ready to begin contribution. Always verify system compilation using `compile_applet` before finalizing tasks.
