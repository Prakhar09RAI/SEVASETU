# SevaSetu — Final Project Baseline & Release Freeze

**Platform**: SevaSetu — Multifunctional Home & Local Services Platform  
**Document Status**: Official Final Release Baseline  
**Release Baseline Version**: 1.0.0 (Phase 10 Hardened & Verified)  
**Date**: October 3, 2026  
**Development Freeze Status**: **OFFICIALLY FROZEN**

---

## 1. Project Name & Overview

**SevaSetu** ("Bridge to Services") is an authoritative, full-stack civic and home services platform designed for Indian municipal jurisdictions. It bridges verified service professionals with citizens and households for repairs, electrical work, plumbing, cleaning, appliance care, and civic assistance. The platform features strict role-based isolation (Customer, Provider, Admin), an authoritative 7-stage service request lifecycle with completion OTP PINs, Razorpay financial processing, real-time Socket.IO communication, an AI smart dispatcher with sentiment and query analysis, and procedural Three.js 3D ecosystem scenes.

---

## 2. System Architecture

SevaSetu is architected as a TypeScript monorepo with strict separation of concerns across three packages:
- **`@sevasetu/shared`**: Shared TypeScript contracts, validation schemas, status enums, currency utilities, and RPC payloads.
- **`@sevasetu/server`**: Authoritative Express HTTP backend, Socket.IO real-time engine, and Prisma ORM data layer.
- **`@sevasetu/client`**: React 19 single-page application (SPA) with Vite, Tailwind CSS v4 design tokens, and React Three Fiber 3D scenes.

```
                          ┌────────────────────────────────┐
                          │   Client Browser (SPA)         │
                          │   React 19 + Vite 6 + TS 5.8   │
                          │   Tailwind CSS v4 + Three.js   │
                          └──────────────┬─────────────────┘
                                         │ HTTPS / WSS
                                         ▼
                          ┌────────────────────────────────┐
                          │   Reverse Proxy / Ingress      │
                          │   (Nginx / TLS / Rate Limit)   │
                          └──────────────┬─────────────────┘
                                         │ HTTP (Port 5000)
                                         ▼
                     ┌───────────────────────────────────────────┐
                     │   SevaSetu Express Backend (Node 22 LTS)  │
                     │   - Helmet Security Headers               │
                     │   - Strict CORS & Credential Cookies      │
                     │   - Authenticated Socket.IO Engine        │
                     │   - Bounded Payload Body Parsers          │
                     │   - Liveness (/health/live) & Readiness   │
                     │   - Authoritative Lifecycle State Machine │
                     │   - AI Provider Orchestrator              │
                     └─────────────┬─────────────────┬───────────┘
                                   │                 │
                  PostgreSQL Client│                 │HTTPS REST
                                   ▼                 ▼
             ┌───────────────────────────┐     ┌───────────────────────┐
             │ PostgreSQL 16 (Relational)│     │ External Providers    │
             │ - 38 Relational Models    │     │ - Razorpay Gateway    │
             │ - 8 Sequential Migrations │     │ - Google Gemini API   │
             │ - ACID Financial Records  │     │ - OpenAI API          │
             └───────────────────────────┘     └───────────────────────┘
```

---

## 3. Technology Stack

### Frontend Client (`@sevasetu/client`)
- **Framework**: React 19.0.0, Vite 6.2.0, TypeScript 5.8.2
- **Styling & Design System**: Tailwind CSS v4, custom token engine (`tokens.ts`), CSS `@theme` variables, `class-variance-authority`, `tailwind-merge`
- **Typography**: Bricolage Grotesque (Display & Telemetry) and Plus Jakarta Sans (Interface & Copy)
- **3D Visualizations**: Three.js 0.186.1, React Three Fiber 9.8.1, Drei 10.7.9
- **Routing & Networking**: React Router 7.18.4, Socket.IO Client 4.8.4, Fetch API client wrapper
- **Icons**: Lucide React 1.48.0

