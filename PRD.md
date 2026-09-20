1. RINGKASAN PRODUK

Website Monitoring & SEO Checker adalah web application yang memungkinkan developer dan pemilik website memasukkan URL untuk melakukan audit teknis website secara otomatis dalam satu dashboard.

Produk memeriksa aspek availability, SEO on-page, technical SEO, security, performance dasar, mobile readiness, DNS, serta expiry domain/SSL, kemudian menyajikan hasil dalam bentuk status, detail masalah, dan rekomendasi perbaikan.

Target pengguna:
- Developer / web developer
- Pemilik website / bisnis
- Freelancer pembuat website
- Technical SEO / SEO specialist


2. PROBLEM STATEMENT

Developer dan pemilik website sering harus menggunakan banyak tools berbeda untuk mengetahui apakah sebuah website memiliki masalah teknis.

Contohnya:
- HTTP status dicek dengan tool berbeda
- SSL diperiksa secara terpisah
- SEO metadata menggunakan SEO checker
- DNS menggunakan DNS lookup
- Broken links menggunakan crawler
- Mobile viewport diperiksa secara manual

Hal tersebut membuat proses audit menjadi terfragmentasi, memakan waktu, dan sulit mendapatkan gambaran kondisi website secara keseluruhan.

Produk ini menyatukan pemeriksaan tersebut dalam satu proses audit berbasis URL.


3. TUJUAN PRODUK

Primary Goals:
1. Memungkinkan user melakukan audit website hanya dengan memasukkan URL.
2. Menghasilkan hasil audit yang mudah dipahami.
3. Mengidentifikasi masalah teknis dan SEO yang perlu diperbaiki.
4. Memberikan detail teknis yang dapat langsung digunakan developer.
5. Menampilkan kondisi website dalam satu dashboard.

Success Metrics:
- Audit berhasil selesai: >=95%
- Waktu mulai menampilkan hasil: <10 detik untuk pemeriksaan dasar
- URL valid yang dapat diproses: >=95%
- User dapat memahami masalah tanpa dokumentasi tambahan: >=80%
- Audit yang diulang oleh user: >=20%


4. TARGET USER

Persona 1 — Web Developer

Kebutuhan:
- Menemukan masalah teknis dengan cepat.
- Mendapatkan informasi HTTP, SSL, DNS, canonical, robots, sitemap, dan broken links.
- Melihat detail error untuk debugging.

Pain point:
- Harus membuka banyak tools.
- Sulit mendapatkan audit menyeluruh.
- Audit manual membutuhkan waktu.

Persona 2 — Website Owner

Kebutuhan:
- Mengetahui apakah websitenya sehat.
- Memahami masalah tanpa harus mengerti semua istilah teknis.
- Mendapatkan prioritas perbaikan.

Pain point:
- Tidak memahami hasil technical SEO tools yang terlalu teknis.
- Tidak mengetahui apakah website memiliki masalah penting.


5. USER JOURNEY

User membuka website
        ↓
Memasukkan URL
        ↓
Klik "Audit Website"
        ↓
Validasi URL
        ↓
Audit berjalan
        ↓
Progress pemeriksaan
        ↓
Dashboard hasil audit
        ↓
Melihat masalah
        ↓
Klik masalah
        ↓
Melihat detail + rekomendasi
        ↓
Melakukan perbaikan
        ↓
Run Audit Again


6. CORE FEATURE

6.1 URL Input

Homepage memiliki input:

Website Monitoring & SEO Checker

Masukkan URL website

