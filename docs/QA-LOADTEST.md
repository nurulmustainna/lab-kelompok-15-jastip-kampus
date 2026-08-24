# QA, Load-Test, dan Dokumentasi

Dokumen ini menyiapkan bukti yang bisa diulang untuk dua klaim paling penting di proyek ini:

1. `POST /orders` tetap benar saat dependency event bus bermasalah.
2. `POST /orders` tidak oversell saat direbut banyak request paralel.

## Cara Menjalankan

Jalankan dari root repo:

```bash
npm run test:services
npm run qa:smoke
npm run loadtest
```

Atau jalankan stack Docker lalu tembak test runner Node langsung dari terminal:

```bash
docker compose up -d --build --wait
BASE=http://127.0.0.1:8080 node --test tests/smoke.test.js
BASE=http://127.0.0.1:8080 CATALOG_BASE=http://127.0.0.1:3001 node --test tests/rebutan.test.js
```

Artefak hasil akan ditulis ke folder berikut:

- `artifacts/qa/smoke-result.json`
- `artifacts/loadtest/latest.json`

Kedua command memakai stack QA terisolasi:

- `catalog-service` dijalankan dengan database SQLite sementara.
- `order-service` dijalankan dengan `ENABLE_EVENTS=0` agar load test fokus ke anti-oversell, bukan ke ketersediaan Redis.
- Port QA default: `3101` untuk catalog dan `3102` untuk order.

## Skenario Smoke Test

Smoke test memverifikasi tiga kondisi minimal:

1. `GET /health` pada order membalas `200`.
2. `POST /orders` dengan `qty = 0` ditolak `400`.
3. `POST /orders` yang valid membalas `201` dan stok item turun tepat `1`.
4. `POST /orders` untuk `itemId` yang tidak ada ditolak `404`.

## Skenario Load Test

Load test bawaan mengirim:

- `200` request total
- konkurensi `40`
- target endpoint `POST /orders`
- payload tetap `{ "itemId": 1, "qty": 1 }`

Asersi yang harus lulus:

1. Jumlah `201` harus sama dengan stok yang benar-benar terpakai.
2. Tidak boleh ada stok negatif.
3. Status yang muncul hanya `201` atau `409`.

## Bukti Sebelum dan Sesudah

### Sebelum perbaikan `order-service`

Saat Redis tidak tersedia, satu request valid ke `POST /orders` menghasilkan dua fakta yang saling bertentangan:

- respons API `500`
- stok tetap berkurang `1`

Artinya sistem memberi sinyal gagal ke klien, padahal sumber daya rebutan sudah terpakai. Ini adalah bug konsistensi.

### Sesudah perbaikan `order-service`

Publisher Redis dibuat best-effort.

- jika Redis siap, event tetap dipublish
- jika Redis tidak siap, order yang sudah valid tetap membalas `201`

Perubahan ini menghilangkan false failure pada API tanpa membuka peluang oversell baru, karena pengurangan stok atomik tetap dijalankan di `catalog-service`.

## Membaca Hasil

File `artifacts/loadtest/latest.json` berisi angka yang perlu kamu salin ke laporan akhir:

- throughput (`throughputRps`)
- latency `p50`, `p95`, `p99`
- jumlah `201`
- jumlah `409`
- stok awal, stok akhir, dan stok terpakai

Jika `successEqualsStockConsumed`, `stockNeverNegative`, dan `onlyExpectedStatuses` semuanya `true`, maka klaim anti-oversell terbukti oleh angka, bukan asumsi.

## Hasil Run Terbaru

Run terakhir pada `2026-08-24` menghasilkan angka berikut:

### Smoke Test

- `GET /health`: lolos
- `POST /orders` dengan `qty = 0`: ditolak `400`
- `POST /orders` valid: lolos `201`
- stok item uji: `50 -> 49`

### Load Test

- total request: `200`
- concurrency: `40`
- hasil `201`: `50`
- hasil `409`: `150`
- throughput: `323.98 req/s`
- latency `p50`: `74.83 ms`
- latency `p95`: `348.38 ms`
- latency `p99`: `411.67 ms`
- stok: `50 -> 0`

Interpretasi:

- tepat `50` request berhasil karena stok awal memang `50`
- sisa `150` request ditolak dengan `409`, bukan membuat stok minus
- seluruh asersi load test bernilai `true`, jadi tidak ada oversell pada skenario rebutan ini
- dibanding run sebelumnya, hasil terbaru menunjukkan throughput naik dan ekor latensi `p95/p99` membaik

## Ringkasan Node Test

Run `npm run test:services` terakhir menghasilkan:

- `tests 5`
- `pass 5`
- `fail 0`

Artinya smoke test dan uji rebutan terminal sama-sama hijau pada jalur uji yang bisa diulang.

## Kalimat Kesimpulan

Berdasarkan hasil pengujian terminal, sistem Jastip Kampus telah memenuhi perilaku dasar microservices dan ketahanan pada sumber daya rebutan. Seluruh pengujian `node:test` lulus dengan `pass 5` dan `fail 0`, sementara load test menunjukkan throughput `323.98 req/s` dengan latensi `p95 348.38 ms` dan `p99 411.67 ms`. Pada skenario rebutan, tepat `50` request berhasil sesuai stok awal dan `150` request ditolak dengan `409`, sehingga sistem terbukti tidak mengalami oversell dan tetap mengembalikan respons yang benar saat kapasitas habis.