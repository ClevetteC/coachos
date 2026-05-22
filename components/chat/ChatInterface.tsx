'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MessageList } from './MessageList'
import { InputBar } from './InputBar'
import { OnboardingWalkthrough } from '@/components/onboarding/OnboardingWalkthrough'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  conversationId: string | null
  initialMessages: Message[]
}

export function ChatInterface({ conversationId, initialMessages }: Props) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [streaming, setStreaming] = useState(false)
  const [currentId, setCurrentId] = useState<string | null>(conversationId)
  const [triggerUpload, setTriggerUpload] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [contextLimitHit, setContextLimitHit] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    try {
      if (!localStorage.getItem('coachos_onboarding_seen')) {
        setShowOnboarding(true)
      }
    } catch {}
  }, [])

  async function extractFileText(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('File upload failed')
    const { text } = await res.json()
    return text
  }

  const sendMessage = useCallback(async (text: string, file?: File) => {
    if ((!text.trim() && !file) || streaming) return

    let userContent = text.trim()

    if (file) {
      try {
        const extracted = await extractFileText(file)
        const prefix = text.trim()
          ? `${text.trim()}\n\n`
          : ''
        userContent = `${prefix}[Uploaded: ${file.name}]\n\n${extracted}\n\nPlease extract any relevant information about my coaching business from this document and save it using the appropriate foundation data tools.`
      } catch {
        userContent = text.trim() || `I tried to upload ${file.name} but the extraction failed. Please let me know what formats you support.`
      }
    }

    const userMessage: Message = { role: 'user', content: userContent }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setStreaming(true)

    abortRef.current = new AbortController()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, conversationId: currentId }),
        signal: abortRef.current.signal,
      })

      if (!response.ok || !response.body) throw new Error('Request failed')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''
      let buffer = ''

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.slice(6))
              if (parsed.context_limit) {
                setContextLimitHit(true)
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: 'This conversation has reached its limit. Start a new one to keep going.',
                  }
                  return updated
                })
              } else if (parsed.text !== undefined) {
                assistantText += parsed.text
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = { role: 'assistant', content: assistantText }
                  return updated
                })
              } else if (parsed.id) {
                setCurrentId(parsed.id)
                router.replace(`/chat/${parsed.id}`, { scroll: false })
              } else if (parsed.message) {
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: `Something went wrong: ${parsed.message}`,
                  }
                  return updated
                })
              }
            } catch {
              // partial line
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: 'assistant',
            content: 'Something went wrong. Please try again.',
          }
          return updated
        })
      }
    } finally {
      setStreaming(false)
      abortRef.current = null
    }
  }, [messages, streaming, currentId, router])

  return (
    <div className="flex flex-col h-full">
      {showOnboarding && (
        <OnboardingWalkthrough onComplete={() => setShowOnboarding(false)} />
      )}
      <MessageList
        messages={messages}
        streaming={streaming}
        onUpload={() => setTriggerUpload(true)}
        onStartInterview={() => sendMessage('Get me set up')}
        onOptionClick={(option) => sendMessage(option)}
      />
      {contextLimitHit && (
        <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Conversation limit reached.
          </p>
          <a
            href="/chat"
            className="text-sm font-medium px-3 py-1.5 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            Start new conversation
          </a>
        </div>
      )}
      <InputBar
        onSend={sendMessage}
        disabled={streaming || contextLimitHit}
        triggerUpload={triggerUpload}
        onUploadTriggered={() => setTriggerUpload(false)}
      />
    </div>
  )
}
