'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatAuthError } from '@/lib/auth-messages'
import { signUpResultFromResponse } from '@/lib/auth-signup'
import { Input } from '@/components/ui/input'

const GRAIN = "url(\"data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const PILLARS = [
  {
    label: 'CLOSE',
    accent: 'rgba(217,36,106,0.85)',
    border: 'rgba(217,36,106,0.18)',
    items: ['Proposals in your voice', 'LinkedIn sequences', 'Prospect research'],
  },
  {
    label: 'DELIVER',
    accent: 'rgba(37,190,186,0.85)',
    border: 'rgba(37,190,186,0.18)',
    items: ['Session prep', 'Progress tracking', 'Client health checks'],
  },
  {
    label: 'BUILD',
    accent: 'rgba(252,247,232,0.65)',
    border: 'rgba(252,247,232,0.10)',
    items: ['Workshop scripts', 'Landing pages', 'Email campaigns'],
  },
]

function PillarGrid() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        {PILLARS.map((col) => (
          <div
            key={col.label}
            className="p-4 rounded-xl flex flex-col gap-2"
            style={{ background: 'rgba(252,247,232,0.04)', border: `1px solid ${col.border}` }}
          >
            <p
              className="text-[9px] tracking-[0.22em] uppercase font-semibold"
              style={{ color: col.accent, fontFamily: 'var(--font-body)' }}
            >
              {col.label}
            </p>
            {col.items.map((item) => (
              <p
                key={item}
                className="text-xs leading-snug"
                style={{ color: 'rgba(252,247,232,0.48)', fontFamily: 'var(--font-body)' }}
              >
                {item}
              </p>
            ))}
            <p
              className="text-[10px] pt-1"
              style={{ color: 'rgba(252,247,232,0.22)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
            >
              Plus more
            </p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1" style={{ height: '1px', background: 'rgba(252,247,232,0.07)' }} />
        <p
          className="text-[9px] tracking-[0.22em] uppercase"
          style={{ color: 'rgba(252,247,232,0.20)', fontFamily: 'var(--font-body)' }}
        >
          Plus more
        </p>
        <div className="flex-1" style={{ height: '1px', background: 'rgba(252,247,232,0.07)' }} />
      </div>
    </div>
  )
}

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
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
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

      {/* Brand panel */}
      <div
        className="hidden md:flex w-[46rem] shrink-0 flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'var(--ccc-anchor)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: GRAIN, backgroundSize: '300px 300px', backgroundRepeat: 'repeat', opacity: 0.055 }} />

        <div className="absolute top-0 right-0 pointer-events-none"
          style={{ width: '280px', height: '280px', background: 'radial-gradient(circle at top right, rgba(37,190,186,0.08) 0%, transparent 65%)' }} />

        <div className="absolute pointer-events-none"
          style={{
            width: '1px', height: '130%',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(37,190,186,0.18) 30%, rgba(217,36,106,0.12) 68%, transparent 100%)',
            top: '-15%', right: '108px',
            transform: 'rotate(10deg)', transformOrigin: 'top center',
          }} />

        {/* Logo */}
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

        {/* Headline + graphic */}
        <div className="animate-slide-left delay-2 relative z-10">
          <p className="text-[9px] tracking-[0.28em] uppercase mb-8 font-semibold"
            style={{ color: 'var(--ccc-tiffany)', fontFamily: 'var(--font-body)' }}>
            For coaches · consultants · solopreneurs
          </p>

          <h2 className="tracking-tight mb-10"
            style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600,
              fontSize: 'clamp(3.8rem, 5.5vw, 5.4rem)', lineHeight: '0.88', color: '#FCF7E8',
            }}>
            Close more.<br />
            Deliver better.<br />
            <span style={{ color: 'var(--ccc-raspberry)' }}>Build faster.</span>
          </h2>

          <PillarGrid />
        </div>

        <div className="relative z-10" />
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-10" style={{ background: 'var(--ccc-cream)' }}>
        <div className="w-full max-w-sm">

          {emailSent ? (
            <div className="animate-fade-up text-center">
              <h1 style={{
                fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600,
                fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: '0.92', letterSpacing: '-0.01em',
                color: 'var(--ccc-near-black)',
              }}>
                Check your email.
              </h1>
              <p className="text-sm mt-5" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}>
                A confirmation link is on its way to <strong>{email}</strong>.
                Click it to activate your CoachOS account. Check spam if you do not see it within a few minutes.
              </p>
              <p className="text-sm mt-3" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}>
                Already confirmed?{' '}
                <a href="/login" className="font-semibold underline underline-offset-4" style={{ color: 'var(--ccc-raspberry)' }}>Sign in</a>
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
              Your OS starts here.
            </h1>
            <p className="text-sm mt-4 leading-relaxed" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}>
              Not a prompt library. The complete operating system for coaches, consultants, and solopreneurs. Reads your voice, your ideal client, and your offers — then runs your full sales and content workflows end to end.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-3 animate-fade-up delay-2">
            <Input type="email" name="email" autoComplete="email" placeholder="Email address" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoFocus disabled={loading}
              className="h-12 text-sm" style={{ fontFamily: 'var(--font-body)' }} />
            <Input type="password" name="password" autoComplete="new-password" placeholder="Password (8+ characters)" value={password}
              onChange={(e) => setPassword(e.target.value)} required minLength={8} disabled={loading}
              className="h-12 text-sm" style={{ fontFamily: 'var(--font-body)' }} />
            {error && (
              <p className="text-sm font-medium" style={{ color: 'var(--destructive)', fontFamily: 'var(--font-body)' }}>{error}</p>
            )}
            <button
              type="submit" disabled={loading}
              className="btn-raspberry-pulse w-full h-12 text-sm font-semibold rounded-xl text-white transition-all duration-200 hover:scale-[1.012] active:scale-[0.988] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-1"
              style={{
                fontFamily: 'var(--font-body)',
                background: loading ? 'var(--ccc-raspberry-dark)' : 'var(--ccc-raspberry)',
                boxShadow: '0 4px 24px rgba(217,36,106,0.22)',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'var(--ccc-raspberry-dark)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(217,36,106,0.30)' } }}
              onMouseLeave={e => { e.currentTarget.style.background = loading ? 'var(--ccc-raspberry-dark)' : 'var(--ccc-raspberry)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(217,36,106,0.22)' }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-sm mt-8 animate-fade-up delay-3" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}>
            Already have an account?{' '}
            <a href="/login" className="font-semibold underline underline-offset-4" style={{ color: 'var(--ccc-raspberry)' }}>Sign in</a>
          </p>

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
