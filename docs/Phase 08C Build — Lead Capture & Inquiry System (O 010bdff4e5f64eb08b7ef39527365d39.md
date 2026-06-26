# Phase 08C Build — Lead Capture & Inquiry System (Output)

<aside>
📐

**Read first — frozen architecture is the single source of truth.** Before touching code, read: (1) Refined Build Spec, (2) Claude Code Master Prompt, (3) CMS Foundation QA Freeze (08A **v1.0**), (4) SEO & Metadata QA Freeze (08B **v1.0**). **Do not modify** homepage architecture, project architecture, components, adapters, queries, loaders, or `lib/project.ts`. CMS schemas are frozen — only **one additive optional** field is introduced (§10), and it is recorded in the CMS QA Freeze. Everything else in this phase is **net-new, additive code** under `components/forms/`, `lib/forms/`, `hooks/forms/`.

</aside>

<aside>
⚠️

**Capability boundary:** I author this build spec in Notion; I cannot run `npm`, `tsc`, ESLint, or a dev server. All compile/lint/runtime checks (§verify) are yours to run locally.

</aside>

## §1. Objective & scope

Build a **premium, reusable lead-capture system** that collects qualified enquiries. **No payment, no auth, no CRM** — delivery is a **placeholder sink** behind a pluggable interface. The architecture is **server-first**: native HTML forms + **Next.js Server Actions** + React 19 `useActionState`/`useFormStatus`, so forms work with **progressive enhancement** (functional without client JS) and ship **minimal client JavaScript**.

**Five inquiry flows (one shared engine):**

| Flow | Component | Required core fields |
| --- | --- | --- |
| General enquiry | `InquiryForm` | name, email, message, consent |
| Request a callback | `CallbackForm` | name, phone, preferred time |
| Schedule a consultation | `ConsultationForm` | name, email, phone, date, time, mode |
| Download brochure | `BrochureRequestForm` | name, email, consent (+ project context) |
| Project-specific enquiry | `ProjectInquiryForm` | name, email, message + project slug/title |

**Build ONLY this phase.** Do **not** build: route pages that mount these forms (08D+), email/CRM providers, real rate-limit store (Redis/Upstash), analytics, captcha vendor wiring.

## §2. Dependencies

```bash
npm install zod
```

- **`zod`** — single typed validation source shared by client hints and server validation. No form library (react-hook-form/formik) — native forms + Server Actions keep client JS minimal and progressive enhancement intact.
- React 19 / Next 15 App Router APIs only: `useActionState`, `useFormStatus`, Server Actions (`"use server"`). No new runtime deps beyond zod.

## §3. Folder tree (all additive)

```
lib/forms/
  types.ts          # shared types: InquiryType, FormResult, FieldErrors
  schemas.ts        # zod schemas per flow (+ inferred types)
  copy.ts           # FormCopy + DEFAULT_FORM_COPY + resolveFormCopy
  security.ts       # honeypot + timing + origin/CSRF-ready helpers
  rateLimit.ts      # RateLimiter interface + in-memory placeholder
  parse.ts          # FormData -> typed result via zod safeParse
  delivery.ts       # LeadSink interface + placeholder deliverLead
  actions.ts        # "use server" actions (one per flow)
  index.ts          # barrel
hooks/forms/
  useInquiryForm.ts # wraps useActionState (state + formAction + pending)
  useFieldErrors.ts # field error + aria wiring helpers
  useFocusOnResult.ts # focus mgmt: error summary / success on result
  index.ts          # barrel
components/forms/
  FormField.tsx     # label + control + error, fully a11y-wired
  SubmitButton.tsx  # useFormStatus pending + aria-busy
  SuccessMessage.tsx# role=status live region
  ErrorMessage.tsx  # role=alert live region
  Honeypot.tsx      # visually-hidden trap + timestamp
  FormStatusRegion.tsx # success/error switch + focus target
  InquiryForm.tsx
  CallbackForm.tsx
  ConsultationForm.tsx
  BrochureRequestForm.tsx
  ProjectInquiryForm.tsx
  index.ts          # barrel
adapters/settings/   # (08A, additive only) toFormCopy mapping
```

## §4. `lib/forms/types.ts`

```tsx
export const INQUIRY_TYPES = [
	"general",
	"callback",
	"consultation",
	"brochure",
	"project",
] as const

export type InquiryType = (typeof INQUIRY_TYPES)[number]

/** zod flatten() field-error shape: one array of messages per field. */
export type FieldErrors = Record<string, string[] | undefined>

/**
 * Discriminated result returned by every Server Action and consumed by
 * useActionState. `idle` is the initial state before first submit.
 */
export type FormResult =
	| { status: "idle" }
	| { status: "success"; message?: string }
	| {
			status: "error"
			message?: string
			/** Per-field validation messages (client re-render). */
			fieldErrors?: FieldErrors
			/** Non-field error (rate limit, delivery failure, bot). */
			formError?: string
	  }

export const IDLE_RESULT: FormResult = { status: "idle" }

/** Server Action signature compatible with useActionState. */
export type FormAction = (
	prevState: FormResult,
	formData: FormData,
) => Promise<FormResult>
```

## §5. `lib/forms/schemas.ts`

One shared field vocabulary; each flow composes from it. Inferred types are exported for the action layer.

```tsx
import { z } from "zod"

// --- shared, reusable field validators ---
const fullName = z
	.string()
	.trim()
	.min(2, "Please enter your name.")
	.max(80, "Name is too long.")

const email = z
	.string()
	.trim()
	.toLowerCase()
	.email("Enter a valid email address.")
	.max(160)

const phoneRequired = z
	.string()
	.trim()
	.min(7, "Enter a valid phone number.")
	.max(24)
	.regex(/^[+()\-\s\d]+$/, "Enter a valid phone number.")

const phoneOptional = z
	.union([phoneRequired, z.literal("")])
	.optional()
	.transform((v) => (v ? v : undefined))

const message = z
	.string()
	.trim()
	.min(10, "Please add a little more detail.")
	.max(2000, "Message is too long.")

const consent = z
	.union([z.literal("on"), z.literal("true"), z.literal(true)])
	.refine((v) => v === "on" || v === "true" || v === true, {
		message: "Please accept to continue.",
	})

export const PREFERRED_TIMES = ["morning", "afternoon", "evening"] as const
export const CONSULTATION_MODES = ["in-person", "virtual", "phone"] as const

const preferredTime = z.enum(PREFERRED_TIMES)
const consultationMode = z.enum(CONSULTATION_MODES)

// --- per-flow schemas (security fields handled separately in parse.ts) ---
export const inquirySchema = z.object({
	fullName,
	email,
	phone: phoneOptional,
	message,
	consent,
})

export const callbackSchema = z.object({
	fullName,
	phone: phoneRequired,
	email: z.union([email, z.literal("")]).optional(),
	preferredTime,
})

export const consultationSchema = z.object({
	fullName,
	email,
	phone: phoneRequired,
	preferredDate: z.string().trim().min(1, "Choose a date."),
	preferredTime,
	mode: consultationMode,
	message: z.union([message, z.literal("")]).optional(),
})

export const brochureRequestSchema = z.object({
	fullName,
	email,
	consent,
	projectSlug: z.string().trim().optional(),
	projectTitle: z.string().trim().optional(),
})

export const projectInquirySchema = z.object({
	fullName,
	email,
	phone: phoneOptional,
	message,
	projectSlug: z.string().trim().min(1),
	projectTitle: z.string().trim().optional(),
})

export const SCHEMAS = {
	general: inquirySchema,
	callback: callbackSchema,
	consultation: consultationSchema,
	brochure: brochureRequestSchema,
	project: projectInquirySchema,
} as const

export type InquiryValues = z.infer<typeof inquirySchema>
export type CallbackValues = z.infer<typeof callbackSchema>
export type ConsultationValues = z.infer<typeof consultationSchema>
export type BrochureRequestValues = z.infer<typeof brochureRequestSchema>
export type ProjectInquiryValues = z.infer<typeof projectInquirySchema>
```

## §6. `lib/forms/copy.ts` — CMS-ready copy with code defaults

Forms are **fully functional with zero CMS changes** (defaults below). The optional CMS field in §10 only *overrides* this copy.

```tsx
export interface FormCopy {
	submitLabel: string
	successTitle: string
	successMessage: string
	errorTitle: string
	errorMessage: string
	disclaimer?: string
}

export const DEFAULT_FORM_COPY: FormCopy = {
	submitLabel: "Send enquiry",
	successTitle: "Thank you",
	successMessage:
		"Your enquiry has been received. A member of our team will be in touch shortly.",
	errorTitle: "Something went wrong",
	errorMessage:
		"We couldn’t submit your enquiry. Please review the form and try again.",
	disclaimer: undefined,
}

/** Merge partial CMS copy over code defaults; ignores empty strings. */
export function resolveFormCopy(partial?: Partial<FormCopy> | null): FormCopy {
	if (!partial) return DEFAULT_FORM_COPY
	const clean = Object.fromEntries(
		Object.entries(partial).filter(([, v]) => typeof v === "string" && v.length > 0),
	)
	return { ...DEFAULT_FORM_COPY, ...clean }
}
```

## §7. `lib/forms/security.ts` — spam & bot mitigation (no external services)

Three layered defences, all server-side and dependency-free:

1. **Honeypot** — a visually-hidden field real users never fill; any value = bot.
2. **Timing trap** — a render timestamp; submissions faster than `MIN_FILL_MS` are bots.
3. **Origin check** — CSRF-ready same-origin guard using request headers (real token store is a later phase).

```tsx
import { headers } from "next/headers"

/** Hidden field name + timing field name. Imported by Honeypot.tsx + parse.ts. */
export const HONEYPOT_FIELD = "company"
export const TIMESTAMP_FIELD = "renderedAt"

/** Minimum plausible human fill time; faster = bot. */
export const MIN_FILL_MS = 1500
/** Stale forms (left open for hours) are rejected to bound replay. */
export const MAX_FORM_AGE_MS = 1000 * 60 * 60 * 6

export type BotSignal = "honeypot" | "too-fast" | "stale" | null

/** Pure check — unit-testable, no I/O. */
export function detectBot(input: {
	honeypot: string | null
	renderedAt: number | null
	now?: number
}): BotSignal {
	if (input.honeypot && input.honeypot.trim().length > 0) return "honeypot"
	const now = input.now ?? Date.now()
	if (input.renderedAt != null) {
		const age = now - input.renderedAt
		if (age < MIN_FILL_MS) return "too-fast"
		if (age > MAX_FORM_AGE_MS) return "stale"
	}
	return null
}

/**
 * CSRF-ready same-origin guard. Next.js Server Actions already enforce a POST
 * origin check; this is an explicit, auditable second layer and the seam where
 * a signed-token check will plug in later.
 */
export async function assertSameOrigin(): Promise<boolean> {
	const h = await headers()
	const origin = h.get("origin")
	const host = h.get("host")
	if (!origin || !host) return true // non-browser / SSR fetch: don't hard-fail
	try {
		return new URL(origin).host === host
	} catch {
		return false
	}
}
```

## §8. `lib/forms/rateLimit.ts` — pluggable limiter (in-memory placeholder)

Interface-first so a Redis/Upstash limiter drops in later without touching call sites.

```tsx
export interface RateLimitResult {
	success: boolean
	remaining: number
	resetAt: number
}

export interface RateLimiter {
	check(key: string): Promise<RateLimitResult>
}

/**
 * Placeholder fixed-window limiter. Per-process Map — NOT durable across
 * serverless instances; replace with a shared store in production.
 */
export function createInMemoryRateLimiter(
	limit = 5,
	windowMs = 1000 * 60 * 10,
): RateLimiter {
	const hits = new Map<string, { count: number; resetAt: number }>()
	return {
		async check(key) {
			const now = Date.now()
			const entry = hits.get(key)
			if (!entry || now > entry.resetAt) {
				const resetAt = now + windowMs
				hits.set(key, { count: 1, resetAt })
				return { success: true, remaining: limit - 1, resetAt }
			}
			entry.count += 1
			const success = entry.count <= limit
			return {
				success,
				remaining: Math.max(0, limit - entry.count),
				resetAt: entry.resetAt,
			}
		},
	}
}

/** Shared singleton for the action layer. */
export const inquiryRateLimiter = createInMemoryRateLimiter()

/** Best-effort client key from proxy headers. */
export function clientKeyFromHeaders(h: Headers, scope: string): string {
	const fwd = h.get("x-forwarded-for")
	const ip = fwd ? fwd.split(",")[0].trim() : h.get("x-real-ip") ?? "unknown"
	return `${scope}:${ip}`
}
```

## §9. `lib/forms/parse.ts` + `lib/forms/delivery.ts`

`parse.ts` strips security fields, runs the flow schema with `safeParse`, and returns a typed union the action layer can branch on.

```tsx
import type { z } from "zod"
import type { FieldErrors } from "./types"
import { HONEYPOT_FIELD, TIMESTAMP_FIELD } from "./security"

export type ParseOutcome<T> =
	| { ok: true; data: T; security: { honeypot: string | null; renderedAt: number | null } }
	| { ok: false; fieldErrors: FieldErrors }

/** Extract raw values (minus security fields) from FormData. */
function toRecord(formData: FormData): Record<string, unknown> {
	const out: Record<string, unknown> = {}
	for (const [key, value] of formData.entries()) {
		if (key === HONEYPOT_FIELD || key === TIMESTAMP_FIELD) continue
		out[key] = typeof value === "string" ? value : undefined
	}
	return out
}

export function parseForm<T>(
	schema: z.ZodType<T>,
	formData: FormData,
): ParseOutcome<T> {
	const raw = formData.get(TIMESTAMP_FIELD)
	const renderedAt = typeof raw === "string" && raw ? Number(raw) : null
	const honeypotValue = formData.get(HONEYPOT_FIELD)
	const honeypot = typeof honeypotValue === "string" ? honeypotValue : null

	const parsed = schema.safeParse(toRecord(formData))
	if (!parsed.success) {
		const flat = parsed.error.flatten()
		return { ok: false, fieldErrors: flat.fieldErrors as FieldErrors }
	}
	return {
		ok: true,
		data: parsed.data,
		security: { honeypot, renderedAt: Number.isFinite(renderedAt) ? renderedAt : null },
	}
}
```

`delivery.ts` is the **placeholder integration** — a `LeadSink` interface with a logging implementation. Swapping in email/CRM later means one new sink, no call-site changes.

```tsx
import type { InquiryType } from "./types"

export interface LeadPayload {
	type: InquiryType
	fields: Record<string, unknown>
	receivedAt: string
}

export interface LeadSink {
	deliver(payload: LeadPayload): Promise<void>
}

/** Placeholder sink: structured server log. Replace with email/CRM later. */
export const consoleLeadSink: LeadSink = {
	async deliver(payload) {
		// eslint-disable-next-line no-console
		console.info("[lead] received", JSON.stringify(payload))
	},
}

export async function deliverLead(
	type: InquiryType,
	fields: Record<string, unknown>,
	sink: LeadSink = consoleLeadSink,
): Promise<void> {
	await sink.deliver({ type, fields, receivedAt: new Date().toISOString() })
}
```

## §10 preview — §11. `lib/forms/actions.ts` — the Server Actions layer

One generic engine + five thin typed wrappers. Each action: same-origin → rate limit → parse → bot check → deliver → typed `FormResult`. Never throws to the client; always returns a `FormResult`.

```tsx
"use server"

import { headers } from "next/headers"
import type { z } from "zod"
import type { FormResult, InquiryType } from "./types"
import {
	SCHEMAS,
	type InquiryValues,
	type CallbackValues,
	type ConsultationValues,
	type BrochureRequestValues,
	type ProjectInquiryValues,
} from "./schemas"
import { parseForm } from "./parse"
import { deliverLead } from "./delivery"
import { detectBot, assertSameOrigin } from "./security"
import { inquiryRateLimiter, clientKeyFromHeaders } from "./rateLimit"

async function runInquiry<T>(
	type: InquiryType,
	schema: z.ZodType<T>,
	formData: FormData,
): Promise<FormResult> {
	if (!(await assertSameOrigin())) {
		return { status: "error", formError: "Request blocked. Please reload and retry." }
	}

	const h = await headers()
	const rl = await inquiryRateLimiter.check(clientKeyFromHeaders(h, type))
	if (!rl.success) {
		return {
			status: "error",
			formError: "Too many submissions. Please try again a little later.",
		}
	}

	const parsed = parseForm(schema, formData)
	if (!parsed.ok) {
		return { status: "error", fieldErrors: parsed.fieldErrors }
	}

	// Bot mitigation runs AFTER validation so humans always get field errors
	// first, and we never reveal the honeypot to legitimate users.
	const bot = detectBot({
		honeypot: parsed.security.honeypot,
		renderedAt: parsed.security.renderedAt,
	})
	if (bot) {
		// Silently succeed: deny the bot feedback while logging the signal.
		// eslint-disable-next-line no-console
		console.warn("[lead] bot signal", bot)
		return { status: "success" }
	}

	try {
		await deliverLead(type, parsed.data as Record<string, unknown>)
		return { status: "success" }
	} catch {
		return { status: "error", formError: "Delivery failed. Please try again." }
	}
}

// --- typed, named wrappers consumed by each form component ---
export async function submitInquiry(
	_prev: FormResult,
	formData: FormData,
): Promise<FormResult> {
	return runInquiry<InquiryValues>("general", SCHEMAS.general, formData)
}

export async function submitCallback(
	_prev: FormResult,
	formData: FormData,
): Promise<FormResult> {
	return runInquiry<CallbackValues>("callback", SCHEMAS.callback, formData)
}

export async function submitConsultation(
	_prev: FormResult,
	formData: FormData,
): Promise<FormResult> {
	return runInquiry<ConsultationValues>("consultation", SCHEMAS.consultation, formData)
}

export async function submitBrochureRequest(
	_prev: FormResult,
	formData: FormData,
): Promise<FormResult> {
	return runInquiry<BrochureRequestValues>("brochure", SCHEMAS.brochure, formData)
}

export async function submitProjectInquiry(
	_prev: FormResult,
	formData: FormData,
): Promise<FormResult> {
	return runInquiry<ProjectInquiryValues>("project", SCHEMAS.project, formData)
}
```

## §12. `hooks/forms/` — client state, errors, focus

Three tiny client hooks. They hold the **only** client JS in the system and are reused by every form.

```tsx
// hooks/forms/useInquiryForm.ts
"use client"

import { useActionState } from "react"
import type { FormAction } from "@/lib/forms/types"
import { IDLE_RESULT } from "@/lib/forms/types"

/** Binds a Server Action to React 19 form state. */
export function useInquiryForm(action: FormAction) {
	const [state, formAction, isPending] = useActionState(action, IDLE_RESULT)
	return { state, formAction, isPending }
}
```

```tsx
// hooks/forms/useFieldErrors.ts
import type { FormResult } from "@/lib/forms/types"

export function getFieldError(
	state: FormResult,
	name: string,
): string | undefined {
	if (state.status !== "error" || !state.fieldErrors) return undefined
	return state.fieldErrors[name]?.[0]
}

/** Returns the error + aria wiring for a single field. */
export function fieldErrorProps(state: FormResult, name: string) {
	const error = getFieldError(state, name)
	return { error, errorId: `${name}-error` } as const
}
```

```tsx
// hooks/forms/useFocusOnResult.ts
"use client"

import { useEffect, useRef } from "react"
import type { FormResult } from "@/lib/forms/types"

/** Moves focus to the status region when a submit resolves (a11y). */
export function useFocusOnResult(state: FormResult) {
	const regionRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		const shouldFocus =
			state.status === "success" ||
			(state.status === "error" && Boolean(state.formError))
		if (shouldFocus) regionRef.current?.focus()
	}, [state])
	return regionRef
}
```

```tsx
// hooks/forms/index.ts
export { useInquiryForm } from "./useInquiryForm"
export { getFieldError, fieldErrorProps } from "./useFieldErrors"
export { useFocusOnResult } from "./useFocusOnResult"
```

## §13. Primitive components — `components/forms/`

### `FormField.tsx` (server-safe; renders input/textarea/select with full a11y)

```tsx
import type { ReactNode } from "react"

export type FieldControl = "input" | "textarea" | "select"

export interface FormFieldProps {
	name: string
	label: string
	control?: FieldControl
	type?: string
	error?: string
	hint?: string
	required?: boolean
	placeholder?: string
	autoComplete?: string
	defaultValue?: string
	rows?: number
	options?: ReadonlyArray<{ value: string; label: string }>
	children?: ReactNode
}

export function FormField(props: FormFieldProps) {
	const {
		name,
		label,
		control = "input",
		type = "text",
		error,
		hint,
		required,
		placeholder,
		autoComplete,
		defaultValue,
		rows,
		options,
	} = props

	const errorId = `${name}-error`
	const hintId = `${name}-hint`
	const describedBy =
		[hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
		undefined

	const shared = {
		id: name,
		name,
		required,
		placeholder,
		autoComplete,
		"aria-invalid": error ? true : undefined,
		"aria-describedby": describedBy,
		className: "form-control",
	} as const

	return (
		<div className="form-field">
			<label htmlFor={name} className="form-label">
				{label}
				{required ? <span aria-hidden="true"> *</span> : null}
			</label>
			{hint ? (
				<p id={hintId} className="form-hint">
					{hint}
				</p>
			) : null}
			{control === "textarea" ? (
				<textarea {...shared} rows={rows ?? 5} defaultValue={defaultValue} />
			) : control === "select" ? (
				<select {...shared} defaultValue={defaultValue ?? ""}>
					{options?.map((o) => (
						<option key={o.value} value={o.value}>
							{o.label}
						</option>
					))}
				</select>
			) : (
				<input {...shared} type={type} defaultValue={defaultValue} />
			)}
			{error ? (
				<p id={errorId} className="form-error" role="alert">
					{error}
				</p>
			) : null}
		</div>
	)
}
```

### `SubmitButton.tsx` (loading state via `useFormStatus`)

```tsx
"use client"

import { useFormStatus } from "react-dom"

interface SubmitButtonProps {
	label: string
	pendingLabel?: string
}

export function SubmitButton(props: SubmitButtonProps) {
	const { label, pendingLabel = "Sending…" } = props
	const { pending } = useFormStatus()
	return (
		<button
			type="submit"
			className="form-submit"
			disabled={pending}
			aria-busy={pending}
		>
			{pending ? pendingLabel : label}
		</button>
	)
}
```

### `SuccessMessage.tsx` / `ErrorMessage.tsx` (live regions)

```tsx
// SuccessMessage.tsx
import type { ReactNode } from "react"

export function SuccessMessage(props: { title: string; children?: ReactNode }) {
	return (
		<div className="form-success" role="status" aria-live="polite">
			<p className="form-success-title">{props.title}</p>
			{props.children ? <p className="form-success-body">{props.children}</p> : null}
		</div>
	)
}
```

```tsx
// ErrorMessage.tsx
import type { ReactNode } from "react"

export function ErrorMessage(props: { title: string; children?: ReactNode }) {
	return (
		<div className="form-error-banner" role="alert" aria-live="assertive">
			<p className="form-error-title">{props.title}</p>
			{props.children ? <p className="form-error-body">{props.children}</p> : null}
		</div>
	)
}
```

### `Honeypot.tsx` (visually-hidden trap + timing field)

```tsx
"use client"

import { useEffect, useState } from "react"
import { HONEYPOT_FIELD, TIMESTAMP_FIELD } from "@/lib/forms/security"

/** Hidden from sighted + AT users; bots fill it. Timestamp powers the timing trap. */
export function Honeypot() {
	const [ts, setTs] = useState("")
	useEffect(() => {
		setTs(String(Date.now()))
	}, [])
	return (
		<div className="sr-only" aria-hidden="true">
			<label htmlFor={HONEYPOT_FIELD}>Company</label>
			<input
				id={HONEYPOT_FIELD}
				name={HONEYPOT_FIELD}
				type="text"
				tabIndex={-1}
				autoComplete="off"
				defaultValue=""
			/>
			<input type="hidden" name={TIMESTAMP_FIELD} value={ts} readOnly />
		</div>
	)
}
```

### `FormStatusRegion.tsx` (focus-managed success/error switch)

```tsx
"use client"

import type { FormResult } from "@/lib/forms/types"
import type { FormCopy } from "@/lib/forms/copy"
import { useFocusOnResult } from "@/hooks/forms"
import { SuccessMessage } from "./SuccessMessage"
import { ErrorMessage } from "./ErrorMessage"

export function FormStatusRegion(props: { state: FormResult; copy: FormCopy }) {
	const { state, copy } = props
	const regionRef = useFocusOnResult(state)
	return (
		<div ref={regionRef} tabIndex={-1} className="form-status-region">
			{state.status === "success" ? (
				<SuccessMessage title={copy.successTitle}>
					{state.message ?? copy.successMessage}
				</SuccessMessage>
			) : null}
			{state.status === "error" && state.formError ? (
				<ErrorMessage title={copy.errorTitle}>{state.formError}</ErrorMessage>
			) : null}
		</div>
	)
}
```

### Styles (`app/globals.css` — additive, uses frozen design tokens)

```css
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

.form-field { display: flex; flex-direction: column; gap: 0.375rem; margin-bottom: 1rem; }
.form-label { font-size: 0.875rem; color: var(--text-primary); }
.form-hint { font-size: 0.8125rem; color: var(--text-muted); }
.form-control {
	background: var(--bg-elevated);
	border: 1px solid var(--border);
	border-radius: 0.5rem;
	padding: 0.75rem 0.875rem;
	color: var(--text-primary);
}
.form-control:focus-visible { outline: 2px solid var(--accent-gold); outline-offset: 2px; }
.form-control[aria-invalid="true"] { border-color: #b4544a; }
.form-error { font-size: 0.8125rem; color: #e0837a; }
.form-submit {
	background: var(--accent-gold);
	color: var(--bg-base);
	border-radius: 0.5rem;
	padding: 0.75rem 1.25rem;
	font-weight: 600;
}
.form-submit[disabled] { opacity: 0.6; cursor: progress; }
.form-success-title, .form-error-title { font-weight: 600; color: var(--text-primary); }
.form-success-body, .form-error-body { color: var(--text-muted); }
```

## §14. Form components — `components/forms/`

Every form follows the same shape: `resolveFormCopy` → `useInquiryForm(action)` → status region (focus-managed) → fields wired to `getFieldError` → `Honeypot` → `SubmitButton`. On success the field set is replaced by the success region (no stale inputs). All forms accept `copy?: Partial<FormCopy>` so a parent can pass CMS copy (§10).

### `InquiryForm.tsx` (general enquiry)

```tsx
"use client"

import { submitInquiry } from "@/lib/forms/actions"
import { useInquiryForm, getFieldError } from "@/hooks/forms"
import { resolveFormCopy, type FormCopy } from "@/lib/forms/copy"
import { FormField } from "./FormField"
import { SubmitButton } from "./SubmitButton"
import { Honeypot } from "./Honeypot"
import { FormStatusRegion } from "./FormStatusRegion"

export interface InquiryFormProps {
	copy?: Partial<FormCopy>
}

export function InquiryForm(props: InquiryFormProps) {
	const copy = resolveFormCopy(props.copy)
	const { state, formAction } = useInquiryForm(submitInquiry)
	const done = state.status === "success"

	return (
		<form action={formAction} noValidate className="form">
			<FormStatusRegion state={state} copy={copy} />
			{done ? null : (
				<>
					<Honeypot />
					<FormField
						name="fullName"
						label="Full name"
						required
						autoComplete="name"
						error={getFieldError(state, "fullName")}
					/>
					<FormField
						name="email"
						label="Email"
						type="email"
						required
						autoComplete="email"
						error={getFieldError(state, "email")}
					/>
					<FormField
						name="phone"
						label="Phone (optional)"
						type="tel"
						autoComplete="tel"
						error={getFieldError(state, "phone")}
					/>
					<FormField
						name="message"
						label="How can we help?"
						control="textarea"
						required
						error={getFieldError(state, "message")}
					/>
					<label className="form-consent">
						<input type="checkbox" name="consent" value="on" /> I agree to be
						contacted about my enquiry.
					</label>
					{getFieldError(state, "consent") ? (
						<p className="form-error" role="alert">
							{getFieldError(state, "consent")}
						</p>
					) : null}
					{copy.disclaimer ? (
						<p className="form-disclaimer">{copy.disclaimer}</p>
					) : null}
					<SubmitButton label={copy.submitLabel} />
				</>
			)}
		</form>
	)
}
```

### `CallbackForm.tsx` (request a callback)

```tsx
"use client"

import { submitCallback } from "@/lib/forms/actions"
import { useInquiryForm, getFieldError } from "@/hooks/forms"
import { resolveFormCopy, type FormCopy } from "@/lib/forms/copy"
import { PREFERRED_TIMES } from "@/lib/forms/schemas"
import { FormField } from "./FormField"
import { SubmitButton } from "./SubmitButton"
import { Honeypot } from "./Honeypot"
import { FormStatusRegion } from "./FormStatusRegion"

const TIME_OPTIONS = PREFERRED_TIMES.map((t) => ({
	value: t,
	label: t.charAt(0).toUpperCase() + t.slice(1),
}))

export function CallbackForm(props: { copy?: Partial<FormCopy> }) {
	const copy = resolveFormCopy(props.copy)
	const { state, formAction } = useInquiryForm(submitCallback)
	const done = state.status === "success"

	return (
		<form action={formAction} noValidate className="form">
			<FormStatusRegion state={state} copy={copy} />
			{done ? null : (
				<>
					<Honeypot />
					<FormField
						name="fullName"
						label="Full name"
						required
						autoComplete="name"
						error={getFieldError(state, "fullName")}
					/>
					<FormField
						name="phone"
						label="Phone"
						type="tel"
						required
						autoComplete="tel"
						error={getFieldError(state, "phone")}
					/>
					<FormField
						name="preferredTime"
						label="Best time to call"
						control="select"
						required
						options={TIME_OPTIONS}
						error={getFieldError(state, "preferredTime")}
					/>
					<FormField
						name="email"
						label="Email (optional)"
						type="email"
						autoComplete="email"
						error={getFieldError(state, "email")}
					/>
					<SubmitButton label={copy.submitLabel} pendingLabel="Requesting…" />
				</>
			)}
		</form>
	)
}
```

### `ConsultationForm.tsx` (schedule a consultation)

```tsx
"use client"

import { submitConsultation } from "@/lib/forms/actions"
import { useInquiryForm, getFieldError } from "@/hooks/forms"
import { resolveFormCopy, type FormCopy } from "@/lib/forms/copy"
import { PREFERRED_TIMES, CONSULTATION_MODES } from "@/lib/forms/schemas"
import { FormField } from "./FormField"
import { SubmitButton } from "./SubmitButton"
import { Honeypot } from "./Honeypot"
import { FormStatusRegion } from "./FormStatusRegion"

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const TIME_OPTIONS = PREFERRED_TIMES.map((t) => ({ value: t, label: cap(t) }))
const MODE_OPTIONS = CONSULTATION_MODES.map((m) => ({
	value: m,
	label: m === "in-person" ? "In person" : cap(m),
}))

export function ConsultationForm(props: { copy?: Partial<FormCopy> }) {
	const copy = resolveFormCopy(props.copy)
	const { state, formAction } = useInquiryForm(submitConsultation)
	const done = state.status === "success"

	return (
		<form action={formAction} noValidate className="form">
			<FormStatusRegion state={state} copy={copy} />
			{done ? null : (
				<>
					<Honeypot />
					<FormField
						name="fullName"
						label="Full name"
						required
						autoComplete="name"
						error={getFieldError(state, "fullName")}
					/>
					<FormField
						name="email"
						label="Email"
						type="email"
						required
						autoComplete="email"
						error={getFieldError(state, "email")}
					/>
					<FormField
						name="phone"
						label="Phone"
						type="tel"
						required
						autoComplete="tel"
						error={getFieldError(state, "phone")}
					/>
					<FormField
						name="preferredDate"
						label="Preferred date"
						type="date"
						required
						error={getFieldError(state, "preferredDate")}
					/>
					<FormField
						name="preferredTime"
						label="Preferred time"
						control="select"
						required
						options={TIME_OPTIONS}
						error={getFieldError(state, "preferredTime")}
					/>
					<FormField
						name="mode"
						label="Meeting format"
						control="select"
						required
						options={MODE_OPTIONS}
						error={getFieldError(state, "mode")}
					/>
					<FormField
						name="message"
						label="Anything we should know? (optional)"
						control="textarea"
						error={getFieldError(state, "message")}
					/>
					<SubmitButton label={copy.submitLabel} pendingLabel="Scheduling…" />
				</>
			)}
		</form>
	)
}
```

### `BrochureRequestForm.tsx` (download brochure)

Accepts optional project context, passed as hidden inputs so the lead is attributable.

```tsx
"use client"

import { submitBrochureRequest } from "@/lib/forms/actions"
import { useInquiryForm, getFieldError } from "@/hooks/forms"
import { resolveFormCopy, type FormCopy } from "@/lib/forms/copy"
import { FormField } from "./FormField"
import { SubmitButton } from "./SubmitButton"
import { Honeypot } from "./Honeypot"
import { FormStatusRegion } from "./FormStatusRegion"

export interface BrochureRequestFormProps {
	copy?: Partial<FormCopy>
	projectSlug?: string
	projectTitle?: string
}

export function BrochureRequestForm(props: BrochureRequestFormProps) {
	const copy = resolveFormCopy(props.copy)
	const { state, formAction } = useInquiryForm(submitBrochureRequest)
	const done = state.status === "success"

	return (
		<form action={formAction} noValidate className="form">
			<FormStatusRegion state={state} copy={copy} />
			{done ? null : (
				<>
					<Honeypot />
					{props.projectSlug ? (
						<input type="hidden" name="projectSlug" value={props.projectSlug} readOnly />
					) : null}
					{props.projectTitle ? (
						<input type="hidden" name="projectTitle" value={props.projectTitle} readOnly />
					) : null}
					<FormField
						name="fullName"
						label="Full name"
						required
						autoComplete="name"
						error={getFieldError(state, "fullName")}
					/>
					<FormField
						name="email"
						label="Email"
						type="email"
						required
						autoComplete="email"
						hint="We’ll send the brochure to this address."
						error={getFieldError(state, "email")}
					/>
					<label className="form-consent">
						<input type="checkbox" name="consent" value="on" /> I agree to receive
						the brochure and related information.
					</label>
					{getFieldError(state, "consent") ? (
						<p className="form-error" role="alert">
							{getFieldError(state, "consent")}
						</p>
					) : null}
					<SubmitButton label={copy.submitLabel} pendingLabel="Sending…" />
				</>
			)}
		</form>
	)
}
```

### `ProjectInquiryForm.tsx` (project-specific enquiry)

Requires project context; `projectSlug` is a required hidden input validated server-side.

```tsx
"use client"

import { submitProjectInquiry } from "@/lib/forms/actions"
import { useInquiryForm, getFieldError } from "@/hooks/forms"
import { resolveFormCopy, type FormCopy } from "@/lib/forms/copy"
import { FormField } from "./FormField"
import { SubmitButton } from "./SubmitButton"
import { Honeypot } from "./Honeypot"
import { FormStatusRegion } from "./FormStatusRegion"

export interface ProjectInquiryFormProps {
	projectSlug: string
	projectTitle?: string
	copy?: Partial<FormCopy>
}

export function ProjectInquiryForm(props: ProjectInquiryFormProps) {
	const copy = resolveFormCopy(props.copy)
	const { state, formAction } = useInquiryForm(submitProjectInquiry)
	const done = state.status === "success"
	const defaultMessage = props.projectTitle
		? `I’m interested in ${props.projectTitle}.`
		: undefined

	return (
		<form action={formAction} noValidate className="form">
			<FormStatusRegion state={state} copy={copy} />
			{done ? null : (
				<>
					<Honeypot />
					<input type="hidden" name="projectSlug" value={props.projectSlug} readOnly />
					{props.projectTitle ? (
						<input type="hidden" name="projectTitle" value={props.projectTitle} readOnly />
					) : null}
					<FormField
						name="fullName"
						label="Full name"
						required
						autoComplete="name"
						error={getFieldError(state, "fullName")}
					/>
					<FormField
						name="email"
						label="Email"
						type="email"
						required
						autoComplete="email"
						error={getFieldError(state, "email")}
					/>
					<FormField
						name="phone"
						label="Phone (optional)"
						type="tel"
						autoComplete="tel"
						error={getFieldError(state, "phone")}
					/>
					<FormField
						name="message"
						label="Your enquiry"
						control="textarea"
						required
						defaultValue={defaultMessage}
						error={getFieldError(state, "message")}
					/>
					{copy.disclaimer ? (
						<p className="form-disclaimer">{copy.disclaimer}</p>
					) : null}
					<SubmitButton label={copy.submitLabel} />
				</>
			)}
		</form>
	)
}
```

### `components/forms/index.ts` (barrel)

```tsx
export { FormField } from "./FormField"
export { SubmitButton } from "./SubmitButton"
export { SuccessMessage } from "./SuccessMessage"
export { ErrorMessage } from "./ErrorMessage"
export { Honeypot } from "./Honeypot"
export { FormStatusRegion } from "./FormStatusRegion"
export { InquiryForm } from "./InquiryForm"
export { CallbackForm } from "./CallbackForm"
export { ConsultationForm } from "./ConsultationForm"
export { BrochureRequestForm } from "./BrochureRequestForm"
export { ProjectInquiryForm } from "./ProjectInquiryForm"
```

### Extra style hooks (`app/globals.css`, additive)

```css
.form-consent { display: flex; gap: 0.5rem; align-items: flex-start; font-size: 0.875rem; color: var(--text-muted); }
.form-disclaimer { font-size: 0.75rem; color: var(--text-muted); }
.form-status-region:focus-visible { outline: 2px solid var(--accent-gold); outline-offset: 4px; }
```

## §15. CMS integration — one **additive optional** field (→ CMS v1.1)

Forms run with code defaults (§6), so **no CMS change is strictly required to function**. To satisfy “editors can configure copy,” we add **exactly one optional object** to the existing frozen `siteSettings` document — purely additive, non-breaking. Existing schemas, adapters, queries, and loaders are otherwise untouched.

<aside>
🧊

**Freeze impact:** this is an **additive optional field** on `siteSettings`. The CMS Foundation moves **v1.0 → v1.1 (additive-only, non-breaking)**. It is recorded in the CMS Foundation QA Freeze. No interface, no required field, no removal — the v1.0 additive-only contract is preserved.

</aside>

### 15.1 New object schema `schemas/objects/formCopy.ts` (additive)

```tsx
import { defineType, defineField } from "sanity"

export const formCopy = defineType({
	name: "formCopy",
	title: "Form copy",
	type: "object",
	fields: [
		defineField({ name: "submitLabel", title: "Submit button label", type: "string" }),
		defineField({ name: "successTitle", title: "Success title", type: "string" }),
		defineField({ name: "successMessage", title: "Success message", type: "text", rows: 3 }),
		defineField({ name: "errorTitle", title: "Error title", type: "string" }),
		defineField({ name: "errorMessage", title: "Error message", type: "text", rows: 3 }),
		defineField({ name: "disclaimer", title: "Disclaimer", type: "text", rows: 2 }),
	],
})
```

Register it in `schemas/index.ts` (add `formCopy` to the objects array) and append **one optional field** to the existing `siteSettings` document schema:

```tsx
// inside siteSettings.fields[] — APPEND ONLY, change nothing else
defineField({ name: "forms", title: "Form copy", type: "formCopy" }),
```

### 15.2 Query addition (additive fragment)

Extend the **existing** site-settings query selection with the new optional field — no other field changes:

```tsx
// in queries/siteSettings.ts, within the existing projection
`forms { submitLabel, successTitle, successMessage, errorTitle, errorMessage, disclaimer }`
```

Re-run `sanity typegen generate` so the generated `SiteSettingsQueryResult` gains the optional `forms` shape; `types/cms.ts` picks it up automatically (it bridges from generated types).

### 15.3 Adapter `adapters/settings/toFormCopy.ts` (additive, pure)

Maps the nullable CMS object to `Partial<FormCopy>` — the exact prop every form accepts. Nulls/empties are dropped so `resolveFormCopy` falls back to defaults field-by-field.

```tsx
import type { FormCopy } from "@/lib/forms/copy"

type RawFormCopy = {
	submitLabel?: string | null
	successTitle?: string | null
	successMessage?: string | null
	errorTitle?: string | null
	errorMessage?: string | null
	disclaimer?: string | null
} | null | undefined

export function toFormCopy(raw: RawFormCopy): Partial<FormCopy> | undefined {
	if (!raw) return undefined
	const out: Partial<FormCopy> = {}
	if (raw.submitLabel) out.submitLabel = raw.submitLabel
	if (raw.successTitle) out.successTitle = raw.successTitle
	if (raw.successMessage) out.successMessage = raw.successMessage
	if (raw.errorTitle) out.errorTitle = raw.errorTitle
	if (raw.errorMessage) out.errorMessage = raw.errorMessage
	if (raw.disclaimer) out.disclaimer = raw.disclaimer
	return out
}
```

### 15.4 Wiring (server → form prop)

The data path reuses the **frozen** `getSiteSettings()` loader — no new fetch. A server component reads settings, maps once, and passes the plain `copy` prop into any form:

```tsx
// example usage (route pages are wired in 08D — shown here for completeness)
import { getSiteSettings } from "@/lib/sanity/loaders" // FROZEN loader
import { toFormCopy } from "@/adapters/settings/toFormCopy"
import { InquiryForm } from "@/components/forms"

export async function ContactSection() {
	const settings = await getSiteSettings()
	const copy = toFormCopy(settings?.forms)
	return <InquiryForm copy={copy} />
}
```

`copy` is a plain serializable object, so it crosses the server→client boundary cleanly; the form’s `resolveFormCopy` merges it over `DEFAULT_FORM_COPY`. **Editors get full control; developers get safe defaults.**

## §16. Accessibility approach

| Requirement | Implementation |
| --- | --- |
| Proper labels | every control has a `<label htmlFor>` bound to the field `id` (`FormField`); required fields show a `*` and use native `required` |
| Keyboard navigation | native `input`/`textarea`/`select`/`button` only — full tab order, no custom widgets; honeypot is `tabIndex={-1}` so keyboard users skip it |
| Focus management | `useFocusOnResult` moves focus to the `tabIndex={-1}` status region on success/error so the outcome is announced and reachable |
| Live regions | success = `role=status`  • `aria-live=polite`; error banner = `role=alert`  • `aria-live=assertive`; per-field errors use `role=alert` |
| Error announcements | invalid fields get `aria-invalid`  • `aria-describedby` pointing at the field-level error node |
| Hidden trap is safe | honeypot wrapper is `aria-hidden=true` and visually hidden via `.sr-only` (not `display:none`, so submit still posts it) |
| Focus visibility | `:focus-visible` gold outline on controls + status region, meeting the dark-theme contrast tokens |

## §17. Performance & progressive enhancement

- **Server-first:** validation, security, rate-limit, and delivery all run in Server Actions — no validation library ships to the browser.
- **Minimal client JS:** the only client code is three tiny hooks + `useFormStatus`/`useActionState` wiring. `zod` stays server-side (imported by schemas → parse → actions, all server modules).
- **Progressive enhancement:** forms are native `<form action={serverAction}>`; they submit and validate server-side **even with JS disabled** (the honeypot timing field simply stays empty, which is treated as “no timing signal,” not a failure).
- **No duplicate work:** copy resolution is a pure merge; the CMS read reuses the frozen cached `getSiteSettings()` request — no extra round-trips.

## §18. Deliverable explanations

**1 · Lead-capture architecture.** A single server engine (`runInquiry`) backs five typed flows. Request lifecycle: `same-origin → rate-limit → zod parse → bot check → deliver → FormResult`. The client never sees an exception — every outcome is a typed `FormResult` rendered by shared primitives. Delivery is abstracted behind `LeadSink` (placeholder logs), so email/CRM is a later drop-in with zero call-site churn.

**2 · Validation strategy.** One `zod` vocabulary defines field rules once; per-flow schemas compose from it. The **same schema** powers server validation (authoritative) and is the single source the field errors derive from. `safeParse` → `flatten().fieldErrors` → `FormResult.fieldErrors` → `getFieldError(name)` in the UI. Native HTML attributes (`required`, `type=email`) give instant **client-side hints** for free, while the server remains the source of truth (typed, trimmed, normalized).

**3 · Security strategy.** Layered, no external service: (a) **honeypot** field bots fill; (b) **timing trap** rejects sub-1.5s and stale (>6h) submissions; (c) **same-origin guard** as an explicit CSRF-ready seam on top of Next.js’ built-in Server-Action origin check; (d) **rate-limit interface** with an in-memory placeholder keyed per IP+flow, ready to swap for Redis/Upstash. Bots are silently “succeeded” so they get no tuning feedback, while the signal is logged.

**4 · CMS integration.** Copy (`submitLabel`, success/error title+message, disclaimer) is editor-configurable via **one additive optional `forms` object** on `siteSettings` (→ CMS v1.1), mapped by the pure `toFormCopy` adapter to the `Partial<FormCopy>` prop forms already accept. Code defaults guarantee forms work with the field empty or absent.

**5 · Accessibility approach.** See §16 — native semantics, bound labels, `aria-invalid`/`aria-describedby`, polite/assertive live regions, and focus-to-outcome management.

**6 · Component hierarchy.**

```
<XxxForm>                      (client; one per flow)
 ├─ useInquiryForm(action)      -> { state, formAction }   (Server Action bound)
 ├─ <form action={formAction}>
 │   ├─ <FormStatusRegion>      (focus target; live regions)
 │   │   ├─ <SuccessMessage>    role=status / aria-live=polite
 │   │   └─ <ErrorMessage>      role=alert / aria-live=assertive
 │   ├─ <Honeypot>             sr-only trap + timing field
 │   ├─ <FormField> × N         label + control + per-field error
 │   └─ <SubmitButton>         useFormStatus pending/aria-busy
 └─ copy = resolveFormCopy(props.copy)   <- toFormCopy(settings.forms)

Server (lib/forms): actions -> { security, rateLimit, parse(schemas), delivery }
```

## §19. Deliverables checklist

- [x]  `lib/forms/` — types, schemas, copy, security, rateLimit, parse, delivery, actions, index.
- [x]  `hooks/forms/` — useInquiryForm, useFieldErrors, useFocusOnResult, index.
- [x]  `components/forms/` — FormField, SubmitButton, SuccessMessage, ErrorMessage, Honeypot, FormStatusRegion + 5 form components + barrel.
- [x]  Client + server + typed validation; error/loading/success states.
- [x]  Spam protection: honeypot, timing, rate-limit interface, bot mitigation, CSRF-ready origin guard.
- [x]  CMS: one additive optional `forms` field + `toFormCopy` adapter (→ v1.1).
- [x]  Accessibility + performance/progressive-enhancement.

## §20. Verify locally (I can't run these)

- [ ]  `npm install zod` (no other new deps).
- [ ]  `npx tsc --noEmit` — zero type errors.
- [ ]  `npm run lint` — zero ESLint errors (the two `console` lines carry scoped disables).
- [ ]  `sanity typegen generate` after §15 — `SiteSettingsQueryResult.forms` appears as optional.
- [ ]  Submit each form: empty (field errors), valid (success region + focus), honeypot filled (silent success, logged), rapid submit (rate-limit message).
- [ ]  JS-disabled smoke test: form still posts and validates server-side.
- [ ]  `git status` clean under homepage/project components, frozen adapters/queries/loaders, and `lib/project.ts`.

<aside>
⛔

**STOP — Phase 08C complete.** Lead-capture system authored: 5 flows, shared server engine, layered spam/bot defence, accessible primitives, and one additive optional CMS field (→ CMS v1.1, recorded in the CMS QA Freeze). I can't run `npm`/`tsc`/lint/dev — §20 gates are yours. Awaiting your review before **Phase 08D**.

</aside>