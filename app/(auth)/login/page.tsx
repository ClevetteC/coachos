'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatAuthError } from '@/lib/auth-messages'
import { Input } from '@/components/ui/input'
import { AuthBrandPanel } from '@/components/ui/AuthBrandPanel'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submittingRef = useRef(false)

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('error')
    if (param === 'email_not_confirmed') {
      setError(formatAuthError('Email not confirmed'))
    } else if (param === 'confirmation_failed') {
      setError('Email confirmation failed or expired. Try signing up again or contact support.')
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (submittingRef.current || loading) return
    submittingRef.current = true
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    submittingRef.current = false
    if (signInError) {
      setError(formatAuthError(signInError.message))
      setLoading(false)
      return
    }

    router.push('/chat')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ccc-cream)' }}>

      <AuthBrandPanel
        accentColor="raspberry"
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

          {/* Accent line */}
          <div className="animate-fade-up mb-8">
            <div style={{ width: '44px', height: '3px', background: 'var(--ccc-raspberry)', borderRadius: '2px', marginBottom: '28px' }} />
            <h1 style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600,
              fontSize: 'clamp(3.6rem, 7vw, 5.2rem)', lineHeight: '0.88', letterSpacing: '-0.01em',
              color: 'var(--ccc-near-black)',
            }}>
              Welcome back.
            </h1>
            <p className="mt-4" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '15px' }}>
              Your operating system is ready.
            </p>
          </div>

          <form onSubmit={handleLogin} className="animate-fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
              type="password" name="password" autoComplete="current-password"
              placeholder="Password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required disabled={loading}
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
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="flex items-center justify-between animate-fade-up delay-3" style={{ marginTop: '24px' }}>
            <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
              No account?{' '}
              <a href="/signup" style={{ color: 'var(--ccc-raspberry)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '4px' }}>Sign up</a>
            </p>
            <a href="/forgot-password" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '14px', opacity: 0.60, textDecoration: 'underline', textUnderlineOffset: '4px' }}>
              Forgot password?
            </a>
          </div>

          <div className="animate-fade-up delay-4" style={{ marginTop: '48px' }}>
            <div className="stat-rule" style={{ marginBottom: '16px' }} />
            <p style={{ color: 'var(--muted-foreground)', opacity: 0.40, fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              The OS for coaches, consultants &amp; solopreneurs
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
