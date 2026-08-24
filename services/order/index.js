const express = require("express");
const { createClient } = require("redis"); // 1. Tambah library Redis

const app = express();
app.use(express.json());

const CATALOG_URL = process.env.CATALOG_URL || "http://localhost:3001";
const PORT = Number(process.env.PORT || 3002);
const ENABLE_EVENTS = process.env.ENABLE_EVENTS !== "0";

// 2. Inisialisasi Publisher Redis
const pub = ENABLE_EVENTS
  ? createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" })
  : null;

if (pub) {
  pub.on("error", (error) => {
    const detail = error.message || error.code || "unknown redis error";
    console.error("redis publisher error:", detail);
  });

  pub.connect().catch((error) => {
    const detail = error.message || error.code || "redis unavailable";
    console.error("redis publisher unavailable:", detail);
  });
}

async function publishOrderCreated(order) {
  if (!pub || !pub.isReady) {
    return false;
  }

  try {
    await pub.publish("order.created", JSON.stringify(order));
    return true;
  } catch (error) {
    console.error("gagal publish order.created:", error.message);
    return false;
  }
}

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

  // Event tetap dicoba, tetapi kegagalannya tidak boleh membatalkan order yang sudah sah.
  await publishOrderCreated(order);

  res.status(201).json(order);
});

app.get("/health", (_req, res) => res.json({ status: "ok", service: "order" }));

app.listen(PORT, () => console.log(`order berjalan di :${PORT}`));