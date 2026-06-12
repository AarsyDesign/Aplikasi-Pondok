# Panduan Backup Data Manual

Backup data penting dilakukan agar data santri, nilai, raport, SPP, dan absensi tetap aman jika terjadi kesalahan input, perubahan aplikasi, atau masalah teknis.

## 1. Data yang Perlu Dibackup

Backup perlu mencakup data penting berikut:

- Data santri.
- Data kelas atau marhalah.
- Data mata pelajaran.
- Data nilai dan raport.
- Data guru.
- Data absensi guru.
- Data tagihan SPP.
- Data pembayaran SPP.
- Data tahun ajaran dan semester.
- Data profil lembaga.
- Data profil pengguna aplikasi.

## 2. Backup Manual dari Supabase Table Editor

1. Buka Supabase Dashboard.
2. Pilih project aplikasi.
3. Buka Table Editor.
4. Pilih tabel yang ingin dibackup.
5. Gunakan fitur export atau download CSV jika tersedia.
6. Simpan file backup di folder yang aman.
7. Ulangi untuk tabel penting lainnya.

## 3. Export Table Penting ke CSV

Export setiap tabel penting ke file CSV. Gunakan nama file yang jelas, misalnya:

```text
students-2026-06-12.csv
spp_payments-2026-06-12.csv
grades-2026-06-12.csv
```

Tanggal pada nama file membantu membedakan backup lama dan backup terbaru.

## 4. Daftar Tabel Penting

Tabel berikut perlu dibackup secara berkala:

- `students`
- `classes`
- `subjects`
- `grades`
- `teachers`
- `teacher_attendances`
- `spp_bills`
- `spp_payments`
- `academic_years`
- `semesters`
- `institution_profile`
- `profiles`

## 5. Saran Jadwal Backup

Lakukan backup:

- Mingguan saat masa aktif sekolah.
- Sebelum pembagian raport.
- Sebelum perubahan besar pada aplikasi.
- Setelah input data SPP besar-besaran.

## 6. Catatan Keamanan

- Jangan hanya bergantung pada aplikasi.
- Simpan backup di tempat aman, misalnya storage internal lembaga atau drive yang aksesnya terbatas.
- Jangan sebarkan file backup karena berisi data santri dan data internal.
- Batasi akses file backup hanya untuk orang yang berwenang.
- Jika backup disimpan di cloud storage, pastikan akun cloud memakai password yang kuat.
