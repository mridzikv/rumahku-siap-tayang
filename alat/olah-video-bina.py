#!/usr/bin/env python3
"""Ubah video Bina melambai (MP4) jadi animasi transparan untuk layar pembuka.

Hasil (ditulis ke folder aset/):
  bina-lambai-gerak.webp   WebP animasi, berulang tanpa henti
  bina-lambai-diam.webp    frame pertama loop, untuk perangkat yang meminta gerak dikurangi

Pakai:
  python3 alat/olah-video-bina.py VIDEO.mp4
  python3 alat/olah-video-bina.py VIDEO.mp4 --cari-loop      (cari frame awal/akhir loop yang mulus)
  python3 alat/olah-video-bina.py VIDEO.mp4 --mulai 32 --akhir 116

Butuh ffmpeg, dan Python 3 dengan numpy, scipy, Pillow.

Catatan tentang video yang dipakai sekarang (1080x1920, 24 fps, 10 detik):
- Latarnya tidak transparan: sebagian hitam, sebagian putih, batasnya bergerak, dan ada
  garis putih tipis di sekeliling garis luar karakter. Skrip ini membuang semuanya.
- Frame 1 masih gambar asal (jepit rambut di kanan), mulai frame 2 jepit pindah ke kiri.
- Saat melambai, ujung jari keluar dari tepi kiri video; rambut kanan juga terpotong tepi.
  Potongan lurus itu ditutup dengan ujung bulat bergaris luar di kanvas yang diperlebar PAD.
  Karena itu gambar hasil lebih lebar dari kotak tokoh di index.html (lihat .pb-tokoh .lambai img).
- Frame 32 sampai 116 dipakai karena frame 116 hampir sama dengan frame 32, jadi sambungan
  loop tidak terlihat. Kalau videonya diganti, jalankan --cari-loop dan ukur ulang ZONA_CELAH.
"""
import argparse
import os
import subprocess
import sys
import tempfile
from multiprocessing import Pool

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAD = 64          # pelebaran kanvas kiri-kanan, piksel video asli
TINGGI = 880      # tinggi hasil, piksel (= tinggi maksimum Bina di layar pembuka)
LANGKAH = 2       # ambil tiap frame ke-2: 24 fps jadi 12 fps
KUALITAS = 75
KUALITAS_ALPHA = 50  # tepi alpha tetap halus, berkas ~25% lebih kecil
GARIS = np.array([44, 33, 25], np.uint8)  # warna garis luar karakter di video
# Celah latar yang tertutup tubuh (antara lengan kanan dan rok, antara jari) hanya dibuang
# di kotak ini, supaya pupil mata dan gigi yang warnanya mirip latar tetap utuh.
# (x0, y0, x1, y1) dalam piksel video asli 1080x1920.
ZONA_CELAH = [(740, 850, 1015, 1430), (0, 500, 300, 1010)]
EMPAT = ndi.generate_binary_structure(2, 1)


def cakram(r):
    y, x = np.ogrid[-r:r + 1, -r:r + 1]
    return (x * x + y * y) <= r * r


def gumpalan_terbesar(m):
    lab, n = ndi.label(m, structure=EMPAT)
    if n <= 1:
        return m
    ukuran = ndi.sum(m, lab, index=np.arange(1, n + 1))
    return lab == (int(np.argmax(ukuran)) + 1)


def ruas(kol, minimal=1):
    d = np.diff(np.concatenate([[0], kol.astype(np.int8), [0]]))
    awal, akhir = np.nonzero(d == 1)[0], np.nonzero(d == -1)[0] - 1
    return [(int(a), int(b)) for a, b in zip(awal, akhir) if b - a + 1 >= minimal]


