'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-6xl font-bold text-text-tertiary mb-4">500</p>
            <h1 className="text-2xl font-semibold text-text-primary mb-2">Something went wrong</h1>
            <p className="text-text-secondary mb-8">
              An unexpected error occurred. Please try again.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={reset}>Try again</Button>
              <Link href="/">
                <Button variant="secondary">Go home</Button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
