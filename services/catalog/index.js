const express = require("express");
const os = require("os");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/*
 * Helper format error
 */
function galat(code, message) {
  return {
    error: {
      code,
      message,
    },
  };
}

/*
 * HEALTH CHECK
 */
app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "OK",
      instance: os.hostname(),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: "ERROR",
      instance: os.hostname(),
    });
  }
});

/*
 * GET CATALOG
 * Pagination:
 * /catalog?page=1&limit=20
 */
app.get("/catalog", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);

    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 20),
    );

    const offset = (page - 1) * limit;

    const { rows } = await pool.query(
      `
      SELECT id, nama, harga, sisa
      FROM items
      ORDER BY id
      LIMIT $1 OFFSET $2
      `,
      [limit, offset],
    );

    const totalResult = await pool.query(
      "SELECT COUNT(*)::int AS n FROM items",
    );

    const total = totalResult.rows[0].n;

    res.json({
      data: rows,
      page,
      limit,
      total,
      instance: os.hostname(),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json(
      galat(
        "DATABASE_ERROR",
        "Gagal mengambil data catalog",
      ),
    );
  }
});

/*
 * RESERVE ITEM
 *
 * POLA ATOMIK:
 *
 * UPDATE items
 * SET sisa = sisa - qty
 * WHERE id = itemId
 *   AND sisa >= qty
 * RETURNING ...
 *
 * Tidak ada lagi pola:
 *
 * SELECT sisa
 * -> cek di JavaScript
 * -> UPDATE
 *
 * Database langsung melakukan pengecekan
 * dan pengurangan dalam satu operasi.
 */
app.post("/items/:id/reserve", async (req, res) => {
  const itemId = Number(req.params.id);
  const qty = Number(req.body.qty);

  /*
   * Validasi input
   */
  if (!Number.isInteger(itemId) || itemId <= 0) {
    return res.status(400).json(
      galat(
        "INVALID_ITEM_ID",
        "ID item tidak valid",
      ),
    );
  }

  if (!Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json(
      galat(
        "INVALID_QTY",
        "qty harus berupa bilangan bulat lebih dari 0",
      ),
    );
  }

  try {
    /*
     * Operasi atomik.
     *
     * Jika sisa >= qty:
     *   baris di-update
     *
     * Jika sisa < qty:
     *   tidak ada baris yang cocok
     */
    const { rows } = await pool.query(
      `
      UPDATE items
      SET sisa = sisa - $1
      WHERE id = $2
        AND sisa >= $1
      RETURNING id, nama, harga, sisa
      `,
      [qty, itemId],
    );

    /*
     * Tidak ada baris yang berhasil di-update.
     *
     * Bisa berarti:
     * - item tidak ditemukan
     * - stok tidak cukup
     */
    if (rows.length === 0) {
      const itemResult = await pool.query(
        "SELECT id FROM items WHERE id = $1",
        [itemId],
      );

      if (itemResult.rows.length === 0) {
        return res.status(404).json(
          galat(
            "ITEM_NOT_FOUND",
            "Item tidak ditemukan",
          ),
        );
      }

      return res.status(409).json(
        galat(
          "STOK_HABIS",
          "Sumber daya habis, pesanan ditolak",
        ),
      );
    }

    const item = rows[0];
    const total = Number(item.harga) * qty;

    return res.status(201).json({
      ok: true,
      item: item.nama,
      qty,
      total,
      sisa: item.sisa,
      instance: os.hostname(),
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json(
      galat(
        "DATABASE_ERROR",
        "Pesanan gagal, coba lagi",
      ),
    );
  }
});

/*
 * START SERVER
 */
app.listen(PORT, () => {
  console.log(
    `Catalog service berjalan di port ${PORT}, instance ${os.hostname()}`,
  );
});