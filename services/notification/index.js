const { createClient } = require("redis");

const sub = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });

sub.on("error", (error) => {
  const detail = error.message || error.code || "unknown redis error";
  console.error("notification redis error:", detail);
});

(async () => {
  await sub.connect();
  await sub.subscribe("order.created", (msg) => {
    try {
      const order = JSON.parse(msg);
      console.log(`Notifikasi: pesanan #${order.id} (${order.item}) diterima!`);
    } catch (error) {
      const detail = error.message || "invalid JSON payload";
      console.error("notification parse error:", detail);
    }
  });
  console.log("notification menunggu event...");
})();