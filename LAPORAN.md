# Laporan Proyek Terpadu — Squad Kelompok 15 · Tema Jastip Kampus

## 1. Ringkasan Produk

Jastip Kampus adalah sistem pemesanan jasa titip makanan kampus untuk mahasiswa yang ingin memesan barang rebutan pada jam sibuk tanpa harus datang langsung ke kantin. Sumber daya rebutan inti pada sistem ini adalah stok atau kuota item jastip yang sama-sama diperebutkan banyak request pada waktu hampir bersamaan, sehingga bukti anti-oversell menjadi fokus utama pengujian.

## 2. Lapisan 1 — Microservices

Daftar layanan dan tanggung jawabnya:

- `catalog-service`: menyimpan item, harga, dan sisa kuota jastip per item.
- `order-service`: memvalidasi input, mengambil detail item dari catalog, memesan stok atomik, lalu membuat order.
- `notification-service`: berlangganan event `order.created` dari Redis dan mencetak notifikasi.
- `redis`: event bus ringan untuk distribusi event order.

Endpoint kritis:

- `GET /health`
- `GET /items`
- `GET /items/{id}`
- `POST /items/{id}/ambil`
- `POST /orders`

Artefak lapisan ini:

- Spesifikasi API: `openapi.yaml`
- Bootstrap layanan: `docker-compose.yml`

Hasil smoke test terminal:

- `GET /health` membalas `200`
- `POST /orders` valid membalas `201`
- `POST /orders` tanpa `qty` membalas `400`
- `POST /orders` untuk item yang tidak ada membalas `404`
- validasi containerized dengan `docker compose up -d --build --wait` juga lulus untuk empat cek yang sama

Ringkasan run `node --test`:

- `tests 5`
- `pass 5`
- `fail 0`

## 3. Lapisan 2 — Scalable

Titik macet dan risiko yang ditemukan:

- jalur `POST /orders` memegang sumber daya rebutan yang sama untuk semua pembeli
- sebelum perbaikan, kegagalan Redis dapat membuat API membalas `500` walau stok sudah terpotong
- tanpa uji rebutan serentak, klaim anti-oversell tidak punya bukti

Perbaikan yang dilakukan:

- `catalog-service` memakai `UPDATE ... WHERE sisa > 0` agar pengurangan stok atomik
- `order-service` membuat publish event Redis menjadi best-effort agar outage event bus tidak membatalkan order sah
- suite `node:test` ditambah untuk smoke test dan uji rebutan terminal
- harness QA terisolasi dipakai agar hasil test dapat diulang tanpa merusak database lokal utama

Tabel sebelum → sesudah:

| Perubahan | Perintah | p95 | Throughput | Error |
| --- | --- | --- | --- | --- |
| baseline historis tidak terekam dengan perintah identik | belum tersedia | belum tersedia | belum tersedia | belum tersedia |
| kondisi sekarang setelah perbaikan | `npm run loadtest` | `348.38 ms` | `323.98 req/s` | `0% 5xx`, `150` respons `409` yang valid |

Catatan kejujuran pengukuran:

- repo ini belum menyimpan baseline beban sebelum perubahan backend dengan perintah yang sama persis
- karena itu kolom baseline sengaja tidak diisi angka perkiraan
- angka yang dicantumkan hanya berasal dari artefak nyata `artifacts/loadtest/latest.json`

Bukti sumber daya rebutan tidak jebol:

- hasil uji rebutan terminal: `stokAwal=50 sukses=50 ditolak=150 sisa=0`
- hasil uji rebutan berbasis Docker setelah smoke test: `stokAwal=49 sukses=49 ditolak=151 sisa=0`
- asersi `successEqualsStockConsumed = true`
- asersi `stockNeverNegative = true`
- asersi `onlyExpectedStatuses = true`

Interpretasi:

- tepat `50` order berhasil karena stok awal memang `50`
- `150` request sisanya ditolak `409`, yang berarti sistem menolak saat habis, bukan oversell
- tidak ada stok negatif dan tidak ada order sukses melebihi stok awal

Kesimpulan lapisan scalable:

- jalur order sudah stabil pada uji terminal dan load test terbaru
- throughput terbaru mencapai `323.98 req/s`
- latensi ekor `p95` turun ke `348.38 ms` dan `p99` ke `411.67 ms`
- bukti rebutan tetap konsisten: hanya stok yang tersedia yang berhasil terjual

## 4. Lapisan 3 — Mobile

Artefak mobile native belum tersedia pada repo ini. Yang tersedia saat ini adalah portal React responsif untuk dashboard, landing page, dan simulasi data. Karena tidak ada APK, service worker offline, atau rekaman demo mobile di repo saat pengujian dilakukan, bagian ini dicatat apa adanya sebagai gap artefak tim yang masih perlu dilengkapi.

Status saat ini:

- layar utama tersedia dalam bentuk web responsif
- kemampuan offline belum dibuktikan pada repo ini
- tautan APK belum tersedia
- rekaman demo ujung-ke-ujung belum tersedia

## 5. Pelajaran & Pembagian Peran

Perubahan dari rencana:

- fokus QA bergeser dari sekadar cek endpoint ke pembuktian anti-oversell dan konsistensi saat dependency Redis bermasalah
- docker compose ditambahkan agar pengujian terminal punya jalur start yang konsisten
- laporan akhir menolak mengarang baseline yang tidak pernah diukur

Kontribusi tiap peran:

- arsitek: memecah domain menjadi layanan catalog, order, notification, dan event bus
- backend: membangun endpoint `POST /orders` dan integrasi HTTP antar layanan
- devops: menyediakan bootstrap layanan dan jalur eksekusi terminal yang seragam
- data: memastikan pengurangan stok atomik agar tidak oversell
- qa: menulis smoke test, uji rebutan, load test, dan menyusun artefak bukti

## 6. Kesimpulan

Berdasarkan seluruh pengujian yang dijalankan, sistem Jastip Kampus telah memenuhi tiga hal utama yang menjadi fokus QA. Pertama, jalur kritis microservices berjalan benar karena `GET /health`, `POST /orders` valid, validasi input salah, dan kasus item tidak ditemukan semuanya mengembalikan kode status yang sesuai. Kedua, pada pengujian beban sistem mampu memproses `323.98 req/s` dengan latensi `p95 348.38 ms` dan tanpa `5xx`, sehingga performa saat beban sedang tetap terukur dengan baik. Ketiga, uji rebutan membuktikan tidak ada oversell: hanya `50` order yang berhasil sesuai stok awal, `150` sisanya ditolak `409`, dan stok akhir tetap `0` tanpa pernah menjadi negatif. Dengan demikian, klaim bahwa sistem aman terhadap perebutan stok dan cukup stabil untuk skenario uji yang dijalankan sudah didukung oleh angka yang dapat diulang.

## 7. Lampiran

Perintah uji yang persis:

```bash
npm run test:services
npm run qa:smoke
npm run loadtest
docker compose up -d --build --wait
BASE=http://127.0.0.1:8080 node --test tests/smoke.test.js
BASE=http://127.0.0.1:8080 CATALOG_BASE=http://127.0.0.1:3001 node --test tests/rebutan.test.js
```

Spesifikasi mesin uji:

- `nproc`: `2`
- RAM: `7.8 GiB`

Artefak hasil:

- `artifacts/qa/smoke-result.json`
- `artifacts/loadtest/latest.json`