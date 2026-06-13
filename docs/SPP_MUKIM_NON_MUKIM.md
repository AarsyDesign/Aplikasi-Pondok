# SPP Mukim dan Non Mukim

Dokumen ini menjelaskan cara memakai pengaturan SPP untuk santri mukim dan non mukim pada v1.0.

## Perbedaan Status Santri

- `Mukim`: santri tinggal di pondok, sehingga nominal SPP dapat mencakup asrama, makan, dan komponen lain.
- `Non Mukim`: santri tidak tinggal di pondok, sehingga nominal SPP dapat lebih kecil sesuai komponen yang berlaku.

Data lama yang belum memiliki status akan dianggap `Non Mukim`.

## Cara Mengatur Nominal SPP

Buka menu:

```text
SPP > Pengaturan SPP
```

Isi:

- Tahun Ajaran
- Kelas / Marhalah, atau pilih Semua kelas
- Status Santri: Semua, Mukim, atau Non Mukim
- Nominal
- Tanggal Tagihan, angka 1 sampai 28
- Status Aktif
- Catatan bila perlu

## Prioritas Nominal

Saat generate tagihan, aplikasi mencari nominal dengan urutan:

1. Kelas santri + status santri + tahun ajaran aktif.
2. Semua kelas + status santri + tahun ajaran aktif.
3. Kelas santri + semua status + tahun ajaran aktif.
4. Semua kelas + semua status + tahun ajaran aktif.
5. Jika tidak ada, tagihan santri tersebut dilewati dan ditandai nominal belum diatur.

## Generate Tagihan Bulanan

Buka menu:

```text
SPP > Generate Tagihan
```

Pilih tahun ajaran, bulan, dan tahun. Klik Preview untuk melihat:

- Nama santri
- NIS
- Kelas / Marhalah
- Status santri
- Nominal SPP
- Tanggal tagihan
- Status preview
- Keterangan

Klik Generate Tagihan untuk membuat tagihan yang statusnya `Akan Dibuat`.

Aplikasi tidak membuat tagihan dobel untuk kombinasi santri + bulan + tahun yang sudah ada.

## Rekap dan Export

Di menu:

```text
SPP > Rekap Tunggakan
```

Gunakan filter Status Santri untuk melihat Semua, Mukim, atau Non Mukim. Kolom Status Santri juga ikut tampil di tabel dan file CSV.

## Catatan v1.0

Generate otomatis tanggal 10 belum diaktifkan. Pada v1.0, generate tagihan masih dilakukan manual dari halaman Generate Tagihan.
