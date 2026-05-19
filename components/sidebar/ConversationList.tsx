'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Conversation {
  id: string
  title: string | null
  updated_at: string
}

interface Props {
  conversations: Conversation[]
  userEmail: string
}

export function ConversationList({ conversations, userEmail }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = userEmail.slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--sidebar)', color: 'var(--sidebar-foreground)' }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'var(--amber)' }}
            >
              <span className="text-[9px] font-bold" style={{ color: 'var(--amber-foreground)' }}>C</span>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide" style={{ color: 'var(--sidebar-accent-foreground)' }}>CoachOS</p>
              <p className="text-[9px] tracking-[0.12em] uppercase opacity-40" style={{ color: 'var(--sidebar-foreground)' }}>CCC</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/chat')}
            title="New conversation"
            className="w-6 h-6 rounded flex items-center justify-center transition-colors"
            style={{ color: 'var(--sidebar-foreground)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--sidebar-accent)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <path d="M8 2.75a.5.5 0 0 0-1 0V7H2.75a.5.5 0 0 0 0 1H7v4.25a.5.5 0 0 0 1 0V8h4.25a.5.5 0 0 0 0-1H8V2.75Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Section label */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[9px] tracking-[0.18em] uppercase opacity-40" style={{ color: 'var(--sidebar-foreground)' }}>
          Recent
        </p>
      </div>

      {/* Conversations */}
      <ScrollArea className="flex-1">
        <div className="px-3 pb-2 space-y-0.5">
          {conversations.length === 0 && (
            <p className="px-2 py-2 text-[11px] opacity-30" style={{ color: 'var(--sidebar-foreground)' }}>
              No conversations yet
            </p>
          )}
          {conversations.map((conv) => {
            const isActive = pathname === `/chat/${conv.id}`
            return (
              <button
                key={conv.id}
                onClick={() => router.push(`/chat/${conv.id}`)}
                className={cn(
                  'w-full text-left px-2 py-2 rounded text-[11px] truncate transition-all duration-150 leading-relaxed',
                )}
                style={{
                  background: isActive ? 'var(--sidebar-accent)' : 'transparent',
                  color: isActive ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
                  borderLeft: isActive ? '2px solid var(--amber)' : '2px solid transparent',
                  paddingLeft: '8px',
                }}
              >
                {conv.title ?? 'New conversation'}
              </button>
            )
          })}
        </div>
      </ScrollArea>

      {/* User */}
      <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-semibold"
            style={{ background: 'var(--sidebar-accent)', color: 'var(--sidebar-accent-foreground)' }}
          >
            {initials}
          </div>
          <p className="text-[11px] truncate flex-1 opacity-60" style={{ color: 'var(--sidebar-foreground)' }}>
            {userEmail}
          </p>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="transition-opacity opacity-30 hover:opacity-70 shrink-0"
            style={{ color: 'var(--sidebar-foreground)' }}
          >
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <path d="M3 1a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h6a.5.5 0 0 0 0-1H3V2h6a.5.5 0 0 0 0-1H3Zm9.854 4.146a.5.5 0 0 0-.708.708L13.293 7H6.5a.5.5 0 0 0 0 1h6.793l-1.147 1.146a.5.5 0 0 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
