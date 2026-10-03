# SevaSetu — Production Readiness & Deployment Hardening Specification
**Project**: SevaSetu — Multifunctional Home & Local Services Platform  
**Version**: 1.0.0 (Phase 10 Production Hardened)  
**Status**: Audited, Hardened, and Verified for Production Deployment

---

## 1. System Architecture & Tech Stack

```
                          ┌────────────────────────────────┐
                          │   Client Browser (SPA)         │
                          │   React 18 + Vite + TS         │
                          │   Tailwind CSS + Three.js / R3F│
                          └──────────────┬─────────────────┘
                                         │ HTTPS / WSS
                                         ▼
                          ┌────────────────────────────────┐
                          │   Reverse Proxy / Ingress      │
                          │   (Nginx / Cloudflare / Caddy) │
                          │   TLS Termination + Rate Limit │
                          └──────────────┬─────────────────┘
                                         │ HTTP (Port 5000)
                                         ▼
                     ┌───────────────────────────────────────────┐
                     │   SevaSetu Express Backend (Node.js)      │
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

### Core Technologies:
* **Frontend**: React 18, Vite 6, TypeScript 5.8, Tailwind CSS 4, React Router 7, Socket.io-client 4.8, Three.js 0.186, React Three Fiber 9.8, Drei 10.7, Lucide React.
* **Backend**: Node.js 22 LTS, Express 4.21, TypeScript 5.8, Prisma ORM 6.19, Socket.io 4.8, Bcrypt.js, Helmet, Morgan, Express Rate Limit, Cookie Parser.
* **Database**: PostgreSQL 16+ with ACID guarantees, foreign key cascades, and unique constraints.

---

## 2. Environment Variables & Secret Configuration

### Server Environment (`server/.env`):
| Variable | Required | Default / Example | Purpose |
| :--- | :--- | :--- | :--- |
| `PORT` | Optional | `5000` | HTTP and WebSocket binding port |
| `NODE_ENV` | **Yes** | `production` | Environment mode (`development`, `production`, `test`) |
| `CLIENT_URL` | **Yes** | `https://sevasetu.com` | Allowed CORS origin & Cookie domain validation |
| `AUTH_SECRET` | **Yes** | `[32+ Char High-Entropy Secret]` | Cryptographic HMAC secret for JWT signing |
| `DATABASE_URL` | **Yes** | `postgresql://user:pass@host:5432/sevasetu?schema=public` | PostgreSQL connection string |
| `PAYMENT_GATEWAY_PROVIDER` | Optional | `RAZORPAY` | Gateway adapter identifier |
| `RAZORPAY_KEY_ID` | When Razorpay active | `rzp_live_...` | Razorpay public key identifier |
| `RAZORPAY_KEY_SECRET` | When Razorpay active | `[Secret Key]` | Razorpay server-side API secret |
| `RAZORPAY_WEBHOOK_SECRET`| When Webhooks active | `[Webhook Secret]` | HMAC-SHA256 signature verification key |
| `PLATFORM_COMMISSION_PERCENT`| Optional | `10` | Percentage fee collected from provider earnings |
| `CANCELLATION_FREE_WINDOW_HOURS`| Optional | `2` | Hours before schedule with 100% free cancellation |
| `CANCELLATION_LATE_FEE_PERCENT`| Optional | `20` | Penalty deducted if cancelled after free window |
| `AI_ENABLED` | Optional | `true` | Master flag for AI features |
| `AI_PROVIDER` | Optional | `GEMINI` | `GEMINI` or `OPENAI` |
| `AI_API_KEY` | When AI active | `[AI Provider API Key]` | Google Gemini or OpenAI secret key |
| `AI_MODEL` | Optional | `gemini-1.5-flash` | LLM target model string |
| `AI_TIMEOUT_MS` | Optional | `15000` | Maximum network timeout for external AI calls |
| `AI_MAX_OUTPUT_TOKENS` | Optional | `2048` | Upper token bound on AI responses |

