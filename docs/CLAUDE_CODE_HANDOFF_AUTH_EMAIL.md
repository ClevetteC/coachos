# Claude Code handoff: Fix CoachOS signup email rate limits

**Priority task.** Read this file fully, then execute every section in order. Do not skip dashboard SMTP setup; code changes alone do not fix production signups.

## Problem

Beta testers see `email rate limit exceeded` on `/signup`. Cause: Supabase **built-in email** allows only **2 auth emails/hour per project** (all signups + password resets combined). Not a database issue.

## Solution (keep Supabase Auth + email confirmation)

1. **App code** (mostly done in repo): safer signup UX, block unconfirmed users from `/chat`.
2. **Supabase dashboard** (required): custom SMTP via **Resend**, raise email rate limits, correct redirect URLs.

Users still appear in **Supabase → Authentication → Users**. Owner deletes unapproved signups manually. Email confirmation stays enabled.

---

## Phase A — Verify app code (do first)

Confirm these files exist and `npm run build` passes in `coach-os-web/`:

| File | Purpose |
|------|---------|
| `lib/auth-messages.ts` | User-friendly Supabase auth errors |
| `lib/auth-signup.ts` | Handles duplicate-email signUp (empty identities) |
| `app/(auth)/signup/page.tsx` | Uses above; double-submit guard; autocomplete |
| `app/(auth)/login/page.tsx` | Shows confirm-email / callback errors |
| `proxy.ts` | Redirects unconfirmed users to `/login?error=email_not_confirmed` |
| `docs/SUPABASE_AUTH_EMAIL.md` | Full SMTP runbook |
| `README.md` | Links to runbook |

If any file is missing, recreate from git diff or ask the user. Run:

```bash
cd coach-os-web
npm run build
```

Fix build errors before Phase B.

---

## Phase B — Resend (user may need to do DNS)

1. Go to [resend.com](https://resend.com) (or use existing account).
2. **Domains** → add sending domain for CCC (e.g. `clevettecoombs.com` or `mail.clevettecoombs.com`).
3. Add DNS records until domain is **Verified**.
4. **API Keys** → create key named `CoachOS Supabase SMTP` → copy key (shown once).

**Ask the user** if domain is not verified yet; SMTP will fail until DNS propagates.

Resend SMTP credentials for Supabase:

```
Host: smtp.resend.com
Port: 465
Username: resend
Password: <RESEND_API_KEY>
Sender: CoachOS <hello@verified-domain.com>
```

---

## Phase C — Supabase dashboard (required)

Project: CoachOS web app Supabase project (URL in `coach-os-web/.env.local` as `NEXT_PUBLIC_SUPABASE_URL`).

### C1. Enable custom SMTP

1. Dashboard → **Authentication** → **Email** → **SMTP Settings**.
2. Enable SMTP; paste Resend values from Phase B.
3. Set **Sender email** and **Sender name**; Save.

### C2. Keep email confirmation on

- **Authentication** → **Providers** → **Email**: enabled.
- **Confirm email** must remain **enabled** (user requirement).

### C3. URL configuration

**Authentication** → **URL Configuration**:

| Setting | Value |
|---------|--------|
| Site URL | `https://coach-os-web-pink.vercel.app` (or current production URL from `app/layout.tsx` `metadataBase`) |
| Redirect URLs | Add each: |

```
https://coach-os-web-pink.vercel.app/auth/callback
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
```

Add custom production domains when the user provides them.

Signup uses: `emailRedirectTo: ${window.location.origin}/auth/callback`

### C4. Raise rate limits (after SMTP saved)

**Authentication** → **Rate Limits** → **Rate limit for sending emails** → set to **30** (or higher). Save.

Only adjustable after custom SMTP is enabled.

---

## Phase D — Verify end-to-end

1. Supabase **Authentication** → **Logs**: no failed `/signup` for rate limit.
2. Sign up with a **new** test email (`+claude-test1` alias).
3. App shows **Check your email** (not raw rate limit error).
4. Resend **Logs** shows sent message.
5. Click link → lands on `/chat` (or login if session edge case).
6. Supabase **Users** → new row with **Confirmed at** after click.

### Unblock existing beta users (Theresa, etc.)

- **Authentication** → **Users** → find email.
- Wrong signup / spam: **Delete user**, then re-signup after SMTP works.
- Stuck unconfirmed: resend via dashboard or delete + one fresh signup.

---

## Phase E — Ship

From `coach-os-web/`:

```bash
git add README.md app/(auth)/login/page.tsx app/(auth)/signup/page.tsx proxy.ts lib/auth-messages.ts lib/auth-signup.ts docs/
git status
```

**Ask user before commit** unless they said to commit. Suggested message:

```
Fix signup email rate limits: UX hardening and Supabase SMTP docs

- Friendlier auth errors and duplicate-signup handling
- Block app until email confirmed
- Document Resend + Supabase SMTP setup for production signups
```

Deploy to Vercel after push if that is their workflow.

---

## What Claude Code cannot do without the user

- Verify Resend domain DNS (needs domain registrar access).
- Paste Resend API key into Supabase (secrets; user should confirm in dashboard).
- Access Supabase dashboard without login (use browser if user is logged in, or instruct step-by-step).

If Supabase MCP or browser is available, assist with dashboard steps; otherwise print exact clicks from Phase C for the user.

---

## Reference docs

- Detailed runbook: `docs/SUPABASE_AUTH_EMAIL.md`
- Supabase rate limits: https://supabase.com/docs/guides/auth/rate-limits
- Resend + Supabase: https://resend.com/docs/send-with-supabase-smtp

---

## Done criteria

- [ ] `npm run build` passes
- [ ] Custom SMTP enabled in Supabase (not built-in email)
- [ ] Email rate limit raised post-SMTP
- [ ] Production `/auth/callback` in redirect URLs
- [ ] Test signup delivers email and confirms
- [ ] Changes committed/deployed (if user requested)
