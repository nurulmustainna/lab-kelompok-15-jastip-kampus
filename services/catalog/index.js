const express = require("express");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "OK" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "ERROR" });
  }
});

app.get("/catalog", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 20),
    );
    const offset = (page - 1) * limit;

    const { rows } = await pool.query(
      "SELECT id, nama, harga, sisa FROM items ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset],
    );

    const total = (
      await pool.query("SELECT COUNT(*)::int AS n FROM items")
    ).rows[0].n;

    res.json({
      data: rows,
      page,
      limit,
      total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: {
        code: "DATABASE_ERROR",
        message: "Gagal mengambil data catalog",
      },
    });
  }
});

app.listen(PORT, () => {
  console.log(`Catalog service berjalan di port ${PORT}`);
});
