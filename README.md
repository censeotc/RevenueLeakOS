# RevenueLeak OS

An open-source revenue recovery platform for home-service businesses. RevenueLeak OS identifies missed opportunities from unsold estimates, lapsed customers, and missed calls — then automates follow-up workflows to recover that lost revenue.

## Features

- **Dashboard** — KPIs, alerts, recovery trends, and quick actions at a glance
- **Opportunity Pipeline** — Track every revenue recovery opportunity from detection to conversion
- **Call & SMS Tracking** — Log inbound/outbound calls and SMS threads with Twilio integration
- **Estimate Follow-up** — Automatically enroll unsold estimates in drip campaigns
- **Customer Reactivation** — Segment lapsed customers and launch re-engagement campaigns
- **Campaign Builder** — Multi-step SMS/email campaigns with a visual editor
- **Reporting** — Direct vs. influenced revenue, workflow comparison, and conversion funnels
- **Template Library** — Reusable SMS/email templates with variable substitution
- **Integrations** — Connect your CRM, phone system, and estimating tools
- **Role-Based Access** — Configurable permissions for owners, managers, and staff

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Database | PostgreSQL via Prisma |
| Auth | NextAuth.js |
| Telephony | Twilio (mock-ready) |

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-org/revenueleak-os.git
cd revenueleak-os

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env

# 4. Set up the database
npx prisma migrate dev --name init
npx prisma db seed

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
├─ prisma/           # Database schema & seed data
├─ public/           # Static assets (logo, demo images, icons)
├─ src/
│  ├─ app/           # Next.js App Router pages & API routes
│  ├─ components/    # React components organised by feature
│  ├─ data/          # Static/demo data modules
│  ├─ hooks/         # Custom React hooks
│  ├─ lib/           # Utilities, auth, DB client, validators
│  ├─ services/      # Business-logic services
│  └─ types/         # Shared TypeScript types
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio |
| `npx prisma db seed` | Seed demo data |

## License

MIT
