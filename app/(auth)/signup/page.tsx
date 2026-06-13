'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatAuthError } from '@/lib/auth-messages'
import { signUpResultFromResponse } from '@/lib/auth-signup'
import { Input } from '@/components/ui/input'
import { AuthBrandPanel } from '@/components/ui/AuthBrandPanel'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const submittingRef = useRef(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (submittingRef.current || loading) return
    submittingRef.current = true
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    const result = signUpResultFromResponse(email.trim(), signUpError, data.user ?? null)
    submittingRef.current = false
    setLoading(false)

    if (!result.ok) {
      setError(formatAuthError(result.message))
      return
    }

    setEmailSent(true)
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ccc-cream)' }}>

      <AuthBrandPanel
        accentColor="tiffany"
        headline={
          <>
            Close more.<br />
            Deliver better.<br />
            <span style={{ color: 'var(--ccc-raspberry)' }}>Build faster.</span>
          </>
        }
      />

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-8 md:px-16" style={{ background: 'var(--ccc-cream)' }}>
        <div className="w-full max-w-[400px]">

          {emailSent ? (
            <div className="animate-fade-up" style={{ textAlign: 'center' }}>
              {/* Check icon */}
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 28px',
                background: 'rgba(37,190,186,0.10)', border: '1px solid rgba(37,190,186,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 15 15" fill="none">
                  <path d="M11.467 3.727c.289.189.37.576.181.865l-4.5 6.875a.625.625 0 0 1-.944.12l-2.75-2.5a.625.625 0 0 1 .842-.925l2.208 2.007 4.097-6.262a.625.625 0 0 1 .866-.18Z" fill="var(--ccc-tiffany)"/>
                </svg>
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600,
                fontSize: 'clamp(2.6rem, 5vw, 3.8rem)', lineHeight: '0.92', letterSpacing: '-0.01em',
                color: 'var(--ccc-near-black)', marginBottom: '20px',
              }}>
                Check your email.
              </h1>
              <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.65, maxWidth: '320px', margin: '0 auto' }}>
                A confirmation link is on its way to <strong>{email}</strong>. Click it to activate your CoachOS account. Check spam if you do not see it within a few minutes.
              </p>
              <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '14px', marginTop: '20px' }}>
                Already confirmed?{' '}
                <a href="/login" style={{ color: 'var(--ccc-raspberry)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '4px' }}>Sign in</a>
              </p>
            </div>
          ) : (
            <>
              <div className="animate-fade-up" style={{ marginBottom: '32px' }}>
                <div style={{ width: '44px', height: '3px', background: 'var(--ccc-tiffany)', borderRadius: '2px', marginBottom: '28px' }} />
                <h1 style={{
                  fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600,
                  fontSize: 'clamp(3rem, 7vw, 4.8rem)', lineHeight: '0.90', letterSpacing: '-0.01em',
                  color: 'var(--ccc-near-black)',
                }}>
                  Your OS starts here.
                </h1>
                <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '14.5px', lineHeight: 1.65, marginTop: '16px' }}>
                  Not a prompt library. The complete operating system for coaches, consultants, and solopreneurs — reads your voice, your ideal client, and your offers, then runs every workflow end to end.
                </p>
              </div>

              <form onSubmit={handleSignup} className="animate-fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Input
                  type="email" name="email" autoComplete="email"
                  placeholder="Email address"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  required autoFocus disabled={loading}
                  style={{
                    height: '52px', fontSize: '15px', fontFamily: 'var(--font-body)',
                    background: 'rgba(252,247,232,0.60)', border: '1px solid rgba(28,28,28,0.12)',
                    borderRadius: '12px',
                  }}
                />
                <Input
                  type="password" name="password" autoComplete="new-password"
                  placeholder="Password (8+ characters)"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required minLength={8} disabled={loading}
                  style={{
                    height: '52px', fontSize: '15px', fontFamily: 'var(--font-body)',
                    background: 'rgba(252,247,232,0.60)', border: '1px solid rgba(28,28,28,0.12)',
                    borderRadius: '12px',
                  }}
                />

                {error && (
                  <p style={{ color: 'var(--destructive)', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500 }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit" disabled={loading}
                  className="btn-raspberry-pulse"
                  style={{
                    width: '100%', height: '52px', marginTop: '4px',
                    background: loading ? 'var(--ccc-raspberry-dark)' : 'var(--ccc-raspberry)',
                    color: '#FCF7E8', border: 'none', borderRadius: '12px',
                    fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.65 : 1,
                    boxShadow: '0 4px 28px rgba(217,36,106,0.26)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'var(--ccc-raspberry-dark)'; e.currentTarget.style.boxShadow = '0 6px 32px rgba(217,36,106,0.36)'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
                  onMouseLeave={e => { e.currentTarget.style.background = loading ? 'var(--ccc-raspberry-dark)' : 'var(--ccc-raspberry)'; e.currentTarget.style.boxShadow = '0 4px 28px rgba(217,36,106,0.26)'; e.currentTarget.style.transform = '' }}
                >
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </form>

              <p className="animate-fade-up delay-3" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '14px', marginTop: '24px' }}>
                Already have an account?{' '}
                <a href="/login" style={{ color: 'var(--ccc-raspberry)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '4px' }}>Sign in</a>
              </p>

              <div className="animate-fade-up delay-4" style={{ marginTop: '48px' }}>
                <div className="stat-rule" style={{ marginBottom: '16px' }} />
                <p style={{ color: 'var(--muted-foreground)', opacity: 0.40, fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  The OS for coaches, consultants &amp; solopreneurs
                </p>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
