# Image optimization pass

Acceptance Criteria: All images via next/image, AVIF/WebP, correct sizes/priority; LCP image preloaded; zero CLS from media.
Dependencies: P07-004
Estimated Time: 2h
Files to Create/Edit: next.config.ts, components/ui/SmartImage.tsx
Phase: Phase 10 — Performance
Priority: High
QA Checklist: - [ ] AVIF/WebP served
- [ ] LCP image priority
- [ ] CLS < 0.1
Status: Not started
Task ID: P10-001