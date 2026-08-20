const express = require("express");
const { createClient } = require("redis"); // 1. Tambah library Redis

const app = express();
app.use(express.json());

const CATALOG_URL = process.env.CATALOG_URL || "http://localhost:3001";

// 2. Inisialisasi Publisher Redis
const pub = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
pub.connect().catch(console.error);

app.post("/orders", async (req, res) => {
  const { itemId, qty } = req.body;
  if (!Number.isInteger(itemId) || !Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ error: "itemId dan qty wajib angka, qty minimal 1" });
  }

  // 1. Tanya harga ke catalog
  let item;
  try {
    const r = await fetch(`${CATALOG_URL}/items/${itemId}`);
    if (r.status === 404) return res.status(404).json({ error: "item tidak ada" });
    if (!r.ok) return res.status(502).json({ error: "catalog bermasalah" });
    item = await r.json();
  } catch {
    return res.status(502).json({ error: "catalog tidak tersedia" });
  }

  // 2. Pesan 1 unit sumber daya rebutan (kuota jastip)
  const ambil = await fetch(`${CATALOG_URL}/items/${itemId}/ambil`, { method: "POST" });
  if (ambil.status === 409) {
    return res.status(409).json({ error: "stok habis, pesanan ditolak" });
  }
  if (!ambil.ok) return res.status(502).json({ error: "gagal memesan stok" });

  const order = { id: Date.now(), item: item.nama, qty, total: item.harga * qty };

  // 3. Terbitkan event order.created ke Redis secara asinkron
  await pub.publish("order.created", JSON.stringify(order));

  res.status(201).json(order);
});

app.get("/health", (_req, res) => res.json({ status: "ok", service: "order" }));

app.listen(3002, () => console.log("order berjalan di :3002"));