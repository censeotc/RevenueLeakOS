# RevenueLeak OS

Revenue recovery platform for HVAC, plumbing, electrical, and home-service companies. Helps recover revenue from missed calls, stale estimates, and dormant customers.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui-style components
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** Auth.js (NextAuth v5) — ready to configure
- **SMS:** Mockable Twilio service layer
- **Demo:** Fully seeded demo tenant

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (optional for demo mode — app works with in-memory demo data)

### Install & Run

```bash
npm install
npx prisma generate

# Run in demo mode (no DB required)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to the dashboard with seeded demo data.

### With PostgreSQL

```bash
# Set your DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/revenueleak_os"

# Push schema and seed
npx prisma db push
npm run db:seed

npm run dev
```

## Demo Tenant

**North Shore Heating & Plumbing** — pre-seeded with:

- 4 users (owner, manager, 2 CSRs)
- 24 contacts
- 15 opportunities (missed_call, estimate_rescue, reactivation)
- 10 call events
- 10 estimates
- 6 templates (SMS + email)
- 4 campaigns with steps
- 8 bookings
- 12 activity log entries
- 8 integration connections
- 3 report snapshots

## Routes

| Route | Description |
|-------|-------------|
| `/app/dashboard` | KPI cards, activity feed, alerts, quick actions |
| `/app/opportunities` | All opportunities with filters, detail panel, notes |
| `/app/calls` | Call events with tabs, SMS thread preview |
| `/app/estimates` | Stale estimate list, enroll in follow-up |
| `/app/reactivation` | Segment cards, preview table, launch campaign |
| `/app/reports` | Revenue summary, workflow comparison, response time |
| `/app/contacts` | Contact table with tags, search, linked opportunities |
| `/app/campaigns` | Campaign list, create/edit, step editor |
| `/app/templates` | Template editor, variable picker, preview |
| `/app/integrations` | Integration cards with connect/test/disconnect |
| `/app/settings` | 8 sections: business, users, permissions, messaging, attribution, compliance, notifications, billing |
| `/login` | Demo login page |
| `/onboarding` | 4-step onboarding wizard |

## Core Architecture

Everything revolves around the **Opportunity** model with three types:

- `missed_call` — from missed inbound calls
- `estimate_rescue` — from stale estimates (7+ days)
- `reactivation` — from dormant customers (12+ months)

## Workflows

### Missed Call → Opportunity

1. Missed inbound call arrives
2. Contact matched or created
3. Opportunity created (`missed_call`)
4. SMS auto-reply sent via template
5. Reply can be simulated
6. Booking can be logged
7. Dashboard and reports update

### Estimate Rescue

1. Estimate exists and exceeds stale threshold (default: 7 days)
2. `estimate_rescue` opportunity created
3. Can enroll in follow-up campaign
4. Tracked through responded → booked → won/lost

### Reactivation

1. Dormant segment selected (12+ months, maintenance due, membership renewal, replacement cycle)
2. Reactivation opportunities created
3. Campaign launched
4. Bookings and influenced revenue tracked

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/workflows/missed-call` | POST | Execute missed call workflow |
| `/api/workflows/simulate-reply` | POST | Simulate inbound SMS reply |
| `/api/workflows/log-booking` | POST | Log a booking from an opportunity |
| `/api/workflows/estimate-rescue` | POST | Create estimate rescue opportunity |
| `/api/workflows/reactivation` | POST | Create reactivation opportunities |

## User Roles

- **owner** — full access
- **manager** — all except user management
- **csr** — dashboard, opportunities, contacts, messaging
- **readonly** — dashboard view only

## Configuration Defaults

| Setting | Default |
|---------|---------|
| Timezone | America/Detroit |
| Stale Estimate Days | 7 |
| Attribution Window Days | 14 |
| High Value Threshold | $2,500 |
| Missed Call Suppression | 4 hours |