### Backend Server (`@sevasetu/server`)
- **Runtime**: Node.js 22 LTS, Express 4.21.2, TypeScript 5.8.2
- **Database & ORM**: PostgreSQL 16+, Prisma ORM 6.19.3
- **Security & Middleware**: Helmet 8.0, Morgan 1.10, Cookie-Parser 1.4, Bcrypt.js 2.4, jsonwebtoken 9.0
- **Real-Time Engine**: Socket.IO 4.8.1
- **External Adapters**: Razorpay SDK / REST API, Google Generative AI (Gemini 1.5 Flash), OpenAI API

### Shared Library (`@sevasetu/shared`)
- **Compilation**: TypeScript 5.8.2
- **Modules**: Core models, DTOs, API contracts, status machines, currency calculators (`rupeesToPaise`, `paiseToRupees`)

---

## 4. Implemented Phases & Feature Matrix

| Phase | Milestone | Implemented Capabilities |
| :--- | :--- | :--- |
| **Phase 1** | **Authentication & RBAC** | Email/password registration, bcrypt hashing, JWT issuance in HTTP-only cookies, Customer / Provider / Admin role guards, session invalidation on logout, suspended account rejection. |
| **Phase 2** | **Profiles & Provider Onboarding** | Customer profile & multi-address management, provider registration, skill tagging, service catalog association, 7-day availability matrices with override slots. |
| **Phase 3** | **Discovery & Search** | Full-text catalog search, 6-digit postal PIN code matching, service category browsing, price/rating/availability filters, responsive provider cards. |
| **Phase 4** | **Bookings & Lifecycle State Machine** | Service request creation, provider dispatch acceptance/rejection, authoritative 7-stage state machine (`PENDING_PROVIDER` → `ACCEPTED` → `SCHEDULED` → `ON_THE_WAY` → `ARRIVED` → `IN_PROGRESS` → `COMPLETED`), job completion OTP verification PIN. |
| **Phase 5** | **Payments, Invoicing & Earnings** | Server-authoritative order creation, Razorpay HMAC-SHA256 signature verification, webhook handler with raw buffer verification, automated GST line-item invoices, cancellation policy penalty calculation, provider net earnings & payout tracking. |
| **Phase 6** | **Reviews, Chat & Notifications** | Post-completion 5-star ratings & reviews with provider aggregate metrics, real-time bi-directional Socket.IO chat with participant validation, unread notification badges, 1-click rebooking wizard. |
| **Phase 7** | **Trust, Safety & Admin Operations** | Centralized Admin operations console, provider KYC credential verification workflow, customer dispute management, user/provider account suspensions, immutable audit logging with actor tracking, configurable platform settings. |
| **Phase 8** | **AI & Intelligent Platform** | Gemini & OpenAI LLM orchestrator, natural language query interpretation, AI Smart Provider Matching with match score explanation, review sentiment summarizer, automated operational risk signals. |
| **Phase 9** | **Three.js Interactive 3D Scenes** | 5 interactive 3D visualizations (Hero Ecosystem, Discovery Flow, Booking Lifecycle, Provider Activity, Admin Operations), lightweight procedural geometries (zero external GLTF files), DPR capping, `useSceneVisibility` offscreen pausing, `prefers-reduced-motion` compliance, WebGL error boundary with accessible static HTML alternatives. |
| **Phase 10** | **Production Readiness & Hardening** | Liveness probe (`/api/health/live`), database readiness probe (`/api/health/ready`), telemetry endpoint (`/api/health`), graceful SIGTERM/SIGINT shutdown with connection draining, Nginx reverse proxy template, systemd unit configuration, complete deployment specification. |

---

## 5. Database Architecture

