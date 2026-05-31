DOKUMEN PERSYARATAN PRODUK APLIKASI KELULUSAN MTSN 11 TASIKMALAYA

1. RINGKASAN PROYEK
Anda membangun portal pencarian Surat Keterangan Lulus. Siswa memasukkan Nomor Induk Siswa Nasional untuk melihat hasil kelulusan. Sistem memberikan tautan unduh dokumen Google Drive secara instan.
2. TARGET PENGGUNA
Siswa Kelas Sembilan. Siswa mengakses hasil kelulusan tanpa proses pendaftaran.
Administrator Sekolah. Anda mengelola data siswa dan tautan dokumen melalui panel khusus.
3. SPESIFIKASI ANTARMUKA DAN ANIMASI
Anda menerapkan gaya desain datar pada seluruh elemen visual.
Anda menyusun tata letak antarmuka dengan proporsi yang seimbang.
Sistem memunculkan kotak pencarian dengan animasi mengambang dari bawah ke tengah layar.
Tombol pencarian menampilkan efek transisi warna saat kursor mendekat.
Sistem menampilkan ikon pemuatan berputar saat memverifikasi data di database.
Kartu hasil kelulusan muncul menggunakan animasi membesar yang halus.
Sistem menyorot tombol unduh dengan animasi denyut lambat untuk menarik perhatian siswa.
4. ALUR PENGGUNA
4.1 PENGGUNA SISWA
Siswa membuka alamat website aplikasi.
Siswa melihat antarmuka pencarian utama.
Siswa memasukkan nomor induk ke dalam kolom teks.
Siswa menekan tombol cari data.
Sistem memvalidasi nomor pada Firebase Firestore.
Sistem menampilkan nama siswa dan status kelulusan.
Siswa menekan tombol unduh.
Browser membuka tab baru menuju file PDF di Google Drive.

4.2 PENGGUNA ADMINISTRATOR
Anda membuka halaman login admin.
Anda memasukkan email dan kata sandi.
Firebase Authentication memverifikasi kredensial Anda.
Sistem mengarahkan Anda ke dasbor utama.
Anda memasukkan nomor induk dan nama siswa.
Anda menempelkan tautan Google Drive pada kolom yang tersedia.
Anda menekan tombol simpan untuk mengirim data ke Firestore.

5. TUMPUKAN TEKNOLOGI
Kerangka Kerja Frontend: React atau Next.js
Penataan Gaya: Tailwind CSS
Pustaka Animasi: Framer Motion
Penyimpanan Data: Firebase Firestore
Sistem Keamanan: Firebase Authentication
Server Hosting: Netlify
Penyimpanan Dokumen: Google Drive
6. STRUKTUR DATABASE FIRESTORE
Anda menggunakan satu koleksi utama bernama siswa.
Tipe Data Nomor Induk: Teks
Tipe Data Nama: Teks
Tipe Data Status Lulus: Boolean
Tipe Data Tautan Drive: Teks