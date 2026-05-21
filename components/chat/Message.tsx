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

// ── Markdown renderer ──────────────────────────────────────────────────────────

type Token =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'hr' }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'code_block'; lang: string; code: string }
  | { type: 'table'; header: string[]; rows: string[][] }
  | { type: 'paragraph'; text: string }
  | { type: 'blank' }

function tokenize(markdown: string): Token[] {
  const lines = markdown.split('\n')
  const tokens: Token[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      tokens.push({ type: 'code_block', lang, code: codeLines.join('\n') })
      i++
      continue
    }

    const h3 = line.match(/^### (.+)/)
    if (h3) { tokens.push({ type: 'heading', level: 3, text: h3[1] }); i++; continue }
    const h2 = line.match(/^## (.+)/)
    if (h2) { tokens.push({ type: 'heading', level: 2, text: h2[1] }); i++; continue }
    const h1 = line.match(/^# (.+)/)
    if (h1) { tokens.push({ type: 'heading', level: 1, text: h1[1] }); i++; continue }

    if (/^---+$/.test(line.trim())) { tokens.push({ type: 'hr' }); i++; continue }

    if (line.startsWith('|')) {
      const tableLines: string[] = [line]
      i++
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      const parseRow = (r: string) =>
        r.split('|').slice(1, -1).map(c => c.trim())
      const header = parseRow(tableLines[0])
      const rows = tableLines
        .slice(2)
        .filter(r => !/^\|[\s\-|]+\|$/.test(r))
        .map(parseRow)
      tokens.push({ type: 'table', header, rows })
      continue
    }

    if (/^[-*] /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-*] /, ''))
        i++
      }
      tokens.push({ type: 'ul', items })
      continue
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      tokens.push({ type: 'ol', items })
      continue
    }

    if (line.trim() === '') { tokens.push({ type: 'blank' }); i++; continue }

    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('|') &&
      !/^---+$/.test(lines[i].trim()) &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i])
    ) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      tokens.push({ type: 'paragraph', text: paraLines.join('\n') })
    }
  }

  return tokens
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index))
    }
    if (match[2] !== undefined) {
      parts.push(<strong key={match.index} className="font-semibold" style={{ color: 'var(--ccc-near-black)' }}>{match[2]}</strong>)
    } else if (match[3] !== undefined) {
      parts.push(<em key={match.index}>{match[3]}</em>)
    } else if (match[4] !== undefined) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded text-[0.8em] font-mono"
          style={{ background: 'var(--muted)', color: 'var(--ccc-near-black)' }}
        >
          {match[4]}
        </code>
      )
    }
    last = match.index + match[0].length
  }

  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function MarkdownContent({ content }: { content: string }) {
  const tokens = tokenize(content)

  return (
    <div className="space-y-2.5">
      {tokens.map((token, idx) => {
        switch (token.type) {
          case 'heading': {
            const Tag = `h${token.level}` as 'h1' | 'h2' | 'h3'
            const cls = token.level === 1
              ? 'font-bold tracking-tight mt-1'
              : token.level === 2
              ? 'font-semibold mt-0.5'
              : 'font-semibold'
            const sz = token.level === 1 ? '16px' : token.level === 2 ? '15px' : '14.5px'
            return (
              <Tag
                key={idx}
                className={cls}
                style={{ color: 'var(--ccc-near-black)', fontFamily: 'var(--font-body)', fontSize: sz }}
              >
                {renderInline(token.text)}
              </Tag>
            )
          }
          case 'hr':
            return <hr key={idx} className="my-1" style={{ borderColor: 'var(--border)' }} />
          case 'ul':
            return (
              <ul key={idx} className="space-y-1.5 pl-4">
                {token.items.map((item, j) => (
                  <li
                    key={j}
                    className="leading-relaxed flex gap-2"
                    style={{ color: 'var(--ccc-near-black)', fontFamily: 'var(--font-body)', fontSize: '14.5px' }}
                  >
                    <span
                      className="mt-[8px] shrink-0 w-1 h-1 rounded-full"
                      style={{ background: 'var(--ccc-raspberry)', opacity: 0.55 }}
                    />
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={idx} className="space-y-1.5 pl-4">
                {token.items.map((item, j) => (
                  <li
                    key={j}
                    className="leading-relaxed flex gap-2"
                    style={{ color: 'var(--ccc-near-black)', fontFamily: 'var(--font-body)', fontSize: '14.5px' }}
                  >
                    <span
                      className="shrink-0 tabular-nums font-semibold"
                      style={{ color: 'var(--ccc-raspberry)', fontSize: '12px' }}
                    >
                      {j + 1}.
                    </span>
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ol>
            )
          case 'code_block':
            return (
              <pre
                key={idx}
                className="rounded-xl px-4 py-3 overflow-x-auto"
                style={{ background: 'var(--muted)' }}
              >
                <code
                  className="text-xs font-mono"
                  style={{ color: 'var(--ccc-near-black)' }}
                >
                  {token.code}
                </code>
              </pre>
            )
          case 'table':
            return (
              <div key={idx} className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                      {token.header.map((h, j) => (
                        <th
                          key={j}
                          className="text-left py-2 pr-4 font-semibold"
                          style={{ color: 'var(--ccc-near-black)', fontFamily: 'var(--font-body)', fontSize: '13px' }}
                        >
                          {renderInline(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {token.rows.map((row, j) => (
                      <tr key={j} className="border-b" style={{ borderColor: 'rgba(28,28,28,0.06)' }}>
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className="py-2 pr-4"
                            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '13px' }}
                          >
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          case 'blank':
            return null
          case 'paragraph':
          default:
            return (
              <p
                key={idx}
                className="leading-relaxed"
                style={{ color: 'var(--ccc-near-black)', fontFamily: 'var(--font-body)', fontSize: '14.5px' }}
              >
                {renderInline(token.text)}
              </p>
            )
        }
      })}
    </div>
  )
}

// ── Message component ──────────────────────────────────────────────────────────

export function Message({ role, content, isStreaming, isLast, onOptionClick }: Props) {
  const isUser = role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[80%] rounded-2xl rounded-br-sm px-5 py-3.5 leading-relaxed whitespace-pre-wrap font-medium"
          style={{
            background: 'var(--ccc-raspberry)',
            color: '#FCF7E8',
            fontFamily: 'var(--font-body)',
            fontSize: '14.5px',
            boxShadow: '0 2px 16px rgba(217,36,106,0.22)',
          }}
        >
          {content}
        </div>
      </div>
    )
  }

  const parsed = !isStreaming && isLast ? parseOptions(content) : null

  return (
    <div className="flex gap-3 items-start">
      {/* CoachOS avatar */}
      <div className="relative shrink-0 mt-0.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{
            background: 'var(--ccc-raspberry)',
            boxShadow: '0 0 10px rgba(217,36,106,0.22)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: '0.7rem',
              color: '#FCF7E8',
            }}
          >
            C
          </span>
        </div>
        <div
          className="absolute inset-0 rounded-full border animate-tiffany-ring"
          style={{ borderColor: 'var(--ccc-tiffany)', borderWidth: '1px' }}
        />
      </div>

      <div className="flex-1 pt-1 min-w-0">
        {parsed ? (
          <>
            {parsed.preText && (
              <div className="mb-4">
                <MarkdownContent content={parsed.preText} />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {parsed.options.map((option) => (
                <button
                  key={option}
                  onClick={() => onOptionClick?.(option)}
                  className="px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 text-left"
                  style={{
                    borderColor: 'var(--ccc-tiffany-border)',
                    color: 'var(--muted-foreground)',
                    fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--ccc-raspberry)'
                    e.currentTarget.style.color = 'var(--ccc-raspberry)'
                    e.currentTarget.style.background = 'var(--ccc-raspberry-muted)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--ccc-tiffany-border)'
                    e.currentTarget.style.color = 'var(--muted-foreground)'
                    e.currentTarget.style.background = ''
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
            {parsed.postText && (
              <div className="mt-4">
                <MarkdownContent content={parsed.postText} />
              </div>
            )}
          </>
        ) : isStreaming && !content ? (
          <div className="min-h-[20px] flex items-center gap-1 pt-1">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                style={{
                  background: 'var(--ccc-raspberry)',
                  opacity: 0.6,
                  animationDelay: `${i * 0.18}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <>
            <MarkdownContent content={content} />
            {isStreaming && (
              <span
                className="inline-block w-[2px] h-4 ml-0.5 align-middle rounded-sm animate-cursor-blink"
                style={{ background: 'var(--ccc-raspberry)' }}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
