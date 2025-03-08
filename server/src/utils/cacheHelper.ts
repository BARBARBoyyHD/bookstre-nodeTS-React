import redisClient from "../redis/redis"; // Import Redis client instance from the Redis configuration file

// Function to retrieve data from Redis cache
export const getFromCache = async (key: string) => {
  if (!redisClient.isReady) return null; // Check if Redis is ready; if not, return null
  const cachedData = await redisClient.get(key); // Attempt to get cached data using the provided key
  return cachedData ? JSON.parse(cachedData) : null; // Parse and return JSON data if found; otherwise, return null
};

// Function to store data in Redis cache with an expiration time
export const saveToCache = async (
  key: string, // The cache key used to store the data
  data: any, // The actual data to be stored in the cache
  duration: number = 10 // Expiration time in seconds (default: 10 seconds)
) => {
  if (redisClient.isReady) { // Check if Redis is ready before attempting to save
    await redisClient.setEx(key, duration, JSON.stringify(data)); // Store data as a JSON string with an expiration time
  }
};

// Function to remove a specific key from Redis cache
export const clearCache = async (key: string) => {
  if (redisClient.isReady) { // Check if Redis is ready before attempting to delete
    await redisClient.del(key); // Delete the cached data associated with the given key
  }
};
