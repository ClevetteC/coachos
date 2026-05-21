/**
 * Maps Supabase Auth API errors to clearer copy for signup/login forms.
 */
export function formatAuthError(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('email rate limit')) {
    return (
      'We could not send a confirmation email because the project email limit was reached. ' +
      'Wait about an hour and try once, or contact support. ' +
      'If you are setting up CoachOS, enable custom SMTP in Supabase (see docs/SUPABASE_AUTH_EMAIL.md).'
    )
  }

  if (
    lower.includes('already registered') ||
    lower.includes('already been registered') ||
    lower.includes('user already registered')
  ) {
    return (
      'An account with this email may already exist. Check your inbox for a confirmation link, or sign in.'
    )
  }

  if (lower.includes('invalid login credentials')) {
    return 'Email or password is incorrect. If you just signed up, confirm your email first.'
  }

  if (lower.includes('email not confirmed')) {
    return 'Confirm your email before signing in. Check your inbox for the link from CoachOS.'
  }

  if (lower.includes('password') && lower.includes('least')) {
    return message
  }

  return message
}
