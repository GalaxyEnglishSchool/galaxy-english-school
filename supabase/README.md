# Supabase setup (free)

> **Not in use:** The website does not connect to Supabase right now. Office tools use browser session storage and Print/PDF only. Keep this folder for a future cloud-save rollout.

## 1. Create project

1. Go to [supabase.com](https://supabase.com) → sign up (free).
2. **New project** → pick a name and database password (save it somewhere safe).
3. Wait until the project is ready.

## 2. Run database SQL

1. In Supabase: **SQL Editor** → **New query**.
2. Copy all of `schema.sql` from this folder → **Run**.

## 3. Create a staff login

1. **Authentication** → **Users** → **Add user** → **Create new user**.
2. Email: e.g. `office@your-school.org` (any email you control).
3. Email must match `VITE_SUPABASE_OFFICE_EMAIL` exactly (e.g. `galaxyenglishschool55@gmail.com`).
4. Password: **exactly the same** as the office gate password (e.g. `Galaxy@1970`).
5. Turn **Auto Confirm User** **ON**, then create the user.

## 4. API keys for the website

1. **Project Settings** → **API**.
2. Copy **Project URL** and **publishable** or **anon public** key (not the **secret** / `service_role` key).
3. If login fails, try the long `eyJ...` **anon** key instead of `sb_publishable_...` in `VITE_SUPABASE_ANON_KEY`.

## 5. Local env file

In the project root, create `.env.local` (never commit this file):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_SUPABASE_OFFICE_EMAIL=galaxyenglishschool55@gmail.com
```

Restart `npm run dev` after changing env.

## 6. Production (GitHub Pages)

`.env.local` works only on your PC. The live site is built on GitHub — add **repository secrets**:

1. GitHub → your repo → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** (create all three):

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | `https://xhwgcgfafuxlznreqbfz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | your `sb_publishable_...` key (not the secret key) |
| `VITE_SUPABASE_OFFICE_EMAIL` | `galaxyenglishschool55@gmail.com` |

3. **Actions** → **Deploy to GitHub Pages** → **Run workflow** (or push to `main`).

After deploy, office save works on the live URL too.

## 7. Local dev — “Cloud save off”?

1. File `.env.local` in project root (next to `package.json`) with the three `VITE_...` lines.
2. Stop and restart: `npm run dev` (env is read only at startup).
3. Use `http://localhost:5173/...` — not the GitHub Pages URL — until secrets are set and redeployed.

## Viewing saved tests

**Table Editor** → `admissions` — filter/sort by date, phone, class.

## Teachers table

`teachers` is ready in the database; the app UI for teachers can be added later.

## Cost

Free tier is enough for one school’s admission records and teacher list.
