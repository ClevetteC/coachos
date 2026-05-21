import type { AuthError, User } from '@supabase/supabase-js'

export type SignUpResult =
  | { ok: true; email: string }
  | { ok: false; message: string }

/**
 * signUp with confirm-email enabled returns an empty identities array when the
 * email is already registered (anti-enumeration). Treat that like success so we
 * still tell the user to check their inbox.
 */
export function isExistingUserSignUp(user: User | null): boolean {
  return Boolean(user && (!user.identities || user.identities.length === 0))
}

export function signUpResultFromResponse(
  email: string,
  error: AuthError | null,
  user: User | null
): SignUpResult {
  if (error) {
    return { ok: false, message: error.message }
  }
  if (isExistingUserSignUp(user)) {
    return { ok: true, email }
  }
  if (!user) {
    return { ok: false, message: 'Could not create account. Please try again.' }
  }
  return { ok: true, email }
}
