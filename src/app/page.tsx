import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Website Monitor & SEO Checker',
  description: 'Audit your website in one dashboard',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border-light">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-text-primary">
            Website Monitor
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Website Monitoring & SEO Checker
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Audit your website in one dashboard. Check SEO, SSL, broken links, performance, and more.
          </p>
          
          <Link href="/register">
            <Button size="lg">Get Started Free</Button>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="border border-border-light rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              SEO Analysis
            </h3>
            <p className="text-text-secondary">
              Check title, meta description, headings, Open Graph, and image alt tags.
            </p>
          </div>
          
          <div className="border border-border-light rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Security Check
            </h3>
            <p className="text-text-secondary">
              Verify SSL certificate, HTTPS, and check expiration dates.
            </p>
          </div>
          
          <div className="border border-border-light rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Broken Links
            </h3>
            <p className="text-text-secondary">
              Find and fix broken links across your website automatically.
            </p>
          </div>
          
          <div className="border border-border-light rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Performance
            </h3>
            <p className="text-text-secondary">
              Measure response time, page load, and document size.
            </p>
          </div>
          
          <div className="border border-border-light rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              DNS Check
            </h3>
            <p className="text-text-secondary">
              Verify DNS records including A, AAAA, MX, NS, and TXT.
            </p>
          </div>
          
          <div className="border border-border-light rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Multi-Website
            </h3>
            <p className="text-text-secondary">
              Monitor multiple websites from a single dashboard.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-light mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-text-secondary">
          <p>Website Monitor & SEO Checker</p>
        </div>
      </footer>
    </div>
  )
}
