# Santri Report App

Aplikasi internal pesantren untuk mengelola data santri, nilai, raport, guru, absensi guru, SPP, pengingat SPP manual, dan pengaturan dasar lembaga.

## Development Lokal

Install dependency:

```bash
npm install
```

Siapkan `.env.local` di lokal:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Jalankan aplikasi:

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Validasi Sebelum Deploy

Jalankan:

```bash
npm run lint
npm run build
```

Build harus berhasil sebelum project dipush atau dideploy.

## Deployment ke Vercel

1. Push project ke GitHub.
2. Import repository di Vercel.
3. Buka Vercel Project Settings.
4. Tambahkan environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Jalankan deploy.
6. Setelah deploy selesai, buka URL production.
7. Cek route utama:
   - `/dashboard`
   - `/dashboard/santri`
   - `/dashboard/raport`
   - `/dashboard/spp`
   - `/dashboard/pengaturan`

Catatan penting:

- Jangan memasukkan `.env.local` ke GitHub.
- Jangan menggunakan service role key di frontend.
- Gunakan Supabase publishable key untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Jika production error karena env belum terbaca, cek ulang Environment Variables di Vercel lalu redeploy.

## Supabase

SQL awal dan policy development ada di folder `supabase/`.

Untuk development MVP, jalankan SQL berikut di Supabase SQL Editor sesuai kebutuhan:

- `supabase/schema.sql`
- `supabase/seed.sql`
- `supabase/dev-policies.sql`
- `supabase/duplicate-checks.sql` untuk audit data dobel
