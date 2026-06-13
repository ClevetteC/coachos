'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { AuthBrandPanel } from '@/components/ui/AuthBrandPanel'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    setLoading(false)
    if (updateError) {
      setError(updateError.message || 'Could not update password. The link may have expired.')
      return
    }
    setDone(true)
    setTimeout(() => router.push('/chat'), 2000)
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ccc-cream)' }}>

      <AuthBrandPanel
        accentColor="raspberry"
        headline={
          <>
            Back in.<br />
            <span style={{ color: 'var(--ccc-raspberry)' }}>Stronger.</span>
          </>
        }
      />

      <div className="flex-1 flex items-center justify-center px-8 md:px-16" style={{ background: 'var(--ccc-cream)' }}>
        <div className="w-full max-w-[400px]">

          {done ? (
            <div className="animate-fade-up" style={{ textAlign: 'center' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 28px',
                background: 'rgba(217,36,106,0.08)', border: '1px solid rgba(217,36,106,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 15 15" fill="none">
                  <path d="M11.467 3.727c.289.189.37.576.181.865l-4.5 6.875a.625.625 0 0 1-.944.12l-2.75-2.5a.625.625 0 0 1 .842-.925l2.208 2.007 4.097-6.262a.625.625 0 0 1 .866-.18Z" fill="var(--ccc-raspberry)"/>
                </svg>
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600,
                fontSize: 'clamp(2.6rem, 5vw, 3.8rem)', lineHeight: '0.92',
                color: 'var(--ccc-near-black)', marginBottom: '16px',
              }}>
                Password updated.
              </h1>
              <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '15px' }}>
                Taking you to your OS now…
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
                  New password.
                </h1>
                <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '15px', marginTop: '16px' }}>
                  Choose a strong password for your CoachOS account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="animate-fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Input
                  type="password" name="password" autoComplete="new-password"
                  placeholder="New password (8+ characters)"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required minLength={8} autoFocus disabled={loading}
                  style={{
                    height: '52px', fontSize: '15px', fontFamily: 'var(--font-body)',
                    background: 'rgba(252,247,232,0.60)', border: '1px solid rgba(28,28,28,0.12)',
                    borderRadius: '12px',
                  }}
                />
                <Input
                  type="password" name="confirm" autoComplete="new-password"
                  placeholder="Confirm new password"
                  value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  required minLength={8} disabled={loading}
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
                  {loading ? 'Updating…' : 'Update password'}
                </button>
              </form>

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
