# GitHub Actions CI/CD Setup

Repository ini dilengkapi dengan 2 workflow GitHub Actions:

1. **`ci.yml` (Continuous Integration)**
   - Berjalan pada setiap `push` dan `pull_request` ke branch `main`.
   - Meliputi:
     - **Lint & Typecheck**: Memeriksa kualitas kode dengan ESLint dan TypeScript compiler (`tsc --noEmit`).
     - **Unit Tests & Coverage**: Menjalankan 92 unit tests Jest, memvalidasi ambang batas coverage (>80%), dan mengunggah report sebagai artifact GitHub.
     - **Production Build Check**: Memastikan Next.js dapat dibuild untuk production tanpa error.

2. **`deploy.yml` (Continuous Deployment ke Vercel)**
   - Berjalan otomatis ketika push ke branch `main` (Production deploy) atau PR ke `main` (Preview deploy).
   - Menggunakan Vercel CLI resmi (`vercel pull`, `vercel build`, `vercel deploy --prebuilt`).

---

## Konfigurasi GitHub Repository Secrets & Variables

Untuk mengaktifkan deployment otomatis ke Vercel via GitHub Actions, tambahkan berikut ini di menu **Settings -> Secrets and variables -> Actions** pada repository GitHub:

### 1. Repository Secrets (`Secrets -> New repository secret`)

| Secret Name | Deskripsi |
|---|---|
| `VERCEL_TOKEN` | Token akun Vercel Anda (Didapat dari [Vercel Account Tokens](https://vercel.com/account/tokens)) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase Anda (`https://cwpnkygvaqzgocrudxrl.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anon Key Supabase Anda |

### 2. Repository Variables (`Variables -> New repository variable`)

| Variable Name | Deskripsi |
|---|---|
| `VERCEL_ORG_ID` | Organization/User ID di Vercel (bisa didapat dari `.vercel/project.json` setelah `npx vercel link` atau dari Project Settings) |
| `VERCEL_PROJECT_ID` | Project ID Vercel untuk aplikasi ini |

> **Catatan:** Jika Anda memilih menghubungkan GitHub repo langsung dari dashboard Vercel (Vercel Git Integration biasa), `deploy.yml` akan otomatis ter-skip bila secrets belum diisi dan Vercel akan menangani build sendiri secara gratis tanpa memakan menit GitHub Actions.
