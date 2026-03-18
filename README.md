# RevenueLeak OS (MVP)

RevenueLeak OS is a full-stack revenue recovery platform MVP for HVAC, plumbing, electrical, and home-service companies.

Core architecture centers on a **unified Opportunity model** with three types:

- `missed_call`
- `estimate_rescue`
- `reactivation`

Every major workflow creates or updates opportunities.

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- shadcn/ui-style component primitives
- PostgreSQL + Prisma
- Auth.js (`next-auth`) credentials auth
- Mockable Twilio service layer

## Internal app routes

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
- `/app/onboarding`

## Demo tenant + login

Seed creates:

- Tenant: **North Shore Heating & Plumbing**
- 20+ contacts
- 12+ opportunities
- 8+ call events
- 8+ estimates
- 3+ campaigns
- 4+ templates
- 6+ bookings
- activity logs + alerts + report snapshots

Demo login:

- Email: `owner@northshorehvac.com`
- Password: `DemoPass123!`

## Local setup

1. Install dependencies

```bash
npm install
```

2. Start PostgreSQL (Docker)

```bash
docker compose up -d
```

3. Configure environment

```bash
cp .env.example .env
```

Set a real `NEXTAUTH_SECRET` in `.env`.

4. Create schema + client + seed data

```bash
npm run db:push
npm run db:generate
npm run db:seed
```

5. Start app

```bash
npm run dev
```

Open: `http://localhost:3000` (redirects to login/app shell).

## Workflow highlights

### Missed-call workflow (mocked, functional)

1. Simulate missed inbound call from `/app/calls` or dashboard quick action
2. Match/create contact by phone
3. Create `missed_call` opportunity (with duplicate suppression window)
4. Create message event
5. Send mock SMS through Twilio service layer
6. Simulate reply
7. Log booking
8. Dashboard + reports update

### Estimate rescue workflow

1. Stale threshold defaults to `7` days
2. Stale estimate can create/update `estimate_rescue` opportunity
3. Enroll estimate in follow-up
4. Mark responded/booked/lost

### Reactivation workflow

1. Choose dormant segment
2. Launch campaign
3. Create `reactivation` opportunities
4. Track bookings and influenced revenue
