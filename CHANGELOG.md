# Changelog

All notable changes to the **ROWAD Enterprise Platform** will be documented in this file.

## [1.2.0] - 2026-06-24

### Added
- **Architecture Baseline Report v1.0**: Formulated the central `/docs/ai/ARCHITECTURE_BASELINE_v1.0.md` certifying the entire platform framework, including a Service Dependency Matrix, Repository Readiness Report, Business Rules Coverage Report, and Backend Readiness Assessment.
- **Technical Debt Report v2**: Updated structural and security trade-offs, categorizing remaining debts by impact, risk, and recommended solutions.
- **Backend Readiness Specifications**: Prepared structural models, expected database tables, REST API routing, and Pydantic DTO contracts to ensure seamless FastAPI/PostgreSQL pivot integration.

### Verified
- **0.0% Circular Dependencies**: Audited service communications, ensuring complete orchestration segregation.
- **Settings Dynamic Parameterization**: Confirmed that all business rules, timeline offsets, financial parameters, and working calendars are governed dynamically by the Admin Settings panel.

## [1.1.0] - 2026-06-24

### Fixed
- **Priority Mapping Bug**: Resolved an issue in `TenderMapper` where priority was incorrectly mapped to `Priority.LOW` instead of `Priority.MEDIUM` when it was undefined, fixing the assertion error in the lightweight validation test suite.
- **Positive Offset Vulnerability**: Resolved the administrative settings vulnerability by integrating `SettingsValidator.validate` inside `SettingsView` (in `src/views/Settings.tsx`). Now, any configuration with a positive offset is correctly flagged and prevented from updating state.

### Added
- **UI Validation Panel**: Added a modern error alerting container to the Administration tab in `SettingsView` to display validation failures in both English and Arabic dynamically based on the active language.
