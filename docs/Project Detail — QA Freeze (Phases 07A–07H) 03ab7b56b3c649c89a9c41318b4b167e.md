# Project Detail — QA Freeze (Phases 07A–07H)

---

## 6. Roadmap reconciliation — migration summary

**Date:** 26 Jun 2026. The implementation Task DB has been reconciled so the roadmap reflects the architecture that was actually built, without losing history.

### Which items were superseded

The original **Phase 07 — Gallery** rows are retained (IDs preserved, not deleted) and re-statused to **Superseded**:

- `P07-001` Masonry gallery layout
- `P07-002` Lightbox viewer
- `P07-003` Gallery category filtering
- `P07-004` Lazy image loading + blur placeholders
- `P07-005` Subtle particle / WebGL accents

Each superseded row now carries an inline note pointing to the new roadmap and this freeze page.

### New implementation section

A new **Phase 07 — Project Detail** section mirrors the build phases, all marked **Done** and cross-referenced to their Build pages:

| ID | Phase | Build page |
| --- | --- | --- |
| `P07A` | Project Detail Architecture | [07A Build](Phase%2007A%20Build%20%E2%80%94%20Dynamic%20Project%20Detail%20Architect%203a4efe3adfdb42a2acf27b43ab1082b3.md) |
| `P07B` | Premium Project Hero | [07B Build](Phase%2007B%20Build%20%E2%80%94%20Premium%20Project%20Hero%20(Output)%205e9ad26b477042088cb679ef58c1c97d.md) |
| `P07C` | Project Overview & Highlights | [07C Build](Phase%2007C%20Build%20%E2%80%94%20Project%20Overview%20&%20Highlights%20(O%207109de7fab1b4ae2b55437755e1adc1a.md) |
| `P07D` | Amenities & Lifestyle | [07D Build](https://app.notion.com/p/notion-319-PLACEHOLDER) |
| `P07E` | Immersive Gallery & Media | [07E Build](https://app.notion.com/p/notion-322-PLACEHOLDER) |
| `P07F` | Location & Connectivity | [07F Build](Phase%2007F%20Build%20%E2%80%94%20Location%20&%20Connectivity%20(Output)%20a03e36b4f69d45acb06f3f5d46eda461.md) |
| `P07G` | Investment & Digital Ownership | [07G Build](Phase%2007G%20Build%20%E2%80%94%20Investment%20&%20Digital%20Ownership%20(%208757d0034378405d82da9bab92d168b8.md) |
| `P07H` | Resources, Related Projects & Final Inquiry | [07H Build](Phase%2007H%20Build%20%E2%80%94%20Resources,%20Related%20&%20Final%20Inqui%202e5c0074cccf4021b66c8a4d76d6fea9.md) |

### Why the architecture evolved

The original roadmap framed Phase 07 as a **standalone masonry/lightbox gallery feature**. In implementation, the project work became a **dynamic, CMS-ready project *detail page** *at `app/projects/[slug]/` composed of editorial sections (hero, overview, amenities, gallery, location, investment, resources/related/final-inquiry). The gallery became one* editorial section* of that page (placeholder media grid) rather than a separate masonry/lightbox/WebGL feature — so the original gallery rows no longer describe the shipped architecture. The detail-page approach was chosen for reusability, strict typing, additive-optional CMS extensibility, and consistent premium motion across the whole page.

### How future phases should reference the roadmap

- Treat **Phase 07 — Project Detail** (`P07A`–`P07H`) as the canonical, current record of project-detail work.
- Treat **Phase 07 — Gallery** (`P07-00x`, Superseded) as historical context only — do not build against it.
- A future standalone masonry/lightbox gallery, if desired, should be filed as a **new** phase/rows, not a revival of the superseded IDs.
- Reference the build specifics via each row's linked **Build page** and the dependency map / schema in this freeze document.

<aside>
🧊

**Roadmap frozen — 26 Jun 2026.** The Phase 07 roadmap is reconciled and locked: superseded IDs preserved for history, `P07A`–`P07H` marked Done and cross-linked. No further roadmap edits to Phase 07 before Phase 08. New work starts at **Phase 08 — CMS** (next select option in the Task DB).

</aside>