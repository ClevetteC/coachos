'use client'

import { useEffect, useRef, useState } from 'react'
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
  <svg width="9" height="9" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
    <path d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L10.586 8.5H2a1 1 0 1 1 0-2h8.586L8.293 3.707a1 1 0 0 1 0-1.414Z" fill="currentColor"/>
  </svg>
)

export function MessageList({ messages, streaming, onUpload, onStartInterview, onOptionClick }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div
        className="flex-1 flex items-center justify-center px-8 relative overflow-hidden"
        style={{ background: 'var(--ccc-cream)' }}
      >
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
              marginBottom: '1.5rem',
            }}
          >
            Coach<span style={{ color: 'var(--ccc-raspberry)' }}>OS</span>
          </h1>

          <p
            className="text-base leading-relaxed max-w-md animate-fade-up delay-2"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', marginBottom: '2rem' }}
          >
            Build your foundation once. CoachOS reads your voice, your ideal client, and your offers, then runs your full sales and content workflow from there. Every output is quality-checked before it reaches you.
          </p>

          {/* Capabilities overview */}
          <div className="mb-8 animate-fade-up delay-3">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
              <p
                className="text-[9px] tracking-[0.22em] uppercase font-semibold"
                style={{ color: 'var(--muted-foreground)', opacity: 0.45, fontFamily: 'var(--font-body)' }}
              >
                What CoachOS does
              </p>
              <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
            </div>
            <div className="grid grid-cols-3 gap-6">
              {[
                {
                  label: 'Close clients',
                  labelColor: 'var(--ccc-raspberry)',
                  items: ['Prospect research', 'Industry SWOT', 'LinkedIn sequences', 'Discovery prep', 'Proposals and contracts', 'Follow-up engine'],
                },
                {
                  label: 'Marketing and content',
                  labelColor: 'var(--ccc-tiffany)',
                  items: ['Landing pages', 'Email campaigns', 'Workshop scripts', 'Ad copy', 'Social content', 'Content calendar'],
                },
                {
                  label: 'Operations',
                  labelColor: 'rgba(28,28,28,0.45)',
                  items: ['Monday brief', 'Revenue health', 'Pipeline review', 'Client health', 'Quarterly review', 'Invoice follow-up'],
                },
              ].map((group) => (
                <div key={group.label}>
                  <p
                    className="text-[9px] tracking-[0.22em] uppercase font-semibold mb-3"
                    style={{ color: group.labelColor, fontFamily: 'var(--font-body)' }}
                  >
                    {group.label}
                  </p>
                  <ul className="space-y-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="text-xs leading-snug"
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

          {/* Two paths */}
          <div className="grid grid-cols-2 gap-4 mb-7 animate-fade-up delay-4">
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
            ].map((card) => (
              <button
                key={card.tag}
                onClick={card.action}
                className="p-7 rounded-xl border text-left transition-all duration-250"
                style={{
                  borderColor: 'var(--border)',
                  background: 'rgba(254,252,243,0.85)',
                }}
                onMouseEnter={e => {
                  setHoveredCard(card.tag)
                  e.currentTarget.style.borderColor = 'var(--ccc-near-black)'
                  e.currentTarget.style.background = '#FEFCF3'
                }}
                onMouseLeave={e => {
                  setHoveredCard(null)
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'rgba(254,252,243,0.85)'
                }}
              >
                <p
                  className="text-[9px] tracking-[0.22em] uppercase mb-5 font-semibold"
                  style={{ color: 'var(--ccc-tiffany)', fontFamily: 'var(--font-body)' }}
                >
                  {card.tag}
                </p>
                <p
                  className="text-sm font-bold mb-2 leading-snug"
                  style={{ color: 'var(--ccc-near-black)', fontFamily: 'var(--font-body)' }}
                >
                  {card.title}
                </p>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}
                >
                  {card.desc}
                </p>
                <div
                  className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase transition-colors duration-200"
                  style={{
                    color: hoveredCard === card.tag ? 'var(--ccc-raspberry)' : 'var(--muted-foreground)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <span>{card.label}</span>
                  {ARROW}
                </div>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-5 animate-fade-up delay-5">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <p
              className="text-[10px] tracking-[0.18em] uppercase"
              style={{ color: 'var(--muted-foreground)', opacity: 0.50, fontFamily: 'var(--font-body)' }}
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
                className="px-4 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 tracking-wide"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--muted-foreground)',
                  fontFamily: 'var(--font-body)',
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
    )
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0" style={{ background: 'var(--ccc-cream)' }}>
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">
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
