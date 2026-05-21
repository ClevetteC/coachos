# Supabase auth email setup (fixes signup rate limits)

CoachOS uses Supabase Auth with **email confirmation**. New users appear under **Authentication → Users** in the Supabase dashboard. You can delete signups you do not want to approve.

The error `email rate limit exceeded` happens when the project still uses Supabase’s **built-in email**, which allows only **2 auth emails per hour** for the entire project (all signups and password resets combined). That is not enough for beta or production.

**Fix:** connect **custom SMTP** (Resend recommended). Auth, confirmation links, and the user list stay in Supabase. No app rewrite.

---

## 1. Resend (about 10 minutes)

1. Create an account at [resend.com](https://resend.com).
2. **Domains** → add your sending domain (e.g. `clevettecoombs.com` or a subdomain like `mail.clevettecoombs.com`).
3. Add the DNS records Resend shows (SPF, DKIM). Wait until the domain shows **Verified**.
4. **API Keys** → create a key (e.g. `CoachOS Supabase`). Copy it once; you will use it as the SMTP password.

SMTP values for Supabase:

| Field | Value |
|--------|--------|
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | Your Resend API key |

Sender example: `CoachOS <hello@your-verified-domain.com>` (must use the verified domain).

---

## 2. Supabase SMTP (required)

1. Open your CoachOS project in [Supabase Dashboard](https://supabase.com/dashboard).
2. **Authentication** → **Email** (under Notifications) → **SMTP Settings**.
3. Enable custom SMTP and enter the Resend values above.
4. Set **Sender email** and **Sender name** (required).
5. Save.

Confirm these are still correct:

- **Authentication** → **Providers** → **Email**: enabled.
- **Authentication** → **Sign In / Providers** (or **Email** settings): **Confirm email** enabled (keep this for beta control).

---

## 3. Site URL and redirect URLs

Confirmation links must return to your live app.

1. **Authentication** → **URL Configuration**.
2. **Site URL**: your production URL, e.g. `https://coach-os-web-pink.vercel.app` (or your custom domain).
3. **Redirect URLs** — add each environment you use:

   ```
   https://coach-os-web-pink.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   http://localhost:3001/auth/callback
   ```

   Add custom domains when you use them.

The app sends users to `{origin}/auth/callback` after they click the email link.

---

## 4. Raise email rate limits (after SMTP is saved)

Built-in limits cannot be raised. After custom SMTP is active:

1. **Authentication** → **Rate Limits**.
2. Increase **Rate limit for sending emails** (e.g. `30` or higher for rollout).
3. Save.

---

## 5. Managing beta users in the dashboard

| Goal | Where |
|------|--------|
| See everyone who signed up | **Authentication** → **Users** |
| Not confirmed yet | User row: no **Confirmed at** / email unconfirmed |
| Remove someone who should not have access | Select user → **Delete user** |
| Resend confirmation | User → **Send password recovery** or invite flow (or delete and ask them to sign up again) |

Until they confirm email, they should not get a full session. The app also blocks unconfirmed accounts in middleware.

---

## 6. Verify the fix

1. In Supabase **Authentication** → **Logs**, watch for failed `/signup` events.
2. Sign up with a **new** test email (not one that already exists).
3. You should see **Check your email** in the app and a message in Resend **Logs**.
4. Click the link → land on `/chat` after sign-in.

If SMTP is wrong, Supabase logs often show mail delivery errors; Resend logs stay empty.

---

## 7. Do not burn the quota during testing

- Avoid repeated signup clicks on the same address while debugging.
- Use different test emails (`you+test1@...`, `you+test2@...`).
- Prefer **one** signup attempt per test email.

After SMTP is on, limits are much higher, but good habits still help.

---

## Checklist before inviting beta testers

- [ ] Resend domain verified
- [ ] Supabase custom SMTP saved and sender uses verified domain
- [ ] Site URL and `/auth/callback` redirect URLs include production URL
- [ ] Email rate limit raised (post-SMTP)
- [ ] Confirm email still enabled
- [ ] Test signup end-to-end with a fresh email
