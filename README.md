# RevenueLeak OS

Revenue recovery platform for home service businesses. RevenueLeak OS automatically detects missed calls, stale estimates, and dormant customers — then recovers that lost revenue through automated SMS/email follow-ups and smart campaign workflows.

## Features

- **Dashboard** — KPI cards (revenue influenced, opportunities recovered, bookings created, avg response time), recovery trend chart, workflow performance breakdown, and real-time activity feed
- **Opportunities Inbox** — Filterable list of all revenue-recovery opportunities across missed calls, stale estimates, and reactivation candidates with status tracking
- **Calls Monitoring** — Inbound call log with missed/answered status, after-hours flagging, duration tracking, transcription, and intake summaries
- **Estimates Recovery** — Track open, stale, responded, booked, and lost estimates with follow-up scheduling and expiration management
- **Customer Reactivation** — Segment dormant customers by inactivity window, maintenance due dates, or equipment age and trigger re-engagement campaigns
- **Campaigns Management** — Multi-step SMS/email campaign builder with audience targeting, send/response/booking metrics, and stop-on-reply/booking controls
- **Contacts Database** — Full customer/lead/former-customer directory with lifetime value, tags, service history, and source tracking
- **Reports & Analytics** — Weekly and monthly report snapshots with recovery rates, revenue attribution, and service-type breakdowns
- **Templates Editor** — Reusable SMS and email templates with variable interpolation (first name, business name, service type, etc.)
- **Integrations Scaffold** — Connection management for Twilio, Jobber, Housecall Pro, ServiceTitan, Gmail, Outlook, Google Calendar, and CSV import
- **Settings Management** — Business profile, thresholds (stale estimate days, attribution window, high-value threshold, missed call suppression), and user management
- **Demo Walkthrough** — Fully seeded demo tenant with realistic Michigan-based HVAC/plumbing data

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components (Radix primitives)
- **Prisma ORM**
- **PostgreSQL**
- **Recharts** (charts and data visualization)
- **Zod** (schema validation)
- **React Hook Form** (form management)
- **Lucide React** (icons)
- **date-fns** (date utilities)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

```bash
git clone <repo-url>
cd revenueleak-os
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your database URL
```

The `.env` file requires at minimum:

```
DATABASE_URL="postgresql://user:password@localhost:5432/revenueleak?schema=public"
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### Development

```bash
npm run dev
# Open http://localhost:3000
```

## Demo Credentials

| Role    | Email                         | Password |
| ------- | ----------------------------- | -------- |
| Owner   | mike@northshoreheating.com    | demo     |
| Manager | sarah@northshoreheating.com   | demo     |
| CSR     | jake@northshoreheating.com    | demo     |

## Project Structure

```
revenueleak-os/
├── prisma/
│   ├── schema.prisma          # Database schema (all models and enums)
│   └── seed.ts                # Demo data seed script
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing / login page
│   │   ├── globals.css        # Global styles & Tailwind imports
│   │   └── app/
│   │       ├── layout.tsx     # App shell (sidebar + topbar)
│   │       ├── dashboard/     # KPI cards, charts, activity feed
│   │       ├── opportunities/ # Revenue-recovery opportunity inbox
│   │       ├── calls/         # Call event log
│   │       ├── estimates/     # Estimate tracking & rescue
│   │       ├── reactivation/  # Dormant customer segments
│   │       ├── campaigns/     # Campaign builder & metrics
│   │       ├── contacts/      # Contact directory
│   │       ├── reports/       # Analytics & report snapshots
│   │       ├── templates/     # SMS/email template editor
│   │       ├── integrations/  # Third-party connection management
│   │       └── settings/      # Business & user settings
│   ├── components/
│   │   ├── layout/            # Sidebar, topbar, page header
│   │   └── ui/                # shadcn/ui primitives
│   ├── lib/
│   │   ├── demo-data.ts       # In-memory demo data (no DB required)
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── utils.ts           # Utility functions (cn, formatters)
│   │   └── services/          # Business logic services
│   │       ├── campaignService.ts
│   │       ├── importService.ts
│   │       ├── opportunityService.ts
│   │       ├── reportingService.ts
│   │       └── twilioMockService.ts
│   └── types/
│       └── index.ts           # Shared TypeScript interfaces
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Routes

| Path                    | Description                          |
| ----------------------- | ------------------------------------ |
| `/`                     | Landing / login page                 |
| `/app/dashboard`        | Main dashboard with KPIs and charts  |
| `/app/opportunities`    | Opportunity inbox with filters       |
| `/app/calls`            | Call event monitoring                |
| `/app/estimates`        | Estimate tracking and rescue         |
| `/app/reactivation`     | Dormant customer reactivation        |
| `/app/campaigns`        | Campaign management                  |
| `/app/contacts`         | Contact database                     |
| `/app/reports`          | Reports and analytics                |
| `/app/templates`        | SMS/email template editor            |
| `/app/integrations`     | Integration connections              |
| `/app/settings`         | Business and user settings           |

## Business Rules

| Rule                          | Default Value | Description                                                    |
| ----------------------------- | ------------- | -------------------------------------------------------------- |
| Stale Estimate Threshold      | 7 days        | Estimates without a response after this period are marked stale |
| Attribution Window            | 14 days       | Bookings within this window are attributed to the campaign      |
| High Value Threshold          | $2,500        | Opportunities above this amount are flagged as high-priority    |
| Missed Call Suppression        | 4 hours       | Suppress duplicate follow-ups for the same caller               |

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio
```

## License

MIT