### Client Environment (`client/.env`):
| Variable | Required | Default / Example | Purpose |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | **Yes** | `https://api.sevasetu.com/api` | Base REST API URL consumed by client HTTP requests |

> **Security Rule**: No server secrets (`AUTH_SECRET`, `RAZORPAY_KEY_SECRET`, `DATABASE_URL`, `AI_API_KEY`) must EVER be prefixed with `VITE_` or included in frontend client bundles.

---

## 3. Database Administration, Migrations & Integrity

### Schema Verification:
The database consists of **38 relational models** managed deterministically via Prisma:
- `User`, `Address`, `ServiceCategory`, `Service`
- `ServiceProviderProfile`, `ProviderSkill`, `ProviderService`, `ProviderServiceArea`, `ProviderAvailability`, `ProviderAvailabilityOverride`
- `ServiceRequest`, `Booking`, `BookingStatusHistory`
- `Payment`, `PaymentStatusHistory`, `Invoice`, `InvoiceLineItem`, `Refund`, `ProviderEarning`, `ProviderPayout`, `InvoiceSequence`
- `Review`, `Conversation`, `Message`, `Notification`, `NotificationPreference`
- `Report`, `Block`, `VerificationRecord`, `Dispute`, `SupportTicket`, `TrustSafetyCase`, `AuditLog`, `PlatformSetting`
- `AiInteraction`, `AiRequestInterpretation`, `AiReviewSummary`, `AiOperationalSignal`

### Sequential Migration Order:
All 8 production migrations are strictly linear, append-only, and idempotent:
1. `20260927183340_init_auth_user` — Core User authentication, Address, and RBAC roles
2. `20260927191225_init_phase2_profiles_and_services` — Provider profiles, service categories, catalog
3. `20260928183721_init_phase3_availability` — Provider schedules, availability slots, and calendar overrides
4. `20260929012249_init_phase4_booking` — Service requests, bookings, and 7-status lifecycle state machine
5. `20261001164612_init_phase5_payments` — Payments, invoices, refunds, provider earnings, invoice sequences
6. `20261001184041_init_phase6_reviews_chat_notifications` — Reviews, chat conversations, messages, notifications
7. `20261002160306_init_phase7_trust_safety_operations` — Reports, disputes, support tickets, trust & safety cases, audit logs
8. `20261002172154_init_phase8_ai_platform` — AI interactions, interpretations, review summaries, signals

### Production Migration Deployment:
```bash
# In production, ALWAYS deploy migrations non-destructively:
cd server
npx prisma migrate deploy --schema=prisma/schema.prisma

# Verify migration status:
npx prisma migrate status --schema=prisma/schema.prisma
```
> **Warning**: Never run `prisma migrate reset` in production or staging environments.

---

## 4. PostgreSQL Backup, Disaster Recovery (DR) & Rollback

### Backup Procedure:
```bash
# 1. Automated Daily Logical Dump (with schema and data):
pg_dump -h <DB_HOST> -U <DB_USER> -d sevasetu -F c -b -v -f "/backups/sevasetu_$(date +%Y%m%d_%H%M%S).dump"

# 2. Retain backups following the 3-2-1 rule:
# - 3 copies of data
# - 2 different storage media (local disk + S3/GCS bucket)
# - 1 copy off-site with encryption (AES-256)
```

### Recovery Sequence & Verification:
```bash
# 1. Create fresh database instance or target staging:
createdb -h <DB_HOST> -U <DB_USER> sevasetu_restored

# 2. Restore using pg_restore:
pg_restore -h <DB_HOST> -U <DB_USER> -d sevasetu_restored -v "/backups/sevasetu_TARGET.dump"

# 3. Apply any subsequent Prisma migrations:
npx prisma migrate deploy --schema=prisma/schema.prisma

# 4. Verify record counts & integrity check (PostgreSQL SQL):
# Run in psql:
# SELECT count(*) FROM "User";
# SELECT count(*) FROM "Booking";
# SELECT count(*) FROM "Payment";
# SELECT count(*) FROM "Invoice";
# SELECT last_value FROM "InvoiceSequence";
```

