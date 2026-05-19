'use client'

import { cn } from '@/lib/utils'

interface Props {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
  isLast?: boolean
  onOptionClick?: (option: string) => void
}

interface ParsedContent {
  preText: string
  options: string[]
  postText: string
}

function parseOptions(content: string): ParsedContent | null {
  const lines = content.split('\n')
  let listStart = -1
  let listEnd = -1
  const options: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^\s*\d+\.\s+(.+)$/)
    if (match) {
      if (listStart === -1) listStart = i
      listEnd = i
      const label = match[1]
        .replace(/\*\*/g, '')
        .split(/\s+[—–\-]\s+/)[0]
        .trim()
      options.push(label)
    }
  }

  if (options.length < 3) return null

  return {
    preText: lines.slice(0, listStart).join('\n').trim(),
    options,
    postText: lines.slice(listEnd + 1).join('\n').trim(),
  }
}

export function Message({ role, content, isStreaming, isLast, onOptionClick }: Props) {
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

  const parsed = !isStreaming && isLast ? parseOptions(content) : null

  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full bg-[var(--amber)] flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[10px] font-bold text-[var(--amber-foreground)]">C</span>
      </div>
      <div className="flex-1 pt-1">
        {parsed ? (
          <>
            {parsed.preText && (
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap mb-4">
                {parsed.preText}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {parsed.options.map((option) => (
                <button
                  key={option}
                  onClick={() => onOptionClick?.(option)}
                  className="px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 text-left"
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
                  {option}
                </button>
              ))}
            </div>
            {parsed.postText && (
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap mt-4">
                {parsed.postText}
              </p>
            )}
          </>
        ) : (
          <div className={cn(
            'text-sm leading-relaxed whitespace-pre-wrap text-foreground',
            isStreaming && !content && 'min-h-[20px]'
          )}>
            {content}
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-foreground opacity-40 animate-pulse ml-0.5 align-middle" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
