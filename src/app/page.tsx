import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Search,
  Link2,
  Gauge,
  Network,
  Layers,
  CheckCircle2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Website Monitor & SEO Checker',
  description: 'Audit your website in one dashboard',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              Website Monitor
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Register
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Unified Technical & SEO Audit Engine
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-5 max-w-3xl mx-auto leading-tight">
            Audit your website in one dashboard
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Check SEO, SSL, broken links, performance, and more. Stop switching between fragmented tools—get comprehensive diagnostics instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-14">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto shadow-md">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>

          {/* Interactive Mockup Preview */}
          <div className="relative mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 px-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-mono text-slate-400 ml-2">https://example.com</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Healthy (200 OK)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-left">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                <div className="text-xs text-slate-500 font-medium">PASS</div>
                <div className="text-2xl font-bold text-emerald-600 mt-0.5">18</div>
                <div className="text-xs text-slate-400 mt-1">SEO & SSL valid</div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                <div className="text-xs text-slate-500 font-medium">WARNING</div>
                <div className="text-2xl font-bold text-amber-500 mt-0.5">2</div>
                <div className="text-xs text-slate-400 mt-1">Meta tags & robots</div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                <div className="text-xs text-slate-500 font-medium">ERROR</div>
                <div className="text-2xl font-bold text-rose-500 mt-0.5">0</div>
                <div className="text-xs text-slate-400 mt-1">No critical issues</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">
              Everything you need to keep websites healthy
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Audits across infrastructure, SEO, performance, and security.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                SEO Analysis
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Check title, meta description, headings, Open Graph, and image alt tags.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Security Check
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Verify SSL certificate, HTTPS, and check expiration dates.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Link2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Broken Links
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Find and fix broken links across your website automatically.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Gauge className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Performance
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Measure response time, page load, and document size.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                DNS Check
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Verify DNS records including A, AAAA, MX, NS, and TXT.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
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
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-slate-700">Website Monitor & SEO Checker</span>
          </div>
          <p>© 2026 Website Monitor. Built with Next.js & Supabase.</p>
        </div>
      </footer>
    </div>
  )
}
