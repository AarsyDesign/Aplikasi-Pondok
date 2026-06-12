# Santri Report App

Santri Report App adalah aplikasi internal untuk pengelolaan raport santri, absensi guru, dan SPP.

## Deskripsi Singkat

Aplikasi ini dibuat untuk membantu lembaga pondok mengelola data akademik dan administrasi dasar secara internal. Fokus v1.0 adalah penggunaan oleh admin, guru, dan bendahara tanpa fitur publik untuk wali santri.

## Fitur Utama

- Login admin, guru, dan bendahara.
- Role dan permission dasar.
- Data santri.
- Kelas atau marhalah.
- Mata pelajaran.
- Input nilai.
- Raport dan print.
- Data guru.
- Absensi guru.
- Tagihan dan pembayaran SPP.
- Pengingat SPP manual via WhatsApp.
- Rekap tunggakan.
- Export CSV SPP.
- Tahun ajaran dan semester.
- Profil lembaga.
- Manajemen pengguna aplikasi.
- RLS dasar Supabase.

## Stack Teknologi

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

## Setup Lokal

Install dependency:

```bash
npm install
```

Buat file `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Jalankan aplikasi:

```bash
npm run dev
```

Buka:

```text
http://localhost:3000
```

## Deploy

1. Push project ke GitHub.
2. Import repository di Vercel.
3. Isi Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.
5. Jika env berubah, lakukan redeploy.

Sebelum deploy, jalankan:

```bash
npm run lint
npm run build
```

## Dokumentasi

- [Panduan Admin](docs/PANDUAN_ADMIN.md)
- [Setup Teknis](docs/SETUP_TEKNIS.md)
- [Panduan Supabase](docs/SUPABASE.md)
- [Panduan Backup Data](docs/BACKUP_DATA.md)
- [Checklist Audit v1.0](docs/CHECKLIST_V1.md)

## Catatan Keamanan

- Jangan commit `.env.local`.
- Jangan gunakan service role key di frontend.
- Gunakan anon key atau publishable key Supabase untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Backup data secara berkala.
- Jangan upload atau menyebarkan data sensitif sembarangan.
- Batasi akses Supabase Dashboard hanya untuk pengelola yang berwenang.
