# Phase 08A Build — CMS Foundation (Sanity) (Output)

---

## 18. Final Reconciliation addendum (CMS Foundation v1.0)

*Resolves the two items flagged in the CMS Foundation QA Freeze. **Additive code only** — no frozen interface, component, or (beyond the two `defineField` option lists) schema behavior changes.*

### 18.1 Enum wiring — single source of truth

`lib/project.ts` owns the unions; we add two **additive** const exports derived from the existing label maps, and the schema consumes them. No enum literals are ever re-typed in Sanity.

```tsx
// FILE: lib/project.ts  (ADDITIVE EXPORTS ONLY — no type/interface change)
// Unions ProjectCategory / ProjectStatusValue and the label maps already exist (FROZEN).
export const PROJECT_CATEGORIES = Object.keys(CATEGORY_LABELS) as ProjectCategory[]
export const PROJECT_STATUSES = Object.keys(STATUS_LABELS) as ProjectStatusValue[]
```

```tsx
// FILE: schemas/documents/project.ts  (consume the constants — never re-declare values)
import { defineField, defineType } from "sanity"
import {
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  CATEGORY_LABELS,
  STATUS_LABELS,
} from "@/lib/project"

// inside defineType("project").fields:
defineField({
  name: "category",
  title: "Category",
  type: "string",
  options: {
    list: PROJECT_CATEGORIES.map((value) => ({ value, title: CATEGORY_LABELS[value] })),
    layout: "dropdown",
  },
  validation: (rule) => rule.required(),
}),
defineField({
  name: "status",
  title: "Status",
  type: "string",
  options: {
    list: PROJECT_STATUSES.map((value) => ({ value, title: STATUS_LABELS[value] })),
    layout: "dropdown",
  },
}),
```

> Result: a category/status value added in `lib/project.ts` automatically appears in Studio. The adapter casts (`doc.category as Project["category"]`) are now provably safe because the option list and the union share one origin.
> 

### 18.2 `*Content` adapters — finalized & confirmed field-for-field

Reviewed all six `*Content` mappers against the frozen `*Data` contracts (Additive Optional Field Registry, schema v1.6.0). The mappers in **§10 (`adapters/projectSections.ts`) are the final, reconciled versions**; the only required changes were on the **adapter side** (key names + guarded defaults). No frozen interface, component, or schema field was changed.

| `*Content` adapter | Frozen target | Reconciliation performed | State |
| --- | --- | --- | --- |
| `toOverviewContent` | `ProjectOverviewData` | `eyebrow?`, `heading`, `description`, `quote?{text,attribution?}` (guarded on `text`), `highlights[]{id←_key,title,description}`, `metrics[]{id←_key,label,value}` | ✅ Resolved |
| `toAmenitiesContent` | `ProjectAmenitiesData` | `categories[]{id←_key,title,items[]{id←_key,label,description?}}`, `lifestyleHighlights[]{id←_key,title,description}`, `featureImage?` (OrNull), `featureStat?{value,label}` (guarded on `value`) | ✅ Resolved |
| `toGalleryContent` | `ProjectGalleryData` | `featuredMedia?` (OrNull), `categories[]`, `items[]{id←_key,type(mediaType→image\ | video),image,videoUrl?,category?,caption?}` |
| `toLocationContent` | `ProjectLocationData` | confirmed 1:1 (destinationCategories/travelMetrics re-keyed, image + mapImage?) | ✅ Resolved |
| `toInvestmentContent` | `ProjectInvestmentData` | `ownershipJourney[]`, `highlights[]{id,title,detail}`, `cards[]`, `ownershipModel{title,summary,points[]}`, `metrics[]`, `cta?` | ✅ Resolved |
| `toClosingContent` | `ProjectClosingData` | confirmed 1:1 (resources + related`{summary,location}`  • finalInquiry`{ctas,contactMethods}`) | ✅ Resolved |

**Binding check:** `npx tsc --noEmit` is the authoritative gate — because each adapter is typed `(src: SanityProject["<field>"]) => Project<X>Data`, any remaining field-name drift is a compile error, not a runtime surprise. Run it locally (§15 / QA Freeze §10).

⏭️ This addendum closes Phase 08A. See the **CMS Foundation — QA Freeze** for the v1.0 freeze record.