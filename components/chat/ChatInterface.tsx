'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MessageList } from './MessageList'
import { InputBar } from './InputBar'

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
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return

    const userMessage: Message = { role: 'user', content: text }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setStreaming(true)

    abortRef.current = new AbortController()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages,
          conversationId: currentId,
        }),
        signal: abortRef.current.signal,
      })

      if (!response.ok || !response.body) {
        throw new Error('Request failed')
      }

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

              if (parsed.text !== undefined) {
                assistantText += parsed.text
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = { role: 'assistant', content: assistantText }
                  return updated
                })
              } else if (parsed.id) {
                // conversation_id event
                setCurrentId(parsed.id)
                router.replace(`/chat/${parsed.id}`, { scroll: false })
              }
            } catch {
              // partial JSON line, skip
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
      <MessageList messages={messages} streaming={streaming} />
      <InputBar onSend={sendMessage} disabled={streaming} />
    </div>
  )
}
