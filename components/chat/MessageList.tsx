'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Message } from './Message'

interface MessageData {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  messages: MessageData[]
  streaming: boolean
  onUpload?: () => void
  onStartInterview?: () => void
  onOptionClick?: (option: string) => void
}

const WORKFLOWS = [
  'Research a prospect',
  'Write a proposal',
  'Build LinkedIn outreach',
  'Launch a new offer',
  'Prep for my next session',
  'Write an email sequence',
  'Check content quality',
  'Run a quality audit',
]

const ALL_CAPABILITIES = [
  {
    label: 'Close clients',
    labelColor: 'var(--ccc-raspberry)',
    items: ['Prospect research', 'Industry SWOT', 'Positioning angles', 'LinkedIn sequences', 'Discovery prep', 'Proposals and contracts', 'Follow-up engine', 'Contract builder'],
  },
  {
    label: 'Market and deliver',
    labelColor: 'var(--ccc-tiffany)',
    items: ['Landing pages', 'Email campaigns', 'Workshop scripts', 'Ad copy', 'Social content', 'Content calendar', 'Objection library', 'Session prep', 'Progress tracking'],
  },
  {
    label: 'Run your business',
    labelColor: 'rgba(28,28,28,0.45)',
    items: ['Monday brief', 'Revenue health', 'Pipeline review', 'Client health', 'Quarterly review', 'Invoice follow-up', 'Business pulse', 'Outcomes tracker', 'Referral trigger'],
  },
]

