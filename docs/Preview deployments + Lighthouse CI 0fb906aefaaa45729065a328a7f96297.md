# Preview deployments + Lighthouse CI

Acceptance Criteria: Each PR gets a Vercel preview; Lighthouse CI runs against preview and fails build if any category < 95.
Dependencies: P12-001,P12-002
Estimated Time: 1.5h
Files to Create/Edit: .github/workflows/lhci.yml, lighthouserc.js
Priority: Medium
QA Checklist: - [ ] Preview per PR
- [ ] LHCI gate at 95
- [ ] Report on PR
Status: Not started
Task ID: P12-003