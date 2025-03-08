import { Request, Response } from "express"; // Importing Express types for request and response handling
import redisClient from "../../redis/redis"; // Importing Redis client instance
import supabase from "../../models/supabase"; // Importing Supabase client instance
import { getFromCache, saveToCache } from "../../utils/cacheHelper"; // Importing caching helper functions

// Function to fetch books from cache or database
export const getBooks = async (req: Request, res: Response) => {
  try {
    const cacheKey = "books"; // Defining the cache key for storing book data

    // ✅ Try getting data from cache
    const cachedData = await getFromCache(cacheKey); // Attempt to retrieve data from Redis cache
    if (cachedData) { // If cached data exists
      console.log("cache hit"); // Log that cache is used
      res.json(cachedData); // Send the cached data as response
      return; // Stop further execution to prevent duplicate responses
    }

    console.log("cache miss"); // Log that cache did not have data

    // ✅ Fetch data from Supabase
    const { data: bookList, error } = await supabase
      .from("book-list") // Specify the table name
      .select("*"); // Select all columns from the table

    if (error) { // If there is an error in fetching data
      res.status(500).json({ message: "Error fetching data from Supabase", error }); // Return an error response
      return; // Stop further execution
    }

    // ✅ Store in cache for 5 seconds
    await saveToCache(cacheKey, bookList, 5); // Save the fetched data to Redis cache with a 5-second expiration

    // ✅ Send response
    res.status(200).json({
      type: "success", // Indicating successful operation
      data: bookList, // Sending the fetched book list as response
    });

  } catch (error) { // Catch any unexpected errors
    console.error("Server error:", error); // Log the error
    res.status(500).json({ // Send an internal server error response
      message: "Internal server error",
    });
  }
};
