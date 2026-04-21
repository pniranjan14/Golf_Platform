# ⛳ Golf Platform Dashboard

A premium, full-stack golf platform built with React, Vite, and Supabase. Features include "Rolling 5" score tracking, a weighted prize draw engine, and automated charity support.

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Supabase Account](https://supabase.com/)

### 2. Installation
```powershell
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_APP_URL=http://localhost:5173
```

### 4. Run Development Server
```powershell
npm run dev
```

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS
- **Motion**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Logic**: Supabase Edge Functions (Deno)
- **Payments**: Stripe Integration

## ⚖️ Business Logic: "Rolling 5"
The platform enforces a strict "Rolling 5" score policy. Only your last 5 score entries are active. When you submit a 6th score, the oldest entry is automatically purged from the database to maintain data integrity and draw eligibility.

## 🗳️ Draw Engine
Monthly draws occur via a secure Edge Function located in `supabase/functions/draw-engine`. The engine calculates Match 3, 4, and 5 winners and manages the collective prize pool.

---
© 2026 Golf Platform. Premium Midnight Elite Design.
