'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'

const GRAIN = "url(\"data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/* Dot positions: 6 cols × 5 rows, 52px col gap, 38px row gap */
const DOT_COLS = 6
const DOT_ROWS = 5
const COL_GAP = 52
const ROW_GAP = 38
const OFFSET_X = 10
const OFFSET_Y = 14

function dot(col: number, row: number) {
  return { x: col * COL_GAP + OFFSET_X, y: row * ROW_GAP + OFFSET_Y }
}

/* Highlighted nodes with user-outcome labels */
const NODES = [
  { ...dot(0, 0), r: 5, stroke: 'rgba(217,36,106,0.55)', fill: 'rgba(217,36,106,0.10)', label: 'CLOSE',   lx: 18,  ly: 9,  lc: 'rgba(217,36,106,0.75)' },
  { ...dot(2, 1), r: 4, stroke: 'rgba(252,247,232,0.32)', fill: 'rgba(252,247,232,0.06)', label: null,     lx: 0,   ly: 0,  lc: '' },
  { ...dot(3, 2), r: 5, stroke: 'rgba(37,190,186,0.50)',  fill: 'rgba(37,190,186,0.10)',  label: 'DELIVER', lx: 170, ly: 89, lc: 'rgba(37,190,186,0.75)' },
  { ...dot(5, 3), r: 4, stroke: 'rgba(217,36,106,0.45)', fill: 'rgba(217,36,106,0.08)',  label: 'BUILD',   lx: 257, ly: 123, lc: 'rgba(252,247,232,0.50)' },
  { ...dot(1, 4), r: 3.5, stroke: 'rgba(37,190,186,0.38)', fill: 'rgba(37,190,186,0.07)', label: null,    lx: 0,   ly: 0,  lc: '' },
]

const CONNECTIONS = [
  [dot(0,0), dot(2,1)],
  [dot(2,1), dot(3,2)],
  [dot(3,2), dot(5,3)],
  [dot(1,4), dot(3,2)],
]

function WorkflowGraphic() {
  const w = (DOT_COLS - 1) * COL_GAP + OFFSET_X * 2
  const h = (DOT_ROWS - 1) * ROW_GAP + OFFSET_Y * 2
  const nodeSet = new Set(NODES.map(n => `${n.x},${n.y}`))

  return (
    <svg viewBox={`0 0 ${w} ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
      {/* Background grid dots */}
      {Array.from({ length: DOT_ROWS }, (_, row) =>
        Array.from({ length: DOT_COLS }, (_, col) => {
          const { x, y } = dot(col, row)
          if (nodeSet.has(`${x},${y}`)) return null
          return <circle key={`${col}-${row}`} cx={x} cy={y} r={1.5} fill="rgba(252,247,232,0.08)" />
        })
      )}

      {/* Connection lines */}
      {CONNECTIONS.map(([a, b], i) => (
        <line
          key={i}
          x1={a.x} y1={a.y} x2={b.x} y2={b.y}
          stroke="rgba(252,247,232,0.10)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
      ))}

      {/* Highlighted nodes */}
      {NODES.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={n.fill} stroke={n.stroke} strokeWidth="1" />
      ))}

      {/* Labels */}
      {NODES.filter(n => n.label).map((n, i) => (
        <text
          key={i}
          x={n.lx} y={n.ly}
          fill={n.lc}
          fontSize="6.5"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="600"
          letterSpacing="1.8"
        >
          {n.label}
        </text>
      ))}
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
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

          <div className="stat-rule-light mb-8" />

          <WorkflowGraphic />
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
