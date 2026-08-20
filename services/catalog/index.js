const express = require("express");
const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const app = express();
app.use(express.json());

// Menentukan lokasi database catalog.db agar otomatis dibuat di folder services/catalog/
const dbPath = path.join(__dirname, "catalog.db");
const db = new DatabaseSync(dbPath);

// Membuat tabel items jika belum ada
db.exec(`CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL,
  harga INTEGER NOT NULL,
  sisa INTEGER NOT NULL
)`);

// Isi data awal Jastip Kampus jika database masih kosong
const jumlah = db.prepare("SELECT COUNT(*) AS n FROM items").get().n;
if (jumlah === 0) {
  const insert = db.prepare("INSERT INTO items (nama, harga, sisa) VALUES (?, ?, ?)");
  insert.run("Ayam Geprek Kantin Pusat", 15000, 50);
  insert.run("Es Teh Jumbo Teknik", 5000, 100);
}

app.get("/items", (_req, res) => res.json(db.prepare("SELECT * FROM items").all()));

app.get("/items/:id", (req, res) => {
  const item = db.prepare("SELECT * FROM items WHERE id = ?").get(Number(req.params.id));
  if (!item) return res.status(404).json({ error: "item tidak ditemukan" });
  res.json(item);
});

// Endpoint atomik untuk mengurangi sisa kuota jastip (Langkah 5)
app.post("/items/:id/ambil", (req, res) => {
  const id = Number(req.params.id);
  const hasil = db
    .prepare("UPDATE items SET sisa = sisa - 1 WHERE id = ? AND sisa > 0")
    .run(id);
  
  if (hasil.changes === 0) {
    return res.status(409).json({ error: "habis" });
  }
  
  const item = db.prepare("SELECT * FROM items WHERE id = ?").get(id);
  res.json({ ok: true, sisa: item.sisa });
});

app.get("/health", (_req, res) => res.json({ status: "ok", service: "catalog" }));

app.listen(3001, () => console.log("catalog berjalan di :3001"));