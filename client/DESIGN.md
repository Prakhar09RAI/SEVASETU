# SevaSetu Design System & Frontend Architecture Specification (v2.0)

This document formalizes the visual language, token architecture, UI primitive contracts, high-impact layout patterns, and WCAG AA accessibility compliance implemented across the SevaSetu client application.

---

## 1. Design Philosophy & Aesthetic Foundation

SevaSetu delivers an authoritative, high-trust, and tactile digital bridge between verified local service professionals and customers across Indian municipal jurisdictions.

### Key Tenets
1. **Solid Substance Over Ephemerality**: Cards, tables, and modal dialogs are solid surfaces (`bg-white` / `bg-slate-900`) with crisp borders (`border-slate-200` / `border-slate-800`) and subtle shadows. Frosted glassmorphism (`backdrop-blur-md` with semi-transparent fill) is strictly reserved for floating overlay planes: the global navigation header, top-level search pills, sticky filter bars, and flyout drawers.
2. **Dual-Font Typographic Hierarchy**: No generic system fonts or default sans-serifs. Display titles and numeric telemetry use **Bricolage Grotesque** (weights 700 and 800) for punchy character and civic gravity. Structural copy, forms, and metadata use **Plus Jakarta Sans** (weights 400, 500, and 600) for legibility at small sizes.
3. **Curated Color Scales**: Strict 4-scale palette avoiding oversaturated primitives:
   - **Primary (Emerald 50..800)**: Trust, verification, active online status, and primary action affordance.
   - **Accent (Indigo 50..800)**: AI dispatch intelligence, recommendation badges, and active navigational pills.
   - **Warm (Amber 50..900)**: Safety alerts, OTP completion PINs, pending queues, and countdown timers.
   - **Ink (Slate 50..950)**: High-contrast typography, crisp surface divisions, and deep dark-mode backgrounds.

---

## 2. Design Tokens & Variables

