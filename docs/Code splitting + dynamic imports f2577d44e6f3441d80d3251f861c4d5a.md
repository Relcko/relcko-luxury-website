# Code splitting + dynamic imports

Acceptance Criteria: All Three.js scenes + heavy client components dynamically imported (ssr:false where needed); RSC kept server-only; client bundle minimized.
Dependencies: P04-006
Estimated Time: 2h
Files to Create/Edit: components/three/, components/sections/
Phase: Phase 10 — Performance
Priority: High
QA Checklist: - [ ] 3D lazy-loaded
- [ ] No heavy client in RSC
- [ ] Reduced JS on initial load
Status: Not started
Task ID: P10-002