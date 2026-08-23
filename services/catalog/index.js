const express = require("express");
const { Pool } = require("pg");
const os = require("os");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
const PORT = process.env.PORT || 3000;
const INSTANCE = os.hostname();

app.use(express.json());

/*
 * =========================
 * HELPER ERROR
 * =========================
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
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "OK",
      instance: INSTANCE,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json(
      galat(
        "DATABASE_ERROR",
        "Database tidak dapat diakses",
      ),
    );
  }
});

/*
 * =========================
 * GET CATALOG
 * PAGINATION KONSISTEN
 * =========================
 */
app.get("/catalog", async (req, res) => {
  try {
    const page = Math.max(
      1,
      parseInt(req.query.page, 10) || 1,
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        parseInt(req.query.limit, 10) || 20,
      ),
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
      instance: INSTANCE,
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
 * =========================
 * RESERVE ITEM
 * ATOMIC + IDEMPOTENCY
 * =========================
 */
app.post("/items/:id/reserve", async (req, res) => {
  const itemId = Number(req.params.id);
  const qty = Number(req.body.qty);
  const key = req.header("Idempotency-Key");

  /*
   * Validasi item ID
   */
  if (!Number.isInteger(itemId) || itemId <= 0) {
    return res.status(400).json(
      galat(
        "INVALID_ITEM_ID",
        "ID item tidak valid",
      ),
    );
  }

  /*
   * Validasi quantity
   */
  if (!Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json(
      galat(
        "INVALID_QTY",
        "qty harus berupa bilangan bulat lebih dari 0",
      ),
    );
  }

  /*
   * Validasi Idempotency-Key
   *
   * Untuk POST reservation,
   * key diwajibkan agar aman terhadap retry.
   */
  if (!key || key.trim() === "") {
    return res.status(400).json(
      galat(
        "IDEMPOTENCY_KEY_REQUIRED",
        "Header Idempotency-Key wajib diisi",
      ),
    );
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /*
     * 1. Cek apakah request dengan key
     *    yang sama sudah pernah diproses.
     */
    const existing = await client.query(
      `
      SELECT respons
      FROM idempotency
      WHERE key = $1
      FOR UPDATE
      `,
      [key],
    );

    if (existing.rows.length > 0) {
      await client.query("COMMIT");

      /*
       * Kembalikan response lama.
       * Stok TIDAK dikurangi lagi.
       */
      return res.status(201).json(
        existing.rows[0].respons,
      );
    }

    /*
     * 2. Atomic reservation.
     *
     * Syarat sisa >= qty berada
     * langsung di WHERE.
     */
    const result = await client.query(
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
     * Item tidak ditemukan atau
     * stok tidak mencukupi.
     */
    if (result.rows.length === 0) {
      const itemResult = await client.query(
        `
        SELECT id
        FROM items
        WHERE id = $1
        `,
        [itemId],
      );

      await client.query("ROLLBACK");

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

    const item = result.rows[0];

    const total = item.harga * qty;

    /*
     * Response pesanan.
     */
    const order = {
      ok: true,
      item: item.nama,
      qty,
      total,
      sisa: item.sisa,
    };

    /*
     * 3. Simpan response berdasarkan
     *    Idempotency-Key.
     */
    await client.query(
      `
      INSERT INTO idempotency (key, respons)
      VALUES ($1, $2)
      `,
      [key, JSON.stringify(order)],
    );

    /*
     * 4. Commit seluruh perubahan.
     */
    await client.query("COMMIT");

    return res.status(201).json(order);
  } catch (err) {
    await client.query("ROLLBACK");

    /*
     * Duplicate key dapat terjadi ketika
     * dua request dengan Idempotency-Key
     * yang sama datang hampir bersamaan.
     */
    if (err.code === "23505") {
      try {
        const retry = await pool.query(
          `
          SELECT respons
          FROM idempotency
          WHERE key = $1
          `,
          [key],
        );

        if (retry.rows.length > 0) {
          return res.status(201).json(
            retry.rows[0].respons,
          );
        }
      } catch (retryError) {
        console.error(retryError);
      }
    }

    console.error(err);

    return res.status(500).json(
      galat(
        "DATABASE_ERROR",
        "Pesanan gagal diproses, coba lagi",
      ),
    );
  } finally {
    client.release();
  }
});

/*
 * =========================
 * SERVER
 * =========================
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Catalog service berjalan di port ${PORT}, instance ${INSTANCE}`,
  );
});