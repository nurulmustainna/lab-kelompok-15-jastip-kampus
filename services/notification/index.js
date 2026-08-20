const { createClient } = require("redis");
const sub = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });

(async () => {
  await sub.connect();
  await sub.subscribe("order.created", (msg) => {
    const order = JSON.parse(msg);
    console.log(`🔔 Notifikasi: pesanan #${order.id} (${order.item}) diterima!`);
  });
  console.log("notification menunggu event...");
})();