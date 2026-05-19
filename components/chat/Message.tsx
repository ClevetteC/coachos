'use client'

import { cn } from '@/lib/utils'

interface Props {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export function Message({ role, content, isStreaming }: Props) {
  const isUser = role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap bg-[var(--primary)] text-[var(--primary-foreground)]">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full bg-[var(--amber)] flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[10px] font-bold text-[var(--amber-foreground)]">C</span>
      </div>
      <div className={cn(
        'flex-1 text-sm leading-relaxed whitespace-pre-wrap text-foreground pt-1',
        isStreaming && !content && 'min-h-[20px]'
      )}>
        {content}
        {isStreaming && !content && (
          <span className="inline-block w-2 h-4 bg-foreground opacity-40 animate-pulse ml-0.5 align-middle" />
        )}
        {isStreaming && content && (
          <span className="inline-block w-2 h-4 bg-foreground opacity-40 animate-pulse ml-0.5 align-middle" />
        )}
      </div>
    </div>
  )
}