All design tokens are defined in [`client/src/lib/tokens.ts`](file:///d:/rituraj%20anand/sevasetu/SevaSetu-bridge-to-services/client/src/lib/tokens.ts) and wired into the Tailwind CSS v4 `@theme` engine in [`client/src/index.css`](file:///d:/rituraj%20anand/sevasetu/SevaSetu-bridge-to-services/client/src/index.css).

### 2.1 Color Palette
| Palette Scale | Hex / Shades | Primary Usage |
|:---|:---|:---|
| **Primary (Emerald)** | `50`: `#ecfdf5`<br>`100`: `#d1fae5`<br>`500`: `#10b981`<br>`600`: `#059669`<br>`700`: `#047857`<br>`800`: `#065f46` | Brand buttons, verified checkmarks, positive financial metrics, available time slots. |
| **Accent (Indigo)** | `50`: `#eef2ff`<br>`100`: `#e0e7ff`<br>`500`: `#6366f1`<br>`600`: `#4f46e5`<br>`700`: `#4338ca`<br>`800`: `#3730a3` | AI Smart Match badges, category highlights, discovery filter indicators. |
| **Warm (Amber)** | `50`: `#fffbeb`<br>`100`: `#fef3c7`<br>`500`: `#f59e0b`<br>`600`: `#d97706`<br>`700`: `#b45309`<br>`900`: `#78350f` | Security verification OTP PIN cards, countdown clocks, KYC review queues. |
| **Ink & Neutrals (Slate)** | `50`: `#f8fafc`<br>`100`: `#f1f5f9`<br>`200`: `#e2e8f0`<br>`700`: `#334155`<br>`800`: `#1e293b`<br>`900`: `#0f172a`<br>`950`: `#020617` | Light backgrounds (`slate-50`), dark shells (`slate-950`), cards (`slate-900`), and typography. |

### 2.2 Elevation & Shadows
- **`subtle`**: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- **`card`**: `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`
- **`lift`**: `0 10px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.06)`
- **`glass`**: `0 8px 32px 0 rgba(0, 0, 0, 0.06)`
- **`elevated`**: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`
- **`modal`**: `0 25px 50px -12px rgb(0 0 0 / 0.25)`

### 2.3 Radii
- **`sm`**: `6px` (badges, micro-tags, small inputs)
- **`md`**: `10px` (standard buttons, form controls, dropdowns)
- **`lg`**: `14px` (cards, dialog boxes, notification alerts)
- **`xl`**: `20px` (hero containers, 3D viewport wrappers)
- **`pill`**: `9999px` (status badges, search pills, floating avatars)

---

## 3. UI Primitive Specifications

All primitives are located in [`client/src/components/ui/`](file:///d:/rituraj%20anand/sevasetu/SevaSetu-bridge-to-services/client/src/components/ui/) and built using `class-variance-authority` (cva), `React.forwardRef`, and accessible `aria-*` contracts.

### 3.1 Button (`Button.tsx`)
- **Variants**: `primary` (emerald-700 / dark:emerald-600), `secondary` (slate-100 / dark:slate-800), `outline` (border-slate-300 / dark:border-slate-700), `ghost`, `danger` (red-600), `accent` (indigo-600).
- **Sizes**: `sm` (36px h), `md` (44px min touch target), `lg` (48px h).
- **Features**: `isLoading` spinner with `aria-busy="true"`, left/right icon slots, keyboard focus ring (`focus-visible:ring-2 focus-visible:ring-emerald-500`).

### 3.2 Form Controls (`Input.tsx`, `Textarea.tsx`, `Select.tsx`)
- **Accessibility**: Automatic label association via `id`, `aria-describedby` error and helper text binding, `aria-invalid={!!error}`.
- **Visuals**: Light mode `bg-white border-slate-300`, Dark mode `dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100`.
- **Icons**: Left and right adornment slots with centered flex alignment.

### 3.3 Checkbox & Radio (`Checkbox.tsx`, `Radio.tsx`)
- **Target Area**: 44x44px minimum accessible touch area wrapping the visual check indicator.
- **States**: Checked, unchecked, indeterminate (checkbox), disabled.

### 3.4 Badge (`Badge.tsx`)
- **Variants**: `success` (emerald), `warning` (amber), `error` (red), `info` (blue/indigo), `neutral` (slate), `accent` (indigo).
- **Options**: `dot` indicator for online/active state with dual color and text labeling (never color alone).

### 3.5 Card (`Card.tsx`)
- **Components**: `Card`, `CardHeader`, `CardTitle` (with `font-display`), `CardDescription`, `CardContent`, `CardFooter`.
- **Variants**: `default` (solid bordered), `bordered`, `flat`, `elevated`.
- **Interaction**: Optional `hover` prop adds `.lift` transformation and enhanced shadow.

### 3.6 Modal Dialog (`Modal.tsx`)
- **Accessibility**: Focus trap inside dialog, Esc key listener, return focus to trigger on close, `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.
- **Layout**: Backdrop with blur, 44px close button, auto-scrolling body with fixed header and footer slots.

### 3.7 Alert (`Alert.tsx`)
- **Accessibility**: `role="alert"` for errors (high priority screen reader announcement), `role="status"` for info and success.
- **Variants**: `info`, `success`, `warning`, `error`. Includes optional close button and icon slot.

### 3.8 Avatar, Skeleton, Spinner & EmptyState
- **Avatar**: Initials fallback computed from user's full name with warm amber or accent indigo gradient.
- **Skeleton**: `motion-safe:animate-pulse` with slate-200 (light) and slate-800 (dark).
- **Spinner**: SVG spinner with `role="status"` and accessible `sr-only` loading text.
- **EmptyState**: Centered illustration/icon slot, `font-display` heading, explanatory text, and primary call-to-action button.

---

## 4. High-Impact Area Architecture

### 4.1 Customer Hero & Search ([`CustomerHomePage.tsx`](file:///d:/rituraj%20anand/sevasetu/SevaSetu-bridge-to-services/client/src/pages/customer/CustomerHomePage.tsx))
- **Hero Grid**: 2-column layout with min 560px height. Left column features the municipal trust pill (`⚡ 10,000+ verified professionals across 28 cities`), 60px `font-display` h1, and floating glass search console.
- **Search Console**: Unified query input + 6-digit Postal PIN Code input with instant validation and AI Smart Match badge.
- **Three.js Fallback**: When `usePrefersReducedMotion` is detected or on mobile screens, dynamically replaces the interactive 3D hero with an accessible 2x2 static service preview grid (Emergency Repairs, Home Cleaning, Electrical Services, Pest Control).

### 4.2 Discovery Filters & Provider Cards ([`ServiceSearchFilters.tsx`](file:///d:/rituraj%20anand/sevasetu/SevaSetu-bridge-to-services/client/src/components/customer/discovery/ServiceSearchFilters.tsx) & [`ProviderResultCard.tsx`](file:///d:/rituraj%20anand/sevasetu/SevaSetu-bridge-to-services/client/src/components/customer/provider/ProviderResultCard.tsx))
- **Sticky Filter Bar**: Glassmorphism layer (`backdrop-blur-md bg-white/80 dark:bg-slate-900/80`) that docks cleanly beneath the top navigation.
- **Toggle Chips**: Semantic `<button aria-pressed="...">` pills for instant rating, availability, and emergency dispatch toggles.
- **Provider Cards**: Solid white/slate-900 surface with `.lift` hover effect, 24px `font-display` base pricing ("Visit starts from ₹X"), AI 1-line review summary, dual-labeled star rating pills, and verified pro credential badges.

### 4.3 Booking Lifecycle & Communication ([`BookingSummary.tsx`](file:///d:/rituraj%20anand/sevasetu/SevaSetu-bridge-to-services/client/src/components/transaction/BookingSummary.tsx) & [`ConversationView.tsx`](file:///d:/rituraj%20anand/sevasetu/SevaSetu-bridge-to-services/client/src/components/communication/ConversationView.tsx))
- **7-Stage Lifecycle Timeline**: Ordered list `<ol>` rendering exact statuses (`PENDING_PROVIDER` -> `ACCEPTED` -> `SCHEDULED` -> `ON_THE_WAY` -> `ARRIVED` -> `IN_PROGRESS` -> `COMPLETED`) with completed checkmarks, pulsing active status ring, and upcoming indicators.
- **Completion PIN Card**: High-visibility amber card displaying the 4-to-6 digit job verification PIN in 30px tracking-widest monospace font.
- **Itemized Billing**: Clean tabular breakdown of Service Base Fee, Platform Dispatch Fee, GST (18%), and Total Payable.
- **Real-Time Chat**: Accessible conversation stream with `role="log"` and `aria-live="polite"`. Message status indicator with screen-reader text (`Sent`, `Delivered`, `Read`).

### 4.4 Partner Dashboard & Availability Scheduler ([`ProviderOverviewPage.tsx`](file:///d:/rituraj%20anand/sevasetu/SevaSetu-bridge-to-services/client/src/pages/provider/ProviderOverviewPage.tsx) & [`AvailabilityEditor.tsx`](file:///d:/rituraj%20anand/sevasetu/SevaSetu-bridge-to-services/client/src/components/provider/AvailabilityEditor.tsx))
- **Online/Offline Switch**: Accessible toggle (`role="switch" aria-checked aria-pressed`) with immediate visual feedback.
- **Dispatch Alert Cards**: Warm amber border, countdown timer (`role="timer"`), and 48px high-priority "Accept Job" action button.
- **7-Day Matrix Scheduler**: 7-column grid with 110px time blocks. Available slots styled with `emerald-100` fill and solid green borders; unavailable slots in clean white with dashed borders. Supports roving arrow-key navigation and keyboard toggling (`Space` / `Enter`).

### 4.5 Admin Governance & Telemetry Hub ([`AdminOverviewPage.tsx`](file:///d:/rituraj%20anand/sevasetu/SevaSetu-bridge-to-services/client/src/pages/admin/AdminOverviewPage.tsx) & [`AdminTable.tsx`](file:///d:/rituraj%20anand/sevasetu/SevaSetu-bridge-to-services/client/src/components/admin/AdminTable.tsx))
- **Dark-First Governance Aesthetic**: Slate-950 shell with high-contrast data tables and telemetry cards.
- **Accessible Table**: Semantic `<table>` with `<caption className="sr-only">`, `<th scope="col">`, `aria-sort` indicators, row selection checkboxes, and accessible pagination.
- **2x2 Telemetry Fallback**: If 3D scene is bypassed or reduced motion is active, renders high-precision metric cards: Active Bookings, Online Providers, Dispute Escalation Rate, and System Gateway Latency.

---

## 5. Accessibility Compliance Matrix (WCAG 2.1 AA)

| Requirement | Implementation Detail | Verification Status |
|:---|:---|:---:|
| **Minimum Touch Target** | All buttons, links, form inputs, and select toggles satisfy minimum `44x44px` physical click/tap target size. | Passed |
| **Non-Color Status Indicators** | Status badges, online indicators, and timeline steps combine icons, text labels, and color (never color alone). | Passed |
| **Keyboard Navigation** | Visible outline ring (`focus-visible:ring-2 focus-visible:ring-emerald-500 ring-offset-2`). Full Esc support on modals/drawers. Focus trapping. | Passed |
| **Screen Reader Semantics** | Skip-to-content anchor on all shells. `role="dialog"`, `role="log"`, `role="alert"`, `aria-live`, `aria-busy`, and `aria-describedby` contracts. | Passed |
| **Reduced Motion** | `@media (prefers-reduced-motion: reduce)` disables CSS transitions/animations; Three.js scenes switch to accessible 2x2 static previews. | Passed |
| **Color Contrast** | Text-to-background contrast ratio >= 4.5:1 for body copy and >= 3:1 for large display headings across both light and dark modes. | Passed |
