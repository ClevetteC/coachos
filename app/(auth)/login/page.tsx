'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatAuthError } from '@/lib/auth-messages'
import { Input } from '@/components/ui/input'

const GRAIN = "url(\"data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const PILLARS = [
  {
    label: 'CLOSE',
    accent: 'rgba(217,36,106,0.85)',
    border: 'rgba(217,36,106,0.18)',
    items: ['Proposals in your voice', 'LinkedIn sequences'],
  },
  {
    label: 'DELIVER',
    accent: 'rgba(37,190,186,0.85)',
    border: 'rgba(37,190,186,0.18)',
    items: ['Session prep', 'Progress tracking'],
  },
  {
    label: 'BUILD',
    accent: 'rgba(252,247,232,0.65)',
    border: 'rgba(252,247,232,0.10)',
    items: ['Workshop scripts', 'Landing pages'],
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

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('error')
    if (param === 'email_not_confirmed') {
      setError(formatAuthError('Email not confirmed'))
    } else if (param === 'confirmation_failed') {
      setError('Email confirmation failed or expired. Sign up again or contact support.')
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

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

      {/* Brand panel */}
      <div
        className="hidden md:flex w-[46rem] shrink-0 flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'var(--ccc-anchor)' }}
      >
        {/* Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: GRAIN, backgroundSize: '300px 300px', backgroundRepeat: 'repeat', opacity: 0.055 }}
        />

        {/* Corner glow */}
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{ width: '280px', height: '280px', background: 'radial-gradient(circle at top right, rgba(217,36,106,0.10) 0%, transparent 65%)' }}
        />

        {/* Diagonal accent line */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '1px', height: '130%',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(217,36,106,0.20) 30%, rgba(37,190,186,0.12) 68%, transparent 100%)',
            top: '-15%', right: '108px',
            transform: 'rotate(10deg)', transformOrigin: 'top center',
          }}
        />

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
            Clevette Coombs Consulting
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

        {/* Bottom spacer */}
        <div className="relative z-10" />
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-10" style={{ background: 'var(--ccc-cream)' }}>
        <div className="w-full max-w-sm">

          <div className="mb-10 animate-fade-up">
            <h1 style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600,
              fontSize: 'clamp(3.8rem, 7vw, 5rem)', lineHeight: '0.90', letterSpacing: '-0.01em',
              color: 'var(--ccc-near-black)',
            }}>
              Sign in.
            </h1>
            <p className="text-sm mt-4" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}>
              Welcome back.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3 animate-fade-up delay-2">
            <Input type="email" placeholder="Email address" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoFocus
              className="h-12 text-sm" style={{ fontFamily: 'var(--font-body)' }} />
            <Input type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
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
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm mt-8 animate-fade-up delay-3" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}>
            No account?{' '}
            <a href="/signup" className="font-semibold underline underline-offset-4" style={{ color: 'var(--ccc-raspberry)' }}>Sign up</a>
          </p>

          <div className="mt-12 animate-fade-up delay-4">
            <div className="stat-rule mb-5" />
            <p className="text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--muted-foreground)', opacity: 0.45, fontFamily: 'var(--font-body)' }}>
              AI operating system for coaches and consultants
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
