# RevenueLeak OS

Revenue recovery platform for HVAC, plumbing, electrical, and home-service companies.

## Overview

RevenueLeak OS helps home service businesses recover revenue from:
- **Missed Calls** — Automatic SMS follow-up within seconds
- **Stale Estimates** — Rescue estimates before they go cold
- **Dormant Customers** — Win back customers who haven't booked in 12+ months

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom (Radix UI primitives)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: NextAuth v5 (Auth.js)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **SMS**: Twilio (mock service for development)

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your DATABASE_URL and NEXTAUTH_SECRET

# Set up database
npx prisma db push

# Seed demo data
npm run db:seed

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Owner | owner@northshoreht.com | demo1234 |
| Manager | manager@northshoreht.com | demo1234 |
| CSR | csr@northshoreht.com | demo1234 |

## Demo Tenant

The seed script creates **North Shore Heating & Plumbing** with:
- 25+ contacts
- 13 opportunities (missed calls, estimate rescues, reactivations)
- 9 call events
- 9 estimates (4 stale)
- 3 active campaigns
- 6 templates
- 7 bookings
- Full activity log and report snapshots

## Routes

| Route | Description |
|-------|-------------|
| `/app/dashboard` | KPI overview, alerts, charts |
| `/app/opportunities` | Unified opportunity inbox |
| `/app/calls` | Inbound call log with SMS threads |
| `/app/estimates` | Stale estimate management |
| `/app/reactivation` | Dormant customer segments |
| `/app/campaigns` | Automated follow-up campaigns |
| `/app/contacts` | Customer and lead management |
| `/app/reports` | Revenue recovery analytics |
| `/app/templates` | SMS/email template library |
| `/app/integrations` | Twilio, Jobber, ServiceTitan, etc. |
| `/app/settings` | Business profile, users, permissions |
| `/app/demo-walkthrough` | Interactive product tour |

## Core Domain Model

The entire app revolves around a unified **Opportunity** model:

```
OpportunityType:
  - missed_call        → Created from inbound missed calls
  - estimate_rescue    → Created from stale estimates
  - reactivation       → Created from dormant customer campaigns
```

## Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-32-char-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:push      # Push schema to database
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio
npm run lint         # ESLint check
```