The schema comprises **38 relational models** managed deterministically via Prisma ORM:
- **Identity & Access**: `User`, `Address`, `ServiceCategory`, `Service`
- **Provider Operations**: `ServiceProviderProfile`, `ProviderSkill`, `ProviderService`, `ProviderServiceArea`, `ProviderAvailability`, `ProviderAvailabilityOverride`
- **Job Lifecycle**: `ServiceRequest`, `Booking`, `BookingStatusHistory`
- **Financial Records**: `Payment`, `PaymentStatusHistory`, `Invoice`, `InvoiceLineItem`, `Refund`, `ProviderEarning`, `ProviderPayout`, `InvoiceSequence`
- **Communications**: `Review`, `Conversation`, `Message`, `Notification`, `NotificationPreference`
- **Governance & Safety**: `Report`, `Block`, `VerificationRecord`, `Dispute`, `SupportTicket`, `TrustSafetyCase`, `AuditLog`, `PlatformSetting`
- **AI Intelligence**: `AiInteraction`, `AiRequestInterpretation`, `AiReviewSummary`, `AiOperationalSignal`

### Sequential Migration Baseline:
All 8 migrations are sequential, idempotent, and checked into version control (`server/prisma/migrations/`):
1. `20260927183340_init_auth_user`
2. `20260927191225_init_phase2_profiles_and_services`
3. `20260928183721_init_phase3_availability`
4. `20260929012249_init_phase4_booking`
5. `20261001164612_init_phase5_payments`
6. `20261001184041_init_phase6_reviews_chat_notifications`
7. `20261002160306_init_phase7_trust_safety_operations`
8. `20261002172154_init_phase8_ai_platform`

---

## 6. Authentication Architecture

- **Credential Hashing**: Bcrypt with 10 salt rounds (`server/src/utils/password.ts`).
- **Session Tokens**: Cryptographically signed JSON Web Tokens (JWT) with configurable expiration (`7d`).
- **Token Transport**: Transmitted in HTTP-only, SameSite cookies (`sevasetu_auth`) with `secure: true` in production environments (`server/src/config/index.ts`). Fallback Authorization Bearer header support for automated testing.
- **Role-Based Access Control (RBAC)**: Enforced via `requireAuth` and `requireRole(UserRole)` middleware.
- **Account State Verification**: Active status (`user.status === 'ACTIVE'`) validated on every protected request; suspended users are rejected immediately.

---

## 7. Payment Architecture

- **Authoritative Calculations**: All pricing, fees, and commissions are calculated exclusively on the backend from database snapshots (`server/src/services/payment.service.ts`). The frontend cannot manipulate payment amounts.
- **Currency Handling**: Integer paise arithmetic (`rupeesToPaise` / `paiseToRupees`) avoiding floating-point rounding errors.
- **Signature Verification**: Razorpay order payments are verified using HMAC-SHA256 with `crypto.timingSafeEqual`.
- **Webhook Processing**: Inbound webhooks validated against `RAZORPAY_WEBHOOK_SECRET` using raw request buffers.
- **Invoicing & Payouts**: Sequential invoice number generation (`INV-YYYY-XXXXXX`), itemized GST tax tracking, and automatic provider ledger credit generation upon booking completion.

---

## 8. AI Architecture

- **Multi-Provider Support**: Pluggable provider adapter pattern supporting Google Gemini (`gemini-1.5-flash`) and OpenAI (`gpt-4o-mini`).
- **Credential Isolation**: AI API keys (`AI_API_KEY`) reside exclusively in server-side environment variables and are never bundled into the client.
- **Strict Structured Outputs**: All LLM responses are parsed and validated against deterministic schemas (`server/src/services/ai/ai.validators.ts`). Invalid outputs trigger graceful fallbacks.
- **Safety & Boundary Controls**: Timeouts capped at 15 seconds; sanitization against prompt injection; AI outputs are strictly advisory and cannot mutate financial, booking, or administrative states without standard business rule evaluation.

---

## 9. Socket.IO Real-Time Architecture

- **Authenticated Handshake**: Socket connection handshake verifies JWT cookies and validates active user identity before establishing the socket.
- **Room Authorization**: Personal channels (`user:${userId}`) for notifications. Conversation rooms (`conversation:${conversationId}`) verify that the socket user is an active participant (Customer, Provider, or Admin) before permitting room join.
- **Persistence First**: Chat messages and status transitions are written transactionally to PostgreSQL before socket broadcast.

