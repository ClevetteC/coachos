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
      <div
        className="hidden md:flex w-[30rem] shrink-0 flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, oklch(0.13 0.008 75) 0%, oklch(0.09 0.005 75) 100%)' }}
      >
        {/* Left amber rule */}
        <div className="absolute top-0 left-0 w-[3px] h-full animate-amber-glow" style={{ background: 'var(--amber)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 animate-fade-in">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'var(--amber)' }}
          >
            <span className="text-sm font-black" style={{ color: 'var(--amber-foreground)' }}>C</span>
          </div>
          <span className="text-base font-bold tracking-wide" style={{ color: 'var(--sidebar-accent-foreground)' }}>CoachOS</span>
        </div>

        {/* Display statement */}
        <div className="animate-slide-left delay-2">
          <h2
            className="font-black leading-[0.95] mb-7 tracking-tight"
            style={{ fontSize: 'clamp(2.8rem, 4vw, 3.6rem)', color: 'oklch(0.97 0 0)' }}
          >
            Close more.<br />
            Deliver better.<br />
            <span style={{ color: 'var(--amber)' }}>Build faster.</span>
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.60 0.005 75)' }}>
            Your AI operating system for sales, coaching, and consulting.
          </p>
        </div>

        {/* Bottom attribution */}
        <p className="text-xs animate-fade-up delay-4" style={{ color: 'oklch(0.40 0.005 75)' }}>
          Clevette Coombs Consulting
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md space-y-8">

          <div className="space-y-2 animate-fade-up">
            <h1 className="text-5xl font-black tracking-tight text-foreground">Create account</h1>
            <p className="text-base text-muted-foreground">Get started with CoachOS.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4 animate-fade-up delay-2">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="h-12 text-base"
            />
            <Input
              type="password"
              placeholder="Password (8+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="h-12 text-base"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground animate-fade-up delay-3">
            Already have an account?{' '}
            <a href="/login" className="text-foreground font-semibold underline underline-offset-4">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