export function MessageList({ messages, streaming, onUpload, onStartInterview, onOptionClick }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [capOpen, setCapOpen] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <>
        {/* Capabilities side panel */}
        {capOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
            <div
              style={{ position: 'absolute', inset: 0, background: 'rgba(28,28,28,0.18)' }}
              onClick={() => setCapOpen(false)}
            />
            <div style={{
              position: 'relative', width: 320, height: '100%',
              background: 'var(--ccc-cream)', borderLeft: '1px solid var(--border)',
              overflowY: 'auto', padding: '2.5rem 2rem',
              display: 'flex', flexDirection: 'column', gap: '2.25rem',
            }}>
              <div className="flex items-center justify-between">
                <p style={{ color: 'var(--muted-foreground)', opacity: 0.55, fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Everything CoachOS does
                </p>
                <button
                  onClick={() => setCapOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', opacity: 0.45, fontSize: '1rem', lineHeight: 1 }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.45')}
                >
                  ✕
                </button>
              </div>
              {ALL_CAPABILITIES.map((group) => (
                <div key={group.label}>
                  <p style={{ color: group.labelColor, fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '14px' }}>
                    {group.label}
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {group.items.map((item) => (
                      <li key={item} style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: '1.45' }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Side capabilities tab */}
        <button
          onClick={() => setCapOpen(true)}
          style={{
            position: 'fixed', right: 0, top: '50%', transform: 'translateY(-50%)',
            zIndex: 55, background: 'var(--ccc-cream)', border: '1px solid var(--border)',
            borderRight: 'none', borderRadius: '6px 0 0 6px',
            padding: '0.85rem 0.55rem', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            transition: 'border-color 0.18s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ccc-near-black)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <span style={{
            writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)',
            fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.18em',
            textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted-foreground)', opacity: 0.55, whiteSpace: 'nowrap',
          }}>
            All capabilities
          </span>
          <svg width="9" height="9" viewBox="0 0 15 15" fill="none" style={{ opacity: 0.4, transform: 'rotate(180deg)' }}>
            <path d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L10.586 8.5H2a1 1 0 1 1 0-2h8.586L8.293 3.707a1 1 0 0 1 0-1.414Z" fill="currentColor"/>
          </svg>
        </button>

        {/* Main empty state */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ background: 'var(--ccc-cream)' }}
        >
          {/* Ambient orb */}
          <div className="pointer-events-none fixed" style={{
            width: '700px', height: '700px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217,36,106,0.032) 0%, transparent 65%)',
            top: '-200px', right: '-150px',
          }} />

          <div style={{ maxWidth: '680px', margin: '0 auto', padding: '72px 32px 80px' }}>

            {/* Brand identifier */}
            <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '56px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'var(--ccc-raspberry)', flexShrink: 0,
                boxShadow: '0 0 0 1px rgba(217,36,106,0.25), 0 4px 14px rgba(217,36,106,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 700, fontSize: '0.75rem', color: '#FCF7E8' }}>C</span>
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--ccc-near-black)', letterSpacing: '-0.01em' }}>CoachOS</span>
              <span style={{ color: 'var(--border)', fontSize: '14px' }}>·</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted-foreground)', opacity: 0.65 }}>For coaches, consultants &amp; solopreneurs</span>
            </div>

            {/* Hero headline */}
            <h1
              className="animate-fade-up delay-1"
              style={{
                fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600,
                fontSize: 'clamp(3.6rem, 8vw, 6.5rem)', lineHeight: '0.88',
                color: 'var(--ccc-near-black)', letterSpacing: '-0.02em',
                marginBottom: '20px',
              }}
            >
              What will you<br />
              accomplish<br />
              <span style={{ color: 'var(--ccc-raspberry)' }}>today?</span>
            </h1>

            <p
              className="animate-fade-up delay-2"
              style={{
                fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--muted-foreground)',
                lineHeight: 1.6, maxWidth: '480px', marginBottom: '48px',
              }}
            >
              Build your foundation once — voice profile, ideal client, offer stack. CoachOS runs every sales, content, and delivery workflow in your voice from there.
            </p>

            {/* Setup path cards */}
            <div className="animate-fade-up delay-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>

              {/* Upload card */}
              <button
                onClick={onUpload}
                onMouseEnter={() => setHoveredCard('upload')}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  textAlign: 'left', padding: '28px 24px 24px',
                  background: hoveredCard === 'upload' ? '#FEFCF3' : 'rgba(254,252,243,0.75)',
                  border: `1px solid ${hoveredCard === 'upload' ? 'rgba(37,190,186,0.35)' : 'rgba(37,190,186,0.20)'}`,
                  borderLeft: `4px solid ${hoveredCard === 'upload' ? 'var(--ccc-tiffany)' : 'rgba(37,190,186,0.55)'}`,
                  borderRadius: '16px',
                  boxShadow: hoveredCard === 'upload' ? '0 8px 32px rgba(37,190,186,0.10), 0 2px 8px rgba(0,0,0,0.04)' : '0 1px 4px rgba(0,0,0,0.04)',
                  transform: hoveredCard === 'upload' ? 'translateY(-2px)' : '',
                  transition: 'all 0.22s cubic-bezier(0.16,1,0.3,1)',
                  cursor: 'pointer',
                }}
              >
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--ccc-tiffany)', opacity: 0.75, fontWeight: 600, marginBottom: '12px' }}>
                  Option 01
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 700, color: 'var(--ccc-near-black)', marginBottom: '10px', lineHeight: 1.3 }}>
                  Upload your documents
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--muted-foreground)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Your bio, ICA doc, offer deck, or any document. CoachOS extracts your voice, client, and offer data automatically.
                </p>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
                  {['PDF', 'TXT', 'MD'].map(t => (
                    <span key={t} style={{
                      fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
                      color: 'var(--ccc-tiffany)', background: 'rgba(37,190,186,0.08)',
                      border: '1px solid rgba(37,190,186,0.18)', borderRadius: '6px',
                      padding: '2px 8px', letterSpacing: '0.06em',
                    }}>{t}</span>
                  ))}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
                  color: hoveredCard === 'upload' ? 'var(--ccc-tiffany)' : 'var(--muted-foreground)',
                  transition: 'color 0.18s',
                }}>
                  <span>Upload</span>
                  <svg width="11" height="11" viewBox="0 0 15 15" fill="none">
                    <path d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L10.586 8.5H2a1 1 0 1 1 0-2h8.586L8.293 3.707a1 1 0 0 1 0-1.414Z" fill="currentColor"/>
                  </svg>
                </div>
              </button>

              {/* Interview card */}
              <button
                onClick={onStartInterview}
                onMouseEnter={() => setHoveredCard('interview')}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  textAlign: 'left', padding: '28px 24px 24px',
                  background: hoveredCard === 'interview' ? '#FEFCF3' : 'rgba(254,252,243,0.75)',
                  border: `1px solid ${hoveredCard === 'interview' ? 'rgba(217,36,106,0.30)' : 'rgba(217,36,106,0.16)'}`,
                  borderLeft: `4px solid ${hoveredCard === 'interview' ? 'var(--ccc-raspberry)' : 'rgba(217,36,106,0.50)'}`,
                  borderRadius: '16px',
                  boxShadow: hoveredCard === 'interview' ? '0 8px 32px rgba(217,36,106,0.08), 0 2px 8px rgba(0,0,0,0.04)' : '0 1px 4px rgba(0,0,0,0.04)',
                  transform: hoveredCard === 'interview' ? 'translateY(-2px)' : '',
                  transition: 'all 0.22s cubic-bezier(0.16,1,0.3,1)',
                  cursor: 'pointer',
                }}
              >
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--ccc-raspberry)', opacity: 0.75, fontWeight: 600, marginBottom: '12px' }}>
                  Option 02
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 700, color: 'var(--ccc-near-black)', marginBottom: '10px', lineHeight: 1.3 }}>
                  Build it in conversation
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--muted-foreground)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Five blocks, fifteen minutes. Voice profile, ideal client, offer stack, and credential bank — all personalized, nothing generic.
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {['Voice', 'ICA', 'Offers', 'Credentials'].map(s => (
                    <span key={s} style={{
                      fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
                      color: 'var(--ccc-raspberry)', background: 'rgba(217,36,106,0.06)',
                      border: '1px solid rgba(217,36,106,0.16)', borderRadius: '6px',
                      padding: '2px 8px',
                    }}>{s}</span>
                  ))}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
                  color: hoveredCard === 'interview' ? 'var(--ccc-raspberry)' : 'var(--muted-foreground)',
                  transition: 'color 0.18s',
                }}>
                  <span>Start interview</span>
                  <svg width="11" height="11" viewBox="0 0 15 15" fill="none">
                    <path d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L10.586 8.5H2a1 1 0 1 1 0-2h8.586L8.293 3.707a1 1 0 0 1 0-1.414Z" fill="currentColor"/>
                  </svg>
                </div>
              </button>
            </div>

            {/* Divider */}
            <div className="animate-fade-up delay-4" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--muted-foreground)', opacity: 0.50, letterSpacing: '0.16em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                or jump into a workflow
              </p>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            {/* Workflow chips — 2 rows of 4 */}
            <div className="animate-fade-up delay-5" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {WORKFLOWS.map((w) => (
                <button
                  key={w}
                  onClick={() => onOptionClick?.(w)}
                  style={{
                    fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500,
                    color: 'var(--muted-foreground)', background: 'transparent',
                    border: '1px solid var(--border)', borderRadius: '100px',
                    padding: '7px 16px', cursor: 'pointer',
                    transition: 'all 0.16s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--ccc-near-black)'
                    e.currentTarget.style.color = 'var(--ccc-near-black)'
                    e.currentTarget.style.background = 'rgba(28,28,28,0.04)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--muted-foreground)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {w}
                </button>
              ))}
            </div>

          </div>
        </div>
      </>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0" style={{ background: 'var(--ccc-cream)' }}>
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        {messages.map((msg, i) => (
          <Message
            key={i}
            role={msg.role}
            content={msg.content}
            isStreaming={streaming && i === messages.length - 1 && msg.role === 'assistant'}
            isLast={i === messages.length - 1}
            onOptionClick={onOptionClick}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
