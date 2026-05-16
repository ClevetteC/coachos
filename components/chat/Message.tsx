'use client'

import { cn } from '@/lib/utils'

interface Props {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export function Message({ role, content, isStreaming }: Props) {
  const isUser = role === 'user'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted text-foreground rounded-bl-sm'
        )}
      >
        {content}
        {isStreaming && !content && (
          <span className="inline-block w-2 h-4 bg-current opacity-70 animate-pulse ml-0.5" />
        )}
      </div>
    </div>
  )
}
