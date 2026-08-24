const { test } = require("node:test");
const assert = require("node:assert/strict");
const { getBaseUrl } = require("./test-env.js");

test("GET /health membalas 200", async () => {
  const res = await fetch(`${getBaseUrl()}/health`);
  assert.equal(res.status, 200);
});

test("POST /orders yang sah membalas 201", async () => {
  const res = await fetch(`${getBaseUrl()}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId: 1, qty: 1 }),
  });

  assert.equal(res.status, 201);
});

test("POST /orders tanpa qty membalas 400", async () => {
  const res = await fetch(`${getBaseUrl()}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId: 1 }),
  });

  assert.equal(res.status, 400);
});

test("POST /orders untuk item yang tidak ada membalas 404", async () => {
  const res = await fetch(`${getBaseUrl()}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId: 9999, qty: 1 }),
  });

  assert.equal(res.status, 404);
});