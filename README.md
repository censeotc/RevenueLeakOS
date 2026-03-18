# RevenueLeak OS

RevenueLeak OS is a full-stack MVP SaaS app for HVAC, plumbing, electrical, and home-service operators to recover revenue from:

- missed calls
- stale estimates
- dormant customers

The product is intentionally built around a unified `Opportunity` model with three types:

- `missed_call`
- `estimate_rescue`
- `reactivation`

Every major workflow creates or updates an opportunity.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-style local primitives
- Prisma
- PostgreSQL
- Auth.js / NextAuth credentials login
- mockable Twilio service layer
- shared demo dataset + Prisma seed

## Internal routes

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
- `/app/walkthrough`
- `/onboarding`

## Demo tenant

Seeded tenant: **North Shore Heating & Plumbing**

Includes:

- owner, manager, csr, and readonly demo users
- 24 contacts
- 13 opportunities
- 9 call events
- 8 estimates
- 3 campaigns
- 4 templates
- 6 bookings
- recent activity logs
- alerts
- report snapshots

Default demo login:

- shared password: `demo1234`
- seeded roles:
  - `owner@northshore.demo`
  - `ben.carter@northshore.demo`
  - `chloe.reed@northshore.demo`
  - `daniel.kim@northshore.demo`

## Local development

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app in demo mode

   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000/login`

The internal app now runs in demo mode without a database and without copying an `.env` file first. Auth falls back to demo-safe defaults for local development, and the UI reads from a seeded in-memory store.

### Optional database-backed setup

If you want to exercise the Prisma + PostgreSQL path instead of demo-only mode:

1. Copy the environment template

   ```bash
   cp .env.example .env
   ```

2. Start PostgreSQL and set `DATABASE_URL`

   Example:

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/revenueleak_os?schema=public"
   ```

3. Generate Prisma client and push the schema

   ```bash
   npm run db:generate
   npm run db:push
   ```

4. Seed the demo tenant

   ```bash
   npm run db:seed
   ```

## Demo-mode behavior

The UI reads from a shared in-memory demo store so the internal app is usable immediately during development, even before a database is connected. The Prisma schema and `prisma/seed.ts` mirror the same seeded dataset for a PostgreSQL-backed path.

## Core mocked workflows

### Missed-call workflow

1. Missed inbound call arrives
2. Contact is matched or created
3. `missed_call` opportunity is created or updated
4. Message event is recorded
5. Mock SMS is sent through the Twilio layer
6. Reply can be simulated
7. Booking can be logged
8. Dashboard and reports update

### Estimate rescue workflow

1. Estimate exists
2. Stale threshold defaults to 7 days
3. Stale estimate creates an `estimate_rescue` opportunity
4. Estimate can be enrolled in follow-up
5. Estimate can be marked responded, booked, or lost

### Reactivation workflow

1. Dormant segment is selected
2. `reactivation` opportunities are created
3. Campaign is launched
4. Bookings and influenced revenue appear in reporting
