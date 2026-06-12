import React from 'react'

const GRAIN = "url(\"data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const METRICS = [
  {
    metric: '15 min',
    label: 'Foundation to first quality output',
    accent: 'rgba(217,36,106,0.90)',
    border: 'rgba(217,36,106,0.18)',
  },
  {
    metric: 'Your voice',
    label: 'On every proposal and email',
    accent: 'rgba(37,190,186,0.90)',
    border: 'rgba(37,190,186,0.18)',
  },
  {
    metric: '7 patterns',
    label: 'Full workflows, end to end',
    accent: 'rgba(252,247,232,0.55)',
    border: 'rgba(252,247,232,0.10)',
  },
]

interface Props {
  headline: React.ReactNode
  accentColor?: 'raspberry' | 'tiffany'
}

export function AuthBrandPanel({ headline, accentColor = 'raspberry' }: Props) {
  const cornerGlow = accentColor === 'tiffany'
    ? 'radial-gradient(circle at top right, rgba(37,190,186,0.09) 0%, transparent 65%)'
    : 'radial-gradient(circle at top right, rgba(217,36,106,0.11) 0%, transparent 65%)'

  const bottomGlow = accentColor === 'tiffany'
    ? 'radial-gradient(circle at bottom left, rgba(217,36,106,0.06) 0%, transparent 60%)'
    : 'radial-gradient(circle at bottom left, rgba(37,190,186,0.06) 0%, transparent 60%)'

  const lineGradient = accentColor === 'tiffany'
    ? 'linear-gradient(to bottom, transparent 0%, rgba(37,190,186,0.22) 30%, rgba(217,36,106,0.12) 68%, transparent 100%)'
    : 'linear-gradient(to bottom, transparent 0%, rgba(217,36,106,0.22) 30%, rgba(37,190,186,0.12) 68%, transparent 100%)'

  return (
    <div
      className="hidden md:flex w-[46rem] shrink-0 flex-col justify-between p-14 relative overflow-hidden"
      style={{ background: 'var(--ccc-anchor)' }}
    >
      {/* Grain overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: GRAIN, backgroundSize: '300px 300px', backgroundRepeat: 'repeat', opacity: 0.052 }} />

      {/* Corner glows */}
      <div className="absolute top-0 right-0 pointer-events-none"
        style={{ width: '340px', height: '340px', background: cornerGlow }} />
      <div className="absolute bottom-0 left-0 pointer-events-none"
        style={{ width: '280px', height: '280px', background: bottomGlow }} />

      {/* Diagonal accent line */}
      <div className="absolute pointer-events-none"
        style={{
          width: '1px', height: '130%',
          background: lineGradient,
          top: '-15%', right: '108px',
          transform: 'rotate(10deg)', transformOrigin: 'top center',
        }} />

      {/* Floating ambient orb */}
      <div className="absolute pointer-events-none animate-float"
        style={{
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,36,106,0.04) 0%, transparent 65%)',
          top: '-80px', right: '-120px',
        }} />

      {/* Logo */}
      <div className="flex items-center gap-3 animate-fade-in relative z-10">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'var(--ccc-raspberry)', boxShadow: '0 0 0 1px rgba(217,36,106,0.30), 0 4px 16px rgba(217,36,106,0.24)' }}
        >
          <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 700, fontSize: '0.95rem', color: '#FCF7E8' }}>C</span>
        </div>
        <div>
          <p className="text-sm font-bold tracking-wide" style={{ color: '#FCF7E8', fontFamily: 'var(--font-body)' }}>CoachOS</p>
          <p className="text-[9px] tracking-[0.22em] uppercase" style={{ color: 'var(--ccc-tiffany)', opacity: 0.60, fontFamily: 'var(--font-body)' }}>
            For coaches · consultants · solopreneurs
          </p>
        </div>
      </div>

      {/* Metrics + Headline */}
      <div className="animate-slide-left delay-2 relative z-10">
        {/* Proof metric cards */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {METRICS.map((m) => (
            <div
              key={m.metric}
              className="rounded-2xl p-4 flex flex-col gap-1.5 relative overflow-hidden"
              style={{
                background: 'rgba(252,247,232,0.04)',
                border: `1px solid ${m.border}`,
              }}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
                style={{ background: m.accent }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600,
                  fontSize: '1.55rem', lineHeight: 1, color: '#FCF7E8', paddingLeft: '10px',
                }}
              >
                {m.metric}
              </p>
              <p
                className="leading-snug"
                style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(252,247,232,0.42)', paddingLeft: '10px' }}
              >
                {m.label}
              </p>
            </div>
          ))}
        </div>

        {/* Main headline */}
        <div
          style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600,
            fontSize: 'clamp(3.4rem, 5vw, 5rem)', lineHeight: '0.88', color: '#FCF7E8',
            letterSpacing: '-0.01em',
          }}
        >
          {headline}
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="relative z-10">
        <div style={{ height: '1px', background: 'rgba(252,247,232,0.07)', marginBottom: '16px' }} />
        <p className="text-[9px] tracking-[0.22em] uppercase" style={{ color: 'rgba(252,247,232,0.22)', fontFamily: 'var(--font-body)' }}>
          The OS for coaches, consultants &amp; solopreneurs
        </p>
      </div>
    </div>
  )
}