def tutup_potongan(fg, rgb, pad, tebal=11.0):
    """Tutup potongan lurus di tepi video: satu ujung bulat per jari di kiri,
    satu lengkung rambut di kanan. Kanvas diperlebar pad piksel di kedua sisi."""
    H, W = fg.shape
    fg2 = np.zeros((H, W + 2 * pad), bool)
    fg2[:, pad:pad + W] = fg
    rgb2 = np.pad(rgb, ((0, 0), (pad, pad), (0, 0)), mode="edge")
    yy = np.arange(H)[:, None].astype(np.float32)
    jarak_kiri = (pad - np.arange(pad))[None, :].astype(np.float32) - 0.5
    jarak_kanan = (np.arange(pad) + 1)[None, :].astype(np.float32) - 0.5
    kiri, kanan = slice(0, pad), slice(pad + W, W + 2 * pad)

    # kiri: tangan yang melambai, jari dipisah lewat garis gelap di kolom tepi
    lum_tepi = rgb[:, 1:4].astype(np.float32).mean(axis=(1, 2))
    isi, cincin = [], []
    for y0, y1 in ruas(fg[:, 1], 6):
        kulit = ruas(lum_tepi[y0:y1 + 1] >= 90, 4)
        if not kulit:
            # baru garis luarnya yang menyentuh tepi: tutup dengan setengah lingkaran gelap seukurannya
            cincin.append(np.sqrt(jarak_kiri ** 2 + (yy - (y0 + y1) / 2.0) ** 2) <= (y1 - y0 + 1) / 2.0)
            continue
        for s0, s1 in kulit:
            s0 += y0
            s1 += y0
            r = min((s1 - s0 + 1) / 2.0 + tebal, pad - 6.0)
            rho = np.sqrt(jarak_kiri ** 2 + (yy - (s0 + s1) / 2.0) ** 2)
            warna = np.median(rgb[s0:s1 + 1, 1:4].reshape(-1, 3), axis=0).astype(np.uint8)
            isi.append((rho <= r - tebal, warna))
            cincin.append(rho <= r)
    blok_fg, blok_rgb = fg2[:, kiri], rgb2[:, kiri]
    for m in cincin:
        blok_fg |= m
        blok_rgb[m] = GARIS
    for m, w in isi:
        blok_rgb[m] = w
    for m in cincin:  # garis antar jari tetap terlihat
        blok_rgb[m & ~ndi.binary_erosion(m, structure=cakram(int(tebal)), border_value=1)] = GARIS

    # kanan: rambut, satu lengkung landai per potongan
    for y0, y1 in ruas(fg[:, W - 2], 6):
        b = (y1 - y0 + 1) / 2.0
        a = min(0.5 * b, pad - 8.0)
        m = np.sqrt((jarak_kanan / a) ** 2 + ((yy - (y0 + y1) / 2.0) / b) ** 2) <= 1.0
        fg2[:, kanan] |= m
        rgb2[:, kanan][m] = GARIS
    return fg2, rgb2


def buang_latar(rgb, pad=PAD, kikis=3, halus=1.1):
    """RGB 1080x1920 -> RGBA berlatar transparan, kanvas diperlebar pad."""
    a = rgb.astype(np.int16)
    mx, mn = a.max(axis=2), a.min(axis=2)
    sat, lum = mx - mn, a.mean(axis=2)
    terang = (mn >= 165) & (sat <= 34)
    mirip_latar = (mx <= 22) | terang | ((sat <= 13) & (lum < 200))

    # latar = piksel mirip-latar yang tersambung ke tepi bingkai
    lab, _ = ndi.label(mirip_latar, structure=EMPAT)
    tepi = np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])
    fg = ~np.isin(lab, np.unique(tepi[tepi > 0]))

    # celah latar yang tertutup tubuh, hanya di ZONA_CELAH
    lubang = fg & mirip_latar
    labh, nh = ndi.label(lubang, structure=EMPAT)
    if nh:
        idx = np.arange(1, nh + 1)
        uk = ndi.sum(lubang, labh, idx)
        murni = ndi.sum((mx <= 10) | terang, labh, idx)
        pusat = ndi.center_of_mass(lubang, labh, idx)
        pilih = [i + 1 for i in range(nh)
                 if uk[i] >= 25 and murni[i] >= 0.35 * uk[i]
                 and any(x0 <= pusat[i][1] <= x1 and y0 <= pusat[i][0] <= y1 for x0, y0, x1, y1 in ZONA_CELAH)]
        if pilih:
            fg &= ~ndi.binary_dilation(np.isin(labh, pilih), iterations=1)

    # bintik derau kompresi yang menempel di garis luar: tepi tubuh selalu garis cokelat tua,
    # jadi piksel di pita tepi yang warnanya jauh dari garis itu dibuang
    pita = fg & (ndi.distance_transform_edt(fg) <= 5)
    fg &= ~(pita & (np.abs(a - GARIS.astype(np.int16)).sum(axis=2) > 90))
    fg = gumpalan_terbesar(fg)
    buka = gumpalan_terbesar(ndi.binary_erosion(fg, structure=cakram(10), border_value=1))
    fg = gumpalan_terbesar(ndi.binary_dilation(buka, structure=cakram(10)) & fg)

    if pad:
        fg, rgb = tutup_potongan(fg, rgb, pad)

    # kikis sedikit ke dalam garis luar supaya sisa garis putih tidak ikut, lalu haluskan tepi
    inti = gumpalan_terbesar(ndi.binary_erosion(fg, structure=cakram(kikis)))
    alpha = np.clip(ndi.gaussian_filter(inti.astype(np.float32), sigma=halus), 0, 1)
    # warna piksel tepi = warna piksel inti terdekat, supaya tidak ada pinggiran terang
    _, (iy, ix) = ndi.distance_transform_edt(~inti, return_indices=True)
    return np.dstack([rgb[iy, ix], (alpha * 255 + .5).astype(np.uint8)])