### Rollback Considerations:
- **Zero-Downtime Releases**: Code changes must maintain backwards compatibility with existing database columns.
- **Additive Migrations Only**: Do not drop columns in the same release that stops writing to them (two-phase release strategy: deprecate first, drop in subsequent release).
- **Application Rollback**: If a deployment fails health checks, roll back the Node.js application container/service to the prior image/commit. Database schema rollbacks should only be performed if the migration was strictly additive and did not delete or transform production user data.

---

## 5. Security & Authentication Hardening

* **Token Transport**: JWT session token stored strictly in `httpOnly`, `SameSite=none` (in production HTTPS), `Secure=true` cookies (`sevasetu_auth`). LocalStorage is NOT used for session storage, mitigating XSS token theft.
* **Server-Authoritative RBAC**: Roles (`CUSTOMER`, `PROVIDER`, `ADMIN`) are enforced exclusively through server-side database lookups in `authenticateToken` and `requireRole()`.
* **Account Status Guard**: Every authenticated request validates `user.status === 'ACTIVE'`. Suspended or inactive accounts are rejected immediately with 401/403.
* **Rate Limiting**: Brute-force protection applied to `/api/auth/register` and `/api/auth/login` (30 requests per 15-minute window in production).
* **Payload Size Limits**: Body parser bounds capped at `2mb` to prevent payload memory exhaustion attacks.
* **Error Sanitization**: Server stack traces are stripped in production mode (`NODE_ENV=production`), returning structured error codes without leaking internal infrastructure details.

---

## 6. Payment & Financial Consistency Hardening

* **Authoritative Server Pricing**: Financial calculations (Base Price, Platform Commission, GST, Late Cancellation Fees, Provider Earnings) are calculated solely on the server from immutable database snapshots. Client-submitted prices or fee overrides are discarded.
* **Cryptographic Signatures**:
  - Payment Orders: Razorpay HMAC-SHA256 signature verification via timing-safe comparison (`crypto.timingSafeEqual`).
  - Webhooks: Real-time webhooks signed with `RAZORPAY_WEBHOOK_SECRET` and evaluated against raw request body (`req.rawBody`).
* **Idempotency**: All payment intents accept an `Idempotency-Key` header and database unique constraint on `idempotencyKey`, preventing double-charges on network retries.
* **PCI-DSS Compliance**: No raw credit card numbers, CVVs, or bank account PINs are ever received or stored by SevaSetu servers. All checkout fields run via secure tokenization.

---

## 7. AI Platform Governance & Safety

* **Read-Only Advisory Role**: AI capabilities (Intent parsing, provider ranking explanations, review summaries, support assistant) are strictly advisory. AI **CANNOT** directly mutate booking states, approve payouts, ban accounts, or waive fees.
* **Prompt Injection Defenses**: Natural language inputs are strictly bounded (max length, input sanitization), wrapped with explicit delimiter boundaries, and validated against Zod structured schemas. Malicious instructions to alter pricing or grant permissions are ignored.
* **Graceful Degradation**: If external AI providers (Gemini/OpenAI) fail or timeout (>15,000ms), endpoints return graceful fallbacks (`AI_CONFIG_MISSING`, `AI_TIMEOUT`) without crashing core user booking flows.

---

## 8. Socket.IO Real-Time Engine

* **Handshake Authentication**: WebSocket handshakes validate the session JWT from cookies or authorization headers before accepting connection.
* **Room Isolation**:
  - Users are isolated to personal notification rooms: `user:<userId>`.
  - Chat conversations are isolated to `conversation:<conversationId>`.
  - Server-side authorization check (`verifyConversationParticipant`) ensures only the designated customer, assigned provider, or platform admin can join a conversation room.

