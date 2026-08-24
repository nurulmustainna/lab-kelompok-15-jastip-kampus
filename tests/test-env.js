const { after, before } = require("node:test");

const state = {
  baseUrl: process.env.BASE || null,
  catalogUrl: process.env.CATALOG_BASE || null,
  cleanup: async () => {},
};

function pickPorts() {
  const catalogPort = 3300 + Math.floor(Math.random() * 1000) * 2;
  return { catalogPort, orderPort: catalogPort + 1 };
}

if (!state.baseUrl) {
  before(async () => {
    const { startQaStack } = await import("../scripts/lib/qa-harness.mjs");
    const stack = await startQaStack(pickPorts());
    state.baseUrl = stack.baseUrl;
    state.catalogUrl = stack.catalogUrl;
    state.cleanup = stack.cleanup;
  });

  after(async () => {
    await state.cleanup();
  });
}

function getBaseUrl() {
  if (!state.baseUrl) {
    throw new Error("BASE belum tersedia");
  }

  return state.baseUrl;
}

function getCatalogUrl() {
  if (!state.catalogUrl) {
    throw new Error("CATALOG_BASE wajib diisi saat tidak memakai stack QA lokal");
  }

  return state.catalogUrl;
}

module.exports = {
  getBaseUrl,
  getCatalogUrl,
};