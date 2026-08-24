const { test } = require("node:test");
const assert = require("node:assert/strict");
const { getBaseUrl, getCatalogUrl } = require("./test-env.js");

const PENYERBU = Number(process.env.PENYERBU || 200);

async function pesan() {
  const res = await fetch(`${getBaseUrl()}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId: 1, qty: 1 }),
  });

  return res.status;
}

test(`stok item 1 diserbu ${PENYERBU} request tanpa oversell`, async () => {
  const before = await fetch(`${getCatalogUrl()}/items/1`).then((res) => res.json());
  const status = await Promise.all(Array.from({ length: PENYERBU }, pesan));
  const after = await fetch(`${getCatalogUrl()}/items/1`).then((res) => res.json());

  const sukses = status.filter((code) => code === 201).length;
  const ditolak = status.filter((code) => code === 409).length;

  console.log(`stokAwal=${before.sisa} sukses=${sukses} ditolak=${ditolak} sisa=${after.sisa}`);

  assert.ok(after.sisa >= 0, `sisa minus (${after.sisa}) = OVERSELL`);
  assert.ok(sukses <= before.sisa, `terjual ${sukses} > stok ${before.sisa} = OVERSELL`);
  assert.equal(sukses, before.sisa - after.sisa, "jumlah sukses harus sama dengan stok terpakai");
  assert.equal(sukses + ditolak, PENYERBU, "tiap request harus berakhir 201 atau 409");
});