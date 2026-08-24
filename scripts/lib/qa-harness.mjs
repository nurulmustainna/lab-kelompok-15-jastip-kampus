import { mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

const repoRoot = "/workspaces/lab-kelompok-15-jastip-kampus";

function createLogger(prefix) {
  return (chunk) => {
    const text = chunk.toString().trim();
    if (text) {
      process.stderr.write(`[${prefix}] ${text}\n`);
    }
  };
}

async function waitForHealth(url, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Tunggu proses benar-benar siap.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`timeout menunggu health check ${url}`);
}

function spawnService(command, args, options) {
  const child = spawn(command, args, {
    cwd: options.cwd,
    env: options.env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", createLogger(options.name));
  child.stderr.on("data", createLogger(options.name));

  return child;
}

export async function startQaStack({ catalogPort = 3101, orderPort = 3102 } = {}) {
  const tempRoot = join(tmpdir(), `jastip-qa-${Date.now()}`);
  await mkdir(tempRoot, { recursive: true });

  const catalogDbPath = join(tempRoot, "catalog.db");
  const catalog = spawnService("node", ["index.js"], {
    name: "catalog",
    cwd: join(repoRoot, "services/catalog"),
    env: {
      ...process.env,
      PORT: String(catalogPort),
      CATALOG_DB_PATH: catalogDbPath,
    },
  });

  await waitForHealth(`http://127.0.0.1:${catalogPort}/health`);

  const order = spawnService("node", ["index.js"], {
    name: "order",
    cwd: join(repoRoot, "services/order"),
    env: {
      ...process.env,
      PORT: String(orderPort),
      CATALOG_URL: `http://127.0.0.1:${catalogPort}`,
      ENABLE_EVENTS: "0",
    },
  });

  await waitForHealth(`http://127.0.0.1:${orderPort}/health`);

  const cleanup = async () => {
    order.kill("SIGTERM");
    catalog.kill("SIGTERM");
    await rm(tempRoot, { recursive: true, force: true });
  };

  return {
    baseUrl: `http://127.0.0.1:${orderPort}`,
    catalogUrl: `http://127.0.0.1:${catalogPort}`,
    cleanup,
    tempRoot,
  };
}