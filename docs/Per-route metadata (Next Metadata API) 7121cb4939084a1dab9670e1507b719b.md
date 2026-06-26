# Per-route metadata (Next Metadata API)

Acceptance Criteria: Every route exports title/description/canonical via Metadata API; project/news use generateMetadata from CMS; no duplicate titles.
Dependencies: P06-007,P08-005
Estimated Time: 2h
Files to Create/Edit: app//page.tsx (generateMetadata), lib/seo.ts
Phase: Phase 09 — SEO
Priority: High
QA Checklist: - [ ] Unique title/desc per route
- [ ] Canonical set
- [ ] Dynamic routes use CMS data
Status: Not started
Task ID: P09-001