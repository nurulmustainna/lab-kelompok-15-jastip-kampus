# AI Log — Kelompok 15 (Jastip Kampus)

Dokumen ini mencatat interaksi dengan AI / GitHub Copilot selama pengerjaan proyek.

---

### Arsitek Sistem — Pertemuan 1

#### Entri 1
- **Konteks**: Membuat layanan katalog Express pertama (`services/catalog/index.js`).
- **Prompt**: "Buat server Express dengan GET /items (data di memori) dan GET /health yang membalas status ok."
- **Diterima**: Struktur dasar server Express, konfigurasi port 3001, serta handler untuk endpoint GET `/items` dan `/health`.
- **Ditolak & alasan**: AI sempat menyarankan menambahkan dependensi koneksi database (MongoDB/Mongoose) dan fungsi CRUD lengkap. Saya **HAPUS/TOLAK** saran tersebut karena Pertemuan 1 fokus pada data di memori. Menambah database di tahap ini hanya menambah kompleksitas sebelum waktunya.
- **Verifikasi**: Pengujian via terminal `curl.exe -s http://localhost:3001/health` membalas `{"status":"ok","service":"catalog"}` dan `/items` mengembalikan daftar barang ? Berhasil & Sesuai.

#### Entri 2
- **Konteks**: Membuat spesifikasi OpenAPI/Swagger (`openapi.yaml`).
- **Prompt**: "Buat kerangka OpenAPI 3.0 untuk API Jastip Kampus dengan endpoint GET /items dan GET /health."
- **Diterima**: Format skema YAML dengan versi `openapi: 3.0.3`, info metadata, dan daftar path `/items` serta `/health`.
- **Ditolak & alasan**: AI memberikan contoh skema dengan `tab` untuk indentasi dan mencantumkan port default `8080`. Saya **UBAH** indentasi menjadi 2 spasi konsisten dan mengubah URL server ke `http://localhost:3001` agar sesuai dengan *port* `catalog-service`.
- **Verifikasi**: Divalidasi di `editor.swagger.io` tanpa ada pesan error merah ? Berhasil & Sesuai.
