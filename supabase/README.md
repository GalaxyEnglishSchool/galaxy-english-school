# Supabase setup (free)

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
3. Password: use the **same password** as your office tools gate (or note a dedicated one and use that when unlocking office).
4. Confirm the user (disable “invite” if you set password directly).

## 4. API keys for the website

1. **Project Settings** → **API**.
2. Copy **Project URL** and **anon public** key (not the `service_role` key).

## 5. Local env file

In the project root, create `.env.local` (never commit this file):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_SUPABASE_OFFICE_EMAIL=galaxyenglishschool55@gmail.com
```

Restart `npm run dev` after changing env.

## 6. Production (GitHub Pages / host)

Add the same three variables in your host’s **environment variables** / **secrets** for the build, then redeploy.

## Viewing saved tests

**Table Editor** → `admissions` — filter/sort by date, phone, class.

## Teachers table

`teachers` is ready in the database; the app UI for teachers can be added later.

## Cost

Free tier is enough for one school’s admission records and teacher list.
