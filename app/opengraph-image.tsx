import { ImageResponse } from 'next/og'

export const alt = 'CoachOS — AI operating system for coaches and consultants'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0F0F0F',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px 96px',
          position: 'relative',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Raspberry corner glow */}
        <div style={{
          position: 'absolute', top: 0, right: 0, display: 'flex',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle at top right, rgba(217,36,106,0.22) 0%, transparent 60%)',
        }} />

        {/* Tiffany bottom-left glow */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, display: 'flex',
          width: '420px', height: '420px',
          background: 'radial-gradient(circle at bottom left, rgba(37,190,186,0.14) 0%, transparent 60%)',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: '#D9246A', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#FCF7E8', fontSize: '26px', fontStyle: 'italic', fontWeight: 700 }}>C</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ color: '#FCF7E8', fontSize: '22px', fontFamily: 'system-ui, sans-serif', fontWeight: 700, letterSpacing: '0.04em' }}>CoachOS</span>
            <span style={{ color: '#25BEBA', fontSize: '11px', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.24em', textTransform: 'uppercase' }}>Clevette Coombs Consulting</span>
          </div>
        </div>

        {/* Headline + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0px' }}>
            <span style={{
              fontSize: '132px', fontStyle: 'italic', fontWeight: 700,
              lineHeight: '0.88', letterSpacing: '-0.03em', color: '#FCF7E8',
            }}>
              Coach
            </span>
            <span style={{
              fontSize: '132px', fontStyle: 'italic', fontWeight: 700,
              lineHeight: '0.88', letterSpacing: '-0.03em', color: '#D9246A',
            }}>
              OS
            </span>
          </div>
          <span style={{
            fontSize: '26px', color: 'rgba(252,247,232,0.50)',
            fontFamily: 'system-ui, sans-serif', lineHeight: '1.45', letterSpacing: '0.01em',
          }}>
            Your AI operating system for sales, coaching, and consulting.
          </span>
        </div>

        {/* Bottom rule */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ height: '1px', flex: 1, background: 'rgba(252,247,232,0.10)', display: 'flex' }} />
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#FFD93D', display: 'flex' }} />
          <div style={{ height: '1px', width: '48px', background: 'rgba(252,247,232,0.10)', display: 'flex' }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
