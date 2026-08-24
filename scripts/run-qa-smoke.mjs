import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { startQaStack } from "./lib/qa-harness.mjs";

const repoRoot = "/workspaces/lab-kelompok-15-jastip-kampus";
const artifactDir = join(repoRoot, "artifacts", "qa");

async function main() {
  const stack = await startQaStack();

  try {
    const health = await fetch(`${stack.baseUrl}/health`);
    assert.equal(health.status, 200, "health order harus 200");

    const invalidOrder = await fetch(`${stack.baseUrl}/orders`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ itemId: 1, qty: 0 }),
    });
    assert.equal(invalidOrder.status, 400, "qty 0 harus ditolak");

    const stockBefore = await fetch(`${stack.catalogUrl}/items/1`).then((response) => response.json());

    const successOrder = await fetch(`${stack.baseUrl}/orders`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ itemId: 1, qty: 1 }),
    });
    assert.equal(successOrder.status, 201, "order valid harus berhasil");

    const stockAfter = await fetch(`${stack.catalogUrl}/items/1`).then((response) => response.json());
    assert.equal(stockAfter.sisa, stockBefore.sisa - 1, "stok harus berkurang 1");

    const result = {
      timestamp: new Date().toISOString(),
      checks: [
        { name: "GET /health", status: "passed" },
        { name: "POST /orders invalid qty", status: "passed" },
        { name: "POST /orders decrements stock", status: "passed" },
      ],
      stockBefore: stockBefore.sisa,
      stockAfter: stockAfter.sisa,
    };

    await mkdir(artifactDir, { recursive: true });
    await writeFile(join(artifactDir, "smoke-result.json"), `${JSON.stringify(result, null, 2)}\n`);

    console.log(JSON.stringify(result, null, 2));
  } finally {
    await stack.cleanup();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});