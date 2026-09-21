import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LandingNavAuth } from '@/components/layout/LandingNavAuth'
import { LandingHeroAuth } from '@/components/layout/LandingHeroAuth'

export const metadata: Metadata = {
  title: 'Website Monitor & SEO Checker',
  description: 'Audit your website in one dashboard',
}

export default async function HomePage() {
  let user: { email?: string } | null = null

  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    if (data?.user) {
      user = { email: data.user.email }
    }
  } catch {
    user = null
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">
        <div className="w-full px-6 sm:px-10 lg:px-14 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
              WM
            </div>
            <span className="text-base font-semibold text-slate-900">
              Website Monitor
            </span>
          </Link>

          <LandingNavAuth initialUser={user} />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full">
        <section className="w-full px-6 sm:px-10 lg:px-14 pt-20 pb-16 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-6">
            Technical & SEO Audit Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Audit your website in one dashboard
          </h1>

          <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Check SEO, SSL, broken links, performance, and more. Stop switching between fragmented tools and monitor all your web assets in one place.
          </p>

          <LandingHeroAuth initialUser={user} />

          {/* Sample Audit Card */}
          <div className="w-full max-w-4xl mx-auto rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 text-xs">
              <span className="font-mono text-slate-500">https://example.com</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                Healthy (200 OK)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                <div className="text-xs text-slate-500 font-medium">PASS</div>
                <div className="text-2xl font-bold text-emerald-600 mt-1">18</div>
                <div className="text-xs text-slate-400 mt-1">SEO & SSL valid</div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                <div className="text-xs text-slate-500 font-medium">WARNING</div>
                <div className="text-2xl font-bold text-amber-500 mt-1">2</div>
                <div className="text-xs text-slate-400 mt-1">Meta tags & robots</div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                <div className="text-xs text-slate-500 font-medium">ERROR</div>
                <div className="text-2xl font-bold text-rose-500 mt-1">0</div>
                <div className="text-xs text-slate-400 mt-1">No critical issues</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full px-6 sm:px-10 lg:px-14 py-20 bg-white border-t border-slate-200">
          <div className="w-full text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Everything you need to keep websites healthy
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Comprehensive checks across SEO, infrastructure, performance, and security.
            </p>
          </div>

          <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors">
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                SEO Analysis
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Check title, meta description, headings, Open Graph, and image alt tags.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors">
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Security Check
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Verify SSL certificate, HTTPS, and check expiration dates.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors">
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Broken Links
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Find and fix broken links across your website automatically.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors">
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Performance
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Measure response time, page load, and document size.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors">
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                DNS Check
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Verify DNS records including A, AAAA, MX, NS, and TXT.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors">
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Multi-Website
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Monitor multiple websites from a single dashboard.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 w-full">
        <div className="w-full px-6 sm:px-10 lg:px-14 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Website Monitor & SEO Checker</span>
          <p>© 2026 Website Monitor. Built with Next.js & Supabase.</p>
        </div>
      </footer>
    </div>
  )
}
