# CoachOS Web

Next.js app for CoachOS (CCC): authenticated chat, per-user foundation data, and Supabase-backed storage.

## Environment

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
```

## Auth email (required before beta / production signups)

Signup uses Supabase email confirmation. **You must configure custom SMTP** or testers will hit `email rate limit exceeded` (built-in mail allows only 2 emails/hour per project).

Step-by-step: **[docs/SUPABASE_AUTH_EMAIL.md](docs/SUPABASE_AUTH_EMAIL.md)** (Resend + Supabase dashboard).

Beta user management: **Supabase Dashboard → Authentication → Users**. Delete users you do not approve; unconfirmed users cannot access the app until they click the email link.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Hosted on Vercel. After deploy, add the production URL to Supabase **Authentication → URL Configuration** (see auth email doc).
