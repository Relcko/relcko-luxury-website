# CI pipeline (lint/type/test/build)

Acceptance Criteria: CI runs lint, type-check, unit + E2E, and build on PRs; blocks merge on failure; caches deps for speed.
Dependencies: P11-003
Estimated Time: 1.5h
Files to Create/Edit: .github/workflows/ci.yml
Priority: High
QA Checklist: - [ ] CI blocks on failure
- [ ] All gates run
- [ ] Dep caching works
Status: Not started
Task ID: P12-002