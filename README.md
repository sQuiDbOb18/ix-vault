# IX VAULT

IX VAULT is a premium dark-UI clan treasury and payment tracker for `9₮H_LEGION`, built with Next.js 14, Supabase, NextAuth, SWR, Tailwind CSS, and TypeScript strict mode.

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Confirm the `receipts` storage bucket exists and is public.
4. Copy the Project URL, anon key, and service role key into `.env.local`.
5. Keep the service role key server-only. It is used only in API routes.

## Environment

Create `.env.local` from `.env.example`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side database and storage access |
| `NEXTAUTH_SECRET` | JWT/session encryption secret |
| `NEXTAUTH_URL` | Local or production app URL |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash for the admin password |
| `NEXT_PUBLIC_APP_NAME` | Public app name |
| `NEXT_PUBLIC_CLAN_NAME` | Public clan name |

## Generate Secrets

Generate `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

Hash the admin password:

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('your-password', 12).then(console.log)"
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, sign in with `ADMIN_USERNAME` and the password used to create `ADMIN_PASSWORD_HASH`.

## Vercel Deployment

1. Push the repository to GitHub.
2. Import it in Vercel.
3. Add every environment variable from `.env.example`.
4. Deploy with the included `vercel.json` configuration.

## GitHub Push

```bash
git init
git add .
git commit -m "feat: ix vault — 9₮H_LEGION treasury"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ix-vault.git
git push -u origin main
```

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `N` | Open Add Payment drawer |
| `/` | Focus payment search |
| `Escape` | Close open drawer, modal, lightbox, or menu |
| `?` | Reserved for keyboard help overlay |

## Features

- Credentials-based admin auth with seven-day JWT sessions.
- Protected dashboard, members, and history routes.
- Supabase-backed payment CRUD, member summaries, activity log, and receipt uploads.
- Optimistic SWR mutations for fast add, edit, and delete flows.
- Dark command-center design system with responsive table/card layouts.
- Receipt lightbox with image/PDF handling, keyboard navigation, and mobile swipe navigation.
