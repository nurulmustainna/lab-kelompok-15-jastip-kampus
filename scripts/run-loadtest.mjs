import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import { startQaStack } from "./lib/qa-harness.mjs";

const repoRoot = "/workspaces/lab-kelompok-15-jastip-kampus";
const artifactDir = join(repoRoot, "artifacts", "loadtest");
const totalRequests = Number(process.env.LOADTEST_REQUESTS || 200);
const concurrency = Number(process.env.LOADTEST_CONCURRENCY || 40);

function percentile(sortedValues, p) {
  if (sortedValues.length === 0) {
    return 0;
  }

  const index = Math.min(sortedValues.length - 1, Math.ceil((p / 100) * sortedValues.length) - 1);
  return sortedValues[index];
}

async function sendOrder(baseUrl) {
  const start = performance.now();
  const response = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ itemId: 1, qty: 1 }),
  });
  const durationMs = performance.now() - start;

  return {
    status: response.status,
    durationMs,
  };
}

async function main() {
  const stack = await startQaStack();

  try {
    const before = await fetch(`${stack.catalogUrl}/items/1`).then((response) => response.json());
    let issued = 0;
    const results = [];

    const startedAt = performance.now();
    const workers = Array.from({ length: concurrency }, async () => {
      while (issued < totalRequests) {
        const current = issued;
        issued += 1;
        if (current >= totalRequests) {
          return;
        }

        results.push(await sendOrder(stack.baseUrl));
      }
    });

    await Promise.all(workers);
    const totalDurationMs = performance.now() - startedAt;

    const after = await fetch(`${stack.catalogUrl}/items/1`).then((response) => response.json());

    const latencies = results.map((result) => Number(result.durationMs.toFixed(2))).sort((left, right) => left - right);
    const byStatus = Object.fromEntries(
      results.reduce((map, result) => {
        map.set(String(result.status), (map.get(String(result.status)) || 0) + 1);
        return map;
      }, new Map())
    );

    const successCount = byStatus["201"] || 0;
    const conflictCount = byStatus["409"] || 0;

    const report = {
      timestamp: new Date().toISOString(),
      scenario: {
        totalRequests,
        concurrency,
        initialStock: before.sisa,
      },
      outcomes: byStatus,
      assertions: {
        successEqualsStockConsumed: successCount === before.sisa - after.sisa,
        stockNeverNegative: after.sisa >= 0,
        onlyExpectedStatuses: Object.keys(byStatus).every((status) => ["201", "409"].includes(status)),
      },
      metrics: {
        totalDurationMs: Number(totalDurationMs.toFixed(2)),
        throughputRps: Number((results.length / (totalDurationMs / 1000)).toFixed(2)),
        latencyMs: {
          min: latencies[0] || 0,
          p50: percentile(latencies, 50),
          p95: percentile(latencies, 95),
          p99: percentile(latencies, 99),
          max: latencies[latencies.length - 1] || 0,
        },
      },
      stock: {
        before: before.sisa,
        after: after.sisa,
        consumed: before.sisa - after.sisa,
      },
      notes: {
        expectedSuccesses: before.sisa,
        expectedConflicts: Math.max(0, totalRequests - before.sisa),
        successCount,
        conflictCount,
      },
    };

    await mkdir(artifactDir, { recursive: true });
    await writeFile(join(artifactDir, "latest.json"), `${JSON.stringify(report, null, 2)}\n`);

    console.log(JSON.stringify(report, null, 2));
  } finally {
    await stack.cleanup();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});