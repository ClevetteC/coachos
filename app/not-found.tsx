import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
          style={{ background: 'var(--amber)' }}
        >
          <span className="text-sm font-black" style={{ color: 'var(--amber-foreground)' }}>C</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Page not found
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This page does not exist or you do not have access to it.
          </p>
        </div>
        <Link href="/chat" className={buttonVariants({ className: 'h-10 px-6 font-semibold' })}>
          Back to chat
        </Link>
      </div>
    </div>
  )
}
