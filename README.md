# Alstom Transport Private Limited – Continuous Performance Management System (CPMS)

Production-grade Next.js (App Router) + TypeScript + Tailwind CSS + Recharts + PostgreSQL (Prisma ORM) web application.

## 1. Quick Local Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Update DATABASE_URL in .env to point to your PostgreSQL instance

# 3. Push Prisma schema to PostgreSQL & seed 50 Alstom employees
npx prisma generate
npx prisma db push
npm run db:seed

# 4. Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

## 2. One-Click Cloud Hosting (Vercel / Render / Railway)

1. Push this folder to a GitHub repository.
2. Import the repository into **Vercel** (or **Railway** / **Render**).
3. Attach a managed **PostgreSQL** database (Neon, Supabase, or Vercel Postgres) and set `DATABASE_URL` in Environment Variables (note: the app also includes an automatic fallback to the deterministic 50-employee dataset so the live UI works immediately even before connecting Postgres).
4. Click **Deploy**.

## 3. Default Demo Credentials (Seeded)

All seeded accounts use password: **`Alstom@2026`** (or use the instant **View as Role** switcher in the top navigation bar):

- **Admin / HR:** `kavitha.raghavan@alstomgroup-demo.in` (`ATPL-1008`)
- **Engineering Manager:** `aravind.chakraborty@alstomgroup-demo.in` (`ATPL-1006`)
- **Employee (ATS Signalling):** `ajay.harikumar@alstomgroup-demo.in` (`ATPL-1025`)
