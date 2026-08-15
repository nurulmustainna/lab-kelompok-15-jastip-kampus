const express = require("express");
const app = express();
app.use(express.json());

// Data katalog Jastip Kampus (In-Memory)
const items = [
  { id: 1, nama: "Ayam Geprek Kantin Pusat", harga: 15000, sisa: 50 },
  { id: 2, nama: "Es Teh Jumbo Teknik", harga: 5000, sisa: 100 },
];

app.get("/items", (_req, res) => res.json(items));

app.get("/items/:id", (req, res) => {
  const item = items.find((x) => x.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "item tidak ditemukan" });
  res.json(item);
});

app.get("/health", (_req, res) => res.json({ status: "ok", service: "catalog" }));

app.listen(3001, () => console.log("catalog berjalan di :3001"));