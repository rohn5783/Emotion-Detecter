import Redis from "ioredis";

const redisConfig = process.env.REDIS_URL
  ? process.env.REDIS_URL
  : process.env.REDIS_HOST
    ? {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      }
    : null;

let redis;

if (redisConfig) {
  redis = new Redis(redisConfig);

  redis.on("connect", () => {
    console.log("Redis is connected");
  });

  redis.on("error", (err) => {
    console.log("Redis error", err);
  });
} else {
  const memoryStore = new Map();

  redis = {
    async get(key) {
      return memoryStore.get(key) ?? null;
    },
    async set(key, value) {
      memoryStore.set(key, value);
      return "OK";
    },
  };

  console.log("Redis is disabled. Falling back to in-memory cache.");
}

export default redis;
