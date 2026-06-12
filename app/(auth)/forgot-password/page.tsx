'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { AuthBrandPanel } from '@/components/ui/AuthBrandPanel'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    setLoading(false)
    if (resetError) {
      setError('Could not send reset email. Check the address and try again.')
      return
    }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ccc-cream)' }}>

      <AuthBrandPanel
        accentColor="raspberry"
        headline={
          <>
            Back in<br />
            <span style={{ color: 'var(--ccc-raspberry)' }}>seconds.</span>
          </>
        }
      />

      <div className="flex-1 flex items-center justify-center px-8 md:px-16" style={{ background: 'var(--ccc-cream)' }}>
        <div className="w-full max-w-[400px]">

          {sent ? (
            <div className="animate-fade-up" style={{ textAlign: 'center' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 28px',
                background: 'rgba(217,36,106,0.08)', border: '1px solid rgba(217,36,106,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 15 15" fill="none">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h10A1.5 1.5 0 0 1 14 2.5v8A1.5 1.5 0 0 1 12.5 12H8.707l-2 2H6a.5.5 0 0 1-.5-.5v-1.5H2.5A1.5 1.5 0 0 1 1 10.5v-8Zm13-1v8a.5.5 0 0 1-.5.5H5.5v1.793l1.646-1.647A.5.5 0 0 1 7.5 10h5a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-10a.5.5 0 0 0-.5.5Z" fill="var(--ccc-raspberry)"/>
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
                If <strong>{email}</strong> has a CoachOS account, a password reset link is on its way. Check spam if it does not arrive within a few minutes.
              </p>
              <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '14px', marginTop: '20px' }}>
                <a href="/login" style={{ color: 'var(--ccc-raspberry)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '4px' }}>Back to sign in</a>
              </p>
            </div>
          ) : (
            <>
              <div className="animate-fade-up" style={{ marginBottom: '32px' }}>
                <div style={{ width: '44px', height: '3px', background: 'var(--ccc-raspberry)', borderRadius: '2px', marginBottom: '28px' }} />
                <h1 style={{
                  fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600,
                  fontSize: 'clamp(3rem, 7vw, 4.8rem)', lineHeight: '0.90', letterSpacing: '-0.01em',
                  color: 'var(--ccc-near-black)',
                }}>
                  Reset password.
                </h1>
                <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '15px', marginTop: '16px' }}>
                  Enter your email and we will send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="animate-fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Input
                  type="email" placeholder="Email address"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  required autoFocus
                  style={{
                    height: '52px', fontSize: '15px', fontFamily: 'var(--font-body)',
                    background: 'rgba(252,247,232,0.60)', border: '1px solid rgba(28,28,28,0.12)',
                    borderRadius: '12px',
                  }}
                />
                {error && (
                  <p style={{ color: 'var(--destructive)', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500 }}>{error}</p>
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
                    boxShadow: '0 4px 28px rgba(217,36,106,0.26)', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'var(--ccc-raspberry-dark)'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
                  onMouseLeave={e => { e.currentTarget.style.background = loading ? 'var(--ccc-raspberry-dark)' : 'var(--ccc-raspberry)'; e.currentTarget.style.transform = '' }}
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>

              <p className="animate-fade-up delay-3" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '14px', marginTop: '24px' }}>
                Remembered it?{' '}
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
