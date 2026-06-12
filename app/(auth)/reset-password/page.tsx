'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'

const GRAIN = "url(\"data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

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

      {/* Brand panel */}
      <div
        className="hidden md:flex w-[46rem] shrink-0 flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'var(--ccc-anchor)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: GRAIN, backgroundSize: '300px 300px', backgroundRepeat: 'repeat', opacity: 0.055 }}
        />
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{ width: '280px', height: '280px', background: 'radial-gradient(circle at top right, rgba(217,36,106,0.10) 0%, transparent 65%)' }}
        />
        <div className="flex items-center gap-3 animate-fade-in relative z-10">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'var(--ccc-raspberry)', boxShadow: '0 0 0 1px rgba(217,36,106,0.35)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 700, fontSize: '0.95rem', color: '#FCF7E8' }}>C</span>
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide" style={{ color: '#FCF7E8', fontFamily: 'var(--font-body)' }}>CoachOS</p>
            <p className="text-[9px] tracking-[0.22em] uppercase" style={{ color: 'var(--ccc-tiffany)', opacity: 0.65, fontFamily: 'var(--font-body)' }}>CCC</p>
          </div>
        </div>
        <div className="animate-slide-left delay-2 relative z-10">
          <p className="text-[9px] tracking-[0.28em] uppercase mb-8 font-semibold"
            style={{ color: 'var(--ccc-tiffany)', fontFamily: 'var(--font-body)' }}>
            For coaches · consultants · solopreneurs
          </p>
          <h2 className="tracking-tight mb-6"
            style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600,
              fontSize: 'clamp(3.8rem, 5.5vw, 5.4rem)', lineHeight: '0.88', color: '#FCF7E8',
            }}>
            Back in.<br />
            <span style={{ color: 'var(--ccc-raspberry)' }}>Stronger.</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(252,247,232,0.45)', fontFamily: 'var(--font-body)' }}>
            Set a new password and you are back in your operating system.
          </p>
        </div>
        <div className="relative z-10" />
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-10" style={{ background: 'var(--ccc-cream)' }}>
        <div className="w-full max-w-sm">

          {done ? (
            <div className="animate-fade-up text-center">
              <h1 style={{
                fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600,
                fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: '0.92', letterSpacing: '-0.01em',
                color: 'var(--ccc-near-black)',
              }}>
                Password updated.
              </h1>
              <p className="text-sm mt-5" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}>
                Taking you to your OS now.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-10 animate-fade-up">
                <h1 style={{
                  fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600,
                  fontSize: 'clamp(3rem, 7vw, 4.4rem)', lineHeight: '0.90', letterSpacing: '-0.01em',
                  color: 'var(--ccc-near-black)',
                }}>
                  New password.
                </h1>
                <p className="text-sm mt-4" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}>
                  Choose a strong password for your CoachOS account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 animate-fade-up delay-2">
                <Input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="New password (8+ characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoFocus
                  disabled={loading}
                  className="h-12 text-sm"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
                <Input
                  type="password"
                  name="confirm"
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={8}
                  disabled={loading}
                  className="h-12 text-sm"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
                {error && (
                  <p className="text-sm font-medium" style={{ color: 'var(--destructive)', fontFamily: 'var(--font-body)' }}>{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-raspberry-pulse w-full h-12 text-sm font-semibold rounded-xl text-white transition-all duration-200 hover:scale-[1.012] active:scale-[0.988] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-1"
                  style={{
                    fontFamily: 'var(--font-body)',
                    background: loading ? 'var(--ccc-raspberry-dark)' : 'var(--ccc-raspberry)',
                    boxShadow: '0 4px 24px rgba(217,36,106,0.22)',
                  }}
                >
                  {loading ? 'Updating...' : 'Update password'}
                </button>
              </form>

              <div className="mt-12 animate-fade-up delay-4">
                <div className="stat-rule mb-5" />
                <p className="text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--muted-foreground)', opacity: 0.45, fontFamily: 'var(--font-body)' }}>
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
