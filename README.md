# RevenueLeak OS (MVP)

RevenueLeak OS is an internal revenue recovery platform for HVAC, plumbing, electrical, and multi-trade home-service teams.

The MVP centers on a unified `Opportunity` model with three opportunity types:

- `missed_call`
- `estimate_rescue`
- `reactivation`

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- shadcn-style UI components
- Prisma + PostgreSQL
- NextAuth (Credentials)
- Zod + React Hook Form
- TanStack Table
- Recharts

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Copy environment variables

```bash
cp .env.example .env
```

3. Start PostgreSQL and point `DATABASE_URL` to it.

4. Generate Prisma client and apply schema

```bash
npm run db:generate
npx prisma db push
```

5. Seed demo tenant data

```bash
npm run db:seed
```

6. Run the app

```bash
npm run dev
```

Open `http://localhost:3000/login`.

## Seeded Demo Tenant

Business:

- **North Shore Heating & Plumbing**

Demo users:

- `owner@northshore.demo / Demo@12345`
- `manager@northshore.demo / Demo@12345`
- `csr@northshore.demo / Demo@12345`

Seeded data includes contacts, opportunities, calls, estimates, campaigns, templates, bookings, activity logs, integrations, and report snapshots.

## Internal Routes

- `/app/dashboard`
- `/app/opportunities`
- `/app/calls`
- `/app/estimates`
- `/app/reactivation`
- `/app/campaigns`
- `/app/contacts`
- `/app/reports`
- `/app/templates`
- `/app/integrations`
- `/app/settings`
- `/app/demo-walkthrough`

## Key Workflows

- Missed-call recovery (mock Twilio send/reply + booking logging)
- Estimate rescue enrollment from stale estimates
- Reactivation campaign launch that creates opportunities