---

## 9. Three.js Visual Experience Guidelines

* **Presentation Only**: 3D scenes are strictly visual presentation layers. They do not alter business state or issue mutation requests.
* **Performance Budget**:
  - Procedural geometries (octahedrons, dodecahedrons, toruses) with zero external GLTF/texture download overhead.
  - Capped DPR (`Math.min(window.devicePixelRatio, 2)`).
  - Off-screen render suspension via `IntersectionObserver` (`useSceneVisibility`).
  - Strict `prefers-reduced-motion` compliance to halt animations for sensitive users.
  - `WebGlErrorBoundary` providing immediate accessible HTML fallbacks on unsupported hardware.

---

## 10. Health Probes & Observability

### Available Health Endpoints:
1. `GET /api/health/live` — **Liveness Probe**: Returns HTTP 200 `{ status: "alive" }` if Node.js event loop is operational.
2. `GET /api/health/ready` — **Readiness Probe**: Performs `SELECT 1` against PostgreSQL. Returns HTTP 200 `{ status: "ready" }` if database is connected; returns HTTP 503 `{ status: "not_ready" }` if database is unreachable.
3. `GET /api/health` — **Telemetry**: Returns full diagnostics (uptime, environment, database status, timestamp).

### Graceful Termination:
Process listens for `SIGTERM` and `SIGINT`, stops accepting new HTTP connections, disconnects the Prisma client connection pool, and terminates cleanly within a 10-second safety window.

---

## 11. Production Build & Start Commands

```bash
# 1. Install root workspace dependencies:
npm install

# 2. Compile shared contracts:
npm run build --workspace=shared

# 3. Compile backend production bundle:
npm run build --workspace=server

# 4. Compile frontend production bundle:
npm run build --workspace=client

# 5. Execute non-destructive database migrations:
npm run prisma:migrate:status --workspace=server

# 6. Start production server:
npm run start --workspace=server
```

### Production Nginx Reverse Proxy Configuration Template:
```nginx
# /etc/nginx/sites-available/sevasetu.conf
server {
    listen 80;
    server_name sevasetu.com www.sevasetu.com api.sevasetu.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name sevasetu.com www.sevasetu.com;

    ssl_certificate /etc/letsencrypt/live/sevasetu.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sevasetu.com/privkey.pem;

    # Static SPA Frontend Hosting
    root /var/www/sevasetu/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 443 ssl http2;
    server_name api.sevasetu.com;

    ssl_certificate /etc/letsencrypt/live/sevasetu.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sevasetu.com/privkey.pem;

    # Backend API Reverse Proxy
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    # Socket.IO WebSocket Engine
    location /socket.io/ {
        proxy_pass http://127.0.0.1:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Production Systemd Service Unit:
```ini
# /etc/systemd/system/sevasetu.service
[Unit]
Description=SevaSetu Backend Platform Service
After=network.target postgresql.service

[Service]
Type=simple
User=sevasetu
WorkingDirectory=/var/www/sevasetu/server
EnvironmentFile=/var/www/sevasetu/server/.env
ExecStart=/usr/bin/node dist/server.js
Restart=always
RestartSec=5
KillSignal=SIGTERM
TimeoutStopSec=15
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

---

## 12. Open Business & Legal Decisions (Pending Stakeholder Sign-Off)

The following items are technical capabilities implemented with configurable parameters, awaiting explicit legal/business sign-off before public launch:

1. **GST Statutory Registration**: Current tax rate is configured at 0% (statutory tax engine disabled pending GSTIN registration details).
2. **Platform Commission Rate**: Database default is set to 10% (can be adjusted dynamically in Admin Platform Settings).
3. **Cancellation Window**: Set to 2 hours with a 20% late cancellation penalty.
4. **Provider Police Verification**: Configured as optional (`PROVIDER_VERIFICATION_REQUIRED=false`) during beta bootstrapping; can be toggled to mandatory in Admin Settings.
