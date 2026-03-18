# RevenueLeak OS

RevenueLeak OS is an internal-first MVP SaaS application for HVAC, plumbing, electrical, and home-service teams to recover revenue from:

- missed calls
- stale estimates
- dormant customers

The product is built around a unified `Opportunity` model and ships with a fully seeded demo tenant for **North Shore Heating & Plumbing**.

## Tech stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-style component layer
- Prisma
- PostgreSQL schema + seed
- NextAuth credentials auth
- Zod
- React Hook Form
- TanStack Table
- Recharts

## Demo tenant

### Business defaults

- Timezone: `America/Detroit`
- Stale estimate days: `7`
- Attribution window days: `14`
- High-value threshold: `2500`
- Duplicate missed-call suppression window: `4 hours`

### Demo credentials

- `owner@northshore.demo` / `DemoPass123!`
- `manager@northshore.demo` / `DemoPass123!`
- `csr@northshore.demo` / `DemoPass123!`

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
- `/app/demo-walkthrough`
- `/onboarding`
- `/login`

## File tree

```text
.
├── components.json
├── docker-compose.yml
├── package.json
├── prisma
│   ├── schema.prisma
│   └── seed.ts
├── prisma.config.ts
├── src
│   ├── app
│   │   ├── (internal)/app/*
│   │   ├── (public)/login/*
│   │   ├── actions.ts
│   │   ├── api/auth/[...nextauth]/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── onboarding/*
│   │   └── page.tsx
│   ├── components
│   │   ├── app-shell/*
│   │   ├── charts/*
│   │   ├── import/*
│   │   ├── providers/*
│   │   ├── tables/*
│   │   └── ui/*
│   ├── lib
│   │   ├── auth/*
│   │   ├── data/*
│   │   ├── demo/*
│   │   ├── domain/*
│   │   ├── prisma.ts
│   │   ├── services/*
│   │   └── utils.ts
│   ├── proxy.ts
│   └── types/*
├── tsconfig.json
└── .env.example
```

## What is included

- Authenticated internal app shell with role-aware navigation
- Dashboard with KPI cards, charts, alerts, quick actions, and recent activity
- Unified opportunities inbox with notes, assignment, status changes, and timeline
- Functional mock missed-call workflow:
  1. inbound call is simulated
  2. contact is matched or created
  3. `missed_call` opportunity is created
  4. call event is created
  5. message event is created
  6. Twilio mock service sends SMS
  7. reply can be simulated
  8. booking can be logged
  9. dashboard/reports update from live mock state
- Estimate rescue workflow with stale estimate enrollment and state transitions
- Reactivation workflow with segment launch and opportunity generation
- Campaign, template, integration, settings, reports, contacts, and demo walkthrough screens
- CSV import scaffold for contacts and estimates
- PostgreSQL Prisma schema and demo seed script

## Local run instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

### 3. Start PostgreSQL locally

```bash
docker compose up -d
```

### 4. Generate Prisma client and push schema

```bash
npm run db:generate
npm run db:push
```

### 5. Seed demo data

```bash
npm run db:seed
```

### 6. Start the app

```bash
npm run dev
```

Open `http://localhost:3000/login`.

## Notes on runtime behavior

- The UI uses a seeded in-memory demo store for fast local MVP behavior and mock workflow simulation.
- Prisma schema + seed are ready for PostgreSQL-backed evolution and pilot data loading.
- The Twilio layer is intentionally mockable via `twilioMockService`.

## Validation

The current codebase passes:

- `npm run db:generate`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
