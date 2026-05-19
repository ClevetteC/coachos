'use client'

import { useEffect, useRef } from 'react'
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

export function MessageList({ messages, streaming, onUpload, onStartInterview, onOptionClick }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-2xl">

          {/* Editorial header */}
          <div className="mb-12">
            <h1
              className="font-black leading-[0.92] tracking-tight mb-6 animate-fade-up delay-1"
              style={{ fontSize: 'clamp(4rem, 8vw, 6.5rem)', color: 'var(--foreground)' }}
            >
              Coach<span style={{ color: 'var(--amber)' }}>OS</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md animate-fade-up delay-2">
              Your AI operating system for sales, coaching, and consulting. Build your foundation once. Run every workflow from here.
            </p>
          </div>

          {/* Two paths */}
          <div className="grid grid-cols-2 gap-4 mb-10 animate-fade-up delay-3">
            <button
              onClick={onUpload}
              className="group relative p-6 rounded-xl border text-left overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--card)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--amber)'
                e.currentTarget.style.boxShadow = '0 8px 32px oklch(0.79 0.18 68 / 12%)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = ''
              }}
            >
              <div
                className="absolute top-0 left-0 w-[3px] h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'var(--amber)' }}
              />
              <p className="text-[9px] tracking-[0.18em] uppercase text-muted-foreground mb-4 font-semibold">
                Option 01
              </p>
              <p className="text-base font-bold text-foreground mb-2">Upload your documents</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ICA profile, offer deck, bio, or any doc. We extract what we need.
              </p>
            </button>

            <button
              onClick={onStartInterview}
              className="group relative p-6 rounded-xl border text-left overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--card)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--amber)'
                e.currentTarget.style.boxShadow = '0 8px 32px oklch(0.79 0.18 68 / 12%)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = ''
              }}
            >
              <div
                className="absolute top-0 left-0 w-[3px] h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'var(--amber)' }}
              />
              <p className="text-[9px] tracking-[0.18em] uppercase text-muted-foreground mb-4 font-semibold">
                Option 02
              </p>
              <p className="text-base font-bold text-foreground mb-2">Answer setup questions</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Five blocks. We build your voice, ICA, offers, and proof points.
              </p>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6 animate-fade-up delay-4">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground/60">or just start typing</p>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2 animate-fade-up delay-5">
            {[
              'Research a prospect',
              'Write a proposal',
              'Build outreach',
              'Check my content',
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => onStartInterview?.()}
                className="px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200"
                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--amber)'
                  e.currentTarget.style.color = 'var(--foreground)'
                  e.currentTarget.style.background = 'var(--amber-muted)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--muted-foreground)'
                  e.currentTarget.style.background = ''
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
    <div className="flex-1 overflow-y-auto min-h-0">
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
