'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
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

  return (
    <>
      <div className="p-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => router.push('/chat')}
        >
          New conversation
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => router.push(`/chat/${conv.id}`)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-xs truncate transition-colors',
                pathname === `/chat/${conv.id}`
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              {conv.title ?? 'New conversation'}
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <p className="text-xs text-muted-foreground truncate mb-2">{userEmail}</p>
        <Button variant="ghost" size="sm" className="w-full text-xs" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </>
  )
}
