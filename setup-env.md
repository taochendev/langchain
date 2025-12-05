# 🔧 Environment Setup Guide

## The error you're seeing means you need to configure real Supabase credentials.

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login
3. Click "New Project" 
4. Fill in details:
   - **Name**: campaign-generator
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
5. Wait 2-3 minutes for setup

### Step 2: Get API Keys

1. In your Supabase project dashboard
2. Go to **Settings** → **API** (left sidebar)
3. Copy these values:
   - **URL**: `https://your-project-id.supabase.co`
   - **service_role secret**: `eyJhbGciOiJIUzI1NiIs...` (long key)

### Step 3: Edit backend/.env file

Open `backend/.env` in your text editor and replace:

```env
# Replace these placeholder values with your real ones:
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIs...your-actual-service-key...

# Also get OpenAI API key from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-...your-openai-key...
```

### Step 4: Edit frontend/.env.local file

Open `frontend/.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...your-anon-key...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

⚠️ **Important**: Use **anon public** key for frontend, **service_role secret** for backend!

### Step 5: Setup Database

1. In Supabase dashboard, go to **SQL Editor**
2. Copy content from `docs/database-setup.sql`
3. Paste and run it

### Step 6: Test

```bash
npm run dev
```

## 🚀 Quick Links:
- [Supabase Dashboard](https://supabase.com/dashboard)
- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [Database Setup SQL](./docs/database-setup.sql)
