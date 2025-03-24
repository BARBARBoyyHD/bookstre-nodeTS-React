import redisClient from "../redis/redis"; // Import Redis client instance from the Redis configuration file

// Function to retrieve data from Redis cache
export const getFromCache = async (key: string) => {
  if (!redisClient.isReady) return null; // Check if Redis is ready; if not, return null
  const cachedData = await redisClient.get(key); // Attempt to get cached data using the provided key
  return cachedData ? JSON.parse(cachedData) : null; // Parse and return JSON data if found; otherwise, return null
};

// Function to store data in Redis cache with an expiration time
export const saveToCache = async (
  key: string,
  value: any,
  ttl: number = 10
) => {
  try {
    if (!redisClient.isReady) {
      console.warn("⚠️ Redis is not ready.");
      return;
    }
    await redisClient.set(key, JSON.stringify(value), { EX: ttl });
    console.log(`✅ Cached: ${key} for ${ttl} seconds`);
  } catch (error) {
    console.error("❌ Error saving to Redis:", error);
  }
};

// Function to remove a specific key from Redis cache
export const clearCache = async (key: string) => {
  try {
    if (!redisClient.isReady) {
      console.warn(
        `Redis is not ready, skipping cache deletion for key: ${key}`
      );
      return;
    }

    const result = await redisClient.del(key); // Delete the cache
    if (result) {
      console.log(`Cache cleared for key: ${key}`);
    } else {
      console.warn(`No cache found for key: ${key}`);
    }
  } catch (error) {
    console.error(`Error clearing cache for key: ${key}`, error);
  }
};
