'use client'

import { useState, useRef, KeyboardEvent } from 'react'

interface Props {
  onSend: (text: string, file?: File) => void
  disabled: boolean
  triggerUpload?: boolean
  onUploadTriggered?: () => void
}

export function InputBar({ onSend, disabled, triggerUpload, onUploadTriggered }: Props) {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (triggerUpload) {
    fileInputRef.current?.click()
    onUploadTriggered?.()
  }

  function handleSend() {
    const trimmed = text.trim()
    if ((!trimmed && !file) || disabled) return
    onSend(trimmed, file ?? undefined)
    setText('')
    setFile(null)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
    e.target.value = ''
  }

  return (
    <div
      className="border-t px-6 pb-6 pt-4"
      style={{
        background: 'var(--ccc-cream)',
        borderColor: 'var(--border)',
        boxShadow: '0 -1px 0 rgba(28,28,28,0.04)',
      }}
    >
      {file && (
        <div className="max-w-2xl mx-auto mb-3">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              background: 'var(--ccc-raspberry-muted)',
              border: '1px solid var(--ccc-raspberry-border)',
              color: 'var(--ccc-near-black)',
              fontFamily: 'var(--font-body)',
              fontSize: '12.5px',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
              <path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v8A1.5 1.5 0 0 0 3.5 13h8a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 11.5 2h-8Zm0 1h8a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5Z" fill="currentColor"/>
            </svg>
            <span className="truncate max-w-[200px]">{file.name}</span>
            <button
              onClick={() => setFile(null)}
              className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
            >
              <svg width="10" height="10" viewBox="0 0 15 15" fill="none">
                <path d="M11.782 4.032a.575.575 0 1 0-.813-.814L7.5 6.687 4.031 3.218a.575.575 0 0 0-.814.814L6.687 7.5l-3.47 3.468a.575.575 0 0 0 .814.814L7.5 8.313l3.469 3.469a.575.575 0 0 0 .813-.814L8.313 7.5l3.469-3.468Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto flex gap-2.5 items-end">
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,.md,.csv,.docx"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Attach button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          title="Attach a document"
          className="h-12 w-12 rounded-xl border flex items-center justify-center transition-all duration-200 disabled:opacity-40 shrink-0"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--muted-foreground)',
            background: 'rgba(254,252,243,0.85)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--ccc-tiffany)'
            e.currentTarget.style.color = 'var(--ccc-tiffany)'
            e.currentTarget.style.background = 'var(--ccc-tiffany-muted)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--muted-foreground)'
            e.currentTarget.style.background = 'rgba(254,252,243,0.85)'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 15 15" fill="none">
            <path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v8A1.5 1.5 0 0 0 3.5 13h8a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 11.5 2h-8Zm4 3a.5.5 0 0 0-1 0V7H5a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V8H9a.5.5 0 0 0 0-1H7.5V5Z" fill="currentColor"/>
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={file ? 'Add a note, or send as-is...' : 'Message CoachOS...'}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-xl border px-4 py-3.5 focus:outline-none min-h-[48px] max-h-[200px] disabled:opacity-50 leading-relaxed transition-all duration-200"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            background: 'rgba(254,252,243,0.85)',
            borderColor: 'var(--border)',
            color: 'var(--ccc-near-black)',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = 'var(--ccc-raspberry)'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(217,36,106,0.10)'
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.boxShadow = ''
          }}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={disabled || (!text.trim() && !file)}
          className="h-12 px-6 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            background: 'var(--ccc-raspberry)',
            boxShadow: '0 2px 18px rgba(217,36,106,0.25)',
          }}
          onMouseEnter={e => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.background = 'var(--ccc-raspberry-dark)'
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(217,36,106,0.35)'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--ccc-raspberry)'
            e.currentTarget.style.boxShadow = '0 2px 18px rgba(217,36,106,0.25)'
          }}
        >
          {disabled ? (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="animate-spin">
              <path d="M7.5 1.5a6 6 0 1 0 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : 'Send'}
        </button>
      </div>

      <p
        className="max-w-2xl mx-auto mt-3 tracking-wide"
        style={{ color: 'var(--muted-foreground)', opacity: 0.38, fontFamily: 'var(--font-body)', fontSize: '11px' }}
      >
        Supports PDF, TXT, MD. Shift+Enter for new line.
      </p>
    </div>
  )
}
