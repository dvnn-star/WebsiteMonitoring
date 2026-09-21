# Website Monitoring & SEO Checker

A comprehensive web application for automated website auditing. Enter a URL and get instant insights on technical SEO, security, performance, and infrastructure—all in one dashboard.

## Features

### Core Audit Capabilities

- **HTTP Status Check** — Status codes, redirects, response time
- **SSL Certificate Analysis** — Validity, issuer, expiry date
- **SEO Metadata** — Title, meta description, canonical, Open Graph
- **Heading Structure** — H1-H6 hierarchy analysis
- **Image Analysis** — Alt text detection and missing alt reporting
- **Crawlability** — Robots.txt, sitemap.xml detection
- **Broken Links Detection** — Internal and external link validation
- **Mobile Readiness** — Viewport configuration check
- **DNS Records** — A, AAAA, CNAME, MX, NS, TXT records
- **Domain Expiry** — Registration expiry when available
- **Uptime Monitoring** — Scheduled health checks with alerts

### Security Features

- Input sanitization with DOMPurify
- Zod schema validation for all inputs
- Rate limiting (login, register, API endpoints)
- SSRF protection (blocks localhost, private IPs)
- Secure password policy (8+ chars, uppercase, lowercase, number)
- Open redirect vulnerability protection
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)

## Tech Stack

- **Framework:** Next.js 16.3.5 (App Router)
- **Database:** Supabase (PostgreSQL with RLS)
- **Styling:** Tailwind CSS 4
- **Validation:** Zod, DOMPurify, Validator.js
- **UI Components:** Lucide React, SweetAlert2
- **Testing:** Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dvnn-star/WebsiteMonitoring.git
cd WebsiteMonitoring
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CRON_SECRET=your_cron_secret
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Database Setup

Run the Supabase migrations:

```bash
supabase db push
```

Or apply migrations manually via Supabase Dashboard.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # Protected dashboard pages
│   │   └── dashboard/
│   │       ├── websites/
│   │       └── page.tsx
│   └── api/               # API routes
│       ├── audits/
│       ├── alerts/
│       ├── websites/
│       └── auth/
├── components/            # React components
│   ├── auth/
│   ├── dashboard/
│   ├── ui/
│   └── websites/
├── lib/                   # Core libraries
│   ├── audit/            # Audit engine modules
│   │   ├── engine.ts
│   │   ├── http-checker.ts
│   │   ├── ssl-checker.ts
│   │   ├── dns-checker.ts
│   │   ├── seo-checker.ts
│   │   ├── mobile-checker.ts
│   │   ├── crawlability-checker.ts
│   │   └── uptime-monitor.ts
│   ├── supabase/        # Supabase clients
│   └── validation/      # Input validation & rate limiting
└── types/               # TypeScript definitions
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/websites` | Add a new website |
| GET | `/api/websites` | List user websites |
| GET | `/api/websites/[id]` | Get website details |
| DELETE | `/api/websites/[id]` | Delete a website |
| POST | `/api/audits` | Start a new audit |
| GET | `/api/audits/[id]` | Get audit status |
| GET | `/api/alerts` | Get user alerts |
| PATCH | `/api/alerts` | Mark alerts as read |
| POST | `/api/cron/monitor` | Trigger uptime checks |

## Scheduled Monitoring

The application supports scheduled uptime monitoring via:

- **Vercel Cron Jobs** — Configured in `vercel.json`
- **GitHub Actions** — Workflow in `.github/workflows/cron.yml`

Default schedule: Every 24 hours at midnight (configurable).

### Setting Up Cron

1. Add `CRON_SECRET` to your environment variables
2. Configure `NEXT_PUBLIC_SITE_URL` to your production URL
3. For GitHub Actions, add the secret to your repository

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Watch mode for tests
npm run test:coverage # Generate coverage report
```

## Testing

The project includes comprehensive tests for:

- Audit engine components
- API routes
- UI components
- Authentication flows

Run tests with coverage:

```bash
npm run test:coverage
```

## Security Considerations

### SSRF Protection

The audit engine blocks requests to:
- `localhost` / `127.0.0.1`
- Private IP ranges (10.x, 172.16-31.x, 192.168.x)
- Internal TLDs (.local, .internal, etc.)

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login | 5 requests | 15 minutes |
| Register | 3 requests | 1 hour |
| Website Creation | 10 requests | 1 hour |
| General API | 60 requests | 1 minute |

### Password Policy

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm run start
```

## Target Users

- Web Developers
- Website Owners
- Freelancers
- SEO Specialists

## Roadmap

### Implemented (MVP)

- [x] URL input and validation
- [x] HTTP status checking
- [x] SSL certificate analysis
- [x] SEO metadata extraction
- [x] Broken links detection
- [x] DNS records check
- [x] Mobile viewport check
- [x] Dashboard with audit history
- [x] Uptime monitoring with alerts
- [x] Scheduled cron monitoring

### Future Features

- [ ] Email notifications
- [ ] Slack/Discord webhooks
- [ ] PDF report generation
- [ ] Shareable audit URLs
- [ ] Multi-language support
- [ ] Team collaboration
- [ ] White-label reports

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Acknowledgments

Built with guidance from the PRD.md specifications.
