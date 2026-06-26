# Animation performance audit (60 FPS)

Acceptance Criteria: All animations use transform/opacity (GPU); no layout thrash; ScrollTriggers refreshed/cleaned; verified 60 FPS in DevTools on mid-tier laptop.
Dependencies: P05-001
Estimated Time: 2h
Files to Create/Edit: components/, hooks/
Phase: Phase 10 — Performance
Priority: High
QA Checklist: - [ ] No layout-triggering props animated
- [ ] 60 FPS in profiler
- [ ] Triggers cleaned up
Status: Not started
Task ID: P10-005