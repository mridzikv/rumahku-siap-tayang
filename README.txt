RUMAHKU, BAGIAN DAN FUNGSINYA (versi game)
Media pembelajaran Pendidikan Pancasila, Fase A, kelas 1 SD

ISI FOLDER
  index.html      seluruh game dalam satu berkas
  aset/           42 gambar WebP, total sekitar 1,8 MB
                  (900 KB di antaranya animasi Bina di layar pembuka)
  aset/suara/     suara Bina hasil rekaman (MP3) dan daftar.js
  alat/           skrip pengolah video Bina. Tidak dipakai saat game berjalan,
                  tidak perlu ikut diunggah.
  .nojekyll       wajib ikut kalau ditayangkan di GitHub Pages

CARA MENAYANGKAN ULANG DI CLOUDFLARE
1. Buka dashboard Cloudflare, masuk ke Worker yang sudah ada.
2. Unggah ulang SELURUH isi folder ini (index.html, folder aset, .nojekyll).
   index.html harus berada di akar, bukan di dalam subfolder.
3. Buka tautannya di jendela penyamaran untuk memastikan versi baru yang tampil.
Hapus folder aset yang lama sebelum mengunggah. Nama berkas gambar sudah berubah.

SUARA BINA
Bina bicara dengan dua cara:
  1. Rekaman manusia, kalau kalimatnya ada di aset/suara/daftar.js.
  2. Suara bawaan perangkat, untuk kalimat yang belum direkam.
Saat ini daftar.js masih kosong, jadi semua kalimat memakai suara bawaan.
Cara mengisinya:
  - Buka studio-suara.html (paket terpisah: studio-suara-bina.zip) di laptop.
  - Rekam kalimat-kalimatnya, lalu klik "Unduh paket suara".
  - Ekstrak suara-bina.zip ke folder ini (yang berisi index.html), pilih timpa.
  - Unggah ulang folder aset/suara ke Cloudflare.
Panduan lengkap dan seluruh naskah ada di "Naskah Rekaman Suara Bina.docx".
Rekaman tetap diputar walaupun index.html dibuka langsung dari flashdisk.

ANIMASI BINA DI LAYAR PEMBUKA
  aset/bina-lambai-gerak.webp  Bina melambai, 3,5 detik berulang, 12 gambar per detik
  aset/bina-lambai-diam.webp   gambar diam, tampil kalau perangkat diatur
                               "kurangi gerakan"
Dibuat dari video Girl_waving_and_greeting_viewer (10 detik) dengan
alat/olah-video-bina.py. Latar video yang hitam-putih dibuang, lalu dipakai
potongan detik 1,3 sampai 4,8 karena ujung dan awalnya hampir sama, jadi
sambungan loop tidak terlihat. Video aslinya tidak disimpan di folder ini.
Cara membuat ulang ada di bagian atas skrip itu.
Kalau berkas animasi gagal dimuat (belum terunggah, atau ditolak hosting),
layar pembuka otomatis memakai gambar Bina biasa (bina-lambai-badan.webp dan
bina-lambai-lengan.webp). Jadi kalau Bina di layar pembuka tampil diam dengan
jepit di kanan, berarti animasinya tidak sampai ke peramban.
Yang perlu diketahui:
  - Di video, jepit rambut Bina ada di kiri. Di semua gambar Bina yang lain
    jepitnya di kanan. Saat Mulai diketuk, Bina terbang ke panel kiri dan
    berganti ke gambar biasa, jadi jepitnya pindah sisi. Perbaikannya harus
    dari video: buat ulang dengan jepit di kanan.
  - Video memotong ujung jari saat tangan melambai paling jauh, juga sisi
    kanan rambut. Bagian yang terpotong itu dibulatkan oleh skrip, bukan
    gambar asli. Kalau membuat video baru, sisakan ruang kosong di kiri-kanan.
  - Gambar animasi sedikit lebih lebar dari kotak Bina (lihat
    ".pb-tokoh .lambai img" di index.html). Kalau ukuran gambar berubah,
    angka di situ ikut diubah.

YANG MASIH HARUS DIISI
Buka index.html dengan Notepad, cari tulisan "DATA YANG BOLEH DIUBAH GURU"
di bagian atas <script>.
  surel            alamat surel di halaman profil (kosong = baris disembunyikan)
  PUSTAKA_TAMBAHAN rujukan tambahan, satu baris satu rujukan.
                   Isi nama penulis naskah materi asli di sini.
  KETERANGAN_ASET  asal ilustrasi. Isi setelah panitia menjawab soal
                   ilustrasi hasil AI. Kosong = bagian disembunyikan.

STRUKTUR GAME
  Layar pembuka    Bina melambai (animasi dari video) dan tombol Mulai.
                   Ketukan pertama ini juga yang membuka suara di peramban.
  Beranda          judul, rumah dua tinta, tombol mulai, tautan untuk guru
  Peta Misi        5 misi + Ujian Kunci, semua bisa dibuka tanpa urutan
  Misi 1           Jelajah Rumah: ketuk 8 bagian rumah, lalu 5 tebakan
  Misi 2           Rapikan Barang: seret 6 barang ke ruangannya
  Misi 3           Rumah Teman: cocokkan cerita dengan 4 bentuk rumah
  Misi 4           Kerja Sama: bagi 6 pekerjaan ke 4 anggota keluarga
  Misi 5           Penjaga Rumah: pilah 6 perbuatan ke dua keranjang
  Ujian Kunci      8 soal bergambar, membuka sertifikat bernama
  Halaman guru     Petunjuk, Capaian dan Tujuan, Rangkuman, Daftar Pustaka,
                   Profil Pengembang

CATATAN TEKNIS
- Setiap barang bisa diseret ATAU diketuk lalu diketuk tujuannya.
  Cara kedua juga jalan dengan papan ketik (Tab lalu Enter).
- Kemajuan murid tersimpan di peramban perangkat yang dipakai saja.
  Hapus lewat Petunjuk > Hapus kemajuan.
- Tulisan di gelembung Bina selalu sama persis dengan yang diucapkan.
  Di perangkat tanpa suara, Bina tetap bicara lewat teks di gelembung.
- Game menunggu Bina selesai bicara sebelum pindah soal atau membuka
  jendela "misi selesai", jadi kalimat tidak terpotong.
- Koordinat ruangan di gambar rumah ditulis dalam persen di bagian
  ZONA dan DINDING. Kalau gambar rumah-potongan.webp diganti, angka itu
  harus diukur ulang.
