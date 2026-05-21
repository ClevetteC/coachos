'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

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
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'var(--ccc-anchor)' }}>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{ background: 'var(--ccc-raspberry)', opacity: 0.55 }}
      />

      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: 'var(--ccc-raspberry)',
                boxShadow: '0 0 0 1px rgba(217,36,106,0.30)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 700, fontSize: '0.78rem', color: '#FCF7E8' }}>
                C
              </span>
            </div>
            <div>
              <p
                className="text-sm font-bold tracking-tight"
                style={{ color: 'var(--sidebar-accent-foreground)', fontFamily: 'var(--font-body)' }}
              >
                CoachOS
              </p>
              <p
                className="text-[8px] tracking-[0.18em] uppercase"
                style={{ color: 'var(--ccc-tiffany)', opacity: 0.60, fontFamily: 'var(--font-body)' }}
              >
                CCC
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/chat')}
            title="New conversation"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
            style={{ color: 'var(--sidebar-foreground)' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(217,36,106,0.10)'
              e.currentTarget.style.color = 'var(--ccc-raspberry)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--sidebar-foreground)'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <path d="M8 2.75a.5.5 0 0 0-1 0V7H2.75a.5.5 0 0 0 0 1H7v4.25a.5.5 0 0 0 1 0V8h4.25a.5.5 0 0 0 0-1H8V2.75Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Section label */}
      <div className="px-5 pt-5 pb-2">
        <div className="flex items-center gap-3">
          <p
            className="text-[8px] tracking-[0.22em] uppercase font-semibold"
            style={{ color: 'var(--ccc-tiffany)', opacity: 0.50, fontFamily: 'var(--font-body)' }}
          >
            Recent
          </p>
          <div className="flex-1 h-px" style={{ background: 'rgba(252,247,232,0.06)' }} />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-3 pb-2 space-y-0.5">
          {conversations.length === 0 && (
            <p
              className="px-2 py-2 text-[11px]"
              style={{ color: 'var(--sidebar-foreground)', opacity: 0.25, fontFamily: 'var(--font-body)' }}
            >
              No conversations yet
            </p>
          )}
          {conversations.map((conv) => {
            const isActive = pathname === `/chat/${conv.id}`
            return (
              <button
                key={conv.id}
                onClick={() => router.push(`/chat/${conv.id}`)}
                className={cn('w-full text-left px-2 py-2 rounded-lg text-[11px] truncate transition-all duration-150 leading-relaxed')}
                style={{
                  background: isActive ? 'rgba(217,36,106,0.10)' : 'transparent',
                  color: isActive ? '#FCF7E8' : 'var(--sidebar-foreground)',
                  borderLeft: isActive ? '2px solid var(--ccc-raspberry)' : '2px solid transparent',
                  paddingLeft: '8px',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--sidebar-accent)'
                    e.currentTarget.style.color = 'var(--sidebar-accent-foreground)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--sidebar-foreground)'
                  }
                }}
              >
                {conv.title ?? 'New conversation'}
              </button>
            )
          })}
        </div>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold"
            style={{
              background: 'rgba(37,190,186,0.12)',
              color: 'var(--ccc-tiffany)',
              border: '1px solid rgba(37,190,186,0.20)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {initials}
          </div>
          <p
            className="text-[11px] truncate flex-1"
            style={{ color: 'var(--sidebar-foreground)', fontFamily: 'var(--font-body)', opacity: 0.50 }}
          >
            {userEmail}
          </p>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="shrink-0 transition-all duration-150"
            style={{ color: 'rgba(252,247,232,0.25)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ccc-raspberry)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(252,247,232,0.25)'}
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
