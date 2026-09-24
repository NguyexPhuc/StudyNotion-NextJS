import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

let connecting: Promise<typeof redisClient> | null = null;

export async function getRedisClient() {
  if (redisClient.isOpen) {
    return redisClient;
  }

  if (!connecting) {
    connecting = redisClient.connect().finally(() => {
      connecting = null;
    });
  }

  await connecting;
  return redisClient;
}

export default redisClient;