[ https://example.com ]

[ Audit Website ]

Behavior:
- User dapat memasukkan https://example.com
- Sistem memvalidasi URL.
- Sistem mendukung HTTP/HTTPS.
- Sistem memeriksa apakah domain dapat di-resolve.
- Sistem memeriksa apakah URL dapat diakses.
- Opsional: example.com dapat dinormalisasi menjadi https://example.com.


7. AUDIT ENGINE

Setelah user menjalankan audit, backend menjalankan beberapa pemeriksaan secara asynchronous.


7.1 HTTP STATUS

Memeriksa:
- HTTP status code
- Redirect
- Final URL
- Response time
- HTTP/HTTPS

Contoh:
HTTP Status
PASS — 200 OK

Redirect
PASS — No redirect

Response Time
PASS — 324 ms

Status dapat berupa:
- PASS
- WARNING
- ERROR


7.2 SSL CHECK

Sistem memeriksa sertifikat SSL.

Data:
- HTTPS enabled
- Certificate valid
- Certificate issuer
- Valid from
- Expiry date
- Remaining days
- Hostname match
- Certificate chain jika tersedia

Contoh:

SSL Certificate

Status: Valid
Issuer: Let's Encrypt
Expires: 24 Dec 2026
Remaining: 96 days

Warning:
SSL certificate expires in 14 days.


8. SEO METADATA

8.1 TITLE

Check:
- Title exists
- Title length
- Empty title
- Title terlalu panjang

Contoh:

Title
PASS — Found
"Example Website"
Length: 16 characters


8.2 META DESCRIPTION

Check:
- Exists
- Empty
- Length
- Terlalu pendek/panjang

Jika tidak ditemukan:
WARNING — Meta description missing


9. CANONICAL

Sistem mendeteksi canonical tag.

Contoh:

<link rel="canonical" href="https://example.com/" />

Hasil:
PASS — Canonical found

Masalah:
WARNING — Canonical missing

Informasi tambahan:
- Canonical URL
- Self-referencing canonical
- Canonical berbeda dari current URL


10. SITEMAP

Sistem memeriksa:
- /sitemap.xml
- Sitemap yang direferensikan dari robots.txt

Contoh:

Sitemap
PASS — Found
URL: https://example.com/sitemap.xml
HTTP: 200

Jika tidak ditemukan:
WARNING — Sitemap not found


11. ROBOTS.TXT

Check:
- Existence
- HTTP status
- User-agent
- Disallow
- Allow
- Sitemap declaration

Contoh:

Robots.txt
PASS — Found
HTTP 200

Sitemap:
https://example.com/sitemap.xml

Sistem memberikan warning apabila konfigurasi robots berpotensi memblokir crawling secara luas.


12. OPEN GRAPH

Memeriksa:
- og:title
- og:description
- og:image
- og:url
- og:type

Contoh:

Open Graph
PASS — og:title
PASS — og:description
PASS — og:image
PASS — og:url

Masalah:
WARNING — og:image missing


13. HEADING STRUCTURE

Crawler mengambil:
- H1
- H2
- H3
- H4
- H5
- H6

Contoh:

Heading Structure
H1: 1
H2: 4
H3: 7

Warning:
Multiple H1 detected

Detail dapat menampilkan teks heading.


14. IMAGE ALT

Crawler mengambil seluruh image pada halaman.

Contoh:

Images
Total images: 24
With alt: 19
Missing alt: 5

Daftar missing alt:
1. /images/header.jpg
2. /images/product.png
3. /images/team.jpg


15. PAGE SPEED SEDERHANA

MVP tidak perlu menggantikan Google Lighthouse/PageSpeed Insights.

Pengukuran:
- DNS lookup time
- Connection time
- Response time
- Download time
- Total page load
- HTML document size
- Number of requests jika tersedia

Contoh:

Page Speed
Response: 320 ms
HTML Size: 42 KB
Load Time: 1.8 sec
Status: Good

Catatan:
Metrik ini adalah basic server/page measurement, bukan pengganti Core Web Vitals atau Lighthouse.


16. BROKEN LINKS

Crawler mengikuti link internal dari halaman yang diaudit.

Contoh:

Links
Internal Links: 42
External Links: 12
Broken Links: 3

Detail:

/contact → 404
/products/abc → 404
/about → 500

MVP Scope:
- Crawl halaman utama
- Crawl internal links
- Configurable maximum links
- Default limit 50–100 URL


17. MOBILE VIEWPORT

Check apakah halaman memiliki:

<meta name="viewport" ...>

Contoh:

Mobile Viewport
PASS — Viewport detected
width=device-width
initial-scale=1

Jika tidak ada:
ERROR — Mobile viewport missing


18. DNS CHECK

Record yang dapat diperiksa:
- A
- AAAA
- CNAME
- MX
- NS
- TXT

Contoh:

DNS
A: PASS — 192.0.2.1
AAAA: PASS
NS: PASS
MX: PASS

DNS error:
ERROR — Domain could not be resolved


19. DOMAIN EXPIRY

Sistem mencoba mendapatkan:
- Domain registration expiry
- Registrar jika tersedia
- Remaining days

Contoh:

Domain
example.com

Expires:
15 Jan 2027

Remaining:
118 days

Jika data WHOIS/RDAP tidak tersedia:
Domain expiry information unavailable

Jangan menampilkan data hasil estimasi sebagai fakta.


20. SSL EXPIRY

Data berasal dari SSL certificate.

Contoh:

SSL Expiry
Expires: 24 Dec 2026
Remaining: 96 days
PASS — Certificate is valid

Threshold:
- >30 days: PASS
- 7–30 days: WARNING
- <7 days: CRITICAL
- Expired: ERROR

Threshold harus configurable.


21. AUDIT SUMMARY

Setelah audit selesai:

Website Audit
example.com

Overall Checks
PASS: 18
Warnings: 5
Errors: 2

[ View Issues ]

Untuk MVP, jangan menjadikan "Overall Score" sebagai satu-satunya representasi kesehatan website karena setiap kategori memiliki dampak berbeda.

Jika score digunakan, formula dan bobot harus transparan.


22. DASHBOARD

Struktur dashboard:

Website Audit
https://example.com

[ Run Audit Again ]

PASS 18
WARNING 5
ERROR 2

Technical
- HTTP Status
- SSL
- DNS

SEO
- Title
- Meta Description
- Canonical
- Open Graph

Crawlability
- Robots.txt
- Sitemap
- Broken Links

Performance
- Page Speed
- Mobile Viewport


23. ISSUE DETAIL

Contoh:

Meta Description

Status:
WARNING

Current:
No meta description found.

Why it matters:
Search engines may generate a description from page content instead.

Recommendation:
Add a relevant meta description to the page.

Example:

<meta name="description"
content="Description of your website">

Untuk developer, tampilkan informasi teknis.
Untuk website owner, gunakan bahasa sederhana.


24. ISSUE SEVERITY

CRITICAL
Masalah yang menyebabkan website tidak dapat diakses atau masalah fundamental.

ERROR
Masalah teknis yang perlu diperbaiki.

WARNING
Potensi masalah atau kondisi yang perlu diperhatikan.

PASSED
Pemeriksaan berhasil.


25. AUDIT CATEGORIES

Availability:
- HTTP
- Redirects
- Response time

Security:
- HTTPS
- SSL
- SSL expiry

SEO:
- Title
- Meta description
- Canonical
- Headings
- Open Graph

Crawlability:
- Robots.txt
- Sitemap
- Broken links

Performance:
- Response time
- Page load
- Document size

Mobile:
- Viewport

Infrastructure:
- DNS
- Domain expiry


26. AUDIT STATUS

Audit lifecycle:

QUEUED
  ↓
RUNNING
  ↓
COMPLETED

Jika gagal:

RUNNING
  ↓
PARTIAL / FAILED

Audit dapat tetap menghasilkan sebagian hasil jika salah satu checker gagal.

Contoh:
- SEO audit completed
- HTTP audit completed
- DNS lookup unavailable
- Domain expiry unavailable


27. PROGRESS UI

Saat audit berlangsung:

Auditing example.com...

PASS — HTTP Status
PASS — SSL
PASS — DNS
PASS — Title
PASS — Meta Description
RUNNING — Checking broken links...
QUEUED — Sitemap
QUEUED — Robots.txt
QUEUED — Open Graph

Progress tidak boleh memberikan persentase palsu jika backend belum benar-benar mengetahui progress.


28. DATA MODEL

Website
- id
- url
- domain
- created_at
- updated_at

Audit
- id
- website_id
- status
- started_at
- completed_at
- error_message

AuditResult
- id
- audit_id
- category
- check_type
- status
- severity
- title
- message
- technical_details
- recommendation

Link
- id
- audit_id
- source_url
- target_url
- status_code
- status


29. FUNCTIONAL REQUIREMENTS

FR-01 — User dapat memasukkan URL — Must
FR-02 — Sistem memvalidasi URL — Must
FR-03 — Sistem menjalankan HTTP check — Must
FR-04 — Sistem melakukan SSL check — Must
FR-05 — Sistem melakukan SEO metadata check — Must
FR-06 — Sistem memeriksa canonical — Must
FR-07 — Sistem memeriksa sitemap — Must
FR-08 — Sistem memeriksa robots.txt — Must
FR-09 — Sistem memeriksa Open Graph — Must
FR-10 — Sistem menganalisis heading — Must
FR-11 — Sistem menganalisis image alt — Must
FR-12 — Sistem melakukan basic page-speed check — Must
FR-13 — Sistem melakukan broken-link check — Must
FR-14 — Sistem memeriksa mobile viewport — Must
FR-15 — Sistem melakukan DNS check — Must
FR-16 — Sistem memeriksa SSL expiry — Must
FR-17 — Sistem mencoba mendapatkan domain expiry — Should
FR-18 — User dapat melihat detail issue — Must
FR-19 — User dapat menjalankan audit ulang — Must
FR-20 — Sistem menyimpan history audit — Should


30. NON-FUNCTIONAL REQUIREMENTS

Performance:
Audit harus menggunakan asynchronous/background processing agar request web tidak timeout ketika crawling banyak link.

Security:
Sistem harus memiliki perlindungan terhadap:
- SSRF
- localhost scanning
- private IP scanning
- internal network access
- malicious redirects
- excessive crawling

URL seperti:
http://localhost
http://127.0.0.1
http://169.254.x.x

harus dibatasi sesuai security policy.

Rate Limiting:
Batasi:
- Audit per IP
- Concurrent audit
- Crawling per domain
- Requests per audit

Availability:
Jika satu checker gagal, checker lainnya tetap dapat menyelesaikan audit.


31. API CONCEPT

Start Audit

POST /api/audits

Request:
{
  "url": "https://example.com"
}

Response:
{
  "audit_id": "aud_123",
  "status": "queued"
}

Audit Status

GET /api/audits/{audit_id}

Response:
{
  "id": "aud_123",
  "status": "completed"
}

Audit Results

GET /api/audits/{audit_id}/results


32. RECOMMENDED TECHNICAL ARCHITECTURE

Web Client
    |
    v
API Server
    |
    v
Queue / Jobs
    |
    +-------------------+
    |                   |
    v                   v
SEO Worker        Network Worker
    |                   |
    +---------+---------+
              |
              v
           Crawler
              |
              v
           Database

Arsitektur worker penting karena broken-link crawling dan DNS/SSL checks dapat berjalan secara asynchronous.


33. MVP SCOPE

Included:
- URL input
- HTTP status
- Redirect detection
- SSL check
- SSL expiry
- Title
- Meta description
- Canonical
- Sitemap
- Robots.txt
- Open Graph
- Heading structure
- Image alt
- Basic page speed
- Broken links
- Mobile viewport
- DNS
- Domain expiry bila data tersedia
- Dashboard
- Issue detail
- Audit ulang

Tidak termasuk MVP:
- Full Google Lighthouse
- Core Web Vitals real-user monitoring
- JavaScript rendering untuk seluruh website
- Backlink analysis
- Keyword tracking
- Competitor analysis
- Google Search Console integration
- Scheduled monitoring
- Email notification
- Team collaboration
- Automated SEO fixes


34. FUTURE FEATURES

Scheduled Monitoring:
- Daily
- Weekly
- Monthly

Change Detection:
Contoh:
Yesterday:
Title: "My Website"

Today:
Title: "Website"

Sistem memberikan:
SEO change detected

Alerts:
- SSL hampir expired
- Domain hampir expired
- Website down
- Broken links bertambah
- robots.txt berubah
- Sitemap error

Notifikasi:
- Email
- Slack
- Discord
- Webhook

Reports:
- PDF report
- Shareable audit URL
- Client report

Fitur ini dapat berguna untuk freelancer dan agency.


35. ACCEPTANCE CRITERIA

URL Audit:
Given user memasukkan URL valid
When user menekan "Audit Website"
Then sistem membuat audit dan menjalankan pemeriksaan.

HTTP:
Given website mengembalikan HTTP 200
Then HTTP check berstatus PASS.

Jika 404:
ERROR — HTTP Status — 404 Not Found

SSL:
Given certificate valid
Then SSL check PASS.

Jika certificate expired:
ERROR — SSL Certificate Expired

SEO:
Given halaman memiliki title
Then title ditampilkan bersama nilai aktualnya.

Jika tidak:
ERROR — Title Missing

Broken Links:
Given crawler menemukan link dengan response 404
Then link tersebut muncul pada Broken Links.

Partial Failure:
Given DNS provider tidak dapat memberikan informasi tertentu
Then audit tidak gagal secara keseluruhan dan hasil checker lainnya tetap tersedia.


36. DEFINITION OF DONE — MVP

- User dapat memasukkan URL.
- Audit berjalan asynchronous.
- Semua core checker dapat dijalankan.
- Hasil disimpan.
- Dashboard menampilkan status setiap checker.
- User dapat membuka detail issue.
- Recommendation tersedia untuk issue utama.
- Audit dapat dijalankan kembali.
- Broken-link crawler memiliki batas crawl.
- SSRF protection diterapkan.
- Rate limiting diterapkan.
- Partial audit failure ditangani.
- Error handling tersedia.
- Basic automated tests tersedia.
- Production logging dan monitoring tersedia.


37. PRIORITAS PENGEMBANGAN

Phase 1 — Foundation
1. URL input
2. Audit job system
3. HTTP checker
4. SSL checker
5. DNS checker
6. Basic dashboard

Phase 2 — SEO
7. Title
8. Meta description
9. Canonical
10. Heading
11. Open Graph
12. Image alt

Phase 3 — Crawlability
13. Robots.txt
14. Sitemap
15. Broken links
16. Mobile viewport

Phase 4 — Domain & Reporting
17. Domain expiry
18. Audit history
19. Detailed recommendations
20. Shareable report


38. PRODUCT SUCCESS DEFINITION

Produk berhasil memecahkan masalah utama apabila developer atau website owner dapat:

"Memasukkan satu URL dan dalam satu dashboard mengetahui masalah teknis, SEO, security, crawlability, performance dasar, dan infrastructure yang terdeteksi pada website tersebut tanpa harus berpindah-pindah tools."

Fokus MVP sebaiknya adalah akurasi hasil audit, kecepatan, dan kejelasan rekomendasi, bukan jumlah fitur sebanyak mungkin.
"""
