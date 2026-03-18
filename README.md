# RevenueLeak OS

Internal pilot app for home services businesses. Recovers revenue from missed calls, stale estimates, and dormant customers through automated workflows.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 and use the **Quick Demo Login** buttons to sign in as Owner, Manager, or CSR.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** for styling
- **React Router v7** for client-side routing
- **Lucide React** for icons
- **date-fns** for date formatting
- No database required — all data is seeded in-memory

## Features

| Area | What it does |
|------|-------------|
| **Dashboard** | 30-day KPI overview, alerts, activity feed, upcoming bookings |
| **Contacts** | Searchable contact list with tags, detail panel, CSV import |
| **Calls** | Twilio mock integration — simulate missed/outbound calls |
| **Estimates** | Track estimate pipeline, identify stale revenue, CSV import |
| **Opportunities** | Pipeline management for missed calls, stale estimates, reactivations |
| **Campaigns** | Multi-step automated outreach sequences with metrics |
| **Templates** | SMS and email templates with variable preview |
| **Reactivation** | Dormant customer segments with lifetime value at risk |
| **Reports** | Period-over-period metrics, opportunity breakdown, call/estimate/campaign stats |
| **Settings** | Business config, automation rules, team members (owner/manager only) |
| **Integrations** | Connected services dashboard (Twilio, Calendar, CSV, etc.) |
| **Demo Walkthrough** | Guided tour with checklist for pilot reviewers |

## Auth & Roles

Three demo roles with different access levels:

- **Owner** — Full access including Settings
- **Manager** — Full access including Settings
- **CSR** — All operational pages, no Settings

Route guards redirect unauthenticated users to `/login`. Role guards restrict Settings to owner/manager.

## Project Structure

```
src/
├── components/
│   ├── guards/      RouteGuard with role-based access
│   ├── layout/      AppShell, Sidebar, TopBar
│   └── ui/          Button, Card, Badge, Input, Toast, EmptyState, LoadingState, CSVImport
├── contexts/        AuthContext, ToastContext
├── data/            Seed data (24 contacts, 15 opportunities, 10 calls, 10 estimates, etc.)
├── pages/           All 12 internal pages + login
├── services/        twilioMockService, opportunityService, reportingService
└── types/           Full TypeScript type definitions
```
