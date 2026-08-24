# Data Architecture & Persistence Strategy: Jastip Kampus

Diagram sederhana relasi antar entitas (Virtual ERD):
![Diagram ERD Jastip Kampus](ERD.png)

[booking-service DB] ----> (Referencing Store ID) ----> [catalog-service DB]
       |
       +--------> (Event-driven ID reference) ----> [session-service DB]
       |
       +--------> (Event-driven Order ID) ----> [billing-service DB]

## Ringkasan Strategi Data
Dokumen ini menguraikan arsitektur basis data dan strategi persistensi untuk sistem Jastip Kampus (melengkapi dokumen ARSITEKTUR.md). Mengingat sifat transaksi yang sangat konkuren (berebut jastiper saat jam makan siang) dan kondisi jaringan mobile yang fluktuatif, lapisan data dirancang untuk mengutamakan **Konsistensi Kuat (Strong Consistency)** pada area kritikal, serta ketahanan mutlak terhadap *race condition*.

Tantangan data utama:
- Pesanan ganda akibat sinyal mobile terputus (retry client).
- *Overselling* atau tumpang tindih pesanan (*overlap*) saat jastiper diperebutkan.
- Penurunan performa server pada pengambilan daftar riwayat pesanan yang terus membesar.

Tujuan lapisan data:
- Menerapkan *Database-per-Service* (PostgreSQL) agar setiap domain independen.
- Menjamin *Idempotency* murni di tingkat skema basis data.
- Menghindari *Read-Modify-Write* dengan memanfaatkan transaksi atomik.
- Menerapkan *Keyset Pagination* untuk pembacaan data yang stabil O(1).

## Scope Persistensi (In Scope)
- Skema isolasi per service menggunakan PostgreSQL v16 (via Docker).
- Manajemen versi skema menggunakan *Forward-Only Migration* (.sql scripts).
- *Constraint* level basis data (UNIQUE, CHECK) untuk validasi data mutlak.
- Atomisitas *query* untuk mencegah *Race Condition* (`UPDATE ... RETURNING`).
- Paginasi *keyset* berbasis *timestamp* atau rentang urutan.

## Skema dan Entitas Utama per Service

### 1. catalog_db (Milik station-service)
Menyimpan referensi statis dan katalog barang. Membutuhkan performa baca (Read) yang sangat tinggi.
- `stores` (id PK, name, faculty_location, status)
- `catalog_items` (id PK, store_id FK, name, price, stock, is_available)
  - *Index:* `idx_store_items` pada `(store_id, is_available)`
- `tariffs` (id PK, origin, destination, delivery_fee)

### 2. order_db (Milik booking-service) - *Kritikal Konkurensi*
Menyimpan transaksi pemesanan dan antrean.
- `orders` (id PK, idempotency_key UNIQUE, buyer_id, jastiper_id, store_id, scheduled_time, status, created_at)
  - *Constraint:* `idempotency_key` wajib ada untuk mencegah *double-insert*.
  - *Index:* `idx_orders_keyset` pada `(buyer_id, created_at DESC)` untuk memfasilitasi *keyset pagination*.
- `waitlists` (id PK, store_id, requested_time, queue_number, status)

### 3. session_db (Milik session-service)
Mencatat log pergerakan jastiper secara *real-time*. Data akan sangat masif.
- `sessions` (id PK, order_id, jastiper_id, current_location, status, created_at, updated_at)

### 4. billing_db (Milik billing-service)
Sumber kebenaran absolut (*Single Source of Truth*) untuk urusan finansial.
- `invoices` (id PK, order_id UNIQUE, amount, tax, status)
- `payments` (id PK, invoice_id FK, method, status, paid_at)

## Mekanisme Ketahanan & Integritas Data

### 1. Idempotensi untuk Jaringan Buruk (Lapisan 3)
Aplikasi mobile sering mengirim *request* berulang (`retry`) saat jaringan kampus buruk. 
- **Penerapan:** Kolom `idempotency_key TEXT UNIQUE` di tabel `orders`.
- **Eksekusi SQL Backend:** 
  ```sql
  INSERT INTO orders (idempotency_key, buyer_id, store_id, qty) 
  VALUES ($1, $2, $3, $4) 
  ON CONFLICT (idempotency_key) DO NOTHING RETURNING *;