def olah_satu(tugas):
    src, dst, tinggi = tugas
    im = Image.fromarray(buang_latar(np.asarray(Image.open(src).convert("RGB"))), "RGBA")
    if tinggi:
        lebar = round(im.size[0] * tinggi / im.size[1] / 2) * 2
        im = im.resize((lebar, tinggi), Image.LANCZOS)
    im.save(dst)
    return dst


def ambil_frame(video, folder, mulai, akhir):
    """Simpan frame mulai..akhir (nomor 1 = frame pertama video) sebagai PNG."""
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", video, "-an",
                    "-vf", f"select='between(n\\,{mulai - 1}\\,{akhir - 1})'", "-vsync", "0",
                    "-start_number", str(mulai), os.path.join(folder, "%03d.png")], check=True)


def cari_loop(folder, nomor, jarak_min=72):
    kecil = {}
    for f in nomor:
        a = np.asarray(Image.open(os.path.join(folder, f"{f:03d}.rgba.png")).resize((108, 192), Image.BOX)).astype(np.float32) / 255
        kecil[f] = np.dstack([a[..., :3] * a[..., 3:4], a[..., 3:4]]).ravel()
    keys = sorted(kecil)
    arr = np.stack([kecil[k] for k in keys])
    langkah = [np.abs(arr[i + 1] - arr[i]).mean() for i in range(len(keys) - 1)]
    print(f"selisih frame berurutan: median {np.median(langkah):.4f}")
    calon = []
    for i in range(len(keys)):
        for j in range(i + jarak_min, len(keys)):
            calon.append((float(np.abs(arr[j] - arr[i]).mean()), keys[i], keys[j]))
    calon.sort()
    dipakai = []
    for s, i, j in calon:
        if any(abs(i - a) < 6 and abs(j - b) < 6 for a, b in dipakai):
            continue
        dipakai.append((i, j))
        print(f"--mulai {i} --akhir {j - 1}   ({(j - i) / 24:.2f} detik)  lompatan {s:.4f}")
        if len(dipakai) >= 10:
            break
    print("Periksa wajahnya juga: mulut terbuka/tertutup tidak ikut terhitung banyak di angka ini.")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("video")
    p.add_argument("--mulai", type=int, default=32)
    p.add_argument("--akhir", type=int, default=116)
    p.add_argument("--cari-loop", action="store_true")
    p.add_argument("--keluar", default=os.path.join(AKAR, "aset"))
    arg = p.parse_args()

    with tempfile.TemporaryDirectory() as tmp:
        if arg.cari_loop:
            ambil_frame(arg.video, tmp, 2, 240)
            nomor = sorted(int(n[:3]) for n in os.listdir(tmp) if n.endswith(".png"))
            tugas = [(os.path.join(tmp, f"{f:03d}.png"), os.path.join(tmp, f"{f:03d}.rgba.png"), 0) for f in nomor]
            with Pool() as pool:
                pool.map(olah_satu, tugas)
            cari_loop(tmp, nomor)
            return

        ambil_frame(arg.video, tmp, arg.mulai, arg.akhir)
        nomor = list(range(arg.mulai, arg.akhir + 1, LANGKAH))
        tugas = [(os.path.join(tmp, f"{f:03d}.png"), os.path.join(tmp, f"{f:03d}.rgba.png"), TINGGI) for f in nomor]
        with Pool() as pool:
            pool.map(olah_satu, tugas)
        frames = [Image.open(t[1]).convert("RGBA") for t in tugas]

        gerak = os.path.join(arg.keluar, "bina-lambai-gerak.webp")
        diam = os.path.join(arg.keluar, "bina-lambai-diam.webp")
        frames[0].save(gerak, save_all=True, append_images=frames[1:], duration=round(1000 * LANGKAH / 24),
                       loop=0, quality=KUALITAS, alpha_quality=KUALITAS_ALPHA, method=6)
        frames[0].save(diam, quality=85, alpha_quality=100, method=6)
        for f in (gerak, diam):
            print(f"{os.path.relpath(f, AKAR)}  {os.path.getsize(f) / 1024:.0f} KB")
        print(f"{len(frames)} frame, {frames[0].size[0]}x{frames[0].size[1]} piksel")


if __name__ == "__main__":
    sys.exit(main())
