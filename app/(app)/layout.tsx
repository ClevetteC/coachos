import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ConversationList } from '@/components/sidebar/ConversationList'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, title, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(50)

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 border-r flex flex-col min-h-0">
        <ConversationList
          conversations={conversations ?? []}
          userEmail={user.email ?? ''}
        />
      </aside>
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
