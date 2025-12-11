# Vercel Deployment Guide - Next.js + Supabase

## 🚀 Deploy Your Admin Panel to Vercel

Your Next.js admin panel with Supabase backend is ready to deploy!

---

## Prerequisites

1. **GitHub Account** - Sign up at https://github.com
2. **Vercel Account** - Sign up at https://vercel.com (free)
3. **Supabase Account** - Sign up at https://supabase.com (free)
4. **Supabase Project** - Already set up with your database

---

## Step 1: Prepare Supabase

### 1. Verify Your Supabase Project

1. Go to https://supabase.com/dashboard
2. Open your project
3. Go to **Settings** → **API**
4. Copy these values (you'll need them later):
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 2. Ensure Database Tables Exist

Go to **SQL Editor** and run:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

If tables are missing, run the SQL from `supabase-schema.sql`.

### 3. Populate Users Table

Run the SQL from `insert-users.sql` to add the 10 test users:

```sql
INSERT INTO users (name, email, password, role, phone, joined_date, last_seen) VALUES
('Aadithyan R S', 'aadithyanrs9e@gmail.com', 'chair123', 'Chair', '+91 9876543210', '2024-01-15', NOW()),
('Archa Sunil', 'archasunil777@gmail.com', 'vicechair123', 'Vice Chair', '+91 9876543211', '2024-01-20', NOW());
-- ... (see insert-users.sql for all users)
```

### 4. Check Row Level Security (RLS)

For testing, you can disable RLS on the users table:

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

Or create a policy to allow public read access:

```sql
CREATE POLICY "Allow public read access" ON users
FOR SELECT USING (true);
```

---

## Step 2: Push to GitHub

### Initialize Git (if not already done)

```bash
cd C:\Users\yuuge\OneDrive\Desktop\ADMIN
git init
```

### Verify .gitignore

Your `.gitignore` should include:
```
node_modules/
.next/
.env*.local
.env
```

**Important:** `.env.local` should NOT be committed to Git!

### Commit and Push

```bash
git add .
git commit -m "Initial commit - Admin Panel with Supabase"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

---

## Step 3: Deploy on Vercel

### 1. Sign Up / Log In to Vercel

Go to https://vercel.com and sign in with GitHub.

### 2. Import Your Repository

1. Click **"Add New..."** → **"Project"**
2. Select your GitHub repository
3. Click **"Import"**

### 3. Configure Project Settings

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (leave as default)

**Build Command:** `npm run build` (auto-detected)

**Output Directory:** `.next` (auto-detected)

### 4. Add Environment Variables ⚠️ CRITICAL

Click **"Environment Variables"** and add:

| Name | Value | Where to find |
|------|-------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Supabase → Settings → API → anon public |

**Important:** 
- These must be set for Production, Preview, and Development
- The `NEXT_PUBLIC_` prefix makes them available in the browser
- Without these, login will fail!

### 5. Deploy

Click **"Deploy"** and wait 2-3 minutes.

---

## Step 4: Verify Deployment

### 1. Check Build Logs

If deployment fails:
1. Click on the failed deployment
2. Check the build logs for errors
3. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies

### 2. Test Your App

Once deployed, Vercel gives you a URL like:
`https://your-app-name.vercel.app`

1. Visit the URL
2. You should see the login page with shader animation
3. Try logging in with test credentials:
   - Email: `aadithyanrs9e@gmail.com`
   - Password: `chair123`

### 3. Check Function Logs

If login fails:
1. Go to Vercel Dashboard → Your Project
2. Click **"Logs"** tab
3. Try logging in again
4. Check for errors in the logs
5. Look for console.log output:
   - "Login attempt for: [email]"
   - "Users found: X" (should be 10)

---

## Troubleshooting

### Issue 1: "Invalid credentials" with correct password

**Symptoms:**
- Login always fails
- No errors in browser console

**Cause:** Environment variables not set or Supabase connection failing

**Fix:**
1. Verify environment variables in Vercel Settings
2. Check Vercel function logs for "Users found: 0"
3. If 0 users found, Supabase isn't connected
4. Redeploy after adding environment variables

### Issue 2: Build fails with "Module not found"

**Cause:** Missing dependencies

**Fix:**
```bash
# Locally, ensure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Issue 3: Cookies not being set

**Cause:** This is normal - the code already handles this correctly

**Current code:**
```typescript
secure: process.env.NODE_ENV === "production"
```

This ensures cookies work in both development (HTTP) and production (HTTPS).

### Issue 4: Empty users table in Supabase

**Symptoms:**
- Function logs show "Users found: 0"
- Environment variables are set correctly

**Fix:**
1. Go to Supabase SQL Editor
2. Run: `SELECT * FROM users;`
3. If empty, run `insert-users.sql`
4. Try logging in again

### Issue 5: RLS (Row Level Security) blocking queries

**Symptoms:**
- Users table has data
- Function logs show "Users found: 0"

**Fix:**
```sql
-- Temporarily disable RLS for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Or create a policy
CREATE POLICY "Allow public read" ON users
FOR SELECT USING (true);
```

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Login works with test credentials
- [ ] Dashboard loads correctly
- [ ] Events calendar displays
- [ ] Members page shows data
- [ ] Announcements can be created
- [ ] File upload works (if using Supabase Storage)
- [ ] All navigation links work
- [ ] Logout redirects to login page

---

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push

# Vercel automatically builds and deploys!
```

**Preview Deployments:**
- Every pull request gets a preview URL
- Test changes before merging to main

---

## Environment Variables Reference

### Required Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Optional Variables

```env
# If you add Supabase Storage for file uploads
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=uploads
```

---

## Performance Tips

### 1. Enable Vercel Analytics

1. Go to Vercel Dashboard → Your Project
2. Click **"Analytics"** tab
3. Enable Web Analytics (free)
4. Monitor page load times and user interactions

### 2. Optimize Images

Use Next.js Image component:
```tsx
import Image from 'next/image';

<Image src="/logo.png" width={100} height={100} alt="Logo" />
```

### 3. Enable Caching

Supabase queries are already cached with SWR in your code!

---

## Cost Summary

**Vercel:**
- Free tier: Perfect for this project
- Includes: Unlimited deployments, preview URLs, analytics
- Paid ($20/mo): More bandwidth, team features

**Supabase:**
- Free tier: 500MB database, 1GB file storage
- Includes: PostgreSQL, authentication, storage
- Paid ($25/mo): More storage, better performance

**Total for free tier:** $0/month 🎉

---

## Security Best Practices

### 1. Never Commit .env Files

Your `.gitignore` already prevents this:
```
.env*.local
.env
```

### 2. Use Environment Variables

All secrets should be in Vercel environment variables, not in code.

### 3. Enable RLS in Supabase

For production, enable Row Level Security:
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create appropriate policies
CREATE POLICY "Users can read own data" ON users
FOR SELECT USING (auth.uid() = id);
```

### 4. Use HTTPS Only

Vercel automatically provides HTTPS for all deployments.

---

## Monitoring and Logs

### Vercel Function Logs

View real-time logs:
1. Vercel Dashboard → Your Project
2. Click **"Logs"** tab
3. Filter by function (e.g., `/api/auth/login`)

### Supabase Logs

View database queries:
1. Supabase Dashboard → Your Project
2. Click **"Logs"** → **"Postgres Logs"**

---

## Updating Your Deployment

### Update Code

```bash
# Make changes
git add .
git commit -m "Update feature"
git push
# Vercel auto-deploys!
```

### Update Environment Variables

1. Vercel Dashboard → Settings → Environment Variables
2. Edit or add variables
3. Click **"Save"**
4. Redeploy: Deployments → Latest → Redeploy

### Update Database Schema

1. Go to Supabase SQL Editor
2. Run migration SQL
3. No need to redeploy Vercel

---

## Support and Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Your deployment logs:** Vercel Dashboard → Logs

---

🎉 **Your admin panel is now live on the internet!**

**Next Steps:**
1. Share the Vercel URL with your team
2. Test all features in production
3. Monitor usage and performance
4. Add more features as needed
