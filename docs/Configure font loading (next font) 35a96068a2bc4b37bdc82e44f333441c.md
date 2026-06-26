# Configure font loading (next/font)

Acceptance Criteria: Display + body fonts loaded via next/font with display:swap; CSS variables exposed for Tailwind; fallback metrics set to avoid layout shift.
Dependencies: P01-006
Estimated Time: 1h
Files to Create/Edit: lib/fonts.ts, app/layout.tsx
Phase: Phase 01 — Project Foundation
Priority: Medium
QA Checklist: - [ ] Fonts self-hosted via next/font
- [ ] No CLS from font swap
- [ ] Heading vs body fonts distinct
Status: Not started
Task ID: P01-008