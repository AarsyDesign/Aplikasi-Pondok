# Setup Teknis

Dokumen ini berisi langkah teknis untuk menjalankan Santri Report App secara lokal dan menyiapkan deploy ke Vercel.

## 1. Clone Repo

Clone repository dari GitHub:

```bash
git clone URL_REPOSITORY
cd santri-report-app
```

Ganti `URL_REPOSITORY` dengan alamat repository project.

## 2. Install Dependency

Jalankan:

```bash
npm install
```

Pastikan proses selesai tanpa error.

## 3. Membuat `.env.local`

Buat file `.env.local` di root project.

Isi variable berikut:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Variable yang dibutuhkan:

- `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon key atau publishable key Supabase untuk frontend.

Jangan isi file ini dengan service role key.

## 4. Menjalankan Lokal

Jalankan:

```bash
npm run dev
```

Buka aplikasi di:

```text
http://localhost:3000
```

## 5. Build

Sebelum deploy, jalankan:

```bash
npm run build
```

Jika project menyediakan lint, jalankan juga:

```bash
npm run lint
```

Perbaiki error yang muncul sebelum deploy.

## 6. Deploy ke Vercel

1. Push project ke GitHub.
2. Buka Vercel.
3. Import repository.
4. Pastikan root directory mengarah ke folder yang berisi `package.json`.
5. Pilih framework Next.js jika belum terdeteksi otomatis.
6. Tambahkan Environment Variables.
7. Deploy.

## 7. Environment Variables di Vercel

1. Buka Vercel Project.
2. Masuk ke Settings.
3. Pilih Environment Variables.
4. Tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Pastikan value sesuai project Supabase production.
6. Simpan.

## 8. Redeploy Setelah Env Berubah

Perubahan Environment Variables tidak selalu langsung masuk ke deployment lama.

Setelah env diubah:

1. Buka tab Deployments di Vercel.
2. Pilih deployment terbaru.
3. Klik Redeploy.
4. Tunggu sampai proses selesai.
5. Tes aplikasi production.

## 9. Cek Build Logs Jika Error

Jika deploy gagal:

1. Buka deployment yang gagal di Vercel.
2. Buka bagian Build Logs.
3. Cari pesan error paling awal yang relevan.
4. Periksa apakah error berasal dari TypeScript, lint, env, atau koneksi Supabase.
5. Perbaiki di lokal.
6. Jalankan `npm run build`.
7. Push ulang dan deploy kembali.