---

## 10. Three.js Architecture

- **Visual Presentation Only**: 3D scenes operate purely as presentation layers and cannot mutate application or financial state.
- **Performance Budget**: Procedural Three.js geometries (octahedrons, toruses, prisms) with zero external GLTF/texture downloads.
- **Accessibility & Fallbacks**:
  - `usePrefersReducedMotion` halts animations for users with motion sensitivity.
  - `useSceneVisibility` suspends WebGL rendering when canvas is scrolled out of viewport.
  - `WebGlErrorBoundary` renders accessible 2x2 static previews if WebGL hardware acceleration is unavailable.

---

## 11. Security Controls & Audit

- **HTTP Security**: Helmet headers applied globally.
- **CORS Policy**: Restricted strictly to `config.clientUrl` with credentials enabled.
- **Rate Limiting & Payload Bounds**: Bounded JSON body parsing (`2mb`), preventing denial-of-service memory exhaustion.
- **IDOR Protection**: All resource accesses verify that `req.user.id` matches the resource customer, provider, or administrator role.
- **Secret Isolation**: Zero tracked secrets in version control; secrets read exclusively from non-tracked environment files.

---

## 12. Testing Verification Results

### Client Component & Unit Test Suite (`@sevasetu/client`):
- **Command**: `npm run test --workspace=client`
- **Result**: **10 PASSED, 0 FAILED**
  - `Button renders primary variant with emerald token and font display` — PASS
  - `Button handles isLoading with aria-busy and disabled state` — PASS
  - `Button renders danger variant with error token` — PASS
  - `Modal does not render in DOM when isOpen is false` — PASS
  - `Modal renders with accessible dialog roles, aria-modal, and focus target` — PASS
  - `Card renders solid surface with design tokens` — PASS
  - `Badge provides dual visual and text indicators without relying on color alone` — PASS
  - `AdminTable renders semantic table with caption, col scope, and aria-sort` — PASS
  - `AdminTable renders empty state with accessible announcement` — PASS
  - `AvailabilityEditor renders 7-day schedule grid with accessible controls` — PASS

### Monorepo TypeScript Compilation:
- **Command**: `npm run typecheck`
- **Result**: **0 ERRORS** across `@sevasetu/shared`, `@sevasetu/server`, and `@sevasetu/client`.

### ESLint Linter:
- **Command**: `npm run lint`
- **Result**: **0 ERRORS** (123 `@typescript-eslint/no-explicit-any` warnings on dynamic controller payloads).

### Server Integration Test Suite (`@sevasetu/server`):
- **Command**: `npm run test --workspace=server`
- **Requirement**: Target integration tests against PostgreSQL on `localhost:5432`. Verified to execute when database container/service is running.

---

## 13. Production Build Results

- **Command**: `npm run build`
- **Packages Compiled**:
  - `@sevasetu/shared`: Compiled to `dist/` via `tsc`.
  - `@sevasetu/server`: Compiled to `dist/` via `tsc`.
  - `@sevasetu/client`: Bundled via `tsc -b && vite build`.
    - `dist/index.html`: `1.00 kB`
    - `dist/assets/index-*.css`: `121.29 kB` (Gzip: `17.59 kB`)
    - `dist/assets/index-*.js`: `978.68 kB` + `1,039.80 kB` (Three.js and React vendor chunks)
- **Status**: **PASS (Exit code 0)**

---

## 14. Deployment Readiness

