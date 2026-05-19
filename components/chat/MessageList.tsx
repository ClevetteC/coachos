'use client'

import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
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
}

export function MessageList({ messages, streaming, onUpload, onStartInterview }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-xl">

          {/* Editorial header */}
          <div className="mb-10">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--amber)] font-medium mb-4">
              Clevette Coombs Consulting
            </p>
            <h1
              className="text-[2.75rem] leading-[1.05] font-light tracking-[-0.02em] text-foreground mb-4"
              style={{ letterSpacing: '-0.03em' }}
            >
              CoachOS
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Your AI operating system for sales, coaching, and consulting. Build your foundation once. Run every workflow from here.
            </p>
          </div>

          {/* Two paths */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              onClick={onUpload}
              className="group relative p-5 rounded-lg border border-border bg-card hover:border-[var(--amber)] transition-all duration-200 text-left overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-0.5 h-full bg-[var(--amber)] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-3 font-medium">
                Option 01
              </p>
              <p className="text-sm font-medium text-foreground mb-2">Upload your documents</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ICA profile, offer deck, bio, or any doc. We extract what we need.
              </p>
            </button>

            <button
              onClick={onStartInterview}
              className="group relative p-5 rounded-lg border border-border bg-card hover:border-[var(--amber)] transition-all duration-200 text-left overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-0.5 h-full bg-[var(--amber)] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-3 font-medium">
                Option 02
              </p>
              <p className="text-sm font-medium text-foreground mb-2">Answer setup questions</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Five blocks. We build your voice, ICA, offers, and proof points.
              </p>
            </button>
          </div>

          {/* Divider with label */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/60">or just start typing</p>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2">
            {[
              'Research a prospect',
              'Write a proposal',
              'Build outreach',
              'Check my content',
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => onStartInterview?.()}
                className="px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:border-[var(--amber)] hover:text-foreground transition-all duration-150"
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
    <ScrollArea className="flex-1">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">
        {messages.map((msg, i) => (
          <Message
            key={i}
            role={msg.role}
            content={msg.content}
            isStreaming={streaming && i === messages.length - 1 && msg.role === 'assistant'}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
