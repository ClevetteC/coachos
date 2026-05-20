'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
          style={{ background: 'var(--amber)' }}
        >
          <span className="text-sm font-black" style={{ color: 'var(--amber-foreground)' }}>!</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            An unexpected error occurred. Your data is safe.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="h-10 px-6 font-semibold">
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/chat'}
            className="h-10 px-6"
          >
            Back to chat
          </Button>
        </div>
      </div>
    </div>
  )
}
