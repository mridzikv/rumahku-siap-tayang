Rumahku, Bagian dan Fungsinya
Media pembelajaran interaktif - Pendidikan Pancasila Fase A, Kelas 1 SD

CARA MENAYANGKAN
1. Buka netlify.com/drop atau pages.cloudflare.com
2. Seret SELURUH folder ini (index.html beserta folder aset) ke sana
3. Salin URL yang muncul. Itu tautan yang disetorkan ke panitia
Jangan unggah ke Google Drive. Drive tidak melayani hosting HTML,
berkasnya akan terunduh, bukan terbuka.

ISI
  index.html          media, satu berkas, tanpa kerangka kerja
  aset/*.webp         gambar yang dipakai (total 681 KB)
  aset/*.png          cadangan tanpa kompresi berlebih
  aset/olah-aset.py   skrip pemotong dan pengoreksi warna

KALAU GAMBAR RUMAH DIGANTI
Koordinat delapan area ketuk ditulis dalam persen di index.html,
pada baris berawalan <button class="zona". Angka --l --t --w --h
diukur dari berkas rumah-potongan lama. Ganti gambarnya, ukur ulang
angkanya, atau semua area ketuk akan meleset.

MENGISI DATA PROFIL DAN PUSTAKA
Buka index.html dengan Notepad atau editor teks. Cari blok bertanda
"DATA PROFIL" di bagian atas <script>, sekitar baris 700. Ganti isi
tanda kutip. Semua penanda [[...]] adalah tempat yang harus diisi.

Nama, instansi, dan foto sudah terisi. Yang masih kosong:

  surel       alamat surel yang mau ditampilkan
  keterangan  keterangan tambahan, boleh dikosongkan

PUSTAKA_TAMBAHAN berisi tiga baris rujukan. Rujukan pertama
(Kepmen BSKAP 032/H/KR/2024) sudah terpasang dan tidak perlu diubah.
Baris kedua disediakan untuk penulis naskah materi asli. Isi dengan
nama penulisnya, jangan dikosongkan.

KETERANGAN_ASET diisi setelah panitia menjawab pertanyaan soal
ilustrasi hasil AI. Jangan dibiarkan kosong saat dikumpulkan.

LOGO
logo-tutwuri dan logo-pgri tampil di layar sampul dan di halaman
Profil Pengembang. Keduanya lambang resmi, jangan diubah warnanya,
diregangkan, atau ditempeli apa pun.

YANG BELUM SELESAI
- Narasi memakai Web Speech API. Suara id-ID tidak ada di semua
  perangkat. Ganti dengan rekaman suara guru untuk hasil terbaik.
- rumah-adat.webp bentuk atapnya terlalu melengkung, terbaca seperti
  kelenteng. Kajang Lako aslinya rendah dan memanjang. Sebaiknya
  digenerate ulang dengan foto acuan.
- Tanyakan ke panitia apakah ilustrasi hasil AI diperbolehkan.

DEPLOY DI GITHUB PAGES
Berkas .nojekyll sudah disertakan. Jangan dihapus.
1. Buat repo baru, publik. Nama repo jadi bagian URL.
2. Unggah SELURUH isi folder ini ke akar repo, bukan ke dalam subfolder.
   index.html harus berada di akar.
3. Settings > Pages > Source: Deploy from a branch > main > / (root) > Save
4. Tunggu 1 sampai 10 menit. URL muncul di halaman yang sama.
   Bentuknya https://NAMA-AKUN.github.io/NAMA-REPO/
5. Buka URL itu di jendela penyamaran untuk memastikan benar-benar publik.

CATATAN PENTING
- GitHub Pages membedakan huruf besar dan kecil. Di Windows ikon-Dapur.png
  dan ikon-dapur.png dianggap sama, di server tidak. Jangan ubah nama berkas.
- Repo harus tetap publik sampai 28 November. Kalau diubah jadi private,
  tautan mati dan panitia tidak bisa membuka karyamu.
- Siapkan cermin cadangan di Netlify Drop dengan isi yang sama persis.
