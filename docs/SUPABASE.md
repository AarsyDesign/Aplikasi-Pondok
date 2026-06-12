# Panduan Supabase

Santri Report App memakai Supabase untuk database, Authentication, dan Row Level Security.

## 1. Membuat Project Supabase

1. Buka Supabase Dashboard.
2. Buat project baru.
3. Simpan password database di tempat aman.
4. Tunggu sampai project siap.
5. Buka Project Settings.
6. Ambil `Project URL` untuk `NEXT_PUBLIC_SUPABASE_URL`.
7. Ambil anon key atau publishable key untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Jangan gunakan service role key di frontend.

## 2. Menjalankan `schema.sql`

1. Buka Supabase Dashboard.
2. Masuk ke SQL Editor.
3. Buka file `supabase/schema.sql` dari project.
4. Salin seluruh isi SQL.
5. Jalankan di SQL Editor.

File ini membuat tabel utama yang dibutuhkan aplikasi.

## 3. Menjalankan `seed.sql`

1. Buka file `supabase/seed.sql`.
2. Salin isi SQL.
3. Jalankan di Supabase SQL Editor.

File seed dipakai untuk data awal jika tersedia. Periksa isinya sebelum menjalankan di production.

## 4. Menjalankan `rls.sql`

1. Pastikan `schema.sql` sudah berjalan.
2. Pastikan akun login Supabase Auth sudah siap.
3. Buka file `supabase/rls.sql`.
4. Salin isi SQL.
5. Jalankan di SQL Editor.

RLS membantu membatasi akses data sesuai kondisi login dan policy yang dibuat.

## 5. Membuat User di Authentication

1. Buka Supabase Dashboard.
2. Masuk ke Authentication.
3. Pilih Users.
4. Klik Add User.
5. Isi email dan password.
6. Simpan.

Akun ini dipakai untuk login ke aplikasi.

## 6. Mengambil User ID

1. Buka Authentication.
2. Pilih Users.
3. Klik user yang baru dibuat.
4. Salin User ID.

User ID ini diperlukan untuk membuat profil aplikasi.

## 7. Membuat Profile User di Tabel `profiles`

Akun login dibuat di Supabase Auth, sedangkan role aplikasi disimpan di tabel `profiles`.

Setelah User ID didapat, buat profile di SQL Editor atau melalui halaman Pengaturan Pengguna di aplikasi.

Contoh SQL untuk admin:

```sql
insert into public.profiles (user_id, full_name, role)
values ('USER_ID', 'Nama Admin', 'admin');
```

Contoh SQL untuk guru:

```sql
insert into public.profiles (user_id, full_name, role)
values ('USER_ID', 'Nama Guru', 'guru');
```

Contoh SQL untuk bendahara:

```sql
insert into public.profiles (user_id, full_name, role)
values ('USER_ID', 'Nama Bendahara', 'bendahara');
```

Ganti `USER_ID` dengan User ID dari Supabase Authentication.

## 8. Catatan Penting

- Supabase Auth hanya menyimpan akun login.
- Role aplikasi disimpan di tabel `profiles`.
- Jika user bisa login tetapi tidak punya profile, aplikasi akan menampilkan pesan bahwa profil belum diatur.
- Jangan membagikan anon key dan URL project sembarangan di luar kebutuhan aplikasi.
- Jangan pernah memasukkan service role key ke `.env.local` frontend.
