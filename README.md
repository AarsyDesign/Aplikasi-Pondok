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

## Admin Login

Aplikasi memakai Supabase Auth untuk login admin dasar.

Cara membuat akun admin:

1. Buka Supabase Dashboard.
2. Masuk ke Authentication -> Users.
3. Buat user baru secara manual dengan email dan password.
4. Gunakan email dan password tersebut di halaman `/login`.

Catatan:

- Tidak ada register publik.
- Tidak ada forgot password pada tahap ini.
- Jangan gunakan service role key di aplikasi frontend.

Testing lokal:

1. Jalankan `npm run dev`.
2. Buka `/login`.
3. Login dengan user admin Supabase.
4. Pastikan masuk ke `/dashboard`.
5. Klik `Logout`.
6. Pastikan kembali ke `/login`.
7. Buka `/dashboard` saat logout.
8. Pastikan diarahkan ke `/login`.

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
3. Pastikan branch yang dipilih Vercel sama dengan branch GitHub yang berisi project.
4. Pastikan Root Directory Vercel mengarah ke root project yang berisi `package.json`.
   - Untuk repo ini, Root Directory: `.`
   - Jika project dipindah ke subfolder, arahkan Root Directory ke nama folder tersebut.
5. Buka Vercel Project Settings.
6. Tambahkan Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Setelah env ditambahkan, lakukan redeploy.
8. Setelah deploy selesai, buka URL production.
9. Cek route:
   - `/`
   - `/dashboard`
   - `/dashboard/santri`
   - `/dashboard/raport`
   - `/dashboard/spp`
10. Testing auth production:
    - Buka domain production.
    - Pastikan diarahkan ke `/login` atau `/dashboard` sesuai status login.
    - Login dengan akun admin Supabase.
    - Cek route dashboard utama.
    - Logout.
    - Pastikan `/dashboard` tidak bisa dibuka tanpa login.

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
- `supabase/rls.sql` setelah login Supabase Auth siap
- `supabase/roles.sql` untuk role sederhana admin/guru/bendahara
- `supabase/dev-policies.sql` hanya untuk development sementara sebelum auth aktif
- `supabase/duplicate-checks.sql` untuk audit data dobel

## Row Level Security

Jalankan `supabase/rls.sql` setelah `schema.sql` dan `seed.sql`.

RLS tahap ini hanya membedakan:

- belum login: tidak boleh akses data
- sudah login: boleh akses data internal

Role detail admin/guru/bendahara/wali santri belum dibuat. Jangan gunakan service role key di frontend.

Jika data tiba-tiba kosong setelah RLS diaktifkan, cek apakah user sudah login. Jika query mengembalikan array kosong, kemungkinan policy RLS belum sesuai atau user belum authenticated.

## Role Pengguna

Role dasar aplikasi disimpan di tabel `profiles`, bukan dari email user.

Role yang tersedia:

- `admin`: akses semua menu dashboard
- `guru`: akses Dashboard, Profil Saya, Santri, Input Nilai, Raport, Guru, dan Absensi Guru
- `bendahara`: akses Dashboard, Profil Saya, Santri, dan menu SPP

Setelah membuat user manual di Supabase Authentication, ambil user id lalu buat profile:

```sql
insert into profiles (user_id, full_name, role)
values ('USER_ID_DARI_SUPABASE_AUTH', 'Nama Admin', 'admin');
```

Jika user sudah login tetapi belum punya profile, aplikasi menampilkan pesan: `Profil pengguna belum diatur. Hubungi admin.`

## Manajemen Pengguna

Admin dapat membuka `/dashboard/pengaturan/pengguna` untuk mengelola data `profiles`.

Halaman ini hanya mengatur:

- User ID dari Supabase Auth
- Nama lengkap
- Role aplikasi

Halaman ini tidak membuat akun login Supabase Auth, tidak reset password, dan tidak menghapus akun Auth. Untuk membuat user baru:

1. Buka Supabase Dashboard.
2. Masuk ke Authentication -> Users.
3. Buat user email/password.
4. Salin user id.
5. Buka `/dashboard/pengaturan/pengguna`.
6. Tambahkan profile dengan user id tersebut.

Jika User ID sudah punya profile, aplikasi menampilkan pesan `User ID ini sudah memiliki profil.`
