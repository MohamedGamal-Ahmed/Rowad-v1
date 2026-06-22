# ROWAD Enterprise - Core Architecture Map

This document visually maps the system architecture, directory structures, layer boundaries, and dynamic transaction flows.

---

## 1. Directory Dependencies Map

```mermaid
graph TD
  Views[src/views/ - Stateless React UI]
  Services[src/services/ - Application Orchestrator Layer]
  Repos[src/repositories/ - Infrastructure/Persistence Adapters]
  Mappers[src/mappers/ - Bidirectional DTO Translators]
  Domain[src/domain/ - Core Aggregates and Models]
  Calculators[src/business-rules/ - Pure Math Calculators]

  Views --> |Call Services only| Services
  Services --> |Manage Repositories| Repos
  Services --> |Engage Calculators| Calculators
  Repos --> |Invoke Mappers| Mappers
  Mappers --> |Generate Domain Models| Domain
  Mappers --> |Use Business Calculators| Calculators
```

---

## 2. Dynamic Sequence: Dashboard KPI Refresh

```mermaid
sequenceDiagram
  autonumber
  actor User as Executive User
  participant React as /src/views/Dashboard.tsx
  participant DBService as /src/services/DashboardService.ts
  participant Cache as /src/services/CacheService.ts
  participant Repos as Repositories Layer

  User->>React: Mount Dashboard / Refresh Click
  React->>DBService: getDashboardMetrics()
  DBService->>Cache: get("executive_dashboard_kpis_cache_key")
  
  alt Cache Hit - Zero Latency Ready
    Cache-->>DBService: Return Cached KPIs Summary
  else Cache Miss - Fetch & Calculate
    DBService->>Repos: Fetch active pre-award & project records
    Repos-->>DBService: Return raw lists
    DBService->>DBService: Compute sums, safety ratios, and health
    DBService->>Cache: set("executive_dashboard_kpis_cache_key", calculatedVal, 60s)
  end

  DBService-->>React: Return verified KPI statistics
  React->>User: Render polished graphics & charts
```

---

## 3. Dynamic Sequence: Proposal Wizard Submit

```mermaid
sequenceDiagram
  autonumber
  actor User as Estimator / Tender Coordinator
  participant UI as /src/views/OngoingTenders.tsx
  participant Service as /src/services/TenderService.ts
  participant Validator as /src/business-rules/Validators.ts
  participant Mapper as /src/mappers/TenderMapper.ts
  participant Repos as /src/repositories/TenderRepository.ts

  User->>UI: Enter step fields & submit proposal
  UI->>Service: commitLegacyTender(legacyFormObj)
  Service->>Mapper: toDomain(legacyFormObj)
  Mapper-->>Service: Return Tender Domain Aggregate
  Service->>Validator: Validate tender entity schema
  
  alt Schema Valid
    Service->>Repos: Save domain tender instance
    Repos-->>Service: Commit Successful
    Service-->>UI: Return Success Flag
    UI->>User: Display success modal & update lists
  else Exception / Invalid Inputs
    Validator-->>Service: Throw Validation Errors list
    Service-->>UI: Return Failed status with errors
    UI->>User: Render highlight input errors
  end
```

---

## 4. Layer Isolation Guardrails

* **The UI Boundary**: React components are entirely isolated from low-level storage frameworks (SQL/REST, localStorage, or state machines).
* **The Business Boundary**: All core models live inside pure TypeScript structures. No framework dependencies (React, state managers, etc.) are allowed here.