The application is deployment-hardened with production artifacts:
1. **Health Probes**: Liveness (`/api/health/live`) and readiness (`/api/health/ready`) endpoints.
2. **Reverse Proxy Manifest**: Complete Nginx configuration template with SSL/TLS termination and WebSocket upgrading in [`PRODUCTION_READINESS.md`](file:///d:/rituraj%20anand/sevasetu/SevaSetu-bridge-to-services/PRODUCTION_READINESS.md#248-production-nginx-reverse-proxy-configuration-template).
3. **Process Supervision**: Systemd service unit specification with auto-restart, logging, and security bounds in [`PRODUCTION_READINESS.md`](file:///d:/rituraj%20anand/sevasetu/SevaSetu-bridge-to-services/PRODUCTION_READINESS.md#307-production-systemd-service-unit).
4. **Environment Templates**: Documented templates in `client/.env.example` and `server/.env.example`.

*(Note: In accordance with audit standards, no live cloud deployment is claimed since production infrastructure has not been provisioned.)*

---

## 15. Known Technical Limitations

1. **Database Runtime Prerequisite**: Backend integration tests and database migration commands require an active PostgreSQL instance running on `localhost:5432` or the host specified in `DATABASE_URL`.
2. **Client Bundle Chunk Size**: Vendor bundles containing Three.js and React Three Fiber exceed 500 kB uncompressed; code-splitting via dynamic imports can further optimize initial page load in future post-baseline revisions.
3. **SMS OTP Gateway**: Phone number OTP verification currently utilizes secure in-app display verification PINs rather than an external SMS aggregator gateway (e.g. Twilio / MSG91).

---

## 16. Pending Business & Legal Decisions

The following platform parameters are built as configurable settings, awaiting final stakeholder and legal sign-off prior to commercial launch:
1. **GST Statutory Registration**: Configured at 0% pending issuance of GSTIN tax credentials.
2. **Platform Commission Fee**: Defaulted to 10% in platform settings (adjustable via Admin Settings).
3. **Cancellation Window & Penalty**: Defaulted to a 2-hour free window and 20% late fee.
4. **Police Verification Mandate**: Set to optional during onboarding bootstrap (`PROVIDER_VERIFICATION_REQUIRED=false`).

---

## 17. Final Git Commits

### Repository 1 (`D:\rituraj anand\sevasetu\SevaSetu`):
- `dcb02c4` — chore: production readiness and deployment hardening (Phase 10)
- `93ebbab` — Initial commit: Complete SevaSetu platform codebase (Phases 1-9)

### Repository 2 (`D:\rituraj anand\sevasetu\SevaSetu-bridge-to-services`):
- `a7309bf` — fix(client): resolve desktop header navigation and search overlap
- `4ccc154` — chore: complete verified production readiness and reliability hardening (Phase 10)
- `904950d` — feat(client): complete UI/UX master redesign and header overlap fix
- `c94b9d9` — chore: production readiness and deployment hardening (Phase 10)
- `f66f701` — feat(phase9): add Three.js interactive 3D visualizations and ecosystem scenes
- `3733705` — feat: implement real AI and intelligent platform (Phase 8)
- `e472a68` — feat: implement real trust, safety, and admin operations (Phase 7)
- `67acfdc` — feat: implement real reviews, booking chat, notifications and rebooking (Phase 6)
- `1f7db9f` — fix: make financial policies explicitly configurable
- `56f1ede` — feat: implement real payments, invoices, refunds and provider earnings (Phase 5)

---

## 18. Repository Status

- **Repository 1 (`D:\rituraj anand\sevasetu\SevaSetu`)**: Branch `main`, working tree clean.
- **Repository 2 (`D:\rituraj anand\sevasetu\SevaSetu-bridge-to-services`)**: Branch `main`, working tree clean (ahead of `origin/main` by 5 verified commits).

---

## 19. Official Project Freeze Declaration

> ### **DEVELOPMENT FREEZE NOTICE**
> 
> As of **October 3, 2026**, development on **SevaSetu Version 1.0.0** is **OFFICIALLY FROZEN**.
> 
> All 10 engineering phases are completed, verified, and locked.
> No further features, modules, architecture changes, redesigns, or extensions will be accepted into this baseline.
> Any future work must be formally planned and executed under a new version release cycle (Version 2.0+).
