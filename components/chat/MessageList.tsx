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

const QUICK_PROMPTS = [
  'Research a prospect',
  'Write a proposal',
  'Build outreach',
  'Check my content',
]

const ARROW = (
  <svg width="10" height="10" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
    <path d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L10.586 8.5H2a1 1 0 1 1 0-2h8.586L8.293 3.707a1 1 0 0 1 0-1.414Z" fill="currentColor"/>
  </svg>
)

const ALL_CAPABILITIES = [
  {
    label: 'Close clients',
    labelColor: 'var(--ccc-raspberry)',
    items: ['Prospect research', 'Industry SWOT', 'Positioning angles', 'LinkedIn sequences', 'Discovery prep', 'Proposals and contracts', 'Follow-up engine'],
  },
  {
    label: 'Marketing and content',
    labelColor: 'var(--ccc-tiffany)',
    items: ['Landing pages', 'Email campaigns', 'Workshop scripts', 'Ad copy', 'Social content', 'Content calendar', 'Objection library'],
  },
  {
    label: 'Operations',
    labelColor: 'rgba(28,28,28,0.45)',
    items: ['Monday brief', 'Revenue health', 'Pipeline review', 'Client health', 'Quarterly review', 'Invoice follow-up', 'Business pulse', 'Hiring brief'],
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
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(28,28,28,0.22)' }}
            onClick={() => setCapOpen(false)}
          />
          <div
            style={{
              position: 'relative',
              width: 320,
              height: '100%',
              background: 'var(--ccc-cream)',
              borderLeft: '1px solid var(--border)',
              overflowY: 'auto',
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '2.25rem',
            }}
          >
            <div className="flex items-center justify-between">
              <p
                className="text-[10px] tracking-[0.22em] uppercase font-semibold"
                style={{ color: 'var(--muted-foreground)', opacity: 0.55, fontFamily: 'var(--font-body)' }}
              >
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
                <p
                  className="text-[10px] tracking-[0.22em] uppercase font-semibold mb-3.5"
                  style={{ color: group.labelColor, fontFamily: 'var(--font-body)' }}
                >
                  {group.label}
                </p>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-[13px] leading-snug"
                      style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side tab */}
      <button
        onClick={() => setCapOpen(true)}
        style={{
          position: 'fixed',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 55,
          background: 'var(--ccc-cream)',
          border: '1px solid var(--border)',
          borderRight: 'none',
          borderRadius: '6px 0 0 6px',
          padding: '0.85rem 0.55rem',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'border-color 0.18s',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ccc-near-black)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        <span
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: 'var(--muted-foreground)',
            opacity: 0.55,
            whiteSpace: 'nowrap',
          }}
        >
          All capabilities
        </span>
        <svg width="9" height="9" viewBox="0 0 15 15" fill="none" style={{ opacity: 0.4, transform: 'rotate(180deg)' }}>
          <path d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L10.586 8.5H2a1 1 0 1 1 0-2h8.586L8.293 3.707a1 1 0 0 1 0-1.414Z" fill="currentColor"/>
        </svg>
      </button>

      <div
        className="flex-1 flex items-center justify-center px-8 relative overflow-hidden"
        style={{ background: 'var(--ccc-cream)' }}
      >
        {/* Ambient background orb */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217,36,106,0.04) 0%, transparent 65%)',
            top: '-200px',
            right: '-100px',
          }}
        />

        <div className="w-full max-w-2xl relative z-10">

          {/* Display headline */}
          <h1
            className="tracking-tight animate-fade-up delay-1"
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: 'clamp(5rem, 10vw, 8.5rem)',
              lineHeight: '0.86',
              color: 'var(--ccc-near-black)',
              marginBottom: '1.75rem',
            }}
          >
            Coach<span style={{ color: 'var(--ccc-raspberry)' }}>OS</span>
          </h1>

          <p
            className="leading-relaxed max-w-lg animate-fade-up delay-2"
            style={{
              color: 'var(--muted-foreground)',
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              marginBottom: '2.25rem',
            }}
          >
            Build your foundation once. CoachOS reads your voice, your ideal client, and your offers, then runs your full sales and content workflow from there. Every output is quality-checked before it reaches you.
          </p>

          {/* Capabilities overview */}
          <div className="mb-9 animate-fade-up delay-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
              <p
                className="tracking-[0.20em] uppercase font-semibold"
                style={{ color: 'var(--muted-foreground)', opacity: 0.45, fontFamily: 'var(--font-body)', fontSize: '10px' }}
              >
                What CoachOS does
              </p>
              <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
            </div>
            <div className="grid grid-cols-3 gap-7">
              {ALL_CAPABILITIES.map((group) => (
                <div key={group.label}>
                  <p
                    className="tracking-[0.20em] uppercase font-semibold mb-3.5"
                    style={{ color: group.labelColor, fontFamily: 'var(--font-body)', fontSize: '10px' }}
                  >
                    {group.label}
                  </p>
                  <ul className="space-y-2">
                    {group.items.slice(0, 3).map((item) => (
                      <li
                        key={item}
                        style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: '1.45' }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {/* Plus more */}
            <div className="flex items-center gap-3 mt-5">
              <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
              <button
                onClick={() => setCapOpen(true)}
                className="transition-opacity duration-200"
                style={{ color: 'var(--muted-foreground)', opacity: 0.45, fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.45')}
              >
                plus more
              </button>
              <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
            </div>
          </div>

          {/* Two paths with OR divider */}
          <div className="flex items-stretch mb-8 animate-fade-up delay-4">
            {[
              {
                tag: 'Option 01',
                title: 'Upload your documents',
                desc: 'ICA profile, offer deck, bio, or any doc. We extract what we need.',
                label: 'Upload',
                action: onUpload,
              },
              {
                tag: 'Option 02',
                title: 'Answer setup questions',
                desc: 'Five blocks. We build your voice, ICA, offers, and proof points.',
                label: 'Start',
                action: onStartInterview,
              },
            ].map((card, idx) => (
              <React.Fragment key={card.tag}>
                <button
                  onClick={card.action}
                  className="p-8 rounded-2xl border text-left transition-all duration-250"
                  style={{
                    flex: 1,
                    borderColor: 'var(--border)',
                    background: 'rgba(254,252,243,0.85)',
                  }}
                  onMouseEnter={e => {
                    setHoveredCard(card.tag)
                    e.currentTarget.style.borderColor = 'var(--ccc-near-black)'
                    e.currentTarget.style.background = '#FEFCF3'
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(28,28,28,0.08)'
                  }}
                  onMouseLeave={e => {
                    setHoveredCard(null)
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.background = 'rgba(254,252,243,0.85)'
                    e.currentTarget.style.boxShadow = ''
                  }}
                >
                  <p
                    className="tracking-[0.22em] uppercase mb-5 font-semibold"
                    style={{ color: 'var(--ccc-tiffany)', fontFamily: 'var(--font-body)', fontSize: '9px' }}
                  >
                    {card.tag}
                  </p>
                  <p
                    className="font-bold mb-2.5 leading-snug"
                    style={{ color: 'var(--ccc-near-black)', fontFamily: 'var(--font-body)', fontSize: '15px' }}
                  >
                    {card.title}
                  </p>
                  <p
                    className="leading-relaxed mb-7"
                    style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '13.5px' }}
                  >
                    {card.desc}
                  </p>
                  <div
                    className="flex items-center gap-2 font-semibold tracking-wider uppercase transition-colors duration-200"
                    style={{
                      color: hoveredCard === card.tag ? 'var(--ccc-raspberry)' : 'var(--muted-foreground)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '10px',
                    }}
                  >
                    <span>{card.label}</span>
                    {ARROW}
                  </div>
                </button>
                {idx === 0 && (
                  <div
                    className="flex items-center justify-center"
                    style={{ width: '3.5rem', flexShrink: 0 }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontStyle: 'italic',
                        fontWeight: 700,
                        fontSize: '1.75rem',
                        color: 'var(--muted-foreground)',
                        opacity: 0.28,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      or
                    </span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-5 animate-fade-up delay-5">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <p
              className="tracking-[0.18em] uppercase"
              style={{ color: 'var(--muted-foreground)', opacity: 0.50, fontFamily: 'var(--font-body)', fontSize: '11px' }}
            >
              or just start typing
            </p>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2 animate-fade-up delay-5">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => onOptionClick?.(prompt)}
                className="px-4 py-2 rounded-full border font-medium transition-all duration-200 tracking-wide"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--muted-foreground)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--ccc-near-black)'
                  e.currentTarget.style.color = 'var(--ccc-near-black)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--muted-foreground)'
                }}
              >
                {prompt}
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
