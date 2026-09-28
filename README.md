# Mr. Coffee

Website kedai kopi responsif yang dibuat menggunakan HTML, CSS, dan JavaScript tanpa framework. Proyek ini menampilkan katalog menu dan simulasi alur pemesanan dari pemilihan produk sampai konfirmasi order.

## Fitur

- Lima halaman: Home, Menu, Order, Rewards, dan About Us.
- Katalog 16 produk dalam empat kategori: Iced Coffee, Hot Coffee, Latte, dan Pastry.
- Pop-up detail menu dengan foto, deskripsi, pengaturan jumlah, dan subtotal.
- Keranjang yang tersimpan di `localStorage`, termasuk perubahan jumlah, penghapusan item, dan perhitungan total otomatis.
- Formulir pemesan dengan validasi, pop-up tinjauan order, dan konfirmasi selesai.
- Keranjang dikosongkan setelah konfirmasi berhasil.
- Navigasi responsif dan dialog yang dapat digunakan melalui keyboard.
- Foto hero memenuhi kolomnya; foto produk mempertahankan proporsinya.

## Menjalankan secara lokal

Tidak diperlukan instalasi dependency atau proses build.

Dari direktori proyek, jalankan server lokal dengan Python:

```sh
python -m http.server 5500 --bind 127.0.0.1 --directory HTML
```

Lalu buka [halaman Home](http://127.0.0.1:5500/homePage.html).

Alternatif: gunakan ekstensi Live Server di editor untuk membuka `HTML/homePage.html`.

## Struktur proyek

```text
HTML/
  homePage.html       # Halaman utama
  menuPage.html       # Katalog dan dialog pemilihan menu
  orderPage.html      # Keranjang dan simulasi pemesanan
  rewardsPage.html    # Promo dan rewards
  aboutUsPage.html    # Cerita, visi, misi, dan profil pendiri
  shared.css         # Gaya bersama dan layout responsif
  shared.js          # Katalog, penyimpanan keranjang, navigasi, dan dialog
  style*.css         # Gaya masing-masing halaman
  script*.js         # Interaksi masing-masing halaman
  Image/             # Aset gambar lokal
```

Harga produk dan data katalog didefinisikan di `HTML/shared.js`. Data keranjang disimpan dengan kunci `orders` pada browser pengguna.

## Batasan demo

Pemesanan merupakan simulasi frontend. Proyek belum memiliki backend, akun pelanggan, pemrosesan pembayaran, atau pengiriman pesanan ke toko. Data keranjang hanya tersimpan pada browser dan origin yang digunakan, bukan tersinkronisasi antarperangkat. Formulir pemesan tidak dikirim ke server.

## Pemeriksaan manual

1. Pilih kategori dan buka detail menu.
2. Ubah jumlah dan pastikan subtotal sesuai.
3. Tambahkan produk, buka Order, lalu ubah jumlah atau hapus item.
4. Isi data pemesan, tinjau detail, lalu konfirmasi.
5. Pastikan keranjang kosong setelah konfirmasi dan tetap kosong setelah refresh.
6. Periksa navigasi dan foto pada ukuran desktop serta ponsel.
