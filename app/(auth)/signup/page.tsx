'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    router.push('/chat')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Brand panel */}
      <div className="hidden md:flex w-80 bg-[var(--sidebar)] flex-col justify-between p-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--amber)] flex items-center justify-center">
            <span className="text-xs font-bold text-[var(--amber-foreground)]">C</span>
          </div>
          <span className="text-sm font-semibold text-[var(--sidebar-accent-foreground)]">CoachOS</span>
        </div>
        <div className="space-y-3">
          <p className="text-[var(--sidebar-foreground)] text-sm leading-relaxed">
            Your AI operating system for coaches and consultants.
          </p>
          <p className="text-[var(--sidebar-foreground)]/50 text-xs">
            Built for Clevette Coombs Consulting.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Create your account</h1>
            <p className="text-sm text-muted-foreground">Get started with CoachOS.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-3">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <Input
              type="password"
              placeholder="Password (8+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <a href="/login" className="text-foreground underline underline-offset-4">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
