import dotenv from "dotenv";
dotenv.config();

import { createClient, RedisClientType } from "redis";

const redisClient: RedisClientType = createClient({
  password: process.env.REDIS_PASSWORD, // Only needed if Redis requires auth
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT), // Ensure it's a number
  },
});

// Async function to connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis is connected");
  } catch (error) {
    console.error("Redis connection error:", error);
  }
};
const listAllKeys = async () => {
  try {
    if (!redisClient.isReady) {
      console.warn("⚠️ Redis is not ready.");
      return;
    }
    const keys = await redisClient.keys("*");
    console.log("🗝️ Stored Keys in Redis:", keys.length > 0 ? keys : "No keys found.");
  } catch (error) {
    console.error("❌ Error fetching Redis keys:", error);
  }
};

// Call this function after connecting to Redis
connectRedis().then(() => listAllKeys());



export default redisClient;
