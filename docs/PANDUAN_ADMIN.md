# Panduan Admin Santri Report App

Panduan ini ditujukan untuk admin pondok yang mengelola data santri, nilai, raport, guru, absensi guru, SPP, dan pengguna aplikasi.

## 1. Login

1. Buka alamat aplikasi.
2. Masuk ke halaman login.
3. Isi email dan password yang sudah dibuat di Supabase Auth.
4. Klik tombol login.
5. Jika berhasil, aplikasi akan membuka dashboard.

Jika muncul pesan bahwa profil pengguna belum diatur, hubungi pengelola teknis agar akun login tersebut dibuatkan profil di tabel `profiles`.

## 2. Mengatur Profil Lembaga

1. Buka menu Pengaturan.
2. Pilih Profil Lembaga.
3. Isi nama lembaga, alamat, dan informasi lain yang tersedia.
4. Simpan perubahan.

Profil lembaga dipakai sebagai identitas pada bagian aplikasi yang membutuhkan data lembaga, termasuk raport.

## 3. Membuat Tahun Ajaran

1. Buka menu Pengaturan.
2. Pilih Tahun Ajaran.
3. Tambahkan tahun ajaran baru, misalnya `2026/2027`.
4. Tandai sebagai aktif jika tahun tersebut sedang digunakan.
5. Simpan.

Pastikan hanya tahun ajaran yang benar-benar berjalan yang dijadikan acuan input data.

## 4. Membuat Semester

1. Buka menu Pengaturan.
2. Pilih Semester.
3. Tambahkan semester, misalnya `Ganjil` atau `Genap`.
4. Hubungkan dengan tahun ajaran yang sesuai.
5. Tandai aktif jika semester tersebut sedang berjalan.
6. Simpan.

Semester aktif membantu admin dan guru mencatat nilai pada periode yang benar.

## 5. Menambah Kelas / Marhalah

1. Buka menu Kelas / Marhalah.
2. Klik tambah data.
3. Isi nama kelas atau marhalah.
4. Simpan.

Gunakan penamaan yang konsisten, misalnya `Marhalah 1`, `Marhalah 2`, atau format lain yang sudah dipakai pondok.

## 6. Menambah Mata Pelajaran

1. Buka menu Mata Pelajaran.
2. Klik tambah data.
3. Isi nama mata pelajaran.
4. Simpan.

Pastikan nama mata pelajaran tidak dibuat ganda agar input nilai lebih rapi.

## 7. Menambah Santri

1. Buka menu Santri.
2. Klik tambah santri.
3. Isi data santri sesuai form yang tersedia.
4. Pilih kelas atau marhalah yang benar.
5. Simpan.

Setelah tersimpan, data santri dapat dilihat di daftar santri dan digunakan untuk input nilai, raport, dan SPP.

## 8. Input Nilai

1. Buka menu Input Nilai.
2. Pilih santri yang akan diisi nilainya.
3. Pilih mata pelajaran, tahun ajaran, dan semester sesuai kebutuhan.
4. Isi nilai pada kolom yang tersedia.
5. Simpan.

Periksa kembali nama santri, semester, dan mata pelajaran sebelum menyimpan agar nilai tidak masuk ke periode yang salah.

## 9. Melihat dan Mencetak Raport

1. Buka menu Raport.
2. Pilih santri yang akan dilihat raportnya.
3. Periksa data santri, nilai, dan informasi lembaga.
4. Gunakan tombol print untuk mencetak.
5. Atur kertas ke ukuran A4 pada dialog print browser.

Sebelum pembagian raport, lakukan pengecekan manual untuk beberapa santri sebagai contoh.

## 10. Menambah Guru

1. Buka menu Guru.
2. Klik tambah data guru.
3. Isi nama guru dan data lain yang tersedia.
4. Simpan.

Data guru digunakan untuk absensi guru dan kebutuhan administrasi internal.

## 11. Mengisi Absensi Guru

1. Buka menu Absensi Guru.
2. Pilih guru.
3. Pilih tanggal absensi.
4. Isi status kehadiran.
5. Simpan.

Hindari input dobel untuk guru dan tanggal yang sama.

## 12. Membuat Tagihan SPP

1. Buka menu SPP.
2. Pilih bagian Tagihan.
3. Tambahkan tagihan untuk santri yang sesuai.
4. Isi periode dan nominal tagihan.
5. Simpan.

Pastikan periode tagihan jelas, misalnya bulan dan tahun pembayaran.

## 13. Input Pembayaran SPP

1. Buka menu SPP.
2. Pilih Pembayaran.
3. Pilih santri atau tagihan yang akan dibayar.
4. Isi nominal pembayaran.
5. Simpan.

Jika pembayaran belum penuh, status tagihan akan mengikuti nominal yang sudah masuk. Jika sudah lunas, pastikan status berubah menjadi lunas.

## 14. Melihat Rekap Tunggakan

1. Buka menu SPP.
2. Pilih Rekap Tunggakan.
3. Periksa daftar santri yang masih memiliki tunggakan.
4. Gunakan filter jika tersedia untuk mempersempit data.

Rekap tunggakan membantu bendahara menindaklanjuti pembayaran yang belum selesai.

## 15. Export CSV

1. Buka halaman SPP yang menyediakan tombol export CSV.
2. Klik tombol export.
3. Simpan file CSV di komputer.
4. Buka file menggunakan spreadsheet jika perlu.

File CSV dapat dipakai untuk arsip atau rekap manual. Jangan sebarkan file ini karena berisi data internal.

## 16. Mengirim Pengingat SPP via WhatsApp

1. Buka menu SPP.
2. Pilih Pengingat.
3. Periksa daftar santri dan nominal tunggakan.
4. Klik tombol WhatsApp pada data yang ingin diingatkan.
5. Aplikasi akan membuka WhatsApp dengan pesan yang sudah disiapkan.
6. Periksa isi pesan sebelum dikirim.

Pengingat ini bersifat manual. Aplikasi tidak mengirim pesan otomatis.

## 17. Membuat Profil Pengguna Admin, Guru, dan Bendahara

Akun login dibuat terlebih dahulu di Supabase Authentication. Setelah akun dibuat, admin atau pengelola teknis perlu membuat profil aplikasi di tabel `profiles`.

1. Buka Supabase Dashboard.
2. Masuk ke Authentication.
3. Buat user dengan email dan password.
4. Salin User ID dari user tersebut.
5. Buka aplikasi sebagai admin.
6. Masuk ke Pengaturan.
7. Pilih Pengguna.
8. Tambahkan profil dengan User ID, nama lengkap, dan role.

Role yang tersedia:

- `admin`: akses semua menu.
- `guru`: akses data santri, nilai, raport, guru, absensi guru, dan profil sendiri.
- `bendahara`: akses data santri, SPP, dan profil sendiri.

Pastikan role dipilih sesuai tugas pengguna agar menu yang muncul sesuai kebutuhan.
